'use client';

import { useEffect, useState, useContext } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';   // không cần router.push thủ công nữa
import { AuthContext } from '@/library/authContext';
import { Row, Col, Card, Tag, Typography, Spin, Alert } from 'antd';
import { formatTime, formatWeekday } from '@/utils/formatDate';

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
    studentsCount: number;
    assignmentsCount: number;
    schedule: ClassSchedule | null;
}

export default function AssistantPage() {
    const { token } = useContext(AuthContext);
    const [classes, setClasses] = useState<ClassSummary[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!token) {
            setError('Không tìm thấy token, không thể gọi API!');
            setLoading(false);
            return;
        }

        fetch(`${process.env.NEXT_PUBLIC_BACKEND_PORT}/assistant/classes`, {
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
        <div style={{ padding: 20 }}>
            <Title level={2}>Danh sách lớp học</Title>

            <Row gutter={[16, 16]}>
                {classes.map(cls => (
                    <Col xs={24} sm={12} md={8} lg={6} key={cls.id}>
                        <Link href={`/assistant/classes/${cls.id}`} style={{ display: 'block' }}>
                            <Card
                                hoverable
                                title={cls.className}
                                extra={<Tag color="blue">Lớp {cls.gradeLevel}</Tag>}
                                style={{ height: '100%', cursor: 'pointer' }}
                            >
                                <Text>Sĩ số: {cls.studentsCount}</Text><br />
                                <Text>Số buổi: {cls.assignmentsCount}</Text><br />
                                <Text>Lịch học: {cls.schedule ? (
                                    <Tag color="green" style={{ marginTop: 8 }}>
                                        {formatWeekday(cls.schedule.study_day)} • {formatTime(cls.schedule.start_time)} – {formatTime(cls.schedule.end_time)}
                                    </Tag>
                                ) : (
                                    <Tag color="red" style={{ marginTop: 8 }}>Chưa có lịch học</Tag>
                                )}</Text><br />

                            </Card>
                        </Link>
                    </Col>
                ))}
            </Row>
        </div>
    );
}
