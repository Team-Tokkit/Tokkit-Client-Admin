"use client"

import { useState, useEffect, useRef } from "react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { getStores, getSidoList, getSigunguList } from "../lib/api"
import { StoreCategory, StoreListItem } from "../types/Store"
import Pagination from "@/components/common/Pagination"

interface StoreModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm?: (selectedStoreIds: number[], selectedStores: StoreListItem[]) => void 
}

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

export default function StoreModal({ open, onOpenChange, onConfirm }: StoreModalProps) {
  const [selectedStores, setSelectedStores] = useState<StoreListItem[]>([])
  const [stores, setStores] = useState<StoreListItem[]>([])
  const [selectAll, setSelectAll] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [totalCount, setTotalCount] = useState(0)
  const [sidoName, setSidoName] = useState("")
  const [sigunguName, setSigunguName] = useState("")
  const [category, setCategory] = useState<StoreCategory | "">("")
  const [keyword, setKeyword] = useState("")
  const [sidoList, setSidoList] = useState<string[]>([])
  const [sigunguList, setSigunguList] = useState<string[]>([])
  const debouncedKeyword = useDebounce(keyword, 300);
  const pageChangedRef = useRef(false);

  const storeCategories: { value: StoreCategory; label: string }[] = [
  { value: "FOOD", label: "음식점" },
  { value: "MEDICAL", label: "의료" },
  { value: "SERVICE", label: "서비스" },
  { value: "TOURISM", label: "관광" },
  { value: "LODGING", label: "숙박" },
  { value: "EDUCATION", label: "교육" },
]

  const toggleSelectAll = () => {
  const isAllSelected = stores.every((store) =>
    selectedStores.some((s) => s.id === store.id)
  );

  setSelectAll(!isAllSelected);

    if (!isAllSelected) {
    const newSelections = stores.filter(
        (store) => !selectedStores.some((s) => s.id === store.id)
    );
    setSelectedStores([...selectedStores, ...newSelections]);
    } else {
    // 선택 해제할 상점만 제거하고 나머지는 유지
    const remainingSelections = selectedStores.filter(
        (s) => !stores.find((store) => store.id === s.id)
    );
    setSelectedStores(remainingSelections);
    }
};

  const toggleSelectStore = (store: StoreListItem) => {
    if (selectedStores.some((s) => s.id === store.id)) {
      setSelectedStores(selectedStores.filter((s) => s.id !== store.id))
    } else {
      setSelectedStores([...selectedStores, store])
    }
  }

  const isSelected = (store: StoreListItem) => {
    return selectedStores.some((s) => s.id === store.id)
  }

  const removeSelectedStore = (store: StoreListItem) => {
    setSelectedStores(selectedStores.filter((s) => s.id !== store.id))
  }

  const onPageChange = (page: number) => {
  pageChangedRef.current = true;
  setCurrentPage(page);
};

  useEffect(() => {
    getSidoList().then(setSidoList)
  }, [])

  useEffect(() => {
    if (sidoName) {
      getSigunguList(sidoName).then(setSigunguList)
    } else {
      setSigunguList([])
    }
  }, [sidoName])

  useEffect(() => {
    setSelectAll(false);

    const fetchStores = async () => {
      try {
        const params = {
          sidoName,
          sigunguName,
          storeCategory: category || undefined,
          keyword: debouncedKeyword, 
          page: currentPage - 1,
          size: 10,
        }
        const response = await getStores(params)
        setStores(response.content)
        setTotalPages(response.totalPages)
        setTotalCount(response.totalElements) 
      } catch (e) {
        console.error("상점 조회 실패", e)
      }
    }

    fetchStores()
  }, [sidoName, sigunguName, category, debouncedKeyword, currentPage])

  useEffect(() => {
  console.log("Store IDs on page:", stores.map((s) => s.id));
}, [stores]);

  
  useEffect(() => {
  if (pageChangedRef.current) {
    setSelectAll(false); 
    pageChangedRef.current = false;
    return;
  }

  const allSelected =
    stores.length > 0 &&
    stores.every((store) =>
      selectedStores.some((s) => s.id === store.id)
    );
  setSelectAll(allSelected);
}, [stores, selectedStores]);

  // 선택된 상점 ID들을 부모로 전달하는 함수
  const handleConfirm = () => {
    onConfirm?.(selectedStores.map((s) => s.id), selectedStores);
    onOpenChange(false); 
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-none w-screen h-screen flex flex-col justify-center items-center">
        <DialogTitle className="text-2xl font-bold mb-4">사용처 등록</DialogTitle>

        <div className="w-full h-full flex flex-col p-8 rounded-lg shadow-lg overflow-auto">
          {/* 상점 정보 입력 */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">상점 정보 입력</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="city">시/도 <span className="text-red-500">*</span></Label>
                <Select onValueChange={(value) => setSidoName(value)}>
                  <SelectTrigger id="city" className="w-full">
                    <SelectValue placeholder="전체" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">전체</SelectItem>
                    {sidoList.map((sido) => (
                      <SelectItem key={sido} value={sido}>{sido}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="district">시/군/구 <span className="text-red-500">*</span></Label>
                <Select onValueChange={(value) => setSigunguName(value)} disabled={!sidoName}>
                  <SelectTrigger id="district" className="w-full">
                    <SelectValue placeholder="전체" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">전체</SelectItem>
                    {sigunguList.map((sigungu) => (
                      <SelectItem key={sigungu} value={sigungu}>{sigungu}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="category">상점 카테고리 <span className="text-red-500">*</span></Label>
                <Select
                    value={category || "ALL"}
                    onValueChange={(value) => setCategory(value === "ALL" ? "" : (value as StoreCategory))}
                    >
                    <SelectTrigger id="category" className="w-full">
                        <SelectValue placeholder="전체" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="ALL">전체</SelectItem>
                        {storeCategories.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                            {cat.label}
                        </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
              </div>
            </div>

            <div className="mt-4 relative">
              <Input type="text" placeholder="상점명 또는 주소 검색" className="pl-10 w-full" value={keyword} onChange={(e) => setKeyword(e.target.value)} />
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* 상점 목록 */}
          <div className="border rounded-md mb-6">
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center">
                <Checkbox id="select-all" checked={selectAll} onCheckedChange={toggleSelectAll} />
                <Label htmlFor="select-all" className="ml-2 text-m">전체 선택</Label>
              </div>
              <div>총 {new Intl.NumberFormat().format(totalCount)}개의 상점</div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="p-3 text-left w-16">선택</th>
                    <th className="p-3 text-left">상점명</th>
                    <th className="p-3 text-left">주소</th>
                    <th className="p-3 text-left">카테고리</th>
                  </tr>
                </thead>
                <tbody>
                  {stores.map((store) => (
                    <tr key={store.id} className="border-b">
                      <td className="p-4">
                        <Checkbox checked={isSelected(store)} onCheckedChange={() => toggleSelectStore(store)} />
                      </td>
                      <td className="p-3">{store.storeName}</td>
                      <td className="p-3">{store.roadAddress}</td>
                      <td className="p-3">{store.storeCategory}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
            />

          </div>

          {/* 선택된 상점 목록 */}
          <div className="border rounded-md mb-6">
            <div className="p-4 border-b">
              <h3 className="font-semibold">선택된 상점 목록</h3>
              <div className="text-sm text-gray-500">총 {selectedStores.length}개 선택됨</div>
            </div>

            <div className="overflow-x-auto overflow-y-auto" style={{ maxHeight: "500px" }}>
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="p-3 text-left">상점명</th>
                    <th className="p-3 text-left">주소</th>
                    <th className="p-3 text-left">카테고리</th>
                    <th className="p-3 text-left">삭제</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedStores.length > 0 ? (
                    selectedStores.map((store) => (
                      <tr key={store.id} className="border-b">
                        <td className="p-3">{store.storeName}</td>
                        <td className="p-3">{store.roadAddress}</td>
                        <td className="p-3">{store.storeCategory}</td>
                        <td className="p-3">
                          <Button variant="ghost" size="sm" onClick={() => removeSelectedStore(store)}>삭제</Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr key="no-store">
                    <td colSpan={4} className="p-6 text-center text-gray-500">
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
          <Button variant="outline" onClick={() => onOpenChange(false)}>취소</Button>
          <Button onClick={handleConfirm}>선택 완료</Button> {/* 확인 버튼 */}
        </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
