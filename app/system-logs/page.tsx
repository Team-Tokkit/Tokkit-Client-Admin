// // 로그인 로그, 시스템 에러 로그 - 시스템 로그
// // 트랜잭션 로그 - 결제 관리

// "use client";

// import { useState, useEffect } from "react";
// import { Card } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogDescription,
//   DialogFooter,
// } from "@/components/ui/dialog";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { ResponsiveTable } from "@/components/responsive-table";
// import {
//   Search,
//   RefreshCcw,
//   Download,
//   Settings,
//   AlertTriangle,
//   AlertCircle,
//   Info,
//   XCircle,
//   User,
// } from "lucide-react";

// interface LogSettings {
//   retention: number;
//   autoDeleteEnabled: boolean;
//   notificationEnabled: boolean;
//   errorNotificationOnly: boolean;
//   logLevel: "INFO" | "WARN" | "ERROR" | "DEBUG" | "TRACE";
// }

// export default function SystemLogPage() {
//   const [activeTab, setActiveTab] = useState("login");

//   // 로그인 로그 상태
//   const [loginLogs, setLoginLogs] = useState<LoginLog[]>([]);
//   const [filteredLoginLogs, setFilteredLoginLogs] = useState<LoginLog[]>([]);
//   const [loginSearchParams, setLoginSearchParams] = useState({
//     keyword: "",
//     event: "all",
//     success: "all",
//     dateRange: "all",
//   });
//   const [selectedLoginLog, setSelectedLoginLog] = useState<LoginLog | null>(
//     null
//   );

//   // 시스템 에러 로그 상태
//   const [errorLogs, setErrorLogs] = useState<SystemErrorLog[]>([]);
//   const [filteredErrorLogs, setFilteredErrorLogs] = useState<SystemErrorLog[]>(
//     []
//   );
//   const [errorSearchParams, setErrorSearchParams] = useState({
//     keyword: "",
//     severity: "all",
//     dateRange: "all",
//   });
//   const [selectedErrorLog, setSelectedErrorLog] =
//     useState<SystemErrorLog | null>(null);

//   // 공통 상태
//   const [isLoading, setIsLoading] = useState(true);
//   const [isDetailOpen, setIsDetailOpen] = useState(false);
//   const [isSettingsOpen, setIsSettingsOpen] = useState(false);
//   const [logSettings, setLogSettings] = useState<LogSettings>({
//     retention: 30,
//     autoDeleteEnabled: true,
//     notificationEnabled: true,
//     errorNotificationOnly: true,
//     logLevel: "INFO",
//   });
//   const [showRealtime, setShowRealtime] = useState(false);

//   // 컴포넌트 마운트 시 데이터 로드
//   useEffect(() => {
//     fetchLogs();
//   }, []);

//   // 탭 변경 시 필터링 초기화
//   useEffect(() => {
//     filterLogs();
//   }, [activeTab, loginSearchParams, errorSearchParams, loginLogs, errorLogs]);

//   useEffect(() => {
//     let interval: NodeJS.Timeout | null = null;

//     if (showRealtime) {
//       interval = setInterval(() => {
//         const randomLogType = Math.floor(Math.random() * 4);

//         switch (randomLogType) {
//           case 0: // 로그인 로그
//             const newLoginLog: LoginLog = {
//               id: Date.now(),
//               createdAt: new Date().toISOString(),
//               updatedAt: new Date().toISOString(),
//               event: Math.random() > 0.3 ? "LOGIN" : "LOGOUT",
//               ipAddress: `192.168.1.${Math.floor(Math.random() * 255)}`,
//               userId: Math.floor(Math.random() * 5) + 1,
//               success: Math.random() > 0.2,
//               timestamp: new Date().toISOString(),
//               userAgent:
//                 "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
//             };
//             setLoginLogs((prev) => [newLoginLog, ...prev]);
//             break;

