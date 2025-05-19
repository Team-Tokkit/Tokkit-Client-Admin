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
// import { toast } from "@/components/ui/use-toast";
// import { ResponsiveTable } from "./responsive-table";
// import {
//   Search,
//   ShieldAlert,
//   ShieldCheck,
//   RefreshCcw,
//   Download,
//   XCircle,
//   UserX,
//   CheckCircle,
//   AlertTriangle,
//   Lock,
//   Unlock,
//   Key,
//   KeyRound,
// } from "lucide-react";

// // 인증 관련 타입 정의
// interface AuthEvent {
//   id: string;
//   traceId: string;
//   userId: string;
//   userName: string;
//   userEmail: string;
//   eventType:
//     | "LOGIN"
//     | "LOGOUT"
//     | "PASSWORD_RESET"
//     | "PASSWORD_CHANGE"
//     | "2FA_ENABLE"
//     | "2FA_DISABLE"
//     | "ACCOUNT_LOCK"
//     | "ACCOUNT_UNLOCK"
//     | "TOKEN_REFRESH"
//     | "LOGIN_FAILED";
//   status: "SUCCESS" | "FAILED" | "PENDING";
//   ipAddress: string;
//   userAgent: string;
//   timestamp: string;
//   details?: string;
//   failReason?: string;
//   location?: string;
// }

// interface User {
//   id: string;
//   name: string;
//   email: string;
//   role: "ADMIN" | "USER" | "MERCHANT";
//   status: "ACTIVE" | "INACTIVE" | "LOCKED";
//   lastLogin?: string;
//   loginAttempts: number;
//   is2FAEnabled: boolean;
//   createdAt: string;
// }

// export function AuthContent() {
//   const [authEvents, setAuthEvents] = useState<AuthEvent[]>([]);
//   const [filteredEvents, setFilteredEvents] = useState<AuthEvent[]>([]);
//   const [users, setUsers] = useState<User[]>([]);
//   const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [activeTab, setActiveTab] = useState("events");
//   const [searchParams, setSearchParams] = useState({
//     keyword: "",
//     eventType: "all",
//     status: "all",
//     dateRange: "all",
//   });
//   const [userSearchParams, setUserSearchParams] = useState({
//     keyword: "",
//     role: "all",
//     status: "all",
//   });
//   const [selectedEvent, setSelectedEvent] = useState<AuthEvent | null>(null);
//   const [selectedUser, setSelectedUser] = useState<User | null>(null);
//   const [isEventDetailOpen, setIsEventDetailOpen] = useState(false);
//   const [isUserDetailOpen, setIsUserDetailOpen] = useState(false);

//   // 컴포넌트 마운트 시 데이터 로드
//   useEffect(() => {
//     if (activeTab === "events") {
//       fetchAuthEvents();
//     } else if (activeTab === "users") {
//       fetchUsers();
//     }
//   }, [activeTab]);

//   // 검색 파라미터 변경 시 필터링
//   useEffect(() => {
//     if (activeTab === "events") {
//       filterAuthEvents();
//     } else if (activeTab === "users") {
//       filterUsers();
//     }
//   }, [searchParams, userSearchParams, authEvents, users, activeTab]);

//   // 인증 이벤트 조회
//   const fetchAuthEvents = async () => {
//     setIsLoading(true);
//     try {
//       /*
//       // TODO: API 연동 코드 (나중에 주석 해제하면 바로 적용 가능)
//       const response = await api.get<AuthEvent[]>('/auth/events');
//       setAuthEvents(response);
//       */

//       // 더미 데이터 사용
//       setTimeout(() => {
//         setAuthEvents(mockAuthEvents);
//         setIsLoading(false);
//       }, 500);
//     } catch (error) {
//       console.error("인증 이벤트 데이터 로딩 중 오류 발생:", error);
//       setIsLoading(false);
//     }
//   };

//   // 사용자 목록 조회
//   const fetchUsers = async () => {
//     setIsLoading(true);
//     try {
//       /*
//       // TODO: API 연동 코드 (나중에 주석 해제하면 바로 적용 가능)
//       const response = await api.get<User[]>('/users');
//       setUsers(response);
//       */

//       // 더미 데이터 사용
//       setTimeout(() => {
//         setUsers(mockUsers);
//         setIsLoading(false);
//       }, 500);
//     } catch (error) {
//       console.error("사용자 데이터 로딩 중 오류 발생:", error);
//       setIsLoading(false);
//     }
//   };

//   // 인증 이벤트 필터링
//   const filterAuthEvents = () => {
//     let filtered = [...authEvents];

//     // 키워드 검색
//     if (searchParams.keyword) {
//       const keyword = searchParams.keyword.toLowerCase();
//       filtered = filtered.filter(
//         (event) =>
//           event.userName.toLowerCase().includes(keyword) ||
//           event.userEmail.toLowerCase().includes(keyword) ||
//           event.ipAddress.includes(keyword) ||
//           (event.details && event.details.toLowerCase().includes(keyword))
//       );
//     }

