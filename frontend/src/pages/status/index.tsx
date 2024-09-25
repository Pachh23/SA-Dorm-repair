import React, { useEffect, useState } from "react";
import { Tag, Table, Typography, message } from "antd";
import { useNavigate } from "react-router-dom";
import { SortOrder } from "antd/es/table/interface"; // Import SortOrder

import { GetListStatus } from "./../../services/https";
import { RepairInterface } from "./../../interfaces/repairing";
import { DelayedPaymentFormInterface } from "./../../interfaces/delayedpaymentform";
import { En_ExitingFormInterface } from "./../../interfaces/En_ExitingForm";
import { ResigningFormInterface } from "./../../interfaces/ResigningForm";

const { Title } = Typography;

export default function StatusCreate() {
  interface TableStatusRecord
    extends RepairInterface,
      DelayedPaymentFormInterface,
      En_ExitingFormInterface,
      ResigningFormInterface {
    key: string;
    title: string;
    date_submission: Date;
    type: string;
    status: string;
  }

  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const [repairs, setRepairs] = useState<TableStatusRecord[]>([]);
  const [delayedpaymentforms, setDelayedPaymentForms] = useState<
    TableStatusRecord[]
  >([]);
  const [en_exitingforms, setEn_ExitingForms] = useState<TableStatusRecord[]>(
    []
  );
  const [resigningforms, setResigningForms] = useState<TableStatusRecord[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const formatDate = (dateString?: Date): string => {
    if (!dateString) return ""; // Handle undefined or null dates
    const date = new Date(dateString);
    return date.toISOString(); // Format to 'YYYY-MM-DD'
  };

  const columns = [
    {
      title: "วันที่ยื่นคำร้อง",
      dataIndex: "Date",
      key: "Date",
      sorter: (a: TableStatusRecord, b: TableStatusRecord) => {
        const dateA = new Date(a.date_submission).getTime();
        const dateB = new Date(b.date_submission).getTime();
        return dateB - dateA; 
      },
      defaultSortOrder: "ascend" as SortOrder,
      sortDirections: ["ascend", "descend"] as SortOrder[],
      render: (text: string) => {
        const date = new Date(text);
        return date.toLocaleDateString("th-TH", {
          year: "numeric",
          month: "numeric",
          day: "numeric",
        });
      },
    },
    {
      title: "หัวข้อ",
      dataIndex: "Title", // ตรวจสอบให้ตรงกับฟิลด์ในข้อมูล
      key: "Title",
    },
    {
      title: "ประเภท",
      dataIndex: "Type", // ตรวจสอบให้ตรงกับฟิลด์ในข้อมูล
      key: "Type",
    },
    {
      title: "สถานะ",
      key: "Status",
      dataIndex: "Status", // ตรวจสอบให้ตรงกับฟิลด์ในข้อมูล
      render: (Status: string[]) => (
        <>
          {Status.map((status: string) => {
            let color: string;
            switch (status) {
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
              <Tag color={color} key={status}>
                {status}
              </Tag>
            );
          })}
        </>
      ),
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await GetListStatus();
        console.log("Received data:", data);

        if (
          data.delayed_payment_forms &&
          data.en_exiting_forms &&
          data.repairing_forms &&
          data.resigning_forms
        ) {
          const combinedData = [
            ...data.repairing_forms.map(
              (item: RepairInterface, index: number) => ({
                key: `repair-${index}`,
                Date: formatDate(item.date_submission),
                Title: item.title || "N/A",
                Type: item.type || "N/A",
                Status: [item.status || "Unknown"],
              })
            ),
            ...data.delayed_payment_forms.map(
              (item: DelayedPaymentFormInterface, index: number) => ({
                key: `delayed-${index}`,
                Date: formatDate(item.date_submission),
                Title: item.title || "N/A",
                Type: item.type || "N/A",
                Status: [item.status || "Unknown"],
              })
            ),
            ...data.en_exiting_forms.map(
              (item: En_ExitingFormInterface, index: number) => ({
                key: `en-exiting-${index}`,
                Date: formatDate(item.date_submission),
                Title: item.title || "N/A",
                Type: item.type || "N/A",
                Status: [item.status || "Unknown"],
              })
            ),
            ...data.resigning_forms.map(
              (item: ResigningFormInterface, index: number) => ({
                key: `resigning-${index}`,
                Date: formatDate(item.date_submission),
                Title: item.title || "N/A",
                Type: item.type || "N/A",
                Status: [item.status || "Unknown"],
              })
            ),
          ];

          // Sort by date in descending order (new to old)
          const sortedData = combinedData.sort((a, b) => {
            const dateA = new Date(a.Date).getTime();
            const dateB = new Date(b.Date).getTime();
            return dateB - dateA; // Sort by new to old
          });

          setRepairs(sortedData);
        } else {
          setErrorMessage("Received data is missing expected fields");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setErrorMessage("Failed to fetch data");
      }
    };

    fetchData();
  }, []);

  return (
    <>
      {contextHolder}
      {/*
      <div className="text-container">
        <div className="text-1">ติดตามสถานะของปัญหา</div>
      </div>
      */}
      <h2>ติดตามสถานะของปัญหา</h2>
      <br />
      <Table
        columns={columns}
        dataSource={repairs}
        pagination={{ pageSize: 6 }} // Set the number of rows per page
      />
    </>
  );
}
