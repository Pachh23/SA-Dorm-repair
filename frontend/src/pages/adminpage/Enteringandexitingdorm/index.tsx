import React, { useState, useEffect } from 'react';
import { Button, Table, Typography, Card, Modal } from 'antd';
import ReadEnteringAndExitingDorm from '../Enteringandexitingdorm/ReadEnteringandexitingdorm/index';
import { ListEn_ExitingForm } from '../../../services/https';
import { En_ExitingFormInterface } from "../../../interfaces/En_ExitingForm";

const { Title } = Typography;

interface TableEn_ExitingFormInterfaceRecord extends En_ExitingFormInterface {
  key: string;
  date: string;
}

const EnteringAndExitingDorm: React.FC = () => {
  const [EnteringAndExitingDorm, setEnteringAndExitingDorm] = useState<TableEn_ExitingFormInterfaceRecord[]>([]);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  useEffect(() => {
    const fetchEn_ExitingForm = async () => {
      try {
        const data = await ListEn_ExitingForm();
        console.log('Data from API:', data);
        if (data) {
          const filteredData = data.filter((item: En_ExitingFormInterface) => item.status !== 'completed');
          const transformedData = filteredData.map((item: En_ExitingFormInterface, index: number) => ({
            ...item,
            key: item.ID?.toString() || index.toString(),
          }));
          console.log('Transformed Data:', transformedData);
          setEnteringAndExitingDorm(transformedData);
        }
      } catch (error) {
        console.error('Error fetching En_ExitingForm:', error);
      }
    };

    fetchEn_ExitingForm();
    const intervalId = setInterval(fetchEn_ExitingForm, 3000);
    return () => clearInterval(intervalId);
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
      render: (_: any, record: TableEn_ExitingFormInterfaceRecord) => (
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
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginBottom: '20px',
        }}
      >
        <Title level={2} style={{ margin: 0, color: '#333' }}>
          แบบฟอร์มขออนุญาตเข้า-ออกหอพักหลังเวลาปิดหอพัก/ค้างคืน
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
          <ReadEnteringAndExitingDorm ID={Number(selectedKey)} />
        </div>
      ) : (
            <Table
              dataSource={EnteringAndExitingDorm}
              columns={columns}
              pagination={false}
              bordered
              style={{ marginBottom: '20px' }}
              rowClassName={(_record, index) => (index % 2 === 0 ? 'even-row' : 'odd-row')}
            />
      )}
    </div>
  );
};

export default EnteringAndExitingDorm;