//     // 이벤트 타입 필터링
//     if (searchParams.eventType !== "all") {
//       filtered = filtered.filter(
//         (event) => event.eventType === searchParams.eventType
//       );
//     }

//     // 상태 필터링
//     if (searchParams.status !== "all") {
//       filtered = filtered.filter(
//         (event) => event.status === searchParams.status
//       );
//     }

//     // 날짜 필터링
//     if (searchParams.dateRange !== "all") {
//       const now = new Date();
//       const filterDate = new Date();

//       switch (searchParams.dateRange) {
//         case "today":
//           filterDate.setDate(now.getDate() - 1);
//           break;
//         case "week":
//           filterDate.setDate(now.getDate() - 7);
//           break;
//         case "month":
//           filterDate.setMonth(now.getMonth() - 1);
//           break;
//       }

//       filtered = filtered.filter((event) => {
//         const eventDate = new Date(event.timestamp);
//         return eventDate >= filterDate;
//       });
//     }

//     setFilteredEvents(filtered);
//   };

//   // 사용자 필터링
//   const filterUsers = () => {
//     let filtered = [...users];

//     // 키워드 검색
//     if (userSearchParams.keyword) {
//       const keyword = userSearchParams.keyword.toLowerCase();
//       filtered = filtered.filter(
//         (user) =>
//           user.name.toLowerCase().includes(keyword) ||
//           user.email.toLowerCase().includes(keyword) ||
//           user.id.toLowerCase().includes(keyword)
//       );
//     }

//     // 역할 필터링
//     if (userSearchParams.role !== "all") {
//       filtered = filtered.filter((user) => user.role === userSearchParams.role);
//     }

//     // 상태 필터링
//     if (userSearchParams.status !== "all") {
//       filtered = filtered.filter(
//         (user) => user.status === userSearchParams.status
//       );
//     }

//     setFilteredUsers(filtered);
//   };

//   // 탭 변경 핸들러
//   const handleTabChange = (value: string) => {
//     setActiveTab(value);
//   };

//   // 검색 파라미터 변경 핸들러
//   const handleSearchParamChange = (name: string, value: string) => {
//     setSearchParams((prev) => ({ ...prev, [name]: value }));
//   };

//   // 사용자 검색 파라미터 변경 핸들러
//   const handleUserSearchParamChange = (name: string, value: string) => {
//     setUserSearchParams((prev) => ({ ...prev, [name]: value }));
//   };

//   // 인증 이벤트 상세 보기
//   const handleViewEvent = (event: AuthEvent) => {
//     setSelectedEvent(event);
//     setIsEventDetailOpen(true);
//   };

//   // 사용자 상세 보기
//   const handleViewUser = (user: User) => {
//     setSelectedUser(user);
//     setIsUserDetailOpen(true);
//   };

//   // 사용자 계정 잠금/해제
//   const handleToggleUserLock = async (user: User) => {
//     const newStatus = user.status === "LOCKED" ? "ACTIVE" : "LOCKED";

//     try {
//       /*
//       // TODO: API 연동 코드 (나중에 주석 해제하면 바로 적용 가능)
//       await api.patch(`/users/${user.id}/status`, {
//         status: newStatus,
//         traceId
//       });
//       */

//       // 임시 상태 업데이트
//       const updatedUsers = users.map((u) =>
//         u.id === user.id
//           ? { ...u, status: newStatus as "ACTIVE" | "INACTIVE" | "LOCKED" }
//           : u
//       );
//       setUsers(updatedUsers);

//       // 이벤트 로깅
//       const newEvent: AuthEvent = {
//         id: `evt-${Date.now()}`,
//         userId: user.id,
//         userName: user.name,
//         userEmail: user.email,
//         eventType: newStatus === "LOCKED" ? "ACCOUNT_LOCK" : "ACCOUNT_UNLOCK",
//         status: "SUCCESS",
//         ipAddress: "127.0.0.1",
//         userAgent: "Admin Dashboard",
//         timestamp: new Date().toISOString(),
//         details: `${
//           newStatus === "LOCKED" ? "계정 잠금" : "계정 잠금 해제"
//         } 처리됨 (관리자에 의해)`,
//       };
//       setAuthEvents((prev) => [newEvent, ...prev]);

//       toast({
//         title: "성공",
//         description: `${user.name} 사용자 계정이 ${
//           newStatus === "LOCKED" ? "잠금" : "잠금 해제"
//         } 처리되었습니다.`,
//       });

