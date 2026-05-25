'use client';

import React, { useContext, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
    Alert, Badge, Calendar, Card, Col, DatePicker,
    Modal, List as AntList, Row, Spin, Statistic, Tag, Typography,
} from 'antd';
import { TeamOutlined, BookOutlined, CalendarOutlined } from '@ant-design/icons';
import dayjs, { Dayjs } from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import 'dayjs/locale/vi';

import { AuthContext } from '@/library/authContext';
import { formatTime } from '@/utils/formatDate';

dayjs.extend(isoWeek);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
dayjs.locale('vi');

const { Text } = Typography;

// ---------- Types ----------
interface ClassSchedule {
    study_day: string;
    start_time: string;
    end_time: string;
}

interface ClassSummary {
    id: number;
    className: string;
    gradeLevel: string;
    studentsCount: number;
    assignmentsCount: number;
    schedule: ClassSchedule | null;
}

interface Lesson {
    id: number;
    lessonContent: string;
    lessonDate: string;
    isLocked: boolean;
}

interface StudentPerfRow {
    id: number;
    fullName: string;
    attendance: boolean;
    performance: { skills: string } | null;
}

type SkillLabel = 'Tốt' | 'Khá' | 'Trung bình';

type BarDatum = {
    classId: number;
    className: string;
    totalStudents: number;
    good: number;
    fair: number;
    avg: number;
};

type TeachingEvent = {
    classId: number;
    className: string;
    gradeLevel: string;
    start: string;
    end: string;
};

// ---------- Pure helpers ----------
function normalizeSkill(raw: string): SkillLabel | null {
    const s = (raw || '').trim().toLowerCase();
    if (!s) return null;
    if (s === 'tốt' || s === 'tot') return 'Tốt';
    if (s === 'khá' || s === 'kha') return 'Khá';
    if (s === 'trung bình' || s === 'trung binh') return 'Trung bình';
    return null;
}

function aggregateWeeklySkill(skills: SkillLabel[]): SkillLabel {
    const counts: Record<SkillLabel, number> = { 'Tốt': 0, 'Khá': 0, 'Trung bình': 0 };
    for (const s of skills) counts[s] += 1;
    const max = Math.max(counts['Tốt'], counts['Khá'], counts['Trung bình']);
    if (max === 0) return 'Trung bình';
    const candidates = (['Tốt', 'Khá', 'Trung bình'] as SkillLabel[]).filter(k => counts[k] === max);
    if (candidates.length === 1) return candidates[0];
    if (candidates.includes('Trung bình')) return 'Trung bình';
    if (candidates.includes('Khá')) return 'Khá';
    return 'Tốt';
}

function mapStudyDayToDayjsDay(study_day: string): number | null {
    const s = (study_day || '').trim().toLowerCase();
    const map: Record<string, number> = {
        sunday: 0, monday: 1, tuesday: 2, wednesday: 3, thursday: 4, friday: 5, saturday: 6,
        'chủ nhật': 0, 'chu nhat': 0, 'thứ hai': 1, 'thu hai': 1,
        'thứ ba': 2, 'thu ba': 2, 'thứ tư': 3, 'thu tu': 3,
        'thứ năm': 4, 'thu nam': 4, 'thứ sáu': 5, 'thu sau': 5,
        'thứ bảy': 6, 'thu bay': 6,
    };
    return map[s] ?? null;
}

function isInSelectedWeek(dateISO: string, weekStart: Dayjs, weekEnd: Dayjs): boolean {
    const d = dayjs(dateISO);
    return d.isSameOrAfter(weekStart, 'day') && d.isSameOrBefore(weekEnd, 'day');
}

