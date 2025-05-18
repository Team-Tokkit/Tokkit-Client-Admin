"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Search, ArrowLeft } from "lucide-react"
import { DatePicker } from "@/components/ui/date-picker"
import { ResponsiveTable } from "./responsive-table"

export default function VoucherIssueForm({ voucher = null, onCancel, onComplete }) {
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    description: "",
    detailDescription: "",
    price: "",
    originalPrice: "",
    totalCount: "",
    remainingCount: "",
    validDate: null,
    refundPolicy: "",
    contact: "",
    storeCategory: "",
    image: null,
    status: "활성",
  })
  const [selectedStores, setSelectedStores] = useState<string[]>([])
  const [storeSearchParams, setStoreSearchParams] = useState({
    category: "",
    province: "",
    district: "",
    keyword: "",
  })
  const [selectAll, setSelectAll] = useState(false)
  const [errors, setErrors] = useState({})
  const isEditMode = !!voucher

  // 폼 초기화 (수정 모드일 경우 기존 데이터 로드)
  useEffect(() => {
    if (voucher) {
      setFormData({
        id: voucher.id || "",
        name: voucher.name || "",
        description: voucher.description || "",
        detailDescription: voucher.detailDescription || "",
        price: voucher.price?.toString() || "",
        originalPrice: voucher.originalPrice?.toString() || "",
        totalCount: voucher.totalCount?.toString() || "",
        remainingCount: voucher.remainingCount?.toString() || "",
        validDate: voucher.validDate ? new Date(voucher.validDate) : null,
        refundPolicy: voucher.refundPolicy || "",
        contact: voucher.contact || "",
        storeCategory: voucher.category || "",
        image: null,
        status: voucher.status || "활성",
      })

      // 선택된 가맹점 로드 (실제로는 API 호출로 가져와야 함)
      // 예시로 임의의 가맹점 ID 설정
      setSelectedStores(["S001", "S002"])
    }
  }, [voucher])

  // 폼 입력 핸들러
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // 에러 상태 초기화
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  // 날짜 선택 핸들러
  const handleDateChange = (date) => {
    setFormData((prev) => ({ ...prev, validDate: date }))

    // 에러 상태 초기화
    if (errors.validDate) {
      setErrors((prev) => ({ ...prev, validDate: "" }))
    }
  }

  // 가맹점 선택 핸들러
  const handleStoreSelect = (storeId: string) => {
    setSelectedStores((prev) => {
      if (prev.includes(storeId)) {
        return prev.filter((id) => id !== storeId)
      } else {
        return [...prev, storeId]
      }
    })
  }

  // 전체 선택 핸들러
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedStores([])
    } else {
      // 현재 페이지의 모든 가맹점 ID 선택
      const allStoreIds = filteredStores.map((store) => store.id)
      setSelectedStores(allStoreIds)
    }
    setSelectAll(!selectAll)
  }

  // 검색 파라미터 변경 핸들러
  const handleSearchParamChange = (name, value) => {
    setStoreSearchParams((prev) => ({ ...prev, [name]: value }))
  }

  // 폼 유효성 검사
  const validateForm = () => {
    const newErrors = {}
    let isValid = true

    if (!formData.name.trim()) {
      newErrors.name = "바우처 이름을 입력해주세요."
      isValid = false
    }

    if (!formData.price) {
      newErrors.price = "할인 금액을 입력해주세요."
      isValid = false
    } else if (isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      newErrors.price = "유효한 금액을 입력해주세요."
      isValid = false
    }

    if (!formData.originalPrice) {
      newErrors.originalPrice = "정가를 입력해주세요."
      isValid = false
    } else if (isNaN(Number(formData.originalPrice)) || Number(formData.originalPrice) <= 0) {
      newErrors.originalPrice = "유효한 금액을 입력해주세요."
      isValid = false
    }

    if (!formData.totalCount) {
      newErrors.totalCount = "총 발행 수량을 입력해주세요."
      isValid = false
    } else if (isNaN(Number(formData.totalCount)) || Number(formData.totalCount) <= 0) {
      newErrors.totalCount = "유효한 수량을 입력해주세요."
      isValid = false
    }

    if (!formData.validDate) {
      newErrors.validDate = "유효 기간을 선택해주세요."
      isValid = false
    }

    if (selectedStores.length === 0) {
      newErrors.stores = "최소 하나 이상의 가맹점을 선택해주세요."
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  // 바우처 발행 제출 핸들러
  const handleSubmit = (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    // 여기에 API 호출 로직 추가
    console.log("바우처 정보:", formData)
    console.log("선택된 가맹점:", selectedStores)

    // 성공 시 완료 콜백 호출
    onComplete()

    // 임시 성공 메시지
    alert(isEditMode ? "바우처가 성공적으로 수정되었습니다." : "바우처가 성공적으로 발행되었습니다.")
  }

  // 필터링된 가맹점 목록
  const filteredStores = storeData.filter((store) => {
    const matchesCategory =
      !storeSearchParams.category ||
      storeSearchParams.category === "ALL" ||
      store.category === storeSearchParams.category
    const matchesProvince =
      !storeSearchParams.province ||
      storeSearchParams.province === "ALL" ||
      store.province === storeSearchParams.province
    const matchesDistrict =
      !storeSearchParams.district ||
      storeSearchParams.district === "ALL" ||
      store.district === storeSearchParams.district
    const matchesKeyword =
      !storeSearchParams.keyword || store.name.toLowerCase().includes(storeSearchParams.keyword.toLowerCase())

    return matchesCategory && matchesProvince && matchesDistrict && matchesKeyword
  })

  // 선택된 가맹점 수 계산
  const selectedStoreCount = selectedStores.length

  // 선택된 가맹점 정보 가져오기
  const getSelectedStoreInfo = () => {
    return storeData.filter((store) => selectedStores.includes(store.id))
  }

  // 테이블 컬럼 정의
  const storeColumns = [
    {
      key: "checkbox",
      header: "",
      cell: (store) => (
        <Checkbox
          checked={selectedStores.includes(store.id)}
          onCheckedChange={() => handleStoreSelect(store.id)}
          aria-label={`${store.name} 선택`}
        />
      ),
      className: "w-[50px]",
    },
    {
      key: "name",
      header: "가맹점명",
      cell: (store) => <span className="font-medium">{store.name}</span>,
    },
    {
      key: "merchant",
      header: "상호명",
      cell: (store) => store.merchant?.name || "-",
      hideOnMobile: true,
    },
    {
      key: "category",
      header: "카테고리",
      cell: (store) => getCategoryLabel(store.category),
    },
    {
      key: "address",
      header: "주소",
      cell: (store) => `${store.province} ${store.district} ${store.address}`,
      hideOnMobile: true,
    },
    {
      key: "businessNumber",
      header: "사업자번호",
      cell: (store) => store.merchant?.businessNumber || "-",
      hideOnMobile: true,
    },
    {
      key: "contact",
      header: "연락처",
      cell: (store) => store.contact,
      hideOnMobile: true,
    },
  ]

  // 선택된 가맹점 테이블 컬럼
  const selectedStoreColumns = [
    {
      key: "name",
      header: "가맹점명",
      cell: (store) => <span className="font-medium">{store.name}</span>,
    },
    {
      key: "category",
      header: "카테고리",
      cell: (store) => getCategoryLabel(store.category),
    },
    {
      key: "address",
      header: "주소",
      cell: (store) => `${store.province} ${store.district} ${store.address}`,
      hideOnMobile: true,
    },
    {
      key: "contact",
      header: "연락처",
      cell: (store) => store.contact,
      hideOnMobile: true,
    },
    {
      key: "actions",
      header: "액션",
      cell: (store) => (
        <Button variant="ghost" size="icon" onClick={() => handleStoreSelect(store.id)}>
          <span className="sr-only">삭제</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
          >
            <path d="M3 6h18"></path>
            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
            <line x1="10" y1="11" x2="10" y2="17"></line>
            <line x1="14" y1="11" x2="14" y2="17"></line>
          </svg>
        </Button>
      ),
      className: "w-[80px] text-right",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={onCancel}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">{isEditMode ? "바우처 수정" : "바우처 발행"}</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>기본 정보</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">바우처 이름</Label>
                <Input id="name" name="name" value={formData.name} onChange={handleInputChange} required />
                {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="storeCategory">카테고리</Label>
                <Select
                  value={formData.storeCategory}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, storeCategory: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="카테고리 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="RESTAURANT">음식점</SelectItem>
                    <SelectItem value="CAFE">카페</SelectItem>
                    <SelectItem value="BEAUTY">미용실</SelectItem>
                    <SelectItem value="ENTERTAINMENT">엔터테인먼트</SelectItem>
                    <SelectItem value="RETAIL">소매</SelectItem>
                  </SelectContent>
                </Select>
                {errors.storeCategory && <p className="text-sm text-red-500">{errors.storeCategory}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">간단 설명</Label>
              <Input
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
              />
              {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="detailDescription">상세 설명</Label>
              <Textarea
                id="detailDescription"
                name="detailDescription"
                value={formData.detailDescription}
                onChange={handleInputChange}
                rows={4}
                required
              />
              {errors.detailDescription && <p className="text-sm text-red-500">{errors.detailDescription}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">할인 금액</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                />
                {errors.price && <p className="text-sm text-red-500">{errors.price}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="originalPrice">정가</Label>
                <Input
                  id="originalPrice"
                  name="originalPrice"
                  type="number"
                  value={formData.originalPrice}
                  onChange={handleInputChange}
                  required
                />
                {errors.originalPrice && <p className="text-sm text-red-500">{errors.originalPrice}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="totalCount">총 발행 수량</Label>
                <Input
                  id="totalCount"
                  name="totalCount"
                  type="number"
                  value={formData.totalCount}
                  onChange={handleInputChange}
                  required
                />
                {errors.totalCount && <p className="text-sm text-red-500">{errors.totalCount}</p>}
              </div>
            </div>

            {isEditMode && (
              <div className="space-y-2">
                <Label htmlFor="remainingCount">남은 수량</Label>
                <Input
                  id="remainingCount"
                  name="remainingCount"
                  type="number"
                  value={formData.remainingCount}
                  onChange={handleInputChange}
                  required
                />
                {errors.remainingCount && <p className="text-sm text-red-500">{errors.remainingCount}</p>}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="validDate">유효 기간</Label>
                <DatePicker selected={formData.validDate} onSelect={handleDateChange} />
                {errors.validDate && <p className="text-sm text-red-500">{errors.validDate}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact">연락처</Label>
                <Input id="contact" name="contact" value={formData.contact} onChange={handleInputChange} />
                {errors.contact && <p className="text-sm text-red-500">{errors.contact}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="refundPolicy">환불 정책</Label>
              <Textarea
                id="refundPolicy"
                name="refundPolicy"
                value={formData.refundPolicy}
                onChange={handleInputChange}
                rows={3}
                required
              />
              {errors.refundPolicy && <p className="text-sm text-red-500">{errors.refundPolicy}</p>}
            </div>
            <div className="space-y-2 mt-4">
              <Label htmlFor="image">바우처 이미지</Label>
              <div className="flex items-center gap-4">
                <Input
                  id="image"
                  name="image"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setFormData((prev) => ({ ...prev, image: e.target.files[0] }))
                    }
                  }}
                />
                {formData.image && (
                  <div className="relative h-20 w-20 overflow-hidden rounded-md border">
                    <img
                      src={URL.createObjectURL(formData.image) || "/placeholder.svg"}
                      alt="Preview"
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
              </div>
              <p className="text-sm text-muted-foreground">권장 크기: 800 x 400 픽셀, 최대 2MB</p>
            </div>

            {isEditMode && (
              <div className="space-y-2">
                <Label htmlFor="status">상태</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, status: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="상태 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="활성">활성</SelectItem>
                    <SelectItem value="만료">만료</SelectItem>
                    <SelectItem value="소진">소진</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>사용 가능 가맹점</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">선택된 가맹점:</span>
                <span className="bg-primary/10 text-primary px-2 py-1 rounded-md text-sm font-medium">
                  {selectedStoreCount}개
                </span>
              </div>
            </div>
            {errors.stores && <p className="text-sm text-red-500">{errors.stores}</p>}

            <div className="space-y-4">
              <div className="flex flex-col md:flex-row gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="가맹점 검색..."
                    className="pl-8"
                    value={storeSearchParams.keyword}
                    onChange={(e) => handleSearchParamChange("keyword", e.target.value)}
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  <Select
                    value={storeSearchParams.category}
                    onValueChange={(value) => handleSearchParamChange("category", value)}
                  >
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="카테고리" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">전체 카테고리</SelectItem>
                      <SelectItem value="RESTAURANT">음식점</SelectItem>
                      <SelectItem value="CAFE">카페</SelectItem>
                      <SelectItem value="BEAUTY">미용실</SelectItem>
                      <SelectItem value="ENTERTAINMENT">엔터테인먼트</SelectItem>
                      <SelectItem value="RETAIL">소매</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select
                    value={storeSearchParams.province}
                    onValueChange={(value) => handleSearchParamChange("province", value)}
                  >
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="시/도" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">전체 시/도</SelectItem>
                      <SelectItem value="서울특별시">서울특별시</SelectItem>
                      <SelectItem value="경기도">경기도</SelectItem>
                      <SelectItem value="인천광역시">인천광역시</SelectItem>
                      <SelectItem value="부산광역시">부산광역시</SelectItem>
                      <SelectItem value="대구광역시">대구광역시</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select
                    value={storeSearchParams.district}
                    onValueChange={(value) => handleSearchParamChange("district", value)}
                  >
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="시/군/구" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">전체 시/군/구</SelectItem>
                      <SelectItem value="강남구">강남구</SelectItem>
                      <SelectItem value="서초구">서초구</SelectItem>
                      <SelectItem value="송파구">송파구</SelectItem>
                      <SelectItem value="마포구">마포구</SelectItem>
                      <SelectItem value="성동구">성동구</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="border rounded-md">
                <ResponsiveTable data={filteredStores} columns={storeColumns} emptyMessage="검색 결과가 없습니다." />
              </div>

              <div className="flex justify-between items-center">
                <div className="text-sm text-muted-foreground">
                  {filteredStores.length}개 중 {selectedStores.length}개 선택됨
                </div>
                <Button variant="outline" onClick={handleSelectAll}>
                  {selectAll ? "전체 선택 해제" : "현재 페이지 전체 선택"}
                </Button>
              </div>

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

            {selectedStores.length > 0 ? (
              <div className="border rounded-md mt-4">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">선택된 가맹점</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveTable
                    data={getSelectedStoreInfo()}
                    columns={selectedStoreColumns}
                    emptyMessage="선택된 가맹점이 없습니다."
                  />
                </CardContent>
              </div>
            ) : (
              <div className="border rounded-md p-8 text-center text-muted-foreground">
                선택된 가맹점이 없습니다. 가맹점을 선택해주세요.
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            취소
          </Button>
          <Button type="submit">{isEditMode ? "바우처 수정" : "바우처 발행"}</Button>
        </div>
      </form>
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

// 샘플 가맹점 데이터
const storeData = [
  {
    id: "S001",
    name: "맛있는 식당",
    category: "RESTAURANT",
    province: "서울특별시",
    district: "강남구",
    address: "테헤란로 123",
    contact: "02-1234-5678",
    merchant: {
      id: "M001",
      name: "김사장",
      email: "merchant1@example.com",
      businessNumber: "123-45-67890",
    },
    region: {
      id: "R001",
      name: "서울 강남",
    },
  },
  {
    id: "S002",
    name: "행복 카페",
    category: "CAFE",
    province: "서울특별시",
    district: "서초구",
    address: "서초대로 456",
    contact: "02-2345-6789",
    merchant: {
      id: "M002",
      name: "박사장",
      email: "merchant2@example.com",
      businessNumber: "987-65-43210",
    },
    region: {
      id: "R002",
      name: "서울 서초",
    },
  },
  {
    id: "S003",
    name: "뷰티살롱",
    category: "BEAUTY",
    province: "서울특별시",
    district: "송파구",
    address: "올림픽로 789",
    contact: "02-3456-7890",
    merchant: {
      id: "M003",
      name: "최사장",
      email: "merchant3@example.com",
      businessNumber: "555-44-33333",
    },
    region: {
      id: "R003",
      name: "서울 송파",
    },
  },
  {
    id: "S004",
    name: "영화관",
    category: "ENTERTAINMENT",
    province: "서울특별시",
    district: "강남구",
    address: "영동대로 101",
    contact: "02-4567-8901",
    merchant: {
      id: "M004",
      name: "윤사장",
      email: "merchant4@example.com",
      businessNumber: "111-22-33333",
    },
    region: {
      id: "R001",
      name: "서울 강남",
    },
  },
  {
    id: "S005",
    name: "패션 스토어",
    category: "RETAIL",
    province: "서울특별시",
    district: "마포구",
    address: "홍대로 202",
    contact: "02-5678-9012",
    merchant: {
      id: "M005",
      name: "이상무",
      email: "merchant5@example.com",
      businessNumber: "777-88-99999",
    },
    region: {
      id: "R004",
      name: "서울 마포",
    },
  },
  {
    id: "S006",
    name: "분식점",
    category: "RESTAURANT",
    province: "경기도",
    district: "성남시",
    address: "분당로 303",
    contact: "031-123-4567",
    merchant: {
      id: "M006",
      name: "정사장",
      email: "merchant6@example.com",
      businessNumber: "444-55-66666",
    },
    region: {
      id: "R005",
      name: "경기 성남",
    },
  },
  {
    id: "S007",
    name: "디저트 카페",
    category: "CAFE",
    province: "경기도",
    district: "수원시",
    address: "수원로 404",
    contact: "031-234-5678",
    merchant: {
      id: "M007",
      name: "오사장",
      email: "merchant7@example.com",
      businessNumber: "222-33-44444",
    },
    region: {
      id: "R006",
      name: "경기 수원",
    },
  },
  {
    id: "S008",
    name: "네일아트",
    category: "BEAUTY",
    province: "인천광역시",
    district: "연수구",
    address: "송도로 505",
    contact: "032-345-6789",
    merchant: {
      id: "M008",
      name: "강사장",
      email: "merchant8@example.com",
      businessNumber: "666-77-88888",
    },
    region: {
      id: "R007",
      name: "인천 연수",
    },
  },
  {
    id: "S009",
    name: "게임센터",
    category: "ENTERTAINMENT",
    province: "부산광역시",
    district: "해운대구",
    address: "해운대로 606",
    contact: "051-456-7890",
    merchant: {
      id: "M009",
      name: "조사장",
      email: "merchant9@example.com",
      businessNumber: "888-99-00000",
    },
    region: {
      id: "R008",
      name: "부산 해운대",
    },
  },
  {
    id: "S010",
    name: "전자제품 매장",
    category: "RETAIL",
    province: "대구광역시",
    district: "중구",
    address: "중앙로 707",
    contact: "053-567-8901",
    merchant: {
      id: "M010",
      name: "하사장",
      email: "merchant10@example.com",
      businessNumber: "333-44-55555",
    },
    region: {
      id: "R009",
      name: "대구 중구",
    },
  },
]
