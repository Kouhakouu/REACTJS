'use client';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Avatar, Button, Input, Tooltip } from 'antd';
import {
    MessageOutlined,
    CloseOutlined,
    SendOutlined,
    RobotOutlined,
    UserOutlined,
    DeleteOutlined
} from '@ant-design/icons';
import {
    FALLBACK_ANSWER,
    GREETING_ANSWER,
    SUGGESTED_QUESTIONS,
    matchAnswer
} from './chatbotKnowledge';

type ChatRole = 'bot' | 'user';

type ChatMessage = {
    id: string;
    role: ChatRole;
    text: string;
    timestamp: number;
};

const STORAGE_KEY = 'cmath_chatbot_history_v1';
const MAX_HISTORY = 50;

const formatTime = (ts: number): string => {
    try {
        return new Date(ts).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    } catch {
        return '';
    }
};

const createMessage = (role: ChatRole, text: string): ChatMessage => ({
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    role,
    text,
    timestamp: Date.now()
});

const loadHistory = (): ChatMessage[] => {
    if (typeof window === 'undefined') return [];
    try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed)) return [];
        return parsed.filter(
            (m: any): m is ChatMessage =>
                m && typeof m.text === 'string' && (m.role === 'bot' || m.role === 'user')
        );
    } catch {
        return [];
    }
};

const persistHistory = (messages: ChatMessage[]) => {
    if (typeof window === 'undefined') return;
    try {
        const trimmed = messages.slice(-MAX_HISTORY);
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
    } catch {
        // ignore quota errors
    }
};

