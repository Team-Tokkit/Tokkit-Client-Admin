import apiClient from "@/lib/apiClient";

export interface Merchant {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  businessNumber?: string;
  status: "활성" | "비활성";
  createdAt: string;
  walletId?: number;
}

export async function fetchMerchants(params: {
  page?: number;
  keyword?: string;
}) {
  const query = new URLSearchParams();
  if (params.page !== undefined) query.append("page", params.page.toString());
  if (params.keyword) query.append("keyword", params.keyword);

  const url = `/admin-api/merchants?${query.toString()}`;
  const response = await apiClient.get(url, {
    withCredentials: true,
  });
  return response.data;
}

export async function fetchMerchantDetail(
  merchantId: number
): Promise<Merchant> {
  const url = `/admin-api/merchants/${merchantId}`;
  const response = await apiClient.get(url, {
    withCredentials: true,
  });
  const data = response.data.result;

  return {
    id: data.id,
    name: data.name,
    email: data.email,
    phoneNumber: data.phoneNumber,
    businessNumber: data.businessNumber,
    status: data.isDormant ? "비활성" : "활성",
    createdAt: data.createdAt,
    walletId: data.walletId,
  };
}

export async function updateMerchant(
  merchantId: number,
  payload: { name: string; phoneNumber: string; pin?: string }
) {
  const url = `/admin-api/merchants/${merchantId}`;
  const response = await apiClient.put(url, payload, {
    withCredentials: true,
  });
  return response.data;
}

export async function updateMerchantStatus(
  merchantId: number,
  isDormant: boolean
) {
  return apiClient.patch(
    `/admin-api/merchants/${merchantId}/status`,
    { isDormant },
    { withCredentials: true }
  );
}