//       if (selectedUser && selectedUser.id === user.id) {
//         setSelectedUser({
//           ...selectedUser,
//           status: newStatus as "ACTIVE" | "INACTIVE" | "LOCKED",
//         });
//       }
//     } catch (error) {
//       console.error("사용자 상태 변경 중 오류 발생:", error);
//       toast({
//         title: "오류",
//         description: "사용자 상태 변경 중 문제가 발생했습니다.",
//         variant: "destructive",
//       });
//     }
//   };

//   // 2FA 토글
//   const handleToggle2FA = async (user: User) => {
//     const new2FAStatus = !user.is2FAEnabled;
//     const traceId = generateTraceId();

//     try {
//       /*
//       // TODO: API 연동 코드 (나중에 주석 해제하면 바로 적용 가능)
//       await api.patch(`/users/${user.id}/2fa`, {
//         enabled: new2FAStatus,
//         traceId
//       });
//       */

//       // 임시 상태 업데이트
//       const updatedUsers = users.map((u) =>
//         u.id === user.id ? { ...u, is2FAEnabled: new2FAStatus } : u
//       );
//       setUsers(updatedUsers);

//       // 이벤트 로깅
//       const newEvent: AuthEvent = {
//         id: `evt-${Date.now()}`,
//         traceId,
//         userId: user.id,
//         userName: user.name,
//         userEmail: user.email,
//         eventType: new2FAStatus ? "2FA_ENABLE" : "2FA_DISABLE",
//         status: "SUCCESS",
//         ipAddress: "127.0.0.1",
//         userAgent: "Admin Dashboard",
//         timestamp: new Date().toISOString(),
//         details: `2단계 인증이 ${
//           new2FAStatus ? "활성화" : "비활성화"
//         } 처리됨 (관리자에 의해)`,
//       };
//       setAuthEvents((prev) => [newEvent, ...prev]);

//       toast({
//         title: "성공",
//         description: `${user.name} 사용자의 2단계 인증이 ${
//           new2FAStatus ? "활성화" : "비활성화"
//         } 되었습니다.`,
//       });

//       if (selectedUser && selectedUser.id === user.id) {
//         setSelectedUser({ ...selectedUser, is2FAEnabled: new2FAStatus });
//       }
//     } catch (error) {
//       console.error("2FA 상태 변경 중 오류 발생:", error);
//       toast({
//         title: "오류",
//         description: "2FA 상태 변경 중 문제가 발생했습니다.",
//         variant: "destructive",
//       });
//     }
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

//   // 이벤트 타입 아이콘 및 텍스트
//   const getEventTypeDisplay = (eventType: string) => {
//     switch (eventType) {
//       case "LOGIN":
//         return (
//           <div className="flex items-center">
//             <CheckCircle className="h-4 w-4 mr-1 text-green-500" />
//             <span>로그인</span>
//           </div>
//         );
//       case "LOGOUT":
//         return (
//           <div className="flex items-center">
//             <XCircle className="h-4 w-4 mr-1 text-gray-500" />
//             <span>로그아웃</span>
//           </div>
//         );
//       case "PASSWORD_RESET":
//         return (
//           <div className="flex items-center">
//             <Key className="h-4 w-4 mr-1 text-blue-500" />
//             <span>비밀번호 재설정</span>
//           </div>
//         );
//       case "PASSWORD_CHANGE":
//         return (
//           <div className="flex items-center">
//             <KeyRound className="h-4 w-4 mr-1 text-blue-500" />
//             <span>비밀번호 변경</span>
//           </div>
//         );
//       case "2FA_ENABLE":
//         return (
//           <div className="flex items-center">
//             <ShieldCheck className="h-4 w-4 mr-1 text-green-500" />
//             <span>2FA 활성화</span>
//           </div>
//         );
//       case "2FA_DISABLE":
//         return (
//           <div className="flex items-center">
//             <ShieldAlert className="h-4 w-4 mr-1 text-yellow-500" />
//             <span>2FA 비활성화</span>
//           </div>
//         );
//       case "ACCOUNT_LOCK":
//         return (
//           <div className="flex items-center">
//             <Lock className="h-4 w-4 mr-1 text-red-500" />
//             <span>계정 잠금</span>
//           </div>
//         );
//       case "ACCOUNT_UNLOCK":
//         return (
//           <div className="flex items-center">
//             <Unlock className="h-4 w-4 mr-1 text-green-500" />
//             <span>계정 잠금 해제</span>
//           </div>
//         );
//       case "TOKEN_REFRESH":
//         return (
//           <div className="flex items-center">
//             <RefreshCcw className="h-4 w-4 mr-1 text-blue-500" />
//             <span>토큰 갱신</span>
//           </div>
//         );
//       case "LOGIN_FAILED":
//         return (
//           <div className="flex items-center">
//             <UserX className="h-4 w-4 mr-1 text-red-500" />
//             <span>로그인 실패</span>
//           </div>
//         );
//       default:
//         return <span>{eventType}</span>;
//     }
//   };

