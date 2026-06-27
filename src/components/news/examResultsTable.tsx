'use client';

import React, { useMemo, useState } from 'react';
import { Table, Input, Tabs } from 'antd';
import {
    specializedAdmissions,
    qualityAdmissions,
    specializedAdmissionsTotalStudents,
    specializedAdmissionsTotalCount,
    qualityAdmissionsTotalStudents,
    qualityAdmissionsTotalCount,
} from '@/data/examResultsData';

const DIACRITICS_REGEX = new RegExp('[\\u0300-\\u036f]', 'g');

const normalize = (s: string) =>
    s
        .toLowerCase()
        .normalize('NFD')
        .replace(DIACRITICS_REGEX, '')
        .replace(/đ/g, 'd');

const ExamResultsTable = () => {
    const [specializedSearch, setSpecializedSearch] = useState('');
    const [qualitySearch, setQualitySearch] = useState('');

    const filteredSpecialized = useMemo(() => {
        const kw = normalize(specializedSearch);
        return specializedAdmissions.filter((s) => normalize(s.name).includes(kw));
    }, [specializedSearch]);

    const filteredQuality = useMemo(() => {
        const kw = normalize(qualitySearch);
        return qualityAdmissions.filter((q) => normalize(q.name).includes(kw));
    }, [qualitySearch]);

    return (
        <Tabs
            items={[
                {
                    key: 'specialized',
                    label: `Đỗ chuyên (${specializedAdmissionsTotalStudents} HS - ${specializedAdmissionsTotalCount} lượt)`,
                    children: (
                        <>
                            <Input.Search
                                placeholder="Tìm theo tên học sinh..."
                                allowClear
                                style={{ marginBottom: 16, maxWidth: 320 }}
                                onChange={(e) => setSpecializedSearch(e.target.value)}
                            />
                            <Table
                                rowKey="id"
                                size="small"
                                dataSource={filteredSpecialized}
                                pagination={{ pageSize: 20, showSizeChanger: false }}
                                scroll={{ x: true }}
                                columns={[
                                    { title: 'STT', dataIndex: 'id', width: 56 },
                                    { title: 'Họ và tên', dataIndex: 'name', width: 180 },
                                    {
                                        title: 'Thành tích',
                                        dataIndex: 'achievements',
                                        render: (achievements: string[]) => (
                                            <ul style={{ margin: 0, paddingLeft: 18 }}>
                                                {achievements.map((a, i) => (
                                                    <li key={i}>{a}</li>
                                                ))}
                                            </ul>
                                        ),
                                    },
                                ]}
                            />
                        </>
                    ),
                },
                {
                    key: 'quality',
                    label: `Đỗ chất lượng cao (${qualityAdmissionsTotalStudents} HS - ${qualityAdmissionsTotalCount} lượt)`,
                    children: (
                        <>
                            <Input.Search
                                placeholder="Tìm theo tên học sinh..."
                                allowClear
                                style={{ marginBottom: 16, maxWidth: 320 }}
                                onChange={(e) => setQualitySearch(e.target.value)}
                            />
                            <Table
                                rowKey="id"
                                size="small"
                                dataSource={filteredQuality}
                                pagination={{ pageSize: 20, showSizeChanger: false }}
                                scroll={{ x: true }}
                                columns={[
                                    { title: 'STT', dataIndex: 'id', width: 56 },
                                    { title: 'Họ và tên', dataIndex: 'name', width: 180 },
                                    {
                                        title: 'Trường',
                                        dataIndex: 'schools',
                                        render: (schools: string[]) => (
                                            <ul style={{ margin: 0, paddingLeft: 18 }}>
                                                {schools.map((s, i) => (
                                                    <li key={i}>{s}</li>
                                                ))}
                                            </ul>
                                        ),
                                    },
                                ]}
                            />
                        </>
                    ),
                },
            ]}
        />
    );
};

export default ExamResultsTable;
