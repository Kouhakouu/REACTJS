'use client'

import { useEffect, useState, useContext } from "react";
import Link from "next/link";
import { AuthContext } from "@/library/authContext";
import { Card, Row, Col, Typography, Spin, Alert, Tag } from "antd";
import {
    FileTextOutlined,
    UsergroupAddOutlined,
    UserOutlined,
    CalendarOutlined
} from "@ant-design/icons";
import { formatWeekday, formatTime } from "@/utils/formatDate";

const { Title, Text } = Typography;

interface ClassSchedule {
    study_day: string;
    start_time: string;
    end_time: string;
}

interface Class {
    id: number;
    className: string;
    gradeLevel: string;
    studentsCount: number;
    schedule: ClassSchedule | null;
}

const ManagerManagingPage = () => {
    const { token } = useContext(AuthContext);
    const [classes, setClasses] = useState<Class[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);


    useEffect(() => {
        if (!token) {
            setLoading(false);
            setError("Authentication token not found.");
            return;
        }

        setLoading(true);
        setError(null);

        fetch("http://localhost:8000/manager/classes", {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => {
                if (!res.ok) {
                    return res.json().then(errData => {
                        throw new Error(errData.message || `HTTP error! status: ${res.status}`);
                    }).catch(() => {
                        throw new Error(`HTTP error! status: ${res.status}`);
                    });
                }
                return res.json();
            })
            .then((data) => {
                if (Array.isArray(data)) {
                    setClasses(
                        data.map((cls) => ({
                            ...cls,
                            schedule: cls.classSchedule || null,
                        }))
                    );
                } else {
                    throw new Error("Invalid data format received for classes.");
                }
                setLoading(false);
            })
            .catch((err) => {
                console.error("Failed to fetch classes:", err);
                setError(`Không thể tải danh sách lớp: ${err.message}`);
                setLoading(false);
            });
    }, [token]);

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                <Spin size="large" />
            </div>
        );
    }

    if (error) {
        return <Alert message="Lỗi" description={error} type="error" showIcon />;
    }

    return (
        <div style={{ padding: "20px" }}>
            <Title level={2}>Danh Sách Lớp Quản Lý</Title>
            {classes.length === 0 && !loading && (
                <Alert message="Thông báo" description="Không có lớp nào được quản lý." type="info" showIcon />
            )}
            <Row gutter={[16, 16]}>
                {classes.map((cls) => (
                    <Col xs={24} sm={12} md={8} lg={6} key={cls.id}>
                        <Card
                            title={cls.className}
                            bordered
                        >
                            {/* Sĩ số Section */}
                            <div style={{ marginBottom: '10px' }}>
                                <Text>
                                    <UsergroupAddOutlined style={{ marginRight: 8 }} /> Sĩ số: {cls.studentsCount}
                                </Text>
                                <br />
                                <Text>
                                    <Link href={`/manager/managing/${cls.id}`}>
                                        <UserOutlined style={{ marginRight: 8 }} /> Xem danh sách học sinh
                                    </Link>
                                </Text>
                            </div>

                            <div style={{ marginBottom: '10px' }}>
                                <Text>
                                    <FileTextOutlined style={{ marginRight: 8 }} /> Lịch học:{" "}
                                    {cls.schedule ? (
                                        <Tag color="green">
                                            {formatWeekday(cls.schedule.study_day)}, {formatTime(cls.schedule.start_time)} - {formatTime(cls.schedule.end_time)}
                                        </Tag>
                                    ) : (
                                        <Tag color="red">Chưa có lịch học</Tag>
                                    )}
                                </Text>
                                <br />
                                <Text>
                                    <Link href={`/manager/managing/${cls.id}/lessons`}>
                                        <CalendarOutlined style={{ marginRight: 8 }} /> Xem danh sách buổi học
                                    </Link>
                                </Text>
                            </div>
                        </Card>
                    </Col>
                ))}
            </Row>

        </div>
    );
};

export default ManagerManagingPage;