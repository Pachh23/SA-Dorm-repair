import React, { useState, useEffect } from 'react';
import { Button, Table, Modal, Form, Input, message, Select, DatePicker, InputNumber, Typography } from 'antd';
import { ListStudents, DeleteStudentsById, CreateStudent } from '../../../services/https'; // Adjust the import path
import { StudentInterface } from '../../../interfaces/Student'; // Adjust the import path
import dayjs from 'dayjs';
import { DeleteOutlined } from '@ant-design/icons'; // Import Delete icon

const { Title } = Typography;

const ManageStudents: React.FC = () => {
    const [students, setStudents] = useState<StudentInterface[]>([]);
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    const [form] = Form.useForm();

    useEffect(() => {
        async function fetchStudents() {
            try {
                const response = await ListStudents();
                setStudents(response.data || []);
            } catch (error) {
                message.error('Failed to fetch students.');
            }
        }
        fetchStudents();
    }, []);

    const handleCreate = async (values: StudentInterface) => {
        try {
            const formattedValues = {
                ...values,
                Birthday: values.Birthday ? dayjs(values.Birthday).format('YYYY-MM-DD') : undefined,
            };
            await CreateStudent(formattedValues);
            setIsModalVisible(false);
            form.resetFields();
            const response = await ListStudents();
            setStudents(response.data || []);
            message.success('Student added successfully.');
        } catch (error) {
            message.error('Failed to add student.');
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await DeleteStudentsById(id.toString());
            const response = await ListStudents();
            setStudents(response.data || []);
            message.success('Student deleted successfully.');
        } catch (error) {
            message.error('Failed to delete student.');
        }
    };

    const columns = [
        { title: 'Student ID', dataIndex: 'student_id', key: 'student_id' },
        { title: 'First Name', dataIndex: 'first_name', key: 'first_name' },
        { title: 'Last Name', dataIndex: 'last_name', key: 'last_name' },
        { title: 'Major', dataIndex: 'major', key: 'major' },
        {
            title: 'วัน/เดือน/ปี เกิด',
            key: 'birthday',
            render: (record: StudentInterface) => <>{dayjs(record.Birthday).format('DD/MM/YYYY')}</>,
        },
        { title: 'Year', dataIndex: 'year', key: 'year' },
        {
            title: 'Gender',
            key: 'gender',
            render: (record: StudentInterface) => <>{record?.GenderID === 1 ? 'Male' : 'Female'}</>,
        },
        {
            title: 'Action',
            key: 'action',
            render: (_: any, record: StudentInterface) => (
                <Button
                    type="default" // Changed type to default
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => handleDelete(record.ID as number)}
                    style={{
                        backgroundColor: '#ff4d4f', // Red background color
                        color: '#fff', // White text color
                        borderColor: '#ff4d4f', // Red border color
                        borderRadius: '4px', // Rounded corners
                        borderWidth: '2px', // Thicker border
                        padding: '6px 12px', // Adjust padding
                    }}
                >
                    ลบ
                </Button>
            ),
        },
    ];

    return (
        <div style={{ padding: '20px' }}>
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    marginBottom: '20px',
                }}
            >
                <Title level={2} style={{ margin: 0, color: '#333' }}>
                    จัดการนักศึกษา
                </Title>
                <div
                    style={{
                        width: '100%',
                        maxWidth: '600px',
                        height: '3px',
                        backgroundColor: '#1890ff',
                        marginTop: '5px',
                        borderRadius: '2px',
                    }}
                />
            </div>
            <Button
                type="primary"
                onClick={() => setIsModalVisible(true)}
                style={{ marginBottom: 16 }}
            >
                เพิ่มนักเรียน
            </Button>
            <Table
                dataSource={students}
                columns={columns}
                rowKey="ID"
                loading={false} // Adjust if you have a loading state
                bordered
                pagination={{ pageSize: 10 }}
            />
            <Modal
                title="เพิ่มนักเรียน"
                visible={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
                centered
                width={800}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleCreate}
                >
                    <Form.Item
                        name="student_id"
                        label="Student ID"
                        rules={[{ required: true, message: 'กรุณากรอก Student ID!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="first_name"
                        label="First Name"
                        rules={[{ required: true, message: 'กรุณากรอก First Name!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="last_name"
                        label="Last Name"
                        rules={[{ required: true, message: 'กรุณากรอก Last Name!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="major"
                        label="Major"
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        label="Password"
                    >
                        <Input.Password />
                    </Form.Item>
                    <Form.Item
                        name="birthday"
                        label="วัน/เดือน/ปี เกิด"
                        rules={[{ required: true, message: 'กรุณาเลือกวัน/เดือน/ปี เกิด!' }]}
                    >
                        <DatePicker style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item
                        name="year"
                        label="Year"
                        rules={[{ required: true, message: 'กรุณากรอก Year!' }]}
                    >
                        <InputNumber style={{ width: '100%' }} min={1} />
                    </Form.Item>
                    <Form.Item
                        name="gender_id"
                        label="เพศ"
                        rules={[{ required: true, message: 'กรุณาเลือกเพศ!' }]}
                    >
                        <Select
                            style={{ width: '100%' }}
                            options={[
                                { value: 1, label: 'Male' },
                                { value: 2, label: 'Female' },
                            ]}
                        />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            เพิ่มนักเรียน
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default ManageStudents;