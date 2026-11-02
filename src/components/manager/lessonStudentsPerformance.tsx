'use client'

import React, { useEffect, useState, useContext } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { AuthContext } from '@/library/authContext';
import { Table, Spin, Typography, Switch, message, Descriptions, Button, Popconfirm, Tooltip, Input, InputNumber, Space, Grid, Alert, Tag } from 'antd';
import { LockOutlined, UnlockOutlined, MailOutlined, EditOutlined, SaveOutlined, FilePdfOutlined, RedoOutlined, SendOutlined } from '@ant-design/icons';
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
    // File PDF bài đã chấm do trợ giảng upload, được đính kèm khi gửi mail
    gradedFile: { url: string; name: string | null } | null;
    performance: PerformanceDetails | null;
}

interface HeaderInfo {
    className?: string;
    lessonDate?: string;
    lessonContent?: string;
    homeworkList?: string;
    previousHomeworkCount?: number;
    previousLessonContent?: string;
    nextHomework?: string;
    isLocked?: boolean;
}

interface InfoDraft {
    lessonContent: string;
    previousLessonContent: string;
    totalTaskLength: number | null;
    nextHomework: string;
}

// Học sinh gửi mail lỗi / bị bỏ qua vì thiếu email, do backend trả về
interface MailIssue {
    studentId: number;
    fullName: string;
    email: string | null;
    parentPhoneNumber: string | null;
    school: string | null;
    hasGradedFile?: boolean;
    reason?: string;
    error?: string;
}

interface MailReport {
    failed: MailIssue[];
    skipped: MailIssue[];
    // Lỗi làm dừng cả lượt gửi giữa chừng (vd lỗi server), các học sinh sau đó chưa được xử lý
    abortedMessage?: string;
}

type MailStatus = { status: 'sent' | 'failed' | 'skipped'; reason?: string; error?: string };

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));



