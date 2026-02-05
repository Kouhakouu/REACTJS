'use client';

import React, { useContext, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { AuthContext } from '@/library/authContext';
import {
    Alert,
    Badge,
    Calendar,
    Card,
    Col,
    DatePicker,
    Modal,
    List as AntList,
    Row,
    Spin,
    Tag,
    Typography,
} from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import 'dayjs/locale/vi';

import { formatTime } from '@/utils/formatDate';

dayjs.extend(isoWeek);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
dayjs.locale('vi');

const { Title, Text } = Typography;

interface ClassSchedule {
    study_day: string; // Monday/Tuesday... or other
    start_time: string;
    end_time: string;
}

interface TeacherClass {
    id: number;
    className: string;
    gradeLevel: string;
    studentsCount: number;
    schedule: ClassSchedule | null;
}

interface Session {
    id: number;
    date: string; // lessonDate
    content: string; // lessonContent
}

interface Performance {
    sessionId: number;
    doneCount: number;
    correctCount: number;
    wrongTasks: string[];
    missingTasks: string[];
    presentation: string;
    skills: string; // "Tốt" | "Khá" | "Trung bình"
}

interface StudentRecord {
    id: number;
    fullName: string;
    performance: Performance[];
}

interface ClassDetail {
    id: number;
    className: string;
    sessions: Session[];
    students: StudentRecord[];
}

type SkillLabel = 'Tốt' | 'Khá' | 'Trung bình';

type BarDatum = {
    classId: number;
    className: string;
    totalStudents: number;
    good: number; // Tốt
    fair: number; // Khá
    avg: number; // Trung bình
};

type TeachingEvent = {
    classId: number;
    className: string;
    gradeLevel: string;
    start: string;
    end: string;
};

function isInSelectedWeek(dateISO: string, weekStart: Dayjs, weekEnd: Dayjs) {
    const d = dayjs(dateISO);
    return d.isSameOrAfter(weekStart, 'day') && d.isSameOrBefore(weekEnd, 'day');
}

function normalizeSkill(raw: string): SkillLabel | null {
    const s = (raw || '').trim().toLowerCase();
    if (!s) return null;
    if (s === 'tốt' || s === 'tot') return 'Tốt';
    if (s === 'khá' || s === 'kha') return 'Khá';
    if (s === 'trung bình' || s === 'trung binh') return 'Trung bình';
    return null;
}

/**
 * Gộp skills của 1 học sinh trong tuần:
 * - majority vote
 * - nếu hòa -> chọn mức thấp hơn (an toàn): Tốt > Khá > Trung bình
 * - nếu không có skills -> Trung bình (mặc định)
 */
function aggregateWeeklySkill(perfsInWeek: Performance[]): SkillLabel {
    const counts: Record<SkillLabel, number> = { 'Tốt': 0, 'Khá': 0, 'Trung bình': 0 };

    for (const p of perfsInWeek) {
        const label = normalizeSkill(p.skills);
        if (label) counts[label] += 1;
    }

    const max = Math.max(counts['Tốt'], counts['Khá'], counts['Trung bình']);
    if (max === 0) return 'Trung bình';

    const candidates: SkillLabel[] = [];
    (['Tốt', 'Khá', 'Trung bình'] as SkillLabel[]).forEach(k => {
        if (counts[k] === max) candidates.push(k);
    });

    // tie-break: chọn mức thấp hơn
    if (candidates.length > 1) {
        if (candidates.includes('Trung bình')) return 'Trung bình';
        if (candidates.includes('Khá')) return 'Khá';
        return 'Tốt';
    }

    return candidates[0];
}

function mapStudyDayToDayjsDay(study_day: string): number | null {
    const s = (study_day || '').trim().toLowerCase();
    const map: Record<string, number> = {
        sunday: 0,
        monday: 1,
        tuesday: 2,
        wednesday: 3,
        thursday: 4,
        friday: 5,
        saturday: 6,

        // fallback VN
        'chủ nhật': 0,
        'chu nhat': 0,
        'thứ hai': 1,
        'thu hai': 1,
        'thứ ba': 2,
        'thu ba': 2,
        'thứ tư': 3,
        'thu tu': 3,
        'thứ năm': 4,
        'thu nam': 4,
        'thứ sáu': 5,
        'thu sau': 5,
        'thứ bảy': 6,
        'thu bay': 6,
    };
    return map[s] ?? null;
}

function fmtHHmm(time: string) {
    return formatTime(time);
}

function StackedBarChart({ data }: { data: BarDatum[] }) {
    if (!data.length) {
        return <Alert type="info" message="Không có dữ liệu thống kê trong tuần này." showIcon />;
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
                            <div
                                style={{
                                    fontSize: 11,
                                    marginBottom: 6,
                                    textAlign: 'center',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                }}
                                title={d.className}
                            >
                                {d.className}
                            </div>

                            <div
                                title={`Tốt: ${d.good} | Khá: ${d.fair} | Trung bình: ${d.avg} | Tổng: ${d.totalStudents}`}
                                style={{
                                    height: heightPx,
                                    width: 44,
                                    margin: '0 auto',
                                    border: '1px solid #eee',
                                    borderRadius: 8,
                                    overflow: 'hidden',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'flex-end',
                                    background: '#fafafa',
                                }}
                            >
                                {/* bottom -> top */}
                                <div style={{ height: `${avgPct}%`, background: '#fa8c16' }} />
                                <div style={{ height: `${fairPct}%`, background: '#1677ff' }} />
                                <div style={{ height: `${goodPct}%`, background: '#52c41a' }} />
                            </div>

                            <div style={{ marginTop: 8, textAlign: 'center', fontSize: 12 }}>
                                <div><Text strong>{d.totalStudents}</Text> HS</div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div style={{ marginTop: 12 }}>
                <Text type="secondary" style={{ fontSize: 12 }}>
                    * Biểu đồ là số học sinh theo skills (Tốt/Khá/Trung bình). Nếu 1 học sinh có nhiều buổi trong tuần: lấy theo đa số;
                    nếu hòa thì chọn mức thấp hơn.
                </Text>
            </div>
        </div>
    );
}

const TeacherPage = () => {
    const { token } = useContext(AuthContext);

    const [hasMounted, setHasMounted] = useState(false);

    const [classes, setClasses] = useState<TeacherClass[]>([]);
    const [classesLoading, setClassesLoading] = useState(true);

    const [statsLoading, setStatsLoading] = useState(false);
    const [barData, setBarData] = useState<BarDatum[]>([]);
    const [error, setError] = useState<string | null>(null);

    // right panel stats week picker
    const [selectedWeek, setSelectedWeek] = useState<Dayjs>(() => dayjs());

    // left panel calendar month view
    const [calendarValue, setCalendarValue] = useState<Dayjs>(() => dayjs());

    // modal for a day with many shifts
    const [openDay, setOpenDay] = useState<Dayjs | null>(null);

    const weekStart = useMemo(() => selectedWeek.startOf('isoWeek'), [selectedWeek]);
    const weekEnd = useMemo(() => selectedWeek.endOf('isoWeek'), [selectedWeek]);

    useEffect(() => setHasMounted(true), []);

    // 1) Load classes
    useEffect(() => {
        if (!hasMounted) return;
        if (!token) {
            setError('Không tìm thấy token, không thể gọi API!');
            setClassesLoading(false);
            return;
        }

        const fetchClasses = async () => {
            setClassesLoading(true);
            setError(null);
            try {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_BACKEND_PORT}/teacher/classes`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const data = await res.json();
                if (!Array.isArray(data)) throw new Error('Dữ liệu classes trả về không hợp lệ.');
                setClasses(data);
            } catch (e: any) {
                console.error(e);
                setError(`Lỗi tải danh sách lớp: ${e.message}`);
            } finally {
                setClassesLoading(false);
            }
        };

        fetchClasses();
    }, [hasMounted, token]);

    // 2) Load + aggregate stats by week (skills)
    useEffect(() => {
        if (!hasMounted) return;
        if (!token) return;
        if (!classes.length) {
            setBarData([]);
            return;
        }

        const fetchAndAggregate = async () => {
            setStatsLoading(true);
            setError(null);

            try {
                const details: ClassDetail[] = await Promise.all(
                    classes.map(async (c) => {
                        const res = await fetch(
                            `${process.env.NEXT_PUBLIC_BACKEND_PORT}/teacher/classes/${c.id}`,
                            { headers: { Authorization: `Bearer ${token}` } }
                        );
                        if (!res.ok) throw new Error(`HTTP ${res.status} when fetching class ${c.id}`);
                        return res.json();
                    })
                );

                const aggregated: BarDatum[] = details.map((detail) => {
                    const sessionsInWeek = detail.sessions.filter(s =>
                        isInSelectedWeek(s.date, weekStart, weekEnd)
                    );
                    const sessionIds = new Set(sessionsInWeek.map(s => s.id));

                    let good = 0, fair = 0, avg = 0;

                    for (const st of detail.students) {
                        const perfInWeek = st.performance.filter(p => sessionIds.has(p.sessionId));
                        const weeklySkill = aggregateWeeklySkill(perfInWeek);

                        if (weeklySkill === 'Tốt') good++;
                        else if (weeklySkill === 'Khá') fair++;
                        else avg++;
                    }

                    return {
                        classId: detail.id,
                        className: detail.className,
                        totalStudents: detail.students.length,
                        good,
                        fair,
                        avg,
                    };
                });

                setBarData(aggregated);
            } catch (e: any) {
                console.error(e);
                setError(`Lỗi thống kê dashboard: ${e.message}`);
                setBarData([]);
            } finally {
                setStatsLoading(false);
            }
        };

        fetchAndAggregate();
    }, [hasMounted, token, classes, weekStart, weekEnd]);

    // Calendar events by date for the visible calendar grid
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
                    start: fmtHHmm(c.schedule.start_time),
                    end: fmtHHmm(c.schedule.end_time),
                });
            }
        }

        // Sort without relying on downlevel iteration
        m.forEach((arr: TeachingEvent[], k: string) => {
            arr.sort((a: TeachingEvent, b: TeachingEvent) => a.start.localeCompare(b.start));
            m.set(k, arr);
        });

        return m;
    }, [classes, calendarValue]);

    function toMinutes(hhmm: string) {
        const [h, m] = hhmm.split(':').map(Number);
        return (h || 0) * 60 + (m || 0);
    }

    const eventsForOpenDay = useMemo(() => {
        if (!openDay) return [];
        const list = teachingEventsByDate.get(openDay.format('YYYY-MM-DD')) || [];
        return [...list].sort((a, b) => toMinutes(a.start) - toMinutes(b.start));
    }, [openDay, teachingEventsByDate]);

    if (!hasMounted || classesLoading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                <Spin size="large" />
            </div>
        );
    }

    if (error) {
        return (
            <Alert
                type="error"
                message={error}
                style={{ margin: '20px auto', maxWidth: 900 }}
                showIcon
            />
        );
    }

    return (
        <div style={{ padding: 20 }}>
            <Row justify="space-between" align="middle" style={{ marginBottom: 2 }}>
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

            {/* 6:4 ratio => 14:10 on 24-grid */}
            <Row gutter={[16, 16]}>
                {/* LEFT: Calendar (6) */}
                <Col xs={24} lg={14}>
                    <Card title="Lịch dạy" extra={<Link href="/teacher/classes">Xem lớp</Link>}>
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
                                            border: hasClass ? '2px solid #1677ff' : '1px solid transparent',
                                            background: hasClass ? 'rgba(22, 119, 255, 0.06)' : 'transparent',
                                            boxSizing: 'border-box',
                                            overflow: 'hidden',
                                            cursor: hasClass ? 'pointer' : 'default',
                                        }}
                                    >
                                        {hasClass ? (
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                                {shown.map((ev) => (
                                                    <div key={`${ev.classId}-${ev.start}`} style={{ lineHeight: 1.1 }}>
                                                        <Badge status="processing" />
                                                        <span style={{ marginLeft: 6, fontSize: 12, fontWeight: 600 }}>
                                                            {ev.className}
                                                        </span>
                                                        <div style={{ marginLeft: 20, fontSize: 11, color: '#666' }}>
                                                            {ev.start} – {ev.end}
                                                        </div>
                                                    </div>
                                                ))}

                                                {remaining > 0 && (
                                                    <Text
                                                        type="secondary"
                                                        style={{ fontSize: 11, marginLeft: 20 }}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setOpenDay(value);
                                                        }}
                                                    >
                                                        +{remaining} ca nữa
                                                    </Text>
                                                )}
                                            </div>
                                        ) : null}
                                    </div>
                                );
                            }}
                        />

                        <Modal
                            open={!!openDay}
                            onCancel={() => setOpenDay(null)}
                            footer={null}
                            title={openDay ? `Lịch dạy ngày ${openDay.format('DD/MM/YYYY')}` : ''}
                        >
                            {eventsForOpenDay.length === 0 ? (
                                <Alert type="info" message="Không có lịch dạy." showIcon />
                            ) : (
                                <AntList
                                    dataSource={eventsForOpenDay}
                                    renderItem={(ev) => (
                                        <AntList.Item>
                                            <AntList.Item.Meta
                                                title={
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                                                        <Link href={`/teacher/classes/${ev.classId}`} onClick={() => setOpenDay(null)}>
                                                            <Text strong>{ev.className}</Text>
                                                        </Link>
                                                        <Tag color="blue">Lớp {ev.gradeLevel}</Tag>
                                                    </div>
                                                }
                                                description={
                                                    <Tag color="green">
                                                        {ev.start} – {ev.end}
                                                    </Tag>
                                                }
                                            />
                                        </AntList.Item>
                                    )}
                                />
                            )}
                        </Modal>
                    </Card>
                </Col>

                {/* RIGHT: Stats (4) */}
                <Col xs={24} lg={10}>
                    <Card
                        title="Thống kê bài tập về nhà theo lớp (theo tuần)"
                        extra={statsLoading ? <Spin size="small" /> : null}
                    >
                        <StackedBarChart data={barData} />
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default TeacherPage;
