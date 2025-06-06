"use client";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import DateRangePicker from "@/components/common/DateRangePicker";
import "react-calendar/dist/Calendar.css";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, RefreshCcw } from "lucide-react";
import dynamic from "next/dynamic";
import { fetchApiLogs } from "@/app/api-logs/api/api-logs";
import { fetchApiLogDetail } from "@/app/api-logs/api/api-logs";
import { fetchChartData } from "@/app/api-logs/api/api-logs";
import ApiLogDetail from "@/app/api-logs/components/ApiLogDetail";
import List from "@/components/common/List";

const ApiLogChart = dynamic(
  () =>
    import("@/app/api-logs/components/ApiLogChart").then(
      (mod) => mod.ApiLogChart
    ),
  {
    ssr: false,
    loading: () => <p>차트를 불러오는 중입니다...</p>,
  }
);

export interface ApiRequestLog {
  id: number;
  endpoint: string;
  method: string;
  responseStatus: number;
  responseTime?: number;
  responseTimeMs?: number;
  ipAddress: string;
  userId?: number;
  merchantId?: number;
  traceId: string;
  timestamp: string;
  queryParams?: string;
  requestBody?: string;
}

export default function ApiLogPage() {
  const [apiLogs, setApiLogs] = useState<ApiRequestLog[]>([]);
  const [chartData, setChartData] = useState<any>(null);
  const [apiSearchParams, setApiSearchParams] = useState({
    keyword: "",
    method: "all",
    status: "all",
    dateRange: "all",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const rowsPerPage = 10;
  const [isLoading, setIsLoading] = useState(true);
  const [selectedApiLog, setSelectedApiLog] = useState<ApiRequestLog | null>(
    null
  );
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [dateRange, setDateRange] = useState<[Date, Date] | null>(null);
  const [localKeyword, setLocalKeyword] = useState(apiSearchParams.keyword);

  const formatDate = (date?: Date): string =>
    date ? format(date, "yyyy-MM-dd HH:mm:ss") : "";

  const startDate =
    Array.isArray(dateRange) && dateRange[0]
      ? format(dateRange[0], "yyyy-MM-dd")
      : "2000-01-01";

  const endDate =
    Array.isArray(dateRange) && dateRange[1]
      ? format(dateRange[1], "yyyy-MM-dd")
      : format(new Date(), "yyyy-MM-dd");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const {
        Chart,
        CategoryScale,
        BarElement,
        Title,
        Tooltip,
        Legend,
      } = require("chart.js");
      Chart.register(CategoryScale, BarElement, Title, Tooltip, Legend);
    }
  }, []);

  useEffect(() => {
    fetchLogs();
    fetchChartDataFromAPI();
  }, [currentPage, apiSearchParams]);

  const handleResetFilters = () => {
    setApiSearchParams({
      keyword: "",
      method: "all",
      status: "all",
      dateRange: "all",
    });
    setDateRange(null);
    setLocalKeyword("");
    setCurrentPage(1);
  };

  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      const params = {
        page: currentPage - 1,
        size: rowsPerPage,
        keyword: apiSearchParams.keyword || undefined,
        method:
          apiSearchParams.method !== "all" ? apiSearchParams.method : undefined,
        startDate,
        endDate,
        status: ["2xx", "4xx", "5xx", "all"].includes(apiSearchParams.status)
          ? undefined
          : apiSearchParams.status,
      };

      const data = await fetchApiLogs(params);
      const result = data.result;

      const mappedLogs = result.content.map((log: any) => ({
        ...log,
        responseStatus: log.status,
      }));

      setApiLogs(mappedLogs);
      setTotalPages(result.pageable.totalPages);
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
        status: ["2xx", "4xx", "5xx", "all"].includes(apiSearchParams.status)
          ? undefined
          : apiSearchParams.status,
        keyword: apiSearchParams.keyword?.trim() || undefined,
        startDate: startDate || "2000-01-01",
        endDate: endDate || new Date().toISOString().slice(0, 10),
      };

      const response = await fetchChartData(params);

      if (!response.result || response.result.length === 0) {
        setChartData(null);
        return;
      }

      const chartData = {
        labels: response.result.map((item: any) => item.label),
        datasets: [
          {
            type: "bar" as const,
            label: "평균 응답 시간 (ms)",
            data: response.result.map((item: any) => item.avgResponseTime),
            backgroundColor: "#3b82f6",
            yAxisID: "y",
            barThickness: 50,
            maxBarThickness: 100,
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
    setApiSearchParams((prev) => {
      const updated = { ...prev, [name]: value };
      return updated;
    });

    setCurrentPage(1);
  };

  const handleViewLog = async (log: ApiRequestLog) => {
    try {
      const response = await fetchApiLogDetail(log.id);

      const fixed = {
        ...response.result,
        responseStatus: response.result.status,
      };
      setSelectedApiLog(fixed);
      setIsDetailOpen(true);
    } catch (error) {
      console.error("상세 로그 불러오기 실패:", error);
    }
  };

  const handleQuickRange = (type: string) => {
    const now = new Date();
    let from: Date;
    let to: Date = now;

    switch (type) {
      case "1h":
        from = new Date(now.getTime() - 60 * 60 * 1000);
        break;
      case "today":
        from = new Date(now.setHours(0, 0, 0, 0));
        to = new Date();
        break;
      case "7d":
        from = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      default:
        return;
    }

    setDateRange([from, to]);
    setApiSearchParams((prev) => ({ ...prev, dateRange: "custom" }));
  };

  const getMethodColor = (method: string) => {
    switch (method.toUpperCase()) {
      case "GET":
        return "bg-blue-100 text-blue-800";
      case "POST":
        return "bg-green-100 text-green-800";
      case "PUT":
        return "bg-yellow-100 text-yellow-800";
      case "DELETE":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusBadge = (code: number) => {
    if (!code) return <Badge className="bg-gray-100 text-gray-600">N/A</Badge>;

    const statusText = code.toString();
    if (statusText.startsWith("2")) {
      return (
        <Badge className="bg-green-100 text-green-800">{statusText}</Badge>
      );
    } else if (statusText.startsWith("4")) {
      return <Badge className="bg-red-100 text-red-800">{statusText}</Badge>;
    } else if (statusText.startsWith("5")) {
      return (
        <Badge className="bg-yellow-100 text-yellow-800">{statusText}</Badge>
      );
    } else {
      return <Badge className="bg-gray-100 text-gray-600">{statusText}</Badge>;
    }
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
        <Badge className={getMethodColor(log.method)}>{log.method}</Badge>
      ),
    },
    {
      key: "status",
      header: "상태",
      cell: (log: ApiRequestLog) => getStatusBadge(log.responseStatus),
    },
    {
      key: "timestamp",
      header: "시간",
      cell: (log: ApiRequestLog) => formatDate(new Date(log.timestamp)),
    },
    {
      key: "actions",
      header: "관리",
      cell: (log: ApiRequestLog) => (
        <Button variant="ghost" size="sm" onClick={() => handleViewLog(log)}>
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
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setApiSearchParams((prev) => ({
                  ...prev,
                  keyword: localKeyword,
                }));
                setCurrentPage(1);
              }}
            >
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="로그 검색..."
                className="pl-8 w-full"
                value={localKeyword}
                onChange={(e) => setLocalKeyword(e.target.value)}
              />
            </form>
          </div>
          <div className="flex flex-wrap gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date"
                  variant="outline"
                  className={cn(
                    "w-[210px] justify-start text-left font-normal",
                    !Array.isArray(dateRange) || !dateRange[0]
                      ? "text-muted-foreground"
                      : ""
                  )}
                >
                  {Array.isArray(dateRange) && dateRange[0] && dateRange[1]
                    ? `${format(dateRange[0], "yyyy-MM-dd")} ~ ${format(
                        dateRange[1],
                        "yyyy-MM-dd"
                      )}`
                    : "기간 선택"}
                </Button>
              </PopoverTrigger>

              <PopoverContent className="w-auto p-4 space-y-3" align="start">
                <DateRangePicker
                  value={dateRange}
                  onChange={(value) => {
                    if (Array.isArray(value)) {
                      setDateRange(value as [Date, Date]);
                      setApiSearchParams((prev) => ({
                        ...prev,
                        dateRange: "custom",
                      }));
                    }
                  }}
                />

                <div className="flex justify-between gap-2 pt-2 border-t border-gray-200">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleQuickRange("1h")}
                  >
                    최근 1시간
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleQuickRange("today")}
                  >
                    오늘
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleQuickRange("7d")}
                  >
                    최근 7일
                  </Button>
                </div>
              </PopoverContent>
            </Popover>

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
                <SelectItem value="200">200 (성공)</SelectItem>
                <SelectItem value="400">400 (클라이언트 오류)</SelectItem>
                <SelectItem value="500">500 (서버 오류)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button
            variant="outline"
            className="gap-1"
            onClick={handleResetFilters}
          >
            <RefreshCcw className="h-4 w-4" /> 새로고침
          </Button>
        </div>
      </div>

      <div className="flex justify-between items-center text-sm text-muted-foreground px-1 mb-2">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <div className="w-4 h-2 bg-blue-500 rounded-sm" />
            <div className="w-4 h-2 bg-green-500 rounded-sm" />
            <div className="w-4 h-2 bg-gray-400 rounded-sm" />
            <span className="text-sm text-black">평균 응답 시간 (ms)</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-2 border border-yellow-400 bg-yellow-100 rounded-sm" />
            <span className="text-sm text-yellow-700">요청 수</span>
          </div>
        </div>
      </div>

      <Card className="p-4 overflow-x-auto max-h-[500px]">
        {chartData ? (
          <ApiLogChart data={chartData} />
        ) : (
          <p>차트 데이터를 불러오는 중입니다...</p>
        )}
      </Card>

      <List
        data={apiLogs}
        columns={apiColumns}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      <ApiLogDetail
        open={isDetailOpen}
        log={selectedApiLog}
        onClose={() => {
          setIsDetailOpen(false);
          setSelectedApiLog(null);
        }}
        formatDate={(str) => format(new Date(str), "yyyy-MM-dd HH:mm:ss")}
        getStatusBadge={getStatusBadge}
      />
    </div>
  );
}
