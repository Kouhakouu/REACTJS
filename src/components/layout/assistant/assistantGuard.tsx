'use client';

import { useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Spin } from 'antd';
import { AuthContext } from '@/library/authContext';

// Chặn truy cập khu vực trợ giảng nếu chưa đăng nhập hoặc tài khoản chưa kích hoạt (status !== 1)
const AssistantGuard = ({ children }: { children: React.ReactNode }) => {
    const { user, token, initialized } = useContext(AuthContext);
    const router = useRouter();

    useEffect(() => {
        if (!initialized) return; // đợi đọc xong localStorage

        if (!token || !user) {
            router.replace('/auth/login');
            return;
        }
        if (user.role !== 'ASSISTANT') {
            router.replace('/auth/login');
            return;
        }
        if (user.status !== 1) {
            // Chưa kích hoạt -> quay về trang làm test
            router.replace('/quiz');
        }
    }, [initialized, token, user, router]);

    // Trong lúc chờ xác định / đang điều hướng thì hiển thị loading
    if (!initialized || !token || !user || user.role !== 'ASSISTANT' || user.status !== 1) {
        return <Spin size="large" style={{ display: 'block', marginTop: 80 }} />;
    }

    return <>{children}</>;
};

export default AssistantGuard;
