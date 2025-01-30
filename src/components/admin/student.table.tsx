'use client'
import React, { useState, useEffect } from 'react'
import {
    Table, Button, Modal, Form, Input, DatePicker, Select, Checkbox, message, Popconfirm, Row, Col
} from 'antd'
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { SearchOutlined } from '@ant-design/icons';
import dayjs from 'dayjs'

interface IClass {
    id: number
    className: string
    gradeLevel?: string
}

interface IStudent {
    id: number
    fullName: string
    DOB: string
    school?: string
    parentPhoneNumber?: string
    parentEmail?: string
    classes: IClass[]
}

const { Option } = Select

const StudentTable = () => {
    //State
    const [students, setStudents] = useState<IStudent[]>([])
    const [filteredStudents, setFilteredStudents] = useState<IStudent[]>([])
    const [allClasses, setAllClasses] = useState<IClass[]>([])
    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false)
    const [createForm] = Form.useForm()
    const [isEditModalVisible, setIsEditModalVisible] = useState(false)
    const [editForm] = Form.useForm()
    const [currentStudent, setCurrentStudent] = useState<IStudent | null>(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedClass, setSelectedClass] = useState<number | undefined>(undefined)

    useEffect(() => {
        fetchStudents()
        fetchClasses()
    }, [])

    useEffect(() => {
        handleSearch()
    }, [searchTerm, selectedClass, students])

    const fetchStudents = async () => {
        try {
            const res = await fetch('http://localhost:8000/get-student-info')
            if (!res.ok) {
                throw new Error('Failed to fetch students')
            }
            const data: IStudent[] = await res.json()
            setStudents(data)
            setFilteredStudents(data)
        } catch (error) {
            console.error('Error fetching students:', error)
            message.error('Đã xảy ra lỗi khi tải dữ liệu học sinh.')
        }
    }

    const fetchClasses = async () => {
        try {
            const res = await fetch('http://localhost:8000/get-class-info')
            if (!res.ok) {
                throw new Error('Failed to fetch classes')
            }
            const data: IClass[] = await res.json()
            setAllClasses(data)
        } catch (error) {
            console.error('Error fetching classes:', error)
            message.error('Đã xảy ra lỗi khi tải dữ liệu lớp học.')
        }
    }

    const showCreateModal = () => {
        setIsCreateModalVisible(true)
        createForm.resetFields()
    }

    const handleCreateCancel = () => {
        setIsCreateModalVisible(false)
    }

    const handleCreateStudent = async (values: any) => {
        const newStudentData = {
            fullName: values.fullName,
            DOB: values.DOB.format('YYYY-MM-DD'),
            school: values.school || '',
            parentPhoneNumber: values.parentPhoneNumber || '',
            parentEmail: values.parentEmail || '',
        }

        try {
            const res = await fetch('http://localhost:8000/student-post-crud', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newStudentData),
            })
            if (!res.ok) {
                throw new Error('Failed to create new student')
            }
            message.success('Tạo học sinh mới thành công!')
            setIsCreateModalVisible(false)
            fetchStudents()
        } catch (error) {
            console.error('Error creating new student:', error)
            message.error('Đã xảy ra lỗi khi tạo học sinh mới.')
        }
    }

    const showEditModal = (student: IStudent) => {
        setCurrentStudent(student)
        setIsEditModalVisible(true)
        const formattedDOB = dayjs(student.DOB, 'YYYY-MM-DD')
        editForm.setFieldsValue({
            fullName: student.fullName,
            DOB: formattedDOB,
            school: student.school,
            parentPhoneNumber: student.parentPhoneNumber,
            parentEmail: student.parentEmail,
            classes: student.classes.map(cls => cls.id),
        })
    }

    const handleEditCancel = () => {
        setIsEditModalVisible(false)
        setCurrentStudent(null)
    }

    const handleEditStudent = async (values: any) => {
        if (!currentStudent) return

        const updatedStudentData = {
            id: currentStudent.id,
            fullName: values.fullName,
            DOB: values.DOB.format('YYYY-MM-DD'),
            school: values.school || '',
            parentPhoneNumber: values.parentPhoneNumber || '',
            parentEmail: values.parentEmail || '',
            classIds: values.classes || [],
        }

        try {
            const res = await fetch('http://localhost:8000/update-student-crud', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedStudentData),
            })

            if (!res.ok) {
                throw new Error('Failed to update student')
            }
            message.success('Cập nhật học sinh thành công!')
            setIsEditModalVisible(false)
            setCurrentStudent(null)
            fetchStudents()
        } catch (error) {
            console.error('Error updating student:', error)
            message.error('Đã xảy ra lỗi khi cập nhật học sinh.')
        }
    }

    const handleDeleteStudent = async (student: IStudent) => {
        try {
            const res = await fetch('http://localhost:8000/student-delete-crud', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: student.id }),
            })
            if (!res.ok) {
                throw new Error('Failed to delete student')
            }
            message.success('Xóa học sinh thành công!')
            fetchStudents()
        } catch (error) {
            console.error('Error deleting student:', error)
            message.error('Đã xảy ra lỗi khi xóa học sinh.')
        }
    }

    const handleSearch = () => {
        let filtered = students

        if (searchTerm.trim() !== '') {
            filtered = filtered.filter(student =>
                student.fullName.toLowerCase().includes(searchTerm.toLowerCase())
            )
        }

        if (selectedClass !== undefined && selectedClass !== null) {
            filtered = filtered.filter(student =>
                student.classes.some(cls => cls.id === selectedClass)
            )
        }

        setFilteredStudents(filtered)
    }

    const columns = [
        {
            title: '#',
            dataIndex: 'index',
            key: 'index',
            render: (_: any, __: any, index: number) => index + 1,
            width: 50,
        },
        {
            title: 'Họ và tên',
            dataIndex: 'fullName',
            key: 'fullName',
        },
        {
            title: 'Ngày sinh',
            dataIndex: 'DOB',
            key: 'DOB',
            render: (dob: string) => dayjs(dob).format('DD/MM/YYYY'),
        },
        {
            title: 'Trường',
            dataIndex: 'school',
            key: 'school',
        },
        {
            title: 'Số điện thoại phụ huynh',
            dataIndex: 'parentPhoneNumber',
            key: 'parentPhoneNumber',
            width: 190,
        },
        {
            title: 'Email phụ huynh',
            dataIndex: 'parentEmail',
            key: 'parentEmail',
        },
        {
            title: 'Các lớp đang học',
            dataIndex: 'classes',
            key: 'classes',
            render: (classes: IClass[]) => classes.map(cls => cls.className).join(', '),
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (_: any, record: IStudent) => (
                <>
                    <Button type="link" onClick={() => showEditModal(record)}>
                        Điều chỉnh
                    </Button>
                    <Popconfirm
                        title={`Bạn có chắc muốn xóa học sinh: ${record.fullName}?`}
                        onConfirm={() => handleDeleteStudent(record)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button type="link" danger>
                            Xóa
                        </Button>
                    </Popconfirm>
                </>
            ),
        },
    ]

    return (
        <div>
            <Row justify="space-between" align="middle">
                <Col>
                    <Input
                        placeholder="Tìm kiếm học sinh"
                        prefix={<SearchOutlined />}
                        style={{ width: 300, marginBottom: '0.5rem' }}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        allowClear
                    />

                </Col>
                <Col>
                    <Button type="primary" onClick={showCreateModal} icon={<PlusOutlined />}>
                        Thêm học sinh mới
                    </Button>
                </Col>

            </Row>
            <Row>
                <Select
                    placeholder="Lọc theo lớp"
                    style={{ width: 300, marginBottom: '0.5rem' }}
                    allowClear
                    value={selectedClass}
                    onChange={(value) => setSelectedClass(value)}
                >
                    {allClasses.map(cls => (
                        <Option key={cls.id} value={cls.id}>
                            {cls.className}
                        </Option>
                    ))}
                </Select>
            </Row>

            <Table
                dataSource={filteredStudents}
                columns={columns}
                rowKey="id"
                pagination={{ pageSize: 5 }}
                bordered
            />

            <Modal
                title="Thêm học sinh mới"
                visible={isCreateModalVisible}
                onCancel={handleCreateCancel}
                footer={null}
                destroyOnClose
            >
                <Form
                    form={createForm}
                    layout="vertical"
                    onFinish={handleCreateStudent}
                >
                    <Form.Item
                        label="Họ tên"
                        name="fullName"
                        rules={[{ required: true, message: 'Họ tên là bắt buộc!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Ngày sinh"
                        name="DOB"
                        rules={[{ required: true, message: 'Ngày sinh là bắt buộc!' }]}
                    >
                        <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} />
                    </Form.Item>

                    <Form.Item
                        label="Trường"
                        name="school"
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Parent Phone"
                        name="parentPhoneNumber"
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Parent Email"
                        name="parentEmail"
                        rules={[{ type: 'email', message: 'Email không hợp lệ!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Tạo mới
                        </Button>
                        <Button onClick={handleCreateCancel} style={{ marginLeft: '1rem' }}>
                            Hủy
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>

            <Modal
                title="Chỉnh sửa học sinh"
                visible={isEditModalVisible}
                onCancel={handleEditCancel}
                footer={null}
                destroyOnClose
            >
                <Form
                    form={editForm}
                    layout="vertical"
                    onFinish={handleEditStudent}
                >
                    <Form.Item
                        label="Họ tên"
                        name="fullName"
                        rules={[{ required: true, message: 'Họ tên là bắt buộc!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Ngày sinh"
                        name="DOB"
                        rules={[{ required: true, message: 'Ngày sinh là bắt buộc!' }]}
                    >
                        <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} />
                    </Form.Item>

                    <Form.Item
                        label="Trường"
                        name="school"
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Parent Phone"
                        name="parentPhoneNumber"
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Parent Email"
                        name="parentEmail"
                        rules={[{ type: 'email', message: 'Email không hợp lệ!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Chọn các lớp"
                        name="classes"
                    >
                        <Select
                            mode="multiple"
                            placeholder="Chọn các lớp"
                            allowClear
                        >
                            {allClasses.map(cls => (
                                <Option key={cls.id} value={cls.id}>
                                    {cls.className}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Lưu thay đổi
                        </Button>
                        <Button onClick={handleEditCancel} style={{ marginLeft: '1rem' }}>
                            Hủy
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}

export default StudentTable