//           case 1: // 에러 로그
//             const severities = ["INFO", "WARN", "ERROR", "FATAL"];
//             const newErrorLog: SystemErrorLog = {
//               id: Date.now(),
//               createdAt: new Date().toISOString(),
//               updatedAt: new Date().toISOString(),
//               endpoint: [
//                 "/api/v1/users",
//                 "/api/v1/transactions",
//                 "/api/v1/auth/login",
//               ][Math.floor(Math.random() * 3)],
//               errorMessage: "자동 생성된 에러 메시지",
//               serverName: `server-${Math.floor(Math.random() * 5) + 1}`,
//               severity: severities[
//                 Math.floor(Math.random() * severities.length)
//               ] as any,
//               timestamp: new Date().toISOString(),
//               userId: Math.floor(Math.random() * 5) + 1,
//             };
//             setErrorLogs((prev) => [newErrorLog, ...prev]);
//             break;
//         }
//       }, 5000);
//     }

//     return () => {
//       if (interval) clearInterval(interval);
//     };
//   }, [showRealtime]);

//   // 로그 데이터 조회
//   const fetchLogs = async () => {
//     setIsLoading(true);
//     try {
//       // 더미 데이터 사용
//       setTimeout(() => {
//         setLoginLogs(mockLoginLogs);
//         setErrorLogs(mockSystemErrorLogs);
//         setIsLoading(false);
//       }, 500);
//     } catch (error) {
//       console.error("로그 데이터 로딩 중 오류 발생:", error);
//       setIsLoading(false);
//     }
//   };

//   // 로그 필터링
//   const filterLogs = () => {
//     // 로그인 로그 필터링
//     let filteredLogin = [...loginLogs];
//     if (loginSearchParams.keyword) {
//       const keyword = loginSearchParams.keyword.toLowerCase();
//       filteredLogin = filteredLogin.filter(
//         (log) =>
//           log.ipAddress.includes(keyword) ||
//           log.traceId.toLowerCase().includes(keyword) ||
//           (log.userAgent && log.userAgent.toLowerCase().includes(keyword))
//       );
//     }
//     if (loginSearchParams.event !== "all") {
//       filteredLogin = filteredLogin.filter(
//         (log) => log.event === loginSearchParams.event
//       );
//     }
//     if (loginSearchParams.success !== "all") {
//       filteredLogin = filteredLogin.filter(
//         (log) => log.success === (loginSearchParams.success === "success")
//       );
//     }
//     if (loginSearchParams.dateRange !== "all") {
//       filteredLogin = filterByDateRange(
//         filteredLogin,
//         loginSearchParams.dateRange
//       );
//     }
//     setFilteredLoginLogs(filteredLogin);

//     // 에러 로그 필터링
//     let filteredError = [...errorLogs];
//     if (errorSearchParams.keyword) {
//       const keyword = errorSearchParams.keyword.toLowerCase();
//       filteredError = filteredError.filter(
//         (log) =>
//           log.endpoint.toLowerCase().includes(keyword) ||
//           (log.errorMessage &&
//             log.errorMessage.toLowerCase().includes(keyword)) ||
//           (log.serverName && log.serverName.toLowerCase().includes(keyword)) ||
//           log.traceId.toLowerCase().includes(keyword)
//       );
//     }
//     if (errorSearchParams.severity !== "all") {
//       filteredError = filteredError.filter(
//         (log) => log.severity === errorSearchParams.severity
//       );
//     }
//     if (errorSearchParams.dateRange !== "all") {
//       filteredError = filterByDateRange(
//         filteredError,
//         errorSearchParams.dateRange
//       );
//     }
//     setFilteredErrorLogs(filteredError);
//   };

//   // 날짜 범위로 필터링하는 헬퍼 함수
//   const filterByDateRange = <T extends { timestamp: string }>(
//     logs: T[],
//     dateRange: string
//   ): T[] => {
//     const now = new Date();
//     const filterDate = new Date();

//     switch (dateRange) {
//       case "hour":
//         filterDate.setHours(now.getHours() - 1);
//         break;
//       case "today":
//         filterDate.setHours(0, 0, 0, 0);
//         break;
//       case "week":
//         filterDate.setDate(now.getDate() - 7);
//         break;
//       case "month":
//         filterDate.setMonth(now.getMonth() - 1);
//         break;
//     }

