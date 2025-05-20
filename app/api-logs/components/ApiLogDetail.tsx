"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ApiRequestLog } from "../page";

interface ApiLogDetailDialogProps {
  open: boolean;
  log: ApiRequestLog | null;
  onClose: () => void;
  formatDate: (date: string) => string;
  getStatusBadge?: (code: number) => JSX.Element;
}

export default function ApiLogDetailDialog({
  open,
  log,
  onClose,
  formatDate,
  getStatusBadge,
}: ApiLogDetailDialogProps) {
  if (!log) return null;

  const getMethodColor = (method: string) => {
    switch (method.toUpperCase()) {
      case "GET":
        return "bg-blue-100 text-blue-800";
      case "POST":
        return "bg-green-100 text-green-800";
      case "PUT":
        return "bg-yellow-100 text-yellow-800";
      case "DELETE":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>API 요청 로그 상세</DialogTitle>
          <DialogDescription>API 요청의 상세 정보입니다.</DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <div className="font-semibold">ID</div>
            <div className="col-span-3">{log.id}</div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <div className="font-semibold">엔드포인트</div>
            <div className="col-span-3 font-mono text-sm">{log.endpoint}</div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <div className="font-semibold">메서드</div>
            <div className="col-span-3">
              <Badge className={getMethodColor(log.method)}>{log.method}</Badge>
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <div className="font-semibold">상태 코드</div>
            <div className="col-span-3">
              {getStatusBadge
                ? getStatusBadge(log.responseStatus)
                : log.responseStatus}
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <div className="font-semibold">응답 시간</div>
            <div className="col-span-3">{log.responseTime}ms</div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <div className="font-semibold">IP 주소</div>
            <div className="col-span-3">{log.ipAddress}</div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <div className="font-semibold">사용자 ID</div>
            <div className="col-span-3">{log.userId}</div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <div className="font-semibold">추적 ID</div>
            <div className="col-span-3 font-mono text-sm">{log.traceId}</div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <div className="font-semibold">시간</div>
            <div className="col-span-3">{formatDate(log.timestamp)}</div>
          </div>
          {log.queryParams && (
            <div className="grid grid-cols-4 items-start gap-4">
              <div className="font-semibold">쿼리 파라미터</div>
              <div className="col-span-3 font-mono text-sm break-all bg-gray-50 p-2 rounded">
                {log.queryParams}
              </div>
            </div>
          )}
          {log.requestBody && (
            <div className="grid grid-cols-4 items-start gap-4">
              <div className="font-semibold">요청 본문</div>
              <div className="col-span-3 font-mono text-sm break-all bg-gray-50 p-2 rounded">
                {log.requestBody}
              </div>
            </div>
          )}
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
