"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import type { VoucherDetail } from "@/app/voucher/types/Voucher"
import { CalendarDays, Phone, Info, RefreshCcw, MapPin, ChevronRight } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent } from "@/components/ui/card"
import AllStoresModal from "./AllStoresModal"

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  voucher: VoucherDetail | null
}

export default function VoucherDetailModal({ open, onOpenChange, voucher }: Props) {
  const [showAllStores, setShowAllStores] = useState(false)

  if (!voucher) return null

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ko-KR")
  }

  const formatPrice = (price: number) => {
    return price.toLocaleString("ko-KR")
  }

  const storeList = Array.isArray(voucher.stores) ? voucher.stores : voucher.stores?.content || []

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-[500px] overflow-y-auto max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">{voucher.name}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* 이미지 */}
            <div className="aspect-video w-full overflow-hidden rounded-lg border bg-muted/50">
              <img
                src={voucher.imageUrl || "/placeholder.svg"}
                alt="바우처 이미지"
                className="h-full w-full object-cover"
              />
            </div>

            {/* 가격 정보 */}
            <Card>
              <CardContent className="p-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="text-sm text-muted-foreground">정가</div>
                    <div className="text-base font-medium">{formatPrice(voucher.originalPrice)}원</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">할인가</div>
                    <div className="text-base font-semibold text-blue-600">{formatPrice(voucher.price)}원</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 기본 정보 */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <CalendarDays className="h-4 w-4 text-muted-foreground" />
                <div>
                  <span className="text-sm text-muted-foreground">유효기간: </span>
                  <span className="text-sm font-medium">{formatDate(voucher.validDate)}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <div>
                  <span className="text-sm text-muted-foreground">문의: </span>
                  <span className="text-sm font-medium">{voucher.contact}</span>
                </div>
              </div>
            </div>
          <Separator />

            {/* 상세 정보 */}
            <div className="space-y-4">
              <div className="flex gap-3">
                <Info className="h-4 w-4 text-muted-foreground mt-1 flex-shrink-0" />
                <div className="space-y-1">
                  <div className="text-sm font-medium">상세 설명</div>
                  <div className="text-sm text-muted-foreground leading-relaxed">{voucher.detailDescription}</div>
                </div>
              </div>

              <div className="flex gap-3">
                <RefreshCcw className="h-4 w-4 text-muted-foreground mt-1 flex-shrink-0" />
                <div className="space-y-1">
                  <div className="text-sm font-medium">환불 정책</div>
                  <div className="text-sm text-muted-foreground leading-relaxed">{voucher.refundPolicy}</div>
                </div>
              </div>
            </div>
          </div>

          {/* 사용처 - 수정된 UI */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="font-medium">사용처</div>
                  {storeList.length > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 px-2 text-xs flex items-center gap-1"
                      onClick={() => setShowAllStores(true)}
                    >
                      전체보기
                      <ChevronRight className="h-3 w-3" />
                    </Button>
                  )}
                </div>

                {storeList.length > 0 ? (
                  <div className="space-y-2">
                    {storeList.slice(0, 5).map((store) => (
                      <div key={store.id} className="flex items-center gap-2 py-2 border-b last:border-0">
                        <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <div className="text-sm">{store.storeName}</div>
                      </div>
                    ))}

                    {storeList.length > 5 && (
                      <div className="text-xs text-muted-foreground text-center pt-1">
                        외 {storeList.length - 5}개 매장 더보기
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-3 text-sm text-muted-foreground">등록된 사용처가 없습니다</div>
                )}
              </CardContent>
            </Card>
        </DialogContent>
      </Dialog>

      {/* 사용처 전체보기 모달 */}
      <AllStoresModal
        open={showAllStores}
        onOpenChange={setShowAllStores}
        voucherId={voucher.id}
        voucherName={voucher.name}
      />
    </>
  )
}

