"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResponsiveTable } from "./responsive-table";
import {
  Search,
  Filter,
  Banknote,
  CreditCard,
  RefreshCcw,
  Download,
} from "lucide-react";

// 결제 트랜잭션 타입 정의
interface Payment {
  id: string;
  traceId: string;
  amount: number;
  status: "COMPLETED" | "PENDING" | "FAILED" | "REFUNDED" | "CANCELLED";
  paymentMethod:
    | "CARD"
    | "VIRTUAL_ACCOUNT"
    | "ACCOUNT_TRANSFER"
    | "MOBILE_PAYMENT"
    | "POINT";
  createdAt: string;
  updatedAt: string;
  userId: string;
  userName: string;
  merchantId: string;
  merchantName: string;
  voucherId: string;
  voucherName: string;
  orderId: string;
  cardInfo?: {
    cardNumber: string;
    cardCompany: string;
    installmentMonths: number;
  };
  refundInfo?: {
    refundedAt: string;
    reason: string;
    refundedAmount: number;
  };
}

interface RefundRequest {
  paymentId: string;
  reason: string;
  amount: number;
  traceId: string;
}

export function PaymentContent() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [filteredPayments, setFilteredPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [searchParams, setSearchParams] = useState({
    keyword: "",
    status: "all",
    paymentMethod: "all",
    dateRange: "all",
  });
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isRefundDialogOpen, setIsRefundDialogOpen] = useState(false);
  const [refundData, setRefundData] = useState<Partial<RefundRequest>>({
    reason: "",
    amount: 0,
  });

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    fetchPayments();
  }, []);

  // 탭 또는 검색 파라미터 변경 시 필터링
  useEffect(() => {
    filterPayments();
  }, [activeTab, searchParams, payments]);

  // 결제 목록 조회
  const fetchPayments = async () => {
    setIsLoading(true);
    try {
      /*
      // TODO: API 연동 코드 (나중에 주석 해제하면 바로 적용 가능)
      const response = await api.get<Payment[]>('/payments');
      setPayments(response);
      */

      // 더미 데이터 사용
      setTimeout(() => {
        setPayments(mockPayments);
        setIsLoading(false);
      }, 500);
    } catch (error) {
      console.error("결제 데이터 로딩 중 오류 발생:", error);
      setIsLoading(false);
    }
  };

  // 결제 필터링
  const filterPayments = () => {
    let filtered = [...payments];

    // 탭에 따른 필터링
    if (activeTab !== "all") {
      filtered = filtered.filter((payment) => {
        switch (activeTab) {
          case "completed":
            return payment.status === "COMPLETED";
          case "pending":
            return payment.status === "PENDING";
          case "failed":
            return payment.status === "FAILED";
          case "refunded":
            return payment.status === "REFUNDED";
          case "cancelled":
            return payment.status === "CANCELLED";
          default:
            return true;
        }
      });
    }

    // 키워드 검색
    if (searchParams.keyword) {
      const keyword = searchParams.keyword.toLowerCase();
      filtered = filtered.filter(
        (payment) =>
          payment.id.toLowerCase().includes(keyword) ||
          payment.traceId.toLowerCase().includes(keyword) ||
          payment.userName.toLowerCase().includes(keyword) ||
          payment.merchantName.toLowerCase().includes(keyword) ||
          payment.voucherName.toLowerCase().includes(keyword) ||
          payment.orderId.toLowerCase().includes(keyword)
      );
    }

    // 상태 필터링
    if (searchParams.status !== "all") {
      filtered = filtered.filter(
        (payment) => payment.status === searchParams.status
      );
    }

    // 결제 방식 필터링
    if (searchParams.paymentMethod !== "all") {
      filtered = filtered.filter(
        (payment) => payment.paymentMethod === searchParams.paymentMethod
      );
    }

    // 날짜 필터링
    if (searchParams.dateRange !== "all") {
      const now = new Date();
      const filterDate = new Date();

      switch (searchParams.dateRange) {
        case "today":
          filterDate.setDate(now.getDate() - 1);
          break;
        case "week":
          filterDate.setDate(now.getDate() - 7);
          break;
        case "month":
          filterDate.setMonth(now.getMonth() - 1);
          break;
        case "quarter":
          filterDate.setMonth(now.getMonth() - 3);
          break;
      }

      filtered = filtered.filter((payment) => {
        const paymentDate = new Date(payment.createdAt);
        return paymentDate >= filterDate;
      });
    }

    setFilteredPayments(filtered);
  };

  // 탭 변경 핸들러
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  // 검색 파라미터 변경 핸들러
  const handleSearchParamChange = (name: string, value: string) => {
    setSearchParams((prev) => ({ ...prev, [name]: value }));
  };

  // 결제 상세 보기
  const handleViewPayment = (payment: Payment) => {
    setSelectedPayment(payment);
    setIsDetailOpen(true);
  };

  // 환불 다이얼로그 열기
  const handleOpenRefundDialog = (payment: Payment) => {
    if (payment.status !== "COMPLETED") {
      toast({
        title: "환불 불가",
        description: "완료된 결제만 환불할 수 있습니다.",
        variant: "destructive",
      });
      return;
    }

    setSelectedPayment(payment);
    setRefundData({
      paymentId: payment.id,
      amount: payment.amount,
      reason: "",
    });
    setIsRefundDialogOpen(true);
  };

  // 환불 처리
  const handleRefund = async () => {
    try {
      if (!selectedPayment || !refundData.reason || !refundData.amount) {
        toast({
          title: "입력 오류",
          description: "환불 사유와 금액을 모두 입력해주세요.",
          variant: "destructive",
        });
        return;
      }

      /*
      // TODO: API 연동 코드 (나중에 주석 해제하면 바로 적용 가능)
      await api.post('/payments/refunds', {
        paymentId: refundData.paymentId,
        reason: refundData.reason,
        amount: refundData.amount,
        traceId: refundData.traceId
      });
      */

      toast({
        title: "환불 처리 완료",
        description: `${formatCurrency(
          refundData.amount as number
        )}이 환불 처리되었습니다.`,
      });

      setIsRefundDialogOpen(false);
      fetchPayments(); // 목록 새로고침
    } catch (error) {
      console.error("환불 처리 중 오류 발생:", error);
      toast({
        title: "환불 처리 실패",
        description: "환불 처리 중 문제가 발생했습니다.",
        variant: "destructive",
      });
    }
  };

  // 금액 포맷 함수
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("ko-KR", {
      style: "currency",
      currency: "KRW",
    }).format(amount);
  };

  // 날짜 포맷 함수
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // 결제 방식 표시
  const getPaymentMethodDisplay = (method: string) => {
    switch (method) {
      case "CARD":
        return (
          <Badge variant="outline" className="flex items-center gap-1">
            <CreditCard className="h-3 w-3" /> 카드
          </Badge>
        );
      case "VIRTUAL_ACCOUNT":
        return (
          <Badge variant="outline" className="flex items-center gap-1">
            <Banknote className="h-3 w-3" /> 가상계좌
          </Badge>
        );
      case "ACCOUNT_TRANSFER":
        return <Badge variant="outline">계좌이체</Badge>;
      case "MOBILE_PAYMENT":
        return <Badge variant="outline">모바일결제</Badge>;
      case "POINT":
        return <Badge variant="outline">포인트</Badge>;
      default:
        return <Badge variant="outline">{method}</Badge>;
    }
  };

  // 결제 상태 배지
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            완료
          </Badge>
        );
      case "PENDING":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            대기
          </Badge>
        );
      case "FAILED":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            실패
          </Badge>
        );
      case "REFUNDED":
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            환불
          </Badge>
        );
      case "CANCELLED":
        return (
          <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">
            취소
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">
            {status}
          </Badge>
        );
    }
  };

  // 테이블 컬럼 정의
  const columns = [
    {
      key: "id",
      header: "결제 ID",
      cell: (payment: Payment) => (
        <span className="font-medium">{payment.id.substring(0, 8)}...</span>
      ),
      className: "w-[100px]",
      hideOnMobile: true,
    },
    {
      key: "amount",
      header: "금액",
      cell: (payment: Payment) => (
        <span className="font-medium">{formatCurrency(payment.amount)}</span>
      ),
    },
    {
      key: "status",
      header: "상태",
      cell: (payment: Payment) => getStatusBadge(payment.status),
    },
    {
      key: "paymentMethod",
      header: "결제 수단",
      cell: (payment: Payment) =>
        getPaymentMethodDisplay(payment.paymentMethod),
      hideOnMobile: true,
    },
    {
      key: "userName",
      header: "사용자",
      cell: (payment: Payment) => payment.userName,
      hideOnMobile: true,
    },
    {
      key: "createdAt",
      header: "결제일시",
      cell: (payment: Payment) => formatDate(payment.createdAt),
    },
    {
      key: "actions",
      header: "",
      cell: (payment: Payment) => (
        <div className="flex justify-end gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleViewPayment(payment)}
          >
            상세
          </Button>
          {payment.status === "COMPLETED" && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleOpenRefundDialog(payment)}
            >
              환불
            </Button>
          )}
        </div>
      ),
      className: "text-right",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">결제 관리</h1>
        <div className="flex flex-col md:flex-row gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="결제 검색..."
              className="pl-8 w-full md:w-[250px]"
              value={searchParams.keyword}
              onChange={(e) =>
                handleSearchParamChange("keyword", e.target.value)
              }
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Select
              value={searchParams.dateRange}
              onValueChange={(value) =>
                handleSearchParamChange("dateRange", value)
              }
            >
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="기간" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체 기간</SelectItem>
                <SelectItem value="today">오늘</SelectItem>
                <SelectItem value="week">최근 7일</SelectItem>
                <SelectItem value="month">최근 30일</SelectItem>
                <SelectItem value="quarter">최근 90일</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="gap-1 hidden md:flex">
              <Filter className="h-4 w-4" /> 필터
            </Button>
          </div>
          <Button variant="outline" className="gap-1" onClick={fetchPayments}>
            <RefreshCcw className="h-4 w-4" /> 새로고침
          </Button>
          <Button variant="outline" className="gap-1">
            <Download className="h-4 w-4" /> 내보내기
          </Button>
        </div>
      </div>

      <Tabs
        defaultValue="all"
        value={activeTab}
        onValueChange={handleTabChange}
      >
        <TabsList>
          <TabsTrigger value="all">전체</TabsTrigger>
          <TabsTrigger value="completed">완료</TabsTrigger>
          <TabsTrigger value="pending">대기</TabsTrigger>
          <TabsTrigger value="refunded">환불</TabsTrigger>
          <TabsTrigger value="failed">실패</TabsTrigger>
          <TabsTrigger value="cancelled">취소</TabsTrigger>
        </TabsList>
      </Tabs>

      <Card className="overflow-hidden">
        <ResponsiveTable
          data={filteredPayments}
          columns={columns}
          emptyMessage="결제 내역이 없습니다."
        />
      </Card>

      {/* 결제 상세 다이얼로그 */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>결제 상세 정보</DialogTitle>
            <DialogDescription>
              결제 트랜잭션의 상세 정보입니다.
            </DialogDescription>
          </DialogHeader>

          {selectedPayment && (
            <div className="py-4 space-y-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-semibold">결제 ID</div>
                <div className="col-span-3 text-sm font-mono">
                  {selectedPayment.id}
                </div>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-semibold">추적 ID</div>
                <div className="col-span-3 text-sm font-mono">
                  {selectedPayment.traceId}
                </div>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-semibold">금액</div>
                <div className="col-span-3 font-medium">
                  {formatCurrency(selectedPayment.amount)}
                </div>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-semibold">상태</div>
                <div className="col-span-3">
                  {getStatusBadge(selectedPayment.status)}
                </div>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-semibold">결제 수단</div>
                <div className="col-span-3">
                  {getPaymentMethodDisplay(selectedPayment.paymentMethod)}
                </div>
              </div>

              {selectedPayment.paymentMethod === "CARD" &&
                selectedPayment.cardInfo && (
                  <>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <div className="font-semibold">카드번호</div>
                      <div className="col-span-3">
                        {selectedPayment.cardInfo.cardNumber}
                      </div>
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                      <div className="font-semibold">카드사</div>
                      <div className="col-span-3">
                        {selectedPayment.cardInfo.cardCompany}
                      </div>
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                      <div className="font-semibold">할부</div>
                      <div className="col-span-3">
                        {selectedPayment.cardInfo.installmentMonths > 0
                          ? `${selectedPayment.cardInfo.installmentMonths}개월`
                          : "일시불"}
                      </div>
                    </div>
                  </>
                )}

              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-semibold">사용자</div>
                <div className="col-span-3">{selectedPayment.userName}</div>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-semibold">판매자</div>
                <div className="col-span-3">{selectedPayment.merchantName}</div>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-semibold">바우처</div>
                <div className="col-span-3">{selectedPayment.voucherName}</div>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-semibold">주문 ID</div>
                <div className="col-span-3 text-sm font-mono">
                  {selectedPayment.orderId}
                </div>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-semibold">결제 시간</div>
                <div className="col-span-3">
                  {formatDate(selectedPayment.createdAt)}
                </div>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-semibold">업데이트</div>
                <div className="col-span-3">
                  {formatDate(selectedPayment.updatedAt)}
                </div>
              </div>

              {selectedPayment.status === "REFUNDED" &&
                selectedPayment.refundInfo && (
                  <>
                    <div className="mt-6 border-t pt-4">
                      <h3 className="font-bold mb-2">환불 정보</h3>
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                      <div className="font-semibold">환불 금액</div>
                      <div className="col-span-3 font-medium">
                        {formatCurrency(
                          selectedPayment.refundInfo.refundedAmount
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                      <div className="font-semibold">환불 시간</div>
                      <div className="col-span-3">
                        {formatDate(selectedPayment.refundInfo.refundedAt)}
                      </div>
                    </div>

                    <div className="grid grid-cols-4 items-start gap-4">
                      <div className="font-semibold">환불 사유</div>
                      <div className="col-span-3">
                        {selectedPayment.refundInfo.reason}
                      </div>
                    </div>
                  </>
                )}
            </div>
          )}

          <DialogFooter className="flex space-x-2 justify-end">
            <Button variant="outline" onClick={() => setIsDetailOpen(false)}>
              닫기
            </Button>
            {selectedPayment && selectedPayment.status === "COMPLETED" && (
              <Button
                onClick={() => {
                  setIsDetailOpen(false);
                  handleOpenRefundDialog(selectedPayment);
                }}
              >
                환불 처리
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 환불 다이얼로그 */}
      <Dialog open={isRefundDialogOpen} onOpenChange={setIsRefundDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>환불 처리</DialogTitle>
            <DialogDescription>
              환불 금액과 사유를 입력해주세요.
            </DialogDescription>
          </DialogHeader>

          {selectedPayment && (
            <div className="py-4 space-y-4">
              <div className="grid grid-cols-3 items-center gap-4">
                <div className="font-semibold">결제 ID</div>
                <div className="col-span-2">{selectedPayment.id}</div>
              </div>

              <div className="grid grid-cols-3 items-center gap-4">
                <div className="font-semibold">원래 금액</div>
                <div className="col-span-2">
                  {formatCurrency(selectedPayment.amount)}
                </div>
              </div>

              <div className="grid grid-cols-3 items-center gap-4">
                <div className="font-semibold">환불 금액</div>
                <div className="col-span-2">
                  <Input
                    type="number"
                    value={refundData.amount?.toString() || ""}
                    onChange={(e) =>
                      setRefundData({
                        ...refundData,
                        amount: Number.parseFloat(e.target.value),
                      })
                    }
                    placeholder="환불 금액을 입력하세요"
                    className="w-full"
                    max={selectedPayment.amount}
                  />
                  {refundData.amount &&
                    refundData.amount > selectedPayment.amount && (
                      <p className="text-red-500 text-sm mt-1">
                        환불 금액은 결제 금액을 초과할 수 없습니다.
                      </p>
                    )}
                </div>
              </div>

              <div className="grid grid-cols-3 items-start gap-4">
                <div className="font-semibold">환불 사유</div>
                <div className="col-span-2">
                  <Input
                    value={refundData.reason || ""}
                    onChange={(e) =>
                      setRefundData({ ...refundData, reason: e.target.value })
                    }
                    placeholder="환불 사유를 입력하세요"
                    className="w-full"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 items-center gap-4">
                <div className="font-semibold">추적 ID</div>
                <div className="col-span-2 text-sm font-mono">
                  {refundData.traceId}
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="flex space-x-2 justify-end">
            <Button
              variant="outline"
              onClick={() => setIsRefundDialogOpen(false)}
            >
              취소
            </Button>
            <Button
              onClick={handleRefund}
              // disabled={
              //   !refundData.reason ||
              //   !refundData.amount ||
              //   (refundData.amount && refundData.amount > (selectedPayment?.amount || 0))
              // }
            >
              환불 처리
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// 임시 데이터
const mockPayments: Payment[] = [
  {
    id: "pmt-123456",
    traceId: "trace-1234-abcd",
    amount: 15000,
    status: "COMPLETED",
    paymentMethod: "CARD",
    createdAt: "2023-05-15T08:30:00Z",
    updatedAt: "2023-05-15T08:30:00Z",
    userId: "usr-123456",
    userName: "홍길동",
    merchantId: "merch-123456",
    merchantName: "맛있는 식당 그룹",
    voucherId: "vch-123456",
    voucherName: "맛있는 식당 30% 할인",
    orderId: "ord-123456",
    cardInfo: {
      cardNumber: "1234-56**-****-7890",
      cardCompany: "신한카드",
      installmentMonths: 0,
    },
  },
  {
    id: "pmt-234567",
    traceId: "trace-2345-bcde",
    amount: 8000,
    status: "REFUNDED",
    paymentMethod: "CARD",
    createdAt: "2023-05-14T14:20:00Z",
    updatedAt: "2023-05-14T16:45:00Z",
    userId: "usr-234567",
    userName: "김철수",
    merchantId: "merch-234567",
    merchantName: "행복 카페 체인",
    voucherId: "vch-234567",
    voucherName: "행복 카페 아메리카노 1+1",
    orderId: "ord-234567",
    cardInfo: {
      cardNumber: "5678-12**-****-3456",
      cardCompany: "삼성카드",
      installmentMonths: 0,
    },
    refundInfo: {
      refundedAt: "2023-05-14T16:45:00Z",
      reason: "고객 요청",
      refundedAmount: 8000,
    },
  },
  {
    id: "pmt-345678",
    traceId: "trace-3456-cdef",
    amount: 30000,
    status: "COMPLETED",
    paymentMethod: "VIRTUAL_ACCOUNT",
    createdAt: "2023-05-13T10:15:00Z",
    updatedAt: "2023-05-13T10:15:00Z",
    userId: "usr-345678",
    userName: "이영희",
    merchantId: "merch-345678",
    merchantName: "뷰티 살롱",
    voucherId: "vch-345678",
    voucherName: "뷰티살롱 헤어컷 50% 할인",
    orderId: "ord-345678",
  },
  {
    id: "pmt-456789",
    traceId: "trace-4567-defg",
    amount: 25000,
    status: "PENDING",
    paymentMethod: "ACCOUNT_TRANSFER",
    createdAt: "2023-05-12T09:30:00Z",
    updatedAt: "2023-05-12T09:30:00Z",
    userId: "usr-456789",
    userName: "박민수",
    merchantId: "merch-456789",
    merchantName: "엔터테인먼트 그룹",
    voucherId: "vch-456789",
    voucherName: "영화관 2인 패키지",
    orderId: "ord-456789",
  },
  {
    id: "pmt-567890",
    traceId: "trace-5678-efgh",
    amount: 50000,
    status: "FAILED",
    paymentMethod: "CARD",
    createdAt: "2023-05-11T13:45:00Z",
    updatedAt: "2023-05-11T13:45:00Z",
    userId: "usr-567890",
    userName: "최지은",
    merchantId: "merch-567890",
    merchantName: "옷 가게",
    voucherId: "vch-567890",
    voucherName: "패션 스토어 10% 할인",
    orderId: "ord-567890",
    cardInfo: {
      cardNumber: "9012-34**-****-5678",
      cardCompany: "현대카드",
      installmentMonths: 3,
    },
  },
  {
    id: "pmt-678901",
    traceId: "trace-6789-fghi",
    amount: 100000,
    status: "CANCELLED",
    paymentMethod: "MOBILE_PAYMENT",
    createdAt: "2023-05-10T11:20:00Z",
    updatedAt: "2023-05-10T11:25:00Z",
    userId: "usr-678901",
    userName: "정동훈",
    merchantId: "merch-678901",
    merchantName: "스포츠 센터",
    voucherId: "vch-678901",
    voucherName: "스포츠 센터 월 이용권",
    orderId: "ord-678901",
  },
];
