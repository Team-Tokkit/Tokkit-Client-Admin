"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { format } from "date-fns";

interface NoticeDetailDialogProps {
  notice: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: (notice: any) => void;
  onDelete: (id: string | number) => void;
}

export function NoticeDetailDialog({
  notice,
  open,
  onOpenChange,
  onEdit,
  onDelete,
}: NoticeDetailDialogProps) {
  if (!notice) return null;

  const formattedCreatedAt = notice.createdAt
    ? format(new Date(notice.createdAt), "yyyy년 MM월 dd일 HH:mm")
    : "날짜 정보 없음";
  const formattedUpdatedAt = notice.updatedAt
    ? format(new Date(notice.updatedAt), "yyyy년 MM월 dd일 HH:mm")
    : "날짜 정보 없음";

  const isNoticeDeleted = notice.isDeleted === true;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>공지사항 상세</DialogTitle>
          <DialogDescription>
            공지사항의 상세 내용을 확인합니다.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <div className="font-semibold">제목</div>
            <div className="col-span-3">{notice.title}</div>
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <div className="font-semibold">내용</div>
            <div className="col-span-3 whitespace-pre-wrap">
              {notice.content}
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <div className="font-semibold">상태</div>
            <div className="col-span-3">
              <span
                className={`px-2 py-1 rounded-full text-xs ${
                  isNoticeDeleted
                    ? "bg-red-100 text-red-800"
                    : "bg-green-100 text-green-800"
                }`}
              >
                {isNoticeDeleted ? "비활성" : "활성"}{" "}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <div className="font-semibold">등록일</div>
            <div className="col-span-3">{formattedCreatedAt}</div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <div className="font-semibold">수정일</div>
            <div className="col-span-3">{formattedUpdatedAt}</div>
          </div>
        </div>
        <DialogFooter className="flex space-x-2 justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            닫기
          </Button>
          <Button onClick={() => onEdit(notice)}>수정</Button>
          <Button
            variant="destructive"
            onClick={() => onDelete(notice.id)}
          >
            삭제
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
