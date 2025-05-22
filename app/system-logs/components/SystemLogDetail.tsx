import { JSX } from "react/jsx-runtime";
import { useState } from "react";
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

interface LoginLog {
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

interface SystemErrorLog {
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
  type: "login" | "error";
  data: LoginLog | SystemErrorLog | null;
  onClose: () => void;
  formatDate: (date: string) => string;
  getStatusBadge?: (success: boolean) => JSX.Element;
  getSeverityBadge?: (level: string) => JSX.Element;
}

export default function SystemDetailDialog({
  open,
  type,
  data,
  onClose,
  formatDate,
  getStatusBadge,
  getSeverityBadge,
}: Props) {
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  if (!data) return null;

  const isLogin = type === "login";

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isLogin ? "로그인 로그 상세" : "시스템 에러 로그 상세"}
          </DialogTitle>
          <DialogDescription>
            {isLogin
              ? "로그인 이벤트의 상세 정보입니다."
              : "시스템 에러의 상세 정보입니다."}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <div className="font-semibold">ID</div>
            <div className="col-span-3">{data.id}</div>
          </div>

          {isLogin ? (
            <>
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-semibold">이벤트</div>
                <div className="col-span-3">
                  <Badge variant="outline">
                    {(data as LoginLog).event === "LOGIN"
                      ? "로그인"
                      : "로그아웃"}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-semibold">상태</div>
                <div className="col-span-3">
                  {getStatusBadge?.((data as LoginLog).success)}
                </div>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-semibold">사용자 ID</div>
                <div className="col-span-3">
                  {(data as LoginLog).userId || "-"}
                </div>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-semibold">판매자 ID</div>
                <div className="col-span-3">
                  {(data as LoginLog).merchantId || "-"}
                </div>
              </div>

              {(data as LoginLog).userAgent && (
                <div className="grid grid-cols-4 items-start gap-4">
                  <div className="font-semibold">사용자 에이전트</div>
                  <div className="col-span-3 text-sm break-all">
                    {(data as LoginLog).userAgent}
                  </div>
                </div>
              )}

              {(data as LoginLog).ipAddress && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <div className="font-semibold">IP 주소</div>
                  <div className="col-span-3">
                    {(data as LoginLog).ipAddress}
                  </div>
                </div>
              )}

              {(data as LoginLog).reason && (
                <div className="grid grid-cols-4 items-start gap-4">
                  <div className="font-semibold">실패 사유</div>
                  <div className="col-span-3 text-sm text-red-600">
                    {(data as LoginLog).reason}
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-semibold">심각도</div>
                <div className="col-span-3">
                  {getSeverityBadge?.((data as SystemErrorLog).severity)}
                </div>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-semibold">엔드포인트</div>
                <div className="col-span-3 font-mono text-sm">
                  {(data as SystemErrorLog).endpoint}
                </div>
              </div>

              {(data as SystemErrorLog).errorMessage && (
                <div className="grid grid-cols-4 items-start gap-4">
                  <div className="font-semibold">에러 메시지</div>
                  <div className="col-span-3 text-sm text-red-600">
                    {(data as SystemErrorLog).errorMessage}
                  </div>
                </div>
              )}

              {(data as SystemErrorLog).stackTrace && (
                <div className="grid grid-cols-4 items-start gap-4">
                  <div className="font-semibold">스택 트레이스</div>
                  <div className="col-span-3 font-mono text-xs break-all bg-gray-50 p-2 rounded overflow-auto max-h-40">
                    {(data as SystemErrorLog).stackTrace}
                  </div>
                </div>
              )}
            </>
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
