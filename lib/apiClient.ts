import axios from "axios";
import { getApiUrl } from "./getApiUrl";

const apiClient = axios.create({
  baseURL: getApiUrl(),
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("🔐 인증 실패");
    }
    return Promise.reject(error);
  }
);

export default apiClient;
