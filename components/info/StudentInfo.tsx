// components/StudentProfileDetails.tsx

import React from 'react';
import { Button } from 'antd';
import { useRouter } from 'next/navigation';

// Define the shape of the data prop, matching your original type
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

type StudentProfileDetailsProps = {
  studentInfo: StudentProfile; // We expect non-null data here
};

// Helper component for a single detail row
const DetailRow = ({ label, value }: { label: string; value: string | null | number }) => (
  <div className="grid grid-cols-2 gap-2">
    <p className="text-black font-medium">{label}</p>
    <p className="text-gray-600">
      {/* Handle GPA formatting if it is the GPA field */}
      {label === 'เกรดเฉลี่ยสะสม' && typeof value === 'number'
        ? value.toFixed(2)
        : value ?? '-'}
    </p>
  </div>
);

export default function StudentProfileDetails({ studentInfo }: StudentProfileDetailsProps) {
  const router = useRouter();

  return (
    <>
      {/* Personal Information Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <h5 className="text-green-600 font-bold mb-4">ข้อมูลส่วนตัว</h5>
          <div className="space-y-3 ml-5">
            <DetailRow label="รหัสประจำตัวนิสิต" value={studentInfo.studentId} />
            <DetailRow label="ชื่อ-นามสกุล (ไทย)" value={studentInfo.nameTh} />
            <DetailRow label="ชื่อ-นามสกุล (อังกฤษ)" value={studentInfo.nameEn} />
            <DetailRow label="รหัสประจำตัวประชาชน" value={studentInfo.nationalId} />
            <DetailRow label="เพศ" value={studentInfo.gender} />
          </div>
        </div>

        <div>
          <h5 className="text-green-600 font-bold mb-4">ช่องทางการติดต่อ</h5>
          <div className="space-y-3 ml-5">
            <DetailRow label="เบอร์โทรศัพท์" value={studentInfo.phone} />
            <DetailRow label="e-Mail" value={studentInfo.email} />
            <DetailRow label="เบอร์โทรศัพท์ผู้ปกครอง" value={studentInfo.parentPhone} />
          </div>
        </div>
      </div>

      <hr className="my-6" />

      {/* Education Information Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <h5 className="text-green-600 font-bold mb-4">การศึกษาปัจจุบัน</h5>
          <div className="space-y-3 ml-5">
            <DetailRow label="อาจารย์ที่ปรึกษา" value={studentInfo.advisor} />
            <DetailRow label="วิทยาเขต" value={studentInfo.campus} />
            <DetailRow label="คณะ" value={studentInfo.faculty} />
            <DetailRow label="สาขาวิชา" value={studentInfo.major} />
            <DetailRow label="ประเภทหลักสูตร" value={studentInfo.programType} />
            <DetailRow label="สถานภาพนิสิต" value={studentInfo.studentStatus} />
            <DetailRow label="เกรดเฉลี่ยสะสม" value={studentInfo.gpa} />
          </div>
        </div>

        <div>
          <h5 className="text-green-600 font-bold mb-4">การศึกษาระดับมัธยม</h5>
          <div className="space-y-3 ml-5">
            <DetailRow label="ชื่อโรงเรียน" value={studentInfo.highSchool} />
            <DetailRow label="ที่อยู่โรงเรียน" value={studentInfo.highSchoolLocation} />
          </div>
        </div>
      </div>

      {/* Edit Button */}
      <div className="text-center my-8">
        <Button
          type="primary"
          size="large"
          className="bg-yellow-500 hover:bg-yellow-600 border-yellow-500 hover:border-yellow-600 text-black font-medium"
          onClick={() => router.push('/dashboard/info/edit')}
          // Disable button if student info is missing (though this component assumes non-null)
          disabled={!studentInfo.studentId} 
        >
          แก้ไข
        </Button>
      </div>
    </>
  );
}