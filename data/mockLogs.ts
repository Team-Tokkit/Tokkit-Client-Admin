import { generateTraceId } from "@/lib/api"

// API 요청 로그 타입 정의
export interface ApiRequestLog {
  id: number
  createdAt: string
  updatedAt: string
  endpoint: string
  ipAddress: string
  method: string
  queryParams?: string
  requestBody?: string
  responseStatus: number
  responseTimeMs: number
  timestamp: string
  userId: number
  traceId: string
}

// 로그인 로그 타입 정의
export interface LoginLog {
  id: number
  createdAt: string
  updatedAt: string
  event: "LOGIN" | "LOGOUT"
  ipAddress: string
  merchantId?: number
  reason?: string
  success: boolean
  timestamp: string
  traceId: string
  userAgent?: string
  userId?: number
}

// 트랜잭션 로그 타입 정의
export interface TransactionLog {
  id: number
  createdAt: string
  updatedAt: string
  amount?: number
  description?: string
  txHash?: string
  type?: "CONVERT" | "DEPOSIT" | "PURCHASE" | "RECEIVE" | "REFUND" | "WITHDRAW"
  walletId?: number
  failureReason?: string
  status?: "FAILURE" | "PENDING" | "SUCCESS"
  traceId: string
}

// 시스템 에러 로그 타입 정의
export interface SystemErrorLog {
  id: number
  createdAt: string
  updatedAt: string
  endpoint: string
  errorMessage?: string
  serverName?: string
  severity?: "ERROR" | "FATAL" | "INFO" | "WARN"
  stackTrace?: string
  timestamp: string
  userId?: number
  traceId: string
}

// API 요청 로그 더미 데이터
export const mockApiRequestLogs: ApiRequestLog[] = [
  {
    id: 1,
    createdAt: "2023-05-15T08:30:00Z",
    updatedAt: "2023-05-15T08:30:00Z",
    endpoint: "/api/v1/users",
    ipAddress: "192.168.1.1",
    method: "GET",
    queryParams: "page=1&size=10",
    requestBody: null,
    responseStatus: 200,
    responseTimeMs: 120,
    timestamp: "2023-05-15T08:30:00Z",
    userId: 1,
    traceId: generateTraceId(),
  },
  {
    id: 2,
    createdAt: "2023-05-15T09:15:00Z",
    updatedAt: "2023-05-15T09:15:00Z",
    endpoint: "/api/v1/auth/login",
    ipAddress: "192.168.1.2",
    method: "POST",
    requestBody: '{"email":"user@example.com","password":"********"}',
    responseStatus: 200,
    responseTimeMs: 250,
    timestamp: "2023-05-15T09:15:00Z",
    userId: 2,
    traceId: generateTraceId(),
  },
  {
    id: 3,
    createdAt: "2023-05-15T10:20:00Z",
    updatedAt: "2023-05-15T10:20:00Z",
    endpoint: "/api/v1/transactions",
    ipAddress: "192.168.1.3",
    method: "POST",
    requestBody: '{"amount":5000,"type":"DEPOSIT"}',
    responseStatus: 201,
    responseTimeMs: 180,
    timestamp: "2023-05-15T10:20:00Z",
    userId: 3,
    traceId: generateTraceId(),
  },
  {
    id: 4,
    createdAt: "2023-05-15T11:05:00Z",
    updatedAt: "2023-05-15T11:05:00Z",
    endpoint: "/api/v1/merchants",
    ipAddress: "192.168.1.4",
    method: "GET",
    queryParams: "status=active",
    responseStatus: 200,
    responseTimeMs: 150,
    timestamp: "2023-05-15T11:05:00Z",
    userId: 1,
    traceId: generateTraceId(),
  },
  {
    id: 5,
    createdAt: "2023-05-15T12:30:00Z",
    updatedAt: "2023-05-15T12:30:00Z",
    endpoint: "/api/v1/vouchers",
    ipAddress: "192.168.1.5",
    method: "POST",
    requestBody: '{"name":"Summer Discount","discount":20}',
    responseStatus: 400,
    responseTimeMs: 100,
    timestamp: "2023-05-15T12:30:00Z",
    userId: 2,
    traceId: generateTraceId(),
  },
]

