'use client';

import React, { useEffect, useState } from 'react';
import {
    Tabs,
    Typography,
    Collapse,
    Spin,
    Button,
    Modal,
    Form,
    Select,
    Input,
    message,
    Table,
    Popconfirm,
    Col,
} from 'antd';

const { Title } = Typography;
const { TabPane } = Tabs;
const { Panel } = Collapse;

interface Teacher {
    id: number;
    fullName: string;
    email: string;
    phoneNumber: string;
}

interface Assistant {
    id: number;
    fullName: string;
    email: string;
    phoneNumber: string;
}

interface ClassTeacher {
    teacher_id: number;
    teacher: Teacher;
}

interface ClassSchedule {
    id: number;
    study_day: string;
    start_time: string;
    end_time: string;
}

interface ClassInfo {
    id: number;
    className: string;
    gradeLevel: string;
    class_schedule_id: number;
    classSchedule: ClassSchedule;
    classTeacher: ClassTeacher;
    assistants: Assistant[];
}

const renderScheduleContent = (
    classData: ClassInfo[],
    day: string,
    timeSlot: string
) => {
    const filteredClasses = classData?.filter((classInfo) => {
        if (!classInfo.classSchedule) return false;

        const { study_day, start_time } = classInfo.classSchedule;
        const isMatchingDay = study_day === day;

        if (timeSlot === 'Sáng' && start_time < '11:00') {
            return isMatchingDay;
        }
        if (timeSlot === 'Chiều' && start_time >= '11:00' && start_time < '17:00') {
            return isMatchingDay;
        }
        if (timeSlot === 'Tối' && start_time >= '17:00') {
            return isMatchingDay;
        }

        return false;
    });

    if (filteredClasses.length === 0) {
        return <div>Không có lớp học</div>;
    }

    return (
        <div
            style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '16px',
            }}
        >
            {filteredClasses.map((classInfo) => (
                <div key={classInfo.id}>
                    <strong>
                        Lớp {classInfo.className} ({classInfo.classSchedule.start_time} -{' '}
                        {classInfo.classSchedule.end_time})
                    </strong>
                    <br />
                    <span>
                        Giáo viên: {classInfo.classTeacher?.teacher?.fullName || 'Chưa có'}
                    </span>
                    {classInfo.assistants && classInfo.assistants.length > 0 && (
                        <>
                            <br />
                            <span>
                                Trợ giảng: {classInfo.assistants.map((assistant: Assistant) => assistant.fullName).join(', ')}
                            </span>
                        </>
                    )}
                </div>
            ))}
        </div>
    );
};

