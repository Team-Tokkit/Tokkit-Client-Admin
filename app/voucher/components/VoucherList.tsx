"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Search, MoreVertical, Filter, SortAsc, Edit, Trash2, } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, } from "@/components/ui/alert-dialog";
import List from "@/components/common/List";
import { getVouchers, updateVoucher, getVoucherDetail, deleteVoucher } from "@/app/voucher/lib/api";
import { Voucher, VoucherDetail } from "@/app/voucher/types/Voucher";
import UpdateModal from "./UpdateModal";
import VoucherDetailModal from "./VoucherDetailModal";

// 카테고리 라벨 정의
const categoryLabels = {
  FOOD: "음식점",
  MEDICAL: "의료",
  SERVICE: "서비스",
  TOURISM: "관광",
  LODGING: "숙박",
  EDUCATION: "교육",
};

export default function VoucherList() {
  const [data, setData] = useState<Voucher[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [debouncedKeyword, setDebouncedKeyword] = useState("");
  const [storeCategory, setStoreCategory] = useState<string | undefined>(undefined);
  const [expirationPeriod, setExpirationPeriod] = useState<"asc" | "desc" | undefined>(undefined);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [voucherDetail, setVoucherDetail] = useState<VoucherDetail | null>(null);


  // 수정/삭제 핸들러
  const handleEdit = (item: Voucher) => {
    setSelectedVoucher(item);
    setEditDialogOpen(true);
  };

  const openDeleteDialog = (item: Voucher) => {
    setSelectedVoucher(item);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedVoucher) return;

    try {
      await deleteVoucher(selectedVoucher.id);
      alert("삭제가 완료되었습니다!");

      // UI 초기화
      setDeleteDialogOpen(false);
      setSelectedVoucher(null);

      // 목록 갱신
      const res = await getVouchers({
        page: page - 1,
        size: 10,
        searchKeyword: debouncedKeyword,
        storeCategory,
        sortByValidDate: expirationPeriod,
      });
      setData(res.content);
      setTotalPages(res.totalPages);
    } catch (error) {
      alert("삭제 중 오류가 발생했습니다.");
      console.error("삭제 실패:", error);
    }
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };


  // 디바운싱 처리 (검색 키워드)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedKeyword(searchKeyword);
    }, 500);

    return () => clearTimeout(handler);
  }, [searchKeyword]);


  // 전체 바우처 목록 불러오기
  useEffect(() => {
    const fetchData = async () => {
      const res = await getVouchers({
        page: page - 1,
        size: 10,
        searchKeyword: debouncedKeyword,
        storeCategory,
        sortByValidDate: expirationPeriod,
      });
      setData(res.content);
      setTotalPages(res.totalPages);
    };

    fetchData();
  }, [page, debouncedKeyword, storeCategory, expirationPeriod]);


  // 수정 제출 핸들러
  const handleEditSubmit = async (form: {
    description: string;
    detailDescription: string;
    price: string;
    contact: string;
  }) => {
    if (!selectedVoucher) return;

    try {
      await updateVoucher(selectedVoucher.id, {
        description: form.description,
        detailDescription: form.detailDescription,
        price: parseInt(form.price, 10),
        contact: form.contact,
      });

      alert("수정이 완료되었습니다!");

      setEditDialogOpen(false);
      setSelectedVoucher(null);

      const res = await getVouchers({
        page: page - 1,
        size: 10,
        searchKeyword: debouncedKeyword,
        storeCategory,
        sortByValidDate: expirationPeriod,
      });
      setData(res.content);
      setTotalPages(res.totalPages);
    } catch (err) {
      console.error("수정 중 오류 발생:", err);
    }
  };

  // 상세 조회 핸들러 
  const handleViewDetail = async (voucherId: number) => {
    try {
      const detail = await getVoucherDetail(voucherId);
      setVoucherDetail(detail);
      setDetailModalOpen(true);
    } catch (e) {
      alert("바우처 상세 정보를 불러오지 못했습니다.");
    }
  };

  // 테이블 컬럼 정의
  const columns = [
    { key: "id", header: "ID", cell: (item: Voucher) => item.id },
    {
      key: "imageUrl", header: "", cell: (item: Voucher) => (
        <img
          src={item.imageUrl || "/placeholder.png"}
          alt="이미지"
          className="w-10 h-10 object-cover rounded"
        />
      ),
    },
    {
      key: "name", header: "바우처명", cell: (item: Voucher) => (
        <button
          onClick={() => handleViewDetail(item.id)}
          className="max-w-[150px] overflow-hidden whitespace-nowrap text-ellipsis text-gray-900 hover:text-blue-600 hover:underline transition-colors"
        >
          {item.name}
        </button>
      )
    },
    { key: "price", header: "할인가", cell: (item: Voucher) => `${item.price.toLocaleString()}원`, },
    { key: "storeCategory", header: "카테고리", cell: (item: Voucher) => item.storeCategory },
    { key: "contact", header: "문의처", cell: (item: Voucher) => item.contact },
    {
      key: "validDate", header: "유효기간", cell: (item: Voucher) => new Date(item.validDate).toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }),
    },
    {
      key: "actions",
      header: "",
      cell: (item: Voucher) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">메뉴 열기</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleEdit(item)}>
              <Edit className="mr-2 h-4 w-4" />
              수정
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => openDeleteDialog(item)}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              삭제
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];


  return (
    <div className="bg-white rounded-lg border shadow-sm">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">바우처 관리</h2>

          {/* 검색/필터 UI */}
          <div className="flex items-center gap-2">
            {/* 검색창 */}
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                className="pl-9 w-48 h-8 text-sm"
                placeholder="바우처명 검색"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
              />
            </div>

            {/* 카테고리 필터 */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 text-sm">
                  <Filter className="mr-1.5 h-3.5 w-3.5" />
                  {storeCategory ? categoryLabels[storeCategory as keyof typeof categoryLabels] : "카테고리"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setStoreCategory(undefined)}>전체</DropdownMenuItem>
                {Object.entries(categoryLabels).map(([key, label]) => (
                  <DropdownMenuItem key={key} onClick={() => setStoreCategory(key)}>
                    {label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* 유효기간 정렬 */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 text-sm">
                  <SortAsc className="mr-1.5 h-3.5 w-3.5" />
                  {expirationPeriod === "asc"
                    ? "만료임박순"
                    : expirationPeriod === "desc"
                      ? "만료여유순"
                      : "정렬"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setExpirationPeriod(undefined)}>기본순</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setExpirationPeriod("asc")}>만료임박순</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setExpirationPeriod("desc")}>만료여유순</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* 바우처 리스트 테이블 */}
      <List
        data={data}
        columns={columns}
        currentPage={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

      {/* 삭제 다이얼로그 */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>바우처 삭제</AlertDialogTitle>
            <AlertDialogDescription>
              정말로 이 바우처를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction
              data-cy="confirm-delete-button"
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              삭제
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* 수정 모달 */}
      <UpdateModal
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        voucher={selectedVoucher}
        onSubmit={handleEditSubmit}
      />

      {/* 바우처 상세 조회 모달 */}
      <VoucherDetailModal
        open={detailModalOpen}
        onOpenChange={setDetailModalOpen}
        voucher={voucherDetail}
      />
    </div>
  );
}
