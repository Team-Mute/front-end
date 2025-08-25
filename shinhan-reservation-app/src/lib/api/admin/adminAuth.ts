/** adminAuth.ts
 *
 * 관리자 회원가입: adminSignUpApi
 * 관리자 로그인/로그아웃: adminLoginApi/adminLogoutApi
 *
 */

import { AdminSignUpData } from "@/store/adminAuthStore";
import adminAxiosClient from "./adminAxiosClient";
import { useAdminAuthStore } from "@/store/adminAuthStore";

// 관리자 회원가입 API
export async function adminSignUpApi({
  roleId,
  regionName,
  userEmail,
  userName,
  userPhone,
}: AdminSignUpData) {
  const response = await adminAxiosClient.post("/api/admin/signup", {
    roleId,
    regionName,
    userEmail,
    userName,
    userPhone,
  });
  return response;
}

// 관리자 로그인 API
export async function adminLoginApi(email: string, password: string) {
  try {
    const response = await adminAxiosClient.post("/api/admin/auth/login", {
      email,
      password,
    });

    const { accessToken, roleId } = response.data;

    useAdminAuthStore.getState().setAdminAccessToken(accessToken);
    useAdminAuthStore.getState().setAdminRoleId(roleId);

    return response;
  } catch (error: any) {
    throw error.response || error;
  }
}

// 관리자 로그아웃 API
export async function adminLogoutApi() {
  const token = useAdminAuthStore.getState().adminAccessToken;
  try {
    await adminAxiosClient.post(
      "/api/admin/auth/logout",
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    useAdminAuthStore.getState().clearAdminAuth();
  } catch (error) {
    throw new Error("로그아웃 실패");
  }
}