const Chatbot: React.FC = () => {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [draft, setDraft] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [hasMounted, setHasMounted] = useState(false);

    const listRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<any>(null);

    useEffect(() => {
        setHasMounted(true);
        const stored = loadHistory();
        if (stored.length === 0) {
            setMessages([createMessage('bot', GREETING_ANSWER)]);
        } else {
            setMessages(stored);
        }
    }, []);

    useEffect(() => {
        if (hasMounted) persistHistory(messages);
    }, [messages, hasMounted]);

    useEffect(() => {
        if (open && listRef.current) {
            listRef.current.scrollTop = listRef.current.scrollHeight;
        }
    }, [messages, open, isTyping]);

    const showSuggestions = useMemo(() => {
        return messages.filter((m) => m.role === 'user').length === 0;
    }, [messages]);

    const respondTo = (text: string) => {
        const trimmed = text.trim();
        if (!trimmed) return;

        const userMsg = createMessage('user', trimmed);
        setMessages((prev) => [...prev, userMsg]);
        setDraft('');
        setIsTyping(true);

        const { entry, isFallback } = matchAnswer(trimmed);
        const answer = isFallback ? FALLBACK_ANSWER : entry.answer;

        window.setTimeout(() => {
            setMessages((prev) => [...prev, createMessage('bot', answer)]);
            setIsTyping(false);
        }, 450);
    };

    const handleSend = () => {
        if (!draft.trim()) return;
        respondTo(draft);
    };

    const handleClear = () => {
        const fresh = [createMessage('bot', GREETING_ANSWER)];
        setMessages(fresh);
        persistHistory(fresh);
    };

    const toggleOpen = () => {
        setOpen((v) => {
            const next = !v;
            if (next) {
                window.setTimeout(() => inputRef.current?.focus?.(), 100);
            }
            return next;
        });
    };

    if (!hasMounted) return null;

    return (
        <>
            {open && (
                <div
                    style={{
                        position: 'fixed',
                        bottom: 96,
                        right: 24,
                        width: 360,
                        maxWidth: 'calc(100vw - 32px)',
                        height: 520,
                        maxHeight: 'calc(100vh - 120px)',
                        background: '#fff',
                        borderRadius: 16,
                        boxShadow: '0 20px 50px rgba(15, 23, 42, 0.25)',
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden',
                        zIndex: 1100,
                        border: '1px solid #e5e7eb'
                    }}
                >
                    <div
                        style={{
                            background: 'linear-gradient(135deg, #1677ff 0%, #2a95db 100%)',
                            color: '#fff',
                            padding: '14px 16px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <Avatar
                                size={36}
                                style={{ background: 'rgba(255,255,255,0.2)' }}
                                icon={<RobotOutlined />}
                            />
                            <div style={{ lineHeight: 1.2 }}>
                                <div style={{ fontWeight: 600, fontSize: 15 }}>Trợ lý CMATH</div>
                                <div style={{ fontSize: 12, opacity: 0.85 }}>Hỗ trợ thông tin câu lạc bộ</div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: 4 }}>
                            <Tooltip title="Xóa hội thoại">
                                <Button
                                    type="text"
                                    size="small"
                                    icon={<DeleteOutlined />}
                                    onClick={handleClear}
                                    style={{ color: '#fff' }}
                                />
                            </Tooltip>
                            <Tooltip title="Đóng">
                                <Button
                                    type="text"
                                    size="small"
                                    icon={<CloseOutlined />}
                                    onClick={() => setOpen(false)}
                                    style={{ color: '#fff' }}
                                />
                            </Tooltip>
                        </div>
                    </div>

                    <div
                        ref={listRef}
                        style={{
                            flex: 1,
                            overflowY: 'auto',
                            padding: '14px 14px 8px',
                            background: '#f8fafc'
                        }}
                    >
                        {messages.map((m) => (
                            <div
                                key={m.id}
                                style={{
                                    display: 'flex',
                                    flexDirection: m.role === 'user' ? 'row-reverse' : 'row',
                                    gap: 8,
                                    marginBottom: 12,
                                    alignItems: 'flex-end'
                                }}
                            >
                                <Avatar
                                    size={28}
                                    style={{
                                        background: m.role === 'user' ? '#3bb25e' : '#1677ff',
                                        flexShrink: 0
                                    }}
                                    icon={m.role === 'user' ? <UserOutlined /> : <RobotOutlined />}
                                />
                                <div
                                    style={{
                                        maxWidth: '78%',
                                        background: m.role === 'user' ? '#dbeafe' : '#fff',
                                        color: '#0f172a',
                                        padding: '8px 12px',
                                        borderRadius: 12,
                                        border: m.role === 'user' ? 'none' : '1px solid #e5e7eb',
                                        whiteSpace: 'pre-wrap',
                                        wordBreak: 'break-word',
                                        fontSize: 14,
                                        lineHeight: 1.55
                                    }}
                                >
                                    {m.text}
                                    <div
                                        style={{
                                            fontSize: 10,
                                            color: '#94a3b8',
                                            marginTop: 4,
                                            textAlign: m.role === 'user' ? 'right' : 'left'
                                        }}
                                    >
                                        {formatTime(m.timestamp)}
                                    </div>
                                </div>
                            </div>
                        ))}

                        {isTyping && (
                            <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', marginBottom: 12 }}>
                                <Avatar size={28} style={{ background: '#1677ff' }} icon={<RobotOutlined />} />
                                <div
                                    style={{
                                        background: '#fff',
                                        border: '1px solid #e5e7eb',
                                        padding: '10px 14px',
                                        borderRadius: 12,
                                        fontSize: 14,
                                        color: '#64748b'
                                    }}
                                >
                                    <span className="cmath-chatbot-typing">Đang trả lời</span>
                                </div>
                            </div>
                        )}

                        {showSuggestions && (
                            <div
                                style={{
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    gap: 6,
                                    marginTop: 4,
                                    paddingTop: 4
                                }}
                            >
                                {SUGGESTED_QUESTIONS.map((q) => (
                                    <Button
                                        key={q}
                                        size="small"
                                        onClick={() => respondTo(q)}
                                        style={{
                                            borderRadius: 999,
                                            fontSize: 12,
                                            background: '#fff',
                                            borderColor: '#bfdbfe',
                                            color: '#1677ff'
                                        }}
                                    >
                                        {q}
                                    </Button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div
                        style={{
                            borderTop: '1px solid #e5e7eb',
                            padding: 10,
                            background: '#fff',
                            display: 'flex',
                            gap: 6,
                            alignItems: 'flex-end'
                        }}
                    >
                        <Input.TextArea
                            ref={inputRef}
                            value={draft}
                            onChange={(e) => setDraft(e.target.value)}
                            placeholder="Nhập câu hỏi của phụ huynh..."
                            autoSize={{ minRows: 1, maxRows: 3 }}
                            onPressEnter={(e) => {
                                if (!e.shiftKey) {
                                    e.preventDefault();
                                    handleSend();
                                }
                            }}
                            style={{ resize: 'none', flex: 1 }}
                        />
                        <Button
                            type="primary"
                            shape="circle"
                            icon={<SendOutlined />}
                            disabled={!draft.trim() || isTyping}
                            onClick={handleSend}
                        />
                    </div>
                </div>
            )}

            <Tooltip title={open ? 'Đóng trợ lý' : 'Hỏi trợ lý CMATH'} placement="left">
                <Button
                    type="primary"
                    shape="circle"
                    size="large"
                    icon={open ? <CloseOutlined /> : <MessageOutlined />}
                    onClick={toggleOpen}
                    style={{
                        position: 'fixed',
                        bottom: 24,
                        right: 24,
                        width: 56,
                        height: 56,
                        boxShadow: '0 8px 20px rgba(22, 119, 255, 0.35)',
                        zIndex: 1100,
                        background: 'linear-gradient(135deg, #1677ff 0%, #2a95db 100%)',
                        border: 'none'
                    }}
                />
            </Tooltip>

            <style
                dangerouslySetInnerHTML={{
                    __html: `
                .cmath-chatbot-typing::after {
                    content: '';
                    display: inline-block;
                    width: 16px;
                    text-align: left;
                    animation: cmath-chatbot-dots 1.2s steps(3, end) infinite;
                }
                @keyframes cmath-chatbot-dots {
                    0% { content: ''; }
                    33% { content: '.'; }
                    66% { content: '..'; }
                    100% { content: '...'; }
                }
                `
                }}
            />
        </>
    );
};

export default Chatbot;
