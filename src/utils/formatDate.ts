const dayMapping: Record<string, string> = {
    Monday: "Thứ hai",
    Tuesday: "Thứ ba",
    Wednesday: "Thứ tư",
    Thursday: "Thứ năm",
    Friday: "Thứ sáu",
    Saturday: "Thứ bảy",
    Sunday: "Chủ nhật",
};

// Chuyển đổi ngày ISO thành dd/mm/yyyy
export const formatDate = (isoString: string): string => {
    const date = new Date(isoString);
    return date.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
};

// Chuyển ngày trong tuần từ English -> Tiếng Việt
export const formatWeekday = (weekday: string): string => {
    return dayMapping[weekday] || weekday; // Nếu không tìm thấy, giữ nguyên
};

export const formatTime = (time: string): string => {
    if (!time) return "Không có dữ liệu";

    // Nếu có 'T', bỏ hết trước 'T'
    const t = time.includes("T") ? time.split("T")[1] : time;
    // Lấy giờ và phút
    const [hourStr, minuteStr] = t.split(":");
    // Loại bỏ số 0 đứng đầu
    const hour = String(parseInt(hourStr, 10));
    // Lấy đúng hai chữ số phút
    const minute = minuteStr.padStart(2, "0");

    return `${hour}:${minute}`;
};

