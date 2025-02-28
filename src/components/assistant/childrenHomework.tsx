'use client'
import React, { useState } from 'react';
import { Button, Card, Typography, Space, Row, Col, Input, Table } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import * as XLSX from 'xlsx';

const { Title, Text } = Typography;
const initialTasks: string[] = [
    "1", "2", "3", "4", "5a", "5b", "6a", "6b", "7a", "7b", "8", "9", "10", "11", "12", "13", "14", "15",
];
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
    mark: string;
}

const ChildrenHomework: React.FC = () => {
    const [taskScores, setTaskScores] = useState<TaskScores>(
        Object.fromEntries(initialTasks.map(task => [task, -1]))
    );
    const [studentName, setStudentName] = useState<string>('');
    const [submittedData, setSubmittedData] = useState<SubmittedData[]>([]);

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

    const doneTasks = Object.entries(taskScores).filter(([_, score]) => score > -1);
    const totalScore = doneTasks.reduce((sum, [_, score]) => sum + score, 0);
    const incorrectTasks = doneTasks.filter(([_, score]) => score > -1 && score < 1).map(([task]) => task);
    const missingTasks = Object.entries(taskScores).filter(([_, score]) => score === -1).map(([task]) => task);
    let mark = (totalScore / initialTasks.length) * 10;

    const handleSubmit = () => {
        if (!studentName) {
            alert("Vui lòng nhập tên học sinh!");
            return;
        }

        const newEntry: SubmittedData = {
            key: submittedData.length + 1,
            name: studentName,
            doneTasks: doneTasks.length,
            totalScore: totalScore,
            incorrectTasks: incorrectTasks.join(', '),
            missingTasks: missingTasks.join(', '),
            mark: mark.toFixed(2),
        };

        setSubmittedData([...submittedData, newEntry]);
        setStudentName('');
        resetScores();
    };

    const exportToExcel = () => {
        const ws = XLSX.utils.json_to_sheet(submittedData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Homework Results");
        XLSX.writeFile(wb, "homework_results.xlsx");
    };

    const columns = [
        { title: 'Họ và Tên', dataIndex: 'name', key: 'name' },
        { title: 'Bài Làm', dataIndex: 'doneTasks', key: 'doneTasks' },
        { title: 'Bài Đúng', dataIndex: 'totalScore', key: 'totalScore' },
        { title: 'Bài Sai', dataIndex: 'incorrectTasks', key: 'incorrectTasks' },
        { title: 'Bài Thiếu', dataIndex: 'missingTasks', key: 'missingTasks' },
        { title: 'Điểm', dataIndex: 'mark', key: 'mark' },
    ];

    return (
        <div className="p-4 max-w-4xl mx-auto">
            <Title level={2} style={{ textAlign: 'center' }}>Children Homework Tracker</Title>
            <Row gutter={24}>
                <Col span={12}>
                    <Space direction="vertical" size={0} style={{ width: '100%' }}>
                        {initialTasks.map(task => (
                            <Card key={task} size="small" style={{ width: '100%', height: '45px' }}>
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
                    <Card>
                        <Title level={3}>Summary</Title>
                        <Text><strong>Làm:</strong> {doneTasks.length} / {initialTasks.length}</Text><br />
                        <Text><strong>Đúng:</strong> {totalScore}</Text><br />
                        <Text><strong>Sai:</strong> {incorrectTasks.join(', ') || 'Không có'}</Text><br />
                        <Text><strong>Thiếu:</strong> {missingTasks.join(', ') || 'Không có'}</Text><br />
                        <Input
                            placeholder="Nhập tên học sinh"
                            value={studentName}
                            onChange={(e) => setStudentName(e.target.value)}
                            style={{ margin: '10px 0' }}
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
            <Title level={3} style={{ marginTop: '20px' }}>Bảng Kết Quả</Title>
            <Table dataSource={submittedData} columns={columns} pagination={{ pageSize: 5 }} />
        </div>
    );
};

export default ChildrenHomework;
