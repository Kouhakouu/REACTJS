'use client'
import React, { useState, useEffect, useContext } from "react";
import { Button, Modal, Form, DatePicker, Select, message } from "antd";
import { Card, Row, Col, Typography, Spin, Alert } from "antd";
import { AuthContext } from "@/library/authContext";

interface Class {
    id: number;
    className: string;
    gradeLevel: string;
    studentsCount: number;
    schedule: {
        study_day: string;
        start_time: string;
        end_time: string;
    } | null;
}

const ManagerLessonPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();
    const [classes, setClasses] = useState<Class[]>([]);
    const { Title } = Typography;
    const { token } = useContext(AuthContext);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Lấy danh sách lớp học từ API
        fetch("http://localhost:8000/get-class-info")
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            })
            .then((data) => {
                setClasses(data);
            })
            .catch((error) => {
                console.error("Error fetching class info:", error);
                message.error("Lỗi khi tải thông tin lớp học");
            });
    }, []);

    useEffect(() => {
        fetch("http://localhost:8000/manager/classes", {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => res.json())
            .then((data) => {
                if (Array.isArray(data)) {
                    setClasses(
                        data.map((cls) => ({
                            ...cls,
                            schedule: cls.classSchedule || null, // Nếu không có lịch, gán null
                        }))
                    );
                } else {
                    setError("Dữ liệu trả về không hợp lệ.");
                }
            })
            .catch((error) => setError("Lỗi khi gọi API: " + error.message))
    }, [token]);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleCreateLesson = async () => {
        try {
            const values = await form.validateFields();
            const payload = {
                lessonDate: values.lessonDate,
                classId: values.classId,
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
            } else {
                const errorData = await response.json();
                message.error("Lỗi: " + errorData.message);
            }
        } catch (error: any) {
            message.error("Có lỗi xảy ra: " + error.message);
        }
    };

    return (
        <>
            <div style={{ padding: "20px" }}>
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
                        <Form.Item
                            name="classId"
                            label="Chọn lớp học"
                            rules={[{ required: true, message: "Vui lòng chọn lớp học" }]}
                        >
                            <Select placeholder="Chọn lớp học">
                                {classes.map((cls) => (
                                    <Select.Option key={cls.id} value={cls.id}>
                                        {cls.className}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Form>
                </Modal>
            </div>

            <div style={{ padding: "20px" }}>
                <Title level={2}>Danh Sách Lớp Quản Lý</Title>
                <Row gutter={[16, 16]}>
                    {classes.map((cls) => (
                        <Col xs={24} sm={12} md={8} lg={6} key={cls.id}>
                            <Card title={`Lớp ${cls.className}`} bordered>
                            </Card>
                        </Col>
                    ))}
                </Row>

            </div>
        </>

    );
};

export default ManagerLessonPage;
