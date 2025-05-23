"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, RefreshCcw } from "lucide-react";
import List from "@/components/common/List";
import MerchantDetailDialog from "./components/MerchantDetail";
import { useFetchMerchantData } from "./handlers/useFetchMerchantData";
import { useMerchantActions } from "./handlers/useMerchantActions";

interface Merchant {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  status: "활성" | "비활성";
  createdAt: string;
}

interface MerchantUpdate {
  id: number;
  name: string;
  phoneNumber: string;
  status: "활성" | "비활성";
  pin?: string;
}

export default function MerchantPage() {
  const [merchantList, setMerchantList] = useState<Merchant[]>([]);
  const [keyword, setKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [localKeyword, setLocalKeyword] = useState("");
  const [selectedMerchant, setSelectedMerchant] = useState<Merchant | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const fetchMerchantData = useFetchMerchantData({
    setMerchantList,
    setTotalPages,
  });

  const {
    handleToggleStatus,
    handleSaveMerchant,
    handleViewMerchant,
  } = useMerchantActions({
    fetchMerchantData,
    setSelectedMerchant,
    setIsDetailOpen,
  });

  useEffect(() => {
    fetchMerchantData(currentPage - 1, keyword);
  }, [keyword, currentPage]);

  const handleResetFilters = () => {
    setLocalKeyword("");
    setKeyword("");
    setCurrentPage(1);
  };

  const merchantColumns = [
    {
      key: "id",
      header: "ID",
      cell: (merchant: Merchant) => <span>{merchant.id}</span>,
    },
    {
      key: "name",
      header: "이름",
      cell: (merchant: Merchant) => <span className="font-medium">{merchant.name}</span>,
    },
    {
      key: "email",
      header: "이메일",
      cell: (merchant: Merchant) => <span>{merchant.email}</span>,
    },
    {
      key: "phone",
      header: "전화번호",
      cell: (merchant: Merchant) => <span>{merchant.phoneNumber}</span>,
    },
    {
      key: "status",
      header: "상태",
      cell: (merchant: Merchant) => (
          <Badge
              className={
                merchant.status === "활성"
                    ? "bg-green-100 text-green-800 cursor-pointer"
                    : "bg-gray-100 text-gray-800 cursor-pointer"
              }
              onClick={() => {
                if (confirm("상태를 변경하시겠습니까?")) {
                  handleToggleStatus(merchant.id, merchant.status);
                }
              }}
          >
            {merchant.status}
          </Badge>
      ),
    },
    {
      key: "joinedAt",
      header: "가입일",
      cell: (merchant: Merchant) =>
          new Date(merchant.createdAt).toLocaleDateString("ko-KR"),
    },
    {
      key: "actions",
      header: "관리",
      cell: (merchant: Merchant) => (
          <Button variant="ghost" onClick={() => handleViewMerchant(merchant)}>
            상세
          </Button>
      ),
    },
  ];

  return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="text-2xl font-bold">가맹점 관리</h1>
          <div className="flex flex-col md:flex-row gap-2">
            <div className="relative">
              <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setKeyword(localKeyword);
                    setCurrentPage(1);
                  }}
              >
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder="가맹점 검색..."
                    className="pl-8 w-full"
                    value={localKeyword}
                    onChange={(e) => setLocalKeyword(e.target.value)}
                />
              </form>
            </div>
            <Button variant="outline" className="gap-1" onClick={handleResetFilters}>
              <RefreshCcw className="h-4 w-4" /> 새로고침
            </Button>
          </div>
        </div>

        <List
            data={merchantList}
            columns={merchantColumns}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
        />

        {isDetailOpen && selectedMerchant && (
            <MerchantDetailDialog
                open={isDetailOpen}
                merchant={selectedMerchant}
                onClose={() => setIsDetailOpen(false)}
                onSave={(updated) => handleSaveMerchant(updated, selectedMerchant)}
            />
        )}
      </div>
  );
}
