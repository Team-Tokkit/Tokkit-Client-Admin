"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {JSX} from "react/jsx-runtime";

interface ErrorLog {
  id: number;
  timestamp: string;
  endpoint: string;
  severity: "INFO" | "WARN" | "ERROR" | "FATAL";
  errorMessage?: string;
  stackTrace?: string;
  serverName?: string;
  ipAddress: string;
  userId?: number;
  traceId: string;
}

interface Props {
  open: boolean;
  type: "error";
  data: ErrorLog | null;
  onClose: () => void;
  formatDate: (date: string) => string;
  getSeverityBadge?: (level: string) => JSX.Element;
}

export default function ErrorDetailDialog({
                                            open,
                                            type,
                                            data,
                                            onClose,
                                            formatDate,
                                            getSeverityBadge,
                                          }: Props) {
  const [copied, setCopied] = useState(false);

  if (!data) return null;

  const handleCopy = () => {
    if (data.stackTrace) {
      navigator.clipboard.writeText(data.stackTrace).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      });
    }
  };

  return (
      <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="w-[900px] max-w-full">
          <DialogHeader>
            <DialogTitle>시스템 에러 로그 상세</DialogTitle>
            <DialogDescription>시스템 에러의 상세 정보입니다.</DialogDescription>
          </DialogHeader>

          <div className="py-4 space-y-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <div className="font-semibold">ID</div>
              <div className="col-span-3">{data.id}</div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <div className="font-semibold">심각도</div>
              <div className="col-span-3">{getSeverityBadge?.(data.severity)}</div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <div className="font-semibold">엔드포인트</div>
              <div className="col-span-3 font-mono text-sm">{data.endpoint}</div>
            </div>

            {data.errorMessage && (
                <div className="grid grid-cols-4 items-start gap-4">
                  <div className="font-semibold">에러 메시지</div>
                  <div className="col-span-3 text-sm text-red-600 whitespace-pre-wrap break-words">
                    {data.errorMessage}
                  </div>
                </div>
            )}

            {data.stackTrace && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">스택 트레이스</span>
                    <div className="flex items-center gap-2">
                      {copied && <span className="text-green-600 text-sm">복사 완료</span>}
                      <Button variant="ghost" size="sm" onClick={handleCopy}>
                        복사
                      </Button>
                    </div>
                  </div>
                  <div className="font-mono text-xs break-all bg-gray-50 p-3 rounded overflow-auto max-h-[400px] whitespace-pre-wrap">
                    {data.stackTrace}
                  </div>
                </div>
            )}

            <div className="grid grid-cols-4 items-center gap-4">
              <div className="font-semibold">추적 ID</div>
              <div className="col-span-3 font-mono text-sm">{data.traceId}</div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <div className="font-semibold">시간</div>
              <div className="col-span-3">{formatDate(data.timestamp)}</div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={onClose}>
              닫기
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
  );
}
