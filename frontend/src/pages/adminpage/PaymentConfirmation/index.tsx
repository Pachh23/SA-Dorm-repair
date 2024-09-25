import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, message } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { FileImageOutlined } from '@ant-design/icons';
import { Getslipcompleted, Updateexpense } from '../../../services/https';
import { SlipInterface } from "../../../interfaces/slip";
import dayjs from 'dayjs';

interface PaymentData {
  key: string;
  time: string;
  amount: number;
  slip: string; // นี่ควรเป็น base64 string หรือ URL ที่ถูกต้อง
  confirmed?: boolean;
  expenseId: number;
  reservationId: number; // เพิ่มฟิลด์สำหรับ reservation_id
}

const PaymentConfirmation: React.FC = () => {
  const [visible, setVisible] = useState<boolean>(false);
  const [confirmModalVisible, setConfirmModalVisible] = useState<boolean>(false);
  const [currentImage, setCurrentImage] = useState<string>('');
  const [currentRecord, setCurrentRecord] = useState<PaymentData | null>(null);
  const [paymentData, setPaymentData] = useState<PaymentData[]>([]);

  // ดึงข้อมูลสลิปจาก API เมื่อคอมโพเนนต์โหลด
  useEffect(() => {
    const fetchSlips = async () => {
      try {
        const slips = await Getslipcompleted();
        if (slips && slips.length > 0) {
          // ตรวจสอบโครงสร้างข้อมูลก่อน
          const formattedData = slips.map((slip: any) => ({
            key: slip.ID,
            time: dayjs(slip.Slip.CreatedAt).format('DD/MM/YYYY HH:mm:ss'), // ฟอร์แมตวันที่
            amount: slip.Expense.totalamount, // ใช้ slip.Expense.totalamount แทน
            slip: slip.Slip.path, // ใช้ slip.Slip.path แทน
            reservationId: slip.Slip.reservation_id,
            confirmed: slip.Slip.confirmed,
        }));
        console.log(formattedData);
          setPaymentData(formattedData);
        } else {
          message.error('ไม่มีข้อมูลสลิปที่พร้อมใช้งาน');
        }
      } catch (error) {
        message.error('เกิดข้อผิดพลาดในการดึงข้อมูล');
      }
    };
    

    fetchSlips();
    const intervalId = setInterval(fetchSlips, 3000); // รีเฟรชข้อมูลทุก 3 วินาที
    return () => clearInterval(intervalId); // ล้าง interval เมื่อคอมโพเนนต์ถูกทำลาย
  }, []);

  const handleViewSlip = (url: string) => {
    if (url) {
      setCurrentImage(url);
      console.log("Current Image URL:", url); // ตรวจสอบ URL
      setVisible(true);
    } else {
      console.error('URL ของสลิปไม่ถูกต้อง');
    }
};

  const handleCancel = () => {
    setVisible(false);
    setCurrentImage('');
  };

  const handleConfirmClick = (record: PaymentData) => {
    console.log('Current Record for Confirmation:', record); // ตรวจสอบ record
    setCurrentRecord(record);
    setConfirmModalVisible(true);
};


  const handleConfirm = async () => {
    if (!currentRecord) return;

    try {
        // ตรวจสอบค่า reservationId ที่ส่งไป
        console.log('Updating expense with reservationId:', currentRecord.reservationId);

        // ตรวจสอบว่าค่า reservationId ไม่ว่าง
        if (!currentRecord.reservationId) {
            message.error('ไม่พบ reservationId ที่ถูกต้อง');
            return;
        }

        await Updateexpense(currentRecord.reservationId, { status: 'ชำระแล้ว' });

        const updatedData = paymentData.filter((item) => item.key !== currentRecord.key);
        setPaymentData(updatedData);
        
        message.success(`ยืนยันการชำระเงินสำหรับรายการ ${currentRecord.key} สำเร็จ`);
        setConfirmModalVisible(false);
    } catch (error) {
        message.error('เกิดข้อผิดพลาดในการยืนยัน');
    }
};


  const columns: ColumnsType<PaymentData> = [
    {
      title: <div style={{ textAlign: 'center' }}>เวลา</div>,
      dataIndex: 'time',
      key: 'time',
      align: 'center', // เพิ่มการจัดแนวกลางให้กับคอลัมน์
      render: (text) => <div style={{ textAlign: 'center' }}>{text}</div>, // จัดแนวกลางในแต่ละเซลล์
    },
    {
      title: <div style={{ textAlign: 'center' }}>จำนวนเงิน</div>,
      dataIndex: 'amount',
      key: 'amount',
      render: (text) => <div style={{ textAlign: 'center' }}>{`${text} บาท`}</div>,
    },
    {
      title: <div style={{ textAlign: 'center' }}>สลิป</div>,
      dataIndex: 'slip',
      key: 'slip',
      render: (text) => (
        <div style={{ textAlign: 'center' }}>
          <Button
            icon={<FileImageOutlined />}
            onClick={() => handleViewSlip(text)}
          >
            ดูภาพ
          </Button>
        </div>
      ),
    },
    {
      title: <div style={{ textAlign: 'center' }}>การดำเนินการ</div>,
      key: 'action',
      render: (_, record) => (
        <div style={{ textAlign: 'center' }}>
          <Button
            type="primary"
            disabled={record.confirmed}
            onClick={() => handleConfirmClick(record)}
          >
            {record.confirmed ? 'ยืนยันแล้ว' : 'ยืนยัน'}
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <div
        style={{
          textAlign: 'center',
          marginBottom: '20px',
          position: 'relative',
        }}
      >
        <span
          style={{
            fontSize: '25px',
            fontWeight: 'bold',
            paddingBottom: '10px',
          }}
        >
          การยืนยันการชำระเงิน
        </span>
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            borderBottom: '3px solid #000',
          }}
        />
      </div>

      <Table
        dataSource={paymentData}
        columns={columns}
        pagination={false}
        bordered
        style={{ marginBottom: '20px' }}
      />

      {/* Modal สำหรับดูสลิป */}
      <Modal
        visible={visible}
        footer={null}
        onCancel={handleCancel}
        width={600}
      >
        <img
          alt="Slip"
          style={{ width: '100%', height: 'auto' }}
          src={currentImage}
        />
      </Modal>

      {/* Modal สำหรับยืนยันการชำระเงิน */}
      <Modal
        visible={confirmModalVisible}
        onOk={handleConfirm}
        onCancel={() => setConfirmModalVisible(false)}
        title="ยืนยันการดำเนินการ"
        okText="ยืนยัน"
        cancelText="ยกเลิก"
      >
        <p>คุณต้องการยืนยันการชำระเงินนี้หรือไม่?</p>
      </Modal>
    </div>
  );
};

export default PaymentConfirmation;
