'use client';

import { useMemo } from 'react';

export type ScatterInput = {
  subjectCode: string;
  year: number;
  semesterPart: 0 | 1 | 2;
  avgGpa: number | null;
  periodTime?: string | null; // e.g. "10:00 - 12:00"
  meanHour?: number | null;   // preferred numeric x
};

function parseMeanHour(period?: string | null): number | null {
  if (!period) return null;
  const m = period.match(/(\d{1,2})[:\.]?(\d{2})?\s*[-–]\s*(\d{1,2})[:\.]?(\d{2})?/);
  if (!m) return null;
  const sh = parseInt(m[1], 10);
  const sm = m[2] ? parseInt(m[2], 10) : 0;
  const eh = parseInt(m[3], 10);
  const em = m[4] ? parseInt(m[4], 10) : 0;
  const start = sh + sm / 60;
  const end = eh + em / 60;
  return (start + end) / 2;
}

export default function AvgGpaScatter({ data, height = 420 }: { data: ScatterInput[]; height?: number }) {
  const points = useMemo(() => {
    return (data || [])
      .map(d => {
        const x = d.meanHour != null ? d.meanHour : parseMeanHour(d.periodTime);
        const y = d.avgGpa ?? null;
        return { x, y, subjectCode: d.subjectCode, year: d.year, semesterPart: d.semesterPart };
      })
      .filter(p => p.x != null && p.y != null) as Array<{ x: number; y: number; subjectCode: string; year: number; semesterPart: number }>;
  }, [data]);

  const padding = { top: 10, right: 20, bottom: 40, left: 40 };
  const width = 900;
  const innerW = width - padding.left - padding.right;
  const innerH = height - padding.top - padding.bottom;

  const xMin = Math.min(7, ...points.map(p => p.x));
  const xMax = Math.max(21, ...points.map(p => p.x));
  const yMin = 0;
  const yMax = 4;

  const xScale = (x: number) => padding.left + ((x - xMin) / (xMax - xMin)) * innerW;
  const yScale = (y: number) => padding.top + (1 - (y - yMin) / (yMax - yMin)) * innerH;

  const ticksX = Array.from({ length: Math.floor(xMax - xMin) + 1 }, (_, i) => Math.floor(xMin) + i).filter((h) => h >= xMin && h <= xMax);
  const ticksY = [0, 1, 2, 3, 4];

  const color = (sp: number) => (sp === 1 ? '#4f46e5' : sp === 2 ? '#16a34a' : '#f59e0b');

  return (
    <div className="w-full overflow-x-auto">
      <svg width={width} height={height}>
        <line x1={padding.left} y1={yScale(0)} x2={padding.left + innerW} y2={yScale(0)} stroke="#cbd5e1" />
        <line x1={padding.left} y1={padding.top} x2={padding.left} y2={padding.top + innerH} stroke="#cbd5e1" />

        {ticksX.map((t) => (
          <g key={`x-${t}`}>
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

        <text x={padding.left + innerW / 2} y={height - 5} textAnchor="middle" fontSize="12" fill="#334155">Mean time (hour)</text>
        <text x={14} y={padding.top + innerH / 2} textAnchor="middle" fontSize="12" fill="#334155" transform={`rotate(-90 14 ${padding.top + innerH / 2})`}>Average GPA</text>

        {points.map((p, i) => (
          <circle key={i} cx={xScale(p.x)} cy={yScale(p.y)} r={4} fill={color(p.semesterPart)} fillOpacity={0.8} />
        ))}
      </svg>
    </div>
  );
}
