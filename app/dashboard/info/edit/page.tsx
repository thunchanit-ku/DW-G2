'use client';

import { Card, Button, Input } from 'antd';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import DashboardNavCards from '@/components/DashboardNavCards';

export default function EditInfoPage() {
  const router = useRouter();

  // ข้อมูลนักศึกษา (สามารถแก้ไขได้)
  const [phone, setPhone] = useState('0950427705');
  const [parentPhone, setParentPhone] = useState('0992581852');

  const studentInfo = {
    studentId: '6320500603',
    nameTh: 'ภัทรพร ปัญญาอุดมพร',
    nameEn: 'Phattaraporn panyaaudomporn',
    nationalId: 'xxxxxxxxx4955',
    gender: 'หญิง',
    email: 'phattaraporn.sa@ku.th',
    advisor: 'รศ.ดร.ฐิติพงษ์ สถิรเมธีกุล',
    campus: 'กำแพงแสน',
    faculty: 'วิศวกรรมศาสตร์ กำแพงแสน',
    major: 'วิศวกรรมศาสตร์คอมพิวเตอร์',
    programType: 'ภาษาไทย',
    studentStatus: 'กำลังศึกษา',
    gpa: 3.42,
    highSchool: 'โรงเรียนวัดธรรมจริยาภิรมย์',
    highSchoolLocation: 'อำเภอบ้านแพ้ว จังหวัดสมุทรสาคร',
  };

  const handleSave = () => {
    // TODO: Save data to backend
    router.push('/dashboard/info');
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6">
        {/* Navigation Cards */}
        <DashboardNavCards />

        <hr className="my-6" />

        {/* Personal Information Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h5 className="text-green-600 font-bold mb-4">ข้อมูลส่วนตัว</h5>
            <div className="space-y-3 ml-5">
              <div className="grid grid-cols-2 gap-2">
                <p className="text-black font-medium">รหัสประจำตัวนิสิต</p>
                <p className="text-gray-600">{studentInfo.studentId}</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <p className="text-black font-medium">ชื่อ-นามสกุล (ไทย)</p>
                <p className="text-gray-600">{studentInfo.nameTh}</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <p className="text-black font-medium">ชื่อ-นามสกุล (อังกฤษ)</p>
                <p className="text-gray-600">{studentInfo.nameEn}</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <p className="text-black font-medium">รหัสประจำตัวประชาชน</p>
                <p className="text-gray-600">{studentInfo.nationalId}</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <p className="text-black font-medium">เพศ</p>
                <p className="text-gray-600">{studentInfo.gender}</p>
              </div>
            </div>
          </div>

          <div>
            <h5 className="text-green-600 font-bold mb-4">ช่องทางการติดต่อ</h5>
            <div className="space-y-3 ml-5">
              <div className="grid grid-cols-2 gap-2 items-center">
                <p className="text-black font-medium">เบอร์โทรศัพท์</p>
                <Input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0950427705"
                  className="w-full"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <p className="text-black font-medium">e-Mail</p>
                <p className="text-gray-600">{studentInfo.email}</p>
              </div>
              <div className="grid grid-cols-2 gap-2 items-center">
                <p className="text-black font-medium">เบอร์โทรศัพท์ผู้ปกครอง</p>
                <Input
                  value={parentPhone}
                  onChange={(e) => setParentPhone(e.target.value)}
                  placeholder="0992581852"
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </div>

        <hr className="my-6" />

        {/* Education Information Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h5 className="text-green-600 font-bold mb-4">การศึกษาปัจจุบัน</h5>
            <div className="space-y-3 ml-5">
              <div className="grid grid-cols-2 gap-2">
                <p className="text-black font-medium">อาจารย์ที่ปรึกษา</p>
                <p className="text-gray-600">{studentInfo.advisor}</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <p className="text-black font-medium">วิทยาเขต</p>
                <p className="text-gray-600">{studentInfo.campus}</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <p className="text-black font-medium">คณะ</p>
                <p className="text-gray-600">{studentInfo.faculty}</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <p className="text-black font-medium">สาขาวิชา</p>
                <p className="text-gray-600">{studentInfo.major}</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <p className="text-black font-medium">ประเภทหลักสูตร</p>
                <p className="text-gray-600">{studentInfo.programType}</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <p className="text-black font-medium">สถานภาพนิสิต</p>
                <p className="text-gray-600">{studentInfo.studentStatus}</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <p className="text-black font-medium">เกรดเฉลี่ยสะสม</p>
                <p className="text-gray-600">{studentInfo.gpa.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div>
            <h5 className="text-green-600 font-bold mb-4">การศึกษาระดับมัธยม</h5>
            <div className="space-y-3 ml-5">
              <div className="grid grid-cols-2 gap-2">
                <p className="text-black font-medium">ชื่อโรงเรียน</p>
                <p className="text-gray-600">{studentInfo.highSchool}</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <p className="text-black font-medium">ที่อยู่โรงเรียน</p>
                <p className="text-gray-600">{studentInfo.highSchoolLocation}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="text-center my-8">
          <Button
            type="primary"
            size="large"
            className="bg-green-500 hover:bg-green-600 border-green-500 hover:border-green-600 text-black font-medium"
            onClick={handleSave}
          >
            บันทึก
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}

