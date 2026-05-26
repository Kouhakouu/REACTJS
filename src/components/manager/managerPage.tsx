'use client'

import { useEffect, useState, useContext } from "react";
import { AuthContext } from "@/library/authContext";
import { Card, Row, Col, Typography, Spin, Alert, Statistic } from "antd";
import {
    TeamOutlined,
    BookOutlined,
    CheckCircleOutlined,
    TrophyOutlined,
} from "@ant-design/icons";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";

const { Title } = Typography;

interface DashboardData {
    summary: {
        classCount: number;
        totalStudents: number;
        totalLessons: number;
        overallAvgScore: number | null;
    };
    classNames: string[];
    scoreData: Array<{ week: string;[cls: string]: number | null | string }>;
    attendanceData: Array<{ week: string;[cls: string]: number | null | string }>;
}

const CLASS_COLORS = [
    "#1677ff", "#52c41a", "#fa8c16", "#722ed1",
    "#eb2f96", "#13c2c2", "#faad14", "#2f54eb",
];

const ManagerPage = () => {
    const { token } = useContext(AuthContext);
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!token) { setLoading(false); return; }
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_PORT}/manager/dashboard-stats`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => { if (!res.ok) throw new Error(`HTTP ${res.status}`); return res.json(); })
            .then((d) => { setData(d); setLoading(false); })
            .catch(() => { setError("Không thể tải dữ liệu tổng quan."); setLoading(false); });
    }, [token]);

    if (loading) return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
            <Spin size="large" />
        </div>
    );

    if (error) return <Alert message="Lỗi" description={error} type="error" showIcon />;
    if (!data) return null;

    const { summary, classNames, scoreData, attendanceData } = data;
    const hasData = scoreData.length > 0 || attendanceData.length > 0;

    const renderLines = () =>
        classNames.map((cls, i) => (
            <Line
                key={cls}
                type="monotone"
                dataKey={cls}
                name={cls}
                stroke={CLASS_COLORS[i % CLASS_COLORS.length]}
                strokeWidth={2}
                dot={{ r: 5 }}
                activeDot={{ r: 7 }}
                connectNulls={false}
            />
        ));

    return (
        <div style={{ padding: 24 }}>

            {/* Summary cards */}
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                <Col xs={24} sm={12}>
                    <Card bordered={false} style={{ background: "#e6f4ff" }}>
                        <Statistic
                            title="Số lớp quản lý"
                            value={summary.classCount}
                            prefix={<BookOutlined />}
                            valueStyle={{ color: "#1677ff" }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12}>
                    <Card bordered={false} style={{ background: "#f6ffed" }}>
                        <Statistic
                            title="Tổng số lượt học sinh"
                            value={summary.totalStudents}
                            prefix={<TeamOutlined />}
                            valueStyle={{ color: "#52c41a" }}
                        />
                    </Card>
                </Col>
            </Row>

            {!hasData ? (
                <Alert message="Chưa có dữ liệu buổi học trong 2 tuần gần nhất" type="info" showIcon />
            ) : (
                <Row gutter={[16, 16]}>
                    {/* Điểm trung bình */}
                    <Col xs={24} xl={12}>
                        <Card title="Điểm trung bình bài tập về nhà trong 2 tuần gần nhất" size="small">
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={scoreData} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="week" />
                                    <YAxis tickCount={6} />
                                    <Tooltip
                                        formatter={(value: unknown) =>
                                            value !== null ? [`${value} điểm`, ""] : ["Chưa có dữ liệu", ""]
                                        }
                                    />
                                    <Legend />
                                    {renderLines()}
                                </LineChart>
                            </ResponsiveContainer>
                        </Card>
                    </Col>

                    {/* Tỉ lệ điểm danh */}
                    <Col xs={24} xl={12}>
                        <Card title="Tỉ lệ số học sinh đi học trong 2 tuần gần nhất" size="small">
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={attendanceData} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="week" />
                                    <YAxis domain={[0, 100]} tickFormatter={(v) => `${v}%`} tickCount={6} />
                                    <Tooltip
                                        formatter={(value: unknown) =>
                                            value !== null ? [`${value}%`, ""] : ["Chưa có dữ liệu", ""]
                                        }
                                    />
                                    <Legend />
                                    {renderLines()}
                                </LineChart>
                            </ResponsiveContainer>
                        </Card>
                    </Col>
                </Row>
            )}
        </div>
    );
};

export default ManagerPage;
