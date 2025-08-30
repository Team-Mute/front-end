"use client";

import { useState, useEffect } from "react";
import SearchBar from "@/components/common/searchbar/user/Searchbar";
import styled from "@emotion/styled";
import LocationIcon from "@/styles/icons/location.svg";
import ModalButton from "@/components/common/button/ModalButton";
import InfoModal from "@/components/modal/InfoModal";
import DropdownModal from "@/components/modal/DropdownModal";
import FilteringButton from "@/components/common/button/FilteringButton";

import MeetingIcon from "@/styles/icons/meeting.svg";
import EventRoomIcon from "@/styles/icons/event-room.svg";
import SpaceInfoCard from "./user-components/SpaceInfoCard";
import { useSpaceStore } from "@/store/spaceStore";
import CapacitySelect from "@/components/dropdownModal/CapacitySelect";
import DateTimeSelect from "@/components/dropdownModal/DateTimeSelect";
import FacilitySelect from "@/components/dropdownModal/FacilitySelect";
import { getTagsApi } from "@/lib/api/admin/adminSpace";
import { getSpaceListApi } from "@/lib/api/userSpace";

import { useRouter } from "next/navigation"; // ✅ (1) 라우팅 위해 추가

import Loading from "@/components/common/Loading";
import { useFilterStore } from "@/store/filterStore";
import { combineDateAndTime } from "@/lib/utils/combineDateTime";

