'use client'

import React from 'react'
import {
    ArrowRightOutlined,
    BookOutlined,
    CheckCircleOutlined,
    ReadOutlined,
    TeamOutlined,
    StarFilled,
} from '@ant-design/icons'
import { Layout, Button, Card, Col, Row, Space, Typography } from 'antd'
import NavbarComponent from '@/components/common/navbar';
import FooterComponent from '@/components/common/footer';

const { Title, Paragraph, Text } = Typography

const features = [
    {
        icon: <BookOutlined style={{ fontSize: 28 }} />,
        title: 'Lộ trình bài bản',
        desc: 'Xây nền tảng toán tiểu học vững chắc từ cơ bản đến nâng cao, học theo từng chủ đề rõ ràng.',
    },
    {
        icon: <TeamOutlined style={{ fontSize: 28 }} />,
        title: 'Phù hợp nhiều đối tượng',
        desc: 'Dành cho học sinh cần củng cố kiến thức, luyện thêm và chuẩn bị tốt cho các cấp học tiếp theo.',
    },
    {
        icon: <ReadOutlined style={{ fontSize: 28 }} />,
        title: 'Giảng dạy dễ hiểu',
        desc: 'Bài học được thiết kế trực quan, sinh động, giúp học sinh tiếp thu nhẹ nhàng và hiệu quả hơn.',
    },
]

const benefits = [
    'Hệ thống kiến thức bám sát chương trình học',
    'Bài tập luyện tập đa dạng với độ khó tăng dần',
    'Phát triển tư duy logic và kỹ năng giải toán',
    'Học online linh hoạt, dễ theo dõi tiến độ',
]

