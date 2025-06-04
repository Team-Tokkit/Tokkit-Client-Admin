import apiClient from "@/lib/apiClient";

interface User {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  status: "활성" | "비활성";
  createdAt: string;
}

export async function fetchUsers(params: { page?: number; keyword?: string }) {
  const query = new URLSearchParams();
  if (params.page !== undefined) query.append("page", params.page.toString());
  if (params.keyword) query.append("keyword", params.keyword);

  const url = `/admin-api/users?${query.toString()}`;
  const response = await apiClient.get(url, {
    withCredentials: true,
  });
  return response.data;
}

export async function fetchUserDetail(userId: number): Promise<User> {
  const url = `/admin-api/users/${userId}`;
  const response = await apiClient.get(url, {
    withCredentials: true,
  });
  return response.data.result;
}

export async function updateUser(userId: number, payload: any) {
  const url = `/admin-api/users/${userId}`;
  const response = await apiClient.put(url, payload, {
    withCredentials: true,
  });
  return response.data;
}

export async function updateUserStatus(userId: number, isDormant: boolean) {
  return apiClient.patch(
    `/admin-api/users/${userId}/status`,
    { isDormant },
    {
      withCredentials: true,
    }
  );
}
