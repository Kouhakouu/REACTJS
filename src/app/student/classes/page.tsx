"use client";

import { useEffect, useState, useContext } from 'react';
import Link from 'next/link';
import { AuthContext } from '@/library/authContext';
import { Row, Col, Card, Tag, Typography, Spin, Alert } from 'antd';
import { BookOutlined } from '@ant-design/icons';
import { formatWeekday, formatTime } from '@/utils/formatDate';

const { Title, Text } = Typography;

interface ClassSchedule {
    study_day: string;
    start_time: string;
    end_time: string;
}

interface ClassSummary {
    id: number;
    className: string;
    gradeLevel: string;
    lessonsCount: number;
    schedule: ClassSchedule | null;
}

export default function StudentClassesPage() {
    const { token } = useContext(AuthContext);
    const [classes, setClasses] = useState<ClassSummary[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!token) {
            setError('Không tìm thấy token, vui lòng đăng nhập lại.');
            setLoading(false);
            return;
        }

        fetch(`${process.env.NEXT_PUBLIC_BACKEND_PORT}/student/classes`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(r => r.json())
            .then(data => Array.isArray(data) ? setClasses(data) : setError('Dữ liệu trả về không hợp lệ.'))
            .catch(e => setError('Lỗi khi gọi API: ' + e.message))
            .finally(() => setLoading(false));
    }, [token]);

    if (loading) return <Spin size="large" style={{ display: 'block', marginTop: 50 }} />;
    if (error) return <Alert type="error" message={error} />;

    return (
        <div>
            <Title level={2}>Lớp học của tôi</Title>

            {classes.length === 0 ? (
                <Alert type="info" message="Bạn chưa được xếp vào lớp học nào." />
            ) : (
                <Row gutter={[16, 16]}>
                    {classes.map(cls => (
                        <Col xs={24} sm={12} md={8} lg={6} key={cls.id}>
                            <Link href={`/student/classes/${cls.id}`} style={{ display: 'block' }}>
                                <Card
                                    hoverable
                                    title={cls.className}
                                    extra={<Tag color="blue">Khối {cls.gradeLevel}</Tag>}
                                    style={{ height: '100%' }}
                                >
                                    <Text><BookOutlined /> Số buổi học: {cls.lessonsCount}</Text>
                                    <br />
                                    <div style={{ marginTop: 8 }}>
                                        {cls.schedule ? (
                                            <Tag color="green">
                                                {formatWeekday(cls.schedule.study_day)} • {formatTime(cls.schedule.start_time)} – {formatTime(cls.schedule.end_time)}
                                            </Tag>
                                        ) : (
                                            <Tag color="red">Chưa có lịch học</Tag>
                                        )}
                                    </div>
                                </Card>
                            </Link>
                        </Col>
                    ))}
                </Row>
            )}
        </div>
    );
}
