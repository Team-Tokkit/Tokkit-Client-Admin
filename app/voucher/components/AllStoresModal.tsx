import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin } from "lucide-react"
import Pagination from "@/components/common/Pagination"
import { getStoresByVoucherId } from "@/app/voucher/lib/api"

interface AllStoresModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  voucherId: number
  voucherName: string
}

interface Store {
  id: number
  storeName: string
  roadAddress : string
}

export default function AllStoresModal({ open, onOpenChange, voucherId, voucherName }: AllStoresModalProps) {
  const [stores, setStores] = useState<Store[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const itemsPerPage = 8

const fetchStores = async (page: number) => {
  try {
    const result = await getStoresByVoucherId(voucherId, page - 1, itemsPerPage)
    setStores(result.content)
    setTotalPages(result.totalPages)

    // 현재 페이지가 totalPages보다 크면 첫 페이지로 되돌림
    if (page > result.totalPages && result.totalPages > 0) {
      setCurrentPage(1)
    }
  } catch (e) {
    console.error("사용처 목록 조회 실패:", e)
  }
}


useEffect(() => {
  if (!open) return

  // 총 페이지보다 큰 페이지로 요청할 경우 자동으로 1페이지로 설정
  if (currentPage > totalPages) {
    setCurrentPage(1)
    return
  }

  fetchStores(currentPage)
}, [open, currentPage, totalPages])

const handlePageChange = (page: number) => {
  // 방어 코드: 유효하지 않은 페이지 클릭 방지
  if (page < 1 || page > totalPages) {
    console.warn("잘못된 페이지 요청 차단:", page)
    return
  }
  setCurrentPage(page)
}


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">사용처 전체보기</DialogTitle>
          <div className="text-sm text-muted-foreground">{voucherName}</div>
        </DialogHeader>

        <div className="py-2">
          {stores.length > 0 ? (
            <>
              <div className="grid grid-cols-1 gap-3 mb-4">
                {stores.map((store) => (
                  <Card key={store.id} className="overflow-hidden border-l-4 border-l-blue-500 shadow-sm">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-blue-100 p-2 rounded-full">
                          <MapPin className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-medium">{store.storeName}</div>
                          <div className="text-xs text-muted-foreground mt-1">{store.roadAddress}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              )}
            </>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <MapPin className="h-10 w-10 mx-auto mb-3 text-muted-foreground/50" />
              <p>등록된 사용처가 없습니다.</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
