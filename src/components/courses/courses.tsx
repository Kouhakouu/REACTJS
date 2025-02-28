'use client'
import React, { useState } from 'react'
import NavbarComponent from "@/components/common/navbar";
import FooterComponent from "@/components/common/footer";
import { Layout, Row, Col, Card, Checkbox, Button, Typography } from "antd";
const { Content, Sider } = Layout;
const { Title } = Typography;

const Courses = () => {
    const skills = [
        "Frontend React.JS",
        "Mobile React Native",
        "Backend Node.JS",
        "Backend Java",
        "Sinh Tồn",
    ];
    const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
    const handleSkillChange = (checkedValues: any) => {
        setSelectedSkills(checkedValues);
    };
    return (
        <Layout>
            <NavbarComponent />
            <Layout>
                <Sider width={300} style={{ background: "#fff", padding: "20px", borderRadius: "10px" }}>
                    <Title level={4}>Phân loại:</Title>
                    <Checkbox.Group
                        style={{ display: "flex", flexDirection: "column", gap: "10px" }}
                        onChange={handleSkillChange}
                    >
                        {skills.map((skill, index) => (
                            <Checkbox key={index} value={skill} style={{ fontSize: "16px" }}>
                                {skill}
                            </Checkbox>
                        ))}
                    </Checkbox.Group>
                    <hr style={{ margin: "20px 0" }} />
                    <Button type="primary" block>
                        Gợi Ý Khóa Học
                    </Button>
                </Sider>
            </Layout>
            <FooterComponent />
        </Layout>
    )
}

export default Courses