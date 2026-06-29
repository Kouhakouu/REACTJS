'use client'
import Layout from "antd/es/layout";
import Menu from "antd/es/menu";
import { AppstoreOutlined, FolderOpenOutlined, MailOutlined, ReadOutlined, SettingOutlined, TeamOutlined, } from '@ant-design/icons';
import React, { useContext } from 'react';
import { AdminContext } from "@/library/admin.context";
import type { MenuProps } from 'antd';
import Link from 'next/link'

type MenuItem = Required<MenuProps>['items'][number];
const TeacherSideBar = () => {
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
                    label: <Link href={"/teacher"}>Dashboard</Link>,
                    icon: <AppstoreOutlined />,
                },
                {
                    key: "classes",
                    label: <Link href={"/teacher/classes"}>QL lớp học</Link>,
                    icon: <TeamOutlined />,
                },
                {
                    key: "course-management",
                    label: <Link href={"/teacher/courseManagement"}>QL Khóa học</Link>,
                    icon: <ReadOutlined />,
                },
                {
                    key: "teacher-document",
                    label: <Link href={"/teacher/teacherDocument"}>Tài liệu giáo viên</Link>,
                    icon: <FolderOpenOutlined />,
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
                defaultSelectedKeys={['']}
                items={items}
                style={{ height: '100vh' }}
            />
        </Sider>
    )
}

export default TeacherSideBar;