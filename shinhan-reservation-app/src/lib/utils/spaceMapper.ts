// utils/spaceMapper.ts
import { SpaceDetailPayload, SpaceRequest } from "@/types/space";

export const mapDetailToRequest = (
  detail: SpaceDetailPayload
): SpaceRequest => {
  return {
    space: {
      spaceName: detail.spaceName,
      spaceDescription: detail.spaceDescription,
      spaceCapacity: detail.spaceCapacity,
      spaceIsAvailable: detail.spaceIsAvailable,
      regionId: detail.region.regionId,
      categoryId: detail.category.categoryId,
      locationId: detail.location.locationId,
      tagNames: detail.tagNames,
      userName: detail.userName,
      reservationWay: detail.reservationWay,
      spaceRules: detail.spaceRules,
      operations: detail.operations,
      closedDays: detail.closedDays,
    },
    images: [], // 수정 시 새 파일 업로드한 것만 담고,
    // 기존 이미지는 별도로 `detailImageUrls` 같은 걸 보여주기
  };
};
