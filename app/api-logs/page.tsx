"use client";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, RefreshCcw } from "lucide-react";
import { ApiLogChart } from "@/app/api-logs/components/ApiLogChart"; // 차트 컴포넌트
import { fetchApiLogs } from "@/lib/api/api-logs"; // API 로그 데이터 가져오기
import { fetchChartData } from "@/lib/api/api-logs"; // 차트 데이터 가져오기
import { ResponsiveTable } from "@/components/responsive-table";
import Pagination from "@/app/api-logs/components/CustomPagination";

export interface ApiRequestLog {
  id: number;
  endpoint: string;
  method: string;
  responseStatus: number;
  responseTime: number;
  ipAddress: string;
  userId: number;
  traceId: string;
  timestamp: string;
  queryParams?: string;
  requestBody?: string;
}

export default function ApiLogPage() {
  const [apiLogs, setApiLogs] = useState<ApiRequestLog[]>([]);
  const [filteredApiLogs, setFilteredApiLogs] = useState<ApiRequestLog[]>([]);
  const [chartData, setChartData] = useState<any>(null); // 차트 데이터를 저장할 상태
  const [apiSearchParams, setApiSearchParams] = useState({
    keyword: "",
    method: "all",
    status: "all",
    dateRange: "all",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  function convertDateRange(range: string): {
    startDate?: string;
    endDate?: string;
  } {
    const now = new Date();
    const start = new Date();

    switch (range) {
      case "hour":
        start.setHours(now.getHours() - 1);
        break;
      case "today":
        start.setHours(0, 0, 0, 0);
        break;
      case "week":
        start.setDate(now.getDate() - 7);
        break;
      case "month":
        start.setMonth(now.getMonth() - 1);
        break;
      case "all":
      default:
        return {};
    }

    const format = (date: Date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    return {
      startDate: format(start),
      endDate: format(now),
    };
  }

  const { startDate, endDate } = convertDateRange(apiSearchParams.dateRange);

  useEffect(() => {
    fetchLogs();
    fetchChartDataFromAPI(); // 로그와 차트 데이터를 모두 가져오기
  }, [currentPage, apiSearchParams]);

  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      const params = {
        page: currentPage,
        size: rowsPerPage,
        keyword: apiSearchParams.keyword || undefined,
        method:
          apiSearchParams.method !== "all" ? apiSearchParams.method : undefined,
        status:
          apiSearchParams.status !== "all" ? apiSearchParams.status : undefined,
        ...(startDate && endDate ? { startDate, endDate } : {}),
      };

      const data = await fetchApiLogs(params);
      setApiLogs(data.result.content || []);
      setFilteredApiLogs(data.result.content || []);
    } catch (error) {
      console.error("API 로그를 불러오는 중 오류:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchChartDataFromAPI = async () => {
    try {
      const params = {
        method:
          apiSearchParams.method !== "all" ? apiSearchParams.method : undefined,
        status:
          apiSearchParams.status !== "all" ? apiSearchParams.status : undefined,
        keyword: apiSearchParams.keyword || undefined,
        startDate: startDate || "2000-01-01", // startDate 기본값 설정
        endDate: endDate || new Date().toISOString().slice(0, 10), // endDate 기본값 설정
      };

      const response = await fetchChartData(params); // 차트 데이터를 API에서 가져오기
      console.log(response.result); // 데이터를 콘솔에 출력하여 확인

      // 데이터가 없으면 차트 데이터를 초기화하고 종료
      if (!response.result || response.result.length === 0) {
        setChartData(null); // 빈 데이터일 경우 차트 비우기
        return;
      }

      // 백엔드에서 받은 데이터를 바로 차트 데이터에 설정
      const chartData = {
        labels: response.result.map((item: any) => item.label),
        datasets: [
          {
            type: "bar" as const,
            label: "평균 응답 시간 (ms)",
            data: response.result.map((item: any) => item.avgResponseTime),
            backgroundColor: "#3b82f6",
            yAxisID: "y",
            barThickness: 8,
            maxBarThickness: 10,
          },
          {
            type: "line" as const,
            label: "요청 수",
            data: response.result.map((item: any) => item.count),
            borderColor: "#facc15",
            backgroundColor: "#fef9c3",
            borderWidth: 2,
            fill: true,
            yAxisID: "y1",
            tension: 0.3,
            pointRadius: 2,
          },
        ],
      };

      setChartData(chartData);
    } catch (error) {
      console.error("API 차트 데이터를 불러오는 중 오류:", error);
    }
  };

  const handleApiSearchParamChange = (name: string, value: string) => {
    setApiSearchParams((prev) => ({ ...prev, [name]: value }));
    setCurrentPage(1);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const apiColumns = [
    {
      key: "endpoint",
      header: "엔드포인트",
      cell: (log: ApiRequestLog) => (
        <span className="font-medium">{log.endpoint}</span>
      ),
    },
    {
      key: "method",
      header: "메서드",
      cell: (log: ApiRequestLog) => (
        <Badge variant="outline">{log.method}</Badge>
      ),
    },
    {
      key: "status",
      header: "상태",
      cell: (log: ApiRequestLog) => <Badge>{log.responseStatus}</Badge>,
    },
    {
      key: "timestamp",
      header: "시간",
      cell: (log: ApiRequestLog) => formatDate(log.timestamp),
    },
    {
      key: "actions",
      header: "",
      cell: (log: ApiRequestLog) => (
        <Button variant="ghost" size="sm">
          상세
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">API 요청 로그</h1>
        <div className="flex flex-col md:flex-row gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="로그 검색..."
              className="pl-8 w-full md:w-[250px]"
              value={apiSearchParams.keyword}
              onChange={(e) =>
                handleApiSearchParamChange("keyword", e.target.value)
              }
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Select
              value={apiSearchParams.dateRange}
              onValueChange={(val) =>
                handleApiSearchParamChange("dateRange", val)
              }
            >
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="기간" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체 기간</SelectItem>
                <SelectItem value="hour">최근 1시간</SelectItem>
                <SelectItem value="today">오늘</SelectItem>
                <SelectItem value="week">최근 7일</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={apiSearchParams.method}
              onValueChange={(value) =>
                handleApiSearchParamChange("method", value)
              }
            >
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="메서드" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">모든 메서드</SelectItem>
                <SelectItem value="GET">GET</SelectItem>
                <SelectItem value="POST">POST</SelectItem>
                <SelectItem value="PUT">PUT</SelectItem>
                <SelectItem value="DELETE">DELETE</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={apiSearchParams.status}
              onValueChange={(value) =>
                handleApiSearchParamChange("status", value)
              }
            >
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="상태" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">모든 상태</SelectItem>
                <SelectItem value="2xx">2xx (성공)</SelectItem>
                <SelectItem value="4xx">4xx (클라이언트 오류)</SelectItem>
                <SelectItem value="5xx">5xx (서버 오류)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button variant="outline" className="gap-1" onClick={fetchLogs}>
            <RefreshCcw className="h-4 w-4" /> 새로고침
          </Button>
        </div>
      </div>

      <Card className="p-4 overflow-x-auto">
        {chartData ? (
          <ApiLogChart data={chartData} /> // 차트 데이터를 ApiLogChart에 전달
        ) : (
          <p>차트 데이터를 불러오는 중입니다...</p> // 차트 데이터가 없으면 로딩 메시지
        )}
      </Card>

      <Card className="overflow-hidden">
        <ResponsiveTable
          data={filteredApiLogs}
          columns={apiColumns}
          emptyMessage="API 요청 로그가 없습니다."
        />
        <Pagination
          totalPages={Math.ceil((filteredApiLogs?.length ?? 0) / rowsPerPage)}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      </Card>
    </div>
  );
}
