'use client';

import React, { useContext, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
    Alert, Card, Col, Progress, Row, Spin, Statistic, Table, Tag, Typography, Tooltip,
} from 'antd';
import {
    TeamOutlined, UserOutlined, BookOutlined, ReadOutlined, WarningOutlined,
} from '@ant-design/icons';
import { AuthContext } from '@/library/authContext';
import { formatWeekday, formatTime } from '@/utils/formatDate';

const { Text, Title } = Typography;

// ---------- Types ----------
interface UserCounts {
    teachers: number;
    students: number;
    assistants: number;
    managers: number;
}

interface ClassSummary {
    id: number;
    className: string;
    gradeLevel: string;
    studentsCount: number;
    lessonsCount: number;
    hasSchedule: boolean;
    schedule: { study_day: string; start_time: string; end_time: string } | null;
}

interface CourseCounts {
    total: number;
    published: number;
}

interface AdminStats {
    userCounts: UserCounts;
    classSummaries: ClassSummary[];
    courseCounts: CourseCounts;
}

// ---------- Horizontal bar chart ----------
function HorizontalBarChart({ data }: { data: ClassSummary[] }) {
    if (!data.length) {
        return <Alert type="info" message="Chưa có lớp học nào." showIcon />;
    }

    const sorted = [...data].sort((a, b) => b.studentsCount - a.studentsCount).slice(0, 12);
    const max = Math.max(...sorted.map(d => d.studentsCount), 1);

    return (
        <div>
            {sorted.map((c) => (
                <div key={c.id} style={{ display: 'flex', alignItems: 'center', marginBottom: 10, gap: 8 }}>
                    <Tooltip title={`Khối ${c.gradeLevel}`}>
                        <div
                            style={{
                                width: 130,
                                fontSize: 12,
                                textAlign: 'right',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                flexShrink: 0,
                                cursor: 'default',
                            }}
                        >
                            <Link href={`/dashboard/class`} style={{ color: 'inherit' }}>
                                {c.className}
                            </Link>
                        </div>
                    </Tooltip>

                    <div style={{ flex: 1, background: '#f0f0f0', borderRadius: 4, height: 18, overflow: 'hidden', minWidth: 0 }}>
                        <div
                            style={{
                                width: `${(c.studentsCount / max) * 100}%`,
                                height: '100%',
                                background: c.studentsCount === 0 ? '#d9d9d9' : '#1677ff',
                                borderRadius: 4,
                                transition: 'width 0.4s',
                            }}
                        />
                    </div>

                    <Text style={{ fontSize: 12, width: 36, textAlign: 'right', flexShrink: 0 }}>
                        {c.studentsCount} HS
                    </Text>
                </div>
            ))}
            {data.length > 12 && (
                <Text type="secondary" style={{ fontSize: 12 }}>
                    * Hiển thị top 12 lớp có sĩ số cao nhất.
                </Text>
            )}
        </div>
    );
}

