import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface User {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  status: "활성" | "비활성";
  createdAt: string;
}

interface Props {
  user: User;
  onClose: () => void;
  onSave: (user: User) => void;
}

export default function UserDetailModal({ user, onClose, onSave }: Props) {
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    phoneNumber: user.phoneNumber,
  });

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>사용자 수정</DialogTitle>
          <DialogDescription>사용자 상세 정보를 수정합니다.</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="items-center gap-4">
            <div className="font-semibold mb-3">이름</div>
            <Input
              placeholder="이름"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>
          <div className="items-center gap-4">
            <div className="font-semibold mb-3">이메일</div>
            <Input
              placeholder="이메일"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>
          <div className="items-center gap-4">
            <div className="font-semibold mb-3">전화번호</div>
            <Input
              placeholder="전화번호"
              value={formData.phoneNumber}
              onChange={(e) =>
                setFormData({ ...formData, phoneNumber: e.target.value })
              }
            />
          </div>
        </div>

        <DialogFooter className="pt-4">
          <Button variant="outline" onClick={onClose}>
            취소
          </Button>
          <Button onClick={() => onSave({ ...user, ...formData })}>저장</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
