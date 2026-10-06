import React from 'react';
import { Alert, Space, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import * as XLSX from 'xlsx';

// Đọc file Excel "Danh sách học viên" dùng chung cho 2 chế độ:
// tạo buổi học (createLessonFromExcelModal) và cập nhật danh sách lớp (importClassStudentsFromExcelModal)

export interface ExcelStudentRow {
    key: number;
    rowNumber: number;    // số dòng trong file Excel (dòng tiêu đề là 1)
    studentCode: string;
    fullName: string;
    DOB: string;          // 'YYYY-MM-DD', rỗng nếu không đọc được
    DOBRaw: string;       // giá trị gốc trong file, dùng để hiển thị khi parse lỗi
    school: string;
    parentEmail: string;
    parentPhoneNumber: string;
    studyStatus: string;
}

export interface ExcelClassInfo {
    courseCode: string;
    classCode: string;
    className: string;
}

export interface ParsedStudentWorkbook {
    rows: ExcelStudentRow[];
    classInfo: ExcelClassInfo;
    classCodes: string[]; // các mã lớp khác nhau xuất hiện trong file
}

// Kết quả backend trả về (dùng chung cho xem trước và kết quả thật)
export interface StudentSummary {
    id: number;
    fullName: string;
    DOB: string;
}

export interface InactiveRow {
    rowNumber: number;
    fullName: string;
    studyStatus: string;
}

export interface SkippedRow {
    rowNumber: number;
    fullName: string;
    reason: string;
}

// Bỏ dấu tiếng Việt + hạ chữ thường để so khớp tên cột linh hoạt
const normalizeHeader = (header: string): string =>
    String(header || '')
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '')
        .replace(/đ/gi, 'd')
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '');

const HEADER_ALIASES: Record<keyof Omit<ExcelStudentRow, 'key' | 'rowNumber' | 'DOB' | 'DOBRaw'> | 'dob', string[]> = {
    studentCode: ['mahocvien', 'mahs', 'mahocsinh'],
    fullName: ['hocsinh', 'hovaten', 'hoten', 'tenhocsinh', 'hovatenhocsinh'],
    dob: ['ngaythangnamsinh', 'ngaysinh', 'dob'],
    school: ['truonghoc', 'truong'],
    parentEmail: ['email', 'emailphuhuynh', 'mailphuhuynh'],
    parentPhoneNumber: ['sdtphuhuynh', 'sodienthoaiphuhuynh', 'sdtph', 'dienthoaiphuhuynh'],
    studyStatus: ['trangthaihoc', 'trangthai']
};

const CLASS_HEADER_ALIASES: Record<keyof ExcelClassInfo, string[]> = {
    courseCode: ['makhoa'],
    classCode: ['malop'],
    className: ['tenlop']
};

// Trong file Excel, ô có thể là số serial của Excel hoặc chuỗi dd/mm/yyyy.
// Không đọc với cellDates: SheetJS dựng Date theo múi giờ máy, ở Asia/Ho_Chi_Minh bị lệch
// ~30 giây về 23:59:30 hôm trước nên ngày sinh bị lùi 1 ngày. parse_date_code không phụ thuộc múi giờ.
const parseExcelDate = (value: unknown): string => {
    if (value === null || value === undefined || value === '') return '';

    if (typeof value === 'number') {
        const parsed = XLSX.SSF.parse_date_code(value);
        if (!parsed) return '';
        return `${parsed.y}-${String(parsed.m).padStart(2, '0')}-${String(parsed.d).padStart(2, '0')}`;
    }

    const text = String(value).trim();
    if (!text) return '';

    const isoMatch = text.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})$/);
    if (isoMatch) {
        return `${isoMatch[1]}-${isoMatch[2].padStart(2, '0')}-${isoMatch[3].padStart(2, '0')}`;
    }

    const vnMatch = text.match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{4})$/);
    if (vnMatch) {
        return `${vnMatch[3]}-${vnMatch[2].padStart(2, '0')}-${vnMatch[1].padStart(2, '0')}`;
    }

    return '';
};

// Chỉ học sinh "Đang học" được dùng khi import; "Bảo lưu"/"Chờ thanh toán"... bị bỏ qua
export const isActiveStatus = (status: string): boolean => normalizeHeader(status) === 'danghoc';

const findRawValue = (row: Record<string, unknown>, aliases: string[]): unknown => {
    for (const [header, value] of Object.entries(row)) {
        if (aliases.includes(normalizeHeader(header))) return value;
    }
    return '';
};

const findValue = (row: Record<string, unknown>, aliases: string[]): string => {
    const value = findRawValue(row, aliases);
    return value === null || value === undefined ? '' : String(value).trim();
};

export const formatISODate = (dob?: string) => (dob ? dob.split('-').reverse().join('/') : '');

export const formatRowDOB = (row: ExcelStudentRow) => formatISODate(row.DOB) || row.DOBRaw || '—';

const readFileAsArrayBuffer = (file: File) => new Promise<ArrayBuffer>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target?.result as ArrayBuffer);
    reader.onerror = () => reject(new Error('Lỗi khi đọc file Excel!'));
    reader.readAsArrayBuffer(file);
});

