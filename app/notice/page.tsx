"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, RefreshCcw } from "lucide-react";
import { NoticeDetailDialog } from "./components/NoticeDetail";
import { NoticeEditDialog } from "./components/NoticeEdit";
import { NoticeDeleteDialog } from "./components/NoticeDelete";
import List from "@/components/common/List";
<<<<<<< HEAD
import DropBox from "@/components/common/drop-box";
=======
import DropBox from "@/components/common/DropBox";
>>>>>>> 4b71f2b612e0b12dfadab8957a69b2b89b60de3d
import {
  fetchNotices,
  fetchNoticeDetail,
  createNotice,
  updateNotice,
  updateNoticeStatus,
} from "./api/notice";

export interface Notice {
  id: number;
  title: string;
  isDeleted: boolean;
  status: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NoticeDetail extends Notice {
  content: string;
  author: string;
}

export default function NoticePage() {
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [selectedNotice, setSelectedNotice] = useState<NoticeDetail | null>(
    null
  );
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isNewOpen, setIsNewOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [noticeToDelete, setNoticeToDelete] = useState<Notice | null>(null);

  const fetchNoticesData = async () => {
    try {
      const res = await fetchNotices(currentPage, searchQuery);
      setNotices(res.content);
      setTotalPages(res.totalPages);
    } catch (error) {
      console.error("공지사항을 가져오는 중 오류 발생:", error);
    }
  };

  useEffect(() => {
    fetchNoticesData();
  }, [currentPage, searchQuery]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".dropdown-trigger")) {
        setOpenDropdownId(null);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleToggleStatus = async (
    noticeId: number,
    currentStatus: boolean
  ) => {
    const newStatus = !currentStatus;
    try {
      await updateNoticeStatus(noticeId, newStatus);
      fetchNoticesData();
    } catch (err) {
      console.error("상태 변경 실패", err);
    }
  };

  const handleViewNotice = async (notice: Notice) => {
    const full = await fetchNoticeDetail(notice.id);
    setSelectedNotice(full);
    setIsDetailOpen(true);
  };

  const handleEditNotice = async (notice: Notice) => {
    const full = await fetchNoticeDetail(notice.id);
    setSelectedNotice(full);
    setIsDetailOpen(false);
    setIsEditOpen(true);
  };

  const handleDeleteClick = (notice: Notice) => {
    setNoticeToDelete(notice);
    setIsDetailOpen(false);
    setIsDeleteOpen(true);
  };

  const handleSaveNotice = async (formData: Partial<NoticeDetail>) => {
    try {
      if (formData.id) {
        await updateNotice(formData.id, {
          title: formData.title!,
          content: formData.content!,
        });
      } else {
        await createNotice({
          title: formData.title!,
          content: formData.content!,
        });
      }
      await fetchNoticesData();
      setIsEditOpen(false);
      setIsNewOpen(false);
    } catch (err) {
      console.error("저장 실패", err);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      if (noticeToDelete) {
        const updatedStatus = !noticeToDelete.isDeleted;
        await updateNoticeStatus(noticeToDelete.id, updatedStatus);

        await fetchNoticesData();
      }
    } catch (err) {
      console.error("삭제 실패", err);
    }
    setIsDeleteOpen(false);
  };

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSearchQuery(searchInput);
    setCurrentPage(0);
  };

  const handleSearchReset = () => {
    setSearchInput("");
    setSearchQuery("");
    setCurrentPage(0);
    fetchNoticesData();
  };

  const columns = [
    {
      key: "id",
      header: "ID",
      cell: (notice: Notice) => (
        <span className="font-medium">{notice.id}</span>
      ),
    },
    {
      key: "title",
      header: "제목",
      cell: (notice: Notice) => notice.title,
    },
    {
      key: "status",
      header: "상태",
      cell: (notice: Notice) => (
        <Badge
          data-cy="notice-status-badge"
          className={`px-2 py-1 rounded-full text-xs cursor-pointer ${
            notice.isDeleted === true
              ? "bg-red-100 text-red-800"
              : "bg-green-100 text-green-800"
          }`}
          onClick={() => {
            if (confirm("상태를 변경하시겠습니까?")) {
              handleToggleStatus(notice.id, notice.isDeleted);
            }
          }}
        >
          {notice.isDeleted === true ? "비활성" : "활성"}
        </Badge>
      ),
    },
    {
      key: "createdAt",
      header: "등록일",
      cell: (notice: Notice) =>
        notice.createdAt
          ? new Date(notice.createdAt).toLocaleDateString("ko-KR")
          : "-",
    },
    {
      key: "updatedAt",
      header: "수정일",
      cell: (notice: Notice) =>
        notice.updatedAt
          ? new Date(notice.updatedAt).toLocaleDateString("ko-KR")
          : "-",
    },
    {
      key: "actions",
      header: "관리",
      cell: (notice: Notice) => {
        const isOpen = openDropdownId === notice.id;

        const items = [
          {
            label: "상세보기",
            dataCy: "notice-view-button",
            onClick: () => {
              setOpenDropdownId(null);
              handleViewNotice(notice);
            },
          },
          {
            label: notice.isDeleted ? "복구" : "삭제",
            dataCy: "notice-delete-button",
            onClick: () => {
              setOpenDropdownId(null);
              handleDeleteClick(notice);
            },
            danger: notice.isDeleted,
          },
        ];

        return (
          <DropBox
            data-cy="notice-more-button"
            isOpen={isOpen}
            onToggle={() => setOpenDropdownId(isOpen ? null : notice.id)}
            items={items}
          />
        );
      },
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">공지사항 관리</h1>
        <div className="flex flex-col md:flex-row gap-2">
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="공지사항 검색..."
              className="pl-8 w-full md:w-[250px]"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </form>
          <div className="flex flex-col md:flex-row gap-2">
            <Button
              variant="outline"
              className="gap-1"
              onClick={handleSearchReset}
            >
              <RefreshCcw className="h-4 w-4" /> 새로고침
            </Button>
          </div>

          <Button
            data-cy="new-notice-button"
            onClick={() => {
              setSelectedNotice(null);
              setIsNewOpen(true);
            }}
          >
            <Plus className="mr-2 h-4 w-4" /> 공지사항 등록
          </Button>
        </div>
      </div>

      <List
        data={notices}
        columns={columns}
        currentPage={currentPage + 1}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page - 1)}
      />

      <NoticeDetailDialog
        notice={selectedNotice}
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
        onEdit={handleEditNotice}
        onDelete={(notice) => handleDeleteClick(notice)}
      />

      <NoticeEditDialog
        notice={selectedNotice}
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        onSave={handleSaveNotice}
      />

      <NoticeEditDialog
        notice={{ author: "관리자" } as NoticeDetail}
        isNew={true}
        open={isNewOpen}
        onOpenChange={setIsNewOpen}
        onSave={handleSaveNotice}
      />

      <NoticeDeleteDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        onConfirm={handleConfirmDelete}
        title={noticeToDelete?.isDeleted ? "복구 확인" : "삭제 확인"}
        description={
          noticeToDelete?.isDeleted
            ? "이 공지사항을 복구하시겠습니까? 복구된 공지사항은 목록에서 다시 '활성' 상태로 표시됩니다."
            : "이 공지사항을 삭제하시겠습니까? 삭제된 공지사항은 목록에서 '삭제됨' 상태로 표시됩니다."
        }
        confirmText={noticeToDelete?.isDeleted ? "복구" : "삭제"}
        confirmVariant={noticeToDelete?.isDeleted ? "default" : "destructive"}
      />
    </div>
  );
}
