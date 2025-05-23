import { JSX } from "react/jsx-runtime";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

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
  if (!data) return null;

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
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
            <div className="col-span-3">
              {getSeverityBadge?.(data.severity)}
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <div className="font-semibold">엔드포인트</div>
            <div className="col-span-3 font-mono text-sm">{data.endpoint}</div>
          </div>

          {data.errorMessage && (
            <div className="grid grid-cols-4 items-start gap-4">
              <div className="font-semibold">에러 메시지</div>
              <div className="col-span-3 text-sm text-red-600 whitespace-pre-wrap break-words overflow-auto max-h-40">
                {data.errorMessage}
              </div>
            </div>
          )}

          {data.stackTrace && (
            <div className="grid grid-cols-4 items-start gap-4">
              <div className="font-semibold">스택 트레이스</div>
              <div className="col-span-3 font-mono text-xs break-all bg-gray-50 p-2 rounded overflow-auto max-h-40">
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
