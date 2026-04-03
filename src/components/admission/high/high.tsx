'use client'

import React from 'react'
import { Layout, Button, Card, Col, Row, Space, Typography, Divider, Tag } from 'antd'
import {
    ArrowRightOutlined,
    CheckCircleFilled,
    ReadOutlined,
    TrophyOutlined,
    FundProjectionScreenOutlined,
    LineChartOutlined,
} from '@ant-design/icons'
import NavbarComponent from '@/components/common/navbar'
import FooterComponent from '@/components/common/footer'

const { Content } = Layout
const { Title, Paragraph, Text } = Typography

const pillars = [
    {
        icon: <ReadOutlined style={{ fontSize: 24, color: '#7a1f1f' }} />,
        title: 'Kiến thức chuẩn hóa',
        description:
            'Hệ thống lại kiến thức THPT theo các mạch nội dung quan trọng, bảo đảm học sinh học chắc và không hổng nền tảng.',
    },
    {
        icon: <LineChartOutlined style={{ fontSize: 24, color: '#1d39c4' }} />,
        title: 'Tư duy phân tích',
        description:
            'Rèn luyện năng lực nhìn cấu trúc bài toán, chọn hướng giải phù hợp và tối ưu hóa quá trình xử lý.',
    },
    {
        icon: <FundProjectionScreenOutlined style={{ fontSize: 24, color: '#ad6800' }} />,
        title: 'Hiệu suất phòng thi',
        description:
            'Luyện đề có chiến lược, kiểm soát thời gian và duy trì độ chính xác trong các bài kiểm tra quan trọng.',
    },
]

const pathways = [
    {
        title: 'Học vững để duy trì điểm số cao',
        items: [
            'Củng cố toàn bộ phần kiến thức cốt lõi',
            'Tăng độ chắc ở các chuyên đề trọng tâm',
            'Ổn định kết quả học tập trên lớp',
        ],
    },
    {
        title: 'Tăng tốc để thi tốt hơn',
        items: [
            'Luyện các dạng bài có tính phân loại',
            'Rèn chiến lược xử lý đề hiệu quả',
            'Cải thiện tốc độ và độ chính xác',
        ],
    },
    {
        title: 'Chuẩn bị cho mục tiêu cao hơn',
        items: [
            'Phù hợp học sinh muốn bứt phá mạnh',
            'Tăng chiều sâu tư duy và trình bày',
            'Hướng đến những môi trường cạnh tranh',
        ],
    },
]

const stages = [
    {
        step: '01',
        title: 'Đánh giá học lực và mục tiêu',
        description:
            'Xác định điểm mạnh, lỗ hổng kiến thức và đích đến cụ thể để xây dựng lộ trình học sát nhu cầu thực tế.',
    },
    {
        step: '02',
        title: 'Học theo chuyên đề trọng yếu',
        description:
            'Tập trung vào các phần kiến thức có vai trò nền tảng và xuất hiện nhiều trong bài kiểm tra, bài thi.',
    },
    {
        step: '03',
        title: 'Luyện tập và nâng độ khó',
        description:
            'Đi từ mức cơ bản đến nâng cao, giúp học sinh vừa chắc nền, vừa tăng được năng lực xử lý các bài toán khó.',
    },
    {
        step: '04',
        title: 'Luyện đề và tối ưu chiến lược',
        description:
            'Hoàn thiện bản lĩnh làm bài thông qua luyện đề định kỳ, quản lý thời gian và sửa lỗi có hệ thống.',
    },
]

const outcomes = [
    'Nắm chắc kiến thức quan trọng của chương trình THPT',
    'Tăng năng lực xử lý bài toán ở mức độ phân loại',
    'Hình thành tư duy học tập chặt chẽ và ổn định hơn',
    'Chuẩn bị tốt cho các kỳ thi và mục tiêu tuyển sinh',
]

