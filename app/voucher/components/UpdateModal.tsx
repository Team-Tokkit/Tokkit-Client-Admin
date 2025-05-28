import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { Voucher } from "@/app/voucher/types/Voucher";

interface UpdateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  voucher: Voucher | null;
  onSubmit: (form: { description: string; detailDescription: string; price: string; contact: string }) => void;
}

export default function UpdateModal({
  open,
  onOpenChange,
  voucher,
  onSubmit,
}: UpdateModalProps) {
  const [form, setForm] = useState({
    description: "",
    detailDescription: "",
    price: "",
    contact: "",
  });

  const [initialForm, setInitialForm] = useState(form);

  // 모달 열릴 때 상태 초기화
  useEffect(() => {
    if (voucher && open) {
      const defaultForm = {
        description: "",
        detailDescription: "",
        price: voucher.price?.toString() ?? "",
        contact: voucher.contact ?? "",
      };
      setForm(defaultForm);
      setInitialForm(defaultForm);
    }
  }, [voucher, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    onSubmit(form);
  };

  const isDirty = JSON.stringify(form) !== JSON.stringify(initialForm);

  const handleClose = (nextOpen: boolean) => {
    if (!nextOpen && isDirty) {
      const confirmClose = window.confirm("수정된 내용이 저장되지 않았습니다. 그래도 닫으시겠습니까?");
      if (!confirmClose) return;
    }
    onOpenChange(nextOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>바우처 수정</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">바우처 설명</label>
            <Input
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="수정할 바우처 설명을 입력하세요."
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">상세 설명</label>
            <Input
              name="detailDescription"
              value={form.detailDescription}
              onChange={handleChange}
              placeholder="수정할 상세 설명을 입력하세요."
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">할인가</label>
            <Input
              name="price"
              type="number"
              value={form.price}
              onChange={handleChange}
              placeholder="수정할 가격을 입력하세요."
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">문의 연락처</label>
            <Input
              name="contact"
              value={form.contact}
              onChange={handleChange}
              placeholder="수정할 문의처를 입력하세요."
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">취소</Button>
          </DialogClose>
          <Button onClick={handleSubmit} className="bg-primary text-white">
            저장
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
