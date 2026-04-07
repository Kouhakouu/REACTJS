'use client'
import React from 'react';
import {
    Layout,
    Typography,
    Row,
    Col,
    Card,
    Space,
    Divider,
    Tag,
    List,
} from 'antd';
import {
    BookOutlined,
    BulbOutlined,
    TeamOutlined,
    TrophyOutlined,
    CheckCircleOutlined,
    CalculatorOutlined,
    ReadOutlined,
    RiseOutlined,
    HeartOutlined,
} from '@ant-design/icons';
import NavbarComponent from '../common/navbar';

const { Content } = Layout;
const { Title, Paragraph, Text } = Typography;

const subjects = [
    {
        title: 'Toán Tiểu học',
        icon: <CalculatorOutlined style={{ fontSize: 28 }} />,
        color: '#1677ff',
        description:
            'Các con được học từ lớp 2, từ cơ bản đến nâng cao, rèn luyện tư duy logic, khơi gợi sự sáng tạo và niềm say mê môn học, đồng thời chuẩn bị tốt cho kỳ thi vào lớp 6.',
    },
    {
        title: 'Tiếng Việt Tiểu học',
        icon: <ReadOutlined style={{ fontSize: 28 }} />,
        color: '#13c2c2',
        description:
            'Giúp các con phát triển kỹ năng nghe, nói, đọc, viết; hình thành tư duy ngôn ngữ; biết giao tiếp và truyền đạt cảm xúc, tư tưởng một cách chính xác, biểu cảm.',
    },
    {
        title: 'Toán THCS',
        icon: <BookOutlined style={{ fontSize: 28 }} />,
        color: '#722ed1',
        description:
            'Học sinh được tiếp cận với Số học, Hình học, Đại số, Tổ hợp, Thuật toán, Logic, Thống kê… theo lộ trình từ đơn giản đến phức tạp, phù hợp từng độ tuổi từ lớp 6 đến lớp 9.',
    },
    {
        title: 'Văn THCS',
        icon: <BulbOutlined style={{ fontSize: 28 }} />,
        color: '#eb2f96',
        description:
            'Định hướng chuyên sâu, nâng cao năng lực cảm thụ văn học, phát triển kỹ năng nói và viết, vững vàng kiến thức để sẵn sàng cho các kỳ thi của Sở GD Hà Nội và Bộ Giáo dục.',
    },
    {
        title: 'Toán THPT',
        icon: <RiseOutlined style={{ fontSize: 28 }} />,
        color: '#fa8c16',
        description:
            'Đội ngũ giáo viên của CMATH giảng dạy Toán chất lượng cao cho khối 10, 11, 12, giúp học sinh vững kiến thức trên lớp và tự tin trong các kỳ thi THPT, Đại học.',
    },
];

const reasons = [
    {
        title: 'Triết lý giáo dục truyền cảm hứng',
        icon: <HeartOutlined />,
        content:
            'CMATH không chỉ dạy kiến thức mà còn truyền ngọn lửa học tập, giúp học sinh làm chủ tư duy, yêu việc học và xây dựng niềm vui học tập bền vững.',
    },
    {
        title: 'Chương trình được biên soạn kỹ lưỡng',
        icon: <BookOutlined />,
        content:
            'Chương trình học do thầy Võ Quốc Bá Cẩn cùng các thầy cô trực tiếp biên soạn, cập nhật hàng năm để phù hợp với từng lứa tuổi và mục tiêu học tập.',
    },
    {
        title: 'Theo sát từng học sinh',
        icon: <TeamOutlined />,
        content:
            'CLB thường xuyên trao đổi với phụ huynh, đánh giá định kỳ, phân lớp theo năng lực và theo dõi tiến bộ của các con theo ngày, tháng, năm.',
    },
    {
        title: 'Đội ngũ giáo viên tâm huyết',
        icon: <TrophyOutlined />,
        content:
            'Giáo viên tại CLB đến từ các trường uy tín tại Hà Nội, có chuyên môn tốt, nhiều năm kinh nghiệm, tận tâm và nhiệt huyết với nghề.',
    },
];

