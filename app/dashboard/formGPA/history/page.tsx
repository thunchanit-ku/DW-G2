'use client';

import { Card, Table, Button } from 'antd';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import DashboardNavCards from '@/components/DashboardNavCards';

export default function CalGpaHistoryPage() {
  const router = useRouter();

  // ตารางผลการคำนวณ
  const calculationColumns = [
    {
      title: <p>รหัสวิชา</p>,
      dataIndex: 'courseCode',
      key: 'courseCode',
      align: 'center' as const,
    },
    {
      title: 'ชื่อวิชา',
      dataIndex: 'courseName',
      key: 'courseName',
      align: 'left' as const,
    },
    {
      title: 'ผลการเรียน',
      dataIndex: 'grade',
      key: 'grade',
      align: 'center' as const,
    },
    {
      title: 'หน่วยกิต',
      dataIndex: 'credits',
      key: 'credits',
      align: 'center' as const,
    },
  ];

  const calculationData = [
    {
      key: '1',
      courseCode: '01417167',
      courseName: 'Engineering Mathematics I',
      grade: 'C+',
      credits: '3',
    },
    {
      key: '2',
      courseCode: '01999111',
      courseName: 'Knowledge of the Land',
      grade: 'A',
      credits: '2',
    },
  ];

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6">
        {/* Navigation Cards */}
        <DashboardNavCards />

        <hr className="my-6" />

        {/* Header */}
        <div className="mb-4">
          <h4 className="text-black font-bold">เกรดเฉลี่ยสะสม: 3.38 หน่วยกิต: 132</h4>
        </div>

        <hr className="my-6" />

        {/* Summary Table */}
        <Card className="mb-6 shadow-md">
          <Table
            pagination={false}
            showHeader={true}
            bordered
            dataSource={[
              {
                key: '1',
                current: (
                  <>
                    <p className="text-black font-bold mb-2">ผลการเรียนเทอมปัจจุบัน</p>
                    <p className="text-black">
                      <span className="font-bold">GPA :</span>{' '}
                      <span className="font-normal">3.38</span>
                    </p>
                    <p className="text-black">
                      <span className="font-bold">หน่วยกิต :</span>{' '}
                      <span className="font-normal">132</span>
                    </p>
                  </>
                ),
                calculated: (
                  <>
                    <p className="text-black font-bold mb-2">ผลการเรียนจากการคำนวณ</p>
                    <p className="text-black">
                      <span className="font-bold">GPA :</span>{' '}
                      <span className="font-normal">3.40</span>
                    </p>
                    <p className="text-black">
                      <span className="font-bold">หน่วยกิต :</span>{' '}
                      <span className="font-normal">5</span>
                    </p>
                  </>
                ),
                expected: (
                  <>
                    <p className="text-black font-bold mb-2">ผลการเรียนที่คาดว่าจะได้</p>
                    <p className="text-black">
                      <span className="font-bold">GPA :</span>{' '}
                      <span className="font-normal">
                        3.39 <span className="text-green-600">[+0.01]</span>
                      </span>
                    </p>
                    <p className="text-black">
                      <span className="font-bold">หน่วยกิต :</span>{' '}
                      <span className="font-normal">
                        137 <span className="text-green-600">[+5]</span>
                      </span>
                    </p>
                  </>
                ),
              },
            ]}
            columns={[
              {
                title: 'ผลการเรียนเทอมปัจจุบัน',
                dataIndex: 'current',
                key: 'current',
              },
              {
                title: 'ผลการเรียนจากการคำนวณ',
                dataIndex: 'calculated',
                key: 'calculated',
              },
              {
                title: 'ผลการเรียนที่คาดว่าจะได้',
                dataIndex: 'expected',
                key: 'expected',
              },
            ]}
          />
        </Card>

        <hr className="my-6" />

        {/* Calculation Details */}
        <Card
          title={<h5 className="text-blue-600 font-bold">คำนวณผลการเรียนล่วงหน้า</h5>}
          className="shadow-md"
        >
          <Table
            columns={calculationColumns}
            dataSource={calculationData}
            pagination={false}
            size="small"
            bordered
          />
          <p className="text-red-600 mt-4">
            *วิชาที่สามารถ Regrade ได้ต้องเป็นรายวิชาที่ได้แต้มคะแนนต่ำกว่า 2.00 (ได้เกรดต่ำกว่า C)
          </p>
        </Card>

        {/* Back Button */}
        <div className="text-center mt-8">
          <Button
            type="primary"
            size="large"
            onClick={() => router.push('/dashboard/formGPA')}
          >
            ย้อนกลับ
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}