// ---------- Main component ----------
const AdminDashboard = () => {
    const { token } = useContext(AuthContext);
    const [hasMounted, setHasMounted] = useState(false);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<AdminStats | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => setHasMounted(true), []);

    useEffect(() => {
        if (!hasMounted || !token) return;
        const fetchStats = async () => {
            setLoading(true);
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_PORT}/admin/stats`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const data: AdminStats = await res.json();
                setStats(data);
            } catch (e: unknown) {
                setError(`Lỗi tải dữ liệu: ${e instanceof Error ? e.message : String(e)}`);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, [hasMounted, token]);

    // Grade distribution computed client-side
    const gradeDistribution = useMemo(() => {
        if (!stats) return [];
        const map: Record<string, { classCount: number; studentCount: number }> = {};
        for (const c of stats.classSummaries) {
            if (!map[c.gradeLevel]) map[c.gradeLevel] = { classCount: 0, studentCount: 0 };
            map[c.gradeLevel].classCount++;
            map[c.gradeLevel].studentCount += c.studentsCount;
        }
        return Object.entries(map)
            .map(([grade, v]) => ({ grade, ...v }))
            .sort((a, b) => a.grade.localeCompare(b.grade, undefined, { numeric: true }));
    }, [stats]);

    const noScheduleCount = useMemo(
        () => stats?.classSummaries.filter(c => !c.hasSchedule).length ?? 0,
        [stats]
    );

    const tableColumns = [
        {
            title: 'Tên lớp',
            dataIndex: 'className',
            key: 'className',
            render: (name: string, row: ClassSummary) => (
                <Link href="/dashboard/class">{name}</Link>
            ),
        },
        {
            title: 'Khối',
            dataIndex: 'gradeLevel',
            key: 'gradeLevel',
            width: 70,
            render: (v: string) => <Tag color="blue">{v}</Tag>,
            sorter: (a: ClassSummary, b: ClassSummary) =>
                a.gradeLevel.localeCompare(b.gradeLevel, undefined, { numeric: true }),
        },
        {
            title: 'Sĩ số',
            dataIndex: 'studentsCount',
            key: 'studentsCount',
            width: 80,
            sorter: (a: ClassSummary, b: ClassSummary) => a.studentsCount - b.studentsCount,
        },
        {
            title: 'Số buổi',
            dataIndex: 'lessonsCount',
            key: 'lessonsCount',
            width: 90,
            sorter: (a: ClassSummary, b: ClassSummary) => a.lessonsCount - b.lessonsCount,
        },
        {
            title: 'Lịch học',
            key: 'schedule',
            width: 200,
            render: (_: unknown, row: ClassSummary) =>
                row.schedule ? (
                    <Tag color="green">
                        {formatWeekday(row.schedule.study_day)} • {formatTime(row.schedule.start_time)}–{formatTime(row.schedule.end_time)}
                    </Tag>
                ) : (
                    <Tag color="red" icon={<WarningOutlined />}>Chưa có lịch</Tag>
                ),
        },
    ];

    if (!hasMounted || loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                <Spin size="large" />
            </div>
        );
    }

    if (error || !stats) {
        return <Alert type="error" message={error ?? 'Không có dữ liệu'} showIcon style={{ margin: 20 }} />;
    }

    const { userCounts, classSummaries, courseCounts } = stats;
    const publishedPct = courseCounts.total > 0
        ? Math.round((courseCounts.published / courseCounts.total) * 100)
        : 0;

    return (
        <div style={{ padding: 20 }}>

            {/* ── Row 1: Summary cards ── */}
            <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
                <Col xs={12} sm={6}>
                    <Card>
                        <Statistic
                            title="Giáo viên"
                            value={userCounts.teachers}
                            prefix={<UserOutlined />}
                            valueStyle={{ color: '#1677ff' }}
                        />
                    </Card>
                </Col>
                <Col xs={12} sm={6}>
                    <Card>
                        <Statistic
                            title="Trợ giảng"
                            value={userCounts.assistants}
                            prefix={<TeamOutlined />}
                            valueStyle={{ color: '#722ed1' }}
                        />
                    </Card>
                </Col>
                <Col xs={12} sm={6}>
                    <Card>
                        <Statistic
                            title="Quản lý khối"
                            value={userCounts.managers}
                            prefix={<ReadOutlined />}
                            valueStyle={{ color: '#fa8c16' }}
                        />
                    </Card>
                </Col>
                <Col xs={12} sm={6}>
                    <Card>
                        <Statistic
                            title="Học sinh"
                            value={userCounts.students}
                            prefix={<BookOutlined />}
                            valueStyle={{ color: '#52c41a' }}
                        />
                    </Card>
                </Col>
            </Row>

            {/* ── Row 2: Bar chart + right panel ── */}
            <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>

                {/* Left: students per class */}
                <Col xs={24} lg={15}>
                    <Card
                        title="Sĩ số từng lớp"
                        extra={
                            noScheduleCount > 0 && (
                                <Tooltip title={`${noScheduleCount} lớp chưa được xếp lịch học`}>
                                    <Tag color="warning" icon={<WarningOutlined />}>
                                        {noScheduleCount} lớp chưa có lịch
                                    </Tag>
                                </Tooltip>
                            )
                        }
                    >
                        <HorizontalBarChart data={classSummaries} />
                    </Card>
                </Col>

                {/* Right: grade distribution + courses */}
                <Col xs={24} lg={9}>
                    <Row gutter={[0, 16]}>
                        <Col span={24}>
                            <Card title="Phân bổ theo khối">
                                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                                    <thead>
                                        <tr style={{ borderBottom: '1px solid #f0f0f0' }}>
                                            <th style={{ textAlign: 'left', paddingBottom: 8, fontWeight: 600 }}>Khối</th>
                                            <th style={{ textAlign: 'center', paddingBottom: 8, fontWeight: 600 }}>Lớp</th>
                                            <th style={{ textAlign: 'right', paddingBottom: 8, fontWeight: 600 }}>Học sinh</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {gradeDistribution.map(({ grade, classCount, studentCount }) => (
                                            <tr key={grade} style={{ borderBottom: '1px solid #fafafa' }}>
                                                <td style={{ padding: '6px 0' }}>
                                                    <Tag color="blue" style={{ margin: 0 }}>Khối {grade}</Tag>
                                                </td>
                                                <td style={{ textAlign: 'center', padding: '6px 0' }}>
                                                    <Text strong>{classCount}</Text>
                                                </td>
                                                <td style={{ textAlign: 'right', padding: '6px 0' }}>
                                                    <Text>{studentCount} HS</Text>
                                                </td>
                                            </tr>
                                        ))}
                                        {gradeDistribution.length === 0 && (
                                            <tr>
                                                <td colSpan={3} style={{ textAlign: 'center', color: '#8c8c8c', padding: 16 }}>
                                                    Chưa có dữ liệu
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </Card>
                        </Col>

                        <Col span={24}>
                            <Card title="Khóa học" extra={<Link href="/dashboard/courses">Xem tất cả</Link>}>
                                <div style={{ marginBottom: 12 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                                        <Text>Đã đăng</Text>
                                        <Text strong>{courseCounts.published} / {courseCounts.total}</Text>
                                    </div>
                                    <Progress
                                        percent={publishedPct}
                                        strokeColor="#52c41a"
                                        trailColor="#f0f0f0"
                                        format={(pct) => `${pct}%`}
                                    />
                                </div>
                                <div style={{ display: 'flex', gap: 16 }}>
                                    <Statistic
                                        title="Tổng số"
                                        value={courseCounts.total}
                                        valueStyle={{ fontSize: 20 }}
                                    />
                                    <Statistic
                                        title="Bản nháp"
                                        value={courseCounts.total - courseCounts.published}
                                        valueStyle={{ fontSize: 20, color: '#fa8c16' }}
                                    />
                                </div>
                            </Card>
                        </Col>
                    </Row>
                </Col>
            </Row>

            {/* ── Row 3: Classes table ── */}
            <Card title={<Title level={5} style={{ margin: 0 }}>Tổng quan lớp học</Title>}>
                <Table
                    dataSource={classSummaries}
                    columns={tableColumns}
                    rowKey="id"
                    size="small"
                    scroll={{ x: 'max-content' }}
                    pagination={{ pageSize: 10, showSizeChanger: false }}
                    sortDirections={['ascend', 'descend']}
                />
            </Card>
        </div>
    );
};

export default AdminDashboard;
