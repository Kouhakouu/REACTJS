'use client'

import { Layout } from "antd";

const ManagerContent = ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {
    const { Content } = Layout;

    return (
        <Content>
            <div
                style={{
                    padding: 24,
                    minHeight: 'calc(100vh - 180px)',
                    // background: "#ccc",
                    // borderRadius: "#ccc",
                }}
            >
                {children}
            </div>
        </Content>
    )
}

export default ManagerContent;