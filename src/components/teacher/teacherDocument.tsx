'use client'

import { useState, useEffect, useContext } from 'react';
import { Table, Button, Input, Modal, Form, Upload, message, Popconfirm, Spin, Tag, Space } from 'antd';
import { UploadOutlined, PlusOutlined, DeleteOutlined, FileTextOutlined, DownloadOutlined } from '@ant-design/icons'; import type { UploadFile } from 'antd';
import { AuthContext } from '@/library/authContext';
import axios from 'axios';

interface DocumentItem {
    id: number;
    title: string;
    description: string | null;
    fileUrl: string;
    fileName: string | null;
    fileType: string | null;
    fileSize: number | null;
    createdAt: string;
}

const API = process.env.NEXT_PUBLIC_BACKEND_PORT;

const formatSize = (bytes: number | null) => {
    if (!bytes) return '';
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
};

const formatFileType = (type: string | null) => {
    if (!type) return '';

    if (type.includes('pdf')) return 'PDF';
    if (type.includes('wordprocessingml')) return 'Word';
    if (type.includes('spreadsheetml')) return 'Excel';
    if (type.includes('presentationml')) return 'PowerPoint';
    if (type.includes('image')) return 'Ảnh';
    if (type.includes('video')) return 'Video';

    return type.split('/').pop() || type;
};

const getDownloadUrl = (url: string) => {
    if (!url) return '#';

    // Với Cloudinary: ép trình duyệt tải file thay vì mở preview
    if (url.includes('/upload/')) {
        return url.replace('/upload/', '/upload/fl_attachment/');
    }

    return url;
};

const TeacherDocument = () => {
    const { user, token } = useContext(AuthContext);
    const [documents, setDocuments] = useState<DocumentItem[]>([]);
    const [searchText, setSearchText] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    const fetchDocuments = () => {
        if (!token) return;
        setLoading(true);
        axios.get(`${API}/teacher/documents`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(res => setDocuments(res.data.documents))
            .catch(() => message.error('Không thể tải danh sách tài liệu'))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        if (token) fetchDocuments();
    }, [token]);

    if (!user || !token) {
        return <Spin tip="Đang tải..." style={{ display: 'flex', justifyContent: 'center', marginTop: 50 }} />;
    }

    const handleUpload = async () => {
        try {
            const values = await form.validateFields();
            if (fileList.length === 0) {
                message.warning('Vui lòng chọn file để tải lên.');
                return;
            }

            const formData = new FormData();
            formData.append('file', fileList[0].originFileObj as Blob);
            formData.append('title', values.title);
            if (values.description) formData.append('description', values.description);

            setUploading(true);
            await axios.post(`${API}/teacher/documents`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            message.success('Tải tài liệu lên thành công!');
            setIsModalOpen(false);
            form.resetFields();
            setFileList([]);
            fetchDocuments();
        } catch (err: any) {
            if (err?.errorFields) return; // lỗi validate form, bỏ qua
            message.error(err?.response?.data?.message || 'Tải lên thất bại');
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await axios.delete(`${API}/teacher/documents/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            message.success('Đã xóa tài liệu');
            fetchDocuments();
        } catch {
            message.error('Xóa thất bại');
        }
    };

    const filtered = documents.filter(d =>
        d.title.toLowerCase().includes(searchText.toLowerCase())
    );

    const columns = [
        {
            title: 'Tài liệu',
            dataIndex: 'title',
            key: 'title',
            render: (text: string, record: DocumentItem) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <FileTextOutlined style={{ fontSize: 18 }} />

                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontWeight: 600 }}>
                            {text}
                        </span>

                        {record.fileName && (
                            <span style={{ fontSize: 12, color: '#888' }}>
                                {record.fileName}
                            </span>
                        )}
                    </div>
                </div>
            ),
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
            key: 'description',
            render: (text: string | null) => text || 'Không có mô tả',
        },
        {
            title: 'Định dạng',
            dataIndex: 'fileType',
            key: 'fileType',
            render: (t: string | null) =>
                t ? <Tag color="blue">{formatFileType(t)}</Tag> : null,
        },
        {
            title: 'Dung lượng',
            dataIndex: 'fileSize',
            key: 'fileSize',
            render: (s: number | null) => formatSize(s),
        },
        {
            title: 'Ngày tải',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (d: string) => new Date(d).toLocaleDateString('vi-VN'),
        },
        {
            title: 'Thao tác',
            key: 'action',
            width: 220,
            render: (_: any, record: DocumentItem) => (
                <Space>
                    <Button
                        ghost
                        type="primary"
                        icon={<DownloadOutlined />}
                        size="small"
                        href={`${API}/teacher/documents/${record.id}/download`}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Tải xuống
                    </Button>

                    <Popconfirm
                        title="Xóa tài liệu này?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Xóa"
                        cancelText="Hủy"
                    >
                        <Button danger icon={<DeleteOutlined />} size="small">
                            Xóa
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div style={{ padding: 24 }}>
            <h2>Tài liệu giáo viên</h2>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <Input.Search
                    placeholder="Tìm tài liệu theo tiêu đề"
                    style={{ width: 300 }}
                    onChange={e => setSearchText(e.target.value)}
                    allowClear
                />
                <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)}>
                    Tải tài liệu lên
                </Button>
            </div>

            <Table
                rowKey="id"
                columns={columns}
                dataSource={filtered}
                loading={loading}
                pagination={{ defaultPageSize: 10, pageSizeOptions: ['5', '10', '20', '50', '100'] }}
            />

            <Modal
                title="Tải tài liệu lên"
                open={isModalOpen}
                onOk={handleUpload}
                confirmLoading={uploading}
                onCancel={() => { setIsModalOpen(false); form.resetFields(); setFileList([]); }}
                okText="Tải lên"
                cancelText="Hủy"
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="title"
                        label="Tiêu đề"
                        rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}
                    >
                        <Input placeholder="VD: Đề ôn tập chương 1" />
                    </Form.Item>
                    <Form.Item name="description" label="Mô tả">
                        <Input.TextArea rows={2} placeholder="Mô tả ngắn (không bắt buộc)" />
                    </Form.Item>
                    <Form.Item label="File" required>
                        <Upload
                            beforeUpload={() => false}  // chặn auto upload, tự gửi khi bấm "Tải lên"
                            maxCount={1}
                            fileList={fileList}
                            onChange={({ fileList: fl }) => setFileList(fl)}
                        >
                            <Button icon={<UploadOutlined />}>Chọn file (tối đa 10MB)</Button>
                        </Upload>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default TeacherDocument;