//     return logs.filter((log) => {
//       const logDate = new Date(log.timestamp);
//       return logDate >= filterDate;
//     });
//   };

//   // 검색 파라미터 변경 핸들러
//   const handleLoginSearchParamChange = (name: string, value: string) => {
//     setLoginSearchParams((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleErrorSearchParamChange = (name: string, value: string) => {
//     setErrorSearchParams((prev) => ({ ...prev, [name]: value }));
//   };

//   // 로그 상세 보기
//   const handleViewLog = (log: any, type: string) => {
//     switch (type) {
//       case "login":
//         setSelectedLoginLog(log);
//         break;
//       case "error":
//         setSelectedErrorLog(log);
//         break;
//     }
//     setIsDetailOpen(true);
//   };

//   // 날짜 포맷 함수
//   const formatDate = (dateString: string) => {
//     const date = new Date(dateString);
//     return date.toLocaleDateString("ko-KR", {
//       year: "numeric",
//       month: "2-digit",
//       day: "2-digit",
//       hour: "2-digit",
//       minute: "2-digit",
//       second: "2-digit",
//     });
//   };

//   // 로그인 성공/실패 배지
//   const getLoginStatusBadge = (success: boolean) => {
//     return success ? (
//       <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
//         성공
//       </Badge>
//     ) : (
//       <Badge className="bg-red-100 text-red-800 hover:bg-red-100">실패</Badge>
//     );
//   };

//   // 에러 심각도 배지
//   const getSeverityBadge = (severity: string) => {
//     switch (severity) {
//       case "INFO":
//         return (
//           <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 flex items-center gap-1">
//             <Info className="h-3 w-3" /> INFO
//           </Badge>
//         );
//       case "WARN":
//         return (
//           <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 flex items-center gap-1">
//             <AlertTriangle className="h-3 w-3" /> WARN
//           </Badge>
//         );
//       case "ERROR":
//         return (
//           <Badge className="bg-red-100 text-red-800 hover:bg-red-100 flex items-center gap-1">
//             <AlertCircle className="h-3 w-3" /> ERROR
//           </Badge>
//         );
//       case "FATAL":
//         return (
//           <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100 flex items-center gap-1">
//             <XCircle className="h-3 w-3" /> FATAL
//           </Badge>
//         );
//       default:
//         return <Badge>{severity}</Badge>;
//     }
//   };

//   // 로그인 로그 테이블 컬럼
//   const loginColumns = [
//     {
//       key: "event",
//       header: "이벤트",
//       cell: (log: LoginLog) => (
//         <Badge variant="outline">
//           {log.event === "LOGIN" ? "로그인" : "로그아웃"}
//         </Badge>
//       ),
//     },
//     {
//       key: "status",
//       header: "상태",
//       cell: (log: LoginLog) => getLoginStatusBadge(log.success),
//     },
//     {
//       key: "userId",
//       header: "사용자 ID",
//       cell: (log: LoginLog) => log.userId || log.merchantId || "-",
//     },
//     {
//       key: "ipAddress",
//       header: "IP 주소",
//       cell: (log: LoginLog) => log.ipAddress,
//       hideOnMobile: true,
//     },
//     {
//       key: "timestamp",
//       header: "시간",
//       cell: (log: LoginLog) => formatDate(log.timestamp),
//     },
//     {
//       key: "actions",
//       header: "",
//       cell: (log: LoginLog) => (
//         <Button
//           variant="ghost"
//           size="sm"
//           onClick={() => handleViewLog(log, "login")}
//         >
//           상세
//         </Button>
//       ),
//       className: "text-right",
//     },
//   ];