const ScheduleTable: React.FC = () => {
    const [classData, setClassData] = useState<ClassInfo[]>([]);
    const [scheduleData, setScheduleData] = useState<ClassSchedule[]>([]);
    const [loading, setLoading] = useState(true);
    const [isManageModalVisible, setIsManageModalVisible] = useState(false);
    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [form] = Form.useForm();

    const timeSlots = ['Sáng', 'Chiều', 'Tối'];
    const daysOfWeek = [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday',
    ];

    const dayLabels: { [key: string]: string } = {
        Monday: 'Thứ 2',
        Tuesday: 'Thứ 3',
        Wednesday: 'Thứ 4',
        Thursday: 'Thứ 5',
        Friday: 'Thứ 6',
        Saturday: 'Thứ 7',
        Sunday: 'Chủ nhật',
    };

    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_PORT}/get-class-info`)
            .then((res) => res.json())
            .then((data: ClassInfo[]) => {
                setClassData(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching class info:', error);
                setLoading(false);
            });
        fetchSchedules();
    }, []);

    const fetchSchedules = () => {
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_PORT}/get-schedules`)
            .then((res) => res.json())
            .then((data: ClassSchedule[]) => {
                setScheduleData(data);
            })
            .catch((error) => {
                console.error('Error fetching schedules:', error);
            });
    };

    const handleCreateOrEditSchedule = async (values: any) => {
        try {
            if (isEditMode && editingId !== null) {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_BACKEND_PORT}/edit-schedule/${editingId}`,
                    {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(values),
                    }
                );
                if (response.ok) {
                    message.success('Cập nhật ca học thành công!');
                } else {
                    throw new Error('Failed to update schedule');
                }
            } else {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_BACKEND_PORT}/create-schedule`,
                    {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(values),
                    }
                );
                if (response.ok) {
                    message.success('Tạo ca học mới thành công!');
                } else {
                    throw new Error('Failed to create schedule');
                }
            }

            setIsCreateModalVisible(false);
            form.resetFields();
            fetchSchedules();
        } catch (error) {
            console.error('Error creating or updating schedule:', error);
            message.error(
                isEditMode ? 'Cập nhật ca học thất bại!' : 'Tạo ca học mới thất bại!'
            );
        }
    };

    const handleDeleteSchedule = async (id: number) => {
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_PORT}/delete-schedule/${id}`,
                {
                    method: 'DELETE',
                }
            );
            if (response.ok) {
                message.success('Xóa ca học thành công!');
                fetchSchedules();
            } else {
                throw new Error('Failed to delete schedule');
            }
        } catch (error) {
            console.error('Error deleting schedule:', error);
            message.error('Xóa ca học thất bại!');
        }
    };

    const columns = [
        {
            title: 'Thứ',
            dataIndex: 'study_day',
            key: 'study_day',
            render: (day: string) => dayLabels[day] || day,
        },
        {
            title: 'Thời gian bắt đầu',
            dataIndex: 'start_time',
            key: 'start_time',
        },
        {
            title: 'Thời gian kết thúc',
            dataIndex: 'end_time',
            key: 'end_time',
        },
        {
            title: 'Hành động',
            key: 'actions',
            render: (_: any, record: ClassSchedule) => (
                <div style={{ display: 'flex', gap: '8px' }}>
                    <Button
                        type="link"
                        onClick={() => {
                            setIsEditMode(true);
                            setEditingId(record.id);
                            form.setFieldsValue(record);
                            setIsCreateModalVisible(true);
                        }}
                    >
                        Thay đổi
                    </Button>
                    <Popconfirm
                        title="Bạn có chắc muốn xóa ca học này?"
                        onConfirm={() => handleDeleteSchedule(record.id)}
                        okText="Có"
                        cancelText="Không"
                    >
                        <Button type="link" danger>
                            Xóa
                        </Button>
                    </Popconfirm>
                </div>
            ),
        },
    ];

    if (loading) {
        return <Spin style={{ display: 'block', margin: '50px auto' }} />;
    }

    return (
        <div style={{ width: '100%' }}>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '16px',
                }}
            >
                <Col></Col>
                <Button type="primary" onClick={() => setIsManageModalVisible(true)}>
                    Quản lý danh sách ca học
                </Button>
            </div>

            <Tabs defaultActiveKey="Monday" centered>
                {daysOfWeek.map((day) => (
                    <TabPane tab={dayLabels[day]} key={day}>
                        <Collapse accordion={false} style={{ width: '100%' }}>
                            {timeSlots.map((timeSlot) => (
                                <Panel header={`Ca ${timeSlot}`} key={timeSlot}>
                                    {renderScheduleContent(classData, day, timeSlot)}
                                </Panel>
                            ))}
                        </Collapse>
                    </TabPane>
                ))}
            </Tabs>

            <Modal
                title="Quản lý danh sách ca học"
                visible={isManageModalVisible}
                onCancel={() => setIsManageModalVisible(false)}
                footer={null}
                width={800}
            >
                <div
                    style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}
                >
                    <Button
                        type="primary"
                        onClick={() => {
                            setIsEditMode(false);
                            setEditingId(null);
                            setIsCreateModalVisible(true);
                        }}
                    >
                        Tạo ca học
                    </Button>
                </div>
                <Table
                    dataSource={scheduleData}
                    columns={columns}
                    rowKey="id"
                    pagination={{ pageSize: 5 }}
                />
            </Modal>

            <Modal
                title={isEditMode ? 'Cập nhật ca học' : 'Tạo ca học mới'}
                visible={isCreateModalVisible}
                onCancel={() => setIsCreateModalVisible(false)}
                onOk={() => form.submit()}
            >
                <Form form={form} onFinish={handleCreateOrEditSchedule} layout="vertical">
                    <Form.Item
                        label="Thứ"
                        name="study_day"
                        rules={[{ required: true, message: 'Vui lòng chọn thứ!' }]}
                    >
                        <Select placeholder="Chọn thứ">
                            {Object.keys(dayLabels).map((day) => (
                                <Select.Option value={day} key={day}>
                                    {dayLabels[day]}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="Thời gian bắt đầu"
                        name="start_time"
                        rules={[
                            { required: true, message: 'Vui lòng nhập thời gian bắt đầu!' },
                        ]}
                    >
                        <Input placeholder="HH:mm:ss" />
                    </Form.Item>
                    <Form.Item
                        label="Thời gian kết thúc"
                        name="end_time"
                        rules={[
                            { required: true, message: 'Vui lòng nhập thời gian kết thúc!' },
                        ]}
                    >
                        <Input placeholder="HH:mm:ss" />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default ScheduleTable;
