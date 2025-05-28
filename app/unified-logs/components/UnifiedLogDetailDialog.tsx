"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { UnifiedLogResponseDto } from "../types/log";
import ErrorDetailDialog from "@/app/error-logs/components/ErrorLogDetail";
import TransactionDetailDialog from "@/app/transaction/componets/TransactionDetailDialog";
import AuthDetailDialog from "@/app/auth/components/AuthLogDetail";
import ApiLogDetailDialog from "@/app/api-logs/components/ApiLogDetail";
import { fetchErrorLogDetail } from "@/app/error-logs/api/error-logs";
import { fetchApiLogDetail } from "@/app/api-logs/api/api-logs";
import { fetchTransactionDetail } from "@/app/transaction/api/transaction-api";
import {fetchAuthLogDetail} from "@/app/auth/api/auth-logs";

interface Props {
    open: boolean;
    log: UnifiedLogResponseDto | null;
    onClose: () => void;
}

export default function UnifiedLogDetailDialog({ open, log, onClose }: Props) {
    const [detailData, setDetailData] = useState<any | null>(null);

    const formatDate = (date: string) =>
        format(new Date(date), "yyyy-MM-dd HH:mm:ss");

    const getStatusBadge = (success: boolean) => (
        <span
            className={`px-2 py-0.5 rounded text-xs font-medium ${
                success ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
            }`}
        >
      {success ? "성공" : "실패"}
    </span>
    );

    useEffect(() => {
        if (!log) return;

        const fetchDetail = async () => {
            switch (log.logType) {
                case "ERROR":
                    const error = await fetchErrorLogDetail(log.id!);
                    setDetailData(error.result);
                    break;
                case "API":
                    const api = await fetchApiLogDetail(log.id!);
                    setDetailData(api.result);
                    break;
                case "TRANSACTION":
                    const txn = await fetchTransactionDetail(log.id!);
                    setDetailData(txn.result);
                    break;
                case "LOGIN":
                    const auth = await fetchAuthLogDetail(log.id!);
                    setDetailData(auth.result);
                    break;
                default:
                    setDetailData(null);
            }
        };

        fetchDetail();
    }, [log]);

    if (!log || !detailData) return null;

    const baseProps = {
        open,
        onClose,
        formatDate,
    };

    switch (log.logType) {
        case "ERROR":
            return <ErrorDetailDialog {...baseProps} data={detailData} type="error" />;
        case "API":
            return <ApiLogDetailDialog {...baseProps} log={detailData} />;
        case "TRANSACTION":
            return <TransactionDetailDialog {...baseProps} transaction={detailData} />;
        case "LOGIN":
            return (
                <AuthDetailDialog
                    {...baseProps}
                    data={detailData}
                    getStatusBadge={getStatusBadge}
                    type="login"
                />
            );
        default:
            return null;
    }
}
