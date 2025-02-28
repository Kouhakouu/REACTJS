'use client'
import React from "react";
import Link from "next/link";
import { Carousel, Layout, Menu, Button, Row, Col, Card, Typography } from "antd";
import { HomeOutlined, InfoCircleOutlined, PhoneOutlined, TrophyOutlined, BookOutlined, SolutionOutlined, FileTextOutlined, ReadOutlined, SafetyOutlined, TeamOutlined, HeartOutlined, UserOutlined, LoginOutlined, UserAddOutlined, LeftOutlined, RightOutlined, YoutubeOutlined } from "@ant-design/icons";
import NavbarComponent from "@/components/common/navbar";
import FooterComponent from "@/components/common/footer";
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
    const { SubMenu } = Menu;

    const courses = [
        {
            title: "ÔN LUYỆN THI TOÁN LỚP 5",
            description: "Toán lớp 5 là chương trình học quan trọng ở bậc tiểu học, hầu hết các kiến ​​thức của môn toán lớp 5 đều xuất hiện trong các bài thi chuyển cấp.",
            bgColor: "#FFD700", // Vàng
            shadowColor: "#E5A400",
        },
        {
            title: "ÔN LUYỆN THI TOÁN LỚP 6",
            description: "Nội dung khóa học toán chất lượng cao, toán cận chuyên và toán chuyên lớp 6 xoay quanh những kiến thức nâng cao và mở rộng của chương trình trung học cơ sở, giúp các em làm quen dần với những dạng toán hay và khó.",
            bgColor: "#2A95DB", // Xanh dương
            shadowColor: "#1E70B1",
        },
        {
            title: "ÔN LUYỆN THI TOÁN LỚP 7",
            description: "Đến với chương trình toán chất lượng cao, toán cận chuyên và toán chuyên lớp 7, các em sẽ được giảng dạy bởi đội ngũ giáo viên tâm huyết và có nhiều năm thâm niên trong nghề.",
            bgColor: "#3BB25E", // Xanh lá
            shadowColor: "#2E8B4E",
        },
        {
            title: "ÔN LUYỆN THI TOÁN LỚP 8",
            description: "Chương trình Toán lớp 8 là một trong những nội dung kiến thức vô cùng quan trọng ở bậc Trung học cơ sở. Khóa học toán chất lượng cao, toán cận chuyên, toán chuyên lớp 8 đều được giảng dạy bởi các thầy cô ưu tú của CMath.",
            bgColor: "#F56C91", // Hồng
            shadowColor: "#D94E73",
        },
        {
            title: "ÔN LUYỆN THI TOÁN LỚP 9",
            description: "Toán chất lượng cao, toán cận chuyên, chuyên lớp 9 đều xoay quanh các chuyên đề liên quan đến căn bậc hai, căn bậc ba, hàm số, phương trình, hệ phương trình, đường tròn, hình trụ, hình nón, hình cầu..v.v.",
            bgColor: "#FFD700", // Vàng
            shadowColor: "#E5A400",
        }
    ];

    return (
        <Layout>
            <NavbarComponent />

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

                <div style={{ background: "#E7F6F8", padding: "80px 10%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Row gutter={[32, 32]} align="middle">
                        <Col xs={24} md={12}>
                            <Title level={2}>Về chúng tôi</Title>
                            <div style={{ width: "80px", height: "3px", background: "#f4c20d", margin: "10px 0 30px" }}></div>
                            <Paragraph style={{ fontSize: "16px", color: "#333" }}>
                                Câu lạc bộ Toán học muôn màu (CMATH) tiền thân là lớp toán của thầy Võ Quốc Bá Cẩn. Từ những năm 2012 thầy dạy gia sư cho từng học sinh, sau đó Phụ huynh thành lập nhóm mời thầy dạy, mở rộng và mời các giáo viên khác về dạy cùng. CLB thành lập và phát triển mỗi năm, đến năm 2020, CLB đã có hơn 1000 học sinh theo học. CLB thành lập với mong muốn truyền cảm hứng Toán học cho nhiều bạn trẻ, khơi dậy tiềm năng và giúp các con làm chủ kiến thức, làm chủ tư duy cũng như tương lai của bản thân các con.                            </Paragraph>
                            <Paragraph style={{ fontSize: "16px", color: "#333" }}>
                                Tại Câu lạc bộ Toán học muôn màu, các con sẽ được tiếp cận với Toán học hiện đại ở các phân môn Số học, Hình học, Đại số, Tổ hợp, Thuật toán, Logic, Thống kê... từ đơn giản đến phức tạp, phù hợp với từng lứa tuổi từ lớp 6 đến lớp 9.
                            </Paragraph>
                            <Button
                                type="primary"
                                size="large"
                                style={{
                                    background: "#FFD700",
                                    border: "2px dashed black",
                                    color: "#000",
                                    fontSize: "18px",
                                    padding: "16px 32px",
                                    height: "60px",
                                    width: "200px",
                                    fontWeight: "bold"
                                }}
                            >
                                Xem thêm
                            </Button>
                        </Col>

                        <Col xs={24} md={12} style={{ display: "flex", justifyContent: "center" }}>
                            <img
                                src="/gioithieu.png"
                                alt="Giới thiệu"
                                style={{ width: "100%", maxWidth: "600px", height: "auto" }}
                            />
                        </Col>

                    </Row>
                </div>

                <div style={{ textAlign: "center", padding: "50px 10%" }}>
                    <Title level={2}>Các khóa học</Title>
                    <div style={{ width: "80px", height: "3px", background: "#f4c20d", margin: "10px auto 30px" }}></div>

                    <Carousel
                        arrows
                        dots={false}
                        slidesToShow={4}
                        slidesToScroll={1}
                        centerMode={true}
                        infinite={true}
                        centerPadding="0px"
                        responsive={[
                            { breakpoint: 1024, settings: { slidesToShow: 2, slidesToScroll: 1 } },
                            { breakpoint: 768, settings: { slidesToShow: 1, slidesToScroll: 1 } }
                        ]}
                    >
                        {courses.map((course, index) => (
                            <div key={index}>
                                <Card
                                    style={{
                                        backgroundColor: course.bgColor,
                                        borderRadius: "20px",
                                        padding: "10px",
                                        textAlign: "center",
                                        color: "#fff",
                                        height: "250px",
                                        margin: "0 10px"
                                    }}
                                >
                                    <Title style={{ color: "#fff", fontSize: "17px" }}>{course.title}</Title>
                                    <Paragraph style={{ color: "#fff", fontSize: "14px" }}>{course.description}</Paragraph>
                                </Card>
                            </div>
                        ))}
                    </Carousel>

                </div>

                <div style={{ background: "rgb(28 177 245)", padding: "80px 10%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Row gutter={[32, 32]} align="middle">
                        <Col xs={24} md={12}>
                            <Title level={2}>Người truyền cảm hứng</Title>
                            <div style={{ width: "80px", height: "3px", background: "#f4c20d", margin: "10px 0 30px" }}></div>
                            <div style={{
                                maxHeight: "300px",  // Giới hạn chiều cao
                                overflowY: "auto",  // Hiển thị thanh cuộn khi nội dung quá dài
                                paddingRight: "10px",
                            }}>
                                <Paragraph style={{ fontSize: "16px", color: "#333" }}>
                                    Thầy Võ Quốc Bá Cẩn (sinh năm 1988)- Chủ nhiệm CLB CMATH
                                </Paragraph>
                                <Paragraph style={{ fontSize: "16px", color: "#333" }}>
                                    Từ những ngày học tại trường THPT chuyên Lý Tự Trọng-Cần Thơ, thầy Cẩn đã đạt được rất nhiều giải thưởng cấp Thành phố cũng như cấp Quốc gia trong suốt 3 năm học và được tuyển thẳng vào Khoa Dược của Đại học Cần Thơ.
                                </Paragraph>
                                <Paragraph style={{ fontSize: "16px", color: "#333" }}>
                                    Thầy vẫn luyến tiếc: “Tôi luôn bị dày vò vì đã không kiên định với niềm đam mê toán của mình khi chọn học Dược. Vì vậy, tôi đã tự giải tỏa bằng cách tiếp tục viết các chuyên đề về BẤT ĐẲNG THỨC mà tôi đã bắt đầu từ khi còn học phổ thông”. Từ đó, thầy Cẩn tiếp tục cộng tác với các tác giả nổi tiếng như: tác giả Trần Phương, Phạm Văn Thuận, Trần Quốc Anh, Trần Nam Dũng,.. để viết tiếp giấc mơ còn đang dang dở của mình. Dần dần, sách của thầy được nhiều người biết đến và xuất bản tại các nước như Mỹ, Rumani,...Chưa dừng lại ở đó, thầy tiếp tục được các trường chuyên nổi tiếng mời về dạy và dần khẳng định được chuyên môn.
                                </Paragraph>
                                <Paragraph style={{ fontSize: "16px", color: "#333" }}>
                                    Năm 2013, thầy giáo trẻ Bá Cẩn được mời huấn luyện cho đội tuyển Olympic Toán Việt Nam khi mới 25 tuổi. Năm 2015, trong kỳ thi IMO, thầy đã giúp cho Đội tuyển Toán Việt Nam giành 6 huy chương (2 vàng, 3 bạc, 1 đồng) và đội tuyển Arab Saudi được 1 huy chương bạc, 3 huy chương đồng (đây là lần thứ hai đội tuyển nước bạn có huy chương bạc kể từ khi tham gia cuộc thi). Năm 2017, Đội tuyển Việt Nam đã giành 4 Huy chương Vàng Olympic Toán học quốc tế, là thành tích cao nhất từ trước đến nay.
                                </Paragraph>
                                <Paragraph style={{ fontSize: "16px", color: "#333" }}>
                                    CLB CMATH được thầy Cẩn thành lập với mong muốn chia sẻ kiến thức, niềm đam mê Toán học và lan tỏa được nhiệt huyết, ước mơ của thầy đến với nhiều bạn hơn.
                                </Paragraph>
                                <Paragraph style={{ fontSize: "16px", color: "#333" }}>
                                    Với mong muốn truyền cảm hứng Toán học không chỉ ở riêng Việt Nam mà còn với tất cả các bạn học sinh trên khắp Thế Giới, thông điệp thầy Cẩn muốn gửi đến các bạn trẻ là “hãy đi theo đam mê và không ngại khó, ngại khổ”.
                                </Paragraph>
                            </div>

                            <Button
                                type="primary"
                                size="large"
                                style={{
                                    background: "#FFD700",
                                    border: "2px dashed black",
                                    color: "#000",
                                    fontSize: "18px",
                                    margin: "20px 0",
                                    padding: "16px 32px",
                                    height: "60px",
                                    width: "200px",
                                    fontWeight: "bold"
                                }}
                            >
                                Xem thêm
                            </Button>
                        </Col>

                        <Col xs={24} md={12} style={{ display: "flex", justifyContent: "center" }}>
                            <img
                                src="/Can.jpg"
                                alt="Giới thiệu"
                                style={{ width: "100%", maxWidth: "600px", height: "auto" }}
                            />
                        </Col>

                    </Row>
                </div>


            </Content>

            <FooterComponent />

        </Layout>
    );
};

export default HomePage;
