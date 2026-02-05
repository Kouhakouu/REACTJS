// components/teacher.table.tsx

'use client';

import React, { useState, useEffect } from 'react';
import { Table, Button, Input, message, Modal, Form, Space, Row, Col } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import http from '@/utils/customAxios';

interface Teacher {
    key: string;
    id: number;
    fullName: string;
    phoneNumber: string;
    email: string;
}

const TeacherTable: React.FC = () => {
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
    const [form] = Form.useForm();

    useEffect(() => {
        fetchTeachers();
    }, []);

    const fetchTeachers = async () => {
        try {
            const { data } = await http.get('/get-teacher-info');
            const formatted: Teacher[] = data.map((t: any) => ({
                key: t.userId.toString(),
                id: t.userId,
                fullName: t.fullName,
                phoneNumber: t.phoneNumber,
                email: t.email
            }));
            setTeachers(formatted);
        } catch (err) {
            console.error('Error fetching teachers:', err);
            message.error('Failed to fetch teacher data.');
        }
    };

    const filtered = teachers.filter(t =>
        t.fullName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const columns = [
        { title: 'ID', dataIndex: 'id', key: 'id', width: 100 },
        { title: 'Tên Giáo viên', dataIndex: 'fullName', key: 'fullName', width: 200 },
        { title: 'Số điện thoại', dataIndex: 'phoneNumber', key: 'phoneNumber', width: 150 },
        { title: 'Email', dataIndex: 'email', key: 'email', width: 250 },
        {
            title: 'Hành động',
            key: 'action',
            width: 150,
            render: (_: any, record: Teacher) => (
                <Space size="middle">
                    <Button type="link" onClick={() => onEdit(record)}>Thay đổi</Button>
                    <Button type="link" danger onClick={() => onDelete(record)}>Xóa</Button>
                </Space>
            )
        }
    ];

    const openModal = () => {
        setIsEditMode(false);
        setEditingTeacher(null);
        form.resetFields();
        setIsModalVisible(true);
    };

    const closeModal = () => {
        setIsModalVisible(false);
        form.resetFields();
        setEditingTeacher(null);
    };

    const onSave = async () => {
        try {
            const vals = await form.validateFields();
            if (isEditMode && editingTeacher) {
                const payload: any = {
                    fullName: vals.fullName,
                    phoneNumber: vals.phoneNumber,
                    email: vals.email
                };
                if (vals.password) payload.password = vals.password;
                await http.put(`/teacher-update-crud/${editingTeacher.id}`, payload);
                message.success('Giáo viên đã được cập nhật!');
            } else {
                const payload = {
                    fullName: vals.fullName,
                    phoneNumber: vals.phoneNumber,
                    email: vals.email,
                    password: vals.password
                };
                await http.post('/teacher-post-crud', payload);
                message.success('Giáo viên mới đã được tạo!');
            }
            closeModal();
            fetchTeachers();
        } catch (err: any) {
            console.error('Error saving teacher:', err);
            const errMsg = err.response?.data?.error || 'Có lỗi xảy ra khi lưu.';
            message.error(errMsg);
        }
    };

    const onEdit = (t: Teacher) => {
        setIsEditMode(true);
        setEditingTeacher(t);
        form.setFieldsValue({
            fullName: t.fullName,
            phoneNumber: t.phoneNumber,
            email: t.email,
            password: ''
        });
        setIsModalVisible(true);
    };

    const onDelete = (t: Teacher) => {
        Modal.confirm({
            title: 'Xác nhận xóa',
            content: `Bạn có chắc muốn xóa giáo viên "${t.fullName}"?`,
            okText: 'Xóa',
            okType: 'danger',
            cancelText: 'Hủy',
            onOk: async () => {
                try {
                    await http.delete(`/teacher-delete-crud/${t.id}`);
                    message.success('Giáo viên đã được xóa!');
                    fetchTeachers();
                } catch (err: any) {
                    console.error('Error deleting teacher:', err);
                    message.error(err.response?.data?.error || 'Có lỗi khi xóa.');
                }
            }
        });
    };

    return (
        <div>
            <Row justify="space-between" style={{ marginBottom: 16 }}>
                <Col>
                    <Input
                        placeholder="Tìm kiếm giáo viên"
                        prefix={<SearchOutlined />}
                        style={{ width: 300 }}
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </Col>
                <Col>
                    <Button type="primary" icon={<PlusOutlined />} onClick={openModal}>
                        Thêm mới giáo viên
                    </Button>
                </Col>
            </Row>

            <Table
                columns={columns}
                dataSource={filtered}
                pagination={{ pageSize: 5 }}
                rowKey="key"
                scroll={{ x: 'max-content' }}
            />

            <Modal
                title={isEditMode ? "Chỉnh sửa giáo viên" : "Thêm mới giáo viên"}
                visible={isModalVisible}
                onOk={onSave}
                onCancel={closeModal}
                width={800}
                okText="Lưu"
                cancelText="Hủy"
            >
                <Form form={form} layout="vertical">
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="fullName"
                                label="Tên giáo viên"
                                rules={[{ required: true, message: 'Nhập tên giáo viên!' }]}
                            >
                                <Input placeholder="Tên giáo viên" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="phoneNumber"
                                label="Số điện thoại"
                                rules={[{ required: true, message: 'Nhập số điện thoại!' }]}
                            >
                                <Input placeholder="Số điện thoại" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="email"
                                label="Email"
                                rules={[
                                    { required: true, message: 'Nhập email!' },
                                    { type: 'email', message: 'Email không hợp lệ!' }
                                ]}
                            >
                                <Input placeholder="Email" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="password"
                                label={isEditMode ? "Mật khẩu (để trống nếu không đổi)" : "Mật khẩu"}
                                rules={[{ required: !isEditMode, message: 'Nhập mật khẩu!' }]}
                            >
                                <Input.Password placeholder="Mật khẩu" />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </div>
    );
};

export default TeacherTable;
