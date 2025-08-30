// app/spaces/[spaceId]/page.tsx
"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";

import { useParams } from "next/navigation";
import { useFilterStore } from "@/store/filterStore";
import styled from "@emotion/styled";
import { getDetailSpaceApi } from "@/lib/api/userSpace";
import Loading from "@/components/common/Loading";
import colors from "@/styles/theme";
import { SpaceDetailPayload } from "@/types/space";
import Tabs from "@/app/admin/space/components/SpaceFormModal/Tabs";
import SpaceDetailTabs from "./components/SpaceDetailTabs";

export default function SpaceDetailPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [spaceDetail, setSpaceDetail] = useState<SpaceDetailPayload | null>(
    null
  );

  const [activeTab, setActiveTab] = React.useState<"space" | "time">("space");

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const res = await getDetailSpaceApi(Number(spaceId));
        setSpaceDetail(res); // 응답 전체 저장
      } catch (err) {
        console.error("🚨 API 호출 에러:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (spaceId) {
      fetchData();
    }
  }, [spaceId]);

  return (
    <DetailWrapper>
      <Loading isLoading={isLoading} />
      <ImageWrapper>
        <MainImg src={spaceDetail?.spaceImageUrl} alt="main image" />
        <SubImages>
          {Array.from({ length: 4 }).map((_, idx) => {
            const url = spaceDetail?.detailImageUrls[idx];
            return url ? (
              <SubImg key={idx} src={url} alt={`detail image ${idx + 1}`} />
            ) : (
              <EmptyBox key={idx} />
            );
          })}
        </SubImages>
      </ImageWrapper>
      <InfoWrapper>
        <SpaceInfo>
          <SpaceSimpleInfoWrapper>
            <SpaceTitle>{spaceDetail?.spaceName}</SpaceTitle>
            <SpaceAccessInfo>
              {spaceDetail?.location.addressRoad.split(" - ")[1]?.trim()}
            </SpaceAccessInfo>
            <TagsInfo>
              {spaceDetail?.tagNames.map((tag, idx) => (
                <Tag key={idx}>{tag}</Tag>
              ))}
            </TagsInfo>
          </SpaceSimpleInfoWrapper>
          <SpaceDetailWrapper>
            <SpaceDetailTabs spaceDetail={spaceDetail} />
          </SpaceDetailWrapper>
        </SpaceInfo>
        <ReservationInfo>
          <RTitle>예약 정보</RTitle>
          <RInfoWrapper>
            <SubTitle>이용공간</SubTitle>
            <Value>{spaceDetail?.spaceName}</Value>
          </RInfoWrapper>
          <RInfoWrapper>
            <SubTitle>이용날짜</SubTitle>
            <Value> {startDate?.toString()}</Value>
          </RInfoWrapper>
          <RInfoWrapper>
            <SubTitle>이용시간</SubTitle>
            <Value>
              {time?.start} ~ {time?.end}
            </Value>
          </RInfoWrapper>
          <RInfoWrapper>
            <SubTitle>이용인원</SubTitle>
            <Value>{capacity}</Value>
          </RInfoWrapper>
        </ReservationInfo>
      </InfoWrapper>
    </DetailWrapper>

    // <div>
    //   <h1>공간 상세 페이지 - {spaceId}</h1>

    //   <div>
    //     <h2>GPT 검색으로 채워진 필터값</h2>
    //     <p>지역: {regionId}</p>
    //     <p>카테고리: {categoryId}</p>
    //     <p>인원: {capacity}</p>
    //     <p>시작일: {startDate?.toString()}</p>
    //     <p>종료일: {endDate?.toString()}</p>
    //     <p>
    //       시간: {time?.start} ~ {time?.end}
    //     </p>
    //     <p>편의시설: {facilities.join(", ")}</p>
    //   </div>

    //   {/* ✅ 여기서 예약 폼 컴포넌트 추가 */}
    // </div>
  );
}

const DetailWrapper = styled.div`
  display: flex;
  flex-direction: column;

  padding: 0 10.56rem;

  background-color: pink;

  @media (max-width: 1040px) {
    padding: 0 5%;
  }
`;

const ImageWrapper = styled.div`
  background-color: yellow;
  display: grid;
  grid-template-columns: 1fr 1fr; /* 왼쪽은 넓게, 오른쪽은 좁게 */
  gap: 1rem;
  width: 33.6rem
  height: 26.25rem
`;

const MainImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 0.625rem;
`;

const SubImages = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 1rem;
`;

const SubImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 0.625rem;
`;

const EmptyBox = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 0.625rem;
  background-color: #e0e0e0; /* 연한 회색 */
`;

const InfoWrapper = styled.div`
  margin-top: 2rem;
  background-color: blue;
  display: flex;
  justify-content: space-between;
  gap: 3.91rem;
`;

const SpaceInfo = styled.div`
  background-color: green;
  width: 100%;

  display: flex;
  flex-direction: column;
  gap: 3.5rem;
`;

const ReservationInfo = styled.div`
  background-color: white;
  border-radius: 0.75rem;
  border: 1px solid ${colors.graycolor5};
  width: 100%;

  padding: 1.25rem;

  display: flex;
  flex-direction: column;
`;

const RTitle = styled.div`
  font-size: 1.25rem;
  font-style: normal;
  font-weight: 600;
  line-height: 2rem;
`;

const RInfoWrapper = styled.div`
  display: flex;
  flex-direction: column;

  padding: 1rem 0;
  background-color: purple;
  gap: 1rem;
`;

const SubTitle = styled.span`
  color: rgba(0, 0, 0, 0.5);

  font-family: Pretendard;
  font-size: 1rem;
  font-style: normal;
  font-weight: 500;
  line-height: normal;0
`;

const Value = styled.span`
  font-family: Pretendard;
  font-size: 1rem;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
`;

const SpaceSimpleInfoWrapper = styled.div`
  display: flex;
  flex-direction: column;

  background-color: yellow;
`;

const SpaceTitle = styled.span`
  color: ${colors.graycolor100};
  font-family: Pretendard;
  font-size: 1.5rem;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
`;

const SpaceAccessInfo = styled.span`
  font-family: Pretendard;
  font-size: 1rem;
  font-style: normal;
  font-weight: 500;
  line-height: normal;

  margin-top: 0.5rem;
`;

const TagsInfo = styled.div`
  margin-top: 1.25rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const Tag = styled.div`
  border-radius: 1.25rem;
  background-color: ${colors.maincolor5};
  color: ${colors.maincolor};
  padding: 0.25rem 0.75rem;

  font-family: Pretendard;
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1.25rem;
`;

const SpaceDetailWrapper = styled.div`
  display: flex;
  flex-direction: column;

  background-color: purple;
`;
