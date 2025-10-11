'use client';

import { useState, useEffect } from 'react';
import { Card, Input, Button, Select, Table, message, Alert, Tag, Row, Col } from 'antd';
import { RefreshCw, Search, AlertCircle, BookOpen } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import DashboardNavCards from '@/components/DashboardNavCards';

interface StudentInfo {
  studentId: number;
  studentUsername: string;
  nameTh: string;
  nameEng: string;
  titleTh: string;
  titleEng: string;
  genderTh: string;
  genderEng: string;
  tell: string;
  parentPhone?: string;
  email: string;
}

interface CompletedSemester {
  year: number;
  semester: string;
  semesterId: number;
  totalCourses: number;
  totalCredits: number;
  semesterGPA: number;
}

interface CourseData {
  regisId: number;
  studentId: number;
  subjectCode: string;
  subjectNameTh: string;
  subjectNameEng: string;
  subjectType: string;
  credit: number;
  gradeCharacter: string;
  gradeNumber: number;
  creditRegis: number;
  semesterYear: number;
  semesterPart: string;
  typeRegis: string;
  secLecture: string;
  secLab: string;
  gradeStatus: string;
}

export default function UpdateGradesPage() {
  const [student, setStudent] = useState('');
  const [studentInfo, setStudentInfo] = useState<StudentInfo | null>(null);
  const [completedSemesters, setCompletedSemesters] = useState<CompletedSemester[]>([]);
  const [selectedSemester, setSelectedSemester] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [courseData, setCourseData] = useState<CourseData[]>([]);
  const [loading, setLoading] = useState(false);
  const [courseLoading, setCourseLoading] = useState(false);

  // โหลดข้อมูลจาก sessionStorage เมื่อ component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedStudent = sessionStorage.getItem('studentInput');
      const savedResult = sessionStorage.getItem('studentResult');
      
      if (savedStudent) {
        setStudent(savedStudent);
        // ดึงข้อมูลนิสิตและ semester อัตโนมัติ
        loadStudentData(savedStudent);
      }
      
      if (savedResult) {
        const parsedResult = JSON.parse(savedResult);
        setStudentInfo({
          studentId: parsedResult.studentId,
          studentUsername: parsedResult.studentUsername || savedStudent,
          nameTh: parsedResult.nameTh || parsedResult.fisrtNameTh + ' ' + parsedResult.lastNameTh,
          nameEng: parsedResult.fisrtNameEng + ' ' + parsedResult.lastNameEng,
          titleTh: parsedResult.titleTh,
          titleEng: parsedResult.titleEng,
          genderTh: parsedResult.genderTh || '',
          genderEng: parsedResult.genderEng || '',
          tell: parsedResult.phone || '',
          parentPhone: parsedResult.parentTell || '',
          email: parsedResult.email || '',
        });
      }
    }
  }, []);

  // ฟังก์ชันสำหรับโหลดข้อมูลนิสิต
  const loadStudentData = async (studentUsername: string) => {
    setLoading(true);
    try {
      console.log("Loading student data for:", studentUsername);
      const res = await fetch(`http://localhost:4000/api/fd/student/${studentUsername}`);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'ไม่พบข้อมูลนิสิต');
      }
      const data = await res.json();
      setStudentInfo(data);
      
      // ดึงข้อมูล semester ที่นิสิตเรียนจบแล้ว
      const semesterRes = await fetch(`http://localhost:4000/api/fd/completed-semesters/${studentUsername}`);
      if (!semesterRes.ok) {
        const errorData = await semesterRes.json();
        throw new Error(errorData.message || 'ไม่สามารถดึงข้อมูล semester ได้');
      }
      const semesterData = await semesterRes.json();
      console.log('Completed semesters data:', semesterData);
      setCompletedSemesters(Array.isArray(semesterData) ? semesterData : []);
      
      // รีเซ็ตการเลือก
      setSelectedYear(null);
      setSelectedSemester('');
      setCourseData([]);
      
      message.success('โหลดข้อมูลนิสิตสำเร็จ');
    } catch (err: any) {
      console.error('เกิดข้อผิดพลาด:', err);
      message.error(err.message || 'ไม่สามารถเรียกข้อมูลได้');
    } finally {
      setLoading(false);
    }
  };

  // ค้นหาข้อมูลนิสิต
  const handleSearchStudent = async () => {
    if (!student) {
      message.error('กรุณากรอกรหัสนิสิต');
      return;
    }

    await loadStudentData(student);
  };

  // ดึงข้อมูลรายวิชาและเกรด
  const handleFetchCourses = async () => {
    if (!student) {
      message.error('กรุณากรอกรหัสนิสิต');
      return;
    }
    if (!selectedYear || !selectedSemester) {
      message.error('กรุณาเลือกปีการศึกษาและภาคการศึกษา');
      return;
    }

    setCourseLoading(true);
    try {
      const encodedSemester = encodeURIComponent(selectedSemester);
      const res = await fetch(`http://localhost:4000/api/fd/courses/${student}?year=${selectedYear}&semester=${encodedSemester}`, {
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
      });
      const data = await res.json();
      console.log('Course data:', data);
      console.log('First course subjectNameThai:', data[0]?.subjectNameThai);
      console.log('First course subjectNameEng:', data[0]?.subjectNameEng);
      console.log('First course full data:', JSON.stringify(data[0], null, 2));
      
      // แปลงข้อมูลให้ตรงกับ interface
      const mappedData = Array.isArray(data) ? data.map(item => ({
        ...item,
        subjectNameTh: item.subjectNameThai || item.subjectNameTh,
        subjectNameEng: item.subjectNameEng || item.subjectNameEng,
      })) : [];
      
      console.log('Mapped data:', mappedData);
      setCourseData(mappedData);
      
      if (Array.isArray(data) && data.length > 0) {
        message.success(`พบรายวิชา ${data.length} วิชา`);
      } else {
        message.warning('ไม่พบรายวิชาในภาคการศึกษานี้');
      }
    } catch (err) {
      console.error('เกิดข้อผิดพลาดในการดึงข้อมูลรายวิชา:', err);
      message.error('ไม่สามารถดึงข้อมูลรายวิชาได้');
    } finally {
      setCourseLoading(false);
    }
  };

  // อัปเดตข้อมูลล่าสุด (รีเฟรชข้อมูลทั้งหมด)
  const handleRefreshData = async () => {
    if (!student) {
      message.error('กรุณากรอกรหัสนิสิต');
      return;
    }

    setCourseLoading(true);
    try {
      // รีเฟรชข้อมูล semester และ year ก่อน
      const semesterRes = await fetch(`http://localhost:4000/api/fd/completed-semesters/${student}`);
      if (semesterRes.ok) {
        const semesterData = await semesterRes.json();
        setCompletedSemesters(Array.isArray(semesterData) ? semesterData : []);
        message.success('อัปเดตข้อมูลภาคการศึกษาสำเร็จ');
      } else {
        message.warning('ไม่สามารถอัปเดตข้อมูลภาคการศึกษาได้');
      }

      // ถ้ามีการเลือกปีและภาคการศึกษาแล้ว ให้ดึงข้อมูลรายวิชาด้วย
      if (selectedYear && selectedSemester) {
        const encodedSemester = encodeURIComponent(selectedSemester);
        const res = await fetch(`http://localhost:4000/api/fd/courses/${student}?year=${selectedYear}&semester=${encodedSemester}`, {
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
          },
        });
        const data = await res.json();
        console.log('Refreshed course data:', data);
        
        // แปลงข้อมูลให้ตรงกับ interface
        const mappedData = Array.isArray(data) ? data.map(item => ({
          ...item,
          subjectNameTh: item.subjectNameThai || item.subjectNameTh,
          subjectNameEng: item.subjectNameEng || item.subjectNameEng,
        })) : [];
        
        setCourseData(mappedData);
        
        if (Array.isArray(data) && data.length > 0) {
          message.success(`อัปเดตข้อมูลรายวิชาสำเร็จ - พบรายวิชา ${data.length} วิชา`);
        } else {
          message.warning('ไม่พบรายวิชาในภาคการศึกษานี้');
        }
      } else {
        // ถ้ายังไม่ได้เลือกปี/ภาค ให้เคลียร์ข้อมูลรายวิชา
        setCourseData([]);
        message.info('กรุณาเลือกปีการศึกษาและภาคการศึกษาเพื่อดูรายวิชา');
      }
    } catch (err) {
      console.error('เกิดข้อผิดพลาดในการอัปเดตข้อมูล:', err);
      message.error('ไม่สามารถอัปเดตข้อมูลได้');
    } finally {
      setCourseLoading(false);
    }
  };


  // กรอง semester options ตามปีที่เลือก
  const filteredSemesters = Array.isArray(completedSemesters) 
    ? completedSemesters.filter(sem => 
        selectedYear ? sem.year === selectedYear : true
      )
    : [];

  // กรอง year options ตาม semester ที่เลือก
  const filteredYears = Array.isArray(completedSemesters)
    ? completedSemesters
        .filter(sem => selectedSemester ? sem.semester === selectedSemester : true)
        .map(sem => sem.year)
        .filter((year, index, arr) => arr.indexOf(year) === index)
        .sort((a, b) => b - a)
    : [];

  // คำนวณ GPA ภาค (ไม่รวมเกรด P)
  const calculateSemesterGPA = (courses: CourseData[]) => {
    if (courses.length === 0) return 0;
    
    // กรองเกรด P ออก
    const validCourses = courses.filter(course => course.gradeCharacter !== 'P');
    
    if (validCourses.length === 0) return 0;
    
    const totalCredits = validCourses.reduce((sum, course) => sum + course.creditRegis, 0);
    const weightedSum = validCourses.reduce((sum, course) => 
      sum + (course.gradeNumber * course.creditRegis), 0
    );
    
    return totalCredits > 0 ? (weightedSum / totalCredits) : 0;
  };

  const semesterGPA = calculateSemesterGPA(courseData);

  const courseColumns = [
    {
      title: 'รหัสวิชา',
      dataIndex: 'subjectCode',
      key: 'subjectCode',
      align: 'center' as const,
      width: 120,
      render: (text: string) => (
        <div className="text-base font-semibold text-gray-800">
          {text}
        </div>
      ),
    },
    {
      title: 'ชื่อวิชา (ไทย)',
      dataIndex: 'subjectNameTh',
      key: 'subjectNameTh',
      width: 250,
      render: (text: string, record: CourseData) => {
        console.log('Rendering subjectNameTh:', text, 'for record:', record);
        console.log('Full record data:', JSON.stringify(record, null, 2));
        return (
          <div className="text-base font-semibold text-gray-800" style={{ fontFamily: 'Kanit, sans-serif' }}>
            {text || record.subjectNameTh || 'ไม่พบชื่อวิชา'}
          </div>
        );
      },
    },
    {
      title: 'ชื่อวิชา (อังกฤษ)',
      dataIndex: 'subjectNameEng',
      key: 'subjectNameEng',
      width: 250,
      render: (text: string) => (
        <div className="text-base text-gray-600 italic">
          {text || 'No English name'}
        </div>
      ),
    },
    {
      title: 'หน่วยกิต',
      dataIndex: 'credit',
      key: 'credit',
      align: 'center' as const,
      width: 80,
      render: (credit: number) => (
        <div className="text-center font-semibold text-gray-700">
          {credit}
        </div>
      ),
    },
    {
      title: 'เกรด',
      dataIndex: 'gradeCharacter',
      key: 'gradeCharacter',
      align: 'center' as const,
      width: 100,
      render: (grade: string) => {
        const getGradeColor = (grade: string) => {
          switch (grade) {
            case 'A':
              return 'bg-green-100 text-green-800 border-green-300';
            case 'B+':
              return 'bg-blue-100 text-blue-800 border-blue-300';
            case 'B':
              return 'bg-blue-100 text-blue-800 border-blue-300';
            case 'C+':
              return 'bg-yellow-100 text-yellow-800 border-yellow-300';
            case 'C':
              return 'bg-yellow-100 text-yellow-800 border-yellow-300';
            case 'D+':
              return 'bg-orange-100 text-orange-800 border-orange-300';
            case 'D':
              return 'bg-orange-100 text-orange-800 border-orange-300';
            case 'F':
              return 'bg-red-100 text-red-800 border-red-300';
            case 'P':
              return 'bg-purple-100 text-purple-800 border-purple-300';
            case 'W':
              return 'bg-gray-100 text-gray-800 border-gray-300';
            case 'I':
              return 'bg-gray-100 text-gray-800 border-gray-300';
            default:
              return 'bg-gray-100 text-gray-800 border-gray-300';
          }
        };

        return (
          <div className="text-center">
            <div className={`inline-block px-3 py-1 rounded-lg border-2 text-lg font-bold ${getGradeColor(grade)}`}>
              {grade || '-'}
            </div>
          </div>
        );
      },
    },
    {
      title: 'Section',
      key: 'section',
      align: 'center' as const,
      width: 150,
      render: (record: CourseData) => {
        const hasLecture = record.secLecture && record.secLecture !== 0 && record.secLecture !== '0';
        const hasLab = record.secLab && record.secLab !== 0 && record.secLab !== '0';
        
        return (
          <div className="space-y-1">
            {hasLecture && (
              <div className="text-xs">
                <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-blue-500 text-white">
                  Lec: {record.secLecture}
                </span>
              </div>
            )}
            {hasLab && (
              <div className="text-xs">
                <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-orange-500 text-white">
                  Lab: {record.secLab}
                </span>
              </div>
            )}
            {!hasLecture && !hasLab && (
              <div className="text-xs text-gray-500">
                -
              </div>
            )}
          </div>
        );
      },
    },
    {
      title: 'ประเภท',
      dataIndex: 'typeRegis',
      key: 'typeRegis',
      align: 'center' as const,
      width: 100,
      render: (type: string) => (
        <div className="text-center">
          <span className={`inline-block px-2 py-1 rounded text-xs font-medium text-white ${
            type === '1' ? 'bg-purple-500' : 'bg-gray-500'
          }`}>
            {type === '1' ? 'Credit' : 'Audit'}
          </span>
        </div>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6" style={{ fontFamily: 'Kanit, sans-serif' }}>
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <RefreshCw className="w-6 h-6 mr-2 text-purple-500" />
          อัปเดตผลการเรียน
        </h2>

               {/* Navigation Menu */}
               <DashboardNavCards />

        {/* Search Student Section - แสดงเฉพาะเมื่อไม่มีข้อมูลนิสิต */}
        {!studentInfo && (
          <Card title="ค้นหานิสิต" className="mb-6 shadow-md">
            <div className="flex items-center gap-4 mb-4">
              <Input
                type="text"
                placeholder="กรุณาใส่รหัสนิสิต"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                value={student}
                onChange={(e) => setStudent(e.target.value)}
              />
              <Button
                type="primary"
                icon={<Search className="w-5 h-5" />}
                size="large"
                onClick={handleSearchStudent}
                loading={loading}
              >
                ค้นหา
              </Button>
            </div>
          </Card>
        )}


        {/* Filter and Course Display Section */}
        <Card title="กรองและแสดงผลการเรียน" className="mb-6">
          {!studentInfo ? (
            <Alert
              message="กรุณาค้นหานิสิตก่อน"
              description="กรุณากรอกรหัสนิสิตและกดปุ่ม 'ค้นหา' เพื่อดูข้อมูลภาคการศึกษาที่มีอยู่"
              type="warning"
              icon={<AlertCircle className="w-5 h-5" />}
            />
          ) : (
            <>
              <Row gutter={[16, 16]} className="mb-4">
                <Col xs={24} sm={12} md={6}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ปีการศึกษา
                  </label>
                  <Select
                    placeholder="เลือกปีการศึกษา"
                    className="w-full"
                    value={selectedYear}
                    onChange={setSelectedYear}
                    options={filteredYears.map(year => ({
                      value: year,
                      label: `ปีการศึกษา ${year}`
                    }))}
                    disabled={filteredYears.length === 0}
                  />
                </Col>
                
                <Col xs={24} sm={12} md={6}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ภาคการศึกษา
                  </label>
                  <Select
                    placeholder="เลือกภาคการศึกษา"
                    className="w-full"
                    value={selectedSemester}
                    onChange={setSelectedSemester}
                    options={filteredSemesters.map(sem => ({
                      value: sem.semester,
                      label: sem.semester
                    }))}
                    disabled={filteredSemesters.length === 0}
                  />
                </Col>

                <Col xs={24} sm={12} md={3}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ดึงข้อมูลรายวิชา
                  </label>
                  <Button
                    type="default"
                    icon={<BookOpen className="w-4 h-4" />}
                    size="large"
                    onClick={handleFetchCourses}
                    loading={courseLoading}
                    className="w-full"
                    disabled={!selectedYear || !selectedSemester}
                  >
                    ดึงข้อมูล
                  </Button>
                </Col>

                <Col xs={24} sm={12} md={3}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    อัปเดตข้อมูล
                  </label>
                  <Button
                    type="primary"
                    icon={<RefreshCw className="w-4 h-4" />}
                    size="large"
                    onClick={handleRefreshData}
                    loading={courseLoading}
                    className="w-full"
                    disabled={!student}
                  >
                    อัปเดต
                  </Button>
                </Col>
              </Row>

              <Alert
                message="คำแนะนำ"
                description={`เลือกปีการศึกษาและภาคการศึกษา (มีข้อมูล ${completedSemesters.length} ภาคการศึกษา) แล้วกดปุ่ม 'ดึงข้อมูล' เพื่อดูรายวิชาและเกรด หรือกดปุ่ม 'อัปเดต' เพื่อรีเฟรชข้อมูลภาคการศึกษาและรายวิชาล่าสุด`}
                type="info"
                icon={<AlertCircle className="w-5 h-5" />}
              />
            </>
          )}
        </Card>

        {/* Course Data Table */}
        {courseData.length > 0 && (
          <Card
            title={
              <div className="flex justify-between items-center">
                <span>
                  ผลการเรียน ภาคการศึกษา {selectedSemester} ปีการศึกษา {selectedYear}
                </span>
                <div className="text-sm font-normal text-gray-600">
                  จำนวนวิชา: <span className="font-bold text-blue-600">{courseData.length}</span> |
                  GPA ภาค: <span className="font-bold text-blue-600">{semesterGPA.toFixed(2)}</span>
                </div>
              </div>
            }
          >
            <Table
              columns={courseColumns}
              dataSource={courseData}
              pagination={false}
              rowKey="regisId"
              className="mb-4"
              style={{ fontFamily: 'Kanit, sans-serif' }}
            />
          </Card>
        )}

      </div>
    </DashboardLayout>
  );
}
