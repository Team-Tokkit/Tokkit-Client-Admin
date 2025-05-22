"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  BarChart3,
  Ticket,
  Users,
  FileText,
  ShieldCheck,
  CreditCard,
  Store,
  Terminal,
  LogOut,
  TriangleAlert,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth-provider";

const menu = [
  { label: "대시보드", icon: BarChart3, path: "/dashboard" },
  { label: "인증 관리", icon: ShieldCheck, path: "/auth" },
  { label: "결제 관리", icon: CreditCard, path: "/transaction" },
  { label: "사용자 관리", icon: Users, path: "/user" },
  { label: "판매자 관리", icon: Store, path: "/merchant" },
  { label: "바우처 관리", icon: Ticket, path: "/voucher" },
  { label: "공지사항 관리", icon: FileText, path: "/notice" },
  { label: "API 요청 로그", icon: Terminal, path: "/api-logs" },
  { label: "시스템 에러 로그", icon: TriangleAlert, path: "/error-logs" },
];

export default function Sidebar({
  isMobile = false,
  onNavigate,
}: {
  isMobile?: boolean;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();

  return (
    <div
      className={`${
        isMobile ? "" : "hidden md:block"
      } w-64 h-full bg-muted/40 border-r p-4`}
    >
      <nav className="space-y-2">
        {menu.map(({ label, icon: Icon, path }) => (
          <Button
            key={path}
            variant={pathname.startsWith(path) ? "default" : "ghost"}
            className="w-full justify-start"
            onClick={() => {
              router.push(path);
              onNavigate?.();
            }}
          >
            <Icon className="mr-2 h-4 w-4" />
            {label}
          </Button>
        ))}
      </nav>

      {isMobile && (
        <div className="pt-4 border-t mt-4">
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={logout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            로그아웃
          </Button>
        </div>
      )}
    </div>
  );
}
