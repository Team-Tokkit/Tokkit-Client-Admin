"use client";

import { usePathname } from "next/navigation";
import MainLayout from "./MainLayout";

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname.startsWith("/login");

  if (isLoginPage) return <>{children}</>;

  return <MainLayout>{children}</MainLayout>;
}
