"use client";

import React, { useContext, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/library/authContext";

type Option = { id: string; text: string };
type Question = {
    id: string;
    text: string;
    options: Option[];
    correctOptionId: string;
};

export default function Page() {
    // ====== CONFIG ======
    const API_BASE = process.env.NEXT_PUBLIC_BACKEND_PORT || "";

    // ====== AUTH / ONBOARDING TRỢ GIẢNG ======
    const { user, token, updateUser } = useContext(AuthContext);
    const router = useRouter();
    // Trợ giảng đã đăng nhập nhưng chưa kích hoạt -> dùng /quiz để làm test + nhập mã
    const isOnboarding = user?.role === "ASSISTANT" && user?.status !== 1;

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
                text: "Nếu đến deadline nộp đáp án bài tập về nhà lên form mà trợ giảng chưa hoàn thiện đáp án hoặc giáo viên yêu cầu sửa đáp án thì trợ giảng nên làm gì?",
                options: [
                    { id: "a", text: "Copy lời giải trên mạng, lời giải AI cho xong trước deadline." },
                    { id: "b", text: "Nộp đại một bản đáp án nháp rồi sau đó làm lại đáp án cẩn thận gửi lên nhóm lớp." },
                    { id: "c", text: "Làm đáp án vắn tắt cho xong trước deadline để đủ chấm BTVN học sinh" },
                    { id: "d", text: "Làm lại đáp án cẩn thận gửi lên nhóm lớp và gửi lại bản sửa vào form nộp đáp án BTVN để nhóm chuyên môn đánh giá đáp án BTVN." },
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
                text: "Lưu ý nào sau đây về Zalo trợ giảng là đúng?",
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
                    { id: "b", text: "Vẫn điểm danh và thu bài tập về nhà của học sinh, ngoài ra cần nhắn bổ sung cho quản lý khối" },
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
                    { id: "b", text: "Chụp lại, gửi lên nhóm lớp và để đồ vào đúng vị trí trong tủ để đồ" },
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
                    { id: "b", text: "Dập cầu dao khi tan học" },
                    { id: "c", text: "Tắt toàn bộ điều hòa bằng điều khiển, không để chế độ hẹn giờ" },
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
                    { id: "b", text: "Hoàn thiện đáp án bài tập về nhà theo template CMATH, ghi họ tên người soạn và gửi lên link nộp đáp án" },
                    { id: "c", text: "Chỉ gửi file cho quản lý khối, không cần giáo viên" },
                    { id: "d", text: "Không cần làm gì nếu lớp đông" },
                ],
                correctOptionId: "b",
            },
            {
                id: "q16",
                text: "Theo quy trình bổ trợ, mỗi trợ giảng cần đăng ký tối thiểu bao nhiêu buổi bổ trợ mỗi tháng?",
                options: [
                    { id: "a", text: "1 buổi" },
                    { id: "b", text: "2 buổi" },
                    { id: "c", text: "3 buổi" },
                    { id: "d", text: "5 buổi" },
                ],
                correctOptionId: "c",
            },
            {
                id: "q17",
                text: "Mức phạt cho trợ giảng nghỉ họp không phép ở buổi thứ 3 trong cùng một năm là bao nhiêu?",
                options: [
                    { id: "a", text: "50.000 VNĐ" },
                    { id: "b", text: "100.000 VNĐ" },
                    { id: "c", text: "150.000 VNĐ" },
                    { id: "d", text: "200.000 VNĐ" },
                ],
                correctOptionId: "c",
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
                correctOptionId: "a",
            },
            {
                id: "q19",
                text: "Tình huống: Khi soạn đáp án bài tập về nhà, A và B phát hiện bài tập về nhà của hai lớp mình đang trợ giảng giống nhau hoàn toàn. A muốn nhờ B soạn toàn bộ đáp án rồi lấy nguyên để dùng cho lớp của mình, A nên làm gì?",
                options: [
                    { id: "a", text: "Nhờ B soạn toàn bộ rồi lấy nguyên đáp án đó gửi cho lớp mình, không cần làm lại" },
                    { id: "b", text: "Tham khảo đáp án của B, nhưng vẫn cần tự rà soát và hoàn thiện đáp án theo đúng template CMATH, thay tên người soạn là A, rồi gửi giáo viên check trước khi đăng lên nhóm lớp" },
                    { id: "c", text: "Báo quản lý khối là 2 lớp trùng bài nên chỉ cần 1 trong 2 trợ giảng làm đáp án là đủ" },
                    { id: "d", text: "Yêu cầu B gửi đáp án trực tiếp lên nhóm lớp của A luôn cho nhanh" },
                ],
                correctOptionId: "b",
            },
            {
                id: "q20",
                text: "Tình huống: Sang năm học mới, A được phân công trợ giảng một lớp có nội dung học giống với lớp A đã trợ giảng năm trước, và A đã có sẵn đáp án bài tập về nhà từ năm ngoái. A nên làm gì khi soạn đáp án bài tập về nhà cho lớp mới?",
                options: [
                    { id: "a", text: "Lấy nguyên đáp án năm cũ" },
                    { id: "b", text: "Dùng đáp án năm cũ làm tài liệu tham khảo, nhưng vẫn rà soát lại theo đề bài và template CMATH hiện tại, ghi đúng tên người soạn (A) và gửi giáo viên check trước khi đăng lên nhóm lớp" },
                    { id: "c", text: "Báo giáo viên là đã có đáp án từ năm trước nên không cần làm lại" },
                    { id: "d", text: "Đợi trợ giảng khác trong lớp làm đáp án rồi mình so sánh với đáp án cũ mà mình đã làm để thống nhất đáp án chung rồi gửi lên nhóm lớp" },
                ],
                correctOptionId: "b",
            },
            {
                id: "q21",
                text: "Tình huống: Bạn nhận đề kiểm tra của một lớp chuyên và đã 3 ngày nhưng chưa làm xong đáp án. Bạn nên làm gì?",
                options: [
                    { id: "a", text: "Không làm gì cả vì lớp chuyên trợ giảng không cần làm đáp án" },
                    { id: "b", text: "Tiếp tục làm bình thường vì chỉ cần hoàn thiện trước ngày thi là được" },
                    { id: "c", text: "Bảo giáo viên tự làm đáp án" },
                    { id: "d", text: "Nhắn cho quản lí khối rằng em có việc bận nên chưa kịp hoàn thiện và cố gắng làm xong sớm nhất có thể" },
                ],
                correctOptionId: "d",
            },
            {
                id: "q22",
                text: "Tình huống: Bạn vừa dạy xong một buổi bổ trợ. Bạn cần hoàn thiện file ghi nhận xét học sinh khi nào để được tính lương buổi đó?",
                options: [
                    { id: "a", text: "Trong vòng 2 ngày sau buổi dạy" },
                    { id: "b", text: "Trước buổi bổ trợ tiếp theo là được" },
                    { id: "c", text: "Ngay trong ngày dạy bổ trợ hôm đó" },
                    { id: "d", text: "Trong vòng 1 tuần" },
                ],
                correctOptionId: "c",
            },
            {
                id: "q23",
                text: "Tình huống: Tối nay bạn có buổi trợ giảng lớp online theo đúng lịch đã đăng ký, nhưng người yêu lại rủ đi chơi đúng giờ đó. Bạn nên làm gì?",
                options: [
                    { id: "a", text: "Bỏ lớp" },
                    { id: "b", text: "Đi chơi với người yêu, nhờ một trợ giảng khác đi thay mà không báo trước với quản lí khối" },
                    { id: "c", text: "Từ chối lời mời, hoàn thành đầy đủ buổi trợ giảng theo đúng lịch đã đăng ký, sau đó hẹn người yêu đi chơi vào lúc khác" },
                    { id: "d", text: "Vừa trợ giảng online vừa đi chơi với người yêu trong giờ dạy" },
                    { id: "e", text: "Bật dậy khỏi giường, nhận ra mình không cần lo về điều này vì làm gì có người yêu 😊" }
                ],
                correctOptionId: "c",
            },
            {
                id: "q24",
                text: "Tình huống: Trong lúc làm đáp án bài tập về nhà, bạn A gặp một bài khó và đã suy nghĩ rất lâu nhưng chưa làm được. Bạn A nên làm gì?",
                options: [
                    { id: "a", text: "Bỏ qua, không làm đáp án cho bài đó" },
                    { id: "b", text: "Hỏi các học sinh mà mình quen biết rồi chép giải" },
                    { id: "c", text: "Trao đổi với các trợ giảng khác để cùng thảo luận, nếu vẫn chưa chắc thì hỏi thêm giáo viên trước khi hoàn thiện đáp án" },
                    { id: "d", text: "Tra AI/tìm trên mạng và chép luôn kết quả vào đáp án" },
                ],
                correctOptionId: "c",
            },
            {
                id: "q25",
                text: "Tình huống: Khi soạn đáp án bài tập về nhà, A gặp một bài có thể giải nhanh hơn bằng kiến thức ở cấp học cao hơn mà học sinh chưa được học. A nên trình bày lời giải thế nào?",
                options: [
                    { id: "a", text: "Chỉ trình bày cách giải bằng kiến thức cao hơn cho ngắn gọn, học sinh tự tìm hiểu thêm nếu chưa hiểu" },
                    { id: "b", text: "Trình bày lời giải theo đúng phương pháp/kiến thức học sinh đã được học (Cách 1); nếu muốn, có thể bổ sung thêm cách giải khác (Cách 2) để học sinh tham khảo, nhưng không thay thế Cách 1" },
                    { id: "c", text: "Bỏ qua bài đó trong đáp án vì cách giải theo đúng chương trình quá dài" },
                    { id: "d", text: "Trình bày lời giải bằng cách sử dụng kiến thức cao hơn và chứng minh lại phần kiến thức đó theo dạng bổ đề" },
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

    // Onboarding: trạng thái đã gửi mã + ô nhập mã
    const [codeSent, setCodeSent] = useState(false);
    const [code, setCode] = useState("");
    const [verifying, setVerifying] = useState(false);

    const allAnswered = questions.every((q) => Boolean(answers[q.id]));

    // Số câu đúng (chấm sơ bộ ở client để báo sớm; backend vẫn chấm lại để chốt)
    const correctCount = questions.reduce(
        (sum, q) => sum + (answers[q.id] === q.correctOptionId ? 1 : 0),
        0
    );
    // Cần đúng tối thiểu bao nhiêu câu để nhận mã (đồng bộ với backend)
    const PASS_THRESHOLD = 20;

    // Tự điền họ tên từ tài khoản trợ giảng đang đăng nhập
    useEffect(() => {
        if (isOnboarding && user?.fullName && !fullName) {
            setFullName(user.fullName);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOnboarding, user?.fullName]);

    // ====== HANDLERS ======
    const onSelect = (questionId: string, optionId: string) => {
        setAnswers((prev) => ({
            ...prev,
            [questionId]: optionId,
        }));
    };

    const isEmailValid = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);

    // Onboarding bước 1: nộp bài test -> gửi mã về email tuỳ chọn
    const handleRequestCode = async () => {
        setStatus(null);

        if (!allAnswered) {
            setStatus({ type: "error", message: "Bạn cần trả lời tất cả câu hỏi trước khi nộp." });
            return;
        }
        if (correctCount < PASS_THRESHOLD) {
            setStatus({
                type: "error",
                message: `Bạn mới trả lời đúng ${correctCount}/${questions.length} câu. Cần đúng tối thiểu ${PASS_THRESHOLD} câu để nhận mã kích hoạt. Vui lòng xem lại và làm lại bài test.`,
            });
            return;
        }
        if (!isEmailValid(contact.trim())) {
            setStatus({ type: "error", message: "Vui lòng nhập email hợp lệ để nhận mã kích hoạt." });
            return;
        }

        setIsSubmitting(true);
        try {
            const res = await fetch(`${API_BASE}/assistant/onboarding/request-code`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ email: contact.trim(), answers }),
            });
            const data = await res.json().catch(() => null);
            if (!res.ok) throw new Error(data?.message || "Gửi mã thất bại.");

            setCodeSent(true);
            setStatus({ type: "ok", message: data?.message || "Đã gửi mã xác thực về email của bạn." });
        } catch (err: any) {
            setStatus({ type: "error", message: err?.message || "Có lỗi xảy ra. Vui lòng thử lại." });
        } finally {
            setIsSubmitting(false);
        }
    };

    // Onboarding bước 2: nhập mã -> kích hoạt tài khoản (status = 1)
    const handleVerifyCode = async () => {
        setStatus(null);
        if (!code.trim()) {
            setStatus({ type: "error", message: "Vui lòng nhập mã xác thực." });
            return;
        }

        setVerifying(true);
        try {
            const res = await fetch(`${API_BASE}/assistant/onboarding/verify-code`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ code: code.trim() }),
            });
            const data = await res.json().catch(() => null);
            if (!res.ok) throw new Error(data?.message || "Xác thực thất bại.");

            // Cập nhật status trong context + localStorage rồi vào khu vực trợ giảng
            if (user) updateUser({ ...user, status: 1 });
            router.push("/assistant");
        } catch (err: any) {
            setStatus({ type: "error", message: err?.message || "Có lỗi xảy ra. Vui lòng thử lại." });
        } finally {
            setVerifying(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Luồng kích hoạt tài khoản trợ giảng đi theo nhánh riêng
        if (isOnboarding) {
            await handleRequestCode();
            return;
        }

        setStatus(null);

        if (!allAnswered) {
            setStatus({ type: "error", message: "Bạn cần trả lời tất cả câu hỏi trước khi nộp." });
            return;
        }

        if (!API_BASE) {
            setStatus({
                type: "error",
                message: "Thiếu NEXT_PUBLIC_BACKEND_PORT trong .env.local (Next.js).",
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
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
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
                    {isOnboarding ? (
                        <p style={{ marginTop: 8, marginBottom: 0, opacity: 0.85 }}>
                            Tài khoản trợ giảng của bạn <b>chưa được kích hoạt</b>. Hãy hoàn thành bài test,
                            nhập email để nhận <b>mã kích hoạt</b>, sau đó nhập mã để bắt đầu sử dụng tài khoản.
                        </p>
                    ) : (
                        <p style={{ marginTop: 8, marginBottom: 0, opacity: 0.8 }}>
                            Chọn đáp án và bấm <b>Nộp đáp án</b>. Hệ thống chỉ ghi nhận và gửi về email quản lý,{" "}
                            <b>không hiển thị kết quả đúng/sai</b>.
                        </p>
                    )}
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
                            <label style={{ fontWeight: 700 }}>
                                {isOnboarding ? "Email nhận mã kích hoạt" : "Liên hệ"}
                            </label>
                            <input
                                value={contact}
                                onChange={(e) => setContact(e.target.value)}
                                placeholder={
                                    isOnboarding
                                        ? "Email của bạn để nhận mã (vd: cmath@gmail.com)"
                                        : "Email nhận kết quả (vd: cmath@gmail.com)"
                                }
                                disabled={isOnboarding && codeSent}
                                required
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
                            {!allAnswered
                                ? `Bạn cần trả lời đủ ${questions.length} câu.`
                                : isOnboarding
                                    ? `Đã trả lời đủ ${questions.length} câu. Cần đúng tối thiểu ${PASS_THRESHOLD} câu để nhận mã.`
                                    : "Bạn đã trả lời đủ. Có thể nộp."}
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting || (isOnboarding && codeSent)}
                            style={{
                                padding: "12px 16px",
                                borderRadius: 14,
                                border: "1px solid #ddd",
                                fontWeight: 800,
                                cursor: isSubmitting || (isOnboarding && codeSent) ? "not-allowed" : "pointer",
                                opacity: isSubmitting || (isOnboarding && codeSent) ? 0.7 : 1,
                                background: "#ffffff",
                            }}
                        >
                            {isOnboarding
                                ? (isSubmitting ? "Đang gửi mã..." : codeSent ? "Đã gửi mã" : "Nộp bài & nhận mã")
                                : (isSubmitting ? "Đang nộp..." : "Nộp đáp án")}
                        </button>
                    </div>

                    {/* Onboarding: nhập mã xác thực sau khi đã gửi mã về email */}
                    {isOnboarding && codeSent && (
                        <div
                            style={{
                                background: "white",
                                border: "1px solid #adc6ff",
                                borderRadius: 18,
                                padding: 16,
                                display: "grid",
                                gap: 12,
                            }}
                        >
                            <div style={{ fontWeight: 800 }}>Nhập mã kích hoạt</div>
                            <div style={{ fontSize: 14, opacity: 0.75 }}>
                                Mã gồm 6 chữ số đã được gửi tới email <b>{contact.trim()}</b>. Nhập mã để kích hoạt tài khoản.
                            </div>
                            <input
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                placeholder="Nhập mã 6 chữ số"
                                inputMode="numeric"
                                style={{
                                    padding: 12,
                                    borderRadius: 12,
                                    border: "1px solid #ddd",
                                    outline: "none",
                                    letterSpacing: 4,
                                    fontWeight: 700,
                                }}
                            />
                            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                                <button
                                    type="button"
                                    onClick={handleVerifyCode}
                                    disabled={verifying}
                                    style={{
                                        padding: "12px 16px",
                                        borderRadius: 14,
                                        border: "1px solid #1d39c4",
                                        fontWeight: 800,
                                        cursor: verifying ? "not-allowed" : "pointer",
                                        opacity: verifying ? 0.7 : 1,
                                        background: "#1d39c4",
                                        color: "#fff",
                                    }}
                                >
                                    {verifying ? "Đang xác thực..." : "Xác thực & kích hoạt"}
                                </button>
                                <button
                                    type="button"
                                    onClick={handleRequestCode}
                                    disabled={isSubmitting}
                                    style={{
                                        padding: "12px 16px",
                                        borderRadius: 14,
                                        border: "1px solid #ddd",
                                        fontWeight: 700,
                                        cursor: isSubmitting ? "not-allowed" : "pointer",
                                        opacity: isSubmitting ? 0.7 : 1,
                                        background: "#ffffff",
                                    }}
                                >
                                    Gửi lại mã
                                </button>
                            </div>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
}