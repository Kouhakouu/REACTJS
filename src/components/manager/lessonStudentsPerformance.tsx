'use client'

import React, { useEffect, useState, useContext } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { AuthContext } from '@/library/authContext';
import { Table, Spin, Alert, Typography, Tag, Space } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table'; // Import Table Columns type
import { formatDate } from '@/utils/formatDate';

const { Title, Text } = Typography;

// Interface for the detailed performance data returned by the API
interface PerformanceDetails {
    doneTask: number | null;
    totalScore: number | null;
    incorrectTasks: string | null; // Assuming string, adjust if array/object
    missingTasks: string | null; // Assuming string, adjust if array/object
    presentation: string | null;
    skills: string | null;
    comment: string | null;
}

// Interface for each student's data in the list
interface StudentPerformance {
    id: number;
    fullName: string;
    school: string | null;
    parentPhoneNumber: string | null;
    parentEmail: string | null;
    attendance: boolean;
    performance: PerformanceDetails | null; // Performance can be null if not recorded
}

const StudentPerformancePage = () => {
    const router = useRouter();
    const params = useParams();
    const { token } = useContext(AuthContext);

    // Get classId and lessonId from URL parameters
    const classId = params.id as string | undefined;
    const lessonId = params.lessonId as string | undefined; // Get lessonId

    const [studentPerformances, setStudentPerformances] = useState<StudentPerformance[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    // Optional: Fetch class/lesson details for header later if needed
    const [headerInfo, setHeaderInfo] = useState<{ className?: string; lessonDate?: string }>({});


    // Optional: Fetch Class/Lesson Details for Header
    useEffect(() => {
        if (!classId || !lessonId || !token) return;
        // You might need two separate fetches or a combined endpoint
        // Fetch Class Name (Example)
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_PORT}/manager/classes/${classId}`, { headers: { Authorization: `Bearer ${token}` } })
            .then(res => res.ok ? res.json() : Promise.reject('Failed class fetch'))
            .then(data => setHeaderInfo(prev => ({ ...prev, className: data?.className })))
            .catch(err => console.error("Error fetching class name:", err));

        // Fetch Lesson Date (Example - Assuming an endpoint like /lessons/{lessonId})
        // If your lesson API is nested like /classes/{classId}/lessons/{lessonId}, use that
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_PORT}/manager/lessons/${lessonId}`, { headers: { Authorization: `Bearer ${token}` } })
            .then(res => res.ok ? res.json() : Promise.reject('Failed lesson fetch'))
            .then(data => setHeaderInfo(prev => ({ ...prev, lessonDate: data?.lessonDate }))) // Assuming API returns lessonDate
            .catch(err => console.error("Error fetching lesson date:", err));

    }, [classId, lessonId, token]);


    // Fetch Student Performance Data
    useEffect(() => {
        if (!token) {
            setError("Yêu cầu xác thực."); setLoading(false); return;
        }
        if (!classId || !lessonId) {
            setError("Không tìm thấy ID lớp hoặc ID buổi học trong URL."); setLoading(false); return;
        }

        setLoading(true); setError(null); setStudentPerformances([]);

        const apiUrl = `${process.env.NEXT_PUBLIC_BACKEND_PORT}/manager/classes/${classId}/lessons/${lessonId}/students-performance`;

        fetch(apiUrl, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => {
                if (!res.ok) return res.json().then(errData => { throw new Error(errData.message || `Lỗi HTTP: ${res.status}`); }).catch(() => { throw new Error(`Lỗi HTTP: ${res.status}`); });
                return res.json();
            })
            .then((data) => {
                if (Array.isArray(data)) {
                    setStudentPerformances(data);
                } else {
                    throw new Error("Dữ liệu kết quả học sinh không hợp lệ.");
                }
                setLoading(false);
            })
            .catch((err) => {
                console.error(`Failed to fetch student performance for class ${classId}, lesson ${lessonId}:`, err);
                setError(`Không thể tải kết quả học sinh: ${err.message}`);
                setLoading(false);
            });

    }, [classId, lessonId, token]);

    const columns: ColumnsType<StudentPerformance> = [
        {
            title: 'STT',
            key: 'index',
            align: 'center',
            render: (_, __, index) => index + 1,
        },
        {
            title: 'Họ và Tên',
            dataIndex: 'fullName',
            key: 'fullName',
            fixed: 'left',
            sorter: (a, b) => a.fullName.localeCompare(b.fullName), // Enable sorting
        },
        {
            title: 'Email phụ huynh',
            dataIndex: 'parentEmail',
            key: 'parentEmail',
            align: 'center',
            render: (email: string | null) =>
                email
                    ? <a href={`mailto:${email}`}>{email}</a>
                    : <Text type="secondary">-</Text>
        },
        {
            title: 'Điểm danh',
            dataIndex: 'attendance',
            key: 'attendance',
            align: 'center',
            render: (attendance: boolean) => (
                <Tag color={attendance ? 'green' : 'red'}>
                    {attendance ? 'Có mặt' : 'Vắng'}
                </Tag>
            ),
            filters: [ // Enable filtering
                { text: 'Có mặt', value: true },
                { text: 'Vắng', value: false },
            ],
            onFilter: (value, record) => record.attendance === value,
        },
        {
            title: 'Tổng số BTVN đã làm',
            dataIndex: ['performance', 'doneTask'],
            key: 'doneTask',
            align: 'center',
            render: (done: number | null) => done !== null ? done : <Text type="secondary">N/A</Text>,
        },
        {
            title: 'Tổng số BTVN làm đúng',
            dataIndex: ['performance', 'totalScore'], // Access nested data
            key: 'totalScore',
            align: 'center',
            sorter: (a, b) => (a.performance?.totalScore ?? -1) - (b.performance?.totalScore ?? -1), // Handle nulls for sorting
            render: (score: number | null) => score !== null ? score : <Text type="secondary">N/A</Text>,
        },
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
                value ? value.replace(/"/g, '') : '-'
        },

        {
            title: 'Trình bày',
            dataIndex: ['performance', 'presentation'],
            key: 'presentation',
            render: (value: string | null) => value || <Text type="secondary">-</Text>,
        },
        {
            title: 'Kỹ năng',
            dataIndex: ['performance', 'skills'],
            key: 'skills',
            render: (value: string | null) => value || <Text type="secondary">-</Text>,
        },
        {
            title: 'Nhận xét',
            dataIndex: ['performance', 'comment'],
            key: 'comment',
            render: (comment: string | null) => comment || <Text type="secondary">-</Text>,
        },
    ];


    const pageTitle = `Kết quả học tập`;
    const subTitle = `${headerInfo.className ? headerInfo.className : `Lớp ${classId || 'N/A'}`}${headerInfo.lessonDate ? ` - Buổi ${formatDate(headerInfo.lessonDate)}` : ` - Buổi ${lessonId || 'N/A'}`}`; // Use formatDate if available

    return (
        <div style={{ padding: '20px' }}>

            {loading && (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '40px 0' }}>
                    <Spin size="large" tip="Đang tải kết quả học sinh..." />
                </div>
            )}

            {!loading && !error && (
                <Table
                    columns={columns}
                    dataSource={studentPerformances}
                    rowKey="id"
                    pagination={false}
                    locale={{ emptyText: 'Không có dữ liệu kết quả học tập cho buổi học này.' }}
                />
            )}
        </div>
    );
};

export default StudentPerformancePage;
