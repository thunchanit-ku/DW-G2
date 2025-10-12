'use client';
import 'chart.js/auto';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface DonutChartProps {
  percent: number;
  gpa?: number | null;
  creditEarned?: number | null;          
  totalCreditRequire?: number | null;    
}

export default function DonutChart({ percent, gpa, creditEarned, totalCreditRequire }: DonutChartProps) {
  // ✅ ป้องกันค่าเกินหรือติดลบ
  const safePercent = Math.max(0, Math.min(percent, 100));

  // ✅ ฟังก์ชันเลือกสีตามเปอร์เซ็นต์ความคืบหน้า
  const getColorByPercent = (percent: number) => {
    if (percent < 50) return 'rgba(255, 99, 99, 0.8)';       // 🔴 แดง (น้อย)
    if (percent <= 99) return 'rgba(255, 206, 86, 0.8)';      // 🟡 เหลือง (กลาง)
    return 'rgba(75, 192, 106, 0.8)';                        // 🟢 เขียว (มาก)
  };

  const data = {
    datasets: [
      {
        data: [safePercent, 100 - safePercent],
        backgroundColor: [getColorByPercent(safePercent), 'rgba(220, 220, 220, 0.3)'],
        borderWidth: 0,
      },
    ],
  };

  const options: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: true,
    cutout: '70%',
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
    },
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div className="relative w-full max-w-[120px] mx-auto">
        <Doughnut data={data} options={options} />
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          
          {/* ✅ แสดง CreditEarned / TotalCreditRequire เด่นกว่า */}
          {creditEarned != null && totalCreditRequire != null && (
            <div className="text-base md:text-lg font-bold text-gray-900">
              {creditEarned}/{totalCreditRequire}
            </div>
          )}

          {/* ✅ แสดงเปอร์เซ็นต์ (เล็กกว่า) */}
          <div className="text-xs text-gray-700 mt-1">
            {safePercent.toFixed(0)}%
          </div>

          {/* ✅ GPA (แสดงเฉพาะเมื่อมีค่า) */}
          {gpa != null && !isNaN(gpa) && (
            <div className="text-xs text-gray-500 mt-1">
              GPA {gpa.toFixed(2)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
