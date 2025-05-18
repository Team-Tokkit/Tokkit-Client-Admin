"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, Plus } from "lucide-react"
import { VoucherDetailDialog } from "./voucher-detail-dialog"
import { ResponsiveTable } from "./responsive-table"
import { formatPrice } from "@/lib/utils"

export function VoucherContent({ onIssueClick }) {
  const [searchParams, setSearchParams] = useState({
    keyword: "",
    status: "all",
    category: "all",
    priceRange: "all",
  })
  const [selectedVoucher, setSelectedVoucher] = useState(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)

  // 검색 파라미터 변경 핸들러
  const handleSearchParamChange = (name, value) => {
    setSearchParams((prev) => ({ ...prev, [name]: value }))
  }

  // 바우처 상세보기
  const handleViewVoucher = (voucher) => {
    setSelectedVoucher(voucher)
    setIsDetailOpen(true)
  }

  // 바우처 수정
  const handleEditVoucher = (voucher) => {
    setIsDetailOpen(false)
    // 바우처 발행 폼으로 이동하여 수정 모드로 전환
    onIssueClick(voucher)
  }

  // 테이블 컬럼 정의
  const columns = [
    {
      key: "id",
      header: "ID",
      cell: (voucher) => <span className="font-medium">{voucher.id}</span>,
      className: "w-[70px]",
      hideOnMobile: true,
    },
    {
      key: "name",
      header: "바우처명",
      cell: (voucher) => voucher.name,
    },
    {
      key: "category",
      header: "카테고리",
      cell: (voucher) => getCategoryLabel(voucher.category),
      hideOnMobile: true,
    },
    {
      key: "price",
      header: "할인가",
      cell: (voucher) => formatPrice(voucher.price),
    },
    {
      key: "originalPrice",
      header: "정가",
      cell: (voucher) => formatPrice(voucher.originalPrice),
      hideOnMobile: true,
    },
    {
      key: "totalCount",
      header: "수량",
      cell: (voucher) => voucher.totalCount,
      hideOnMobile: true,
    },
    {
      key: "remainingCount",
      header: "남은 수량",
      cell: (voucher) => voucher.remainingCount,
    },
    {
      key: "validDate",
      header: "유효기간",
      cell: (voucher) => voucher.validDate,
      hideOnMobile: true,
    },
    {
      key: "status",
      header: "상태",
      cell: (voucher) => (
        <span className={`px-2 py-1 rounded-full text-xs ${getStatusClass(voucher.status)}`}>{voucher.status}</span>
      ),
    },
    {
      key: "actions",
      header: "액션",
      cell: (voucher) => (
        <Button variant="ghost" size="sm" onClick={() => handleViewVoucher(voucher)}>
          상세보기
        </Button>
      ),
      className: "text-right",
    },
  ]

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">바우처 관리</h1>
        <div className="flex flex-col md:flex-row gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="바우처 검색..."
              className="pl-8 w-full md:w-[250px]"
              value={searchParams.keyword}
              onChange={(e) => handleSearchParamChange("keyword", e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Select value={searchParams.status} onValueChange={(value) => handleSearchParamChange("status", value)}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="상태" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">모든 상태</SelectItem>
                <SelectItem value="active">활성</SelectItem>
                <SelectItem value="expired">만료</SelectItem>
                <SelectItem value="soldout">소진</SelectItem>
              </SelectContent>
            </Select>
            <Select value={searchParams.category} onValueChange={(value) => handleSearchParamChange("category", value)}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="카테고리" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체 카테고리</SelectItem>
                <SelectItem value="RESTAURANT">음식점</SelectItem>
                <SelectItem value="CAFE">카페</SelectItem>
                <SelectItem value="BEAUTY">미용실</SelectItem>
                <SelectItem value="ENTERTAINMENT">엔터테인먼트</SelectItem>
                <SelectItem value="RETAIL">소매</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={searchParams.priceRange}
              onValueChange={(value) => handleSearchParamChange("priceRange", value)}
            >
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="가격대" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">모든 가격대</SelectItem>
                <SelectItem value="0-5000">~5,000원</SelectItem>
                <SelectItem value="5000-10000">5,000원~10,000원</SelectItem>
                <SelectItem value="10000-30000">10,000원~30,000원</SelectItem>
                <SelectItem value="30000+">30,000원 이상</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="gap-1 hidden md:flex">
              <Filter className="h-4 w-4" /> 필터
            </Button>
          </div>
          <Button onClick={() => onIssueClick()} className="gap-1">
            <Plus className="h-4 w-4" /> 바우처 발행
          </Button>
        </div>
      </div>

      <Card className="overflow-hidden">
        <ResponsiveTable data={voucherData} columns={columns} emptyMessage="바우처가 없습니다." />
      </Card>

      {/* 바우처 상세보기 다이얼로그 */}
      <VoucherDetailDialog
        voucher={selectedVoucher}
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
        onEdit={handleEditVoucher}
      />
    </div>
  )
}

// 카테고리 라벨 변환 함수
function getCategoryLabel(category) {
  const categoryMap = {
    RESTAURANT: "음식점",
    CAFE: "카페",
    BEAUTY: "미용실",
    ENTERTAINMENT: "엔터테인먼트",
    RETAIL: "소매",
  }
  return categoryMap[category] || category
}

// 상태에 따른 클래스 반환 함수
function getStatusClass(status) {
  switch (status.toLowerCase()) {
    case "active":
    case "활성":
      return "bg-green-100 text-green-800"
    case "expired":
    case "만료":
      return "bg-gray-100 text-gray-800"
    case "soldout":
    case "소진":
      return "bg-orange-100 text-orange-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

// 샘플 바우처 데이터
const voucherData = [
  {
    id: "V001",
    name: "맛있는 식당 30% 할인",
    category: "RESTAURANT",
    price: 7000,
    originalPrice: 10000,
    totalCount: 100,
    remainingCount: 75,
    validDate: "2023-12-31",
    status: "활성",
    description: "맛있는 식당의 모든 메뉴 30% 할인 바우처",
    detailDescription: "주말 및 공휴일에도 사용 가능합니다.",
    refundPolicy: "구매 후 7일 이내 환불 가능",
    contact: "02-1234-5678",
  },
  {
    id: "V002",
    name: "행복 카페 아메리카노 1+1",
    category: "CAFE",
    price: 4000,
    originalPrice: 8000,
    totalCount: 200,
    remainingCount: 120,
    validDate: "2023-11-30",
    status: "활성",
  },
  {
    id: "V003",
    name: "뷰티살롱 헤어컷 50% 할인",
    category: "BEAUTY",
    price: 15000,
    originalPrice: 30000,
    totalCount: 50,
    remainingCount: 0,
    validDate: "2023-10-31",
    status: "소진",
  },
  {
    id: "V004",
    name: "영화관 2인 패키지",
    category: "ENTERTAINMENT",
    price: 20000,
    originalPrice: 30000,
    totalCount: 100,
    remainingCount: 30,
    validDate: "2023-09-30",
    status: "만료",
  },
  {
    id: "V005",
    name: "패션 스토어 10% 할인",
    category: "RETAIL",
    price: 45000,
    originalPrice: 50000,
    totalCount: 300,
    remainingCount: 250,
    validDate: "2023-12-31",
    status: "활성",
  },
]
