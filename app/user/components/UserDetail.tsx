"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface UserDetailDialogProps {
  open: boolean;
  user: {
    id: number;
    name: string;
    email: string;
    phoneNumber: string;
    isDormant: boolean;
    createdAt: string;
    walletId: number;
  } | null;
  onClose: () => void;
  onEdit: () => void;
}

export default function UserDetailDialog({
  open,
  user,
  onClose,
  onEdit,
}: UserDetailDialogProps) {
  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>사용자 상세정보</DialogTitle>
          <DialogDescription>사용자 상세 정보입니다.</DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4 text-sm">
          <InfoRow
            label="상태"
            value={
              <Badge
                className={
                  user.isDormant
                    ? "bg-gray-100 text-gray-800"
                    : "bg-green-100 text-green-800"
                }
              >
                {user.isDormant ? "비활성" : "활성"}
              </Badge>
            }
          />
          <InfoRow label="이름" value={user.name} />
          <InfoRow label="사용자 ID" value={user.id} />
          <InfoRow label="지갑 ID" value={user.walletId} />
          <InfoRow label="이메일" value={user.email} />
          <InfoRow label="전화번호" value={user.phoneNumber} />

          <InfoRow
            label="가입일"
            value={new Date(user.createdAt).toLocaleDateString("ko-KR")}
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            닫기
          </Button>
          <Button onClick={onEdit}>수정</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function InfoRow({ label, value }: { label: string; value: any }) {
  return (
    <div className="grid grid-cols-4 items-center gap-4">
      <div className="font-semibold">{label}</div>
      <div className="col-span-3">{value}</div>
    </div>
  );
}
