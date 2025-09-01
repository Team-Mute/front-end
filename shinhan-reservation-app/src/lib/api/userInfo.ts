import { UserInfoPayload } from "@/types/user";
import axiosClient from "./axiosClient";

// 예약 단건 조회
export async function getUserInfoApi() {
  const { data } = await axiosClient.get(`/api/users/account`);
  return data;
}