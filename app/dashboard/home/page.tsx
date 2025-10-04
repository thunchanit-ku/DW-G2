'use client';

import { Card, Table, Divider } from 'antd';
import { TrendingUp, TrendingDown } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import DashboardNavCards from '@/components/DashboardNavCards';
import SemesterChart from '@/components/charts/SemesterChart';
import CategoryChart from '@/components/charts/CategoryChart';
import DonutChart from '@/components/charts/DonutChart';

export default function HomePage() {
  // ข้อมูลนักศึกษา
  const studentInfo = {
    studentId: '6320500603',
    nameTH: 'ภัทรพร ปัญญาอุดมพร',
    nameEN: 'Phattaraporn panyaaudomporn',
    phone: '0950427705',
    email: 'phattaraporn.sa@ku.th',
    faculty: 'วิศวกรรมศาสตร์',
    program: 'วิศวกรรมคอมพิวเตอร์',
    curriculum: 'ภาษาไทย (ภาคปกติ)',
    advisor: 'รศ.ดร.ฐิติพงษ์ สถิรเมธีกุล',
    gpa: 3.38,
  };

  // ข้อมูลผลการเรียนแต่ละภาคเรียน
  const semesterData = [
    {
      key: '1',
      year: '2563',
      semester: 'ภาคต้น',
      credits: 19,
      semesterGPA: 2.13,
      cumulativeGPA: 2.13,
      change: null,
    },
    {
      key: '2',
      year: '2563',
      semester: 'ภาคปลาย',
      credits: 22,
      semesterGPA: 3.34,
      cumulativeGPA: 2.63,
      change: '+0.50',
      trend: 'up',
    },
    {
      key: '3',
      year: '2564',
      semester: 'ภาคต้น',
      credits: 19,
      semesterGPA: 2.60,
      cumulativeGPA: 2.62,
      change: '-0.01',
      trend: 'down',
    },
    {
      key: '4',
      year: '2564',
      semester: 'ภาคปลาย',
      credits: 22,
      semesterGPA: 3.33,
      cumulativeGPA: 2.78,
      change: '+0.16',
      trend: 'up',
    },
  ];

  // ข้อมูลหมวดวิชา
  const categoryData = [
    {
      key: '1',
      category: 'หมวดวิชาศึกษาทั่วไป',
      completed: 30,
      remaining: 0,
      total: 30,
      gpa: 3.13,
    },
    {
      key: '2',
      category: 'หมวดวิชาเสรี',
      completed: 6,
      remaining: 0,
      total: 6,
      gpa: 3.23,
    },
    {
      key: '3',
      category: 'หมวดวิชาเฉพาะบังคับ',
      completed: 98,
      remaining: 6,
      total: 104,
      gpa: 3.33,
    },
    {
      key: '4',
      category: 'หมวดวิชาเฉพาะเลือก',
      completed: 98,
      remaining: 6,
      total: 104,
      gpa: 3.38,
    },
    {
      key: '5',
      category: 'หมวดวิชาเสรี',
      completed: 36,
      remaining: 0,
      total: 36,
      gpa: 3.40,
    },
  ];

  const semesterColumns = [
    {
      title: 'ปีการศึกษา',
      dataIndex: 'year',
      key: 'year',
    },
    {
      title: 'ภาคการศึกษา',
      dataIndex: 'semester',
      key: 'semester',
      align: 'center' as const,
    },
    {
      title: 'หน่วยกิต',
      dataIndex: 'credits',
      key: 'credits',
      align: 'center' as const,
    },
    {
      title: 'ผลการเรียน',
      dataIndex: 'semesterGPA',
      key: 'semesterGPA',
      render: (gpa: number) => (
        <span className="font-bold">{gpa.toFixed(2)}</span>
      ),
    },
    {
      title: 'GPA',
      dataIndex: 'cumulativeGPA',
      key: 'cumulativeGPA',
      render: (gpa: number | null) => (
        gpa !== null ? <span className="font-bold">{gpa.toFixed(2)}</span> : null
      ),
    },
    {
      title: '#',
      dataIndex: 'change',
      key: 'change',
      align: 'center' as const,
      render: (change: string | null, record: any) => {
        if (!change) return null;
        return (
          <span className={record.trend === 'up' ? 'text-green-600' : 'text-red-600'}>
            {record.trend === 'up' ? <TrendingUp className="inline w-4 h-4" /> : <TrendingDown className="inline w-4 h-4" />}
            {change}
          </span>
        );
      },
    },
  ];

  const categoryColumns = [
    {
      title: 'หมวดวิชา',
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: <span>จำนวนหน่วยกิตที่<span className="text-green-600">เรียนไปแล้ว</span></span>,
      dataIndex: 'completed',
      key: 'completed',
      align: 'right' as const,
      render: (value: number) => (
        <span className="font-bold text-green-600">{value}</span>
      ),
    },
    {
      title: <span>จำนวนหน่วยกิตที่<span className="text-red-600">ยังไม่เรียน</span></span>,
      dataIndex: 'remaining',
      key: 'remaining',
      align: 'right' as const,
      render: (value: number) => (
        <span className="font-bold text-red-600">{value}</span>
      ),
    },
    {
      title: 'หน่วยกิตทั้งหมด',
      dataIndex: 'total',
      key: 'total',
      align: 'right' as const,
      render: (value: number) => (
        <span className="font-bold">{value}</span>
      ),
    },
    {
      title: 'เกรด',
      dataIndex: 'gpa',
      key: 'gpa',
      align: 'right' as const,
      render: (value: number) => (
        <span className="font-bold">{value.toFixed(2)}</span>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6">
        {/* Navigation Cards */}
        <DashboardNavCards />

        <Divider />

        {/* Student Header */}
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-xl font-bold text-black">
            ข้อมูลสมาชิก : {studentInfo.nameTH}
          </h4>
          <h4 className="text-xl font-bold text-black">
            GPA {studentInfo.gpa.toFixed(2)}
          </h4>
        </div>

        <Divider />

        {/* Student Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Left Column */}
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <span className="font-medium text-black">รหัสนิสิต:</span>
              <span className="text-gray-600">{studentInfo.studentId}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <span className="font-medium text-black">ชื่อ - นามสกุล:</span>
              <span className="text-gray-600">{studentInfo.nameTH}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <span className="font-medium text-black"></span>
              <span className="text-gray-600">{studentInfo.nameEN}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <span className="font-medium text-black">เบอร์โทรศัพท์:</span>
              <span className="text-gray-600">{studentInfo.phone}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <span className="font-medium text-black">อีเมล:</span>
              <span className="text-gray-600">{studentInfo.email}</span>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <span className="font-medium text-black">คณะ:</span>
              <span className="text-gray-600">{studentInfo.faculty}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <span className="font-medium text-black">สาขาวิชา:</span>
              <span className="text-gray-600">{studentInfo.program}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <span className="font-medium text-black">หลักสูตร:</span>
              <span className="text-gray-600">{studentInfo.curriculum}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <span className="font-medium text-black">อาจารย์ที่ปรึกษา:</span>
              <span className="text-gray-600">{studentInfo.advisor}</span>
            </div>
          </div>
        </div>

        {/* Semester Results */}
        <Card title="รายงานผลการเรียนแต่ละภาคการศึกษา" className="mb-6 shadow-md">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chart */}
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
                <SemesterChart
                  labels={['ภาคต้น 2563', 'ภาคปลาย 2563', 'ภาคต้น 2564', 'ภาคปลาย 2564']}
                  semesterGPAs={[2.13, 3.34, 2.60, 3.33]}
                  cumulativeGPAs={[2.13, 2.63, 2.62, 2.78]}
                />
              </div>
            </div>

            {/* Table */}
            <div>
              <Table
                columns={semesterColumns}
                dataSource={[...semesterData, {
                  key: 'summary',
                  year: 'ผลการเรียนเฉลี่ย',
                  semester: '',
                  credits: 82,
                  semesterGPA: 2.78,
                  cumulativeGPA: null,
                  change: null,
                }]}
                pagination={false}
                size="small"
              />
            </div>
          </div>
        </Card>

        {/* Category Results */}
        <Card title="ผลการเรียนในแต่ละหมวดวิชา" className="mb-6 shadow-md">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chart */}
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
                <CategoryChart
                  labels={['หมวดวิชาแกน', 'หมวดวิชาศึกษาทั่วไป', 'หมวดวิชาเฉพาะบังคับ', 'หมวดวิชาเฉพาะเลือก', 'หมวดวิชาเสรี']}
                  gpas={[3.13, 3.23, 3.33, 3.38, 3.40]}
                />
              </div>
            </div>

            {/* Table */}
            <div>
              <Table
                columns={categoryColumns}
                dataSource={categoryData}
                pagination={false}
                size="small"
              />
            </div>
          </div>
        </Card>

        {/* Donut Charts Section */}
        <Card title="รายงานหน่วยกิตที่ลงทะเบียนแบ่งตามหมวดวิชา (%)" className="shadow-md">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              { name: 'หมวดวิชาศึกษาทั่วไป', percent: 100, gpa: 3.12 },
              { name: 'หมวดวิชาเสรี', percent: 80, gpa: 3.45 },
              { name: 'หมวดวิชาเฉพาะบังคับ', percent: 90, gpa: 3.00 },
              { name: 'หมวดวิชาเฉพาะเลือก', percent: 90, gpa: 1.25 },
              { name: 'หมวดวิชาเสรี', percent: 100, gpa: 3.40 },
            ].map((item, index) => (
              <Card key={index} className="text-center flex flex-col">
                <p className="text-xs mb-2">
                  หน่วยกิตการเรียน<br />
                  <span className="text-blue-800 font-medium">{item.name}</span>
                </p>
                <div className="flex-1 flex items-center justify-center py-2">
                  <div className="w-full h-32">
                    <DonutChart percent={item.percent} gpa={item.gpa} />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}

