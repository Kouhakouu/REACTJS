'use client';

import { useEffect, useState } from 'react';
import { Spin, Table, Typography, message, Switch } from 'antd'; // 1. Import Switch

const { Title } = Typography;

interface StudentPerformanceData {
    id: number;
    fullName: string;
    attendance: boolean;
    performance: {
        doneTask: number;
        totalScore: number;
        incorrectTasks: any;
        missingTasks: any;
        presentation: string;
        skills: string;
        comment: string;
    } | null;
}

const LessonStudentsPerformance = ({
    params,
}: {
    params: { id: string; lessonId: string };
}) => {
    const [data, setData] = useState<StudentPerformanceData[]>([]);
    const [loading, setLoading] = useState(false);

    // Hàm fetch dữ liệu (giữ nguyên logic cũ)
    const fetchPerformance = async () => {
        setLoading(true);
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_PORT}/assistant/classes/${params.id}/lessons/${params.lessonId}/students-performance`
            );
            const json = await res.json();
            setData(json);
        } catch (error) {
            message.error("Không thể tải thông tin hiệu suất học sinh!");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPerformance();
    }, [params.id, params.lessonId]);

    // 2. Thêm hàm xử lý khi bật/tắt điểm danh
    const handleAttendanceChange = async (studentId: number, checked: boolean) => {
        // Cập nhật Optimistic UI (Cập nhật giao diện ngay lập tức để mượt mà)
        const previousData = [...data];
        const newData = data.map(student =>
            student.id === studentId ? { ...student, attendance: checked } : student
        );
        setData(newData);

        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_PORT}/assistant/lessons/${params.lessonId}/students/${studentId}/attendance`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ attendance: checked }),
                }
            );

            if (!res.ok) {
                throw new Error('Update failed');
            }
            message.success('Đã cập nhật điểm danh');
        } catch (error) {
            // Nếu lỗi thì revert lại dữ liệu cũ
            setData(previousData);
            message.error("Lỗi khi cập nhật điểm danh!");
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <Title level={2}>Thông tin buổi học</Title>
            {loading ? (
                <Spin tip="Đang tải..." style={{ display: 'flex', justifyContent: 'center', padding: 20 }} />
            ) : (
                <Table
                    dataSource={data}
                    columns={[
                        { title: 'Họ và tên', dataIndex: 'fullName', key: 'fullName' },
                        {
                            title: 'Tham gia',
                            dataIndex: 'attendance',
                            key: 'attendance',
                            // 3. Cập nhật render sử dụng Switch
                            render: (value: boolean, record: StudentPerformanceData) => (
                                <Switch
                                    checked={value}
                                    onChange={(checked) => handleAttendanceChange(record.id, checked)}
                                    checkedChildren="Có mặt"
                                    unCheckedChildren="Vắng"
                                    style={{ minWidth: 90 }}
                                />
                            )
                        },
                        { title: 'Tổng số BTVN đã làm', dataIndex: ['performance', 'doneTask'], key: 'doneTask' },
                        { title: 'Tổng số BTVN làm đúng', dataIndex: ['performance', 'totalScore'], key: 'totalScore' },
                        {
                            title: 'Tên bài sai',
                            dataIndex: ['performance', 'incorrectTasks'],
                            key: 'incorrectTasks',
                            render: (value: string) =>
                                value ? value.replace(/"/g, '') : ''
                        },
                        {
                            title: 'Tên bài thiếu',
                            dataIndex: ['performance', 'missingTasks'],
                            key: 'missingTasks',
                            render: (value: string) =>
                                value ? value.replace(/"/g, '') : ''
                        },
                        { title: 'Trình bày', dataIndex: ['performance', 'presentation'], key: 'presentation' },
                        { title: 'Kỹ năng', dataIndex: ['performance', 'skills'], key: 'skills' },
                        { title: 'Nhận xét', dataIndex: ['performance', 'comment'], key: 'comment' },
                    ]}
                    rowKey="id"
                    pagination={{ pageSize: 10 }}
                />
            )}
        </div>
    );
};

export default LessonStudentsPerformance;