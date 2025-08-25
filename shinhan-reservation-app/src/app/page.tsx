"use client";

import { useState } from "react";
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

export default function HomePage() {
  const options = [
    { label: "서울", value: "서울" },
    { label: "인천", value: "인천" },
    { label: "대구", value: "대구" },
    { label: "대전", value: "대전" },
  ];

  // 모달 열림 상태 관리
  const [isPeopleModalOpen, setPeopleModalOpen] = useState(false);
  const [isDateModalOpen, setDateModalOpen] = useState(false);
  const [isFacilityModalOpen, setFacilityModalOpen] = useState(false);

  // 모달 적용 핸들러
  const handleApplyPeople = () => {
    setPeopleModalOpen(false);
    // 필요하면 여기서 추가 액션
  };

  const handleApplyDate = () => {
    setDateModalOpen(false);
  };

  const handleApplyFacilities = () => {
    setFacilityModalOpen(false);
  };

  // 필터 상태 관리
  const [peopleCount, setPeopleCount] = useState(1); // 기본 1명
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<{
    start: string;
    end: string;
  } | null>(null);
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>([]);

  return (
    <MainWrapper>
      <SearchWrapper>
        <Title>적어서 한번에 예약하기</Title>

        <SearchBarWrapper>
          <SearchBar
            options={options}
            selectedValue=""
            onSearchChange={() => {}}
            searchValue=""
            onSelectChange={() => {}}
            placeholder="예: 다음주 화요일 오후 2시에서 4시에 50명 수용 가능한 큰 행사장 예약"
          />
        </SearchBarWrapper>
      </SearchWrapper>
      <ResultsWrapper>
        <FilterWrapper>
          <FilteringButton label="미팅룸" icon={<MeetingIcon />} />
          <FilteringButton label="행사장" icon={<EventRoomIcon />} />
          {/* 인원 선택 버튼 */}
          <ModalButton
            label={`인원`}
            modal={
              <DropdownModal
                isOpen={isPeopleModalOpen}
                onClose={() => setPeopleModalOpen(false)}
                title="인원 선택"
                onApply={handleApplyPeople}
              >
                {/* 여기에 + / - 버튼으로 인원 선택 UI */}
                <div
                  style={{
                    display: "flex",
                    gap: "1rem",
                    justifyContent: "center",
                  }}
                >
                  <button
                    onClick={() => setPeopleCount((c) => Math.max(1, c - 1))}
                  >
                    -
                  </button>
                  <span>{peopleCount}</span>
                  <button onClick={() => setPeopleCount((c) => c + 1)}>
                    +
                  </button>
                </div>
              </DropdownModal>
            }
          />

          {/* 날짜/시간 선택 버튼 */}
          <ModalButton
            label={selectedDate ? selectedDate.toLocaleDateString() : "날짜"}
            onClick={() => setPeopleModalOpen(true)} // 버튼 클릭 시 모달 열기
            modal={
              <DropdownModal
                isOpen={isDateModalOpen}
                onClose={() => setDateModalOpen(false)}
                title="날짜/시간 선택"
                onApply={handleApplyDate}
              >
                {/* 여기에 캘린더 컴포넌트 연결 */}
                <div>CalendarComponent 들어갈 자리</div>
              </DropdownModal>
            }
          />

          {/* 편의시설 선택 버튼 */}
          <ModalButton
            label={
              selectedFacilities.length
                ? `편의시설 (${selectedFacilities.length})`
                : "편의시설"
            }
            modal={
              <DropdownModal
                isOpen={isFacilityModalOpen}
                onClose={() => setFacilityModalOpen(false)}
                title="편의시설 선택"
                onApply={handleApplyFacilities}
              >
                {/* 편의시설 체크박스 UI */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "0.5rem",
                  }}
                >
                  {["Wi-Fi", "주차", "음료", "빔프로젝터"].map((facility) => (
                    <label key={facility}>
                      <input
                        type="checkbox"
                        checked={selectedFacilities.includes(facility)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedFacilities((prev) => [
                              ...prev,
                              facility,
                            ]);
                          } else {
                            setSelectedFacilities((prev) =>
                              prev.filter((f) => f !== facility)
                            );
                          }
                        }}
                      />
                      {facility}
                    </label>
                  ))}
                </div>
              </DropdownModal>
            }
          />
        </FilterWrapper>
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
      </ResultsWrapper>
      <RecommendRoomWrapper></RecommendRoomWrapper>
    </MainWrapper>
  );
}

const MainWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  // background-color: pink;

  padding: 1.5rem 10rem;

  @media (max-width: 873px) {
    padding: 1.5rem 5%;
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
  // background-color: yellow;
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
  align-items: flex-start;
  width: 100%;
  // background-color: green;

  margin-top: 2.5rem;
`;

const CardsWrapper = styled.div`
  margin-top: 1.5rem;
  display: grid;
  grid-template-columns: repeat(auto-fill, 22rem);
  gap: 1.5rem;
  justify-content: center;
  width: 100%;

  @media (max-width: 768px) {
    grid-template-columns: 1fr; /* 모바일에서는 1열 */
    justify-items: center;
  }
`;

const RecommendRoomWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  // background-color: beige;
`;