//   // 이벤트 상태 배지
//   const getStatusBadge = (status: string) => {
//     switch (status) {
//       case "SUCCESS":
//         return (
//           <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
//             성공
//           </Badge>
//         );
//       case "FAILED":
//         return (
//           <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
//             실패
//           </Badge>
//         );
//       case "PENDING":
//         return (
//           <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
//             대기
//           </Badge>
//         );
//       default:
//         return (
//           <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">
//             {status}
//           </Badge>
//         );
//     }
//   };

//   // 사용자 상태 배지
//   const getUserStatusBadge = (status: string) => {
//     switch (status) {
//       case "ACTIVE":
//         return (
//           <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
//             활성
//           </Badge>
//         );
//       case "INACTIVE":
//         return (
//           <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">
//             비활성
//           </Badge>
//         );
//       case "LOCKED":
//         return (
//           <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
//             잠금
//           </Badge>
//         );
//       default:
//         return (
//           <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">
//             {status}
//           </Badge>
//         );
//     }
//   };

//   // 사용자 역할 배지
//   const getUserRoleBadge = (role: string) => {
//     switch (role) {
//       case "ADMIN":
//         return (
//           <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">
//             관리자
//           </Badge>
//         );
//       case "USER":
//         return (
//           <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
//             사용자
//           </Badge>
//         );
//       case "MERCHANT":
//         return (
//           <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">
//             판매자
//           </Badge>
//         );
//       default:
//         return (
//           <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">
//             {role}
//           </Badge>
//         );
//     }
//   };

//   // 인증 이벤트 테이블 컬럼 정의
//   const eventColumns = [
//     {
//       key: "eventType",
//       header: "이벤트",
//       cell: (event: AuthEvent) => getEventTypeDisplay(event.eventType),
//     },
//     {
//       key: "userName",
//       header: "사용자",
//       cell: (event: AuthEvent) => event.userName,
//     },
//     {
//       key: "userEmail",
//       header: "이메일",
//       cell: (event: AuthEvent) => event.userEmail,
//       hideOnMobile: true,
//     },
//     {
//       key: "ipAddress",
//       header: "IP 주소",
//       cell: (event: AuthEvent) => event.ipAddress,
//       hideOnMobile: true,
//     },
//     {
//       key: "status",
//       header: "상태",
//       cell: (event: AuthEvent) => getStatusBadge(event.status),
//     },
//     {
//       key: "timestamp",
//       header: "시간",
//       cell: (event: AuthEvent) => formatDate(event.timestamp),
//     },
//     {
//       key: "actions",
//       header: "",
//       cell: (event: AuthEvent) => (
//         <Button
//           variant="ghost"
//           size="sm"
//           onClick={() => handleViewEvent(event)}
//         >
//           상세
//         </Button>
//       ),
//       className: "text-right",
//     },
//   ];

//   // 사용자 테이블 컬럼 정의
//   const userColumns = [
//     {
//       key: "name",
//       header: "이름",
//       cell: (user: User) => <span className="font-medium">{user.name}</span>,
//     },
//     {
//       key: "email",
//       header: "이메일",
//       cell: (user: User) => user.email,
//     },
//     {
//       key: "role",
//       header: "역할",
//       cell: (user: User) => getUserRoleBadge(user.role),
//     },
//     {
//       key: "status",
//       header: "상태",
//       cell: (user: User) => getUserStatusBadge(user.status),
//     },
//     {
//       key: "2fa",
//       header: "2FA",
//       cell: (user: User) => (
//         <Badge variant="outline" className="flex items-center gap-1">
//           {user.is2FAEnabled ? (
//             <>
//               <ShieldCheck className="h-3 w-3 text-green-500" /> 활성화
//             </>
//           ) : (
//             <>
//               <ShieldAlert className="h-3 w-3 text-gray-500" /> 비활성화
//             </>
//           )}
//         </Badge>
//       ),
//       hideOnMobile: true,
//     },
//     {
//       key: "lastLogin",
//       header: "마지막 로그인",
//       cell: (user: User) => (user.lastLogin ? formatDate(user.lastLogin) : "-"),
//       hideOnMobile: true,
//     },
//     {
//       key: "actions",
//       header: "",
//       cell: (user: User) => (
//         <div className="flex justify-end gap-2">
//           <Button
//             variant="ghost"
//             size="sm"
//             onClick={() => handleViewUser(user)}
//           >
//             상세
//           </Button>
//           <Button
//             variant={user.status === "LOCKED" ? "outline" : "ghost"}
//             size="sm"
//             onClick={() => handleToggleUserLock(user)}
//             className="hidden md:flex"
//           >
//             {user.status === "LOCKED" ? (
//               <>
//                 <Unlock className="h-4 w-4 mr-1" /> 잠금해제
//               </>
//             ) : (
//               <>
//                 <Lock className="h-4 w-4 mr-1" /> 잠금
//               </>
//             )}
//           </Button>
//           <Button
//             variant="ghost"
//             size="sm"
//             onClick={() => handleToggle2FA(user)}
//             className="hidden md:flex"
//           >
//             {user.is2FAEnabled ? "2FA 비활성화" : "2FA 활성화"}
//           </Button>
//         </div>
//       ),
//       className: "text-right",
//     },
//   ];

