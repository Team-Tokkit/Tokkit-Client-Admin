"use client";

import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { logoutAdmin } from "@/app/login/api/authApi";
import { getApiUrl } from "@/lib/getApiUrl";
// 사용자 정보 타입 정의
const API_URL = getApiUrl();
interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (
    email: string,
    password: string,
    rememberMe: boolean
  ) => Promise<boolean>;
  logout: () => void;
}

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface JwtPayload {
  sub: string;
  email: string;
  name: string;
  role: string;
  exp?: number;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const check = async () => {
      try {
        const res = await fetch(`${API_URL}/admin-api/me`, {
          credentials: "include",
        });

        if (res.ok) {
          const userData = await res.json();
          setUser(userData);
          setIsAuthenticated(true);
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (err) {
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    check();
  }, []);

  useEffect(() => {
    if (isLoading) return;

    // 보호된 경로 정의
    const protectedRoutes = [
      "/auth",
      "/transaction",
      "/user",
      "/voucher",
      "/notice",
      "/api-logs",
      "/error-logs",
      "/unified-logs",
    ];

    const isProtected = protectedRoutes.some(
      (path) => pathname === path || pathname.startsWith(`${path}/`)
    );

    if (!isAuthenticated && isProtected) {
      router.push("/");
    }

    if (isAuthenticated && pathname === "/") {
      router.push("/auth");
    }
  }, [isAuthenticated, isLoading, pathname]);

  // 로그인
  const login = async (email: string, password: string) => {
    try {
      const response = await fetch(`${API_URL}/admin-api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) throw new Error("로그인 실패");

      // 서버에서 유저 정보를 바로 내려줄 수도 있음
      const { id, email: userEmail, name, role } = await response.json();

      setUser({ id, email: userEmail, name, role });
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error("로그인 중 오류 발생:", error);
      return false;
    }
  };

  // 로그아웃
  const logout = async () => {
    try {
      await logoutAdmin();
    } catch (error) {
      console.error("서버 로그아웃 실패:", error);
    }

    setUser(null);
    setIsAuthenticated(false);
    router.push("/");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
