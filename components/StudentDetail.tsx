// components/StudentDetails.jsx
import React from 'react';
import { Divider } from 'antd'; // Assuming Divider is a custom component

const StudentDetails = ({ result, headerGpa }) => {
  // Only render if we have basic student data
  if (!result || !result.studentId) return null;

  return (
    <>
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
    </>
  );
};

export default StudentDetails;