'use client';

import { useEffect, useState } from 'react';
import { Select, Slider, Table, Spin, Alert } from 'antd';
import DashboardLayout from '@/components/DashboardLayout';
import WFBoxPlot from '@/components/charts/WFBoxPlot';
import WFYearCategoryHeatmap from '@/components/charts/WFYearCategoryHeatmap';
import { fetchWFBoxplotByCategory, fetchWFHeatmapByYearCategory, fetchWFSubjectTable, type WFHeatmapRow, type WFSubjectTableRow } from '@/app/dashboard/service/wf-report.service';
import { fetchDepartments, fetchCoursePlans, type LookupItem } from '@/app/dashboard/service/lookup.service';

type CategoryRequire = {
  creditEarned?: number | null;
  totalCreditRequire?: number | null;
};

export default function Student6520503363Page() {
  const studentId = '6520503363';
  const [loading, setLoading] = useState(false);
  const [wfBoxData, setWfBoxData] = useState<Array<{ category: string; W: any; F: any }>>([]);
  const [wfHeatmapData, setWfHeatmapData] = useState<WFHeatmapRow[]>([]);
  const [wfTableData, setWfTableData] = useState<WFSubjectTableRow[]>([]);

  // ================= Filters =================
  // options จะโหลดจากฐานข้อมูลจริงที่ mount แรก
  const [department, setDepartment] = useState<number | undefined>();
  const [coursePlan, setCoursePlan] = useState<number | undefined>();
  const [yearRange, setYearRange] = useState<[number, number]>([2560, 2573]);
  const [departmentList, setDepartmentList] = useState<LookupItem[]>([]);
  const [coursePlanList, setCoursePlanList] = useState<LookupItem[]>([]);

  // โหลดเฉพาะ dropdown lists เมื่อ mount
  useEffect(() => {
    let isMounted = true;
    async function loadLists() {
      try {
        const [deps, coursePlans] = await Promise.all([
          fetchDepartments().catch(() => []),
          fetchCoursePlans().catch(() => []),
        ]);
        if (!isMounted) return;
        setDepartmentList(deps);
        setCoursePlanList(coursePlans);
      } catch (error) {
        console.error('Failed to load filter lists:', error);
      }
    }
    loadLists();
    return () => { isMounted = false; };
  }, []);

  // โหลดข้อมูลเมื่อมีการเลือก filter แล้วเท่านั้น
  useEffect(() => {
    // ถ้ายังไม่ได้เลือก filter ไม่ต้องโหลดข้อมูล
    if (!department && !coursePlan) {
      setWfBoxData([]);
      setWfHeatmapData([]);
      setWfTableData([]);
      return;
    }

    let isMounted = true;
    async function loadData() {
      setLoading(true);
      try {
        const [data, heatmapData, tableData] = await Promise.all([
          fetchWFBoxplotByCategory({ yearStart: yearRange[0], yearEnd: yearRange[1], departmentId: department, coursePlanId: coursePlan }),
          fetchWFHeatmapByYearCategory({ yearStart: yearRange[0], yearEnd: yearRange[1], departmentId: department, coursePlanId: coursePlan }),
          fetchWFSubjectTable({ yearStart: yearRange[0], yearEnd: yearRange[1], departmentId: department, coursePlanId: coursePlan }),
        ]);
        if (!isMounted) return;
        console.log('[WF RELOAD BOX]', { department, coursePlan, yearRange, rows: data?.length });
        console.log('[WF RELOAD HEATMAP]', { department, coursePlan, yearRange, rows: heatmapData?.length });
        console.log('[WF RELOAD TABLE]', { department, coursePlan, yearRange, rows: tableData?.length });
        setWfBoxData(data);
        setWfHeatmapData(heatmapData);
        setWfTableData(tableData);
      } catch (error) {
        console.error('Failed to load WF data:', error);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadData();
    return () => { isMounted = false; };
  }, [department, coursePlan, yearRange]);

  // no GPA/progress card in this page

  return (
    <DashboardLayout>
      <div className="p-3">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-3 mb-3">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-center">
            <div>
              <div className="text-xs text-gray-600 mb-1">ภาควิชา</div>
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
              <div className="text-xs text-gray-600 mb-1">หลักสูตร</div>
              <Select
                className="w-full"
                placeholder="เลือกหลักสูตร"
                options={coursePlanList.map((p) => ({ label: `${p.name}${p.studentCount ? ` (${p.studentCount})` : ''}` , value: p.id }))}
                value={coursePlan}
                onChange={setCoursePlan}
                allowClear
              />
            </div>
            <div className="md:col-span-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-600">ช่วงปีการศึกษา</span>
                <span className="text-[10px] text-gray-500">{yearRange[0]} - {yearRange[1]}</span>
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

        {!department && !coursePlan && (
          <Alert
            message="กรุณาเลือกภาควิชาหรือหลักสูตรเพื่อแสดงข้อมูล"
            type="info"
            showIcon
            className="mb-3 text-xs"
          />
        )}

        {loading && (
          <div className="flex justify-center items-center py-8">
            <Spin size="large" />
          </div>
        )}

        {!loading && (department || coursePlan) && (
          <div className="grid grid-cols-1 gap-3">
            <div className="col-span-1">
              <div className="bg-white rounded-lg shadow p-2 h-[320px] flex flex-col">
                <h2 className="text-sm font-medium mb-2">สัดส่วนผู้ลงทะเบียนที่ติด W/F ตามหมวดวิชา</h2>
                <div className="flex-1 min-h-0">
                  <WFBoxPlot data={wfBoxData} />
                </div>
              </div>
            </div>
          
          {/* Heatmaps */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            <div className="bg-white rounded-lg shadow p-2 flex flex-col">
              <h2 className="text-sm font-medium mb-2">Heatmap: % W ตามปี × หมวดวิชา</h2>
              <div className="flex-1 min-h-0">
                <WFYearCategoryHeatmap data={wfHeatmapData} type="W" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-2 flex flex-col">
              <h2 className="text-sm font-medium mb-2">Heatmap: % F ตามปี × หมวดวิชา</h2>
              <div className="flex-1 min-h-0">
                <WFYearCategoryHeatmap data={wfHeatmapData} type="F" />
              </div>
            </div>
          </div>

          {/* WF Subject Table */}
          <div className="col-span-1">
            <div className="bg-white rounded-lg shadow p-2">
              <h2 className="text-sm font-medium mb-2">ตารางข้อมูล W/F ตามวิชา</h2>
              <Table
                columns={[
                  {
                    title: 'หมวด',
                    dataIndex: 'category',
                    key: 'category',
                    width: 150,
                    fixed: 'left' as const,
                    ellipsis: { showTitle: false },
                    render: (text: string) => (
                      <div className="text-xs whitespace-normal break-words" title={text}>
                        {text}
                      </div>
                    ),
                  },
                  {
                    title: 'ประเภท',
                    dataIndex: 'type',
                    key: 'type',
                    width: 100,
                    render: (text: string) => (
                      <div className="text-xs">{text}</div>
                    ),
                  },
                  {
                    title: 'รหัสวิชา',
                    dataIndex: 'subjectCode',
                    key: 'subjectCode',
                    width: 100,
                    render: (text: string) => (
                      <div className="text-xs">{text}</div>
                    ),
                  },
                  {
                    title: 'ชื่อวิชา',
                    dataIndex: 'subjectName',
                    key: 'subjectName',
                    width: 200,
                    ellipsis: { showTitle: false },
                    render: (text: string) => (
                      <div className="text-xs whitespace-normal break-words" title={text} style={{ maxWidth: 200 }}>
                        {text}
                      </div>
                    ),
                  },
                  {
                    title: 'ปีการศึกษา',
                    dataIndex: 'year',
                    key: 'year',
                    width: 90,
                    align: 'center' as const,
                    render: (val: number) => <div className="text-xs">{val}</div>,
                  },
                  {
                    title: 'จำนวน W',
                    dataIndex: 'wCount',
                    key: 'wCount',
                    width: 90,
                    align: 'right' as const,
                    render: (val: number) => <div className="text-xs">{val.toLocaleString()}</div>,
                  },
                  {
                    title: 'จำนวน F',
                    dataIndex: 'fCount',
                    key: 'fCount',
                    width: 90,
                    align: 'right' as const,
                    render: (val: number) => <div className="text-xs">{val.toLocaleString()}</div>,
                  },
                  {
                    title: 'ทั้งหมด (W+F)',
                    dataIndex: 'total',
                    key: 'total',
                    width: 100,
                    align: 'right' as const,
                    render: (val: number) => <div className="text-xs">{val.toLocaleString()}</div>,
                  },
                ]}
                dataSource={wfTableData}
                rowKey={(record) => `${record.subjectCode}-${record.year}`}
                scroll={{ x: 'max-content', y: 300 }}
                pagination={{
                  pageSize: 15,
                  showSizeChanger: false,
                  showTotal: (total) => `ทั้งหมด ${total} รายการ`,
                  size: 'small',
                }}
                size="small"
              />
            </div>
          </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}


