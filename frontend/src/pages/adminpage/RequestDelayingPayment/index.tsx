import React, { useState, useEffect } from 'react';
import { Button, Table, Typography, Card } from 'antd';
import ReadDelayingPayment from './ReadRequestDelayingPayment/index';
import { ListDelayedPaymentForms } from '../../../services/https';
import { DelayedPaymentFormInterface } from "../../../interfaces/delayedpaymentform";

const { Title } = Typography;

interface TableRequestDelayingPaymentRecord extends DelayedPaymentFormInterface {
  key: string;
  date: string;
}

const DelayingPayment: React.FC = () => {
  const [DelayingPayment, setDelayingPayment] = useState<TableRequestDelayingPaymentRecord[]>([]);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  useEffect(() => {
    const fetchDelayingPayment = async () => {
      try {
        const data = await ListDelayedPaymentForms();
        if (data) {
          // กรองข้อมูลที่มีสถานะ "completed"
          const filteredData = data.filter((item: DelayedPaymentFormInterface) => item.status !== 'completed');
          const transformedData = filteredData.map((item: DelayedPaymentFormInterface, index: number) => ({
            ...item,
            key: item.ID?.toString() || index.toString(),
          }));
          setDelayingPayment(transformedData);
        }
      } catch (error) {
        console.error('Error fetching DelayingPayment:', error);
      }
    };

    fetchDelayingPayment(); // เรียกข้อมูลครั้งแรก

    // ตั้งค่า setInterval
    const intervalId = setInterval(fetchDelayingPayment, 3000); // รีเฟรชข้อมูลทุกๆ 30 วินาที
    return () => clearInterval(intervalId); // ล้าง interval เมื่อคอมโพเนนต์ถูกทำลาย
  }, []);
  const handleDetailsClick = (ID: string) => {
    setSelectedKey(ID);
  };

  const handleBackClick = () => {
    setSelectedKey(null);
  };

  const columns = [
    {
      title: <div style={{ textAlign: 'center' }}>รหัสนักศึกษา</div>,
      dataIndex: ['reservation', 'student', 'student_id'],
      key: 'student_id',
      render: (text: string) => (
        <div style={{ textAlign: 'center', fontWeight: 'bold', color: '#4A4A4A' }}>{text || "N/A"}</div>
      ),
    },
    {
      title: <div style={{ textAlign: 'center' }}>หอ</div>,
      dataIndex: ['reservation', 'Dorm', 'dorm_name'],
      key: 'dorm_name',
      render: (text: string) => (
        <div style={{ textAlign: 'center', fontWeight: 'bold', color: '#4A4A4A' }}>{text || "N/A"}</div>
      ),
    },
    {
      title: <div style={{ textAlign: 'center' }}>ห้อง</div>,
      dataIndex: ['reservation', 'Room', 'room_number'],
      key: 'room_number',
      render: (text: string) => (
        <div style={{ textAlign: 'center', fontWeight: 'bold', color: '#4A4A4A' }}>{text || "N/A"}</div>
      ),
    },
    {
      title: <div style={{ textAlign: 'center' }}>สถานะ</div>,
      dataIndex: 'status',
      key: 'status',
      render: (text: string) => (
        <div style={{ textAlign: 'center', fontWeight: 'bold', color: '#4A4A4A' }}>{text}</div>
      ),
    },
    {
      title: <div style={{ textAlign: 'center' }}>รายละเอียด</div>,
      key: 'details',
      render: (_: any, record: TableRequestDelayingPaymentRecord) => (
        <div style={{ textAlign: 'center' }}>
          <Button
            type="primary"
            onClick={() => handleDetailsClick(record.key)}
            style={{ marginTop: '8px' }}
          >
            ดูรายละเอียด
          </Button>
        </div>
      ),
    },
  ];
  return (
    <div style={{ padding: '20px', backgroundColor: '#FFFFFF', minHeight: '100vh' }}>
      {/* Header with underline */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginBottom: '20px',
        }}
      >
        <Title level={2} style={{ margin: 0, color: '#333' }}>
        รายการฟอร์มผ่อนผัน

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
      {selectedKey ? (
        <div>
          <Button
            type="default"
            onClick={handleBackClick}
            style={{ marginBottom: '16px', borderColor: '#d9d9d9', color: '#1890ff' }}
          >
            กลับไปหน้าเดิม
          </Button>
          <ReadDelayingPayment ID={Number(selectedKey)} />
        </div>
      ) : (
            <Table
              columns={columns}
              dataSource={DelayingPayment}
              pagination={false}
              bordered
              style={{ marginBottom: '20px' }}
              rowClassName={(_record, index) => (index % 2 === 0 ? 'even-row' : 'odd-row')}
            />
      )}
    </div>
  );
};

export default DelayingPayment;