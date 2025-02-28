'use client';
import React from "react";
import { Layout, Menu } from "antd";
import { HomeOutlined, InfoCircleOutlined, TrophyOutlined, BookOutlined, SolutionOutlined, FileTextOutlined, ReadOutlined, PhoneOutlined, LoginOutlined, UserAddOutlined } from "@ant-design/icons";
import Link from "next/link";
import { usePathname } from "next/navigation";

const { Header } = Layout;
const { SubMenu } = Menu;

const NavbarComponent = () => {
    const pathname = usePathname()
    return (
        <Header style={{
            position: "sticky",
            top: 0,
            width: "100%",
            alignItems: "center",
            justifyContent: "space-between",
            zIndex: 1000,
        }}>
            <div className="logo" style={{ float: "left" }}>
                <Link href="/homepage">
                    <img src="/logo.png" alt="Logo" style={{ height: "65px", maxWidth: "150px", cursor: "pointer" }} />
                </Link>
            </div>

            <Menu
                theme="dark"
                mode="horizontal"
                style={{
                    flex: 1,
                    justifyContent: "flex-end",
                    overflow: "visible",
                    whiteSpace: "nowrap"
                }}
            >
                <Menu.Item key="1" icon={<InfoCircleOutlined />}>
                    <Link href="/info">Giới thiệu</Link>
                </Menu.Item>
                <Menu.Item key="2" icon={<TrophyOutlined />}>
                    <Link href="/achievements">Bảng vàng thành tích</Link>
                </Menu.Item>
                <Menu.Item
                    key="/courses"
                    icon={<BookOutlined />}
                    style={pathname === "/courses" ? { backgroundColor: "#2A95DB", color: "#fff" } : {}}
                >
                    <Link href="/courses">Khóa học</Link>
                </Menu.Item>
                <Menu.Item key="4" icon={<SolutionOutlined />}>
                    <Link href="/admission">Tuyển sinh</Link>
                </Menu.Item>
                <Menu.Item key="5" icon={<FileTextOutlined />}>
                    <Link href="/documents">Tài liệu</Link>
                </Menu.Item>
                <Menu.Item key="6" icon={<ReadOutlined />}>
                    <Link href="/news">Tin tức</Link>
                </Menu.Item>
                <Menu.Item key="7" icon={<PhoneOutlined />}>
                    <Link href="/contact">Liên hệ</Link>
                </Menu.Item>

                <SubMenu key="8" title="Khu vực thành viên">
                    <Menu.Item key="login" icon={<LoginOutlined />}>
                        <Link href="/auth/login">Đăng nhập</Link>
                    </Menu.Item>
                    <Menu.Item key="register" icon={<UserAddOutlined />}>
                        <Link href="/auth/register">Đăng ký</Link>
                    </Menu.Item>
                </SubMenu>
            </Menu>
        </Header>
    );
};

export default NavbarComponent;
