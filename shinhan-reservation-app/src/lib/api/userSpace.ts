/** userSpace.ts : 사용자 공간 검색 관련 API 명세
 *
 * 공간 리스트 조회: getSpaceListApi
 * 공간 단건 조회: getDetailSpaceApi
 */

import axiosClient from "./axiosClient";

// 공간 리스트 조회 (TODO: 이후에 startDate, endDate 날짜 추가 필요!!)
export async function getSpaceListApi(
  regionId?: number,
  categoryId?: number,
  people?: number,
  tagNames?: string[]
) {
  const { data } = await axiosClient.get("/api/spaces-user", {
    params: { regionId, categoryId, people, tagNames },
  });
  return data;
}

// 공간 단건 조회
export async function getDetailSpaceApi(spaceId: number) {
  const { data } = await axiosClient.get(`/api/spaces-user/detail/${spaceId}`);
  return data;
}
