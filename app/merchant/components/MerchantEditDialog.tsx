"use client";

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

interface Merchant {
  id: number;
  name: string;
  phoneNumber: string;
  status: "활성" | "비활성";
  createdAt: string;
  email: string;
  pin?: string;
}

interface Props {
  open: boolean;
  merchant: Merchant;
  onClose: () => void;
  onSave: (merchant: Merchant) => Promise<void>;
}

export default function MerchantEditDialog({
  open,
  merchant,
  onClose,
  onSave,
}: Props) {
  const [formData, setFormData] = useState({
    name: merchant.name || "",
    phoneNumber: merchant.phoneNumber || "",
    pin: "",
  });

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let inputValue = e.target.value.replace(/[^\d]/g, "");
    if (inputValue.length > 11) {
      inputValue = inputValue.slice(0, 11);
    }

    inputValue = inputValue.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3");

    setFormData({ ...formData, phoneNumber: inputValue });
  };

  const handleSave = () => {
    if (formData.pin.length > 0 && formData.pin.length !== 6) {
      alert("비밀번호는 숫자 6자리여야 합니다.");
      return;
    }

    const updatedMerchant: Merchant = {
      ...merchant,
      name: formData.name,
      phoneNumber: formData.phoneNumber,
      pin: formData.pin,
      email: merchant.email,
      status: merchant.status,
      createdAt: merchant.createdAt,
    };

    onSave(updatedMerchant);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>가맹점 수정</DialogTitle>
          <DialogDescription>가맹점 정보를 수정합니다.</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="items-center gap-4">
            <div className="font-semibold mb-2">이름</div>
            <Input
              placeholder="이름"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>

          <div className="items-center gap-4">
            <div className="font-semibold mb-2">전화번호</div>
            <Input
              placeholder="전화번호"
              value={formData.phoneNumber}
              onChange={handlePhoneChange}
            />
          </div>

          <div className="items-center gap-4">
            <div className="font-semibold mb-2">간편 비밀번호 (숫자 6자리)</div>
            <Input
              type="password"
              placeholder="숫자 6자리 입력"
              maxLength={6}
              value={formData.pin}
              onChange={(e) =>
                setFormData({ ...formData, pin: e.target.value })
              }
            />
          </div>
        </div>

        <DialogFooter className="pt-4">
          <Button variant="outline" onClick={onClose}>
            취소
          </Button>
          <Button onClick={handleSave}>저장</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
