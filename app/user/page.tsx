"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import List from "@/components/common/List";
import { ManageBox } from "./components/ManageBox";
import UserDetailModal from "./components/UserDetailModal";
import DeleteModal from "./components/DeleteModal";
import PinChangeModal from "./components/PinChangeModal";

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  status: "활성" | "비활성";
  joinedAt: string;
}

const mockUsers: User[] = [
  {
    id: 1,
    name: "김민수",
    email: "minsu.kim@example.com",
    phone: "010-1234-5678",
    status: "활성",
    joinedAt: "2023-01-15",
  },
  {
    id: 2,
    name: "이지은",
    email: "jieun.lee@example.com",
    phone: "010-2345-6789",
    status: "활성",
    joinedAt: "2023-02-20",
  },
  {
    id: 3,
    name: "박준호",
    email: "junho.park@example.com",
    phone: "010-3456-7890",
    status: "비활성",
    joinedAt: "2023-03-10",
  },
  {
    id: 4,
    name: "최유진",
    email: "yujin.choi@example.com",
    phone: "010-4567-8901",
    status: "활성",
    joinedAt: "2023-04-05",
  },
  {
    id: 5,
    name: "정현우",
    email: "hyunwoo.jung@example.com",
    phone: "010-5678-9012",
    status: "비활성",
    joinedAt: "2023-05-12",
  },
];

export default function UserPage() {
  const [userList, setUserList] = useState<User[]>(mockUsers);
  const [keyword, setKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [localKeyword, setLocalKeyword] = useState("");

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [deleteModalUser, setDeleteModalUser] = useState<User | null>(null);
  const [pinModalUser, setPinModalUser] = useState<User | null>(null);

  const fetchUserData = () => {
    const filtered = mockUsers.filter((u) => u.name.includes(keyword.trim()));
    setUserList(filtered);
    setTotalPages(1);
  };

  useEffect(() => {
    fetchUserData();
  }, [keyword, currentPage]);

  const handleToggleStatus = (userId: number) => {
    setUserList((prev) =>
      prev.map((user) =>
        user.id === userId
          ? {
              ...user,
              status: user.status === "활성" ? "비활성" : "활성",
            }
          : user
      )
    );
  };

  const handleSaveUser = (updated: User) => {
    setUserList((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
    setSelectedUser(null);
  };

  const handleDeleteUser = (userId: number) => {
    setUserList((prev) => prev.filter((user) => user.id !== userId));
    setDeleteModalUser(null);
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
      cell: (user: User) => <span>{user.phone}</span>,
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
              handleToggleStatus(user.id);
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
      cell: (user: User) => new Date(user.joinedAt).toLocaleDateString("ko-KR"),
    },
    {
      key: "actions",
      header: "관리",
      cell: (user: User) => (
        <ManageBox
          onEdit={() => setSelectedUser(user)}
          onDelete={() => setDeleteModalUser(user)}
          onChangePin={() => setPinModalUser(user)}
        />
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
        </div>
      </div>

      <List
        data={userList}
        columns={userColumns}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      {selectedUser && (
        <UserDetailModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          onSave={handleSaveUser}
        />
      )}

      {deleteModalUser && (
        <DeleteModal
          user={deleteModalUser}
          onClose={() => setDeleteModalUser(null)}
          onConfirm={() => handleDeleteUser(deleteModalUser.id)}
        />
      )}

      {pinModalUser && (
        <PinChangeModal
          user={pinModalUser}
          onClose={() => setPinModalUser(null)}
          onChangePin={(pin) => {
            setPinModalUser(null);
          }}
        />
      )}
    </div>
  );
}
