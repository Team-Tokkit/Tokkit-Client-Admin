import axios from "axios";
import { getApiUrl } from "@/lib/getApiUrl";

const API_URL = getApiUrl();

export async function fetchUsers(params: { page?: number; keyword?: string }) {
  const query = new URLSearchParams();
  if (params.page !== undefined) query.append("page", params.page.toString());
  if (params.keyword) query.append("keyword", params.keyword);

  const url = `${API_URL}/admin-api/users?${query.toString()}`;
  const response = await axios.get(url);
  return response.data;
}

export async function fetchUserDetail(userId: number) {
  const url = `${API_URL}/admin-api/users/${userId}`;
  const response = await axios.get(url);
  return response.data;
}

export async function updateUser(userId: number, payload: any) {
  const url = `${API_URL}/admin-api/users/${userId}`;
  const response = await axios.put(url, payload);
  return response.data;
}

export async function updateUserStatus(userId: number, isDormant: boolean) {
  return axios.patch(`/api/users/${userId}/status`, { isDormant });
}
