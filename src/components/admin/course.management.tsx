'use client';

import { useEffect, useState, useContext } from 'react';
import { Table, Switch, Select, Button, message, Tag, Typography, Space, Modal, Form } from 'antd';
import { AuthContext } from '@/library/authContext';

const { Title } = Typography;
const { Option } = Select;

const TAG_OPTIONS = [
    { value: 'primary', label: 'Toán Tiểu học' },
    { value: 'middle-basic', label: 'Toán cơ bản Trung học cơ sở' },
    { value: 'middle-advanced', label: 'Toán ôn thi cận chuyên THCS' },
    { value: 'middle-specialized', label: 'Toán ôn thi chuyên THCS' },
];

interface Course {
    id: number;
    title: string;
    description: string;
    price: number;
    isPublished: boolean;
    tag: string | null;
    teacher?: { userId: number; fullName: string };
}

const AdminCourseManagement = () => {
    const { token } = useContext(AuthContext);
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [selected, setSelected] = useState<Course | null>(null);
    const [form] = Form.useForm();

    const fetchCourses = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_PORT}/admin/courses`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            setCourses(data);
        } catch {
            message.error('Không thể tải danh sách khóa học');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) fetchCourses();
    }, [token]);

    const openModal = (course: Course) => {
        setSelected(course);
        form.setFieldsValue({ isPublished: course.isPublished, tag: course.tag });
        setModalOpen(true);
    };

    const handleSave = async () => {
        if (!selected) return;
        const values = await form.validateFields();

        if (values.isPublished && !values.tag) {
            message.warning('Vui lòng chọn danh mục để hiển thị khóa học');
            return;
        }

        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_PORT}/admin/courses/${selected.id}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({ isPublished: values.isPublished, tag: values.tag })
                }
            );
            if (!res.ok) throw new Error();
            message.success('Cập nhật thành công');
            setModalOpen(false);
            fetchCourses();
        } catch {
            message.error('Lỗi khi cập nhật');
        }
    };

    const columns = [
        {
            title: 'Tên khóa học',
            dataIndex: 'title',
            key: 'title',
            width: 220
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
            key: 'description',
            ellipsis: true
        },
        {
            title: 'Giá',
            dataIndex: 'price',
            key: 'price',
            width: 120,
            render: (v: number) => `${v.toLocaleString('vi-VN')} ₫`
        },
        {
            title: 'Giáo viên',
            key: 'teacher',
            width: 160,
            render: (_: unknown, r: Course) => r.teacher?.fullName ?? '—'
        },
        {
            title: 'Trạng thái',
            key: 'isPublished',
            width: 110,
            render: (_: unknown, r: Course) =>
                r.isPublished
                    ? <Tag color="green">Hiển thị</Tag>
                    : <Tag color="default">Ẩn</Tag>
        },
        {
            title: 'Danh mục',
            key: 'tag',
            width: 220,
            render: (_: unknown, r: Course) => {
                const opt = TAG_OPTIONS.find(t => t.value === r.tag);
                return opt ? <Tag color="blue">{opt.label}</Tag> : '—';
            }
        },
        {
            title: 'Hành động',
            key: 'action',
            width: 120,
            render: (_: unknown, r: Course) => (
                <Button size="small" onClick={() => openModal(r)}>
                    Chỉnh sửa
                </Button>
            )
        }
    ];

    return (
        <div style={{ padding: 24 }}>
            <Title level={3}>Quản lý khóa học</Title>
            <Table
                dataSource={courses}
                columns={columns}
                rowKey="id"
                loading={loading}
                pagination={{ pageSize: 10 }}
            />

            <Modal
                title={`Cài đặt hiển thị — ${selected?.title}`}
                open={modalOpen}
                onOk={handleSave}
                onCancel={() => setModalOpen(false)}
                okText="Lưu"
                cancelText="Huỷ"
            >
                <Form form={form} layout="vertical">
                    <Form.Item name="isPublished" label="Hiển thị trên trang khóa học" valuePropName="checked">
                        <Switch checkedChildren="Hiển thị" unCheckedChildren="Ẩn" />
                    </Form.Item>
                    <Form.Item
                        noStyle
                        shouldUpdate={(prev, cur) => prev.isPublished !== cur.isPublished}
                    >
                        {({ getFieldValue }) =>
                            getFieldValue('isPublished') ? (
                                <Form.Item
                                    name="tag"
                                    label="Đặt vào danh mục"
                                    rules={[{ required: true, message: 'Vui lòng chọn danh mục' }]}
                                >
                                    <Select placeholder="Chọn danh mục">
                                        {TAG_OPTIONS.map(t => (
                                            <Option key={t.value} value={t.value}>{t.label}</Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            ) : null
                        }
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default AdminCourseManagement;
