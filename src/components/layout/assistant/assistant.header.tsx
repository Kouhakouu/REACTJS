// assistant.header.tsx
'use client';
import { useContext, useMemo } from 'react';
import { Layout, Button, Dropdown, Space } from 'antd';
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

const AssistantHeader: React.FC = () => {
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
            onClick: () => router.push('/assistant/profile'),
        },
        {
            key: 'password',
            icon: <LockOutlined />,
            label: 'Đổi mật khẩu',
            onClick: () => router.push('/assistant/profile?tab=password'),
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
        <Header
            style={{
                padding: 0,
                display: 'flex',
                background: '#f5f5f5',
                justifyContent: 'space-between',
                alignItems: 'center',
            }}
        >
            <Button
                type="text"
                icon={collapseMenu ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => setCollapseMenu(!collapseMenu)}
                style={{ fontSize: 16, width: 64, height: 64 }}
            />

            <Dropdown menu={{ items: menuItems }} trigger={['click']}>
                <a
                    onClick={(e) => e.preventDefault()}
                    style={{ marginRight: 20, cursor: 'pointer' }}
                >
                    <Space>
                        Welcome, {displayName}
                        <DownOutlined />
                    </Space>
                </a>
            </Dropdown>
        </Header>
    );
};

export default AssistantHeader;
