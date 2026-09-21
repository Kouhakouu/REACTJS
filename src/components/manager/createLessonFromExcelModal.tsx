'use client'

import React, { useMemo, useState } from 'react';
import {
    Alert,
    Button,
    Checkbox,
    DatePicker,
    Form,
    Input,
    Modal,
    Space,
    Table,
    Tag,
    Typography,
    Upload,
    message
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { UploadOutlined } from '@ant-design/icons';
import * as XLSX from 'xlsx';

const { Text } = Typography;

export interface ExcelStudentRow {
    key: number;
    studentCode: string;
    fullName: string;
    DOB: string;          // 'YYYY-MM-DD', rỗng nếu không đọc được
    DOBRaw: string;       // giá trị gốc trong file, dùng để hiển thị khi parse lỗi
    school: string;
    parentEmail: string;
    parentPhoneNumber: string;
    studyStatus: string;
}

interface ExcelClassInfo {
    courseCode: string;
    classCode: string;
    className: string;
}

interface Props {
    open: boolean;
    classId?: string;
    token?: string | null;
    onCancel: () => void;
    onSuccess: () => void;
}

// Bỏ dấu tiếng Việt + hạ chữ thường để so khớp tên cột linh hoạt
const normalizeHeader = (header: string): string =>
    String(header || '')
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '')
        .replace(/đ/gi, 'd')
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '');

const HEADER_ALIASES: Record<keyof Omit<ExcelStudentRow, 'key' | 'DOB' | 'DOBRaw'> | 'dob', string[]> = {
    studentCode: ['mahocvien', 'mahs', 'mahocsinh'],
    fullName: ['hocsinh', 'hovaten', 'hoten', 'tenhocsinh', 'hovatenhocsinh'],
    dob: ['ngaythangnamsinh', 'ngaysinh', 'dob'],
    school: ['truonghoc', 'truong'],
    parentEmail: ['email', 'emailphuhuynh', 'mailphuhuynh'],
    parentPhoneNumber: ['sdtphuhuynh', 'sodienthoaiphuhuynh', 'sdtph', 'dienthoaiphuhuynh'],
    studyStatus: ['trangthaihoc', 'trangthai']
};

const CLASS_HEADER_ALIASES: Record<keyof ExcelClassInfo, string[]> = {
    courseCode: ['makhoa'],
    classCode: ['malop'],
    className: ['tenlop']
};

// Trong file Excel, ô có thể là Date, số serial của Excel, hoặc chuỗi dd/mm/yyyy
const parseExcelDate = (value: unknown): string => {
    if (value === null || value === undefined || value === '') return '';

    if (value instanceof Date && !Number.isNaN(value.getTime())) {
        const y = value.getFullYear();
        const m = String(value.getMonth() + 1).padStart(2, '0');
        const d = String(value.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
    }

    if (typeof value === 'number') {
        const parsed = XLSX.SSF.parse_date_code(value);
        if (!parsed) return '';
        return `${parsed.y}-${String(parsed.m).padStart(2, '0')}-${String(parsed.d).padStart(2, '0')}`;
    }

    const text = String(value).trim();
    if (!text) return '';

    const isoMatch = text.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})$/);
    if (isoMatch) {
        return `${isoMatch[1]}-${isoMatch[2].padStart(2, '0')}-${isoMatch[3].padStart(2, '0')}`;
    }

    const vnMatch = text.match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{4})$/);
    if (vnMatch) {
        return `${vnMatch[3]}-${vnMatch[2].padStart(2, '0')}-${vnMatch[1].padStart(2, '0')}`;
    }

    return '';
};

// Chỉ học sinh "Đang học" mới được điểm danh mặc định; "Bảo lưu"/"Chờ thanh toán" coi như vắng
const isActiveStatus = (status: string): boolean => normalizeHeader(status) === 'danghoc';

const findValue = (row: Record<string, unknown>, aliases: string[]): string => {
    for (const [header, value] of Object.entries(row)) {
        if (aliases.includes(normalizeHeader(header))) {
            if (value === null || value === undefined) return '';
            return value instanceof Date ? value.toISOString() : String(value).trim();
        }
    }
    return '';
};

const findRawValue = (row: Record<string, unknown>, aliases: string[]): unknown => {
    for (const [header, value] of Object.entries(row)) {
        if (aliases.includes(normalizeHeader(header))) return value;
    }
    return '';
};

const formatDOB = (row: ExcelStudentRow) => (row.DOB
    ? row.DOB.split('-').reverse().join('/')
    : row.DOBRaw || '—');

