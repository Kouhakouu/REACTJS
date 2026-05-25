"use client";

import React from 'react';
import {
    Button, Col, DatePicker, Divider, Form, Input,
    notification, Row, Typography
} from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import dayjs from 'dayjs';

const { Text } = Typography;

interface RegisterFormValues {
    email: string;
    password: string;
    confirmPassword: string;
    fullName: string;
    DOB: ReturnType<typeof dayjs>;
    school?: string;
    parentPhoneNumber?: string;
    parentEmail?: string;
}

const Register = () => {
    const [form] = Form.useForm<RegisterFormValues>();
    const router = useRouter();

    const onFinish = async (values: RegisterFormValues) => {
        try {
            const payload = {
                email: values.email,
                password: values.password,
                fullName: values.fullName,
                DOB: values.DOB.format('YYYY-MM-DD'),
                school: values.school || null,
                parentPhoneNumber: values.parentPhoneNumber || null,
                parentEmail: values.parentEmail || null,
            };

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_PORT}/auth/register/student`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                }
            );
            const data = await response.json();

            if (response.ok) {
                notification.success({
                    message: 'Đăng ký thành công',
                    description: `Chào mừng ${data.studentInfo.fullName}! Bạn có thể đăng nhập ngay bây giờ.`,
                });
                router.push('/auth/login');
            } else {
                notification.error({
                    message: 'Đăng ký thất bại',
                    description: data.message || 'Đã có lỗi xảy ra, vui lòng thử lại.',
                });
            }
        } catch {
            notification.error({
                message: 'Lỗi kết nối',
                description: 'Không thể kết nối đến server. Vui lòng thử lại sau.',
            });
        }
    };

    return (
        <Row justify="center" style={{ marginTop: 30, marginBottom: 30 }}>
            <Col xs={24} md={16} lg={10}>
                <fieldset style={{ padding: 20, margin: 5, border: '1px solid #ccc', borderRadius: 5 }}>
                    <legend>Đăng Ký Tài Khoản Học Sinh</legend>

                    <Form
                        form={form}
                        onFinish={onFinish}
                        autoComplete="off"
                        layout="vertical"
                    >
                        {/* ── Thông tin đăng nhập ── */}
                        <Form.Item
                            label="Email"
                            name="email"
                            rules={[
                                { required: true, message: 'Vui lòng nhập email.' },
                                { type: 'email', message: 'Email không hợp lệ.' },
                            ]}
                        >
                            <Input placeholder="example@email.com" />
                        </Form.Item>

                        <Form.Item
                            label="Mật khẩu"
                            name="password"
                            rules={[
                                { required: true, message: 'Vui lòng nhập mật khẩu.' },
                                { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự.' },
                            ]}
                        >
                            <Input.Password />
                        </Form.Item>

                        <Form.Item
                            label="Xác nhận mật khẩu"
                            name="confirmPassword"
                            dependencies={['password']}
                            rules={[
                                { required: true, message: 'Vui lòng xác nhận mật khẩu.' },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('password') === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('Mật khẩu xác nhận không khớp.'));
                                    },
                                }),
                            ]}
                        >
                            <Input.Password />
                        </Form.Item>

                        <Divider orientation="left" style={{ fontSize: 13, color: '#888' }}>
                            Thông tin học sinh
                        </Divider>

                        {/* ── Thông tin học sinh ── */}
                        <Form.Item
                            label="Họ và tên"
                            name="fullName"
                            rules={[{ required: true, message: 'Vui lòng nhập họ và tên.' }]}
                        >
                            <Input placeholder="Nguyễn Văn A" />
                        </Form.Item>

                        <Form.Item
                            label="Ngày sinh"
                            name="DOB"
                            rules={[{ required: true, message: 'Vui lòng chọn ngày sinh.' }]}
                        >
                            <DatePicker
                                format="DD/MM/YYYY"
                                style={{ width: '100%' }}
                                placeholder="Chọn ngày sinh"
                                disabledDate={d => d && d.isAfter(dayjs())}
                            />
                        </Form.Item>

                        <Form.Item label="Trường học" name="school">
                            <Input placeholder="Không bắt buộc" />
                        </Form.Item>

                        <Divider orientation="left" style={{ fontSize: 13, color: '#888' }}>
                            Thông tin phụ huynh (không bắt buộc)
                        </Divider>

                        <Form.Item label="Số điện thoại phụ huynh" name="parentPhoneNumber">
                            <Input placeholder="0901234567" />
                        </Form.Item>

                        <Form.Item
                            label="Email phụ huynh"
                            name="parentEmail"
                            rules={[{ type: 'email', message: 'Email không hợp lệ.' }]}
                        >
                            <Input placeholder="parent@email.com" />
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" block>
                                Đăng ký
                            </Button>
                        </Form.Item>
                    </Form>

                    <Text type="secondary" style={{ fontSize: 12 }}>
                        Nếu bạn đã được trung tâm nhập hồ sơ sẵn, hãy điền đúng <b>họ tên</b> và <b>ngày sinh</b> để hệ thống tự liên kết.
                    </Text>

                    <br /><br />
                    <Link href="/homepage"><ArrowLeftOutlined /> Quay lại trang chủ</Link>
                    <Divider />
                    <div style={{ textAlign: 'center' }}>
                        Đã có tài khoản? <Link href="/auth/login">Đăng nhập</Link>
                    </div>
                </fieldset>
            </Col>
        </Row>
    );
};

export default Register;
