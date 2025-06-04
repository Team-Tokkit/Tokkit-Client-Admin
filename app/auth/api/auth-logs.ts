<<<<<<< HEAD
import apiClient from "@/lib/apiClient";
=======
import axios from "axios";
import { getApiUrl } from "@/lib/getApiUrl";

const API_URL = getApiUrl();
>>>>>>> 4b71f2b612e0b12dfadab8957a69b2b89b60de3d

export async function fetchAuthLogs(params: {
  page?: number;
  size?: number;
  keyword?: string;
  event?: string;
  success?: string;
  dateRange?: string;
  userId?: number;
  merchantId?: number;
}) {
  const query = new URLSearchParams();

  if (params.page !== undefined) query.append("page", params.page.toString());
  if (params.size !== undefined) query.append("size", params.size.toString());
  if (params.keyword) query.append("keyword", params.keyword);

  if (params.event && params.event !== "all") {
    query.append("event", params.event);
  }

  if (params.success === "success") {
    query.append("success", "true");
  } else if (params.success === "failure") {
    query.append("success", "false");
  }

  if (params.userId !== undefined) {
    query.append("userId", params.userId.toString());
  }

  if (params.merchantId !== undefined) {
    query.append("merchantId", params.merchantId.toString());
  }

  if (params.dateRange) query.append("dateRange", params.dateRange);

<<<<<<< HEAD
  const url = `/admin-api/login-logs?${query.toString()}`;
  const response = await apiClient.get(url);
=======
  const url = `${API_URL}/admin-api/login-logs?${query.toString()}`;
  const response = await axios.get(url);
>>>>>>> 4b71f2b612e0b12dfadab8957a69b2b89b60de3d
  return response.data;
}

export async function fetchAuthLogDetail(id: number) {
<<<<<<< HEAD
  const url = `/admin-api/login-logs/${id}`;
  const response = await apiClient.get(url);
=======
  const url = `${API_URL}/admin-api/login-logs/${id}`;
  const response = await axios.get(url);
>>>>>>> 4b71f2b612e0b12dfadab8957a69b2b89b60de3d
  return response.data;
}
