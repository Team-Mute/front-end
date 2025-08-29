// app/spaces/[spaceId]/page.tsx
"use client";

import { useParams } from "next/navigation";
import { useFilterStore } from "@/store/filterStore";

export default function SpaceDetailPage() {
  const { spaceId } = useParams<{ spaceId: string }>();
  const {
    regionId,
    categoryId,
    capacity,
    startDate,
    endDate,
    time,
    facilities,
    hasGptSearch,
  } = useFilterStore();

  return (
    <div>
      <h1>공간 상세 페이지 - {spaceId}</h1>

      <div>
        <h2>GPT 검색으로 채워진 필터값</h2>
        <p>지역: {regionId}</p>
        <p>카테고리: {categoryId}</p>
        <p>인원: {capacity}</p>
        <p>시작일: {startDate?.toString()}</p>
        <p>종료일: {endDate?.toString()}</p>
        <p>
          시간: {time?.start} ~ {time?.end}
        </p>
        <p>편의시설: {facilities.join(", ")}</p>
      </div>

      {/* ✅ 여기서 예약 폼 컴포넌트 추가 */}
    </div>
  );
}
