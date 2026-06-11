'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import NavbarComponent from '@/components/common/navbar';
import FooterComponent from '@/components/common/footer';
import { Layout, Typography, Menu, Card, Row, Col, Spin, Empty, Tag } from 'antd';

const { Content, Sider } = Layout;
const { Title, Paragraph, Text } = Typography;

const sidebarItems = [
    { key: 'primary', label: 'Toán Tiểu học', path: '/courses/primary' },
    { key: 'middle-basic', label: 'Toán cơ bản Trung học cơ sở', path: '/courses/middle-basic' },
    { key: 'middle-advanced', label: 'Toán ôn thi cận chuyên THCS', path: '/courses/middle-advanced' },
    { key: 'middle-specialized', label: 'Toán ôn thi chuyên THCS', path: '/courses/middle-specialized' },
];

const pathToTag: Record<string, string> = {
    '/courses/primary': 'primary',
    '/courses/middle-basic': 'middle-basic',
    '/courses/middle-advanced': 'middle-advanced',
    '/courses/middle-specialized': 'middle-specialized',
};

interface Course {
    id: number;
    title: string;
    description: string;
    price: number;
    teacher?: { fullName: string };
}

const Courses = () => {
    const pathname = usePathname();
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(false);

    const activeTag = pathToTag[pathname] ?? null;
    const activeLabel = sidebarItems.find(i => i.path === pathname)?.label ?? null;

    useEffect(() => {
        if (!activeTag) {
            setCourses([]);
            return;
        }

        setLoading(true);
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_PORT}/public/courses?tag=${activeTag}`)
            .then(r => r.json())
            .then(data => setCourses(Array.isArray(data) ? data : []))
            .catch(() => setCourses([]))
            .finally(() => setLoading(false));
    }, [activeTag]);

    return (
        <Layout>
            <NavbarComponent />
            <Layout>
                <Sider
                    width={300}
                    breakpoint="lg"
                    collapsedWidth={0}
                    zeroWidthTriggerStyle={{ top: 12 }}
                    style={{ background: '#fff', borderRadius: '10px' }}
                >
                    <div style={{ padding: '20px' }}>
                        <Title level={4}>Danh mục khóa học</Title>
                        <Menu
                            mode="inline"
                            selectedKeys={[pathname]}
                            style={{ borderRight: 0 }}
                        >
                            {sidebarItems.map((item) => (
                                <Menu.Item key={item.path}>
                                    <Link href={item.path}>{item.label}</Link>
                                </Menu.Item>
                            ))}
                        </Menu>
                    </div>
                </Sider>

                <Content style={{ padding: '24px', minHeight: '80vh', background: '#f5f5f5' }}>
                    {!activeTag ? (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                            <Text type="secondary">Chọn một danh mục để xem khóa học</Text>
                        </div>
                    ) : loading ? (
                        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 60 }}>
                            <Spin tip="Đang tải..." />
                        </div>
                    ) : courses.length === 0 ? (
                        <Empty description="Chưa có khóa học nào trong danh mục này" />
                    ) : (
                        <>
                            <Title level={4} style={{ marginBottom: 20 }}>{activeLabel}</Title>
                            <Row gutter={[16, 16]}>
                                {courses.map(course => (
                                    <Col key={course.id} xs={24} sm={12} lg={8}>
                                        <Card
                                            hoverable
                                            title={course.title}
                                            style={{ height: '100%' }}
                                            extra={
                                                <Tag color="blue">
                                                    {course.price === 0
                                                        ? 'Miễn phí'
                                                        : `${course.price.toLocaleString('vi-VN')} ₫`}
                                                </Tag>
                                            }
                                        >
                                            <Paragraph ellipsis={{ rows: 3 }} type="secondary">
                                                {course.description || 'Chưa có mô tả'}
                                            </Paragraph>
                                            {course.teacher && (
                                                <Text type="secondary" style={{ fontSize: 12 }}>
                                                    Giáo viên: {course.teacher.fullName}
                                                </Text>
                                            )}
                                        </Card>
                                    </Col>
                                ))}
                            </Row>
                        </>
                    )}
                </Content>
            </Layout>
            <FooterComponent />
        </Layout>
    );
};

export default Courses;
