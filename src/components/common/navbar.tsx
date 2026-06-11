'use client';
import React, { useState } from "react";
import { Layout, Menu, Button, Drawer } from "antd";
import { InfoCircleOutlined, TrophyOutlined, BookOutlined, SolutionOutlined, FileTextOutlined, ReadOutlined, PhoneOutlined, LoginOutlined, UserAddOutlined, SmileOutlined, MenuOutlined, UserOutlined } from "@ant-design/icons";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { MenuProps } from "antd";

const { Header } = Layout;

const menuItems: MenuProps['items'] = [
    {
        key: "/info",
        icon: <InfoCircleOutlined />,
        label: <Link href="/info">Giới thiệu</Link>,
    },
    {
        key: "/achievements",
        icon: <TrophyOutlined />,
        label: <Link href="/achievements">Bảng vàng thành tích</Link>,
    },
    {
        key: "/courses",
        icon: <BookOutlined />,
        label: <Link href="/courses">Khóa học</Link>,
    },
    {
        key: "admission",
        icon: <SolutionOutlined />,
        label: "Tuyển sinh",
        children: [
            {
                key: "/admission/primary",
                icon: <SmileOutlined />,
                label: <Link href="/admission/primary">Khối Tiểu học</Link>,
            },
            {
                key: "/admission/secondary",
                icon: <ReadOutlined />,
                label: <Link href="/admission/secondary">Khối THCS</Link>,
            },
            {
                key: "/admission/high",
                icon: <TrophyOutlined />,
                label: <Link href="/admission/high">Khối THPT</Link>,
            },
        ],
    },
    {
        key: "/documents",
        icon: <FileTextOutlined />,
        label: <Link href="/documents">Tài liệu</Link>,
    },
    {
        key: "/news",
        icon: <ReadOutlined />,
        label: <Link href="/news">Tin tức</Link>,
    },
    {
        key: "/contact",
        icon: <PhoneOutlined />,
        label: <Link href="/contact">Liên hệ</Link>,
    },
    {
        key: "member",
        icon: <UserOutlined />,
        label: "Khu vực thành viên",
        children: [
            {
                key: "/auth/login",
                icon: <LoginOutlined />,
                label: <Link href="/auth/login">Đăng nhập</Link>,
            },
            {
                key: "/auth/register",
                icon: <UserAddOutlined />,
                label: <Link href="/auth/register">Đăng ký</Link>,
            },
        ],
    },
];

const NavbarComponent = () => {
    const pathname = usePathname();
    const [drawerOpen, setDrawerOpen] = useState(false);

    return (
        <Header style={{
            position: "sticky",
            top: 0,
            width: "100%",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            paddingInline: 16,
        }}>
            <Link href="/homepage" style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
                <img src="/logo.png" alt="Logo" style={{ height: "48px", maxWidth: "150px", cursor: "pointer" }} />
            </Link>

            {/* Menu ngang — chỉ hiện trên màn hình lớn (ẩn bằng CSS trong globals.css) */}
            <Menu
                className="navbar-menu-desktop"
                theme="dark"
                mode="horizontal"
                selectedKeys={[pathname]}
                items={menuItems}
                style={{
                    flex: 1,
                    minWidth: 0,
                    justifyContent: "flex-end",
                }}
            />

            {/* Nút mở menu — chỉ hiện trên màn hình nhỏ */}
            <Button
                className="navbar-mobile-trigger"
                type="text"
                aria-label="Mở menu"
                icon={<MenuOutlined style={{ color: "#fff", fontSize: 20 }} />}
                onClick={() => setDrawerOpen(true)}
                style={{ marginLeft: "auto" }}
            />

            <Drawer
                title="CMATH"
                placement="right"
                width={280}
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                styles={{ body: { padding: 0 } }}
            >
                <Menu
                    mode="inline"
                    selectedKeys={[pathname]}
                    items={menuItems}
                    onClick={() => setDrawerOpen(false)}
                    style={{ borderRight: 0 }}
                />
            </Drawer>
        </Header>
    );
};

export default NavbarComponent;
