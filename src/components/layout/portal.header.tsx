'use client';

import { useContext, useMemo } from 'react';
import { Layout, Button, Dropdown } from 'antd';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    DownOutlined,
    UserOutlined,
    LockOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { useRouter } from 'next/navigation';
import { AdminContext } from '@/library/admin.context';
import { AuthContext } from '@/library/authContext';

interface PortalHeaderProps {
    profilePath: string; // vd: /assistant/profile
}

// Header dùng chung: nút đóng/mở sidebar + menu tài khoản.
// Trên màn hình nhỏ ẩn chữ "Xin chào," và cắt bớt tên dài bằng dấu "..." (xem globals.css).
const PortalHeader = ({ profilePath }: PortalHeaderProps) => {
    const { Header } = Layout;
    const { collapseMenu, setCollapseMenu } = useContext(AdminContext)!;
    const { user, logout } = useContext(AuthContext);
    const router = useRouter();

    const displayName = useMemo(() => {
        if (!user) return 'Guest';
        return user.fullName?.trim() || user.email;
    }, [user]);

    const menuItems: MenuProps['items'] = [
        {
            key: 'profile',
            icon: <UserOutlined />,
            label: 'Hồ sơ của tôi',
            onClick: () => router.push(profilePath),
        },
        {
            key: 'password',
            icon: <LockOutlined />,
            label: 'Đổi mật khẩu',
            onClick: () => router.push(`${profilePath}?tab=password`),
        },
        { type: 'divider' },
        {
            key: 'logout',
            danger: true,
            label: 'Đăng xuất',
            onClick: logout,
        },
    ];

    return (
        <Header className="portal-header">
            <Button
                type="text"
                aria-label={collapseMenu ? 'Mở menu' : 'Đóng menu'}
                icon={collapseMenu ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => setCollapseMenu(!collapseMenu)}
                style={{ fontSize: 16, width: 64, height: 64, flexShrink: 0 }}
            />

            <Dropdown menu={{ items: menuItems }} trigger={['click']} placement="bottomRight">
                <a onClick={(e) => e.preventDefault()} className="portal-header-user">
                    <span className="portal-header-greeting">Xin chào,</span>
                    <span className="portal-header-name">{displayName}</span>
                    <DownOutlined style={{ fontSize: 12, flexShrink: 0 }} />
                </a>
            </Dropdown>
        </Header>
    );
};

export default PortalHeader;
