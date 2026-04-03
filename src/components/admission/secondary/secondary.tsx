'use client'

import React from 'react'
import {
    Layout,
    Button,
    Card,
    Col,
    Row,
    Space,
    Typography,
    Divider,
    Tag,
} from 'antd'
import {
    ArrowRightOutlined,
    BookOutlined,
    RiseOutlined,
    TrophyOutlined,
    RocketOutlined,
    CheckCircleFilled,
} from '@ant-design/icons'
import NavbarComponent from '@/components/common/navbar'
import FooterComponent from '@/components/common/footer'

const { Content } = Layout
const { Title, Paragraph, Text } = Typography

const highlights = [
    {
        icon: <BookOutlined style={{ fontSize: 24, color: '#1677ff' }} />,
        title: 'Củng cố nền tảng THCS',
        description:
            'Hệ thống lại kiến thức cốt lõi, khắc phục lỗ hổng và xây dựng kiến thức nên tảng vững chắc.',
    },
    {
        icon: <RiseOutlined style={{ fontSize: 24, color: '#13c2c2' }} />,
        title: 'Nâng cao tư duy giải toán',
        description:
            'Rèn luyện khả năng phân tích bài toán, tư duy logic và trình bày bài cẩn thận.',
    },
    {
        icon: <TrophyOutlined style={{ fontSize: 24, color: '#faad14' }} />,
        title: 'Hướng đến kết quả nổi bật',
        description:
            'Phù hợp cho cả học sinh muốn học chắc kiến thức trên lớp và học sinh muốn thi chuyên, thi học sinh giỏi hoặc vượt trước chương trình.',
    },
]

const roadmap = [
    {
        step: '01',
        title: 'Rà soát kiến thức',
        description:
            'Đánh giá trình độ của học sinh dựa trên bài test đầu vào và lựa chọn lộ trình phù hợp.',
    },
    {
        step: '02',
        title: 'Học theo chuyên đề',
        description:
            'Chia nhỏ nội dung học thành các chuyên đề trọng tâm.',
    },
    {
        step: '03',
        title: 'Luyện tập có chọn lọc',
        description:
            'Bài tập được sắp xếp từ cơ bản đến nâng cao.',
    },
    {
        step: '04',
        title: 'Tăng tốc',
        description:
            'Luyện đề, tối ưu chiến lược làm bài và củng cố sự tự tin trước các kỳ thi quan trọng.',
    },
]

const tracks = [
    {
        title: 'Học chắc kiến thức trên lớp',
        items: [
            'Bám sát chương trình THCS',
            'Củng cố kiến thức trọng tâm',
            'Tăng độ tự tin khi học ở trường',
        ],
    },
    {
        title: 'Nâng cao và học vượt',
        items: [
            'Tiếp cận bài toán khó hơn',
            'Rèn tư duy tổng hợp và biến đổi',
            'Phù hợp học sinh muốn học nhanh, học sâu',
        ],
    },
    {
        title: 'Ôn thi chuyên / học sinh giỏi',
        items: [
            'Tập trung các dạng bài phân loại',
            'Luyện kỹ năng trình bày và lập luận',
            'Chuẩn bị cho các kỳ thi cạnh tranh cao',
        ],
    },
]

const Secondary = () => {
    return (
        <Layout style={{ minHeight: '100vh', background: '#ffffff' }}>
            <NavbarComponent />

            <Content>
                {/* Hero */}
                <section
                    style={{
                        background:
                            'linear-gradient(135deg, #0f172a 0%, #111827 45%, #0b3b75 100%)',
                        padding: '72px 24px 88px',
                    }}
                >
                    <div style={{ maxWidth: 1240, margin: '0 auto' }}>
                        <Row gutter={[40, 40]} align="middle">
                            <Col xs={24} lg={13}>
                                <Space direction="vertical" size={20} style={{ width: '100%' }}>
                                    <Tag
                                        color="blue"
                                        style={{
                                            width: 'fit-content',
                                            padding: '6px 14px',
                                            borderRadius: 999,
                                            fontSize: 14,
                                        }}
                                    >
                                        Chương trình Trung học cơ sở
                                    </Tag>

                                    <Title
                                        style={{
                                            color: '#ffffff',
                                            margin: 0,
                                            fontSize: 'clamp(36px, 5vw, 58px)',
                                            lineHeight: 1.15,
                                        }}
                                    >
                                        Toán THCS
                                        <br />
                                        <span style={{ color: '#69b1ff' }}>
                                            Nắm chắc nền tảng
                                        </span>
                                        <br />
                                        <span style={{ color: '#69b1ff' }}>
                                            Bứt tốc tư duy
                                        </span>
                                    </Title>

                                    <Paragraph
                                        style={{
                                            color: 'rgba(255,255,255,0.82)',
                                            fontSize: 18,
                                            lineHeight: 1.9,
                                            maxWidth: 760,
                                            marginBottom: 0,
                                        }}
                                    >
                                        Chương trình được thiết kế cho học sinh THCS muốn học bài bản,
                                        hiểu sâu bản chất và tiến tới những mục tiêu cao hơn như học vượt,
                                        thi chuyên hoặc thi học sinh giỏi.
                                    </Paragraph>

                                    <Space wrap size="middle" style={{ marginTop: 8 }}>
                                        <Button
                                            type="primary"
                                            size="large"
                                            style={{
                                                height: 48,
                                                paddingInline: 24,
                                                fontWeight: 600,
                                                boxShadow: '0 10px 24px rgba(22,119,255,0.28)',
                                            }}
                                        >
                                            Khám phá lộ trình <ArrowRightOutlined />
                                        </Button>

                                        <Button
                                            size="large"
                                            style={{
                                                height: 48,
                                                paddingInline: 24,
                                                background: 'transparent',
                                                color: '#fff',
                                                borderColor: 'rgba(255,255,255,0.35)',
                                            }}
                                        >
                                            Xem chương trình học
                                        </Button>
                                    </Space>

                                    <Space wrap size={[33, 33]} style={{ marginTop: 12 }}>
                                        <Tag
                                            color="processing"
                                            style={{
                                                padding: '10px 15px',
                                                fontSize: 13,
                                                borderRadius: 10,
                                                marginInlineEnd: 0,
                                            }}
                                        >
                                            Theo chuyên đề
                                        </Tag>

                                        <Tag
                                            color="success"
                                            style={{
                                                padding: '10px 15px',
                                                fontSize: 13,
                                                borderRadius: 10,
                                                marginInlineEnd: 0,
                                            }}
                                        >
                                            Tư duy logic
                                        </Tag>

                                        <Tag
                                            color="warning"
                                            style={{
                                                padding: '10px 15px',
                                                fontSize: 13,
                                                borderRadius: 10,
                                                marginInlineEnd: 0,
                                            }}
                                        >
                                            Luyện thi chọn lọc
                                        </Tag>
                                    </Space>
                                </Space>
                            </Col>

                            <Col xs={24} lg={11}>
                                <div
                                    style={{
                                        background: 'rgba(255,255,255,0.08)',
                                        border: '1px solid rgba(255,255,255,0.14)',
                                        borderRadius: 28,
                                        padding: 24,
                                        backdropFilter: 'blur(10px)',
                                    }}
                                >
                                    <Row gutter={[16, 16]}>
                                        <Col span={24}>
                                            <Card
                                                bordered={false}
                                                style={{
                                                    borderRadius: 22,
                                                    background:
                                                        'linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(240,247,255,0.96) 100%)',
                                                }}
                                                styles={{
                                                    body: { padding: 22 },
                                                }}
                                            >
                                                <Space align="start" size="middle">
                                                    <div
                                                        style={{
                                                            width: 52,
                                                            height: 52,
                                                            borderRadius: 16,
                                                            background: '#e6f4ff',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            flexShrink: 0,
                                                        }}
                                                    >
                                                        <RocketOutlined
                                                            style={{ fontSize: 24, color: '#1677ff' }}
                                                        />
                                                    </div>

                                                    <div>
                                                        <Text type="secondary">Định hướng nổi bật</Text>
                                                        <Title level={4} style={{ margin: '6px 0 8px' }}>
                                                            Học bài bản để tiến xa
                                                        </Title>
                                                        <Paragraph
                                                            style={{ margin: 0, color: '#595959', lineHeight: 1.7 }}
                                                        >
                                                            Không chỉ giải được bài, học sinh còn hiểu cách phân tích, phương pháp làm bài
                                                            và cách trình bày lời giải chặt chẽ.
                                                        </Paragraph>
                                                    </div>
                                                </Space>
                                            </Card>
                                        </Col>

                                        <Col xs={12}>
                                            <Card
                                                bordered={false}
                                                style={{
                                                    borderRadius: 22,
                                                    background: 'rgba(255,255,255,0.96)',
                                                    height: '100%',
                                                }}
                                                styles={{
                                                    body: { padding: 20 },
                                                }}
                                            >
                                                <Text type="secondary">Trọng tâm</Text>
                                                <Title level={3} style={{ margin: '8px 0 4px' }}>
                                                    THCS
                                                </Title>
                                                <Text style={{ color: '#595959' }}>
                                                    Từ nền tảng đến nâng cao
                                                </Text>
                                            </Card>
                                        </Col>

                                        <Col xs={12}>
                                            <Card
                                                bordered={false}
                                                style={{
                                                    borderRadius: 22,
                                                    background: 'rgba(255,255,255,0.96)',
                                                    height: '100%',
                                                }}
                                                styles={{
                                                    body: { padding: 20 },
                                                }}
                                            >
                                                <Text type="secondary">Mục tiêu</Text>
                                                <Title level={3} style={{ margin: '8px 0 4px' }}>
                                                    Bứt tốc
                                                </Title>
                                                <Text style={{ color: '#595959' }}>
                                                    Học chắc và thi tốt hơn
                                                </Text>
                                            </Card>
                                        </Col>

                                        <Col span={24}>
                                            <Card
                                                bordered={false}
                                                style={{
                                                    borderRadius: 22,
                                                    background: 'rgba(105,177,255,0.12)',
                                                    border: '1px solid rgba(105,177,255,0.2)',
                                                }}
                                                styles={{
                                                    body: { padding: 20 },
                                                }}
                                            >
                                                <Text style={{ color: '#dbeafe' }}>Phù hợp với</Text>
                                                <div
                                                    style={{
                                                        marginTop: 10,
                                                        display: 'grid',
                                                        gap: 10,
                                                    }}
                                                >
                                                    {[
                                                        'Học sinh cần củng cố kiến thức',
                                                        'Học sinh muốn học nâng cao',
                                                        'Học sinh chuẩn bị thi chuyên / HSG',
                                                    ].map((item) => (
                                                        <div
                                                            key={item}
                                                            style={{
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                gap: 10,
                                                                color: '#ffffff',
                                                            }}
                                                        >
                                                            <CheckCircleFilled style={{ color: '#69b1ff' }} />
                                                            <span>{item}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </Card>
                                        </Col>
                                    </Row>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </section>

                {/* Highlights */}
                <section style={{ padding: '72px 24px', background: '#ffffff' }}>
                    <div style={{ maxWidth: 1240, margin: '0 auto' }}>
                        <div style={{ textAlign: 'center', marginBottom: 48 }}>
                            <Text
                                strong
                                style={{
                                    color: '#1677ff',
                                    textTransform: 'uppercase',
                                    letterSpacing: 1,
                                }}
                            >
                                Điểm nổi bật
                            </Text>
                            <Title level={2} style={{ marginTop: 12, marginBottom: 12 }}>
                                Chương trình được thiết kế cho giai đoạn học quan trọng
                            </Title>
                            <Paragraph
                                style={{
                                    maxWidth: 820,
                                    margin: '0 auto',
                                    color: '#666',
                                    fontSize: 17,
                                    lineHeight: 1.8,
                                }}
                            >
                                THCS là giai đoạn học sinh bắt đầu chuyển từ tiếp thu cơ bản sang tư
                                duy phân tích và tổng hợp. Vì vậy, chương trình học tập tại CMATH đảm bảo lượng kiến thức đủ chắc,
                                đủ sâu và có định hướng rõ ràng.
                            </Paragraph>
                        </div>

                        <Row gutter={[24, 24]}>
                            {highlights.map((item) => (
                                <Col xs={24} md={8} key={item.title}>
                                    <Card
                                        bordered={false}
                                        hoverable
                                        style={{
                                            borderRadius: 24,
                                            height: '100%',
                                            boxShadow: '0 14px 40px rgba(15,23,42,0.06)',
                                        }}
                                        styles={{
                                            body: { padding: 28 },
                                        }}
                                    >
                                        <div
                                            style={{
                                                width: 56,
                                                height: 56,
                                                borderRadius: 18,
                                                background: '#f6faff',
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
                                                lineHeight: 1.8,
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

                {/* Roadmap */}
                <section style={{ padding: '72px 24px', background: '#f8fafc' }}>
                    <div style={{ maxWidth: 1240, margin: '0 auto' }}>
                        <Row gutter={[40, 40]} align="top">
                            <Col xs={24} lg={8}>
                                <Text
                                    strong
                                    style={{
                                        color: '#1677ff',
                                        textTransform: 'uppercase',
                                        letterSpacing: 1,
                                    }}
                                >
                                    Lộ trình học
                                </Text>
                                <Title level={2} style={{ marginTop: 12, marginBottom: 16 }}>
                                    Học theo từng bước rõ ràng
                                </Title>
                                <Paragraph
                                    style={{
                                        color: '#666',
                                        fontSize: 17,
                                        lineHeight: 1.8,
                                    }}
                                >
                                    Mỗi học sinh sẽ có điểm xuất phát khác nhau, nhưng đều cần một lộ
                                    trình học, luyện tập hợp lí, có chiến lược và tăng tốc đúng thời điểm.
                                </Paragraph>
                            </Col>

                            <Col xs={24} lg={16}>
                                <Space direction="vertical" size={18} style={{ width: '100%' }}>
                                    {roadmap.map((item) => (
                                        <Card
                                            key={item.step}
                                            bordered={false}
                                            style={{
                                                borderRadius: 24,
                                                boxShadow: '0 10px 28px rgba(0,0,0,0.05)',
                                            }}
                                            styles={{
                                                body: { padding: 24 },
                                            }}
                                        >
                                            <Row gutter={[20, 20]} align="middle">
                                                <Col xs={24} sm={5} md={4}>
                                                    <div
                                                        style={{
                                                            width: 72,
                                                            height: 72,
                                                            borderRadius: 20,
                                                            background:
                                                                'linear-gradient(135deg, #1677ff 0%, #69b1ff 100%)',
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
                                                            lineHeight: 1.8,
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

                {/* Tracks */}
                <section style={{ padding: '72px 24px', background: '#ffffff' }}>
                    <div style={{ maxWidth: 1240, margin: '0 auto' }}>
                        <div style={{ textAlign: 'center', marginBottom: 48 }}>
                            <Text
                                strong
                                style={{
                                    color: '#1677ff',
                                    textTransform: 'uppercase',
                                    letterSpacing: 1,
                                }}
                            >
                                Định hướng học tập
                            </Text>
                            <Title level={2} style={{ marginTop: 12, marginBottom: 12 }}>
                                Phù hợp với nhiều mục tiêu khác nhau
                            </Title>
                        </div>

                        <Row gutter={[24, 24]}>
                            {tracks.map((track) => (
                                <Col xs={24} md={8} key={track.title}>
                                    <Card
                                        bordered={false}
                                        style={{
                                            borderRadius: 24,
                                            height: '100%',
                                            background:
                                                'linear-gradient(180deg, #ffffff 0%, #f9fbff 100%)',
                                            border: '1px solid #eef3fb',
                                        }}
                                        styles={{
                                            body: { padding: 28 },
                                        }}
                                    >
                                        <Title level={4} style={{ marginBottom: 18 }}>
                                            {track.title}
                                        </Title>

                                        <Divider style={{ margin: '0 0 18px' }} />

                                        <Space direction="vertical" size={14} style={{ width: '100%' }}>
                                            {track.items.map((item) => (
                                                <div
                                                    key={item}
                                                    style={{
                                                        display: 'flex',
                                                        alignItems: 'flex-start',
                                                        gap: 10,
                                                        color: '#595959',
                                                        lineHeight: 1.7,
                                                    }}
                                                >
                                                    <CheckCircleFilled
                                                        style={{
                                                            color: '#1677ff',
                                                            marginTop: 4,
                                                            flexShrink: 0,
                                                        }}
                                                    />
                                                    <span>{item}</span>
                                                </div>
                                            ))}
                                        </Space>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    </div>
                </section>

                {/* CTA */}
                <section style={{ padding: '24px 24px 88px', background: '#ffffff' }}>
                    <div style={{ maxWidth: 1000, margin: '0 auto' }}>
                        <div
                            style={{
                                borderRadius: 32,
                                padding: '48px 24px',
                                background:
                                    'linear-gradient(135deg, #111827 0%, #172554 50%, #1677ff 100%)',
                                textAlign: 'center',
                                boxShadow: '0 20px 50px rgba(17,24,39,0.18)',
                            }}
                        >
                            <Title level={2} style={{ color: '#fff', marginBottom: 20 }}>
                                Sẵn sàng bước vào giai đoạn học tập bứt phá?
                            </Title>

                            <Space wrap size="middle">
                                <Button
                                    type="primary"
                                    size="large"
                                    style={{
                                        height: 48,
                                        paddingInline: 24,
                                        fontWeight: 600,
                                    }}
                                >
                                    Đăng ký ngay
                                </Button>

                                <Button
                                    size="large"
                                    style={{
                                        height: 48,
                                        paddingInline: 24,
                                        background: '#ffffff',
                                        color: '#111827',
                                        borderColor: '#ffffff',
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

export default Secondary