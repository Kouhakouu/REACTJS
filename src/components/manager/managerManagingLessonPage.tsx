// src/app/manager/managing/[id]/lessons/page.tsx
'use client'

import React, { useEffect, useState, useContext } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link'; // Import Link from next/link
import { AuthContext } from '@/library/authContext';
import { List, Spin, Alert, Typography, Button, Modal, Form, DatePicker, Select, message } from 'antd';
import { ArrowLeftOutlined, EyeOutlined } from '@ant-design/icons'; // Added EyeOutlined
import { formatDate } from '@/utils/formatDate';

const { Title, Text } = Typography;

interface Lesson {
    id: number;
    lessonContent: string | null;
    totalTaskLength: number;
    lessonDate: string;
}

const ManagerManagingLessonPage = () => {
    const router = useRouter();
    const params = useParams();
    const { token } = useContext(AuthContext);
    const classId = params.id as string | undefined;
    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [className, setClassName] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();

    // Fetch Lessons
    const fetchLessons = async () => {
        if (!token) {
            setError("Yêu cầu xác thực.");
            setLoading(false);
            return;
        }
        if (!classId) {
            setError("Không tìm thấy ID lớp học.");
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`http://localhost:8000/manager/classes/${classId}/lessons`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Lỗi HTTP: ${response.status}`);
            }

            const data = await response.json();
            if (Array.isArray(data)) {
                setLessons(data);
            } else {
                throw new Error("Dữ liệu buổi học không hợp lệ.");
            }
        } catch (err) {
            console.error(`Failed to fetch lessons for class ${classId}:`, err);
        } finally {
            setLoading(false);
        }
    };

    // Sử dụng useEffect gọi fetchLessons
    useEffect(() => {
        fetchLessons();
    }, [classId, token]);

    const pageTitle = className ? `Danh sách Buổi học - ${className}` : `Danh sách Buổi học`;

    const handleCreateLesson = async () => {
        try {
            const values = await form.validateFields();
            const payload = {
                lessonDate: values.lessonDate,
                classId: classId,
            };

            const response = await fetch('http://localhost:8000/createLesson', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                message.success("Tạo buổi học thành công!");
                setIsModalOpen(false);
                form.resetFields();
                fetchLessons()
            } else {
                const errorData = await response.json();
                message.error("Lỗi: " + errorData.message);
            }
        } catch (error: any) {
            message.error("Có lỗi xảy ra: " + error.message);
        }
    };
    const showModal = () => {
        setIsModalOpen(true);
    };

    return (
        <>
            <Button type="primary" onClick={showModal}>
                Tạo buổi học
            </Button>

            <Modal
                title="Tạo mới buổi học"
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                onOk={handleCreateLesson}
                okText="Tạo"
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="lessonDate"
                        label="Ngày học"
                        rules={[{ required: true, message: "Vui lòng chọn ngày học" }]}
                    >
                        <DatePicker style={{ width: "100%" }} />
                    </Form.Item>
                </Form>
            </Modal>
            <div style={{ padding: '20px' }}>

                {loading && ( // Show loading for lessons specifically if needed
                    <div style={{ textAlign: 'center', padding: '20px' }}><Spin tip="Đang tải buổi học..." /></div>
                )}

                {error && (
                    <Alert message="Lỗi" description={error} type="error" showIcon style={{ marginBottom: '20px' }} />
                )}

                {!loading && !error && (
                    <List
                        itemLayout="horizontal"
                        dataSource={lessons}
                        locale={{ emptyText: 'Chưa có buổi học nào được ghi nhận cho lớp này.' }}
                        renderItem={lesson => {
                            const performanceUrl = `/manager/managing/${classId}/lessons/${lesson.id}/students-performance`;

                            return (
                                <List.Item
                                    key={lesson.id}
                                >
                                    <List.Item.Meta
                                        title={
                                            <Link href={performanceUrl} style={{ color: 'inherit' }}> {/* Wrap title in Link */}
                                                {`Buổi học ngày: ${formatDate(lesson.lessonDate)}`}
                                            </Link>
                                        }
                                        description={
                                            <Text type="secondary">
                                                Nội dung: {lesson.lessonContent || '(Chưa cập nhật)'}
                                            </Text>
                                        }
                                    />
                                </List.Item>
                            );
                        }}
                    />
                )}
            </div>
        </>
    );
};

export default ManagerManagingLessonPage;
