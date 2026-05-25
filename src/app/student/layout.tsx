"use client";

import React, { useContext } from 'react';
import { Layout, Menu, Avatar, Dropdown, theme, MenuProps } from 'antd';
import { useRouter, usePathname } from 'next/navigation';
import {
    DashboardOutlined,
    BookOutlined,
    UserOutlined,
    LogoutOutlined,
    LockOutlined,
} from '@ant-design/icons';
import { AuthContext } from '@/library/authContext';

const { Sider, Content, Header } = Layout;

export default function StudentLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const { token: antToken } = theme.useToken();
    const { user, logout } = useContext(AuthContext);

    const menuItems = [
        {
            key: '/student',
            icon: <DashboardOutlined />,
            label: 'Tổng quan',
        },
        {
            key: '/student/classes',
            icon: <BookOutlined />,
            label: 'Lớp học của tôi',
        },
        {
            key: '/student/profile',
            icon: <UserOutlined />,
            label: 'Hồ sơ của tôi',
        },
    ];

    const userDropdownItems: MenuProps['items'] = [
        {
            key: 'profile',
            icon: <UserOutlined />,
            label: 'Hồ sơ của tôi',
            onClick: () => router.push('/student/profile'),
        },
        {
            key: 'password',
            icon: <LockOutlined />,
            label: 'Đổi mật khẩu',
            onClick: () => router.push('/student/profile?tab=password'),
        },
        {
            type: 'divider',
        },
        {
            key: 'logout',
            icon: <LogoutOutlined />,
            label: 'Đăng xuất',
            danger: true,
            onClick: logout,
        },
    ];

    // Highlight đúng menu khi vào trang con (vd: /student/classes/1)
    const selectedKey = menuItems.map(m => m.key).find(k => pathname.startsWith(k) && (k !== '/student' || pathname === '/student')) ?? '/student';

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider collapsible theme="light">
                <div
                    style={{
                        height: 32,
                        margin: 16,
                        background: 'rgba(0,0,0,0.05)',
                        borderRadius: 6,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold',
                        color: antToken.colorPrimary,
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                    }}
                >
                    CMATH EDUCATION
                </div>
                <Menu
                    theme="light"
                    mode="inline"
                    selectedKeys={[selectedKey]}
                    items={menuItems}
                    onClick={({ key }) => router.push(key)}
                />
            </Sider>

            <Layout>
                <Header
                    style={{
                        padding: '0 24px',
                        background: '#fff',
                        display: 'flex',
                        justifyContent: 'flex-end',
                        alignItems: 'center',
                        boxShadow: '0 1px 4px rgba(0,21,41,.08)',
                    }}
                >
                    <Dropdown menu={{ items: userDropdownItems }} placement="bottomRight" arrow>
                        <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
                            <Avatar style={{ backgroundColor: antToken.colorPrimary }} icon={<UserOutlined />} />
                            <span style={{ fontWeight: 500 }}>{user?.fullName ?? 'Học sinh'}</span>
                        </div>
                    </Dropdown>
                </Header>

                <Content style={{ margin: '24px 16px', padding: 24, minHeight: 280, background: '#fff', borderRadius: 8 }}>
                    {children}
                </Content>
            </Layout>
        </Layout>
    );
}
