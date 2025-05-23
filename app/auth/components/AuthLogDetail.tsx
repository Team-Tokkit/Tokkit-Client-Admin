import { JSX } from "react/jsx-runtime";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

interface AuthLog {
  id: number;
  timestamp: string;
  event: "LOGIN" | "LOGOUT";
  success: boolean;
  userId?: number;
  merchantId?: number;
  ipAddress: string;
  userAgent?: string;
  traceId: string;
  reason?: string;
}

interface Props {
  open: boolean;
  type: "login";
  data: AuthLog | null;
  onClose: () => void;
  formatDate: (date: string) => string;
  getStatusBadge?: (success: boolean) => JSX.Element;
  getSeverityBadge?: (level: string) => JSX.Element;
}

export default function AuthDetailDialog({
  open,
  type,
  data,
  onClose,
  formatDate,
  getStatusBadge,
}: Props) {
  if (!data) return null;

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>로그인 로그 상세</DialogTitle>
          <DialogDescription>
            로그인 이벤트의 상세 정보입니다.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <div className="font-semibold">ID</div>
            <div className="col-span-3">{data.id}</div>
          </div>

          {data && (
            <div className="grid grid-cols-4 items-center gap-4">
              <div className="font-semibold">이벤트</div>
              <div className="col-span-3">
                <Badge
                  className={
                    data.event === "LOGIN"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-yellow-100 text-yellow-800"
                  }
                >
                  {data.event === "LOGIN" ? "로그인" : "로그아웃"}
                </Badge>
              </div>
            </div>
          )}

          <div className="grid grid-cols-4 items-center gap-4">
            <div className="font-semibold">상태</div>
            <div className="col-span-3">
              {getStatusBadge?.((data as AuthLog).success)}
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <div className="font-semibold">사용자 ID</div>
            <div className="col-span-3">{(data as AuthLog).userId || "-"}</div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <div className="font-semibold">판매자 ID</div>
            <div className="col-span-3">
              {(data as AuthLog).merchantId || "-"}
            </div>
          </div>

          {(data as AuthLog).userAgent && (
            <div className="grid grid-cols-4 items-start gap-4">
              <div className="font-semibold">사용자 에이전트</div>
              <div className="col-span-3 text-sm break-all">
                {(data as AuthLog).userAgent}
              </div>
            </div>
          )}

          {(data as AuthLog).ipAddress && (
            <div className="grid grid-cols-4 items-center gap-4">
              <div className="font-semibold">IP 주소</div>
              <div className="col-span-3">{(data as AuthLog).ipAddress}</div>
            </div>
          )}

          {(data as AuthLog).reason && (
            <div className="grid grid-cols-4 items-start gap-4">
              <div className="font-semibold">실패 사유</div>
              <div className="col-span-3 text-sm text-red-600">
                {(data as AuthLog).reason}
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
