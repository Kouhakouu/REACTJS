'use client'

import React, { useEffect, useState, useContext } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { AuthContext } from '@/library/authContext';
import { Table, Spin, Typography, Switch, message, Descriptions, Button, Popconfirm, Tooltip } from 'antd';
import { LockOutlined, UnlockOutlined, MailOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { formatDate } from '@/utils/formatDate';

const { Title, Text } = Typography;

interface PerformanceDetails {
    doneTask: number | null;
    totalScore: number | null;
    incorrectTasks: string | null;
    missingTasks: string | null;
    presentation: string | null;
    skills: string | null;
    comment: string | null;
}

interface StudentPerformance {
    id: number;
    fullName: string;
    school: string | null;
    parentPhoneNumber: string | null;
    parentEmail: string | null;
    attendance: boolean;
    performance: PerformanceDetails | null;
}

interface HeaderInfo {
    className?: string;
    lessonDate?: string;
    lessonContent?: string;
    homeworkList?: string;
    previousHomeworkCount?: number;
    previousLessonContent?: string;
    isLocked?: boolean;
}

const StudentPerformancePage = () => {
    const router = useRouter();
    const params = useParams();
    const { token } = useContext(AuthContext);

    const classId = params.id as string | undefined;
    const lessonId = params.lessonId as string | undefined;

    const [studentPerformances, setStudentPerformances] = useState<StudentPerformance[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [headerInfo, setHeaderInfo] = useState<HeaderInfo>({});
    const [buttonLoading, setButtonLoading] = useState(false);
    const [emailLoading, setEmailLoading] = useState(false);

    // Fetch thông tin Header (Lớp và Buổi học)
    useEffect(() => {
        if (!classId || !lessonId || !token) return;

        fetch(`${process.env.NEXT_PUBLIC_BACKEND_PORT}/manager/classes/${classId}/lessons/${lessonId}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => {
                setHeaderInfo({
                    className: data.className,
                    lessonDate: data.lessonDate,
                    lessonContent: data.lessonContent,
                    homeworkList: data.homeworkList,
                    previousHomeworkCount: data.previousHomeworkCount,
                    previousLessonContent: data.previousLessonContent,
                    isLocked: data.isLocked
                });
            })
            .catch(err => console.error(err));
    }, [classId, lessonId, token]);

    // Fetch dữ liệu học sinh
    useEffect(() => {
        if (!token) { setError("Yêu cầu xác thực."); setLoading(false); return; }
        if (!classId || !lessonId) { setError("Thiếu ID."); setLoading(false); return; }

        setLoading(true); setError(null); setStudentPerformances([]);

        const apiUrl = `${process.env.NEXT_PUBLIC_BACKEND_PORT}/manager/classes/${classId}/lessons/${lessonId}/students-performance`;

        fetch(apiUrl, { headers: { Authorization: `Bearer ${token}` } })
            .then((res) => {
                if (!res.ok) throw new Error(`Lỗi HTTP: ${res.status}`);
                return res.json();
            })
            .then((data) => {
                if (Array.isArray(data)) setStudentPerformances(data);
                else throw new Error("Dữ liệu không hợp lệ.");
                setLoading(false);
            })
            .catch((err) => {
                setError(`Lỗi: ${err.message}`);
                setLoading(false);
            });
    }, [classId, lessonId, token]);

    // Xử lý thay đổi điểm danh
    const handleAttendanceChange = async (studentId: number, checked: boolean) => {
        const previousData = [...studentPerformances];
        const newData = studentPerformances.map(student =>
            student.id === studentId ? { ...student, attendance: checked } : student
        );
        setStudentPerformances(newData);

        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_PORT}/manager/lessons/${lessonId}/students/${studentId}/attendance`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ attendance: checked }),
                }
            );

            if (!res.ok) throw new Error('Update failed');
            message.success(`Đã cập nhật: ${checked ? 'Có mặt' : 'Vắng'}`);
        } catch (error) {
            setStudentPerformances(previousData);
            message.error("Lỗi khi cập nhật điểm danh!");
        }
    };

    // Chốt kết quả
    const handleToggleLock = async () => {
        setButtonLoading(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_PORT}/manager/lessons/${lessonId}/lock`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!res.ok) throw new Error('Action failed');

            const data = await res.json();

            setHeaderInfo(prev => ({ ...prev, isLocked: data.isLocked }));
            message.success(data.message);
        } catch (error) {
            console.error(error);
            message.error("Có lỗi xảy ra khi thay đổi trạng thái!");
        } finally {
            setButtonLoading(false);
        }
    };

    // Gửi email kết quả buổi học (bulk)
    const handleSendEmails = async () => {
        if (!token) {
            message.error("Bạn chưa đăng nhập.");
            return;
        }
        if (!classId || !lessonId) {
            message.error("Thiếu classId/lessonId.");
            return;
        }
        if (!headerInfo.isLocked) {
            message.warning("Vui lòng chốt kết quả trước khi gửi email.");
            return;
        }

        setEmailLoading(true);
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_PORT}/manager/classes/${classId}/lessons/${lessonId}/send-results-emails`,
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    }
                }
            );

            const data = await res.json().catch(() => ({}));

            console.log("send mail result:", data);

            if ((data?.stats?.failed ?? 0) > 0 && Array.isArray(data?.errors)) {
                // show lỗi đầu tiên cho nhanh
                message.error(`Gửi thất bại: ${data.errors[0]?.email} - ${data.errors[0]?.error}`);
            }

            if (!res.ok) {
                throw new Error(data?.message || `Lỗi HTTP: ${res.status}`);
            }

            const sent = data?.stats?.sent ?? 0;
            const failed = data?.stats?.failed ?? 0;
            const skipped = data?.stats?.skippedNoEmail ?? 0;

            message.success(`Đã gửi: ${sent} | Lỗi: ${failed} | Bỏ qua (thiếu email): ${skipped}`);
        } catch (error: any) {
            console.error(error);
            message.error(error?.message || "Lỗi khi gửi email!");
        } finally {
            setEmailLoading(false);
        }
    };

    const columns: ColumnsType<StudentPerformance> = [
        {
            title: 'STT',
            key: 'index',
            align: 'center',
            width: 60,
            render: (_, __, index) => index + 1,
        },
        {
            title: 'Tên học sinh',
            dataIndex: 'fullName',
            key: 'fullName',
            fixed: 'left',
            sorter: (a, b) => a.fullName.localeCompare(b.fullName),
            width: 200,
        },
        {
            title: 'Email phụ huynh',
            dataIndex: 'parentEmail',
            key: 'parentEmail',
            align: 'center',
            render: (email: string | null) => email ? <a href={`mailto:${email}`}>{email}</a> : <Text type="secondary">-</Text>
        },
        {
            title: 'Tham gia',
            dataIndex: 'attendance',
            key: 'attendance',
            align: 'center',
            width: 120,
            filters: [
                { text: 'Có mặt', value: true },
                { text: 'Vắng', value: false },
            ],
            onFilter: (value, record) => record.attendance === value,
            render: (attendance: boolean, record: StudentPerformance) => (
                <Switch
                    checked={attendance}
                    onChange={(checked) => handleAttendanceChange(record.id, checked)}
                    checkedChildren="Có mặt"
                    unCheckedChildren="Vắng"
                    style={{ minWidth: 90 }}
                />
            ),
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
            dataIndex: ['performance', 'totalScore'],
            key: 'totalScore',
            align: 'center',
            sorter: (a, b) => (a.performance?.totalScore ?? -1) - (b.performance?.totalScore ?? -1),
            render: (score: number | null) => score !== null ? score : <Text type="secondary">N/A</Text>,
        },
        {
            title: 'Tên bài sai',
            dataIndex: ['performance', 'incorrectTasks'],
            key: 'incorrectTasks',
            render: (value: string) => value ? value.replace(/"/g, '') : ''
        },
        {
            title: 'Tên bài thiếu',
            dataIndex: ['performance', 'missingTasks'],
            key: 'missingTasks',
            render: (value: string) => value ? value.replace(/"/g, '') : '-'
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

    const presentCount = studentPerformances.filter(student => student.attendance).length;

    return (
        <div style={{ padding: '20px', backgroundColor: '#fff' }}>

            {!loading && (
                <div style={{ marginBottom: 30 }}>
                    {/* Header + Nút Chốt Kết Quả + Nút Gửi Email */}
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: 20, position: 'relative' }}>
                        <Title level={3} style={{ textTransform: 'uppercase', margin: 0 }}>
                            {headerInfo.className ? `LỚP ${headerInfo.className}` : '...'} :
                            Ngày {headerInfo.lessonDate ? formatDate(headerInfo.lessonDate) : '...'}
                        </Title>

                        {/* Nút nằm bên phải */}
                        <div style={{ position: 'absolute', right: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
                            {/* Gửi email */}
                            <Tooltip title={!headerInfo.isLocked ? 'Vui lòng chốt kết quả trước khi gửi email' : 'Gửi email kết quả buổi học cho tất cả phụ huynh'}>
                                <Popconfirm
                                    title="Gửi email kết quả buổi học?"
                                    description="Hệ thống sẽ gửi email tới tất cả học sinh có email phụ huynh. Bạn chắc chắn muốn gửi?"
                                    onConfirm={handleSendEmails}
                                    okText="Gửi ngay"
                                    cancelText="Hủy"
                                    disabled={!headerInfo.isLocked}
                                >
                                    <Button
                                        type="primary"
                                        icon={<MailOutlined />}
                                        loading={emailLoading}
                                        disabled={!headerInfo.isLocked}
                                    >
                                        Gửi email
                                    </Button>
                                </Popconfirm>
                            </Tooltip>

                            {/* Chốt/Mở khóa */}
                            {headerInfo.isLocked ? (
                                <Popconfirm
                                    title="Mở khóa buổi học?"
                                    description="Trợ giảng sẽ có thể chỉnh sửa lại nội dung."
                                    onConfirm={handleToggleLock}
                                    okText="Mở khóa"
                                    cancelText="Hủy"
                                >
                                    <Button
                                        type="primary"
                                        danger
                                        icon={<LockOutlined />}
                                        loading={buttonLoading}
                                    >
                                        Đã chốt (Mở lại)
                                    </Button>
                                </Popconfirm>
                            ) : (
                                <Popconfirm
                                    title="Chốt kết quả buổi học?"
                                    description="Sau khi chốt, trợ giảng sẽ KHÔNG thể chỉnh sửa nội dung."
                                    onConfirm={handleToggleLock}
                                    okText="Chốt ngay"
                                    cancelText="Hủy"
                                >
                                    <Button
                                        type="primary"
                                        style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
                                        icon={<UnlockOutlined />}
                                        loading={buttonLoading}
                                    >
                                        Chốt kết quả
                                    </Button>
                                </Popconfirm>
                            )}
                        </div>
                    </div>

                    <Descriptions bordered column={3} size="middle" labelStyle={{ fontWeight: 'bold', backgroundColor: '#fafafa', width: '150px' }}>
                        <Descriptions.Item label="Nội dung bài học" span={3}>
                            <span style={{ fontSize: 16 }}>{headerInfo.lessonContent || "Chưa cập nhật"}</span>
                        </Descriptions.Item>
                        <Descriptions.Item label="Nội dung buổi trước">{headerInfo.previousLessonContent || "Không có"}</Descriptions.Item>
                        <Descriptions.Item label="Tổng số BTVN">{headerInfo.previousHomeworkCount ?? 0} ý</Descriptions.Item>
                        <Descriptions.Item label="BTVN tuần sau">{headerInfo.homeworkList || "Thầy gửi qua Zalo"}</Descriptions.Item>
                    </Descriptions>
                </div>
            )}

            {loading && (
                <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}>
                    <Spin size="large" tip="Đang tải dữ liệu..." />
                </div>
            )}

            {!loading && !error && (
                <Table
                    columns={columns}
                    dataSource={studentPerformances}
                    rowKey="id"
                    bordered
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showTotal: (total) => (
                            <Text strong>
                                Số học sinh có mặt: <span style={{ color: '#52c41a' }}>{presentCount}</span> / {total}
                            </Text>
                        )
                    }}
                />
            )}
        </div>
    );
};

export default StudentPerformancePage;