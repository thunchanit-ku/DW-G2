'use client';

import React from 'react';

type Row = { category: string; year: number; total: number; percentW: number; percentF: number };

interface Props {
  data: Row[];
  type: 'W' | 'F'; // 'W' for W percentage, 'F' for F percentage
}

const TEXT_COLOR_DARK = '#111827';
const TEXT_COLOR_LIGHT = '#fff';

export default function WFYearCategoryHeatmap({ data, type }: Props) {
  if (!data || data.length === 0) return <div className="text-gray-500 p-4">ไม่มีข้อมูล Heatmap</div>;

  const categories = Array.from(new Set(data.map((d) => d.category))).sort();
  const years = Array.from(new Set(data.map((d) => d.year))).sort((a, b) => a - b);
  const byKey = new Map<string, Row>();
  data.forEach((d) => byKey.set(`${d.category}|${d.year}`, d));
  
  // Backend ส่งปีมาเป็นพศ. แล้ว ไม่ต้องแปลงอีก

  // Get all percentage values for the selected type
  const allPercentages = data.map((d) => (type === 'W' ? d.percentW : d.percentF)).filter((v) => v > 0);
  const maxPercent = Math.max(...allPercentages, 0);
  const minPercent = Math.min(...allPercentages, 0);

  // Color scale function for percentage (0% = white/green, higher = darker red/orange)
  const colorFor = (percent: number | null) => {
    if (percent == null || percent === 0) return '#F3F4F6'; // Light gray for no data
    
    // Normalize to 0-1 range based on max
    const normalized = maxPercent > 0 ? Math.min(percent / maxPercent, 1) : 0;
    
    // Color scale: light green/yellow (low) -> orange -> red (high)
    if (normalized < 0.3) {
      // Light green to yellow
      const t = normalized / 0.3;
      const r = Math.round(0xf0 * (1 - t) + 0xff * t);
      const g = Math.round(0xff * (1 - t) + 0xf5 * t);
      const b = Math.round(0xf0 * (1 - t) + 0x9e * t);
      return `rgb(${r}, ${g}, ${b})`;
    } else if (normalized < 0.7) {
      // Yellow to orange
      const t = (normalized - 0.3) / 0.4;
      const r = Math.round(0xff * (1 - t) + 0xff * t);
      const g = Math.round(0xf5 * (1 - t) + 0xa5 * t);
      const b = Math.round(0x9e * (1 - t) + 0x00 * t);
      return `rgb(${r}, ${g}, ${b})`;
    } else {
      // Orange to red
      const t = (normalized - 0.7) / 0.3;
      const r = Math.round(0xff * (1 - t) + 0xdc * t);
      const g = Math.round(0xa5 * (1 - t) + 0x26 * t);
      const b = Math.round(0x00 * (1 - t) + 0x26 * t);
      return `rgb(${r}, ${g}, ${b})`;
    }
  };

  const MAX_BODY_HEIGHT = '380px';
  const YEAR_COLUMN_WIDTH = '80px';
  const CATEGORY_COLUMN_WIDTH = '180px';

  // Helper function to wrap long category names
  const wrapCategoryLabel = (label: string, maxChars = 20) => {
    const words = label.split(/\s+/);
    const lines: string[] = [];
    let current = '';
    for (const word of words) {
      const tentative = current ? current + ' ' + word : word;
      if (tentative.length <= maxChars) {
        current = tentative;
      } else {
        if (current) lines.push(current);
        current = word;
      }
      if (lines.length >= 2) break; // Max 2 lines
    }
    if (lines.length < 2 && current) lines.push(current);
    return lines.length > 0 ? lines : [label];
  };

  return (
    <div className="w-full relative overflow-hidden">
      {/* Scrollable container for both header and body */}
      <div className="w-full overflow-auto" style={{ maxHeight: MAX_BODY_HEIGHT }}>
        <table className="min-w-full border-collapse">
          {/* Header */}
          <thead className="sticky top-0 bg-white z-20" style={{ boxShadow: '0 2px 2px -1px rgba(0, 0, 0, 0.1)' }}>
            <tr>
              {/* Header: Sticky Column for Year */}
              <th className="sticky left-0 bg-white z-30 border-b border-r p-2 text-left font-semibold text-gray-800 shadow-sm" style={{ width: YEAR_COLUMN_WIDTH, minWidth: YEAR_COLUMN_WIDTH }}>
                ปี
              </th>
              {/* Header: Category Columns */}
              {categories.map((cat) => {
                const wrapped = wrapCategoryLabel(cat);
                return (
                  <th key={cat} className="border-b border-r p-1.5 text-xs font-semibold text-gray-700 align-top whitespace-normal" style={{ width: CATEGORY_COLUMN_WIDTH, minWidth: CATEGORY_COLUMN_WIDTH, maxWidth: CATEGORY_COLUMN_WIDTH, wordWrap: 'break-word', overflowWrap: 'break-word' }}>
                    <div className="leading-tight min-h-[40px] flex flex-col justify-start">
                      {wrapped.map((line, idx) => (
                        <div key={idx} className="break-words">{line}</div>
                      ))}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          {/* Body */}
          <tbody>
            {years.map((year) => {
              const isLastRow = year === years[years.length - 1];
              return (
                <tr key={year}>
                  {/* Body: Sticky Column for Year */}
                  <td className={`sticky left-0 bg-white z-10 border-r p-2 text-sm text-gray-800 font-medium ${!isLastRow ? 'border-b' : ''}`} style={{ width: YEAR_COLUMN_WIDTH, minWidth: YEAR_COLUMN_WIDTH }}>
                    {year}
                  </td>
                  {/* Body: Data Cells */}
                  {categories.map((cat) => {
                    const row = byKey.get(`${cat}|${year}`);
                    const percent = row ? (type === 'W' ? row.percentW : row.percentF) : null;
                    const color = colorFor(percent);
                    const textColor = percent != null && percent > (maxPercent * 0.7) ? TEXT_COLOR_LIGHT : TEXT_COLOR_DARK;
                    
                    return (
                      <td key={cat} className={`border-r p-0 ${!isLastRow ? 'border-b' : ''}`} style={{ width: CATEGORY_COLUMN_WIDTH, minWidth: CATEGORY_COLUMN_WIDTH }}>
                        <div
                          className="h-10 flex items-center justify-center text-xs font-semibold transition-colors duration-300"
                          style={{ backgroundColor: color, color: textColor }}
                          title={percent != null ? `${type}: ${percent.toFixed(2)}% (N=${row?.total ?? 0})` : 'ไม่มีข้อมูล'}
                        >
                          {percent != null ? `${percent.toFixed(1)}%` : '-'}
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

      {/* Color Scale Legend */}
      <div className="mt-4 text-xs text-gray-600 flex items-center gap-3">
        <span>สเกลสี (0% - {maxPercent.toFixed(1)}%):</span>
        <div className="flex items-center gap-1">
          <span className="w-6 h-3 inline-block bg-green-100" style={{ background: '#f0fff0' }} />
          <span className="w-6 h-3 inline-block bg-yellow-300" style={{ background: '#fff59e' }} />
          <span className="w-6 h-3 inline-block bg-orange-400" style={{ background: '#ffa500' }} />
          <span className="w-6 h-3 inline-block bg-red-600" style={{ background: '#dc2626' }} />
        </div>
        <span className="ml-1">ต่ำ → สูง</span>
      </div>
    </div>
  );
}

