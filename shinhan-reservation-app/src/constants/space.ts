export const REGIONS = [
  { label: "지점 선택", value: "" },
  { label: "서울", value: "서울" },
  { label: "인천", value: "인천" },
  { label: "대구", value: "대구" },
  { label: "대전", value: "대전" },
];

export const CATEGORIES = [
  { label: "카테고리 선택", value: "" },
  { label: "미팅룸", value: "미팅룸" },
  { label: "행사장", value: "행사장" },
  { label: "다목적", value: "다목적" },
];

export const DEFAULT_AMENITIES = [
  "Wi-Fi",
  "화이트보드",
  "마이크",
  "TV",
  "빔프로젝터",
  "에어컨",
  "콘센트",
  "개인락커",
  "난방기",
  "인쇄기",
  "의자",
  "PC/노트북",
  "테이블",
  "라운지",
];

export const DAYS: ("월" | "화" | "수" | "목" | "금" | "토" | "일")[] = [
  "월",
  "화",
  "수",
  "목",
  "금",
  "토",
  "일",
];

export const TIME_OPTIONS: { label: string; value: string }[] = Array.from(
  { length: 48 },
  (_, i) => {
    const h = String(Math.floor(i / 2)).padStart(2, "0");
    const m = i % 2 === 0 ? "00" : "30";
    const time = `${h}:${m}`;
    return { label: time, value: time };
  }
);