//   return (
//     <div className="space-y-6">
//       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//         <h1 className="text-2xl font-bold">인증 관리</h1>
//         <div className="flex flex-col md:flex-row gap-2">
//           <div className="relative">
//             <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
//             <Input
//               type="search"
//               placeholder={
//                 activeTab === "events" ? "이벤트 검색..." : "사용자 검색..."
//               }
//               className="pl-8 w-full md:w-[250px]"
//               value={
//                 activeTab === "events"
//                   ? searchParams.keyword
//                   : userSearchParams.keyword
//               }
//               onChange={(e) =>
//                 activeTab === "events"
//                   ? handleSearchParamChange("keyword", e.target.value)
//                   : handleUserSearchParamChange("keyword", e.target.value)
//               }
//             />
//           </div>
//           <div className="flex flex-wrap gap-2">
//             {activeTab === "events" && (
//               <>
//                 <Select
//                   value={searchParams.dateRange}
//                   onValueChange={(value) =>
//                     handleSearchParamChange("dateRange", value)
//                   }
//                 >
//                   <SelectTrigger className="w-[130px]">
//                     <SelectValue placeholder="기간" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="all">전체 기간</SelectItem>
//                     <SelectItem value="today">오늘</SelectItem>
//                     <SelectItem value="week">최근 7일</SelectItem>
//                     <SelectItem value="month">최근 30일</SelectItem>
//                   </SelectContent>
//                 </Select>
//                 <Select
//                   value={searchParams.eventType}
//                   onValueChange={(value) =>
//                     handleSearchParamChange("eventType", value)
//                   }
//                 >
//                   <SelectTrigger className="w-[130px]">
//                     <SelectValue placeholder="이벤트 타입" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="all">모든 이벤트</SelectItem>
//                     <SelectItem value="LOGIN">로그인</SelectItem>
//                     <SelectItem value="LOGOUT">로그아웃</SelectItem>
//                     <SelectItem value="LOGIN_FAILED">로그인 실패</SelectItem>
//                     <SelectItem value="PASSWORD_RESET">
//                       비밀번호 재설정
//                     </SelectItem>
//                     <SelectItem value="ACCOUNT_LOCK">계정 잠금</SelectItem>
//                     <SelectItem value="2FA_ENABLE">2FA 활성화</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </>
//             )}
//             {activeTab === "users" && (
//               <>
//                 <Select
//                   value={userSearchParams.role}
//                   onValueChange={(value) =>
//                     handleUserSearchParamChange("role", value)
//                   }
//                 >
//                   <SelectTrigger className="w-[130px]">
//                     <SelectValue placeholder="역할" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="all">모든 역할</SelectItem>
//                     <SelectItem value="ADMIN">관리자</SelectItem>
//                     <SelectItem value="USER">사용자</SelectItem>
//                     <SelectItem value="MERCHANT">판매자</SelectItem>
//                   </SelectContent>
//                 </Select>
//                 <Select
//                   value={userSearchParams.status}
//                   onValueChange={(value) =>
//                     handleUserSearchParamChange("status", value)
//                   }
//                 >
//                   <SelectTrigger className="w-[130px]">
//                     <SelectValue placeholder="상태" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="all">모든 상태</SelectItem>
//                     <SelectItem value="ACTIVE">활성</SelectItem>
//                     <SelectItem value="INACTIVE">비활성</SelectItem>
//                     <SelectItem value="LOCKED">잠금</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </>
//             )}
//           </div>
//           <Button
//             variant="outline"
//             className="gap-1"
//             onClick={activeTab === "events" ? fetchAuthEvents : fetchUsers}
//           >
//             <RefreshCcw className="h-4 w-4" /> 새로고침
//           </Button>
//           <Button variant="outline" className="gap-1">
//             <Download className="h-4 w-4" /> 내보내기
//           </Button>
//         </div>
//       </div>

//       <Tabs
//         defaultValue="events"
//         value={activeTab}
//         onValueChange={handleTabChange}
//       >
//         <TabsList>
//           <TabsTrigger value="events">인증 이벤트</TabsTrigger>
//           <TabsTrigger value="users">사용자 관리</TabsTrigger>
//         </TabsList>
//         <TabsContent value="events">
//           <Card className="overflow-hidden">
//             <ResponsiveTable
//               data={filteredEvents}
//               columns={eventColumns}
//               emptyMessage="인증 이벤트가 없습니다."
//             />
//           </Card>
//         </TabsContent>
//         <TabsContent value="users">
//           <Card className="overflow-hidden">
//             <ResponsiveTable
//               data={filteredUsers}
//               columns={userColumns}
//               emptyMessage="사용자 정보가 없습니다."
//             />
//           </Card>
//         </TabsContent>
//       </Tabs>

