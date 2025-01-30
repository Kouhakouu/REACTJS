'use client'
import React from "react";
import { Layout, Menu, Button, Row, Col, Card, Typography } from "antd";
import { HomeOutlined, InfoCircleOutlined, PhoneOutlined, TrophyOutlined, BookOutlined, SolutionOutlined, FileTextOutlined, ReadOutlined, SafetyOutlined, TeamOutlined, HeartOutlined } from "@ant-design/icons";
const { Title, Paragraph } = Typography;
const { Header, Content, Footer } = Layout;

const HomePage = () => {
    const features = [
        {
            title: "TRIẾT LÝ DẠY HỌC",
            description:
                "Tại Câu lạc bộ: Các thầy cô luôn có những phương pháp giảng dạy để truyền ngọn lửa đam mê môn học cho các con, giúp khơi gợi niềm say mê học tập.",
            icon: <SafetyOutlined style={{ fontSize: "40px", color: "#fff" }} />,
            bgColor: "#3bb25e",
        },
        {
            title: "PHƯƠNG PHÁP GIẢNG DẠY",
            description:
                "Các bài học được thiết kế đòi hỏi các con tư duy, suy nghĩ theo chiều sâu, hướng tới mục tiêu giải bài học theo nhiều cách giải đa dạng, không rập khuôn, máy móc.",
            icon: <TeamOutlined style={{ fontSize: "40px", color: "#fff" }} />,
            bgColor: "#2a95db",
        },
        {
            title: "ĐỘI NGŨ GIÁO VIÊN",
            description:
                "Giáo viên tại CLB đều là các thầy cô tận tâm, nhiệt tình, yêu trẻ, chuyên môn giỏi, có nhiều năm giảng dạy cho các con luyện thi chuyên, luyện thi điều kiện.",
            icon: <HeartOutlined style={{ fontSize: "40px", color: "#fff" }} />,
            bgColor: "#e65385",
        },
        {
            title: "ĐÁNH GIÁ HỌC SINH",
            description:
                "Sau mỗi buổi học CLB đều gửi tình hình học tập của con tới Phụ huynh và cứ 2 tháng có bài kiểm tra đánh giá trình độ giúp giáo viên nắm bắt được sự tiến bộ của các con.",
            icon: <TrophyOutlined style={{ fontSize: "40px", color: "#fff" }} />,
            bgColor: "#f4a621",
        },
    ];
    return (
        <Layout>
            <Header style={{
                position: "sticky",
                top: 10,
                width: "100%",
                alignItems: "center",
                justifyContent: "space-between",
            }}>
                <div className="logo" style={{ float: "left" }}>
                    <img src="/logo.png" alt="Logo" style={{ height: "65px", maxWidth: "150px" }} />
                </div>

                <Menu
                    theme="dark"
                    mode="horizontal"
                    style={{
                        flex: 1,
                        justifyContent: "flex-end",
                        overflow: "visible",
                        whiteSpace: "nowrap"
                    }}
                >
                    <Menu.Item key="1" icon={<InfoCircleOutlined />}>Giới thiệu</Menu.Item>
                    <Menu.Item key="2" icon={<TrophyOutlined />}>Bảng vàng thành tích</Menu.Item>
                    <Menu.Item key="3" icon={<BookOutlined />}>Khóa học</Menu.Item>
                    <Menu.Item key="4" icon={<SolutionOutlined />}>Tuyển sinh</Menu.Item>
                    <Menu.Item key="5" icon={<FileTextOutlined />}>Tài liệu</Menu.Item>
                    <Menu.Item key="6" icon={<ReadOutlined />}>Tin tức</Menu.Item>
                    <Menu.Item key="7" icon={<PhoneOutlined />}>Liên hệ</Menu.Item>
                </Menu>
            </Header>

            <Content>
                <div>
                    <img src="/HAPPY NEW YEAR.png" alt="Hero" style={{ width: "100%", height: "auto" }} />
                </div>

                <div style={{ textAlign: "center", padding: "50px 10%", background: "#fff" }}>
                    <Title level={1} style={{ fontSize: "50px" }}>Vì sao chọn chúng tôi</Title>
                    <div style={{ width: "80px", height: "3px", background: "#f4c20d", margin: "auto" }}></div>

                    <Row gutter={[32, 32]} justify="center">
                        {features.map((feature, index) => (
                            <Col xs={24} sm={12} md={6} key={index}>
                                <Card bordered={false} style={{ textAlign: "center", padding: "5px", boxShadow: "none" }}>
                                    <div
                                        style={{
                                            width: "80px",
                                            height: "80px",
                                            borderRadius: "50%",
                                            backgroundColor: feature.bgColor,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            margin: "0 auto 15px",
                                        }}
                                    >
                                        {feature.icon}
                                    </div>
                                    <Title level={4} style={{ fontSize: "17px" }}>{feature.title}</Title>
                                    <Paragraph>{feature.description}</Paragraph>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </div>

                <div>

                </div>

            </Content>

            {/* Footer */}
            <Footer style={{ textAlign: "center", background: "#001529", color: "#fff", padding: "20px" }}>
                MyWebsite ©2025 Created by Me
            </Footer>
        </Layout>
    );
};

export default HomePage;
