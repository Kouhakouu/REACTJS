'use client'
import Layout from "antd/es/layout";
import Menu from "antd/es/menu";
import { AppstoreOutlined, DashboardOutlined, SolutionOutlined, ApartmentOutlined, BankOutlined, ScheduleOutlined, ContactsOutlined, TeamOutlined, BookOutlined } from '@ant-design/icons';
import React, { useContext } from 'react';
import { AdminContext } from "@/library/admin.context";
import type { MenuProps } from 'antd';
import Link from 'next/link'

type MenuItem = Required<MenuProps>['items'][number];
const AdminSideBar = () => {
    const { Sider } = Layout;
    const { collapseMenu, setCollapseMenu } = useContext(AdminContext)!;

    const items: MenuItem[] = [
        {
            key: 'grp',
            label: 'PhongBui',
            type: 'group',
            children: [
                {
                    key: "dashboard",
                    label: <Link href={"/dashboard"}>Dashboard</Link>,
                    icon: <DashboardOutlined />,
                },
                {
                    key: "teacher",
                    label: <Link href={"/dashboard/teacher"}>QL giáo viên</Link>,
                    icon: <SolutionOutlined />,
                },
                {
                    key: "staff",
                    label: <Link href={"/dashboard/staff"}>QL phụ trách khối</Link>,
                    icon: <ApartmentOutlined />,
                },
                {
                    key: "classes",
                    label: <Link href={"/dashboard/class"}>QL lớp học</Link>,
                    icon: <BankOutlined />,
                },
                {
                    key: "classSchedules",
                    label: <Link href={"/dashboard/schedule"}>QL lịch học</Link>,
                    icon: <ScheduleOutlined />, // Icon thời khóa biểu/lịch trình
                },
                {
                    key: "ta",
                    label: <Link href={"/dashboard/ta"}>QL trợ giảng</Link>,
                    icon: <ContactsOutlined />, // Icon danh bạ/nhân sự hỗ trợ
                },
                {
                    key: "student",
                    label: <Link href={"/dashboard/student"}>QL học sinh</Link>,
                    icon: <TeamOutlined />, // Giữ lại icon Team cho học sinh (đám đông)
                },
                {
                    key: "courses",
                    label: <Link href={"/dashboard/courses"}>QL khóa học</Link>,
                    icon: <BookOutlined />, // Icon cuốn sách cho khóa học
                },
            ],
        },
    ];

    return (
        <Sider
            collapsed={collapseMenu}
            breakpoint="lg"
            collapsedWidth={0}
            trigger={null}
            onBreakpoint={(broken) => setCollapseMenu(broken)}
        >

            <Menu
                mode="inline"
                defaultSelectedKeys={['dashboard']}
                items={items}
                style={{ height: '100vh' }}
            />
        </Sider>
    )
}

export default AdminSideBar;