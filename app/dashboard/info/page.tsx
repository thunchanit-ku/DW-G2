// app/dashboard/info/page.tsx

'use client';

import { Card, Button } from 'antd';
import { useRouter, useSearchParams } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import DashboardNavCards from '@/components/DashboardNavCards';
import StudentInfo from '@/components/info/StudentInfo'; // <-- Import the new component
import { useEffect, useState } from 'react';

type StudentProfile = {
  studentId: string;
  nameTh: string;
  nameEn: string;
  nationalId: string | null;
  gender: string | null;
  phone: string | null;
  email: string | null;
  parentPhone: string | null;
  advisor: string | null;
  campus: string | null;
  faculty: string | null;
  major: string | null;
  programType: string | null;
  studentStatus: string | null;
  gpa: number | null;
  highSchool: string | null;
  highSchoolLocation: string | null;
};

export default function InfoPage() {
  const router = useRouter(); // Kept here but primarily used by child for navigation

  const searchParams = useSearchParams();
  const [studentInfo, setStudentInfo] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`http://localhost:4000/api/student/profile/${id}`);
      if (!res.ok) {
        throw new Error(`Request failed: ${res.status}`);
      }
      const data = await res.json();
      setStudentInfo(data as StudentProfile);
    } catch (e: any) {
      setError(e.message ?? 'เกิดข้อผิดพลาดในการโหลดข้อมูล');
      setStudentInfo(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // 1) Use ID from query parameter first
    let id: string | null = searchParams.get('id');
    // 2) Fallback to sessionStorage
    if (!id && typeof window !== 'undefined') {
      id = sessionStorage.getItem('selectedStudentId');
    }
    if (id) fetchProfile(id);

    // Listen for ID changes from the Home page
    const onSelectedChange = (e: Event) => {
      const detail = (e as CustomEvent<string>).detail;
      if (detail) fetchProfile(detail);
    };
    if (typeof window !== 'undefined') {
      window.addEventListener('dw:selected-student-changed', onSelectedChange as EventListener);
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('dw:selected-student-changed', onSelectedChange as EventListener);
      }
    };
  }, [searchParams]);

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6">
        {/* Navigation Cards */}
        <DashboardNavCards />

        <hr className="my-6" />

        {/* Loading/Error Messages */}
        {loading && <div className="mb-4 text-lg font-medium text-blue-500">กำลังโหลดข้อมูล...</div>}
        {error && <div className="mb-4 text-red-600">ข้อผิดพลาด: {error}</div>}

        {/* Render the details component only when data is successfully loaded */}
        {studentInfo && !loading && (
          <StudentInfo studentInfo={studentInfo} />
        )}

        {/* Optional: Message if no student ID is found after loading */}
        {!studentInfo && !loading && !error && (
            <div className="text-center text-gray-500 my-10">
                ไม่พบข้อมูลนิสิต กรุณาเลือกนิสิตจากหน้าแรก
            </div>
        )}

      </div>
    </DashboardLayout>
  );
}