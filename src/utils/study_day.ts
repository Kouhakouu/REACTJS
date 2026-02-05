import { formatDate, formatWeekday, formatTime } from '@/utils/formatDate';

function mapStudyDayToDayjsDay(study_day: string): number | null {
    const s = (study_day || '').trim().toLowerCase();

    // backend có thể trả Monday/Tuesday... hoặc monday/tuesday...
    const map: Record<string, number> = {
        sunday: 0,
        monday: 1,
        tuesday: 2,
        wednesday: 3,
        thursday: 4,
        friday: 5,
        saturday: 6,

        // nếu lỡ backend trả tiếng Việt
        'chủ nhật': 0,
        'chu nhat': 0,
        'thứ hai': 1,
        'thu hai': 1,
        'thứ ba': 2,
        'thu ba': 2,
        'thứ tư': 3,
        'thu tu': 3,
        'thứ năm': 4,
        'thu nam': 4,
        'thứ sáu': 5,
        'thu sau': 5,
        'thứ bảy': 6,
        'thu bay': 6,
    };

    return map[s] ?? null;
}

function fmtHHmm(time: string) {
    // dùng formatTime của bạn nếu muốn, nhưng formatTime đang strip “T”, nên HH:mm:ss ok
    return formatTime(time);
}
