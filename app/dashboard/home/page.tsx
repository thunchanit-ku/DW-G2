'use client';

import { Card, Table, Divider, Input, Button, message } from 'antd';
import { TrendingUp, TrendingDown, Search } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import DashboardNavCards from '@/components/DashboardNavCards';
import CategoryChart from '@/components/charts/CategoryChart';
import DonutChart from '@/components/charts/DonutChart';
import { useEffect, useState } from 'react';
import SemesterResults from '@/components/charts/SemesterChart';
import { getStudent } from '../service/home.service';
export default function HomePage() {
  const [student, SetStudent] = useState('');
  const [finishstu , SetFinishstu] = useState('');
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

  // โหลดข้อมูลจาก sessionStorage ถ้ามี
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedResult = sessionStorage.getItem('studentResult');
      const savedStudent = sessionStorage.getItem('studentInput');
      const savedGpa = sessionStorage.getItem('headerGpa');
      if (savedResult) setResult(JSON.parse(savedResult));
      if (savedStudent) SetStudent(savedStudent);
      if (savedGpa) setHeaderGpa(Number(savedGpa));
    }
  }, []);

const handleSubmit = async () => {
    if (!student) {
      message.error('กรุณากรอกรหัสนิสิต');
      return;
    }

    SetFinishstu(student);

    try {

      const res = await getStudent(student);
      setResult(res);

      // เก็บข้อมูลลง sessionStorage
      // if (typeof window !== 'undefined') {
        sessionStorage.setItem('studentResult', JSON.stringify(res));
        sessionStorage.setItem('studentInput', student);
       
      // }

      // คำนวณ GPA สะสมเพื่อแสดงบนหัวเรื่อง
      try {
        const gpaRes = await fetch(`http://localhost:4000/api/student/grade-progress/${student}`);
        const gpaData = await gpaRes.json();
        if (Array.isArray(gpaData) && gpaData.length > 0) {
          const last = gpaData[gpaData.length - 1];
          const cumulative = last['GPAสะสม'];
          setHeaderGpa(typeof cumulative === 'number' ? cumulative : null);
          // เก็บ GPA ลง sessionStorage
          if (typeof window !== 'undefined') {
            sessionStorage.setItem('headerGpa', String(cumulative));  
          }
        }
      } catch (gpaErr) {
        console.log('ไม่สามารถดึงข้อมูล GPA ได้:', gpaErr);
        setHeaderGpa(null);
        if (typeof window !== 'undefined') {
          sessionStorage.removeItem('headerGpa');
        }
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


  return (
    <DashboardLayout>
      <div className="container mx-auto p-6">

        {/* Search Student Section */}
        <Card title="ค้นหานิสิต" className="mb-6 shadow-md">
          <div className="flex items-center gap-4 mb-4">
            <Input
              type="text"
              placeholder="กรุณาใส่รหัสนิสิต"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
              value={student}
              onChange={(e) => SetStudent(e.target.value)}
            />
            <Button
              type="primary"
              icon={<Search className="w-5 h-5" />}
              size="large"
              onClick={handleSubmit}
            >
              ส่งข้อมูล
            </Button>
          </div>
          {/* {result.studentId && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h5 className="text-lg font-semibold text-gray-800 mb-2">ข้อมูลนิสิต:</h5>
              <p className="text-gray-700">
                <strong>รหัสนิสิต:</strong> {result.studentId}
              </p>
              <p className="text-gray-700">
                <strong>ชื่อ-นามสกุล:</strong> {result.titleTh} {result.fisrtNameTh} {result.lastNameTh}
              </p>
              <p className="text-gray-700">
                <strong>อีเมล:</strong> {result.email}
              </p>
            </div>
          )} */}
        </Card>


        {/* Navigation Cards */}
        <DashboardNavCards />

        <Divider />

        {/* Student Header */}
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-xl font-bold text-black">
            ข้อมูลสมาชิก : {result.fisrtNameTh} {result.lastNameTh}
          </h4>
          <h4 className="text-xl font-bold text-black">
            GPA {headerGpa != null ? headerGpa.toFixed(2) : '-'}
          </h4>
        </div>

        <Divider />

        {/* Student Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Left Column */}
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <span className="font-medium text-black">รหัสนิสิต:</span>
              <span className="text-gray-600">{result.studentId}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <span className="font-medium text-black">ชื่อ - นามสกุล:</span>
              <span className="text-gray-600">{result.nameTh}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <span className="font-medium text-black"></span>
              <span className="text-gray-600">{result.fisrtNameEng}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <span className="font-medium text-black">เบอร์โทรศัพท์:</span>
              <span className="text-gray-600">{result.phone}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <span className="font-medium text-black">อีเมล:</span>
              <span className="text-gray-600">{result.email}</span>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <span className="font-medium text-black">คณะ:</span>
              <span className="text-gray-600">{result.faculty}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <span className="font-medium text-black">สาขาวิชา:</span>
              <span className="text-gray-600">{result.major}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <span className="font-medium text-black">หลักสูตร:</span>
              <span className="text-gray-600">{result.programType} {result.programName}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <span className="font-medium text-black">อาจารย์ที่ปรึกษา:</span>
              <span className="text-gray-600">{result.advisor}</span>
            </div>
          </div>
        </div>

        {/* Semester Results */}
        <SemesterResults studentId={finishstu}/>

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

