'use client';

import { useState, useEffect } from 'react';
import { Card, Input, Button, Select, Table, message, Spin, Alert, Tag, Row, Col } from 'antd';
import { RefreshCw, Search, AlertCircle, BookOpen } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import DashboardNavCards from '@/components/DashboardNavCards';

interface StudentInfo {
  studentId: string;
  fisrtNameTh: string;
  lastNameTh: string;
  fisrtNameEng?: string;
  lastNameEng?: string;
  parentTell?: string;
  email: string;
  titleTh?: string;
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
  studentId: string;
  subjectCode: string;
  subjectNameTh: string;
  subjectNameEng: string;
  credit: number;
  gradeCharacter: string;
  gradeNumber: number;
  creditRegis: number;
  semesterYear: number;
  semesterPart: string;
  typeRegis: string;
  gradeStatus: string;
}

export default function UpdateGradesPage() {
  const [student, setStudent] = useState('');
  const [studentInfo, setStudentInfo] = useState<StudentInfo | null>(null);
  const [completedSemesters, setCompletedSemesters] = useState<CompletedSemester[]>([]);
  const [selectedSemester, setSelectedSemester] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [courseData, setCourseData] = useState<CourseData[]>([]);
  const [editingGrades, setEditingGrades] = useState<{[key: number]: {gradeCharacter: string, gradeNumber: number}}>({});

  // กำหนดค่าเกรด A-F และ 4-0
  const gradeOptions = [
    { value: 'A', label: 'A (4.0)', gradeNumber: 4.0 },
    { value: 'B+', label: 'B+ (3.5)', gradeNumber: 3.5 },
    { value: 'B', label: 'B (3.0)', gradeNumber: 3.0 },
    { value: 'C+', label: 'C+ (2.5)', gradeNumber: 2.5 },
    { value: 'C', label: 'C (2.0)', gradeNumber: 2.0 },
    { value: 'D+', label: 'D+ (1.5)', gradeNumber: 1.5 },
    { value: 'D', label: 'D (1.0)', gradeNumber: 1.0 },
    { value: 'F', label: 'F (0.0)', gradeNumber: 0.0 },
  ];
  const [loading, setLoading] = useState(false);
  const [courseLoading, setCourseLoading] = useState(false);
  const [updatingGrade, setUpdatingGrade] = useState<number | null>(null);

  // ค้นหาข้อมูลนิสิต
  const handleSearchStudent = async () => {
    if (!student) {
      message.error('กรุณากรอกรหัสนิสิต');
      return;
    }

    setLoading(true);
    try {
      // ตรวจสอบว่า backend ทำงานอยู่หรือไม่
      const healthCheck = await fetch('http://localhost:4000/api');
      if (!healthCheck.ok) {
        throw new Error('Backend server ไม่ทำงาน');
      }

      const res = await fetch(`http://localhost:4000/api/fd/${student}`);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'ไม่พบข้อมูลนิสิต');
      }
      const data = await res.json();
      setStudentInfo(data);
      
      // ดึงข้อมูล semester ที่นิสิตเรียนจบแล้ว
      const semesterRes = await fetch(`http://localhost:4000/api/fd/completed-semesters/${student}`);
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
      
      message.success('ค้นหาข้อมูลนิสิตสำเร็จ');
    } catch (err: any) {
      console.error('เกิดข้อผิดพลาด:', err);
      message.error(err.message || 'ไม่สามารถเรียกข้อมูลได้');
    } finally {
      setLoading(false);
    }
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
      const res = await fetch(`http://localhost:4000/api/fd/courses/${student}?year=${selectedYear}&semester=${encodedSemester}`);
      const data = await res.json();
      console.log('Course data:', data);
      setCourseData(Array.isArray(data) ? data : []);
      
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
        const res = await fetch(`http://localhost:4000/api/fd/courses/${student}?year=${selectedYear}&semester=${encodedSemester}`);
        const data = await res.json();
        console.log('Refreshed course data:', data);
        setCourseData(Array.isArray(data) ? data : []);
        
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

  // อัปเดตเกรดเฉพาะวิชา
  const handleUpdateGrade = async (regisId: number, gradeCharacter: string, gradeNumber: number) => {
    setUpdatingGrade(regisId);
    try {
      const res = await fetch(`http://localhost:4000/api/fd/grade/${regisId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ gradeCharacter, gradeNumber }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'ไม่สามารถอัปเดตเกรดได้');
      }

      const data = await res.json();
      message.success('อัปเดตเกรดและคำนวณ GPA ใหม่สำเร็จ');

      // อัปเดตข้อมูลใน state
      setCourseData(prev => prev.map(course =>
        course.regisId === regisId
          ? { ...course, gradeCharacter, gradeNumber }
          : course
      ));

      // อัปเดตข้อมูลภาคการศึกษาสำหรับตารางสรุป GPA
      if (student) {
        try {
          const semesterRes = await fetch(`http://localhost:4000/api/fd/completed-semesters/${student}`);
          if (semesterRes.ok) {
            const semesterData = await semesterRes.json();
            setCompletedSemesters(Array.isArray(semesterData) ? semesterData : []);
          }
        } catch (err) {
          console.error('Error refreshing semester data:', err);
        }
      }

      // ลบข้อมูลการแก้ไข
      setEditingGrades(prev => {
        const newEditing = { ...prev };
        delete newEditing[regisId];
        return newEditing;
      });

    } catch (err: any) {
      console.error('เกิดข้อผิดพลาดในการอัปเดตเกรด:', err);
      message.error(err.message || 'เกิดข้อผิดพลาดในการอัปเดตเกรด');
    } finally {
      setUpdatingGrade(null);
    }
  };

  // เริ่มแก้ไขเกรด
  const handleStartEditGrade = (regisId: number, currentGradeCharacter: string, currentGradeNumber: number) => {
    setEditingGrades(prev => ({
      ...prev,
      [regisId]: {
        gradeCharacter: currentGradeCharacter,
        gradeNumber: currentGradeNumber
      }
    }));
  };

  // เปลี่ยนเกรด (อัปเดตทั้งตัวอักษรและตัวเลขพร้อมกัน)
  const handleGradeChange = (regisId: number, gradeCharacter: string) => {
    const selectedGrade = gradeOptions.find(option => option.value === gradeCharacter);
    if (selectedGrade) {
      setEditingGrades(prev => ({
        ...prev,
        [regisId]: {
          gradeCharacter: selectedGrade.value,
          gradeNumber: selectedGrade.gradeNumber
        }
      }));
    }
  };

  // ยกเลิกการแก้ไข
  const handleCancelEditGrade = (regisId: number) => {
    setEditingGrades(prev => {
      const newEditing = { ...prev };
      delete newEditing[regisId];
      return newEditing;
    });
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
    },
    {
      title: 'ชื่อวิชา (ไทย)',
      dataIndex: 'subjectNameTh',
      key: 'subjectNameTh',
      width: 200,
    },
    {
      title: 'ชื่อวิชา (อังกฤษ)',
      dataIndex: 'subjectNameEng',
      key: 'subjectNameEng',
      width: 200,
    },
    {
      title: 'หน่วยกิต',
      dataIndex: 'credit',
      key: 'credit',
      align: 'center' as const,
      width: 80,
    },
    {
      title: 'เกรด',
      key: 'grade',
      align: 'center' as const,
      width: 200,
      render: (record: CourseData) => {
        const isEditing = editingGrades[record.regisId];
        const editingData = isEditing || { gradeCharacter: record.gradeCharacter, gradeNumber: record.gradeNumber };

        return (
          <div className="text-center">
            {isEditing ? (
              <div className="space-y-2">
                <div className="flex justify-center">
                  <Select
                    size="small"
                    value={editingData.gradeCharacter}
                    onChange={(value) => handleGradeChange(record.regisId, value)}
                    options={gradeOptions}
                    className="w-24"
                    placeholder="เลือกเกรด"
                  />
                </div>
                <div className="flex gap-1 justify-center">
                  <Button
                    size="small"
                    type="primary"
                    loading={updatingGrade === record.regisId}
                    onClick={() => handleUpdateGrade(record.regisId, editingData.gradeCharacter, editingData.gradeNumber)}
                    className="text-xs"
                  >
                    บันทึก
                  </Button>
                  <Button
                    size="small"
                    onClick={() => handleCancelEditGrade(record.regisId)}
                    className="text-xs"
                  >
                    ยกเลิก
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center space-y-2">
                <Tag
                  color={record.gradeNumber >= 3.5 ? 'green' : record.gradeNumber >= 2.5 ? 'blue' : record.gradeNumber >= 2 ? 'orange' : 'red'}
                  className="text-lg font-bold cursor-pointer px-3 py-1"
                  onClick={() => handleStartEditGrade(record.regisId, record.gradeCharacter, record.gradeNumber)}
                >
                  {record.gradeCharacter}
                </Tag>
                <div className="text-sm font-semibold text-gray-700">{record.gradeNumber}</div>
                <div className="text-xs text-blue-500 cursor-pointer hover:underline"
                     onClick={() => handleStartEditGrade(record.regisId, record.gradeCharacter, record.gradeNumber)}>
                  แก้ไข
                </div>
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
        <Tag color={type === 'Credit' ? 'blue' : 'default'}>
          {type}
        </Tag>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <RefreshCw className="w-6 h-6 mr-2 text-purple-500" />
          อัปเดตผลการเรียน
        </h2>

               {/* Navigation Menu */}
               <DashboardNavCards />

        {/* Search Student Section */}
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
          {studentInfo && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h5 className="text-lg font-semibold text-gray-800 mb-2">ข้อมูลนิสิต:</h5>
              <p className="text-gray-700">
                <strong>รหัสนิสิต:</strong> {studentInfo.studentId}
              </p>
              <p className="text-gray-700">
                <strong>ชื่อ-นามสกุล:</strong> {studentInfo.titleTh} {studentInfo.fisrtNameTh} {studentInfo.lastNameTh}
              </p>
              <p className="text-gray-700">
                <strong>อีเมล:</strong> {studentInfo.email}
              </p>
            </div>
          )}
        </Card>

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
            />
          </Card>
        )}

      </div>
    </DashboardLayout>
  );
}
