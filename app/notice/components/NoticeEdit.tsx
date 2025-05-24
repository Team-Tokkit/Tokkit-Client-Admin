"use client";

import { useState, useEffect, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface NoticeEditDialogProps {
  notice: any;
  isNew?: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (notice: any) => void;
}

export function NoticeEditDialog({
  notice,
  isNew = false,
  open,
  onOpenChange,
  onSave,
}: NoticeEditDialogProps) {
  const [formData, setFormData] = useState({
    id: "",
    title: "",
    content: "",
    author: "",
  });

  const [errors, setErrors] = useState({
    title: "",
    content: "",
  });

  useEffect(() => {
    if (notice) {
      setFormData({
        id: notice.id || "",
        title: notice.title || "",
        content: notice.content || "",
        author: notice.author || "관리자",
      });
    }
  }, [notice]);

  const validateForm = () => {
    let valid = true;
    const newErrors = { title: "", content: "" };

    if (!formData.title.trim()) {
      newErrors.title = "제목을 입력해주세요.";
      valid = false;
    } else if (formData.title.length > 100) {
      newErrors.title = "제목은 100자 이내로 입력해주세요.";
      valid = false;
    }

    if (!formData.content.trim()) {
      newErrors.content = "내용을 입력해주세요.";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSave(formData);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{isNew ? "공지사항 등록" : "공지사항 수정"}</DialogTitle>
          <DialogDescription>
            {isNew
              ? "새로운 공지사항을 등록합니다."
              : "공지사항 정보를 수정합니다."}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">제목</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="공지사항 제목을 입력하세요"
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="content">내용</Label>
            <Textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="공지사항 내용을 입력하세요"
              rows={8}
            />
            {errors.content && (
              <p className="text-sm text-red-500">{errors.content}</p>
            )}
          </div>
        </div>
        <DialogFooter className="flex space-x-2 justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            취소
          </Button>
          <Button onClick={handleSubmit}>{isNew ? "등록" : "저장"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
