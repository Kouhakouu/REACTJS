'use client';
import { useContext, useEffect, useState, Suspense } from 'react';
import { Form, Input, Button, Card, Tabs, message, DatePicker, Spin } from 'antd';
import { useSearchParams } from 'next/navigation';
import { AuthContext } from '@/library/authContext';
import dayjs from 'dayjs';

const ProfileContent = () => {
    const { user, token, updateUser } = useContext(AuthContext);
    const [profileForm] = Form.useForm();
    const [passwordForm] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [pwLoading, setPwLoading] = useState(false);
    const [hasMounted, setHasMounted] = useState(false);
    const searchParams = useSearchParams();
    const defaultTab = searchParams.get('tab') === 'password' ? 'password' : 'info';

    useEffect(() => { setHasMounted(true); }, []);

    useEffect(() => {
        if (!hasMounted || !token) return;
        const fetchProfile = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_PORT}/profile`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (!res.ok) throw new Error();
                const data = await res.json();
                profileForm.setFieldsValue({
                    ...data,
                    DOB: data.DOB ? dayjs(data.DOB) : null,
                });
            } catch {
                message.error('Không thể tải thông tin hồ sơ.');
            }
        };
        fetchProfile();
    }, [hasMounted, token, profileForm]);

    const handleSaveProfile = async (values: Record<string, unknown>) => {
        setLoading(true);
        try {
            const body = { ...values };
            if (body.DOB) body.DOB = (body.DOB as ReturnType<typeof dayjs>).format('YYYY-MM-DD');
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_PORT}/profile`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify(body),
            });
            if (!res.ok) throw new Error();
            message.success('Cập nhật thành công!');
            if (values.fullName && user) {
                updateUser({ ...user, fullName: values.fullName as string });
            }
        } catch {
            message.error('Cập nhật thất bại.');
        } finally {
            setLoading(false);
        }
    };

    const handleChangePassword = async (values: { oldPassword: string; newPassword: string; confirmPassword: string }) => {
        if (values.newPassword !== values.confirmPassword) {
            message.error('Mật khẩu mới không khớp!');
            return;
        }
        setPwLoading(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_PORT}/profile/password`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ oldPassword: values.oldPassword, newPassword: values.newPassword }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            message.success('Đổi mật khẩu thành công!');
            passwordForm.resetFields();
        } catch (e: unknown) {
            message.error(e instanceof Error ? e.message : 'Đổi mật khẩu thất bại.');
        } finally {
            setPwLoading(false);
        }
    };

    const role = user?.role;

    const profileFields = () => {
        const emailField = (
            <Form.Item label="Email" name="email">
                <Input disabled />
            </Form.Item>
        );
        const nameField = (
            <Form.Item label="Họ và tên" name="fullName" rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}>
                <Input />
            </Form.Item>
        );
        const phoneField = (
            <Form.Item label="Số điện thoại" name="phoneNumber">
                <Input />
            </Form.Item>
        );

        if (role === 'ADMIN' || role === 'TEACHER' || role === 'ASSISTANT') {
            return <>{emailField}{nameField}{phoneField}</>;
        }
        if (role === 'MANAGER') {
            return (
                <>
                    {emailField}
                    {nameField}
                    {phoneField}
                    <Form.Item label="Khối quản lý" name="gradeLevel">
                        <Input disabled />
                    </Form.Item>
                </>
            );
        }
        if (role === 'STUDENT') {
            return (
                <>
                    {emailField}
                    {nameField}
                    <Form.Item label="Ngày sinh" name="DOB">
                        <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item label="Trường học" name="school">
                        <Input />
                    </Form.Item>
                    <Form.Item label="SĐT phụ huynh" name="parentPhoneNumber">
                        <Input />
                    </Form.Item>
                    <Form.Item label="Email phụ huynh" name="parentEmail">
                        <Input type="email" />
                    </Form.Item>
                </>
            );
        }
        return null;
    };

    if (!hasMounted) return null;

    const tabItems = [
        {
            key: 'info',
            label: 'Thông tin cá nhân',
            children: (
                <Card>
                    <Form form={profileForm} layout="vertical" onFinish={handleSaveProfile}>
                        {profileFields()}
                        <Form.Item style={{ marginTop: 8 }}>
                            <Button type="primary" htmlType="submit" loading={loading}>
                                Lưu thay đổi
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>
            ),
        },
        {
            key: 'password',
            label: 'Đổi mật khẩu',
            children: (
                <Card>
                    <Form form={passwordForm} layout="vertical" onFinish={handleChangePassword}>
                        <Form.Item label="Mật khẩu cũ" name="oldPassword" rules={[{ required: true, message: 'Vui lòng nhập mật khẩu cũ' }]}>
                            <Input.Password />
                        </Form.Item>
                        <Form.Item label="Mật khẩu mới" name="newPassword" rules={[{ required: true, min: 6, message: 'Mật khẩu mới phải có ít nhất 6 ký tự' }]}>
                            <Input.Password />
                        </Form.Item>
                        <Form.Item label="Xác nhận mật khẩu mới" name="confirmPassword" rules={[{ required: true, message: 'Vui lòng xác nhận mật khẩu' }]}>
                            <Input.Password />
                        </Form.Item>
                        <Form.Item style={{ marginTop: 8 }}>
                            <Button type="primary" htmlType="submit" loading={pwLoading}>
                                Đổi mật khẩu
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>
            ),
        },
    ];

    return (
        <div style={{ maxWidth: 560, margin: '0 auto' }}>
            <h2 style={{ marginBottom: 24 }}>Hồ sơ của tôi</h2>
            <Tabs defaultActiveKey={defaultTab} items={tabItems} />
        </div>
    );
};

const ProfilePage = () => (
    <Suspense fallback={<Spin style={{ display: 'block', marginTop: 80 }} />}>
        <ProfileContent />
    </Suspense>
);

export default ProfilePage;
