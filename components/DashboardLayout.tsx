'use client';

import { Layout, Avatar, Dropdown, Space } from 'antd';
import { LogOut, User } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const { Header, Content } = Layout;

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const userMenuItems = [
    {
      key: 'logout',
      label: 'Logout',
      icon: <LogOut className="w-4 h-4" />,
      onClick: () => {
        console.log('Logout clicked');
      },
    },
  ];

  return (
    <Layout className="min-h-screen">
      <Header className="bg-white shadow-md px-6 h-auto py-4">
        <div className="flex justify-between items-center">
          <Link href="/dashboard">
            <div className="cursor-pointer">
              <div className="text-xl font-bold text-green-600">
                มหาวิทยาลัยเกษตรศาสตร์
              </div>
            </div>
          </Link>

          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
            <Space className="cursor-pointer hover:bg-gray-50 px-3 py-2 rounded-lg transition">
              <span className="hidden md:inline">ภัทรพร ปัญญาอุดมพร</span>
              <Avatar
                icon={<User />}
                className="bg-blue-500"
              />
            </Space>
          </Dropdown>
        </div>
      </Header>

      <Content className="bg-gray-50">
        {children}
      </Content>
    </Layout>
  );
}

