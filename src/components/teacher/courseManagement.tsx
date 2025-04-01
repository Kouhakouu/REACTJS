'use client'

import { useState, useEffect, useContext } from 'react';
import { Table, Button, Input, Modal, Form, message, Popconfirm, InputNumber, Spin } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { AuthContext } from '@/library/authContext';
import axios from 'axios';

interface Course {
    id: number;
    title: string;
    description: string;
    price: number;
    teacherId: number;
    teacher: string;
}

const CourseManagement = () => {
    const { user, token } = useContext(AuthContext);
    const teacherId = user?.id;
    const [courses, setCourses] = useState<Course[]>([]);
    const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
    const [searchText, setSearchText] = useState<string>('');
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [editingCourse, setEditingCourse] = useState<Course | null>(null);
    const [form] = Form.useForm();

    useEffect(() => {
        console.log("Token gửi lên:", token);
        console.log("TeacherId gửi lên:", teacherId);

        if (teacherId && token) {
            axios.get(`${process.env.NEXT_PUBLIC_BACKEND_PORT}/get-teacher-courses`, {
                headers: { Authorization: `Bearer ${token}` },
            })
                .then(response => {
                    console.log("Dữ liệu khóa học từ API:", response.data);
                    setCourses(response.data.courses);
                })
                .catch(error => {
                    console.error("Lỗi khi lấy danh sách khóa học:", error.response);
                    message.error("Không thể tải danh sách khóa học");
                });
        } else {
            console.warn("Thiếu token hoặc teacherId, không gửi request");
        }
    }, [teacherId, token]);


    useEffect(() => {
        setFilteredCourses(
            courses.filter(course => course.title.toLowerCase().includes(searchText.toLowerCase()))
        );
    }, [courses, searchText]);

    if (!user || !token) {
        return <Spin tip="Đang tải..." style={{ display: 'flex', justifyContent: 'center', marginTop: 50 }} />;
    }

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchText(e.target.value);
    };

    const handleAdd = () => {
        setEditingCourse(null);
        form.resetFields();
        setIsModalOpen(true);
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();

            const newCourse = {
                title: values.title,
                description: values.description,
                price: values.price,
                teacherId: teacherId,
            };

            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_BACKEND_PORT}/create-course`,
                newCourse,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setCourses([...courses, response.data.course]);
            message.success('Thêm khóa học thành công');
            setIsModalOpen(false);
        } catch (error) {
            message.error('Đã xảy ra lỗi khi tạo khóa học');
        }
    };


    const columns = [
        { title: 'Tên khóa học', dataIndex: 'title', key: 'title' },
        { title: 'Mô tả', dataIndex: 'description', key: 'description' },
        { title: 'Giá', dataIndex: 'price', key: 'price', render: (price: number) => `${price} VND` },
    ];

    return (
        <div style={{ padding: 20 }}>
            <h2>Quản lý Khóa Học</h2>
            <div style={{ marginBottom: 16, display: 'flex', gap: 8 }}>
                <Input placeholder="Tìm kiếm khóa học" value={searchText} onChange={handleSearch} style={{ width: 300 }} />
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>Thêm mới</Button>
            </div>
            <Table dataSource={filteredCourses} columns={columns} rowKey="id" />
            <Modal title="Thêm khóa học" open={isModalOpen} onOk={handleOk} onCancel={() => setIsModalOpen(false)}>
                <Form form={form} layout="vertical">
                    <Form.Item name="title" label="Tên khóa học" rules={[{ required: true, message: 'Vui lòng nhập tên khóa học!' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="description" label="Mô tả">
                        <Input.TextArea />
                    </Form.Item>
                    <Form.Item name="price" label="Giá khóa học" rules={[{ required: true, message: 'Vui lòng nhập giá khóa học!' }]}>
                        <InputNumber min={0} style={{ width: '100%' }} />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default CourseManagement;
