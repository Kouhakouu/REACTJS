// class.tsx
'use client';

import { useEffect, useState } from 'react';
import { Spin, Table, Typography, message, Input, Row, Col } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

const { Title } = Typography;

// Mở rộng thêm DOB và parentPhoneNumber
interface Student {
    id: number;
    fullName: string;
    school: string;
    parentPhoneNumber: string;
    parentEmail: string;
    DOB: string;             // YYYY-MM-DD
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
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_BACKEND_PORT}/manager/students/${params.id}`
                );
                const data: ClassDetail = await res.json();
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
        const q = e.target.value.toLowerCase();
        const filtered = classDetail?.students.filter(s =>
            s.fullName.toLowerCase().includes(q)
        ) || [];
        setFilteredStudents(filtered);
    };

    if (loading || !classDetail) {
        return (
            <Spin
                tip="Đang tải..."
                style={{ display: 'flex', justifyContent: 'center', padding: 20 }}
            />
        );
    }

    return (
        <div style={{ padding: 20 }}>
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
                    {
                        title: 'Ngày sinh',
                        dataIndex: 'DOB',
                        key: 'DOB',
                        render: (dob: string) => new Date(dob).toLocaleDateString('vi-VN')
                    },
                    { title: 'Trường', dataIndex: 'school', key: 'school' },
                    {
                        title: 'SĐT phụ huynh',
                        dataIndex: 'parentPhoneNumber',
                        key: 'parentPhoneNumber'
                    },
                    { title: 'Email phụ huynh', dataIndex: 'parentEmail', key: 'parentEmail' }
                ]}
                rowKey="id"
                pagination={{ pageSize: 10 }}
                scroll={{ x: 'max-content' }}
            />
        </div>
    );
};

export default Class;
