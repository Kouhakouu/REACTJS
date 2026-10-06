'use client'
import { useContext, useEffect, useState } from 'react';
import { Layout, Menu } from 'antd';
import type { MenuProps } from 'antd';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AdminContext } from '@/library/admin.context';

export interface PortalMenuItem {
    key: string;
    href: string;
    label: React.ReactNode;
    icon?: React.ReactNode;
}

interface PortalSideBarProps {
    items: PortalMenuItem[];
    title?: React.ReactNode; // tiêu đề nhóm menu (vd: "PhongBui")
    logo?: React.ReactNode;  // khối hiển thị phía trên menu
}

// Sidebar dùng chung cho các khu vực admin / giáo viên / phụ trách / trợ giảng / học sinh.
// - Màn hình lớn (>= 992px): sidebar nằm cạnh nội dung, dính (sticky) khi cuộn.
// - Màn hình nhỏ: sidebar trượt ra đè lên nội dung, có lớp nền mờ, chọn menu xong tự đóng.
const PortalSideBar = ({ items, title, logo }: PortalSideBarProps) => {
    const { Sider } = Layout;
    const { collapseMenu, setCollapseMenu } = useContext(AdminContext)!;
    const pathname = usePathname();
    const [isMobile, setIsMobile] = useState(false);
    // Trước khi hydrate chưa biết là mobile hay không -> CSS ẩn sidebar trên màn nhỏ để tránh nháy
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    // Trang gốc của mỗi khu vực (vd: /assistant) chỉ được chọn khi khớp chính xác,
    // các trang khác được chọn cả khi đang ở trang con (vd: /assistant/classes/12)
    const selectedKey = items
        .filter(item =>
            pathname === item.href ||
            (item.href.split('/').length > 2 && pathname.startsWith(item.href + '/'))
        )
        .sort((a, b) => b.href.length - a.href.length)[0]?.key;

    const menuItems: MenuProps['items'] = items.map(item => ({
        key: item.key,
        icon: item.icon,
        label: <Link href={item.href}>{item.label}</Link>,
    }));

    const closeOnMobile = () => {
        if (isMobile) setCollapseMenu(true);
    };

    return (
        <>
            {isMobile && !collapseMenu && (
                <div className="portal-sider-mask" onClick={() => setCollapseMenu(true)} />
            )}
            <Sider
                className={`portal-sider${mounted ? ' portal-sider--ready' : ''}`}
                theme="light"
                width={220}
                collapsed={collapseMenu}
                breakpoint="lg"
                collapsedWidth={0}
                trigger={null}
                onBreakpoint={(broken) => {
                    setIsMobile(broken);
                    setCollapseMenu(broken);
                }}
            >
                {logo}
                <Menu
                    mode="inline"
                    selectedKeys={selectedKey ? [selectedKey] : []}
                    items={title ? [{ key: 'grp', label: title, type: 'group', children: menuItems }] : menuItems}
                    onClick={closeOnMobile}
                    style={{ borderInlineEnd: 0 }}
                />
            </Sider>
        </>
    );
};

export default PortalSideBar;
