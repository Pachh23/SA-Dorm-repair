import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Divider, Spin, Alert, Select, Row, Col } from "antd";
import { GetResigningForm, UpdateResigningForm } from '../../../../services/https'; // Import your API functions
import { ResigningFormInterface } from "../../../../interfaces/ResigningForm";


const { Option } = Select;

const ReadResignationForm: React.FC<{ ID: number }> = ({ ID }) => {
  const [formValues, setFormValues] = useState<ResigningFormInterface | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [form] = Form.useForm(); // Create form instance

  useEffect(() => {
    const fetchReadResignationForm = async () => {
      setLoading(true);
      try {
        const response = await GetResigningForm(ID);
        if (response) {
          setFormValues(response);
          form.setFieldsValue(response); // Set values to the form
        } else {
          setError('Failed to fetch resignation form details.');
        }
      } catch (e) {
        setError('An error occurred while fetching resignation form details.');
      } finally {
        setLoading(false);
      }
    };

    fetchReadResignationForm();
  }, [ID, form]);

  const handleStatusChange = async (value: string) => {
    try {
      await UpdateResigningForm( ID, { status: value });
      form.setFieldsValue({ Status: value }); // Update form when status changes
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
        <Card title="แบบฟอร์มลาออกหอพัก" bordered={false} style={{ width: '100%', maxWidth: '800px', margin: '0 auto' }}>
          <Form
            form={form}
            name="resignation-form"
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

            <Form.Item
              label="เหตุผลที่ลาออกเนื่องจาก"
              name="because_of"
            >
              <Input.TextArea readOnly />
            </Form.Item>

            <Form.Item
              label="สถานที่พัก"
              name="accommodation"
            >
              <Input readOnly />
            </Form.Item>
            <Divider />
          </Form>
        </Card>
      ) : (
        <div>ไม่มีข้อมูล</div>
      )}
    </div>
  );
};

export default ReadResignationForm;
