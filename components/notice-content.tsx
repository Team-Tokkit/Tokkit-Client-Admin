"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Search, Plus } from "lucide-react"
import { NoticeDetailDialog } from "./notice-detail-dialog"
import { NoticeEditDialog } from "./notice-edit-dialog"
import { DeleteConfirmDialog } from "./delete-confirm-dialog"
import { format } from "date-fns"
import { ResponsiveTable } from "./responsive-table"

export function NoticeContent() {
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [notices, setNotices] = useState([])
  const [selectedNotice, setSelectedNotice] = useState(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isNewOpen, setIsNewOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [noticeToDelete, setNoticeToDelete] = useState(null)

  // 페이지 로드 시 데이터 가져오기
  useEffect(() => {
    fetchNotices()
  }, [currentPage, searchQuery])

  // 공지사항 데이터 가져오기 (실제로는 API 호출)
  const fetchNotices = async () => {
    try {
      // 실제 API 호출 대신 샘플 데이터 사용
      const response = {
        isSuccess: true,
        code: "COMMON200",
        message: "성공입니다",
        result: {
          content: noticeData
            .filter((notice) => notice.title.toLowerCase().includes(searchQuery.toLowerCase()))
            .slice(currentPage * 7, (currentPage + 1) * 7),
          pageable: {
            pageNumber: currentPage,
            pageSize: 7,
          },
          totalPages: Math.ceil(noticeData.length / 7),
          totalElements: noticeData.length,
          number: currentPage,
        },
      }

      setNotices(response.result.content)
      setTotalPages(response.result.totalPages)
    } catch (error) {
      console.error("공지사항을 가져오는 중 오류 발생:", error)
    }
  }

  // 공지사항 상세보기
  const handleViewNotice = (notice) => {
    setSelectedNotice(notice)
    setIsDetailOpen(true)
  }

  // 공지사항 수정 모달 열기
  const handleEditNotice = (notice) => {
    setSelectedNotice(notice)
    setIsDetailOpen(false)
    setIsEditOpen(true)
  }

  // 공지사항 삭제 확인 모달 열기
  const handleDeleteClick = (notice) => {
    setNoticeToDelete(notice)
    setIsDetailOpen(false)
    setIsDeleteOpen(true)
  }

  // 공지사항 저장 (신규 또는 수정)
  const handleSaveNotice = (formData) => {
    if (formData.id) {
      // 기존 공지사항 수정
      const updatedNotices = notices.map((notice) =>
        notice.id === formData.id ? { ...formData, updatedAt: new Date().toISOString() } : notice,
      )
      setNotices(updatedNotices)
      // 전체 데이터도 업데이트
      const updatedNoticeData = noticeData.map((notice) =>
        notice.id === formData.id ? { ...formData, updatedAt: new Date().toISOString() } : notice,
      )
      // 실제로는 API 호출로 처리
      console.log("공지사항 수정:", formData)
    } else {
      // 새 공지사항 추가
      const newNotice = {
        ...formData,
        id: Date.now(), // 임시 ID 생성
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        deleted: false,
      }
      // 실제로는 API 호출로 처리
      console.log("새 공지사항 추가:", newNotice)
      noticeData.unshift(newNotice) // 전체 데이터에 추가
      fetchNotices() // 데이터 다시 가져오기
    }
    setIsEditOpen(false)
    setIsNewOpen(false)
  }

  // 공지사항 삭제
  const handleConfirmDelete = () => {
    if (noticeToDelete) {
      if (noticeToDelete.deleted) {
        // 이미 deleted=true인 경우 완전 삭제
        const filteredNotices = noticeData.filter((notice) => notice.id !== noticeToDelete.id)
        noticeData.length = 0
        noticeData.push(...filteredNotices)
      } else {
        // deleted=true로 변경 (소프트 삭제)
        const updatedNoticeData = noticeData.map((notice) =>
          notice.id === noticeToDelete.id ? { ...notice, deleted: true, updatedAt: new Date().toISOString() } : notice,
        )
        noticeData.length = 0
        noticeData.push(...updatedNoticeData)
      }
      // 실제로는 API 호출로 처리
      console.log("공지사항 삭제:", noticeToDelete)
      fetchNotices() // 데이터 다시 가져오기
    }
    setIsDeleteOpen(false)
  }

  // 페이지 변경 처리
  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  // 테이블 컬럼 정의
  const columns = [
    {
      key: "id",
      header: "ID",
      cell: (notice) => <span className="font-medium">{notice.id}</span>,
      className: "w-[70px]",
      hideOnMobile: true,
    },
    {
      key: "title",
      header: "제목",
      cell: (notice) => notice.title,
    },
    {
      key: "author",
      header: "작성자",
      cell: (notice) => notice.author,
      hideOnMobile: true,
    },
    {
      key: "status",
      header: "상태",
      cell: (notice) => (
        <span
          className={`px-2 py-1 rounded-full text-xs ${
            notice.deleted ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
          }`}
        >
          {notice.deleted ? "삭제됨" : "활성"}
        </span>
      ),
    },
    {
      key: "createdAt",
      header: "등록일",
      cell: (notice) => (notice.createdAt ? format(new Date(notice.createdAt), "yyyy-MM-dd") : "-"),
      hideOnMobile: true,
    },
    {
      key: "updatedAt",
      header: "수정일",
      cell: (notice) => (notice.updatedAt ? format(new Date(notice.updatedAt), "yyyy-MM-dd") : "-"),
      hideOnMobile: true,
    },
    {
      key: "actions",
      header: "액션",
      cell: (notice) => (
        <div className="flex justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={() => handleViewNotice(notice)}>
            상세보기
          </Button>
          <Button variant="ghost" size="sm" onClick={() => handleEditNotice(notice)} className="hidden md:inline-flex">
            수정
          </Button>
          <Button variant="ghost" size="sm" onClick={() => handleDeleteClick(notice)} className="hidden md:inline-flex">
            {notice.deleted ? "완전삭제" : "삭제"}
          </Button>
        </div>
      ),
      className: "text-right",
    },
  ]

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">공지사항 관리</h1>
        <div className="flex flex-col md:flex-row gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="공지사항 검색..."
              className="pl-8 w-full md:w-[250px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button
            onClick={() => {
              setSelectedNotice(null)
              setIsNewOpen(true)
            }}
          >
            <Plus className="mr-2 h-4 w-4" /> 공지사항 등록
          </Button>
        </div>
      </div>

      <Card className="overflow-hidden">
        {/* 이미 ResponsiveTable 컴포넌트를 사용하여 반응형으로 구현되어 있습니다. */}
        <ResponsiveTable data={notices} columns={columns} emptyMessage="공지사항이 없습니다." />
      </Card>

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => {
                e.preventDefault()
                if (currentPage > 0) handlePageChange(currentPage - 1)
              }}
              className={currentPage === 0 ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            const pageNumber = i
            return (
              <PaginationItem key={i} className="hidden sm:inline-block">
                <PaginationLink
                  href="#"
                  isActive={currentPage === pageNumber}
                  onClick={(e) => {
                    e.preventDefault()
                    handlePageChange(pageNumber)
                  }}
                >
                  {pageNumber + 1}
                </PaginationLink>
              </PaginationItem>
            )
          })}
          {totalPages > 5 && <PaginationEllipsis className="hidden sm:inline-block" />}
          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e) => {
                e.preventDefault()
                if (currentPage < totalPages - 1) handlePageChange(currentPage + 1)
              }}
              className={currentPage === totalPages - 1 ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>

      {/* 상세보기 다이얼로그 */}
      <NoticeDetailDialog
        notice={selectedNotice}
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
        onEdit={handleEditNotice}
        onDelete={handleDeleteClick}
      />

      {/* 수정 다이얼로그 */}
      <NoticeEditDialog
        notice={selectedNotice}
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        onSave={handleSaveNotice}
      />

      {/* 신규 등록 다이얼로그 */}
      <NoticeEditDialog
        notice={{ author: "관리자" }}
        isNew={true}
        open={isNewOpen}
        onOpenChange={setIsNewOpen}
        onSave={handleSaveNotice}
      />

      {/* 삭제 확인 다이얼로그 */}
      <DeleteConfirmDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        onConfirm={handleConfirmDelete}
        title={noticeToDelete?.deleted ? "완전 삭제 확인" : "삭제 확인"}
        description={
          noticeToDelete?.deleted
            ? "이 공지사항을 완전히 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다."
            : "이 공지사항을 삭제하시겠습니까? 삭제된 공지사항은 목록에서 '삭제됨' 상태로 표시됩니다."
        }
      />
    </div>
  )
}

