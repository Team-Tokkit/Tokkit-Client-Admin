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

export function ApiLogChart({ data }: { data: ApiRequestLogChartData[] }) {
  console.log(data);
  const chartData = {
    labels: data.labels, // 이미 'labels'가 전달되었으므로 그대로 사용
    datasets: data.datasets, // 이미 'datasets'이 제공되었으므로 그대로 사용
  };
  // const chartData = {
  //   labels: data.map((item) => item.label), // 'label'을 X축 레이블로 사용
  //   datasets: [
  //     {
  //       type: "bar" as const,
  //       label: "평균 응답 시간 (ms)",
  //       data: data.map((item) => item.avgResponseTime), // 평균 응답 시간을 Y축 데이터로 사용
  //       backgroundColor: "#3b82f6",
  //       yAxisID: "y",
  //       barThickness: 8,
  //       maxBarThickness: 10,
  //     },
  //     {
  //       type: "line" as const,
  //       label: "요청 수",
  //       data: data.map((item) => item.count), // 요청 수를 Y축 데이터로 사용
  //       borderColor: "#facc15",
  //       backgroundColor: "#fef9c3",
  //       borderWidth: 2,
  //       fill: true,
  //       yAxisID: "y1",
  //       tension: 0.3,
  //       pointRadius: 2,
  //     },
  //   ],
  // };

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
          width: "100%", // 너비를 100%로 설정하여 부모 요소에 맞게 조정
          height: "300px", // 높이를 고정값으로 설정
        }}
      >
        <Chart type="bar" data={chartData} options={options} />
      </div>
    </div>
  );
}

function groupByEndpoint(logs: ApiRequestLog[]) {
  if (!logs || logs.length === 0) return {};

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
