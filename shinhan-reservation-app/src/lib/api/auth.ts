import { useAuthStore } from "@/store/authStore";
import { getDeviceInfo } from "../utils/device";
import { getClientIp } from "../utils/ip";

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

// 로그인
export async function login(email: string, password: string) {
  const device = getDeviceInfo();
  const ip = await getClientIp();

  const res = await fetch(`${baseURL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      email,
      password,
      device,
      ip,
    }),
  });

  if (!res.ok) {
    throw new Error("로그인 실패");
  }

  const data = await res.json();
  useAuthStore.getState().setAccessToken(data.accessToken);
}

// 로그아웃
export async function logout() {
  const token = useAuthStore.getState().accessToken;

  const res = await fetch(`${baseURL}/api/auth/logout`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("로그아웃 실패");
  }

  useAuthStore.getState().clearAuth();
}