//       {/* 인증 이벤트 상세 다이얼로그 */}
//       <Dialog open={isEventDetailOpen} onOpenChange={setIsEventDetailOpen}>
//         <DialogContent className="sm:max-w-md">
//           <DialogHeader>
//             <DialogTitle>인증 이벤트 상세</DialogTitle>
//             <DialogDescription>
//               인증 이벤트의 상세 정보입니다.
//             </DialogDescription>
//           </DialogHeader>

//           {selectedEvent && (
//             <div className="py-4 space-y-4">
//               <div className="grid grid-cols-4 items-center gap-4">
//                 <div className="font-semibold">이벤트 ID</div>
//                 <div className="col-span-3 text-sm font-mono">
//                   {selectedEvent.id}
//                 </div>
//               </div>

//               <div className="grid grid-cols-4 items-center gap-4">
//                 <div className="font-semibold">추적 ID</div>
//                 <div className="col-span-3 text-sm font-mono">
//                   {selectedEvent.traceId}
//                 </div>
//               </div>

//               <div className="grid grid-cols-4 items-center gap-4">
//                 <div className="font-semibold">이벤트 유형</div>
//                 <div className="col-span-3">
//                   {getEventTypeDisplay(selectedEvent.eventType)}
//                 </div>
//               </div>

//               <div className="grid grid-cols-4 items-center gap-4">
//                 <div className="font-semibold">상태</div>
//                 <div className="col-span-3">
//                   {getStatusBadge(selectedEvent.status)}
//                 </div>
//               </div>

//               <div className="grid grid-cols-4 items-center gap-4">
//                 <div className="font-semibold">사용자 ID</div>
//                 <div className="col-span-3 text-sm font-mono">
//                   {selectedEvent.userId}
//                 </div>
//               </div>

//               <div className="grid grid-cols-4 items-center gap-4">
//                 <div className="font-semibold">사용자</div>
//                 <div className="col-span-3">{selectedEvent.userName}</div>
//               </div>

//               <div className="grid grid-cols-4 items-center gap-4">
//                 <div className="font-semibold">이메일</div>
//                 <div className="col-span-3">{selectedEvent.userEmail}</div>
//               </div>

//               <div className="grid grid-cols-4 items-center gap-4">
//                 <div className="font-semibold">IP 주소</div>
//                 <div className="col-span-3">{selectedEvent.ipAddress}</div>
//               </div>

//               <div className="grid grid-cols-4 items-center gap-4">
//                 <div className="font-semibold">위치</div>
//                 <div className="col-span-3">
//                   {selectedEvent.location || "-"}
//                 </div>
//               </div>

//               <div className="grid grid-cols-4 items-center gap-4">
//                 <div className="font-semibold">사용자 에이전트</div>
//                 <div className="col-span-3 text-sm break-words">
//                   {selectedEvent.userAgent}
//                 </div>
//               </div>

//               <div className="grid grid-cols-4 items-center gap-4">
//                 <div className="font-semibold">발생 시간</div>
//                 <div className="col-span-3">
//                   {formatDate(selectedEvent.timestamp)}
//                 </div>
//               </div>

//               {selectedEvent.details && (
//                 <div className="grid grid-cols-4 items-start gap-4">
//                   <div className="font-semibold">상세 정보</div>
//                   <div className="col-span-3 text-sm">
//                     {selectedEvent.details}
//                   </div>
//                 </div>
//               )}

//               {selectedEvent.failReason && (
//                 <div className="grid grid-cols-4 items-start gap-4">
//                   <div className="font-semibold">실패 사유</div>
//                   <div className="col-span-3 text-sm text-red-600">
//                     {selectedEvent.failReason}
//                   </div>
//                 </div>
//               )}
//             </div>
//           )}

//           <DialogFooter className="flex space-x-2 justify-end">
//             <Button
//               variant="outline"
//               onClick={() => setIsEventDetailOpen(false)}
//             >
//               닫기
//             </Button>
//             {selectedEvent && selectedEvent.userId && (
//               <Button
//                 onClick={() => {
//                   const user = users.find((u) => u.id === selectedEvent.userId);
//                   if (user) {
//                     setIsEventDetailOpen(false);
//                     handleViewUser(user);
//                   }
//                 }}
//               >
//                 사용자 정보 보기
//               </Button>
//             )}
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       {/* 사용자 상세 다이얼로그 */}
//       <Dialog open={isUserDetailOpen} onOpenChange={setIsUserDetailOpen}>
//         <DialogContent className="sm:max-w-md">
//           <DialogHeader>
//             <DialogTitle>사용자 상세 정보</DialogTitle>
//             <DialogDescription>
//               사용자 계정의 상세 정보입니다.
//             </DialogDescription>
//           </DialogHeader>

