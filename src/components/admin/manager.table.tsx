'use client';

import React, { useState, useEffect } from 'react';
import { Table, Button, Input, message, Modal, Form, Space, Row, Col, Select } from 'antd';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { SearchOutlined } from '@ant-design/icons';
import axios from 'axios';

interface Manager {
    key: string;
    id: number;
    fullName: string;
    gradeLevel: string; // Mỗi quản lý sẽ có gradeLevel
    phoneNumber: string;
    email: string;
}

interface ClassInfo {
    key: string;
    id: number;
    teacherId: number;
    className: string;
    gradeLevel: string;
    startTime: string;
    endTime: string;
    weekday: number;
}

const ManagerTable = () => {
    const [expandedRowKeys, setExpandedRowKeys] = useState<React.Key[]>([]);
    const [managers, setManagers] = useState<Manager[]>([]);
    const [classes, setClasses] = useState<ClassInfo[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isManagerModalVisible, setIsManagerModalVisible] = useState(false);
    const [isClassModalVisible, setIsClassModalVisible] = useState(false);
    const [selectedManager, setSelectedManager] = useState<Manager | null>(null);
    const [formManager] = Form.useForm();
    const [formClass] = Form.useForm();

    const daysOfWeek = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật'];
    const timeSlots = ['Sáng', 'Chiều', 'Tối'];

    const fetchManagersAndClasses = async () => {
        await fetchManagers();
        await fetchClasses();
    };

    useEffect(() => {
        fetchManagersAndClasses();
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
            message.error('Failed to fetch manager data.');
        }
    };

    // Hàm fetch thông tin lớp học
    const fetchClasses = async () => {
        try {
            const response = await axios.get('http://localhost:8000/get-class-info');
            const data = response.data;
            const formattedClasses: ClassInfo[] = data.map((cls: any) => ({
                key: cls.id.toString(),
                id: cls.id,
                teacherId: cls.teacherId,
                className: cls.className,
                gradeLevel: cls.gradeLevel,
                startTime: cls.startTime,
                endTime: cls.endTime,
                weekday: cls.weekday,
            }));
            setClasses(formattedClasses);
        } catch (error) {
            console.error('Error fetching classes:', error);
            message.error('Failed to fetch class data.');
        }
    };

    const handleExpandRow = (managerId: number) => {
        const key = managerId.toString();
        if (expandedRowKeys.includes(key)) {
            setExpandedRowKeys(expandedRowKeys.filter(k => k !== key));
        } else {
            setExpandedRowKeys([...expandedRowKeys, key]);
        }
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const filteredManagers = managers.filter(manager =>
        manager.fullName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const formatTime = (timeStr: string): string => {
        const date = new Date(timeStr);
        const hours = date.getUTCHours();
        const minutes = date.getUTCMinutes();
        const hoursStr = hours.toString();
        const minutesStr = minutes < 10 ? `0${minutes}` : minutes.toString();
        return `${hoursStr}:${minutesStr}`;
    };

    const generateTimetable = (classes: ClassInfo[]): any[] => {
        const timetable: any[] = timeSlots.map(slot => ({
            key: slot,
            timeSlot: slot,
            ...daysOfWeek.reduce((acc, day) => {
                acc[day] = '';
                return acc;
            }, {} as any)
        }));

        classes.forEach(cls => {
            const dayIndex = cls.weekday - 2;
            if (dayIndex < 0 || dayIndex >= daysOfWeek.length) return;
            const day = daysOfWeek[dayIndex];

            const startHour = new Date(cls.startTime).getUTCHours();
            let slot = '';
            if (startHour >= 6 && startHour < 12) {
                slot = 'Sáng';
            } else if (startHour >= 12 && startHour < 18) {
                slot = 'Chiều';
            } else if (startHour >= 18 && startHour < 24) {
                slot = 'Tối';
            }

            if (slot) {
                const rowIndex = timeSlots.indexOf(slot);
                if (rowIndex !== -1) {
                    const formattedStartTime = formatTime(cls.startTime);
                    const formattedEndTime = formatTime(cls.endTime);
                    const classDisplay = `${cls.className} (${formattedStartTime}-${formattedEndTime})`;

                    if (timetable[rowIndex][day]) {
                        timetable[rowIndex][day] += `, ${classDisplay}`;
                    } else {
                        timetable[rowIndex][day] = classDisplay;
                    }
                }
            }
        });

        return timetable;
    };

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
            width: 100,
        },
        {
            title: 'Khối Quản lý',
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
            width: 300,
            render: (_, record) => (
                <Space size="middle">
                    <Button
                        type="link"
                        onClick={() => handleExpandRow(record.id)}
                    >
                        {expandedRowKeys.includes(record.key) ? 'Ẩn thời gian biểu' : 'Xem thông tin lớp học'}
                    </Button>
                    <Button
                        type="link"
                        onClick={() => showClassModal(record)}
                    >
                        Tạo lớp học mới
                    </Button>
                </Space>
            ),
        },
    ];

    const generateTimetableColumns = (): any[] => [
        {
            title: 'Thời gian',
            dataIndex: 'timeSlot',
            key: 'timeSlot',
            fixed: 'left',
            width: 100,
            render: (text: string) => <strong>{text}</strong>,
        },
        ...daysOfWeek.map(day => ({
            title: day,
            dataIndex: day,
            key: day,
            width: 120,
            render: (text: string) => text || '-',
        })),
    ];

    const expandedRowRender = (record: Manager) => {
        const managerClasses = classes.filter(cls => cls.gradeLevel === record.gradeLevel);
        const timetableData = generateTimetable(managerClasses);
        const timetableColumns = generateTimetableColumns();

        return (
            <Table
                columns={timetableColumns}
                dataSource={timetableData}
                pagination={false}
                size="small"
                bordered
                tableLayout="fixed"
                scroll={{ x: 'max-content' }}
            />
        );
    };

    const showClassModal = (manager: Manager) => {
        setSelectedManager(manager);
        setIsClassModalVisible(true);
    };

    const handleClassCancel = () => {
        setIsClassModalVisible(false);
        setSelectedManager(null);
        formClass.resetFields();
    };

    const handleClassOk = async () => {
        try {
            const values = await formClass.validateFields();
            const { classes: classList } = values;

            if (!selectedManager) {
                message.error('Không tìm thấy quản lý');
                return;
            }

            await axios.post('http://localhost:8000/class-post-CRUD', {
                managerId: selectedManager.id,
                classes: classList,
            });

            setIsClassModalVisible(false);
            message.success('Lớp học đã được tạo thành công!');
            fetchClasses();
        } catch (error) {
            console.error(error);
            message.error('Không thể tạo lớp học');
        }
    };

    return (
        <div>
            <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
                <Col >
                    <Input
                        placeholder="Tìm kiếm quản lý"
                        prefix={<SearchOutlined />}
                        style={{ width: 300 }}
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                </Col>
                <Col span={16} style={{ textAlign: 'right' }}>
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsManagerModalVisible(true)}>
                        Thêm quản lý
                    </Button>
                </Col>
            </Row>
            <Table<Manager>
                columns={managerColumns}
                dataSource={filteredManagers}
                expandedRowRender={expandedRowRender}
                expandedRowKeys={expandedRowKeys}
                onExpand={(expanded, record) => handleExpandRow(record.id)}
                rowKey="key"
                tableLayout="fixed"
                scroll={{ x: 'max-content' }}
            />

            {/* Modal tạo lớp học */}
            <Modal
                title={`Tạo lớp học cho Quản lý ${selectedManager?.fullName}`}
                visible={isClassModalVisible}
                onCancel={handleClassCancel}
                onOk={handleClassOk}
                confirmLoading={false}
                destroyOnClose
            >
                <Form form={formClass} layout="vertical" name="classForm">
                    <Form.Item
                        name="classes"
                        label="Thông tin lớp"
                        rules={[{ required: true, message: 'Vui lòng nhập thông tin lớp' }]}
                    >
                        <Select
                            mode="tags"
                            placeholder="Nhập thông tin lớp học"
                            allowClear
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default ManagerTable;
