import React, { useEffect, useState } from 'react';
import { Table } from 'antd';
import { GetStudentsByRoomID, GetUserRoom } from '../../services/https';

interface StudentsData {
  student_id: string;
  first_name: string;
  last_name: string;
  major: string;
  year: number;
  amount: number;
}

const Listpages: React.FC = () => {
  const [students, setStudents] = useState<StudentsData[]>([]);
  const [roomID, setRoomID] = useState<number | null>(null);
  const [roomNumber, setRoomNumber] = useState<number | null>(null);
  const [dormName, setDormName] = useState<string | null>(null);

  useEffect(() => {
    const studentID = localStorage.getItem("student_id");

    const fetchUserRoom = async () => {
      if (studentID === null) return;

      try {
        const roomData = await GetUserRoom(studentID);
        console.log(roomData);

        if (Array.isArray(roomData) && roomData.length > 0) {
          const { room_id, room_number, dorm_name } = roomData[0];
          setRoomID(room_id);
          setRoomNumber(room_number);
          setDormName(dorm_name);
        } else {
          console.error("ไม่พบข้อมูลห้องสำหรับผู้ใช้");
        }
      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการตรวจสอบห้องของผู้ใช้:", error);
      }
    };

    fetchUserRoom();
  }, []);

  useEffect(() => {
    const fetchStudents = async () => {
      if (roomID !== null) {
        try {
          const result = await GetStudentsByRoomID(roomID);
          console.log("API Response:", result);

          if (result && Array.isArray(result) && result.length > 0) {
            const CombinedData: StudentsData[] = result.map((data) => ({
              student_id: data.student_id || 'ไม่ระบุ',
              first_name: data.first_name || 'ไม่ระบุ',
              last_name: data.last_name || 'ไม่ระบุ',
              major: data.major || 'ไม่ระบุ',
              year: Number(data.year) || 0,
              amount: Number(data.amount) || 0,
            }));

            setStudents(CombinedData);
          } else {
            console.error("ข้อมูลที่ได้รับไม่ถูกต้อง", result);
          }
        } catch (error) {
          console.error("เกิดข้อผิดพลาดในการเรียก API:", error);
        }
      }
    };

    fetchStudents();
  }, [roomID]);

  const columns = [
    {
      title: 'รหัสนักศึกษา',
      dataIndex: 'student_id',
      key: 'student_id',
    },
    {
      title: 'ชื่อ - นามสกุล',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: StudentsData) => `${record.first_name} ${record.last_name}`,
    },
    {
      title: 'สำนัก',
      dataIndex: 'major',
      key: 'major',
    },
    {
      title: 'ชั้นปี',
      dataIndex: 'year',
      key: 'year',
    },
    {
      title: 'ค่าห้อง',
      dataIndex: 'amount',
      key: 'amount',
    },
  ];

  return (
    <div>
      <h2>{dormName ? dormName : ""} ห้องพัก {roomNumber ? roomNumber : ""}</h2>
      <Table
        columns={columns}
        dataSource={students}
        pagination={false}
        rowKey="student_id"
      />
    </div>
  );
};

export default Listpages;