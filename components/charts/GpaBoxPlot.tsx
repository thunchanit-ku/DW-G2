'use client';

import React from 'react';

// กำหนดสีหลักที่ใช้ใน chart
const CHART_COLOR_PRIMARY = '#1F46A9'; // Deep Navy Blue
const CHART_COLOR_LIGHT = '#E0F2FE'; // Light Blue for Box Fill
const GRID_COLOR = '#E5E7EB'; // Light Gray for gridlines
const TEXT_COLOR = '#4B5563'; // Dark Gray for labels

type Box = { min: number; q1: number; median: number; q3: number; max: number };

interface Props {
  data: Array<{ category: string; GPA: Box }>;
}

export default function GpaBoxPlot({ data }: Props) {
  if (!data || data.length === 0) return <div className="text-gray-500 p-4">ไม่มีข้อมูลสำหรับการแสดง Box Plot</div>;

  // ====================== SCALING LOGIC ======================
  // y-scale for GPA 0..4 (auto-fit to observed min/max but clamp to [0,4])
  const allValues: number[] = [];
  for (const d of data) {
    allValues.push(d.GPA.min, d.GPA.max);
  }
  const observedMin = Math.min(...allValues);
  const observedMax = Math.max(...allValues);
  // Clamp Y-axis to standard 0-4 range, ensuring observed data is fully visible.
  const minY = 0; // Fixed start at 0
  const maxY = 4; // Fixed end at 4

  const height = 400; // เพิ่มความสูงเล็กน้อย
  const margin = { top: 20, right: 30, bottom: 120, left: 60 }; // เพิ่ม Margin ด้านซ้ายและล่าง
  const perCategoryWidth = 180; // เพิ่มความกว้างต่อ Category
  const innerW = perCategoryWidth * data.length;
  const width = margin.left + innerW + margin.right;
  const innerH = height - margin.top - margin.bottom;

  const xStep = innerW / data.length;
  const yScale = (v: number) => {
    const clamped = Math.max(minY, Math.min(maxY, v));
    if (maxY === minY) return margin.top + innerH / 2;
    return margin.top + innerH - ((clamped - minY) / (maxY - minY)) * innerH;
  };
  
  // ====================== COMPONENTS ======================
  const Tooltip = ({ x, y, value }: { x: number; y: number; value: number }) => (
    <text
        x={x}
        y={y}
        textAnchor="middle"
        className="text-[10px] fill-current font-semibold"
        style={{ fill: CHART_COLOR_PRIMARY }}
        dy={value >= 3.5 ? 10 : -5} // ตำแหน่ง tooltip ขึ้นอยู่กับค่า
    >
        {value.toFixed(2)}
    </text>
  );

  const BoxPlot = ({ x, box, color }: { x: number; box: Box; color: string }) => {
    const q1Y = yScale(box.q1);
    const q3Y = yScale(box.q3);
    const minY = yScale(box.min);
    const maxY = yScale(box.max);
    const medianY = yScale(box.median);

    return (
      <g className="transition-opacity duration-300 hover:opacity-90">
        {/* Whiskers (Min to Max) */}
        <line x1={x} x2={x} y1={minY} y2={maxY} stroke={color} strokeWidth={1} strokeDasharray="2 2" />

        {/* Box (IQR) */}
        <rect 
            x={x - 18} 
            y={Math.min(q3Y, q1Y)} 
            width={36} 
            height={Math.abs(q3Y - q1Y)} 
            fill={CHART_COLOR_LIGHT} 
            stroke={color} 
            strokeWidth={1.5} 
            rx={2} // เพิ่มขอบมน
        />
        
        {/* Median Line */}
        <line x1={x - 18} x2={x + 18} y1={medianY} y2={medianY} stroke={color} strokeWidth={3} />
        
        {/* Whiskers End Caps */}
        <line x1={x - 8} x2={x + 8} y1={minY} y2={minY} stroke={color} strokeWidth={1.5} />
        <line x1={x - 8} x2={x + 8} y1={maxY} y2={maxY} stroke={color} strokeWidth={1.5} />
        
        {/* Tooltips for Key Quartiles (Optional - for high-density charts, these might be hidden) */}
        {/* <Tooltip x={x} y={medianY} value={box.median} /> */}
        <title>{`Min: ${box.min.toFixed(2)}, Q1: ${box.q1.toFixed(2)}, Median: ${box.median.toFixed(2)}, Q3: ${box.q3.toFixed(2)}, Max: ${box.max.toFixed(2)}`}</title>
      </g>
    );
  };

  // Wrap long labels into multiple lines to reduce overlap
  const wrapLabel = (label: string, maxChars = 14, maxLines = 3): string[] => {
    const words = String(label).split(/\s+/).filter(Boolean);
    const lines: string[] = [];
    let current = '';
    for (const w of words) {
        const tentative = current ? current + ' ' + w : w;
        if (tentative.length <= maxChars && lines.length < maxLines) {
            current = tentative;
        } else {
            if (current) lines.push(current);
            current = w;
        }
        if (lines.length >= maxLines) break;
    }
    if (lines.length < maxLines && current) lines.push(current);
    if (lines.length === 0 && String(label).length > 0) lines.push(String(label));
    return lines.slice(0, maxLines);
  };

  // ====================== RENDER ======================
  return (
    <div className="w-full h-full overflow-x-auto overflow-y-hidden rounded-lg border border-gray-200">
    <svg 
        viewBox={`0 0 ${width} ${height}`} 
        style={{ width, height, minWidth: width }}
        className="bg-white"
    >
      {/* Y-Axis Gridlines and Labels (GPA Scale) */}
      {Array.from({ length: 5 }).map((_, i) => {
        const v = minY + ((maxY - minY) * i) / 4; // 0.0, 1.0, 2.0, 3.0, 4.0
        const y = yScale(v);
        return (
          <g key={i}>
            {/* Gridline */}
            <line x1={margin.left} x2={width - margin.right} y1={y} y2={y} stroke={GRID_COLOR} strokeWidth={1} />
            
            {/* Label */}
            <text x={margin.left - 15} y={y + 3} textAnchor="end" className="text-xs font-medium" style={{ fill: TEXT_COLOR }}>{v.toFixed(1)}</text>
          </g>
        );
      })}
      
      {/* X-Axis Line (Bottom) */}
      <line x1={margin.left} x2={width - margin.right} y1={margin.top + innerH} y2={margin.top + innerH} stroke={TEXT_COLOR} strokeWidth={1} />

      {/* Data Points (Box Plots) and X-Axis Labels */}
      {data.map((d, i) => {
        const cx = margin.left + xStep * i + xStep / 2;
        
        return (
          <g key={d.category} className="cursor-pointer">
            {/* Box Plot Rendering */}
            <BoxPlot x={cx} box={d.GPA} color={CHART_COLOR_PRIMARY} />
            
            {/* X-Axis Category Label */}
            <text
              x={cx}
              y={height - 20} // กำหนดตำแหน่งที่ใกล้ขอบล่าง
              textAnchor="middle"
              className="fill-gray-700 text-[10px] font-medium"
              style={{ fill: TEXT_COLOR }}
            >
              {wrapLabel(d.category).map((line, idx) => (
                <tspan 
                    key={idx} 
                    x={cx} 
                    dy={idx === 0 ? 0 : 12} // กำหนดระยะห่างบรรทัด
                >
                    {line}
                </tspan>
              ))}
              <title>{d.category}</title>
            </text>
          </g>
        );
      })}
    </svg>
    </div>
  );
}