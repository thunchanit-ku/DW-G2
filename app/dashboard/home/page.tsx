'use client';

import { Card, Table, Divider, Input, Button, message } from 'antd';
import { TrendingUp, TrendingDown, Search } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import DashboardNavCards from '@/components/DashboardNavCards';
import CategoryChart from '@/components/charts/CategoryChart';
import DonutChart from '@/components/charts/DonutChart';
import { useEffect, useState } from 'react';
import SemesterResults from '@/components/charts/SemesterChart';

import StudentSearch from '@/components/StudentSearch';
import StudentDetail from '@/components/StudentDetail';
import CreditDonutCharts from '@/components/CreditDonutCharts';

export default function HomePage() {

  const [student, SetStudent] = useState('');
  const [result, setResult] = useState({ 
    email: '', 
    fisrtNameEng: '', 
    fisrtNameTh: '', 
    lastNameTh: '', 
    parentTell: '', 
    studentId: '', 
    studentUsername: '', 
    titleTh: '', 
    titleEng: '', 
    lastNameEng: '', 
    faculty: '', 
    major: '', 
    program: '', 
    curriculum: '', 
    advisor: '', 
    phone: '', 
    birthDate: '', 
    address: '', 
    zipCode: '', 
    nameTh: '', 
    nameEn: '', 
    programType: '', 
    programName: ''
  });
  const [headerGpa, setHeaderGpa] = useState<number | null>(null);


const handleSubmit = async () => {
    if (!student) {
      message.error('กรุณากรอกรหัสนิสิต');
      return;
    }

    try {
      const res = await fetch(`http://localhost:4000/api/student/profile/${student}`);
      const data = await res.json();
      console.log(data);
      setResult(data);

      // คำนวณ GPA สะสมเพื่อแสดงบนหัวเรื่อง
      try {
        const gpaRes = await fetch(`http://localhost:4000/api/student/grade-progress/${student}`);
        const gpaData = await gpaRes.json();
        if (Array.isArray(gpaData) && gpaData.length > 0) {
          const last = gpaData[gpaData.length - 1];
          const cumulative = last['GPAสะสม'];
          setHeaderGpa(typeof cumulative === 'number' ? cumulative : null);
        }
      } catch (gpaErr) {
        console.log('ไม่สามารถดึงข้อมูล GPA ได้:', gpaErr);
        setHeaderGpa(null);
      }

      // เก็บรหัสนิสิตไว้ชั่วคราว และแจ้งหน้าอื่นให้รีเฟรชข้อมูล
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('selectedStudentId', student);
        window.dispatchEvent(new CustomEvent('dw:selected-student-changed', { detail: student }));
      }

      message.success('ค้นหาข้อมูลนิสิตสำเร็จ');
    } catch (err) {
      console.error('เกิดข้อผิดพลาด:', err);
      message.error('ไม่สามารถเรียกข้อมูลได้');
    }
  };

  // ข้อมูลนักศึกษา
  const studentInfo = {
    studentId: '6020500357',
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
      align: 'center' as const,
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
      align: 'center' as const,
      render: (gpa: number) => (
        <span className="font-bold">{gpa.toFixed(2)}</span>
      ),
    },
    {
      title: 'GPA',
      dataIndex: 'cumulativeGPA',
      key: 'cumulativeGPA',
      align: 'center' as const,
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
      width: 200,
      align: 'center' as const,
    },
    {
      title: <div className="whitespace-nowrap">จำนวนหน่วยกิตที่<span className="text-green-600">เรียนไปแล้ว</span></div>,
      dataIndex: 'completed',
      key: 'completed',
      align: 'center' as const,
      width: 180,
      render: (value: number) => (
        <span className="font-bold text-green-600">{value}</span>
      ),
    },
    {
      title: <div className="whitespace-nowrap">จำนวนหน่วยกิตที่<span className="text-red-600">ยังไม่เรียน</span></div>,
      dataIndex: 'remaining',
      key: 'remaining',
      align: 'center' as const,
      width: 180,
      render: (value: number) => (
        <span className="font-bold text-red-600">{value}</span>
      ),
    },
    {
      title: <div className="whitespace-nowrap">หน่วยกิตทั้งหมด</div>,
      dataIndex: 'total',
      key: 'total',
      align: 'center' as const,
      width: 150,
      render: (value: number) => (
        <span className="font-bold">{value}</span>
      ),
    },
    {
      title: 'เกรด',
      dataIndex: 'gpa',
      key: 'gpa',
      align: 'center' as const,
      width: 100,
      render: (value: number) => (
        <span className="font-bold">{value.toFixed(2)}</span>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6">

        {/* Search Student Section */}
        <StudentSearch student={student} setStudent={SetStudent} handleSubmit={handleSubmit} result={result} />


        {/* Navigation Cards */}
        <DashboardNavCards />

        <Divider />
        <Divider />

        {/* Student Information */}
        <StudentDetail result={result} headerGpa={headerGpa} />

        {/* Semester Results */}
        <SemesterResults studentId={student}/>

        {/* Donut Charts Section */}
        <CreditDonutCharts/>
      </div>
    </DashboardLayout>
  );
}

