"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, RefreshCcw } from "lucide-react";
import List from "@/components/common/List";
import DropBox from "@/components/common/DropBox";
import UserDetailDialog from "./components/UserDetail";
import UserEditDialog from "./components/UserEdit";
import {
  fetchUsers,
  fetchUserDetail,
  updateUserStatus,
  updateUser,
} from "@/app/user/api/user";

interface User {
  id: number;
  name: string;
  phoneNumber: string;
  status: "활성" | "비활성";
  createdAt: string;
  email: string;
  pin?: string;
}

interface UserDetail extends User {
  walletId: number;
  isDormant: boolean;
}

export default function UserPage() {
  const [userList, setUserList] = useState<User[]>([]);
  const [keyword, setKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [localKeyword, setLocalKeyword] = useState("");

  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [viewUser, setViewUser] = useState<UserDetail | null>(null);
  const [editUser, setEditUser] = useState<User | null>(null);

  const fetchUserData = async () => {
    try {
      const res = await fetchUsers({ page: currentPage - 1, keyword });
      const pageData = res.result;

      const mapped = pageData.content.map((user: any) => ({
        ...user,
        status: user.isDormant ? "비활성" : "활성",
      }));

      setUserList(mapped);
      setTotalPages(pageData.totalPages);
    } catch (err) {
      console.error("사용자 목록 불러오기 실패", err);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [keyword, currentPage]);

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

  const handleResetFilters = () => {
    setLocalKeyword("");
    setKeyword("");
    setCurrentPage(1);
  };

  const handleToggleStatus = async (userId: number, currentStatus: string) => {
    const newIsDormant = currentStatus === "활성";
    try {
      await updateUserStatus(userId, newIsDormant);
      fetchUserData();
    } catch (err) {
      console.error("상태 변경 실패", err);
    }
  };

  const handleViewUser = async (user: User) => {
    const detail = await fetchUserDetail(user.id);
    setViewUser(detail as UserDetail);
    setIsViewOpen(true);
  };

  const handleEditUser = async (user: User) => {
    const detail: User = await fetchUserDetail(user.id);
    setEditUser(detail);
    setIsEditOpen(true);
  };

  const handleSaveUser = async (updated: User) => {
    try {
      const response = await updateUser(updated.id, {
        name: updated.name,
        phoneNumber: updated.phoneNumber,
        pin: updated.pin,
      });

      if (response.isSuccess) {
        await fetchUserData();
        setIsEditOpen(false);
        setEditUser(null);
      } else {
        alert("수정 실패");
      }
    } catch (err) {
      console.error("사용자 수정 실패", err);
    }
  };

  const userColumns = [
    {
      key: "id",
      header: "ID",
      cell: (user: User) => <span>{user.id}</span>,
    },
    {
      key: "name",
      header: "이름",
      cell: (user: User) => <span className="font-medium">{user.name}</span>,
    },
    {
      key: "email",
      header: "이메일",
      cell: (user: User) => <span>{user.email}</span>,
    },
    {
      key: "phone",
      header: "전화번호",
      cell: (user: User) => <span>{user.phoneNumber}</span>,
    },
    {
      key: "status",
      header: "상태",
      cell: (user: User) => (
        <Badge
          className={
            user.status === "활성"
              ? "bg-green-100 text-green-800 cursor-pointer"
              : "bg-gray-100 text-gray-800 cursor-pointer"
          }
          onClick={() => {
            if (confirm("상태를 변경하시겠습니까?")) {
              handleToggleStatus(user.id, user.status);
            }
          }}
        >
          {user.status}
        </Badge>
      ),
    },
    {
      key: "joinedAt",
      header: "가입일",
      cell: (user: User) =>
        new Date(user.createdAt).toLocaleDateString("ko-KR"),
    },
    {
      key: "actions",
      header: "관리",
      cell: (user: User) => {
        const isOpen = openDropdownId === user.id;

        const items = [
          {
            label: "상세보기",
            onClick: () => {
              setOpenDropdownId(null);
              handleViewUser(user);
            },
          },
          {
            label: "수정하기",
            onClick: () => {
              setOpenDropdownId(null);
              handleEditUser(user);
            },
          },
        ];

        return (
          <DropBox
            isOpen={isOpen}
            onToggle={() => setOpenDropdownId(isOpen ? null : user.id)}
            items={items}
          />
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">사용자 관리</h1>
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
                placeholder="사용자 검색..."
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
        data={userList}
        columns={userColumns}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      {isViewOpen && viewUser && (
        <UserDetailDialog
          open={isViewOpen}
          user={viewUser}
          onClose={() => {
            setIsViewOpen(false);
            setViewUser(null);
          }}
          onEdit={() => {
            setIsViewOpen(false);
            setIsEditOpen(true);
            setEditUser(viewUser);
          }}
        />
      )}

      {isEditOpen && editUser && (
        <UserEditDialog
          open={isEditOpen}
          user={editUser}
          onClose={() => {
            setIsEditOpen(false);
            setEditUser(null);
          }}
          onSave={handleSaveUser}
        />
      )}
    </div>
  );
}
