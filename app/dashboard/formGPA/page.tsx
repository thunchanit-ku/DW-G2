'use client';

import { Button, Select } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import DashboardNavCards from '@/components/DashboardNavCards';
import { getStudent_coursePlan } from '../service/report.service';

type CoursePlanItem = {
  factStudentPlanId: number;
  studentId: number;
  studentUsername: string;
  subjectCourseId: number;
  gradeLabelId: number | null;
  isPass: boolean;
  passYear: number | null;
  passTerm: number | null;
  stdGrade: number | null;
  gradeDetails: string | null;
  subject: {
    subjectId: number;
    subjectCategoryId: number;
    subjectCode: string;
    nameSubjectThai: string;
    nameSubjectEng: string;
    categoryName: string;
  };
  lastRegisterYear: number | null;
  lastRegisterTerm: number | null;
};

type RowState = {
  category: string; // ชื่อหมวด
  course: string;   // subjectCode
  grade: string;    // 4, 3.5, ...
};

export default function CalGpaPage() {
  const router = useRouter();

  // 9 แถวเริ่มต้น (ใช้ Array.from เพื่อไม่ให้แชร์อ็อบเจ็กต์)
  const [courses, setCourses] = useState<RowState[]>(
    Array.from({ length: 9 }, () => ({ category: '', course: '', grade: '' }))
  );

  const [isLoading, setIsLoading] = useState(false);
  const [coursesByCategory, setCoursesByCategory] = useState<
    Record<string, { value: string; label: string }[]>
  >({});
  const [categoryList, setCategoryList] = useState<{ value: string; label: string }[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);

  // ตัวเลือกเกรด
  const gradeOptions = useMemo(
    () => [
      { value: '', label: '-' },
      { value: '4', label: 'A' },
      { value: '3.5', label: 'B+' },
      { value: '3', label: 'B' },
      { value: '2.5', label: 'C+' },
      { value: '2', label: 'C' },
      { value: '1.5', label: 'D+' },
      { value: '1', label: 'D' },
      { value: '0', label: 'F' },
    ],
    []
  );

  useEffect(() => {
    const studentId = sessionStorage.getItem('studentId') || '';
    if (!studentId) {
      setCoursesByCategory({});
      setCategoryList([]);
      return;
    }

    const fetchCoursePlan = async () => {
      try {
        setIsLoading(true);
        setLoadError(null);
        const res = await getStudent_coursePlan(studentId);
        const arr: CoursePlanItem[] = Array.isArray(res) ? res : [];

        // จัดกลุ่มเป็น { [หมวด]: [{ value: subjectCode, label: "code ชื่อวิชา" }] }
        const grouped: Record<string, { value: string; label: string }[]> = {};

        for (const item of arr) {
          const s = item.subject;
          if (!s?.subjectCode) continue;

          const category = s.categoryName?.trim?.() || 'อื่นๆ';
          const value = s.subjectCode;
          const label = `${s.subjectCode} ${s.nameSubjectThai ?? ''}`.trim();

          if (!grouped[category]) grouped[category] = [];
          if (!grouped[category].some((c) => c.value === value)) {
            grouped[category].push({ value, label });
          }
        }

        // sort หมวด + sort วิชาในหมวด
        const sortedCategories = Object.keys(grouped).sort((a, b) => a.localeCompare(b, 'th'));
        for (const k of sortedCategories) {
          grouped[k].sort((a, b) => a.value.localeCompare(b.value, 'th'));
        }

        setCoursesByCategory(grouped);
        setCategoryList(sortedCategories.map((c) => ({ value: c, label: c })));
      } catch (err) {
        console.error('โหลดแผนรายวิชาไม่สำเร็จ:', err);
        setLoadError('ไม่สามารถดึงแผนรายวิชาได้');
        setCoursesByCategory({});
        setCategoryList([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCoursePlan();
  }, []);

  // อัปเดตค่าในแถว (กัน allowClear -> undefined)
  const handleRowChange = (index: number, field: keyof RowState, value?: string) => {
    setCourses((prev) => {
      const next = [...prev];
      const v = value ?? ''; // ถ้าเคลียร์ค่าให้เป็น '' เสมอ
      if (field === 'category') {
        // เปลี่ยนหมวด -> ล้างวิชา & เกรด
        next[index] = { category: v, course: '', grade: '' };
      } else {
        next[index] = { ...next[index], [field]: v };
      }
      return next;
    });
  };

  const handleSubmit = () => {
    // TODO: คำนวณ GPA จาก courses (category, course, grade)
    // ตัวอย่าง: เก็บลง sessionStorage หรือ state manager แล้วพาไปหน้า result
    // sessionStorage.setItem('gpaPredictInput', JSON.stringify(courses));
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
          <Button type="primary" onClick={() => router.push('/dashboard/formGPA/history')}>
            ดูประวัติการคาดการณ์
          </Button>
        </div>

        <hr className="my-6" />

        {/* Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <div className="max-w-5xl mx-auto">
            {/* หัวตาราง */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center">
                <h5 className="text-black font-bold">
                  หมวด<span className="text-red-600">*</span>
                </h5>
              </div>
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

            {/* แถวฟอร์ม */}
            {courses.map((row, index) => {
              const courseOptions = row.category ? (coursesByCategory[row.category] || []) : [];
              const courseDisabled = !row.category || courseOptions.length === 0;

              return (
                <div key={index} className="grid grid-cols-3 gap-4 mb-4">
                  {/* เลือกหมวด */}
                  <div>
                    <Select
                      className="w-full"
                      placeholder="--เลือกหมวด--"
                      loading={isLoading}
                      value={row.category || undefined}
                      onChange={(val) => handleRowChange(index, 'category', val)}
                      allowClear
                      showSearch
                      optionFilterProp="label"
                      options={categoryList}
                    />
                  </div>

                  {/* เลือกวิชาตามหมวด */}
                  <div>
                    <Select
                      className="w-full"
                      placeholder={courseDisabled ? 'เลือกหมวดก่อน' : '--เลือกวิชา--'}
                      disabled={courseDisabled}
                      value={row.course || undefined}
                      onChange={(val) => handleRowChange(index, 'course', val)}
                      allowClear
                      showSearch
                      optionFilterProp="label"
                      notFoundContent={courseDisabled ? '—' : 'ไม่พบวิชาในหมวดนี้'}
                      options={courseOptions}
                    />
                  </div>

                  {/* เลือกเกรด */}
                  <div>
                    <Select
                      className="w-full"
                      placeholder="-"
                      value={row.grade || undefined}
                      onChange={(val) => handleRowChange(index, 'grade', val)}
                      options={gradeOptions}
                    />
                  </div>
                </div>
              );
            })}

            {/* แจ้งเตือนโหลด/ผิดพลาด */}
            {isLoading && (
              <p className="text-gray-500 text-sm text-center mt-2">กำลังโหลดแผนรายวิชา…</p>
            )}
            {loadError && <p className="text-red-600 text-sm text-center mt-2">{loadError}</p>}

            {/* ปุ่มคำนวณ */}
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
