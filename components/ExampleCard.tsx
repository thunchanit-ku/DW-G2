'use client';

import { Card } from 'antd';
import { LucideIcon } from 'lucide-react';

interface ExampleCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  onClick?: () => void;
}

export default function ExampleCard({ title, description, icon: Icon, onClick }: ExampleCardProps) {
  return (
    <Card 
      hoverable
      className="text-center h-full"
      onClick={onClick}
      title={
        <div className="flex items-center justify-center gap-2">
          <Icon className="w-5 h-5" />
          <span>{title}</span>
        </div>
      }
    >
      <p className="text-gray-600">{description}</p>
    </Card>
  );
}

