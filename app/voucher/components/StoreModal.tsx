"use client"

import { useState } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface StoreModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface Store {
  id: number
  name: string
  address: string
  category: string
  contact: string
}

export default function StoreModal({ open, onOpenChange }: StoreModalProps) {
  const [selectedStores, setSelectedStores] = useState<Store[]>([])
  const [selectAll, setSelectAll] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)

  const toggleSelectAll = () => {
    setSelectAll(!selectAll)
    if (!selectAll) {
      setSelectedStores([...stores])
    } else {
      setSelectedStores([])
    }
  }

  const toggleSelectStore = (store: Store) => {
    if (selectedStores.some((s) => s.id === store.id)) {
      setSelectedStores(selectedStores.filter((s) => s.id !== store.id))
    } else {
      setSelectedStores([...selectedStores, store])
    }
  }

  const isSelected = (store: Store) => {
    return selectedStores.some((s) => s.id === store.id)
  }

  const removeSelectedStore = (store: Store) => {
    setSelectedStores(selectedStores.filter((s) => s.id !== store.id))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-none w-screen h-screen flex flex-col justify-center items-center">
        <div className="w-full h-full flex flex-col bg-white p-8 rounded-lg shadow-lg overflow-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">사용처 등록</h2>
            <Button variant="ghost" onClick={() => onOpenChange(false)}>
              닫기
            </Button>
          </div>

          {/* 상점 정보 입력 */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">상점 정보 입력</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="city" className="block mb-2">
                  시/도 <span className="text-red-500">*</span>
                </Label>
                <Select>
                  <SelectTrigger id="city" className="w-full">
                    <SelectValue placeholder="전체" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">전체</SelectItem>
                    <SelectItem value="seoul">서울특별시</SelectItem>
                    <SelectItem value="busan">부산광역시</SelectItem>
                    <SelectItem value="incheon">인천광역시</SelectItem>
                    <SelectItem value="gyeonggi">경기도</SelectItem>
                    <SelectItem value="gangwon">강원도</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="district" className="block mb-2">
                  시/군/구 <span className="text-red-500">*</span>
                </Label>
                <Select>
                  <SelectTrigger id="district" className="w-full">
                    <SelectValue placeholder="전체" />
                  </SelectTrigger>
                  <SelectContent>
                    {/* 시군구 */}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="category" className="block mb-2">
                  상점 카테고리 <span className="text-red-500">*</span>
                </Label>
                <Select>
                  <SelectTrigger id="category" className="w-full">
                    <SelectValue placeholder="전체" />
                  </SelectTrigger>
                  <SelectContent>
                    {/* 스토어 카테고리 */}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="mt-4">
              <div className="relative">
                <Input type="text" placeholder="상점명 또는 주소 검색" className="pl-10 w-full" />
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* 상점 목록 */}
          <div className="border rounded-md mb-6">
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center">
                <Checkbox id="select-all" checked={selectAll} onCheckedChange={toggleSelectAll} />
                <Label htmlFor="select-all" className="ml-2">
                  전체 선택
                </Label>
              </div>
              <div>총 100개의 상점</div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="p-3 text-left w-16">선택</th>
                    <th className="p-3 text-left">상점명</th>
                    <th className="p-3 text-left">주소</th>
                    <th className="p-3 text-left">카테고리</th>
                    <th className="p-3 text-left">연락처</th>
                  </tr>
                </thead>
                <tbody>
                  {stores.map((store) => (
                    <tr key={store.id} className="border-b">
                      <td className="p-3">
                        <Checkbox checked={isSelected(store)} onCheckedChange={() => toggleSelectStore(store)} />
                      </td>
                      <td className="p-3">{store.name}</td>
                      <td className="p-3">{store.address}</td>
                      <td className="p-3">{store.category}</td>
                      <td className="p-3">{store.contact}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-center items-center p-4 gap-2">
              <Button variant="outline" size="sm">
                <ChevronLeft className="h-4 w-4" />
                <span className="ml-1">Previous</span>
              </Button>

              {[1, 2, 3, 4, 5].map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </Button>
              ))}

              <span className="mx-1">...</span>

              <Button variant="outline" size="sm">
                <span className="mr-1">Next</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* 선택된 상점 목록 */}
          <div className="border rounded-md mb-6">
            <div className="p-4 border-b">
              <h3 className="font-semibold">선택된 상점 목록</h3>
              <div className="text-sm text-gray-500">총 {selectedStores.length}개 선택됨</div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="p-3 text-left">상점명</th>
                    <th className="p-3 text-left">주소</th>
                    <th className="p-3 text-left">카테고리</th>
                    <th className="p-3 text-left">연락처</th>
                    <th className="p-3 text-left">삭제</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedStores.length > 0 ? (
                    selectedStores.map((store) => (
                      <tr key={store.id} className="border-b">
                        <td className="p-3">{store.name}</td>
                        <td className="p-3">{store.address}</td>
                        <td className="p-3">{store.category}</td>
                        <td className="p-3">{store.contact}</td>
                        <td className="p-3">
                          <Button variant="ghost" size="sm" onClick={() => removeSelectedStore(store)}>
                            삭제
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="p-6 text-center text-gray-500">
                        선택된 상점이 없습니다.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* 버튼 영역 */}
          <div className="flex justify-end gap-2 mt-auto">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              취소
            </Button>
            <Button>바우처 등록</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
