'use client';

import { useEffect, useState } from 'react';
import { Select, Slider } from 'antd';
import DashboardLayout from '@/components/DashboardLayout';
import WFBoxPlot from '@/components/charts/WFBoxPlot';
import { fetchWFBoxplotByCategory } from '@/app/dashboard/service/wf-report.service';
import { fetchDepartments, fetchPrograms, type LookupItem } from '@/app/dashboard/service/lookup.service';

type CategoryRequire = {
  creditEarned?: number | null;
  totalCreditRequire?: number | null;
};

export default function Student6520503363Page() {
  const studentId = '6520503363';
  const [loading, setLoading] = useState(true);
  const [wfBoxData, setWfBoxData] = useState<Array<{ category: string; W: any; F: any }>>([]);

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
        const [data, deps, progs] = await Promise.all([
          fetchWFBoxplotByCategory({ yearStart: yearRange[0], yearEnd: yearRange[1] }),
          fetchDepartments().catch(() => []),
          fetchPrograms().catch(() => []),
        ]);
        if (!isMounted) return;
        console.log('[WF INIT BOX] rows', data);
        setWfBoxData(data);
        setDepartmentList(deps);
        setProgramList(progs);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    load();
    return () => { isMounted = false; };
  }, []);

  // Placeholder: handle filter change (ready for future API queries)
  useEffect(() => {
    (async () => {
      try {
        const data = await fetchWFBoxplotByCategory({ yearStart: yearRange[0], yearEnd: yearRange[1], departmentId: department, programId: program });
        console.log('[WF RELOAD BOX]', { department, program, yearRange, rows: data?.length });
        setWfBoxData(data);
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
        </div>
      </div>
    </DashboardLayout>
  );
}


