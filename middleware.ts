import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import parseJwt from "@/lib/parseJwt";

// 관리자 보호 경로
const protectedAdminPaths = [
  "/user",
  "/voucher",
  "/notice",
  "/transaction",
  "/unified-logs",
  "/api-logs",
  "/error-logs",
  "/merchant",
];

export function middleware(request: NextRequest) {
  const token = request.cookies.get("accessToken");
  const pathname = request.nextUrl.pathname;
  console.log("토큰 확인: " + (token ? "토큰 존재" : "토큰 없음"));
  console.log("요청 경로: " + pathname);

  const isAdminProtected = protectedAdminPaths.some((path) =>
    pathname.startsWith(path)
  );
  console.log("관리자 보호 경로 여부: " + isAdminProtected);

  if (isAdminProtected && !token) {
    console.log("리다이렉트: 관리자 보호 경로 && 토큰 없음 -> /login");
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (token) {
    const payload = parseJwt(token.value);
    console.log("JWT 페이로드: ", payload);
    const role = payload?.role;
    console.log("사용자 역할: ", role);

    // if (isAdminProtected && role !== "ADMIN") {
    //   console.log("리다이렉트: 관리자 보호 경로 && 역할 ADMIN 아님 -> /auth");
    //   return NextResponse.redirect(new URL("/auth", request.url));
    // }
  }

  console.log("리다이렉트 없음: 정상 처리");
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/user/:path*",
    "/voucher/:path*",
    "/notice/:path*",
    "/transaction/:path*",
    "/unified-logs/:path*",
    "/api-logs/:path*",
    "/error-logs/:path*",
    "/merchant/:path*",
  ],
};
