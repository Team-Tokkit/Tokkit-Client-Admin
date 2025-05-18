"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"

interface AuthContextType {
  isAuthenticated: boolean
  user: User | null
  login: (email: string, password: string, rememberMe: boolean) => Promise<boolean>
  logout: () => void
  getAccessToken: () => string | null
}

interface User {
  id: string
  email: string
  name: string
  role: string
}

interface LoginResponse {
  accessToken: string
  user: User
  message: string
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // 로그인 상태 확인
    const checkAuth = () => {
      // 개발 중 토큰 검증 비활성화 (임시)
      setIsAuthenticated(true)

      // 임시 사용자 정보 설정
      const mockUser = {
        id: "usr-123456",
        email: "admin@example.com",
        name: "관리자",
        role: "ADMIN",
      }
      setUser(mockUser)

      setIsLoading(false)

      // 원래 코드 (현재 비활성화됨)
      /*
      const token = localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");

      if (token) {
        const userData = localStorage.getItem("user") || sessionStorage.getItem("user");
        if (userData) {
          setUser(JSON.parse(userData));
        }
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }

      setIsLoading(false);
      */
    }

    checkAuth()
  }, [])

  useEffect(() => {
    // 인증 상태에 따라 리다이렉트
    if (!isLoading) {
      // 인증 상태에 따라 리다이렉트 (현재 비활성화됨)
      if (!isLoading) {
        // 개발 중 리다이렉트 비활성화 (임시)
        /*
        if (!isAuthenticated && pathname !== "/login") {
          console.log("인증되지 않음, 로그인 페이지로 리다이렉트");
          router.push("/login");
        } else if (isAuthenticated && pathname === "/login") {
          console.log("이미 인증됨, 대시보드로 리다이렉트");
          router.push("/");
        }
        */
      }
    }
  }, [isAuthenticated, isLoading, pathname, router])

  const login = async (email: string, password: string, rememberMe: boolean) => {
    try {
      console.log("로그인 시도:", email)

      // 개발 중 항상 로그인 성공 처리 (임시)
      const mockUser = {
        id: "usr-123456",
        email: email,
        name: "관리자",
        role: "ADMIN",
      }

      const mockToken =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c3ItMTIzNDU2Iiwicm9sZSI6IkFETUlOIiwiaWF0IjoxNTE2MjM5MDIyfQ.fake-token"

      // 토큰 및 사용자 정보 저장
      if (rememberMe) {
        localStorage.setItem("accessToken", mockToken)
        localStorage.setItem("user", JSON.stringify(mockUser))
      } else {
        sessionStorage.setItem("accessToken", mockToken)
        sessionStorage.setItem("user", JSON.stringify(mockUser))
      }

      setUser(mockUser)
      setIsAuthenticated(true)
      return true

      // 원래 API 연동 코드 (현재 비활성화됨)
      /*
      const response = await api.post<LoginResponse>("/auth/login", { email, password }, { requireAuth: false });

      const { accessToken, user } = response;

      // 토큰 및 사용자 정보 저장
      if (rememberMe) {
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("user", JSON.stringify(user));
      } else {
        sessionStorage.setItem("accessToken", accessToken);
        sessionStorage.setItem("user", JSON.stringify(user));
      }

      setUser(user);
      setIsAuthenticated(true);
      return true;
      */
    } catch (error) {
      console.error("로그인 중 오류 발생:", error)
      return false
    }
  }

  const logout = () => {
    console.log("로그아웃 실행")
    localStorage.removeItem("accessToken")
    sessionStorage.removeItem("accessToken")
    localStorage.removeItem("user")
    sessionStorage.removeItem("user")
    setUser(null)
    setIsAuthenticated(false)
    router.push("/login")
  }

  const getAccessToken = (): string | null => {
    // 개발 중 항상 토큰 반환 (임시)
    return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c3ItMTIzNDU2Iiwicm9sZSI6IkFETUlOIiwiaWF0IjoxNTE2MjM5MDIyfQ.fake-token"

    // 원래 코드 (현재 비활성화됨)
    // return localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");
  }

  if (isLoading) {
    // 로딩 중 표시
    return <div className="flex items-center justify-center min-h-screen">로딩 중...</div>
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, getAccessToken }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
