"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"
import { ResponsiveTable } from "./responsive-table"
import { Search, Filter, Plus, Edit } from "lucide-react"

// 판매자 타입 정의
interface Merchant {
  id: string
  name: string
  businessNumber: string
  status: "ACTIVE" | "PENDING" | "SUSPENDED" | "INACTIVE"
  email: string
  phone: string
  address: string
  contactName: string
  storeCount: number
  joinedAt: string
  updatedAt: string
}

// 판매자 관리 컴포넌트
export function MerchantContent() {
  const [merchants, setMerchants] = useState<Merchant[]>([])
  const [filteredMerchants, setFilteredMerchants] = useState<Merchant[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchParams, setSearchParams] = useState({
    keyword: "",
    status: "all",
    dateRange: "all",
  })
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  // 판매자 상세 및 수정 관련 상태
  const [selectedMerchant, setSelectedMerchant] = useState<Merchant | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [formData, setFormData] = useState<Partial<Merchant>>({})

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    fetchMerchants()
  }, [])

  // 검색 파라미터 변경 시 필터링
  useEffect(() => {
    filterMerchants()
  }, [searchParams, merchants])

  // 판매자 목록 조회
  const fetchMerchants = async () => {
    setIsLoading(true)
    try {
      /*
      // TODO: API 연동 코드 (나중에 주석 해제하면 바로 적용 가능)
      const response = await api.get<{
        data: Merchant[];
        totalPages: number;
      }>('/merchants', {
        params: { page: currentPage, size: 10 }
      });
      setMerchants(response.data);
      setTotalPages(response.totalPages);
      */

      // 더미 데이터 사용
      setMerchants(mockMerchants)
      setTotalPages(Math.ceil(mockMerchants.length / 10))
      setIsLoading(false)
    } catch (error) {
      console.error("판매자 데이터 로딩 중 오류 발생:", error)
      setIsLoading(false)
    }
  }

  // 판매자 필터링
  const filterMerchants = () => {
    let filtered = [...merchants]

    // 키워드 검색
    if (searchParams.keyword) {
      const keyword = searchParams.keyword.toLowerCase()
      filtered = filtered.filter(
        (merchant) =>
          merchant.name.toLowerCase().includes(keyword) ||
          merchant.businessNumber.includes(keyword) ||
          merchant.email.toLowerCase().includes(keyword),
      )
    }

    // 상태 필터링
    if (searchParams.status !== "all") {
      filtered = filtered.filter((merchant) => merchant.status === searchParams.status)
    }

    // 날짜 필터링
    if (searchParams.dateRange !== "all") {
      const now = new Date()
      const filterDate = new Date()

      switch (searchParams.dateRange) {
        case "today":
          filterDate.setDate(now.getDate() - 1)
          break
        case "week":
          filterDate.setDate(now.getDate() - 7)
          break
        case "month":
          filterDate.setMonth(now.getMonth() - 1)
          break
        case "quarter":
          filterDate.setMonth(now.getMonth() - 3)
          break
      }

      filtered = filtered.filter((merchant) => {
        const joinedDate = new Date(merchant.joinedAt)
        return joinedDate >= filterDate
      })
    }

    setFilteredMerchants(filtered)
  }

  // 검색 파라미터 변경 핸들러
  const handleSearchParamChange = (name: string, value: string) => {
    setSearchParams((prev) => ({ ...prev, [name]: value }))
  }

  // 판매자 상세 보기
  const handleViewMerchant = (merchant: Merchant) => {
    setSelectedMerchant(merchant)
    setFormData(merchant)
    setIsDetailOpen(true)
    setIsEditMode(false)
  }

  // 판매자 수정 모드 전환
  const handleEditMerchant = (merchant: Merchant) => {
    setSelectedMerchant(merchant)
    setFormData(merchant)
    setIsDetailOpen(true)
    setIsEditMode(true)
  }

  // 패널 닫기
  const handleClosePanel = () => {
    setIsDetailOpen(false)
    setSelectedMerchant(null)
    setIsEditMode(false)
  }

  // 폼 입력 변경 핸들러
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // 스위치 변경 핸들러
  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      status: checked ? "ACTIVE" : "INACTIVE",
    }))
  }

  // 선택 변경 핸들러
  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // 판매자 저장
  const handleSaveMerchant = async () => {
    try {
      /*
      // TODO: API 연동 코드 (나중에 주석 해제하면 바로 적용 가능)
      if (isEditMode && selectedMerchant) {
        await api.put(`/merchants/${selectedMerchant.id}`, formData);
        toast({
          title: "성공",
          description: "판매자 정보가 업데이트되었습니다.",
        });
      } else {
        await api.post('/merchants', formData);
        toast({
          title: "성공",
          description: "새 판매자가 등록되었습니다.",
        });
      }
      */

      // 임시 저장 처리
      toast({
        title: "성공",
        description: isEditMode ? "판매자 정보가 업데이트되었습니다." : "새 판매자가 등록되었습니다.",
      })

      handleClosePanel()
      fetchMerchants() // 목록 새로고침
    } catch (error) {
      console.error("판매자 저장 중 오류 발생:", error)
      toast({
        title: "오류",
        description: "판매자 정보 저장 중 문제가 발생했습니다.",
        variant: "destructive",
      })
    }
  }

  // 상태에 따른 배지 색상 및 텍스트
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">활성</Badge>
      case "PENDING":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">대기</Badge>
      case "SUSPENDED":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">정지</Badge>
      case "INACTIVE":
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">비활성</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">{status}</Badge>
    }
  }

  // 날짜 포맷 함수
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
  }

  // 테이블 컬럼 정의
  const columns = [
    {
      key: "id",
      header: "ID",
      cell: (merchant: Merchant) => <span className="font-medium">{merchant.id.substring(0, 8)}...</span>,
      className: "w-[100px]",
      hideOnMobile: true,
    },
    {
      key: "name",
      header: "판매자명",
      cell: (merchant: Merchant) => <span className="font-medium">{merchant.name}</span>,
    },
    {
      key: "businessNumber",
      header: "사업자번호",
      cell: (merchant: Merchant) => merchant.businessNumber,
    },
    {
      key: "status",
      header: "상태",
      cell: (merchant: Merchant) => getStatusBadge(merchant.status),
    },
    {
      key: "storeCount",
      header: "가맹점 수",
      cell: (merchant: Merchant) => merchant.storeCount,
      hideOnMobile: true,
    },
    {
      key: "joinedAt",
      header: "가입일",
      cell: (merchant: Merchant) => formatDate(merchant.joinedAt),
      hideOnMobile: true,
    },
    {
      key: "actions",
      header: "",
      cell: (merchant: Merchant) => (
        <div className="flex justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={() => handleViewMerchant(merchant)}>
            상세
          </Button>
          <Button variant="ghost" size="sm" onClick={() => handleEditMerchant(merchant)} className="hidden md:flex">
            <Edit className="h-4 w-4 mr-1" />
            수정
          </Button>
        </div>
      ),
      className: "text-right",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">판매자 관리</h1>
        <div className="flex flex-col md:flex-row gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="판매자 검색..."
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
                <SelectItem value="ACTIVE">활성</SelectItem>
                <SelectItem value="PENDING">대기</SelectItem>
                <SelectItem value="SUSPENDED">정지</SelectItem>
                <SelectItem value="INACTIVE">비활성</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={searchParams.dateRange}
              onValueChange={(value) => handleSearchParamChange("dateRange", value)}
            >
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="가입일" />
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
          <Button
            className="gap-1"
            onClick={() => {
              setSelectedMerchant(null)
              setFormData({})
              setIsDetailOpen(true)
              setIsEditMode(true)
            }}
          >
            <Plus className="h-4 w-4" /> 판매자 등록
          </Button>
        </div>
      </div>

      <Card className="overflow-hidden">
        <ResponsiveTable data={filteredMerchants} columns={columns} emptyMessage="판매자 정보가 없습니다." />
      </Card>

      <Sheet open={isDetailOpen} onOpenChange={handleClosePanel}>
        <SheetContent className="sm:max-w-md overflow-y-auto">
          <SheetHeader>
            <SheetTitle>
              {isEditMode ? (selectedMerchant ? "판매자 정보 수정" : "새 판매자 등록") : "판매자 상세 정보"}
            </SheetTitle>
            <SheetDescription>
              {isEditMode ? "판매자 정보를 입력하거나 수정하세요." : "판매자의 상세 정보입니다."}
            </SheetDescription>
          </SheetHeader>

          <div className="py-6 space-y-4">
            {isEditMode ? (
              // 편집 모드
              <>
                <div className="space-y-2">
                  <Label htmlFor="name">판매자명 *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name || ""}
                    onChange={handleInputChange}
                    placeholder="판매자명을 입력하세요"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="businessNumber">사업자등록번호 *</Label>
                  <Input
                    id="businessNumber"
                    name="businessNumber"
                    value={formData.businessNumber || ""}
                    onChange={handleInputChange}
                    placeholder="000-00-00000 형식으로 입력하세요"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">이메일 *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email || ""}
                    onChange={handleInputChange}
                    placeholder="이메일을 입력하세요"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">연락처 *</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone || ""}
                    onChange={handleInputChange}
                    placeholder="연락처를 입력하세요"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactName">담당자 이름</Label>
                  <Input
                    id="contactName"
                    name="contactName"
                    value={formData.contactName || ""}
                    onChange={handleInputChange}
                    placeholder="담당자 이름을 입력하세요"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">주소</Label>
                  <Textarea
                    id="address"
                    name="address"
                    value={formData.address || ""}
                    onChange={handleInputChange}
                    placeholder="주소를 입력하세요"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="status">상태</Label>
                    <Switch id="status" checked={formData.status === "ACTIVE"} onCheckedChange={handleSwitchChange} />
                    <span className="ml-2 text-sm text-muted-foreground">
                      {formData.status === "ACTIVE" ? "활성" : "비활성"}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">판매자 계정을 활성화하거나 비활성화합니다.</p>
                </div>
              </>
            ) : (
              // 상세 보기 모드
              selectedMerchant && (
                <>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <div className="font-semibold">판매자 ID</div>
                    <div className="col-span-3">{selectedMerchant.id}</div>
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <div className="font-semibold">판매자명</div>
                    <div className="col-span-3">{selectedMerchant.name}</div>
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <div className="font-semibold">사업자번호</div>
                    <div className="col-span-3">{selectedMerchant.businessNumber}</div>
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <div className="font-semibold">상태</div>
                    <div className="col-span-3">{getStatusBadge(selectedMerchant.status)}</div>
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <div className="font-semibold">이메일</div>
                    <div className="col-span-3">{selectedMerchant.email}</div>
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <div className="font-semibold">연락처</div>
                    <div className="col-span-3">{selectedMerchant.phone}</div>
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <div className="font-semibold">담당자</div>
                    <div className="col-span-3">{selectedMerchant.contactName || "-"}</div>
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <div className="font-semibold">주소</div>
                    <div className="col-span-3">{selectedMerchant.address || "-"}</div>
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <div className="font-semibold">가맹점 수</div>
                    <div className="col-span-3">{selectedMerchant.storeCount}개</div>
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <div className="font-semibold">가입일</div>
                    <div className="col-span-3">{formatDate(selectedMerchant.joinedAt)}</div>
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <div className="font-semibold">마지막 수정일</div>
                    <div className="col-span-3">{formatDate(selectedMerchant.updatedAt)}</div>
                  </div>
                </>
              )
            )}
          </div>

          <SheetFooter className="flex justify-end mt-4">
            <Button variant="outline" onClick={handleClosePanel}>
              {isEditMode ? "취소" : "닫기"}
            </Button>
            {isEditMode && <Button onClick={handleSaveMerchant}>{selectedMerchant ? "수정" : "등록"}</Button>}
            {!isEditMode && selectedMerchant && <Button onClick={() => setIsEditMode(true)}>수정</Button>}
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  )
}

