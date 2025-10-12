'use client';

import { useEffect, useState } from 'react';
import { Card, Table, Tabs } from 'antd';
import type { TabsProps } from 'antd';
import DashboardLayout from '@/components/DashboardLayout';
import DashboardNavCards from '@/components/DashboardNavCards';
import { getStudentProfile } from '../service/student.service';

export default function ReportPage() {
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
          setStudentInfo(profileData);

          // โหลดข้อมูล courseplan checking
          const courseplanRes = await fetch(`http://localhost:3002/api/student/courseplan-checking`);
          if (!courseplanRes.ok) throw new Error('Cannot fetch courseplan data');
          const courseplanData = await courseplanRes.json();

          console.log("dataaaaaaaaaaa", courseplanData);

          // const failed = courseplanData.data.filter((item: any) => !item.isPass);
          // const passed = courseplanData.data.filter((item: any) => item.isPass);

          const passed = courseplanData.passedCourses;

          const failed = courseplanData.failedCourses;
          console.log("datapass", passed);
          console.log("datafail", failed);

          setFailedCourses(failed);
          setPassedCourses(passed);

        } catch (e) {
          console.error('Error loading data:', e);
        }
      }
    }

    fetchData();
  }, []);
  useEffect(() => {
  async function fetchCategoryData() {
    try {
      const username = sessionStorage.getItem("selectedStudentId");
      if (!username) return;

      const res = await fetch(`http://localhost:3002/api/student/category-subject/${username}`);
      if (!res.ok) throw new Error("Cannot fetch category subject data");
      const data = await res.json();

      // ✅ group ข้อมูลตามหมวด (mainCategory)
      const grouped = data.reduce((acc: Record<string, any[]>, item: any) => {
        const cat = item.mainCategory || "ไม่ระบุหมวด";
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push({
          year: item.studyYear,
          semester: item.semesterPart,
          courseCode: item.subjectCode,
          courseName: item.subjectName,
          category: item.mainCategory,
          grade: item.grade,
          credits: item.credit,
        });
        return acc;
      }, {});

      setCategoryData(grouped);
    } catch (error) {
      console.error("Error loading category subject data:", error);
    }
  }

  fetchCategoryData();
}, []);
  // ตารางวิชาที่ไม่ผ่านตามแผน (mock เหมือนเดิม)
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

  const failedCoursesData = [
    {
      key: '1',
      year: '2',
      semester: 'ภาคปลาย',
      category: 'หมวดวิชาเฉพาะบังคับ',
      courseCode: '02204172',
      courseName: 'Practicum in Programming and Problem Solving Skills',
      credits: '1',
      status: 'W,F',
    },
    {
      key: '2',
      year: '2',
      semester: 'ภาคปลาย',
      category: 'หมวดวิชาเฉพาะบังคับ',
      courseCode: '01417168',
      courseName: 'Engineering Mathematics II',
      credits: '3',
      status: 'W',
    },
    {
      key: 'summary',
      year: null,
      semester: null,
      category: null,
      courseCode: <span className="font-bold">รวม</span>,
      courseName: '2',
      credits: '4',
      status: null,
    },
  ];

  // ตารางวิชาตกค้างที่ผ่านแล้ว (mock เหมือนเดิม)
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

  const passedCoursesData = [
    {
      key: '1',
      year: '2',
      semester: 'ภาคปลาย',
      category: 'หมวดวิชาเฉพาะบังคับ',
      courseCode: '02204172',
      courseName: 'Practicum in Programming and Problem Solving Skills',
      credits: '1',
      status: 'W,F,A',
    },
    {
      key: 'summary',
      year: null,
      semester: null,
      category: null,
      courseCode: <span className="font-bold">รวม</span>,
      courseName: '1',
      credits: '1',
      status: null,
    },
  ];

  // ตารางวิชาแยกตามหมวด (mock เหมือนเดิม)
  const coursesByCategory = [
    {
      key: '1',
      year: '2563',
      semester: 'ภาคต้น',
      courseCode: '01417167',
      courseName: 'Engineering Mathematics I',
      category: 'หมวดวิชาแกน',
      grade: 'C+',
      credits: '3',
    },
    {
      key: '2',
      year: '2563',
      semester: 'ภาคต้น',
      courseCode: '01420111',
      courseName: 'General Physics I',
      category: 'หมวดวิชาแกน',
      grade: 'B',
      credits: '3',
    },
  ];
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

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6">
        {/* Navigation Cards */}
        <DashboardNavCards />

        <hr className="my-6" />

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

        {/* Failed Courses Table */}
         <Card title="ผลการเรียนรายวิชาตกค้างที่ยังไม่ผ่าน" className="mb-6 shadow-md">
        <Table
          columns={failedCoursesColumns}
          dataSource={[
            ...failedCourses.map((item, index) => ({
              key: index,
              year: item.semester,
              semester: item.semesterPartInYear,
              category: item.category || '-',
              courseCode: item.subjectCode || '-',
              courseName: item.courseName || '-',
              credits: item.credits || '-',
              status: item.status || '-',
            })),
            {
              key: 'summary',
              year: null,
              semester: null,
              category: null,
              courseCode: <span className="font-bold">รวม</span>,
              courseName: failedCourses.length.toString(),
              credits: '-',
              status: null,
            },
          ]}
          pagination={false}
          size="small"
          bordered
          rowClassName={(record) => record.key === 'summary' ? 'bg-blue-200 font-bold' : ''}
        />

</Card>
        {/* Passed Courses Table */}
        <Card title="ผลการเรียนรายวิชาตกค้างที่ผ่านแล้ว" className="mb-6 shadow-md">
          <Table
            columns={passedCoursesColumns}
            dataSource={[
              ...passedCourses.map((item, index) => ({
                key: index,
                year: item.semester,
                semester: item.semesterPartInYear,
                category: item.category || '-',
                courseCode: item.subjectCode || '-',
                courseName: item.courseName || '-',
                credits: item.credits || '-',
                status: item.status || '-',
              })),
              {
                key: 'summary',
                year: null,
                semester: null,
                category: null,
                courseCode: <span className="font-bold">รวม</span>,
                courseName: passedCourses.length.toString(),
                credits: '-',
                status: null,
              },
            ]}
            pagination={false}
            size="small"
            bordered
            rowClassName={(record) => record.key === 'summary' ? 'bg-blue-200 font-bold' : ''}
          />

        </Card>

        {/* Courses by Category Tabs */}
        <Card className="shadow-md">
        <Tabs
          defaultActiveKey="หมวดวิชาแกน"
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
      </Card>
      </div>
    </DashboardLayout>
  );
}

