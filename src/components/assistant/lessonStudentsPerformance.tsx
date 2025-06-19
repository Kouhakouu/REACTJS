'use client';

import { useEffect, useState } from 'react';
import { Spin, Table, Typography, message } from 'antd';

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

    useEffect(() => {
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

        fetchPerformance();
    }, [params.id, params.lessonId]);

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
                            render: (value: boolean) => (value ? 'Có' : 'Không')
                        },
                        { title: 'Tổng số BTVN đã làm', dataIndex: ['performance', 'doneTask'], key: 'doneTask' },
                        { title: 'Tổng số BTVN làm đúng', dataIndex: ['performance', 'totalScore'], key: 'totalScore' },
                        {
                            title: 'Tên bài sai',
                            dataIndex: ['performance', 'incorrectTasks'],
                            key: 'incorrectTasks',
                            render: (value: string) =>
                                // nếu null/undefined thì trả về rỗng, còn thì loại bỏ hết dấu "
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
