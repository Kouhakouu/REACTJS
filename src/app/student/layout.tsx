"use client";

import React, { useContext } from 'react';
import { Layout, Avatar, Button, Dropdown, theme, MenuProps } from 'antd';
import { useRouter } from 'next/navigation';
import {
    DashboardOutlined,
    BookOutlined,
    UserOutlined,
    LogoutOutlined,
    LockOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
} from '@ant-design/icons';
import { AuthContext } from '@/library/authContext';
import { AdminContext, AdminContextProvider } from '@/library/admin.context';
import PortalSideBar, { PortalMenuItem } from '@/components/layout/portal.sidebar';

const { Content, Header } = Layout;

const menuItems: PortalMenuItem[] = [
    { key: '/student', href: '/student', icon: <DashboardOutlined />, label: 'Tổng quan' },
    { key: '/student/classes', href: '/student/classes', icon: <BookOutlined />, label: 'Lớp học của tôi' },
    { key: '/student/profile', href: '/student/profile', icon: <UserOutlined />, label: 'Hồ sơ của tôi' },
];

const StudentHeader = () => {
    const router = useRouter();
    const { token: antToken } = theme.useToken();
    const { user, logout } = useContext(AuthContext);
    const { collapseMenu, setCollapseMenu } = useContext(AdminContext)!;

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

    return (
        <Header
            className="portal-header"
            style={{ background: '#fff', boxShadow: '0 1px 4px rgba(0,21,41,.08)' }}
        >
            <Button
                type="text"
                aria-label={collapseMenu ? 'Mở menu' : 'Đóng menu'}
                icon={collapseMenu ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => setCollapseMenu(!collapseMenu)}
                style={{ fontSize: 16, width: 64, height: 64, flexShrink: 0 }}
            />
            <Dropdown menu={{ items: userDropdownItems }} placement="bottomRight" arrow>
                <div className="portal-header-user" style={{ cursor: 'pointer', gap: 8 }}>
                    <Avatar style={{ backgroundColor: antToken.colorPrimary, flexShrink: 0 }} icon={<UserOutlined />} />
                    <span className="portal-header-name" style={{ fontWeight: 500 }}>{user?.fullName ?? 'Học sinh'}</span>
                </div>
            </Dropdown>
        </Header>
    );
};

export default function StudentLayout({ children }: { children: React.ReactNode }) {
    const { token: antToken } = theme.useToken();

    return (
        <AdminContextProvider>
            <Layout style={{ minHeight: '100vh' }}>
                <PortalSideBar
                    items={menuItems}
                    logo={
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
                    }
                />

                <Layout style={{ minWidth: 0 }}>
                    <StudentHeader />

                    {/* margin/padding co lại trên màn hình nhỏ — xem .student-content trong globals.css */}
                    <Content className="student-content">
                        {children}
                    </Content>
                </Layout>
            </Layout>
        </AdminContextProvider>
    );
}
