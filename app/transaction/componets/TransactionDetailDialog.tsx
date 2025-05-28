"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { fetchTransactionDetail } from "../api/transaction-api"; // API 연결 필요

export interface Transaction {
    id: number;
    type: string;
    amount: number;
    status: string;
    txHash: string;
    createdAt: string;
    description?: string;
    traceId?: string;
    walletId?: number;
    failureReason?: string;
}

interface Props {
    open: boolean;
    transaction: { id: number } | null; // 전달되는 초기 ID만 필요
    onClose: () => void;
}

export default function TransactionDetailDialog({ open, transaction, onClose }: Props) {
    const [detail, setDetail] = useState<Transaction | null>(null);

    useEffect(() => {
        if (open && transaction?.id) {
            fetchTransactionDetail(transaction.id)
                .then((res) => setDetail(res.result))
                .catch((err) => {
                    console.error("거래 상세 조회 실패", err);
                    setDetail(null);
                });
        }
    }, [open, transaction]);

    if (!detail) return null;

    const badgeColor = {
        SUCCESS: "bg-green-100 text-green-800",
        FAILED: "bg-red-100 text-red-800",
        PENDING: "bg-yellow-100 text-yellow-800",
    }[detail.status] || "bg-gray-100 text-gray-800";

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>거래 상세 정보</DialogTitle>
                </DialogHeader>

                <div className="py-4 space-y-4 text-sm">
                    <div className="grid grid-cols-4 gap-4">
                        <div className="font-semibold">ID</div>
                        <div className="col-span-3">{detail.id}</div>

                        <div className="font-semibold">유형</div>
                        <div className="col-span-3">{detail.type}</div>

                        <div className="font-semibold">상태</div>
                        <div className="col-span-3">
                            <Badge className={badgeColor}>{detail.status}</Badge>
                        </div>

                        <div className="font-semibold">금액</div>
                        <div className="col-span-3">{detail.amount.toLocaleString()}원</div>

                        <div className="font-semibold">Tx Hash</div>
                        <div className="col-span-3 break-all font-mono">{detail.txHash || "-"}</div>

                        <div className="font-semibold">지갑 ID</div>
                        <div className="col-span-3">{detail.walletId ?? "-"}</div>

                        <div className="font-semibold">설명</div>
                        <div className="col-span-3">{detail.description || "-"}</div>

                        <div className="font-semibold">실패 사유</div>
                        <div className="col-span-3 text-red-600">{detail.failureReason || "-"}</div>

                        <div className="font-semibold">Trace ID</div>
                        <div className="col-span-3 font-mono text-sm">{detail.traceId || "-"}</div>

                        <div className="font-semibold">생성일시</div>
                        <div className="col-span-3">
                            {new Date(detail.createdAt).toLocaleString("ko-KR")}
                        </div>
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