const Primary = () => {
    return (
        <Layout>
            <NavbarComponent />
            <Layout>
                {/* Hero Section */}
                <div style={{ maxWidth: 1200, margin: '0 auto', padding: '72px 24px 48px' }}>
                    <Row gutter={[40, 40]} align="middle">
                        <Col xs={24} lg={12}>
                            <Space direction="vertical" size={20} style={{ width: '100%' }}>
                                <div
                                    style={{
                                        display: 'inline-block',
                                        padding: '8px 16px',
                                        borderRadius: 999,
                                        background: '#e6f4ff',
                                        color: '#1677ff',
                                        fontWeight: 600,
                                        width: 'fit-content',
                                    }}
                                >
                                    Chương trình Tiểu học
                                </div>

                                <Title
                                    level={1}
                                    style={{
                                        margin: 0,
                                        fontSize: 'clamp(36px, 6vw, 60px)',
                                        lineHeight: 1.15,
                                    }}
                                >
                                    Toán Tiểu Học
                                    <br />
                                    <span
                                        style={{
                                            background: 'linear-gradient(90deg, #1677ff, #36cfc9)',
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent',
                                        }}
                                    >
                                        vững gốc, tiến bộ mỗi ngày
                                    </span>
                                </Title>

                                <Paragraph
                                    style={{
                                        fontSize: 18,
                                        color: '#595959',
                                        lineHeight: 1.8,
                                        marginBottom: 0,
                                    }}
                                >
                                    Xây dựng nền tảng tư duy toán học chắc chắn cho học sinh tiểu học với
                                    lộ trình học rõ ràng, bài giảng dễ hiểu và hệ thống bài tập được thiết
                                    kế khoa học.
                                </Paragraph>

                                <Space wrap size="middle">
                                    <Button type="primary" size="large" style={{ height: 48, paddingInline: 24 }}>
                                        Xem khóa học <ArrowRightOutlined />
                                    </Button>
                                    <Button size="large" style={{ height: 48, paddingInline: 24 }}>
                                        Tìm hiểu thêm
                                    </Button>
                                </Space>

                                <Space wrap size="large" style={{ marginTop: 8 }}>
                                    <Text style={{ color: '#595959' }}>
                                        <StarFilled style={{ color: '#fadb14', marginRight: 8 }} />
                                        Nội dung chọn lọc
                                    </Text>
                                    <Text style={{ color: '#595959' }}>
                                        <StarFilled style={{ color: '#fadb14', marginRight: 8 }} />
                                        Phù hợp nhiều trình độ
                                    </Text>
                                    <Text style={{ color: '#595959' }}>
                                        <StarFilled style={{ color: '#fadb14', marginRight: 8 }} />
                                        Học tập linh hoạt
                                    </Text>
                                </Space>
                            </Space>
                        </Col>

                        <Col xs={24} lg={12}>
                            <Card
                                bordered={false}
                                style={{
                                    borderRadius: 28,
                                    boxShadow: '0 20px 60px rgba(0,0,0,0.08)',
                                    overflow: 'hidden',
                                }}
                                bodyStyle={{ padding: 0 }}
                            >
                                <div
                                    style={{
                                        padding: 32,
                                        background: 'linear-gradient(135deg, #1677ff 0%, #36cfc9 100%)',
                                        color: 'white',
                                    }}
                                >
                                    <div
                                        style={{
                                            width: 64,
                                            height: 64,
                                            borderRadius: 18,
                                            background: 'rgba(255,255,255,0.18)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            marginBottom: 20,
                                            fontSize: 28,
                                        }}
                                    >
                                        <ReadOutlined />
                                    </div>

                                    <Title level={2} style={{ color: 'white', marginBottom: 12 }}>
                                        Lộ trình học tập hiệu quả
                                    </Title>

                                    <Paragraph style={{ color: 'rgba(255,255,255,0.92)', fontSize: 16 }}>
                                        Giúp học sinh nắm chắc kiến thức cơ bản, tăng sự tự tin và phát triển
                                        khả năng tư duy giải quyết vấn đề.
                                    </Paragraph>

                                    <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
                                        <Col span={12}>
                                            <div
                                                style={{
                                                    background: 'rgba(255,255,255,0.16)',
                                                    borderRadius: 18,
                                                    padding: 16,
                                                }}
                                            >
                                                <Title level={4} style={{ color: 'white', margin: 0 }}>
                                                    Nền tảng vững chắc
                                                </Title>
                                                <Text style={{ color: 'rgba(255,255,255,0.9)' }}>
                                                    Giúp học sinh tự tin giải quyết bài toán
                                                </Text>
                                            </div>
                                        </Col>
                                        <Col span={12}>
                                            <div
                                                style={{
                                                    background: 'rgba(255,255,255,0.16)',
                                                    borderRadius: 18,
                                                    padding: 16,
                                                }}
                                            >
                                                <Title level={4} style={{ color: 'white', margin: 0 }}>
                                                    Bài tập đa dạng
                                                </Title>
                                                <Text style={{ color: 'rgba(255,255,255,0.9)' }}>
                                                    Phát triển tư duy logic và kỹ năng giải toán
                                                </Text>
                                            </div>
                                        </Col>
                                    </Row>
                                </div>

                                <div style={{ padding: 24, background: '#fff' }}>
                                    <Row gutter={[16, 16]}>
                                        <Col xs={24} sm={12}>
                                            <Card
                                                size="small"
                                                style={{ borderRadius: 18, background: '#fafafa' }}
                                            >
                                                <Text type="secondary">Phương pháp</Text>
                                                <div style={{ fontWeight: 600, marginTop: 6 }}>
                                                    Học từ dễ đến khó
                                                </div>
                                            </Card>
                                        </Col>
                                        <Col xs={24} sm={12}>
                                            <Card
                                                size="small"
                                                style={{ borderRadius: 18, background: '#fafafa' }}
                                            >
                                                <Text type="secondary">Mục tiêu</Text>
                                                <div style={{ fontWeight: 600, marginTop: 6 }}>
                                                    Nắm chắc kiến thức cốt lõi
                                                </div>
                                            </Card>
                                        </Col>
                                    </Row>
                                </div>
                            </Card>
                        </Col>
                    </Row>
                </div>

                {/* Features */}
                <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 24px 72px' }}>
                    <div style={{ textAlign: 'center', marginBottom: 48 }}>
                        <Text strong style={{ color: '#1677ff', letterSpacing: 1 }}>
                            ĐIỂM NỔI BẬT
                        </Text>
                        <Title level={2} style={{ marginTop: 12, marginBottom: 12 }}>
                            Vì sao nên chọn chương trình này?
                        </Title>
                        <Paragraph style={{ fontSize: 17, color: '#595959', maxWidth: 800, margin: '0 auto' }}>
                            Nội dung được xây dựng để vừa giúp học sinh học tốt hơn, vừa tạo hứng thú
                            trong quá trình học tập.
                        </Paragraph>
                    </div>

                    <Row gutter={[24, 24]}>
                        {features.map((item, index) => (
                            <Col xs={24} md={8} key={index}>
                                <Card
                                    hoverable
                                    bordered={false}
                                    style={{
                                        borderRadius: 24,
                                        height: '100%',
                                        boxShadow: '0 10px 30px rgba(0,0,0,0.06)',
                                    }}
                                >
                                    <Space direction="vertical" size={16}>
                                        <div
                                            style={{
                                                width: 60,
                                                height: 60,
                                                borderRadius: 18,
                                                background: '#e6f4ff',
                                                color: '#1677ff',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}
                                        >
                                            {item.icon}
                                        </div>
                                        <Title level={4} style={{ margin: 0 }}>
                                            {item.title}
                                        </Title>
                                        <Paragraph style={{ color: '#595959', marginBottom: 0 }}>
                                            {item.desc}
                                        </Paragraph>
                                    </Space>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </div>

                {/* Benefits */}
                <div style={{ background: '#f5f7fa', padding: '72px 24px' }}>
                    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
                        <Row gutter={[40, 40]} align="middle">
                            <Col xs={24} lg={11}>
                                <Text strong style={{ color: '#1677ff', letterSpacing: 1 }}>
                                    GIÁ TRỊ MANG LẠI
                                </Text>
                                <Title level={2} style={{ marginTop: 12 }}>
                                    Không chỉ học kiến thức, mà còn phát triển tư duy
                                </Title>
                                <Paragraph style={{ fontSize: 17, color: '#595959', lineHeight: 1.8 }}>
                                    Chương trình giúp học sinh hình thành thói quen học tập tốt, tư duy logic
                                    rõ ràng và khả năng xử lý bài toán một cách tự tin hơn.
                                </Paragraph>
                            </Col>

                            <Col xs={24} lg={13}>
                                <Space direction="vertical" size={16} style={{ width: '100%' }}>
                                    {benefits.map((item, index) => (
                                        <Card
                                            key={index}
                                            bordered={false}
                                            style={{
                                                borderRadius: 20,
                                                boxShadow: '0 8px 24px rgba(0,0,0,0.05)',
                                            }}
                                        >
                                            <Space align="start" size="middle">
                                                <CheckCircleOutlined
                                                    style={{ color: '#52c41a', fontSize: 22, marginTop: 2 }}
                                                />
                                                <Text style={{ fontSize: 16 }}>{item}</Text>
                                            </Space>
                                        </Card>
                                    ))}
                                </Space>
                            </Col>
                        </Row>
                    </div>
                </div>

                {/* CTA */}
                <div style={{ maxWidth: 1200, margin: '0 auto', padding: '72px 24px 88px' }}>
                    <div
                        style={{
                            background: 'linear-gradient(135deg, #1677ff 0%, #36cfc9 100%)',
                            borderRadius: 32,
                            padding: '56px 24px',
                            textAlign: 'center',
                            color: 'white',
                            boxShadow: '0 20px 50px rgba(22,119,255,0.25)',
                        }}
                    >
                        <Title level={2} style={{ color: 'white', marginBottom: 12 }}>
                            Sẵn sàng bắt đầu hành trình học tập?
                        </Title>
                        <Paragraph
                            style={{
                                color: 'rgba(255,255,255,0.92)',
                                fontSize: 17,
                                minWidth: 700,
                                maxWidth: 760,
                                margin: '0 auto 28px',
                            }}
                        >
                            Khám phá chương trình Toán Tiểu Học tại CMATH ngay hôm nay
                        </Paragraph>

                        <Space wrap size="middle">
                            {/* Nút Đăng ký ngay - đổi sang màu đặc (solid) */}
                            <Button
                                size="large"
                                type="primary" // "primary" trong Ant Design thường là màu xanh đậm, rất phù hợp
                                style={{ height: 48, paddingInline: 24 }}
                            >
                                Đăng ký ngay
                            </Button>

                            {/* Nút Xem chi tiết khóa học - giữ nguyên màu trắng, chữ đậm (hoặc có thể điều chỉnh nhẹ) */}
                            <Button
                                size="large"
                                style={{ height: 48, paddingInline: 24 }}
                            >
                                Xem chi tiết khóa học
                            </Button>
                        </Space>
                    </div>
                </div>
            </Layout>
            <FooterComponent />
        </Layout>
    )
}

export default Primary