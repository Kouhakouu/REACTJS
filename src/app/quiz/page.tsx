"use client";

import React, { useMemo, useState } from "react";

type Option = { id: string; text: string };
type Question = {
    id: string;
    text: string;
    options: Option[];
};

export default function Page() {
    // ====== CONFIG ======
    const API_BASE = process.env.NEXT_PUBLIC_BACKEND_PORT || "";

    // ====== QUESTIONS (bạn sửa nội dung ở đây) ======
    const questions: Question[] = useMemo(
        () => [
            {
                id: "q1",
                text: "Khi đến trung tâm, học viên cần làm gì đầu tiên?",
                options: [
                    { id: "a", text: "Đi thẳng vào lớp" },
                    { id: "b", text: "Điểm danh/Check-in theo hướng dẫn" },
                    { id: "c", text: "Ngồi chờ ở hành lang" },
                    { id: "d", text: "Tự chọn phòng học bất kỳ" },
                ],
            },
            {
                id: "q2",
                text: "Vật dụng cá nhân nên được xử lý như thế nào?",
                options: [
                    { id: "a", text: "Để ở lối đi cho tiện" },
                    { id: "b", text: "Để gọn gàng, không gây cản trở" },
                    { id: "c", text: "Để trên bàn giáo viên" },
                    { id: "d", text: "Tùy ý" },
                ],
            },
            {
                id: "q3",
                text: "Nếu cần nghỉ/ra ngoài trong giờ, học viên nên làm gì?",
                options: [
                    { id: "a", text: "Tự ý ra ngoài" },
                    { id: "b", text: "Xin phép theo quy định của lớp/trung tâm" },
                    { id: "c", text: "Nhờ bạn báo hộ sau" },
                    { id: "d", text: "Rời đi luôn" },
                ],
            },
        ],
        []
    );

    // ====== STATE ======
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [fullName, setFullName] = useState("");
    const [contact, setContact] = useState("");

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [status, setStatus] = useState<null | { type: "ok" | "error"; message: string }>(null);

    const allAnswered = questions.every((q) => Boolean(answers[q.id]));

    // ====== HANDLERS ======
    const onSelect = (questionId: string, optionId: string) => {
        setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
        setStatus(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus(null);

        if (!allAnswered) {
            setStatus({ type: "error", message: "Bạn cần trả lời tất cả câu hỏi trước khi nộp." });
            return;
        }

        if (!API_BASE) {
            setStatus({
                type: "error",
                message: "Thiếu NEXT_PUBLIC_BACKEND_URL trong .env.local (Next.js).",
            });
            return;
        }

        const payload = {
            fullName: fullName.trim() || null,
            contact: contact.trim() || null,
            submittedAt: new Date().toISOString(),
            answers: questions.map((q) => {
                const chosenOptionId = answers[q.id];
                const chosen = q.options.find((o) => o.id === chosenOptionId);

                return {
                    questionId: q.id,
                    questionText: q.text,
                    chosenOptionId,
                    chosenOptionText: chosen?.text ?? "",
                };
            }),
        };

        setIsSubmitting(true);
        try {
            const res = await fetch(`${API_BASE}/manager/quiz/submit`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const data = await res.json().catch(() => null);
                throw new Error(data?.message || data?.error || "Submit thất bại.");
            }

            // Không hiển thị kết quả đúng/sai — chỉ báo ghi nhận
            setStatus({ type: "ok", message: "Đã ghi nhận và gửi đáp án. Cảm ơn bạn!" });

            // Tuỳ chọn: reset form sau khi submit
            // setAnswers({});
            // setFullName("");
            // setContact("");
        } catch (err: any) {
            setStatus({ type: "error", message: err?.message || "Có lỗi xảy ra. Vui lòng thử lại." });
        } finally {
            setIsSubmitting(false);
        }
    };

    // ====== UI ======
    return (
        <div style={{ minHeight: "100vh", background: "#f6f7fb" }}>
            <div style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
                {/* Header */}
                <div
                    style={{
                        background: "white",
                        border: "1px solid #eee",
                        borderRadius: 18,
                        padding: 18,
                        boxShadow: "0 8px 24px rgba(0,0,0,0.04)",
                    }}
                >
                    <h1 style={{ fontSize: 26, fontWeight: 800, margin: 0 }}>Quiz Nội Quy Trung Tâm</h1>
                    <p style={{ marginTop: 8, marginBottom: 0, opacity: 0.8 }}>
                        Chọn đáp án và bấm <b>Nộp đáp án</b>. Hệ thống chỉ ghi nhận và gửi về email quản lý,{" "}
                        <b>không hiển thị kết quả đúng/sai</b>.
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} style={{ marginTop: 16, display: "grid", gap: 14 }}>
                    {/* Optional info */}
                    <div
                        style={{
                            background: "white",
                            border: "1px solid #eee",
                            borderRadius: 18,
                            padding: 16,
                            display: "grid",
                            gap: 12,
                        }}
                    >
                        <div style={{ display: "grid", gap: 6 }}>
                            <label style={{ fontWeight: 700 }}>Họ và tên (tuỳ chọn)</label>
                            <input
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                placeholder="Nguyễn Văn A"
                                style={{
                                    padding: 12,
                                    borderRadius: 12,
                                    border: "1px solid #ddd",
                                    outline: "none",
                                }}
                            />
                        </div>

                        <div style={{ display: "grid", gap: 6 }}>
                            <label style={{ fontWeight: 700 }}>Liên hệ (tuỳ chọn)</label>
                            <input
                                value={contact}
                                onChange={(e) => setContact(e.target.value)}
                                placeholder="Email/SĐT"
                                style={{
                                    padding: 12,
                                    borderRadius: 12,
                                    border: "1px solid #ddd",
                                    outline: "none",
                                }}
                            />
                        </div>
                    </div>

                    {/* Questions */}
                    {questions.map((q, idx) => {
                        const picked = answers[q.id];
                        return (
                            <div
                                key={q.id}
                                style={{
                                    background: "white",
                                    border: "1px solid #eee",
                                    borderRadius: 18,
                                    padding: 16,
                                }}
                            >
                                <div style={{ fontWeight: 800, marginBottom: 10 }}>
                                    Câu {idx + 1}: {q.text}
                                </div>

                                <div style={{ display: "grid", gap: 10 }}>
                                    {q.options.map((opt) => {
                                        const checked = picked === opt.id;
                                        return (
                                            <label
                                                key={opt.id}
                                                style={{
                                                    display: "flex",
                                                    gap: 10,
                                                    alignItems: "center",
                                                    padding: 12,
                                                    borderRadius: 14,
                                                    border: `1px solid ${checked ? "#b7b7b7" : "#ededed"}`,
                                                    background: checked ? "#fafafa" : "white",
                                                    cursor: "pointer",
                                                }}
                                            >
                                                <input
                                                    type="radio"
                                                    name={q.id}
                                                    checked={checked}
                                                    onChange={() => onSelect(q.id, opt.id)}
                                                />
                                                <span>{opt.text}</span>
                                            </label>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}

                    {/* Status */}
                    {status && (
                        <div
                            style={{
                                borderRadius: 16,
                                padding: 14,
                                border: "1px solid " + (status.type === "ok" ? "#bfe7c9" : "#f1b7b7"),
                                background: status.type === "ok" ? "#eefbf1" : "#fff1f1",
                                fontWeight: 600,
                            }}
                        >
                            {status.message}
                        </div>
                    )}

                    {/* Submit */}
                    <div
                        style={{
                            background: "white",
                            border: "1px solid #eee",
                            borderRadius: 18,
                            padding: 16,
                            display: "flex",
                            gap: 12,
                            alignItems: "center",
                            justifyContent: "space-between",
                        }}
                    >
                        <div style={{ fontSize: 14, opacity: 0.75 }}>
                            {allAnswered ? "Bạn đã trả lời đủ. Có thể nộp." : `Bạn cần trả lời đủ ${questions.length} câu.`}
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            style={{
                                padding: "12px 16px",
                                borderRadius: 14,
                                border: "1px solid #ddd",
                                fontWeight: 800,
                                cursor: isSubmitting ? "not-allowed" : "pointer",
                                opacity: isSubmitting ? 0.7 : 1,
                                background: "#ffffff",
                            }}
                        >
                            {isSubmitting ? "Đang nộp..." : "Nộp đáp án"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}