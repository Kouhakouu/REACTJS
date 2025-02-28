'use client';
import React from "react";
import { Layout, Row, Col, Typography } from "antd";

const { Footer } = Layout;
const { Title, Paragraph } = Typography;

const FooterComponent = () => {
    return (
        <Footer style={{ background: "#FFD700", padding: "40px 10%", color: "#000" }}>
            <Row gutter={[32, 32]} justify="space-around" align="top">
                <Col xs={24} md={7} style={{ textAlign: "left" }}>
                    <Title level={4} style={{ color: "#000", marginBottom: "20px" }}>
                        Câu lạc bộ Toán học muôn màu
                    </Title>
                </Col>

                <Col xs={24} md={10} style={{ paddingLeft: "20px" }}>
                    <Paragraph><strong>Địa chỉ:</strong></Paragraph>
                    <Paragraph>CS1: NTT12, Thống Nhất Complex, 82 Nguyễn Tuân, Thanh Xuân, Hà Nội.</Paragraph>
                    <Paragraph>CS2: NTT06, Thống Nhất Complex, 82 Nguyễn Tuân, Thanh Xuân, Hà Nội.</Paragraph>
                    <Paragraph>CS3: 12A Khu C Đô thị A10 Nam Trung Yên, Trung Hòa, Cầu Giấy.</Paragraph>
                    <Paragraph><strong>Hotline:</strong> 0911 190 991 - 0973872184 - 0981571746</Paragraph>
                </Col>

                <Col xs={24} md={7} style={{ paddingLeft: "20px" }}>
                    <Paragraph><strong>Website:</strong> cmath.edu.vn</Paragraph>
                    <Paragraph><strong>Email:</strong> info@cskh.cmath.edu.vn</Paragraph>
                    <Paragraph><strong>Facebook:</strong> fb.com/clbtoanhocmuonmau</Paragraph>
                    <Paragraph><strong>Youtube:</strong> youtube.com/@cmatheducation1800</Paragraph>
                    <Paragraph><strong>Tiktok:</strong> tiktok.com/@toanthaycan</Paragraph>
                </Col>
            </Row>

            <Row justify="center" style={{ marginTop: "20px" }}>
                <Col>
                    <Paragraph style={{ textAlign: "center", fontSize: "14px", color: "#000" }}>
                        CMATH ©2025 Created by PhongBui
                    </Paragraph>
                </Col>
            </Row>
        </Footer>
    );
};

export default FooterComponent;
