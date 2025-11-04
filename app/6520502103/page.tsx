'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { Empty, Skeleton, Table } from 'antd';
import DashboardLayout from '@/components/DashboardLayout';
import FilterCard from '@/components/filters/FilterCard';
import SelectField from '@/components/filters/SelectField';
import YearRangeSlider from '@/components/filters/YearRangeSlider';
import SemesterCheck, { SemesterValue } from '@/components/filters/SemesterCheck';
import { 
  fetchDepartments, 
  fetchPrograms, 
  type LookupItem,
  fetchSemesters,
  type OptionItem 
} from '@/app/dashboard/service/lookup.service';
import { fetchSubjectGpaTable, type SubjectGpaRow, fetchAvgGpaScatter, type GpaScatterPoint, fetchWFByCategory, type WFCategoryRow, fetchSubjectGradeCounts, type SubjectGradeCount } from '@/app/dashboard/service/wf-report.service';

// ประเภทข้อมูลตารางเรียน (placeholder)
type TimetableRow = {
  key: string;
  subjectCode: string;
  subjectName: string;
  day: string;
  time: string;
  room: string;
  teacher: string;
};

// กราฟจุดแบบ SVG (Average GPA ต่อปี)
function ScatterChart({ points, height = 260 }: { points: Array<{ x: number; y: number; sp?: number }>; height?: number }) {
  const padding = { top: 10, right: 20, bottom: 40, left: 40 };
  const width = 900;
  const innerW = width - padding.left - padding.right;
  const innerH = height - padding.top - padding.bottom;

  if (!points.length) {
    return <Empty description="ไม่พบข้อมูลสำหรับกราฟ" />;
  }

  const xs = points.map(p => p.x);
  const ys = points.map(p => p.y);
  const xMin = Math.min(...xs);
  const xMax = Math.max(...xs);
  const yMin = 0;
  const yMax = 4;

  const xScale = (x: number) => padding.left + ((x - xMin) / (xMax - xMin || 1)) * innerW;
  const yScale = (y: number) => padding.top + (1 - (y - yMin) / (yMax - yMin || 1)) * innerH;

  const ticksX = Array.from({ length: Math.min(8, Math.max(2, points.length)) }, (_, i) =>
    Math.round(xMin + ((xMax - xMin) * i) / Math.max(1, Math.min(7, points.length - 1)))
  );
  const ticksY = [0, 1, 2, 3, 4];

  // แปลงปี ค.ศ. เป็น พ.ศ. สำหรับแสดงผล
  const toBEYear = (year: number): number => {
    // ถ้า year < 2200 แสดงว่าเป็น ค.ศ. ต้องแปลงเป็น พ.ศ.
    return year < 2200 ? year + 543 : year;
  };

  const color = (sp?: number) => (sp === 1 ? '#4f46e5' : sp === 2 ? '#16a34a' : '#f59e0b');

  return (
    <div className="w-full overflow-x-auto">
      <svg width={width} height={height}>
        <line x1={padding.left} y1={yScale(0)} x2={padding.left + innerW} y2={yScale(0)} stroke="#cbd5e1" />
        <line x1={padding.left} y1={padding.top} x2={padding.left} y2={padding.top + innerH} stroke="#cbd5e1" />

        {ticksX.map((t, idx) => {
          const yearBE = toBEYear(t);
          return (
            <g key={`x-${t}-${idx}`}>
              <line x1={xScale(t)} y1={yScale(0)} x2={xScale(t)} y2={yScale(0) + 6} stroke="#94a3b8" />
              <text x={xScale(t)} y={yScale(0) + 18} textAnchor="middle" fontSize="10" fill="#64748b">{yearBE}</text>
            </g>
          );
        })}
        {ticksY.map((t) => (
          <g key={`y-${t}`}>
            <line x1={padding.left - 6} y1={yScale(t)} x2={padding.left} y2={yScale(t)} stroke="#94a3b8" />
            <text x={padding.left - 10} y={yScale(t) + 3} textAnchor="end" fontSize="10" fill="#64748b">{t}</text>
          </g>
        ))}

        {points.map((p, i) => (
          <circle key={i} cx={xScale(p.x)} cy={yScale(p.y)} r={4} fill={color(p.sp)} fillOpacity={0.9} />
        ))}

        <text x={padding.left + innerW / 2} y={height - 5} textAnchor="middle" fontSize="12" fill="#334155">ปีการศึกษา</text>
        <text x={14} y={padding.top + innerH / 2} textAnchor="middle" fontSize="12" fill="#334155" transform={`rotate(-90 14 ${padding.top + innerH / 2})`}>Average GPA</text>
      </svg>
    </div>
  );
}

