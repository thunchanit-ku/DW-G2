'use client';

import { Select } from 'antd';

type Option = { label: string; value: number };

type Size = 'large' | 'middle' | 'small';

export default function SelectField({
  id,
  label,
  placeholder,
  options,
  value,
  onChange,
  size = 'large',
  className,
}: {
  id: string;
  label: string;
  placeholder?: string;
  options: Option[];
  value?: number;
  onChange: (v: number | undefined) => void;
  size?: Size;
  className?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <Select
        id={id}
        className={`w-full ${className ?? ''}`}
        placeholder={placeholder}
        options={options}
        value={value}
        onChange={onChange}
        allowClear
        size={size}
      />
    </div>
  );
}
