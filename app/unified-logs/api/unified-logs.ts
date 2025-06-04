import apiClient from "@/lib/apiClient";
import { UnifiedLogResponseDto } from "@/app/unified-logs/types/log";

export interface FetchUnifiedLogsParams {
  page?: number;
  size?: number;
  sort?: string;
  traceId?: string;
  userId?: number;
  merchantId?: number;
  logTypes?: string[]; // LOGIN, ERROR, API, TRANSACTION
  from?: string; // yyyy-MM-dd
  to?: string; // yyyy-MM-dd
}

export async function fetchUnifiedLogs(params: FetchUnifiedLogsParams = {}) {
  const query = new URLSearchParams();

  if (params.page !== undefined) query.append("page", params.page.toString());
  if (params.size !== undefined) query.append("size", params.size.toString());
  if (params.sort) query.append("sort", params.sort);
  if (params.traceId) query.append("traceId", params.traceId);
  if (params.userId !== undefined)
    query.append("userId", params.userId.toString());
  if (params.merchantId !== undefined)
    query.append("merchantId", params.merchantId.toString());
  if (params.from) query.append("from", params.from);
  if (params.to) query.append("to", params.to);
  if (params.logTypes) {
    for (const type of params.logTypes) {
      query.append("logTypes", type);
    }
  }

  const response = await apiClient.get(
    `/admin-api/unified-logs?${query.toString()}`
  );

  return response.data.result as {
    content: UnifiedLogResponseDto[];
    totalPages: number;
    totalElements: number;
    number: number;
  };
}
