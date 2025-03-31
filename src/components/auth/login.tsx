"use client";
import { Button, Col, Divider, Form, Input, Row, notification } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useContext } from "react";
import { AuthContext } from "@/library/authContext";

const Login = () => {
    const { login } = useContext(AuthContext);
    const [form] = Form.useForm();

    const onFinish = async (values: any) => {
        try {
            const response = await fetch(`${process.env.BACKEND_PORT}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
            });
            const data = await response.json();

            if (response.ok && data.token) {
                login(data);
            } else {
                notification.error({
                    message: "Đăng nhập thất bại",
                    description: data.message || "Email hoặc mật khẩu không đúng.",
                });
            }
        } catch (error) {
            console.error("Lỗi kết nối với server");
            notification.error({
                message: "Lỗi kết nối",
                description: "Không thể kết nối đến server. Vui lòng thử lại sau.",
            });
        }
    };

    return (
        <Row justify={"center"} style={{ marginTop: "30px" }}>
            <Col xs={24} md={16} lg={8}>
                <fieldset
                    style={{
                        padding: "15px",
                        margin: "5px",
                        border: "1px solid #ccc",
                        borderRadius: "5px",
                    }}
                >
                    <legend>Đăng Nhập</legend>
                    <Form
                        form={form} // Gắn form vào
                        name="basic"
                        onFinish={onFinish}
                        autoComplete="off"
                        layout="vertical"
                    >
                        <Form.Item
                            label="Email"
                            name="email"
                            rules={[{ required: true, message: "Please input your email!" }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="Password"
                            name="password"
                            rules={[{ required: true, message: "Please input your password!" }]}
                        >
                            <Input.Password />
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                                Login
                            </Button>
                        </Form.Item>
                    </Form>
                    <Link href={"/homepage"}>
                        <ArrowLeftOutlined /> Quay lại trang chủ
                    </Link>
                    <Divider />
                    <div style={{ textAlign: "center" }}>
                        Chưa có tài khoản? <Link href={"/auth/register"}>Đăng ký tại đây</Link>
                    </div>
                </fieldset>
            </Col>
        </Row>
    );
};

export default Login;
