'use client';

import React, { useState, useRef } from 'react';

type Box = { min: number; q1: number; median: number; q3: number; max: number };

interface Props {
  data: Array<{ category: string; W: Box; F: Box }>; // already in %
}

// Simple SVG boxplot (dynamic y-scale)
export default function WFBoxPlot({ data }: Props) {
  const [hoveredBox, setHoveredBox] = useState<{ category: string; type: 'W' | 'F'; x: number; y: number; yBottom: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  if (!data || data.length === 0) return <div className="text-gray-500">ไม่มีข้อมูล</div>;

  const allValues: number[] = [];
  for (const d of data) {
    allValues.push(d.W.min, d.W.max, d.F.min, d.F.max);
  }
  const minY = Math.floor(Math.min(...allValues));
  const maxY = Math.ceil(Math.max(...allValues));

  const height = 360;
  const margin = { top: 20, right: 20, bottom: 120, left: 50 }; // Increased bottom margin for horizontal labels
  const perCategoryWidth = 170; // a bit wider for two boxes (W/F)
  const innerW = perCategoryWidth * data.length;
  const width = margin.left + innerW + margin.right;
  const innerH = height - margin.top - margin.bottom;

  const xStep = innerW / data.length;
  const yScale = (v: number) => {
    if (maxY === minY) return margin.top + innerH / 2;
    return margin.top + innerH - ((v - minY) / (maxY - minY)) * innerH;
  };

  const BoxPlot = ({ 
    x, 
    box, 
    color, 
    category, 
    type 
  }: { 
    x: number; 
    box: Box; 
    color: string;
    category: string;
    type: 'W' | 'F';
  }) => {
    const boxTop = yScale(box.q3);
    const boxBottom = yScale(box.q1);
    const boxHeight = Math.abs(boxBottom - boxTop);
    const boxWidth = 30;
    const whiskerWidth = 8; // width of whisker caps
    
    // Calculate positions
    const medianY = yScale(box.median);
    const minY_pos = yScale(box.min);
    const maxY_pos = yScale(box.max);
    
    return (
      <g>
        {/* Whisker line - bottom */}
        <line 
          x1={x} 
          x2={x} 
          y1={boxBottom} 
          y2={minY_pos} 
          stroke={color} 
          strokeWidth={2} 
        />
        {/* Whisker line - top */}
        <line 
          x1={x} 
          x2={x} 
          y1={boxTop} 
          y2={maxY_pos} 
          stroke={color} 
          strokeWidth={2} 
        />
        {/* Whisker caps - bottom */}
        <line 
          x1={x - whiskerWidth / 2} 
          x2={x + whiskerWidth / 2} 
          y1={minY_pos} 
          y2={minY_pos} 
          stroke={color} 
          strokeWidth={2} 
        />
        {/* Whisker caps - top */}
        <line 
          x1={x - whiskerWidth / 2} 
          x2={x + whiskerWidth / 2} 
          y1={maxY_pos} 
          y2={maxY_pos} 
          stroke={color} 
          strokeWidth={2} 
        />
        {/* Box */}
        <rect 
          x={x - boxWidth / 2} 
          y={boxTop} 
          width={boxWidth} 
          height={boxHeight || 1} 
          fill={hoveredBox?.category === category && hoveredBox?.type === type ? color : `${color}33`} 
          stroke={color} 
          strokeWidth={hoveredBox?.category === category && hoveredBox?.type === type ? 2.5 : 1.5}
          style={{ cursor: 'pointer', transition: 'all 0.2s' }}
          onMouseEnter={(e) => {
            if (!containerRef.current) return;
            const rect = e.currentTarget.getBoundingClientRect();
            const containerRect = containerRef.current.getBoundingClientRect();
            setHoveredBox({
              category,
              type,
              x: rect.left - containerRect.left + rect.width / 2,
              y: rect.top - containerRect.top,
              yBottom: rect.bottom - containerRect.top,
            });
          }}
          onMouseLeave={() => setHoveredBox(null)}
        />
        {/* Median line */}
        <line 
          x1={x - boxWidth / 2} 
          x2={x + boxWidth / 2} 
          y1={medianY} 
          y2={medianY} 
          stroke={color} 
          strokeWidth={2.5} 
        />
      </g>
    );
  };

  // Wrap labels to avoid overlap (increased maxChars for horizontal labels)
  const wrapLabel = (label: string, maxChars = 24, maxLines = 3): string[] => {
    const words = String(label).split(/\s+/).filter(Boolean);
    const lines: string[] = [];
    let current = '';
    for (const w of words) {
      const tentative = current ? current + ' ' + w : w;
      if (tentative.length <= maxChars) {
        current = tentative;
      } else {
        if (current) lines.push(current);
        current = w;
      }
      if (lines.length >= maxLines) break;
    }
    if (lines.length < maxLines && current) lines.push(current);
    if (lines.length === 0) lines.push(String(label));
    return lines.slice(0, maxLines);
  };

  return (
    <div ref={containerRef} className="w-full h-full overflow-x-auto relative">
    <svg viewBox={`0 0 ${width} ${height}`} style={{ width, height }}>
      {/* Legend */}
      <g>
        <rect x={width - margin.right - 80} y={margin.top} width={70} height={35} fill="white" stroke="#ddd" strokeWidth={1} rx={4} />
        <rect x={width - margin.right - 75} y={margin.top + 8} width={12} height={12} fill="#FFCE5633" stroke="#FFCE56" strokeWidth={1.5} />
        <text x={width - margin.right - 58} y={margin.top + 17} textAnchor="start" className="fill-gray-700 text-[10px]">W</text>
        <rect x={width - margin.right - 75} y={margin.top + 22} width={12} height={12} fill="#FF638433" stroke="#FF6384" strokeWidth={1.5} />
        <text x={width - margin.right - 58} y={margin.top + 31} textAnchor="start" className="fill-gray-700 text-[10px]">F</text>
      </g>

      {/* y axis ticks */}
      {Array.from({ length: 5 }).map((_, i) => {
        const v = minY + ((maxY - minY) * i) / 4;
        const y = yScale(v);
        return (
          <g key={i}>
            <line x1={margin.left} x2={width - margin.right} y1={y} y2={y} stroke="#eee" />
            <text x={margin.left - 10} y={y + 4} textAnchor="end" className="fill-gray-500 text-xs">{v.toFixed(0)}%</text>
          </g>
        );
      })}

      {data.map((d, i) => {
        const cx = margin.left + xStep * i + xStep / 2;
        return (
          <g key={d.category}>
            {/* W (yellow) left */}
            <BoxPlot x={cx - 20} box={d.W} color="#FFCE56" category={d.category} type="W" />
            {/* F (red) right */}
            <BoxPlot x={cx + 20} box={d.F} color="#FF6384" category={d.category} type="F" />
            <text
              x={cx}
              y={height - 20}
              textAnchor="middle"
              className="fill-gray-700 text-[10px]"
            >
              <title>{d.category}</title>
              {wrapLabel(d.category).map((line, idx) => (
                <tspan key={idx} x={cx} dy={idx === 0 ? 0 : 13}>{line}</tspan>
              ))}
            </text>
          </g>
        );
      })}
    </svg>
    
    {/* Tooltip */}
    {hoveredBox && (() => {
      const boxData = data.find(d => d.category === hoveredBox.category);
      if (!boxData) return null;
      const box = hoveredBox.type === 'W' ? boxData.W : boxData.F;
      const tooltipX = hoveredBox.x;
      // Check if there's enough space above (at least 150px for tooltip)
      const hasSpaceAbove = hoveredBox.y > 150;
      const tooltipY = hasSpaceAbove ? hoveredBox.y - 10 : hoveredBox.yBottom + 10;
      const transform = hasSpaceAbove ? 'translate(-50%, -100%)' : 'translate(-50%, 0)';
      
      return (
        <div
          className="absolute bg-white border border-gray-300 rounded-lg shadow-lg p-3 z-50 pointer-events-none"
          style={{
            left: `${tooltipX}px`,
            top: `${tooltipY}px`,
            transform: transform,
            minWidth: '180px',
          }}
        >
          <div className="text-xs font-semibold text-gray-800 mb-2">
            {hoveredBox.category} - {hoveredBox.type}
          </div>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-600">Min:</span>
              <span className="font-medium">{box.min.toFixed(2)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Q1:</span>
              <span className="font-medium">{box.q1.toFixed(2)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Median:</span>
              <span className="font-medium">{box.median.toFixed(2)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Q3:</span>
              <span className="font-medium">{box.q3.toFixed(2)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Max:</span>
              <span className="font-medium">{box.max.toFixed(2)}%</span>
            </div>
          </div>
        </div>
      );
    })()}
    </div>
  );
}


