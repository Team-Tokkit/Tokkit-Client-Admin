"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RefreshCcw, Eye } from "lucide-react";
import List from "@/components/common/List";
import { fetchTransactions } from "./api/transaction-api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import TransactionDetailDialog from "@/app/transaction/componets/TransactionDetailDialog";

interface Transaction {
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

export default function TransactionPage() {
  const [transactionList, setTransactionList] = useState<Transaction[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  const fetchTransactionData = async (page = 0) => {
    try {
      const res = await fetchTransactions({
        page,
        type: selectedType !== "all" ? selectedType : undefined,
        status: selectedStatus !== "all" ? selectedStatus : undefined,
      });

      const pageData = res.result;
      setTransactionList(pageData.content);
      setTotalPages(pageData.totalPages);
      setCurrentPage(pageData.number + 1);
    } catch (err) {
      console.error("거래 목록 불러오기 실패", err);
    }
  };

  useEffect(() => {
    fetchTransactionData(currentPage - 1);
  }, [selectedType, selectedStatus]);

  const handleResetFilters = () => {
    setSelectedType("all");
    setSelectedStatus("all");
    setCurrentPage(1);
    fetchTransactionData(0);
  };

  const transactionColumns = [
    { key: "id", header: "ID", cell: (tx: Transaction) => <span>{tx.id}</span> },
    {
      key: "type",
      header: "유형",
      cell: (tx: Transaction) => (
          <Badge
              className={
                tx.type === "DEPOSIT"
                    ? "bg-blue-100 text-blue-800"
                    : tx.type === "PURCHASE"
                        ? "bg-green-100 text-green-800"
                        : tx.type === "RECEIVE"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-gray-100 text-gray-800"
              }
          >
            {tx.type}
          </Badge>
      ),
    },
    {
      key: "amount",
      header: "금액",
      cell: (tx: Transaction) => <span>{tx.amount.toLocaleString()}원</span>,
    },
    {
      key: "status",
      header: "상태",
      cell: (tx: Transaction) => (
          <Badge
              className={
                tx.status === "SUCCESS"
                    ? "bg-green-100 text-green-800"
                    : tx.status === "PENDING"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
              }
          >
            {tx.status}
          </Badge>
      ),
    },
    {
      key: "txHash",
      header: "Tx Hash",
      cell: (tx: Transaction) => <span className="break-all">{tx.txHash || "-"}</span>,
    },
    {
      key: "createdAt",
      header: "거래일시",
      cell: (tx: Transaction) => new Date(tx.createdAt).toLocaleString("ko-KR"),
    },
    {
      key: "actions",
      header: "관리",
      cell: (tx: Transaction) => (
          <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedTransaction(tx)}
          >상세
          </Button>
      ),
    },
  ];

  return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="text-2xl font-bold">거래 내역</h1>
          <div className="flex flex-col md:flex-row gap-2">
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="유형" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체 유형</SelectItem>
                <SelectItem value="DEPOSIT">입금</SelectItem>
                <SelectItem value="PURCHASE">구매</SelectItem>
                <SelectItem value="RECEIVE">수령</SelectItem>
                <SelectItem value="CONVERT">전환</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="상태" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체 상태</SelectItem>
                <SelectItem value="SUCCESS">성공</SelectItem>
                <SelectItem value="PENDING">대기</SelectItem>
                <SelectItem value="FAILURE">실패</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" className="gap-1" onClick={handleResetFilters}>
              <RefreshCcw className="h-4 w-4" /> 새로고침
            </Button>
          </div>
        </div>

        <List
            data={transactionList}
            columns={transactionColumns}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => fetchTransactionData(page - 1)}
        />

        {selectedTransaction && (
            <TransactionDetailDialog
                open={!!selectedTransaction}
                transaction={selectedTransaction}
                onClose={() => setSelectedTransaction(null)}
            />
        )}
      </div>
  );
}
