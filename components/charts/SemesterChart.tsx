'use client';

import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface SemesterChartProps {
  labels: string[];
  semesterGPAs: number[];
  cumulativeGPAs: number[];
}

export default function SemesterChart({ labels, semesterGPAs, cumulativeGPAs }: SemesterChartProps) {
  // กำหนดสีตาม GPA
  const getBarColor = (gpa: number) => {
    if (gpa >= 0 && gpa <= 1.74) return '#ff6962';
    if (gpa >= 1.75 && gpa <= 1.99) return '#f57b39';
    if (gpa >= 2.0 && gpa <= 3.24) return '#99cc99';
    return '#86d3f7';
  };

  const backgroundColors = semesterGPAs.map(gpa => getBarColor(gpa));

  const data = {
    labels,
    datasets: [
      {
        type: 'line' as const,
        label: 'GPA สะสม',
        data: cumulativeGPAs,
        borderColor: '#006bc9',
        backgroundColor: '#006bc9',
        tension: 0,
        fill: false,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        type: 'bar' as const,
        label: 'GPA ภาคเรียน',
        data: semesterGPAs,
        backgroundColor: backgroundColors,
        borderWidth: 0,
      },
    ],
  };

  const options: ChartOptions<'bar' | 'line'> = {
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
            return context.dataset.label + ': ' + context.parsed.y.toFixed(2);
          }
        }
      }
    },
  };

  return <Bar data={data} options={options} />;
}

