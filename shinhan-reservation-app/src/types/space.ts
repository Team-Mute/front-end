export type DayCode = "월" | "화" | "수" | "목" | "금" | "토" | "일";

export interface OperatingTime {
  day: DayCode;
  start: string; // "09:00"
  end: string; // "18:00"
  isOpen: boolean;
}

export interface SpaceFormData {
  title: string;
  capacity: number | null;
  region: string;
  address: string;
  category: string;
  images: File[]; // 업로드된 원본 파일
  amenities: string[]; // 편의시설 선택 목록
  description: string;
  process: string;
  rules: string;
  active: boolean;
  operatingTimes: OperatingTime[];
  holidays: { startDate: string; endDate: string }[]; // 휴무일 구간 리스트
}
