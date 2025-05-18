"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import VoucherIssueForm from "@/components/voucher-issue-form";
import { VoucherContent } from "@/components/voucher-content";
import { NoticeContent } from "@/components/notice-content";
import { AuthContent } from "@/components/auth-content";
import { PaymentContent } from "@/components/payment-content";
import { MerchantContent } from "@/components/merchant-content";
import { SystemLogContent } from "@/components/system-log-content";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Home() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showVoucherIssue, setShowVoucherIssue] = useState(false);
  const [voucherToEdit, setVoucherToEdit] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    router.replace("/login");
  }, [router]);

  // 바우처 발행 폼 토글
  const toggleVoucherIssue = (voucher = null) => {
    setVoucherToEdit(voucher);
    setShowVoucherIssue(!showVoucherIssue);
  };

  // 바우처 발행 완료 핸들러
  const handleVoucherIssueComplete = () => {
    setShowVoucherIssue(false);
    setVoucherToEdit(null);
    // 여기에 바우처 목록 새로고침 로직 추가
  };

  // 탭 변경 핸들러
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false); // 모바일에서 탭 선택 시 메뉴 닫기
  };

  // 현재 날짜 및 시간
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  // 현재 시간 업데이트
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 60000); // 1분마다 업데이트

    return () => clearInterval(timer);
  }, []);

  // 날짜 포맷팅
  const formatDate = (date) => {
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long",
    });
  };

  // 시간 포맷팅
  const formatTime = (date) => {
    return date.toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="flex flex-1 overflow-hidden">
        {/* 메인 콘텐츠 */}
        <div className="flex-1 overflow-auto">
          <div className="p-4 md:p-6">
            {/* 대시보드 */}
            {activeTab === "dashboard" && <DashboardContent />}

            {/* 바우처 관리 */}
            {activeTab === "voucher" && (
              <>
                {showVoucherIssue ? (
                  <VoucherIssueForm
                    voucher={voucherToEdit}
                    onCancel={toggleVoucherIssue}
                    onComplete={handleVoucherIssueComplete}
                  />
                ) : (
                  <VoucherContent onIssueClick={toggleVoucherIssue} />
                )}
              </>
            )}

            {/* 사용자 관리 */}
            {activeTab === "user" && <UserContent />}

            {/* 공지사항 관리 */}
            {activeTab === "notice" && <NoticeContent />}

            {/* 인증 관리 */}
            {activeTab === "auth" && <AuthContent />}

            {/* 결제 관리 */}
            {activeTab === "payment" && <PaymentContent />}

            {/* 판매자 관리 */}
            {activeTab === "merchant" && <MerchantContent />}

            {/* 시스템 로그 */}
            {activeTab === "system" && <SystemLogContent />}
          </div>
        </div>
      </div>
    </div>
  );
}

// 대시보드 컴포넌트
function DashboardContent() {
  // 샘플 데이터
  const stats = [
    {
      title: "총 바우처 수",
      value: "1,234",
      change: "+12%",
      changeType: "increase",
    },
    {
      title: "활성 사용자",
      value: "5,678",
      change: "+7.3%",
      changeType: "increase",
    },
    {
      title: "판매자 수",
      value: "246",
      change: "+2.5%",
      changeType: "increase",
    },
    {
      title: "이번 달 매출",
      value: "₩12,345,678",
      change: "-3.2%",
      changeType: "decrease",
    },
  ];

  const recentVouchers = [
    {
      id: "V001",
      name: "맛있는 식당 30% 할인",
      status: "활성",
      date: "2023-05-15",
    },
    {
      id: "V002",
      name: "행복 카페 아메리카노 1+1",
      status: "활성",
      date: "2023-05-14",
    },
    {
      id: "V003",
      name: "뷰티살롱 헤어컷 50% 할인",
      status: "소진",
      date: "2023-05-12",
    },
  ];

  const recentNotices = [
    { id: 1, title: "시스템 점검 안내", date: "2023-05-15" },
    { id: 2, title: "바우처 발행 정책 변경 안내", date: "2023-05-10" },
    { id: 3, title: "신규 판매자 등록 절차 안내", date: "2023-05-05" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">대시보드</h1>
        <p className="text-muted-foreground">
          시스템 현황 및 주요 지표를 확인하세요.
        </p>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex flex-col gap-1">
                <p className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </p>
                <div className="flex items-center justify-between">
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <span
                    className={`text-xs font-medium ${
                      stat.changeType === "increase"
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {stat.change}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 최근 바우처 및 공지사항 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 최근 바우처 */}
        <Card>
          <CardHeader>
            <CardTitle>최근 발행된 바우처</CardTitle>
            <CardDescription>최근에 발행된 바우처 목록입니다.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentVouchers.map((voucher) => (
                <div
                  key={voucher.id}
                  className="flex items-center justify-between border-b pb-2 last:border-0"
                >
                  <div>
                    <p className="font-medium">{voucher.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {voucher.date}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      voucher.status === "활성"
                        ? "bg-green-100 text-green-800"
                        : voucher.status === "소진"
                        ? "bg-orange-100 text-orange-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {voucher.status}
                  </span>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              모든 바우처 보기
            </Button>
          </CardContent>
        </Card>

        {/* 최근 공지사항 */}
        <Card>
          <CardHeader>
            <CardTitle>최근 공지사항</CardTitle>
            <CardDescription>최근에 등록된 공지사항입니다.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentNotices.map((notice) => (
                <div
                  key={notice.id}
                  className="flex items-center justify-between border-b pb-2 last:border-0"
                >
                  <div>
                    <p className="font-medium">{notice.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {notice.date}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              모든 공지사항 보기
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* 시스템 상태 */}
      <Card>
        <CardHeader>
          <CardTitle>시스템 상태</CardTitle>
          <CardDescription>현재 시스템의 상태를 확인합니다.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span>API 서버</span>
              <span className="flex items-center text-green-500">
                <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                정상
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span>데이터베이스</span>
              <span className="flex items-center text-green-500">
                <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                정상
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span>결제 시스템</span>
              <span className="flex items-center text-green-500">
                <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                정상
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span>알림 서비스</span>
              <span className="flex items-center text-yellow-500">
                <span className="h-2 w-2 rounded-full bg-yellow-500 mr-2"></span>
                부분 지연
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// 다른 컴포넌트들은 이전과 동일하게 유지
function UserContent() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">사용자 관리</h1>
      <p>사용자 관리 컴포넌트가 여기에 표시됩니다.</p>
    </div>
  );
}
