// src/lib/axiosClient.ts
import axios from "axios";
import { useAuthStore } from "@/store/authStore";
// import { useRouter } from "next/router";

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
// const router = useRouter();

const axiosClient = axios.create({
  baseURL: baseURL,
  //withCredentials: true, // refresh token 쿠키 포함
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

    // 토큰 만료 시 refresh 시도
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/auth/login") &&
      !originalRequest.url.includes("/users/signup") &&
      !originalRequest.url.includes("/sms/")
    ) {
      originalRequest._retry = true;

      try {
        const { data } = await axiosClient.post("/api/auth/refresh");
        useAuthStore.getState().setAccessToken(data.accessToken);
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return axiosClient(originalRequest);
      } catch (err) {
        useAuthStore.getState().clearAuth();
        // router.push("/login");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
