'use client'
import { AppstoreOutlined, FileExcelOutlined, FileTextOutlined, FormOutlined, TeamOutlined, } from '@ant-design/icons';
import PortalSideBar, { PortalMenuItem } from "@/components/layout/portal.sidebar";

const items: PortalMenuItem[] = [
    { key: "dashboard", href: "/assistant", label: "Dashboard", icon: <AppstoreOutlined /> },
    { key: "classes", href: "/assistant/classes", label: "QL lớp học", icon: <TeamOutlined /> },
    { key: "children-homework", href: "/assistant/childrenHomework", label: "Excel chấm bài", icon: <FileExcelOutlined /> },
    { key: "student-homework", href: "/assistant/studentHomework", label: "Chấm bài tập về nhà", icon: <FormOutlined /> },
    { key: "assistant-document", href: "/assistant/assistantDocument", label: "Tài liệu trợ giảng", icon: <FileTextOutlined /> },
];

const AssistantSideBar = () => <PortalSideBar title="PhongBui" items={items} />;

export default AssistantSideBar;