//           {selectedUser && (
//             <div className="py-4 space-y-4">
//               <div className="grid grid-cols-4 items-center gap-4">
//                 <div className="font-semibold">ID</div>
//                 <div className="col-span-3 text-sm font-mono">
//                   {selectedUser.id}
//                 </div>
//               </div>

//               <div className="grid grid-cols-4 items-center gap-4">
//                 <div className="font-semibold">이름</div>
//                 <div className="col-span-3">{selectedUser.name}</div>
//               </div>

//               <div className="grid grid-cols-4 items-center gap-4">
//                 <div className="font-semibold">이메일</div>
//                 <div className="col-span-3">{selectedUser.email}</div>
//               </div>

//               <div className="grid grid-cols-4 items-center gap-4">
//                 <div className="font-semibold">역할</div>
//                 <div className="col-span-3">
//                   {getUserRoleBadge(selectedUser.role)}
//                 </div>
//               </div>

//               <div className="grid grid-cols-4 items-center gap-4">
//                 <div className="font-semibold">상태</div>
//                 <div className="col-span-3">
//                   {getUserStatusBadge(selectedUser.status)}
//                 </div>
//               </div>

//               <div className="grid grid-cols-4 items-center gap-4">
//                 <div className="font-semibold">2FA</div>
//                 <div className="col-span-3">
//                   <Badge variant="outline" className="flex items-center gap-1">
//                     {selectedUser.is2FAEnabled ? (
//                       <>
//                         <ShieldCheck className="h-3 w-3 text-green-500" />{" "}
//                         활성화
//                       </>
//                     ) : (
//                       <>
//                         <ShieldAlert className="h-3 w-3 text-gray-500" />{" "}
//                         비활성화
//                       </>
//                     )}
//                   </Badge>
//                 </div>
//               </div>

//               <div className="grid grid-cols-4 items-center gap-4">
//                 <div className="font-semibold">로그인 시도</div>
//                 <div className="col-span-3">
//                   {selectedUser.loginAttempts > 0 ? (
//                     <Badge
//                       variant="outline"
//                       className={`flex items-center gap-1 ${
//                         selectedUser.loginAttempts >= 3
//                           ? "text-red-600"
//                           : "text-yellow-600"
//                       }`}
//                     >
//                       <AlertTriangle className="h-3 w-3" />{" "}
//                       {selectedUser.loginAttempts}회 실패
//                     </Badge>
//                   ) : (
//                     "0회"
//                   )}
//                 </div>
//               </div>

//               <div className="grid grid-cols-4 items-center gap-4">
//                 <div className="font-semibold">마지막 로그인</div>
//                 <div className="col-span-3">
//                   {selectedUser.lastLogin
//                     ? formatDate(selectedUser.lastLogin)
//                     : "-"}
//                 </div>
//               </div>

//               <div className="grid grid-cols-4 items-center gap-4">
//                 <div className="font-semibold">가입일</div>
//                 <div className="col-span-3">
//                   {formatDate(selectedUser.createdAt)}
//                 </div>
//               </div>
//             </div>
//           )}

//           <DialogFooter className="flex space-x-2 justify-end">
//             <Button
//               variant="outline"
//               onClick={() => setIsUserDetailOpen(false)}
//             >
//               닫기
//             </Button>
//             {selectedUser && (
//               <>
//                 <Button
//                   variant={
//                     selectedUser.status === "LOCKED" ? "outline" : "destructive"
//                   }
//                   onClick={() => {
//                     handleToggleUserLock(selectedUser);
//                     setIsUserDetailOpen(false);
//                   }}
//                 >
//                   {selectedUser.status === "LOCKED" ? (
//                     <>
//                       <Unlock className="h-4 w-4 mr-1" /> 잠금 해제
//                     </>
//                   ) : (
//                     <>
//                       <Lock className="h-4 w-4 mr-1" /> 계정 잠금
//                     </>
//                   )}
//                 </Button>
//                 <Button
//                   onClick={() => {
//                     handleToggle2FA(selectedUser);
//                     setIsUserDetailOpen(false);
//                   }}
//                 >
//                   2FA {selectedUser.is2FAEnabled ? "비활성화" : "활성화"}
//                 </Button>
//               </>
//             )}
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }

