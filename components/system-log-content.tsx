"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { generateTraceId } from "@/lib/api";
import { ResponsiveTable } from "./responsive-table";
import {
  Search,
  RefreshCcw,
  Download,
  Settings,
  AlertTriangle,
  AlertCircle,
  Info,
  XCircle,
  Database,
  User,
  CreditCard,
} from "lucide-react";

import {
  mockApiRequestLogs,
  mockLoginLogs,
  mockTransactionLogs,
  mockSystemErrorLogs,
  type ApiRequestLog,
  type LoginLog,
  type TransactionLog,
  type SystemErrorLog,
} from "@/data/mockLogs";

// 로그 설정 타입 정의
interface LogSettings {
  retention: number; // 일 단위
  autoDeleteEnabled: boolean;
  notificationEnabled: boolean;
  errorNotificationOnly: boolean;
  logLevel: "INFO" | "WARN" | "ERROR" | "DEBUG" | "TRACE";
}

export function SystemLogContent() {
  // 탭 상태
  const [activeTab, setActiveTab] = useState("api");

  // API 요청 로그 상태
  const [apiLogs, setApiLogs] = useState<ApiRequestLog[]>([]);
  const [filteredApiLogs, setFilteredApiLogs] = useState<ApiRequestLog[]>([]);
  const [apiSearchParams, setApiSearchParams] = useState({
    keyword: "",
    method: "all",
    status: "all",
    dateRange: "all",
  });
  const [selectedApiLog, setSelectedApiLog] = useState<ApiRequestLog | null>(
    null
  );

  // 로그인 로그 상태
  const [loginLogs, setLoginLogs] = useState<LoginLog[]>([]);
  const [filteredLoginLogs, setFilteredLoginLogs] = useState<LoginLog[]>([]);
  const [loginSearchParams, setLoginSearchParams] = useState({
    keyword: "",
    event: "all",
    success: "all",
    dateRange: "all",
  });
  const [selectedLoginLog, setSelectedLoginLog] = useState<LoginLog | null>(
    null
  );

  // 트랜잭션 로그 상태
  const [transactionLogs, setTransactionLogs] = useState<TransactionLog[]>([]);
  const [filteredTransactionLogs, setFilteredTransactionLogs] = useState<
    TransactionLog[]
  >([]);
  const [transactionSearchParams, setTransactionSearchParams] = useState({
    keyword: "",
    type: "all",
    status: "all",
    dateRange: "all",
  });
  const [selectedTransactionLog, setSelectedTransactionLog] =
    useState<TransactionLog | null>(null);

  // 시스템 에러 로그 상태
  const [errorLogs, setErrorLogs] = useState<SystemErrorLog[]>([]);
  const [filteredErrorLogs, setFilteredErrorLogs] = useState<SystemErrorLog[]>(
    []
  );
  const [errorSearchParams, setErrorSearchParams] = useState({
    keyword: "",
    severity: "all",
    dateRange: "all",
  });
  const [selectedErrorLog, setSelectedErrorLog] =
    useState<SystemErrorLog | null>(null);

  // 공통 상태
  const [isLoading, setIsLoading] = useState(true);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [logSettings, setLogSettings] = useState<LogSettings>({
    retention: 30,
    autoDeleteEnabled: true,
    notificationEnabled: true,
    errorNotificationOnly: true,
    logLevel: "INFO",
  });
  const [showRealtime, setShowRealtime] = useState(false);

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    fetchLogs();
  }, []);

  // 탭 변경 시 필터링 초기화
  useEffect(() => {
    filterLogs();
  }, [
    activeTab,
    apiSearchParams,
    loginSearchParams,
    transactionSearchParams,
    errorSearchParams,
    apiLogs,
    loginLogs,
    transactionLogs,
    errorLogs,
  ]);

  // 실시간 로그 시뮬레이션
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (showRealtime) {
      interval = setInterval(() => {
        const randomLogType = Math.floor(Math.random() * 4);
        const traceId = generateTraceId();

        switch (randomLogType) {
          case 0: // API 로그
            const newApiLog: ApiRequestLog = {
              id: Date.now(),
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              endpoint: [
                "/api/v1/users",
                "/api/v1/transactions",
                "/api/v1/auth/login",
              ][Math.floor(Math.random() * 3)],
              ipAddress: `192.168.1.${Math.floor(Math.random() * 255)}`,
              method: ["GET", "POST", "PUT", "DELETE"][
                Math.floor(Math.random() * 4)
              ],
              responseStatus: [200, 201, 400, 404, 500][
                Math.floor(Math.random() * 5)
              ],
              responseTimeMs: Math.floor(Math.random() * 500),
              timestamp: new Date().toISOString(),
              userId: Math.floor(Math.random() * 10) + 1,
              traceId,
            };
            setApiLogs((prev) => [newApiLog, ...prev]);
            break;

          case 1: // 로그인 로그
            const newLoginLog: LoginLog = {
              id: Date.now(),
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              event: Math.random() > 0.3 ? "LOGIN" : "LOGOUT",
              ipAddress: `192.168.1.${Math.floor(Math.random() * 255)}`,
              userId: Math.floor(Math.random() * 5) + 1,
              success: Math.random() > 0.2,
              timestamp: new Date().toISOString(),
              traceId,
              userAgent:
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            };
            setLoginLogs((prev) => [newLoginLog, ...prev]);
            break;

          case 2: // 트랜잭션 로그
            const txTypes = [
              "DEPOSIT",
              "PURCHASE",
              "REFUND",
              "WITHDRAW",
              "CONVERT",
              "RECEIVE",
            ];
            const txStatuses = ["SUCCESS", "PENDING", "FAILURE"];
            const newTransactionLog: TransactionLog = {
              id: Date.now(),
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              amount: Math.floor(Math.random() * 100000),
              description: "자동 생성된 트랜잭션",
              txHash: `0x${Math.random().toString(16).substring(2, 10)}`,
              type: txTypes[Math.floor(Math.random() * txTypes.length)] as any,
              walletId: Math.floor(Math.random() * 5) + 1,
              status: txStatuses[
                Math.floor(Math.random() * txStatuses.length)
              ] as any,
              timestamp: new Date().toISOString(),
              traceId,
            };
            setTransactionLogs((prev) => [newTransactionLog, ...prev]);
            break;

          case 3: // 에러 로그
            const severities = ["INFO", "WARN", "ERROR", "FATAL"];
            const newErrorLog: SystemErrorLog = {
              id: Date.now(),
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              endpoint: [
                "/api/v1/users",
                "/api/v1/transactions",
                "/api/v1/auth/login",
              ][Math.floor(Math.random() * 3)],
              errorMessage: "자동 생성된 에러 메시지",
              serverName: `server-${Math.floor(Math.random() * 5) + 1}`,
              severity: severities[
                Math.floor(Math.random() * severities.length)
              ] as any,
              timestamp: new Date().toISOString(),
              userId: Math.floor(Math.random() * 5) + 1,
              traceId,
            };
            setErrorLogs((prev) => [newErrorLog, ...prev]);
            break;
        }
      }, 5000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [showRealtime]);

  // 로그 데이터 조회
  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      // 더미 데이터 사용
      setTimeout(() => {
        setApiLogs(mockApiRequestLogs);
        setLoginLogs(mockLoginLogs);
        setTransactionLogs(mockTransactionLogs);
        setErrorLogs(mockSystemErrorLogs);
        setIsLoading(false);
      }, 500);
    } catch (error) {
      console.error("로그 데이터 로딩 중 오류 발생:", error);
      setIsLoading(false);
    }
  };

  // 로그 필터링
  const filterLogs = () => {
    // API 로그 필터링
    let filteredApi = [...apiLogs];
    if (apiSearchParams.keyword) {
      const keyword = apiSearchParams.keyword.toLowerCase();
      filteredApi = filteredApi.filter(
        (log) =>
          log.endpoint.toLowerCase().includes(keyword) ||
          log.ipAddress.includes(keyword) ||
          log.traceId.toLowerCase().includes(keyword)
      );
    }
    if (apiSearchParams.method !== "all") {
      filteredApi = filteredApi.filter(
        (log) => log.method === apiSearchParams.method
      );
    }
    if (apiSearchParams.status !== "all") {
      const statusCode = Number.parseInt(apiSearchParams.status);
      filteredApi = filteredApi.filter((log) => {
        if (apiSearchParams.status === "2xx")
          return log.responseStatus >= 200 && log.responseStatus < 300;
        if (apiSearchParams.status === "4xx")
          return log.responseStatus >= 400 && log.responseStatus < 500;
        if (apiSearchParams.status === "5xx") return log.responseStatus >= 500;
        return log.responseStatus === statusCode;
      });
    }
    if (apiSearchParams.dateRange !== "all") {
      filteredApi = filterByDateRange(filteredApi, apiSearchParams.dateRange);
    }
    setFilteredApiLogs(filteredApi);

    // 로그인 로그 필터링
    let filteredLogin = [...loginLogs];
    if (loginSearchParams.keyword) {
      const keyword = loginSearchParams.keyword.toLowerCase();
      filteredLogin = filteredLogin.filter(
        (log) =>
          log.ipAddress.includes(keyword) ||
          log.traceId.toLowerCase().includes(keyword) ||
          (log.userAgent && log.userAgent.toLowerCase().includes(keyword))
      );
    }
    if (loginSearchParams.event !== "all") {
      filteredLogin = filteredLogin.filter(
        (log) => log.event === loginSearchParams.event
      );
    }
    if (loginSearchParams.success !== "all") {
      filteredLogin = filteredLogin.filter(
        (log) => log.success === (loginSearchParams.success === "success")
      );
    }
    if (loginSearchParams.dateRange !== "all") {
      filteredLogin = filterByDateRange(
        filteredLogin,
        loginSearchParams.dateRange
      );
    }
    setFilteredLoginLogs(filteredLogin);

    // 트랜잭션 로그 필터링
    let filteredTransaction = [...transactionLogs];
    if (transactionSearchParams.keyword) {
      const keyword = transactionSearchParams.keyword.toLowerCase();
      filteredTransaction = filteredTransaction.filter(
        (log) =>
          (log.description &&
            log.description.toLowerCase().includes(keyword)) ||
          (log.txHash && log.txHash.toLowerCase().includes(keyword)) ||
          log.traceId.toLowerCase().includes(keyword)
      );
    }
    if (transactionSearchParams.type !== "all") {
      filteredTransaction = filteredTransaction.filter(
        (log) => log.type === transactionSearchParams.type
      );
    }
    if (transactionSearchParams.status !== "all") {
      filteredTransaction = filteredTransaction.filter(
        (log) => log.status === transactionSearchParams.status
      );
    }
    if (transactionSearchParams.dateRange !== "all") {
      filteredTransaction = filterByDateRange(
        filteredTransaction,
        transactionSearchParams.dateRange
      );
    }
    setFilteredTransactionLogs(filteredTransaction);

    // 에러 로그 필터링
    let filteredError = [...errorLogs];
    if (errorSearchParams.keyword) {
      const keyword = errorSearchParams.keyword.toLowerCase();
      filteredError = filteredError.filter(
        (log) =>
          log.endpoint.toLowerCase().includes(keyword) ||
          (log.errorMessage &&
            log.errorMessage.toLowerCase().includes(keyword)) ||
          (log.serverName && log.serverName.toLowerCase().includes(keyword)) ||
          log.traceId.toLowerCase().includes(keyword)
      );
    }
    if (errorSearchParams.severity !== "all") {
      filteredError = filteredError.filter(
        (log) => log.severity === errorSearchParams.severity
      );
    }
    if (errorSearchParams.dateRange !== "all") {
      filteredError = filterByDateRange(
        filteredError,
        errorSearchParams.dateRange
      );
    }
    setFilteredErrorLogs(filteredError);
  };

  // 날짜 범위로 필터링하는 헬퍼 함수
  const filterByDateRange = <T extends { timestamp: string }>(
    logs: T[],
    dateRange: string
  ): T[] => {
    const now = new Date();
    const filterDate = new Date();

    switch (dateRange) {
      case "hour":
        filterDate.setHours(now.getHours() - 1);
        break;
      case "today":
        filterDate.setHours(0, 0, 0, 0);
        break;
      case "week":
        filterDate.setDate(now.getDate() - 7);
        break;
      case "month":
        filterDate.setMonth(now.getMonth() - 1);
        break;
    }

    return logs.filter((log) => {
      const logDate = new Date(log.timestamp);
      return logDate >= filterDate;
    });
  };

  // 검색 파라미터 변경 핸들러
  const handleApiSearchParamChange = (name: string, value: string) => {
    setApiSearchParams((prev) => ({ ...prev, [name]: value }));
  };

  const handleLoginSearchParamChange = (name: string, value: string) => {
    setLoginSearchParams((prev) => ({ ...prev, [name]: value }));
  };

  const handleTransactionSearchParamChange = (name: string, value: string) => {
    setTransactionSearchParams((prev) => ({ ...prev, [name]: value }));
  };

  const handleErrorSearchParamChange = (name: string, value: string) => {
    setErrorSearchParams((prev) => ({ ...prev, [name]: value }));
  };

  // 로그 상세 보기
  const handleViewLog = (log: any, type: string) => {
    switch (type) {
      case "api":
        setSelectedApiLog(log);
        break;
      case "login":
        setSelectedLoginLog(log);
        break;
      case "transaction":
        setSelectedTransactionLog(log);
        break;
      case "error":
        setSelectedErrorLog(log);
        break;
    }
    setIsDetailOpen(true);
  };

  // 로그 설정 저장
  const handleSaveSettings = async () => {
    try {
      /*
      // TODO: API 연동 코드 (나중에 주석 해제하면 바로 적용 가능)
      await api.post('/system/logs/settings', logSettings);
      */

      toast({
        title: "설정 저장 완료",
        description: "로그 설정이 저장되었습니다.",
      });
      setIsSettingsOpen(false);
    } catch (error) {
      console.error("로그 설정 저장 중 오류 발생:", error);
      toast({
        title: "설정 저장 실패",
        description: "로그 설정 저장 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
  };

  // 날짜 포맷 함수
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

  // HTTP 상태 코드에 따른 배지 색상 (api)
  const getStatusBadge = (status: number) => {
    if (status >= 200 && status < 300) {
      return (
        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
          {status}
        </Badge>
      );
    } else if (status >= 400 && status < 500) {
      return (
        <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
          {status}
        </Badge>
      );
    } else if (status >= 500) {
      return (
        <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
          {status}
        </Badge>
      );
    } else {
      return <Badge>{status}</Badge>;
    }
  };

  // 로그인 성공/실패 배지
  const getLoginStatusBadge = (success: boolean) => {
    return success ? (
      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
        성공
      </Badge>
    ) : (
      <Badge className="bg-red-100 text-red-800 hover:bg-red-100">실패</Badge>
    );
  };

  // 트랜잭션 상태 배지
  const getTransactionStatusBadge = (status: string) => {
    switch (status) {
      case "SUCCESS":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            성공
          </Badge>
        );
      case "PENDING":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            대기
          </Badge>
        );
      case "FAILURE":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            실패
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  // 에러 심각도 배지
  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "INFO":
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 flex items-center gap-1">
            <Info className="h-3 w-3" /> INFO
          </Badge>
        );
      case "WARN":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" /> WARN
          </Badge>
        );
      case "ERROR":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" /> ERROR
          </Badge>
        );
      case "FATAL":
        return (
          <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100 flex items-center gap-1">
            <XCircle className="h-3 w-3" /> FATAL
          </Badge>
        );
      default:
        return <Badge>{severity}</Badge>;
    }
  };

  // 트랜잭션 타입 배지
  const getTransactionTypeBadge = (type: string) => {
    switch (type) {
      case "DEPOSIT":
        return (
          <Badge variant="outline" className="text-green-600">
            입금
          </Badge>
        );
      case "WITHDRAW":
        return (
          <Badge variant="outline" className="text-red-600">
            출금
          </Badge>
        );
      case "PURCHASE":
        return (
          <Badge variant="outline" className="text-blue-600">
            구매
          </Badge>
        );
      case "REFUND":
        return (
          <Badge variant="outline" className="text-yellow-600">
            환불
          </Badge>
        );
      case "CONVERT":
        return (
          <Badge variant="outline" className="text-purple-600">
            전환
          </Badge>
        );
      case "RECEIVE":
        return (
          <Badge variant="outline" className="text-indigo-600">
            수신
          </Badge>
        );
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  // API 로그 테이블 컬럼
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
      cell: (log: ApiRequestLog) => getStatusBadge(log.responseStatus),
    },
    {
      key: "responseTime",
      header: "응답 시간",
      cell: (log: ApiRequestLog) => `${log.responseTimeMs}ms`,
      hideOnMobile: true,
    },
    {
      key: "userId",
      header: "사용자 ID",
      cell: (log: ApiRequestLog) => log.userId,
      hideOnMobile: true,
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
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleViewLog(log, "api")}
        >
          상세
        </Button>
      ),
      className: "text-right",
    },
  ];

  // 로그인 로그 테이블 컬럼
  const loginColumns = [
    {
      key: "event",
      header: "이벤트",
      cell: (log: LoginLog) => (
        <Badge variant="outline">
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
      cell: (log: LoginLog) => log.userId || log.merchantId || "-",
    },
    {
      key: "ipAddress",
      header: "IP 주소",
      cell: (log: LoginLog) => log.ipAddress,
      hideOnMobile: true,
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
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleViewLog(log, "login")}
        >
          상세
        </Button>
      ),
      className: "text-right",
    },
  ];

  // 트랜잭션 로그 테이블 컬럼
  const transactionColumns = [
    {
      key: "type",
      header: "유형",
      cell: (log: TransactionLog) =>
        log.type && getTransactionTypeBadge(log.type),
    },
    {
      key: "amount",
      header: "금액",
      cell: (log: TransactionLog) =>
        log.amount ? new Intl.NumberFormat("ko-KR").format(log.amount) : "-",
    },
    {
      key: "status",
      header: "상태",
      cell: (log: TransactionLog) =>
        log.status && getTransactionStatusBadge(log.status),
    },
    {
      key: "walletId",
      header: "지갑 ID",
      cell: (log: TransactionLog) => log.walletId || "-",
      hideOnMobile: true,
    },
    {
      key: "timestamp",
      header: "시간",
      cell: (log: TransactionLog) => formatDate(log.timestamp),
    },
    {
      key: "actions",
      header: "",
      cell: (log: TransactionLog) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleViewLog(log, "transaction")}
        >
          상세
        </Button>
      ),
      className: "text-right",
    },
  ];

  // 에러 로그 테이블 컬럼
  const errorColumns = [
    {
      key: "severity",
      header: "심각도",
      cell: (log: SystemErrorLog) =>
        log.severity && getSeverityBadge(log.severity),
    },
    {
      key: "endpoint",
      header: "엔드포인트",
      cell: (log: SystemErrorLog) => log.endpoint,
    },
    {
      key: "errorMessage",
      header: "에러 메시지",
      cell: (log: SystemErrorLog) => (
        <div className="max-w-xs truncate">{log.errorMessage || "-"}</div>
      ),
    },
    {
      key: "serverName",
      header: "서버",
      cell: (log: SystemErrorLog) => log.serverName || "-",
      hideOnMobile: true,
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
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleViewLog(log, "error")}
        >
          상세
        </Button>
      ),
      className: "text-right",
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
                activeTab === "api"
                  ? apiSearchParams.keyword
                  : activeTab === "login"
                  ? loginSearchParams.keyword
                  : activeTab === "transaction"
                  ? transactionSearchParams.keyword
                  : errorSearchParams.keyword
              }
              onChange={(e) => {
                const value = e.target.value;
                if (activeTab === "api")
                  handleApiSearchParamChange("keyword", value);
                else if (activeTab === "login")
                  handleLoginSearchParamChange("keyword", value);
                else if (activeTab === "transaction")
                  handleTransactionSearchParamChange("keyword", value);
                else handleErrorSearchParamChange("keyword", value);
              }}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Select
              value={
                activeTab === "api"
                  ? apiSearchParams.dateRange
                  : activeTab === "login"
                  ? loginSearchParams.dateRange
                  : activeTab === "transaction"
                  ? transactionSearchParams.dateRange
                  : errorSearchParams.dateRange
              }
              onValueChange={(value) => {
                if (activeTab === "api")
                  handleApiSearchParamChange("dateRange", value);
                else if (activeTab === "login")
                  handleLoginSearchParamChange("dateRange", value);
                else if (activeTab === "transaction")
                  handleTransactionSearchParamChange("dateRange", value);
                else handleErrorSearchParamChange("dateRange", value);
              }}
            >
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="기간" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체 기간</SelectItem>
                <SelectItem value="hour">최근 1시간</SelectItem>
                <SelectItem value="today">오늘</SelectItem>
                <SelectItem value="week">최근 7일</SelectItem>
                <SelectItem value="month">최근 30일</SelectItem>
              </SelectContent>
            </Select>

            {/* API 로그 필터 */}
            {activeTab === "api" && (
              <>
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
                    <SelectItem value="200">200 OK</SelectItem>
                    <SelectItem value="201">201 Created</SelectItem>
                    <SelectItem value="400">400 Bad Request</SelectItem>
                    <SelectItem value="401">401 Unauthorized</SelectItem>
                    <SelectItem value="404">404 Not Found</SelectItem>
                    <SelectItem value="500">500 Server Error</SelectItem>
                  </SelectContent>
                </Select>
              </>
            )}

            {/* 로그인 로그 필터 */}
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

            {/* 트랜잭션 로그 필터 */}
            {activeTab === "transaction" && (
              <>
                <Select
                  value={transactionSearchParams.type}
                  onValueChange={(value) =>
                    handleTransactionSearchParamChange("type", value)
                  }
                >
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="유형" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">모든 유형</SelectItem>
                    <SelectItem value="DEPOSIT">입금</SelectItem>
                    <SelectItem value="WITHDRAW">출금</SelectItem>
                    <SelectItem value="PURCHASE">구매</SelectItem>
                    <SelectItem value="REFUND">환불</SelectItem>
                    <SelectItem value="CONVERT">전환</SelectItem>
                    <SelectItem value="RECEIVE">수신</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={transactionSearchParams.status}
                  onValueChange={(value) =>
                    handleTransactionSearchParamChange("status", value)
                  }
                >
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="상태" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">모든 상태</SelectItem>
                    <SelectItem value="SUCCESS">성공</SelectItem>
                    <SelectItem value="PENDING">대기</SelectItem>
                    <SelectItem value="FAILURE">실패</SelectItem>
                  </SelectContent>
                </Select>
              </>
            )}

            {/* 에러 로그 필터 */}
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
          <Button variant="outline" className="gap-1" onClick={fetchLogs}>
            <RefreshCcw className="h-4 w-4" /> 새로고침
          </Button>
          <Button variant="outline" className="gap-1">
            <Download className="h-4 w-4" /> 내보내기
          </Button>
          <Button
            variant="outline"
            className="gap-1"
            onClick={() => setIsSettingsOpen(true)}
          >
            <Settings className="h-4 w-4" /> 설정
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center space-x-2">
          <Switch
            id="realtime"
            checked={showRealtime}
            onCheckedChange={setShowRealtime}
          />
          <Label htmlFor="realtime" className="text-sm">
            실시간 로그 모니터링
          </Label>
        </div>
        {showRealtime && (
          <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>{" "}
            실시간 모니터링 중
          </Badge>
        )}
      </div>

      <Tabs defaultValue="api" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="api" className="flex items-center gap-1">
            <Database className="h-4 w-4" /> API 요청 로그
          </TabsTrigger>
          <TabsTrigger value="login" className="flex items-center gap-1">
            <User className="h-4 w-4" /> 로그인 로그
          </TabsTrigger>
          <TabsTrigger value="transaction" className="flex items-center gap-1">
            <CreditCard className="h-4 w-4" /> 트랜잭션 로그
          </TabsTrigger>
          <TabsTrigger value="error" className="flex items-center gap-1">
            <AlertCircle className="h-4 w-4" /> 시스템 에러 로그
          </TabsTrigger>
        </TabsList>

        <TabsContent value="api">
          <Card className="overflow-hidden">
            <ResponsiveTable
              data={filteredApiLogs}
              columns={apiColumns}
              emptyMessage="API 요청 로그가 없습니다."
            />
          </Card>
        </TabsContent>

        <TabsContent value="login">
          <Card className="overflow-hidden">
            <ResponsiveTable
              data={filteredLoginLogs}
              columns={loginColumns}
              emptyMessage="로그인 로그가 없습니다."
            />
          </Card>
        </TabsContent>

        <TabsContent value="transaction">
          <Card className="overflow-hidden">
            <ResponsiveTable
              data={filteredTransactionLogs}
              columns={transactionColumns}
              emptyMessage="트랜잭션 로그가 없습니다."
            />
          </Card>
        </TabsContent>

        <TabsContent value="error">
          <Card className="overflow-hidden">
            <ResponsiveTable
              data={filteredErrorLogs}
              columns={errorColumns}
              emptyMessage="시스템 에러 로그가 없습니다."
            />
          </Card>
        </TabsContent>
      </Tabs>

      {/* API 로그 상세 다이얼로그 */}
      <Dialog
        open={isDetailOpen && !!selectedApiLog}
        onOpenChange={(open) => !open && setSelectedApiLog(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>API 요청 로그 상세</DialogTitle>
            <DialogDescription>API 요청의 상세 정보입니다.</DialogDescription>
          </DialogHeader>

          {selectedApiLog && (
            <div className="py-4 space-y-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-semibold">ID</div>
                <div className="col-span-3">{selectedApiLog.id}</div>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-semibold">엔드포인트</div>
                <div className="col-span-3 font-mono text-sm">
                  {selectedApiLog.endpoint}
                </div>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-semibold">메서드</div>
                <div className="col-span-3">
                  <Badge variant="outline">{selectedApiLog.method}</Badge>
                </div>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-semibold">상태 코드</div>
                <div className="col-span-3">
                  {getStatusBadge(selectedApiLog.responseStatus)}
                </div>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-semibold">응답 시간</div>
                <div className="col-span-3">
                  {selectedApiLog.responseTimeMs}ms
                </div>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-semibold">IP 주소</div>
                <div className="col-span-3">{selectedApiLog.ipAddress}</div>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-semibold">사용자 ID</div>
                <div className="col-span-3">{selectedApiLog.userId}</div>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-semibold">추적 ID</div>
                <div className="col-span-3 font-mono text-sm">
                  {selectedApiLog.traceId}
                </div>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-semibold">시간</div>
                <div className="col-span-3">
                  {formatDate(selectedApiLog.timestamp)}
                </div>
              </div>

              {selectedApiLog.queryParams && (
                <div className="grid grid-cols-4 items-start gap-4">
                  <div className="font-semibold">쿼리 파라미터</div>
                  <div className="col-span-3 font-mono text-sm break-all bg-gray-50 p-2 rounded">
                    {selectedApiLog.queryParams}
                  </div>
                </div>
              )}

              {selectedApiLog.requestBody && (
                <div className="grid grid-cols-4 items-start gap-4">
                  <div className="font-semibold">요청 본문</div>
                  <div className="col-span-3 font-mono text-sm break-all bg-gray-50 p-2 rounded">
                    {selectedApiLog.requestBody}
                  </div>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedApiLog(null)}>
              닫기
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 로그인 로그 상세 다이얼로그 */}
      <Dialog
        open={isDetailOpen && !!selectedLoginLog}
        onOpenChange={(open) => !open && setSelectedLoginLog(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>로그인 로그 상세</DialogTitle>
            <DialogDescription>
              로그인 이벤트의 상세 정보입니다.
            </DialogDescription>
          </DialogHeader>

          {selectedLoginLog && (
            <div className="py-4 space-y-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-semibold">ID</div>
                <div className="col-span-3">{selectedLoginLog.id}</div>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-semibold">이벤트</div>
                <div className="col-span-3">
                  <Badge variant="outline">
                    {selectedLoginLog.event === "LOGIN" ? "로그인" : "로그아웃"}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-semibold">상태</div>
                <div className="col-span-3">
                  {getLoginStatusBadge(selectedLoginLog.success)}
                </div>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-semibold">사용자 ID</div>
                <div className="col-span-3">
                  {selectedLoginLog.userId || "-"}
                </div>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-semibold">판매자 ID</div>
                <div className="col-span-3">
                  {selectedLoginLog.merchantId || "-"}
                </div>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-semibold">IP 주소</div>
                <div className="col-span-3">{selectedLoginLog.ipAddress}</div>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-semibold">추적 ID</div>
                <div className="col-span-3 font-mono text-sm">
                  {selectedLoginLog.traceId}
                </div>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-semibold">시간</div>
                <div className="col-span-3">
                  {formatDate(selectedLoginLog.timestamp)}
                </div>
              </div>

              {selectedLoginLog.userAgent && (
                <div className="grid grid-cols-4 items-start gap-4">
                  <div className="font-semibold">사용자 에이전트</div>
                  <div className="col-span-3 text-sm break-all">
                    {selectedLoginLog.userAgent}
                  </div>
                </div>
              )}

              {selectedLoginLog.reason && (
                <div className="grid grid-cols-4 items-start gap-4">
                  <div className="font-semibold">실패 사유</div>
                  <div className="col-span-3 text-sm text-red-600">
                    {selectedLoginLog.reason}
                  </div>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedLoginLog(null)}>
              닫기
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 트랜잭션 로그 상세 다이얼로그 */}
      <Dialog
        open={isDetailOpen && !!selectedTransactionLog}
        onOpenChange={(open) => !open && setSelectedTransactionLog(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>트랜잭션 로그 상세</DialogTitle>
            <DialogDescription>트랜잭션의 상세 정보입니다.</DialogDescription>
          </DialogHeader>

          {selectedTransactionLog && (
            <div className="py-4 space-y-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-semibold">ID</div>
                <div className="col-span-3">{selectedTransactionLog.id}</div>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-semibold">유형</div>
                <div className="col-span-3">
                  {selectedTransactionLog.type &&
                    getTransactionTypeBadge(selectedTransactionLog.type)}
                </div>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-semibold">금액</div>
                <div className="col-span-3 font-medium">
                  {selectedTransactionLog.amount
                    ? new Intl.NumberFormat("ko-KR").format(
                        selectedTransactionLog.amount
                      )
                    : "-"}
                </div>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-semibold">상태</div>
                <div className="col-span-3">
                  {selectedTransactionLog.status &&
                    getTransactionStatusBadge(selectedTransactionLog.status)}
                </div>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-semibold">지갑 ID</div>
                <div className="col-span-3">
                  {selectedTransactionLog.walletId || "-"}
                </div>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-semibold">트랜잭션 해시</div>
                <div className="col-span-3 font-mono text-sm break-all">
                  {selectedTransactionLog.txHash || "-"}
                </div>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-semibold">추적 ID</div>
                <div className="col-span-3 font-mono text-sm">
                  {selectedTransactionLog.traceId}
                </div>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-semibold">시간</div>
                <div className="col-span-3">
                  {formatDate(selectedTransactionLog.timestamp)}
                </div>
              </div>

              {selectedTransactionLog.description && (
                <div className="grid grid-cols-4 items-start gap-4">
                  <div className="font-semibold">설명</div>
                  <div className="col-span-3 text-sm">
                    {selectedTransactionLog.description}
                  </div>
                </div>
              )}

              {selectedTransactionLog.failureReason && (
                <div className="grid grid-cols-4 items-start gap-4">
                  <div className="font-semibold">실패 사유</div>
                  <div className="col-span-3 text-sm text-red-600">
                    {selectedTransactionLog.failureReason}
                  </div>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setSelectedTransactionLog(null)}
            >
              닫기
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 에러 로그 상세 다이얼로그 */}
      <Dialog
        open={isDetailOpen && !!selectedErrorLog}
        onOpenChange={(open) => !open && setSelectedErrorLog(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>시스템 에러 로그 상세</DialogTitle>
            <DialogDescription>
              시스템 에러의 상세 정보입니다.
            </DialogDescription>
          </DialogHeader>

          {selectedErrorLog && (
            <div className="py-4 space-y-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-semibold">ID</div>
                <div className="col-span-3">{selectedErrorLog.id}</div>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-semibold">심각도</div>
                <div className="col-span-3">
                  {selectedErrorLog.severity &&
                    getSeverityBadge(selectedErrorLog.severity)}
                </div>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-semibold">엔드포인트</div>
                <div className="col-span-3 font-mono text-sm">
                  {selectedErrorLog.endpoint}
                </div>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-semibold">서버</div>
                <div className="col-span-3">
                  {selectedErrorLog.serverName || "-"}
                </div>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-semibold">사용자 ID</div>
                <div className="col-span-3">
                  {selectedErrorLog.userId || "-"}
                </div>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-semibold">추적 ID</div>
                <div className="col-span-3 font-mono text-sm">
                  {selectedErrorLog.traceId}
                </div>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-semibold">시간</div>
                <div className="col-span-3">
                  {formatDate(selectedErrorLog.timestamp)}
                </div>
              </div>

              {selectedErrorLog.errorMessage && (
                <div className="grid grid-cols-4 items-start gap-4">
                  <div className="font-semibold">에러 메시지</div>
                  <div className="col-span-3 text-sm text-red-600">
                    {selectedErrorLog.errorMessage}
                  </div>
                </div>
              )}

              {selectedErrorLog.stackTrace && (
                <div className="grid grid-cols-4 items-start gap-4">
                  <div className="font-semibold">스택 트레이스</div>
                  <div className="col-span-3 font-mono text-xs break-all bg-gray-50 p-2 rounded overflow-auto max-h-40">
                    {selectedErrorLog.stackTrace}
                  </div>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedErrorLog(null)}>
              닫기
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 로그 설정 다이얼로그 */}
      <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>로그 설정</DialogTitle>
            <DialogDescription>
              시스템 로그 설정을 관리합니다.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="retention">로그 보관 기간 (일)</Label>
              <Select
                value={logSettings.retention.toString()}
                onValueChange={(value) =>
                  setLogSettings({
                    ...logSettings,
                    retention: Number.parseInt(value),
                  })
                }
              >
                <SelectTrigger id="retention">
                  <SelectValue placeholder="보관 기간 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">7일</SelectItem>
                  <SelectItem value="14">14일</SelectItem>
                  <SelectItem value="30">30일</SelectItem>
                  <SelectItem value="60">60일</SelectItem>
                  <SelectItem value="90">90일</SelectItem>
                  <SelectItem value="180">180일</SelectItem>
                  <SelectItem value="365">365일</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">
                지정된 기간이 지난 로그는 자동으로 삭제됩니다.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="autoDelete">자동 삭제 활성화</Label>
                <Switch
                  id="autoDelete"
                  checked={logSettings.autoDeleteEnabled}
                  onCheckedChange={(checked) =>
                    setLogSettings({
                      ...logSettings,
                      autoDeleteEnabled: checked,
                    })
                  }
                />
              </div>
              <p className="text-sm text-muted-foreground">
                보관 기간이 지난 로그를 자동으로 삭제합니다.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="logLevel">로그 레벨</Label>
              <Select
                value={logSettings.logLevel}
                onValueChange={(value: any) =>
                  setLogSettings({ ...logSettings, logLevel: value })
                }
              >
                <SelectTrigger id="logLevel">
                  <SelectValue placeholder="로그 레벨 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TRACE">TRACE (모든 로그)</SelectItem>
                  <SelectItem value="DEBUG">DEBUG</SelectItem>
                  <SelectItem value="INFO">INFO</SelectItem>
                  <SelectItem value="WARN">WARN</SelectItem>
                  <SelectItem value="ERROR">ERROR (에러만)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">
                지정된 레벨 이상의 로그만 저장합니다.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="notification">알림 활성화</Label>
                <Switch
                  id="notification"
                  checked={logSettings.notificationEnabled}
                  onCheckedChange={(checked) =>
                    setLogSettings({
                      ...logSettings,
                      notificationEnabled: checked,
                    })
                  }
                />
              </div>
              <p className="text-sm text-muted-foreground">
                중요 로그 발생 시 알림을 받습니다.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="errorOnly">에러 로그만 알림</Label>
                <Switch
                  id="errorOnly"
                  checked={logSettings.errorNotificationOnly}
                  onCheckedChange={(checked) =>
                    setLogSettings({
                      ...logSettings,
                      errorNotificationOnly: checked,
                    })
                  }
                  disabled={!logSettings.notificationEnabled}
                />
              </div>
              <p className="text-sm text-muted-foreground">
                에러 로그에 대해서만 알림을 받습니다.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSettingsOpen(false)}>
              취소
            </Button>
            <Button onClick={handleSaveSettings}>저장</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
