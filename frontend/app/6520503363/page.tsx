'use client';

import { useEffect, useState } from 'react';
import { Select, Slider, Table } from 'antd';
import DashboardLayout from '@/components/DashboardLayout';
import WFBoxPlot from '@/components/charts/WFBoxPlot';
import WFYearCategoryHeatmap from '@/components/charts/WFYearCategoryHeatmap';
import { fetchWFBoxplotByCategory, fetchWFHeatmapByYearCategory, fetchWFSubjectTable, type WFHeatmapRow, type WFSubjectTableRow } from '@/app/dashboard/service/wf-report.service';
import { fetchDepartments, fetchPrograms, type LookupItem } from '@/app/dashboard/service/lookup.service';

type CategoryRequire = {
  creditEarned?: number | null;
  totalCreditRequire?: number | null;
};

export default function Student6520503363Page() {
  const studentId = '6520503363';
  const [loading, setLoading] = useState(true);
  const [wfBoxData, setWfBoxData] = useState<Array<{ category: string; W: any; F: any }>>([]);
  const [wfHeatmapData, setWfHeatmapData] = useState<WFHeatmapRow[]>([]);
  const [wfTableData, setWfTableData] = useState<WFSubjectTableRow[]>([]);

  // ================= Filters =================
  // options จะโหลดจากฐานข้อมูลจริงที่ mount แรก
  const [department, setDepartment] = useState<number | undefined>();
  const [program, setProgram] = useState<number | undefined>();
  const [yearRange, setYearRange] = useState<[number, number]>([2560, 2573]);
  const [departmentList, setDepartmentList] = useState<LookupItem[]>([]);
  const [programList, setProgramList] = useState<LookupItem[]>([]);

  useEffect(() => {
    let isMounted = true;
    async function load() {
      setLoading(true);
      try {
        const [data, heatmapData, tableData, deps, progs] = await Promise.all([
          fetchWFBoxplotByCategory({ yearStart: yearRange[0], yearEnd: yearRange[1] }),
          fetchWFHeatmapByYearCategory({ yearStart: yearRange[0], yearEnd: yearRange[1] }),
          fetchWFSubjectTable({ yearStart: yearRange[0], yearEnd: yearRange[1] }),
          fetchDepartments().catch(() => []),
          fetchPrograms().catch(() => []),
        ]);
        if (!isMounted) return;
        console.log('[WF INIT BOX] rows', data);
        console.log('[WF INIT HEATMAP] rows', heatmapData);
        console.log('[WF INIT TABLE] rows', tableData);
        setWfBoxData(data);
        setWfHeatmapData(heatmapData);
        setWfTableData(tableData);
        setDepartmentList(deps);
        setProgramList(progs);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    load();
    return () => { isMounted = false; };
  }, []);

  // Handle filter change
  useEffect(() => {
    (async () => {
      try {
        const [data, heatmapData, tableData] = await Promise.all([
          fetchWFBoxplotByCategory({ yearStart: yearRange[0], yearEnd: yearRange[1], departmentId: department, programId: program }),
          fetchWFHeatmapByYearCategory({ yearStart: yearRange[0], yearEnd: yearRange[1], departmentId: department, programId: program }),
          fetchWFSubjectTable({ yearStart: yearRange[0], yearEnd: yearRange[1], departmentId: department, programId: program }),
        ]);
        console.log('[WF RELOAD BOX]', { department, program, yearRange, rows: data?.length });
        console.log('[WF RELOAD HEATMAP]', { department, program, yearRange, rows: heatmapData?.length });
        console.log('[WF RELOAD TABLE]', { department, program, yearRange, rows: tableData?.length });
        setWfBoxData(data);
        setWfHeatmapData(heatmapData);
        setWfTableData(tableData);
      } catch {}
    })();
  }, [department, program, yearRange]);

  // no GPA/progress card in this page

  return (
    <DashboardLayout>
      <div className="p-6">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
            <div>
              <div className="text-sm text-gray-600 mb-1">ภาควิชา</div>
              <Select
                className="w-full"
                placeholder="เลือกภาควิชา"
                options={departmentList.map((d) => ({ label: `${d.name}${d.studentCount ? ` (${d.studentCount})` : ''}` , value: d.id }))}
                value={department}
                onChange={setDepartment}
                allowClear
              />
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">หลักสูตร</div>
              <Select
                className="w-full"
                placeholder="เลือกหลักสูตร"
                options={programList.map((p) => ({ label: `${p.name}${p.studentCount ? ` (${p.studentCount})` : ''}` , value: p.id }))}
                value={program}
                onChange={setProgram}
                allowClear
              />
            </div>
            <div className="md:col-span-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-600">ช่วงปีการศึกษา</span>
                <span className="text-xs text-gray-500">{yearRange[0]} - {yearRange[1]}</span>
              </div>
              <Slider
                range
                min={2560}
                max={2573}
                marks={{ 2560: '2560', 2566: '2566', 2573: '2573' }}
                value={yearRange}
                onChange={(v) => Array.isArray(v) && v.length === 2 && setYearRange([v[0] as number, v[1] as number])}
                tooltip={{ formatter: (v) => `${v}` }}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <div className="col-span-1">
            <div className="bg-white rounded-lg shadow p-4 h-[480px]">
              <h2 className="text-lg font-medium mb-4">สัดส่วนผู้ลงทะเบียนที่ติด W/F ตามหมวดวิชา</h2>
              <WFBoxPlot data={wfBoxData} />
            </div>
          </div>
          
          {/* Heatmaps */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="text-lg font-medium mb-4">Heatmap: % W ตามปี × หมวดวิชา</h2>
              <WFYearCategoryHeatmap data={wfHeatmapData} type="W" />
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="text-lg font-medium mb-4">Heatmap: % F ตามปี × หมวดวิชา</h2>
              <WFYearCategoryHeatmap data={wfHeatmapData} type="F" />
            </div>
          </div>

          {/* WF Subject Table */}
          <div className="col-span-1">
            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="text-lg font-medium mb-4">ตารางข้อมูล W/F ตามวิชา</h2>
              <Table
                columns={[
                  {
                    title: 'หมวด',
                    dataIndex: 'category',
                    key: 'category',
                    width: 200,
                    fixed: 'left' as const,
                  },
                  {
                    title: 'ประเภท',
                    dataIndex: 'type',
                    key: 'type',
                    width: 120,
                  },
                  {
                    title: 'รหัสวิชา',
                    dataIndex: 'subjectCode',
                    key: 'subjectCode',
                    width: 120,
                  },
                  {
                    title: 'ชื่อวิชา',
                    dataIndex: 'subjectName',
                    key: 'subjectName',
                    width: 250,
                  },
                  {
                    title: 'ปีการศึกษา',
                    dataIndex: 'year',
                    key: 'year',
                    width: 100,
                    align: 'center' as const,
                  },
                  {
                    title: 'จำนวน W',
                    dataIndex: 'wCount',
                    key: 'wCount',
                    width: 100,
                    align: 'right' as const,
                    render: (val: number) => val.toLocaleString(),
                  },
                  {
                    title: 'จำนวน F',
                    dataIndex: 'fCount',
                    key: 'fCount',
                    width: 100,
                    align: 'right' as const,
                    render: (val: number) => val.toLocaleString(),
                  },
                  {
                    title: 'ทั้งหมด (W+F)',
                    dataIndex: 'total',
                    key: 'total',
                    width: 120,
                    align: 'right' as const,
                    render: (val: number) => val.toLocaleString(),
                  },
                ]}
                dataSource={wfTableData}
                rowKey={(record) => `${record.subjectCode}-${record.year}`}
                scroll={{ x: 1200, y: 400 }}
                pagination={{
                  pageSize: 20,
                  showSizeChanger: false,
                  showTotal: (total) => `ทั้งหมด ${total} รายการ`,
                }}
                size="small"
              />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}


