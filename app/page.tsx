"use client";

import LoginCard from "@/app/login/components/LoginCard";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-100/70 to-gray-200/70 mix-blend-multiply"></div>
        <div className="absolute inset-0 bg-[url('/noise-pattern.png')] opacity-10"></div>
      </div>

      <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-500 rounded-full opacity-10 blur-3xl"></div>
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-500 rounded-full opacity-10 blur-3xl"></div>

      <div className="relative z-10 w-full max-w-md px-4 py-8 sm:px-0">
        <LoginCard />
        <div className="mt-8 text-center text-gray-600 text-sm">
          <p>© 2025 관리자 대시보드. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
