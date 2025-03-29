'use client'
import Layout from "antd/es/layout";
import Menu from "antd/es/menu";
import { AppstoreOutlined, MailOutlined, SettingOutlined, TeamOutlined, } from '@ant-design/icons';
import React, { useContext } from 'react';
import { AdminContext } from "@/library/admin.context";
import type { MenuProps } from 'antd';
import Link from 'next/link'

type MenuItem = Required<MenuProps>['items'][number];
const ManagerSideBar = () => {
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
                    label: <Link href={"/manager"}>Dashboard</Link>,
                    icon: <AppstoreOutlined />,
                },
                {
                    key: "students",
                    label: <Link href={"/manager/managing"}>QL lớp học</Link>,
                    icon: <TeamOutlined />,
                },
                {
                    key: "assistants",
                    label: <Link href={"/manager/assistants"}>Phân công trợ giảng</Link>,
                    icon: <TeamOutlined />,
                },
                {
                    key: "document",
                    label: <Link href={"/manager/documents"}>Tài liệu học tập</Link>,
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

export default ManagerSideBar;