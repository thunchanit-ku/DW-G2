'use client';

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
  gpa: number;
}

export default function DonutChart({ percent, gpa }: DonutChartProps) {
  // กำหนดสีตาม GPA
  const getColor = (gpa: number) => {
    if (gpa >= 0 && gpa <= 1.74) return 'rgba(255, 105, 98, 0.8)';
    if (gpa >= 1.75 && gpa <= 1.99) return 'rgba(245, 123, 57, 0.8)';
    if (gpa >= 2.0 && gpa <= 3.24) return 'rgba(153, 204, 153, 0.8)';
    return 'rgba(134, 188, 247, 0.8)';
  };

  const data = {
    datasets: [
      {
        data: [percent, 100 - percent],
        backgroundColor: [getColor(gpa), 'rgba(211, 211, 211, 0.3)'],
        borderWidth: 0,
      },
    ],
  };

  const options: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: true,
    cutout: '70%',
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
      },
    },
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div className="relative w-full max-w-[120px] mx-auto">
        <Doughnut data={data} options={options} />
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <div className="text-xl font-bold text-gray-800">{percent}%</div>
          <div className="text-lg font-bold text-gray-700">{gpa.toFixed(2)}</div>
        </div>
      </div>
    </div>
  );
}

