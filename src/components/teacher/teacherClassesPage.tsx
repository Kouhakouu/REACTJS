// pages/teacher/classes/index.tsx
'use client';

import React, { useEffect, useState, useContext } from 'react';
import Link from 'next/link';
import { AuthContext } from '@/library/authContext';
import { Row, Col, Card, Tag, Typography, Spin, Alert } from 'antd';
import { formatWeekday, formatTime } from '@/utils/formatDate';

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

export default function TeacherClassesPage() {
    // 1) Hooks must always run in the same order:
    const [hasMounted, setHasMounted] = useState<boolean>(false);
    const { token } = useContext(AuthContext);
    const [classes, setClasses] = useState<Class[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // 2) Mark when we've hit the client
    useEffect(() => {
        setHasMounted(true);
    }, []);

    // 3) Fetch data once we're on client and have a token
    useEffect(() => {
        if (!hasMounted) return;      // don't fetch on server
        if (!token) {
            setError('Không tìm thấy token, không thể gọi API!');
            setLoading(false);
            return;
        }

        const fetchClasses = async () => {
            setLoading(true);
            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_BACKEND_PORT}/teacher/classes`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                if (!Array.isArray(data)) {
                    throw new Error('Dữ liệu trả về không hợp lệ.');
                }
                setClasses(data);
            } catch (err: any) {
                console.error('Lỗi khi gọi API:', err);
                setError('Lỗi khi gọi API: ' + err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchClasses();
    }, [hasMounted, token]);

    // 4) Render guards
    if (!hasMounted) {
        return (
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '50vh',
                }}
            >
                <Spin size="large" />
            </div>
        );
    }

    if (loading) {
        return (
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '50vh',
                }}
            >
                <Spin size="large" />
            </div>
        );
    }

    if (error) {
        return (
            <Alert
                type="error"
                message={error}
                style={{ margin: '20px auto', maxWidth: 600 }}
            />
        );
    }

    // 5) Main UI
    return (
        <div style={{ padding: 20 }}>
            <Title level={2}>Danh sách lớp học</Title>

            {classes.length === 0 && (
                <Alert
                    message="Thông báo"
                    description="Bạn chưa được phân công lớp nào."
                    type="info"
                    showIcon
                    style={{ marginBottom: 16 }}
                />
            )}

            <Row gutter={[16, 16]}>
                {classes.map((cls) => (
                    <Col xs={24} sm={12} md={8} lg={6} key={cls.id}>
                        <Link
                            href={`/teacher/classes/${cls.id}`}
                            style={{ display: 'block', height: '100%' }}
                        >
                            <Card
                                hoverable
                                title={cls.className}
                                extra={<Tag color="blue">Lớp {cls.gradeLevel}</Tag>}
                                style={{ height: '100%', cursor: 'pointer' }}
                                bodyStyle={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
                            >
                                <div>
                                    <Text>
                                        Sĩ số: <strong>{cls.studentsCount}</strong>
                                    </Text>
                                </div>
                                <div style={{ marginTop: 12 }}>
                                    <Text>
                                        Lịch học:{' '}
                                        {cls.schedule ? (
                                            <Tag color="green" style={{ marginTop: 4 }}>
                                                {formatWeekday(cls.schedule.study_day)} •{' '}
                                                {formatTime(cls.schedule.start_time)} –{' '}
                                                {formatTime(cls.schedule.end_time)}
                                            </Tag>
                                        ) : (
                                            <Tag color="red" style={{ marginTop: 4 }}>
                                                Chưa có lịch học
                                            </Tag>
                                        )}
                                    </Text>
                                </div>
                            </Card>
                        </Link>
                    </Col>
                ))}
            </Row>
        </div>
    );
}
