import axios from "axios";
import { getApiUrl } from "@/lib/getApiUrl";

const API_URL = getApiUrl();

export async function fetchLoginLogs(params: {
  page?: number;
  size?: number;
  keyword?: string;
  event?: string;
  success?: string;
  dateRange?: string;
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


  if (params.dateRange) query.append("dateRange", params.dateRange);

  const url = `${API_URL}/admin-api/login-logs?${query.toString()}`;
  const response = await axios.get(url);
  return response.data;
}

export async function fetchLoginLogDetail(id: number) {
  const url = `${API_URL}/admin-api/login-logs/${id}`;
  const response = await axios.get(url);
  return response.data;
}

export async function fetchErrorLogs(params: {
  page?: number;
  size?: number;
  keyword?: string;
  severity?: string;
  dateRange?: string;
}) {
  const query = new URLSearchParams();

  if (params.page !== undefined) query.append("page", params.page.toString());
  if (params.size !== undefined) query.append("size", params.size.toString());
  if (params.keyword) query.append("keyword", params.keyword);
  if (params.severity && params.severity !== "all")
    query.append("severity", params.severity);
  if (params.dateRange) query.append("dateRange", params.dateRange);

  const url = `${API_URL}/admin-api/system-error-logs?${query.toString()}`;
  const response = await axios.get(url);
  return response.data;
}

export async function fetchErrorLogDetail(id: number) {
  const url = `${API_URL}/admin-api/system-error-logs/${id}`;
  const response = await axios.get(url);
  return response.data;
}