// 임시 데이터
const mockMerchants: Merchant[] = [
  {
    id: "merch-123456",
    name: "맛있는 식당 그룹",
    businessNumber: "123-45-67890",
    status: "ACTIVE",
    email: "merchant1@example.com",
    phone: "02-1234-5678",
    address: "서울시 강남구 테헤란로 123",
    contactName: "김사장",
    storeCount: 5,
    joinedAt: "2023-01-15T08:30:00Z",
    updatedAt: "2023-04-20T10:25:00Z",
  },
  {
    id: "merch-234567",
    name: "행복 카페 체인",
    businessNumber: "234-56-78901",
    status: "ACTIVE",
    email: "merchant2@example.com",
    phone: "02-2345-6789",
    address: "서울시 서초구 서초대로 456",
    contactName: "이대표",
    storeCount: 3,
    joinedAt: "2023-02-28T09:15:00Z",
    updatedAt: "2023-05-10T14:30:00Z",
  },
  {
    id: "merch-345678",
    name: "뷰티 살롱",
    businessNumber: "345-67-89012",
    status: "PENDING",
    email: "merchant3@example.com",
    phone: "02-3456-7890",
    address: "서울시 송파구 올림픽로 789",
    contactName: "박원장",
    storeCount: 1,
    joinedAt: "2023-03-10T11:00:00Z",
    updatedAt: "2023-03-10T11:00:00Z",
  },
  {
    id: "merch-456789",
    name: "엔터테인먼트 그룹",
    businessNumber: "456-78-90123",
    status: "SUSPENDED",
    email: "merchant4@example.com",
    phone: "02-4567-8901",
    address: "서울시 용산구 이태원로 101",
    contactName: "최대표",
    storeCount: 2,
    joinedAt: "2022-12-05T10:45:00Z",
    updatedAt: "2023-06-01T09:20:00Z",
  },
  {
    id: "merch-567890",
    name: "옷 가게",
    businessNumber: "567-89-01234",
    status: "INACTIVE",
    email: "merchant5@example.com",
    phone: "02-5678-9012",
    address: "서울시 마포구 홍대로 202",
    contactName: "정사장",
    storeCount: 0,
    joinedAt: "2022-11-20T13:30:00Z",
    updatedAt: "2023-01-15T16:45:00Z",
  },
  {
    id: "merch-678901",
    name: "스포츠 센터",
    businessNumber: "678-90-12345",
    status: "ACTIVE",
    email: "merchant6@example.com",
    phone: "02-6789-0123",
    address: "서울시 영등포구 여의도로 303",
    contactName: "한대표",
    storeCount: 4,
    joinedAt: "2023-04-05T08:00:00Z",
    updatedAt: "2023-05-25T11:10:00Z",
  },
]
