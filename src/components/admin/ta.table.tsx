'use client';

import React, { useState, useEffect } from 'react';
import {
    Table,
    Button,
    Input,
    message,
    Modal,
    Form,
    Row,
    Col,
    Select,
    Space,
    List,
    Popconfirm,
} from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import axios from 'axios';
import type { ColumnsType } from 'antd/es/table';

interface Assistant {
    key: string;
    id: number;
    fullName: string;
    email: string;
    phoneNumber: string;
    password: string;
    classes?: ClassInfo[];
}

interface ClassInfo {
    id: number;
    className: string;
    gradeLevel: string;
}

const { Option } = Select;

const TaTable = () => {
    // State 
    const [assistants, setAssistants] = useState<Assistant[]>([]);
    const [classes, setClasses] = useState<ClassInfo[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredAssistants, setFilteredAssistants] = useState<Assistant[]>([]);
    const [isAdjustModalVisible, setIsAdjustModalVisible] = useState(false);
    const [selectedAssistant, setSelectedAssistant] = useState<Assistant | null>(null);
    const [formAdjust] = Form.useForm();
    const [formAssignClass] = Form.useForm();
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [formAdd] = Form.useForm();

    const fetchAssistants = async () => {
        try {
            const response = await axios.get('http://localhost:8000/get-assistant-info');
            const data = response.data;
            const formattedAssistants: Assistant[] = data.map((assistant: any) => ({
                key: assistant.id.toString(),
                id: assistant.id,
                fullName: assistant.fullName,
                email: assistant.email,
                phoneNumber: assistant.phoneNumber,
                password: assistant.password,
                classes: assistant.classes || [],
            }));
            setAssistants(formattedAssistants);
            setFilteredAssistants(formattedAssistants);
        } catch (error) {
            console.error('Error fetching assistants:', error);
            message.error('Failed to fetch assistant data.');
        }
    };

    const fetchClasses = async () => {
        try {
            const response = await axios.get('http://localhost:8000/get-class-info');
            setClasses(response.data);
        } catch (error) {
            console.error('Error fetching classes:', error);
            message.error('Failed to fetch class data.');
        }
    };

    useEffect(() => {
        fetchAssistants();
        fetchClasses();
    }, []);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        const searchFiltered = assistants.filter((assistant) =>
            assistant.fullName.toLowerCase().includes(e.target.value.toLowerCase())
        );
        setFilteredAssistants(searchFiltered);
    };

    const showAddModal = () => {
        setIsAddModalVisible(true);
    };

    const handleAddModalCancel = () => {
        setIsAddModalVisible(false);
        formAdd.resetFields();
    };

    const handleAddModalOk = async () => {
        try {
            const values = await formAdd.validateFields();
            await axios.post('http://localhost:8000/assistant-post-crud', {
                fullName: values.fullName,
                email: values.email,
                phoneNumber: values.phoneNumber,
                password: values.password,
            });

            message.success('Thêm trợ giảng thành công!');
            await fetchAssistants();
            handleAddModalCancel();
        } catch (error: any) {
            console.error('Error adding assistant:', error);
            if (!error.errorFields) {
                message.error('Không thể thêm trợ giảng.');
            }
        }
    };

    const showAdjustModal = (assistant: Assistant) => {
        setSelectedAssistant(assistant);
        setIsAdjustModalVisible(true);

        formAdjust.setFieldsValue({
            fullName: assistant.fullName,
            email: assistant.email,
            phoneNumber: assistant.phoneNumber,
        });
    };

    const handleAdjustModalCancel = () => {
        setIsAdjustModalVisible(false);
        setSelectedAssistant(null);
        formAdjust.resetFields();
        formAssignClass.resetFields();
    };

    const handleAdjustModalOk = async () => {
        try {
            const values = await formAdjust.validateFields();
            if (!selectedAssistant) {
                message.error('Không tìm thấy trợ giảng để cập nhật.');
                return;
            }

            await axios.put(
                `http://localhost:8000/assistant-update-crud/${selectedAssistant.id}`,
                values
            );
            message.success('Cập nhật thông tin trợ giảng thành công!');
            await fetchAssistants();
            handleAdjustModalCancel();
        } catch (error) {
            console.error('Error updating assistant:', error);
            message.error('Không thể cập nhật trợ giảng.');
        }
    };

    const handleAssignClassOk = async () => {
        try {
            const values = await formAssignClass.validateFields();
            const { classId } = values;

            if (!selectedAssistant) {
                message.error('Không tìm thấy trợ giảng để gán lớp.');
                return;
            }

            await axios.post('http://localhost:8000/class-assistant-post-crud', {
                classId: Number(classId),
                assistantId: selectedAssistant.id,
            });

            message.success('Đã gán lớp cho trợ giảng thành công!');
            await fetchAssistants();

            handleAdjustModalCancel();
        } catch (error) {
            console.error('Error assigning class:', error);
            message.error('Không thể gán lớp cho trợ giảng.');
        }
    };

    const handleDeleteClassFromAssistant = async (classId: number) => {
        if (!selectedAssistant) {
            message.error('Không tìm thấy trợ giảng.');
            return;
        }

        try {
            await axios.post('http://localhost:8000/delete-class-assistant-crud', {
                classId: classId,
                assistantId: selectedAssistant.id,
            });

            message.success('Đã xóa lớp khỏi trợ giảng thành công!');
            await fetchAssistants();

            handleAdjustModalCancel();
        } catch (error) {
            console.error('Error removing class from assistant:', error);
            message.error('Không thể xóa lớp khỏi trợ giảng.');
        }
    };

    const handleDeleteAssistant = async (assistantId: number) => {
        try {
            await axios.post('http://localhost:8000/assistant-delete-crud', { id: assistantId });
            setAssistants((prev) => prev.filter((assistant) => assistant.id !== assistantId));
            setFilteredAssistants((prev) => prev.filter((assistant) => assistant.id !== assistantId));
            message.success('Đã xóa trợ giảng thành công!');
        } catch (error) {
            console.error('Error deleting assistant:', error);
            message.error('Không thể xóa trợ giảng. Vui lòng thử lại sau.');
        }
    };


    const columns: ColumnsType<Assistant> = [
        {
            title: 'ID Trợ Giảng',
            dataIndex: 'id',
            key: 'id',
            width: 100,
        },
        {
            title: 'Họ và Tên',
            dataIndex: 'fullName',
            key: 'fullName',
            width: 150,
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            width: 200,
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phoneNumber',
            key: 'phoneNumber',
            width: 150,
        },
        {
            title: 'Lớp',
            dataIndex: 'classes',
            key: 'classes',
            render: (classes: ClassInfo[]) =>
                classes && classes.length > 0
                    ? classes.map((cls) => cls.className).join(', ')
                    : '-',
            width: 200,
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button type="link" onClick={() => showAdjustModal(record)}>
                        Điều chỉnh
                    </Button>
                    <Popconfirm
                        title="Bạn có chắc chắn muốn xóa trợ giảng này?"
                        onConfirm={() => handleDeleteAssistant(record.id)}
                        okText="Xóa"
                        cancelText="Hủy"
                    >
                        <Button type="link" danger>
                            Xóa
                        </Button>
                    </Popconfirm>
                </Space>
            ),
            width: 200,
        },
    ];

    return (
        <div>
            <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
                <Col>
                    <Input
                        placeholder="Tìm kiếm trợ giảng"
                        prefix={<SearchOutlined />}
                        style={{ width: 300 }}
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                </Col>
                <Col>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={showAddModal}
                    >
                        Thêm Trợ Giảng
                    </Button>
                </Col>
            </Row>

            <Table
                columns={columns}
                dataSource={filteredAssistants}
                rowKey="key"
                pagination={{ pageSize: 5 }}
                tableLayout="fixed"
                scroll={{ x: 'max-content' }}
            />

            <Modal
                title="Thêm Trợ Giảng"
                visible={isAddModalVisible}
                onCancel={handleAddModalCancel}
                onOk={handleAddModalOk}
                destroyOnClose
            >
                <Form form={formAdd} layout="vertical">
                    <Form.Item
                        name="fullName"
                        label="Họ và Tên"
                        rules={[{ required: true, message: 'Họ và Tên không được để trống!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[
                            { required: true, message: 'Email không được để trống!' },
                            { type: 'email', message: 'Email không hợp lệ!' },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="phoneNumber"
                        label="Số điện thoại"
                        rules={[{ required: true, message: 'Số điện thoại không được để trống!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        label="Mật khẩu"
                        rules={[{ required: true, message: 'Mật khẩu không được để trống!' }]}
                    >
                        <Input.Password />
                    </Form.Item>
                </Form>
            </Modal>

            <Modal
                title={`Điều chỉnh thông tin trợ giảng: ${selectedAssistant?.fullName}`}
                visible={isAdjustModalVisible}
                onCancel={handleAdjustModalCancel}
                footer={[
                    <Button key="cancel" onClick={handleAdjustModalCancel}>
                        Hủy
                    </Button>,
                    <Button key="update" type="primary" onClick={handleAdjustModalOk}>
                        Cập nhật Thông tin
                    </Button>,
                ]}
                destroyOnClose
                width={800}
            >
                <Form form={formAdjust} layout="vertical" name="formAdjustAssistant">
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="fullName"
                                label="Họ và Tên"
                                rules={[{ required: true, message: 'Họ và Tên không được để trống!' }]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="email"
                                label="Email"
                                rules={[
                                    { required: true, message: 'Email không được để trống!' },
                                    { type: 'email', message: 'Email không hợp lệ!' },
                                ]}
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
                                rules={[{ required: true, message: 'Số điện thoại không được để trống!' }]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                    </Row>

                    <div style={{ marginTop: 24 }}>
                        <h3>Danh sách lớp hiện tại</h3>
                        <List
                            bordered
                            dataSource={selectedAssistant?.classes || []}
                            renderItem={(item) => (
                                <List.Item
                                    actions={[
                                        <Popconfirm
                                            title="Bạn có chắc chắn muốn xóa lớp này khỏi trợ giảng?"
                                            onConfirm={() => handleDeleteClassFromAssistant(item.id)}
                                            okText="Xóa"
                                            cancelText="Hủy"
                                        >
                                            <a href="#">Xóa</a>
                                        </Popconfirm>,
                                    ]}
                                >
                                    {item.className} - {item.gradeLevel}
                                </List.Item>
                            )}
                        />
                        <Button
                            type="dashed"
                            style={{ width: '100%', marginTop: 16 }}
                            icon={<PlusOutlined />}
                            onClick={() => {
                                Modal.confirm({
                                    title: 'Gán lớp mới',
                                    content: (
                                        <Form
                                            form={formAssignClass}
                                            layout="vertical"
                                            name="assignClassForm"
                                        >
                                            <Form.Item
                                                name="classId"
                                                label="Chọn lớp"
                                                rules={[{ required: true, message: 'Vui lòng chọn một lớp!' }]}
                                            >
                                                <Select placeholder="Chọn lớp">
                                                    {classes
                                                        .filter(
                                                            (cls) =>
                                                                !selectedAssistant?.classes?.some(
                                                                    (ac) => ac.id === cls.id
                                                                )
                                                        )
                                                        .map((cls) => (
                                                            <Option key={cls.id} value={cls.id}>
                                                                {cls.className}
                                                            </Option>
                                                        ))}
                                                </Select>
                                            </Form.Item>
                                        </Form>
                                    ),
                                    onOk: handleAssignClassOk,
                                    onCancel: () => formAssignClass.resetFields(),
                                    okText: 'Gán',
                                    cancelText: 'Hủy',
                                });
                            }}
                        >
                            Thêm lớp mới
                        </Button>
                    </div>
                </Form>
            </Modal>
        </div>
    );
};

export default TaTable;
