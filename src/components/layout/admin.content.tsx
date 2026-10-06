'use client'

import { Layout } from "antd";

const AdminContent = ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {
    const { Content } = Layout;

    return (
        <Content>
            {/* padding co lại trên màn hình nhỏ — xem .portal-content trong globals.css */}
            <div className="portal-content">
                {children}
            </div>
        </Content>
    )
}

export default AdminContent;
