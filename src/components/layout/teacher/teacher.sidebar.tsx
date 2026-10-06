'use client'
import { AppstoreOutlined, FolderOpenOutlined, ReadOutlined, TeamOutlined, } from '@ant-design/icons';
import PortalSideBar, { PortalMenuItem } from "@/components/layout/portal.sidebar";

const items: PortalMenuItem[] = [
    { key: "dashboard", href: "/teacher", label: "Dashboard", icon: <AppstoreOutlined /> },
    { key: "classes", href: "/teacher/classes", label: "QL lớp học", icon: <TeamOutlined /> },
    { key: "course-management", href: "/teacher/courseManagement", label: "QL Khóa học", icon: <ReadOutlined /> },
    { key: "teacher-document", href: "/teacher/teacherDocument", label: "Tài liệu giáo viên", icon: <FolderOpenOutlined /> },
];

const TeacherSideBar = () => <PortalSideBar title="PhongBui" items={items} />;

export default TeacherSideBar;