const teachingMethods = [
    'Chương trình học được cập nhật hàng năm, phù hợp với từng độ tuổi học sinh.',
    'Giáo trình kết hợp hài hòa giữa Toán cơ bản, Toán chuyên Việt Nam và định hướng từ Singapore, Mỹ.',
    'Bài học thiết kế theo hướng tư duy chiều sâu, khuyến khích nhiều cách giải, tránh học máy móc.',
    'Hệ thống bài tập trực quan, phong phú, gợi mở để kích thích sự sáng tạo và niềm đam mê học tập.',
    'Củng cố chắc kiến thức cơ bản và nâng cao dần theo năng lực từng học sinh.',
    'Phân lớp đồng đều để tăng hiệu quả học tập và giúp mỗi học sinh phát triển đúng lộ trình.',
    'Sau mỗi buổi học, CLB gửi nhận xét và tình hình học tập cho phụ huynh.',
    'Định kỳ 2 tháng có bài kiểm tra đánh giá để điều chỉnh lớp học và tốc độ giảng dạy phù hợp.',
];

const featuredTeachers = [
    {
        name: 'Thầy Võ Quốc Bá Cẩn',
        role: 'Giáo viên chuyên Toán',
        image: '/images/teachers/vo-quoc-ba-can.jpg',
        description:
            'Cựu học sinh chuyên Toán Lý Tự Trọng, Cần Thơ. Công tác tại Trường THCS Archimedes Academy. Thầy là giáo viên chủ nhiệm các lớp chuyên Toán của trường, đồng thời là tác giả và đồng tác giả của nhiều đầu sách tham khảo nổi tiếng trong nước dành cho học sinh cấp 2 và cấp 3.',
    },
    {
        name: 'Thầy Nguyễn Văn Quý',
        role: 'Giáo viên chuyên Toán',
        image: '/images/teachers/nguyen-van-quy.jpg',
        description:
            'Thủ khoa đầu vào trường đại học Khoa học tự nhiên, Tham gia dạy đội tuyển toán của trường Archimedes Academy, Tham gia dạy đội tuyển Toán Quốc Tế (IMO), trường Thu Toán học, các đội tuyển thi HSG Quốc Gia VMO...',
    },
    {
        name: 'Thầy Nguyễn Lê Phước',
        role: 'Giáo viên chuyên Toán',
        image: '/images/teachers/nguyen-le-phuoc.jpg',
        description:
            'Giáo viên Toán tại Trường THCS Archimedes Academy. Thầy chuyên luyện cho đội tuyển của trường và các đội tuyển thi quốc gia, đồng thời tham gia đào tạo học sinh dự thi các kỳ thi Toán quốc tế như IMC, IKMC, AMC, IGO, MYTS, AMC8,... Thầy cũng giảng dạy nhiều khóa luyện thi vào lớp 10 đạt kết quả cao.',
    },
    {
        name: 'Thầy Nguyễn Tiến Dũng',
        role: 'Giáo viên chuyên Toán',
        image: '/images/teachers/nguyen-tien-dung.jpg',
        description:
            'Công tác tại Trường THCS Archimedes Academy. Từng đạt thủ khoa Olympic Toán sinh viên toàn quốc năm 2014, đạt giải cao tại nhiều cuộc thi VMO. Thầy là giáo viên chuyên hình, giảng dạy các lớp chuyên Toán của trường Archimedes Academy và nhiều khóa luyện thi vào lớp 10 đạt thành tích nổi bật.',
    },
    {
        name: 'Thầy Trần Đức Hiếu',
        role: 'Giáo viên chuyên Toán',
        image: '/images/teachers/tran-duc-hieu.jpg',
        description:
            'Công tác tại Trường THCS Archimedes Academy. Từng đạt thủ khoa Olympic Toán sinh viên toàn quốc năm 2014, đạt giải cao tại nhiều cuộc thi VMO. Thầy là giáo viên chuyên hình, giảng dạy các lớp chuyên Toán của trường Archimedes Academy và nhiều khóa luyện thi vào lớp 10 đạt thành tích nổi bật.',
    },
    {
        name: 'Thầy Trần Quang Độ',
        role: 'Giáo viên chuyên Toán',
        image: '/images/teachers/tran-quang-do.jpg',
        description:
            'Công tác tại Viện nghiên cứu cao cấp về Toán, 2 năm liên tiếp tham gia kì thi chọn đội tuyển Olympic Toán quốc tế. Tham gia giảng dạy nhiều đội tuyển Toán và TST của các trường Chuyên trên Toàn quốc',
    },
];

