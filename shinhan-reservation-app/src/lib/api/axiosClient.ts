// src/lib/axiosClient.ts
import axios from "axios";
import { useAuthStore } from "@/store/authStore";
import qs from "qs";

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

const axiosClient = axios.create({
  baseURL: baseURL,
  paramsSerializer: (params) => qs.stringify(params, { arrayFormat: "repeat" }),
  withCredentials: true,
});

axiosClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosClient.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    // refresh 대상이 아닌 401 → 바로 로그아웃
    if (
      error.response?.status === 401 &&
      !originalRequest.url.includes("/auth/login") &&
      !originalRequest.url.includes("/users/signup") &&
      !originalRequest.url.includes("/users/logout") &&
      !originalRequest.url.includes("/sms/") &&
      !originalRequest.url.includes("/auth/refresh") // refresh 요청 자체도 제외
    ) {
      if (!originalRequest._retry) {
        originalRequest._retry = true;

        try {
          // refresh 시도
          const { data } = await axiosClient.post("/api/auth/refresh");
          useAuthStore.getState().setAccessToken(data.accessToken);
          originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
          return axiosClient(originalRequest);
        } catch (err) {
          // refresh 실패 → 로그아웃
          useAuthStore.getState().clearAuth();
          window.location.href = "/login";
          return Promise.reject(err);
        }
      } else {
        // 이미 refresh 시도한 경우 → 그냥 로그아웃
        useAuthStore.getState().clearAuth();
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
