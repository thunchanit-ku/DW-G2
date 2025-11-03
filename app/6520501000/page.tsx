'use client';

import { useEffect, useState, useCallback } from 'react';
import { Select, Slider, Spin, Table, Empty, Skeleton } from 'antd';
import DashboardLayout from '@/components/DashboardLayout';
import GpaBoxPlot from '@/components/charts/GpaBoxPlot';
import CategoryTeachingHeatmap from '@/components/charts/CategoryTeachingHeatmap';
import { 
  fetchGpaBoxplotByCategory, 
  fetchSubjectGpaTable, 
  fetchCategoryTeachingHeatmap,
  type SubjectGpaRow,
  type CategoryTeachingHeatmapRow 
} from '@/app/dashboard/service/wf-report.service';
import { 
  fetchDepartments, 
  fetchPrograms, 
  type LookupItem 
} from '@/app/dashboard/service/lookup.service';

// ประเภทข้อมูลสำหรับ Box Plot
type GpaBoxPlotData = Array<{ 
  category: string; 
  GPA: { min: number; q1: number; median: number; q3: number; max: number }; 
}>;

export default function StudentPage() {
  const [loading, setLoading] = useState(true);
  const [gpaBoxData, setGpaBoxData] = useState<GpaBoxPlotData>([]);
  const [subjectRows, setSubjectRows] = useState<SubjectGpaRow[]>([]);
  const [heatmapRows, setHeatmapRows] = useState<CategoryTeachingHeatmapRow[]>([]);

  // ================= Filters =================
  const [department, setDepartment] = useState<number | undefined>();
  const [program, setProgram] = useState<number | undefined>();
  const [yearRange, setYearRange] = useState<[number, number]>([2560, 2573]);
  const [departmentList, setDepartmentList] = useState<LookupItem[]>([]);
  const [programList, setProgramList] = useState<LookupItem[]>([]);

  // Function to fetch all data based on current filters
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [gpaData, tableData, heatmap] = await Promise.all([
        fetchGpaBoxplotByCategory({ 
          yearStart: yearRange[0], yearEnd: yearRange[1], 
          departmentId: department, programId: program 
        }),
        fetchSubjectGpaTable({ 
          yearStart: yearRange[0], yearEnd: yearRange[1], 
          departmentId: department, programId: program 
        }),
        fetchCategoryTeachingHeatmap({
          yearStart: yearRange[0], yearEnd: yearRange[1],
          departmentId: department, programId: program,
        }),
      ]);
      setGpaBoxData(gpaData);
      setSubjectRows(tableData);
      setHeatmapRows(heatmap);
    } catch (error) {
      console.error("Failed to fetch data:", error);
      setGpaBoxData([]); setSubjectRows([]); setHeatmapRows([]);
    } finally {
      setLoading(false);
    }
  }, [department, program, yearRange]);

  // Initial load for lookups and first data fetch
  useEffect(() => {
    let isMounted = true;
    async function loadInitialData() {
      // โหลด List และกำหนดค่าเริ่มต้น
      try {
        const [deps, progs] = await Promise.all([
          fetchDepartments().catch(() => []),
          fetchPrograms().catch(() => []),
        ]);
        
        if (isMounted) {
          setDepartmentList(deps);
          setProgramList(progs);

          // 🚨 การแก้ไข: ค้นหา ID ภาควิชา 'วศว.คอม'
          // ใช้การค้นหาที่ยืดหยุ่น โดยหาคำว่า 'ว.คอม' หรือ 'วศว' 
          const computerDept = deps.find(d => d.name.includes('ว.คอม') || d.name.includes('วศว'));
          
          // ค้นหา ID หลักสูตร 'ภาคปกติ'
          const regularProgram = progs.find(p => p.name.includes('ภาคปกติ'));
          
          let fetchImmediately = true;

          if (computerDept) {
            setDepartment(computerDept.id); 
            fetchImmediately = false; // ชะลอการ fetch รอ useEffect
          }
          if (regularProgram) {
            setProgram(regularProgram.id);
            fetchImmediately = false; // ชะลอการ fetch รอ useEffect
          }
          
          // หากไม่มีค่าเริ่มต้นที่ต้องตั้งค่าเลย ให้เรียก fetchData ทันที
          if (fetchImmediately) {
             await fetchData(); 
          }
        }
      } catch (error) {
        console.error("Failed to load initial lookup data:", error);
      } 
    }
    loadInitialData();
    return () => { isMounted = false; };
  }, []); 

  // Effect for refetching data when filters change (รวมถึงเมื่อ department/program ถูกตั้งค่าครั้งแรก)
  useEffect(() => {
    // โค้ดนี้จะถูกเรียกเมื่อ department หรือ program เปลี่ยนค่า (รวมถึงการตั้งค่าเริ่มต้น)
    fetchData();
  }, [fetchData]);

  // Table columns definition (เหมือนเดิม)
  const columns = [
    { title: 'หมวดวิชา', dataIndex: 'category', key: 'category', sorter: (a: SubjectGpaRow, b: SubjectGpaRow) => a.category.localeCompare(b.category), fixed: 'left' as const, width: 150 },
    { title: 'ประเภท', dataIndex: 'type', key: 'type', sorter: (a: SubjectGpaRow, b: SubjectGpaRow) => a.type.localeCompare(b.type), width: 120 },
    { title: 'รหัสวิชา', dataIndex: 'subjectCode', key: 'subjectCode', width: 120 },
    { title: 'ชื่อวิชา', dataIndex: 'subjectName', key: 'subjectName', ellipsis: true },
    { title: 'ปีการศึกษา', dataIndex: 'year', key: 'year', width: 120, sorter: (a: SubjectGpaRow, b: SubjectGpaRow) => a.year - b.year },
    { 
      title: 'เกรดเฉลี่ย', 
      dataIndex: 'avgGpa', 
      key: 'avgGpa', 
      width: 120, 
      render: (v: number | null) => (v != null ? v.toFixed(2) : '-'),
      sorter: (a: SubjectGpaRow, b: SubjectGpaRow) => (a.avgGpa || 0) - (b.avgGpa || 0),
      defaultSortOrder: 'descend' as const, 
      align: 'right' as const, 
    },
    { title: 'จำนวนนิสิต (ไม่รวม W)', dataIndex: 'studentCount', key: 'studentCount', width: 160, sorter: (a: SubjectGpaRow, b: SubjectGpaRow) => a.studentCount - b.studentCount, align: 'right' as const },
  ];

  // Component สำหรับแสดงข้อมูล (หรือ Loading/Empty)
  const DataContainer = ({ title, data, ChartComponent, height }: { title: string, data: any[], ChartComponent: React.ComponentType<any>, height: string }) => (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 transition-shadow hover:shadow-xl">
      <h2 className="text-xl font-bold text-indigo-700 border-b pb-2 mb-4">{title}</h2>
      <div className={`flex items-center justify-center w-full ${height} overflow-x-auto`}>
        {loading ? (
          <Skeleton active paragraph={{ rows: 6 }} className="p-4 w-full" />
        ) : data.length > 0 ? (
          <ChartComponent data={data} className="w-full h-full" />
        ) : (
          <Empty description={`ไม่พบข้อมูล ${title.split(' ')[0]}`} />
        )}
      </div>
    </div>
  );

  return (
    <DashboardLayout>
      <div className="p-6 md:p-8 bg-gray-50 min-h-screen">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-6">ภาพรวมผลการเรียนและรูปแบบการสอน</h1>

        {/* Filters Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-700 border-b pb-3 mb-4">ตัวกรองข้อมูล</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-end">
            <div>
              <label htmlFor="department-select" className="block text-sm font-medium text-gray-700 mb-2">ภาควิชา</label>
              <Select id="department-select" className="w-full" placeholder="เลือกภาควิชาทั้งหมด"
                options={departmentList.map((d) => ({ label: `${d.name}${d.studentCount ? ` (${d.studentCount})` : ''}`, value: d.id }))}
                value={department} onChange={setDepartment} allowClear size="large"
              />
            </div>
            <div>
              <label htmlFor="program-select" className="block text-sm font-medium text-gray-700 mb-2">หลักสูตร</label>
              <Select id="program-select" className="w-full" placeholder="เลือกหลักสูตรทั้งหมด"
                options={programList.map((p) => ({ label: `${p.name}`, value: p.id }))}
                value={program} onChange={setProgram} allowClear size="large"
              />
            </div>
            <div className="md:col-span-2">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700">ช่วงปีการศึกษา</label>
                <span className="text-md font-bold text-indigo-600 bg-indigo-50 px-4 py-1 rounded-full border border-indigo-200">
                  {yearRange[0]} - {yearRange[1]}
                </span>
              </div>
              <Slider range min={2560} max={2573} 
                marks={{ 2560: '2560', 2566: '2566', 2573: '2573' }}
                value={yearRange}
                onChange={(v) => Array.isArray(v) && v.length === 2 && setYearRange([v[0] as number, v[1] as number])}
                tooltip={{ formatter: (v) => `${v}` }}
                className="pt-4"
              />
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <DataContainer title="กล่องเกรดเฉลี่ย (Boxplot) ตามหมวดวิชา" data={gpaBoxData} ChartComponent={GpaBoxPlot} height="h-[450px]" />
          <DataContainer title="Heatmap: หมวดวิชา × รูปแบบการสอน" data={heatmapRows} ChartComponent={CategoryTeachingHeatmap} height="h-[500px]" />
        </div>
          
        {/* Subject GPA Table Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 transition-shadow hover:shadow-xl">
          <h2 className="text-xl font-bold text-indigo-700 border-b pb-2 mb-4">ตารางเกรดเฉลี่ยรายวิชา</h2>
          {loading ? (
            <Skeleton active />
          ) : subjectRows.length > 0 ? (
            <Table
              size="middle"
              rowKey={(r) => `${r.subjectCode}-${r.year}-${r.category}`}
              dataSource={subjectRows}
              pagination={{ 
                pageSize: 10, showSizeChanger: true, 
                showTotal: (total, range) => `แสดง ${range[0]}-${range[1]} จากทั้งหมด ${total} รายการ` 
              }}
              columns={columns}
              scroll={{ x: 1200 }} 
              className="ant-table-striped"
            />
          ) : (
            <Empty description="ไม่พบข้อมูลตารางเกรดเฉลี่ยรายวิชา" />
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}