"use client";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Chart } from "react-chartjs-2";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend
);

interface ApiChartRawItem {
  label: string;
  avgResponseTime: number;
}

export interface ApiRequestLogChartData {
  labels: string[];
  datasets: [
    {
      label: string;
      data: number[];
      backgroundColor: string | string[];
      yAxisID: string;
      barThickness: number;
      maxBarThickness: number;
    },
    {
      label: string;
      data: number[];
      borderColor: string;
      backgroundColor: string;
      borderWidth: number;
      fill: boolean;
      yAxisID: string;
      tension: number;
      pointRadius: number;
    }
  ];
}

function shortenLabel(label: string): string {
  const parts = label.split("/");
  const domainIndex = parts.findIndex(
    (p) => p === "users" || p === "merchants"
  );
  if (domainIndex === -1) return label;
  return parts.slice(domainIndex, domainIndex + 3).join("/");
}

function getBarColor(label: string): string {
  if (label.includes("/users/")) return "#4285F4";
  if (label.includes("/merchants/")) return "#34A853";
  return "#999999";
}

export function ApiLogChart({ data }: { data: ApiRequestLogChartData }) {
  const shortenedLabels = data.labels.map(shortenLabel);
  const barColors = data.labels.map(getBarColor);

  const chartData = {
    labels: shortenedLabels,
    datasets: [
      {
        ...data.datasets[0],
        backgroundColor: barColors,
      },
      data.datasets[1],
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "index" as const,
      intersect: false,
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          title: (tooltipItems: any[]) => {
            const index = tooltipItems[0].dataIndex;
            return data.labels[index];
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        position: "left" as const,
      },
      y1: {
        beginAtZero: true,
        position: "right" as const,
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };

  return (
    <div className="w-full overflow-x-auto">
      <div
        style={{
          minWidth: "100%",
          width: `${Math.max(data.labels.length * 80, 800)}px`,
          height: "300px",
        }}
      >
        <Chart type="bar" data={chartData} options={options} />
      </div>
    </div>
  );
}

function groupByEndpoint(logs: ApiChartRawItem[]) {
  const result: Record<string, { total: number; count: number; avg: number }> =
    {};

  logs.forEach(({ label, avgResponseTime }) => {
    const shortEndpoint = label;
    if (!result[shortEndpoint]) {
      result[shortEndpoint] = { total: 0, count: 0, avg: 0 };
    }
    result[shortEndpoint].total += avgResponseTime;
    result[shortEndpoint].count += 1;
  });

  for (const key in result) {
    result[key].avg = Math.round(result[key].total / result[key].count);
  }

  return result;
}
