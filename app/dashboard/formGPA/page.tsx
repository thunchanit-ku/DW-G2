'use client';

import { Button, Select } from 'antd';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import DashboardNavCards from '@/components/DashboardNavCards';

const { Option } = Select;

export default function CalGpaPage() {
  const router = useRouter();
  const [courses, setCourses] = useState(Array(9).fill({ course: '', grade: '' }));

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

