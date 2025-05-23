"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Search,MoreVertical,Filter,SortAsc,Edit,Trash2,} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu,DropdownMenuContent,DropdownMenuItem,DropdownMenuTrigger,} from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader,AlertDialogTitle,} from "@/components/ui/alert-dialog";
import List from "@/components/common/List";
import { getVouchers } from "@/app/voucher/lib/api";
import { Voucher } from "@/app/voucher/types/Voucher";

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
  

  const handleEdit = (item: Voucher) => {
    // 편집 로직
  };

  const openDeleteDialog = (item: Voucher) => {
    setSelectedVoucher(item);
    setDeleteDialogOpen(true);
  };

  const handleDelete = () => {
    // 삭제 로직
    setDeleteDialogOpen(false);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedKeyword(searchKeyword);
    }, 500);

    return () => clearTimeout(handler); 
  }, [searchKeyword]);

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

  const columns = [
    { key: "id", header: "ID", cell: (item: Voucher) => item.id },
    {
      key: "imageUrl",
      header: "바우처 이미지",
      cell: (item: Voucher) => (
        <img
          src={item.imageUrl || "/placeholder.png"}
          alt="이미지"
          className="w-10 h-10 object-cover rounded"
        />
      ),
    },
    { key: "name", header: "바우처명", cell: (item: Voucher) => item.name },
    { key: "storeCategory", header: "카테고리", cell: (item: Voucher) => item.storeCategory },
    { key: "contact", header: "문의처", cell: (item: Voucher) => item.contact },
    {
      key: "actions",
      header: "관리",
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
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                className="pl-9 w-48 h-8 text-sm"
                placeholder="바우처명 검색"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
              />
            </div>
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

      <List
        data={data}
        columns={columns}
        currentPage={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

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
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              삭제
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
