import axios from "axios";
import { getApiUrl } from "./getApiUrl";
import { getCookie } from "cookies-next";
const apiClient = axios.create({
  baseURL: getApiUrl(),
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request 인터셉터 추가 - cookies-next 제거로 인해 주석 처리 또는 제거 필요
// apiClient.interceptors.request.use((config) => {
//   const token = getCookie("accessToken");
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

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
