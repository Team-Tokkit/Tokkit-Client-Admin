"use client";

import { useState, useEffect } from "react";
import { Menu, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import { useAuth } from "@/components/auth-provider";
import Sidebar from "./Sidebar";

export default function Header() {
  const { logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <header className="bg-white border-b px-4 py-3 flex items-center justify-between md:px-6">
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetTrigger asChild className="md:hidden">
          <Button variant="ghost" size="icon">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>

        <SheetContent side="left" className="p-0 w-64">
          <SheetHeader className="border-b px-4 py-3">
            <SheetTitle className="text-lg text-left font-semibold">
              관리자 대시보드
            </SheetTitle>
          </SheetHeader>

          <Sidebar isMobile onNavigate={() => setIsMobileMenuOpen(false)} />
        </SheetContent>
      </Sheet>

      <h1 className="text-xl font-bold">관리자 대시보드</h1>

      <Button
        variant="ghost"
        size="sm"
        onClick={logout}
        className="hidden md:flex"
      >
        <LogOut className="mr-2 h-4 w-4" />
        로그아웃
      </Button>
    </header>
  );
}
