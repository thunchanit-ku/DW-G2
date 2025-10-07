'use client';

import { useEffect, useState } from 'react';
import { Card, Table, Tabs } from 'antd';
import type { TabsProps } from 'antd';
import DashboardLayout from '@/components/DashboardLayout';
import DashboardNavCards from '@/components/DashboardNavCards';
import { getStudentProfile } from '../service/student.service';

export default function ReportPage() {
  // สร้าง state สำหรับข้อมูลนักศึกษา
  const [studentInfo, setStudentInfo] = useState<any>(null);

  // โหลด studentId จาก sessionStorage หรือกำหนดเอง
  useEffect(() => {
    async function fetchProfile() {
      let studentId = '';
      if (typeof window !== 'undefined') {
        studentId = sessionStorage.getItem('selectedStudentId') || '';
      }
      if (studentId) {
        try {
          const data = await getStudentProfile(studentId);
          setStudentInfo(data);
        } catch (e) {
          setStudentInfo(null);
        }
      }
    }
    fetchProfile();
  }, []);

  // ตารางวิชาที่ไม่ผ่านตามแผน (mock เหมือนเดิม)
  const failedCoursesColumns = [
    {
      title: 'ชั้นปี',
      dataIndex: 'year',
      key: 'year',
      align: 'center' as const,
    },
    {
      title: 'ภาคการเรียน',
      dataIndex: 'semester',
      key: 'semester',
      align: 'center' as const,
    },
    {
      title: 'หมวดวิชา',
      dataIndex: 'category',
      key: 'category',
      align: 'center' as const,
    },
    {
      title: 'รหัสวิชา',
      dataIndex: 'courseCode',
      key: 'courseCode',
      align: 'center' as const,
    },
    {
      title: <div>ชื่อรายวิชา<span className="text-red-600">ยังไม่ผ่าน</span></div>,
      dataIndex: 'courseName',
      key: 'courseName',
      align: 'left' as const,
    },
    {
      title: 'หน่วยกิต',
      dataIndex: 'credits',
      key: 'credits',
      align: 'center' as const,
    },
    {
      title: 'สถานะ',
      dataIndex: 'status',
      key: 'status',
      align: 'center' as const,
    },
  ];

  const failedCoursesData = [
    {
      key: '1',
      year: '2',
      semester: 'ภาคปลาย',
      category: 'หมวดวิชาเฉพาะบังคับ',
      courseCode: '02204172',
      courseName: 'Practicum in Programming and Problem Solving Skills',
      credits: '1',
      status: 'W,F',
    },
    {
      key: '2',
      year: '2',
      semester: 'ภาคปลาย',
      category: 'หมวดวิชาเฉพาะบังคับ',
      courseCode: '01417168',
      courseName: 'Engineering Mathematics II',
      credits: '3',
      status: 'W',
    },
    {
      key: 'summary',
      year: null,
      semester: null,
      category: null,
      courseCode: <span className="font-bold">รวม</span>,
      courseName: '2',
      credits: '4',
      status: null,
    },
  ];

  // ตารางวิชาตกค้างที่ผ่านแล้ว (mock เหมือนเดิม)
  const passedCoursesColumns = [
    {
      title: 'ชั้นปี',
      dataIndex: 'year',
      key: 'year',
      align: 'center' as const,
    },
    {
      title: 'ภาคการเรียน',
      dataIndex: 'semester',
      key: 'semester',
      align: 'center' as const,
    },
    {
      title: 'หมวดวิชา',
      dataIndex: 'category',
      key: 'category',
      align: 'center' as const,
    },
    {
      title: 'รหัสวิชา',
      dataIndex: 'courseCode',
      key: 'courseCode',
      align: 'center' as const,
    },
    {
      title: <div>ชื่อรายวิชา<span className="text-green-600">ผ่านแล้ว</span></div>,
      dataIndex: 'courseName',
      key: 'courseName',
      align: 'left' as const,
    },
    {
      title: 'หน่วยกิต',
      dataIndex: 'credits',
      key: 'credits',
      align: 'center' as const,
    },
    {
      title: 'สถานะ',
      dataIndex: 'status',
      key: 'status',
      align: 'center' as const,
    },
  ];

  const passedCoursesData = [
    {
      key: '1',
      year: '2',
      semester: 'ภาคปลาย',
      category: 'หมวดวิชาเฉพาะบังคับ',
      courseCode: '02204172',
      courseName: 'Practicum in Programming and Problem Solving Skills',
      credits: '1',
      status: 'W,F,A',
    },
    {
      key: 'summary',
      year: null,
      semester: null,
      category: null,
      courseCode: <span className="font-bold">รวม</span>,
      courseName: '1',
      credits: '1',
      status: null,
    },
  ];

  // ตารางวิชาแยกตามหมวด (mock เหมือนเดิม)
  const coursesByCategory = [
    {
      key: '1',
      year: '2563',
      semester: 'ภาคต้น',
      courseCode: '01417167',
      courseName: 'Engineering Mathematics I',
      category: 'หมวดวิชาแกน',
      grade: 'C+',
      credits: '3',
    },
    {
      key: '2',
      year: '2563',
      semester: 'ภาคต้น',
      courseCode: '01420111',
      courseName: 'General Physics I',
      category: 'หมวดวิชาแกน',
      grade: 'B',
      credits: '3',
    },
  ];
  const coursesColumns = [
    {
      title: 'ปีการศึกษา',
      dataIndex: 'year',
      key: 'year',
      align: 'left' as const,
    },
    {
      title: 'ภาคการศึกษา',
      dataIndex: 'semester',
      key: 'semester',
      align: 'left' as const,
    },
    {
      title: 'รหัสวิชา',
      dataIndex: 'courseCode',
      key: 'courseCode',
      align: 'left' as const,
    },
    {
      title: 'ชื่อวิชา',
      dataIndex: 'courseName',
      key: 'courseName',
      align: 'left' as const,
    },
    {
      title: 'หมวดรายวิชา',
      dataIndex: 'category',
      key: 'category',
      align: 'left' as const,
    },
    {
      title: 'ผลการเรียน',
      dataIndex: 'grade',
      key: 'grade',
      align: 'left' as const,
    },
    {
      title: 'หน่วยกิต',
      dataIndex: 'credits',
      key: 'credits',
      align: 'left' as const,
    },
  ];

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6">
        {/* Navigation Cards */}
        <DashboardNavCards />

        <hr className="my-6" />

        {/* Student Info Header */}
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-black font-bold">
            ข้อมูลสมาชิก : {studentInfo ? studentInfo.nameTh : '-'}
          </h4>
          <h4 className="text-black font-bold">
            GPA {studentInfo?.gpa != null ? studentInfo.gpa.toFixed(2) : '-'}
          </h4>
        </div>

        <hr className="my-6" />

        {/* Student Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-3 ml-5">
            <div className="grid grid-cols-2 gap-2">
              <p className="text-black font-medium">รหัสนิสิต:</p>
              <p className="text-gray-600">{studentInfo ? studentInfo.studentId : '-'}</p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <p className="text-black font-medium">ชื่อ - นามสกุล:</p>
              <p className="text-gray-600">{studentInfo ? studentInfo.nameTh : '-'}</p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <p className="text-black font-medium"></p>
              <p className="text-gray-600">{studentInfo ? studentInfo.nameEn : '-'}</p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <p className="text-black font-medium">เบอร์โทรศัพท์:</p>
              <p className="text-gray-600">{studentInfo ? studentInfo.phone : '-'}</p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <p className="text-black font-medium">อีเมล:</p>
              <p className="text-gray-600">{studentInfo ? studentInfo.email : '-'}</p>
            </div>
          </div>

          <div className="space-y-3 ml-5">
            <div className="grid grid-cols-2 gap-2">
              <p className="text-black font-medium">คณะ:</p>
              <p className="text-gray-600">{studentInfo ? studentInfo.faculty : '-'}</p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <p className="text-black font-medium">สาขาวิชา:</p>
              <p className="text-gray-600">{studentInfo ? studentInfo.major : '-'}</p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <p className="text-black font-medium">หลักสูตร:</p>
              <p className="text-gray-600">{studentInfo ? studentInfo.programType : '-'} {studentInfo ? studentInfo.programName : '-'}</p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <p className="text-black font-medium">อาจารย์ที่ปรึกษา:</p>
              <p className="text-gray-600">{studentInfo ? studentInfo.advisor : '-'}</p>
            </div>
          </div>
        </div>

        <br />

        {/* Failed Courses Table */}
        <Card title="ผลการเรียนวิชาที่ไม่ผ่านตามแผน" className="mb-6 shadow-md">
          <Table
            columns={failedCoursesColumns}
            dataSource={failedCoursesData}
            pagination={false}
            size="small"
            bordered
            rowClassName={(record) => record.key === 'summary' ? 'bg-blue-200 font-bold' : ''}
          />
        </Card>

        {/* Passed Courses Table */}
        <Card title="ผลการเรียนรายวิชาตกค้างที่ผ่านแล้ว" className="mb-6 shadow-md">
          <Table
            columns={passedCoursesColumns}
            dataSource={passedCoursesData}
            pagination={false}
            size="small"
            bordered
            rowClassName={(record) => record.key === 'summary' ? 'bg-blue-200 font-bold' : ''}
          />
        </Card>

        {/* Courses by Category Tabs */}
        <Card className="shadow-md">
          <Tabs
            defaultActiveKey="1"
            items={[
              {
                key: '1',
                label: 'หมวดวิชาแกน',
                children: (
                  <Table
                    columns={coursesColumns}
                    dataSource={coursesByCategory}
                    pagination={false}
                    size="small"
                    bordered
                  />
                ),
              },
              {
                key: '2',
                label: 'หมวดวิชาศึกษาทั่วไป',
                children: (
                  <Table
                    columns={coursesColumns}
                    dataSource={coursesByCategory}
                    pagination={false}
                    size="small"
                    bordered
                  />
                ),
              },
              {
                key: '3',
                label: 'หมวดวิชาเฉพาะบังคับ',
                children: (
                  <Table
                    columns={coursesColumns}
                    dataSource={coursesByCategory}
                    pagination={false}
                    size="small"
                    bordered
                  />
                ),
              },
              {
                key: '4',
                label: 'หมวดวิชาเฉพาะเลือก',
                children: (
                  <Table
                    columns={coursesColumns}
                    dataSource={coursesByCategory}
                    pagination={false}
                    size="small"
                    bordered
                  />
                ),
              },
              {
                key: '5',
                label: 'หมวดวิชาเสรี',
                children: (
                  <Table
                    columns={coursesColumns}
                    dataSource={coursesByCategory}
                    pagination={false}
                    size="small"
                    bordered
                  />
                ),
              },
            ]}
          />
        </Card>
      </div>
    </DashboardLayout>
  );
}

