"use client";

import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, RefreshCcw } from "lucide-react";
import {
  fetchLoginLogs,
  fetchLoginLogDetail,
  fetchErrorLogs,
  fetchErrorLogDetail,
} from "@/app/system-logs/api/system-logs";
import SystemDetailDialog from "./components/SystemLogDetail";
import List from "@/components/common/List";

interface LoginLog {
  id: number;
  timestamp: string;
  event: "LOGIN" | "LOGOUT";
  success: boolean;
  userId?: number;
  merchantId?: number;
  ipAddress: string;
  userAgent?: string;
  traceId: string;
  reason?: string;
}

interface SystemErrorLog {
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

export default function SystemLogPage() {
  const [activeTab, setActiveTab] = useState("login");

  const [loginLogs, setLoginLogs] = useState<LoginLog[]>([]);
  const [filteredLoginLogs, setFilteredLoginLogs] = useState<LoginLog[]>([]);
  const [loginCurrentPage, setLoginCurrentPage] = useState(1);
  const [loginTotalPages, setLoginTotalPages] = useState(1);

  const [errorLogs, setErrorLogs] = useState<SystemErrorLog[]>([]);
  const [filteredErrorLogs, setFilteredErrorLogs] = useState<SystemErrorLog[]>(
    []
  );
  const [errorCurrentPage, setErrorCurrentPage] = useState(1);
  const [errorTotalPages, setErrorTotalPages] = useState(1);

  const [loginSearchParams, setLoginSearchParams] = useState({
    keyword: "",
    event: "all",
    success: "all",
    dateRange: "all",
  });
  const [errorSearchParams, setErrorSearchParams] = useState({
    keyword: "",
    severity: "all",
    dateRange: "all",
  });

  const [dateRange, setDateRange] = useState<[Date, Date] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedLog, setSelectedLog] = useState<
    LoginLog | SystemErrorLog | null
  >(null);
  const [selectedType, setSelectedType] = useState<"login" | "error" | null>(
    null
  );

  const handleResetFilters = () => {
    if (activeTab === "login") {
      setLoginSearchParams({
        keyword: "",
        event: "all",
        success: "all",
        dateRange: "all",
      });
    } else if (activeTab === "error") {
      setErrorSearchParams({
        keyword: "",
        severity: "all",
        dateRange: "all",
      });
    }

    setDateRange(null);
  };

  useEffect(() => {
    if (activeTab === "login") {
      fetchLoginLogData(0);
    } else {
      fetchErrorLogData(0);
    }
  }, [activeTab, loginSearchParams, errorSearchParams]);

  const fetchLoginLogData = async (page = 0) => {
    const res = await fetchLoginLogs({
      page,
      size: 10,
      keyword: loginSearchParams.keyword,
      event: loginSearchParams.event,
      success: loginSearchParams.success,
      dateRange: loginSearchParams.dateRange,
    });
    setLoginLogs(res.result?.content ?? []);
    setFilteredLoginLogs(res.result?.content ?? []);
    setLoginTotalPages(res.result?.totalPages ?? 1);
    setLoginCurrentPage(res.result?.number + 1);
  };

  const fetchErrorLogData = async (page = 0) => {
    const res = await fetchErrorLogs({
      page,
      size: 10,
      keyword: errorSearchParams.keyword,
      severity: errorSearchParams.severity,
      dateRange: errorSearchParams.dateRange,
    });

    setErrorLogs(res.result?.content ?? []);
    setFilteredErrorLogs(res.result?.content ?? []);
    setErrorTotalPages(res.result?.totalPages ?? 1);
    setErrorCurrentPage(res.result?.number + 1);
  };

  const handleLoginSearchParamChange = (name: string, value: string) => {
    setLoginSearchParams((prev) => ({ ...prev, [name]: value }));
    setLoginCurrentPage(1);
  };

  const handleErrorSearchParamChange = (name: string, value: string) => {
    setErrorSearchParams((prev) => ({ ...prev, [name]: value }));
    setErrorCurrentPage(1);
  };