//   // 에러 로그 테이블 컬럼
//   const errorColumns = [
//     {
//       key: "severity",
//       header: "심각도",
//       cell: (log: SystemErrorLog) =>
//         log.severity && getSeverityBadge(log.severity),
//     },
//     {
//       key: "endpoint",
//       header: "엔드포인트",
//       cell: (log: SystemErrorLog) => log.endpoint,
//     },
//     {
//       key: "errorMessage",
//       header: "에러 메시지",
//       cell: (log: SystemErrorLog) => (
//         <div className="max-w-xs truncate">{log.errorMessage || "-"}</div>
//       ),
//     },
//     {
//       key: "serverName",
//       header: "서버",
//       cell: (log: SystemErrorLog) => log.serverName || "-",
//       hideOnMobile: true,
//     },
//     {
//       key: "timestamp",
//       header: "시간",
//       cell: (log: SystemErrorLog) => formatDate(log.timestamp),
//     },
//     {
//       key: "actions",
//       header: "",
//       cell: (log: SystemErrorLog) => (
//         <Button
//           variant="ghost"
//           size="sm"
//           onClick={() => handleViewLog(log, "error")}
//         >
//           상세
//         </Button>
//       ),
//       className: "text-right",
//     },
//   ];

//   return (
//     <div className="space-y-6">
//       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//         <h1 className="text-2xl font-bold">시스템 로그</h1>
//         <div className="flex flex-col md:flex-row gap-2">
//           <div className="relative">
//             <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
//             <Input
//               type="search"
//               placeholder="로그 검색..."
//               className="pl-8 w-full md:w-[250px]"
//               value={
//                 activeTab === "login"
//                   ? loginSearchParams.keyword
//                   : errorSearchParams.keyword
//               }
//               onChange={(e) => {
//                 const value = e.target.value;
//                 if (activeTab === "login")
//                   handleLoginSearchParamChange("keyword", value);
//                 else handleErrorSearchParamChange("keyword", value);
//               }}
//             />
//           </div>
//           <div className="flex flex-wrap gap-2">
//             <Select
//               value={
//                 activeTab === "login"
//                   ? loginSearchParams.dateRange
//                   : errorSearchParams.dateRange
//               }
//               onValueChange={(value) => {
//                 if (activeTab === "login")
//                   handleLoginSearchParamChange("dateRange", value);
//                 else handleErrorSearchParamChange("dateRange", value);
//               }}
//             >
//               <SelectTrigger className="w-[130px]">
//                 <SelectValue placeholder="기간" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="all">전체 기간</SelectItem>
//                 <SelectItem value="hour">최근 1시간</SelectItem>
//                 <SelectItem value="today">오늘</SelectItem>
//                 <SelectItem value="week">최근 7일</SelectItem>
//               </SelectContent>
//             </Select>

//             {/* 로그인 로그 필터 */}
//             {activeTab === "login" && (
//               <>
//                 <Select
//                   value={loginSearchParams.event}
//                   onValueChange={(value) =>
//                     handleLoginSearchParamChange("event", value)
//                   }
//                 >
//                   <SelectTrigger className="w-[130px]">
//                     <SelectValue placeholder="이벤트" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="all">모든 이벤트</SelectItem>
//                     <SelectItem value="LOGIN">로그인</SelectItem>
//                     <SelectItem value="LOGOUT">로그아웃</SelectItem>
//                   </SelectContent>
//                 </Select>
//                 <Select
//                   value={loginSearchParams.success}
//                   onValueChange={(value) =>
//                     handleLoginSearchParamChange("success", value)
//                   }
//                 >
//                   <SelectTrigger className="w-[130px]">
//                     <SelectValue placeholder="상태" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="all">모든 상태</SelectItem>
//                     <SelectItem value="success">성공</SelectItem>
//                     <SelectItem value="failure">실패</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </>
//             )}

//             {/* 에러 로그 필터 */}
//             {activeTab === "error" && (
//               <Select
//                 value={errorSearchParams.severity}
//                 onValueChange={(value) =>
//                   handleErrorSearchParamChange("severity", value)
//                 }
//               >
//                 <SelectTrigger className="w-[130px]">
//                   <SelectValue placeholder="심각도" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="all">모든 심각도</SelectItem>
//                   <SelectItem value="INFO">INFO</SelectItem>
//                   <SelectItem value="WARN">WARN</SelectItem>
//                   <SelectItem value="ERROR">ERROR</SelectItem>
//                   <SelectItem value="FATAL">FATAL</SelectItem>
//                 </SelectContent>
//               </Select>
//             )}
//           </div>
//           <Button variant="outline" className="gap-1" onClick={fetchLogs}>
//             <RefreshCcw className="h-4 w-4" /> 새로고침
//           </Button>
//         </div>
//       </div>

