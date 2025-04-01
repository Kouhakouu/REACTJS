'use client';

import { useEffect, useState, useContext } from 'react';
import Link from 'next/link';
import { AuthContext } from '@/library/authContext';
import { Card, Row, Col, Typography, Spin, Alert, Tag } from 'antd';
import { FileTextOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface Class {
    id: number;
    className: string;
    gradeLevel: string;
    assignmentsCount: number;
    studentsCount: number;
}

const AssistantPage = () => {
    const { token } = useContext(AuthContext);
    const [classes, setClasses] = useState<Class[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!token) {
            setError("Không tìm thấy token, không thể gọi API!");
            setLoading(false);
            return;
        }

        fetch(`${process.env.NEXT_PUBLIC_BACKEND_PORT}/assistant/classes`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setClasses(data);
                } else {
                    setError("Dữ liệu trả về không hợp lệ.");
                }
            })
            .catch(error => setError("Lỗi khi gọi API: " + error.message))
            .finally(() => setLoading(false));
    }, [token]);

    return (
        <div style={{ padding: '20px' }}>
            <Title level={2}>Danh sách lớp học</Title>
            {loading ? (
                <Spin size="large" style={{ display: 'block', textAlign: 'center', marginTop: 50 }} />
            ) : (
                <Row gutter={[16, 16]}>
                    {classes.map(cls => (
                        <Col xs={24} sm={12} md={8} lg={6} key={cls.id}>
                            <Card
                                title={<Link href={`/assistant/classes/${cls.id}`}>{cls.className}</Link>}
                                bordered
                                extra={<Tag color="blue">Lớp {cls.gradeLevel}</Tag>}
                            >
                                <Text><FileTextOutlined /> Số bài tập: {cls.assignmentsCount}</Text>
                                <br />
                                <Text><FileTextOutlined /> Sĩ số: {cls.studentsCount}</Text>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}
        </div>
    );
};

export default AssistantPage;
