// components/manager.table.tsx
'use client';

import React, { useState, useEffect } from 'react';
import {
    Table,
    Button,
    Input,
    message,
    Modal,
    Form,
    Space,
    Row,
    Col
} from 'antd';
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    SearchOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import http from '@/utils/customAxios';

interface Manager {
    key: string;
    id: number;
    fullName: string;
    gradeLevel: string;
    phoneNumber: string;
    email: string;
}

const ManagerTable: React.FC = () => {
    const [managers, setManagers] = useState<Manager[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalVisible, setModalVisible] = useState(false);
    const [isEditMode, setEditMode] = useState(false);
    const [editingManager, setEditingManager] = useState<Manager | null>(null);
    const [form] = Form.useForm();

    useEffect(() => {
        fetchManagers();
    }, []);

    const fetchManagers = async () => {
        try {
            const { data } = await http.get('/get-manager-info');
            const arr: Manager[] = data.map((m: any) => ({
                key: m.userId.toString(),
                id: m.userId,
                fullName: m.fullName,
                gradeLevel: m.gradeLevel,
                phoneNumber: m.phoneNumber,
                email: m.email
            }));
            setManagers(arr);
        } catch {
            message.error('Không thể tải dữ liệu quản lý.');
        }
    };

    const filtered = managers.filter(m =>
        m.fullName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const openAdd = () => {
        setEditMode(false);
        setEditingManager(null);
        form.resetFields();
        setModalVisible(true);
    };

    const openEdit = (m: Manager) => {
        setEditMode(true);
        setEditingManager(m);
        form.setFieldsValue({
            fullName: m.fullName,
            gradeLevel: m.gradeLevel,
            phoneNumber: m.phoneNumber,
            email: m.email,
            password: ''
        });
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
        form.resetFields();
        setEditingManager(null);
    };

    const handleOk = async () => {
        try {
            const vals = await form.validateFields();
            const payload: any = {
                fullName: vals.fullName,
                gradeLevel: vals.gradeLevel,
                phoneNumber: vals.phoneNumber,
                email: vals.email
            };
            if (vals.password) payload.password = vals.password;

            if (isEditMode && editingManager) {
                await http.put(`/manager-update-crud/${editingManager.id}`, payload);
                message.success('Cập nhật quản lý thành công!');
            } else {
                // tạo mới
                await http.post('/manager-post-crud', {
                    ...payload,
                    password: vals.password
                });
                message.success('Tạo quản lý mới thành công!');
            }
            closeModal();
            fetchManagers();
        } catch (e: any) {
            console.error('Error saving manager:', e);
            message.error(e.response?.data?.error || 'Lỗi khi lưu quản lý.');
        }
    };

    const handleDelete = (m: Manager) => {
        Modal.confirm({
            title: 'Xác nhận xóa',
            content: `Bạn có chắc muốn xóa quản lý "${m.fullName}"?`,
            okText: 'Xóa',
            okType: 'danger',
            cancelText: 'Hủy',
            onOk: async () => {
                try {
                    await http.delete(`/manager-delete-crud/${m.id}`);
                    message.success('Xóa quản lý thành công!');
                    fetchManagers();
                } catch {
                    message.error('Xóa thất bại.');
                }
            }
        });
    };

    const columns: ColumnsType<Manager> = [
        { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
        { title: 'Tên', dataIndex: 'fullName', key: 'fullName', width: 200 },
        { title: 'Khối', dataIndex: 'gradeLevel', key: 'gradeLevel', width: 120 },
        { title: 'Điện thoại', dataIndex: 'phoneNumber', key: 'phoneNumber', width: 150 },
        { title: 'Email', dataIndex: 'email', key: 'email', width: 200 },
        {
            title: 'Hành động',
            key: 'action',
            render: (_, record) => (
                <Space>
                    <Button type="link" icon={<EditOutlined />} onClick={() => openEdit(record)}>
                        Sửa
                    </Button>
                    <Button type="link" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record)}>
                        Xóa
                    </Button>
                </Space>
            )
        }
    ];

    return (
        <div>
            <Row justify="space-between" style={{ marginBottom: 16 }}>
                <Col>
                    <Input
                        placeholder="Tìm quản lý"
                        prefix={<SearchOutlined />}
                        style={{ width: 300 }}
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </Col>
                <Col>
                    <Button type="primary" icon={<PlusOutlined />} onClick={openAdd}>
                        Thêm quản lý
                    </Button>
                </Col>
            </Row>

            <Table
                columns={columns}
                dataSource={filtered}
                rowKey="key"
                pagination={{ pageSize: 5 }}
                scroll={{ x: 'max-content' }}
            />

            <Modal
                title={isEditMode ? 'Cập nhật quản lý' : 'Thêm quản lý mới'}
                visible={isModalVisible}
                onOk={handleOk}
                onCancel={closeModal}
                destroyOnClose
                width={800}
            >
                <Form form={form} layout="vertical">
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="fullName"
                                label="Họ và tên"
                                rules={[{ required: true, message: 'Nhập họ và tên' }]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="gradeLevel"
                                label="Khối quản lý"
                                rules={[{ required: true, message: 'Nhập khối quản lý' }]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="phoneNumber"
                                label="Số điện thoại"
                                rules={[{ required: true, message: 'Nhập số điện thoại' }]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="email"
                                label="Email"
                                rules={[
                                    { required: true, message: 'Nhập email' },
                                    { type: 'email', message: 'Email không hợp lệ' }
                                ]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item
                        name="password"
                        label={isEditMode ? 'Mật khẩu (để trống nếu không đổi)' : 'Mật khẩu'}
                        rules={[{ required: !isEditMode, message: 'Nhập mật khẩu' }]}
                    >
                        <Input.Password />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default ManagerTable;
