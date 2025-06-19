// components/class.table.tsx
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
    Col,
    Select
} from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import http from '@/utils/customAxios';

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
    userId: number;
    fullName: string;
}

interface ClassInfo {
    key: string;
    id: number;
    className: string;
    gradeLevel: string;
    teacherId: number | null;
    teacherName: string;
    assistants: Assistant[];
    classScheduleId: number | null;
    classScheduleInfo: string;
}

const { Option } = Select;

const dayLabels: Record<string, string> = {
    Monday: 'Thứ hai',
    Tuesday: 'Thứ ba',
    Wednesday: 'Thứ tư',
    Thursday: 'Thứ năm',
    Friday: 'Thứ sáu',
    Saturday: 'Thứ bảy',
    Sunday: 'Chủ nhật',
};

const formatTime = (t: string | null) => {
    if (!t) return '-';
    const [date, hm] = t.split('T').length > 1 ? t.split('T') : ['', t];
    const [h, m] = hm.split(':');
    return `${h}:${m}`;
};

const createClassScheduleInfo = (s: ClassSchedule) => {
    const day = dayLabels[s.study_day] || s.study_day;
    return `${day} — ${formatTime(s.start_time)} đến ${formatTime(s.end_time)}`;
};

const ClassTable: React.FC = () => {
    const [classes, setClasses] = useState<ClassInfo[]>([]);
    const [filtered, setFiltered] = useState<ClassInfo[]>([]);
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [classSchedules, setClassSchedules] = useState<ClassSchedule[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalVisible, setModalVisible] = useState(false);
    const [isUpdate, setIsUpdate] = useState(false);
    const [currentId, setCurrentId] = useState<number | null>(null);
    const [form] = Form.useForm();

    // fetch
    const fetchAll = () => {
        fetchClasses();
        fetchTeachers();
        fetchClassSchedules();
    };
    useEffect(fetchAll, []);

    const fetchClasses = async () => {
        try {
            const { data } = await http.get('/get-class-info');
            const arr = data.map((cls: any) => ({
                key: cls.id.toString(),
                id: cls.id,
                className: cls.className,
                gradeLevel: cls.gradeLevel,
                teacherId: cls.classTeacher?.teacher_id ?? null,
                teacherName: cls.classTeacher?.teacher.fullName ?? 'Chưa có',
                assistants: cls.assistants ?? [],
                classScheduleId: cls.classSchedule?.id ?? null,
                classScheduleInfo: cls.classSchedule
                    ? createClassScheduleInfo(cls.classSchedule)
                    : 'Chưa xác định'
            }));
            setClasses(arr);
            setFiltered(arr);
        } catch {
            message.error('Không thể lấy dữ liệu lớp.');
        }
    };

    const fetchTeachers = async () => {
        try {
            const { data } = await http.get('/get-teacher-info');
            setTeachers(
                data.map((t: any) => ({
                    id: t.userId,
                    fullName: t.fullName
                }))
            );
        } catch {
            message.error('Không thể lấy giáo viên.');
        }
    };

    const fetchClassSchedules = async () => {
        try {
            const { data } = await http.get('/get-class-schedule-info');
            setClassSchedules(data);
        } catch {
            message.error('Không thể lấy ca học.');
        }
    };

    // search
    const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const v = e.target.value;
        setSearchTerm(v);
        setFiltered(classes.filter(c =>
            c.className.toLowerCase().includes(v.toLowerCase())
        ));
    };

    // open modal (new or edit)
    const openNew = () => {
        form.resetFields();
        setIsUpdate(false);
        setCurrentId(null);
        setModalVisible(true);
    };
    const openEdit = (c: ClassInfo) => {
        form.setFieldsValue({
            className: c.className,
            gradeLevel: c.gradeLevel,
            teacherId: c.teacherId,
            classScheduleId: c.classScheduleId
        });
        setIsUpdate(true);
        setCurrentId(c.id);
        setModalVisible(true);
    };
    const closeModal = () => {
        form.resetFields();
        setModalVisible(false);
        setCurrentId(null);
    };

    // create or update
    const handleOk = async () => {
        try {
            const vals = await form.validateFields();
            const payload = {
                className: vals.className,
                gradeLevel: vals.gradeLevel,
                teacherId: vals.teacherId,
                classScheduleId: vals.classScheduleId
            };
            if (isUpdate && currentId != null) {
                await http.put(`/class-update-crud/${currentId}`, payload);
                message.success('Cập nhật lớp thành công!');
            } else {
                await http.post('/class-post-crud', payload);
                message.success('Tạo lớp mới thành công!');
            }
            closeModal();
            fetchClasses();
        } catch {
            message.error(isUpdate ? 'Cập nhật thất bại.' : 'Tạo mới thất bại.');
        }
    };

    // delete
    const handleDelete = async (id: number) => {
        try {
            await http.delete(`/class-delete-crud/${id}`);
            message.success('Xóa lớp thành công!');
            setClasses(prev => prev.filter(c => c.id !== id));
            setFiltered(prev => prev.filter(c => c.id !== id));
        } catch {
            message.error('Xóa thất bại.');
        }
    };

    const columns: ColumnsType<ClassInfo> = [
        { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
        { title: 'Tên lớp', dataIndex: 'className', key: 'className', width: 150 },
        { title: 'Khối', dataIndex: 'gradeLevel', key: 'gradeLevel', width: 100 },
        { title: 'Giáo viên', dataIndex: 'teacherName', key: 'teacherName', width: 200 },
        {
            title: 'Trợ giảng',
            dataIndex: 'assistants',
            key: 'assistants',
            render: list =>
                list.length ? list.map((a: Assistant) => a.fullName).join(', ') : 'Chưa có',
            width: 200
        },
        { title: 'Ca học', dataIndex: 'classScheduleInfo', key: 'classScheduleInfo', width: 250 },
        {
            title: 'Hành động',
            key: 'action',
            render: (_, rec) => (
                <Space>
                    <Button type="link" onClick={() => openEdit(rec)}>Cập nhật</Button>
                    <Button type="link" danger onClick={() => handleDelete(rec.id)}>Xóa</Button>
                </Space>
            )
        }
    ];

    return (
        <div>
            <Row justify="space-between" style={{ marginBottom: 16 }}>
                <Col>
                    <Input
                        placeholder="Tìm lớp"
                        value={searchTerm}
                        onChange={onSearch}
                        prefix={<SearchOutlined />}
                        style={{ width: 300 }}
                    />
                </Col>
                <Col>
                    <Button type="primary" icon={<PlusOutlined />} onClick={openNew}>
                        Thêm lớp
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
                title={isUpdate ? 'Cập nhật lớp' : 'Tạo lớp mới'}
                visible={isModalVisible}
                onOk={handleOk}
                onCancel={closeModal}
                destroyOnClose
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="className"
                        label="Tên lớp"
                        rules={[{ required: true, message: 'Nhập tên lớp' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="gradeLevel"
                        label="Khối"
                        rules={[{ required: true, message: 'Nhập khối' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="teacherId"
                        label="Giáo viên"
                        rules={[{ required: true, message: 'Chọn giáo viên' }]}
                    >
                        <Select placeholder="Chọn giáo viên">
                            {teachers.map(t => (
                                <Option key={t.id} value={t.id}>{t.fullName}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="classScheduleId"
                        label="Ca học"
                        rules={[{ required: true, message: 'Chọn ca học' }]}
                    >
                        <Select placeholder="Chọn ca học">
                            {classSchedules.map(cs => (
                                <Option key={cs.id} value={cs.id}>
                                    {createClassScheduleInfo(cs)}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default ClassTable;
