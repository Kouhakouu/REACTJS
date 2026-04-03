'use client'

import React from 'react'
import { Layout, Card, Col, Row, Typography, Divider } from 'antd'
import type { CSSProperties } from 'react'
import NavbarComponent from '@/components/common/navbar'
import FooterComponent from '@/components/common/footer'

const { Content } = Layout
const { Title, Paragraph, Text } = Typography

interface Student {
    id: number
    name: string
    achievement: string
    image: string
}

interface StudentCardProps {
    student: Student
}

interface StudentSectionProps {
    title: string
    subtitle?: string
    students: Student[]
}

const currentStudents: Student[] = [
    {
        id: 1,
        name: 'Đỗ Ngân Giang',
        achievement:
            'Huy chương Bạc kỳ thi Toán học trẻ quốc tế IMC 2025',
        image: '/images/do-ngan-giang.jpg',
    },
    {
        id: 2,
        name: '...',
        achievement:
            '...',
        image: ''
    },
    {
        id: 3,
        name: '...',
        achievement:
            '...',
        image: ''
    },
    {
        id: 4,
        name: '...',
        achievement:
            '...',
        image: ''
    },
]

const alumniStudents: Student[] = [
    {
        id: 1,
        name: 'Phạm Vũ Minh Trang',
        achievement: 'Học sinh giỏi quốc gia năm học 2024-2025',
        image: '/images/pham-vu-minh-trang.jpg',
    },
    {
        id: 2,
        name: 'Nguyễn Lê Nhật Nam',
        achievement: 'Thành viên đội tuyển Olympic Toán quốc Tế 2026',
        image: '/images/nhat-nam.jpg',
    },
    {
        id: 3,
        name: 'Hoàng Hương Giang',
        achievement: 'Học sinh lớp 12 Toán 1 Chuyên Sư Phạm, 1600 SAT',
        image: '/images/hoang-huong-giang.jpg',
    },
    {
        id: 4,
        name: 'Đào Phúc Long',
        achievement: 'Giải Nhì kì thi chọn học sinh giỏi quốc gia năm học 2021-2022',
        image: '/images/dao-phuc-long.jpg',
    }
]

const sectionTitleStyle: CSSProperties = {
    textAlign: 'center',
    marginBottom: 10,
}

const underlineStyle: CSSProperties = {
    width: 90,
    height: 4,
    background: '#f5b301',
    margin: '0 auto 40px',
    borderRadius: 999,
}

const StudentCard: React.FC<StudentCardProps> = ({ student }) => {
    return (
        <Card
            bordered={false}
            style={{
                textAlign: 'center',
                borderRadius: 24,
                height: '100%',
                background: 'transparent',
                boxShadow: 'none',
            }}
            styles={{
                body: {
                    padding: '8px 12px 20px',
                },
            }}
        >
            <div
                style={{
                    width: 180,
                    height: 180,
                    margin: '0 auto 22px',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
                    border: '6px solid #fff',
                    background: '#f0f0f0',
                }}
            >
                <img
                    src={student.image}
                    alt={student.name}
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                    }}
                />
            </div>

            <Title
                level={4}
                style={{
                    color: '#2f9bf5',
                    marginBottom: 12,
                    minHeight: 56,
                }}
            >
                {student.name}
            </Title>

            <Paragraph
                style={{
                    color: '#7a7a7a',
                    fontSize: 18,
                    lineHeight: 1.7,
                    maxWidth: 300,
                    margin: '0 auto',
                }}
                ellipsis={{ rows: 3, expandable: false }}
            >
                {student.achievement}
            </Paragraph>
        </Card>
    )
}

const StudentSection: React.FC<StudentSectionProps> = ({
    title,
    subtitle,
    students,
}) => {
    return (
        <section style={{ marginBottom: 72 }}>
            <div style={{ marginBottom: 28 }}>
                <Title level={2} style={sectionTitleStyle}>
                    {title}
                </Title>

                <div style={underlineStyle} />

                {subtitle && (
                    <Paragraph
                        style={{
                            textAlign: 'center',
                            maxWidth: 860,
                            margin: '0 auto 12px',
                            color: '#666',
                            fontSize: 17,
                            lineHeight: 1.8,
                        }}
                    >
                        {subtitle}
                    </Paragraph>
                )}
            </div>

            <Row gutter={[24, 40]} justify="center">
                {students.map((student: Student) => (
                    <Col key={student.id} xs={24} sm={12} lg={8} xl={6}>
                        <StudentCard student={student} />
                    </Col>
                ))}
            </Row>
        </section>
    )
}

const Achievement = () => {
    return (
        <Layout style={{ minHeight: '100vh', background: '#fff' }}>
            <NavbarComponent />
            <Content>
                <div
                    style={{
                        background: 'linear-gradient(135deg, #eef6ff 0%, #ffffff 50%, #f8fbff 100%)',
                        padding: '72px 24px 56px',
                        textAlign: 'center',
                    }}
                >
                    <div style={{ maxWidth: 900, margin: '0 auto' }}>

                        <Title
                            style={{
                                marginTop: 16,
                                marginBottom: 16,
                                fontSize: 'clamp(32px, 5vw, 52px)',
                                lineHeight: 1.2,
                            }}
                        >
                            Thành tích học sinh
                        </Title>

                        <Paragraph
                            style={{
                                fontSize: 18,
                                color: '#666',
                                lineHeight: 1.8,
                                margin: '0 auto',
                                maxWidth: 760,
                            }}
                        >
                            Những kết quả đáng tự hào của các học sinh đang theo học cũng như
                            các cựu học sinh đã trưởng thành từ câu lạc bộ.
                        </Paragraph>
                    </div>
                </div>

                <div
                    style={{
                        maxWidth: 1280,
                        margin: '0 auto',
                        padding: '56px 24px 80px',
                    }}
                >
                    <StudentSection
                        title="Học sinh đang học tại CLB"
                        students={currentStudents}
                    />

                    <Divider
                        style={{
                            margin: '8px 0 56px',
                            borderColor: '#d9d9d9',
                        }}
                    />

                    <StudentSection
                        title="Cựu học sinh"
                        students={alumniStudents}
                    />
                </div>
            </Content>

            <FooterComponent />
        </Layout>
    )
}

export default Achievement