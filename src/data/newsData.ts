export interface NewsItem {
    slug: string;
    title: string;
    thumbnail: string;
    date: string;
    views: number;
    excerpt: string;
    content: string[];
    hasExamResultsTable?: boolean;
}

export const newsData: NewsItem[] = [
    {
        slug: 'con-hoc-toan-tieu-hoc-kem-phai-lam-sao',
        title: 'Con học Toán tiểu học kém phải làm sao?',
        thumbnail: '/images/news/toan-tieu-hoc-kem.jpg',
        date: '26/06/2026',
        views: 105,
        excerpt:
            'Nhiều phụ huynh lo lắng khi thấy con học Toán tiểu học chậm hơn các bạn. CMATH gợi ý 3 bước giúp con cải thiện mà không tạo áp lực.',
        content: [
            'Khi con học Toán tiểu học kém, điều đầu tiên phụ huynh cần làm là xác định con đang hổng kiến thức ở đâu, thay vì chỉ ép con làm thêm nhiều bài tập.',
            'Bước 1: Rà soát lại nền tảng. Phần lớn học sinh học kém Toán không phải vì "không có khả năng" mà vì bị hổng một mắt xích kiến thức từ trước, khiến các bài học sau ngày càng khó theo.',
            'Bước 2: Học chậm nhưng chắc. Tại CMATH, giáo viên ưu tiên giúp học sinh hiểu bản chất phép tính, chứ không học thuộc máy móc cách giải.',
            'Bước 3: Đồng hành cùng phụ huynh. Sau mỗi buổi học, trợ giảng và giáo viên đều gửi nhận xét chi tiết để phụ huynh nắm được tiến độ của con và phối hợp kịp thời.',
        ],
    },
    {
        slug: 'danh-sach-hoc-sinh-do-cac-truong-chuyen-2026-2027',
        title: 'Danh sách học sinh đỗ chuyên và đỗ trường chất lượng cao năm học 2025 - 2026',
        thumbnail: '/images/news/danh-sach-do-truong-chuyen.jpg',
        date: '25/06/2026',
        views: 86,
        excerpt:
            'CMATH xin chúc mừng 674 học sinh với 1131 lượt đỗ chuyên và 170 học sinh với 172 lượt đỗ trường chất lượng cao trong kỳ tuyển sinh năm học 2025 - 2026.',
        content: [
            'Năm học 2025 - 2026 ghi nhận thành tích vượt trội của học sinh CMATH: 674 học sinh đạt 1131 lượt đỗ các trường chuyên (THCS Khoa học Tự nhiên, Hà Nội - Amsterdam, Sư phạm, Chu Văn An, Nguyễn Huệ...) và 170 học sinh đạt 172 lượt đỗ các trường THPT công lập chất lượng cao trên địa bàn Hà Nội.',
            'Đây là kết quả của một quá trình học tập bền bỉ, sự đồng hành sát sao giữa giáo viên, trợ giảng và phụ huynh trong suốt khóa học.',
            'CMATH xin gửi lời chúc mừng đến các con và phụ huynh, đồng thời cảm ơn sự tin tưởng đã đồng hành cùng câu lạc bộ trong thời gian qua. Danh sách chi tiết được CLB tổng hợp dưới đây, phụ huynh có thể tìm theo tên con tại các ô tìm kiếm.',
        ],
        hasExamResultsTable: true,
    },
    {
        slug: '5-dau-hieu-nhan-biet-con-dang-hoc-toan-cham-hon-cac-ban',
        title: '5 dấu hiệu nhận biết con đang học Toán chậm hơn các bạn',
        thumbnail: '/images/news/dau-hieu-hoc-toan-cham.jpg',
        date: '24/06/2026',
        views: 122,
        excerpt:
            'Phát hiện sớm các dấu hiệu con học chậm hơn các bạn cùng lớp sẽ giúp phụ huynh và giáo viên kịp thời điều chỉnh phương pháp học tập.',
        content: [
            '1. Con thường mất nhiều thời gian hơn các bạn để hoàn thành một bài tập cơ bản.',
            '2. Con hay nhầm lẫn giữa các dạng bài đã học, phải nhắc lại nhiều lần.',
            '3. Con ngại phát biểu, ngại hỏi lại khi chưa hiểu bài trên lớp.',
            '4. Kết quả các bài kiểm tra định kỳ có xu hướng giảm dần.',
            '5. Con tỏ ra chán nản, không còn hứng thú với môn Toán như trước.',
            'Nếu nhận thấy một trong các dấu hiệu trên, phụ huynh nên trao đổi sớm với giáo viên hoặc trợ giảng phụ trách lớp của con để được hỗ trợ điều chỉnh kịp thời.',
        ],
    },
];
