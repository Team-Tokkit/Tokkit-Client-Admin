"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Search, Filter, Plus } from "lucide-react"

export default function VoucherPage() {
  const router = useRouter()
  const [searchParams, setSearchParams] = useState({
    keyword: "",
    status: "all",
    category: "all",
  })

  // 검색 파라미터 변경 핸들러
  const handleSearchParamChange = (name, value) => {
    setSearchParams((prev) => ({ ...prev, [name]: value }))
  }

  // 바우처 발행 페이지로 이동
  const handleIssueVoucher = () => {
    router.push("/voucher/issue")
  }

  return (
    <div className="space-y-6 p-6">
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
          <div className="flex gap-2">
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
            <Button variant="outline" className="gap-1">
              <Filter className="h-4 w-4" /> 필터
            </Button>
          </div>
          <Button onClick={handleIssueVoucher} className="gap-1">
            <Plus className="h-4 w-4" /> 바우처 발행
          </Button>
        </div>
      </div>

      <Card className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">바우처 ID</TableHead>
              <TableHead>바우처명</TableHead>
              <TableHead>카테고리</TableHead>
              <TableHead>가격</TableHead>
              <TableHead>정가</TableHead>
              <TableHead>남은 수량</TableHead>
              <TableHead>유효기간</TableHead>
              <TableHead>상태</TableHead>
              <TableHead className="text-right">액션</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {voucherData.map((voucher) => (
              <TableRow key={voucher.id}>
                <TableCell className="font-medium">{voucher.id}</TableCell>
                <TableCell>{voucher.name}</TableCell>
                <TableCell>{getCategoryLabel(voucher.category)}</TableCell>
                <TableCell>{formatPrice(voucher.price)}</TableCell>
                <TableCell>{formatPrice(voucher.originalPrice)}</TableCell>
                <TableCell>{`${voucher.remainingCount}/${voucher.totalCount}`}</TableCell>
                <TableCell>{voucher.validDate}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusClass(voucher.status)}`}>
                    {voucher.status}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">
                    상세보기
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#" isActive>
              1
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">2</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">3</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
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

// 가격 포맷 함수
function formatPrice(price) {
  return new Intl.NumberFormat("ko-KR", { style: "currency", currency: "KRW" }).format(price)
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
