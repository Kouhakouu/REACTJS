'use client';

import React, { useState, useEffect } from 'react';
import { Table, Button, Input, message, Modal, Form, Space, Row, Col, Select } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import axios from 'axios';
import type { ColumnsType } from 'antd/es/table';

interface Teacher {
    id: number;
    fullName: string;
}

interface ClassSchedule {
    id: number;
    study_day: string;
    start_time: string;
    end_time: string;
}

interface Assistant {
    id: number;
    fullName: string;
}

interface ClassInfo {
    key: string;
    id: number;
    className: string;
    gradeLevel: string;
    teacherId: number | null;
    teacherName: string;
    classScheduleId: number | null;
    classScheduleInfo: string;
    assistants: Assistant[];
}

const ClassTable = () => {
    //State
    const [classes, setClasses] = useState<ClassInfo[]>([]);
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [classSchedules, setClassSchedules] = useState<ClassSchedule[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredClasses, setFilteredClasses] = useState<ClassInfo[]>([]);
    const [isClassModalVisible, setIsClassModalVisible] = useState(false);
    const [isUpdateMode, setIsUpdateMode] = useState(false);
    const [currentClassId, setCurrentClassId] = useState<number | null>(null);
    const [formClass] = Form.useForm();

    const dayLabels: { [key: string]: string } = {
        Monday: 'Thứ hai',
        Tuesday: 'Thứ ba',
        Wednesday: 'Thứ tư',
        Thursday: 'Thứ năm',
        Friday: 'Thứ sáu',
        Saturday: 'Thứ bảy',
        Sunday: 'Chủ nhật',
    };

    // Format time
    const formatTime = (timeStr: string | null): string => {
        if (!timeStr) return '-';
        if (timeStr.includes('T')) {
            const timePart = timeStr.split('T')[1];
            const [hour, minute] = timePart.split(':');
            return `${hour}:${minute}`;
        }
        const [hour, minute] = timeStr.split(':');
        return `${hour}:${minute}`;
    };

    const createClassScheduleInfo = (schedule: ClassSchedule): string => {
        const dayVietnamese = dayLabels[schedule.study_day] || schedule.study_day;
        const startTime = formatTime(schedule.start_time);
        const endTime = formatTime(schedule.end_time);
        return `${dayVietnamese} - ${startTime} đến ${endTime}`;
    };

    const fetchClassesAndTeachersAndSchedules = async () => {
        await fetchClasses();
        await fetchTeachers();
        await fetchClassSchedules();
    };

    useEffect(() => {
        fetchClassesAndTeachersAndSchedules();
    }, []);

    const fetchClasses = async () => {
        try {
            const response = await axios.get('http://localhost:8000/get-class-info');
            const data = response.data;

            const formattedClasses: ClassInfo[] = data.map((cls: any) => ({
                key: cls.id.toString(),
                id: cls.id,
                className: cls.className,
                gradeLevel: cls.gradeLevel,
                teacherId: cls.classTeacher ? cls.classTeacher.teacher_id : null,
                teacherName: cls.classTeacher ? cls.classTeacher.teacher.fullName : 'Chưa có giáo viên',
                assistants: cls.assistants || [],
                classScheduleId: cls.classSchedule ? cls.classSchedule.id : null,
                classScheduleInfo: cls.classSchedule
                    ? createClassScheduleInfo(cls.classSchedule)
                    : 'Chưa xác định',
            }));

            setClasses(formattedClasses);
            setFilteredClasses(formattedClasses);
        } catch (error) {
            console.error('Error fetching classes:', error);
            message.error('Không thể lấy dữ liệu lớp học.');
        }
    };

    const fetchTeachers = async () => {
        try {
            const response = await axios.get('http://localhost:8000/get-teacher-info');
            const data = response.data;
            const formattedTeachers: Teacher[] = data.map((teacher: any) => ({
                id: teacher.id,
                fullName: teacher.fullName,
            }));
            setTeachers(formattedTeachers);
        } catch (error) {
            console.error('Error fetching teachers:', error);
            message.error('Không thể lấy dữ liệu giáo viên.');
        }
    };

    const fetchClassSchedules = async () => {
        try {
            const response = await axios.get('http://localhost:8000/get-class-schedule-info');
            const data = response.data;
            const formattedSchedules: ClassSchedule[] = data.map((schedule: any) => ({
                id: schedule.id,
                study_day: schedule.study_day,
                start_time: schedule.start_time,
                end_time: schedule.end_time,
            }));
            setClassSchedules(formattedSchedules);
        } catch (error) {
            console.error('Error fetching class schedules:', error);
            message.error('Không thể lấy dữ liệu ca học.');
        }
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchTerm(value);
        const searchFiltered = classes.filter(cls =>
            cls.className.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredClasses(searchFiltered);
    };

    const handleClassCancel = () => {
        setIsClassModalVisible(false);
        setIsUpdateMode(false);
        setCurrentClassId(null);
        formClass.resetFields();
    };

    const deleteClass = async (classId: number) => {
        try {
            await axios.post('http://localhost:8000/class-delete-crud', { id: classId });
            message.success('Xóa lớp học thành công!');
            setClasses(prevClasses => prevClasses.filter(cls => cls.id !== classId));
            setFilteredClasses(prevClasses => prevClasses.filter(cls => cls.id !== classId));
        } catch (error) {
            console.error('Error deleting class:', error);
            message.error('Không thể xóa lớp học. Vui lòng thử lại sau.');
        }
    };

    const handleDeleteClass = (classId: number) => {
        Modal.confirm({
            title: 'Bạn có chắc chắn muốn xóa lớp học này?',
            content: 'Hành động này không thể hoàn tác.',
            okText: 'Xóa',
            okType: 'danger',
            cancelText: 'Hủy',
            onOk: () => deleteClass(classId),
        });
    };

    const updateClass = async (classId: number, updatedData: any) => {
        try {
            await axios.post('http://localhost:8000/class-update-crud', {
                id: classId,
                ...updatedData,
            });
            message.success('Cập nhật lớp học thành công!');
            fetchClasses();
        } catch (error) {
            console.error('Error updating class:', error);
            message.error('Không thể cập nhật lớp học.');
        }
    };

    const handleClassOk = async () => {
        try {
            const values = await formClass.validateFields();
            const { className, gradeLevel, teacherId, classScheduleId } = values;

            const updatedData = {
                className,
                gradeLevel,
                teacherId,
                classScheduleId,
            };

            if (isUpdateMode && currentClassId !== null) {
                await updateClass(currentClassId, updatedData);
            } else {
                await axios.post('http://localhost:8000/class-post-crud', updatedData);
                message.success('Lớp học đã được tạo thành công!');
                await fetchClasses();
            }

            setIsClassModalVisible(false);
            setIsUpdateMode(false);
            setCurrentClassId(null);
            formClass.resetFields();
        } catch (error) {
            console.error(error);
            message.error(isUpdateMode ? 'Không thể cập nhật lớp học.' : 'Không thể tạo lớp học.');
        }
    };

    const columns: ColumnsType<ClassInfo> = [
        {
            title: 'ID Lớp',
            dataIndex: 'id',
            key: 'id',
            sorter: (a, b) => a.id - b.id,
            width: 100,
        },
        {
            title: 'Tên lớp',
            dataIndex: 'className',
            key: 'className',
            sorter: (a, b) => a.className.localeCompare(b.className),
            width: 150,
        },
        {
            title: 'Khối',
            dataIndex: 'gradeLevel',
            key: 'gradeLevel',
            sorter: (a, b) => a.gradeLevel.localeCompare(b.gradeLevel),
            width: 100,
        },
        {
            title: 'Tên giáo viên',
            dataIndex: 'teacherName',
            key: 'teacherName',
            sorter: (a, b) => a.teacherName.localeCompare(b.teacherName),
            width: 200,
        },
        {
            title: 'Trợ giảng',
            dataIndex: 'assistants',
            key: 'assistants',
            render: (assistants: Assistant[]) =>
                assistants && assistants.length > 0
                    ? assistants.map((assistant) => assistant.fullName).join(', ')
                    : 'Chưa có trợ giảng',
            width: 200,
        },
        {
            title: 'Ca học',
            dataIndex: 'classScheduleInfo',
            key: 'classScheduleInfo',
            sorter: (a, b) => a.classScheduleInfo.localeCompare(b.classScheduleInfo),
            width: 250,
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button type="link" onClick={() => showClassModal(record)}>
                        Cập nhật
                    </Button>
                    <Button type="link" danger onClick={() => handleDeleteClass(record.id)}>
                        Xóa
                    </Button>
                </Space>
            ),
        },
    ];

    const showClassModal = (classInfo: ClassInfo) => {
        formClass.setFieldsValue({
            className: classInfo.className,
            gradeLevel: classInfo.gradeLevel,
            teacherId: classInfo.teacherId,
            classScheduleId: classInfo.classScheduleId,
        });
        setIsUpdateMode(true);
        setCurrentClassId(classInfo.id);
        setIsClassModalVisible(true);
    };

    return (
        <div>
            <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
                <Col>
                    <Input
                        placeholder="Tìm kiếm lớp"
                        prefix={<SearchOutlined />}
                        style={{ width: 300 }}
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                </Col>
                <Col style={{ textAlign: 'right' }}>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => {
                            setIsUpdateMode(false);
                            setCurrentClassId(null);
                            setIsClassModalVisible(true);
                            formClass.resetFields();
                        }}
                    >
                        Thêm lớp học
                    </Button>
                </Col>
            </Row>
            <Table
                columns={columns}
                dataSource={filteredClasses}
                rowKey="key"
                pagination={{ pageSize: 5 }}
                tableLayout="fixed"
                scroll={{ x: 'max-content' }}
            />

            <Modal
                title={isUpdateMode ? "Cập Nhật Lớp Học" : "Tạo lớp học mới"}
                visible={isClassModalVisible}
                onCancel={handleClassCancel}
                onOk={handleClassOk}
                confirmLoading={false}
                destroyOnClose
            >
                <Form form={formClass} layout="vertical" name="classForm">
                    <Form.Item
                        name="className"
                        label="Tên lớp"
                        rules={[{ required: true, message: 'Vui lòng nhập tên lớp.' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="gradeLevel"
                        label="Khối"
                        rules={[{ required: true, message: 'Vui lòng nhập khối.' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="teacherId"
                        label="Giáo viên"
                        rules={[{ required: true, message: 'Vui lòng chọn giáo viên.' }]}
                    >
                        <Select placeholder="Chọn giáo viên">
                            {teachers.map(teacher => (
                                <Select.Option key={teacher.id} value={teacher.id}>
                                    {teacher.fullName}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="classScheduleId"
                        label="Ca học"
                        rules={[{ required: true, message: 'Vui lòng chọn ca học.' }]}
                    >
                        <Select placeholder="Chọn ca học">
                            {classSchedules.map(schedule => (
                                <Select.Option key={schedule.id} value={schedule.id}>
                                    {createClassScheduleInfo(schedule)}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default ClassTable;
