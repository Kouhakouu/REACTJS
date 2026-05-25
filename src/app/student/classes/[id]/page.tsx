"use client";

import { useEffect, useState, useContext } from 'react';
import { useParams } from 'next/navigation';
import { AuthContext } from '@/library/authContext';
import {
    Typography, Table, Tag, Spin, Alert, Card, Descriptions, Badge, Tooltip
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { CheckCircleOutlined, CloseCircleOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { formatDate, formatWeekday, formatTime } from '@/utils/formatDate';

const { Title } = Typography;

interface Performance {
    doneTask: number;
    totalScore: number;
    incorrectTasks: string;
    missingTasks: string;
    presentation: string;
    skills: string;
    comment: string;
}

interface Lesson {
    id: number;
    lessonContent: string;
    lessonDate: string;
    totalTaskLength: number;
    isLocked: boolean;
    attendance: boolean | null;
    performance: Performance | null;
}

interface ClassDetail {
    id: number;
    className: string;
    gradeLevel: string;
    schedule: { study_day: string; start_time: string; end_time: string } | null;
    lessons: Lesson[];
}

export default function StudentClassDetailPage() {
    const params = useParams();
    const { token } = useContext(AuthContext);
    const [classDetail, setClassDetail] = useState<ClassDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!token) {
            setError('Không tìm thấy token, vui lòng đăng nhập lại.');
            setLoading(false);
            return;
        }

        fetch(`${process.env.NEXT_PUBLIC_BACKEND_PORT}/student/classes/${params.id}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(r => {
                if (!r.ok) throw new Error(`Lỗi ${r.status}`);
                return r.json();
            })
            .then(data => setClassDetail(data))
            .catch(e => setError('Lỗi khi gọi API: ' + e.message))
            .finally(() => setLoading(false));
    }, [token, params.id]);

    if (loading) return <Spin size="large" style={{ display: 'block', marginTop: 50 }} />;
    if (error) return <Alert type="error" message={error} />;
    if (!classDetail) return null;

    const lockedCount = classDetail.lessons.filter(l => l.isLocked).length;
    const attendedCount = classDetail.lessons.filter(l => l.attendance === true).length;

    const columns: ColumnsType<Lesson> = [
        {
            title: 'STT',
            key: 'index',
            width: 60,
            render: (_: unknown, __: Lesson, index: number) => index + 1,
        },
        {
            title: 'Ngày học',
            dataIndex: 'lessonDate',
            key: 'lessonDate',
            render: (v: string) => v ? formatDate(v) : '—',
        },
        {
            title: 'Nội dung buổi học',
            dataIndex: 'lessonContent',
            key: 'lessonContent',
            render: (v: string) => v || <span style={{ color: '#bbb' }}>Chưa cập nhật</span>,
        },
        {
            title: 'Điểm danh',
            dataIndex: 'attendance',
            key: 'attendance',
            align: 'center',
            render: (v: boolean | null) => {
                if (v === null) return <Tag icon={<MinusCircleOutlined />} color="default">Chưa có</Tag>;
                return v
                    ? <Tag icon={<CheckCircleOutlined />} color="success">Có mặt</Tag>
                    : <Tag icon={<CloseCircleOutlined />} color="error">Vắng</Tag>;
            },
        },
        {
            title: 'Bài đã làm',
            key: 'doneTask',
            align: 'center',
            render: (_: unknown, record: Lesson) =>
                record.performance
                    ? `${record.performance.doneTask} / ${record.totalTaskLength}`
                    : '—',
        },
        {
            title: 'Điểm',
            key: 'totalScore',
            align: 'center',
            render: (_: unknown, record: Lesson) =>
                record.performance != null ? (
                    <Tag color="blue">{record.performance.totalScore}</Tag>
                ) : '—',
        },
        {
            title: 'Nhận xét',
            key: 'comment',
            render: (_: unknown, record: Lesson) => {
                const comment = record.performance?.comment;
                if (!comment) return '—';
                return (
                    <Tooltip title={comment}>
                        <span style={{ cursor: 'help' }}>
                            {comment.length > 40 ? comment.slice(0, 40) + '…' : comment}
                        </span>
                    </Tooltip>
                );
            },
        },
        {
            title: 'Trạng thái',
            dataIndex: 'isLocked',
            key: 'isLocked',
            align: 'center',
            render: (v: boolean) =>
                v ? <Badge status="success" text="Đã chốt" /> : <Badge status="processing" text="Đang cập nhật" />,
        },
    ];

    return (
        <div>
            <Title level={2}>{classDetail.className}</Title>

            <Card style={{ marginBottom: 24 }}>
                <Descriptions title="Thông tin lớp" column={{ xs: 1, sm: 2, md: 3 }}>
                    <Descriptions.Item label="Khối">{classDetail.gradeLevel}</Descriptions.Item>
                    <Descriptions.Item label="Lịch học">
                        {classDetail.schedule ? (
                            <Tag color="blue">
                                {formatWeekday(classDetail.schedule.study_day)} • {formatTime(classDetail.schedule.start_time)} – {formatTime(classDetail.schedule.end_time)}
                            </Tag>
                        ) : (
                            <Tag color="red">Chưa có lịch học</Tag>
                        )}
                    </Descriptions.Item>
                    <Descriptions.Item label="Tổng số buổi">{classDetail.lessons.length}</Descriptions.Item>
                    <Descriptions.Item label="Số buổi đã có mặt">{attendedCount}</Descriptions.Item>
                    <Descriptions.Item label="Buổi đã chốt kết quả">
                        {lockedCount} / {classDetail.lessons.length}
                    </Descriptions.Item>
                </Descriptions>
            </Card>

            <Title level={4}>Lịch sử buổi học</Title>
            <Table
                rowKey="id"
                columns={columns}
                dataSource={classDetail.lessons}
                pagination={false}
                scroll={{ x: true }}
                bordered
            />
        </div>
    );
}
