"use client";

import Image from "next/image";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import LoginForm from "./LoginForm";

export default function LoginCard() {
  return (
    <Card className="w-full backdrop-blur-md bg-white/80 border-white/20 shadow-2xl relative">
      <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
        <Image
          src="/admin-interface.png"
          alt="로고"
          width={80}
          height={80}
          className="rounded-full border-4 border-white/50"
        />
      </div>

      <CardHeader className="space-y-2 text-center pt-16">
        <CardTitle className="text-2xl font-bold text-gray-800">
          관리자 대시보드
        </CardTitle>
        <CardDescription className="text-gray-600">
          계정 정보를 입력하여 로그인하세요.
        </CardDescription>
      </CardHeader>

      <LoginForm />
    </Card>
  );
}