const assistantHighlights = [
    {
        title: '✨ Là "từ điển sống" sau giờ học',
        description:
            'Luôn sẵn sàng ở lại muộn hơn một chút, kiên nhẫn giảng lại từng bước giải cho đến khi các em thực sự hiểu bài.',
    },
    {
        title: '✨ Là cầu nối thấu hiểu',
        description:
            'Với khoảng cách tuổi tác không quá lớn, các anh chị TA dễ dàng nắm bắt tâm lý, gỡ rối những "tâm tư tuổi học trò", giúp các em xua tan áp lực và thêm yêu môn Toán.',
    },
    {
        title: '✨ Là cánh tay đắc lực của thầy cô',
        description:
            'Chăm chút từng bài tập về nhà, theo sát tiến độ của từng bạn để đảm bảo không một ai bị bỏ lại phía sau.',
    },
];

const featuredAssistants = [
    {
        name: 'Lê Mai Anh',
        image: '/images/assistants/le-mai-anh.png',
        study: 'Cựu học sinh Chuyên Sư phạm 2022-2025',
        achievement: 'Giải Nhất học sinh giỏi cấp Đại học Sư phạm',
        description:
            'Mai Anh là trợ giảng nhiệt tình, luôn hỗ trợ các bạn học sinh kém ngoài giờ học và hỗ trợ các em củng cố kiến thức một cách chắc chắn, dễ hiểu.',
    },
    {
        name: 'Phạm Vũ Minh Trang',
        image: '/images/assistants/pham-vu-minh-trang.webp',
        study: 'Cựu học sinh Chuyên Nguyễn Trãi 2022-2025',
        achievement: 'Tham gia kì thi Học sinh giỏi Quốc gia năm 2025',
        description:
            'Minh Trang đặc biệt chú trọng vào việc giúp học sinh hiểu sâu bản chất bài toán, rèn kỹ năng trình bày và tư duy giải quyết vấn đề.',
    },
    {
        name: 'Nguyễn Anh Quân',
        image: '/images/assistants/nguyen-anh-quan.png',
        study: 'Cựu học sinh ... 2021-2024',
        achievement: 'Giải Ba Học sinh giỏi Quốc gia năm 2023',
        description:
            'Quân luôn sẵn sàng đồng hành cùng các em trong việc luyện đề, giải thích cặn kẽ từng bước và giúp các bạn xây dựng nền tảng toán học vững chắc.',
    },
    {
        name: 'Vũ Tùng Lâm',
        image: '/images/assistants/vu-tung-lam.jpg',
        study: 'Cựu học sinh Chuyên Hạ Long 2019-2022',
        achievement: 'Tham gia kì thi Học sinh giỏi Quốc gia năm 2022',
        description:
            'Lâm tận tâm trong việc hướng dẫn các em nắm chắc phương pháp giải, phát triển tư duy logic và tự tin với mọi dạng bài tập.',
    },
];

