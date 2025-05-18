"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { format } from "date-fns"
import { formatPrice } from "@/lib/utils"

interface VoucherDetailDialogProps {
  voucher: any
  open: boolean
  onOpenChange: (open: boolean) => void
  onEdit: (voucher: any) => void
}

export function VoucherDetailDialog({ voucher, open, onOpenChange, onEdit }: VoucherDetailDialogProps) {
  if (!voucher) return null

  const validDate = voucher.validDate ? format(new Date(voucher.validDate), "yyyy년 MM월 dd일") : "설정되지 않음"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>바우처 상세</DialogTitle>
          <DialogDescription>바우처의 상세 정보를 확인합니다.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <div className="font-semibold">바우처 ID</div>
            <div className="col-span-3">{voucher.id}</div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <div className="font-semibold">바우처명</div>
            <div className="col-span-3">{voucher.name}</div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <div className="font-semibold">카테고리</div>
            <div className="col-span-3">{getCategoryLabel(voucher.category)}</div>
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <div className="font-semibold">설명</div>
            <div className="col-span-3">{voucher.description || "설명 없음"}</div>
          </div>
          {voucher.detailDescription && (
            <div className="grid grid-cols-4 items-start gap-4">
              <div className="font-semibold">상세 설명</div>
              <div className="col-span-3 whitespace-pre-wrap">{voucher.detailDescription}</div>
            </div>
          )}
          <div className="grid grid-cols-4 items-center gap-4">
            <div className="font-semibold">할인 금액</div>
            <div className="col-span-3">{formatPrice(voucher.price)}</div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <div className="font-semibold">정가</div>
            <div className="col-span-3">{formatPrice(voucher.originalPrice)}</div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <div className="font-semibold">총 발행 수량</div>
            <div className="col-span-3">{voucher.totalCount}개</div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <div className="font-semibold">남은 수량</div>
            <div className="col-span-3">{voucher.remainingCount}개</div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <div className="font-semibold">유효기간</div>
            <div className="col-span-3">{validDate}</div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <div className="font-semibold">상태</div>
            <div className="col-span-3">
              <span className={`px-2 py-1 rounded-full text-xs ${getStatusClass(voucher.status)}`}>
                {voucher.status}
              </span>
            </div>
          </div>
          {voucher.refundPolicy && (
            <div className="grid grid-cols-4 items-start gap-4">
              <div className="font-semibold">환불 정책</div>
              <div className="col-span-3">{voucher.refundPolicy}</div>
            </div>
          )}
          {voucher.contact && (
            <div className="grid grid-cols-4 items-center gap-4">
              <div className="font-semibold">연락처</div>
              <div className="col-span-3">{voucher.contact}</div>
            </div>
          )}
        </div>
        <DialogFooter className="flex space-x-2 justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            닫기
          </Button>
          <Button onClick={() => onEdit(voucher)}>수정</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
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
