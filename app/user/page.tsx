"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, RefreshCcw } from "lucide-react";
import List from "@/components/common/List";
import UserDetailDialog from "./components/UserDetail";
import {
  fetchUsers,
  fetchUserDetail,
  updateUserStatus,
  updateUser,
} from "@/app/user/api/user";

interface User {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  status: "활성" | "비활성";
  createdAt: string;
}

interface UserUpdate {
  id: number;
  name: string;
  phoneNumber: string;
  status: "활성" | "비활성";
  pin?: string;
}

export default function UserPage() {
  const [userList, setUserList] = useState<User[]>([]);
  const [keyword, setKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [localKeyword, setLocalKeyword] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

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

  const handleSaveUser = async (updated: UserUpdate) => {
    try {
      const phone = updated.phoneNumber || selectedUser?.phoneNumber;

      const response = await updateUser(updated.id, {
        name: updated.name,
        phoneNumber: phone,
        pin: updated.pin,
      });

      if (response.isSuccess) {
        await fetchUserData();
        setSelectedUser(null);
        setIsDetailOpen(false);
      } else {
        console.error("사용자 수정 실패");
      }
    } catch (err) {
      console.error("사용자 수정 중 오류 발생", err);
    }
  };

  const handleViewUser = async (user: UserUpdate) => {
    const userDetail = await fetchUserDetail(user.id);
    setSelectedUser(userDetail);
    setIsDetailOpen(true);
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
      cell: (user: User) => (
        <Button variant="ghost" onClick={() => handleViewUser(user)}>
          상세
        </Button>
      ),
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

      {isDetailOpen && selectedUser && (
        <UserDetailDialog
          open={isDetailOpen}
          user={selectedUser}
          onClose={() => setIsDetailOpen(false)}
          onSave={handleSaveUser}
        />
      )}
    </div>
  );
}
