'use client'

import React, { useMemo, useState } from 'react';
import { Alert, Button, Modal, Space, Table, Tabs, Tag, Typography, Upload, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { UploadOutlined } from '@ant-design/icons';
import { authHeaders } from '@/utils/authHeaders';
import {
    FileClassAlert,
    InactiveRowsTable,
    SkippedRowsTable,
    formatISODate,
    parseStudentWorkbook,
    postExcelImport,
    toStudentPayload,
    type InactiveRow,
    type ParsedStudentWorkbook,
    type SkippedRow,
    type StudentSummary
} from './excelStudentImport';

const { Text } = Typography;

type RosterAction = 'inClass' | 'link' | 'create' | 'skip' | 'excluded';

// Chỉ các dòng sẽ thêm vào lớp mới có ô tick để quản lý bỏ chọn
const isAddable = (entry: { action: RosterAction }) => entry.action === 'link' || entry.action === 'create';

interface ProfileChange {
    field: 'DOB' | 'school' | 'parentEmail' | 'parentPhoneNumber';
    label: string;
    from: string | null;
    to: string | null;
}

interface RosterEntry {
    rowNumber: number;
    fullName: string;
    DOB: string;
    action: RosterAction;
    reason?: string;
    dobInvalid: boolean;
    warnings: string[];
    changes: ProfileChange[];
    student: (StudentSummary & { classes: { id: number; className: string }[] }) | null;
}

interface RemoveRow extends StudentSummary {
    reason: string;
}

interface RosterImportPreview {
    class: { id: number; className: string };
    summary: {
        totalRows: number;
        activeRows: number;
        inactiveCount: number;
        classSize: number;
        inClassCount: number;
        linkCount: number;
        createCount: number;
        excludedCount: number;
        updateCount: number;
        removeCount: number;
        skippedCount: number;
    };
    fileMismatch: boolean;
    entries: RosterEntry[];
    toRemove: RemoveRow[];
    inactive: InactiveRow[];
    skipped: SkippedRow[];
}

interface Props {
    open: boolean;
    classId: string;
    onCancel: () => void;
    onSuccess: () => void;
}

const ACTION_TAGS: Record<RosterAction, { color: string; label: string }> = {
    inClass: { color: 'default', label: 'Đã có trong lớp' },
    link: { color: 'blue', label: 'Thêm vào lớp (hồ sơ có sẵn)' },
    create: { color: 'green', label: 'Tạo hồ sơ mới + thêm vào lớp' },
    skip: { color: 'red', label: 'Bỏ qua' },
    excluded: { color: 'default', label: 'Không thêm (đã bỏ chọn)' }
};

const formatChangeValue = (change: ProfileChange, value: string | null) => {
    if (!value) return '(trống)';
    return change.field === 'DOB' ? formatISODate(value) : value;
};

const buildEntryColumns = (selectedRows: Set<number>): ColumnsType<RosterEntry> => {
    const effectiveAction = (record: RosterEntry): RosterAction =>
        (isAddable(record) && !selectedRows.has(record.rowNumber) ? 'excluded' : record.action);

    return [
        { title: 'Dòng', dataIndex: 'rowNumber', key: 'rowNumber', width: 70 },
        { title: 'Học sinh (trong file)', dataIndex: 'fullName', key: 'fullName', width: 200 },
        {
            title: 'Ngày sinh',
            dataIndex: 'DOB',
            key: 'DOB',
            width: 130,
            render: (dob: string, record) => (
                <Space direction="vertical" size={0}>
                    <span>{formatISODate(dob) || '—'}</span>
                    {record.dobInvalid && <Tag color="warning">Bất thường</Tag>}
                </Space>
            )
        },
        {
            title: 'Xử lý',
            key: 'action',
            width: 260,
            filters: (Object.keys(ACTION_TAGS) as RosterAction[]).map(action => ({ text: ACTION_TAGS[action].label, value: action })),
            onFilter: (value, record) => effectiveAction(record) === value,
            render: (_, record) => {
                const action = effectiveAction(record);
                return (
                    <Space direction="vertical" size={0}>
                        <Tag color={ACTION_TAGS[action].color}>{ACTION_TAGS[action].label}</Tag>
                        {record.reason && <Text type="secondary" style={{ fontSize: 12 }}>{record.reason}</Text>}
                        {record.warnings.map(warning => (
                            <Text key={warning} type="warning" style={{ fontSize: 12 }}>{warning}</Text>
                        ))}
                    </Space>
                );
            }
        },
        {
            title: 'Hồ sơ khớp trong hệ thống',
            key: 'student',
            render: (_, record) => {
                if (!record.student) return '—';
                const { fullName, DOB, classes } = record.student;
                return (
                    <Space direction="vertical" size={0}>
                        <span>{fullName} · {formatISODate(DOB) || '—'}</span>
                        {record.action === 'link' && (
                            <Text type="secondary" style={{ fontSize: 12 }}>
                                Đang học lớp: {classes.length > 0 ? classes.map(c => c.className).join(', ') : 'chưa có lớp'}
                            </Text>
                        )}
                    </Space>
                );
            }
        },
        {
            title: 'Cập nhật thông tin',
            key: 'changes',
            width: 340,
            filters: [{ text: 'Có thay đổi', value: true }, { text: 'Không thay đổi', value: false }],
            onFilter: (value, record) => (record.changes.length > 0) === value,
            render: (_, record) => {
                if (record.changes.length === 0) return <Text type="secondary">—</Text>;
                if (isAddable(record) && !selectedRows.has(record.rowNumber)) {
                    return <Text type="secondary">Không cập nhật (đã bỏ chọn)</Text>;
                }
                return (
                    <Space direction="vertical" size={2}>
                        {record.changes.map(change => (
                            <span key={change.field} style={{ fontSize: 12 }}>
                                <strong>{change.label}:</strong>{' '}
                                <Text delete type="secondary">{formatChangeValue(change, change.from)}</Text>
                                {' → '}
                                <Text type={change.to ? 'success' : 'danger'}>{formatChangeValue(change, change.to)}</Text>
                            </span>
                        ))}
                    </Space>
                );
            }
        }
    ];
};

const removeColumns: ColumnsType<RemoveRow> = [
    { title: 'Học sinh', dataIndex: 'fullName', key: 'fullName' },
    { title: 'Ngày sinh', dataIndex: 'DOB', key: 'DOB', width: 120, render: (dob: string) => formatISODate(dob) || '—' },
    { title: 'Lý do', dataIndex: 'reason', key: 'reason' }
];

// Chế độ "Cập nhật danh sách lớp từ Excel": lớp chỉ còn đúng các học sinh "Đang học" trong file.
// Thêm học sinh còn thiếu, cập nhật ngày sinh / trường / email theo file, xoá khỏi lớp các em không có
// trong file hoặc không "Đang học" (hồ sơ vẫn giữ). Luôn xem trước trước khi ghi.
const ImportClassStudentsFromExcelModal = ({ open, classId, onCancel, onSuccess }: Props) => {
    const [parsed, setParsed] = useState<ParsedStudentWorkbook | null>(null);
    const [fileName, setFileName] = useState<string>('');
    const [preview, setPreview] = useState<RosterImportPreview | null>(null);
    const [removeSelection, setRemoveSelection] = useState<React.Key[]>([]);
    const [addSelection, setAddSelection] = useState<React.Key[]>([]);
    const [previewing, setPreviewing] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const endpoint = `${process.env.NEXT_PUBLIC_BACKEND_PORT}/manager/classes/${classId}/students/import-excel`;

    const resetState = () => {
        setParsed(null);
        setFileName('');
        setPreview(null);
        setRemoveSelection([]);
        setAddSelection([]);
    };

    const handleClose = () => {
        resetState();
        onCancel();
    };

    const handleFileUpload = (file: File) => {
        setPreview(null);
        setPreviewing(true);
        (async () => {
            try {
                const workbook = await parseStudentWorkbook(file);
                setParsed(workbook);
                setFileName(file.name);
                const data = await postExcelImport<RosterImportPreview>(
                    endpoint,
                    { dryRun: true, students: toStudentPayload(workbook.rows) },
                    authHeaders()
                );
                setPreview(data);
                // Mặc định xoá tất cả; nếu file không khớp lớp thì mặc định không xoá ai
                setRemoveSelection(data.fileMismatch ? [] : data.toRemove.map(s => s.id));
                // Mặc định thêm tất cả học sinh còn thiếu; bỏ tick để không thêm
                setAddSelection(data.entries.filter(isAddable).map(e => e.rowNumber));
            } catch (error: any) {
                message.error(error.message || 'Không thể đọc file Excel.');
            } finally {
                setPreviewing(false);
            }
        })();

        return false; // chặn upload tự động của antd
    };

    const removeCount = removeSelection.length;
    const selectedRows = useMemo(() => new Set(addSelection.map(Number)), [addSelection]);
    const entryColumns = useMemo(() => buildEntryColumns(selectedRows), [selectedRows]);

    const submit = async () => {
        if (!parsed || !preview) return;
        setSubmitting(true);
        try {
            const keepStudentIds = preview.toRemove
                .map(s => s.id)
                .filter(id => !removeSelection.includes(id));
            const excludeRowNumbers = preview.entries
                .filter(e => isAddable(e) && !selectedRows.has(e.rowNumber))
                .map(e => e.rowNumber);
            const data = await postExcelImport<RosterImportPreview & { message?: string }>(
                endpoint,
                { dryRun: false, students: toStudentPayload(parsed.rows), keepStudentIds, excludeRowNumbers },
                authHeaders()
            );
            message.success(data.message || 'Đã cập nhật danh sách lớp.');
            resetState();
            onSuccess();
        } catch (error: any) {
            console.error('Import class students from excel failed:', error);
            message.error(error.message || 'Không thể cập nhật danh sách lớp từ file Excel.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleSubmit = () => {
        if (!parsed || !preview) {
            message.warning('Vui lòng chọn file Excel danh sách học viên.');
            return;
        }
        if (removeCount === 0) {
            submit();
            return;
        }
        Modal.confirm({
            title: `Xoá ${removeCount} học sinh khỏi lớp ${preview.class.className}?`,
            content: 'Các em sẽ bị bỏ khỏi danh sách lớp và khỏi các buổi học chưa chốt. Hồ sơ học sinh và kết quả ở các buổi đã chốt vẫn được giữ.',
            okText: 'Xác nhận cập nhật',
            okButtonProps: { danger: true },
            cancelText: 'Xem lại',
            onOk: submit
        });
    };

    const summary = preview?.summary;
    const entries = preview?.entries || [];
    const isSelected = (e: RosterEntry) => !isAddable(e) || selectedRows.has(e.rowNumber);
    const selectedLinkCount = entries.filter(e => e.action === 'link' && isSelected(e)).length;
    const selectedCreateCount = entries.filter(e => e.action === 'create' && isSelected(e)).length;
    const addCount = selectedLinkCount + selectedCreateCount;
    const updateCount = entries.filter(e => e.changes.length > 0 && isSelected(e)).length;
    const blockedByMismatch = !!preview?.fileMismatch && removeCount > 0;
    const okText = [
        addCount > 0 ? `Thêm ${addCount}` : '',
        updateCount > 0 ? `Cập nhật ${updateCount} hồ sơ` : '',
        removeCount > 0 ? `Xoá ${removeCount} khỏi lớp` : ''
    ].filter(Boolean).join(' · ') || 'Không có gì cần cập nhật';

    return (
        <Modal
            title="Cập nhật danh sách lớp từ file Excel"
            open={open}
            onCancel={handleClose}
            onOk={handleSubmit}
            okText={okText}
            cancelText="Huỷ"
            okButtonProps={{ disabled: blockedByMismatch || (addCount === 0 && updateCount === 0 && removeCount === 0) }}
            confirmLoading={submitting}
            width={1100}
            destroyOnClose
        >
            <Alert
                type="warning"
                showIcon
                style={{ marginBottom: 16 }}
                message="Danh sách lớp và thông tin học sinh sẽ được cập nhật theo file"
                description={
                    <ul style={{ margin: 0, paddingLeft: 18 }}>
                        <li>Lớp chỉ còn những học sinh &quot;Đang học&quot; trong file: em còn thiếu được thêm vào (tạo hồ sơ mới nếu chưa có).</li>
                        <li>Em không có trong file hoặc &quot;Bảo lưu&quot;/&quot;Chờ thanh toán&quot; bị xoá khỏi lớp và các buổi học chưa chốt; hồ sơ và kết quả buổi đã chốt vẫn giữ.</li>
                        <li>Ngày sinh, trường học, email phụ huynh lấy theo file; ô trường/email trống trong file sẽ xoá trắng trong hồ sơ.</li>
                    </ul>
                }
            />

            <Upload beforeUpload={handleFileUpload} showUploadList={false} accept=".xlsx,.xls">
                <Button icon={<UploadOutlined />} loading={previewing}>Chọn file Excel danh sách học viên</Button>
            </Upload>

            {parsed && preview && summary && (
                <>
                    <FileClassAlert parsed={parsed} fileName={fileName} systemClassName={preview.class.className} />

                    {preview.fileMismatch && (
                        <Alert
                            style={{ marginTop: 8 }}
                            type="error"
                            showIcon
                            message="Không có học sinh nào trong file khớp với lớp hiện tại"
                            description="Có thể bạn đã chọn nhầm file hoặc nhầm lớp. Hệ thống sẽ không xoá học sinh nào khỏi lớp trong trường hợp này."
                        />
                    )}

                    <Space wrap style={{ marginTop: 16 }}>
                        <Tag>Sĩ số hiện tại: {summary.classSize}</Tag>
                        <Tag>Đã có trong lớp: {summary.inClassCount}</Tag>
                        <Tag color="blue">Thêm (hồ sơ có sẵn): {selectedLinkCount}/{summary.linkCount}</Tag>
                        <Tag color="green">Tạo hồ sơ mới: {selectedCreateCount}/{summary.createCount}</Tag>
                        <Tag color="purple">Cập nhật thông tin: {updateCount}</Tag>
                        <Tag color={removeCount > 0 ? 'red' : 'default'}>Xoá khỏi lớp: {removeCount}/{summary.removeCount}</Tag>
                        <Tag color={summary.skippedCount > 0 ? 'orange' : 'default'}>Bỏ qua: {summary.skippedCount}</Tag>
                    </Space>
                    <div style={{ marginTop: 4 }}>
                        <Text type="secondary">
                            Sĩ số sau khi cập nhật: {summary.classSize + addCount - removeCount}
                        </Text>
                    </div>

                    <Tabs
                        style={{ marginTop: 8 }}
                        items={[
                            {
                                key: 'entries',
                                label: `Học sinh "Đang học" trong file (${preview.entries.length})`,
                                children: (
                                    <Table
                                        dataSource={preview.entries}
                                        columns={entryColumns}
                                        rowKey="rowNumber"
                                        size="small"
                                        pagination={false}
                                        scroll={{ x: 'max-content', y: 320 }}
                                        rowSelection={{
                                            selectedRowKeys: addSelection,
                                            onChange: setAddSelection,
                                            getCheckboxProps: (record) => ({ disabled: !isAddable(record) })
                                        }}
                                        footer={() => (
                                            <Text type="secondary">
                                                Bỏ tick để không thêm học sinh vào lớp (ví dụ hồ sơ khớp chỉ theo họ tên nhưng là học sinh khác).
                                                Dòng bỏ chọn cũng không bị cập nhật thông tin.
                                            </Text>
                                        )}
                                    />
                                )
                            },
                            {
                                key: 'toRemove',
                                label: `Xoá khỏi lớp (${removeCount}/${preview.toRemove.length})`,
                                children: (
                                    <Table
                                        dataSource={preview.toRemove}
                                        columns={removeColumns}
                                        rowKey="id"
                                        size="small"
                                        pagination={false}
                                        scroll={{ y: 320 }}
                                        locale={{ emptyText: 'Không có học sinh nào bị xoá' }}
                                        rowSelection={{
                                            selectedRowKeys: removeSelection,
                                            onChange: setRemoveSelection
                                        }}
                                        footer={() => (
                                            <Text type="secondary">
                                                Bỏ tick để giữ lại học sinh trong lớp (ví dụ em có trong file nhưng tên viết khác nên không khớp).
                                            </Text>
                                        )}
                                    />
                                )
                            },
                            {
                                key: 'inactive',
                                label: `Không "Đang học" (${preview.inactive.length})`,
                                children: <InactiveRowsTable rows={preview.inactive} />
                            },
                            ...(preview.skipped.length > 0 ? [{
                                key: 'skipped',
                                label: `Dòng lỗi (${preview.skipped.length})`,
                                children: <SkippedRowsTable rows={preview.skipped} />
                            }] : [])
                        ]}
                    />
                </>
            )}
        </Modal>
    );
};

export default ImportClassStudentsFromExcelModal;
