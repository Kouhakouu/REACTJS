'use client'
import { useEffect, useState } from 'react';
import { Button, Card, Typography, Space, Row, Col, Input, Table, Upload, message, AutoComplete } from 'antd';
import { CloseOutlined, UploadOutlined } from '@ant-design/icons';
import * as XLSX from 'xlsx';

const { Title, Text } = Typography;

const scores: number[] = [0, 0.25, 0.5, 0.75, 1];

interface TaskScores {
    [key: string]: number;
}

interface SubmittedData {
    key: number;
    name: string;
    doneTasks: number;
    totalScore: number;
    incorrectTasks: string;
    missingTasks: string;
    presentation: string;
    skills: string;
    comments: string;
}

const ChildrenHomework = () => {
    const [customTasks, setCustomTasks] = useState<string>(''); // Chuỗi chứa danh sách bài tập nhập vào
    const [initialTasks, setInitialTasks] = useState<string[]>([]); // Danh sách bài tập thực tế

    // State của phần chấm điểm
    const [taskScores, setTaskScores] = useState<TaskScores>(
        Object.fromEntries(initialTasks.map(task => [task, -1]))
    );
    // State lưu tên học sinh được nhập (chỉ được chọn từ danh sách sau upload)
    const [studentName, setStudentName] = useState<string>('');
    // State bảng kết quả hiển thị (các học sinh đã được chấm điểm)
    const [submittedData, setSubmittedData] = useState<SubmittedData[]>([]);
    // State lưu danh sách tên học sinh từ file Excel (chỉ chứa cột "họ và tên")
    const [studentList, setStudentList] = useState<string[]>([]);
    const [presentation, setPresentation] = useState<string>('');
    const [skills, setSkills] = useState<string>('');
    const [comments, setComments] = useState<string>('');

    // Hàm cập nhật điểm của từng bài theo cách cũ
    const handleScoreChange = (task: string, score: number) => {
        setTaskScores(prev => ({
            ...prev,
            [task]: prev[task] === -1 ? score : Math.min(prev[task] + score, 1)
        }));
    };

    const resetScoreForTask = (task: string) => {
        setTaskScores(prev => ({ ...prev, [task]: -1 }));
    };

    const resetScores = () => {
        setTaskScores(Object.fromEntries(initialTasks.map(task => [task, -1])));
    };


    // Tính toán thông tin từ các điểm đã nhập
    const doneTasks = Object.entries(taskScores).filter(([_, score]) => score > -1);
    const totalScore = doneTasks.reduce((sum, [_, score]) => sum + score, 0);
    const incorrectTasks = doneTasks.filter(([_, score]) => score > -1 && score < 1).map(([task]) => task);
    const missingTasks = Object.entries(taskScores).filter(([_, score]) => score === -1).map(([task]) => task);
    const score = totalScore / initialTasks.length;
    useEffect(() => {
        setTaskScores(Object.fromEntries(initialTasks.map(task => [task, -1])));
    }, [initialTasks]); // Khi danh sách bài tập thay đổi, reset điểm

    useEffect(() => {
        if (score <= 0.3) {
            setPresentation("Khá");
            setSkills("Trung bình");
        } else if (score > 0.3 && score < 0.7) {
            setPresentation("Khá");
            setSkills("Khá");
        } else {
            setPresentation("Tốt");
            setSkills("Tốt");
        }
    }, [totalScore]);

    useEffect(() => {
        if (skills === "Tốt") {
            setComments("Bài tập về nhà con làm tốt, cần tiếp tục phát huy");
        } else if (skills === "Tốt" && presentation === "Khá") {
            setComments("Bài tập về nhà con hoàn thiện khá tốt, tuy nhiên còn nhiều ý con mắc lỗi trong trình bày và lập luận, con cần xem lại cách trình bày để hoàn thiện bài hơn");
        } else if (skills === "Khá" && presentation === "Khá") {
            setComments("Con hoàn thiện bài tập về nhà ở mức độ khá, tuy nhiên phần bài tập đã làm mắc một số lỗi lập luận và trình bày, còn khá nhiều bài tập con chưa có hướng làm. Con chú ý sửa lại các chỗ sai, đồng thời dành thêm thời gian suy nghĩ các bài tập chưa làm được");
        } else if (skills === "Trung bình") {
            setComments("Bài tập về nhà con chưa làm được nhiều, cần đầu tư nhiều thời gian suy nghĩ bài hơn, chú ý đọc kĩ vở ghi của thầy trước khi làm để nắm chắc kiến thức, cố gắng hoàn thiện các bài tập tương tự trên lớp");
        }
    }, [skills, presentation]);

    // Xử lý upload file Excel: 
    const handleFileUpload = (file: File) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const binaryStr = e.target?.result;
            const workbook = XLSX.read(binaryStr, { type: 'binary' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

            console.log("Dữ liệu từ file Excel:", jsonData); // LOG dữ liệu từ file Excel

            if (!jsonData || jsonData.length === 0) {
                message.error("File Excel không chứa dữ liệu hợp lệ!");
                return;
            }

            // Map dữ liệu đúng với các cột
            const parsedData = jsonData.map((row: any, index: number) => {
                const name = row["Họ và Tên"]?.toString().trim() || '';

                // Xử lý cột "Tổng số BTVN đã làm" dạng "15/20"
                const doneTasksParts = row["Tổng số BTVN đã làm"]?.toString().split("/") || ["0", `${initialTasks.length}`];
                const doneTasks = Number(doneTasksParts[0]) || 0;

                // Xử lý cột "Tổng số BTVN làm đúng" dạng "12/15"
                const totalScoreParts = row["Tổng số BTVN làm đúng"]?.toString().split("/") || ["0", `${doneTasks}`];
                const totalScore = Number(totalScoreParts[0]) || 0;

                // Giữ nguyên dữ liệu bài sai và bài thiếu
                const incorrectTasks = row["Tên bài sai"]?.toString() || '';
                const missingTasks = row["Tên bài thiếu"]?.toString() || '';
                const presentation = row["Trình bày"]?.toString() || '';
                const skills = row["Kĩ năng"]?.toString() || '';
                const comments = row["Nhận xét"]?.toString() || '';
                return {
                    key: index + 1,
                    name,
                    doneTasks,
                    totalScore,
                    incorrectTasks,
                    missingTasks,
                    presentation,
                    skills,
                    comments,
                };
            });

            console.log("Dữ liệu sau khi parse:", parsedData); // LOG dữ liệu sau khi xử lý

            setStudentList(parsedData.map(item => item.name)); // Cập nhật danh sách học sinh
            setSubmittedData(parsedData); // Hiển thị bảng dữ liệu từ file Excel
            message.success('File Excel đã được tải lên thành công!');
        };

        reader.onerror = () => {
            message.error('Lỗi khi đọc file Excel!');
        };

        reader.readAsBinaryString(file);
        return false; // Ngăn Upload tự động gửi file
    };

    // Xử lý khi ấn Submit: kiểm tra tên có trong danh sách từ file Excel không, sau đó tính toán và thêm vào bảng kết quả
    const handleSubmit = () => {
        if (!studentName) {
            message.error("Vui lòng nhập tên học sinh!");
            return;
        }
        if (!studentList.includes(studentName)) {
            message.error("Tên học sinh không có trong danh sách (file Excel)!");
            return;
        }

        // **Cập nhật nhận xét trước khi lưu**
        let newComments = "";
        if (skills === "Tốt") {
            newComments = "Bài tập về nhà con làm tốt, cần tiếp tục phát huy";
        } else if (skills === "Tốt" && presentation === "Khá") {
            newComments = "Bài tập về nhà con hoàn thiện khá tốt, tuy nhiên còn nhiều ý con mắc lỗi trong trình bày và lập luận, con cần xem lại cách trình bày để hoàn thiện bài hơn";
        } else if (skills === "Khá" && presentation === "Khá") {
            newComments = "Con hoàn thiện bài tập về nhà ở mức độ khá, tuy nhiên phần bài tập đã làm mắc một số lỗi lập luận và trình bày, còn khá nhiều bài tập con chưa có hướng làm. Con chú ý sửa lại các chỗ sai, đồng thời dành thêm thời gian suy nghĩ các bài tập chưa làm được";
        } else if (skills === "Trung bình") {
            newComments = "Bài tập về nhà con chưa làm được nhiều, cần đầu tư nhiều thời gian suy nghĩ bài hơn, chú ý đọc kĩ vở ghi của thầy trước khi làm để nắm chắc kiến thức, cố gắng hoàn thiện các bài tập tương tự trên lớp";
        }

        const existingIndex = submittedData.findIndex(record => record.name === studentName);

        const updatedEntry: SubmittedData = {
            key: existingIndex !== -1 ? submittedData[existingIndex].key : submittedData.length + 1,
            name: studentName,
            doneTasks: doneTasks.length,
            totalScore: totalScore,
            incorrectTasks: incorrectTasks.length > 0 ? incorrectTasks.join('; ') : "0",
            missingTasks: missingTasks.length > 0 ? missingTasks.join('; ') : "0",
            presentation: presentation,
            skills: skills,
            comments: newComments,
        };

        let updatedData;
        if (existingIndex !== -1) {
            updatedData = [...submittedData];
            updatedData[existingIndex] = updatedEntry;
        } else {
            updatedData = [...submittedData, updatedEntry];
        }

        setSubmittedData(updatedData); // Cập nhật bảng kết quả
        setStudentName('');
        resetScores();
    };

    const exportToExcel = () => {
        // Xử lý dữ liệu trước khi xuất ra file Excel
        const exportData = submittedData.map(item => ({
            'Họ và Tên': item.name,
            'Tổng số BTVN đã làm': `${item.doneTasks} / ${initialTasks.length}`,
            'Tổng số BTVN làm đúng': `${item.totalScore} / ${item.doneTasks}`,
            'Tên bài Sai': item.incorrectTasks,
            'Tên bài Thiếu': item.missingTasks,
            'Trình bày': item.presentation,
            'Kĩ năng': item.skills,
            'Nhận xét': item.comments,
        }));

        const ws = XLSX.utils.json_to_sheet(exportData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Homework Results");
        XLSX.writeFile(wb, "Homework Results.xlsx");
    };



    // Các option cho AutoComplete dựa trên danh sách học sinh từ file Excel
    const autoCompleteOptions = studentList.map(name => ({ value: name }));

    const columns = [
        { title: 'Họ và Tên', dataIndex: 'name', key: 'name' },
        {
            title: 'Tổng số BTVN đã làm',
            dataIndex: 'doneTasks',
            key: 'doneTasks',
            render: (doneTasks: number) => `${doneTasks} / ${initialTasks.length}`
        },
        {
            title: 'Tổng số BTVN làm đúng',
            dataIndex: 'totalScore',
            key: 'totalScore',
            render: (totalScore: number, record: SubmittedData) => `${totalScore} / ${record.doneTasks}`
        },
        { title: 'Tên bài Sai', dataIndex: 'incorrectTasks', key: 'incorrectTasks' },
        { title: 'Tên bài Thiếu', dataIndex: 'missingTasks', key: 'missingTasks' },
        { title: 'Trình bày', dataIndex: 'presentation', key: 'presentation' },
        { title: 'Kĩ năng', dataIndex: 'skills', key: 'skills' },
        {
            title: 'Nhận xét', dataIndex: 'comments', key: 'comments', ellipsis: false
        },
    ];

    return (
        <div className="p-4 max-w-4xl mx-auto">
            <Title level={2} style={{ textAlign: 'center' }}>Children Homework Tracker</Title>

            {/* Phần upload file Excel */}
            <Card style={{ marginBottom: '20px' }}>
                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                    <Upload beforeUpload={handleFileUpload} showUploadList={false} accept=".xlsx, .xls">
                        <Button icon={<UploadOutlined />}>Upload File Excel</Button>
                    </Upload>
                </Space>
            </Card>

            <Row gutter={24}>
                <Col span={12}>
                    <Space direction="vertical" size={0} style={{ width: '100%' }}>
                        {initialTasks.map(task => (
                            <Card key={task} size="small" style={{ width: '100%', height: '35px' }}>
                                <Space size="middle" style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                                    <Text strong>{task}</Text>
                                    <Space>
                                        {taskScores[task] > -1 && (
                                            <Button type="text" danger icon={<CloseOutlined />} onClick={() => resetScoreForTask(task)} />
                                        )}
                                        {scores.map(score => (
                                            <Button
                                                key={score}
                                                type={taskScores[task] === score ? 'primary' : 'default'}
                                                onClick={() => handleScoreChange(task, score)}
                                            >
                                                {score}
                                            </Button>
                                        ))}
                                    </Space>
                                </Space>
                            </Card>
                        ))}
                    </Space>
                </Col>
                <Col span={12}>
                    <Card style={{ marginBottom: '20px' }}>
                        <Title level={4}>Nhập danh sách bài tập (cách nhau bằng dấu phẩy)</Title>
                        <Space direction="horizontal" style={{ width: '100%' }}>
                            <Input
                                placeholder="Nhập bài tập: 1a, 2,..."
                                value={customTasks}
                                onChange={(e) => setCustomTasks(e.target.value)}
                                style={{ flex: 1, minWidth: '150px' }}
                            />
                            <Button type="primary" onClick={() => {
                                const tasks = customTasks.split(',').map(task => task.trim()).filter(task => task !== '');
                                if (tasks.length > 0) {
                                    setInitialTasks(tasks); // Cập nhật danh sách bài tập
                                    setTaskScores(Object.fromEntries(tasks.map(task => [task, -1]))); // Reset điểm
                                } else {
                                    message.error("Danh sách bài tập không hợp lệ!");
                                }
                            }}>
                                Xác nhận
                            </Button>
                        </Space>
                    </Card>

                    <Card>
                        <Title level={3}>Summary (chú ý hệ thống chấm theo nguyên tắc cộng dồn)</Title>
                        <Text><strong>Làm:</strong> {doneTasks.length} / {initialTasks.length}</Text><br />
                        <Text><strong>Đúng:</strong> {totalScore} / {doneTasks.length}</Text><br />
                        <Text><strong>Sai:</strong> {incorrectTasks.join(', ') || 'Không có'}</Text><br />
                        <Text><strong>Thiếu:</strong> {missingTasks.join(', ') || 'Không có'}</Text><br />
                        {/* Dùng AutoComplete để đảm bảo chỉ được chọn tên từ danh sách file Excel */}
                        <AutoComplete
                            style={{ width: '100%', margin: '10px 0' }}
                            options={autoCompleteOptions}
                            placeholder="Nhập tên học sinh"
                            value={studentName}
                            onChange={setStudentName}
                            filterOption={(inputValue, option) =>
                                option!.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                            }
                        />
                        <Button type="primary" onClick={handleSubmit} style={{ width: '100%' }}>
                            Submit
                        </Button>
                        <Button type="default" onClick={exportToExcel} style={{ width: '100%', marginTop: '10px' }}>
                            Xuất Excel
                        </Button>
                    </Card>
                </Col>
            </Row>
            <Title level={3} style={{ marginLeft: '10px', marginTop: '20px' }}>Bảng Kết Quả</Title>
            <Table dataSource={submittedData} columns={columns} />
        </div>
    );
};

export default ChildrenHomework;
