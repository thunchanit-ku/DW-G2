'use client';

import React from 'react';

type Row = { category: string; mode: string; avgGpa: number | null; studentCount: number };

interface Props {
  data: Row[];
}

const MODES = ['ภาคบรรยาย', 'ปฏิบัติ', 'บรรยายและปฏิบัติ', 'อื่นๆ'];

export default function CategoryTeachingHeatmap({ data }: Props) {
  if (!data || data.length === 0) return <div className="text-gray-500 p-4">ไม่มีข้อมูล Heatmap</div>;

  const categories = Array.from(new Set(data.map((d) => d.category)));
  const byKey = new Map<string, Row>();
  data.forEach((d) => byKey.set(`${d.category}|${d.mode}`, d));

  // Color scale (critical): <2 red → 2..3 yellow/amber → >=3 green
  // Smooth interpolation within segments for better perception
  const colorFor = (gpa: number | null) => {
    if (gpa == null) return '#F3F4F6';
    const v = Math.max(0, Math.min(4, gpa));
    if (v < 2) {
      // red (#ef4444) → amber (#f59e0b) from 0..2
      const t = v / 2; // 0..1
      const r = Math.round(0xef * (1 - t) + 0xf5 * t);
      const g = Math.round(0x44 * (1 - t) + 0x9e * t);
      const b = Math.round(0x44 * (1 - t) + 0x0b * t);
      return `rgb(${r}, ${g}, ${b})`;
    } else if (v < 3) {
      // amber (#f59e0b) → yellow-green (#a3e635) from 2..3
      const t = v - 2; // 0..1
      const r = Math.round(0xf5 * (1 - t) + 0xa3 * t);
      const g = Math.round(0x9e * (1 - t) + 0xe6 * t);
      const b = Math.round(0x0b * (1 - t) + 0x35 * t);
      return `rgb(${r}, ${g}, ${b})`;
    }
    // green scale >=3: yellow-green (#a3e635) → green (#22c55e) → teal (#14b8a6) by 3..4
    const t = v - 3; // 0..1
    const r = Math.round(0xa3 * (1 - t) + 0x22 * t);
    const g = Math.round(0xe6 * (1 - t) + 0xc5 * t);
    const b = Math.round(0x35 * (1 - t) + 0x5e * t);
    return `rgb(${r}, ${g}, ${b})`;
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-[720px] w-full border-collapse">
        <thead>
          <tr>
            <th className="sticky left-0 bg-white z-10 border p-2 text-left">หมวดวิชา</th>
            {MODES.map((m) => (
              <th key={m} className="border p-2 text-sm font-medium text-gray-700">{m}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {categories.map((cat) => (
            <tr key={cat}>
              <td className="sticky left-0 bg-white z-10 border p-2 text-sm text-gray-800">{cat}</td>
              {MODES.map((m) => {
                const row = byKey.get(`${cat}|${m}`);
                const gpa = row?.avgGpa ?? null;
                return (
                  <td key={m} className="border p-0">
                    <div className="h-10 flex items-center justify-center text-xs font-medium" style={{ backgroundColor: colorFor(gpa), color: gpa != null && gpa < 2 ? '#fff' : '#111827' }} title={gpa != null ? `GPA ${gpa.toFixed(2)} (${row?.studentCount ?? 0})` : 'ไม่มีข้อมูล'}>
                      {gpa != null ? gpa.toFixed(2) : '-'}
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-3 text-xs text-gray-600 flex items-center gap-3">
        <span>Critical scale:</span>
        <div className="flex items-center gap-1">
          <span className="w-6 h-3 inline-block" style={{ background: '#ef4444' }} />
          <span className="w-6 h-3 inline-block" style={{ background: '#f59e0b' }} />
          <span className="w-6 h-3 inline-block" style={{ background: '#a3e635' }} />
          <span className="w-6 h-3 inline-block" style={{ background: '#22c55e' }} />
        </div>
        <span className="ml-1">แดง &lt; 2 • เหลือง 2–3 • เขียว ≥ 3</span>
      </div>
    </div>
  );
}


