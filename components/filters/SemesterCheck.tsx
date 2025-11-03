'use client';

import { Checkbox } from 'antd';

export type SemesterValue = 0 | 1 | 2;

type Option = { label: string; value: SemesterValue };

export default function SemesterCheck({
  label = 'ภาคการศึกษา',
  value,
  onChange,
  options = [
    { label: 'ภาคต้น', value: 1 },
    { label: 'ภาคปลาย', value: 2 },
    { label: 'ฤดูร้อน', value: 0 },
  ],
}: {
  label?: string;
  value: SemesterValue[];
  onChange: (v: SemesterValue[]) => void;
  options?: Option[];
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <Checkbox.Group
        options={options}
        value={value}
        onChange={(vals) => onChange(vals as SemesterValue[])}
      />
    </div>
  );
}
