'use client';

import { useSearchParams } from 'next/navigation';
import { Card, Divider, Input, Button, message } from 'antd';
import { Search } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import DashboardNavCards from '@/components/DashboardNavCards';
import DonutChart from '@/components/charts/DonutChart';
import SemesterResults from '@/components/charts/SemesterChart';
import { getcategory_require, getStudent } from '../service/home.service';
import { useEffect, useState } from 'react';

export default function HomeClient() {
  const [studentInput, setStudentInput] = useState('');
  const [selectedStudent, setSelectedStudent] = useState('');
  const [categoryProgress, setCategoryProgress] = useState<any[]>([]);
  const [headerGpa, setHeaderGpa] = useState<number | null>(null);

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

  const searchParams = useSearchParams();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedResult = sessionStorage.getItem('studentResult');
      const savedStudent = sessionStorage.getItem('studentInput');
      const savedSelected = sessionStorage.getItem('selectedStudentId');
      const savedGpa = sessionStorage.getItem('headerGpa');
      const savedCategory = sessionStorage.getItem('categoryProgress');

      if (savedResult) setResult(JSON.parse(savedResult));
      if (savedStudent) setStudentInput(savedStudent);
      if (savedSelected) setSelectedStudent(savedSelected);
      if (savedGpa) setHeaderGpa(Number(savedGpa));
      if (savedCategory) setCategoryProgress(JSON.parse(savedCategory));
    }
  }, []);

  useEffect(() => {
    const id =
      searchParams.get('id') ||
      (typeof window !== 'undefined' ? sessionStorage.getItem('selectedStudentId') : null) ||
      (typeof window !== 'undefined' ? sessionStorage.getItem('studentInput') : null) ||
      result?.studentId ||
      '';

    if (id) {
      setStudentInput(id);
      setSelectedStudent(id);
    }
  }, [searchParams, result?.studentId]);

  const fetchCategoryProgress = async (id: string) => {
    try {
      if (!id) {
        setCategoryProgress([]);
        sessionStorage.removeItem('categoryProgress');
        return;
      }
    //   const res = await fetch(`http://localhost:3002/api/student/category-require/${id}`);
    const res = getcategory_require(id);
      const data = res;
      if (Array.isArray(data)) {
        const transformed = data.map((item: any) => ({
          name: item.SubCategoryName?.trim?.() ?? '',
          mainCategory: item.MainCategoryName?.trim?.() ?? '',
          percent:
            item.TotalCreditRequire && item.TotalCreditRequire !== 0
              ? (item.CreditEarned / item.TotalCreditRequire) * 100
              : 0,
          CreditEarned: item.CreditEarned ?? 0,
          TotalCreditRequire: item.TotalCreditRequire ?? 0,
          gpa: null
        }));
        setCategoryProgress(transformed);
        sessionStorage.setItem('categoryProgress', JSON.stringify(transformed));
      } else {
        setCategoryProgress([]);
        sessionStorage.removeItem('categoryProgress');
      }
    } catch (err) {
      console.error('ไม่สามารถดึงข้อมูลหมวดวิชาได้:', err);
      setCategoryProgress([]);
      sessionStorage.removeItem('categoryProgress');
    }
  };

  const fetchGpa = async (id: string) => {
    try {
      if (!id) {
        setHeaderGpa(null);
        sessionStorage.removeItem('headerGpa');
        return;
      }
      const gpaRes = await fetch(`http://localhost:3002/api/student/grade-progress/${id}`);
      const gpaData = await gpaRes.json();
      if (Array.isArray(gpaData) && gpaData.length > 0) {
        const last = gpaData[gpaData.length - 1];
        const cumulative = last['GPAสะสม'];
        setHeaderGpa(typeof cumulative === 'number' ? cumulative : null);
        sessionStorage.setItem('headerGpa', String(cumulative ?? ''));
      } else {
        setHeaderGpa(null);
        sessionStorage.removeItem('headerGpa');
      }
    } catch (gpaErr) {
      console.log('ไม่สามารถดึงข้อมูล GPA ได้:', gpaErr);
      setHeaderGpa(null);
      sessionStorage.removeItem('headerGpa');
    }
  };

  const handleSubmit = async () => {
    const id = studentInput.trim();
    if (!id) {
      message.error('กรุณากรอกรหัสนิสิต');
      return;
    }

    try {
      const res = await getStudent(id);
      setResult(res);
      setSelectedStudent(id);

      sessionStorage.setItem('studentInput', id);
      sessionStorage.setItem('studentResult', JSON.stringify(res));
      sessionStorage.setItem('selectedStudentId', id);

      await Promise.all([fetchCategoryProgress(id), fetchGpa(id)]);

      window.dispatchEvent(
        new CustomEvent('dw:selected-student-changed', { detail: id })
      );

    } catch (err) {
      console.error(err);
      message.error('ไม่สามารถเรียกข้อมูลได้');
    }
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6">
        <Card title="ค้นหานิสิต" className="mb-6 shadow-md">
          <div className="flex items-center gap-4 mb-4">
            <Input
              type="text"
              placeholder="กรุณาใส่รหัสนิสิต"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
              value={studentInput}
              onChange={(e) => setStudentInput(e.target.value)}
              onPressEnter={handleSubmit}
            />
            <Button
              type="primary"
              size="large"
              onClick={handleSubmit}
              icon={<Search className="w-5 h-5" />}
            >
              ส่งข้อมูล
            </Button>
          </div>
        </Card>

        <DashboardNavCards />

        <Divider />

        <div className="flex justify-between items-center mb-4">
          <h4 className="text-xl font-bold text-black">
            ข้อมูลสมาชิก : {result.fisrtNameTh} {result.lastNameTh}
          </h4>
          <h4 className="text-xl font-bold text-black">
            GPA {headerGpa != null ? headerGpa.toFixed(2) : '-'}
          </h4>
        </div>

        <Divider />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
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
              <span className="text-gray-600">
                {result.programType} {result.programName}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <span className="font-medium text-black">อาจารย์ที่ปรึกษา:</span>
              <span className="text-gray-600">{result.advisor}</span>
            </div>
          </div>
        </div>

        <SemesterResults studentId={selectedStudent} />

        <Card title="รายงานหน่วยกิตที่ลงทะเบียนแบ่งตามหมวดวิชา (%)" className="shadow-md">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categoryProgress.length > 0 ? (
              categoryProgress.map((item: any, index: number) => (
                <Card key={index} className="text-center flex flex-col">
                  <p className="text-xs mb-2">
                    <span className="text-blue-800 font-medium">{item.mainCategory}</span>
                    <br />
                    {item.name}
                  </p>
                  <div className="flex-1 flex items-center justify-center py-2">
                    <div className="w-full h-32">
                      <DonutChart
                        percent={item.percent}
                        gpa={item.gpa ?? null}
                        creditEarned={item.CreditEarned ?? null}
                        totalCreditRequire={item.TotalCreditRequire ?? null}
                      />
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <p className="text-center text-gray-500">ไม่มีข้อมูลหมวดวิชา</p>
            )}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
