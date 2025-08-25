import { create } from "zustand";

export interface AdminSignUpData {
  roleId?: number;
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

  // 관리자 roleId
  adminRoleId: number | null;
  setAdminRoleId: (roleId: number) => void;

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

  adminRoleId:
    typeof window !== "undefined" && localStorage.getItem("adminRoleId")
      ? Number(localStorage.getItem("adminRoleId"))
      : null,

  setAdminAccessToken: (token) => {
    localStorage.setItem("adminAccessToken", token); // localStorage 저장
    set({ adminAccessToken: token });
  },

  setAdminRoleId: (roleId) => {
    localStorage.setItem("adminRoleId", roleId.toString());
    set({ adminRoleId: roleId });
  },

  clearAdminAuth: () => {
    localStorage.removeItem("adminAccessToken"); // 로그아웃 시 제거
    localStorage.removeItem("adminRoleId");
    set({ adminAccessToken: null, adminRoleId: null });
  },

  // 회원가입 관련 초기 상태
  adminSignUpData: null,
  setAdminSignUpData: (data) => set({ adminSignUpData: data }),
  clearAdminSignUpData: () => set({ adminSignUpData: null }),
}));
