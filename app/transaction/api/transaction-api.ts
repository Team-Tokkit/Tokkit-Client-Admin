import apiClient from "@/lib/apiClient";

/**
 * 거래 목록을 불러옵니다.
 * @param params page: 0부터 시작, type: DEPOSIT 등, status: PENDING 등
 */
export async function fetchTransactions(params: {
  page?: number;
  type?: string;
  status?: string;
}) {
  const query = new URLSearchParams();

  if (params.page !== undefined) query.append("page", params.page.toString());
  query.append("size", "10");

  if (params.type) query.append("type", params.type);
  if (params.status) query.append("status", params.status);

  const url = `/admin-api/transactions?${query.toString()}`;

  const response = await apiClient.get(url, {
    withCredentials: true,
  });
  return response.data;
}

export async function fetchTransactionDetail(id: number) {
  const url = `/admin-api/transactions/${id}`;
  const res = await apiClient.get(url, {
    withCredentials: true,
  });
  return res.data;
}
