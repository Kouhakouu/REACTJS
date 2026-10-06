'use client'
import { AppstoreOutlined, TeamOutlined, ScheduleOutlined, BookOutlined } from '@ant-design/icons';
import PortalSideBar, { PortalMenuItem } from "@/components/layout/portal.sidebar";

const items: PortalMenuItem[] = [
    { key: "dashboard", href: "/manager", label: "Dashboard", icon: <AppstoreOutlined /> },
    { key: "students", href: "/manager/managing", label: "QL lớp học", icon: <TeamOutlined /> },
    { key: "assistants", href: "/manager/assistants", label: "Phân công trợ giảng", icon: <ScheduleOutlined /> },
    { key: "document", href: "/manager/documents", label: "Tài liệu học tập", icon: <BookOutlined /> },
];

const ManagerSideBar = () => <PortalSideBar title="PhongBui" items={items} />;

export default ManagerSideBar;
