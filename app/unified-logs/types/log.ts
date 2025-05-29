export interface UnifiedLogResponseDto {
    id: number;
    logType: string;
    traceId: string;
    userId?: number;
    merchantId?: number;
    timestamp: string;
    summary: string;
    detail: string;
    statusOrSeverity: string;
}
