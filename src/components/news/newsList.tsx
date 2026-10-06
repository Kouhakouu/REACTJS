'use client';

import React from 'react';
import { Layout, Typography, Divider } from 'antd';
import { CalendarOutlined, EyeOutlined } from '@ant-design/icons';
import Link from 'next/link';
import NavbarComponent from '@/components/common/navbar';
import FooterComponent from '@/components/common/footer';
import { newsData } from '@/data/newsData';

const { Content } = Layout;
const { Title, Paragraph, Text } = Typography;

const NewsList = () => {
    return (
        <Layout>
            <NavbarComponent />
            <Layout style={{ background: '#f5f7fb' }}>
                <Content>
                    <div style={{ maxWidth: 900, margin: '0 auto', padding: 'clamp(28px, 6vw, 48px) 20px' }}>
                        <Title level={2} style={{ marginBottom: 'clamp(20px, 4vw, 32px)' }}>
                            Tin tức
                        </Title>

                        {newsData.map((item, index) => (
                            <div key={item.slug}>
                                <Link
                                    href={`/news/${item.slug}`}
                                    style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}
                                >
                                    <img
                                        src={item.thumbnail}
                                        alt={item.title}
                                        style={{
                                            flex: '1 1 220px',
                                            minWidth: 0,
                                            aspectRatio: '11 / 7',
                                            alignSelf: 'flex-start',
                                            objectFit: 'cover',
                                            borderRadius: 8,
                                        }}
                                    />

                                    {/* Khi xuống dòng (điện thoại), ảnh giãn hết chiều ngang phía trên nội dung */}
                                    <div style={{ flex: '999 1 0%', minWidth: 220 }}>
                                        <Title
                                            level={4}
                                            style={{
                                                margin: 0,
                                                color: '#1e293b',
                                                textTransform: 'uppercase',
                                            }}
                                        >
                                            {item.title}
                                        </Title>

                                        <Paragraph
                                            style={{ color: '#64748b', margin: '8px 0 0', lineHeight: 1.7 }}
                                        >
                                            {item.excerpt}
                                        </Paragraph>

                                        <Text type="secondary" style={{ fontSize: 13 }}>
                                            <CalendarOutlined style={{ marginRight: 6 }} />
                                            {item.date}
                                            <EyeOutlined style={{ marginLeft: 16, marginRight: 6 }} />
                                            {item.views}
                                        </Text>
                                    </div>
                                </Link>

                                {index !== newsData.length - 1 && <Divider />}
                            </div>
                        ))}
                    </div>
                </Content>
            </Layout>
            <FooterComponent />
        </Layout>
    );
};

export default NewsList;
