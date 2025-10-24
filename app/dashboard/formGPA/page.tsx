'use client';

import { Button, Select } from 'antd';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import DashboardNavCards from '@/components/DashboardNavCards';
import { getcategory_require } from '../service/home.service';

const { Option } = Select;

export default function CalGpaPage() {
  const router = useRouter();
  const [courses, setCourses] = useState(Array(9).fill({ course: '', grade: '' }));
  const [categoryProgress, setCategoryProgress] = useState<any[]>([]);
  const courseOptions = [
    { value: '', label: '--กรุณาเลือกวิชา--' },
    { value: '01999021', label: '01999021 Thai Language for Communication [3 หน่วยกิต]' },
    { value: '02204171', label: '02204171 Structured Programming [3 หน่วยกิต]' },
  ];

  const gradeOptions = [
    { value: '', label: '-' },
    { value: '4', label: 'A' },
    { value: '3.5', label: 'B+' },
    { value: '3', label: 'B' },
    { value: '2.5', label: 'C+' },
    { value: '2', label: 'C' },
    { value: '1.5', label: 'D+' },
    { value: '1', label: 'D' },
    { value: '0', label: 'F' },
  ];


  useEffect(() => {
    // ดึง studentId จาก sessionStorage
    let studentId: string | null = null;

    const fetchCategoryProgress = async (id: string) => {
    try {
      if (!id) {
        setCategoryProgress([]);
        sessionStorage.removeItem('categoryProgress');
        return;
      }
    //   const res = await fetch(`http://localhost:3002/api/student/category-require/${id}`);
    const res = await getcategory_require(id);
      const data = res;
      console.log('Category require data:', data);
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
        console.log('Transformed category data:', transformed);
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
  }, []);

  const handleCourseChange = (index: number, field: string, value: string) => {
    const newCourses = [...courses];
    newCourses[index] = { ...newCourses[index], [field]: value };
    setCourses(newCourses);
  };

  const handleSubmit = () => {
    // TODO: Calculate GPA
    router.push('/dashboard/formGPA/result');
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6">
        {/* Navigation Cards */}
        <DashboardNavCards />

        <hr className="my-6" />

        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-black font-bold">เกรดเฉลี่ยสะสม: 3.38 หน่วยกิต: 132</h4>
          <Button
            type="primary"
            onClick={() => router.push('/dashboard/formGPA/history')}
          >
            ดูประวัติการคาดการณ์
          </Button>
        </div>

        <hr className="my-6" />

        {/* Form */}
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
          <div className="max-w-3xl mx-auto">
            {/* Form Header */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="text-center">
                <h5 className="text-black font-bold">
                  ชื่อวิชา<span className="text-red-600">*</span>
                </h5>
              </div>
              <div className="text-center">
                <h5 className="text-black font-bold">
                  เกรด<span className="text-red-600">*</span>
                </h5>
              </div>
            </div>

            {/* Form Rows */}
            {courses.map((_, index) => (
              <div key={index} className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <Select
                    className="w-full"
                    placeholder="--กรุณาเลือกวิชา--"
                    onChange={(value) => handleCourseChange(index, 'course', value)}
                  >
                    {courseOptions.map((opt) => (
                      <Option key={opt.value} value={opt.value}>
                        {opt.label}
                      </Option>
                    ))}
                  </Select>
                </div>
                <div>
                  <Select
                    className="w-full"
                    placeholder="-"
                    onChange={(value) => handleCourseChange(index, 'grade', value)}
                  >
                    {gradeOptions.map((opt) => (
                      <Option key={opt.value} value={opt.value}>
                        {opt.label}
                      </Option>
                    ))}
                  </Select>
                </div>
              </div>
            ))}

            {/* Submit Button */}
            <div className="text-center mt-8">
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                className="bg-green-500 hover:bg-green-600 border-green-500 hover:border-green-600 text-black font-medium"
              >
                ดูผลการคำนวณ
              </Button>
            </div>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}

