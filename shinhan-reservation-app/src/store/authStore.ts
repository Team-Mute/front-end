/** authStore.ts
 * 사용자 인증 관련 store
 *
 * 회원가입 : SignUpData
 * 토큰
 * 관리자 로그인/로그아웃: adminLoginApi/adminLogoutApi
 *
 */

import { create } from "zustand";

export interface SignUpData {
  userName?: string;
  userPhone?: string;
  userEmail?: string;
  userPwd?: string;
  companyName?: string;
  agreeEmail?: boolean;
  agreeSms?: boolean;
  agreeLocation?: boolean;
}

interface AuthState {
  // 사용자 토큰
  accessToken: string | null;
  setAccessToken: (token: string) => void;
  clearAuth: () => void;

  // 사용자 회원가입 데이터
  signUpData: SignUpData | null;
  setSignUpData: (data: SignUpData) => void;
  clearSignUpData: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken:
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null,
  setAccessToken: (token) => {
    localStorage.setItem("accessToken", token); // localStorage에 저장
    set({ accessToken: token });
  },
  clearAuth: () => {
    localStorage.removeItem("accessToken"); // 로그아웃 시 제거
    set({ accessToken: null });
  },

  // 회원가입 관련 초기 상태
  signUpData: null,
  setSignUpData: (data) => set({ signUpData: data }),
  clearSignUpData: () => set({ signUpData: null }),
}));
