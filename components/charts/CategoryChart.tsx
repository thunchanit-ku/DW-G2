'use client';

import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface CategoryChartProps {
  labels: string[];
  gpas: number[];
}

export default function CategoryChart({ labels, gpas }: CategoryChartProps) {
  // กำหนดสีตาม GPA
  const getBarColor = (gpa: number) => {
    if (gpa >= 0 && gpa <= 1.74) return 'rgba(255, 105, 98, 0.8)';
    if (gpa >= 1.75 && gpa <= 1.99) return 'rgba(245, 123, 57, 0.8)';
    if (gpa >= 2.0 && gpa <= 3.24) return 'rgba(153, 204, 153, 0.8)';
    return 'rgba(134, 188, 247, 0.8)';
  };

  const backgroundColors = gpas.map(gpa => getBarColor(gpa));

  const data = {
    labels,
    datasets: [
      {
        data: gpas,
        backgroundColor: backgroundColors,
        borderWidth: 0,
      },
    ],
  };

  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: true,
    scales: {
      y: {
        beginAtZero: true,
        max: 4,
        min: 0,
        ticks: {
          stepSize: 1,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return 'GPA: ' + context.parsed.y.toFixed(2);
          }
        }
      }
    },
  };

  return <Bar data={data} options={options} />;
}