const CreateLessonFromExcelModal = ({ open, classId, token, onCancel, onSuccess }: Props) => {
    const [form] = Form.useForm();
    const [rows, setRows] = useState<ExcelStudentRow[]>([]);
    const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
    const [fileName, setFileName] = useState<string>('');
    const [classInfo, setClassInfo] = useState<ExcelClassInfo | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const resetState = () => {
        form.resetFields();
        setRows([]);
        setSelectedKeys([]);
        setFileName('');
        setClassInfo(null);
    };

    const handleClose = () => {
        resetState();
        onCancel();
    };

    const handleFileUpload = (file: File) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                const workbook = XLSX.read(e.target?.result, { type: 'array', cellDates: true });
                const worksheet = workbook.Sheets[workbook.SheetNames[0]];
                const jsonData = XLSX.utils.sheet_to_json<Record<string, unknown>>(worksheet, { defval: '' });

                if (!jsonData || jsonData.length === 0) {
                    message.error('File Excel không chứa dữ liệu!');
                    return;
                }

                const parsed: ExcelStudentRow[] = jsonData
                    .map((row, index) => {
                        const dobRaw = findRawValue(row, HEADER_ALIASES.dob);
                        return {
                            key: index,
                            studentCode: findValue(row, HEADER_ALIASES.studentCode),
                            fullName: findValue(row, HEADER_ALIASES.fullName).replace(/\s+/g, ' '),
                            DOB: parseExcelDate(dobRaw),
                            DOBRaw: dobRaw instanceof Date ? '' : String(dobRaw || '').trim(),
                            school: findValue(row, HEADER_ALIASES.school),
                            parentEmail: findValue(row, HEADER_ALIASES.parentEmail),
                            parentPhoneNumber: findValue(row, HEADER_ALIASES.parentPhoneNumber),
                            studyStatus: findValue(row, HEADER_ALIASES.studyStatus)
                        };
                    })
                    .filter(row => row.fullName);

                if (parsed.length === 0) {
                    message.error('Không tìm thấy cột "Học sinh" trong file Excel!');
                    return;
                }

                const firstRow = jsonData[0];
                setClassInfo({
                    courseCode: findValue(firstRow, CLASS_HEADER_ALIASES.courseCode),
                    classCode: findValue(firstRow, CLASS_HEADER_ALIASES.classCode),
                    className: findValue(firstRow, CLASS_HEADER_ALIASES.className)
                });

                setRows(parsed);
                // Mặc định chọn học sinh đang học và đọc được ngày sinh
                setSelectedKeys(parsed.filter(row => isActiveStatus(row.studyStatus)).map(row => row.key));
                setFileName(file.name);
                message.success(`Đã đọc ${parsed.length} học sinh từ file Excel.`);
            } catch (error) {
                console.error('Parse excel error:', error);
                message.error('Không đọc được file Excel. Vui lòng kiểm tra lại định dạng file.');
            }
        };

        reader.onerror = () => message.error('Lỗi khi đọc file Excel!');
        reader.readAsArrayBuffer(file);

        return false; // chặn upload tự động của antd
    };

    const selectedRows = useMemo(
        () => rows.filter(row => selectedKeys.includes(row.key)),
        [rows, selectedKeys]
    );

    const missingDobCount = useMemo(
        () => selectedRows.filter(row => !row.DOB).length,
        [selectedRows]
    );

    const handleSubmit = async () => {
        if (!classId) {
            message.error('Không tìm thấy ID lớp học.');
            return;
        }
        if (selectedRows.length === 0) {
            message.warning('Vui lòng chọn ít nhất một học sinh từ file Excel.');
            return;
        }

        let values;
        try {
            values = await form.validateFields();
        } catch {
            return;
        }

        setSubmitting(true);
        try {
            const payload = {
                lessonDate: values.lessonDate.toISOString(),
                lessonContent: values.lessonContent || '',
                homeworkList: values.homeworkList || '',
                syncClassRoster: values.syncClassRoster !== false,
                students: selectedRows.map(row => ({
                    studentCode: row.studentCode,
                    fullName: row.fullName,
                    DOB: row.DOB,
                    school: row.school,
                    parentEmail: row.parentEmail,
                    parentPhoneNumber: row.parentPhoneNumber,
                    studyStatus: row.studyStatus,
                    attendance: isActiveStatus(row.studyStatus)
                }))
            };

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_PORT}/manager/classes/${classId}/lessons/import-excel`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                    body: JSON.stringify(payload)
                }
            );

            const data = await response.json().catch(() => ({}));
            if (!response.ok) {
                throw new Error(data.message || `Lỗi HTTP: ${response.status}`);
            }

            const summary = data.summary || {};
            message.success(data.message || 'Tạo buổi học từ Excel thành công!');
            if (summary.createdStudents > 0 || summary.addedToClass > 0) {
                message.info(
                    `Đã tạo mới ${summary.createdStudents || 0} hồ sơ học sinh, thêm ${summary.addedToClass || 0} học sinh vào lớp.`
                );
            }
            if (Array.isArray(summary.skipped) && summary.skipped.length > 0) {
                message.warning(`${summary.skipped.length} dòng bị bỏ qua: ${summary.skipped[0].reason}`);
            }

            resetState();
            onSuccess();
        } catch (error: any) {
            console.error('Import lesson from excel failed:', error);
            message.error(error.message || 'Không thể tạo buổi học từ file Excel.');
        } finally {
            setSubmitting(false);
        }
    };

    const columns: ColumnsType<ExcelStudentRow> = [
        { title: 'Mã học viên', dataIndex: 'studentCode', key: 'studentCode', width: 120 },
        { title: 'Học sinh', dataIndex: 'fullName', key: 'fullName', width: 180 },
        {
            title: 'Ngày sinh',
            key: 'DOB',
            width: 130,
            render: (_, record) => (
                <Space size={4}>
                    <span>{formatDOB(record)}</span>
                    {!record.DOB && <Tag color="warning">Thiếu</Tag>}
                </Space>
            )
        },
        { title: 'Trường học', dataIndex: 'school', key: 'school', width: 200 },
        { title: 'Email phụ huynh', dataIndex: 'parentEmail', key: 'parentEmail', width: 220 },
        { title: 'SĐT phụ huynh', dataIndex: 'parentPhoneNumber', key: 'parentPhoneNumber', width: 140 },
        {
            title: 'Trạng thái học',
            dataIndex: 'studyStatus',
            key: 'studyStatus',
            width: 150,
            render: (status: string) => (
                <Tag color={isActiveStatus(status) ? 'green' : 'default'}>{status || 'Không rõ'}</Tag>
            )
        },
        {
            title: 'Điểm danh mặc định',
            key: 'attendance',
            width: 160,
            render: (_, record) => (
                isActiveStatus(record.studyStatus)
                    ? <Tag color="blue">Có mặt</Tag>
                    : <Tag>Vắng</Tag>
            )
        }
    ];

    return (
        <Modal
            title="Tạo buổi học từ file Excel"
            open={open}
            onCancel={handleClose}
            onOk={handleSubmit}
            okText="Tạo buổi học"
            cancelText="Huỷ"
            confirmLoading={submitting}
            width={1100}
            destroyOnClose
        >
            <Form
                form={form}
                layout="vertical"
                initialValues={{ syncClassRoster: true }}
            >
                <Form.Item
                    name="lessonDate"
                    label="Ngày học"
                    rules={[{ required: true, message: 'Vui lòng chọn ngày học' }]}
                    extra="File Excel là danh sách học viên nên không chứa ngày buổi học, cần chọn thủ công."
                >
                    <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
                </Form.Item>

                <Form.Item name="lessonContent" label="Nội dung buổi học (tuỳ chọn)">
                    <Input placeholder="Ví dụ: Ôn tập phép cộng có nhớ" />
                </Form.Item>

                <Form.Item
                    name="homeworkList"
                    label="Danh sách bài tập về nhà (tuỳ chọn)"
                    extra="Các bài cách nhau bởi dấu phẩy, hệ thống tự đếm tổng số bài."
                >
                    <Input placeholder="Bài 1, Bài 2, Bài 3" />
                </Form.Item>

                <Form.Item name="syncClassRoster" valuePropName="checked">
                    <Checkbox>Thêm học sinh chưa có trong lớp vào danh sách lớp</Checkbox>
                </Form.Item>
            </Form>

            <Upload beforeUpload={handleFileUpload} showUploadList={false} accept=".xlsx,.xls">
                <Button icon={<UploadOutlined />}>Chọn file Excel danh sách học viên</Button>
            </Upload>
            {fileName && <Text type="secondary" style={{ marginLeft: 12 }}>{fileName}</Text>}

            {classInfo && (classInfo.className || classInfo.classCode) && (
                <Alert
                    style={{ marginTop: 16 }}
                    type="info"
                    showIcon
                    message={`Lớp trong file: ${classInfo.className || '—'}`}
                    description={
                        <Space size="large" wrap>
                            <span>Mã khoá: {classInfo.courseCode || '—'}</span>
                            <span>Mã lớp: {classInfo.classCode || '—'}</span>
                            <span>Số học sinh đọc được: {rows.length}</span>
                        </Space>
                    }
                />
            )}

            {missingDobCount > 0 && (
                <Alert
                    style={{ marginTop: 16 }}
                    type="warning"
                    showIcon
                    message={`${missingDobCount} học sinh đang chọn không có ngày sinh hợp lệ.`}
                    description="Nếu các học sinh này chưa có hồ sơ trong hệ thống, hệ thống sẽ bỏ qua và báo lại sau khi tạo."
                />
            )}

            {rows.length > 0 && (
                <Table
                    style={{ marginTop: 16 }}
                    dataSource={rows}
                    columns={columns}
                    rowKey="key"
                    size="small"
                    scroll={{ x: 'max-content', y: 320 }}
                    pagination={{ defaultPageSize: 10, pageSizeOptions: ['10', '20', '50', '100'] }}
                    rowSelection={{
                        selectedRowKeys: selectedKeys,
                        onChange: setSelectedKeys
                    }}
                    footer={() => (
                        <Text>
                            Đã chọn <strong>{selectedRows.length}</strong>/{rows.length} học sinh cho buổi học.
                        </Text>
                    )}
                />
            )}
        </Modal>
    );
};

export default CreateLessonFromExcelModal;
