'use client';

import { useEffect, useState } from 'react';
import { Spin, Table, Typography, message, Input, Row, Col } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

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

const Class = ({ params }: { params: { id: string } }) => {
    const [classDetail, setClassDetail] = useState<ClassDetail | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);

    useEffect(() => {
        const fetchClassDetail = async () => {
            setLoading(true);
            try {
                const res = await fetch(`http://localhost:8000/manager/students/${params.id}`);
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

        </div>
    );
};

export default Class;
