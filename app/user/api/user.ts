import axios from "axios";
import { getApiUrl } from "@/lib/getApiUrl";

const API_URL = getApiUrl();

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

  const url = `${API_URL}/admin-api/users?${query.toString()}`;
  const response = await axios.get(url);
  return response.data;
}

export async function fetchUserDetail(userId: number): Promise<User> {
  const url = `${API_URL}/admin-api/users/${userId}`;
  const response = await axios.get(url);
  return response.data.result;
}

export async function updateUser(userId: number, payload: any) {
  const url = `${API_URL}/admin-api/users/${userId}`;
  const response = await axios.put(url, payload);
  return response.data;
}

export async function updateUserStatus(userId: number, isDormant: boolean) {
  return axios.patch(`${API_URL}/admin-api/users/${userId}/status`, {
    isDormant,
  });
}