// 로그인 로그 더미 데이터
export const mockLoginLogs: LoginLog[] = [
  {
    id: 1,
    createdAt: "2023-05-15T08:00:00Z",
    updatedAt: "2023-05-15T08:00:00Z",
    event: "LOGIN",
    ipAddress: "192.168.1.1",
    userId: 1,
    success: true,
    timestamp: "2023-05-15T08:00:00Z",
    traceId: generateTraceId(),
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
  },
  {
    id: 2,
    createdAt: "2023-05-15T09:10:00Z",
    updatedAt: "2023-05-15T09:10:00Z",
    event: "LOGIN",
    ipAddress: "192.168.1.2",
    merchantId: 1,
    success: false,
    reason: "잘못된 비밀번호",
    timestamp: "2023-05-15T09:10:00Z",
    traceId: generateTraceId(),
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
  },
  {
    id: 3,
    createdAt: "2023-05-15T10:15:00Z",
    updatedAt: "2023-05-15T10:15:00Z",
    event: "LOGIN",
    ipAddress: "192.168.1.3",
    userId: 2,
    success: true,
    timestamp: "2023-05-15T10:15:00Z",
    traceId: generateTraceId(),
    userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1)",
  },
  {
    id: 4,
    createdAt: "2023-05-15T11:20:00Z",
    updatedAt: "2023-05-15T11:20:00Z",
    event: "LOGOUT",
    ipAddress: "192.168.1.1",
    userId: 1,
    success: true,
    timestamp: "2023-05-15T11:20:00Z",
    traceId: generateTraceId(),
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
  },
  {
    id: 5,
    createdAt: "2023-05-15T12:25:00Z",
    updatedAt: "2023-05-15T12:25:00Z",
    event: "LOGIN",
    ipAddress: "192.168.1.4",
    merchantId: 2,
    success: true,
    timestamp: "2023-05-15T12:25:00Z",
    traceId: generateTraceId(),
    userAgent: "Mozilla/5.0 (Linux; Android 10; SM-G973F)",
  },
]

// 트랜잭션 로그 더미 데이터
export const mockTransactionLogs: TransactionLog[] = [
  {
    id: 1,
    createdAt: "2023-05-15T09:00:00Z",
    updatedAt: "2023-05-15T09:00:00Z",
    amount: 50000,
    description: "월급 입금",
    txHash: "0x123abc456def",
    type: "DEPOSIT",
    walletId: 1,
    status: "SUCCESS",
    timestamp: "2023-05-15T09:00:00Z",
    traceId: generateTraceId(),
  },
  {
    id: 2,
    createdAt: "2023-05-15T10:15:00Z",
    updatedAt: "2023-05-15T10:15:00Z",
    amount: 15000,
    description: "상품 구매",
    txHash: "0x789ghi012jkl",
    type: "PURCHASE",
    walletId: 2,
    status: "SUCCESS",
    timestamp: "2023-05-15T10:15:00Z",
    traceId: generateTraceId(),
  },
  {
    id: 3,
    createdAt: "2023-05-15T11:30:00Z",
    updatedAt: "2023-05-15T11:30:00Z",
    amount: 5000,
    description: "환불 처리",
    txHash: "0x345mno678pqr",
    type: "REFUND",
    walletId: 2,
    status: "PENDING",
    timestamp: "2023-05-15T11:30:00Z",
    traceId: generateTraceId(),
  },
  {
    id: 4,
    createdAt: "2023-05-15T12:45:00Z",
    updatedAt: "2023-05-15T12:45:00Z",
    amount: 20000,
    description: "출금 요청",
    txHash: "0x901stu234vwx",
    type: "WITHDRAW",
    walletId: 1,
    failureReason: "잔액 부족",
    status: "FAILURE",
    timestamp: "2023-05-15T12:45:00Z",
    traceId: generateTraceId(),
  },
  {
    id: 5,
    createdAt: "2023-05-15T13:00:00Z",
    updatedAt: "2023-05-15T13:00:00Z",
    amount: 10000,
    description: "포인트 전환",
    txHash: "0x567yz890abc",
    type: "CONVERT",
    walletId: 3,
    status: "SUCCESS",
    timestamp: "2023-05-15T13:00:00Z",
    traceId: generateTraceId(),
  },
]

