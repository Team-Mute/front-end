/** userAuth.ts
 *
 * 사용자 회원가입: signUpApi
 * 사용자 인증번호 전송/인증번호 확인: sendCodeApi/verifyCodeApi
 * 사용자 로그인/로그아웃: loginApi/logoutApi
 *
 */

import { useAuthStore } from "@/store/authStore";
import { getDeviceInfo } from "../utils/device";
import { getClientIp } from "../utils/ip";
import { SignUpData } from "@/store/authStore";
import axiosClient from "./axiosClient";

// 회원가입 API
export async function signUpApi({
  userName,
  userPhone,
  userEmail,
  userPwd,
  companyName,
  agreeEmail,
  agreeSms,
  agreeLocation,
}: SignUpData) {
  const response = await axiosClient.post("/api/users/signup", {
    userName,
    userPhone,
    userEmail,
    userPwd,
    companyName,
    agreeEmail,
    agreeSms,
    agreeLocation,
  });
  return response;
}

// 인증번호 발송 API
export async function sendCodeApi(phoneNumber: string, countryCode: string) {
  const response = await axiosClient.post("/api/sms/send", {
    phoneNumber,
    countryCode,
  });
  return response;
}

// 인증번호 확인 API
export async function verifyCodeApi(
  phoneNumber: string,
  verificationCode: string
) {
  const response = await axiosClient.post("/api/sms/verify", {
    phoneNumber,
    verificationCode,
  });
  return response;
}

// 로그인 API
export async function loginApi(email: string, password: string) {
  const device = getDeviceInfo();
  const ip = await getClientIp();

  try {
    const response = await axiosClient.post("/api/auth/login", {
      email,
      password,
      device,
      ip,
    });

    useAuthStore.getState().setAccessToken(response.data.accessToken);
    return response;
  } catch (error: any) {
    // axios는 자동으로 error.response를 넘겨줌
    throw error.response || error;
  }
}

// 로그아웃 API
export async function logoutApi() {
  const token = useAuthStore.getState().accessToken;
  try {
    await axiosClient.post(
      "/api/auth/logout",
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    useAuthStore.getState().clearAuth();
  } catch (error) {
    throw new Error("로그아웃 실패");
  }
}
