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
                text: "Trong buổi học bình thường, trợ giảng cần đến trước giờ học bao lâu?",
                options: [
                    { id: "a", text: "5 phút" },
                    { id: "b", text: "10 phút" },
                    { id: "c", text: "15 phút" },
                    { id: "d", text: "30 phút" },
                ],
                correctOptionId: "c",
            },
            {
                id: "q2",
                text: "Trong buổi kiểm tra định kỳ, trợ giảng cần đến trước giờ bao lâu?",
                options: [
                    { id: "a", text: "10 phút" },
                    { id: "b", text: "15 phút" },
                    { id: "c", text: "20 phút" },
                    { id: "d", text: "30 phút" },
                ],
                correctOptionId: "d",
            },
            {
                id: "q3",
                text: "Yêu cầu về trang phục khi đi trợ giảng/đi dạy bổ trợ là gì?",
                options: [
                    { id: "a", text: "Mặc đồ tự do nhưng lịch sự" },
                    { id: "b", text: "Mặc áo đồng phục CLB" },
                    { id: "c", text: "Chỉ cần đeo thẻ" },
                    { id: "d", text: "Không có quy định" },
                ],
                correctOptionId: "b",
            },
            {
                id: "q4",
                text: "Lưu ý nào sau đây về Zalo là đúng?",
                options: [
                    { id: "a", text: "Được để chế độ chặn tin nhắn người lạ" },
                    { id: "b", text: "Chỉ mở tin nhắn vào cuối tuần" },
                    { id: "c", text: "Không được để Zalo ở chế độ chặn tin nhắn từ người lạ" },
                    { id: "d", text: "Chỉ cần mở với phụ huynh" },
                ],
                correctOptionId: "c",
            },
            {
                id: "q5",
                text: "Trước giờ học 15 phút, trợ giảng cần làm việc nào sau đây?",
                options: [
                    { id: "a", text: "Chỉ cần lên lớp ngồi chờ giáo viên" },
                    { id: "b", text: "Chấm công, lấy phiếu điểm danh và chuẩn bị dụng cụ dạy học" },
                    { id: "c", text: "Gọi điện cho phụ huynh từng học sinh" },
                    { id: "d", text: "Về sớm để chuẩn bị tài liệu ở nhà" },
                ],
                correctOptionId: "b",
            },
            {
                id: "q6",
                text: "Trong bao lâu từ khi giờ học bắt đầu, trợ giảng phải chụp phiếu điểm danh gửi quản lý khối?",
                options: [
                    { id: "a", text: "5 phút" },
                    { id: "b", text: "10 phút" },
                    { id: "c", text: "15 phút" },
                    { id: "d", text: "30 phút" },
                ],
                correctOptionId: "c",
            },
            {
                id: "q7",
                text: "Nếu học sinh đến muộn sau 15 phút, trợ giảng cần làm gì?",
                options: [
                    { id: "a", text: "Không cần xử lý vì đã quá muộn" },
                    { id: "b", text: "Nhắn bổ sung cho quản lý khối và thu ngay bài tập về nhà của học sinh" },
                    { id: "c", text: "Chỉ nhắc nhở học sinh lần sau đi sớm hơn" },
                    { id: "d", text: "Đợi cuối buổi mới cập nhật điểm danh" },
                ],
                correctOptionId: "b",
            },
            {
                id: "q8",
                text: "Sau khi chấm xong bài tập về nhà, trợ giảng nên làm gì?",
                options: [
                    { id: "a", text: "Ngồi tại bàn giáo viên để nghỉ" },
                    { id: "b", text: "Ra khỏi lớp kiểm tra văn phòng" },
                    { id: "c", text: "Đi xung quanh lớp để hỗ trợ học sinh" },
                    { id: "d", text: "Chụp ảnh lớp ngay lập tức" },
                ],
                correctOptionId: "c",
            },
            {
                id: "q9",
                text: "Gần hết giờ, với lớp không sử dụng máy chiếu, trợ giảng cần làm gì?",
                options: [
                    { id: "a", text: "Chụp lại phiếu bài và vở ghi để gửi nhóm lớp" },
                    { id: "b", text: "Chỉ chụp bảng" },
                    { id: "c", text: "Chỉ gửi tin nhắn 'lớp học tốt'" },
                    { id: "d", text: "Không cần gửi gì" },
                ],
                correctOptionId: "a",
            },
            {
                id: "q10",
                text: "Khi gửi vở ghi của học sinh lên nhóm lớp, yêu cầu đúng là gì?",
                options: [
                    { id: "a", text: "Gửi ảnh rời từng trang là được" },
                    { id: "b", text: "Gửi file Word" },
                    { id: "c", text: "Gửi thành 1 file PDF sau khi scan" },
                    { id: "d", text: "Gửi file Excel" },
                ],
                correctOptionId: "c",
            },
            {
                id: "q11",
                text: "Ngay sau giờ học, trợ giảng cần làm gì với đồ học sinh để quên?",
                options: [
                    { id: "a", text: "Mang về nhà giữ hộ" },
                    { id: "b", text: "Chụp lại, gửi lên nhóm lớp và để đúng vị trí trong tủ để đồ" },
                    { id: "c", text: "Để nguyên tại lớp học" },
                    { id: "d", text: "Giao cho học sinh gần nhất giữ hộ" },
                ],
                correctOptionId: "b",
            },
            {
                id: "q12",
                text: "Lưu ý nào sau đây về điều hòa trước khi ra về là đúng?",
                options: [
                    { id: "a", text: "Có thể để chế độ hẹn giờ" },
                    { id: "b", text: "Chỉ cần tắt quạt, không cần kiểm tra điều hòa" },
                    { id: "c", text: "Kiểm tra trạng thái điều hòa, không để chế độ hẹn giờ" },
                    { id: "d", text: "Để nguyên vì bảo vệ sẽ xử lý" },
                ],
                correctOptionId: "c",
            },
            {
                id: "q13",
                text: "Trong vòng bao lâu sau buổi học, trợ giảng phải hoàn thiện Google Sheet của lớp?",
                options: [
                    { id: "a", text: "Trong vòng 12 giờ" },
                    { id: "b", text: "Trong vòng 1 ngày" },
                    { id: "c", text: "Trong vòng 2 ngày" },
                    { id: "d", text: "Trong vòng 1 tuần" },
                ],
                correctOptionId: "b",
            },
            {
                id: "q14",
                text: "Trong vòng bao lâu sau buổi học, trợ giảng cần gửi tài liệu buổi học lên Drive và Zalo nhóm lớp?",
                options: [
                    { id: "a", text: "Trong vòng 1 ngày" },
                    { id: "b", text: "Trong vòng 2 ngày" },
                    { id: "c", text: "Trong vòng 3 ngày" },
                    { id: "d", text: "Trước buổi học tiếp theo là được" },
                ],
                correctOptionId: "b",
            },
            {
                id: "q15",
                text: "Một ngày trước buổi học mới, trợ giảng cần hoàn thiện việc nào sau đây?",
                options: [
                    { id: "a", text: "Chỉ cần nhắc học sinh làm bài tập" },
                    { id: "b", text: "Hoàn thiện đáp án bài tập về nhà theo template CMATH, ghi họ tên người soạn và gửi giáo viên kiểm tra" },
                    { id: "c", text: "Chỉ gửi file cho quản lý khối, không cần giáo viên" },
                    { id: "d", text: "Không cần làm gì nếu lớp đông" },
                ],
                correctOptionId: "b",
            },
            {
                id: "q16",
                text: "Thông thường, cuộc họp trợ giảng định kì diễn ra khi nào?",
                options: [
                    { id: "a", text: "Ngày đầu tiên hàng tháng" },
                    { id: "b", text: "Ngày cuối cùng hàng tháng" },
                    { id: "c", text: "Thứ bảy đầu tiên hàng tháng" },
                    { id: "d", text: "Chủ nhật đầu tiên hàng tháng" },
                ],
                correctOptionId: "b",
            },
            {
                id: "q17",
                text: "Mức phạt với trợ giảng nghỉ họp không phép ở lần thứ 3 trong cùng 1 năm là bao nhiêu",
                options: [
                    { id: "a", text: "50.000 VNĐ" },
                    { id: "b", text: "100.000 VNĐ" },
                    { id: "c", text: "150.000 VNĐ" },
                    { id: "d", text: "200.000 VNĐ" },
                ],
                correctOptionId: "b",
            },
            {
                id: "q18",
                text: "Trước khi gửi đáp án lên nhóm lớp, trợ giảng cần đảm bảo điều gì?",
                options: [
                    { id: "a", text: "Đáp án đã được giáo viên check ok" },
                    { id: "b", text: "Đáp án đã được tất cả trợ giảng trong lớp ok" },
                    { id: "c", text: "Đáp án đúng theo template và watermark của câu lạc bộ" },
                    { id: "d", text: "Đáp án đúng theo phong cách mình thích" },
                ],
                correctOptionId: "b",
            },
            {
                id: "q19",
                text: "Tình huống: Một học sinh đến muộn 20 phút và vừa vào lớp. Bạn nên làm gì?",
                options: [
                    { id: "a", text: "Không cần làm gì" },
                    { id: "b", text: "Nhắc học sinh ngồi vào chỗ và thu bài tập của học sinh, sau đó nhắn cho quản lí khối rằng học sinh đã đến" },
                    { id: "c", text: "Điểm danh vào trong file điểm danh và tiếp tục chấm bài tập về nhà" },
                    { id: "d", text: "Cho học sinh về vì đến quá muộn" },
                ],
                correctOptionId: "c",
            },
            {
                id: "q20",
                text: "Tình huống: Sau giờ học bạn phát hiện còn đồ học sinh bỏ quên trên bàn. Cách làm nào đúng quy định?",
                options: [
                    { id: "a", text: "Để nguyên tại lớp để hôm sau học sinh tự tìm" },
                    { id: "b", text: "Mang về nhà giữ giúp cho chắc" },
                    { id: "c", text: "Chụp lại, gửi lên nhóm lớp, rồi để đồ vào đúng vị trí tương ứng trong tủ để đồ" },
                    { id: "d", text: "Đưa cho bảo vệ mà không cần báo nhóm lớp" },
                ],
                correctOptionId: "c",
            },
            {
                id: "q21",
                text: "Tình huống: Bạn nhận đề kiểm tra của một lớp chuyên và đã 3 ngày nhưng chưa làm xong đáp án gửi giáo viên check. Bạn nên làm gì?",
                options: [
                    { id: "a", text: "Không làm gì cả vì lớp chuyên trợ giảng không cần làm đáp án" },
                    { id: "b", text: "Tiếp tục làm bình thường vì chỉ cần hoàn thiện trước ngày thi là được" },
                    { id: "c", text: "Bảo giáo viên tự làm đáp án" },
                    { id: "d", text: "Nhắn cho quản lí khối rằng em có việc bận nên chưa kịp hoàn thiện và cố gắng làm xong sớm nhất có thể" },
                ],
                correctOptionId: "b",
            },
            {
                id: "q22",
                text: "Tình huống: Trong buổi kiểm tra của lớp 8 cận chuyên, một học sinh xin dùng máy tính cầm tay. Bạn nên xử lý thế nào?",
                options: [
                    { id: "a", text: "Cho dùng vì lớp nào cũng được dùng máy tính" },
                    { id: "b", text: "Không cho dùng vì lớp cận chuyên không được dùng máy tính" },
                    { id: "c", text: "Chỉ cho dùng trong 5 phút" },
                    { id: "d", text: "Hỏi các bạn khác xem có đồng ý không" },
                ],
                correctOptionId: "b",
            },
            {
                id: "q23",
                text: "Tình huống: Khi chấm kiểm tra trên Google Sheet, bạn thấy có các ô màu vàng. Điều nào sau đây là đúng?",
                options: [
                    { id: "a", text: "Điền thằng vào các ô đó vì nó không khác gì các ô khác" },
                    { id: "b", text: "Không chỉnh sửa các ô màu vàng; chỉ điền điểm/nhận xét ở đúng ô được quy định" },
                    { id: "c", text: "Xóa sheet cũ và tạo sheet mới, chuyển tất cả các ô về màu trắng cho dễ chấm" },
                    { id: "d", text: "Điền điểm trực tiếp vào giấy bài trước rồi gửi quản lí danh sách điểm mới" },
                ],
                correctOptionId: "b",
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
        setAnswers((prev) => ({
            ...prev,
            [questionId]: optionId,
        }));
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
                            <label style={{ fontWeight: 700 }}>Họ và tên</label>
                            <input
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                placeholder="Nguyễn Bảo Châu"
                                required
                                style={{
                                    padding: 12,
                                    borderRadius: 12,
                                    border: "1px solid #ddd",
                                    outline: "none",
                                }}
                            />
                        </div>

                        <div style={{ display: "grid", gap: 6 }}>
                            <label style={{ fontWeight: 700 }}>Liên hệ</label>
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
                                                    type="checkbox"
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