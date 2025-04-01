'use client'

import { useEffect, useState, useContext } from 'react';
import { Button, Card, Typography, message, Table, Tabs, Collapse, Input, Space, AutoComplete, Row, Col, Divider } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { AuthContext } from '@/library/authContext';
import * as XLSX from 'xlsx';
import { formatDate } from '@/utils/formatDate';

const { Title, Text } = Typography;

// Các kiểu dữ liệu
interface AssistantClass {
    id: number;
    className: string;
}

interface Lesson {
    id: number;
    lessonContent: string;
    totalTaskLength: number;
    lessonDate: string;
}

interface Performance {
    doneTask: number;
    totalScore: number;
    incorrectTasks: string;
    missingTasks: string;
    presentation: string;
    skills: string;
    comment: string;
}

interface StudentPerformance {
    id: number;
    fullName: string;
    school: string;
    parentPhoneNumber: string;
    parentEmail: string;
    attendance: boolean;
    performance: Performance | null;
}

const scores: number[] = [0, 0.25, 0.5, 0.75, 1];

const StudentHomework = () => {
    const { token } = useContext(AuthContext);

    // State cho danh sách lớp, buổi học và dữ liệu học sinh (lấy từ DB)
    const [assistantClasses, setAssistantClasses] = useState<AssistantClass[]>([]);
    const [selectedClass, setSelectedClass] = useState<AssistantClass | null>(null);
    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
    const [lessonPerformance, setLessonPerformance] = useState<StudentPerformance[]>([]);

    // State cho phần chấm bài
    const [customTasks, setCustomTasks] = useState<string>('');
    const [initialTasks, setInitialTasks] = useState<string[]>([]);
    const [taskScores, setTaskScores] = useState<Record<string, number>>({});
    const [studentName, setStudentName] = useState<string>('');

    // Khi danh sách bài tập thay đổi, reset điểm của từng bài
    useEffect(() => {
        setTaskScores(Object.fromEntries(initialTasks.map(task => [task, -1])));
    }, [initialTasks]);

    // Tính toán thông tin chấm bài
    const doneTasks = Object.entries(taskScores).filter(([_, score]) => score > -1);
    const totalScore = doneTasks.reduce((sum, [_, score]) => sum + score, 0);
    const incorrectTasks = doneTasks.filter(([_, score]) => score > -1 && score < 1).map(([task]) => task);
    const missingTasks = Object.entries(taskScores).filter(([_, score]) => score === -1).map(([task]) => task);

    // Các hàm xử lý chấm bài
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

    // Hàm xuất dữ liệu ra Excel (giữ lại theo bố cục cũ)
    const exportToExcel = () => {
        const exportData = lessonPerformance.map(item => ({
            'Họ và Tên': item.fullName,
            'Tổng số BTVN đã làm': item.performance ? `${item.performance.doneTask} / ${initialTasks.length}` : `0 / ${initialTasks.length}`,
            'Tổng số BTVN làm đúng': item.performance ? `${item.performance.totalScore} / ${item.performance.doneTask}` : '0 / 0',
            'Tên bài sai': item.performance ? item.performance.incorrectTasks : '',
            'Tên bài thiếu': item.performance ? item.performance.missingTasks : '',
            'Trình bày': item.performance ? item.performance.presentation : '',
            'Kĩ năng': item.performance ? item.performance.skills : '',
            'Nhận xét': item.performance ? item.performance.comment : ''
        }));
        const ws = XLSX.utils.json_to_sheet(exportData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Homework Results");
        XLSX.writeFile(wb, "Homework_Results.xlsx");
    };

    // Lấy danh sách lớp học từ API
    useEffect(() => {
        if (!token) {
            message.error('Không tìm thấy token, không thể gọi API!');
            return;
        }
        const fetchClasses = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_PORT}/assistant/classes`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (!res.ok) throw new Error('Error fetching classes');
                const data: AssistantClass[] = await res.json();
                setAssistantClasses(data);
                if (data.length > 0) {
                    // Tự động chọn lớp đầu tiên
                    fetchLessonsForClass(data[0]);
                }
            } catch (error) {
                console.error(error);
                message.error('Không thể lấy danh sách lớp học');
            }
        };
        fetchClasses();
    }, [token]);

    // Hàm lấy danh sách buổi học cho lớp đã chọn
    const fetchLessonsForClass = async (assistantClass: AssistantClass) => {
        if (!token) return;
        setSelectedClass(assistantClass);
        setSelectedLesson(null);
        setLessonPerformance([]);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_PORT}/assistant/classes/${assistantClass.id}/lessons`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!res.ok) throw new Error('Error fetching lessons');
            const data: Lesson[] = await res.json();
            setLessons(data);
        } catch (error) {
            console.error(error);
            message.error('Không thể lấy danh sách buổi học');
        }
    };

    // Xử lý chuyển tab (chọn lớp)
    const handleTabChange = (activeKey: string) => {
        const classId = Number(activeKey);
        const assistantClass = assistantClasses.find(item => item.id === classId);
        if (assistantClass) {
            fetchLessonsForClass(assistantClass);
        }
    };

    // Khi mở một panel (buổi học) trong Collapse, gọi API lấy dữ liệu học sinh từ DB
    const handleLessonExpand = async (activeKey: string | string[] | null) => {
        if (!activeKey) {
            setSelectedLesson(null);
            setLessonPerformance([]);
            return;
        }
        const lessonId = Number(activeKey as string);
        const lesson = lessons.find(item => item.id === lessonId);
        if (lesson && selectedClass) {
            setSelectedLesson(lesson);
            // Tạo mảng tasks dựa trên totalTaskLength từ database
            const tasks = Array.from({ length: lesson.totalTaskLength }, (_, i) => `Bài ${i + 1}`);
            setInitialTasks(tasks);
            setTaskScores(Object.fromEntries(tasks.map(task => [task, -1])));
            try {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_BACKEND_PORT}/assistant/classes/${selectedClass.id}/lessons/${lesson.id}/students-performance`,
                    { headers: { 'Authorization': `Bearer ${token}` } }
                );
                if (!res.ok) throw new Error('Error fetching lesson performance');
                const data: StudentPerformance[] = await res.json();
                setLessonPerformance(data);
            } catch (error) {
                console.error(error);
                message.error('Không thể lấy hiệu suất học sinh của buổi học');
            }
        }
    };


    // Các option cho AutoComplete dựa trên danh sách học sinh lấy từ DB
    const autoCompleteOptions = lessonPerformance.map(item => ({
        value: item.fullName,
        label: (
            <div style={{ color: item.performance && item.performance.doneTask > 0 ? 'red' : 'black' }}>
                {item.fullName}
            </div>
        )
    }));

    // Hàm xử lý Submit chấm bài
    const handleSubmit = async () => {
        if (!studentName) {
            message.error("Vui lòng nhập tên học sinh!");
            return;
        }
        // Tìm học sinh theo tên trong danh sách của buổi học
        const studentRecord = lessonPerformance.find(item => item.fullName === studentName);
        if (!studentRecord) {
            message.error("Học sinh không tồn tại trong danh sách buổi học!");
            return;
        }
        // Tính điểm trung bình và xác định trình bày, kỹ năng
        const avgScore = initialTasks.length > 0 ? totalScore / initialTasks.length : 0;
        let presentation = "";
        let skills = "";
        if (avgScore <= 0.3) {
            presentation = "Khá";
            skills = "Trung bình";
        } else if (avgScore > 0.3 && avgScore < 0.7) {
            presentation = "Khá";
            skills = "Khá";
        } else {
            presentation = "Tốt";
            skills = "Tốt";
        }
        let comment = "";
        if (skills === "Tốt") {
            comment = "Bài tập về nhà con làm tốt, cần tiếp tục phát huy";
        } else if (skills === "Tốt" && presentation === "Khá") {
            comment = "Bài tập về nhà con hoàn thiện khá tốt, tuy nhiên còn nhiều ý con mắc lỗi trong trình bày và lập luận, con cần xem lại cách trình bày để hoàn thiện bài hơn";
        } else if (skills === "Khá" && presentation === "Khá") {
            comment = "Con hoàn thiện bài tập về nhà ở mức độ khá, tuy nhiên phần bài tập đã làm mắc một số lỗi lập luận và trình bày, còn khá nhiều bài tập con chưa có hướng làm. Con chú ý sửa lại các chỗ sai, đồng thời dành thêm thời gian suy nghĩ các bài tập chưa làm được";
        } else if (skills === "Trung bình") {
            comment = "Bài tập về nhà con chưa làm được nhiều, cần đầu tư nhiều thời gian suy nghĩ bài hơn, chú ý đọc kĩ vở ghi của thầy trước khi làm để nắm chắc kiến thức, cố gắng hoàn thiện các bài tập tương tự trên lớp";
        }
        const updatedPerformance: Performance = {
            doneTask: doneTasks.length,
            totalScore: totalScore,
            incorrectTasks: incorrectTasks.length > 0 ? incorrectTasks.join('; ') : "0",
            missingTasks: missingTasks.length > 0 ? missingTasks.join('; ') : "0",
            presentation,
            skills,
            comment,
        };
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_PORT}/assistant/classes/${selectedClass?.id}/lessons/${selectedLesson?.id}/students-performance/${studentRecord.id}`,
                {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                    body: JSON.stringify({ performance: updatedPerformance })
                }
            );
            if (!res.ok) throw new Error("Lỗi khi cập nhật chấm bài");
            // Cập nhật lại lessonPerformance sau khi chấm bài thành công
            const updatedList = lessonPerformance.map(item => {
                if (item.id === studentRecord.id) {
                    return { ...item, performance: updatedPerformance };
                }
                return item;
            });
            setLessonPerformance(updatedList);
            message.success("Chấm bài thành công!");
            // Reset lại giao diện chấm bài
            setStudentName('');
            resetScores();
            setCustomTasks('');
            setInitialTasks([]);
        } catch (error) {
            console.error(error);
            message.error("Không thể cập nhật chấm bài");
        }
    };

    // Định nghĩa columns cho bảng kết quả (Summary)
    const columns = [
        { title: 'Họ và Tên', dataIndex: 'fullName', key: 'fullName' },
        {
            title: 'Tổng số BTVN đã làm',
            dataIndex: ['performance', 'doneTask'],
            key: 'doneTask',
            render: (value: any, record: StudentPerformance) =>
                record.performance ? `${record.performance.doneTask} / ${initialTasks.length}` : `0 / ${initialTasks.length}`
        },
        {
            title: 'Tổng số BTVN làm đúng',
            dataIndex: ['performance', 'totalScore'],
            key: 'totalScore',
            render: (value: any, record: StudentPerformance) =>
                record.performance ? `${record.performance.totalScore} / ${record.performance.doneTask}` : '0 / 0'
        },
        { title: 'Tên bài sai', dataIndex: ['performance', 'incorrectTasks'], key: 'incorrectTasks' },
        { title: 'Tên bài thiếu', dataIndex: ['performance', 'missingTasks'], key: 'missingTasks' },
        { title: 'Trình bày', dataIndex: ['performance', 'presentation'], key: 'presentation' },
        { title: 'Kĩ năng', dataIndex: ['performance', 'skills'], key: 'skills' },
        { title: 'Nhận xét', dataIndex: ['performance', 'comment'], key: 'comment' },
    ];

    return (
        <div style={{ padding: '20px' }}>
            <Tabs onChange={handleTabChange} activeKey={selectedClass ? selectedClass.id.toString() : undefined} type="line">
                {assistantClasses.map(assistantClass => (
                    <Tabs.TabPane tab={`${assistantClass.className}`} key={assistantClass.id.toString()}>
                        {lessons.length > 0 ? (
                            <Collapse accordion onChange={handleLessonExpand}>
                                {lessons.map(lesson => (
                                    <Collapse.Panel header={`${formatDate(lesson.lessonDate)}: ${lesson.lessonContent} `} key={lesson.id.toString()}>
                                        {selectedLesson && selectedLesson.id === lesson.id ? (
                                            <>
                                                <Row gutter={24}>
                                                    <Col span={12}>
                                                        <Space direction="vertical" size={0} style={{ width: '100%' }}>
                                                            {initialTasks.map(task => (
                                                                <Card key={task} size="small" style={{ width: '100%', height: '50px' }}>
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
                                                                    const tasks = customTasks.split(',')
                                                                        .map(task => task.trim())
                                                                        .filter(task => task !== '');
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
                                                <Table dataSource={lessonPerformance} columns={columns} rowKey="id" />
                                            </>
                                        ) : (
                                            <Text>Chọn buổi học để xem chi tiết.</Text>
                                        )}
                                    </Collapse.Panel>
                                ))}
                            </Collapse>
                        ) : (
                            <Text>Không có buổi học nào.</Text>
                        )}
                    </Tabs.TabPane>
                ))}
            </Tabs>
        </div>
    );
};

export default StudentHomework;
