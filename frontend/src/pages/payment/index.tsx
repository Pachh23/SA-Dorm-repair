import React, { useState, useEffect, useCallback } from 'react';
import { PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { Tag, Button, Form, message, Upload, Modal, Table, QRCode, Space, Divider, Steps, UploadFile, UploadProps, TableProps, GetProp, Input } from 'antd';
import Barcode from 'react-barcode'; // นำเข้า Barcode
import { Link, useNavigate, useParams } from "react-router-dom";
import "./index.css";
import axios from 'axios';

import { StudentInterface } from "./../../interfaces/Student";
import { SlipInterface } from "../../interfaces/slip";
import { DormInterface } from "./../../interfaces/Dorm";
import { RoomInterface } from "./../../interfaces/Room";
import { ReservationInterface } from "./../../interfaces/Reservation";
import { CreateSlip, GetListSlips, GetSlip, UpdateSlip, CreateExpense, fetchExpenses, ListExpense } from "../../services/https";
import Slip from "./../adminpage/PaymentConfirmation";
import { ExpenseInterface } from '../../interfaces/Expense';
import { WaterInterface } from '../../interfaces/Waterfee';
import { ElectricityInterface } from '../../interfaces/Electricityfee';

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];
type CombinedData = ReservationInterface & StudentInterface & SlipInterface & DormInterface & RoomInterface & ExpenseInterface;

const { TextArea } = Input;


interface ExpenseData
  extends StudentInterface,
  WaterInterface,
  DormInterface,
  ElectricityInterface {

  ID: number;
  date: Date;
  status: string;
  totalamount: number;
  remark: string;
  dorm_id: number;
  elec_id: number;
  water_id: number;
  student_id: string;
}

