export interface ClosedDay {
  from: string; // ISO string
  to: string;
}

export interface Operation {
  day: number; // 1 ~ 7
  from: string; // HH:mm
  to: string;
  isOpen: boolean;
}

// 공간 등록/수정 타입
export interface SpacePayload {
  spaceName: string;
  spaceDescription: string;
  spaceCapacity: number;
  spaceIsAvailable: boolean;
  regionId: number;
  categoryId: number;
  locationId: number;
  tagNames: string[];
  userName: string;
  reservationWay: string;
  spaceRules: string;
  operations: Operation[];
  closedDays: ClosedDay[];
}

export interface SpaceRequest {
  space: SpacePayload;
  images: File[];
}

// 공간 상세 조회 타입
export interface SpaceDetailPayload {
  spaceId: number;
  spaceName: string;
  region: { regionId: number; regionName: string };
  category: { categoryId: number; categoryName: string };
  location: { locationId: number; addressRoad: string };
  userName: string;
  spaceCapacity: number;
  spaceDescription: string;
  spaceImageUrl: string;
  detailImageUrls: string[];
  tagNames: string[];
  spaceIsAvailable: boolean;
  reservationWay: string;
  spaceRules: string;
  operations: Operation[];
  closedDays: ClosedDay[];
  regDate: string;
  updDate: string | null;
}
