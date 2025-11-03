'use client';

import { useEffect, useState, useCallback } from 'react';
import { Select, Slider, Spin, Table, Empty } from 'antd'; // เพิ่ม Spin และ Empty
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
          yearStart: yearRange[0], 
          yearEnd: yearRange[1], 
          departmentId: department, 
          programId: program 
        }),
        fetchSubjectGpaTable({ 
          yearStart: yearRange[0], 
          yearEnd: yearRange[1], 
          departmentId: department, 
          programId: program 
        }),
        fetchCategoryTeachingHeatmap({
          yearStart: yearRange[0],
          yearEnd: yearRange[1],
          departmentId: department,
          programId: program,
        }),
      ]);
      setGpaBoxData(gpaData);
      setSubjectRows(tableData);
      setHeatmapRows(heatmap);
      console.log('[GPA DATA LOAD]', { department, program, yearRange, gpaDataCount: gpaData?.length, tableDataCount: tableData?.length });
    } catch (error) {
      console.error("Failed to fetch data:", error);
      setGpaBoxData([]);
      setSubjectRows([]);
    } finally {
      setLoading(false);
    }
  }, [department, program, yearRange]);

  // Initial load for lookups and first data fetch
  useEffect(() => {
    let isMounted = true;
    async function loadInitialData() {
      setLoading(true);
      try {
        const [deps, progs] = await Promise.all([
          fetchDepartments().catch(() => []),
          fetchPrograms().catch(() => []),
        ]);
        if (isMounted) {
          setDepartmentList(deps);
          setProgramList(progs);
          // Fetch data after lookups are loaded
          await fetchData(); 
        }
      } catch (error) {
        console.error("Failed to load initial lookup data:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadInitialData();
    return () => { isMounted = false; };
  }, [fetchData]); // fetchData is stable due to useCallback

  // Effect for refetching data when filters change
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Table columns definition
  const columns = [
    { title: 'หมวดวิชา', dataIndex: 'category', key: 'category', sorter: (a: SubjectGpaRow, b: SubjectGpaRow) => a.category.localeCompare(b.category) },
    { title: 'ประเภท', dataIndex: 'type', key: 'type', sorter: (a: SubjectGpaRow, b: SubjectGpaRow) => a.type.localeCompare(b.type) },
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
    },
    { title: 'จำนวนนิสิต (ไม่รวม W)', dataIndex: 'studentCount', key: 'studentCount', width: 160, sorter: (a: SubjectGpaRow, b: SubjectGpaRow) => a.studentCount - b.studentCount },
  ];

  return (
    <DashboardLayout>
      <div className="p-6 md:p-8 bg-gray-50 min-h-screen">
        {/* Filters Card */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">ตัวกรองข้อมูล</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-center">
            <div>
              <label htmlFor="department-select" className="block text-sm font-medium text-gray-700 mb-2">
                ภาควิชา
              </label>
              <Select
                id="department-select"
                className="w-full"
                placeholder="เลือกภาควิชาทั้งหมด"
                options={departmentList.map((d) => ({ 
                  label: `${d.name}${d.studentCount ? ` (${d.studentCount})` : ''}`, 
                  value: d.id 
                }))}
                value={department}
                onChange={setDepartment}
                allowClear
                size="large"
              />
            </div>
            <div>
              <label htmlFor="program-select" className="block text-sm font-medium text-gray-700 mb-2">
                หลักสูตร
              </label>
              <Select
                id="program-select"
                className="w-full"
                placeholder="เลือกหลักสูตรทั้งหมด"
                options={programList.map((p) => ({ 
                  label: `${p.name}${p.studentCount ? ` (${p.studentCount})` : ''}`, 
                  value: p.id 
                }))}
                value={program}
                onChange={setProgram}
                allowClear
                size="large"
              />
            </div>
            <div className="md:col-span-2">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700">ช่วงปีการศึกษา</label>
                <span className="text-sm font-semibold text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                  {yearRange[0]} - {yearRange[1]}
                </span>
              </div>
              <Slider
                range
                min={2560}
                max={2573}
                marks={{ 2560: '2560', 2566: '2566', 2573: '2573' }}
                value={yearRange}
                onChange={(v) => Array.isArray(v) && v.length === 2 && setYearRange([v[0] as number, v[1] as number])}
                tooltip={{ formatter: (v) => `${v}` }}
                className="pt-4"
              />
            </div>
          </div>
        </div>

        {/* Charts and Tables Section */}
        <Spin spinning={loading} size="large" tip="กำลังโหลดข้อมูล..." className="w-full">
          <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
            {/* GPA Box Plot Card */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">
                กล่องเกรดเฉลี่ย (Boxplot) ตามหมวดวิชา
              </h2>
              <div className="h-[450px] flex items-center justify-center">
                {gpaBoxData.length > 0 ? (
                  <GpaBoxPlot data={gpaBoxData} />
                ) : (
                  <Empty description="ไม่พบข้อมูล GPA Boxplot" />
                )}
              </div>
            </div>

            {/* Heatmap Card */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">
                Heatmap: หมวดวิชา × รูปแบบการสอน
              </h2>
              {heatmapRows.length > 0 ? (
                <CategoryTeachingHeatmap data={heatmapRows} />
              ) : (
                <Empty description="ไม่พบข้อมูล Heatmap" />
              )}
            </div>

            {/* Subject GPA Table Card */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">
                ตารางเกรดเฉลี่ยรายวิชา
              </h2>
              {subjectRows.length > 0 ? (
                <Table
                  size="middle"
                  rowKey={(r) => `${r.subjectCode}-${r.year}-${r.category}`} // เพิ่ม category เพื่อให้ rowKey ไม่ซ้ำ
                  dataSource={subjectRows}
                  pagination={{ pageSize: 10, showSizeChanger: true, showTotal: (total, range) => `${range[0]}-${range[1]} จาก ${total} รายการ` }}
                  columns={columns}
                  scroll={{ x: 'max-content' }} // ทำให้ Table สามารถ Scroll แนวนอนได้ถ้าข้อมูลเยอะ
                  className="[&_thead_th]:bg-gray-50 [&_thead_th]:text-gray-700 [&_thead_th]:font-semibold" // ปรับแต่ง header table
                />
              ) : (
                <Empty description="ไม่พบข้อมูลตารางเกรดเฉลี่ยรายวิชา" />
              )}
            </div>
          </div>
        </Spin>
      </div>
    </DashboardLayout>
  );
}