// teacher.table.tsx

'use client';

import React, { useState, useEffect } from 'react';
import { Table, Button, Input, message, Modal, Form, Space, Row, Col } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { SearchOutlined } from '@ant-design/icons';
import axios from 'axios';
import http from '@/utils/customAxios';

interface Teacher {
    key: string;
    id: number;
    fullName: string;
    phoneNumber: string;
    email: string;
}

const TeacherTable = () => {
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isTeacherModalVisible, setIsTeacherModalVisible] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
    const [formTeacher] = Form.useForm();

    useEffect(() => {
        fetchTeachers();
    }, []);

    const fetchTeachers = async () => {
        try {
            const response = await http.get('/get-teacher-info');
            const data = response.data;
            const formattedTeachers: Teacher[] = data.map((teacher: any) => ({
                key: teacher.id.toString(),
                id: teacher.id,
                fullName: teacher.fullName,
                phoneNumber: teacher.phoneNumber,
                email: teacher.email,
            }));
            setTeachers(formattedTeachers);
        } catch (error) {
            console.error('Error fetching teachers:', error);
            message.error('Failed to fetch teacher data.');
        }
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const filteredTeachers = teachers.filter(teacher =>
        teacher.fullName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const teacherColumns: ColumnsType<Teacher> = [
        {
            title: 'ID Giáo viên',
            dataIndex: 'id',
            key: 'id',
            width: 100,
        },
        {
            title: 'Tên Giáo viên',
            dataIndex: 'fullName',
            key: 'fullName',
            width: 200,
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phoneNumber',
            key: 'phoneNumber',
            width: 150,
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            width: 250,
        },
        {
            title: 'Hành động',
            key: 'action',
            width: 150,
            render: (_, record) => (
                <Space size="middle">
                    <Button
                        type="link"
                        onClick={() => handleEditTeacher(record)}
                    >
                        Thay đổi
                    </Button>
                    <Button
                        type="link"
                        danger
                        onClick={() => handleDeleteTeacher(record)}
                    >
                        Xóa
                    </Button>
                </Space>
            ),
        },
    ];

    const showTeacherModal = () => {
        setIsEditMode(false);
        setEditingTeacher(null);
        setIsTeacherModalVisible(true);
    };

    const handleTeacherCancel = () => {
        setIsTeacherModalVisible(false);
        formTeacher.resetFields();
        setEditingTeacher(null);
    };

    const handleTeacherOk = async () => {
        try {
            const values = await formTeacher.validateFields();
            const { fullName, phoneNumber, email, password } = values;

            if (isEditMode && editingTeacher) {
                // Update existing teacher
                const teacherPayload: any = { fullName, phoneNumber, email };
                if (password) {
                    teacherPayload.password = password;
                }

                await http.put(`/teacher-update-crud/${editingTeacher.id}`, teacherPayload);
                message.success('Giáo viên đã được cập nhật thành công!');
            } else {
                // Create new teacher
                const teacherPayload = { fullName, phoneNumber, email, password };
                await http.post('/teacher-post-crud', teacherPayload);
                message.success('Giáo viên mới đã được tạo thành công!');
            }

            setIsTeacherModalVisible(false);
            formTeacher.resetFields();
            await fetchTeachers();
        } catch (error: any) {
            console.error('Error saving teacher:', error);
            if (error.response && error.response.data && error.response.data.error) {
                message.error(error.response.data.error);
            } else {
                message.error('Có lỗi xảy ra khi lưu thông tin giáo viên.');
            }
        }
    };

    const handleEditTeacher = (teacher: Teacher) => {
        setIsEditMode(true);
        setEditingTeacher(teacher);
        setIsTeacherModalVisible(true);
        formTeacher.setFieldsValue({
            fullName: teacher.fullName,
            phoneNumber: teacher.phoneNumber,
            email: teacher.email,
            password: '',
        });
    };

    const handleDeleteTeacher = (teacher: Teacher) => {
        Modal.confirm({
            title: 'Xác nhận xóa',
            content: `Bạn có chắc chắn muốn xóa giáo viên "${teacher.fullName}" không?`,
            okText: 'Xóa',
            okType: 'danger',
            cancelText: 'Hủy',
            onOk: () => performDeleteTeacher(teacher.id),
        });
    };

    const performDeleteTeacher = async (teacherId: number) => {
        try {
            await http.delete(`/teacher-delete-crud/${teacherId}`);
            message.success('Giáo viên đã được xóa thành công!');
            await fetchTeachers();
        } catch (error: any) {
            console.error('Error deleting teacher:', error);
            if (error.response && error.response.data && error.response.data.error) {
                message.error(error.response.data.error);
            } else {
                message.error('Có lỗi xảy ra khi xóa giáo viên.');
            }
        }
    };

    return (
        <div>
            <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
                <Col>
                    <Input
                        placeholder="Tìm kiếm giáo viên"
                        prefix={<SearchOutlined />}
                        style={{ width: 300 }}
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                </Col>
                <Col>
                    <Button type="primary" icon={<PlusOutlined />} onClick={showTeacherModal}>
                        Thêm mới giáo viên
                    </Button>
                </Col>
            </Row>
            <Table<Teacher>
                columns={teacherColumns}
                dataSource={filteredTeachers}
                pagination={{ pageSize: 5 }}
                rowKey="key"
                tableLayout="fixed"
                scroll={{ x: 'max-content' }}
            />

            <Modal
                title={isEditMode ? "Chỉnh sửa giáo viên" : "Thêm mới giáo viên"}
                visible={isTeacherModalVisible}
                onOk={handleTeacherOk}
                onCancel={handleTeacherCancel}
                width={800}
                okText="Lưu"
                cancelText="Hủy"
            >
                <Form form={formTeacher} layout="vertical" name="teacherForm">
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="fullName"
                                label="Tên giáo viên"
                                rules={[{ required: true, message: 'Vui lòng nhập tên giáo viên!' }]}
                            >
                                <Input placeholder="Nhập tên giáo viên" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="phoneNumber"
                                label="Số điện thoại"
                                rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
                            >
                                <Input placeholder="Nhập số điện thoại" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="email"
                                label="Email"
                                rules={[
                                    { required: true, message: 'Vui lòng nhập email!' },
                                    { type: 'email', message: 'Email không hợp lệ!' },
                                ]}
                            >
                                <Input placeholder="Nhập email" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="password"
                                label={isEditMode ? "Mật khẩu (để trống nếu không muốn thay đổi)" : "Mật khẩu"}
                                rules={[
                                    { required: !isEditMode, message: 'Vui lòng nhập mật khẩu!' },
                                ]}
                            >
                                <Input.Password placeholder="Nhập mật khẩu" />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </div>
    );
};

export default TeacherTable;
