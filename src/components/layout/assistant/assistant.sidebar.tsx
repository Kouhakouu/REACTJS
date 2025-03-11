'use client'
import Layout from "antd/es/layout";
import Menu from "antd/es/menu";
import { AppstoreOutlined, MailOutlined, SettingOutlined, TeamOutlined, } from '@ant-design/icons';
import React, { useContext } from 'react';
import { AdminContext } from "@/library/admin.context";
import type { MenuProps } from 'antd';
import Link from 'next/link'

type MenuItem = Required<MenuProps>['items'][number];
const AssistantSideBar = () => {
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
                    label: <Link href={"/assistant"}>Dashboard</Link>,
                    icon: <AppstoreOutlined />,
                },
                {
                    key: "classes",
                    label: <Link href={"/assistant/classes"}>QL lớp học</Link>,
                    icon: <TeamOutlined />,
                },
                {
                    key: "children-homework",
                    label: <Link href={"/assistant/childrenHomework"}>Excel chấm bài</Link>,
                    icon: <TeamOutlined />,
                },
                {
                    key: "student-homework",
                    label: <Link href={`/assistant/studentHomework`}>Chấm bài tập về nhà</Link>,
                    icon: <TeamOutlined />,
                },
                {
                    key: "assistant-document",
                    label: <Link href={"/assistant/assistantDocument"}>Tài liệu trợ giảng</Link>,
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

export default AssistantSideBar;