// ---------- Bar chart component ----------
function StackedBarChart({ data }: { data: BarDatum[] }) {
    if (!data.length) {
        return <Alert type="info" message="Không có dữ liệu buổi học trong tuần này." showIcon />;
    }
    const maxTotal = Math.max(...data.map(d => d.totalStudents), 1);
    return (
        <div style={{ width: '100%' }}>
            <div style={{ display: 'flex', gap: 12, marginBottom: 12, flexWrap: 'wrap' }}>
                <span><Tag color="green">Tốt</Tag></span>
                <span><Tag color="blue">Khá</Tag></span>
                <span><Tag color="orange">Trung bình</Tag></span>
            </div>
            <div style={{ display: 'flex', gap: 14, alignItems: 'flex-end', overflowX: 'auto', paddingBottom: 8 }}>
                {data.map(d => {
                    const heightPx = Math.round((d.totalStudents / maxTotal) * 220) + 40;
                    const total = Math.max(d.totalStudents, 1);
                    const goodPct = (d.good / total) * 100;
                    const fairPct = (d.fair / total) * 100;
                    const avgPct = (d.avg / total) * 100;
                    return (
                        <div key={d.classId} style={{ width: 76, flex: '0 0 auto' }}>
                            <div style={{ fontSize: 11, marginBottom: 6, textAlign: 'center', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={d.className}>
                                {d.className}
                            </div>
                            <div
                                title={`Tốt: ${d.good} | Khá: ${d.fair} | Trung bình: ${d.avg} | Tổng: ${d.totalStudents}`}
                                style={{ height: heightPx, width: 44, margin: '0 auto', border: '1px solid #eee', borderRadius: 8, overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', background: '#fafafa' }}
                            >
                                <div style={{ height: `${avgPct}%`, background: '#fa8c16' }} />
                                <div style={{ height: `${fairPct}%`, background: '#1677ff' }} />
                                <div style={{ height: `${goodPct}%`, background: '#52c41a' }} />
                            </div>
                            <div style={{ marginTop: 8, textAlign: 'center', fontSize: 12 }}>
                                <Text strong>{d.totalStudents}</Text> HS
                            </div>
                        </div>
                    );
                })}
            </div>
            <div style={{ marginTop: 12 }}>
                <Text type="secondary" style={{ fontSize: 12 }}>
                    * Kỹ năng được tổng hợp theo đa số; nếu hòa thì chọn mức thấp hơn.
                </Text>
            </div>
        </div>
    );
}

// ---------- Main component ----------
const AssistantDashboard = () => {
    const { token } = useContext(AuthContext);

    const [hasMounted, setHasMounted] = useState(false);
    const [classes, setClasses] = useState<ClassSummary[]>([]);
    const [classesLoading, setClassesLoading] = useState(true);
    const [statsLoading, setStatsLoading] = useState(false);
    const [barData, setBarData] = useState<BarDatum[]>([]);
    const [error, setError] = useState<string | null>(null);

    const [selectedWeek, setSelectedWeek] = useState<Dayjs>(() => dayjs());
    const [calendarValue, setCalendarValue] = useState<Dayjs>(() => dayjs());
    const [openDay, setOpenDay] = useState<Dayjs | null>(null);

    const weekStart = useMemo(() => selectedWeek.startOf('isoWeek'), [selectedWeek]);
    const weekEnd = useMemo(() => selectedWeek.endOf('isoWeek'), [selectedWeek]);

    useEffect(() => setHasMounted(true), []);

    // 1) Load classes
    useEffect(() => {
        if (!hasMounted || !token) return;
        const fetch_ = async () => {
            setClassesLoading(true);
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_PORT}/assistant/classes`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const data = await res.json();
                if (!Array.isArray(data)) throw new Error('Dữ liệu trả về không hợp lệ.');
                setClasses(data);
            } catch (e: unknown) {
                setError(`Lỗi tải danh sách lớp: ${e instanceof Error ? e.message : String(e)}`);
            } finally {
                setClassesLoading(false);
            }
        };
        fetch_();
    }, [hasMounted, token]);

    // 2) Load lesson performance → aggregate stats for bar chart
    useEffect(() => {
        if (!hasMounted || !token || !classes.length) {
            setBarData([]);
            return;
        }

        const fetchStats = async () => {
            setStatsLoading(true);
            try {
                const base = process.env.NEXT_PUBLIC_BACKEND_PORT;
                const headers = { Authorization: `Bearer ${token}` };

                // Step A: fetch lessons for every class in parallel
                const allLessonsPerClass = await Promise.all(
                    classes.map(async (c) => {
                        const res = await fetch(`${base}/assistant/classes/${c.id}/lessons`, { headers });
                        if (!res.ok) return { classId: c.id, lessons: [] as Lesson[] };
                        const lessons: Lesson[] = await res.json();
                        return { classId: c.id, lessons };
                    })
                );

                // Step B: filter lessons to selected week
                const lessonsInWeek = allLessonsPerClass.map(({ classId, lessons }) => ({
                    classId,
                    lessons: lessons.filter(l => isInSelectedWeek(l.lessonDate, weekStart, weekEnd)),
                }));

                // Step C: fetch performance for each lesson in week (parallel, flattened)
                const perfEntries = await Promise.all(
                    lessonsInWeek.flatMap(({ classId, lessons }) =>
                        lessons.map(async (lesson) => {
                            const res = await fetch(
                                `${base}/assistant/classes/${classId}/lessons/${lesson.id}/students-performance`,
                                { headers }
                            );
                            if (!res.ok) return { classId, students: [] as StudentPerfRow[] };
                            const students: StudentPerfRow[] = await res.json();
                            return { classId, students };
                        })
                    )
                );

                // Step D: aggregate per class
                const aggregated = classes.map((c) => {
                    const classEntries = perfEntries.filter(p => p.classId === c.id);

                    // Map studentId → collected skills across lessons in week
                    const studentSkills = new Map<number, SkillLabel[]>();
                    for (const { students } of classEntries) {
                        for (const student of students) {
                            const cur = studentSkills.get(student.id) ?? [];
                            if (student.performance?.skills) {
                                const label = normalizeSkill(student.performance.skills);
                                if (label) cur.push(label);
                            }
                            studentSkills.set(student.id, cur);
                        }
                    }

                    if (studentSkills.size === 0) return null; // no lessons this week

                    let good = 0, fair = 0, avg = 0;
                    studentSkills.forEach((skills) => {
                        const weekly = aggregateWeeklySkill(skills);
                        if (weekly === 'Tốt') good++;
                        else if (weekly === 'Khá') fair++;
                        else avg++;
                    });

                    return { classId: c.id, className: c.className, totalStudents: studentSkills.size, good, fair, avg } satisfies BarDatum;
                }).filter((d): d is BarDatum => d !== null);

                setBarData(aggregated);
            } catch (e: unknown) {
                console.error(e);
                setBarData([]);
            } finally {
                setStatsLoading(false);
            }
        };

        fetchStats();
    }, [hasMounted, token, classes, weekStart, weekEnd]);

    // Calendar events map
    const teachingEventsByDate = useMemo(() => {
        const m: Map<string, TeachingEvent[]> = new Map();
        const start = calendarValue.startOf('month').startOf('week');
        const end = calendarValue.endOf('month').endOf('week');

        for (let d = start; d.isSameOrBefore(end, 'day'); d = d.add(1, 'day')) {
            m.set(d.format('YYYY-MM-DD'), []);
        }

        for (const c of classes) {
            if (!c.schedule) continue;
            const dayNum = mapStudyDayToDayjsDay(c.schedule.study_day);
            if (dayNum == null) continue;

            for (let d = start; d.isSameOrBefore(end, 'day'); d = d.add(1, 'day')) {
                if (d.day() !== dayNum) continue;
                const key = d.format('YYYY-MM-DD');
                const arr = m.get(key);
                if (!arr) continue;
                arr.push({
                    classId: c.id,
                    className: c.className,
                    gradeLevel: c.gradeLevel,
                    start: formatTime(c.schedule.start_time),
                    end: formatTime(c.schedule.end_time),
                });
            }
        }

        m.forEach((arr) => arr.sort((a, b) => a.start.localeCompare(b.start)));
        return m;
    }, [classes, calendarValue]);

    const eventsForOpenDay = useMemo(() => {
        if (!openDay) return [];
        return [...(teachingEventsByDate.get(openDay.format('YYYY-MM-DD')) || [])];
    }, [openDay, teachingEventsByDate]);

    // Summary stats
    const totalStudents = useMemo(() => classes.reduce((s, c) => s + c.studentsCount, 0), [classes]);
    const todayClassCount = useMemo(() => {
        const todayDay = dayjs().day();
        return classes.filter(c => {
            if (!c.schedule) return false;
            return mapStudyDayToDayjsDay(c.schedule.study_day) === todayDay;
        }).length;
    }, [classes]);

    if (!hasMounted || classesLoading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                <Spin size="large" />
            </div>
        );
    }

    if (error) {
        return <Alert type="error" message={error} style={{ margin: '20px auto', maxWidth: 900 }} showIcon />;
    }

    return (
        <div style={{ padding: 20 }}>
            {/* Summary cards */}
            <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
                <Col xs={24} sm={8}>
                    <Card>
                        <Statistic
                            title="Lớp đang phụ trách"
                            value={classes.length}
                            prefix={<TeamOutlined />}
                            valueStyle={{ color: '#1677ff' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={8}>
                    <Card>
                        <Statistic
                            title="Tổng học sinh"
                            value={totalStudents}
                            prefix={<BookOutlined />}
                            valueStyle={{ color: '#52c41a' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={8}>
                    <Card>
                        <Statistic
                            title="Buổi hỗ trợ hôm nay"
                            value={todayClassCount}
                            prefix={<CalendarOutlined />}
                            valueStyle={{ color: todayClassCount > 0 ? '#fa8c16' : '#8c8c8c' }}
                            suffix={todayClassCount > 0 ? 'lớp' : ''}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Week picker */}
            <Row justify="space-between" align="middle" style={{ marginBottom: 12 }}>
                <Col>
                    <Text type="secondary">
                        Thống kê theo tuần: {weekStart.format('DD/MM')} – {weekEnd.format('DD/MM/YYYY')}
                    </Text>
                </Col>
                <Col>
                    <DatePicker
                        picker="week"
                        value={selectedWeek}
                        onChange={(v) => v && setSelectedWeek(v)}
                        allowClear={false}
                    />
                </Col>
            </Row>

            <Row gutter={[16, 16]}>
                {/* Left: Calendar */}
                <Col xs={24} lg={14}>
                    <Card title="Lịch hỗ trợ" extra={<Link href="/assistant/classes">Xem lớp</Link>}>
                        <Calendar
                            value={calendarValue}
                            onChange={(v) => setCalendarValue(v)}
                            fullscreen={false}
                            dateCellRender={(value) => {
                                const key = value.format('YYYY-MM-DD');
                                const events = teachingEventsByDate.get(key) || [];
                                const hasClass = events.length > 0;
                                const maxShow = 2;
                                const shown = events.slice(0, maxShow);
                                const remaining = events.length - shown.length;

                                return (
                                    <div
                                        onClick={() => hasClass && setOpenDay(value)}
                                        style={{
                                            height: 76,
                                            padding: 6,
                                            borderRadius: 12,
                                            border: hasClass ? '2px solid #52c41a' : '1px solid transparent',
                                            background: hasClass ? 'rgba(82, 196, 26, 0.06)' : 'transparent',
                                            boxSizing: 'border-box',
                                            overflow: 'hidden',
                                            cursor: hasClass ? 'pointer' : 'default',
                                        }}
                                    >
                                        {hasClass && (
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                                {shown.map((ev) => (
                                                    <div key={`${ev.classId}-${ev.start}`} style={{ lineHeight: 1.1 }}>
                                                        <Badge status="success" />
                                                        <span style={{ marginLeft: 6, fontSize: 12, fontWeight: 600 }}>
                                                            {ev.className}
                                                        </span>
                                                        <div style={{ marginLeft: 20, fontSize: 11, color: '#666' }}>
                                                            {ev.start} – {ev.end}
                                                        </div>
                                                    </div>
                                                ))}
                                                {remaining > 0 && (
                                                    <Text type="secondary" style={{ fontSize: 11, marginLeft: 20 }}>
                                                        +{remaining} ca nữa
                                                    </Text>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                );
                            }}
                        />

                        <Modal
                            open={!!openDay}
                            onCancel={() => setOpenDay(null)}
                            footer={null}
                            title={openDay ? `Lịch hỗ trợ ngày ${openDay.format('DD/MM/YYYY')}` : ''}
                        >
                            {eventsForOpenDay.length === 0 ? (
                                <Alert type="info" message="Không có lịch hỗ trợ." showIcon />
                            ) : (
                                <AntList
                                    dataSource={eventsForOpenDay}
                                    renderItem={(ev) => (
                                        <AntList.Item>
                                            <AntList.Item.Meta
                                                title={
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                                                        <Link href={`/assistant/classes/${ev.classId}`} onClick={() => setOpenDay(null)}>
                                                            <Text strong>{ev.className}</Text>
                                                        </Link>
                                                        <Tag color="blue">Lớp {ev.gradeLevel}</Tag>
                                                    </div>
                                                }
                                                description={
                                                    <Tag color="green">{ev.start} – {ev.end}</Tag>
                                                }
                                            />
                                        </AntList.Item>
                                    )}
                                />
                            )}
                        </Modal>
                    </Card>
                </Col>

                {/* Right: Stats */}
                <Col xs={24} lg={10}>
                    <Card
                        title="Kỹ năng học sinh theo lớp (theo tuần)"
                        extra={statsLoading ? <Spin size="small" /> : null}
                    >
                        <StackedBarChart data={barData} />
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default AssistantDashboard;
