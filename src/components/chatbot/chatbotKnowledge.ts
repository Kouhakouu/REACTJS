export type FAQEntry = {
    id: string;
    question: string;
    keywords: string[];
    answer: string;
};

const DIACRITICS_REGEX = new RegExp('[\\u0300-\\u036f]', 'g');

export const normalize = (input: string): string => {
    return input
        .toLowerCase()
        .normalize('NFD')
        .replace(DIACRITICS_REGEX, '')
        .replace(/đ/g, 'd')
        .replace(/[^a-z0-9\s]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
};

export const FALLBACK_ANSWER =
    'Mình chưa có sẵn thông tin cho câu hỏi này. Phụ huynh vui lòng để lại nội dung muốn hỏi tại đây, ngay khi có quản lý hoặc trợ giảng CMATH rảnh sẽ phản hồi trực tiếp. Trong lúc chờ, phụ huynh có thể thử hỏi mình về: giới thiệu CMATH, các môn học/khóa học, lịch học, học phí, đăng ký, đăng nhập, cách xem điểm của con, gửi email kết quả, đánh giá định kỳ, hoặc thông tin về giáo viên/trợ giảng.';

export const GREETING_ANSWER =
    'Xin chào phụ huynh! Mình là trợ lý ảo của CMATH Education — Câu lạc bộ Toán học muôn màu. Mình có thể giúp phụ huynh tra cứu thông tin về câu lạc bộ (lịch sử, các môn học, đội ngũ giáo viên, học phí, lịch học, tuyển sinh) và hướng dẫn sử dụng website (đăng ký, đăng nhập, xem điểm con, nhận email kết quả…). Phụ huynh muốn hỏi điều gì ạ?';

export const SUGGESTED_QUESTIONS: string[] = [
    'CMATH là gì?',
    'Các môn học và khóa học?',
    'Học phí và lịch học?',
    'Cách đăng ký tài khoản?',
    'Làm sao xem điểm của con?',
    'Gặp giáo viên / quản lý?'
];

export const FAQ: FAQEntry[] = [
    // ============ CHÀO HỎI & GIỚI THIỆU ============
    {
        id: 'greeting',
        question: 'Xin chào',
        keywords: [
            'xin chao',
            'chao ban',
            'chao bot',
            'chao em',
            'chao chi',
            'chao anh',
            'hello',
            'hi ',
            'hi,',
            'hi.',
            'hi!',
            'alo',
            'co ai',
            'co ai do khong'
        ],
        answer: GREETING_ANSWER
    },
    {
        id: 'about-cmath',
        question: 'CMATH là gì?',
        keywords: [
            'cmath la gi',
            'cmath',
            'gioi thieu',
            'cau lac bo la gi',
            'clb la gi',
            've cmath',
            've cau lac bo',
            'la cai gi',
            'trung tam gi',
            'trung tam la gi',
            'toan hoc muon mau',
            'muon mau'
        ],
        answer:
            'CMATH (Câu lạc bộ Toán học muôn màu) là câu lạc bộ học tập tiền thân là lớp Toán của thầy Võ Quốc Bá Cẩn. Từ năm 2012 thầy nhận gia sư từng học sinh, sau đó phụ huynh thành lập nhóm mời thầy giảng dạy, mở rộng quy mô và mời thêm nhiều giáo viên khác về dạy cùng. Đến năm 2020, CLB đã có hơn 1.000 học sinh; hiện nay con số đã vượt 7.000 học sinh cùng đội ngũ giáo viên và trợ giảng ngày càng mở rộng. CMATH ra đời với mong muốn truyền cảm hứng học tập, khơi dậy tiềm năng và giúp các con làm chủ kiến thức cũng như tư duy của bản thân.'
    },
    {
        id: 'history',
        question: 'Lịch sử thành lập CMATH',
        keywords: [
            'lich su',
            'thanh lap',
            'tu khi nao',
            'bao lau',
            'thanh lap nam nao',
            'tien than',
            'ra doi nam nao',
            'co tu nam nao'
        ],
        answer:
            'CMATH có một hành trình dài: bắt đầu từ năm 2012 khi thầy Võ Quốc Bá Cẩn dạy gia sư cho từng học sinh. Sau đó phụ huynh tin tưởng nên thành lập nhóm mời thầy dạy, và CLB chính thức ra đời, mở rộng dần qua từng năm. Mốc quan trọng: năm 2020 CLB đã có hơn 1.000 học sinh; đến nay đã có hơn 7.000 học sinh và đội ngũ giáo viên, trợ giảng vẫn đang tiếp tục mở rộng.'
    },
    {
        id: 'philosophy',
        question: 'Triết lý dạy học của CMATH',
        keywords: [
            'triet ly',
            'su menh',
            'gia tri cot loi',
            'phuong cham',
            'muc tieu',
            'tieu chi',
            'tam nhin',
            'tinh than'
        ],
        answer:
            'Triết lý của CMATH: không chỉ truyền đạt kiến thức mà còn truyền cảm hứng học tập, giúp học sinh làm chủ tư duy, yêu việc học và xây dựng niềm vui học tập bền vững. Các thầy cô hướng dẫn các con cách học, cách suy nghĩ và cách tự tin vượt qua thử thách — để nuôi dưỡng niềm vui học tập suốt đời. Câu lạc bộ luôn đặt sự tiến bộ của học sinh làm trung tâm.'
    },
    // ============ MÔN HỌC & KHÓA HỌC ============
    {
        id: 'subjects',
        question: 'CMATH dạy những môn nào?',
        keywords: [
            'mon hoc',
            'day mon gi',
            'day gi',
            'day nhung gi',
            'co mon nao',
            'cac mon'
        ],
        answer:
            'CMATH dạy 5 môn theo lộ trình từ Tiểu học đến THPT:\n• Toán Tiểu học (từ lớp 2): học từ cơ bản đến nâng cao, rèn tư duy logic, chuẩn bị cho kỳ thi vào lớp 6.\n• Tiếng Việt Tiểu học: phát triển kỹ năng nghe-nói-đọc-viết, tư duy ngôn ngữ và biểu cảm.\n• Toán THCS (lớp 6–9): Số học, Hình học, Đại số, Tổ hợp, Thuật toán, Logic, Thống kê… đi từ đơn giản đến phức tạp.\n• Văn THCS: định hướng chuyên sâu, nâng cao năng lực cảm thụ, kỹ năng nói và viết, sẵn sàng cho các kỳ thi.\n• Toán THPT (lớp 10–12): luyện vững kiến thức trên lớp và chuẩn bị cho kỳ thi THPT, Đại học.'
    },
    {
        id: 'courses',
        question: 'Có những khóa học nào?',
        keywords: [
            'khoa hoc',
            'co lop nao',
            'lop nao',
            'co khoa nao',
            'cac khoa',
            'cac lop',
            'on luyen',
            'on thi',
            'luyen thi'
        ],
        answer:
            'CMATH có nhiều khóa luyện thi theo từng lớp:\n• Toán lớp 5: chuẩn bị cho thi chuyển cấp vào lớp 6.\n• Toán lớp 6, 7, 8, 9: chia 3 mức — chất lượng cao, cận chuyên, chuyên — phù hợp năng lực từng học sinh.\n• Toán THPT (10, 11, 12): luyện thi tốt nghiệp và đại học.\n• Văn THCS và Tiếng Việt Tiểu học cho các con muốn phát triển toàn diện.\nPhụ huynh vào mục "Khóa học" trên menu để xem chi tiết từng cấp.'
    },
    {
        id: 'levels',
        question: 'Có những mức lớp nào (chất lượng cao, cận chuyên, chuyên)?',
        keywords: [
            'chat luong cao',
            'can chuyen',
            'chuyen',
            'lop chuyen',
            'lop nang cao',
            'phan loai lop',
            'phan loai',
            'co bao nhieu muc'
        ],
        answer:
            'Mỗi khối lớp 6–9 tại CMATH có 3 mức để phụ huynh chọn theo năng lực của con:\n• Chất lượng cao: kiến thức nền tảng vững, mở rộng vừa phải.\n• Cận chuyên: nâng cao hơn, hướng tới thi vào trường chất lượng cao và thi học sinh giỏi.\n• Chuyên: tập trung vào kiến thức chuyên sâu, dành cho học sinh có nguyện vọng thi chuyên.\nViệc phân lớp dựa trên năng lực thực tế của con để đảm bảo lộ trình phù hợp.'
    },
    {
        id: 'topics',
        question: 'Các phân môn Toán tại CMATH?',
        keywords: [
            'phan mon',
            'so hoc',
            'hinh hoc',
            'dai so',
            'to hop',
            'thuat toan',
            'logic',
            'thong ke',
            'kien thuc gi'
        ],
        answer:
            'Tại CMATH, các con được tiếp cận Toán học hiện đại ở các phân môn: Số học, Hình học, Đại số, Tổ hợp, Thuật toán, Logic, Thống kê — đi từ dạng thức đơn giản đến phức tạp, phù hợp lứa tuổi. Giáo trình kết hợp Toán cơ bản, Toán chuyên Việt Nam và định hướng từ Singapore, Mỹ, hướng tới tư duy chiều sâu chứ không học máy móc.'
    },
    {
        id: 'admission',
        question: 'Đăng ký học như thế nào?',
        keywords: [
            'tuyen sinh',
            'dang ky hoc',
            'cho con hoc',
            'cho be hoc',
            'cho con tham gia',
            'muon hoc',
            'muon cho con hoc',
            'nhap hoc',
            'vao clb',
            'gia nhap',
            'thi dau vao',
            'kiem tra dau vao'
        ],
        answer:
            'Để đăng ký cho con học tại CMATH, phụ huynh vào mục "Tuyển sinh" trên menu và chọn khối phù hợp: Tiểu học / THCS / THPT. Tại đó có thông tin chi tiết về chương trình và biểu mẫu đăng ký. Quy trình thường gồm: (1) phụ huynh điền form đăng ký; (2) câu lạc bộ liên hệ tư vấn và sắp xếp một bài kiểm tra/khảo sát năng lực; (3) căn cứ kết quả, quản lý khối xếp con vào lớp phù hợp với năng lực (chất lượng cao / cận chuyên / chuyên).'
    },
    {
        id: 'fees',
        question: 'Học phí thế nào?',
        keywords: [
            'hoc phi',
            'gia tien',
            'bao nhieu tien',
            'gia bao nhieu',
            'phi hoc',
            'chi phi',
            'gia hoc',
            'mot buoi bao nhieu',
            'mot khoa bao nhieu',
            'dong tien'
        ],
        answer:
            'Học phí của mỗi khóa phụ thuộc vào cấp học (Tiểu học / THCS / THPT) và loại lớp (chất lượng cao / cận chuyên / chuyên), cũng như tần suất học mỗi tuần. Để được tư vấn học phí chính xác cho con, phụ huynh vui lòng để lại tin nhắn tại đây kèm khối lớp và môn quan tâm, hoặc liên hệ trực tiếp với quản lý khối qua trang "Liên hệ" — câu lạc bộ sẽ phản hồi sớm nhất.'
    },
    {
        id: 'schedule',
        question: 'Lịch học và giờ học?',
        keywords: [
            'lich hoc',
            'gio hoc',
            'thoi gian hoc',
            'hoc ngay nao',
            'hoc thu may',
            'hoc may buoi',
            'so buoi',
            'mot tuan may',
            'ca hoc',
            'ca sang',
            'ca chieu',
            'ca toi',
            'thu 2',
            'thu 7',
            'chu nhat'
        ],
        answer:
            'Lịch học tại CMATH được tổ chức theo các ca trong tuần — gồm ca Sáng, ca Chiều, ca Tối — trải đều từ thứ 2 đến chủ nhật. Mỗi lớp được gắn một ca học cụ thể (ví dụ: Chủ nhật 8:00–11:00, Thứ ba 18:00–21:00…). Sau khi đăng ký, học sinh sẽ được phân lớp và nhận lịch học chi tiết. Sau khi đăng nhập, học sinh có thể xem lịch học của mình trong mục "Lớp của tôi". Nếu cần lịch chi tiết của một khóa, phụ huynh hãy để lại lời nhắn để câu lạc bộ phản hồi.'
    },
    {
        id: 'evaluation-cycle',
        question: 'CMATH đánh giá học sinh thế nào?',
        keywords: [
            'danh gia dinh ky',
            'kiem tra dinh ky',
            'bai kiem tra',
            'thi dinh ky',
            '2 thang',
            'hai thang',
            'kiem tra trinh do',
            'sap xep lai lop',
            'phan lai lop'
        ],
        answer:
            'CMATH đánh giá học sinh theo 2 hình thức:\n• Sau mỗi buổi học: trợ giảng và giáo viên chấm bài tập về nhà, chấm điểm danh, nhận xét trình bày và kỹ năng → gửi kết quả tới phụ huynh.\n• Định kỳ 2 tháng/lần: có bài kiểm tra đánh giá tổng quát giúp giáo viên nắm bắt sự tiến bộ và quản lý khối có thể điều chỉnh lớp học hoặc tốc độ giảng dạy cho phù hợp với năng lực thực tế của các con.'
    },
    {
        id: 'methodology',
        question: 'Phương pháp giảng dạy của CMATH?',
        keywords: [
            'phuong phap day',
            'phuong phap giang day',
            'day kieu gi',
            'day the nao',
            'cach day',
            'giao trinh',
            'chuong trinh hoc'
        ],
        answer:
            'Phương pháp giảng dạy của CMATH:\n• Chương trình cập nhật hàng năm, phù hợp với từng độ tuổi.\n• Kết hợp Toán cơ bản, Toán chuyên Việt Nam và định hướng Singapore, Mỹ.\n• Bài học thiết kế tư duy chiều sâu, khuyến khích nhiều cách giải, tránh học máy móc.\n• Hệ thống bài tập trực quan, phong phú, gợi mở sáng tạo.\n• Củng cố chắc kiến thức cơ bản trước khi nâng cao theo năng lực từng học sinh.\n• Phân lớp đồng đều để tăng hiệu quả học tập.\n• Sau mỗi buổi học gửi nhận xét tới phụ huynh; định kỳ 2 tháng có kiểm tra đánh giá.'
    },
    // ============ ĐỘI NGŨ ============
    {
        id: 'founder',
        question: 'Thầy Võ Quốc Bá Cẩn là ai?',
        keywords: [
            'thay can',
            'vo quoc ba can',
            'ba can',
            'chu nhiem',
            'nguoi sang lap',
            'sang lap',
            'founder',
            'thay ay',
            'thay can la ai'
        ],
        answer:
            'Thầy Võ Quốc Bá Cẩn (sinh năm 1988) là Chủ nhiệm CLB CMATH. Thầy xuất thân từ trường THPT chuyên Lý Tự Trọng - Cần Thơ, đạt nhiều giải thưởng cấp Thành phố và Quốc gia. Thầy là tác giả/đồng tác giả nhiều đầu sách về Bất đẳng thức, được xuất bản tại Mỹ và Rumani. Năm 2013, thầy được mời huấn luyện đội tuyển Olympic Toán Việt Nam khi mới 25 tuổi. Năm 2015 thầy giúp đội tuyển Việt Nam giành 2 vàng, 3 bạc, 1 đồng tại IMO; năm 2017 đội tuyển VN đạt 4 huy chương Vàng IMO — thành tích cao nhất từ trước tới nay. Thầy hiện công tác tại Trường THCS Archimedes Academy.'
    },
    {
        id: 'teachers',
        question: 'Giáo viên của CMATH?',
        keywords: [
            'giao vien',
            'thay co',
            'doi ngu',
            'ai day',
            'nguoi day',
            'thay nao',
            'co nao',
            'giao vien la ai',
            'archimedes'
        ],
        answer:
            'Đội ngũ giáo viên CMATH gồm các thầy cô có chuyên môn vững, nhiều năm kinh nghiệm, đến từ các trường uy tín tại Hà Nội (tiêu biểu là Trường THCS Archimedes Academy). Một số giáo viên tiêu biểu:\n• Thầy Võ Quốc Bá Cẩn — Chủ nhiệm CLB, huấn luyện đội tuyển IMO Việt Nam.\n• Thầy Nguyễn Văn Quý — thủ khoa ĐH Khoa học Tự nhiên, dạy đội tuyển IMO.\n• Thầy Nguyễn Lê Phước — chuyên luyện đội tuyển Toán quốc tế AMC, IMC, IKMC…\n• Thầy Nguyễn Tiến Dũng — thủ khoa Olympic Toán SV toàn quốc 2014, chuyên hình.\n• Thầy Trần Đức Hiếu, Thầy Trần Quang Độ — giảng dạy đội tuyển TST các trường Chuyên trên toàn quốc.\nXem chi tiết tại mục "Giới thiệu" trên website.'
    },
    {
        id: 'assistants',
        question: 'Trợ giảng có vai trò gì?',
        keywords: [
            'tro giang',
            ' ta ',
            'assistant',
            'anh chi tg',
            'phu trach lop',
            'tro giang la ai',
            'tro giang lam gi'
        ],
        answer:
            'Trợ giảng (TA) tại CMATH là các anh chị có học lực tốt (thường là cựu học sinh chuyên, sinh viên đại học top), gắn bó với lớp suốt khóa. Vai trò:\n• "Từ điển sống" sau giờ học: ở lại muộn hơn để giảng lại từng bước cho đến khi học sinh thực sự hiểu.\n• Cầu nối thấu hiểu: tuổi gần, dễ nắm bắt tâm lý, gỡ rối tâm tư tuổi học trò.\n• Cánh tay đắc lực của thầy cô: chấm bài tập về nhà, theo sát tiến độ từng học sinh, nhập điểm và nhận xét vào hệ thống sau mỗi buổi.\nPhụ huynh có thể trao đổi trực tiếp với trợ giảng phụ trách lớp của con để cập nhật tình hình học tập.'
    },
    {
        id: 'manager',
        question: 'Quản lý khối là ai?',
        keywords: [
            'quan ly khoi',
            'phu trach khoi',
            'manager',
            'quan ly la ai',
            'quan ly lam gi',
            'gap quan ly',
            'lien lac quan ly'
        ],
        answer:
            'Mỗi khối (6, 7, 8, 9) tại CMATH có một Quản lý khối phụ trách. Quản lý khối có các nhiệm vụ chính:\n• Quản lý thông tin học sinh trong khối (nhập mới, chuyển lớp).\n• Tạo buổi học mới trước khi lớp bắt đầu.\n• Kiểm tra thông tin buổi học sau khi trợ giảng nhập xong, gửi kết quả tới phụ huynh.\n• Phân công trợ giảng cho từng lớp dựa trên lịch rảnh và nhu cầu.\n• Trao đổi trực tiếp với phụ huynh về tình hình học tập của con để đưa ra phương án phù hợp.\nĐây là người mà phụ huynh nên liên hệ khi có vấn đề cần giải quyết liên quan đến lớp học của con.'
    },
    // ============ TÀI KHOẢN & ĐĂNG NHẬP ============
    {
        id: 'roles',
        question: 'Hệ thống có những vai trò người dùng nào?',
        keywords: [
            'vai tro',
            'role',
            'phan quyen',
            'tai khoan loai gi',
            'co bao nhieu loai tai khoan',
            'tai khoan gi'
        ],
        answer:
            'Hệ thống CMATH có 5 vai trò người dùng:\n• Admin: quản trị toàn bộ hệ thống (giáo viên, học sinh, lớp, khóa học).\n• Manager (Quản lý khối): phụ trách 1 khối lớp, tạo buổi học, gửi kết quả tới phụ huynh, phân công trợ giảng.\n• Teacher (Giáo viên): xem lớp mình phụ trách, theo dõi học sinh, quản lý khóa học.\n• Assistant (Trợ giảng): chấm bài, nhập điểm danh, nhập nhận xét, sinh nhận xét AI.\n• Student (Học sinh): xem lớp của mình, kết quả từng buổi học, bài tập.\nMỗi vai trò có giao diện và quyền truy cập riêng. Phụ huynh thường dùng tài khoản của con để theo dõi.'
    },
    {
        id: 'register-account',
        question: 'Cách đăng ký tài khoản trên website?',
        keywords: [
            'dang ky tai khoan',
            'tao tai khoan',
            'dang ky web',
            'lap tai khoan',
            'mo tai khoan',
            'sign up',
            'register',
            'tao acc'
        ],
        answer:
            'Để tạo tài khoản truy cập website CMATH:\n1. Bấm "Đăng ký" ở góc trên cùng (menu "Khu vực thành viên" → "Đăng ký") hoặc truy cập đường dẫn /auth/register.\n2. Điền email, mật khẩu và các thông tin yêu cầu.\n3. Hoàn tất và chuyển sang trang đăng nhập.\nLưu ý: tài khoản học sinh sẽ được câu lạc bộ kích hoạt và gán lớp tương ứng (qua bảng Student_Classes) để con có thể xem lịch học, điểm và bài tập của mình. Nếu là tài khoản trợ giảng/giáo viên, quản lý khối sẽ tạo và cấp cho phụ huynh/người dùng.'
    },
    {
        id: 'login',
        question: 'Cách đăng nhập?',
        keywords: [
            'dang nhap',
            'log in',
            'login',
            'vao tai khoan',
            'truy cap tai khoan',
            'cach login',
            'sign in'
        ],
        answer:
            'Phụ huynh / học sinh đăng nhập theo các bước:\n1. Bấm "Đăng nhập" trên menu (góc trên bên phải, mục "Khu vực thành viên") hoặc truy cập /auth/login.\n2. Nhập email và mật khẩu đã đăng ký.\n3. Sau khi đăng nhập, hệ thống tự chuyển đến trang phù hợp với vai trò: học sinh → /student, trợ giảng → /assistant, giáo viên → /teacher, quản lý → /manager, admin → /dashboard.\nNếu không đăng nhập được, hãy nhắn tin để câu lạc bộ kiểm tra giúp.'
    },
    {
        id: 'forgot-password',
        question: 'Quên mật khẩu thì làm sao?',
        keywords: [
            'quen mat khau',
            'mat mat khau',
            'doi mat khau',
            'reset mat khau',
            'khong nho mat khau',
            'thay doi mat khau',
            'cap lai mat khau'
        ],
        answer:
            'Nếu phụ huynh quên mật khẩu, vui lòng để lại email đã đăng ký kèm tên học sinh tại đây, câu lạc bộ sẽ hỗ trợ đặt lại mật khẩu trong thời gian sớm nhất. Sau khi đăng nhập thành công, phụ huynh có thể vào "Hồ sơ" → "Đổi mật khẩu" để tự cập nhật mật khẩu mới.'
    },
    {
        id: 'profile',
        question: 'Cách cập nhật thông tin cá nhân?',
        keywords: [
            'cap nhat thong tin',
            'doi thong tin',
            'sua ho so',
            'profile',
            'ho so',
            'thong tin ca nhan',
            'doi email',
            'doi so dien thoai'
        ],
        answer:
            'Sau khi đăng nhập, người dùng có thể vào trang "Hồ sơ" (/profile tương ứng với vai trò: /student/profile, /teacher/profile, /assistant/profile, /manager/profile, /dashboard/profile) để xem và cập nhật thông tin cá nhân: họ tên, email, số điện thoại. Tại đây cũng có chức năng đổi mật khẩu. Phụ huynh nên giữ thông tin liên hệ (email phụ huynh, số điện thoại) luôn cập nhật để nhận được các thông báo và email kết quả từ CLB.'
    },
    // ============ XEM ĐIỂM, KẾT QUẢ HỌC TẬP ============
    {
        id: 'view-results',
        question: 'Làm sao xem điểm và kết quả học của con?',
        keywords: [
            'xem diem',
            'xem ket qua',
            'ket qua hoc',
            'diem cua con',
            'nhan xet cua con',
            'tinh hinh hoc',
            'bao cao buoi hoc',
            'bai tap cua con',
            'xem nhan xet',
            'theo doi hoc tap',
            'theo doi con'
        ],
        answer:
            'Sau mỗi buổi học, trợ giảng và giáo viên sẽ chấm điểm, ghi nhận điểm danh, nhập nhận xét về trình bày và kỹ năng — toàn bộ kết quả này được hệ thống gửi email tới phụ huynh. Ngoài ra, phụ huynh có thể đăng nhập tài khoản của con để theo dõi:\n• Vào /student/classes → xem danh sách các lớp con đang học.\n• Chọn lớp → vào danh sách các buổi học (Lessons).\n• Chọn từng buổi → xem chi tiết: điểm danh, số bài làm được, bài làm đúng, bài sai, bài chưa làm, nhận xét trình bày, kỹ năng và lời nhận xét tổng quát.\nNếu không nhận được email, hãy kiểm tra thư mục Spam hoặc nhắn để câu lạc bộ gửi lại.'
    },
    {
        id: 'email-results',
        question: 'CMATH gửi kết quả qua email như thế nào?',
        keywords: [
            'gui email',
            'email ket qua',
            'mail ket qua',
            'nhan email',
            'khong nhan duoc email',
            'khong co email',
            'gui qua mail',
            'thong bao mail'
        ],
        answer:
            'Sau mỗi buổi học, hệ thống CMATH tự động gửi email kết quả tới phụ huynh, bao gồm:\n• Điểm danh (có mặt / vắng).\n• Số bài tập về nhà đã làm, làm đúng, làm sai, chưa làm.\n• Nhận xét về trình bày, kỹ năng và lời nhận xét tổng quát (do trợ giảng + giáo viên ghi, có thể sinh tự động bằng AI).\nEmail được gửi từ địa chỉ chính thức của CMATH. Nếu không thấy, phụ huynh nên kiểm tra hộp thư Spam/Quảng cáo, hoặc xác nhận lại địa chỉ email phụ huynh đã đăng ký với CLB.'
    },
    {
        id: 'ai-comment',
        question: 'Nhận xét AI là gì?',
        keywords: [
            'ai',
            'nhan xet tu dong',
            'tri tue nhan tao',
            'sinh nhan xet',
            'tao nhan xet',
            'gemini',
            'claude',
            'chatgpt',
            'comment ai'
        ],
        answer:
            'Hệ thống CMATH có tích hợp AI (Claude / Gemini) để hỗ trợ trợ giảng sinh nhận xét cuối buổi học cho từng học sinh. AI đọc dữ liệu chấm bài (tổng bài, bài làm, bài đúng, bài sai, đánh giá trình bày/kỹ năng, điểm danh) rồi viết ra 2 câu nhận xét: 1 câu về tinh thần học trên lớp, 1 câu về bài tập về nhà — sau đó trợ giảng/quản lý kiểm tra lại trước khi gửi email cho phụ huynh. Cách này giúp đảm bảo mỗi học sinh đều nhận được nhận xét cá nhân hóa, kịp thời mà vẫn ấm áp, đúng giọng văn của giáo viên CMATH.'
    },
    {
        id: 'lesson-content',
        question: 'Làm sao biết nội dung buổi học?',
        keywords: [
            'noi dung buoi hoc',
            'hom nay hoc gi',
            'buoi hoc nay',
            'bai hom nay',
            'bai sap toi',
            'truoc buoi',
            'sau buoi',
            'lesson content'
        ],
        answer:
            'Trước mỗi buổi học, quản lý khối tạo buổi học mới và trợ giảng nhập nội dung dự kiến. Phụ huynh / học sinh có thể xem nội dung buổi học sau khi đăng nhập:\n• Vào /student/classes → chọn lớp → chọn buổi học → xem mục "Nội dung buổi học".\n• Danh sách bài tập về nhà (homework list) cũng được liệt kê tại đây để học sinh chủ động làm.\nNếu buổi học chưa được cập nhật, vui lòng đợi trợ giảng hoặc giáo viên nhập sau khi buổi học kết thúc.'
    },
    {
        id: 'attendance',
        question: 'Hệ thống điểm danh thế nào?',
        keywords: [
            'diem danh',
            'vang hoc',
            'vang mat',
            'di hoc',
            'co di hoc khong',
            'attendance',
            'nghi hoc',
            'xin nghi'
        ],
        answer:
            'Trợ giảng điểm danh học sinh ngay tại buổi học bằng cách đánh dấu Có/Không trên hệ thống cho từng học sinh trong từng buổi (lưu vào bảng Lesson_Students). Kết quả điểm danh sẽ hiển thị trong báo cáo gửi email tới phụ huynh và trong trang xem buổi học. Nếu con cần xin nghỉ, phụ huynh vui lòng báo trước với trợ giảng phụ trách lớp hoặc quản lý khối để được hỗ trợ và sắp xếp học bù nếu cần.'
    },
    {
        id: 'homework',
        question: 'Bài tập về nhà chấm thế nào?',
        keywords: [
            'bai tap ve nha',
            'btvn',
            'cham bai',
            'cham diem bai',
            'lam bai sai',
            'thieu bai',
            'lam bai dung',
            'homework',
            'so bai'
        ],
        answer:
            'Bài tập về nhà tại CMATH được chấm theo nguyên tắc cộng dồn:\n• Mỗi bài có thang điểm: 0 / 0.25 / 0.5 / 0.75 / 1 — tùy mức độ hoàn thiện.\n• Trợ giảng vào trang chấm bài để nhập điểm từng bài cho từng học sinh.\n• Hệ thống tự tổng hợp: số bài đã làm, số bài làm đúng, danh sách bài sai, danh sách bài chưa làm.\n• Kết quả được gửi tới phụ huynh qua email và hiển thị trong trang chi tiết buổi học.\nTrợ giảng cũng có thể xuất Excel chấm bài để tiện đối chiếu.'
    },
    {
        id: 'quiz',
        question: 'Quiz là gì?',
        keywords: [
            'quiz',
            'cau hoi trac nghiem',
            'trac nghiem',
            'lam quiz',
            'kiem tra online',
            'thi online'
        ],
        answer:
            'Hệ thống CMATH có mục Quiz (trắc nghiệm) tại /quiz, cho phép học sinh làm các bộ câu hỏi trắc nghiệm online. Đây là một hình thức luyện tập nhẹ ngoài bài tập về nhà chính. Kết quả sau khi nộp sẽ được gửi về để quản lý theo dõi.'
    },
    // ============ LIÊN HỆ & HỖ TRỢ ============
    {
        id: 'contact',
        question: 'Liên hệ với câu lạc bộ?',
        keywords: [
            'lien he',
            'so dien thoai',
            'sdt',
            'hotline',
            'dia chi',
            'o dau',
            'cmath o dau',
            'email lien he',
            'gap thay',
            'lien lac',
            'noi chuyen'
        ],
        answer:
            'Phụ huynh có thể liên hệ với CMATH theo các cách sau:\n• Vào mục "Liên hệ" trên thanh menu để xem địa chỉ, hotline và email chính thức.\n• Gửi tin nhắn trực tiếp tại đây — câu lạc bộ sẽ phản hồi ngay khi nhân viên trở lại.\n• Trao đổi với trợ giảng phụ trách lớp của con hoặc Quản lý khối nếu con đã có lớp — đây là người nắm sát tình hình của con nhất.'
    },
    {
        id: 'staff-busy',
        question: 'Sao chưa có người trả lời?',
        keywords: [
            'khong co ai tra loi',
            'sao chua tra loi',
            'cho lau',
            'cho lau qua',
            'nhan vien dau',
            'sao khong co ai',
            'mai chua thay',
            'tra loi lau',
            'phan hoi cham'
        ],
        answer:
            'Hiện tại các trợ giảng và quản lý khối của CMATH có thể đang bận giờ lên lớp hoặc ngoài giờ làm việc. Phụ huynh cứ để lại nội dung cần hỏi tại đây — ngay khi có người rảnh sẽ phản hồi phụ huynh sớm nhất. Trong lúc chờ, mình có thể giúp tra cứu các thông tin chung về câu lạc bộ và website ạ.'
    },
    {
        id: 'parent-account',
        question: 'Phụ huynh có tài khoản riêng không?',
        keywords: [
            'tai khoan phu huynh',
            'phu huynh co tai khoan',
            'phu huynh dang nhap',
            'me co the dang nhap',
            'bo co the dang nhap',
            'phu huynh xem'
        ],
        answer:
            'Hiện tại hệ thống CMATH chưa có vai trò "Phụ huynh" riêng. Phụ huynh nhận thông tin về con theo 2 cách:\n1. Qua email tự động gửi sau mỗi buổi học (tới địa chỉ email phụ huynh đã đăng ký).\n2. Đăng nhập bằng tài khoản của con (vai trò Student) để xem lịch học, kết quả từng buổi và bài tập.\nCMATH đang phát triển thêm giao diện dành riêng cho phụ huynh trong các phiên bản tới — sẽ thông báo khi sẵn sàng.'
    },
    {
        id: 'change-class',
        question: 'Chuyển lớp / đổi lớp như thế nào?',
        keywords: [
            'chuyen lop',
            'doi lop',
            'sang lop khac',
            'lop khac',
            'len lop',
            'xuong lop',
            'lop phu hop hon'
        ],
        answer:
            'Nếu phụ huynh thấy lớp hiện tại của con chưa phù hợp (quá khó hoặc quá dễ), hãy liên hệ trực tiếp với Quản lý khối của con. Quy trình chuyển lớp:\n1. Phụ huynh trao đổi nguyện vọng và lý do với Quản lý khối.\n2. Quản lý khối xem xét năng lực thực tế của con (qua điểm các buổi gần nhất, kết quả kiểm tra định kỳ).\n3. Quản lý khối nhập thông tin học sinh vào lớp mới và xóa khỏi lớp cũ trong hệ thống; trợ giảng của cả lớp cũ và lớp mới đều được thông báo.\n4. Lịch học và lớp mới sẽ cập nhật ngay trong tài khoản của con.'
    },
    // ============ TÀI LIỆU & THÀNH TÍCH ============
    {
        id: 'documents',
        question: 'Có tài liệu học tập không?',
        keywords: [
            'tai lieu',
            'sach',
            'giao trinh',
            'de cuong',
            'tai lieu hoc tap',
            'download tai lieu',
            'tai tai lieu',
            'document'
        ],
        answer:
            'CMATH có hệ thống tài liệu nội bộ cho học sinh, trợ giảng và giáo viên. Phụ huynh có thể liên lạc với quản lí khối hoặc giáo viên để nhận được a.'
    },
    {
        id: 'achievements',
        question: 'Thành tích của CMATH?',
        keywords: [
            'thanh tich',
            'bang vang',
            'giai thuong',
            'ky thi',
            'huy chuong',
            'olympic',
            'amc',
            'imc',
            'ikmc',
            'myts',
            'hoc sinh gioi',
            'thi chuyen'
        ],
        answer:
            'Học sinh CMATH đạt nhiều thành tích nổi bật trong các kỳ thi:\n• Học sinh giỏi cấp Trường, Quận, Thành phố, Quốc gia.\n• Thi vào trường chuyên (Chuyên KHTN, Chuyên Sư phạm, Chuyên Amsterdam…).\n• Các cuộc thi Toán quốc tế: AMC, AMC 8, IMC, IKMC, IGO, MYTS…\n• Đặc biệt, một số học sinh đã đại diện Việt Nam dự thi Olympic Toán quốc tế (IMO).\nXem chi tiết tại mục "Bảng vàng thành tích" trên menu.'
    },
    // ============ KỸ THUẬT / WEB ============
    {
        id: 'website-tech',
        question: 'Website CMATH xây dựng bằng gì?',
        keywords: [
            'cong nghe',
            'lap trinh gi',
            'framework',
            'nextjs',
            'nodejs',
            'react',
            'cong nghe gi',
            'website lam tu',
            'antd',
            'ant design'
        ],
        answer:
            'Website CMATH gồm 2 phần:\n• Frontend: Next.js 14 (App Router) + TypeScript + Ant Design 5 — chạy trên trình duyệt.\n• Backend: Node.js + Express.js + Sequelize ORM, kết nối Microsoft SQL Server (Azure SQL) — cung cấp API.\n• Triển khai: Vercel cho cả frontend và backend, kết nối HTTPS.\nNgười dùng (giáo viên, trợ giảng, quản lý, học sinh) truy cập website qua trình duyệt; mọi dữ liệu được lưu tập trung trên MSSQL.'
    },
    {
        id: 'cant-login',
        question: 'Không đăng nhập được phải làm sao?',
        keywords: [
            'khong dang nhap',
            'loi dang nhap',
            'sai mat khau',
            'sai email',
            'khong vao duoc',
            'login bao loi',
            'khong vao tai khoan',
            'bi khoa tai khoan'
        ],
        answer:
            'Nếu phụ huynh không đăng nhập được, hãy kiểm tra:\n1. Email đã đúng chưa (kiểm tra dấu cách, dấu chấm, .com vs .vn…).\n2. Mật khẩu đã đúng chưa (lưu ý chữ hoa/chữ thường, gõ tiếng Việt).\n3. Kết nối Internet ổn định.\n4. Thử trình duyệt khác (Chrome, Edge, Firefox).\nNếu vẫn không vào được, vui lòng để lại email đã đăng ký kèm tên học sinh tại đây, câu lạc bộ sẽ kiểm tra và hỗ trợ reset tài khoản giúp phụ huynh.'
    },
    // ============ ĐÓNG HỘI THOẠI ============
    {
        id: 'thanks',
        question: 'Cảm ơn',
        keywords: ['cam on', 'thank', 'cam on ban', 'cam on bot', 'thanks', 'thank you', 'tks', 'ok'],
        answer:
            'Dạ không có gì ạ! Nếu phụ huynh còn câu hỏi nào khác, hãy nhắn tiếp ở đây. Khi có nhân viên CMATH rảnh, sẽ có người trả lời trực tiếp phụ huynh ngay ạ.'
    },
    {
        id: 'goodbye',
        question: 'Tạm biệt',
        keywords: ['tam biet', 'bye', 'goodbye', 'see you', 'hen gap lai', 'di nhe'],
        answer:
            'Dạ, cảm ơn phụ huynh đã trao đổi với CMATH. Chúc phụ huynh và gia đình một ngày tốt lành! Mọi lúc cần hỗ trợ, phụ huynh cứ quay lại trang web và nhắn tin tại đây nhé ạ.'
    }
];

export type MatchResult = {
    entry: FAQEntry;
    isFallback: boolean;
};

export const matchAnswer = (message: string): MatchResult => {
    const normalized = ` ${normalize(message)} `;
    if (!normalized.trim()) {
        return {
            entry: { id: 'fallback', question: '', keywords: [], answer: FALLBACK_ANSWER },
            isFallback: true
        };
    }

    let bestEntry: FAQEntry | null = null;
    let bestScore = 0;

    for (const entry of FAQ) {
        let score = 0;
        for (const kw of entry.keywords) {
            const normKw = normalize(kw);
            if (!normKw) continue;
            if (normalized.includes(` ${normKw} `)) {
                score += normKw.split(' ').length + 1;
            } else if (normalized.includes(normKw)) {
                score += normKw.split(' ').length;
            }
        }
        if (score > bestScore) {
            bestScore = score;
            bestEntry = entry;
        }
    }

    if (!bestEntry || bestScore === 0) {
        return {
            entry: { id: 'fallback', question: '', keywords: [], answer: FALLBACK_ANSWER },
            isFallback: true
        };
    }

    return { entry: bestEntry, isFallback: false };
};