// กราฟจุด F/W ต่อหมวด (ประมาณการจำนวนจากเปอร์เซ็นต์)
function WFScatter({ data, height = 260 }: { data: Array<{ x: number; y: number; type: 'F' | 'W' }>; height?: number }) {
  const padding = { top: 10, right: 20, bottom: 40, left: 40 };
  const width = 900;
  const innerW = width - padding.left - padding.right;
  const innerH = height - padding.top - padding.bottom;
  if (!data.length) return <Empty description="ไม่พบข้อมูลสำหรับกราฟ" />;
  const xs = data.map(d => d.x);
  const ys = data.map(d => d.y);
  const xMin = Math.min(...xs);
  const xMax = Math.max(...xs);
  const yMin = 0;
  const yMax = Math.max(4, Math.max(...ys));
  const xScale = (x: number) => padding.left + ((x - xMin) / (xMax - xMin || 1)) * innerW;
  const yScale = (y: number) => padding.top + (1 - (y - yMin) / (yMax - yMin || 1)) * innerH;
  const ticksX = Array.from({ length: Math.min(10, Math.max(2, data.length)) }, (_, i) => Math.round(xMin + ((xMax - xMin) * i) / Math.max(1, Math.min(9, data.length - 1))));
  const ticksY = Array.from({ length: 5 }, (_, i) => Math.round((yMax * i) / 4));
  const color = (t: 'F' | 'W') => (t === 'F' ? '#ef4444' : '#6366f1');
  return (
    <div className="w-full overflow-x-auto">
      <svg width={width} height={height}>
        <line x1={padding.left} y1={yScale(0)} x2={padding.left + innerW} y2={yScale(0)} stroke="#cbd5e1" />
        <line x1={padding.left} y1={padding.top} x2={padding.left} y2={padding.top + innerH} stroke="#cbd5e1" />
        {ticksX.map((t, idx) => (
          <g key={`x-${t}-${idx}`}>
            <line x1={xScale(t)} y1={yScale(0)} x2={xScale(t)} y2={yScale(0) + 6} stroke="#94a3b8" />
            <text x={xScale(t)} y={yScale(0) + 18} textAnchor="middle" fontSize="10" fill="#64748b">{t}</text>
          </g>
        ))}
        {ticksY.map((t) => (
          <g key={`y-${t}`}>
            <line x1={padding.left - 6} y1={yScale(t)} x2={padding.left} y2={yScale(t)} stroke="#94a3b8" />
            <text x={padding.left - 10} y={yScale(t) + 3} textAnchor="end" fontSize="10" fill="#64748b">{t}</text>
          </g>
        ))}
        {data.map((d, i) => (
          <circle key={i} cx={xScale(d.x)} cy={yScale(d.y)} r={4} fill={color(d.type)} fillOpacity={0.9} />
        ))}
        <text x={padding.left + innerW / 2} y={height - 5} textAnchor="middle" fontSize="12" fill="#334155">index (หมวด/ลำดับ)</text>
        <text x={14} y={padding.top + innerH / 2} textAnchor="middle" fontSize="12" fill="#334155" transform={`rotate(-90 14 ${padding.top + innerH / 2})`}>จำนวนผู้ได้ F/W</text>
      </svg>
    </div>
  );
}

