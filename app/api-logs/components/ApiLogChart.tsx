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
import type { ApiRequestLog } from "@/app/api-logs/page";

interface ApiChartRawItem {
  label: string;
  avgResponseTime: number;
}

// 백엔드에서 전달하는 데이터 구조에 맞게 수정된 인터페이스
export interface ApiRequestLogChartData {
  labels: string[]; // 엔드포인트 레이블 (예: POST /api/users/emailCheck)
  datasets: [
    {
      label: string; // "평균 응답 시간 (ms)"
      data: number[]; // 각 레이블에 해당하는 avgResponseTime 값들
      backgroundColor: string; // 색상
      yAxisID: string; // y축 ID
      barThickness: number; // 막대 두께
      maxBarThickness: number; // 최대 막대 두께
    },
    {
      label: string; // "요청 수"
      data: number[]; // 각 레이블에 해당하는 count 값들
      borderColor: string; // 라인 색상
      backgroundColor: string; // 배경 색상
      borderWidth: number; // 테두리 두께
      fill: boolean; // 선 밑을 채울지 여부
      yAxisID: string; // y축 ID
      tension: number; // 선의 곡선 정도
      pointRadius: number; // 포인트의 반지름
    }
  ];
}

export function ApiLogChart({ data }: { data: ApiRequestLogChartData }) {
  const chartData = {
    labels: data.labels,
    datasets: data.datasets,
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