const Index: React.FC = () => {

  const studentDbID = localStorage.getItem("id");

  const [text] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [totalamount, setTotalAmount] = useState<number>(0);
  const [ExpenseData, setExpenseData] = useState<ExpenseData[]>([]);

  const showModal = () => { setIsModalOpen(true); };
  const handleOk = () => { setIsModalOpen(false); };

  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [form] = Form.useForm();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [student, setStudent] = useState<ExpenseData[]>([]);
  //const response = await CreateSlip({Path});

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await ListExpense();
        console.log("Received data:", response);

        if (response && response.data) {
          const expense = response.data;
          console.log("Expense data:", expense);

          const CombinedData: ExpenseData[] = expense.map((data: any) => ({
            ID: data.ID,
            date: new Date(data.date), // ใช้ชื่อคุณสมบัติที่ถูกต้อง
            totalamount: data.totalamount || 0,
            dorm_id: data.Dorm.amount || 0,
            elec_id: data.electricityfee.amount || 0,
            water_id: data.waterfee.amount || 0,
            reservation_id: data.reservation.student_id,
            status: [data.status || "Unknown"],
          }));
          console.log("Expense data:", expense);

          const totalamount = ExpenseData.reduce((acc, expense) => acc + (expense.totalamount || 0), 0);

          console.log("CombinedData:", CombinedData);
          console.log(ExpenseData); // ตรวจสอบค่า ID ของแต่ละ expense
          console.log("Response from ListExpense:", response.data);

          console.log("CombinedData:", CombinedData);
          setExpenseData(CombinedData); // ตั้งค่า CombinedData ใน state

        } else {
          console.error("Unexpected data format:", response.data);
          message.error('ไม่พบข้อมูลค่าใช้จ่าย หรือข้อมูลไม่อยู่ในรูปแบบที่คาดไว้');
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        message.error('เกิดข้อผิดพลาดในการดึงข้อมูล');
      }
    };

    fetchExpenses(); // รีเฟรชข้อมูลทุกๆ 30 วินาที
  }, []);

  const columns: TableProps<ExpenseData>['columns'] = [
    {
      title: 'วันที่',
      dataIndex: 'date',
      key: 'date',
      render: (date: Date) => date ? new Date(date).toLocaleDateString() : 'Invalid Date', // แสดงวันที่
    },
    {
      title: 'ค่าหอพัก',
      dataIndex: 'dorm_id',
      key: 'dorm_id',
      render: (dorm_id: number) => `${dorm_id.toFixed(2)} `, // แสดงจำนวนเงิน
    },
    {
      title: 'ค่าไฟฟ้า',
      dataIndex: 'elec_id',
      key: 'elec_id',
      render: (elec_id: number) => `${elec_id.toFixed(2)} `, // แสดงจำนวนเงิน
    },
    {
      title: 'ค่าน้ำ',
      dataIndex: 'water_id',
      key: 'water_id',
      render: (water_id: number) => `${water_id.toFixed(2)} `, // แสดงจำนวนเงิน
    },
    {
      title: "สถานะ",
      key: "status",
      dataIndex: "status", // ตรวจสอบให้ตรงกับฟิลด์ในข้อมูล
      render: (status: string[]) => (
        <>
          {status.map((Status: string) => {
            let color: string;
            switch (Status) {
              case "รอดำเนินการ":
                color = "#bfbfbf";
                break;
              case "กำลังดำเนินการ":
                color = "#1677ff";
                break;
              case "อนุมัติ":
              case "เสร็จสิ้น":
                color = "#52c41a";
                break;
              default:
                color = "default";
            }
            return (
              <Tag color={color} key={Status}>
                {Status}
              </Tag>
            );
          })}
        </>
      ),
    },
  ];
  console.log("Expense data state:", ExpenseData);


  const onChange: UploadProps["onChange"] = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const onPreview = async (file: UploadFile) => {
    let src = file.url as string;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj as FileType);
        reader.onload = () => resolve(reader.result as string);
      });
    }
    const path = new Image();
    path.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(path.outerHTML);
  };

  const onFinish = async (values: SlipInterface) => {
    values.path = fileList[0]?.thumbUrl || "";

    const studentId = localStorage.getItem("id");
    if (studentId) {

    } else {
      messageApi.open({
        type: "error",
        content: "Student ID on finish is not found.",
      });
    }

    let res = await CreateSlip(values);
    console.log("CreateSlip: ", res);

    if (res) {
      messageApi.open({
        type: "success",
        content: "บันทึกข้อมูลสำเร็จ",
      });
      form.resetFields(); // รีเซ็ตฟอร์มหลังบันทึกข้อมูลสำเร็จ
      setFileList([]); // รีเซ็ตไฟล์อัปโหลด
      setTimeout(() => {
        // ตรวจสอบ URL ให้ถูกต้อง
      }, 2000);
    } else {
      messageApi.open({
        type: "error",
        content: "เกิดข้อผิดพลาด!",
      });
    }

  };

  const beforeUpload: UploadProps['beforeUpload'] = (file) => {
    // Prevent automatic upload
    setFileList([...fileList, file]);
    return false;
  };


  return (
    <>
      <br />
      <Space style={{ display: 'flex', justifyContent: 'center' }}>
        <div className='text-container'>
          <div className='text-1'>แจ้งยอดชำระ</div>
        </div>
      </Space>

      <Divider />
      <div className='text-container'></div>
      <Table columns={columns} dataSource={ExpenseData.map(expense => ({ ...expense, key: expense.StudentID }))} 
        pagination={false}/>
        
      <div style={{ marginTop: '20px', fontWeight: 'bold' }}>
        ยอดรวมทั้งหมด: {ExpenseData.reduce((acc, expense) => acc + (expense.totalamount || 0), 0).toFixed(2)} บาท
      </div>
      <br />
      <Button type="primary"  onClick={showModal}>
        ชำระเงินที่นี่
      </Button>
      <Modal
        title="ช่องทางการชำระเงิน"
        open={isModalOpen}
        footer={[
          <Button key="ok"  type="primary" onClick={handleOk}>
            Ok
          </Button>
        ]}
        closable={false}
        className="modal-content"

      >
        <Space direction="vertical" align="center">
          <p className="modal-text">ธนาคาร ABC 123-4567-890</p>
          <QRCode value={text || '-'} />
          {/* เพิ่ม Barcode */}
          <Barcode
            value="123456789012" // แทนที่ด้วยข้อมูล Barcode ของคุณ
            format="CODE128" // กำหนดรูปแบบของ Barcode
            width={2}
            height={60}
          />
        </Space>
      </Modal>
      <div className='text-container'>
        <div className='text-7'>
          <Form
            name="basic"
            layout="vertical"
            onFinish={onFinish}
            autoComplete="off"
          >
            <Form.Item>
              <Space style={{ display: 'flex', justifyContent: '', marginTop: '20px' }}>
                <Form.Item
                  name="path"
                  label="อัพโหลดไฟล์ที่นี่"
                  valuePropName="fileList"
                  getValueFromEvent={(e) => e.fileList}
                  rules={[{ required: true, message: 'กรุณาอัพโหลดไฟล์ก่อน!' }]}
                >
                  <Upload
                    fileList={fileList}
                    onChange={onChange}
                    onPreview={onPreview}
                    beforeUpload={beforeUpload}
                    maxCount={1}
                    multiple={false}
                    listType="picture"
                  >
                    <Button icon={<UploadOutlined />} >Upload</Button>
                  </Upload>
                </Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ backgroundColor: '#1890ff', color: 'white', borderColor: '#1890ff' }}
                >
                  ยืนยัน
                </Button>
                {contextHolder}
              </Space>
            </Form.Item>
          </Form>

        </div>
      </div>
    </>
  );
}
export default Index