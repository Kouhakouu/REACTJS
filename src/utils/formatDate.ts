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
    const date = new Date(time);
    return date.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
};

