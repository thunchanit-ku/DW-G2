// components/CreditDonutCharts.jsx
import React from 'react';

// Assuming Card and DonutChart are custom components
// Adjust import paths as necessary
import { Card } from 'antd'; 
import DonutChart from '@/components/charts/DonutChart';

const CreditDonutCharts = () => {
  return (
     <Card title="รายงานหน่วยกิตที่ลงทะเบียนแบ่งตามหมวดวิชา (%)" className="shadow-md">

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">

            {[

              { name: 'หมวดวิชาศึกษาทั่วไป', percent: 100, gpa: 3.12 },

              { name: 'หมวดวิชาเสรี', percent: 80, gpa: 3.45 },

              { name: 'หมวดวิชาเฉพาะบังคับ', percent: 90, gpa: 3.00 },

              { name: 'หมวดวิชาเฉพาะเลือก', percent: 90, gpa: 1.25 },

              { name: 'หมวดวิชาเสรี', percent: 100, gpa: 3.40 },

            ].map((item, index) => (

              <Card key={index} className="text-center flex flex-col">

                <p className="text-xs mb-2">

                  หน่วยกิตการเรียน<br />

                  <span className="text-blue-800 font-medium">{item.name}</span>

                </p>

                <div className="flex-1 flex items-center justify-center py-2">

                  <div className="w-full h-32">

                    <DonutChart percent={item.percent} gpa={item.gpa} />

                  </div>

                </div>

              </Card>

            ))}

          </div>

        </Card>
  );
};

export default CreditDonutCharts;