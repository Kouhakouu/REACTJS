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
import http from '@/utils/customAxios';
import type { ColumnsType } from 'antd/es/table';

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

const { Option } = Select;

const TaTable: React.FC = () => {
    const [assistants, setAssistants] = useState<Assistant[]>([]);
    const [classes, setClasses] = useState<ClassInfo[]>([]);
    const [filtered, setFiltered] = useState<Assistant[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddModalVisible, setAddModalVisible] = useState(false);
    const [isAdjustModalVisible, setAdjustModalVisible] = useState(false);
    const [selectedAssistant, setSelectedAssistant] = useState<Assistant | null>(null);

    const [formAdd] = Form.useForm();
    const [formAdjust] = Form.useForm();
    const [formAssign] = Form.useForm();

    // Load all assistants + classes
    const fetchAssistants = async () => {
        try {
            const { data } = await http.get('/get-assistant-info');
            const arr: Assistant[] = data.map((a: any) => ({
                key: a.userId.toString(),
                id: a.userId,
                fullName: a.fullName,
                email: a.email,
                phoneNumber: a.phoneNumber,
                classes: a.classes || [],    // if your API returns classes
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

    // — Add Assistant —
    const openAdd = () => { setAddModalVisible(true); };
    const closeAdd = () => { setAddModalVisible(false); formAdd.resetFields(); };

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

    // — Adjust Assistant —
    const openAdjust = (a: Assistant) => {
        setSelectedAssistant(a);
        formAdjust.setFieldsValue({
            fullName: a.fullName,
            email: a.email,
            phoneNumber: a.phoneNumber,
        });
        setAdjustModalVisible(true);
    };
    const closeAdjust = () => {
        setSelectedAssistant(null);
        setAdjustModalVisible(false);
        formAdjust.resetFields();
        formAssign.resetFields();
    };

    const handleUpdateInfo = async () => {
        if (!selectedAssistant) return;
        try {
            const vals = await formAdjust.validateFields();
            await http.put(`/assistant-update-crud/${selectedAssistant.id}`, vals);
            message.success('Cập nhật trợ giảng thành công!');
            closeAdjust();
            fetchAssistants();
        } catch {
            message.error('Cập nhật thất bại.');
        }
    };

    // — Assign Class —
    const handleAssignClass = async () => {
        if (!selectedAssistant) return;
        try {
            const { classId } = await formAssign.validateFields();
            await http.post('/class-assistant-post-crud', {
                classId: Number(classId),
                assistantId: selectedAssistant.id,
            });
            message.success('Gán lớp thành công!');
            closeAdjust();
            fetchAssistants();
        } catch {
            message.error('Gán lớp thất bại.');
        }
    };

    // — Remove Class —
    const handleRemoveClass = async (classId: number) => {
        if (!selectedAssistant) return;
        try {
            await http.post('/delete-class-assistant-crud', {
                classId,
                assistantId: selectedAssistant.id,
            });
            message.success('Xóa lớp khỏi trợ giảng thành công!');
            closeAdjust();
            fetchAssistants();
        } catch {
            message.error('Xóa lớp thất bại.');
        }
    };

    // — Delete Assistant —
    const handleDelete = async (assistantId: number) => {
        try {
            await http.delete(`/assistant-delete-crud/${assistantId}`);
            message.success('Xóa trợ giảng thành công!');
            setAssistants(prev => prev.filter(a => a.id !== assistantId));
            setFiltered(prev => prev.filter(a => a.id !== assistantId));
        } catch {
            message.error('Xóa trợ giảng thất bại.');
        }
    };

    // Columns
    const columns: ColumnsType<Assistant> = [
        { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
        { title: 'Tên Trợ giảng', dataIndex: 'fullName', key: 'fullName', width: 150 },
        { title: 'Email', dataIndex: 'email', key: 'email', width: 200 },
        { title: 'Điện thoại', dataIndex: 'phoneNumber', key: 'phoneNumber', width: 140 },
        {
            title: 'Lớp',
            dataIndex: 'classes',
            key: 'classes',
            render: (clsList: ClassInfo[]) =>
                clsList && clsList.length
                    ? clsList.map(c => c.className).join(', ')
                    : '-',
            width: 200,
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (_, record) => (
                <Space>
                    <Button type="link" onClick={() => openAdjust(record)}>
                        Điều chỉnh
                    </Button>
                    <Popconfirm
                        title="Bạn có chắc chắn muốn xóa?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Xóa"
                        cancelText="Hủy"
                    >
                        <Button type="link" danger>
                            Xóa
                        </Button>
                    </Popconfirm>
                </Space>
            ),
            width: 140,
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

            {/* Điều chỉnh trợ giảng */}
            <Modal
                title={`Điều chỉnh: ${selectedAssistant?.fullName}`}
                visible={isAdjustModalVisible}
                onCancel={closeAdjust}
                footer={[
                    <Button key="cancel" onClick={closeAdjust}>Hủy</Button>,
                    <Button key="update" type="primary" onClick={handleUpdateInfo}>
                        Cập nhật
                    </Button>,
                ]}
                width={800}
                destroyOnClose
            >
                <Form form={formAdjust} layout="vertical">
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="fullName"
                                label="Họ và tên"
                                rules={[{ required: true, message: 'Vui lòng nhập họ và tên' }]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
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
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="phoneNumber"
                                label="Điện thoại"
                                rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                    </Row>

                    <div style={{ marginTop: 24 }}>
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
                        />

                        <Form form={formAssign} layout="inline" style={{ marginTop: 16 }}>
                            <Form.Item
                                name="classId"
                                rules={[{ required: true, message: 'Chọn lớp để gán' }]}
                            >
                                <Select placeholder="Chọn lớp" style={{ width: 200 }}>
                                    {classes
                                        .filter(c =>
                                            !selectedAssistant?.classes?.find(ac => ac.id === c.id)
                                        )
                                        .map(c => (
                                            <Option key={c.id} value={c.id}>
                                                {c.className}
                                            </Option>
                                        ))
                                    }
                                </Select>
                            </Form.Item>
                            <Form.Item>
                                <Button type="dashed" onClick={handleAssignClass}>
                                    Gán lớp mới
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>
                </Form>
            </Modal>
        </>
    );
};

export default TaTable;
