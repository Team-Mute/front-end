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

// 공간 검색 요청 타입
export interface SearchSpaceRequest {
  regionId: number | null; // 서울 1, 인천 2, 대구 3, 대전 4
  categoryId: number | null; // 미팅룸 1, 행사장 2
  people: number | null; // 수용 인원
  tagNames: string[]; // 편의시설 이름 배열
  startDate: string | null; // ISO8601 (예: 2025-08-26T05:43:24.100Z)
  endDate: string | null;
}

export interface User {
  id: string;
  location?: number; // 로그인한 사용자의 지역 ID (regionId와 동일 규칙)
}
