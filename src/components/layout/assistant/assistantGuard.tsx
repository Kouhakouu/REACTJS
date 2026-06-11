'use client';

import { useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Spin } from 'antd';
import { AuthContext } from '@/library/authContext';

// Việc chặn khi CHƯA đăng nhập (không có token) đã do middleware.ts xử lý.
// Guard này chỉ lo phần middleware không làm được: chặn trợ giảng CHƯA kích hoạt
// (status !== 1) và đẩy về trang làm test /quiz.
const AssistantGuard = ({ children }: { children: React.ReactNode }) => {
    const { user, initialized } = useContext(AuthContext);
    const router = useRouter();

    const notActivated = user?.role === 'ASSISTANT' && user.status !== 1;

    useEffect(() => {
        if (!initialized) return; // đợi đọc xong localStorage
        if (notActivated) {
            router.replace('/quiz');
        }
    }, [initialized, notActivated, router]);

    // Trong lúc chờ hydrate hoặc đang điều hướng về /quiz thì hiển thị loading
    if (!initialized || notActivated) {
        return <Spin size="large" style={{ display: 'block', marginTop: 80 }} />;
    }

    return <>{children}</>;
};

export default AssistantGuard;
