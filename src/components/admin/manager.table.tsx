'use client';

import React, { useState, useEffect } from 'react';
import { Table, Button, Input, message, Modal, Form, Space, Row, Col } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { SearchOutlined } from '@ant-design/icons';
import axios from 'axios';

interface Manager {
    key: string;
    id: number;
    fullName: string;
    gradeLevel: string;
    phoneNumber: string;
    email: string;
}

const ManagerTable = () => {
    const [managers, setManagers] = useState<Manager[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isManagerModalVisible, setIsManagerModalVisible] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editingManager, setEditingManager] = useState<Manager | null>(null);
    const [formManager] = Form.useForm();

    useEffect(() => {
        fetchManagers();
    }, []);

    const fetchManagers = async () => {
        try {
            const response = await axios.get('http://localhost:8000/get-manager-info');
            const data = response.data;
            const formattedManagers: Manager[] = data.map((manager: any) => ({
                key: manager.id.toString(),
                id: manager.id,
                fullName: manager.fullName,
                gradeLevel: manager.gradeLevel,
                phoneNumber: manager.phoneNumber,
                email: manager.email,
            }));
            setManagers(formattedManagers);
        } catch (error) {
            console.error('Error fetching managers:', error);
            message.error('Không thể tải dữ liệu quản lý.');
        }
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const filteredManagers = managers.filter(manager =>
        manager.fullName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const managerColumns: ColumnsType<Manager> = [
        {
            title: 'ID Quản lý',
            dataIndex: 'id',
            key: 'id',
            width: 100,
        },
        {
            title: 'Tên Quản lý',
            dataIndex: 'fullName',
            key: 'fullName',
            width: 150,
        },
        {
            title: 'Khối quản lý',
            dataIndex: 'gradeLevel',
            key: 'gradeLevel',
            width: 100,
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
            width: 200,
        },
        {
            title: 'Hành động',
            key: 'action',
            width: 150,
            render: (_, record) => (
                <Space size="middle">
                    <Button
                        type="link"
                        icon={<EditOutlined />}
                        onClick={() => handleEditManager(record)}
                    >
                        Thay đổi
                    </Button>
                    <Button
                        type="link"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handleDeleteManager(record)}
                    >
                        Xóa
                    </Button>
                </Space>
            ),
        },
    ];

    const showManagerModal = () => {
        setIsEditMode(false);
        setEditingManager(null);
        formManager.resetFields();
        setIsManagerModalVisible(true);
    };

    const handleManagerCancel = () => {
        setIsManagerModalVisible(false);
        formManager.resetFields();
        setEditingManager(null);
    };

    const handleManagerOk = async () => {
        try {
            const values = await formManager.validateFields();
            const { fullName, gradeLevel, phoneNumber, email, password } = values;

            if (isEditMode && editingManager) {
                const payload: any = { fullName, gradeLevel, phoneNumber, email };
                if (password) {
                    payload.password = password;
                }
                await axios.put(`http://localhost:8000/manager-update-crud/${editingManager.id}`, payload);
                message.success('Quản lý đã được cập nhật thành công!');
            } else {
                const payload = { fullName, gradeLevel, phoneNumber, email, password };
                await axios.post('http://localhost:8000/manager-post-crud', payload);
                message.success('Quản lý mới đã được tạo thành công!');
            }
            setIsManagerModalVisible(false);
            formManager.resetFields();
            fetchManagers();
        } catch (error: any) {
            console.error('Error saving manager:', error);
            if (error.response && error.response.data && error.response.data.error) {
                message.error(error.response.data.error);
            } else {
                message.error('Có lỗi xảy ra khi lưu thông tin quản lý.');
            }
        }
    };

    const handleEditManager = (manager: Manager) => {
        setIsEditMode(true);
        setEditingManager(manager);
        setIsManagerModalVisible(true);
        formManager.setFieldsValue({
            fullName: manager.fullName,
            gradeLevel: manager.gradeLevel,
            phoneNumber: manager.phoneNumber,
            email: manager.email,
            password: '',
        });
    };

    const handleDeleteManager = (manager: Manager) => {
        Modal.confirm({
            title: 'Xác nhận xóa',
            content: `Bạn có chắc chắn muốn xóa quản lý "${manager.fullName}" không?`,
            okText: 'Xóa',
            okType: 'danger',
            cancelText: 'Hủy',
            onOk: () => performDeleteManager(manager.id),
        });
    };

    const performDeleteManager = async (managerId: number) => {
        try {
            await axios.delete(`http://localhost:8000/manager-delete-crud/${managerId}`);
            message.success('Quản lý đã được xóa thành công!');
            fetchManagers();
        } catch (error: any) {
            console.error('Error deleting manager:', error);
            if (error.response && error.response.data && error.response.data.error) {
                message.error(error.response.data.error);
            } else {
                message.error('Có lỗi xảy ra khi xóa quản lý.');
            }
        }
    };

    return (
        <div>
            <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
                <Col>
                    <Input
                        placeholder="Tìm kiếm quản lý"
                        prefix={<SearchOutlined />}
                        style={{ width: 300 }}
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                </Col>
                <Col>
                    <Button type="primary" icon={<PlusOutlined />} onClick={showManagerModal}>
                        Thêm quản lý
                    </Button>
                </Col>
            </Row>
            <Table<Manager>
                columns={managerColumns}
                dataSource={filteredManagers}
                pagination={{ pageSize: 5 }}
                rowKey="key"
                tableLayout="fixed"
                scroll={{ x: 'max-content' }}
            />

            <Modal
                title={isEditMode ? "Chỉnh sửa quản lý" : "Thêm mới quản lý"}
                visible={isManagerModalVisible}
                onOk={handleManagerOk}
                onCancel={handleManagerCancel}
                width={800}
                okText="Lưu"
                cancelText="Hủy"
            >
                <Form form={formManager} layout="vertical" name="managerForm">
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="fullName"
                                label="Tên quản lý"
                                rules={[{ required: true, message: 'Vui lòng nhập tên quản lý!' }]}
                            >
                                <Input placeholder="Nhập tên quản lý" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="gradeLevel"
                                label="Khối quản lý"
                                rules={[{ required: true, message: 'Vui lòng nhập khối quản lý!' }]}
                            >
                                <Input placeholder="Nhập khối quản lý" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="phoneNumber"
                                label="Số điện thoại"
                                rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
                            >
                                <Input placeholder="Nhập số điện thoại" />
                            </Form.Item>
                        </Col>
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
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="password"
                                label={isEditMode ? "Mật khẩu (để trống nếu không muốn thay đổi)" : "Mật khẩu"}
                                rules={[{ required: !isEditMode, message: 'Vui lòng nhập mật khẩu!' }]}
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

export default ManagerTable;
