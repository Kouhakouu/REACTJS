'use client';

import React from 'react';
import { Layout, Typography, Divider, Card } from 'antd';
import { CalendarOutlined, EyeOutlined } from '@ant-design/icons';
import Link from 'next/link';
import NavbarComponent from '@/components/common/navbar';
import FooterComponent from '@/components/common/footer';
import ExamResultsTable from '@/components/news/examResultsTable';
import { newsData } from '@/data/newsData';

const { Content } = Layout;
const { Title, Paragraph, Text } = Typography;

interface NewsDetailProps {
    slug: string;
}

const NewsDetail = ({ slug }: NewsDetailProps) => {
    const item = newsData.find((n) => n.slug === slug);
    const otherNews = newsData.filter((n) => n.slug !== slug);

    if (!item) {
        return (
            <Layout>
                <NavbarComponent />
                <Content style={{ padding: '64px 20px', textAlign: 'center' }}>
                    <Title level={3}>Không tìm thấy bài viết</Title>
                    <Link href="/news">Quay lại trang Tin tức</Link>
                </Content>
                <FooterComponent />
            </Layout>
        );
    }

    return (
        <Layout>
            <NavbarComponent />
            <Layout style={{ background: '#f5f7fb' }}>
                <Content>
                    <div style={{ maxWidth: 900, margin: '0 auto', padding: '48px 20px' }}>
                        <Link href="/news">← Quay lại Tin tức</Link>

                        <Title level={2} style={{ margin: '20px 0 8px' }}>
                            {item.title}
                        </Title>

                        <Text type="secondary" style={{ fontSize: 13 }}>
                            <CalendarOutlined style={{ marginRight: 6 }} />
                            {item.date}
                            <EyeOutlined style={{ marginLeft: 16, marginRight: 6 }} />
                            {item.views}
                        </Text>

                        <img
                            src={item.thumbnail}
                            alt={item.title}
                            style={{
                                width: '100%',
                                maxHeight: 420,
                                objectFit: 'cover',
                                borderRadius: 12,
                                margin: '24px 0',
                            }}
                        />

                        {item.content.map((paragraph, index) => (
                            <Paragraph
                                key={index}
                                style={{ fontSize: 16, lineHeight: 1.9, color: '#334155' }}
                            >
                                {paragraph}
                            </Paragraph>
                        ))}

                        {item.hasExamResultsTable && (
                            <Card bordered={false} style={{ borderRadius: 16, marginTop: 8 }}>
                                <ExamResultsTable />
                            </Card>
                        )}

                        {otherNews.length > 0 && (
                            <>
                                <Divider style={{ margin: '40px 0' }} />
                                <Title level={4} style={{ marginBottom: 20 }}>
                                    Tin tức khác
                                </Title>
                                {otherNews.map((other) => (
                                    <Card
                                        key={other.slug}
                                        size="small"
                                        style={{ marginBottom: 12, borderRadius: 12 }}
                                    >
                                        <Link href={`/news/${other.slug}`}>{other.title}</Link>
                                    </Card>
                                ))}
                            </>
                        )}
                    </div>
                </Content>
            </Layout>
            <FooterComponent />
        </Layout>
    );
};

export default NewsDetail;
