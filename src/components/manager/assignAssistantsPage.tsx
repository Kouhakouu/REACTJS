'use client';
import React, { useState, useEffect } from 'react';
import {
    Table,
    Button,
    Modal,
    Form,
    Select,
    List,
    Popconfirm,
    message,
    Row,
    Col,
    Input,
} from 'antd';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
import http from '@/utils/customAxios';
import type { ColumnsType } from 'antd/es/table';

const { Option } = Select;

interface ClassInfo {
    id: number;
    className: string;
    gradeLevel: string;
}

interface Assistant {
    key: string;
    id: number;
    fullName: string;
    email: string;
    phoneNumber: string;
    classes?: ClassInfo[];
}

const AssignAssistantsPage: React.FC = () => {
    const [assistants, setAssistants] = useState<Assistant[]>([]);
    const [classes, setClasses] = useState<ClassInfo[]>([]);
    const [filtered, setFiltered] = useState<Assistant[]>([]);
    const [searchTerm, setSearchTerm] = useState('');

    // Add Assistant
    const [isAddModalVisible, setAddModalVisible] = useState(false);
    const [formAdd] = Form.useForm();

    // Assign
    const [isModalVisible, setModalVisible] = useState(false);
    const [selectedAssistant, setSelectedAssistant] = useState<Assistant | null>(null);
    const [formAssign] = Form.useForm();

    // Load assistants and classes
    const fetchAssistants = async () => {
        try {
            const { data } = await http.get('/get-assistant-info');
            const arr: Assistant[] = data.map((a: any) => ({
                key: a.userId.toString(),
                id: a.userId,
                fullName: a.fullName,
                email: a.email,
                phoneNumber: a.phoneNumber,
                classes: a.classes || [],
            }));
            setAssistants(arr);
            setFiltered(arr);
        } catch {
            message.error('Không thể tải danh sách trợ giảng.');
        }
    };

    const fetchClasses = async () => {
        try {
            const { data } = await http.get('/get-class-info');
            setClasses(data);
        } catch {
            message.error('Không thể tải danh sách lớp.');
        }
    };

    useEffect(() => {
        fetchAssistants();
        fetchClasses();
    }, []);

    // Search filter
    const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const term = e.target.value;
        setSearchTerm(term);
        setFiltered(
            assistants.filter(a =>
                a.fullName.toLowerCase().includes(term.toLowerCase())
            )
        );
    };

    // Add Assistant handlers
    const openAdd = () => {
        setAddModalVisible(true);
        formAdd.resetFields();
    };
    const closeAdd = () => {
        setAddModalVisible(false);
        formAdd.resetFields();
    };
    const handleAdd = async () => {
        try {
            const vals = await formAdd.validateFields();
            await http.post('/assistant-post-crud', {
                fullName: vals.fullName,
                email: vals.email,
                phoneNumber: vals.phoneNumber,
                password: vals.password,
            });
            message.success('Thêm trợ giảng thành công!');
            closeAdd();
            fetchAssistants();
        } catch {
            message.error('Thêm trợ giảng thất bại.');
        }
    };

    // Assign Class handlers
    const openModal = (assistant: Assistant) => {
        setSelectedAssistant(assistant);
        formAssign.resetFields();
        setModalVisible(true);
    };
    const closeModal = () => {
        setSelectedAssistant(null);
        setModalVisible(false);
    };

    const handleAssign = async () => {
        if (!selectedAssistant) return;
        try {
            const { classId } = await formAssign.validateFields();
            await http.post('/class-assistant-post-crud', {
                classId: Number(classId),
                assistantId: selectedAssistant.id,
            });
            message.success('Gán lớp thành công!');
            closeModal();
            fetchAssistants();
        } catch {
            message.error('Gán lớp thất bại.');
        }
    };

    const handleRemoveClass = async (classId: number) => {
        if (!selectedAssistant) return;
        try {
            await http.post('/delete-class-assistant-crud', {
                classId,
                assistantId: selectedAssistant.id,
            });
            message.success('Xóa lớp khỏi trợ giảng thành công!');
            fetchAssistants();
            setSelectedAssistant(prev => prev && ({
                ...prev,
                classes: prev.classes?.filter(c => c.id !== classId),
            }));
        } catch {
            message.error('Xóa lớp thất bại.');
        }
    };

    const columns: ColumnsType<Assistant> = [
        { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
        { title: 'Họ tên', dataIndex: 'fullName', key: 'fullName', width: 200 },
        { title: 'Email', dataIndex: 'email', key: 'email', width: 250 },
        { title: 'Điện thoại', dataIndex: 'phoneNumber', key: 'phoneNumber', width: 150 },
        {
            title: 'Lớp hiện tại',
            dataIndex: 'classes',
            key: 'classes',
            render: (clsList: ClassInfo[]) =>
                clsList && clsList.length
                    ? clsList.map(c => c.className).join(', ')
                    : '-',
            width: 250,
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (_, record) => (
                <Button type="link" onClick={() => openModal(record)}>
                    Phân công
                </Button>
            ),
            width: 120,
        },
    ];

    return (
        <>
            <Row justify="space-between" style={{ marginBottom: 16 }}>
                <Col>
                    <Input
                        placeholder="Tìm trợ giảng"
                        value={searchTerm}
                        onChange={onSearch}
                        prefix={<SearchOutlined />}
                        style={{ width: 300 }}
                    />
                </Col>
                <Col>
                    <Button type="primary" icon={<PlusOutlined />} onClick={openAdd}>
                        Thêm trợ giảng
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

            {/* Thêm trợ giảng */}
            <Modal
                title="Thêm trợ giảng"
                visible={isAddModalVisible}
                onCancel={closeAdd}
                onOk={handleAdd}
                destroyOnClose
            >
                <Form form={formAdd} layout="vertical">
                    <Form.Item
                        name="fullName"
                        label="Họ và tên"
                        rules={[{ required: true, message: 'Vui lòng nhập họ và tên' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[
                            { required: true, message: 'Vui lòng nhập email' },
                            { type: 'email', message: 'Email không hợp lệ' },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="phoneNumber"
                        label="Điện thoại"
                        rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        label="Mật khẩu"
                        rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}
                    >
                        <Input.Password />
                    </Form.Item>
                </Form>
            </Modal>

            {/* Phân công trợ giảng */}
            <Modal
                title={`Phân công cho: ${selectedAssistant?.fullName}`}
                visible={isModalVisible}
                onCancel={closeModal}
                footer={[
                    <Button key="cancel" onClick={closeModal}>Hủy</Button>,
                    <Button key="assign" type="primary" onClick={handleAssign}>
                        Gán lớp
                    </Button>,
                ]}
                width={600}
                destroyOnClose
            >
                <h4>Lớp hiện tại</h4>
                <List
                    bordered
                    dataSource={selectedAssistant?.classes || []}
                    renderItem={item => (
                        <List.Item
                            actions={[
                                <Popconfirm
                                    key="remove"
                                    title="Xóa lớp này?"
                                    onConfirm={() => handleRemoveClass(item.id)}
                                    okText="Xóa"
                                    cancelText="Hủy"
                                >
                                    <a>Xóa</a>
                                </Popconfirm>
                            ]}
                        >
                            {item.className} ({item.gradeLevel})
                        </List.Item>
                    )}
                    style={{ marginBottom: 16 }}
                />

                <Form form={formAssign} layout="inline">
                    <Form.Item
                        name="classId"
                        rules={[{ required: true, message: 'Chọn lớp để gán' }]}
                    >
                        <Select placeholder="Chọn lớp" style={{ width: 240 }}>
                            {classes
                                .filter(c =>
                                    !selectedAssistant?.classes?.find(ac => ac.id === c.id)
                                )
                                .map(c => (
                                    <Option key={c.id} value={c.id}>
                                        {c.className} ({c.gradeLevel})
                                    </Option>
                                ))
                            }
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default AssignAssistantsPage;
