// Upload file PDF bài đã chấm của 1 học sinh.
// Backend chạy trên Vercel chặn request > 4.5MB (báo "Failed to fetch" ở trình duyệt), nên file
// được gửi thẳng lên Cloudinary bằng chữ ký backend cấp, rồi chỉ báo lại public_id cho backend lưu DB.

export const MAX_GRADED_FILE_SIZE = 10 * 1024 * 1024; // khớp giới hạn 10MB ở backend

export interface GradedFile {
    url: string;
    name: string | null;
}

interface UploadSignature {
    uploadUrl: string;
    apiKey: string;
    signature: string;
    folder: string;
    public_id: string;
    timestamp: number;
}

const readJson = async (res: Response) => res.json().catch(() => ({} as any));

export const uploadGradedFile = async ({ classId, lessonId, studentId, file, token }: {
    classId: number;
    lessonId: number;
    studentId: number;
    file: File;
    token: string | null | undefined;
}): Promise<GradedFile> => {
    const endpoint = `${process.env.NEXT_PUBLIC_BACKEND_PORT}/assistant/classes/${classId}/lessons/${lessonId}/students/${studentId}/graded-file`;
    const authHeader = { 'Authorization': `Bearer ${token}` };

    // 1. Xin chữ ký upload
    const signRes = await fetch(`${endpoint}/signature`, { method: 'POST', headers: authHeader });
    const sign: UploadSignature = await readJson(signRes);
    if (!signRes.ok) throw new Error((sign as any).message || 'Không lấy được chữ ký upload');

    // 2. Upload thẳng lên Cloudinary
    const formData = new FormData();
    formData.append('file', file);
    formData.append('api_key', sign.apiKey);
    formData.append('timestamp', String(sign.timestamp));
    formData.append('signature', sign.signature);
    formData.append('folder', sign.folder);
    formData.append('public_id', sign.public_id);
    const cloudRes = await fetch(sign.uploadUrl, { method: 'POST', body: formData });
    const cloud = await readJson(cloudRes);
    if (!cloudRes.ok) throw new Error(cloud.error?.message || 'Upload lên Cloudinary thất bại');

    // 3. Báo backend lưu file vào học sinh
    const saveRes = await fetch(endpoint, {
        method: 'POST',
        headers: { ...authHeader, 'Content-Type': 'application/json' },
        body: JSON.stringify({
            publicId: cloud.public_id,
            version: cloud.version,
            signature: cloud.signature,
            fileName: file.name.normalize('NFC'),
        }),
    });
    const data = await readJson(saveRes);
    if (!saveRes.ok) throw new Error(data.message || 'Không lưu được file bài chấm');
    return data.gradedFile;
};
