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

  const isAdminProtected = protectedAdminPaths.some((path) =>
    pathname.startsWith(path)
  );

  if (isAdminProtected && !token) {
    return NextResponse.redirect(new URL("/auth", request.url));
  }

  if (token) {
    const payload = parseJwt(token.value);
    const role = payload?.role;

    if (isAdminProtected && role !== "ADMIN") {
      return NextResponse.redirect(new URL("/auth", request.url));
    }
  }

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
