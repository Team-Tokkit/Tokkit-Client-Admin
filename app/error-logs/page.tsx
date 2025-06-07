"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Search, RefreshCcw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
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
import List from "@/components/common/List";
import ErrorDetailDialog from "./components/ErrorLogDetail";
import {
  fetchErrorLogs,
  fetchErrorLogDetail,
} from "../error-logs/api/error-logs";

interface ErrorLog {
  id: number;
  timestamp: string;
  endpoint: string;
  severity: "INFO" | "WARN" | "ERROR" | "FATAL";
  errorMessage?: string;
  stackTrace?: string;
  serverName?: string;
  ipAddress: string;
  userId?: number;
  traceId: string;
}

export default function ErrorLogPage() {
  const [errorLogs, setErrorLogs] = useState<ErrorLog[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchParams, setSearchParams] = useState({
    keyword: "",
    severity: "all",
    dateRange: "all",
  });
  const [localKeyword, setLocalKeyword] = useState(searchParams.keyword);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedLog, setSelectedLog] = useState<ErrorLog | null>(null);

  useEffect(() => {
    fetchErrorLogData(0, searchParams);
  }, [searchParams]);

  const fetchErrorLogData = async (page = 0, params = searchParams) => {
    const res = await fetchErrorLogs({
      page,
      size: 10,
      keyword: params.keyword,
      severity: params.severity,
    });

    setErrorLogs(res.result?.content ?? []);
    setTotalPages(res.result?.totalPages ?? 1);
    setCurrentPage((res.result?.number ?? 0) + 1);
  };

  const handleSearchParamChange = (name: string, value: string) => {
    setSearchParams((prev) => ({ ...prev, [name]: value }));
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setSearchParams({ keyword: "", severity: "all", dateRange: "all" });
    setCurrentPage(1);
  };

  const handleViewLog = async (log: ErrorLog) => {
    const res = await fetchErrorLogDetail(log.id);
    setSelectedLog(res.result);
    setIsDetailOpen(true);
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

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "INFO":
        return <Badge className="bg-blue-100 text-blue-800">INFO</Badge>;
      case "WARN":
        return <Badge className="bg-yellow-100 text-yellow-800">WARN</Badge>;
      case "ERROR":
        return <Badge className="bg-red-100 text-red-800">ERROR</Badge>;
      case "FATAL":
        return <Badge className="bg-purple-100 text-purple-800">FATAL</Badge>;
      default:
        return <Badge>{severity}</Badge>;
    }
  };

  const columns = [
    {
      key: "traceId",
      header: "Trace ID",
      cell: (log: ErrorLog) => <span>{log.traceId}</span>
    },
    {
      key: "severity",
      header: "심각도",
      cell: (log: ErrorLog) => getSeverityBadge(log.severity),
    },
    {
      key: "endpoint",
      header: "엔드포인트",
      cell: (log: ErrorLog) => log.endpoint,
    },
    {
      key: "timestamp",
      header: "시간",
      cell: (log: ErrorLog) => formatDate(log.timestamp),
    },
    {
      key: "actions",
      header: "관리",
      cell: (log: ErrorLog) => (
        <Button variant="ghost" onClick={() => handleViewLog(log)}>
          상세
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">시스템 에러 로그</h1>
        <div className="flex flex-col md:flex-row gap-2">
          <div className="relative">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSearchParams((prev) => ({
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
                className="pl-8 w-[200px]"
                value={localKeyword}
                onChange={(e) => setLocalKeyword(e.target.value)}
              />
            </form>
          </div>
          <div className="flex flex-wrap gap-2">
            <Select
              value={searchParams.severity}
              onValueChange={(value) =>
                handleSearchParamChange("severity", value)
              }
            >
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="심각도" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">모든 심각도</SelectItem>
                <SelectItem value="INFO">INFO</SelectItem>
                <SelectItem value="WARN">WARN</SelectItem>
                <SelectItem value="ERROR">ERROR</SelectItem>
                <SelectItem value="FATAL">FATAL</SelectItem>
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

      <List
        data={Array.isArray(errorLogs) ? errorLogs : []}
        columns={columns}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => fetchErrorLogData(page - 1, searchParams)}
      />

      <ErrorDetailDialog
        open={isDetailOpen}
        type="error"
        data={selectedLog}
        onClose={() => setIsDetailOpen(false)}
        formatDate={formatDate}
        getSeverityBadge={getSeverityBadge}
      />
    </div>
  );
}