  const handleViewLog = async (
    log: LoginLog | SystemErrorLog,
    type: "login" | "error"
  ) => {
    const data =
      type === "login"
        ? await fetchLoginLogDetail(log.id)
        : await fetchErrorLogDetail(log.id);
    setSelectedLog(data.result);
    setSelectedType(type);
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

  const getLoginStatusBadge = (success: boolean) =>
    success ? (
      <Badge className="bg-green-100 text-green-800">성공</Badge>
    ) : (
      <Badge className="bg-red-100 text-red-800">실패</Badge>
    );

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

  const loginColumns = [
    {
      key: "event",
      header: "이벤트",
      cell: (log: LoginLog) => (
        <Badge
          className={
            log.event === "LOGIN"
              ? "bg-blue-100 text-blue-800"
              : "bg-yellow-100 text-yellow-800"
          }
        >
          {log.event === "LOGIN" ? "로그인" : "로그아웃"}
        </Badge>
      ),
    },
    {
      key: "status",
      header: "상태",
      cell: (log: LoginLog) => getLoginStatusBadge(log.success),
    },
    {
      key: "userId",
      header: "사용자 ID",
      cell: (log: LoginLog) => log.userId ?? "-",
    },
    {
      key: "merchantId",
      header: "판매자 ID",
      cell: (log: LoginLog) => log.merchantId ?? "-",
    },
    {
      key: "ipAddress",
      header: "IP 주소",
      cell: (log: LoginLog) => log.ipAddress?.trim() || "-",
    },
    {
      key: "timestamp",
      header: "시간",
      cell: (log: LoginLog) => formatDate(log.timestamp),
    },
    {
      key: "actions",
      header: "",
      cell: (log: LoginLog) => (
        <Button variant="ghost" onClick={() => handleViewLog(log, "login")}>
          상세
        </Button>
      ),
    },
  ];

  const errorColumns = [
    {
      key: "severity",
      header: "심각도",
      cell: (log: SystemErrorLog) => getSeverityBadge(log.severity),
    },
    {
      key: "endpoint",
      header: "엔드포인트",
      cell: (log: SystemErrorLog) => log.endpoint,
    },

    {
      key: "timestamp",
      header: "시간",
      cell: (log: SystemErrorLog) => formatDate(log.timestamp),
    },
    {
      key: "actions",
      header: "",
      cell: (log: SystemErrorLog) => (
        <Button variant="ghost" onClick={() => handleViewLog(log, "error")}>
          상세
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">시스템 로그</h1>
        <div className="flex flex-col md:flex-row gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="로그 검색..."
              className="pl-8 w-full md:w-[250px]"
              value={
                activeTab === "login"
                  ? loginSearchParams.keyword
                  : errorSearchParams.keyword
              }
              onChange={(e) => {
                const value = e.target.value;
                if (activeTab === "login")
                  handleLoginSearchParamChange("keyword", value);
                else handleErrorSearchParamChange("keyword", value);
              }}
            />
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
                      if (activeTab === "login") {
                        setLoginSearchParams((prev) => ({
                          ...prev,
                          dateRange: "custom",
                        }));
                      } else {
                        setErrorSearchParams((prev) => ({
                          ...prev,
                          dateRange: "custom",
                        }));
                      }
                    }
                  }}
                />
              </PopoverContent>
            </Popover>

            {activeTab === "login" && (
              <>
                <Select
                  value={loginSearchParams.event}
                  onValueChange={(value) =>
                    handleLoginSearchParamChange("event", value)
                  }
                >
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="이벤트" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">모든 이벤트</SelectItem>
                    <SelectItem value="LOGIN">로그인</SelectItem>
                    <SelectItem value="LOGOUT">로그아웃</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={loginSearchParams.success}
                  onValueChange={(value) =>
                    handleLoginSearchParamChange("success", value)
                  }
                >
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="상태" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">모든 상태</SelectItem>
                    <SelectItem value="success">성공</SelectItem>
                    <SelectItem value="failure">실패</SelectItem>
                  </SelectContent>
                </Select>
              </>
            )}
            {activeTab === "error" && (
              <Select
                value={errorSearchParams.severity}
                onValueChange={(value) =>
                  handleErrorSearchParamChange("severity", value)
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
            )}
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

      <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="login">로그인 로그</TabsTrigger>
          <TabsTrigger value="error">시스템 에러 로그</TabsTrigger>
        </TabsList>

        <TabsContent value="login">
          <Card>
            <List
              data={filteredLoginLogs}
              columns={loginColumns}
              currentPage={loginCurrentPage}
              totalPages={loginTotalPages}
              onPageChange={(page) => fetchLoginLogData(page - 1)}
            />
          </Card>
        </TabsContent>

        <TabsContent value="error">
          <Card>
            <List
              data={filteredErrorLogs}
              columns={errorColumns}
              currentPage={errorCurrentPage}
              totalPages={errorTotalPages}
              onPageChange={(page) => fetchErrorLogData(page - 1)}
            />
          </Card>
        </TabsContent>

        <SystemDetailDialog
          open={isDetailOpen}
          type={selectedType!}
          data={selectedLog}
          onClose={() => setIsDetailOpen(false)}
          formatDate={formatDate}
          getStatusBadge={getLoginStatusBadge}
          getSeverityBadge={getSeverityBadge}
        />
      </Tabs>
    </div>
  );
}
