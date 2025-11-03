'use client';

import { ReactNode } from 'react';

export default function FilterCard({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100">
      {title ? (
        <h2 className="text-lg font-semibold text-gray-700 border-b pb-3 mb-4">{title}</h2>
      ) : null}
      {children}
    </div>
  );
}
