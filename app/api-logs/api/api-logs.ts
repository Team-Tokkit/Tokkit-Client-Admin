import apiClient from "@/lib/apiClient";

export async function fetchApiLogs(params: {
  page?: number;
  size?: number;
  keyword?: string;
  method?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
}) {
  const query = new URLSearchParams();

  if (params.page) query.append("page", params.page.toString());
  if (params.size) query.append("size", params.size.toString());

  if (params.keyword?.trim()) query.append("keyword", params.keyword.trim());
  if (params.method && params.method !== "all")
    query.append("method", params.method);

  if (params.status && params.status !== "all")
    query.append("status", params.status);

  query.append("startDate", params.startDate ?? "2000-01-01");
  query.append(
    "endDate",
    params.endDate ?? new Date().toISOString().slice(0, 10)
  );

  const url = `/admin-api/logs/api-requests?${query.toString()}`;
  const response = await apiClient.get(url);
  return response.data;
}

export async function fetchChartData(params: {
  method?: string;
  status?: string;
  statusList?: string[];
  keyword?: string;
  startDate: string;
  endDate: string;
}) {
  const query = new URLSearchParams();

  query.append("startDate", params.startDate);
  query.append("endDate", params.endDate);

  if (params.method) query.append("method", params.method);
  if (params.status) query.append("status", params.status);
  if (params.statusList && Array.isArray(params.statusList)) {
    params.statusList.forEach((s) => query.append("statusList", s));
  }
  if (params.keyword) query.append("keyword", params.keyword);

  const url = `/admin-api/logs/api-requests/chart?${query.toString()}`;
  const response = await apiClient.get(url);
  return response.data;
}

export async function fetchApiLogDetail(id: number) {
  const url = `/admin-api/logs/api-requests/${id}`;
  const response = await apiClient.get(url);
  return response.data;
}
