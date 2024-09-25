import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Divider, Spin, Alert, Select, Row, Col } from "antd";
import { GetEn_ExitingForm,UpdateEn_ExitingForm } from '../../../../services/https';
import { En_ExitingFormInterface } from "../../../../interfaces/En_ExitingForm";

const { Option } = Select;

const ReadEnteringAndExitingDorm: React.FC<{ ID: number }> = ({ ID }) => {
  const [formValues, setFormValues] = useState<En_ExitingFormInterface | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [form] = Form.useForm(); // Create form instance

  useEffect(() => {
    const fetchEn_ExitingForm = async () => {
      setLoading(true);
      try {
        const response = await GetEn_ExitingForm(ID);
        if (response) {
          setFormValues(response);
          form.setFieldsValue(response); // Set values to the form
        } else {
          setError('Failed to fetch delayed payment details.');
        }
      } catch (e) {
        setError('An error occurred while fetching delayed payment details.');
      } finally {
        setLoading(false);
      }
    };

    fetchEn_ExitingForm();
  }, [ID, form]);
  const handleStatusChange = async (value: string) => {
    try {
      await UpdateEn_ExitingForm( String (ID) , { status: value });
      form.setFieldsValue({ Status: value }); // อัปเดตฟอร์มเมื่อสถานะเปลี่ยน
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };
  return (
    <div className="container" style={{ padding: '20px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      {loading ? (
        <div style={{ textAlign: 'center' }}>
          <Spin />
        </div>
      ) : error ? (
        <Alert message={error} type="error" style={{ marginBottom: '20px' }} />
      ) : formValues ? (
        <Card title="แบบฟอร์มขออนุญาตเข้าออกหอพัก" bordered={false} style={{ width: '100%', maxWidth: '800px', margin: '0 auto' }}>
          <Form
            form={form}
            name="delaying-payment-form"
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
                  <Option value="รอการดำเนินการ" style={{ backgroundColor: '#0000', color: '#333' }}>Pending</Option>
                  <Option value="กำลังดำเนินการ" style={{ backgroundColor: '#0000', color: '#faad14' }}>In Progress</Option>
                  <Option value="เสร็จสิ้น" style={{ backgroundColor: '#0000', color: '#52c41a' }}>Completed</Option>
               </Select>
                </Form.Item>
              </Col>
            </Row>
            <Divider />
            <Form.Item
              label="เรื่งที่ขอ"
              name="request"
            >
              <Input readOnly />
            </Form.Item>

            <Form.Item
              label="เนื่องจาก"
              name="because_of"
            >
              <Input readOnly />
            </Form.Item>

            <Form.Item
              label="วันที่ขออนุญาติ"
              name="date_request"
            >
              <Input readOnly />
            </Form.Item>
          </Form>
          <Divider />
        </Card>
      ) : (
        <div>ไม่มีข้อมูล</div>
      )}
    </div>
  );
};

export default ReadEnteringAndExitingDorm;
