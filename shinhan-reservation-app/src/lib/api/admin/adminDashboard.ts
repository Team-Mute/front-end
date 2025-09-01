import { DashBoardCard } from "@/types/dashBoardAdmin";
import adminAxiosClient from "./adminAxiosClient";

// 대시보드 카드 API
export const getDashboardCardApi = async (): Promise<DashBoardCard[]> => {
  const response = await adminAxiosClient.get(`/api/dashboard-admin/counts`);
  return response.data;
};

