import apiClient from "@/lib/apiClient";

// 🔐 로그인 요청
export async function loginAdmin(email: string, password: string) {
  const response = await apiClient.post("/admin-api/login", {
    email,
    password,
  });
  return response.data;
}

// 🔓 로그아웃 요청
export async function logoutAdmin() {
  const response = await apiClient.post("/admin-api/logout");
  return response.data;
}
