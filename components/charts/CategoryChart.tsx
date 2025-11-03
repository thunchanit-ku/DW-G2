'use client';
import 'chart.js/auto';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartOptions,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

type Props = { labels: string[]; gpas: Array<number | null | undefined> };

export default function CategoryChart({ labels, gpas }: Props) {
  // กัน length ไม่เท่ากัน/ค่าไม่ใช่ number
  const safe = (n: any) => (typeof n === 'number' && isFinite(n) ? n : 0);
  const dataGpas = labels.map((_, i) => safe(gpas[i]));

  const getBarColor = (gpa: number) =>
    gpa <= 1.74 ? 'rgba(255,105,98,0.8)'
    : gpa <= 1.99 ? 'rgba(245,123,57,0.8)'
    : gpa <= 3.24 ? 'rgba(153,204,153,0.8)'
    : 'rgba(134,188,247,0.8)';

  const backgroundColors = dataGpas.map(getBarColor);

  const data = {
    labels,
    datasets: [{ data: dataGpas, backgroundColor: backgroundColors, borderWidth: 0 }],
  };

  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: true,
    scales: {
      y: { beginAtZero: true, min: 0, max: 4, ticks: { stepSize: 1 } },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => `GPA: ${safe(ctx.parsed?.y).toFixed(2)}`,
        },
      },
    },
  };

  // กันเคสไม่มีข้อมูล
  if (!labels?.length) return <div className="text-gray-500">ไม่มีข้อมูลกราฟ</div>;

  return <Bar data={data} options={options} />;
}