export default function HomePage() {
  const router = useRouter();
  const {
    regionId,
    categoryId,
    capacity,
    startDate,
    endDate,
    time,
    facilities,
    setFilters,
    clearFilters,
  } = useFilterStore();

  const options = [
    { label: "서울", value: "1" },
    { label: "인천", value: "2" },
    { label: "대구", value: "3" },
    { label: "대전", value: "4" },
  ];

  // 안내 모달 관리
  const [infoTitle, setInfoTitle] = useState("");
  const [infoContents, setInfoContents] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 모달 열림 상태 관리
  const [isPeopleModalOpen, setPeopleModalOpen] = useState(false);
  const [isDateModalOpen, setDateModalOpen] = useState(false);
  const [isFacilityModalOpen, setFacilityModalOpen] = useState(false);

  // 모달 적용 핸들러
  const handleApplyPeople = () => {
    setFilters({ capacity: tempCapacity });
    setPeopleModalOpen(false);
    // console.log("최종 선택된 인원:", tempCapacity);
  };

  const handleApplyDate = () => {
    setFilters({
      startDate: tempStartDate,
      endDate: tempEndDate,
      time: tempTime,
    });

    setDateModalOpen(false);
    // console.log(
    //   "최종 선택된 날짜 및 시간:",
    //   tempStartDate,
    //   tempEndDate,
    //   tempTime
    // );
  };

  const handleApplyFacilities = () => {
    setFilters({ facilities: tempFacilities });

    setFacilityModalOpen(false);
    // console.log("최종 선택된 시설:", tempFacilities);
  };

  // 모달 닫을 시 초기값
  const handleClosePeople = () => {
    setPeopleModalOpen(false);
    setTempCapacity(capacity); // 닫을 때 리셋
  };

  const handleCloseDate = () => {
    setDateModalOpen(false);
    setTempStartDate(startDate);
    setTempEndDate(endDate);
    setTempTime(time);
  };

  const handleCloseFacilities = () => {
    setFacilityModalOpen(false);
    setTempFacilities(facilities);
  };

  // 공간 리스트
  const [spaceList, setSpaceList] = useState<
    {
      spaceId: number;
      spaceName: string;
      spaceDescription: string;
      spaceCapacity: number;
      categoryName: string;
      tagNames: string[];
      location: string;
      spaceImageUrl: string;
    }[]
  >([]);

  // 검색어
  const [searchText, setSearchText] = useState("");

  const [allFacilities, setAllFacilities] = useState<
    { tagId: number; tagName: string }[]
  >([]);

  // 필터 임시 저장 값
  const [tempCapacity, setTempCapacity] = useState(capacity);
  const [tempStartDate, setTempStartDate] = useState<Date | undefined>(
    startDate
  );
  const [tempEndDate, setTempEndDate] = useState<Date | undefined>(endDate);
  const [tempTime, setTempTime] = useState<
    | {
        start: string;
        end: string;
      }
    | undefined
  >(time);
  const [tempFacilities, setTempFacilities] = useState<string[]>(facilities);

  // 상태 바뀔 시 리스트 호출
  // 최종 상태가 바뀌면 API 호출
  useEffect(() => {
    const fetchSpaces = async () => {
      setIsLoading(true);
      try {
        const startDateTime = combineDateAndTime(
          startDate, // Date | undefined
          time?.start, // string | undefined
          "start" // 👉 start 모드
        );

        const endDateTime = combineDateAndTime(
          endDate, // Date | undefined
          time?.end, // string | undefined
          "end" // 👉 end 모드
        );

        const res = await getSpaceListApi(
          regionId,
          categoryId,
          capacity,
          facilities,
          startDateTime,
          endDateTime
        );
        if (res.length === 0) {
          setInfoTitle("아쉽게도 일치하는 공간이 없어요");
          setInfoContents(
            "입력하신 조건에 맞는 공간이 없습니다. 조건을 변경해 다시 시도해주세요."
          );
          setIsModalOpen(true);
        } else {
          setSpaceList(res);
        }
      } catch (err) {
        console.error("공간 리스트 불러오기 실패", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSpaces();
  }, [regionId, categoryId, capacity, startDate, endDate, time, facilities]);

  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/parse-reservation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: searchText, user: { location: 1 } }),
      });
      const data = await res.json();
      console.log("GPT parsed result:", data);

      if (data.isRangeInput) {
        setInfoTitle("구간 조회는 불가능합니다.");
        setInfoContents("입력하신 구간 중 첫 번째 날짜의 검색 결과입니다.");
        setIsModalOpen(true);
      }

      // ✅ (4) Store에 GPT 검색 결과 저장
      setFilters({
        regionId: data.regionId,
        categoryId: data.categoryId,
        capacity: data.people,
        startDate: data.startDate,
        endDate: data.endDate,
        facilities: data.tagNames,
        hasGptSearch: true,
      });

      // ✅ (5) API 호출
      const startDateTime = data.startDate.replace(/([+-]\d{2}:\d{2}|Z)$/, "");
      const endDateTime = data.endDate.replace(/([+-]\d{2}:\d{2}|Z)$/, "");

      const spaceRes = await getSpaceListApi(
        data.regionId,
        data.categoryId,
        data.people,
        data.tagNames,
        startDateTime,
        endDateTime
      );

      if (spaceRes.length === 0) {
        setInfoTitle("아쉽게도 일치하는 공간이 없어요");
        setInfoContents("입력하신 조건에 맞는 공간이 없습니다.");
        setIsModalOpen(true);
      } else if (spaceRes.length === 1) {
        // ✅ (6) 결과가 1개면 바로 상세 페이지로 이동
        router.push(`/spaces/${spaceRes[0].spaceId}`);
      } else {
        // ✅ (7) 2개 이상이면 리스트만 보여줌
        setSpaceList(spaceRes);
      }
    } catch (err) {
      console.error(err);
      setInfoTitle("에러가 발생했습니다.");
      setInfoContents("AI 검색을 이용할 수 없습니다.");
      setIsModalOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const res = await getTagsApi(); // [{ tagId, tagName }, ...]
        setAllFacilities(res);
      } catch (err) {
        console.error("태그 불러오기 실패", err);
      }
    };
    fetchTags();
  }, []);

  return (
    <MainWrapper>
      <Loading isLoading={isLoading} />

      <SearchWrapper>
        <Title>적어서 한번에 예약하기</Title>

        <SearchBarWrapper>
          <SearchBar
            options={options}
            selectedValue={(regionId ?? "").toString()}
            searchValue={searchText}
            onSearchChange={(value) => setSearchText(value)}
            onSelectChange={(value) => setFilters({ regionId: Number(value) })} // string → number 변환
            placeholder="예: 다음주 화요일 오후 2시에서 4시에 50명 수용 가능한 큰 행사장 예약"
            onEnter={handleSearch} // ⬅️ 부모에서 검색 실행 함수 연결
          />
        </SearchBarWrapper>
      </SearchWrapper>
      <ResultsWrapper>
        <FilterWrapper>
          <FilteringButton
            label="미팅룸"
            icon={<MeetingIcon />}
            onClick={() => setFilters({ categoryId: 1 })} // ✅ 수정
          />
          <FilteringButton
            label="행사장"
            icon={<EventRoomIcon />}
            onClick={() => setFilters({ categoryId: 2 })} // ✅ 수정
          />
          {/* 인원 선택 버튼 */}
          <ModalButton
            label="인원"
            isOpen={isPeopleModalOpen}
            onToggle={() => setPeopleModalOpen((prev) => !prev)}
            modal={
              <DropdownModal
                onClose={handleClosePeople}
                title="인원수 선택"
                onApply={handleApplyPeople}
                isApplyActive={tempCapacity ? tempCapacity > 0 : true}
              >
                <CapacitySelect
                  value={tempCapacity ?? 1}
                  onChange={setTempCapacity}
                />
              </DropdownModal>
            }
          />

          {/* 날짜/시간 선택 버튼 */}
          <ModalButton
            label="날짜/시간"
            isOpen={isDateModalOpen}
            onToggle={() => setDateModalOpen((prev) => !prev)}
            modal={
              <DropdownModal
                onClose={handleCloseDate}
                title="이용 시간 및 날짜 선택"
                onApply={handleApplyDate}
                isApplyActive={!!tempStartDate} // 선택 여부로 active 결정
              >
                <DateTimeSelect
                  selectedDate={
                    tempEndDate ? [tempStartDate!, tempEndDate] : tempStartDate
                  }
                  selectedTime={tempTime}
                  onClose={() => {}}
                  onDateSelect={(start, end) => {
                    const toDate = (s: string) =>
                      new Date(s.replace(/:/g, "-"));

                    setTempStartDate(start ? toDate(start) : undefined);
                    setTempEndDate(end ? toDate(end) : undefined);
                  }}
                  onTimeSelect={(start, end) => {
                    setTempTime({ start, end: end ?? start });
                  }}
                />
              </DropdownModal>
            }
          />

          {/* 편의시설 선택 버튼 */}
          <ModalButton
            label="편의시설"
            isOpen={isFacilityModalOpen}
            onToggle={() => setFacilityModalOpen((prev) => !prev)}
            modal={
              <DropdownModal
                onClose={handleCloseFacilities}
                title="편의시설 선택"
                onApply={handleApplyFacilities}
                isApplyActive={tempFacilities.length > 0}
              >
                <FacilitySelect
                  facilities={allFacilities} // ✅ 전체 태그 목록 내려줌
                  selectedFacilities={tempFacilities}
                  setSelectedFacilities={setTempFacilities}
                />
              </DropdownModal>
            }
          />
        </FilterWrapper>
        <CardsWrapper>
          {spaceList.map((space) => (
            <SpaceInfoCard key={space.spaceId} {...space} />
          ))}
        </CardsWrapper>
      </ResultsWrapper>
      <RecommendRoomWrapper>
        <h3>회의실을 찾으시나요?</h3>
        <CardsWrapper>
          {/* 예시 데이터 - 실제로는 API에서 받아온 배열 map */}
          {[
            {
              spaceId: 1,
              spaceName: "강남 미팅룸",
              spaceDescription: "지하철 2호선 역삼역 인근",
              spaceCapacity: 20,
              categoryName: "미팅룸",
              tagNames: ["Wi-Fi", "빔프로젝터", "콘센트", "화이트보드"],
              location: "서울 강남구 역삼동",
              spaceImageUrl: "https://via.placeholder.com/300x200",
            },
            {
              spaceId: 2,
              spaceName: "홍대 행사장",
              spaceDescription: "젊음의 거리 중심 행사 공간",
              spaceCapacity: 100,
              categoryName: "행사장",
              tagNames: ["Wi-Fi", "주차", "음료", "음향장비"],
              location: "서울 마포구",
              spaceImageUrl: "https://via.placeholder.com/300x200",
            },
            {
              spaceId: 3,
              spaceName: "홍대 행사장",
              spaceDescription: "젊음의 거리 중심 행사 공간",
              spaceCapacity: 100,
              categoryName: "행사장",
              tagNames: ["Wi-Fi", "주차", "음료", "음향장비"],
              location: "서울 마포구",
              spaceImageUrl: "https://via.placeholder.com/300x200",
            },
            {
              spaceId: 4,
              spaceName: "홍대 행사장",
              spaceDescription: "젊음의 거리 중심 행사 공간",
              spaceCapacity: 100,
              categoryName: "행사장",
              tagNames: ["Wi-Fi", "주차", "음료", "음향장비"],
              location: "서울 마포구",
              spaceImageUrl: "https://via.placeholder.com/300x200",
            },
            {
              spaceId: 5,
              spaceName: "홍대 행사장",
              spaceDescription: "젊음의 거리 중심 행사 공간",
              spaceCapacity: 100,
              categoryName: "행사장",
              tagNames: ["Wi-Fi", "주차", "음료", "음향장비"],
              location: "서울 마포구",
              spaceImageUrl: "https://via.placeholder.com/300x200",
            },
            {
              spaceId: 6,
              spaceName: "홍대 행사장",
              spaceDescription: "젊음의 거리 중심 행사 공간",
              spaceCapacity: 100,
              categoryName: "행사장",
              tagNames: ["Wi-Fi", "주차", "음료", "음향장비"],
              location: "서울 마포구",
              spaceImageUrl: "https://via.placeholder.com/300x200",
            },
          ].map((space) => (
            <SpaceInfoCard key={space.spaceId} {...space} />
          ))}
        </CardsWrapper>
      </RecommendRoomWrapper>
      <InfoModal
        isOpen={isModalOpen}
        title={infoTitle}
        subtitle={infoContents}
        onClose={() => {
          setIsModalOpen(false);
        }}
      ></InfoModal>
    </MainWrapper>
  );
}

const MainWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 360px;
  padding: 0 10rem;

  @media (max-width: 768px) {
    padding: 0 5%;
  }
`;

const Title = styled.span`
  font-size: 2.25rem;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
  letter-spacing: -0.01125rem;
`;

const SearchWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  gap: 1rem;
  margin-top: 5rem;
`;

const SearchBarWrapper = styled.div`
  width: 100%;
  max-width: 36.875rem;
`;

const FilterWrapper = styled.div`
  display: flex;
  gap: 0.75rem;

  /* 스크롤 조건 만들기 */
  width: 100%; /* 컨테이너를 가용 너비로 고정 */
  overflow-x: auto; /* 가로 스크롤 */
  overflow-y: hidden;
  -webkit-overflow-scrolling: touch;

  /* 한 줄 유지 */
  flex-wrap: nowrap;
`;

const ResultsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  // align-items: flex-start;
  width: 100%;

  margin: 0 auto; /* 좌우 여백 자동 */
  margin-top: 2.5rem;

  /* 3열 기준 */
  max-width: calc(3 * 22rem + 2 * 1.5rem);

  @media (max-width: 1438px) {
    /* 2열 기준 */
    max-width: calc(2 * 22rem + 1 * 1.5rem);
  }

  @media (max-width: 1063px) {
    /* 1열 기준 */
    max-width: 22rem;
  }
