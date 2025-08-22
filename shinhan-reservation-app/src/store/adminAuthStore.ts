import { create } from "zustand";

export interface AdminSignUpData {
  roleId?: Number;
  regionName?: string;
  userEmail?: string;
  userName?: string;
  userPhone?: string;
}

interface AdminAuthState {
  // 관리자 토큰
  adminAccessToken: string | null;
  setAdminAccessToken: (token: string) => void;
  clearAdminAuth: () => void;

  // 관리자 회원가입 데이터
  adminSignUpData: AdminSignUpData | null;
  setAdminSignUpData: (data: AdminSignUpData) => void;
  clearAdminSignUpData: () => void;
}

export const useAdminAuthStore = create<AdminAuthState>((set) => ({
  adminAccessToken:
    typeof window !== "undefined"
      ? localStorage.getItem("adminAccessToken")
      : null,

  setAdminAccessToken: (token) => {
    localStorage.setItem("adminAccessToken", token); // localStorage 저장
    set({ adminAccessToken: token });
  },

  clearAdminAuth: () => {
    localStorage.removeItem("adminAccessToken"); // 로그아웃 시 제거
    set({ adminAccessToken: null });
  },

  // 회원가입 관련 초기 상태
  adminSignUpData: null,
  setAdminSignUpData: (data) => set({ adminSignUpData: data }),
  clearAdminSignUpData: () => set({ adminSignUpData: null }),
}));
