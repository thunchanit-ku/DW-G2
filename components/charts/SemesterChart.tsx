'use client';

import React, { useEffect, useState } from "react";
import { Card, Table } from "antd";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Chart } from "react-chartjs-2";
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';

// ✅ Register chart.js modules
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// ======================
//   MAIN COMPONENT
// ======================
interface SemesterResult {
  studentId: string;
  "ปีการศึกษา": number;
  "ภาคการศึกษา": string;
  "หน่วยกิตรวม": number | string;
  "GPAภาค": number;
  "GPAสะสม": number;
  "ผลต่างเกรด"?: number | null;
}

interface Props {
  studentId: string;
}

const SemesterResults: React.FC<Props> = ({ studentId }) => {
  const [semesterData, setSemesterData] = useState<SemesterResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!studentId) return;
    setLoading(true);

    fetch(`http://localhost:4000/api/student/grade-progress/${studentId}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setSemesterData(data);
        } else if (data) {
          setSemesterData([data]);
        } else {
          setSemesterData([]);
        }
      })
      .catch((err) => {
        console.error("Error fetching semester data:", err);
        setSemesterData([]);
      })
      .finally(() => setLoading(false));
  }, [studentId]);

  // ✅ เตรียมข้อมูลสำหรับกราฟ
  const labels = semesterData.map(
    (item) => `${item["ภาคการศึกษา"]} ${item["ปีการศึกษา"]}`
  );
  const semesterGPAs = semesterData.map((item) => item["GPAภาค"]);
  const cumulativeGPAs = semesterData.map((item) => item["GPAสะสม"]);

  // ✅ ฟังก์ชันเลือกสีตามเกรด
  const getGradeColor = (gpa: number) => {
    if (gpa < 1.75) return "rgba(239, 68, 68, 0.7)"; // 🔴
    if (gpa < 2.0) return "rgba(249, 115, 22, 0.7)"; // 🟠
    if (gpa < 3.25) return "rgba(74, 222, 128, 0.7)"; // 🟢
    return "rgba(96, 165, 250, 0.7)"; // 🔵
  };

  const barColors = semesterGPAs.map((gpa) => getGradeColor(gpa));

  // ✅ ตารางข้อมูล
  const semesterColumns = [
  { title: "ปีการศึกษา", dataIndex: "ปีการศึกษา", key: "year", align: "center" as const },
  { title: "ภาคการศึกษา", dataIndex: "ภาคการศึกษา", key: "semester", align: "center" as const },
  { title: "หน่วยกิตรวม", dataIndex: "หน่วยกิตรวม", key: "credits", align: "center" as const },
  { title: "GPA ภาค", dataIndex: "GPAภาค", key: "semesterGPA", align: "center" as const },
  { title: "GPA สะสม", dataIndex: "GPAสะสม", key: "cumulativeGPA", align: "center" as const },
  {
    title: "ผลต่างเกรด",
    dataIndex: "ผลต่างเกรด",
    key: "change",
    align: "center" as const,
    render: (value: number | null) => {
      if (value == null || value === "") return "-";
      return (
        <span className="flex items-center justify-center gap-1">
          {value > 0 ? <ArrowUpOutlined style={{ color: 'green' }} /> : value < 0 ? <ArrowDownOutlined style={{ color: 'red' }} /> : null}
          {value.toFixed(2)}
        </span>
      );
    },
  },
];
  const tableData = [
    ...semesterData,
    {
      key: "summary",
      "ปีการศึกษา": "ผลการเรียนเฉลี่ย",
      "ภาคการศึกษา": "",
      "หน่วยกิตรวม": semesterData.reduce(
        (sum, item) => sum + Number(item["หน่วยกิตรวม"]),
        0
      ),
      "GPAภาค":
        semesterData.reduce((sum, item) => sum + item["GPAภาค"], 0) /
        (semesterData.length || 1),
      "GPAสะสม": semesterData[semesterData.length - 1]?.["GPAสะสม"] || "-",
      "ผลต่างเกรด": "",
    },
  ];

  return (
    <Card title="รายงานผลการเรียนแต่ละภาคการศึกษา" className="mb-6 shadow-md">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ✅ Chart Section */}
        <div>
          <div className="mb-4">
            <div className="flex flex-wrap gap-4 text-xs">
              <span><span className="inline-block w-3 h-3 bg-red-500 rounded-full mr-1"></span>เกรด(0-1.74)</span>
              <span><span className="inline-block w-3 h-3 bg-orange-500 rounded-full mr-1"></span>เกรด(1.75-1.99)</span>
              <span><span className="inline-block w-3 h-3 bg-green-400 rounded-full mr-1"></span>เกรด(2.0-3.24)</span>
              <span><span className="inline-block w-3 h-3 bg-blue-400 rounded-full mr-1"></span>เกรด(3.25-4.00)</span>
            </div>
          </div>

          <div className="h-64">
            {!loading && semesterData.length > 0 && (
              <SemesterChart
                labels={labels}
                semesterGPAs={semesterGPAs}
                cumulativeGPAs={cumulativeGPAs}
                barColors={barColors}
              />
            )}
          </div>
        </div>

        {/* ✅ Table Section */}
        <div>
        <Table
          columns={semesterColumns}
          dataSource={tableData}
          pagination={false}
          size="small"
          loading={loading}
          rowKey={(record: any) =>
            // ถ้าเป็น row summary ให้ใช้ key "summary"
            record.key ? record.key : `${record.studentId}-${record['ปีการศึกษา']}-${record['ภาคการศึกษา']}`
          }
        />
      </div>


      </div>
    </Card>
  );
};

// ======================
//   INTERNAL CHART COMPONENT
// ======================
interface ChartProps {
  labels: string[];
  semesterGPAs: number[];
  cumulativeGPAs: number[];
  barColors?: string[];
}

const SemesterChart: React.FC<ChartProps> = ({
  labels,
  semesterGPAs,
  cumulativeGPAs,
  barColors = [],
}) => {
  const data = {
    labels,
    datasets: [
      {
        type: "bar" as const,
        label: "GPA ภาค",
        data: semesterGPAs,
        backgroundColor: barColors,
        borderColor: "rgba(0,0,0,0.1)",
        borderWidth: 1,
      },
      {
        type: "line" as const,
        label: "GPA สะสม",
        data: cumulativeGPAs,
        borderColor: "rgba(255,99,132,1)",
        backgroundColor: "rgba(255,99,132,0.3)",
        fill: false,
        tension: 0.3,
        yAxisID: "y",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: { beginAtZero: true, max: 4 },
    },
    plugins: {
      legend: { position: "top" as const },
      tooltip: {
        callbacks: {
          label: (ctx: any) => {
            const value = ctx.parsed.y;
            if (value >= 3.25) return `GPA ${value} (ดีมาก)`;
            if (value >= 2.0) return `GPA ${value} (ดี)`;
            if (value >= 1.75) return `GPA ${value} (พอใช้)`;
            return `GPA ${value} (ควรปรับปรุง)`;
          },
        },
      },
    },
  };

  return <Chart type="bar" data={data} options={options} />;
};

export default SemesterResults;