const Info = () => {
    return (
        <Layout>
            <NavbarComponent />
            <Layout style={{ background: '#f5f7fb' }}>
                <Content>
                    <div
                        style={{
                            background: 'linear-gradient(135deg, #e6f4ff 0%, #f9f0ff 100%)',
                            padding: '72px 20px',
                        }}
                    >
                        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
                            <Row gutter={[32, 32]} align="middle">
                                <Col xs={24} lg={14}>
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
                                            Câu lạc bộ Toán học muôn màu • CMATH
                                        </Tag>

                                        <Title
                                            level={2}
                                            style={{
                                                margin: 0,
                                                fontSize: 'clamp(24px, 4vw, 40px)',
                                                lineHeight: 1.2,
                                                color: '#0f172a',
                                            }}
                                        >
                                            Nơi nuôi dưỡng tư duy, cảm hứng học tập và hành trình phát triển của mỗi học sinh
                                        </Title>

                                        <Paragraph
                                            style={{
                                                fontSize: 18,
                                                lineHeight: 1.9,
                                                color: '#475569',
                                                marginBottom: 0,
                                            }}
                                        >
                                            Câu lạc bộ Toán học muôn màu (CMATH) tiền thân là lớp Toán của
                                            thầy Võ Quốc Bá Cẩn. Từ những năm 2012, thầy dạy gia sư cho từng
                                            học sinh, sau đó phụ huynh thành lập nhóm mời thầy giảng dạy.
                                            CMATH ra đời với mong muốn truyền cảm hứng học tập cho nhiều bạn
                                            trẻ, khơi dậy tiềm năng và giúp các con làm chủ kiến thức, làm
                                            chủ tư duy cũng như tương lai của chính mình.
                                        </Paragraph>

                                        <Space wrap size={[10, 10]}>
                                            <Tag color="processing">Tư duy logic</Tag>
                                            <Tag color="purple">Phát triển toàn diện</Tag>
                                            <Tag color="gold">Lộ trình bài bản</Tag>
                                            <Tag color="green">Theo sát học sinh</Tag>
                                        </Space>
                                    </Space>
                                </Col>

                                <Col xs={24} lg={10}>
                                    <Card
                                        bordered={false}
                                        style={{
                                            borderRadius: 24,
                                            boxShadow: '0 20px 60px rgba(15, 23, 42, 0.08)',
                                            overflow: 'hidden',
                                        }}
                                        bodyStyle={{ padding: 28 }}
                                    >
                                        <Space direction="vertical" size={20} style={{ width: '100%' }}>
                                            <Title level={3} style={{ margin: 0 }}>
                                                Điểm nổi bật tại CMATH
                                            </Title>

                                            <div
                                                style={{
                                                    display: 'grid',
                                                    gridTemplateColumns: '1fr 1fr',
                                                    gap: 16,
                                                }}
                                            >
                                                {[
                                                    {
                                                        icon: <BulbOutlined style={{ fontSize: 24, color: '#1677ff' }} />,
                                                        title: 'Truyền cảm hứng',
                                                    },
                                                    {
                                                        icon: <CheckCircleOutlined style={{ fontSize: 24, color: '#52c41a' }} />,
                                                        title: 'Theo sát tiến độ',
                                                    },
                                                    {
                                                        icon: <TeamOutlined style={{ fontSize: 24, color: '#722ed1' }} />,
                                                        title: 'Phân lớp phù hợp',
                                                    },
                                                    {
                                                        icon: <TrophyOutlined style={{ fontSize: 24, color: '#fa8c16' }} />,
                                                        title: 'Đội ngũ chất lượng',
                                                    },
                                                ].map((item, index) => (
                                                    <div
                                                        key={index}
                                                        style={{
                                                            background: '#f8fafc',
                                                            borderRadius: 18,
                                                            padding: 18,
                                                            border: '1px solid #eef2f7',
                                                            minHeight: 110,
                                                        }}
                                                    >
                                                        <Space direction="vertical" size={8}>
                                                            {item.icon}
                                                            <Text strong style={{ fontSize: 16 }}>
                                                                {item.title}
                                                            </Text>
                                                        </Space>
                                                    </div>
                                                ))}
                                            </div>
                                        </Space>
                                    </Card>
                                </Col>
                            </Row>
                        </div>
                    </div>

                    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '64px 20px' }}>
                        <Space direction="vertical" size={16} style={{ width: '100%', marginBottom: 32 }}>
                            <Title level={2} style={{ margin: 0 }}>
                                Hành trình hình thành và sứ mệnh
                            </Title>
                            <Paragraph
                                style={{
                                    fontSize: 16,
                                    lineHeight: 1.9,
                                    color: '#475569',
                                    marginBottom: 0,
                                }}
                            >
                                Từ một lớp học nhỏ do thầy Võ Quốc Bá Cẩn trực tiếp giảng dạy,
                                CMATH dần phát triển thành một môi trường học tập bài bản, nơi các
                                con không chỉ được bồi dưỡng kiến thức mà còn được khơi mở tư duy,
                                rèn luyện bản lĩnh và hình thành thói quen học tập tích cực.
                            </Paragraph>
                            <Paragraph
                                style={{
                                    fontSize: 16,
                                    lineHeight: 1.9,
                                    color: '#475569',
                                    marginBottom: 0,
                                }}
                            >
                                Chúng tôi tin rằng giáo dục không chỉ dừng ở việc giúp học sinh làm
                                tốt bài kiểm tra, mà còn là hành trình giúp các con hiểu mình, yêu
                                việc học và từng bước vững vàng hơn trong tương lai.
                            </Paragraph>
                        </Space>

                        <Divider />

                        <div style={{ marginTop: 40 }}>
                            <Title level={2} style={{ textAlign: 'center', marginBottom: 12 }}>
                                Các môn học tại CMATH
                            </Title>
                            <Paragraph
                                style={{
                                    textAlign: 'center',
                                    color: '#64748b',
                                    maxWidth: 820,
                                    margin: '0 auto 40px',
                                    fontSize: 16,
                                    lineHeight: 1.8,
                                }}
                            >
                                CMATH xây dựng lộ trình học tập xuyên suốt từ Tiểu học đến THPT, với
                                định hướng phù hợp cho từng độ tuổi, từng năng lực và từng mục tiêu học tập.
                            </Paragraph>

                            <Row gutter={[24, 24]}>
                                {subjects.map((subject, index) => (
                                    <Col xs={24} sm={12} lg={8} key={index}>
                                        <Card
                                            hoverable
                                            bordered={false}
                                            style={{
                                                height: '100%',
                                                borderRadius: 20,
                                                boxShadow: '0 10px 30px rgba(15, 23, 42, 0.06)',
                                            }}
                                            bodyStyle={{ padding: 24 }}
                                        >
                                            <Space direction="vertical" size={16} style={{ width: '100%' }}>
                                                <div
                                                    style={{
                                                        width: 56,
                                                        height: 56,
                                                        borderRadius: 16,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        background: `${subject.color}15`,
                                                        color: subject.color,
                                                    }}
                                                >
                                                    {subject.icon}
                                                </div>

                                                <Title level={4} style={{ margin: 0 }}>
                                                    {subject.title}
                                                </Title>

                                                <Paragraph
                                                    style={{
                                                        marginBottom: 0,
                                                        color: '#475569',
                                                        lineHeight: 1.8,
                                                    }}
                                                >
                                                    {subject.description}
                                                </Paragraph>
                                            </Space>
                                        </Card>
                                    </Col>
                                ))}
                            </Row>
                        </div>

                        <Divider style={{ margin: '64px 0 48px' }} />

                        <div>
                            <Title level={2} style={{ textAlign: 'center', marginBottom: 12 }}>
                                Vì sao phụ huynh và học sinh lựa chọn CMATH?
                            </Title>

                            <Paragraph
                                style={{
                                    textAlign: 'center',
                                    color: '#64748b',
                                    margin: '0 auto 40px',
                                    fontSize: 16,
                                    lineHeight: 1.8,
                                    whiteSpace: 'nowrap',
                                    maxWidth: 'none',
                                }}
                            >
                                CMATH hướng đến một môi trường học tập nghiêm túc, nhân văn, giàu cảm hứng và luôn đặt sự tiến bộ của học sinh làm trung tâm.
                            </Paragraph>

                            <Row gutter={[24, 24]}>
                                {reasons.map((item, index) => (
                                    <Col xs={24} md={12} key={index}>
                                        <Card
                                            bordered={false}
                                            style={{
                                                height: '100%',
                                                borderRadius: 20,
                                                boxShadow: '0 10px 30px rgba(15, 23, 42, 0.06)',
                                            }}
                                            bodyStyle={{ padding: 24 }}
                                        >
                                            <Space align="start" size={16}>
                                                <div
                                                    style={{
                                                        width: 52,
                                                        height: 52,
                                                        minWidth: 52,
                                                        borderRadius: 14,
                                                        background: '#eff6ff',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        color: '#1677ff',
                                                        fontSize: 22,
                                                    }}
                                                >
                                                    {item.icon}
                                                </div>

                                                <Space direction="vertical" size={8}>
                                                    <Text strong style={{ fontSize: 18, color: '#0f172a' }}>
                                                        {item.title}
                                                    </Text>
                                                    <Text style={{ color: '#475569', lineHeight: 1.8 }}>
                                                        {item.content}
                                                    </Text>
                                                </Space>
                                            </Space>
                                        </Card>
                                    </Col>
                                ))}
                            </Row>
                        </div>

                        <Divider style={{ margin: '64px 0 48px' }} />

                        <Row gutter={[24, 24]}>
                            <Col xs={24} lg={12}>
                                <Card
                                    bordered={false}
                                    style={{
                                        height: '100%',
                                        borderRadius: 20,
                                        boxShadow: '0 10px 30px rgba(15, 23, 42, 0.06)',
                                    }}
                                    bodyStyle={{ padding: 28 }}
                                >
                                    <Title level={3}>Triết lý dạy học</Title>
                                    <Paragraph style={{ color: '#475569', lineHeight: 1.9, fontSize: 16 }}>
                                        CLB CMATH được thành lập với mong muốn truyền cảm hứng Toán học và
                                        học tập đến nhiều bạn trẻ, khơi dậy tiềm năng và giúp các con làm
                                        chủ kiến thức, làm chủ tư duy cũng như tương lai của bản thân.
                                    </Paragraph>
                                    <Paragraph style={{ color: '#475569', lineHeight: 1.9, fontSize: 16, marginBottom: 0 }}>
                                        Tại đây, các thầy cô không chỉ truyền đạt kiến thức mà còn hướng
                                        dẫn các con cách học, cách suy nghĩ, cách tự tin vượt qua thử thách
                                        để nuôi dưỡng niềm vui học tập suốt đời.
                                    </Paragraph>
                                </Card>
                            </Col>

                            <Col xs={24} lg={12}>
                                <Card
                                    bordered={false}
                                    style={{
                                        height: '100%',
                                        borderRadius: 20,
                                        boxShadow: '0 10px 30px rgba(15, 23, 42, 0.06)',
                                    }}
                                    bodyStyle={{ padding: 28 }}
                                >
                                    <Title level={3}>Đội ngũ giáo viên</Title>
                                    <Paragraph style={{ color: '#475569', lineHeight: 1.9, fontSize: 16 }}>
                                        Giáo viên giảng dạy tại CLB gồm các thầy cô đến từ những trường có
                                        chất lượng và uy tín trên địa bàn Hà Nội, có chuyên môn giỏi và nhiều
                                        năm kinh nghiệm giảng dạy, luyện thi điều kiện và luyện thi chuyên.
                                    </Paragraph>
                                    <Paragraph style={{ color: '#475569', lineHeight: 1.9, fontSize: 16, marginBottom: 0 }}>
                                        Mỗi khối đều có các lớp dành cho học sinh cơ bản, nâng cao, chuyên,
                                        phù hợp để các bạn lựa chọn theo năng lực của mình.
                                    </Paragraph>
                                </Card>
                            </Col>
                        </Row>

                        <Divider style={{ margin: '64px 0 48px' }} />

                        <Card
                            bordered={false}
                            style={{
                                borderRadius: 24,
                                boxShadow: '0 10px 30px rgba(15, 23, 42, 0.06)',
                            }}
                            bodyStyle={{ padding: 32 }}
                        >
                            <Title level={2} style={{ textAlign: 'center', marginBottom: 8 }}>
                                Phương pháp giảng dạy tại CMATH
                            </Title>
                            <Paragraph
                                style={{
                                    textAlign: 'center',
                                    color: '#64748b',
                                    maxWidth: 860,
                                    margin: '0 auto 32px',
                                    fontSize: 16,
                                    lineHeight: 1.8,
                                }}
                            >
                                Mỗi bài học tại CMATH đều được xây dựng để học sinh hiểu sâu, học chắc,
                                phát triển tư duy độc lập và tiến bộ theo một lộ trình phù hợp.
                            </Paragraph>

                            <List
                                grid={{ gutter: 16, xs: 1, md: 2 }}
                                dataSource={teachingMethods}
                                renderItem={(item) => (
                                    <List.Item>
                                        <Card
                                            size="small"
                                            style={{
                                                borderRadius: 16,
                                                background: '#fafcff',
                                                border: '1px solid #eef2f7',
                                                height: '100%',
                                            }}
                                        >
                                            <Space align="start">
                                                <CheckCircleOutlined
                                                    style={{
                                                        color: '#52c41a',
                                                        fontSize: 18,
                                                        marginTop: 4,
                                                    }}
                                                />
                                                <Text style={{ color: '#334155', lineHeight: 1.8 }}>{item}</Text>
                                            </Space>
                                        </Card>
                                    </List.Item>
                                )}
                            />
                        </Card>

                        <Divider style={{ margin: '36px 0 36px' }} />

                        <div>
                            <Title level={2} style={{ textAlign: 'center', marginBottom: 12 }}>
                                Các giáo viên tiêu biểu
                            </Title>

                            <Paragraph
                                style={{
                                    textAlign: 'center',
                                    color: '#64748b',
                                    maxWidth: 920,
                                    margin: '0 auto 48px',
                                    fontSize: 16,
                                    lineHeight: 1.8,
                                }}
                            >
                                Đội ngũ giáo viên tại CMATH không chỉ có chuyên môn vững vàng mà còn luôn tận tâm,
                                sát sao và đồng hành cùng học sinh trên từng chặng đường học tập.
                            </Paragraph>

                            <div
                                style={{
                                    background: '#fff',
                                    borderRadius: 24,
                                    padding: '8px 24px',
                                    boxShadow: '0 10px 30px rgba(15, 23, 42, 0.06)',
                                }}
                            >
                                {featuredTeachers.map((teacher, index) => (
                                    <div key={index}>
                                        <Row
                                            gutter={[32, 24]}
                                            align="middle"
                                            style={{
                                                padding: '32px 0',
                                            }}
                                        >
                                            <Col xs={24} md={6} lg={4}>
                                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                    <div
                                                        style={{
                                                            width: 160,
                                                            height: 160,
                                                            borderRadius: '50%',
                                                            overflow: 'hidden',
                                                            border: '5px solid #f3f4f6',
                                                            background: '#fff',
                                                            boxShadow: '0 8px 24px rgba(15, 23, 42, 0.08)',
                                                            flexShrink: 0,
                                                        }}
                                                    >
                                                        <img
                                                            src={teacher.image}
                                                            alt={teacher.name}
                                                            style={{
                                                                width: '100%',
                                                                height: '100%',
                                                                objectFit: 'cover',
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            </Col>

                                            <Col xs={24} md={18} lg={20}>
                                                <Space direction="vertical" size={10} style={{ width: '100%' }}>
                                                    <Title
                                                        level={3}
                                                        style={{
                                                            margin: 0,
                                                            fontSize: 20,
                                                            color: '#111827',
                                                        }}
                                                    >
                                                        {teacher.name}
                                                    </Title>

                                                    <Text
                                                        strong
                                                        style={{
                                                            fontSize: 16,
                                                            color: '#374151',
                                                        }}
                                                    >
                                                        {teacher.role}
                                                    </Text>

                                                    <Paragraph
                                                        style={{
                                                            marginBottom: 0,
                                                            color: '#4b5563',
                                                            fontSize: 14,
                                                            lineHeight: 1.9,
                                                        }}
                                                    >
                                                        {teacher.description}
                                                    </Paragraph>
                                                </Space>
                                            </Col>
                                        </Row>

                                        {index !== featuredTeachers.length - 1 && (
                                            <Divider
                                                style={{
                                                    margin: 0,
                                                    borderColor: '#dbeafe',
                                                }}
                                            />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <Divider style={{ margin: '64px 0 32px' }} />

                        <div>
                            <Title level={2} style={{ textAlign: 'center', marginBottom: 12 }}>
                                Đội ngũ trợ giảng - Điều tạo nên sự khác biệt ở CMATH
                            </Title>

                            <Card
                                bordered={false}
                                style={{
                                    borderRadius: 24,
                                    boxShadow: '0 10px 30px rgba(15, 23, 42, 0.06)',
                                    background: 'linear-gradient(180deg, #ffffff 0%, #f8fbff 100%)',
                                }}
                                bodyStyle={{ padding: 32 }}
                            >
                                <Paragraph
                                    style={{
                                        textAlign: 'center',
                                        color: '#475569',
                                        fontSize: 16,
                                        lineHeight: 1.9,
                                        maxWidth: 900,
                                        margin: '0 auto 36px',
                                    }}
                                >
                                    Để CMATH có được thành công và nhận được sự tin yêu của phụ huynh, học sinh như ngày hôm nay,
                                    ngoài đội ngũ giáo viên chất lượng thì không thể không kể đến đội ngũ trợ giảng siêu nhiệt tình
                                    và tận tâm. Ở CMATH, các anh chị trợ giảng đóng một vai trò vô cùng đặc biệt, không chỉ hỗ trợ học tập
                                    mà còn đồng hành, lắng nghe và tiếp thêm động lực cho các em trên hành trình chinh phục kiến thức.
                                </Paragraph>

                                <Row gutter={[24, 24]}>
                                    {assistantHighlights.map((item, index) => (
                                        <Col xs={24} md={12} lg={8} key={index}>
                                            <Card
                                                bordered={false}
                                                style={{
                                                    height: '100%',
                                                    borderRadius: 20,
                                                    background: '#ffffff',
                                                    boxShadow: '0 8px 24px rgba(15, 23, 42, 0.05)',
                                                    border: '1px solid #eef2f7',
                                                }}
                                                bodyStyle={{ padding: 24 }}
                                            >
                                                <Space direction="vertical" size={14} style={{ width: '100%' }}>
                                                    <Text
                                                        strong
                                                        style={{
                                                            fontSize: 18,
                                                            color: '#1677ff',
                                                            lineHeight: 1.6,
                                                        }}
                                                    >
                                                        {item.title}
                                                    </Text>


                                                    <Paragraph
                                                        style={{
                                                            marginBottom: 0,
                                                            color: '#4b5563',
                                                            fontSize: 15,
                                                            lineHeight: 1.9,
                                                        }}
                                                    >
                                                        {item.description}
                                                    </Paragraph>
                                                </Space>
                                            </Card>
                                        </Col>
                                    ))}
                                </Row>
                            </Card>
                        </div>

                        <div
                            style={{
                                background: '#fff',
                                borderRadius: 24,
                                padding: '8px 24px',
                                boxShadow: '0 10px 30px rgba(15, 23, 42, 0.06)',
                            }}
                        >
                            {featuredAssistants.map((assistant, index) => (
                                <div key={index}>
                                    <Row
                                        gutter={[32, 24]}
                                        align="middle"
                                        style={{
                                            padding: '32px 0',
                                        }}
                                    >
                                        <Col xs={24} md={6} lg={4}>
                                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                <div
                                                    style={{
                                                        width: 160,
                                                        height: 160,
                                                        borderRadius: '50%',
                                                        overflow: 'hidden',
                                                        border: '5px solid #f3f4f6',
                                                        background: '#fff',
                                                        boxShadow: '0 8px 24px rgba(15, 23, 42, 0.08)',
                                                        flexShrink: 0,
                                                    }}
                                                >
                                                    <img
                                                        src={assistant.image}
                                                        alt={assistant.name}
                                                        style={{
                                                            width: '100%',
                                                            height: '100%',
                                                            objectFit: 'cover',
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </Col>

                                        <Col xs={24} md={18} lg={20}>
                                            <Space direction="vertical" size={10} style={{ width: '100%' }}>
                                                <Title
                                                    level={3}
                                                    style={{
                                                        margin: 0,
                                                        fontSize: 20,
                                                        color: '#111827',
                                                    }}
                                                >
                                                    {assistant.name}
                                                </Title>

                                                <Paragraph
                                                    style={{
                                                        marginBottom: 0,
                                                        color: '#4b5563',
                                                        fontSize: 18,
                                                        lineHeight: 1.9,
                                                    }}
                                                >
                                                    {assistant.study}
                                                </Paragraph>

                                                <Paragraph
                                                    style={{
                                                        marginBottom: 0,
                                                        color: '#4b5563',
                                                        fontSize: 16,
                                                        lineHeight: 1.9,
                                                    }}
                                                >
                                                    {assistant.achievement}
                                                </Paragraph>

                                                <Paragraph
                                                    style={{
                                                        marginBottom: 0,
                                                        color: '#4b5563',
                                                        fontSize: 14,
                                                        lineHeight: 1.9,
                                                    }}
                                                >
                                                    {assistant.description}
                                                </Paragraph>
                                            </Space>
                                        </Col>
                                    </Row>

                                    {index !== featuredAssistants.length - 1 && (
                                        <Divider
                                            style={{
                                                margin: 0,
                                                borderColor: '#dbeafe',
                                            }}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>

                        <Divider style={{ margin: '64px 0 48px' }} />

                        <div
                            style={{
                                background: 'linear-gradient(135deg, #1677ff 0%, #722ed1 100%)',
                                borderRadius: 28,
                                padding: '40px 28px',
                                textAlign: 'center',
                                color: '#fff',
                            }}
                        >
                            <Title level={2} style={{ color: '#fff', marginTop: 0 }}>
                                Đồng hành cùng học sinh trên hành trình chinh phục tri thức
                            </Title>
                            <Paragraph
                                style={{
                                    color: 'rgba(255,255,255,0.9)',
                                    fontSize: 16,
                                    lineHeight: 1.9,
                                    maxWidth: 860,
                                    margin: '0 auto',
                                }}
                            >
                                CMATH luôn mong muốn trở thành nơi học sinh được học tập trong môi trường
                                chất lượng, được truyền cảm hứng, được tôn trọng sự khác biệt và được phát triển
                                hết tiềm năng của mình.
                            </Paragraph>
                        </div>
                    </div>
                </Content>
            </Layout>
        </Layout>
    );
};

export default Info;