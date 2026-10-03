'use client'

import React, { useState } from 'react';
import {
    Alert,
    Button,
    DatePicker,
    Form,
    Input,
    Modal,
    Space,
    Table,
    Tabs,
    Tag,
    Typography,
    Upload,
    message
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { UploadOutlined } from '@ant-design/icons';
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

interface RosterRow extends StudentSummary {
    attendance: boolean;
}

interface NotInClassRow {
    rowNumber: number;
    fullName: string;
    DOB: string;
}

interface LessonImportPreview {
    class: { id: number; className: string };
    summary: {
        totalRows: number;
        activeRows: number;
        inactiveCount: number;
        classSize: number;
        presentCount: number;
        absentCount: number;
        notInClassCount: number;
        skippedCount: number;
    };
    roster: RosterRow[];
    notInClass: NotInClassRow[];
    inactive: InactiveRow[];
    skipped: SkippedRow[];
}

interface Props {
    open: boolean;
    classId?: string;
    token?: string | null;
    onCancel: () => void;
    onSuccess: () => void;
}

const rosterColumns: ColumnsType<RosterRow> = [
    { title: 'Học sinh', dataIndex: 'fullName', key: 'fullName' },
    { title: 'Ngày sinh', dataIndex: 'DOB', key: 'DOB', width: 120, render: (dob: string) => formatISODate(dob) || '—' },
    {
        title: 'Điểm danh',
        key: 'attendance',
        width: 220,
        filters: [{ text: 'Có mặt', value: true }, { text: 'Vắng', value: false }],
        onFilter: (value, record) => record.attendance === value,
        render: (_, record) => (record.attendance
            ? <Tag color="blue">Có mặt</Tag>
            : <Tag color="orange">Vắng (không có trong file)</Tag>)
    }
];

const notInClassColumns: ColumnsType<NotInClassRow> = [
    { title: 'Dòng', dataIndex: 'rowNumber', key: 'rowNumber', width: 70 },
    { title: 'Học sinh', dataIndex: 'fullName', key: 'fullName' },
    { title: 'Ngày sinh', dataIndex: 'DOB', key: 'DOB', width: 120, render: (dob: string) => formatISODate(dob) || '—' }
];

// Chế độ "Tạo buổi học từ Excel": chỉ tạo buổi học + điểm danh, KHÔNG thay đổi danh sách lớp hay hồ sơ học sinh.
// Toàn bộ học sinh trong lớp được đưa vào buổi học; em "Đang học" có trong file thì có mặt, còn lại vắng.
const CreateLessonFromExcelModal = ({ open, classId, token, onCancel, onSuccess }: Props) => {
    const [form] = Form.useForm();
    const [parsed, setParsed] = useState<ParsedStudentWorkbook | null>(null);
    const [fileName, setFileName] = useState<string>('');
    const [preview, setPreview] = useState<LessonImportPreview | null>(null);
    const [previewing, setPreviewing] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const endpoint = `${process.env.NEXT_PUBLIC_BACKEND_PORT}/manager/classes/${classId}/lessons/import-excel`;
    const authHeader = { Authorization: `Bearer ${token}` };

    const resetState = () => {
        form.resetFields();
        setParsed(null);
        setFileName('');
        setPreview(null);
    };

    const handleClose = () => {
        resetState();
        onCancel();
    };

    const handleFileUpload = (file: File) => {
        if (!classId) {
            message.error('Không tìm thấy ID lớp học.');
            return false;
        }

        setPreview(null);
        setPreviewing(true);
        (async () => {
            try {
                const workbook = await parseStudentWorkbook(file);
                setParsed(workbook);
                setFileName(file.name);
                const data = await postExcelImport<LessonImportPreview>(
                    endpoint,
                    { dryRun: true, students: toStudentPayload(workbook.rows) },
                    authHeader
                );
                setPreview(data);
            } catch (error: any) {
                message.error(error.message || 'Không thể đọc file Excel.');
            } finally {
                setPreviewing(false);
            }
        })();

        return false; // chặn upload tự động của antd
    };

    const handleSubmit = async () => {
        if (!classId || !parsed || !preview) {
            message.warning('Vui lòng chọn file Excel danh sách học viên.');
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
            const data = await postExcelImport<LessonImportPreview & { message?: string }>(
                endpoint,
                {
                    dryRun: false,
                    lessonDate: values.lessonDate.toISOString(),
                    lessonContent: values.lessonContent || '',
                    homeworkList: values.homeworkList || '',
                    students: toStudentPayload(parsed.rows)
                },
                authHeader
            );

            message.success(data.message || 'Tạo buổi học từ Excel thành công!');
            if (data.summary?.notInClassCount > 0) {
                message.warning(`${data.summary.notInClassCount} học sinh trong file không thuộc lớp nên không được đưa vào buổi học.`);
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

    const summary = preview?.summary;
    const canSubmit = !!summary && summary.presentCount > 0;

    return (
        <Modal
            title="Tạo buổi học từ file Excel"
            open={open}
            onCancel={handleClose}
            onOk={handleSubmit}
            okText="Tạo buổi học"
            cancelText="Huỷ"
            okButtonProps={{ disabled: !canSubmit }}
            confirmLoading={submitting}
            width={1000}
            destroyOnClose
        >
            <Alert
                type="info"
                showIcon
                style={{ marginBottom: 16 }}
                message="Chế độ này không thay đổi danh sách lớp"
                description={
                    'Chỉ học sinh "Đang học" trong file được điểm danh có mặt. Học sinh của lớp không có trong file sẽ được ghi vắng. '
                    + 'Học sinh trong file nhưng không thuộc lớp sẽ bị bỏ qua. Muốn thêm các em đó vào lớp, hãy dùng "Cập nhật danh sách từ Excel" ở trang lớp.'
                }
            />

            <Form form={form} layout="vertical">
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
            </Form>

            <Upload beforeUpload={handleFileUpload} showUploadList={false} accept=".xlsx,.xls">
                <Button icon={<UploadOutlined />} loading={previewing}>Chọn file Excel danh sách học viên</Button>
            </Upload>

            {parsed && preview && summary && (
                <>
                    <FileClassAlert parsed={parsed} fileName={fileName} systemClassName={preview.class.className} />

                    {summary.presentCount === 0 && (
                        <Alert
                            style={{ marginTop: 8 }}
                            type="error"
                            showIcon
                            message="Không có học sinh nào trong file khớp với danh sách lớp"
                            description="Có thể bạn đã chọn nhầm file hoặc nhầm lớp."
                        />
                    )}

                    <Space wrap style={{ marginTop: 16 }}>
                        <Tag>Sĩ số lớp: {summary.classSize}</Tag>
                        <Tag color="blue">Có mặt: {summary.presentCount}</Tag>
                        <Tag color="orange">Vắng: {summary.absentCount}</Tag>
                        <Tag color={summary.notInClassCount > 0 ? 'red' : 'default'}>
                            Không thuộc lớp (bỏ qua): {summary.notInClassCount}
                        </Tag>
                        <Tag>Không &quot;Đang học&quot; (bỏ qua): {summary.inactiveCount}</Tag>
                    </Space>

                    <Tabs
                        style={{ marginTop: 8 }}
                        items={[
                            {
                                key: 'roster',
                                label: `Điểm danh lớp (${preview.roster.length})`,
                                children: (
                                    <Table
                                        dataSource={preview.roster}
                                        columns={rosterColumns}
                                        rowKey="id"
                                        size="small"
                                        pagination={false}
                                        scroll={{ y: 320 }}
                                        locale={{ emptyText: 'Lớp chưa có học sinh' }}
                                        footer={() => (
                                            <Text type="secondary">
                                                Buổi học sẽ gồm đủ {preview.roster.length} học sinh của lớp, để trợ giảng chấm bài và gửi mail như buổi học thường.
                                            </Text>
                                        )}
                                    />
                                )
                            },
                            {
                                key: 'notInClass',
                                label: `Không thuộc lớp (${preview.notInClass.length})`,
                                children: (
                                    <Table
                                        dataSource={preview.notInClass}
                                        columns={notInClassColumns}
                                        rowKey="rowNumber"
                                        size="small"
                                        pagination={false}
                                        scroll={{ y: 320 }}
                                        locale={{ emptyText: 'Tất cả học sinh "Đang học" trong file đều thuộc lớp' }}
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

export default CreateLessonFromExcelModal;