// 시스템 에러 로그 더미 데이터
export const mockSystemErrorLogs: SystemErrorLog[] = [
  {
    id: 1,
    createdAt: "2023-05-15T08:15:00Z",
    updatedAt: "2023-05-15T08:15:00Z",
    endpoint: "/api/v1/users",
    errorMessage: "Database connection timeout",
    serverName: "api-server-1",
    severity: "ERROR",
    stackTrace:
      "java.sql.SQLException: Connection timed out\n  at com.example.dao.UserDAO.findAll(UserDAO.java:42)\n  at com.example.service.UserService.getAllUsers(UserService.java:25)",
    timestamp: "2023-05-15T08:15:00Z",
    userId: 1,
    traceId: generateTraceId(),
  },
  {
    id: 2,
    createdAt: "2023-05-15T09:30:00Z",
    updatedAt: "2023-05-15T09:30:00Z",
    endpoint: "/api/v1/auth/login",
    errorMessage: "Invalid credentials format",
    serverName: "auth-server-1",
    severity: "WARN",
    timestamp: "2023-05-15T09:30:00Z",
    userId: 2,
    traceId: generateTraceId(),
  },
  {
    id: 3,
    createdAt: "2023-05-15T10:45:00Z",
    updatedAt: "2023-05-15T10:45:00Z",
    endpoint: "/api/v1/transactions",
    errorMessage: "Payment gateway connection failed",
    serverName: "payment-server-1",
    severity: "FATAL",
    stackTrace:
      "com.example.payment.GatewayException: Failed to connect to payment gateway\n  at com.example.service.PaymentService.processPayment(PaymentService.java:78)\n  at com.example.controller.TransactionController.createTransaction(TransactionController.java:53)",
    timestamp: "2023-05-15T10:45:00Z",
    userId: 3,
    traceId: generateTraceId(),
  },
  {
    id: 4,
    createdAt: "2023-05-15T11:00:00Z",
    updatedAt: "2023-05-15T11:00:00Z",
    endpoint: "/api/v1/notifications",
    errorMessage: "Email service unavailable",
    serverName: "notification-server-1",
    severity: "ERROR",
    timestamp: "2023-05-15T11:00:00Z",
    traceId: generateTraceId(),
  },
  {
    id: 5,
    createdAt: "2023-05-15T12:15:00Z",
    updatedAt: "2023-05-15T12:15:00Z",
    endpoint: "/api/v1/reports",
    errorMessage: "Report generation timeout",
    serverName: "report-server-1",
    severity: "WARN",
    timestamp: "2023-05-15T12:15:00Z",
    userId: 1,
    traceId: generateTraceId(),
  },
]

// 모든 로그 타입을 하나로 합친 배열
export const mockLogs = [
  ...mockApiRequestLogs.map((log) => ({ ...log, type: "API_REQUEST" })),
  ...mockLoginLogs.map((log) => ({ ...log, type: "LOGIN" })),
  ...mockTransactionLogs.map((log) => ({ ...log, type: "TRANSACTION" })),
  ...mockSystemErrorLogs.map((log) => ({ ...log, type: "SYSTEM_ERROR" })),
]
