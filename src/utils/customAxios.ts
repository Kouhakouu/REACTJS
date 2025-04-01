import axios from 'axios';

const http = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_PORT,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default http;