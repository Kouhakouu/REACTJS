'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
    Button,
    Col,
    Input,
    Modal,
    Popconfirm,
    Row,
    Spin,
    Table,
    Typography,
    message
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { authHeaders } from '@/utils/authHeaders';

const { Title, Text } = Typography;

interface Student {
    id: number;
    fullName: string;
    school: string;
    parentPhoneNumber: string;
    parentEmail: string;
    DOB: string;
}

interface AvailableStudent extends Student {
    classes?: {
        id: number;
        className: string;
        gradeLevel: string;
    }[];
}

interface ClassDetail {
    id: number;
    className: string;
    students: Student[];
}

const formatDOB = (dob?: string) => {
    if (!dob) return '';
    const date = new Date(dob);
    return Number.isNaN(date.getTime()) ? dob : date.toLocaleDateString('vi-VN');
};

const Class = ({ params }: { params: { id: string } }) => {
    const [classDetail, setClassDetail] = useState<ClassDetail | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [availableStudents, setAvailableStudents] = useState<AvailableStudent[]>([]);
    const [availableSearchTerm, setAvailableSearchTerm] = useState('');
    const [selectedStudentIds, setSelectedStudentIds] = useState<React.Key[]>([]);
    const [availableLoading, setAvailableLoading] = useState(false);
    const [addingStudents, setAddingStudents] = useState(false);
    const [removingStudentId, setRemovingStudentId] = useState<number | null>(null);

    const classId = params.id;

    const fetchClassDetail = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_PORT}/manager/students/${classId}`,
                { headers: authHeaders() }
            );

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.message || 'Failed to fetch class detail');
            }

            const data: ClassDetail = await res.json();
            setClassDetail(data);
            setFilteredStudents(data.students);
        } catch (error) {
            console.error('Error fetching class detail:', error);
            message.error('Không thể tải thông tin lớp học!');
        } finally {
            setLoading(false);
        }
    }, [classId]);

    const fetchAvailableStudents = async () => {
        setAvailableLoading(true);
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_PORT}/manager/classes/${classId}/available-students`,
                { headers: authHeaders() }
            );

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.message || 'Failed to fetch available students');
            }

            const data: AvailableStudent[] = await res.json();
            setAvailableStudents(data);
        } catch (error) {
            console.error('Error fetching available students:', error);
            message.error('Không thể tải danh sách học sinh có thể thêm.');
        } finally {
            setAvailableLoading(false);
        }
    };

    useEffect(() => {
        fetchClassDetail();
    }, [fetchClassDetail]);

    useEffect(() => {
        const q = searchTerm.trim().toLowerCase();
        const students = classDetail?.students || [];
        setFilteredStudents(
            q
                ? students.filter((student) => student.fullName.toLowerCase().includes(q))
                : students
        );
    }, [searchTerm, classDetail]);

    const filteredAvailableStudents = useMemo(() => {
        const q = availableSearchTerm.trim().toLowerCase();
        if (!q) return availableStudents;

        return availableStudents.filter((student) =>
            [
                student.fullName,
                student.school,
                student.parentPhoneNumber,
                student.parentEmail,
                ...(student.classes || []).map((cls) => cls.className)
            ]
                .filter(Boolean)
                .some((value) => value.toLowerCase().includes(q))
        );
    }, [availableSearchTerm, availableStudents]);

    const openAddModal = () => {
        setIsAddModalOpen(true);
        setAvailableSearchTerm('');
        setSelectedStudentIds([]);
        fetchAvailableStudents();
    };

    const closeAddModal = () => {
        setIsAddModalOpen(false);
        setAvailableSearchTerm('');
        setSelectedStudentIds([]);
    };

    const handleAddStudents = async () => {
        if (selectedStudentIds.length === 0) {
            message.warning('Vui lòng chọn ít nhất một học sinh.');
            return;
        }

        setAddingStudents(true);
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_PORT}/manager/classes/${classId}/students`,
                {
                    method: 'POST',
                    headers: authHeaders({ 'Content-Type': 'application/json' }),
                    body: JSON.stringify({ studentIds: selectedStudentIds })
                }
            );

            const data = await res.json().catch(() => ({}));
            if (!res.ok) {
                throw new Error(data.message || 'Failed to add students');
            }

            const addedCount = data.addedStudentIds?.length ?? selectedStudentIds.length;
            message.success(`Đã thêm ${addedCount} học sinh vào lớp.`);
            closeAddModal();
            fetchClassDetail();
        } catch (error: any) {
            console.error('Error adding students:', error);
            message.error(error.message || 'Không thể thêm học sinh vào lớp.');
        } finally {
            setAddingStudents(false);
        }
    };

    const handleRemoveStudent = async (studentId: number) => {
        setRemovingStudentId(studentId);
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_PORT}/manager/classes/${classId}/students/${studentId}`,
                {
                    method: 'DELETE',
                    headers: authHeaders()
                }
            );

            const data = await res.json().catch(() => ({}));
            if (!res.ok) {
                throw new Error(data.message || 'Failed to remove student');
            }

            message.success('Đã xoá học sinh khỏi lớp.');
            fetchClassDetail();
        } catch (error: any) {
            console.error('Error removing student:', error);
            message.error(error.message || 'Không thể xoá học sinh khỏi lớp.');
        } finally {
            setRemovingStudentId(null);
        }
    };

    const studentColumns: ColumnsType<Student> = [
        {
            title: 'Họ và tên',
            dataIndex: 'fullName',
            key: 'fullName'
        },
        {
            title: 'Ngày sinh',
            dataIndex: 'DOB',
            key: 'DOB',
            render: formatDOB
        },
        {
            title: 'Trường',
            dataIndex: 'school',
            key: 'school'
        },
        {
            title: 'SĐT phụ huynh',
            dataIndex: 'parentPhoneNumber',
            key: 'parentPhoneNumber'
        },
        {
            title: 'Email phụ huynh',
            dataIndex: 'parentEmail',
            key: 'parentEmail'
        },
        {
            title: 'Thao tác',
            key: 'action',
            fixed: 'right',
            width: 140,
            render: (_: unknown, record) => (
                <Popconfirm
                    title={`Xoá ${record.fullName} khỏi lớp?`}
                    okText="Xoá"
                    cancelText="Huỷ"
                    okButtonProps={{ danger: true }}
                    onConfirm={() => handleRemoveStudent(record.id)}
                >
                    <Button
                        danger
                        type="link"
                        loading={removingStudentId === record.id}
                    >
                        Xoá khỏi lớp
                    </Button>
                </Popconfirm>
            )
        }
    ];

    const availableStudentColumns: ColumnsType<AvailableStudent> = [
        {
            title: 'Họ và tên',
            dataIndex: 'fullName',
            key: 'fullName'
        },
        {
            title: 'Ngày sinh',
            dataIndex: 'DOB',
            key: 'DOB',
            render: formatDOB
        },
        {
            title: 'Trường',
            dataIndex: 'school',
            key: 'school'
        },
        {
            title: 'Lớp đang học',
            dataIndex: 'classes',
            key: 'classes',
            render: (classes: AvailableStudent['classes']) =>
                classes?.length ? classes.map((cls) => cls.className).join(', ') : 'Chưa có lớp'
        },
        {
            title: 'SĐT phụ huynh',
            dataIndex: 'parentPhoneNumber',
            key: 'parentPhoneNumber'
        }
    ];

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
            <Row justify="space-between" align="middle" gutter={[16, 16]} style={{ marginBottom: 16 }}>
                <Col>
                    <Title level={2} style={{ marginBottom: 4 }}>
                        {classDetail.className}
                    </Title>
                    <Text type="secondary">Sĩ số: {classDetail.students.length} học sinh</Text>
                </Col>
                <Col>
                    <Button type="primary" icon={<PlusOutlined />} onClick={openAddModal}>
                        Thêm học sinh vào lớp
                    </Button>
                </Col>
            </Row>

            <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
                <Col>
                    <Input
                        placeholder="Tìm kiếm học sinh theo họ và tên"
                        prefix={<SearchOutlined />}
                        style={{ width: 300, maxWidth: '100%' }}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        allowClear
                    />
                </Col>
            </Row>

            <Table
                dataSource={filteredStudents}
                columns={studentColumns}
                rowKey="id"
                pagination={{ defaultPageSize: 10, pageSizeOptions: ['5', '10', '20', '50', '100'] }}
                scroll={{ x: 'max-content' }}
            />

            <Modal
                title={`Thêm học sinh vào ${classDetail.className}`}
                open={isAddModalOpen}
                onCancel={closeAddModal}
                onOk={handleAddStudents}
                okText="Thêm vào lớp"
                cancelText="Huỷ"
                confirmLoading={addingStudents}
                width={900}
                destroyOnClose
            >
                <Input
                    placeholder="Tìm theo tên, trường, số điện thoại hoặc lớp đang học"
                    prefix={<SearchOutlined />}
                    style={{ marginBottom: 16 }}
                    value={availableSearchTerm}
                    onChange={(e) => setAvailableSearchTerm(e.target.value)}
                    allowClear
                />

                <Table
                    dataSource={filteredAvailableStudents}
                    columns={availableStudentColumns}
                    rowKey="id"
                    loading={availableLoading}
                    pagination={{ defaultPageSize: 5, pageSizeOptions: ['5', '10', '20', '50', '100'] }}
                    scroll={{ x: 'max-content' }}
                    rowSelection={{
                        selectedRowKeys: selectedStudentIds,
                        onChange: setSelectedStudentIds
                    }}
                />
            </Modal>
        </div>
    );
};

export default Class;
