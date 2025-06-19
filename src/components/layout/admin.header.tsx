'use client';

import { useContext, useMemo } from 'react';
import { Layout, Button, Dropdown, Space } from 'antd';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    DownOutlined,
    SmileOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { AdminContext } from '@/library/admin.context';
import { AuthContext } from '@/library/authContext';

const AdminHeader = () => {
    const { Header } = Layout;
    const { collapseMenu, setCollapseMenu } = useContext(AdminContext)!;
    const { user, logout } = useContext(AuthContext);

    // Compute a display name: prefer fullName, then email, then “Guest”
    const displayName = useMemo(() => {
        if (!user) return 'Guest';
        return user.fullName?.trim() || user.email;
    }, [user]);

    const menuItems: MenuProps['items'] = [
        {
            key: '1',
            label: (
                <a
                    href="https://www.antgroup.com"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Hồ sơ
                </a>
            ),
        },
        {
            key: '2',
            icon: <SmileOutlined />,
            label: (
                <a
                    href="https://www.aliyun.com"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Đổi mật khẩu
                </a>
            ),
            disabled: true,
        },
        {
            key: '3',
            label: (
                <a
                    href="https://www.luohanacademy.com"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Cài đặt
                </a>
            ),
            disabled: true,
        },
        {
            key: '4',
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

export default AdminHeader;