// // 임시 인증 이벤트 데이터
// const mockAuthEvents: AuthEvent[] = [
//   {
//     id: "evt-123456",
//     traceId: "trace-123abc",
//     userId: "usr-123456",
//     userName: "홍길동",
//     userEmail: "hong@example.com",
//     eventType: "LOGIN",
//     status: "SUCCESS",
//     ipAddress: "123.45.67.89",
//     userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
//     timestamp: "2023-05-15T08:30:00Z",
//     location: "서울, 대한민국",
//   },
//   {
//     id: "evt-234567",
//     traceId: "trace-234bcd",
//     userId: "usr-234567",
//     userName: "김철수",
//     userEmail: "kim@example.com",
//     eventType: "LOGIN_FAILED",
//     status: "FAILED",
//     ipAddress: "123.45.67.90",
//     userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
//     timestamp: "2023-05-15T07:45:00Z",
//     failReason: "비밀번호 불일치",
//     location: "부산, 대한민국",
//   },
//   {
//     id: "evt-345678",
//     traceId: "trace-345cde",
//     userId: "usr-345678",
//     userName: "이영희",
//     userEmail: "lee@example.com",
//     eventType: "PASSWORD_RESET",
//     status: "SUCCESS",
//     ipAddress: "123.45.67.91",
//     userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1)",
//     timestamp: "2023-05-14T15:20:00Z",
//     location: "대전, 대한민국",
//   },
//   {
//     id: "evt-456789",
//     traceId: "trace-456def",
//     userId: "usr-456789",
//     userName: "박민수",
//     userEmail: "park@example.com",
//     eventType: "ACCOUNT_LOCK",
//     status: "SUCCESS",
//     ipAddress: "123.45.67.92",
//     userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
//     timestamp: "2023-05-14T12:10:00Z",
//     details: "여러 번의 로그인 실패로 인한 자동 계정 잠금",
//     location: "인천, 대한민국",
//   },
//   {
//     id: "evt-567890",
//     traceId: "trace-567efg",
//     userId: "usr-567890",
//     userName: "최지은",
//     userEmail: "choi@example.com",
//     eventType: "2FA_ENABLE",
//     status: "SUCCESS",
//     ipAddress: "123.45.67.93",
//     userAgent: "Mozilla/5.0 (Linux; Android 10; SM-G973F)",
//     timestamp: "2023-05-13T09:15:00Z",
//     location: "대구, 대한민국",
//   },
//   {
//     id: "evt-678901",
//     traceId: "trace-678fgh",
//     userId: "usr-678901",
//     userName: "정동훈",
//     userEmail: "jung@example.com",
//     eventType: "LOGOUT",
//     status: "SUCCESS",
//     ipAddress: "123.45.67.94",
//     userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
//     timestamp: "2023-05-13T08:30:00Z",
//     location: "광주, 대한민국",
//   },
// ];

// // 임시 사용자 데이터
// const mockUsers: User[] = [
//   {
//     id: "usr-123456",
//     name: "홍길동",
//     email: "hong@example.com",
//     role: "ADMIN",
//     status: "ACTIVE",
//     lastLogin: "2023-05-15T08:30:00Z",
//     loginAttempts: 0,
//     is2FAEnabled: true,
//     createdAt: "2022-01-10T10:00:00Z",
//   },
//   {
//     id: "usr-234567",
//     name: "김철수",
//     email: "kim@example.com",
//     role: "USER",
//     status: "ACTIVE",
//     lastLogin: "2023-05-14T13:45:00Z",
//     loginAttempts: 1,
//     is2FAEnabled: false,
//     createdAt: "2022-02-15T11:30:00Z",
//   },
//   {
//     id: "usr-345678",
//     name: "이영희",
//     email: "lee@example.com",
//     role: "USER",
//     status: "ACTIVE",
//     lastLogin: "2023-05-14T15:20:00Z",
//     loginAttempts: 0,
//     is2FAEnabled: true,
//     createdAt: "2022-03-20T09:15:00Z",
//   },
//   {
//     id: "usr-456789",
//     name: "박민수",
//     email: "park@example.com",
//     role: "USER",
//     status: "LOCKED",
//     lastLogin: "2023-05-13T12:10:00Z",
//     loginAttempts: 5,
//     is2FAEnabled: false,
//     createdAt: "2022-04-05T14:30:00Z",
//   },
//   {
//     id: "usr-567890",
//     name: "최지은",
//     email: "choi@example.com",
//     role: "MERCHANT",
//     status: "ACTIVE",
//     lastLogin: "2023-05-13T09:15:00Z",
//     loginAttempts: 0,
//     is2FAEnabled: true,
//     createdAt: "2022-05-12T16:45:00Z",
//   },
//   {
//     id: "usr-678901",
//     name: "정동훈",
//     email: "jung@example.com",
//     role: "MERCHANT",
//     status: "INACTIVE",
//     lastLogin: "2023-05-10T11:30:00Z",
//     loginAttempts: 0,
//     is2FAEnabled: false,
//     createdAt: "2022-06-20T08:20:00Z",
//   },
// ];
