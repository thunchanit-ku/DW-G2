'use client';

import React from 'react';

type Row = { category: string; mode: string; avgGpa: number | null; studentCount: number };

interface Props {
  data: Row[];
}

const MODES = ['ภาคบรรยาย', 'ปฏิบัติ', 'บรรยายและปฏิบัติ', 'อื่นๆ'];

const TEXT_COLOR_DARK = '#111827'; 
const TEXT_COLOR_LIGHT = '#fff';

export default function CategoryTeachingHeatmap({ data }: Props) {
  if (!data || data.length === 0) return <div className="text-gray-500 p-4">ไม่มีข้อมูล Heatmap</div>;

  const categories = Array.from(new Set(data.map((d) => d.category)));
  const byKey = new Map<string, Row>();
  data.forEach((d) => byKey.set(`${d.category}|${d.mode}`, d));

  // Color scale function (เหมือนเดิม)
  const colorFor = (gpa: number | null) => {
    if (gpa == null) return '#F3F4F6';
    const v = Math.max(0, Math.min(4, gpa));
    
    if (v < 2) {
      const t = v / 2;
      const r = Math.round(0xef * (1 - t) + 0xf5 * t);
      const g = Math.round(0x44 * (1 - t) + 0x9e * t);
      const b = Math.round(0x44 * (1 - t) + 0x0b * t);
      return `rgb(${r}, ${g}, ${b})`;
    } else if (v < 3) {
      const t = v - 2;
      const r = Math.round(0xf5 * (1 - t) + 0xa3 * t);
      const g = Math.round(0x9e * (1 - t) + 0xe6 * t);
      const b = Math.round(0x0b * (1 - t) + 0x35 * t);
      return `rgb(${r}, ${g}, ${b})`;
    } else {
      const t = v - 3;
      const r = Math.round(0xa3 * (1 - t) + 0x22 * t);
      const g = Math.round(0xe6 * (1 - t) + 0xc5 * t);
      const b = Math.round(0x35 * (1 - t) + 0x5e * t);
      return `rgb(${r}, ${g}, ${b})`;
    }
  };
  
  const MAX_BODY_HEIGHT = '380px'; 
  const CATEGORY_COLUMN_WIDTH = '180px'; // 🚨 เพิ่มความกว้างของคอลัมน์หมวดวิชาให้รองรับข้อความยาว
  const MODE_COLUMN_WIDTH = '120px';     // 🚨 กำหนดความกว้างมาตรฐานให้คอลัมน์ข้อมูล

  return (
    <div className="w-full relative"> 
      
      {/* 🚨 Container สำหรับ Header: ปล่อยให้ความกว้าง 100% */}
      <table className="min-w-full border-collapse w-full"> 
        <thead>
          <tr>
            {/* Header: Sticky Column */}
            <th className="sticky left-0 bg-white z-20 border-b border-r p-2 text-left font-semibold text-gray-800" style={{ width: CATEGORY_COLUMN_WIDTH, minWidth: CATEGORY_COLUMN_WIDTH }}>
              หมวดวิชา
            </th>
            {/* Header: Mode Columns */}
            {MODES.map((m) => (
              <th key={m} className="border-b border-r p-2 text-sm font-semibold text-gray-700" style={{ width: MODE_COLUMN_WIDTH, minWidth: MODE_COLUMN_WIDTH }}>{m}</th>
            ))}
            {/* 💡 TH ช่องว่างเพื่อจองพื้นที่ Scrollbar Gutter (ขนาดมาตรฐาน 12px) */}
            <th className="border-b bg-white p-0" style={{ width: '12px', minWidth: '12px' }}></th> 
          </tr>
        </thead>
      </table>

      {/* 🚨 Container สำหรับ Body: มี Scroll ในแนวดิ่ง */}
      <div 
        className="w-full overflow-y-scroll" 
        style={{ maxHeight: MAX_BODY_HEIGHT }}
      >
        <table className="min-w-full border-collapse w-full"> 
          <tbody>
            {categories.map((cat) => {
                const isLastRow = cat === categories[categories.length - 1];
                return (
                    <tr key={cat}>
                        {/* Body: Sticky Column (ใช้ความกว้างเดียวกับ Header) */}
                        <td className={`sticky left-0 bg-white z-10 border-r p-2 text-sm text-gray-800 font-medium ${!isLastRow ? 'border-b' : ''}`} style={{ width: CATEGORY_COLUMN_WIDTH, minWidth: CATEGORY_COLUMN_WIDTH }}>
                            {cat}
                        </td>
                        {/* Body: Data Cells (ใช้ความกว้างเดียวกับ Header) */}
                        {MODES.map((m) => {
                            const row = byKey.get(`${cat}|${m}`);
                            const gpa = row?.avgGpa ?? null;
                            const color = colorFor(gpa);
                            const textColor = gpa != null && gpa < 2 ? TEXT_COLOR_LIGHT : TEXT_COLOR_DARK;
                            
                            return (
                                <td key={m} className={`border-r p-0 ${!isLastRow ? 'border-b' : ''}`} style={{ width: MODE_COLUMN_WIDTH, minWidth: MODE_COLUMN_WIDTH }}>
                                    <div 
                                        className="h-10 flex items-center justify-center text-xs font-semibold transition-colors duration-300" 
                                        style={{ backgroundColor: color, color: textColor }} 
                                        title={gpa != null ? `GPA ${gpa.toFixed(2)} (N=${row?.studentCount ?? 0})` : 'ไม่มีข้อมูล'}
                                    >
                                        {gpa != null ? gpa.toFixed(2) : '-'}
                                    </div>
                                </td>
                            );
                        })}
                    </tr>
                );
            })}
          </tbody>
        </table>
      </div>

      {/* Color Scale Legend (เหมือนเดิม) */}
      <div className="mt-4 text-xs text-gray-600 flex items-center gap-3">
        <span>Critical scale:</span>
        <div className="flex items-center gap-1">
          <span className="w-6 h-3 inline-block bg-red-500" style={{ background: '#ef4444' }} />
          <span className="w-6 h-3 inline-block bg-amber-500" style={{ background: '#f59e0b' }} />
          <span className="w-6 h-3 inline-block bg-lime-400" style={{ background: '#a3e635' }} />
          <span className="w-6 h-3 inline-block bg-green-600" style={{ background: '#22c55e' }} />
        </div>
        <span className="ml-1">แดง &lt; 2 • เหลือง 2–3 • เขียว ≥ 3</span>
      </div>
    </div>
  );
}