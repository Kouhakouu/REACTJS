"use client";

import React, { useEffect, useState, useContext } from 'react';
import Link from 'next/link';
import { Typography, Row, Col, Card, Statistic, List, Tag, Avatar, Spin } from 'antd';
import { BookOutlined, CalendarOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { AuthContext } from '@/library/authContext';
import { formatWeekday, formatTime } from '@/utils/formatDate';

const { Title, Text } = Typography;

interface ClassSummary {
    id: number;
    className: string;
    gradeLevel: string;
    lessonsCount: number;
    schedule: { study_day: string; start_time: string; end_time: string } | null;
}

export default function StudentDashboard() {
    const { user, token } = useContext(AuthContext);
    const [classes, setClasses] = useState<ClassSummary[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!token) { setLoading(false); return; }

        fetch(`${process.env.NEXT_PUBLIC_BACKEND_PORT}/student/classes`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(r => r.json())
            .then(data => Array.isArray(data) && setClasses(data))
            .catch(() => { })
            .finally(() => setLoading(false));
    }, [token]);

    // Tính tỉ lệ chuyên cần không cần thêm endpoint mới — để thống kê sau khi có dữ liệu lesson
    const classesWithSchedule = classes.filter(c => c.schedule);

    return (
        <div>
            <div style={{ marginBottom: 24 }}>
                <Title level={2} style={{ margin: 0 }}>Xin chào, {user?.fullName ?? 'Học sinh'}!</Title>
                <Text type="secondary">Chúc bạn một ngày học tập thật hiệu quả.</Text>
            </div>

            {loading ? (
                <Spin size="large" style={{ display: 'block', marginTop: 40 }} />
            ) : (
                <>
                    <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                        <Col xs={24} sm={8}>
                            <Card bordered={false} style={{ background: '#e6f4ff' }}>
                                <Statistic
                                    title="Lớp đang học"
                                    value={classes.length}
                                    prefix={<BookOutlined style={{ color: '#1677ff' }} />}
                                />
                            </Card>
                        </Col>
                        <Col xs={24} sm={8}>
                            <Card bordered={false} style={{ background: '#f6ffed' }}>
                                <Statistic
                                    title="Tổng số buổi học"
                                    value={classes.reduce((sum, c) => sum + c.lessonsCount, 0)}
                                    prefix={<CalendarOutlined style={{ color: '#52c41a' }} />}
                                />
                            </Card>
                        </Col>
                        <Col xs={24} sm={8}>
                            <Card bordered={false} style={{ background: '#fff2e8' }}>
                                <Statistic
                                    title="Lớp có lịch học"
                                    value={classesWithSchedule.length}
                                    suffix={`/ ${classes.length}`}
                                    prefix={<CheckCircleOutlined style={{ color: '#fa541c' }} />}
                                />
                            </Card>
                        </Col>
                    </Row>

                    <Row gutter={[16, 16]}>
                        <Col xs={24} lg={16}>
                            <Card title="Lịch học của tôi" bordered>
                                {classesWithSchedule.length === 0 ? (
                                    <Text type="secondary">Chưa có lịch học nào được xếp.</Text>
                                ) : (
                                    <List
                                        itemLayout="horizontal"
                                        dataSource={classesWithSchedule}
                                        renderItem={cls => (
                                            <List.Item
                                                actions={[
                                                    <Link key="detail" href={`/student/classes/${cls.id}`}>
                                                        <Tag color="blue" style={{ cursor: 'pointer' }}>Xem chi tiết</Tag>
                                                    </Link>
                                                ]}
                                            >
                                                <List.Item.Meta
                                                    avatar={
                                                        <Avatar style={{ backgroundColor: '#1677ff' }} icon={<CalendarOutlined />} />
                                                    }
                                                    title={<b>{cls.className}</b>}
                                                    description={
                                                        cls.schedule
                                                            ? `${formatWeekday(cls.schedule.study_day)} • ${formatTime(cls.schedule.start_time)} – ${formatTime(cls.schedule.end_time)}`
                                                            : ''
                                                    }
                                                />
                                            </List.Item>
                                        )}
                                    />
                                )}
                            </Card>
                        </Col>

                        <Col xs={24} lg={8}>
                            <Card title="Thông báo mới" bordered>
                                <Text type="secondary">Hiện tại chưa có thông báo mới nào từ trung tâm.</Text>
                            </Card>
                        </Col>
                    </Row>
                </>
            )}
        </div>
    );
}