const StudentPerformancePage = () => {
    const router = useRouter();
    const params = useParams();
    const { token } = useContext(AuthContext);
    const screens = Grid.useBreakpoint();
    // Số cột thông tin buổi học theo kích thước màn hình
    const descColumn = screens.lg ? 3 : screens.md ? 2 : 1;

    const classId = params.id as string | undefined;
    const lessonId = params.lessonId as string | undefined;

    const [studentPerformances, setStudentPerformances] = useState<StudentPerformance[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [headerInfo, setHeaderInfo] = useState<HeaderInfo>({});
    const [buttonLoading, setButtonLoading] = useState(false);
    const [emailLoading, setEmailLoading] = useState(false);
    const [emailProgress, setEmailProgress] = useState<string>('');
    const [mailReport, setMailReport] = useState<MailReport | null>(null);
    const [mailStatus, setMailStatus] = useState<Record<number, MailStatus>>({});
    const [sendingStudentId, setSendingStudentId] = useState<number | null>(null);
    const [resendingAll, setResendingAll] = useState(false);
    const [isEditingInfo, setIsEditingInfo] = useState(false);
    const [savingInfo, setSavingInfo] = useState(false);
    const [infoDraft, setInfoDraft] = useState<InfoDraft>({
        lessonContent: '', previousLessonContent: '', totalTaskLength: 0, nextHomework: '',
    });

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
                    nextHomework: data.nextHomework,
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

    // Chỉnh sửa thông tin buổi học (4 mục ở phần header)
    const startEditingInfo = () => {
        setInfoDraft({
            lessonContent: headerInfo.lessonContent || '',
            previousLessonContent: headerInfo.previousLessonContent || '',
            totalTaskLength: headerInfo.previousHomeworkCount ?? 0,
            nextHomework: headerInfo.nextHomework || '',
        });
        setIsEditingInfo(true);
    };

    const handleSaveLessonInfo = async () => {
        if (!classId || !lessonId) return;
        setSavingInfo(true);
        try {
            // Chỉ gửi những mục thực sự thay đổi
            const body: Record<string, unknown> = {};
            if (infoDraft.lessonContent !== (headerInfo.lessonContent || '')) {
                body.lessonContent = infoDraft.lessonContent;
            }
            if (infoDraft.previousLessonContent !== (headerInfo.previousLessonContent || '')) {
                body.previousLessonContent = infoDraft.previousLessonContent;
            }
            if (infoDraft.totalTaskLength !== null && infoDraft.totalTaskLength !== (headerInfo.previousHomeworkCount ?? 0)) {
                body.totalTaskLength = infoDraft.totalTaskLength;
            }
            if (infoDraft.nextHomework !== (headerInfo.nextHomework || '')) {
                body.nextHomework = infoDraft.nextHomework;
            }

            if (Object.keys(body).length === 0) {
                setIsEditingInfo(false);
                return;
            }

            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_PORT}/manager/classes/${classId}/lessons/${lessonId}`,
                {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                    body: JSON.stringify(body),
                }
            );
            const data = await res.json().catch(() => ({}));
            if (!res.ok) throw new Error(data.message || `Lỗi HTTP: ${res.status}`);

            setHeaderInfo(prev => ({
                ...prev,
                lessonContent: data.lessonContent,
                nextHomework: data.nextHomework,
                previousHomeworkCount: data.totalTaskLength,
                previousLessonContent: body.previousLessonContent !== undefined
                    ? (body.previousLessonContent as string)
                    : prev.previousLessonContent,
            }));
            setIsEditingInfo(false);
            message.success('Đã cập nhật thông tin buổi học');
        } catch (err: any) {
            message.error(err.message || 'Không thể cập nhật thông tin buổi học');
        } finally {
            setSavingInfo(false);
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

    // Gọi API gửi mail kết quả buổi học (query: offset/limit để gửi theo batch, hoặc studentId để gửi riêng 1 học sinh)
    const requestSendEmails = async (query: string) => {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_PORT}/manager/classes/${classId}/lessons/${lessonId}/send-results-emails?${query}`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            }
        );
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
            throw new Error(data?.message || `Lỗi HTTP: ${res.status}`);
        }
        return data;
    };

    // Cập nhật trạng thái mail của từng học sinh (cột "Gửi mail") theo kết quả 1 lần gọi API
    const applyMailResult = (data: any) => {
        setMailStatus(prev => {
            const next = { ...prev };
            (data?.sentStudentIds ?? []).forEach((id: number) => { next[id] = { status: 'sent' }; });
            (data?.errors ?? []).forEach((e: MailIssue) => {
                next[e.studentId] = { status: 'failed', reason: e.reason, error: e.error };
            });
            (data?.skippedStudents ?? []).forEach((s: MailIssue) => { next[s.studentId] = { status: 'skipped' }; });
            return next;
        });
    };

    // Gửi riêng mail cho 1 học sinh (dùng để gửi lại khi bị lỗi). Trả về true nếu gửi thành công.
    const handleSendSingleEmail = async (studentId: number, fullName: string, silent = false) => {
        if (!token || !classId || !lessonId) return false;

        setSendingStudentId(studentId);
        try {
            const data = await requestSendEmails(`studentId=${studentId}`);
            applyMailResult(data);

            const failure: MailIssue | undefined = data?.errors?.[0];
            if (failure) {
                // Giữ học sinh trong danh sách lỗi (cập nhật lý do mới) để quản lý thấy và gửi lại
                setMailReport(prev => {
                    const failed = prev?.failed ?? [];
                    const exists = failed.some(f => f.studentId === studentId);
                    return {
                        failed: exists ? failed.map(f => (f.studentId === studentId ? failure : f)) : [...failed, failure],
                        skipped: prev?.skipped ?? [],
                        abortedMessage: prev?.abortedMessage,
                    };
                });
                if (!silent) message.error(`Gửi mail cho ${fullName} thất bại: ${failure.reason || failure.error}`, 6);
                return false;
            }

            setMailReport(prev => prev && { ...prev, failed: prev.failed.filter(f => f.studentId !== studentId) });
            if (!silent) message.success(`Đã gửi mail cho phụ huynh ${fullName}`);
            return true;
        } catch (err: any) {
            if (!silent) message.error(`Gửi mail cho ${fullName} thất bại: ${err?.message || 'Lỗi không xác định'}`, 6);
            return false;
        } finally {
            setSendingStudentId(null);
        }
    };

    // Gửi lại lần lượt cho tất cả học sinh đang bị lỗi, nghỉ giữa các mail giống lúc gửi cả lớp
    const handleResendAllFailed = async () => {
        const targets = mailReport?.failed ?? [];
        if (targets.length === 0) return;

        setResendingAll(true);
        let ok = 0;
        try {
            for (let i = 0; i < targets.length; i++) {
                if (i > 0) await delay(5000);
                message.loading({
                    key: 'resend-failed-progress',
                    content: `Đang gửi lại ${i + 1}/${targets.length}: ${targets[i].fullName}`,
                    duration: 0,
                });
                if (await handleSendSingleEmail(targets[i].studentId, targets[i].fullName, true)) ok++;
            }
        } finally {
            setResendingAll(false);
        }

        const content = `Gửi lại xong: thành công ${ok}/${targets.length}`;
        if (ok === targets.length) message.success({ key: 'resend-failed-progress', content, duration: 5 });
        else message.warning({ key: 'resend-failed-progress', content: `${content}. Xem danh sách lỗi bên dưới.`, duration: 6 });
    };

    // Gửi email kết quả buổi học theo nhiều batch nhỏ
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
        setEmailProgress("Đang chuẩn bị gửi email...");
        setMailReport(null);
        setMailStatus({});

        const messageKey = "send-email-progress";

        // Mỗi request chỉ gửi 1 mail rồi nghỉ, vì gửi dồn dập bị bộ lọc spam của relay (MailBaby) chặn
        let offset = 0;
        const limit = 1;
        const delayBetweenEmailsMs = 5000;

        let totalSent = 0;
        let totalFailed = 0;
        let totalSkipped = 0;
        let totalNotSaved = 0;
        let totalWithGradedFile = 0;
        let totalStudents = 0;

        const allErrors: MailIssue[] = [];
        const allSkipped: MailIssue[] = [];

        try {
            while (true) {
                message.loading({
                    key: messageKey,
                    content: `Đang gửi email... Đã xử lý ${offset}/${totalStudents || "?"}`,
                    duration: 0,
                });

                setEmailProgress(`Đang gửi email... Đã xử lý ${offset}/${totalStudents || "?"}`);

                const data = await requestSendEmails(`offset=${offset}&limit=${limit}`);
                applyMailResult(data);

                totalStudents = data?.totalStudents ?? totalStudents;

                totalSent += data?.stats?.sent ?? 0;
                totalFailed += data?.stats?.failed ?? 0;
                totalSkipped += data?.stats?.skippedNoEmail ?? 0;
                totalNotSaved += data?.stats?.notSavedToSent ?? 0;
                totalWithGradedFile += data?.stats?.withGradedFile ?? 0;

                if (Array.isArray(data?.errors)) {
                    allErrors.push(...data.errors);
                }
                if (Array.isArray(data?.skippedStudents)) {
                    allSkipped.push(...data.skippedStudents);
                }

                const nextOffset = data?.batch?.nextOffset ?? offset + limit;
                const hasMore = data?.batch?.hasMore ?? false;

                offset = nextOffset;

                setEmailProgress(`Đã xử lý ${Math.min(offset, totalStudents)}/${totalStudents} học sinh`);

                if (!hasMore) break;

                // Chỉ nghỉ khi vừa thực sự gửi mail (học sinh thiếu email thì đi tiếp luôn)
                if ((data?.stats?.sent ?? 0) + (data?.stats?.failed ?? 0) > 0) {
                    await new Promise(resolve => setTimeout(resolve, delayBetweenEmailsMs));
                }
            }

            if (allErrors.length > 0 || allSkipped.length > 0) {
                setMailReport({ failed: allErrors, skipped: allSkipped });
            }

            if (totalFailed > 0) {
                message.warning({
                    key: messageKey,
                    content: `Đã gửi: ${totalSent} | Lỗi: ${totalFailed} | Bỏ qua thiếu email: ${totalSkipped}. Xem danh sách học sinh bị lỗi phía trên bảng để gửi lại.`,
                    duration: 8,
                });
            } else {
                message.success({
                    key: messageKey,
                    content: `Đã gửi email xong. Thành công: ${totalSent} (kèm bài chấm: ${totalWithGradedFile}) | Bỏ qua thiếu email: ${totalSkipped}`,
                    duration: 5,
                });
            }

            if (totalNotSaved > 0) {
                message.warning(`${totalNotSaved} email đã gửi nhưng không lưu được bản sao vào thư mục Sent.`, 6);
            }

            setEmailProgress("");

        } catch (error: any) {
            console.error(error);

            // Vẫn báo những học sinh đã lỗi trước khi dừng, kèm vị trí dừng để biết còn ai chưa được gửi
            setMailReport({
                failed: allErrors,
                skipped: allSkipped,
                abortedMessage: `${error?.message || "Lỗi khi gửi email"} - đã dừng ở học sinh thứ ${offset + 1}/${totalStudents || "?"}. Các học sinh từ đó trở đi chưa được gửi, hãy gửi riêng hoặc bấm "Gửi email" lại.`,
            });

            message.error({
                key: messageKey,
                content: error?.message || "Lỗi khi gửi email!",
                duration: 6,
            });

            setEmailProgress("");
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
            width: screens.sm ? 200 : 140,
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
            width: 480,
            // Giữ xuống dòng của nhận xét (nhập từ Excel) và giới hạn bề rộng để chữ tự xuống dòng
            render: (comment: string | null) => comment
                ? <div style={{ whiteSpace: 'pre-line', minWidth: 320, maxWidth: 560 }}>{comment}</div>
                : <Text type="secondary">-</Text>,
        },
        {
            title: 'Bài chấm',
            dataIndex: 'gradedFile',
            key: 'gradedFile',
            align: 'center',
            width: 100,
            render: (gradedFile: StudentPerformance['gradedFile']) => gradedFile
                ? (
                    <Tooltip title={gradedFile.name || 'Xem bài chấm (sẽ đính kèm khi gửi mail)'}>
                        <a href={gradedFile.url} target="_blank" rel="noopener noreferrer">
                            <FilePdfOutlined /> Xem
                        </a>
                    </Tooltip>
                )
                : <Text type="secondary">-</Text>,
        },
        {
            title: 'Gửi mail',
            key: 'mail',
            align: 'center',
            width: 140,
            render: (_, record: StudentPerformance) => {
                const st = mailStatus[record.id];
                const disabledReason = !headerInfo.isLocked
                    ? 'Vui lòng chốt kết quả trước khi gửi email'
                    : !record.attendance
                        ? 'Học sinh vắng không nhận mail'
                        : !record.parentEmail
                            ? 'Học sinh chưa có email phụ huynh'
                            : null;
                const busy = emailLoading || resendingAll || (sendingStudentId !== null && sendingStudentId !== record.id);

                return (
                    <Space direction="vertical" size={4} align="center">
                        {st?.status === 'sent' && <Tag color="success" style={{ margin: 0 }}>Đã gửi</Tag>}
                        {st?.status === 'failed' && (
                            <Tooltip title={`${st.reason || ''}${st.error ? ` (${st.error})` : ''}`}>
                                <Tag color="error" style={{ margin: 0 }}>Gửi lỗi</Tag>
                            </Tooltip>
                        )}
                        {st?.status === 'skipped' && <Tag color="warning" style={{ margin: 0 }}>Thiếu email</Tag>}
                        <Tooltip title={disabledReason || `Gửi mail riêng tới ${record.parentEmail}`}>
                            <Popconfirm
                                title={`Gửi mail riêng cho phụ huynh ${record.fullName}?`}
                                description={`Mail kết quả buổi học sẽ được gửi tới ${record.parentEmail}`}
                                onConfirm={() => handleSendSingleEmail(record.id, record.fullName)}
                                okText="Gửi"
                                cancelText="Hủy"
                                disabled={!!disabledReason || busy}
                            >
                                <Button
                                    size="small"
                                    danger={st?.status === 'failed'}
                                    icon={st?.status === 'failed' ? <RedoOutlined /> : <SendOutlined />}
                                    loading={sendingStudentId === record.id}
                                    disabled={!!disabledReason || busy}
                                >
                                    {st?.status === 'failed' ? 'Gửi lại' : 'Gửi riêng'}
                                </Button>
                            </Popconfirm>
                        </Tooltip>
                    </Space>
                );
            },
        },
    ];

    // Bảng chi tiết các học sinh gửi mail bị lỗi, để quản lý liên hệ / gửi lại riêng
    const failedColumns: ColumnsType<MailIssue> = [
        {
            title: 'STT',
            key: 'index',
            align: 'center',
            width: 60,
            render: (_, __, index) => index + 1,
        },
        {
            title: 'Học sinh',
            key: 'student',
            render: (_, r) => (
                <>
                    <Text strong>{r.fullName}</Text>
                    {r.school && <div><Text type="secondary" style={{ fontSize: 12 }}>{r.school}</Text></div>}
                </>
            ),
        },
        {
            title: 'Email phụ huynh',
            dataIndex: 'email',
            key: 'email',
            render: (email: string | null) => email ? <a href={`mailto:${email}`}>{email}</a> : <Text type="secondary">-</Text>,
        },
        {
            title: 'SĐT phụ huynh',
            dataIndex: 'parentPhoneNumber',
            key: 'parentPhoneNumber',
            render: (phone: string | null) => phone || <Text type="secondary">-</Text>,
        },
        {
            title: 'Lý do lỗi',
            key: 'reason',
            render: (_, r) => (
                <>
                    <Text type="danger">{r.reason || 'Lỗi không xác định'}</Text>
                    {r.error && <div><Text type="secondary" style={{ fontSize: 12 }}>{r.error}</Text></div>}
                    {r.hasGradedFile && <div><Text type="secondary" style={{ fontSize: 12 }}>Mail có đính kèm bài chấm</Text></div>}
                </>
            ),
        },
        {
            title: 'Thao tác',
            key: 'action',
            align: 'center',
            width: 110,
            render: (_, r) => (
                <Button
                    size="small"
                    type="primary"
                    icon={<RedoOutlined />}
                    loading={sendingStudentId === r.studentId}
                    disabled={emailLoading || resendingAll || (sendingStudentId !== null && sendingStudentId !== r.studentId)}
                    onClick={() => handleSendSingleEmail(r.studentId, r.fullName)}
                >
                    Gửi lại
                </Button>
            ),
        },
    ];

    const hasMailReport = !!mailReport && (mailReport.failed.length > 0 || mailReport.skipped.length > 0 || !!mailReport.abortedMessage);

    const presentCount = studentPerformances.filter(student => student.attendance).length;

    return (
        <div className="page-wrapper" style={{ backgroundColor: '#fff' }}>

            {!loading && (
                <div style={{ marginBottom: 30 }}>
                    {/* Header + Nút Chốt Kết Quả + Nút Gửi Email */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: 8, marginBottom: 20, position: 'relative' }}>
                        <Title level={3} style={{ textTransform: 'uppercase', margin: 0, textAlign: 'center' }}>
                            {headerInfo.className ? `LỚP ${headerInfo.className}` : '...'} :
                            Ngày {headerInfo.lessonDate ? formatDate(headerInfo.lessonDate) : '...'}
                        </Title>

                        {/* Nút nằm bên phải */}
                        <div style={{ position: screens.xl ? 'absolute' : 'static', right: 0, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: 10 }}>
                            {/* Gửi email */}
                            <Tooltip title={!headerInfo.isLocked ? 'Vui lòng chốt kết quả trước khi gửi email' : 'Gửi email kết quả buổi học cho phụ huynh các học sinh có mặt'}>
                                <Popconfirm
                                    title="Gửi email kết quả buổi học?"
                                    description="Hệ thống sẽ gửi email tới phụ huynh của các học sinh có mặt (học sinh vắng không nhận mail). Bạn chắc chắn muốn gửi?"
                                    onConfirm={handleSendEmails}
                                    okText="Gửi ngay"
                                    cancelText="Hủy"
                                    disabled={!headerInfo.isLocked}
                                >
                                    <Button
                                        type="primary"
                                        icon={<MailOutlined />}
                                        loading={emailLoading}
                                        disabled={!headerInfo.isLocked || resendingAll || sendingStudentId !== null}
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

                    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-end', gap: 8, marginBottom: 8 }}>
                        {isEditingInfo ? (
                            <>
                                <Button onClick={() => setIsEditingInfo(false)} disabled={savingInfo}>Hủy</Button>
                                <Button type="primary" icon={<SaveOutlined />} loading={savingInfo} onClick={handleSaveLessonInfo}>
                                    Lưu
                                </Button>
                            </>
                        ) : (
                            <Button icon={<EditOutlined />} onClick={startEditingInfo}>Chỉnh sửa</Button>
                        )}
                    </div>

                    <Descriptions
                        bordered
                        column={descColumn}
                        size={screens.sm ? 'middle' : 'small'}
                        layout={screens.sm ? 'horizontal' : 'vertical'}
                        labelStyle={{ fontWeight: 'bold', backgroundColor: '#fafafa', width: '150px' }}
                    >
                        <Descriptions.Item label="Nội dung bài học" span={descColumn}>
                            {isEditingInfo ? (
                                <Input.TextArea
                                    autoSize={{ minRows: 1, maxRows: 6 }}
                                    value={infoDraft.lessonContent}
                                    onChange={e => setInfoDraft(d => ({ ...d, lessonContent: e.target.value }))}
                                />
                            ) : (
                                <span style={{ fontSize: 16 }}>{headerInfo.lessonContent || "Chưa cập nhật"}</span>
                            )}
                        </Descriptions.Item>
                        <Descriptions.Item label="Nội dung buổi trước">
                            {isEditingInfo ? (
                                <Input.TextArea
                                    autoSize={{ minRows: 1, maxRows: 6 }}
                                    placeholder="Không có"
                                    value={infoDraft.previousLessonContent}
                                    onChange={e => setInfoDraft(d => ({ ...d, previousLessonContent: e.target.value }))}
                                />
                            ) : (
                                headerInfo.previousLessonContent || "Không có"
                            )}
                        </Descriptions.Item>
                        <Descriptions.Item label="Tổng số BTVN">
                            {isEditingInfo ? (
                                <Space>
                                    <InputNumber
                                        min={0}
                                        max={500}
                                        precision={0}
                                        value={infoDraft.totalTaskLength}
                                        onChange={v => setInfoDraft(d => ({ ...d, totalTaskLength: v }))}
                                    />
                                    ý
                                </Space>
                            ) : (
                                <>{headerInfo.previousHomeworkCount ?? 0} ý</>
                            )}
                        </Descriptions.Item>
                        <Descriptions.Item label="BTVN tuần sau">
                            {isEditingInfo ? (
                                <Input.TextArea
                                    autoSize={{ minRows: 1, maxRows: 6 }}
                                    placeholder="Thầy gửi qua Zalo"
                                    value={infoDraft.nextHomework}
                                    onChange={e => setInfoDraft(d => ({ ...d, nextHomework: e.target.value }))}
                                />
                            ) : (
                                headerInfo.nextHomework || "Thầy gửi qua Zalo"
                            )}
                        </Descriptions.Item>
                    </Descriptions>
                </div>
            )}

            {loading && (
                <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}>
                    <Spin size="large" tip="Đang tải dữ liệu..." />
                </div>
            )}

            {!loading && hasMailReport && mailReport && (
                <div style={{ marginBottom: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {mailReport.abortedMessage && (
                        <Alert type="error" showIcon message="Gửi email bị dừng giữa chừng" description={mailReport.abortedMessage} />
                    )}

                    {mailReport.failed.length > 0 && (
                        <Alert
                            type="error"
                            showIcon
                            message={
                                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                                    <Text strong>Có {mailReport.failed.length} học sinh chưa gửi được email kết quả</Text>
                                    <Button
                                        danger
                                        icon={<RedoOutlined />}
                                        loading={resendingAll}
                                        disabled={emailLoading || (sendingStudentId !== null && !resendingAll)}
                                        onClick={handleResendAllFailed}
                                    >
                                        Gửi lại tất cả
                                    </Button>
                                </div>
                            }
                            description={
                                <Table
                                    columns={failedColumns}
                                    dataSource={mailReport.failed}
                                    rowKey="studentId"
                                    size="small"
                                    pagination={false}
                                    scroll={{ x: 'max-content' }}
                                    style={{ marginTop: 8 }}
                                />
                            }
                        />
                    )}

                    {mailReport.skipped.length > 0 && (
                        <Alert
                            type="warning"
                            showIcon
                            message={`${mailReport.skipped.length} học sinh có mặt nhưng chưa có email phụ huynh nên không được gửi mail`}
                            description={
                                <ul style={{ margin: 0, paddingLeft: 20 }}>
                                    {mailReport.skipped.map(s => (
                                        <li key={s.studentId}>
                                            <Text strong>{s.fullName}</Text>
                                            {s.school && <> - {s.school}</>}
                                            {' '}- SĐT phụ huynh: {s.parentPhoneNumber || 'chưa có'}
                                        </li>
                                    ))}
                                </ul>
                            }
                        />
                    )}

                    <div style={{ textAlign: 'right' }}>
                        <Button size="small" onClick={() => setMailReport(null)}>Ẩn báo cáo gửi mail</Button>
                    </div>
                </div>
            )}

            {!loading && !error && (
                <Table
                    columns={columns}
                    dataSource={studentPerformances}
                    rowKey="id"
                    bordered
                    scroll={{ x: 'max-content' }}
                    pagination={{
                        defaultPageSize: 10,
                        pageSizeOptions: ['5', '10', '20', '50', '100'],
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