//       <Tabs defaultValue="api" value={activeTab} onValueChange={setActiveTab}>
//         <TabsList>
//           <TabsTrigger value="login" className="flex items-center gap-1">
//             <User className="h-4 w-4" /> 로그인 로그
//           </TabsTrigger>
//           <TabsTrigger value="error" className="flex items-center gap-1">
//             <AlertCircle className="h-4 w-4" /> 시스템 에러 로그
//           </TabsTrigger>
//         </TabsList>

//         <TabsContent value="login">
//           <Card className="overflow-hidden">
//             <ResponsiveTable
//               data={filteredLoginLogs}
//               columns={loginColumns}
//               emptyMessage="로그인 로그가 없습니다."
//             />
//           </Card>
//         </TabsContent>

//         <TabsContent value="error">
//           <Card className="overflow-hidden">
//             <ResponsiveTable
//               data={filteredErrorLogs}
//               columns={errorColumns}
//               emptyMessage="시스템 에러 로그가 없습니다."
//             />
//           </Card>
//         </TabsContent>
//       </Tabs>

//       {/* 로그인 로그 상세 다이얼로그 */}
//       <Dialog
//         open={isDetailOpen && !!selectedLoginLog}
//         onOpenChange={(open) => !open && setSelectedLoginLog(null)}
//       >
//         <DialogContent className="sm:max-w-md">
//           <DialogHeader>
//             <DialogTitle>로그인 로그 상세</DialogTitle>
//             <DialogDescription>
//               로그인 이벤트의 상세 정보입니다.
//             </DialogDescription>
//           </DialogHeader>

//           {selectedLoginLog && (
//             <div className="py-4 space-y-4">
//               <div className="grid grid-cols-4 items-center gap-4">
//                 <div className="font-semibold">ID</div>
//                 <div className="col-span-3">{selectedLoginLog.id}</div>
//               </div>

//               <div className="grid grid-cols-4 items-center gap-4">
//                 <div className="font-semibold">이벤트</div>
//                 <div className="col-span-3">
//                   <Badge variant="outline">
//                     {selectedLoginLog.event === "LOGIN" ? "로그인" : "로그아웃"}
//                   </Badge>
//                 </div>
//               </div>

//               <div className="grid grid-cols-4 items-center gap-4">
//                 <div className="font-semibold">상태</div>
//                 <div className="col-span-3">
//                   {getLoginStatusBadge(selectedLoginLog.success)}
//                 </div>
//               </div>

//               <div className="grid grid-cols-4 items-center gap-4">
//                 <div className="font-semibold">사용자 ID</div>
//                 <div className="col-span-3">
//                   {selectedLoginLog.userId || "-"}
//                 </div>
//               </div>

//               <div className="grid grid-cols-4 items-center gap-4">
//                 <div className="font-semibold">판매자 ID</div>
//                 <div className="col-span-3">
//                   {selectedLoginLog.merchantId || "-"}
//                 </div>
//               </div>

//               <div className="grid grid-cols-4 items-center gap-4">
//                 <div className="font-semibold">IP 주소</div>
//                 <div className="col-span-3">{selectedLoginLog.ipAddress}</div>
//               </div>

//               <div className="grid grid-cols-4 items-center gap-4">
//                 <div className="font-semibold">추적 ID</div>
//                 <div className="col-span-3 font-mono text-sm">
//                   {selectedLoginLog.traceId}
//                 </div>
//               </div>

//               <div className="grid grid-cols-4 items-center gap-4">
//                 <div className="font-semibold">시간</div>
//                 <div className="col-span-3">
//                   {formatDate(selectedLoginLog.timestamp)}
//                 </div>
//               </div>

