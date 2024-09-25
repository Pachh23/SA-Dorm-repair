import React, { useEffect, useState } from "react";
import { Modal, Row, Col, Divider, Table, Button, message } from "antd";
import type { TableProps } from "antd";
import {
  CreateReservation,
  GetReservationsByRoomID,
  GetStudentsByRoomID,
  GetReservationsByStudentID,
  UpdateRoom,
  CreateExpense,
} from "../../../services/https";
import { ReservationInterface } from "../../../interfaces/Reservation";
import { RoomInterface } from "../../../interfaces/Room";
import { ExpenseInterface } from '../../../interfaces/Expense';
import axios from "axios";
import "./Bsub.css";
interface ReviewModalProps {
  isVisible: boolean;
  handleCancel: () => void;
  room: RoomInterface | null;
  dorm_id: number;
  room_id: number;
  updateReservationsCount: () => Promise<void>;
  amount: number;
}
const ModalTest: React.FC<ReviewModalProps> = ({
  isVisible,
  handleCancel,
  room,
  dorm_id,
  room_id,
  updateReservationsCount,
}) => {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [reservedStudentIDs, setReservedStudentIDs] = useState<Set<number>>(new Set());
  const [isConfirmButtonDisabled, setIsConfirmButtonDisabled] = useState<boolean>(true);
  const studentID = localStorage.getItem("student_id"); // เรียก ID นักศึกษา (string)
  //const studentID = SID ? parseInt(SID, 10) : null; // แปลงเป็น number หรือ null
  const columns: TableProps<any>["columns"] = [
    { title: "รหัสนักศึกษา", dataIndex: "StudentID", key: "StudentID" },
    { title: "ชื่อ - นามสกุล", dataIndex: "name", key: "name" },
    { title: "สำนัก", dataIndex: "major", key: "major" },
    { title: "ชั้นปี", dataIndex: "year", key: "year" },
    { title: "ค่าห้อง", dataIndex: "amount", key: "amount" },
  ];

  const fetchStudents = async () => {
    setLoading(true);
    setStudents([]);
    setReservedStudentIDs(new Set());
    if (room && room.ID) {
      try {
        const result = await GetStudentsByRoomID(room.ID);
        console.log(`Fetching dorm with amount: ${room.Dorm.amount}`);
        console.log(`Fetching dorm with room_id: ${room.ID}`);
        if (Array.isArray(result)) {
          const formattedStudents = result.map((student) => ({
            StudentID: student.student_id || "ไม่ระบุ",
            name: `${student.first_name || "ไม่ระบุ"} ${student.last_name || "ไม่ระบุ"}`,
            major: student.major || "ไม่ระบุ",
            year: student.year || "ไม่ระบุ",
            amount: room.Dorm.amount || "ไม่ระบุ",
          }));
          setStudents(formattedStudents);
          const reservedIDs = new Set(result.map((student) => student.StudentID));
          setReservedStudentIDs(reservedIDs);
          setIsConfirmButtonDisabled(reservedIDs.has(studentID)); // ใช้ studentID ที่เป็นสตริง
        } else {
          setIsConfirmButtonDisabled(false);
        }
      } catch (error) {
        console.error("Error fetching students:", error);
        message.error("ไม่สามารถดึงข้อมูลนักศึกษาได้");
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (isVisible) {
      fetchStudents();
    }
  }, [room, isVisible]);

  const handleConfirm = async () => {
    if (!room) {
      message.error("ข้อมูลห้องไม่ถูกต้อง");
      return;
    }

    if (studentID === null) {
      message.error("ไม่พบ ID นักศึกษา");
      return;
    }

    try {
      // ตรวจสอบว่านักเรียนมีการจองอยู่แล้วหรือไม่
      const studentReservations = await GetReservationsByStudentID(String(studentID));
      if (studentReservations.length > 0) {
        message.warning("นักศึกษาได้จองห้องพักแล้ว");
        return;
      }

      // ตรวจสอบว่าห้องเต็มหรือไม่
      const reservations = await GetReservationsByRoomID(room.ID);
      if (reservations.length >= 3) {
        message.error("ห้องนี้จองเต็มแล้ว");
        return;
      }
      const today = new Date();
      const reservationDate = new Date(today.setHours(today.getHours() + 7)); // เพิ่ม 7 ชั่วโมง

      // เตรียมข้อมูลสำหรับการจองใหม่
      const reservationData: ReservationInterface = {
        ID: undefined,
        reservation_date: reservationDate, // ใช้เป็น Date
        student_id: studentID,
        dorm_id: dorm_id,
        room_id: room_id,
      };


      await CreateReservation(reservationData);

      // เตรียมข้อมูลสำหรับการอัปเดตห้อง
      const roomData: RoomInterface = {
        ...room,
        dorm_status: room.dorm_status, // อัปเดตตามความจำเป็น
      };

      await UpdateRoom(room_id, roomData); // ส่งทั้งสองอาร์กิวเมนต์
      message.success("จองห้องสำเร็จ!");

      // เพิ่มการสร้างค่าใช้จ่ายหลังจากจองห้องสำเร็จ
      const expenseData: ExpenseInterface = {
        totalamount: room.Dorm.amount, // ใช้ค่า amount จากข้อมูลหอพักเป็น totalamount
        date: new Date(), // วันที่การใช้จ่าย
      };
    

      await CreateExpense(expenseData); // เรียกฟังก์ชันสร้างค่าใช้จ่าย

      await updateReservationsCount();

      // Close the modal after a short delay
      setTimeout(() => handleCancel(), 1000);
    } catch (error) {
      console.error("Error during reservation:", error);
      if (axios.isAxiosError(error)) {
        message.error(error.response?.data.message || "เกิดข้อผิดพลาดในการจองห้อง");
      } else {
        message.error("เกิดข้อผิดพลาดที่ไม่คาดคิด");
      }
    }
  };

  const handleModalClose = async () => {
    handleCancel();
  };

  return (
    <Modal
      title={`ห้อง ${room ? room.room_number : "Loading..."}`}
      open={isVisible}
      onCancel={handleModalClose}
      footer={null}
      centered
    >
      {room ? (
        <>
          <Row>
            <Col>
              <h2>รายชื่อผู้ร่วมห้อง</h2>
            </Col>
          </Row>
          <Divider />

          {loading ? (
            <p>กำลังโหลดข้อมูล...</p>
          ) : students.length === 0 ? (
            <p>ยังไม่มีผู้จอง</p>
          ) : (
            <Table columns={columns} dataSource={students} pagination={false} loading={loading} />
          )}

          <div className="flex-right">
            <Button
              type="primary"
              onClick={handleConfirm}
              disabled={isConfirmButtonDisabled} // ปิดการใช้งานปุ่มตามเงื่อนไข
            >
              ยืนยัน
            </Button>
          </div>
        </>
      ) : (
        <p>Loading room details...</p>
      )}
    </Modal>
  );
};

export default ModalTest;
