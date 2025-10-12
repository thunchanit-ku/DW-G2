'use client';

import { useEffect, useState } from 'react';
import { Card, Table, Tabs } from 'antd';
import type { TabsProps } from 'antd';
import { getStudentProfile } from '../service/student.service';
import { fetchCategoryDataService  } from '../service/report.service';
import { getCoursePlanRes } from '../service/report.service';

// ฟังก์ชันสำหรับคำนวณหน่วยกิตรวม
const calculateTotalCredits = (courses: any[]): number => {
  return courses.reduce((sum, item) => sum + (Number(item.credits) || 0), 0);
};

export default function ReportClient() {
  // สร้าง state สำหรับข้อมูลนักศึกษา
  const [studentInfo, setStudentInfo] = useState<any>(null);
  const [failedCourses, setFailedCourses] = useState<any[]>([]);
  const [passedCourses, setPassedCourses] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<Record<string, any[]>>({});
  
  // โหลด studentId จาก sessionStorage หรือกำหนดเอง
  useEffect(() => {
    async function fetchData() {
      let studentId = '';
      if (typeof window !== 'undefined') {
        studentId = sessionStorage.getItem('selectedStudentId') || '';
      }

      if (studentId) {
        try {
          // โหลดข้อมูลนักศึกษา
          const profileData = await getStudentProfile(studentId);
          setStudentInfo(profileData || null);

          // โหลดข้อมูล courseplan checking
          const courseplanRes = getCoursePlanRes(studentId);
          const courseplanData = await courseplanRes;

          console.log("dataaaaaaaaaaa", courseplanData);

          // ข้อมูลที่มาจาก API ควรจะแยกเป็น passedCourses และ failedCourses ไว้แล้ว
          const passed = Array.isArray(courseplanData.passedCourses) ? courseplanData.passedCourses : [];
          const failed = Array.isArray(courseplanData.failedCourses) ? courseplanData.failedCourses : [];
          
          console.log("datapass", passed);
          console.log("datafail", failed);

          setFailedCourses(failed);
          setPassedCourses(passed);

        } catch (e) {
          console.error('Error loading data:', e);
          // Set empty arrays as fallback
          setFailedCourses([]);
          setPassedCourses([]);
        }
      } else {
        // No studentId found, set empty data
        setFailedCourses([]);
        setPassedCourses([]);
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    async function fetchCategoryData() {
      try {
        const username = sessionStorage.getItem("selectedStudentId");
        if (!username) {
          setCategoryData({});
          return;
        }

        const res = await fetchCategoryDataService(username);
        const data = res;

        // ✅ group ข้อมูลตามหมวด (mainCategory)
        const grouped = Array.isArray(data) ? data.reduce((acc: Record<string, any[]>, item: any) => {
          const cat = item.mainCategory || "ไม่ระบุหมวด";
          if (!acc[cat]) acc[cat] = [];
          acc[cat].push({
            key: `${item.subjectCode}-${item.studyYear}-${item.semesterPart}`, // Add unique key
            year: item.studyYear,
            semester: item.semesterPart,
            courseCode: item.subjectCode,
            courseName: item.subjectName,
            category: item.mainCategory,
            grade: item.grade,
            credits: item.credit,
          });
          return acc;
        }, {}) : {};

        setCategoryData(grouped);
      } catch (error) {
        console.error("Error loading category subject data:", error);
        setCategoryData({});
      }
    }

    fetchCategoryData();
  }, []);

  // คอลัมน์สำหรับตารางวิชาที่ไม่ผ่าน (ไม่ต้องแก้ไข)
  const failedCoursesColumns = [
    {
      title: 'ชั้นปี',
      dataIndex: 'year',
      key: 'year',
      align: 'center' as const,
    },
    {
      title: 'ภาคการเรียน',
      dataIndex: 'semester',
      key: 'semester',
      align: 'center' as const,
    },
    {
      title: 'หมวดวิชา',
      dataIndex: 'category',
      key: 'category',
      align: 'center' as const,
    },
    {
      title: 'รหัสวิชา',
      dataIndex: 'courseCode',
      key: 'courseCode',
      align: 'center' as const,
    },
    {
      title: <div>ชื่อรายวิชา<span className="text-red-600">ยังไม่ผ่าน</span></div>,
      dataIndex: 'courseName',
      key: 'courseName',
      align: 'left' as const,
    },
    {
      title: 'หน่วยกิต',
      dataIndex: 'credits',
      key: 'credits',
      align: 'center' as const,
    },
    {
      title: 'สถานะ',
      dataIndex: 'status',
      key: 'status',
      align: 'center' as const,
    },
  ];

  // คอลัมน์สำหรับตารางวิชาที่ผ่านแล้ว (ไม่ต้องแก้ไข)
  const passedCoursesColumns = [
    {
      title: 'ชั้นปี',
      dataIndex: 'year',
      key: 'year',
      align: 'center' as const,
    },
    {
      title: 'ภาคการเรียน',
      dataIndex: 'semester',
      key: 'semester',
      align: 'center' as const,
    },
    {
      title: 'หมวดวิชา',
      dataIndex: 'category',
      key: 'category',
      align: 'center' as const,
    },
    {
      title: 'รหัสวิชา',
      dataIndex: 'courseCode',
      key: 'courseCode',
      align: 'center' as const,
    },
    {
      title: <div>ชื่อรายวิชา<span className="text-green-600">ผ่านแล้ว</span></div>,
      dataIndex: 'courseName',
      key: 'courseName',
      align: 'left' as const,
    },
    {
      title: 'หน่วยกิต',
      dataIndex: 'credits',
      key: 'credits',
      align: 'center' as const,
    },
    {
      title: 'สถานะ',
      dataIndex: 'status',
      key: 'status',
      align: 'center' as const,
    },
  ];

  // ตารางวิชาแยกตามหมวด (ไม่ต้องแก้ไข)
  const coursesColumns = [
    {
      title: 'ปีการศึกษา',
      dataIndex: 'year',
      key: 'year',
      align: 'left' as const,
    },
    {
      title: 'ภาคการศึกษา',
      dataIndex: 'semester',
      key: 'semester',
      align: 'left' as const,
    },
    {
      title: 'รหัสวิชา',
      dataIndex: 'courseCode',
      key: 'courseCode',
      align: 'left' as const,
    },
    {
      title: 'ชื่อวิชา',
      dataIndex: 'courseName',
      key: 'courseName',
      align: 'left' as const,
    },
    {
      title: 'หมวดรายวิชา',
      dataIndex: 'category',
      key: 'category',
      align: 'left' as const,
    },
    {
      title: 'ผลการเรียน',
      dataIndex: 'grade',
      key: 'grade',
      align: 'left' as const,
    },
    {
      title: 'หน่วยกิต',
      dataIndex: 'credits',
      key: 'credits',
      align: 'left' as const,
    },
  ];

  const totalFailedCredits = calculateTotalCredits(failedCourses);
  const totalPassedCredits = calculateTotalCredits(passedCourses);

  return (
    <div className="container mx-auto p-6">
      {/* Student Info Header */}
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-black font-bold">
          ข้อมูลสมาชิก : {studentInfo ? studentInfo.nameTh : '-'}
        </h4>
        <h4 className="text-black font-bold">
          GPA {studentInfo?.gpa != null ? studentInfo.gpa.toFixed(2) : '-'}
        </h4>
      </div>

      <hr className="my-6" />

      {/* Student Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="space-y-3 ml-5">
          <div className="grid grid-cols-2 gap-2">
            <p className="text-black font-medium">รหัสนิสิต:</p>
            <p className="text-gray-600">{studentInfo ? studentInfo.studentId : '-'}</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <p className="text-black font-medium">ชื่อ - นามสกุล:</p>
            <p className="text-gray-600">{studentInfo ? studentInfo.nameTh : '-'}</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <p className="text-black font-medium"></p>
            <p className="text-gray-600">{studentInfo ? studentInfo.nameEn : '-'}</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <p className="text-black font-medium">เบอร์โทรศัพท์:</p>
            <p className="text-gray-600">{studentInfo ? studentInfo.phone : '-'}</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <p className="text-black font-medium">อีเมล:</p>
            <p className="text-gray-600">{studentInfo ? studentInfo.email : '-'}</p>
          </div>
        </div>

        <div className="space-y-3 ml-5">
          <div className="grid grid-cols-2 gap-2">
            <p className="text-black font-medium">คณะ:</p>
            <p className="text-gray-600">{studentInfo ? studentInfo.faculty : '-'}</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <p className="text-black font-medium">สาขาวิชา:</p>
            <p className="text-gray-600">{studentInfo ? studentInfo.major : '-'}</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <p className="text-black font-medium">หลักสูตร:</p>
            <p className="text-gray-600">{studentInfo ? studentInfo.programType : '-'} {studentInfo ? studentInfo.programName : '-'}</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <p className="text-black font-medium">อาจารย์ที่ปรึกษา:</p>
            <p className="text-gray-600">{studentInfo ? studentInfo.advisor : '-'}</p>
          </div>
        </div>
      </div>

      <br />

      {/* Failed Courses Table - ใช้ข้อมูลที่โหลดมาและปรับแก้แถบรวม */}
      <Card title="ผลการเรียนรายวิชาตกค้างที่ยังไม่ผ่าน" className="mb-6 shadow-md">
        <Table
          columns={failedCoursesColumns}
          dataSource={[
            ...failedCourses.map((item, index) => ({
              key: `failed-${index}-${item.subjectCode || index}`,
              // Assuming the fetched data keys match the column titles as intended by developer
              year: item.semester || '-', // ชั้นปี
              semester: item.semesterPartInYear || '-', // ภาคการเรียน
              category: item.category || '-', // หมวดวิชา
              courseCode: item.subjectCode || '-', // รหัสวิชา
              courseName: item.courseName || '-', // ชื่อรายวิชา
              credits: item.credits || '-', // หน่วยกิต
              status: item.status || '-', // สถานะ
            })),
            {
              key: 'failed-summary',
              year: null,
              semester: null,
              category: null,
              courseCode: <span className="font-bold">รวม</span>,
              courseName: failedCourses.length.toString(), // นับจำนวนวิชาที่ยังไม่ผ่าน
              credits: totalFailedCredits.toString(), // หน่วยกิตรวม
              status: null,
            },
          ]}
          pagination={false}
          size="small"
          bordered
          rowClassName={(record) => record.key === 'failed-summary' ? 'bg-blue-200 font-bold' : ''}
        />
      </Card>

      {/* Passed Courses Table - ใช้ข้อมูลที่โหลดมาและปรับแก้แถบรวม */}
      <Card title="ผลการเรียนรายวิชาตกค้างที่ผ่านแล้ว" className="mb-6 shadow-md">
        <Table
          columns={passedCoursesColumns}
          dataSource={[
            ...passedCourses.map((item, index) => ({
              key: `passed-${index}-${item.subjectCode || index}`,
              // Assuming the fetched data keys match the column titles as intended by developer
              year: item.semester || '-', // ชั้นปี
              semester: item.semesterPartInYear || '-', // ภาคการเรียน
              category: item.category || '-', // หมวดวิชา
              courseCode: item.subjectCode || '-', // รหัสวิชา
              courseName: item.courseName || '-', // ชื่อรายวิชา
              credits: item.credits || '-', // หน่วยกิต
              status: item.status || '-', // สถานะ
            })),
            {
              key: 'passed-summary',
              year: null,
              semester: null,
              category: null,
              courseCode: <span className="font-bold">รวม</span>,
              courseName: passedCourses.length.toString(), // นับจำนวนวิชาที่ผ่านแล้ว
              credits: totalPassedCredits.toString(), // หน่วยกิตรวม
              status: null,
            },
          ]}
          pagination={false}
          size="small"
          bordered
          rowClassName={(record) => record.key === 'passed-summary' ? 'bg-blue-200 font-bold' : ''}
        />
      </Card>

      {/* Courses by Category Tabs */}
      <Card className="shadow-md">
        {Object.keys(categoryData).length > 0 ? (
          <Tabs
            defaultActiveKey={Object.keys(categoryData)[0] || "หมวดวิชาแกน"}
            items={Object.keys(categoryData).map((catName) => ({
              key: catName,
              label: catName,
              children: (
                <Table
                  columns={coursesColumns}
                  dataSource={categoryData[catName] || []}
                  pagination={false}
                  size="small"
                  bordered
                />
              ),
            }))}
          />
        ) : (
          <div className="text-center py-8 text-gray-500">
            ไม่มีข้อมูลหมวดวิชา
          </div>
        )}
      </Card>
    </div>
  );
}