//               {selectedLoginLog.userAgent && (
//                 <div className="grid grid-cols-4 items-start gap-4">
//                   <div className="font-semibold">사용자 에이전트</div>
//                   <div className="col-span-3 text-sm break-all">
//                     {selectedLoginLog.userAgent}
//                   </div>
//                 </div>
//               )}

//               {selectedLoginLog.reason && (
//                 <div className="grid grid-cols-4 items-start gap-4">
//                   <div className="font-semibold">실패 사유</div>
//                   <div className="col-span-3 text-sm text-red-600">
//                     {selectedLoginLog.reason}
//                   </div>
//                 </div>
//               )}
//             </div>
//           )}

//           <DialogFooter>
//             <Button variant="outline" onClick={() => setSelectedLoginLog(null)}>
//               닫기
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       {/* 에러 로그 상세 다이얼로그 */}
//       <Dialog
//         open={isDetailOpen && !!selectedErrorLog}
//         onOpenChange={(open) => !open && setSelectedErrorLog(null)}
//       >
//         <DialogContent className="sm:max-w-md">
//           <DialogHeader>
//             <DialogTitle>시스템 에러 로그 상세</DialogTitle>
//             <DialogDescription>
//               시스템 에러의 상세 정보입니다.
//             </DialogDescription>
//           </DialogHeader>

//           {selectedErrorLog && (
//             <div className="py-4 space-y-4">
//               <div className="grid grid-cols-4 items-center gap-4">
//                 <div className="font-semibold">ID</div>
//                 <div className="col-span-3">{selectedErrorLog.id}</div>
//               </div>

//               <div className="grid grid-cols-4 items-center gap-4">
//                 <div className="font-semibold">심각도</div>
//                 <div className="col-span-3">
//                   {selectedErrorLog.severity &&
//                     getSeverityBadge(selectedErrorLog.severity)}
//                 </div>
//               </div>

//               <div className="grid grid-cols-4 items-center gap-4">
//                 <div className="font-semibold">엔드포인트</div>
//                 <div className="col-span-3 font-mono text-sm">
//                   {selectedErrorLog.endpoint}
//                 </div>
//               </div>

//               <div className="grid grid-cols-4 items-center gap-4">
//                 <div className="font-semibold">서버</div>
//                 <div className="col-span-3">
//                   {selectedErrorLog.serverName || "-"}
//                 </div>
//               </div>

//               <div className="grid grid-cols-4 items-center gap-4">
//                 <div className="font-semibold">사용자 ID</div>
//                 <div className="col-span-3">
//                   {selectedErrorLog.userId || "-"}
//                 </div>
//               </div>

//               <div className="grid grid-cols-4 items-center gap-4">
//                 <div className="font-semibold">추적 ID</div>
//                 <div className="col-span-3 font-mono text-sm">
//                   {selectedErrorLog.traceId}
//                 </div>
//               </div>

//               <div className="grid grid-cols-4 items-center gap-4">
//                 <div className="font-semibold">시간</div>
//                 <div className="col-span-3">
//                   {formatDate(selectedErrorLog.timestamp)}
//                 </div>
//               </div>

//               {selectedErrorLog.errorMessage && (
//                 <div className="grid grid-cols-4 items-start gap-4">
//                   <div className="font-semibold">에러 메시지</div>
//                   <div className="col-span-3 text-sm text-red-600">
//                     {selectedErrorLog.errorMessage}
//                   </div>
//                 </div>
//               )}

//               {selectedErrorLog.stackTrace && (
//                 <div className="grid grid-cols-4 items-start gap-4">
//                   <div className="font-semibold">스택 트레이스</div>
//                   <div className="col-span-3 font-mono text-xs break-all bg-gray-50 p-2 rounded overflow-auto max-h-40">
//                     {selectedErrorLog.stackTrace}
//                   </div>
//                 </div>
//               )}
//             </div>
//           )}

//           <DialogFooter>
//             <Button variant="outline" onClick={() => setSelectedErrorLog(null)}>
//               닫기
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }
