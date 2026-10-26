'use client'

import { useEffect, useMemo, useState } from 'react';
import { Alert, Button, Modal, Progress, Select, Space, Table, Tag, Typography, Upload, message } from 'antd';
import { FileExcelOutlined, FilePdfOutlined, FolderOpenOutlined, InboxOutlined } from '@ant-design/icons';
import * as XLSX from 'xlsx';
import { uploadGradedFile, MAX_GRADED_FILE_SIZE } from '@/utils/gradedFileUpload';

const { Text } = Typography;

// Học sinh trong buổi học (rút gọn từ StudentPerformance của màn chấm bài)
export interface ImportTargetStudent {
    id: number;
    fullName: string;
    school?: string;
    hasPerformance: boolean;
    hasGradedFile: boolean;
}

// Một dòng kết quả đọc từ file Excel "Nhận xét BTVN"
interface ExcelResultRow {
    name: string;
    doneTask: number;
    totalTasks: number | null;
    totalScore: number;
    incorrectTasks: string;
    missingTasks: string;
    presentation: string;
    skills: string;
    comment: string;
}

// Một mục cần nhập: gom dòng Excel và file PDF có cùng tên học sinh
interface ImportItem {
    key: string;
    name: string;
    row?: ExcelResultRow;
    pdf?: File;
    studentId: number | null;
}

interface ImportFailure {
    name: string;
    reason: string;
}

interface Props {
    open: boolean;
    onClose: () => void;
    classId: number;
    lessonId: number;
    token: string | null | undefined;
    students: ImportTargetStudent[];
    totalTaskLength: number;
    onImported: () => void | Promise<void>;
}

const IMPORT_CONCURRENCY = 3;

// Chuẩn hoá tên để so khớp: tên file trên Windows/macOS có thể ở dạng Unicode NFD
const normalizeName = (s: string) => s.normalize('NFC').toLowerCase().replace(/\s+/g, ' ').trim();
const stripDiacritics = (s: string) =>
    normalizeName(s).normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd');

// "11,25/15" -> [11.25, 15]; "15" -> [15, null]
const parseFraction = (value: unknown): [number, number | null] => {
    if (typeof value === 'number') return [value, null];
    const [left, right] = String(value ?? '').split('/');
    const toNum = (s?: string) => {
        const n = parseFloat((s ?? '').trim().replace(',', '.'));
        return Number.isFinite(n) ? n : null;
    };
    return [toNum(left) ?? 0, toNum(right)];
};

// "1, 3, 10E" -> "1; 3; 10E" (cùng định dạng với màn chấm bài)
const toTaskList = (value: unknown) =>
    String(value ?? '')
        .split(/[,;]/)
        .map(t => t.trim())
        .filter(Boolean)
        .join('; ');

// Tìm cột theo tiêu đề (không phụ thuộc thứ tự cột)
const HEADER_MATCHERS: Record<keyof ExcelResultRow, (h: string) => boolean> = {
    name: h => h.includes('họ và tên') || h === 'họ tên' || h === 'tên',
    doneTask: h => h.includes('đã làm'),
    totalTasks: () => false,
    totalScore: h => h.includes('làm đúng'),
    incorrectTasks: h => h.includes('bài sai'),
    missingTasks: h => h.includes('bài thiếu'),
    presentation: h => h.includes('trình bày'),
    skills: h => h.includes('kĩ năng') || h.includes('kỹ năng'),
    comment: h => h.includes('nhận xét'),
};

