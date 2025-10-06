'use client';

import { Card } from 'antd';
import { Home, User, FileText, Calculator, RefreshCw } from 'lucide-react';
import Link from 'next/link';

const navCards = [
  {
    title: 'HOME',
    subtitle: 'หน้าหลัก',
    icon: <Home className="w-10 h-10" />,
    href: '/dashboard/home',
    borderColor: 'border-l-4 border-blue-500',
    textColor: 'text-blue-500',
  },
  {
    title: 'INFORMATION',
    subtitle: 'ข้อมูลส่วนตัว',
    icon: <User className="w-10 h-10" />,
    href: '/dashboard/info',
    borderColor: 'border-l-4 border-green-500',
    textColor: 'text-green-500',
  },
  {
    title: 'ACADEMIC RESULTS',
    subtitle: 'ผลการเรียน',
    icon: <FileText className="w-10 h-10" />,
    href: '/dashboard/report',
    borderColor: 'border-l-4 border-cyan-500',
    textColor: 'text-cyan-500',
  },
  {
    title: 'CALCULATE ACADEMIC RESULTS',
    subtitle: 'คำนวณผลการเรียน',
    icon: <Calculator className="w-10 h-10" />,
    href: '/dashboard/formGPA',
    borderColor: 'border-l-4 border-yellow-500',
    textColor: 'text-yellow-500',
  },
  {
    title: 'UPDATE GRADES',
    subtitle: 'อัปเดตผลการเรียน',
    icon: <RefreshCw className="w-10 h-10" />,
    href: '/dashboard/update-grades',
    borderColor: 'border-l-4 border-purple-500',
    textColor: 'text-purple-500',
  },
];

export default function DashboardNavCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
      {navCards.map((card, index) => (
        <Link key={index} href={card.href}>
          <Card
            hoverable
            className={`h-full shadow-md ${card.borderColor}`}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className={`text-xs font-bold uppercase mb-1 ${card.textColor}`}>
                  {card.title}
                </div>
                <div className="text-base font-bold text-gray-800">
                  {card.subtitle}
                </div>
              </div>
              <div className="text-gray-300">
                {card.icon}
              </div>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  );
}

