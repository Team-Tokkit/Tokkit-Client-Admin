"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, RefreshCcw } from "lucide-react";
import List from "@/components/common/List";
import MerchantEditDialog from "./components/MerchantEditDialog";
import { useFetchMerchantData } from "./handlers/useFetchMerchantData";
import { useMerchantActions } from "./handlers/useMerchantActions";
import { fetchMerchantDetail } from "./api/merchant";
import MerchantViewDialog from "./components/MerchantViewDialog";
import DropBox from "@/components/common/drop-box";

interface Merchant {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  status: "활성" | "비활성";
  createdAt: string;
  pin?: string;
}

export default function MerchantPage() {
  const [merchantList, setMerchantList] = useState<Merchant[]>([]);
  const [keyword, setKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [localKeyword, setLocalKeyword] = useState("");

  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);
  const [selectedMerchant, setSelectedMerchant] = useState<Merchant | null>(
    null
  );
  const [editMerchant, setEditMerchant] = useState<Merchant | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const fetchMerchantData = useFetchMerchantData({
    setMerchantList,
    setTotalPages,
  });

  const { handleToggleStatus, handleSaveMerchant, handleViewMerchant } =
    useMerchantActions({
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

    fetchMerchantData(0, "");
  };

  const merchantColumns = [
    { key: "id", header: "ID", cell: (m: Merchant) => <span>{m.id}</span> },
    {
      key: "name",
      header: "이름",
      cell: (m: Merchant) => <span className="font-medium">{m.name}</span>,
    },
    {
      key: "email",
      header: "이메일",
      cell: (m: Merchant) => <span>{m.email}</span>,
    },
    {
      key: "phone",
      header: "전화번호",
      cell: (m: Merchant) => <span>{m.phoneNumber}</span>,
    },
    {
      key: "status",
      header: "상태",
      cell: (m: Merchant) => (
        <Badge
          className={
            m.status === "활성"
              ? "bg-green-100 text-green-800 cursor-pointer"
              : "bg-gray-100 text-gray-800 cursor-pointer"
          }
          onClick={() => {
            if (confirm("상태를 변경하시겠습니까?")) {
              handleToggleStatus(m.id, m.status);
            }
          }}
        >
          {m.status}
        </Badge>
      ),
    },
    {
      key: "joinedAt",
      header: "가입일",
      cell: (m: Merchant) => new Date(m.createdAt).toLocaleDateString("ko-KR"),
    },
    {
      key: "actions",
      header: "관리",
      cell: (m: Merchant) => {
        const isOpen = openDropdownId === m.id;
        const items = [
          {
            label: "상세보기",
            onClick: () => {
              setOpenDropdownId(null);
              handleViewMerchant(m);
            },
          },
          {
            label: "수정하기",
            onClick: async () => {
              setOpenDropdownId(null);
              const detail = await fetchMerchantDetail(m.id);
              setEditMerchant(detail);
              setIsEditOpen(true);
            },
          },
        ];
        return (
          <DropBox
            isOpen={isOpen}
            onToggle={() => setOpenDropdownId(isOpen ? null : m.id)}
            items={items}
          />
        );
      },
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
          <Button
            variant="outline"
            className="gap-1"
            onClick={handleResetFilters}
          >
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
        <MerchantViewDialog
          open={isDetailOpen}
          merchant={selectedMerchant}
          onClose={() => setIsDetailOpen(false)}
          onEdit={async () => {
            setIsDetailOpen(false);
            const detail = await fetchMerchantDetail(selectedMerchant.id);
            setEditMerchant(detail);
            setIsEditOpen(true);
          }}
        />
      )}

      {isEditOpen && editMerchant && (
        <MerchantEditDialog
          open={isEditOpen}
          merchant={editMerchant}
          onClose={() => {
            setIsEditOpen(false);
            setEditMerchant(null);
          }}
          onSave={async (updated) => {
            await handleSaveMerchant(updated, editMerchant);
          }}
        />
      )}
    </div>
  );
}