`;

const CardsWrapper = styled.div`
  // margin-top: 1.5rem;
  // display: grid;
  // grid-template-columns: repeat(auto-fill, 22rem);
  // gap: 1.5rem;
  // justify-content: center;
  // width: 100%;

  // background-color: blue;
  // @media (max-width: 768px) {
  //   grid-template-columns: 1fr; /* 모바일에서는 1열 */
  //   justify-items: center;
  // }

  display: grid;
  grid-template-columns: repeat(auto-fit, 22rem);
  gap: 1.5rem;
  margin-top: 1.5rem;

  justify-content: flex-start;

  width: 100%;

  // max-width: calc(3 * 22rem + 2 * 1.5rem); /* 최대 3열 기준 */
  //margin: 0 auto; /* 남는 공간 자동으로 양쪽 패딩 역할 */

  /* 모바일 */
  @media (max-width: 767px) {
    grid-template-columns: 1fr; /* 강제로 1열 */
    // justify-content: center; /* 가운데 정렬 */
    // justify-items: center; /* 각 카드 내부도 가운데 정렬 */
    gap: 1rem;
  }
`;

const RecommendRoomWrapper = styled.div`
  display: flex;
  flex-direction: column;
  // align-items: flex-start;
  width: 100%;

  margin: 0 auto; /* 좌우 여백 자동 */
  margin-top: 3rem;

  /* 3열 기준 */
  max-width: calc(3 * 22rem + 2 * 1.5rem);

  @media (max-width: 1438px) {
    /* 2열 기준 */
    max-width: calc(2 * 22rem + 1 * 1.5rem);
  }

  @media (max-width: 1063px) {
    /* 1열 기준 */
    max-width: 22rem;
  }

  h3 {
    font-size: 1.25rem;
    font-style: normal;
    font-weight: 600;
    line-height: 110%; /* 1.375rem */
    letter-spacing: -0.03125rem;
  }
`;