export default function TimetablePage() {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<TimetableRow[]>([]);
  const [gpaByYear, setGpaByYear] = useState<Array<{ x: number; y: number }>>([]);
  const [scatterRaw, setScatterRaw] = useState<GpaScatterPoint[]>([]);
  const [subjectRowsForTable, setSubjectRowsForTable] = useState<SubjectGpaRow[]>([]);
  const [gradeCounts, setGradeCounts] = useState<SubjectGradeCount[]>([]);
  const [wfPoints, setWfPoints] = useState<Array<{ x: number; y: number; type: 'F' | 'W' }>>([]);

  // ================= Filters =================
  const [department, setDepartment] = useState<number | undefined>();
  const [program, setProgram] = useState<number | undefined>();
  const [yearRange, setYearRange] = useState<[number, number]>([2560, 2573]);
  const [semesterTerms, setSemesterTerms] = useState<SemesterValue[]>([1, 2]);
  const [departmentList, setDepartmentList] = useState<LookupItem[]>([]);
  const [programList, setProgramList] = useState<LookupItem[]>([]);
  const [semesterOptions, setSemesterOptions] = useState<OptionItem[]>([]);

  // แปลงชื่อหลักสูตร เช่น "วศ.คอม 60" -> 2560, "วศ.คอม 65" -> 2565
  const getProgramStartYear = useCallback((name?: string): number | undefined => {
    if (!name) return undefined;
    const m = name.match(/(^|\D)(6\d)(?=\D|$)/);
    if (!m) return undefined;
    const yy = parseInt(m[2], 10);
    if (Number.isNaN(yy)) return undefined;
    return 2500 + yy;
  }, []);

  // คำนวณ min/max ของ Slider ตามหลักสูตรที่เลือก
  const selectedProgram = programList.find(p => p.id === program);
  const startYear = getProgramStartYear(selectedProgram?.name);
  const sliderMin = startYear ?? 2560;
  const sliderMax = (startYear != null) ? startYear + 13 : 2573;

  // เมื่อเลือกหลักสูตร ให้ปรับปีให้อยู่ในช่วง [start, start+13]
  useEffect(() => {
    if (startYear != null) {
      const newStart = startYear;
      const newEnd = startYear + 13;
      const clampedStart = Math.max(newStart, Math.min(yearRange[0], newEnd));
      const clampedEnd = Math.max(clampedStart, Math.min(yearRange[1], newEnd));
      setYearRange([clampedStart, clampedEnd]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startYear]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      setRows([]);

      let subjectRows: SubjectGpaRow[] = await fetchSubjectGpaTable({
        yearStart: yearRange[0],
        yearEnd: yearRange[1],
        departmentId: department,
        programId: program,
      }).catch(() => []);

      if (subjectRows.length === 0 && program != null) {
        subjectRows = await fetchSubjectGpaTable({
          yearStart: yearRange[0],
          yearEnd: yearRange[1],
          departmentId: department,
        }).catch(() => []);
      }
      if (subjectRows.length === 0 && department != null) {
        subjectRows = await fetchSubjectGpaTable({
          yearStart: yearRange[0],
          yearEnd: yearRange[1],
        }).catch(() => []);
      }

      const yearToValues = new Map<number, number[]>();
      for (const r of subjectRows) {
        if (r.avgGpa != null) {
          if (!yearToValues.has(r.year)) yearToValues.set(r.year, []);
          yearToValues.get(r.year)!.push(r.avgGpa);
        }
      }
      const points = Array.from(yearToValues.entries())
        .map(([year, vals]) => ({ x: year, y: vals.reduce((a, b) => a + b, 0) / vals.length }))
        .sort((a, b) => a.x - b.x);
      setGpaByYear(points);
      setSubjectRowsForTable(subjectRows);

      // ดึงข้อมูล scatter ที่มี semesterPart เพื่อให้ตัวกรองภาคการศึกษามีผล
      // ถ้าเลือกทั้ง 3 ภาคการศึกษา (1,2,0) ก็ไม่ต้องกรองตามภาคการศึกษา
      const allSemestersSelected = semesterTerms.length === 3 && 
        semesterTerms.includes(1) && semesterTerms.includes(2) && semesterTerms.includes(0);
      const semesterPartsToSend = allSemestersSelected ? undefined : semesterTerms;
      
      let scatterData = await fetchAvgGpaScatter({
        yearStart: yearRange[0],
        yearEnd: yearRange[1],
        departmentId: department,
        programId: program,
        semesterParts: semesterPartsToSend,
      }).catch(() => []);
      // Fallback หากไม่พบข้อมูลและมีการกรองหลักสูตร ให้ลองดึงใหม่โดยไม่ส่ง programId
      if (scatterData.length === 0 && program != null) {
        scatterData = await fetchAvgGpaScatter({
          yearStart: yearRange[0],
          yearEnd: yearRange[1],
          departmentId: department,
          semesterParts: semesterPartsToSend,
        }).catch(() => []);
      }
      // Fallback หากไม่พบข้อมูลและมีการกรองภาควิชา ให้ลองดึงใหม่โดยไม่ส่ง departmentId
      if (scatterData.length === 0 && department != null) {
        scatterData = await fetchAvgGpaScatter({
          yearStart: yearRange[0],
          yearEnd: yearRange[1],
          semesterParts: semesterPartsToSend,
        }).catch(() => []);
      }
      // Fallback หากไม่พบข้อมูลและเลือกเฉพาะ 1 อัน ให้ลองดึงข้อมูลทั้งหมด (ไม่กรองตามภาคการศึกษา) แล้วกรองฝั่ง frontend
      if (scatterData.length === 0 && !allSemestersSelected && semesterTerms.length > 0) {
        scatterData = await fetchAvgGpaScatter({
          yearStart: yearRange[0],
          yearEnd: yearRange[1],
          departmentId: department,
          programId: program,
          // ไม่ส่ง semesterParts เพื่อดึงข้อมูลทั้งหมด
        }).catch(() => []);
      }
      setScatterRaw(scatterData);

      // ดึงข้อมูล F/W/P count ต่อรายวิชา
      // ถ้าเลือกทั้ง 3 ภาคการศึกษา (1,2,0) ก็ไม่ต้องกรองตามภาคการศึกษา
      const counts = await fetchSubjectGradeCounts({
        yearStart: yearRange[0],
        yearEnd: yearRange[1],
        departmentId: department,
        programId: program,
        semesterParts: semesterPartsToSend,
      }).catch(() => []);
      setGradeCounts(counts);

      // ดึงข้อมูล WF ตามปี เพื่อนับจำนวนผู้ได้ F/W ให้สัมพันธ์กับช่วงปีที่เลือก
      const wfPts: Array<{ x: number; y: number; type: 'F' | 'W' }> = [];
      for (let y = yearRange[0]; y <= yearRange[1]; y += 1) {
        // เรียกต่อปี เพื่อให้ปีการศึกษามีผลแน่นอน
        let rowsY: WFCategoryRow[] = await fetchWFByCategory({
          yearStart: y,
          yearEnd: y,
          departmentId: department,
          programId: program,
        }).catch(() => []);
        if (rowsY.length === 0 && program != null) {
          rowsY = await fetchWFByCategory({ yearStart: y, yearEnd: y, departmentId: department }).catch(() => []);
        }
        if (rowsY.length === 0 && department != null) {
          rowsY = await fetchWFByCategory({ yearStart: y, yearEnd: y }).catch(() => []);
        }
        // รวมจำนวน F/W ของทุกหมวดในปีนั้น
        let sumF = 0; let sumW = 0;
        rowsY.forEach(r => {
          sumF += Math.round(r.total * (r.percentF / 100));
          sumW += Math.round(r.total * (r.percentW / 100));
        });
        // วางจุดสองประเภทบนปีเดียวกันโดยขยับเล็กน้อย
        if (sumF > 0) wfPts.push({ x: y + 0.1, y: sumF, type: 'F' });
        if (sumW > 0) wfPts.push({ x: y + 0.6, y: sumW, type: 'W' });
      }
      setWfPoints(wfPts);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      setRows([]);
      setGpaByYear([]);
      setScatterRaw([]);
      setWfPoints([]);
    } finally {
      setLoading(false);
    }
  }, [department, program, yearRange, semesterTerms]);

  useEffect(() => {
    let isMounted = true;
    async function loadInitialData() {
      try {
        const [deps, progs, sems] = await Promise.all([
          fetchDepartments().catch(() => []),
          fetchPrograms().catch(() => []),
          fetchSemesters().catch(() => []),
        ]);
        if (!isMounted) return;

        setDepartmentList(deps);
        setProgramList(progs);
        setSemesterOptions(sems);

        const computerDept = deps.find(d => d.name.includes('ว.คอม') || d.name.includes('วศว'));
        const regularProgram = progs.find(p => p.name.includes('ภาคปกติ'));

        let fetchImmediately = true;
        if (computerDept) { setDepartment(computerDept.id); fetchImmediately = false; }
        if (regularProgram) { setProgram(regularProgram.id); fetchImmediately = false; }

        if (fetchImmediately) {
          await fetchData();
        }
      } catch (error) {
        console.error('Failed to load lookup data:', error);
      }
    }
    loadInitialData();
    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredScatterPoints = useMemo(() => {
    // ตรวจสอบว่าการเลือกทั้ง 3 ภาคการศึกษา (1,2,0) หรือไม่
    const allSemestersSelected = semesterTerms.length === 3 && 
      semesterTerms.includes(1) && semesterTerms.includes(2) && semesterTerms.includes(0);
    
    // กรองตาม yearRange และ semesterTerms
    const filtered = scatterRaw
      .filter((p) => {
        // แปลงปี ค.ศ. เป็น พ.ศ. ถ้าจำเป็น
        const yearBE = p.year < 2200 ? p.year + 543 : p.year;
        return yearBE >= yearRange[0] && yearBE <= yearRange[1];
      })
      .filter((p) => {
        // ถ้าเลือกทั้ง 3 อันแล้วไม่ต้องกรองตามภาคการศึกษา
        if (allSemestersSelected) return true;
        // แปลง semesterPart เป็น number และตรวจสอบว่า match กับ semesterTerms
        // รองรับทั้ง string ('1', '2', '0') และ number (1, 2, 0)
        let sp: number;
        if (typeof p.semesterPart === 'string') {
          sp = parseInt(p.semesterPart, 10);
        } else {
          sp = Number(p.semesterPart);
        }
        // ตรวจสอบว่าเป็น number ที่ถูกต้องและ match กับ semesterTerms
        if (isNaN(sp)) return false;
        // ตรวจสอบว่า semesterTerms มีค่า sp หรือไม่
        return semesterTerms.some(term => term === sp);
      });

    if (!filtered.length) {
      // Fallback: ใช้ gpaByYear แต่กรองตาม yearRange
      return gpaByYear
        .filter((p) => {
          const yearBE = p.x < 2200 ? p.x + 543 : p.x;
          return yearBE >= yearRange[0] && yearBE <= yearRange[1];
        })
        .map(p => ({ x: p.x, y: p.y }));
    }

    const offset = (sp: number) => (sp === 1 ? 0.1 : sp === 2 ? 0.6 : 0.9);
    return filtered
      .map((p) => {
        const yearBE = p.year < 2200 ? p.year + 543 : p.year;
        return { x: yearBE + offset(Number(p.semesterPart)), y: p.avgGpa ?? 0, sp: Number(p.semesterPart) };
      })
      .filter((p) => Number.isFinite(p.y));
  }, [scatterRaw, semesterTerms, gpaByYear, yearRange]);

  // กรอง wfPoints ตาม yearRange และ semesterTerms
  const filteredWfPoints = useMemo(() => {
    // ตรวจสอบว่าการเลือกทั้ง 3 ภาคการศึกษา (1,2,0) หรือไม่
    const allSemestersSelected = semesterTerms.length === 3 && 
      semesterTerms.includes(1) && semesterTerms.includes(2) && semesterTerms.includes(0);
    
    // ใช้ข้อมูลจาก gradeCounts เพื่อคำนวณ F/W ตาม semesterTerms
    const yearToCounts = new Map<number, { f: number; w: number }>();
    gradeCounts
      .filter((gc) => {
        // ถ้าเลือกทั้ง 3 อันแล้วไม่ต้องกรองตามภาคการศึกษา
        const matchesSemester = allSemestersSelected || semesterTerms.includes(gc.semesterPart);
        return gc.year >= yearRange[0] && gc.year <= yearRange[1] && matchesSemester;
      })
      .forEach((gc) => {
        if (!yearToCounts.has(gc.year)) {
          yearToCounts.set(gc.year, { f: 0, w: 0 });
        }
        const counts = yearToCounts.get(gc.year)!;
        counts.f += gc.countF;
        counts.w += gc.countW;
      });

    // สร้าง points จาก yearToCounts
    const points: Array<{ x: number; y: number; type: 'F' | 'W' }> = [];
    yearToCounts.forEach((counts, year) => {
      if (counts.f > 0) points.push({ x: year + 0.1, y: counts.f, type: 'F' });
      if (counts.w > 0) points.push({ x: year + 0.6, y: counts.w, type: 'W' });
    });

    return points.length > 0 ? points : wfPoints.filter((p) => p.x >= yearRange[0] && p.x <= yearRange[1]);
  }, [gradeCounts, yearRange, semesterTerms, wfPoints]);

  const columns = [
    { title: 'รหัสวิชา', dataIndex: 'subjectCode', key: 'subjectCode', width: 120 },
    { title: 'ชื่อวิชา', dataIndex: 'subjectName', key: 'subjectName' },
    { title: 'วัน', dataIndex: 'day', key: 'day', width: 100 },
    { title: 'เวลา', dataIndex: 'time', key: 'time', width: 140 },
    { title: 'ห้อง', dataIndex: 'room', key: 'room', width: 140 },
    { title: 'อาจารย์ผู้สอน', dataIndex: 'teacher', key: 'teacher', width: 180 },
  ];

  // ตารางสรุปตามที่ผู้ใช้ต้องการ (ปี/ภาค/รหัสวิชา/เวลาสอน/GPA/F/W/P)
  type SummaryRow = {
    key: string;
    year: number;
    semesterPart: 0 | 1 | 2;
    subjectCode: string;
    teachingTime: string;
    avgGpa: number | null;
    fCount?: number | null;
    wCount?: number | null;
    pCount?: number | null;
  };

  const summaryRows: SummaryRow[] = useMemo(() => {
    // ใช้ข้อมูลจาก scatterRaw โดยตรง (มี year, semesterPart, subjectCode, avgGpa และเวลา)
    // กรองตามปีการศึกษาและภาคการศึกษาที่เลือก
    return scatterRaw
      .filter((p) => p.year >= yearRange[0] && p.year <= yearRange[1])
      .filter((p) => semesterTerms.includes(Number(p.semesterPart) as 0 | 1 | 2))
      .map((p, idx) => ({
        key: `${p.subjectCode}-${p.year}-${p.semesterPart}-${idx}`,
        year: p.year,
        semesterPart: Number(p.semesterPart) as 0 | 1 | 2,
        subjectCode: p.subjectCode,
        teachingTime: p.periodTime ? String(p.periodTime) : (p.meanHour != null ? `~${p.meanHour.toFixed(2)} h` : '-'),
        avgGpa: p.avgGpa ?? null,
        fCount: null,
        wCount: null,
        pCount: null,
      }))
      .filter((r) => r.teachingTime !== '-'); // ข้ามแถวที่ไม่มีเวลาเรียน
  }, [scatterRaw, yearRange, semesterTerms]);

  // Type สำหรับ filtered subject rows ที่มี F/W/P count และ semester_part
  type FilteredSubjectRow = SubjectGpaRow & {
    semester_part: 0 | 1 | 2;
    countF: number;
    countW: number;
    countP: number;
  };

  // คอลัมน์แบบเดียวกับหน้า 6520501000
  const subjectColumns = [
    { 
      title: 'ปีการศึกษา', 
      dataIndex: 'year', 
      key: 'year', 
      width: 120, 
      sorter: (a: SubjectGpaRow, b: SubjectGpaRow) => a.year - b.year, 
      render: (v: number) => (v < 2200 ? v + 543 : v) 
    },
    {
      title: 'ภาคการศึกษา',
      dataIndex: 'semester_part',
      key: 'semester_part',
      width: 120,
      render: (value: string | number) => {
        if (value == 1) {
          return 'ภาคต้น';
        }
        if (value == 2) {
          return 'ภาคปลาย';
        }
        if (value == 0) {
          return 'ภาคฤดูร้อน';
        }
        return value;
      }
    },
    { 
      title: 'รหัสวิชา', 
      dataIndex: 'subjectCode', 
      key: 'subjectCode', 
      width: 120 
    },
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
    { 
      title: 'จำนวนนิสิต (ไม่รวม W)', 
      dataIndex: 'studentCount', 
      key: 'studentCount', 
      width: 160, 
      sorter: (a: FilteredSubjectRow, b: FilteredSubjectRow) => a.studentCount - b.studentCount, 
      align: 'right' as const 
    },
  
    // --- คอลัมน์ที่เพิ่มเข้ามา ---
    {
      title: 'จำนวน P (ผ่าน)',
      dataIndex: 'countP',
      key: 'countP',
      width: 140,
      render: (v: number) => v.toLocaleString(),
      sorter: (a: FilteredSubjectRow, b: FilteredSubjectRow) => a.countP - b.countP,
      align: 'right' as const,
    },
    {
      title: 'จำนวน F (ตก)',
      dataIndex: 'countF',
      key: 'countF',
      width: 140,
      render: (v: number) => v.toLocaleString(),
      sorter: (a: FilteredSubjectRow, b: FilteredSubjectRow) => a.countF - b.countF,
      align: 'right' as const,
    },
    {
      title: 'จำนวน W (ถอน)',
      dataIndex: 'countW',
      key: 'countW',
      width: 140,
      render: (v: number) => v.toLocaleString(),
      sorter: (a: FilteredSubjectRow, b: FilteredSubjectRow) => a.countW - b.countW,
      align: 'right' as const,
    },
  ];

  // สร้าง map สำหรับข้อมูลรายวิชา (subjectName, avgGpa, studentCount) จาก subjectRowsForTable
  const subjectInfoMap = useMemo(() => {
    const map = new Map<string, SubjectGpaRow>();
    subjectRowsForTable.forEach((r) => {
      const year = r.year < 2200 ? r.year + 543 : r.year; // แปลง ค.ศ. เป็น พ.ศ.
      const key = `${r.subjectCode}-${year}`;
      // เก็บข้อมูลล่าสุด (ถ้ามีหลายรายการ)
      if (!map.has(key) || (r.avgGpa != null && map.get(key)?.avgGpa == null)) {
        map.set(key, { ...r, year });
      }
    });
    return map;
  }, [subjectRowsForTable]);

  const filteredSubjectRows = useMemo((): FilteredSubjectRow[] => {
    // ตรวจสอบว่าการเลือกทั้ง 3 ภาคการศึกษา (1,2,0) หรือไม่
    const allSemestersSelected = semesterTerms.length === 3 && 
      semesterTerms.includes(1) && semesterTerms.includes(2) && semesterTerms.includes(0);
    
    // ใช้ gradeCounts เป็นหลัก (เพราะมี semesterPart และ F/W/P count)
    // และ merge กับ subjectRowsForTable เพื่อหา subjectName และ avgGpa
    return gradeCounts
      .filter((gc) => {
        // ถ้าเลือกทั้ง 3 อันแล้วไม่ต้องกรองตามภาคการศึกษา
        const matchesSemester = allSemestersSelected || semesterTerms.includes(gc.semesterPart);
        // กรองตามปีการศึกษาและภาคการศึกษาที่เลือก
        return gc.year >= yearRange[0] && gc.year <= yearRange[1] && matchesSemester;
      })
      .map((gc): FilteredSubjectRow | null => {
        // หาข้อมูลรายวิชาจาก subjectRowsForTable
        const subjectInfo = subjectInfoMap.get(`${gc.subjectCode}-${gc.year}`);
        
        if (!subjectInfo) {
          // ถ้าไม่มีข้อมูลรายวิชา ให้ใช้ข้อมูลจาก gradeCounts เท่านั้น
          return {
            category: '', // ไม่มีข้อมูล
            type: '', // ไม่มีข้อมูล
            subjectCode: gc.subjectCode,
            subjectName: gc.subjectCode, // ใช้รหัสวิชาแทนชื่อวิชา
            year: gc.year,
            avgGpa: null,
            studentCount: gc.total,
            semester_part: gc.semesterPart,
            countF: gc.countF,
            countW: gc.countW,
            countP: gc.countP,
          };
        }

        return {
          ...subjectInfo,
          year: gc.year,
          semester_part: gc.semesterPart,
          countF: gc.countF,
          countW: gc.countW,
          countP: gc.countP,
        };
      })
      .filter((r): r is FilteredSubjectRow => r != null);
  }, [gradeCounts, yearRange, semesterTerms, subjectInfoMap]);

  return (
    <DashboardLayout>
      <div className="p-6 md:p-8 bg-gray-50 min-h-screen">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-6">ตารางเรียน</h1>

        <FilterCard title="ตัวกรองข้อมูล">
          <div className="space-y-6">
            <SelectField
              id="department-select"
              label="ภาควิชา"
              placeholder="เลือกภาควิชาทั้งหมด"
              options={departmentList.map((d) => ({ label: `${d.name}${d.studentCount ? ` (${d.studentCount})` : ''}`, value: d.id }))}
              value={department}
              onChange={setDepartment}
              size="large"
              className="max-w-md"
            />
            <SelectField
              id="program-select"
              label="หลักสูตร"
              placeholder="เลือกหลักสูตรทั้งหมด"
              options={programList.map((p) => ({ label: `${p.name}`, value: p.id }))}
              value={program}
              onChange={setProgram}
              size="large"
              className="max-w-md"
            />
            <SemesterCheck
              value={semesterTerms}
              onChange={setSemesterTerms}
              options={semesterOptions.map(o => ({ label: o.label, value: o.value as 0 | 1 | 2 }))}
            />
            <YearRangeSlider
              value={yearRange}
              min={sliderMin}
              max={sliderMax}
              onChange={setYearRange}
            />
          </div>
        </FilterCard>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 transition-shadow hover:shadow-xl mb-8">
          <h2 className="text-xl font-bold text-indigo-700 border-b pb-2 mb-4">เกรดเฉลี่ยรายปี (Scatter ตามภาคการศึกษา)</h2>
          {loading ? (
            <Skeleton active />
          ) : filteredScatterPoints.length > 0 ? (
            <ScatterChart points={filteredScatterPoints} />
          ) : (
            <Empty description="ไม่พบข้อมูลสำหรับกราฟ" />
          )}
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 transition-shadow hover:shadow-xl mb-8">
          <h2 className="text-xl font-bold text-indigo-700 border-b pb-2 mb-4">จำนวนผู้ได้ F/W ต่อหมวด (ประมาณการ)</h2>
          {loading ? (
            <Skeleton active />
          ) : filteredWfPoints.length > 0 ? (
            <WFScatter data={filteredWfPoints} />
          ) : (
            <Empty description="ไม่พบข้อมูลสำหรับกราฟ" />
          )}
        </div>

        {/* รายการตารางเรียน (ถูกนำออกตามคำขอ) */}

        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 transition-shadow hover:shadow-xl mt-8">
          <h2 className="text-xl font-bold text-indigo-700 border-b pb-2 mb-4">สรุปต่อรายวิชา</h2>
          {loading ? (
            <Skeleton active />
          ) : filteredSubjectRows.length > 0 ? (
            <Table
              size="middle"
              rowKey={(_, index) => String(index)}
              dataSource={filteredSubjectRows}
              pagination={{ 
                pageSize: 10, 
                showSizeChanger: true, 
                showTotal: (total, range) => `แสดง ${range[0]}-${range[1]} จากทั้งหมด ${total} รายการ` 
              }}
              columns={subjectColumns}
              scroll={{ x: 1200 }} 
              className="ant-table-striped"
            />
          ) : (
            <Empty description="ไม่พบข้อมูลสรุปต่อรายวิชา" />
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
