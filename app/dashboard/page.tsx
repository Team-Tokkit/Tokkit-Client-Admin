"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/common/Page-Header";
import { DashboardStats } from "./components/Stats";
import { DashboardOverview } from "./components/Overview";
import { DashboardSystemStatus } from "./components/SystemStatus";

export default function DashboardPage() {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const formatDate = (date: Date) =>
    date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long",
    });

  const formatTime = (date: Date) =>
    date.toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className="space-y-6">
      <PageHeader
        title="대시보드"
        description="시스템 현황 및 주요 지표를 확인하세요."
      />
      <p className="text-sm text-muted-foreground mt-1">
        {formatDate(currentDateTime)} / {formatTime(currentDateTime)}
      </p>

      <DashboardStats />
      <DashboardOverview />
      <DashboardSystemStatus />
    </div>
  );
}