// 샘플 공지사항 데이터
const noticeData = [
  {
    id: 1,
    title: "공지사항 제목 1",
    content: "이것은 공지사항 더미 내용입니다. 번호: 1",
    author: "관리자",
    createdAt: "2025-05-15T00:59:28",
    updatedAt: "2025-05-15T00:59:28",
    deleted: false,
  },
  {
    id: 2,
    title: "공지사항 제목 2",
    content: "이것은 공지사항 더미 내용입니다. 번호: 2",
    author: "관리자",
    createdAt: "2025-05-15T00:59:28",
    updatedAt: "2025-05-15T00:59:28",
    deleted: false,
  },
  {
    id: 3,
    title: "공지사항 제목 3",
    content: "이것은 공지사항 더미 내용입니다. 번호: 3",
    author: "관리자",
    createdAt: "2025-05-15T00:59:28",
    updatedAt: "2025-05-15T00:59:28",
    deleted: false,
  },
  {
    id: 4,
    title: "공지사항 제목 4",
    content: "이것은 공지사항 더미 내용입니다. 번호: 4",
    author: "관리자",
    createdAt: "2025-05-15T00:59:28",
    updatedAt: "2025-05-15T00:59:28",
    deleted: false,
  },
  {
    id: 5,
    title: "공지사항 제목 5",
    content: "이것은 공지사항 더미 내용입니다. 번호: 5",
    author: "관리자",
    createdAt: "2025-05-15T00:59:28",
    updatedAt: "2025-05-15T00:59:28",
    deleted: false,
  },
  {
    id: 6,
    title: "공지사항 제목 6",
    content: "이것은 공지사항 더미 내용입니다. 번호: 6",
    author: "관리자",
    createdAt: "2025-05-15T00:59:28",
    updatedAt: "2025-05-15T00:59:28",
    deleted: false,
  },
  {
    id: 7,
    title: "공지사항 제목 7",
    content: "이것은 공지사항 더미 내용입니다. 번호: 7",
    author: "관리자",
    createdAt: "2025-05-15T00:59:28",
    updatedAt: "2025-05-15T00:59:28",
    deleted: false,
  },
  {
    id: 8,
    title: "공지사항 제목 8",
    content: "이것은 공지사항 더미 내용입니다. 번호: 8",
    author: "관리자",
    createdAt: "2025-05-14T00:59:28",
    updatedAt: "2025-05-14T00:59:28",
    deleted: false,
  },
  {
    id: 9,
    title: "공지사항 제목 9",
    content: "이것은 공지사항 더미 내용입니다. 번호: 9",
    author: "관리자",
    createdAt: "2025-05-14T00:59:28",
    updatedAt: "2025-05-14T00:59:28",
    deleted: true,
  },
  {
    id: 10,
    title: "공지사항 제목 10",
    content: "이것은 공지사항 더미 내용입니다. 번호: 10",
    author: "관리자",
    createdAt: "2025-05-14T00:59:28",
    updatedAt: "2025-05-14T00:59:28",
    deleted: false,
  },
]
