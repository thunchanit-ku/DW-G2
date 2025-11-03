'use client';

import { Slider } from 'antd';

export default function YearRangeSlider({
  label = 'ช่วงปีการศึกษา',
  value,
  min,
  max,
  onChange,
}: {
  label?: string;
  value: [number, number];
  min: number;
  max: number;
  onChange: (v: [number, number]) => void;
}) {
  const mid = Math.min(min + 6, max);
  const marks: Record<number, string> = { [min]: `${min}`, [mid]: `${mid}`, [max]: `${max}` };
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        <span className="text-md font-bold text-indigo-600 bg-indigo-50 px-4 py-1 rounded-full border border-indigo-200">
          {value[0]} - {value[1]}
        </span>
      </div>
      <Slider
        range
        min={min}
        max={max}
        marks={marks}
        value={value}
        onChange={(v) => {
          if (Array.isArray(v) && v.length === 2) {
            const nextStart = Math.max(min, Math.min(v[0] as number, max));
            const nextEnd = Math.max(nextStart, Math.min(v[1] as number, max));
            onChange([nextStart, nextEnd]);
          }
        }}
        tooltip={{ formatter: (v) => `${v}` }}
        className="pt-4"
      />
    </div>
  );
}
