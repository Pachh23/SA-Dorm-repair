import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Divider, Spin, Alert, Select, Row, Col } from "antd";
import { GetRepair, UpdateRepair } from '../../../../services/https'; // Import your API functions
import { RepairInterface } from "../../../../interfaces/repairing";

const { Option } = Select;

const ReadRepairing: React.FC<{ ID: number }> = ({ ID }) => {
  const [formValues, setFormValues] = useState<RepairInterface | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [form] = Form.useForm(); // สร้าง form instance

  useEffect(() => {
    const fetchRepair = async () => {
      setLoading(true);
      try {
        // ดึงข้อมูลจาก API
        const response = await GetRepair(ID);
        if (response) {
          console.log('Fetched data:', response); // Debug ข้อมูลที่ดึงมา
          setFormValues(response);
          form.setFieldsValue(response); // ตั้งค่าให้กับฟอร์มเมื่อได้ข้อมูลแล้ว
          console.log('Form values set:', form.getFieldsValue()); // Debug ข้อมูลในฟอร์ม
        } else {
          setError('Failed to fetch repair details.');
        }
      } catch (e) {
        setError('An error occurred while fetching repair details.');
      } finally {
        setLoading(false);
      }
    };

    fetchRepair();
  }, [ID, form]);

  const handleStatusChange = async (value: string) => {
    try {
      await UpdateRepair(String (ID), { status: value });
      form.setFieldsValue({ Status: value }); // อัปเดตฟอร์มเมื่อสถานะเปลี่ยน
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const imageUrl = formValues?.image || 'https://via.placeholder.com/600x400';

  return (
    <div className="container" style={{ padding: '20px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      {loading ? (
        <div style={{ textAlign: 'center' }}>
          <Spin />
        </div>
      ) : error ? (
        <Alert message={error} type="error" style={{ marginBottom: '20px' }} />
      ) : formValues ? (
        <Card title="แบบฟอร์มแจ้งซ่อม" bordered={false} style={{ width: '100%', maxWidth: '800px', margin: '0 auto' }}>
          <Form
            form={form}
            name="repairing-form"
            layout="vertical"
          >
            <Row justify="space-between" align="top">
              <Col>
                <div style={{ marginBottom: '16px', color: '#666' }}>
                </div>
                <p>ผู้รับบริการ: {formValues?.reservation?.student?.student_id} {formValues?.reservation?.student?.first_name} {formValues?.reservation?.student?.last_name}</p>
                <p>อาคาร: {formValues?.reservation?.Dorm?.dorm_name} ห้อง: {formValues?.reservation?.Room?.room_number}</p>
              </Col>
              <Col>
                <Form.Item
                  label="สถานะ"
                  name="status"
                >
                  <Select
                    value={form.getFieldValue("status")}
                    style={{ width: '150px' }}
                    onChange={handleStatusChange}
                  >
                    <Option value="รอการดำเนินการ" style={{ backgroundColor: '#0000', color: '#333' }}>รอการดำเนินการ</Option>
                    <Option value="กำลังดำเนินการ" style={{ backgroundColor: '#0000', color: '#faad14' }}>กำลังดำเนินการ</Option>
                    <Option value="เสร็จสิ้น" style={{ backgroundColor: '#0000', color: '#52c41a' }}>เสร็จสิ้น</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Divider />
            <Form.Item
              label="หัวข้อการขอรับบริการ"
              name="title"
            >
              <Input readOnly />
            </Form.Item>
            <Form.Item
              label="ภาพประกอบ"
              name="image"
            >
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <img
                  src={imageUrl}
                  alt="image"
                  style={{ width: '100%', maxWidth: '600px', maxHeight: '400px', objectFit: 'contain' }}
                />
              </div>
            </Form.Item>
            <Form.Item
              label="รายละเอียดการขอรับบริการ"
              name="detail"
            >
              <Input readOnly />
            </Form.Item>
            <Form.Item
              label="รายละเอียดสถานที่รับบริการ"
              name="location_details"
            >
              <Input readOnly />
            </Form.Item>
            <Form.Item
              label="หมายเหตุ"
              name="remarks"
            >
              <Input readOnly />
            </Form.Item>
            <Form.Item
              label="ช่องทางติดต่อ"
              name="contact"
            >
              <Input readOnly />
            </Form.Item>
            <Form.Item
              label="ช่วงเวลาที่รับบริการ"
              name="time_slot"
            >
              <Input readOnly />
            </Form.Item>
          </Form>
        </Card>
      ) : (
        <div>ไม่มีข้อมูล</div>
      )}
    </div>
  );
};

export default ReadRepairing;
