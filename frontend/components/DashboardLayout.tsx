'use client';

import { Layout } from 'antd';
import Link from 'next/link';

const { Header, Content } = Layout;

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <Layout className="min-h-screen">
      <Header className="bg-white shadow-md px-6 h-auto py-4">
        <div className="flex justify-start items-center">
          <Link href="/dashboard">
            <div className="cursor-pointer">
              <div className="text-xl font-bold text-green-600">
                มหาวิทยาลัยเกษตรศาสตร์
              </div>
            </div>
          </Link>
        </div>
      </Header>

      <Content className="bg-gray-50">
        {children}
      </Content>
    </Layout>
  );
}

