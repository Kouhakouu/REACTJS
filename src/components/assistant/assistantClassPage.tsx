'use client';

import { useEffect, useState } from 'react';
import { Spin, Table, Typography, message, Input, Row, Col, Card } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import Link from 'next/link';

const { Title } = Typography;

interface Student {
    id: number;
    fullName: string;
    school: string;
    parentPhone: string;
    parentEmail: string;
}

interface ClassDetail {
    id: number;
    className: string;
    students: Student[];
}

interface Lesson {
    id: number;
    lessonContent: string;
    lessonDate: string;
    totalTaskLength: number;
}

const AssistantClassPage = ({ params }: { params: { id: string } }) => {
    const [classDetail, setClassDetail] = useState<ClassDetail | null>(null);
    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [loadingLessons, setLoadingLessons] = useState<boolean>(false);
    const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);

    useEffect(() => {
        const fetchClassDetail = async () => {
            setLoading(true);
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_PORT}/assistant/classes/${params.id}`);
                const data = await res.json();
                setClassDetail(data);
                setFilteredStudents(data.students);
            } catch (error) {
                message.error("Không thể tải thông tin lớp học!");
            } finally {
                setLoading(false);
            }
        };

        fetchClassDetail();
    }, [params.id]);

    useEffect(() => {
        const fetchLessons = async () => {
            setLoadingLessons(true);
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_PORT}/assistant/classes/${params.id}/lessons`, { credentials: 'include' });
                const data = await res.json();

                if (!res.ok) {
                    message.error(data.message || "Không thể tải danh sách buổi học!");
                    setLessons([]);
                    return;
                }
                const lessonsArray = Array.isArray(data) ? data : data.lessons || [];
                setLessons(lessonsArray);
            } catch (error) {
                message.error("Không thể tải danh sách buổi học!");
            } finally {
                setLoadingLessons(false);
            }
        };

        fetchLessons();
    }, [params.id]);


    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const filtered = classDetail?.students.filter(student =>
            student.fullName.toLowerCase().includes(e.target.value.toLowerCase())
        ) || [];
        setFilteredStudents(filtered);
    };

    if (loading || !classDetail) {
        return <Spin tip="Đang tải..." style={{ display: 'flex', justifyContent: 'center', padding: 20 }} />;
    }

    return (
        <div style={{ padding: '20px' }}>
            <Title level={2}>{classDetail.className}</Title>

            <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
                <Col>
                    <Input
                        placeholder="Tìm kiếm học sinh theo họ và tên"
                        prefix={<SearchOutlined />}
                        style={{ width: 300 }}
                        onChange={handleSearch}
                    />
                </Col>
            </Row>

            <Table
                dataSource={filteredStudents}
                columns={[
                    { title: 'Họ và tên', dataIndex: 'fullName', key: 'fullName' },
                    { title: 'Trường', dataIndex: 'school', key: 'school' },
                    { title: 'Email phụ huynh', dataIndex: 'parentEmail', key: 'parentEmail' },
                ]}
                rowKey="id"
                pagination={{ pageSize: 10 }}
                scroll={{ x: 'max-content' }}
            />

            <Title level={3} style={{ marginTop: 40 }}>Danh sách buổi học</Title>
            {loadingLessons ? (
                <Spin tip="Đang tải buổi học..." style={{ display: 'flex', justifyContent: 'center', padding: '20px' }} />
            ) : (
                <Row gutter={[16, 16]}>
                    {lessons.map(lesson => (
                        <Col key={lesson.id} xs={24} sm={12} md={8} lg={6}>
                            <Link href={`/assistant/classes/${params.id}/lessons/${lesson.id}/students-performance`} style={{ textDecoration: 'none' }}>
                                <Card
                                    title={dayjs(lesson.lessonDate).format('DD/MM/YYYY')}
                                    bordered={true}
                                    hoverable
                                >
                                    <p><strong>Nội dung:</strong> {lesson.lessonContent}</p>
                                    <p><strong>Số bài tập:</strong> {lesson.totalTaskLength}</p>
                                </Card>
                            </Link>
                        </Col>
                    ))}
                </Row>
            )}
        </div>
    );
};

export default AssistantClassPage;
