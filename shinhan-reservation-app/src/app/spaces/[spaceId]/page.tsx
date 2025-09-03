// app/spaces/[spaceId]/page.tsx
"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useFilterStore } from "@/store/filterStore";
import styled from "@emotion/styled";
import { getDetailSpaceApi } from "@/lib/api/userSpace";
import Loading from "@/components/common/Loading";
import colors from "@/styles/theme";
import { SpaceDetailPayload } from "@/types/space";
import SpaceDetailTabs from "./components/SpaceDetailTabs";
import Calendar from "@/components/Calendar";
import SelectBox2 from "@/components/common/selectbox/Selectbox2";
import CapacitySelect from "@/components/dropdownModal/CapacitySelect";
import { useReservationStore } from "@/store/reservationStore";
import { getAvailableDatesApi } from "@/lib/api/reservation";
import { useReservationTimes } from "@/hooks/useReservationTimes";
import Button from "@/components/common/button/Button";
import InfoModal from "@/components/modal/InfoModal";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import axiosClient from "@/lib/api/axiosClient";

export default function SpaceDetailPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [spaceDetail, setSpaceDetail] = useState<SpaceDetailPayload | null>(
    null
  );

  // 안내 모달
  const [infoTitle, setInfoTitle] = useState("");
  const [infoContents, setInfoContents] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [activeTab, setActiveTab] = React.useState<"space" | "time">("space");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();

  const { spaceId } = useParams<{ spaceId: string }>();

  const filterStore = useFilterStore();
  const reservationStore = useReservationStore();
  const { setReservation } = useReservationStore();

  const [availableDates, setAvailableDates] = useState<number[]>([]);

  const baseDate = reservationStore.startDate || new Date();
  const year = baseDate.getFullYear();
  const month = baseDate.getMonth() + 1;
  const day = baseDate.getDate();

  const {
    reservationTime,
    startTimeOptions,
    endTimeOptions,
    handleSelectTime,
  } = useReservationTimes({
    spaceId: Number(spaceId),
    year,
    month,
    day,
    startDate: reservationStore.startDate?.toISOString() ?? null,
  });

  // ✅ 페이지 진입 시 reservationStore 초기화
  useEffect(() => {
    if (!spaceId) return;

    setReservation({
      regionId: filterStore.regionId,
      categoryId: filterStore.categoryId,
      capacity: filterStore.capacity ?? 1,
      startDate: filterStore.startDate,
      endDate: filterStore.endDate,
      time: filterStore.time,
      facilities: filterStore.facilities,
      hasGptSearch: filterStore.hasGptSearch,
    });

    // startDate가 있다면 캘린더와 이용 가능한 시간 세팅
    // startDate가 있다면 selectedDate만 세팅
    if (filterStore.startDate) {
      setSelectedDate(filterStore.startDate);
    }
  }, [spaceId]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const res = await getDetailSpaceApi(Number(spaceId));
        setSpaceDetail(res); // 응답 전체 저장

        // 예약 확인 페이지에서 쓰일 데이터
        setReservation({
          spaceImageUrl: res.spaceImageUrl,
          spaceName: res.spaceName,
          spaceId: res.spaceId,
        });

        console.log("공간 디테일 정보", res);
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

  // ✅ 예약 가능 날짜 조회
  useEffect(() => {
    if (!spaceId) return;
    const baseDate = reservationStore.startDate || new Date();
    const year = baseDate.getFullYear();
    const month = baseDate.getMonth() + 1;

    getAvailableDatesApi(Number(spaceId), year, month)
      .then((res) => setAvailableDates(res.availableDays))
      .catch((err) => console.error(err));

    console.log("이용 가능일", availableDates);
  }, [reservationStore.startDate]);

  useEffect(() => {
    console.log("reservationStore 값:", reservationStore);
  }, [reservationStore]);

  // ✅ 날짜 선택 시 예약 store 반영 + 가능 시간 조회
  const handleSelectDate = (result: {
    single?: string;
    range?: [string, string];
  }) => {
    if (!spaceId) return;
    if (!result.single) return;

    const [year, month, day] = result.single.split(":").map(Number);
    const selected = new Date(year, month - 1, day);

    // 예약 store 초기화 (시간 초기화)
    setReservation({
      startDate: selected,
      endDate: selected,
      time: { start: "", end: "" },
    });
  };

  // ✅ 인원 변경
  const handleChangeCapacity = (count: number) => {
    setReservation({ capacity: count });
  };

  const isReservable = React.useMemo(() => {
    const hasStart =
      reservationStore.time?.start && reservationStore.time.start !== "";
    const hasEnd =
      reservationStore.time?.end && reservationStore.time.end !== "";

    return (
      !!reservationStore.startDate &&
      hasStart &&
      hasEnd &&
      !!reservationStore.capacity &&
      reservationStore.capacity > 0
    );
  }, [
    reservationStore.startDate?.toISOString(),
    reservationStore.time?.start,
    reservationStore.time?.end,
    reservationStore.capacity,
  ]);

  const router = useRouter();
  const { accessToken, setAccessToken } = useAuthStore();

  // ✅ 예약 버튼 핸들러
  const handleReservationClick = async () => {
    try {
      // refresh API 호출
      const data = await axiosClient.post("/api/auth/refresh");
      console.log(data);
      // 성공 → 새 토큰 저장
      setAccessToken(data.data.accessToken);

      // 예약 페이지로 이동
      router.push(`/spaces/${spaceId}/reservation`);
    } catch (err) {
      // 실패 → 로그인 필요 모달
      setInfoTitle("로그인 필요");
      setInfoContents("예약을 진행하려면 로그인이 필요합니다.");
      setIsModalOpen(true);
    }
  };

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
            <Value>
              <Calendar
                selectedDate={reservationStore.startDate}
                availableDates={availableDates}
                onSelectDate={handleSelectDate}
                onMonthChange={(year, month) => {
                  getAvailableDatesApi(Number(spaceId), year, month)
                    .then((res) => setAvailableDates(res.availableDays))
                    .catch((err) => console.error(err));
                }}
              />
            </Value>
          </RInfoWrapper>
          <RInfoWrapper>
            <SubTitle>이용시간</SubTitle>
            <Value>
              <TimePickerWrapper>
                {/* 시작 시간 */}
                <SelectBox2
                  options={startTimeOptions}
                  value={reservationStore.time?.start || ""}
                  placeholder="시작 시간 선택"
                  disabled={!reservationStore.startDate} // startDate 없으면 선택 불가
                  onChange={(opt) => {
                    // //  수정: 시작 시간을 선택하면 종료 시간을 초기화합니다.
                    // handleSelectTime(opt, "");
                    setReservation({ time: { start: opt, end: "" } });
                  }}
                />

                <span>~</span>

                {/* 종료 시간 */}
                <SelectBox2
                  options={endTimeOptions}
                  value={reservationStore.time?.end || ""}
                  placeholder="종료 시간 선택"
                  disabled={!reservationTime?.start}
                  onChange={(opt) => {
                    // // 시작 시간은 기존 값을 유지, 없으면 초기화
                    const start = reservationStore.time?.start || "";
                    // handleSelectTime(start, opt);
                    // ⭐ 명시적으로 end만 업데이트
                    setReservation({ time: { start: start, end: opt } });
                  }}
                />
              </TimePickerWrapper>
            </Value>
          </RInfoWrapper>
          <RInfoWrapper>
            <SubTitle>이용인원</SubTitle>

            <Value>
              <CapacitySelect
                value={reservationStore.capacity ?? 1}
                onChange={handleChangeCapacity}
              />
            </Value>
          </RInfoWrapper>
          <ButtonWrapper>
            <Button
              width={"100%"}
              type="button"
              isActive={!!isReservable}
              onClick={handleReservationClick}
            >
              예약하러가기
            </Button>
          </ButtonWrapper>
        </ReservationInfo>
      </InfoWrapper>
      <InfoModal
        isOpen={isModalOpen}
        title={infoTitle}
        subtitle={infoContents}
        onClose={async () => {
          setIsModalOpen(false);
        }}
      />
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

  // background-color: pink;

  @media (max-width: 1040px) {
    padding: 0 5%;
  }
`;

const ImageWrapper = styled.div`
  // background-color: yellow;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  width: 33.6rem
  height: 26.25rem

    @media (max-width: 1040px) {
 display: flex;
 flex-drection: column;
  }

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

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    grid-template-rows: 1fr;
  }
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
  width: 100%;
  margin-top: 2rem;
  // background-color: blue;
  display: flex;
  justify-content: space-between;
  gap: 3.91rem;

  // background-color: pink;
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const SpaceInfo = styled.div`
  max-width: 40.3rem;
  // background-color: green;
  width: 100%;

  display: flex;
  flex-direction: column;
  gap: 3.5rem;
`;

const ReservationInfo = styled.div`
  max-width: 24rem;
  background-color: white;
  border-radius: 0.75rem;
  border: 1px solid ${colors.graycolor5};
  width: 100%;

  padding: 1.25rem;

  display: flex;
  flex-direction: column;

  @media (max-width: 768px) {
    max-width: 100%;
  }
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
  // background-color: purple;
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

  // background-color: yellow;
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

  // background-color: purple;
`;

const TimePickerWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const ButtonWrapper = styled.div`
  margin: 1.5rem 0;
`;
