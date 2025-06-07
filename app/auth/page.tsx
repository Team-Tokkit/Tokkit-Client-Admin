"use client";

import { useState, useEffect } from "react";
import { Search, RefreshCcw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import List from "@/components/common/List";
import AuthDetailDialog from "./components/AuthLogDetail";
import { fetchAuthLogs, fetchAuthLogDetail } from "../auth/api/auth-logs";

interface AuthLog {
  id: number;
  timestamp: string;
  event: "LOGIN" | "LOGOUT";
  success: boolean;
  userId?: number;
  merchantId?: number;
  ipAddress: string;
  traceId: string;
  reason?: string;
}

export default function AuthPage() {
  const [authLogs, setAuthLogs] = useState<AuthLog[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [searchTarget, setSearchTarget] = useState<
    "all" | "userId" | "merchantId"
  >("all");
  const [searchValue, setSearchValue] = useState("");

  const [searchParams, setSearchParams] = useState<{
    userId?: number;
    merchantId?: number;
    event: string;
    success: string;
  }>({
    event: "all",
    success: "all",
  });

  const [selectedLog, setSelectedLog] = useState<AuthLog | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [idSearchTrigger, setIdSearchTrigger] = useState(0);

  useEffect(() => {
    fetchLogs(currentPage - 1);
  }, [currentPage, searchParams, idSearchTrigger]);

  const fetchLogs = async (page = 0) => {
    const params: {
      page: number;
      size: number;
      event?: string;
      success?: string;
      userId?: number;
      merchantId?: number;
    } = {
      page,
      size: 10,
    };

    if (searchParams.event && searchParams.event !== "all") {
      params.event = searchParams.event;
    }

    if (searchParams.success && searchParams.success !== "all") {
      params.success = searchParams.success;
    }

    if (typeof searchParams.userId === "number") {
      params.userId = searchParams.userId;
    }

    if (typeof searchParams.merchantId === "number") {
      params.merchantId = searchParams.merchantId;
    }

    const res = await fetchAuthLogs(params);
    setAuthLogs(res.result?.content ?? []);
    setTotalPages(res.result?.totalPages ?? 1);
    setCurrentPage((res.result?.number ?? 0) + 1);
  };

  const handleResetFilters = () => {
    setSearchTarget("all");
    setSearchValue("");
    setSearchParams({
      userId: undefined,
      merchantId: undefined,
      event: "all",
      success: "all",
    });
    setCurrentPage(1);
  };

  const handleSearchParamChange = (name: string, value: string) => {
    setSearchParams((prev) => ({ ...prev, [name]: value }));
    setCurrentPage(1);
  };

  const handleSubmitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const numericValue = Number(searchValue);
    if (!isNaN(numericValue)) {
      setSearchParams((prev) => ({
        ...prev,
        userId: searchTarget === "userId" ? numericValue : undefined,
        merchantId: searchTarget === "merchantId" ? numericValue : undefined,
      }));
    } else {
      setSearchParams((prev) => ({
        ...prev,
        userId: undefined,
        merchantId: undefined,
      }));
    }

    setCurrentPage(1);
    setIdSearchTrigger((prev) => prev + 1);
  };

  const handleViewDetail = async (log: AuthLog) => {
    const res = await fetchAuthLogDetail(log.id);
    setSelectedLog(res.result);
    setIsDetailOpen(true);
  };

  const getLoginStatusBadge = (success: boolean) =>
    success ? (
      <Badge className="bg-green-100 text-green-800">성공</Badge>
    ) : (
      <Badge className="bg-red-100 text-red-800">실패</Badge>
    );

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

  const columns = [
    {
      key: "traceId",
      header: "Trace ID",
      cell: (log: AuthLog) => <span>{log.traceId}</span>
    },
    {
      key: "event",
      header: "이벤트",
      cell: (log: AuthLog) => (
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
      key: "success",
      header: "상태",
      cell: (log: AuthLog) => getLoginStatusBadge(log.success),
    },
    {
      key: "userId",
      header: "사용자 ID",
      cell: (log: AuthLog) => log.userId ?? "-",
    },
    {
      key: "merchantId",
      header: "판매자 ID",
      cell: (log: AuthLog) => log.merchantId ?? "-",
    },
    {
      key: "ipAddress",
      header: "IP 주소",
      cell: (log: AuthLog) => log.ipAddress || "-",
    },
    {
      key: "timestamp",
      header: "시간",
      cell: (log: AuthLog) => formatDate(log.timestamp),
    },
    {
      key: "actions",
      header: "관리",
      cell: (log: AuthLog) => (
        <Button
          className="text-left"
          variant="ghost"
          onClick={() => handleViewDetail(log)}
        >
          상세
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">로그인 로그</h1>

        <div className="flex flex-wrap gap-2 p-2">
          <Select
            value={searchParams.event}
            onValueChange={(value) => handleSearchParamChange("event", value)}
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
            value={searchParams.success}
            onValueChange={(value) => handleSearchParamChange("success", value)}
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

          <Select
            value={searchTarget}
            onValueChange={(value) => {
              setSearchTarget(value as "userId" | "merchantId" | "all");
              setSearchValue("");
            }}
            disabled={searchParams.success === "failure"}
          >
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="ID 유형" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">ID 유형</SelectItem>
              <SelectItem value="userId">사용자 ID</SelectItem>
              <SelectItem value="merchantId">판매자 ID</SelectItem>
            </SelectContent>
          </Select>

          <form onSubmit={handleSubmitSearch} className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="string"
              placeholder="ID 입력..."
              className="pl-8 w-[180px]"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              disabled={
                searchTarget === "all" || searchParams.success === "failure"
              }
            />
          </form>

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
        data={Array.isArray(authLogs) ? authLogs : []}
        columns={columns}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => fetchLogs(page - 1)}
      />

      <AuthDetailDialog
        open={isDetailOpen}
        type="login"
        data={selectedLog}
        onClose={() => setIsDetailOpen(false)}
        formatDate={formatDate}
        getStatusBadge={getLoginStatusBadge}
      />
    </div>
  );
}
