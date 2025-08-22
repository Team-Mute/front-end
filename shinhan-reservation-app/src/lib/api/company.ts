import axiosClient from "./axiosClient";
import { SearchCompanyRequest, SearchCompanyResponse } from "@/types/company";

// 기업 검색
export async function searchCompanyApi({
  corpNm,
  pageNo,
}: SearchCompanyRequest) {
  const response = await axiosClient.post<SearchCompanyResponse>(
    "/api/corpname",
    {
      corpNm,
      pageNo,
    }
  );
  return response; // data.item, data.pageNo
}
