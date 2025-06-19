// pages/teacher/classes/[id].tsx
'use client';

import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'next/navigation';
import { Spin, Table, Typography, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { AuthContext } from '@/library/authContext';

const { Title } = Typography;

interface Session {
    id: number;
    date: string;
    content: string;
}
interface Performance {
    sessionId: number;
    doneCount: number;
    correctCount: number;
    wrongTasks: string[];
    missingTasks: string[];
    presentation: string;
    skills: string;
}
interface StudentRecord {
    id: number;
    fullName: string;
    DOB: string;
    school: string;
    parentPhoneNumber: string;
    parentEmail: string;
    performance: Performance[];
}
interface ClassDetail {
    id: number;
    className: string;
    sessions: Session[];
    students: StudentRecord[];
}

export default function TeacherClassPage({ params }: { params: { id: string } }) {
    const { id } = useParams<{ id: string }>();
    const { token } = useContext(AuthContext);

    const [classDetail, setClassDetail] = useState<ClassDetail | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchDetail = async () => {
            setLoading(true);
            try {
                if (!token) throw new Error('Không tìm thấy token');
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_BACKEND_PORT}/teacher/classes/${id}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const data: ClassDetail = await res.json();
                setClassDetail(data);
            } catch (e: any) {
                console.error(e);
                message.error('Lỗi khi tải dữ liệu: ' + e.message);
            } finally {
                setLoading(false);
            }
        };
        fetchDetail();
    }, [id, token]);

    if (loading || !classDetail) {
        return <Spin tip="Đang tải..." style={{ display: 'block', marginTop: 50 }} />;
    }

    const { className, sessions, students } = classDetail;
    const otherColWidth = `calc((100% - 180px) / ${sessions.length})`;

    // Các cột hiển thị thông tin cơ bản
    const columns: ColumnsType<StudentRecord> = [
        { title: 'Họ và tên', dataIndex: 'fullName', key: 'fullName' },
        {
            title: 'Ngày sinh',
            dataIndex: 'DOB',
            key: 'DOB',
            render: (dob: string) => new Date(dob).toLocaleDateString('vi-VN')
        },
        { title: 'Trường', dataIndex: 'school', key: 'school' },
        { title: 'SĐT phụ huynh', dataIndex: 'parentPhoneNumber', key: 'parentPhoneNumber' },
        { title: 'Email phụ huynh', dataIndex: 'parentEmail', key: 'parentEmail' }
    ];

    return (
        <div style={{ padding: 20 }}>
            <Title level={2}>{className}</Title>

            <Table<StudentRecord>
                dataSource={students}
                columns={columns}
                rowKey="id"
                expandable={{
                    expandRowByClick: true,
                    expandedRowRender: record => (
                        <div style={{ overflowX: 'auto', padding: 16 }}>
                            <table
                                style={{
                                    width: '100%',
                                    borderCollapse: 'collapse',
                                    textAlign: 'center'
                                }}
                            >
                                <thead>
                                    <tr>
                                        <th
                                            style={{
                                                border: '1px solid #ddd',
                                                padding: 8,
                                                background: '#fafafa',
                                                width: 180,
                                                maxWidth: 180
                                            }}
                                        />
                                        {sessions.map(s => (
                                            <th
                                                key={s.id}
                                                style={{
                                                    border: '1px solid #ddd',
                                                    padding: 8,
                                                    background: '#fafafa',
                                                    width: otherColWidth,
                                                    maxWidth: otherColWidth
                                                }}
                                            >
                                                <div>{new Date(s.date).toLocaleDateString('vi-VN')}</div>
                                                <div>{s.content}</div>
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {/* Số bài làm được */}
                                    <tr>
                                        <td
                                            style={{
                                                border: '1px solid #ddd',
                                                padding: 8,
                                                fontWeight: 'bold',
                                                textAlign: 'left',
                                                width: 180,
                                                maxWidth: 180
                                            }}
                                        >
                                            Số bài làm được
                                        </td>
                                        {sessions.map(s => {
                                            const p = record.performance.find(x => x.sessionId === s.id);
                                            return (
                                                <td
                                                    key={s.id}
                                                    style={{ border: '1px solid #ddd', padding: 8, width: otherColWidth, maxWidth: otherColWidth }}
                                                >
                                                    {p?.doneCount ?? '-'}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                    {/* Số bài làm đúng */}
                                    <tr>
                                        <td
                                            style={{
                                                border: '1px solid #ddd',
                                                padding: 8,
                                                fontWeight: 'bold',
                                                textAlign: 'left',
                                                width: 180,
                                                maxWidth: 180
                                            }}
                                        >
                                            Số bài làm đúng
                                        </td>
                                        {sessions.map(s => {
                                            const p = record.performance.find(x => x.sessionId === s.id);
                                            return (
                                                <td
                                                    key={s.id}
                                                    style={{ border: '1px solid #ddd', padding: 8, width: otherColWidth, maxWidth: otherColWidth }}
                                                >
                                                    {p?.correctCount ?? '-'}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                    {/* Các bài làm sai */}
                                    <tr>
                                        <td
                                            style={{
                                                border: '1px solid #ddd',
                                                padding: 8,
                                                fontWeight: 'bold',
                                                textAlign: 'left',
                                                width: 180,
                                                maxWidth: 180
                                            }}
                                        >
                                            Các bài làm sai
                                        </td>
                                        {sessions.map(s => {
                                            const p = record.performance.find(x => x.sessionId === s.id);
                                            const wrong = Array.isArray(p?.wrongTasks) ? p.wrongTasks : [];
                                            return (
                                                <td
                                                    key={s.id}
                                                    style={{ border: '1px solid #ddd', padding: 8, width: otherColWidth, maxWidth: otherColWidth }}
                                                >
                                                    {wrong.length ? wrong.join(', ') : '-'}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                    {/* Các bài làm chưa làm được */}
                                    <tr>
                                        <td
                                            style={{
                                                border: '1px solid #ddd',
                                                padding: 8,
                                                fontWeight: 'bold',
                                                textAlign: 'left',
                                                width: 180,
                                                maxWidth: 180
                                            }}
                                        >
                                            Các bài làm chưa làm được
                                        </td>
                                        {sessions.map(s => {
                                            const p = record.performance.find(x => x.sessionId === s.id);
                                            const miss = Array.isArray(p?.missingTasks) ? p.missingTasks : [];
                                            return (
                                                <td
                                                    key={s.id}
                                                    style={{ border: '1px solid #ddd', padding: 8, width: otherColWidth, maxWidth: otherColWidth }}
                                                >
                                                    {miss.length ? miss.join(', ') : '-'}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                    {/* Trình bày */}
                                    <tr>
                                        <td
                                            style={{
                                                border: '1px solid #ddd',
                                                padding: 8,
                                                fontWeight: 'bold',
                                                textAlign: 'left',
                                                width: 180,
                                                maxWidth: 180
                                            }}
                                        >
                                            Trình bày
                                        </td>
                                        {sessions.map(s => {
                                            const p = record.performance.find(x => x.sessionId === s.id);
                                            return (
                                                <td
                                                    key={s.id}
                                                    style={{ border: '1px solid #ddd', padding: 8, width: otherColWidth, maxWidth: otherColWidth }}
                                                >
                                                    {p?.presentation || '-'}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                    {/* Kĩ năng */}
                                    <tr>
                                        <td
                                            style={{
                                                border: '1px solid #ddd',
                                                padding: 8,
                                                fontWeight: 'bold',
                                                textAlign: 'left',
                                                width: 180,
                                                maxWidth: 180
                                            }}
                                        >
                                            Kĩ năng
                                        </td>
                                        {sessions.map(s => {
                                            const p = record.performance.find(x => x.sessionId === s.id);
                                            return (
                                                <td
                                                    key={s.id}
                                                    style={{ border: '1px solid #ddd', padding: 8, width: otherColWidth, maxWidth: otherColWidth }}
                                                >
                                                    {p?.skills || '-'}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    )
                }}
            />
        </div>
    );
}