const High = () => {
    return (
        <Layout style={{ minHeight: '100vh', background: '#fcfaf6' }}>
            <NavbarComponent />

            <Content>
                {/* Hero */}
                <section
                    style={{
                        background: '#fcfaf6',
                        padding: '80px 24px 56px',
                        borderBottom: '1px solid #ece7df',
                    }}
                >
                    <div style={{ maxWidth: 1240, margin: '0 auto' }}>
                        <Row gutter={[48, 48]} align="middle">
                            <Col xs={24} lg={14}>
                                <Space direction="vertical" size={22} style={{ width: '100%' }}>
                                    <Tag
                                        style={{
                                            width: 'fit-content',
                                            marginInlineEnd: 0,
                                            padding: '8px 16px',
                                            borderRadius: 999,
                                            fontSize: 14,
                                            fontWeight: 600,
                                            color: '#7a1f1f',
                                            background: '#fdf0f0',
                                            border: '1px solid #f3d6d6',
                                        }}
                                    >
                                        Chương trình Trung học phổ thông
                                    </Tag>

                                    <Title
                                        style={{
                                            margin: 0,
                                            fontSize: 'clamp(40px, 5.5vw, 72px)',
                                            lineHeight: 1.05,
                                            letterSpacing: -1.2,
                                            color: '#1f1f1f',
                                        }}
                                    >
                                        Toán THPT
                                        <br />
                                        <span style={{ color: '#7a1f1f' }}>
                                            Học bản lĩnh
                                        </span>
                                        <br />
                                        <span style={{ color: '#7a1f1f' }}>
                                            Thi hiệu quả
                                        </span>
                                    </Title>

                                    <Paragraph
                                        style={{
                                            fontSize: 19,
                                            lineHeight: 1.95,
                                            color: '#5b5b5b',
                                            maxWidth: 780,
                                            marginBottom: 0,
                                        }}
                                    >
                                        Chương trình dành cho học sinh THPT muốn học một cách nghiêm túc,
                                        có chiều sâu và định hướng rõ ràng cho các kỳ thi quan trọng như thi đại học
                                    </Paragraph>

                                    <Space wrap size="middle" style={{ marginTop: 8 }}>
                                        <Button
                                            size="large"
                                            style={{
                                                height: 50,
                                                paddingInline: 26,
                                                background: '#7a1f1f',
                                                color: '#fff',
                                                borderColor: '#7a1f1f',
                                                fontWeight: 600,
                                                boxShadow: '0 10px 24px rgba(122,31,31,0.16)',
                                            }}
                                        >
                                            Xem lộ trình học <ArrowRightOutlined />
                                        </Button>

                                        <Button
                                            size="large"
                                            style={{
                                                height: 50,
                                                paddingInline: 26,
                                                background: 'transparent',
                                                color: '#1f1f1f',
                                                borderColor: '#cfc7bb',
                                                fontWeight: 500,
                                            }}
                                        >
                                            Tìm hiểu chương trình
                                        </Button>
                                    </Space>
                                </Space>
                            </Col>

                            <Col xs={24} lg={10}>
                                <div
                                    style={{
                                        background: '#fffdf9',
                                        border: '1px solid #e8e1d8',
                                        borderRadius: 32,
                                        padding: 28,
                                        boxShadow: '0 20px 50px rgba(60,40,20,0.05)',
                                    }}
                                >
                                    <div
                                        style={{
                                            paddingBottom: 20,
                                            marginBottom: 20,
                                            borderBottom: '1px solid #eee6dc',
                                        }}
                                    >
                                        <Text
                                            style={{
                                                fontSize: 13,
                                                letterSpacing: 1.2,
                                                textTransform: 'uppercase',
                                                color: '#8c8c8c',
                                                fontWeight: 600,
                                            }}
                                        >
                                            Định hướng chương trình
                                        </Text>

                                        <Title level={3} style={{ margin: '10px 0 10px', color: '#1f1f1f' }}>
                                            Học nghiêm túc cho giai đoạn quyết định
                                        </Title>

                                        <Paragraph
                                            style={{
                                                marginBottom: 0,
                                                color: '#666',
                                                lineHeight: 1.85,
                                                fontSize: 16,
                                            }}
                                        >
                                            Ở bậc THPT, hiệu quả không đến từ việc học nhiều hơn một cách dàn trải,
                                            mà đến từ việc học đúng trọng tâm, đúng chiến lược và đủ bền bỉ.
                                        </Paragraph>
                                    </div>

                                    <Row gutter={[16, 16]}>
                                        <Col span={12}>
                                            <Card
                                                bordered={false}
                                                style={{
                                                    borderRadius: 22,
                                                    background: '#f8f4ee',
                                                    height: '100%',
                                                }}
                                                styles={{ body: { padding: 18 } }}
                                            >
                                                <Text type="secondary">Trọng tâm</Text>
                                                <Title level={3} style={{ margin: '8px 0 4px', color: '#7a1f1f' }}>
                                                    THPT
                                                </Title>
                                                <Text style={{ color: '#666' }}>Kiến thức và chiến lược</Text>
                                            </Card>
                                        </Col>

                                        <Col span={12}>
                                            <Card
                                                bordered={false}
                                                style={{
                                                    borderRadius: 22,
                                                    background: '#f5f8ff',
                                                    height: '100%',
                                                }}
                                                styles={{ body: { padding: 18 } }}
                                            >
                                                <Text type="secondary">Mục tiêu</Text>
                                                <Title level={3} style={{ margin: '8px 0 4px', color: '#1d39c4' }}>
                                                    Hiệu quả
                                                </Title>
                                                <Text style={{ color: '#666' }}>Học chắc và thi tốt</Text>
                                            </Card>
                                        </Col>

                                        <Col span={24}>
                                            <Card
                                                bordered={false}
                                                style={{
                                                    borderRadius: 22,
                                                    background: '#fff',
                                                    border: '1px dashed #ddd2c4',
                                                }}
                                                styles={{ body: { padding: 18 } }}
                                            >
                                                <Space direction="vertical" size={12} style={{ width: '100%' }}>
                                                    {[
                                                        'Phù hợp học sinh muốn nâng điểm rõ rệt',
                                                        'Phù hợp học sinh cần lộ trình học bài bản',
                                                        'Phù hợp học sinh hướng đến các mục tiêu cao hơn',
                                                    ].map((item) => (
                                                        <div
                                                            key={item}
                                                            style={{
                                                                display: 'flex',
                                                                alignItems: 'flex-start',
                                                                gap: 10,
                                                                color: '#444',
                                                                lineHeight: 1.7,
                                                            }}
                                                        >
                                                            <CheckCircleFilled style={{ color: '#7a1f1f', marginTop: 4 }} />
                                                            <span>{item}</span>
                                                        </div>
                                                    ))}
                                                </Space>
                                            </Card>
                                        </Col>
                                    </Row>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </section>

                {/* Intro banner */}
                <section style={{ padding: '0 24px', background: '#fcfaf6' }}>
                    <div style={{ maxWidth: 1240, margin: '0 auto' }}>
                        <div
                            style={{
                                marginTop: 28,
                                borderRadius: 28,
                                overflow: 'hidden',
                                border: '1px solid #e9e2d8',
                                background: 'linear-gradient(90deg, #fffdf8 0%, #f7f2ea 100%)',
                            }}
                        >
                            <Row gutter={0}>
                                <Col xs={24} md={8}>
                                    <div style={{ padding: '28px 24px', textAlign: 'center' }}>
                                        <Title level={4} style={{ marginBottom: 8 }}>
                                            Học có định hướng
                                        </Title>
                                        <Paragraph style={{ marginBottom: 0, color: '#666', lineHeight: 1.8 }}>
                                            Xác định mục tiêu ngay từ đầu để lộ trình học có trọng tâm và hiệu quả.
                                        </Paragraph>
                                    </div>
                                </Col>
                                <Col xs={24} md={8}>
                                    <div
                                        style={{
                                            padding: '28px 24px',
                                            textAlign: 'center',
                                            borderLeft: '1px solid #e9e2d8',
                                            borderRight: '1px solid #e9e2d8',
                                        }}
                                    >
                                        <Title level={4} style={{ marginBottom: 8 }}>
                                            Học có chiều sâu
                                        </Title>
                                        <Paragraph style={{ marginBottom: 0, color: '#666', lineHeight: 1.8 }}>
                                            Không dừng ở việc giải được bài, mà hiểu được bản chất và phương pháp làm bài.
                                        </Paragraph>
                                    </div>
                                </Col>
                                <Col xs={24} md={8}>
                                    <div style={{ padding: '28px 24px', textAlign: 'center' }}>
                                        <Title level={4} style={{ marginBottom: 8 }}>
                                            Học để đạt kết quả
                                        </Title>
                                        <Paragraph style={{ marginBottom: 0, color: '#666', lineHeight: 1.8 }}>
                                            Rèn luyện chiến lược làm bài cụ thể để vào phòng thi một cách tự tin, vững vàng nhất.
                                        </Paragraph>
                                    </div>
                                </Col>
                            </Row>
                        </div>
                    </div>
                </section>

                {/* Pillars */}
                <section style={{ padding: '84px 24px', background: '#fffdf9' }}>
                    <div style={{ maxWidth: 1240, margin: '0 auto' }}>
                        <div style={{ textAlign: 'center', marginBottom: 52 }}>
                            <Text
                                style={{
                                    color: '#7a1f1f',
                                    textTransform: 'uppercase',
                                    letterSpacing: 1.2,
                                    fontWeight: 700,
                                }}
                            >
                                Chương trình đào tạo
                            </Text>
                            <Title level={2} style={{ marginTop: 12, marginBottom: 12 }}>
                                Chương trình được thiết kế dành cho giai đoạn học tập quan trọng nhất
                            </Title>
                            <Paragraph
                                style={{
                                    maxWidth: 860,
                                    margin: '0 auto',
                                    color: '#666',
                                    fontSize: 17,
                                    lineHeight: 1.9,
                                }}
                            >
                                Chương trình THPT cần vừa giữ được sự chắc chắn của kiến thức nền, vừa phát triển
                                khả năng xử lý các dạng toán nâng cao trong bối cảnh thi cử.
                            </Paragraph>
                        </div>

                        <Row gutter={[24, 24]}>
                            {pillars.map((item) => (
                                <Col xs={24} md={8} key={item.title}>
                                    <Card
                                        bordered={false}
                                        style={{
                                            borderRadius: 26,
                                            height: '100%',
                                            background: '#ffffff',
                                            border: '1px solid #eee6dc',
                                            boxShadow: '0 10px 30px rgba(60,40,20,0.04)',
                                        }}
                                        styles={{ body: { padding: 30 } }}
                                    >
                                        <div
                                            style={{
                                                width: 60,
                                                height: 60,
                                                borderRadius: 18,
                                                background: '#faf5ef',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                marginBottom: 18,
                                            }}
                                        >
                                            {item.icon}
                                        </div>

                                        <Title level={4} style={{ marginBottom: 12 }}>
                                            {item.title}
                                        </Title>

                                        <Paragraph
                                            style={{
                                                color: '#666',
                                                marginBottom: 0,
                                                lineHeight: 1.85,
                                                fontSize: 16,
                                            }}
                                        >
                                            {item.description}
                                        </Paragraph>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    </div>
                </section>

                {/* Stages */}
                <section style={{ padding: '84px 24px', background: '#fcfaf6' }}>
                    <div style={{ maxWidth: 1240, margin: '0 auto' }}>
                        <Row gutter={[40, 40]} align="top">
                            <Col xs={24} lg={8}>
                                <Text
                                    style={{
                                        color: '#1d39c4',
                                        textTransform: 'uppercase',
                                        letterSpacing: 1.2,
                                        fontWeight: 700,
                                    }}
                                >
                                    Lộ trình học tập
                                </Text>
                                <Title level={2} style={{ marginTop: 12, marginBottom: 16 }}>
                                    Đi từng bước nhỏ
                                </Title>
                                <Title level={2} style={{ marginTop: 12, marginBottom: 16 }}>
                                    Chậm và chắc
                                </Title>
                                <Paragraph
                                    style={{
                                        color: '#666',
                                        fontSize: 17,
                                        lineHeight: 1.9,
                                    }}
                                >
                                    Lộ trình không chỉ để học sinh biết mình đang học gì, mà còn để duy trì sự
                                    tiến bộ có cấu trúc và tránh việc học dàn trải, thiếu định hướng.
                                </Paragraph>
                            </Col>

                            <Col xs={24} lg={16}>
                                <Space direction="vertical" size={18} style={{ width: '100%' }}>
                                    {stages.map((item, index) => (
                                        <Card
                                            key={item.step}
                                            bordered={false}
                                            style={{
                                                borderRadius: 24,
                                                background: index % 2 === 0 ? '#fff' : '#fffaf3',
                                                border: '1px solid #ebe3d9',
                                            }}
                                            styles={{ body: { padding: 24 } }}
                                        >
                                            <Row gutter={[20, 20]} align="middle">
                                                <Col xs={24} sm={5} md={4}>
                                                    <div
                                                        style={{
                                                            width: 74,
                                                            height: 74,
                                                            borderRadius: '50%',
                                                            background: index % 2 === 0 ? '#7a1f1f' : '#1d39c4',
                                                            color: '#fff',
                                                            fontSize: 24,
                                                            fontWeight: 700,
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            margin: '0 auto',
                                                        }}
                                                    >
                                                        {item.step}
                                                    </div>
                                                </Col>

                                                <Col xs={24} sm={19} md={20}>
                                                    <Title level={4} style={{ marginBottom: 8 }}>
                                                        {item.title}
                                                    </Title>
                                                    <Paragraph
                                                        style={{
                                                            marginBottom: 0,
                                                            color: '#666',
                                                            fontSize: 16,
                                                            lineHeight: 1.85,
                                                        }}
                                                    >
                                                        {item.description}
                                                    </Paragraph>
                                                </Col>
                                            </Row>
                                        </Card>
                                    ))}
                                </Space>
                            </Col>
                        </Row>
                    </div>
                </section>

                {/* Pathways */}
                <section style={{ padding: '84px 24px', background: '#fffdf9' }}>
                    <div style={{ maxWidth: 1240, margin: '0 auto' }}>
                        <div style={{ textAlign: 'center', marginBottom: 52 }}>
                            <Text
                                style={{
                                    color: '#ad6800',
                                    textTransform: 'uppercase',
                                    letterSpacing: 1.2,
                                    fontWeight: 700,
                                }}
                            >
                                Định hướng phù hợp
                            </Text>
                            <Title level={2} style={{ marginTop: 12, marginBottom: 12 }}>
                                Không phải mọi học sinh đều cần cùng một lộ trình
                            </Title>
                        </div>

                        <Row gutter={[24, 24]}>
                            {pathways.map((track, index) => (
                                <Col xs={24} md={8} key={track.title}>
                                    <Card
                                        bordered={false}
                                        style={{
                                            borderRadius: 28,
                                            height: '100%',
                                            background: '#fff',
                                            border: '1px solid #ece3d7',
                                        }}
                                        styles={{ body: { padding: 28 } }}
                                    >
                                        <Space direction="vertical" size={16} style={{ width: '100%' }}>

                                            <Title level={4} style={{ margin: 0 }}>
                                                {track.title}
                                            </Title>

                                            <Divider style={{ margin: 0, borderColor: '#eee5da' }} />

                                            <Space direction="vertical" size={14} style={{ width: '100%' }}>
                                                {track.items.map((item) => (
                                                    <div
                                                        key={item}
                                                        style={{
                                                            display: 'flex',
                                                            alignItems: 'flex-start',
                                                            gap: 10,
                                                            color: '#555',
                                                            lineHeight: 1.75,
                                                        }}
                                                    >
                                                        <CheckCircleFilled
                                                            style={{
                                                                color: '#7a1f1f',
                                                                marginTop: 4,
                                                                flexShrink: 0,
                                                            }}
                                                        />
                                                        <span>{item}</span>
                                                    </div>
                                                ))}
                                            </Space>
                                        </Space>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    </div>
                </section>

                {/* Outcomes */}
                <section style={{ padding: '84px 24px', background: '#fcfaf6' }}>
                    <div style={{ maxWidth: 1240, margin: '0 auto' }}>
                        <Row gutter={[36, 36]} align="middle">
                            <Col xs={24} lg={10}>
                                <Title
                                    style={{
                                        marginBottom: 16,
                                        fontSize: 'clamp(30px, 4vw, 48px)',
                                        lineHeight: 1.15,
                                    }}
                                >
                                    Kết quả hướng đến
                                </Title>
                                <Paragraph
                                    style={{
                                        color: '#666',
                                        fontSize: 17,
                                        lineHeight: 1.9,
                                        marginBottom: 0,
                                    }}
                                >
                                    Mục tiêu của chương trình không chỉ là hoàn thành bài học, mà là tạo ra sự
                                    chuyển biến rõ ràng về mức độ hiểu, năng lực làm bài và sự tự tin của học sinh.
                                </Paragraph>
                            </Col>

                            <Col xs={24} lg={14}>
                                <Card
                                    bordered={false}
                                    style={{
                                        borderRadius: 30,
                                        background: '#fff',
                                        border: '1px solid #e9e1d6',
                                        boxShadow: '0 12px 36px rgba(60,40,20,0.05)',
                                    }}
                                    styles={{ body: { padding: 30 } }}
                                >
                                    <Space direction="vertical" size={18} style={{ width: '100%' }}>
                                        {outcomes.map((item) => (
                                            <div
                                                key={item}
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'flex-start',
                                                    gap: 12,
                                                    color: '#444',
                                                    lineHeight: 1.8,
                                                    fontSize: 16,
                                                }}
                                            >
                                                <CheckCircleFilled style={{ color: '#1d39c4', marginTop: 4 }} />
                                                <span>{item}</span>
                                            </div>
                                        ))}
                                    </Space>
                                </Card>
                            </Col>
                        </Row>
                    </div>
                </section>

                {/* CTA */}
                <section style={{ padding: '24px 24px 92px', background: '#fffdf9' }}>
                    <div style={{ maxWidth: 1240, margin: '0 auto' }}>
                        <div
                            style={{
                                borderRadius: 34,
                                padding: '56px 24px',
                                textAlign: 'center',
                                background: '#ffffff',
                                border: '1px solid #e9e1d6',
                                boxShadow: '0 16px 42px rgba(60,40,20,0.06)',
                            }}
                        >

                            <Title level={2} style={{ marginTop: 12, marginBottom: 12 }}>
                                Sẵn sàng bước vào giai đoạn học tập quan trọng?
                            </Title>


                            <Space wrap size="middle">
                                <Button
                                    size="large"
                                    style={{
                                        height: 48,
                                        paddingInline: 24,
                                        background: '#7a1f1f',
                                        color: '#fff',
                                        borderColor: '#7a1f1f',
                                        fontWeight: 600,
                                    }}
                                >
                                    Đăng ký tư vấn
                                </Button>

                                <Button
                                    size="large"
                                    style={{
                                        height: 48,
                                        paddingInline: 24,
                                        background: '#fff',
                                        color: '#1f1f1f',
                                        borderColor: '#d5ccbf',
                                        fontWeight: 500,
                                    }}
                                >
                                    Xem chi tiết khóa học
                                </Button>
                            </Space>
                        </div>
                    </div>
                </section>
            </Content>

            <FooterComponent />
        </Layout>
    )
}

export default High