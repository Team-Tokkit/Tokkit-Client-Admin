"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { DatePicker } from "@/components/ui/date-picker"
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Search, Plus, ArrowLeft } from "lucide-react"

export default function VoucherIssuePage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    detailDescription: "",
    price: "",
    originalPrice: "",
    totalCount: "",
    validDate: null,
    refundPolicy: "",
    contact: "",
    storeCategory: "",
  })
  const [selectedStores, setSelectedStores] = useState<string[]>([])
  const [showStoreSelector, setShowStoreSelector] = useState(false)
  const [storeSearchParams, setStoreSearchParams] = useState({
    category: "",
    province: "",
    district: "",
    keyword: "",
  })
  const [selectAll, setSelectAll] = useState(false)

  // 폼 입력 핸들러
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // 날짜 선택 핸들러
  const handleDateChange = (date) => {
    setFormData((prev) => ({ ...prev, validDate: date }))
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

  // 바우처 발행 제출 핸들러
  const handleSubmit = (e) => {
    e.preventDefault()

    // 여기에 API 호출 로직 추가
    console.log("바우처 정보:", formData)
    console.log("선택된 가맹점:", selectedStores)

    // 성공 시 목록 페이지로 이동
    // router.push("/voucher")

    // 임시 성공 메시지
    alert("바우처가 성공적으로 발행되었습니다.")
  }

  // 필터링된 가맹점 목록
  const filteredStores = storeData.filter((store) => {
    const matchesCategory = !storeSearchParams.category || store.category === storeSearchParams.category
    const matchesProvince = !storeSearchParams.province || store.province === storeSearchParams.province
    const matchesDistrict = !storeSearchParams.district || store.district === storeSearchParams.district
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

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => router.push("/voucher")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">바우처 발행</h1>
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
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="validDate">유효 기간</Label>
                <DatePicker selected={formData.validDate} onSelect={handleDateChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact">연락처</Label>
                <Input id="contact" name="contact" value={formData.contact} onChange={handleInputChange} />
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
            </div>
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
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="gap-1">
                    <Plus className="h-4 w-4" /> 가맹점 선택
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl">
                  <DialogHeader>
                    <DialogTitle>가맹점 선택</DialogTitle>
                    <DialogDescription>
                      바우처에 사용 가능한 가맹점을 선택하세요. 검색 및 필터링을 통해 원하는 가맹점을 찾을 수 있습니다.
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-4 my-4">
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

                    <div className="border rounded-md">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[50px]">
                              <Checkbox checked={selectAll} onCheckedChange={handleSelectAll} aria-label="전체 선택" />
                            </TableHead>
                            <TableHead>가맹점명</TableHead>
                            <TableHead>카테고리</TableHead>
                            <TableHead>주소</TableHead>
                            <TableHead>연락처</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredStores.length > 0 ? (
                            filteredStores.map((store) => (
                              <TableRow key={store.id}>
                                <TableCell>
                                  <Checkbox
                                    checked={selectedStores.includes(store.id)}
                                    onCheckedChange={() => handleStoreSelect(store.id)}
                                    aria-label={`${store.name} 선택`}
                                  />
                                </TableCell>
                                <TableCell className="font-medium">{store.name}</TableCell>
                                <TableCell>{getCategoryLabel(store.category)}</TableCell>
                                <TableCell>{`${store.province} ${store.district} ${store.address}`}</TableCell>
                                <TableCell>{store.contact}</TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={5} className="text-center py-4">
                                검색 결과가 없습니다.
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
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

                    <div className="flex justify-between items-center">
                      <div className="text-sm text-muted-foreground">
                        {filteredStores.length}개 중 {selectedStores.length}개 선택됨
                      </div>
                      <Button variant="outline" onClick={handleSelectAll}>
                        {selectAll ? "전체 선택 해제" : "현재 페이지 전체 선택"}
                      </Button>
                    </div>
                  </div>

                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setSelectedStores([])}>
                      선택 초기화
                    </Button>
                    <Button type="button">선택 완료 ({selectedStores.length}개)</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {selectedStores.length > 0 ? (
              <div className="border rounded-md overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>가맹점명</TableHead>
                      <TableHead>카테고리</TableHead>
                      <TableHead>주소</TableHead>
                      <TableHead>연락처</TableHead>
                      <TableHead className="w-[80px]">액션</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {getSelectedStoreInfo().map((store) => (
                      <TableRow key={store.id}>
                        <TableCell className="font-medium">{store.name}</TableCell>
                        <TableCell>{getCategoryLabel(store.category)}</TableCell>
                        <TableCell>{`${store.province} ${store.district} ${store.address}`}</TableCell>
                        <TableCell>{store.contact}</TableCell>
                        <TableCell>
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
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="border rounded-md p-8 text-center text-muted-foreground">
                선택된 가맹점이 없습니다. 가맹점을 선택해주세요.
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => router.push("/voucher")}>
            취소
          </Button>
          <Button type="submit">바우처 발행</Button>
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
  },
  {
    id: "S002",
    name: "행복 카페",
    category: "CAFE",
    province: "서울특별시",
    district: "서초구",
    address: "서초대로 456",
    contact: "02-2345-6789",
  },
  {
    id: "S003",
    name: "뷰티살롱",
    category: "BEAUTY",
    province: "서울특별시",
    district: "송파구",
    address: "올림픽로 789",
    contact: "02-3456-7890",
  },
  {
    id: "S004",
    name: "영화관",
    category: "ENTERTAINMENT",
    province: "서울특별시",
    district: "강남구",
    address: "영동대로 101",
    contact: "02-4567-8901",
  },
  {
    id: "S005",
    name: "패션 스토어",
    category: "RETAIL",
    province: "서울특별시",
    district: "마포구",
    address: "홍대로 202",
    contact: "02-5678-9012",
  },
  {
    id: "S006",
    name: "분식점",
    category: "RESTAURANT",
    province: "경기도",
    district: "성남시",
    address: "분당로 303",
    contact: "031-123-4567",
  },
  {
    id: "S007",
    name: "디저트 카페",
    category: "CAFE",
    province: "경기도",
    district: "수원시",
    address: "수원로 404",
    contact: "031-234-5678",
  },
  {
    id: "S008",
    name: "네일아트",
    category: "BEAUTY",
    province: "인천광역시",
    district: "연수구",
    address: "송도로 505",
    contact: "032-345-6789",
  },
  {
    id: "S009",
    name: "게임센터",
    category: "ENTERTAINMENT",
    province: "부산광역시",
    district: "해운대구",
    address: "해운대로 606",
    contact: "051-456-7890",
  },
  {
    id: "S010",
    name: "전자제품 매장",
    category: "RETAIL",
    province: "대구광역시",
    district: "중구",
    address: "중앙로 707",
    contact: "053-567-8901",
  },
]
