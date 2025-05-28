"use client";

import {useEffect, useState} from "react";
import {format} from "date-fns";
import {Search, RefreshCcw} from "lucide-react";
import {Card} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Badge} from "@/components/ui/badge";
import {Skeleton} from "@/components/ui/skeleton";
import List from "@/components/common/List";
import Pagination from "@/components/common/Pagination";
import {UnifiedLogResponseDto} from "./types/log";
import {fetchUnifiedLogs} from "@/app/unified-logs/api/unified-logs";
import UnifiedLogDetailDialog from "./components/UnifiedLogDetailDialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import CustomDateRangePicker from "@/app/unified-logs/components/CustomDateRangePicker";

export default function UnifiedLogsPage() {
    const [logs, setLogs] = useState<UnifiedLogResponseDto[]>([]);
    const [traceId, setTraceId] = useState("");
    const [localTraceId, setLocalTraceId] = useState("");
    const [idType, setIdType] = useState("all");
    const [idValue, setIdValue] = useState("");
    const [logType, setLogType] = useState("all");
    const [dateRange, setDateRange] = useState<[Date, Date] | null>(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [selectedLog, setSelectedLog] = useState<UnifiedLogResponseDto | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);

    const from = dateRange?.[0] ? format(dateRange[0], "yyyy-MM-dd") : undefined;
    const to = dateRange?.[1] ? format(dateRange[1], "yyyy-MM-dd") : undefined;

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const result = await fetchUnifiedLogs({
                page: page - 1,
                size: 20,
                sort: "timestamp,DESC",
                traceId: traceId || undefined,
                userId: idType === "user" ? Number(idValue) : undefined,
                merchantId: idType === "merchant" ? Number(idValue) : undefined,
                logTypes: logType !== "all" ? [logType] : undefined,
                from,
                to,
            });
            setLogs(result.content);
            setTotalPages(result.totalPages);
        } catch (e) {
            console.error("통합 로그 조회 실패", e);
        }
        setLoading(false);
    };

    useEffect(() => {
            fetchLogs();
    }, [page]);

    const handleSearch = () => {
        setTraceId(localTraceId);
        setPage(1);
        fetchLogs();
    };

    const handleResetFilters = () => {
        setLocalTraceId("");
        setTraceId("");
        setIdType("all");
        setIdValue("");
        setLogType("all");
        setDateRange(null);
        setPage(1);
        fetchLogs();
    };

    const columns = [
        {
            key: "timestamp",
            header: "시간",
            cell: (log: UnifiedLogResponseDto) => (
                <span className="whitespace-nowrap text-muted-foreground">
          {format(new Date(log.timestamp), "yyyy. M. d. a h:mm:ss")}
        </span>
            ),
        },
        {
            key: "logType",
            header: "타입",
            cell: (log: UnifiedLogResponseDto) => (
                <Badge variant="outline" className="text-xs">{log.logType}</Badge>
            ),
        },
        {
            key: "traceId",
            header: "Trace ID",
            cell: (log: UnifiedLogResponseDto) => <span className="truncate">{log.traceId}</span>,
        },
        {
            key: "userId",
            header: "User ID",
            cell: (log: UnifiedLogResponseDto) => <span>{log.userId ?? "-"}</span>,
        },
        {
            key: "merchantId",
            header: "Merchant ID",
            cell: (log: UnifiedLogResponseDto) => <span>{log.merchantId ?? "-"}</span>,
        },
        {
            key: "summary",
            header: "요약",
            cell: (log: UnifiedLogResponseDto) => (
                <span
                    className="truncate max-w-[240px] block cursor-pointer hover:underline"
                    onClick={() => {
                        setSelectedLog(log);
                        setIsDetailOpen(true);
                    }}
                >
          {log.summary.length > 50 ? `${log.summary.slice(0, 50)}...` : log.summary}
        </span>
            ),
        },
        {
            key: "status",
            header: "상태",
            cell: (log: UnifiedLogResponseDto) => (
                <Badge
                    className={
                        log.statusOrSeverity === "SUCCESS" || log.statusOrSeverity === "INFO"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                    }
                >
                    {log.statusOrSeverity}
                </Badge>
            ),
        },
        {
            key: "action",
            header: "상세",
            cell: (log: UnifiedLogResponseDto) => (
                <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => {
                        setSelectedLog(log);
                        setIsDetailOpen(true);
                    }}
                >
                    상세
                </Button>
            ),
        },
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h1 className="text-2xl font-bold">통합 로그 대시보드</h1>
                <div className="flex flex-wrap gap-2 items-center">
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        handleSearch();
                    }}>
                        <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"/>
                            <Input
                                type="search"
                                placeholder="Trace ID 검색..."
                                className="pl-8 w-[200px]"
                                value={localTraceId}
                                onChange={(e) => setLocalTraceId(e.target.value)}
                            />
                        </div>
                    </form>

                    <Select value={idType} onValueChange={(v) => setIdType(v)}>
                        <SelectTrigger className="w-[140px]">
                            <SelectValue placeholder="ID 종류"/>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">유저 타입</SelectItem>
                            <SelectItem value="user">유저</SelectItem>
                            <SelectItem value="merchant">가맹점주</SelectItem>
                        </SelectContent>
                    </Select>

                    <form onSubmit={(e) => {
                        e.preventDefault();
                        handleSearch();
                    }}>
                        <Input
                            type="number"
                            placeholder="ID 입력"
                            className="w-[140px]"
                            disabled={idType === "all"}
                            value={idValue}
                            onChange={(e) => setIdValue(e.target.value)}
                        />
                    </form>

                    <Select value={logType} onValueChange={(v) => setLogType(v)}>
                        <SelectTrigger className="w-[150px]">
                            <SelectValue placeholder="로그 타입"/>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">로그 타입</SelectItem>
                            <SelectItem value="LOGIN">LOGIN</SelectItem>
                            <SelectItem value="API">API</SelectItem>
                            <SelectItem value="ERROR">ERROR</SelectItem>
                            <SelectItem value="TRANSACTION">TRANSACTION</SelectItem>
                        </SelectContent>
                    </Select>

                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline" className="w-[200px] justify-start text-left font-normal">
                                {dateRange?.[0] && dateRange?.[1]
                                    ? `${format(dateRange[0], "yyyy-MM-dd")} ~ ${format(dateRange[1], "yyyy-MM-dd")}`
                                    : "기간 선택"}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-4" align="start">
                            <CustomDateRangePicker
                                value={dateRange}
                                onChange={(range) => {
                                    setDateRange(range);
                                    setPage(1); // 👈 클릭 시 fetch 하도록 추가
                                    fetchLogs(); // 👈 달력 선택 시 바로 fetch
                                }}
                            /> </PopoverContent>
                    </Popover>

                    <Button variant="outline" className="gap-1" onClick={handleResetFilters}>
                        <RefreshCcw className="h-4 w-4"/> 새로고침
                    </Button>
                </div>
            </div>

            {loading ? (
                <Card className="p-4 space-y-2">
                    {[...Array(10)].map((_, i) => (
                        <Skeleton key={i} className="h-10 w-full rounded"/>
                    ))}
                </Card>
            ) : (
                <List
                    data={logs}
                    columns={columns}
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={setPage}
                />
            )}

            {isDetailOpen && selectedLog && (
                <UnifiedLogDetailDialog
                    open={isDetailOpen}
                    log={selectedLog}
                    onClose={() => setIsDetailOpen(false)}
                />
            )}
        </div>
    );
}