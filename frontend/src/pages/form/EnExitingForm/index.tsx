import {
  Button,
  Space,
  Form,
  Input,
  Radio,
  Row,
  Col,
  notification,
  DatePicker,
  Card,
  Divider,
  Typography,
  message,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
const { Text } = Typography;
import "../../repair/index.css";

import { En_ExitingFormInterface } from "./../../../interfaces/En_ExitingForm";
import { StudentInterface } from "./../../../interfaces/Student";
import { DormInterface } from "./../../../interfaces/Dorm";
import { RoomInterface } from "./../../../interfaces/Room";
import {
  CreateEn_ExitingForm,
  GetListFormStudent,
  GetListFormDorm,
} from "./../../../services/https";

export default function EnExitingFormCreate() {
  interface StudentInfoRecord extends StudentInterface, DormInterface {
    key: string | null; // Allow null
    dorm_name: string;
    StudentID: string;
    FirstName: string;
    LastName: string;
    room_number: number | string;
  }

  const [messageApi, contextHolder] = message.useMessage();

  const [form] = Form.useForm();

  const today = new Date();
  const formattedDate = today.toLocaleDateString();

  const [value, setValue] = useState(1);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [student, setStudent] = useState<StudentInfoRecord[]>([]);

  const disabledDate = (current: any) => {
    // Can not select days before today
    return current && current.isBefore(today, "day");
  };

  const onChange = (e: any) => {
    console.log("radio checked", e.target.value);
    setValue(e.target.value);
  };

  const handleReset = () => {
    form.resetFields(); // รีเซ็ตข้อมูลฟอร์ม
  };

  const openNotification = (
    type: "success" | "info" | "warning" | "error",
    message: string,
    description?: string
  ) => {
    notification[type]({
      message: message,
      description: description,
      placement: "bottomRight",
    });
  };

  const onFinish = async (values: En_ExitingFormInterface) => {
    const studentId = localStorage.getItem("id");
    if (studentId) {
      values.date_submission = new Date(); // เพิ่มวันที่ปัจจุบัน
    } else {
      openNotification(
        "error",
        "ไม่พบรหัสนักศึกษา",
        "ไม่สามารถส่งข้อมูลได้เนื่องจากไม่พบรหัสนักศึกษา"
      );
      return;
    }

    try {
      // สร้างรายการแจ้งซ่อม
      let res = await CreateEn_ExitingForm(values);
      console.log(res);

      // ตรวจสอบผลลัพธ์จาก CreateRepair อย่างละเอียด
      if (res && res.status === 201) {
        // ตรวจสอบว่ามีสถานะ HTTP 201 แสดงว่าคำขอสำเร็จ
        openNotification(
          "success",
          "บันทึกข้อมูลสำเร็จ",
          "ข้อมูลของคุณได้ถูกบันทึกเรียบร้อยแล้ว"
        );
        form.resetFields(); // รีเซ็ตฟอร์มหลังบันทึกข้อมูลสำเร็จ
      } else {
        openNotification(
          "error",
          "เกิดข้อผิดพลาด!",
          "เกิดข้อผิดพลาดในการบันทึกข้อมูล กรุณาจองห้องพัก"
        );
      }
    } catch (error) {
      console.error(error);
      openNotification(
        "error",
        "ไม่สามารถแสดงข้อมูลได้",
        "เกิดข้อผิดพลาดในการส่งข้อมูล กรุณาจองห้องพัก"
      );
    }
  };

  useEffect(() => {
    const studentId = localStorage.getItem("id");
    const fetchData = async () => {
      try {
        const dataStudent = await GetListFormStudent();
        const dataDorm = await GetListFormDorm();
        console.log("Received dataStudent:", dataStudent);
        console.log("Received dataDorm:", dataDorm);

        // ตรวจสอบว่ามีข้อมูล student หรือไม่
        if (dataStudent) {
          const studentData = {
            key: studentId,
            StudentID: dataStudent.student.student_id || "ไม่พบข้อมูล",
            FirstName: dataStudent.student.first_name || "ไม่พบข้อมูล",
            LastName: dataStudent.student.last_name || "ไม่พบข้อมูล",
          };

          // ถ้ามีหอและห้องพักแล้ว
          if (dataDorm && dataDorm.reservation) {
            const dormData = {
              dorm_name: dataDorm.reservation.Dorm.dorm_name || "ไม่มีหอ",
              room_number: dataDorm.reservation.Room.room_number || "ไม่มีห้อง",
            };

            const combinedData = { ...studentData, ...dormData };
            setStudent([combinedData]);

            // ถ้าไม่มีหอและห้องพัก
          } else {
            const dormData = { dorm_name: "ไม่มีหอ", room_number: "ไม่มีห้อง" };
            const combinedData = { ...studentData, ...dormData };
            setStudent([combinedData]);
          }
        } else {
          setErrorMessage("ไม่พบข้อมูลนักศึกษา");
          openNotification(
            "error",
            "เกิดข้อผิดพลาด!",
            "ไม่สามารถแสดงรหัสนักศึกษาได้"
          );
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setErrorMessage("เกิดข้อผิดพลาดในการดึงข้อมูล");
        openNotification(
          "error",
          "เกิดข้อผิดพลาด!",
          "เกิดข้อผิดพลาดในการดึงข้อมูล กรุณาลองใหม่อีกครั้ง"
        );
      }
    };

    if (studentId) {
      fetchData();
    } else {
      messageApi.open({
        type: "error",
        content: "Student ID not found.",
      });
    }
  }, []);

  return (
    <>
      <Card>
        <h2>แบบฟอร์มขออนุญาติเข้า-ออกหอพักหลังเวลาปิดหอพัก/ค้างคืนนอกหอพัก</h2>
        <Divider />
        <Form name="StudentDetails" form={form} layout="vertical">
          <Row justify="space-between" align="middle">
            <Col>
              <Space direction="vertical">
                <Text>
                  ผู้รับบริการ{" "}
                  {student.length > 0 ? student[0].StudentID : "ไม่พบข้อมูล"}{" "}
                  {student.length > 0 ? student[0].FirstName : "ไม่พบข้อมูล"}{" "}
                  {student.length > 0 ? student[0].LastName : "ไม่พบข้อมูล"}
                </Text>
                <Text>
                  อาคาร:{" "}
                  {student.length > 0 ? student[0].dorm_name : "ไม่พบข้อมูล"}{" "}
                  ห้อง:{" "}
                  {student.length > 0 ? student[0].room_number : "ไม่พบข้อมูล"}
                </Text>
              </Space>
            </Col>
            <Col>
              <Text>วันที่ปัจจุบัน: {formattedDate}</Text>
            </Col>
          </Row>
        </Form>
        <br />
        <Form
          name="En_ExitingForm"
          form={form}
          layout="horizontal"
          onFinish={onFinish}
          autoComplete="on"
        >
          <Row gutter={64}>
            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
              <Form.Item
                label="เรื่องที่ขอ:"
                name="Request"
                rules={[
                  { required: true, message: "กรุณาเลือกเรื่องที่ขออนุญาติ !" },
                ]}
              >
                <Radio.Group onChange={onChange} value={value}>
                  <Space direction="vertical">
                    <Radio value="ขอกลับหอพักหลังเวลาปิดหอพัก">
                      ขอกลับหอพักหลังเวลาปิดหอพัก
                    </Radio>
                    <Radio value="ขอออกจากหอพักก่อนเวลาเปิดหอพัก">
                      ขอออกจากหอพักก่อนเวลาเปิดหอพัก
                    </Radio>
                    <Radio value="ค้างคืนนอกหอพัก">ค้างคืนนอกหอพัก</Radio>
                  </Space>
                </Radio.Group>
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
              <Form.Item
                label="เนื่องจาก"
                name="Because_Of"
                rules={[{ required: true, message: "กรุณากรอกเหตุผล !" }]}
              >
                <Input.TextArea />
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
              <Form.Item
                label="วันที่ขออนุญาติ"
                name="Date_Request"
                rules={[
                  { required: true, message: "กรุณาเลือกวัน/เดือน/ปี !" },
                ]}
              >
                <DatePicker
                  style={{ width: "100%" }}
                  disabledDate={disabledDate}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row justify="end">
            <Col style={{ marginTop: "40px" }}>
              <Form.Item>
                <Space>
                  <Button
                    htmlType="button"
                    onClick={handleReset}
                    style={{ marginRight: "10px" }}
                  >
                    ยกเลิก
                  </Button>
                  <Button
                    type="primary"
                    htmlType="submit"
                    icon={<PlusOutlined />}
                  >
                    ยืนยัน
                  </Button>
                </Space>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>
    </>
  );
}