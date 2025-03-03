'use client'
import Layout from "antd/es/layout";
import Menu from "antd/es/menu";
import { AppstoreOutlined, MailOutlined, SettingOutlined, TeamOutlined, } from '@ant-design/icons';
import React, { useContext } from 'react';
import { AdminContext } from "@/library/admin.context";
import type { MenuProps } from 'antd';
import Link from 'next/link'

type MenuItem = Required<MenuProps>['items'][number];
const TeacherSideBar = () => {
    const { Sider } = Layout;
    const { collapseMenu } = useContext(AdminContext)!;

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
                    icon: <TeamOutlined />,
                },
                {
                    key: "teacher-document",
                    label: <Link href={"/teacher/teacherDocument"}>Tài liệu giáo viên</Link>,
                    icon: <TeamOutlined />,
                },
            ],
        },
    ];

    return (
        <Sider
            collapsed={collapseMenu}
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