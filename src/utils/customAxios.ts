import axios from 'axios';
import Cookies from 'js-cookie';

const http = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_PORT,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Tự gắn Bearer token (đăng nhập lưu trong cookie "token") cho mọi request
http.interceptors.request.use((config) => {
    const token = Cookies.get('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default http;
