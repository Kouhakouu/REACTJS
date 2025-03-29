'use client'
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import NavbarComponent from '@/components/common/navbar';
import FooterComponent from '@/components/common/footer';
import { Layout, Typography, Menu } from 'antd';

const { Content, Sider } = Layout;
const { Title } = Typography;

const sidebarItems = [
    { key: 'primary', label: 'Toán Tiểu học', path: '/courses/primary' },
    { key: 'middle-basic', label: 'Toán cơ bản Trung học cơ sở', path: '/courses/middle-basic' },
    { key: 'middle-advanced', label: 'Toán ôn thi cận chuyên THCS', path: '/courses/middle-advanced' },
    { key: 'middle-specialized', label: 'Toán ôn thi chuyên THCS', path: '/courses/middle-specialized' },
];

const Courses = () => {
    const pathname = usePathname();

    return (
        <Layout>
            <NavbarComponent />
            <Layout>
                <Sider width={300} style={{ background: '#fff', padding: '20px', borderRadius: '10px' }}>
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
                </Sider>
                <Content style={{ padding: '20px', minHeight: '80vh' }}>
                    {/* Nội dung chính sẽ hiển thị ở đây */}
                </Content>
            </Layout>
            <FooterComponent />
        </Layout>
    );
};

export default Courses;
