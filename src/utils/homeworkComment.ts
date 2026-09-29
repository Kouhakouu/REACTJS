// Các mẫu câu nhận xét quá trình học trên lớp của học sinh
export const CLASSROOM_COMMENTS: string[] = [
    "Trong giờ con học chăm chỉ, chú ý nghe giảng.",
    "Con tập trung trong giờ học, có chú ý nghe thầy giảng và suy nghĩ các bài tập thầy giao",
    "Trong giờ con học tập trung, tích cực suy nghĩ các bài toán được giao",
    "Trong giờ con học tập trung, có ý thức nghe giảng và suy nghĩ bài",
    "Trong giờ con học chăm chỉ, hăng hái suy nghĩ bài",
    "Trong giờ con học chăm chỉ, chịu khó nghĩ và làm bài",
    "Trong giờ con chú ý nghe giảng, giữ trật tự và suy nghĩ các bài tập thầy giao",
    "Trong giờ con tập trung nghe giảng và suy nghĩ bài",
    "Trong giờ con chăm chỉ nghe giảng, tích cực suy nghĩ bài",
    "Trong giờ con tập trung nghe giảng bài, suy nghĩ và làm bài",
    "Trong giờ con học nghiêm túc, chủ động suy nghĩ và làm bài",
];

export const getClassroomComment = (): string =>
    CLASSROOM_COMMENTS[Math.floor(Math.random() * CLASSROOM_COMMENTS.length)];

// Nhận xét BTVN theo mức độ Trình bày / Kĩ năng
export const getHomeworkComment = (skills: string, presentation: string): string => {
    if (skills === "Tốt") {
        return "Bài tập về nhà con làm tốt, cần tiếp tục phát huy";
    } else if (skills === "Tốt" && presentation === "Khá") {
        return "Bài tập về nhà con hoàn thiện khá tốt, tuy nhiên còn nhiều ý con mắc lỗi trong trình bày và lập luận, con cần xem lại cách trình bày để hoàn thiện bài hơn";
    } else if (skills === "Khá" && presentation === "Khá") {
        return "Con hoàn thiện bài tập về nhà ở mức độ khá, tuy nhiên phần bài tập đã làm mắc một số lỗi lập luận và trình bày, còn khá nhiều bài tập con chưa có hướng làm. Con chú ý sửa lại các chỗ sai, đồng thời dành thêm thời gian suy nghĩ các bài tập chưa làm được";
    }
    return "Bài tập về nhà con chưa làm được nhiều, cần đầu tư nhiều thời gian suy nghĩ bài hơn, chú ý đọc kĩ vở ghi của thầy trước khi làm để nắm chắc kiến thức, cố gắng hoàn thiện các bài tập tương tự trên lớp";
};

// Nhận xét đầy đủ gồm 2 dòng: quá trình học trên lớp + BTVN
export const buildComment = (skills: string, presentation: string): string =>
    `${getClassroomComment()}\n${getHomeworkComment(skills, presentation)}`;
