import { toast } from "@/components/ui/use-toast"

// API 기본 URL (환경 변수에서 가져옴)
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://api-example.com"

// API 요청 타입
type ApiMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE"

// API 요청 옵션
interface ApiOptions {
  method?: ApiMethod
  body?: any
  headers?: Record<string, string>
  requireAuth?: boolean
  showErrorToast?: boolean
}

// API 요청 함수
export async function apiRequest<T = any>(endpoint: string, options: ApiOptions = {}): Promise<T> {
  const { method = "GET", body, headers = {}, requireAuth = true, showErrorToast = true } = options

  try {
    // 기본 헤더 설정
    const requestHeaders: Record<string, string> = {
      "Content-Type": "application/json",
      ...headers,
    }

    // 인증 토큰 추가 (필요한 경우)
    if (requireAuth) {
      // 개발 중 항상 임시 토큰 사용 (임시)
      requestHeaders["Authorization"] =
        `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c3ItMTIzNDU2Iiwicm9sZSI6IkFETUlOIiwiaWF0IjoxNTE2MjM5MDIyfQ.fake-token`

      // 원래 코드 (현재 비활성화됨)
      /*
      const token = localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");
      if (token) {
        requestHeaders["Authorization"] = `Bearer ${token}`;
      } else if (requireAuth) {
        throw new Error("인증이 필요합니다. 다시 로그인해주세요.");
      */
    }

    // 요청 옵션 구성
    const requestOptions: RequestInit = {
      method,
      headers: requestHeaders,
    }

    // 요청 바디 추가 (GET 메서드가 아닌 경우)
    if (method !== "GET" && body) {
      requestOptions.body = JSON.stringify(body)
    }

    // trace_id 생성 (결제, 인증, 시스템 로그 등에서 사용)
    if (
      endpoint.includes("/payment") ||
      endpoint.includes("/auth") ||
      endpoint.includes("/system") ||
      endpoint.includes("/logs")
    ) {
      const traceId = generateTraceId()
      requestHeaders["X-Trace-ID"] = traceId
    }

    // API 요청 실행
    const response = await fetch(`${API_BASE_URL}${endpoint}`, requestOptions)

    // 응답 데이터 파싱
    const data = await response.json()

    // 응답 상태 확인
    if (!response.ok) {
      throw new Error(data.message || "API 요청 중 오류가 발생했습니다.")
    }

    return data
  } catch (error) {
    // 오류 처리
    if (showErrorToast) {
      toast({
        title: "오류",
        description: error.message || "요청 처리 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    }
    throw error
  }
}

// trace_id 생성 함수
export function generateTraceId(): string {
  const timestamp = Date.now().toString(36)
  const randomStr = Math.random().toString(36).substring(2, 10)
  return `trace-${timestamp}-${randomStr}`
}

// API 편의 함수들
export const api = {
  get: <T = any>(endpoint: string, options?: Omit<ApiOptions, "method" | "body">) =>
    apiRequest<T>(endpoint, { ...options, method: "GET" }),

  post: <T = any>(endpoint: string, body: any, options?: Omit<ApiOptions, "method">) =>
    apiRequest<T>(endpoint, { ...options, method: "POST", body }),

  put: <T = any>(endpoint: string, body: any, options?: Omit<ApiOptions, "method">) =>
    apiRequest<T>(endpoint, { ...options, method: "PUT", body }),

  patch: <T = any>(endpoint: string, body: any, options?: Omit<ApiOptions, "method">) =>
    apiRequest<T>(endpoint, { ...options, method: "PATCH", body }),

  delete: <T = any>(endpoint: string, options?: Omit<ApiOptions, "method">) =>
    apiRequest<T>(endpoint, { ...options, method: "DELETE" }),
}
