import Cookies from 'js-cookie';

// Header Authorization cho các chỗ gọi fetch() trực tiếp (không qua customAxios).
// Token được lưu vào cookie "token" lúc đăng nhập (xem library/authContext.tsx).
export function authHeaders(extra: Record<string, string> = {}): Record<string, string> {
    const token = Cookies.get('token');
    return {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...extra,
    };
}
