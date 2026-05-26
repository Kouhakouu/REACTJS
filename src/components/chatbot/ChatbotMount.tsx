'use client';
import React from 'react';
import { usePathname } from 'next/navigation';
import Chatbot from './Chatbot';

const ChatbotMount: React.FC = () => {
    const pathname = usePathname();

    if (pathname !== '/homepage') {
        return null;
    }

    // Nếu đúng là /homepage thì render Chatbot
    return <Chatbot />;
};

export default ChatbotMount;