'use client'
import { DashboardOutlined, SolutionOutlined, ApartmentOutlined, BankOutlined, ScheduleOutlined, ContactsOutlined, TeamOutlined, BookOutlined } from '@ant-design/icons';
import PortalSideBar, { PortalMenuItem } from "@/components/layout/portal.sidebar";

const items: PortalMenuItem[] = [
    { key: "dashboard", href: "/dashboard", label: "Dashboard", icon: <DashboardOutlined /> },
    { key: "teacher", href: "/dashboard/teacher", label: "QL giáo viên", icon: <SolutionOutlined /> },
    { key: "staff", href: "/dashboard/staff", label: "QL phụ trách khối", icon: <ApartmentOutlined /> },
    { key: "classes", href: "/dashboard/class", label: "QL lớp học", icon: <BankOutlined /> },
    { key: "classSchedules", href: "/dashboard/schedule", label: "QL lịch học", icon: <ScheduleOutlined /> }, // Icon thời khóa biểu/lịch trình
    { key: "ta", href: "/dashboard/ta", label: "QL trợ giảng", icon: <ContactsOutlined /> }, // Icon danh bạ/nhân sự hỗ trợ
    { key: "student", href: "/dashboard/student", label: "QL học sinh", icon: <TeamOutlined /> }, // Giữ lại icon Team cho học sinh (đám đông)
    { key: "courses", href: "/dashboard/courses", label: "QL khóa học", icon: <BookOutlined /> }, // Icon cuốn sách cho khóa học
];

const AdminSideBar = () => <PortalSideBar title="PhongBui" items={items} />;

export default AdminSideBar;
