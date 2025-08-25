// src/lib/adminAxiosClient.ts
import axios from "axios";
import { useAdminAuthStore } from "@/store/adminAuthStore";

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

const adminAxiosClient = axios.create({
  baseURL: baseURL,
});

adminAxiosClient.interceptors.request.use((config) => {
  const token = useAdminAuthStore.getState().adminAccessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

adminAxiosClient.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    // 토큰 만료 → refresh 시도
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/admin/auth/login") &&
      !originalRequest.url.includes("/admin/signup") &&
      !originalRequest.url.includes("/admin/auth/refresh") // ✅ refresh 요청은 재시도 금지
    ) {
      originalRequest._retry = true;

      try {
        const { data } = await adminAxiosClient.post("/api/admin/auth/refresh");

        useAdminAuthStore.getState().setAdminAccessToken(data.accessToken);

        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return adminAxiosClient(originalRequest);
      } catch (err) {
        useAdminAuthStore.getState().clearAdminAuth();
        window.location.href = "/admin/login"; // 관리자 로그인 페이지로 리다이렉트
        return Promise.reject(err); // interceptor 종료
      }
    }
    return Promise.reject(error);
  }
);

export default adminAxiosClient;
