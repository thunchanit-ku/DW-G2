'use client';

import React from 'react';

type Box = { min: number; q1: number; median: number; q3: number; max: number };

interface Props {
  data: Array<{ category: string; W: Box; F: Box }>; // already in %
}

// Simple SVG boxplot (dynamic y-scale)
export default function WFBoxPlot({ data }: Props) {
  if (!data || data.length === 0) return <div className="text-gray-500">ไม่มีข้อมูล</div>;

  const allValues: number[] = [];
  for (const d of data) {
    allValues.push(d.W.min, d.W.max, d.F.min, d.F.max);
  }
  const minY = Math.floor(Math.min(...allValues));
  const maxY = Math.ceil(Math.max(...allValues));

  const width = 900;
  const height = 360;
  const margin = { top: 20, right: 20, bottom: 50, left: 50 };
  const innerW = width - margin.left - margin.right;
  const innerH = height - margin.top - margin.bottom;

  const xStep = innerW / data.length;
  const yScale = (v: number) => {
    if (maxY === minY) return margin.top + innerH / 2;
    return margin.top + innerH - ((v - minY) / (maxY - minY)) * innerH;
  };

  const BoxPlot = ({ x, box, color }: { x: number; box: Box; color: string }) => (
    <g>
      {/* whiskers */}
      <line x1={x} x2={x} y1={yScale(box.min)} y2={yScale(box.max)} stroke={color} strokeWidth={2} />
      {/* box */}
      <rect x={x - 15} y={Math.min(yScale(box.q3), yScale(box.q1))} width={30} height={Math.abs(yScale(box.q3) - yScale(box.q1))} fill={`${color}33`} stroke={color} />
      {/* median */}
      <line x1={x - 15} x2={x + 15} y1={yScale(box.median)} y2={yScale(box.median)} stroke={color} strokeWidth={2} />
    </g>
  );

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
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
            <BoxPlot x={cx - 20} box={d.W} color="#FFCE56" />
            {/* F (red) right */}
            <BoxPlot x={cx + 20} box={d.F} color="#FF6384" />
            <text x={cx} y={height - 10} textAnchor="middle" className="fill-gray-600 text-xs">{d.category}</text>
          </g>
        );
      })}
    </svg>
  );
}


