'use client';

import { Button, Card, Space, Spin } from 'antd';
import { Home, User, Settings } from 'lucide-react';
import LottieAnimation from '@/components/LottieAnimation';

export default function HomePage() {
  return (
    <main className="min-h-screen p-8 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            ยินดีต้อนรับสู่ DW-G2 Project
          </h1>
          <p className="text-xl text-gray-600">
            Next.js + Ant Design + Lucide Icons + Kanit Font
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card 
            hoverable
            className="text-center"
            title={
              <div className="flex items-center justify-center gap-2">
                <Home className="w-5 h-5" />
                <span>หน้าแรก</span>
              </div>
            }
          >
            <p className="text-gray-600">
              โครงสร้างโปรเจคพร้อมใช้งาน
            </p>
            <Button type="primary" className="mt-4">
              เริ่มต้น
            </Button>
          </Card>

          <Card 
            hoverable
            className="text-center"
            title={
              <div className="flex items-center justify-center gap-2">
                <User className="w-5 h-5" />
                <span>ผู้ใช้งาน</span>
              </div>
            }
          >
            <p className="text-gray-600">
              จัดการผู้ใช้งานระบบ
            </p>
            <Button type="default" className="mt-4">
              ดูรายละเอียด
            </Button>
          </Card>

          <Card 
            hoverable
            className="text-center"
            title={
              <div className="flex items-center justify-center gap-2">
                <Settings className="w-5 h-5" />
                <span>ตั้งค่า</span>
              </div>
            }
          >
            <p className="text-gray-600">
              ปรับแต่งการทำงาน
            </p>
            <Button type="dashed" className="mt-4">
              ตั้งค่า
            </Button>
          </Card>
        </div>

        <Card title="Loading Components" className="mb-6">
          <Space direction="vertical" className="w-full" size="large">
            <div>
              <h3 className="text-lg font-semibold mb-2">Ant Design Spin:</h3>
              <Space>
                <Spin size="small" />
                <Spin />
                <Spin size="large" />
              </Space>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">Lottie Animation:</h3>
              <LottieAnimation />
            </div>
          </Space>
        </Card>

        <Card title="เทคโนโลยีที่ใช้">
          <ul className="space-y-2 text-gray-700">
            <li>✅ <strong>Framework:</strong> Next.js 15 with App Router</li>
            <li>✅ <strong>UI Components:</strong> Ant Design</li>
            <li>✅ <strong>Icons:</strong> Lucide React (Recommended)</li>
            <li>✅ <strong>Loading:</strong> Ant Design Spin + LottieFiles</li>
            <li>✅ <strong>Font:</strong> Kanit (Google Fonts)</li>
            <li>✅ <strong>Styling:</strong> Tailwind CSS</li>
            <li>✅ <strong>TypeScript:</strong> Full type safety</li>
            <li>✅ <strong>Database:</strong> MySQL (Ready to configure)</li>
          </ul>
        </Card>
      </div>
    </main>
  );
}