const parseResultWorkbook = async (file: File): Promise<ExcelResultRow[]> => {
    const wb = XLSX.read(await file.arrayBuffer(), { type: 'array' });
    const ws = wb.Sheets[wb.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json<unknown[]>(ws, { header: 1, defval: '' });

    const headerIndex = rows.findIndex(r => r.some(c => HEADER_MATCHERS.name(normalizeName(String(c)))));
    if (headerIndex === -1) throw new Error('Không tìm thấy cột "Họ và tên" trong file Excel.');

    const headers = rows[headerIndex].map(c => normalizeName(String(c)));
    const col = (field: keyof ExcelResultRow) => headers.findIndex(h => HEADER_MATCHERS[field](h));
    const idx = {
        name: col('name'), doneTask: col('doneTask'), totalScore: col('totalScore'),
        incorrectTasks: col('incorrectTasks'), missingTasks: col('missingTasks'),
        presentation: col('presentation'), skills: col('skills'), comment: col('comment'),
    };
    const cell = (r: unknown[], i: number) => (i >= 0 ? r[i] : '');

    return rows.slice(headerIndex + 1)
        .filter(r => String(cell(r, idx.name)).trim() !== '')
        .map(r => {
            const [doneTask, totalTasks] = parseFraction(cell(r, idx.doneTask));
            const [totalScore] = parseFraction(cell(r, idx.totalScore));
            return {
                name: String(cell(r, idx.name)).trim(),
                doneTask,
                totalTasks,
                totalScore,
                incorrectTasks: toTaskList(cell(r, idx.incorrectTasks)),
                missingTasks: toTaskList(cell(r, idx.missingTasks)),
                presentation: String(cell(r, idx.presentation)).trim(),
                skills: String(cell(r, idx.skills)).trim(),
                comment: String(cell(r, idx.comment)).trim(),
            };
        });
};

// Chạy các tác vụ với số luồng giới hạn để không dồn quá nhiều request lên server/Cloudinary
const runWithConcurrency = async <T,>(items: T[], limit: number, worker: (item: T) => Promise<void>) => {
    let cursor = 0;
    const runners = Array.from({ length: Math.min(limit, items.length) }, async () => {
        while (cursor < items.length) {
            const item = items[cursor++];
            await worker(item);
        }
    });
    await Promise.all(runners);
};

const BulkResultImport = ({ open, onClose, classId, lessonId, token, students, totalTaskLength, onImported }: Props) => {
    const [excelFile, setExcelFile] = useState<File | null>(null);
    const [excelRows, setExcelRows] = useState<ExcelResultRow[]>([]);
    const [excelError, setExcelError] = useState<string | null>(null);
    const [pdfFiles, setPdfFiles] = useState<File[]>([]);
    // studentId do trợ giảng chọn tay, ghi đè kết quả tự khớp theo tên
    const [manualAssign, setManualAssign] = useState<Record<string, number | null>>({});
    const [importing, setImporting] = useState(false);
    const [progress, setProgress] = useState({ done: 0, total: 0 });
    const [failures, setFailures] = useState<ImportFailure[]>([]);
    const [finished, setFinished] = useState(false);

    const reset = () => {
        setExcelFile(null);
        setExcelRows([]);
        setExcelError(null);
        setPdfFiles([]);
        setManualAssign({});
        setProgress({ done: 0, total: 0 });
        setFailures([]);
        setFinished(false);
    };

    useEffect(() => {
        if (!open) reset();
    }, [open]);

    useEffect(() => {
        if (!excelFile) {
            setExcelRows([]);
            setExcelError(null);
            return;
        }
        parseResultWorkbook(excelFile)
            .then(rows => { setExcelRows(rows); setExcelError(null); })
            .catch((err: any) => { setExcelRows([]); setExcelError(err.message || 'Không đọc được file Excel.'); });
    }, [excelFile]);

    // Nhận file (chọn nhiều file, chọn thư mục hoặc kéo thả): phân loại PDF / Excel
    const handleAddFile = (file: File) => {
        if (/\.pdf$/i.test(file.name)) {
            setPdfFiles(prev => [...prev.filter(f => f.name !== file.name), file]);
        } else if (/\.xlsx?$/i.test(file.name) && !file.name.startsWith('~$')) {
            setExcelFile(file);
        }
        return Upload.LIST_IGNORE;
    };

    // Tự khớp tên -> học sinh: ưu tiên khớp đúng dấu, sau đó khớp bỏ dấu; trùng tên thì để trợ giảng tự chọn
    const autoMatch = useMemo(() => {
        const exact = new Map<string, number[]>();
        const loose = new Map<string, number[]>();
        students.forEach(s => {
            const e = normalizeName(s.fullName);
            const l = stripDiacritics(s.fullName);
            exact.set(e, [...(exact.get(e) || []), s.id]);
            loose.set(l, [...(loose.get(l) || []), s.id]);
        });
        return (name: string): number | null => {
            const e = exact.get(normalizeName(name));
            if (e) return e.length === 1 ? e[0] : null;
            const l = loose.get(stripDiacritics(name));
            return l && l.length === 1 ? l[0] : null;
        };
    }, [students]);

    const items: ImportItem[] = useMemo(() => {
        const byKey = new Map<string, ImportItem>();
        const getItem = (name: string) => {
            const key = normalizeName(name);
            if (!byKey.has(key)) byKey.set(key, { key, name, studentId: null });
            return byKey.get(key)!;
        };
        excelRows.forEach(row => { getItem(row.name).row = row; });
        pdfFiles.forEach(pdf => { getItem(pdf.name.replace(/\.pdf$/i, '')).pdf = pdf; });

        return Array.from(byKey.values())
            .map(item => ({
                ...item,
                studentId: item.key in manualAssign ? manualAssign[item.key] : autoMatch(item.name),
            }))
            .sort((a, b) => a.name.localeCompare(b.name, 'vi'));
    }, [excelRows, pdfFiles, manualAssign, autoMatch]);

    // Một học sinh không được nhận 2 dòng Excel hoặc 2 file PDF
    const conflictStudentIds = useMemo(() => {
        const rowCount = new Map<number, number>();
        const pdfCount = new Map<number, number>();
        items.forEach(i => {
            if (i.studentId == null) return;
            if (i.row) rowCount.set(i.studentId, (rowCount.get(i.studentId) || 0) + 1);
            if (i.pdf) pdfCount.set(i.studentId, (pdfCount.get(i.studentId) || 0) + 1);
        });
        const ids = new Set<number>();
        rowCount.forEach((n, id) => { if (n > 1) ids.add(id); });
        pdfCount.forEach((n, id) => { if (n > 1) ids.add(id); });
        return ids;
    }, [items]);

    const studentById = useMemo(() => new Map(students.map(s => [s.id, s])), [students]);
    const unmatchedItems = items.filter(i => i.studentId == null);
    const oversizedPdfs = pdfFiles.filter(f => f.size > MAX_GRADED_FILE_SIZE);
    const assignedIds = new Set(items.map(i => i.studentId).filter((id): id is number => id != null));
    const studentsWithoutData = students.filter(s => !assignedIds.has(s.id));
    const excelTotals = Array.from(new Set(excelRows.map(r => r.totalTasks).filter((n): n is number => n != null && n > 0)));
    const totalMismatch = excelTotals.length > 0 && excelTotals.some(n => n !== totalTaskLength);

    const studentOptions = students.map(s => ({
        value: s.id,
        label: s.school ? `${s.fullName} (${s.school})` : s.fullName,
    }));

    const readyItems = items.filter(i => i.studentId != null && !conflictStudentIds.has(i.studentId));

    const handleImport = async () => {
        if (readyItems.length === 0) {
            message.warning('Chưa có mục nào được khớp với học sinh.');
            return;
        }
        const base = `${process.env.NEXT_PUBLIC_BACKEND_PORT}/assistant/classes/${classId}/lessons/${lessonId}`;
        const headers = { 'Authorization': `Bearer ${token}` };

        setImporting(true);
        setFailures([]);
        setFinished(false);
        setProgress({ done: 0, total: readyItems.length });

        const newFailures: ImportFailure[] = [];
        await runWithConcurrency(readyItems, IMPORT_CONCURRENCY, async (item) => {
            const studentId = item.studentId as number;
            const label = studentById.get(studentId)?.fullName || item.name;
            try {
                if (item.row) {
                    const { row } = item;
                    const res = await fetch(`${base}/students-performance`, {
                        method: 'POST',
                        headers: { ...headers, 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            studentId,
                            lessonId,
                            performance: {
                                doneTask: row.doneTask,
                                totalScore: row.totalScore,
                                incorrectTasks: row.incorrectTasks,
                                missingTasks: row.missingTasks,
                                presentation: row.presentation,
                                skills: row.skills,
                                comment: row.comment,
                            },
                        }),
                    });
                    const data = await res.json().catch(() => ({}));
                    if (!res.ok) throw new Error(data.message || 'Lỗi khi lưu kết quả');
                }
                if (item.pdf && item.pdf.size <= MAX_GRADED_FILE_SIZE) {
                    await uploadGradedFile({ classId, lessonId, studentId, file: item.pdf, token });
                }
            } catch (err: any) {
                newFailures.push({ name: label, reason: err.message || 'Lỗi không xác định' });
            } finally {
                setProgress(prev => ({ ...prev, done: prev.done + 1 }));
            }
        });

        setFailures(newFailures);
        setImporting(false);
        setFinished(true);
        await onImported();

        const okCount = readyItems.length - newFailures.length;
        if (newFailures.length === 0) {
            message.success(`Đã nhập kết quả cho ${okCount} học sinh.`);
        } else {
            message.warning(`Đã nhập ${okCount}/${readyItems.length} học sinh, ${newFailures.length} mục bị lỗi.`);
        }
    };

    const columns = [
        {
            title: 'Tên trong file',
            dataIndex: 'name',
            key: 'name',
            render: (name: string) => <Text strong>{name}</Text>,
        },
        {
            title: 'Kết quả (Excel)',
            key: 'row',
            render: (_: any, item: ImportItem) =>
                item.row
                    ? <Text>{item.row.doneTask}{item.row.totalTasks != null ? `/${item.row.totalTasks}` : ''} bài · đúng {item.row.totalScore}</Text>
                    : <Text type="secondary">—</Text>,
        },
        {
            title: 'Bài chấm (PDF)',
            key: 'pdf',
            render: (_: any, item: ImportItem) => {
                if (!item.pdf) return <Text type="secondary">—</Text>;
                if (item.pdf.size > MAX_GRADED_FILE_SIZE) return <Tag color="error">Quá 10MB, bỏ qua</Tag>;
                return <Tag icon={<FilePdfOutlined />} color="blue">{(item.pdf.size / 1024 / 1024).toFixed(1)} MB</Tag>;
            },
        },
        {
            title: 'Học sinh trong buổi học',
            key: 'student',
            width: 300,
            render: (_: any, item: ImportItem) => {
                const conflict = item.studentId != null && conflictStudentIds.has(item.studentId);
                const target = item.studentId != null ? studentById.get(item.studentId) : undefined;
                const overwrite = target && ((item.row && target.hasPerformance) || (item.pdf && target.hasGradedFile));
                return (
                    <Space direction="vertical" size={2} style={{ width: '100%' }}>
                        <Select
                            style={{ width: '100%' }}
                            showSearch
                            allowClear
                            optionFilterProp="label"
                            placeholder="Chọn học sinh"
                            status={item.studentId == null || conflict ? 'error' : undefined}
                            value={item.studentId ?? undefined}
                            options={studentOptions}
                            disabled={importing}
                            onChange={(value) => setManualAssign(prev => ({ ...prev, [item.key]: value ?? null }))}
                        />
                        {item.studentId == null && <Text type="danger" style={{ fontSize: 12 }}>Không khớp được tên, sẽ bỏ qua</Text>}
                        {conflict && <Text type="danger" style={{ fontSize: 12 }}>Học sinh này bị gán trùng</Text>}
                        {!conflict && overwrite && <Text type="warning" style={{ fontSize: 12 }}>Sẽ ghi đè dữ liệu đã có</Text>}
                    </Space>
                );
            },
        },
    ];

    return (
        <Modal
            title="Nhập hàng loạt kết quả BTVN"
            open={open}
            onCancel={importing ? undefined : onClose}
            closable={!importing}
            maskClosable={false}
            width={960}
            footer={[
                <Button key="close" onClick={onClose} disabled={importing}>
                    {finished ? 'Đóng' : 'Huỷ'}
                </Button>,
                <Button
                    key="import"
                    type="primary"
                    loading={importing}
                    disabled={readyItems.length === 0 || finished}
                    onClick={handleImport}
                >
                    Nhập {readyItems.length} học sinh
                </Button>,
            ]}
        >
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                <Text type="secondary">
                    Chọn file Excel nhận xét (cột Họ và tên, Tổng số BTVN đã làm, ... , Nhận xét HS) và các file PDF bài chấm
                    đặt tên theo họ tên học sinh (vd: <Text code>Nguyễn Minh An.pdf</Text>). Hệ thống tự khớp theo tên.
                </Text>

                <Upload.Dragger
                    multiple
                    accept=".pdf,.xlsx,.xls"
                    showUploadList={false}
                    disabled={importing}
                    beforeUpload={handleAddFile}
                >
                    <p className="ant-upload-drag-icon"><InboxOutlined /></p>
                    <p className="ant-upload-text">Kéo thả hoặc bấm để chọn file Excel + các file PDF</p>
                </Upload.Dragger>

                <Space wrap>
                    <Upload directory showUploadList={false} disabled={importing} beforeUpload={handleAddFile}>
                        <Button icon={<FolderOpenOutlined />} disabled={importing}>Chọn cả thư mục</Button>
                    </Upload>
                    {excelFile && <Tag icon={<FileExcelOutlined />} color="green">{excelFile.name} ({excelRows.length} dòng)</Tag>}
                    {pdfFiles.length > 0 && <Tag icon={<FilePdfOutlined />} color="blue">{pdfFiles.length} file PDF</Tag>}
                    {(excelFile || pdfFiles.length > 0) && (
                        <Button type="link" onClick={reset} disabled={importing}>Chọn lại</Button>
                    )}
                </Space>

                {excelError && <Alert type="error" showIcon message={excelError} />}
                {totalMismatch && (
                    <Alert
                        type="warning"
                        showIcon
                        message={`File Excel tính trên tổng ${excelTotals.join(', ')} bài, nhưng danh sách bài tập của buổi học đang có ${totalTaskLength} bài. Hãy cập nhật danh sách bài tập để hiển thị đúng.`}
                    />
                )}
                {oversizedPdfs.length > 0 && (
                    <Alert type="warning" showIcon message={`${oversizedPdfs.length} file PDF quá 10MB sẽ không được upload: ${oversizedPdfs.map(f => f.name).join(', ')}`} />
                )}
                {items.length > 0 && unmatchedItems.length > 0 && (
                    <Alert type="error" showIcon message={`${unmatchedItems.length} mục chưa khớp được học sinh. Chọn học sinh tương ứng hoặc mục đó sẽ bị bỏ qua.`} />
                )}
                {items.length > 0 && studentsWithoutData.length > 0 && (
                    <Alert
                        type="info"
                        showIcon
                        message={`${studentsWithoutData.length} học sinh trong buổi học không có dữ liệu trong file: ${studentsWithoutData.map(s => s.fullName).join(', ')}`}
                    />
                )}

                {(importing || finished) && (
                    <Progress
                        percent={progress.total ? Math.round((progress.done / progress.total) * 100) : 0}
                        status={finished ? (failures.length ? 'exception' : 'success') : 'active'}
                        format={() => `${progress.done}/${progress.total}`}
                    />
                )}
                {failures.length > 0 && (
                    <Alert
                        type="error"
                        showIcon
                        message="Một số học sinh nhập lỗi"
                        description={
                            <ul style={{ margin: 0, paddingLeft: 18 }}>
                                {failures.map(f => <li key={f.name}>{f.name}: {f.reason}</li>)}
                            </ul>
                        }
                    />
                )}

                {items.length > 0 && (
                    <Table
                        dataSource={items}
                        columns={columns}
                        rowKey="key"
                        size="small"
                        scroll={{ x: 'max-content', y: 420 }}
                        pagination={false}
                    />
                )}
            </Space>
        </Modal>
    );
};

export default BulkResultImport;