export const parseStudentWorkbook = async (file: File): Promise<ParsedStudentWorkbook> => {
    const buffer = await readFileAsArrayBuffer(file);

    let jsonData: Record<string, unknown>[];
    try {
        const workbook = XLSX.read(buffer, { type: 'array' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        jsonData = XLSX.utils.sheet_to_json<Record<string, unknown>>(worksheet, { defval: '' });
    } catch (error) {
        console.error('Parse excel error:', error);
        throw new Error('Không đọc được file Excel. Vui lòng kiểm tra lại định dạng file.');
    }

    if (!jsonData || jsonData.length === 0) {
        throw new Error('File Excel không chứa dữ liệu!');
    }

    const rows: ExcelStudentRow[] = jsonData
        .map((row, index) => {
            const dobRaw = findRawValue(row, HEADER_ALIASES.dob);
            // sheet_to_json gắn __rowNum__ (đếm từ 0) cho mỗi dòng, kể cả khi có dòng trống xen giữa
            const rowNum = (row as { __rowNum__?: number }).__rowNum__;
            return {
                key: index,
                rowNumber: typeof rowNum === 'number' ? rowNum + 1 : index + 2,
                studentCode: findValue(row, HEADER_ALIASES.studentCode),
                // NFC để tên gõ bằng Unicode tổ hợp lưu về cùng dạng với Unicode dựng sẵn
                fullName: findValue(row, HEADER_ALIASES.fullName).normalize('NFC').replace(/\s+/g, ' '),
                DOB: parseExcelDate(dobRaw),
                DOBRaw: String(dobRaw ?? '').trim(),
                school: findValue(row, HEADER_ALIASES.school),
                parentEmail: findValue(row, HEADER_ALIASES.parentEmail),
                parentPhoneNumber: findValue(row, HEADER_ALIASES.parentPhoneNumber),
                studyStatus: findValue(row, HEADER_ALIASES.studyStatus)
            };
        })
        .filter(row => row.fullName);

    if (rows.length === 0) {
        throw new Error('Không tìm thấy cột "Học sinh" trong file Excel!');
    }

    const firstRow = jsonData[0];
    const classCodes = Array.from(new Set(
        jsonData.map(row => findValue(row, CLASS_HEADER_ALIASES.classCode)).filter(Boolean)
    ));

    return {
        rows,
        classInfo: {
            courseCode: findValue(firstRow, CLASS_HEADER_ALIASES.courseCode),
            classCode: findValue(firstRow, CLASS_HEADER_ALIASES.classCode),
            className: findValue(firstRow, CLASS_HEADER_ALIASES.className)
        },
        classCodes
    };
};

// Gửi toàn bộ dòng lên backend; backend tự lọc "Đang học" và trả lại danh sách bị bỏ qua
export const toStudentPayload = (rows: ExcelStudentRow[]) => rows.map(row => ({
    rowNumber: row.rowNumber,
    studentCode: row.studentCode,
    fullName: row.fullName,
    DOB: row.DOB,
    school: row.school,
    parentEmail: row.parentEmail,
    parentPhoneNumber: row.parentPhoneNumber,
    studyStatus: row.studyStatus
}));

export const postExcelImport = async <T,>(url: string, body: unknown, headers: Record<string, string>): Promise<T> => {
    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...headers },
        body: JSON.stringify(body)
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
        throw new Error(data.message || `Lỗi HTTP: ${response.status}`);
    }
    return data as T;
};

// ---------- Thành phần hiển thị dùng chung cho bản xem trước ----------

interface FileClassAlertProps {
    parsed: ParsedStudentWorkbook;
    fileName: string;
    systemClassName?: string;
}

// So sánh lớp ghi trong file với lớp đang mở để quản lý phát hiện chọn nhầm file
export const FileClassAlert = ({ parsed, fileName, systemClassName }: FileClassAlertProps) => {
    const { classInfo, classCodes, rows } = parsed;
    return (
        <>
            <Alert
                style={{ marginTop: 16, overflowWrap: 'anywhere' }}
                type="info"
                showIcon
                message={`File: ${fileName}`}
                description={
                    <Space size="large" wrap>
                        <span>Lớp trong file: <strong>{classInfo.className || '—'}</strong></span>
                        <span>Mã khoá: {classInfo.courseCode || '—'}</span>
                        <span>Mã lớp: {classInfo.classCode || '—'}</span>
                        <span>Lớp đang chọn: <strong>{systemClassName || '—'}</strong></span>
                        <span>Số dòng học sinh: {rows.length}</span>
                    </Space>
                }
            />
            {classCodes.length > 1 && (
                <Alert
                    style={{ marginTop: 8 }}
                    type="warning"
                    showIcon
                    message={`File chứa ${classCodes.length} mã lớp khác nhau: ${classCodes.join(', ')}`}
                    description="Hãy chắc chắn đây là đúng file của lớp đang chọn."
                />
            )}
        </>
    );
};

const inactiveColumns: ColumnsType<InactiveRow> = [
    { title: 'Dòng', dataIndex: 'rowNumber', key: 'rowNumber', width: 70 },
    { title: 'Học sinh', dataIndex: 'fullName', key: 'fullName' },
    { title: 'Trạng thái học', dataIndex: 'studyStatus', key: 'studyStatus', width: 180 }
];

export const InactiveRowsTable = ({ rows }: { rows: InactiveRow[] }) => (
    <Table
        dataSource={rows}
        columns={inactiveColumns}
        rowKey="rowNumber"
        size="small"
        pagination={false}
        scroll={{ x: 'max-content', y: 320 }}
        locale={{ emptyText: 'Không có' }}
    />
);

const skippedColumns: ColumnsType<SkippedRow> = [
    { title: 'Dòng', dataIndex: 'rowNumber', key: 'rowNumber', width: 70 },
    { title: 'Học sinh', dataIndex: 'fullName', key: 'fullName' },
    { title: 'Lý do', dataIndex: 'reason', key: 'reason' }
];

export const SkippedRowsTable = ({ rows }: { rows: SkippedRow[] }) => (
    <Table
        dataSource={rows}
        columns={skippedColumns}
        rowKey={(row) => `${row.rowNumber}-${row.fullName}`}
        size="small"
        pagination={false}
        scroll={{ x: 'max-content', y: 320 }}
        locale={{ emptyText: 'Không có' }}
    />
);
