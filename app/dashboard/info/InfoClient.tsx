'use client';

import { Card, Button } from 'antd';
import { useRouter, useSearchParams } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import DashboardNavCards from '@/components/DashboardNavCards';
import { useEffect, useState } from 'react';
import { getStudentProfile } from '../service/student.service';

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

export default function InfoClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [studentInfo, setStudentInfo] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getStudentProfile(id);
      setStudentInfo(data as StudentProfile);
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('selectedStudentProfile', JSON.stringify(data));
      }
    } catch (e: any) {
      setError(e?.message ?? 'เกิดข้อผิดพลาดในการโหลดข้อมูล');
      setStudentInfo(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // 1) ถ้ามี id ใน query ให้ใช้ก่อน
    let id: string | null = searchParams.get('id');
    // 2) ถ้าไม่มี ใช้จาก sessionStorage
    if (!id && typeof window !== 'undefined') {
      id = sessionStorage.getItem('selectedStudentId');
    }
    if (id) fetchProfile(id);

    // ฟัง event เปลี่ยน student จากหน้าอื่น
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

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const profile = sessionStorage.getItem('selectedStudentProfile');
      if (profile) {
        try {
          setStudentInfo(JSON.parse(profile));
        } catch {
          // ignore parse error
        }
      }
    }
  }, []);

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6">
        <DashboardNavCards />
        <hr className="my-6" />

        {loading && <div className="mb-4">กำลังโหลด...</div>}
        {error && <div className="mb-4 text-red-600">{error}</div>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h5 className="text-green-600 font-bold mb-4">ข้อมูลส่วนตัว</h5>
            <div className="space-y-3 ml-5">
              <div className="grid grid-cols-2 gap-2">
                <p className="text-black font-medium">รหัสประจำตัวนิสิต</p>
                <p className="text-gray-600">{studentInfo?.studentId ?? '-'}</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <p className="text-black font-medium">ชื่อ-นามสกุล (ไทย)</p>
                <p className="text-gray-600">{studentInfo?.nameTh ?? '-'}</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <p className="text-black font-medium">ชื่อ-นามสกุล (อังกฤษ)</p>
                <p className="text-gray-600">{studentInfo?.nameEn ?? '-'}</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <p className="text-black font-medium">รหัสประจำตัวประชาชน</p>
                <p className="text-gray-600">{studentInfo?.nationalId ?? '-'}</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <p className="text-black font-medium">เพศ</p>
                <p className="text-gray-600">{studentInfo?.gender ?? '-'}</p>
              </div>
            </div>
          </div>

          <div>
            <h5 className="text-green-600 font-bold mb-4">ช่องทางการติดต่อ</h5>
            <div className="space-y-3 ml-5">
              <div className="grid grid-cols-2 gap-2">
                <p className="text-black font-medium">เบอร์โทรศัพท์</p>
                <p className="text-gray-600">{studentInfo?.phone ?? '-'}</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <p className="text-black font-medium">e-Mail</p>
                <p className="text-gray-600">{studentInfo?.email ?? '-'}</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <p className="text-black font-medium">เบอร์โทรศัพท์ผู้ปกครอง</p>
                <p className="text-gray-600">{studentInfo?.parentPhone ?? '-'}</p>
              </div>
            </div>
          </div>
        </div>

        <hr className="my-6" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h5 className="text-green-600 font-bold mb-4">การศึกษาปัจจุบัน</h5>
            <div className="space-y-3 ml-5">
              <div className="grid grid-cols-2 gap-2">
                <p className="text-black font-medium">อาจารย์ที่ปรึกษา</p>
                <p className="text-gray-600">{studentInfo?.advisor ?? '-'}</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <p className="text-black font-medium">วิทยาเขต</p>
                <p className="text-gray-600">{studentInfo?.campus ?? '-'}</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <p className="text-black font-medium">คณะ</p>
                <p className="text-gray-600">{studentInfo?.faculty ?? '-'}</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <p className="text-black font-medium">สาขาวิชา</p>
                <p className="text-gray-600">{studentInfo?.major ?? '-'}</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <p className="text-black font-medium">ประเภทหลักสูตร</p>
                <p className="text-gray-600">{studentInfo?.programType ?? '-'}</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <p className="text-black font-medium">สถานภาพนิสิต</p>
                <p className="text-gray-600">{studentInfo?.studentStatus ?? '-'}</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <p className="text-black font-medium">เกรดเฉลี่ยสะสม</p>
                <p className="text-gray-600">
                  {studentInfo?.gpa != null ? studentInfo.gpa.toFixed(2) : '-'}
                </p>
              </div>
            </div>
          </div>

          <div>
            <h5 className="text-green-600 font-bold mb-4">การศึกษาระดับมัธยม</h5>
            <div className="space-y-3 ml-5">
              <div className="grid grid-cols-2 gap-2">
                <p className="text-black font-medium">ชื่อโรงเรียน</p>
                <p className="text-gray-600">{studentInfo?.highSchool ?? '-'}</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <p className="text-black font-medium">ที่อยู่โรงเรียน</p>
                <p className="text-gray-600">{studentInfo?.highSchoolLocation ?? '-'}</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
