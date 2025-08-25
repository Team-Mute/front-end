/** adminSpace.ts
 *
 * 공간등록: createSpaceApi
 * 태그(편의시설)등록: createTagsApi
 * 공간수정: updateSpaceApi
 * 공간삭제: deleteSpaceApi
 * 공간복사: duplicateSpaceApi
 *
 * 관리자 담당 지역 조회: getManagerSpaceListApi (1차 승인자용 api)
 * 공간 전체 리스트 조회: getAllSpaceListApi (마스터, 2차 승인자만 쓰는 api)
 * 지역별 공간 리스트 조회: getRegionSpaceListApi (1차 승인자용 api)
 * 공간 단건 조회: getSpaceApi
 *
 * 태그(편의시설)조회: getTagsApi
 * 지역 리스트 조회: getRegionMenuListApi (사용자 화면에서 드롭다운 메뉴[서울, 대전 등])
 * 지역 아이디로 주소 조회: getAddressApi
 * 카테고리 리스트 조회: getCategoryListApi
 *
 */

import { SpaceRequest } from "@/types/space";
import adminAxiosClient from "./adminAxiosClient";

// 공간 등록
export async function createSpaceApi({ space, images }: SpaceRequest) {
  const formData = new FormData();

  formData.append("space", JSON.stringify(space));
  images.forEach((img) => formData.append("images", img));

  const { data } = await adminAxiosClient.post(
    "/api/spaces-admin/upload",
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );
  return data;
}

// 태그(편의시설) 등록
export async function createTagsApi(tagName: string) {
  const { data } = await adminAxiosClient.post(
    "/api/spaces-admin/tags",
    null, // body 없음
    { params: { tagName } } // ✅ 쿼리스트링 전달
  );
  return data;
}

// 공간 수정
export async function updateSpaceApi(
  spaceId: number,
  { space, images }: SpaceRequest
) {
  const formData = new FormData();
  formData.append("space", JSON.stringify(space));
  images.forEach((img) => formData.append("images", img));

  const { data } = await adminAxiosClient.put(
    `/api/spaces-admin/${spaceId}`,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );
  return data;
}

// 공간 삭제
export async function deleteSpaceApi(spaceId: number) {
  const { data } = await adminAxiosClient.delete(
    `/api/spaces-admin/${spaceId}`
  );
  return data;
}

// 공간 복사
export async function duplicateSpaceApi(spaceId: number) {
  const { data } = await adminAxiosClient.post(
    `/api/spaces-admin/copy/${spaceId}`
  );
  return data;
}

////////////

// 관리자 담당 지역 조회
export async function getManagerSpaceListApi() {
  const { data } = await adminAxiosClient.get(`/api/spaces-admin/regions`);
  return data;
}

// 공간 전체 리스트 조회
export async function getAllSpaceListApi(page: number = 1, size: number = 6) {
  const { data } = await adminAxiosClient.get("/api/spaces-admin/list", {
    params: { page, size },
  });
  return data;
}

// 지역별 공간 리스트 조회 (1차 승인자만 지역별로, 2차 승인자는 모두 나오게)
export async function getRegionSpaceListApi(regionId: number) {
  const { data } = await adminAxiosClient.get(
    `/api/spaces-admin/list/${regionId}`
  );
  return data;
}

// 공간 단건 조회
export async function getSpaceApi(spaceId: number) {
  const { data } = await adminAxiosClient.get(
    `/api/spaces-admin/detail/${spaceId}`
  );
  return data;
}

////////////

// 태그(편의시설)조회
export async function getTagsApi() {
  const { data } = await adminAxiosClient.get(`/api/spaces/tags`);
  return data;
}

// 지역 리스트 조회
export async function getRegionMenuListApi() {
  const { data } = await adminAxiosClient.get(`/api/spaces/regions`);
  return data;
}

// 지역 아이디로 주소 조회
export async function getAddressApi(regionId: number) {
  const { data } = await adminAxiosClient.get(
    `/api/spaces/locations/${regionId}`
  );
  return data;
}

// 카테고리 리스트 조회
export async function getCategoryListApi() {
  const { data } = await adminAxiosClient.get(`/api/spaces/categories`);
  return data;
}
