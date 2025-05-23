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
  phoneNumber: string;
  status: "활성" | "비활성";
  createdAt: string;
  pin?: string;
}

interface Props {
  open: boolean;
  user: User;
  onClose: () => void;
  onSave: (user: User) => void;
}

export default function UserDetailDialog({ user, onClose, onSave }: Props) {
  const [formData, setFormData] = useState({
    name: user.name || "",
    phoneNumber: user.phoneNumber || "",
    pin: "",
  });

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    const formattedPhone = inputValue
      .replace(/[^\d]/g, "")
      .replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3");

    setFormData({ ...formData, phoneNumber: formattedPhone });
  };

  const handleSave = () => {
    if (formData.pin.length > 0 && formData.pin.length !== 6) {
      alert("비밀번호는 숫자 6자리여야 합니다.");
      return;
    }

    const updatedUser = {
      ...user,
      name: formData.name,
      phoneNumber: formData.phoneNumber || user.phoneNumber,
      pin: formData.pin,
    };

    onSave(updatedUser);
    onClose();
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
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
            <div className="font-semibold mb-3">전화번호</div>
            <Input
              placeholder="전화번호"
              value={formData.phoneNumber}
              onChange={handlePhoneChange}
            />
          </div>

          <div className="items-center gap-4">
            <div className="font-semibold mb-3">간편 비밀번호 (숫자 6자리)</div>
            <Input
              type="password"
              placeholder="숫자 6자리 입력"
              value={formData.pin}
              onChange={(e) =>
                setFormData({ ...formData, pin: e.target.value })
              }
              maxLength={6}
            />
          </div>
        </div>

        <DialogFooter className="pt-4">
          <Button variant="outline" onClick={onClose}>
            취소
          </Button>
          <Button onClick={handleSave}>수정</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
