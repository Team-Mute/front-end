// 기업 검색 API 요청 body 타입
export interface SearchCompanyRequest {
  corpNm: string;
  pageNo: number;
}

export interface SearchCompanyResponse {
  item: string[];
  pageNo: number;
}
