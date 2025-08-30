"use client";

import React, { useState } from "react";
import styled from "@emotion/styled";
import MySideBar from "@/components/sideBar";
import closeIcon from "@/styles/icons/close.svg"
import { useRouter } from "next/navigation";

// --- 타입 정의 ---

interface Reservation {
  id: string;
  status: '진행중' | '예약완료' | '완료' | '취소';
  location: string;
  mainDate: string;
  mainTime: string;
  preVisitDate?: string;
  preVisitTime?: string;
}

interface TabItemProps {
  isActive: boolean;
}

interface StatusBadgeProps {
  status: Reservation['status'];
}


// --- 임시 데이터 ---
const mockReservations: Reservation[] = [
  // ... (기존 임시 데이터와 동일)
    {
    id: 'BL_25082245',
    status: '진행중',
    location: '명동 신한스퀘어브릿지 지하1층 메인홀',
    mainDate: '2025년 8월 15일 (금)',
    mainTime: '14:00 ~ 16:00',
    preVisitDate: '2025년 8월 14일 (목)',
    preVisitTime: '14:30 ~ 15:00',
  },
  {
    id: 'BL_25082246',
    status: '예약완료',
    location: '강남 신한스퀘어브릿지 1층 라운지',
    mainDate: '2025년 9월 2일 (화)',
    mainTime: '10:00 ~ 11:00',
  },
  {
    id: 'BL_25082247',
    status: '완료',
    location: '제주 신한스퀘어브릿지 2층 세미나실',
    mainDate: '2025년 7월 1일 (화)',
    mainTime: '15:00 ~ 17:00',
  },
  {
    id: 'BL_25082248',
    status: '진행중',
    location: '명동 신한스퀘어브릿지 지하1층 메인홀',
    mainDate: '2025년 8월 18일 (월)',
    mainTime: '11:00 ~ 12:00',
  },
  {
    id: 'BL_25082249',
    status: '취소',
    location: '인천 신한스퀘어브릿지 3층 이벤트홀',
    mainDate: '2025년 8월 20일 (수)',
    mainTime: '18:00 ~ 20:00',
  },
  {
    id: 'BL_25082250',
    status: '취소',
    location: '인천 신한스퀘어브릿지 3층 이벤트홀',
    mainDate: '2025년 8월 20일 (수)',
    mainTime: '18:00 ~ 20:00',
  },
  {
    id: 'BL_25082251',
    status: '취소',
    location: '인천 신한스퀘어브릿지 3층 이벤트홀',
    mainDate: '2025년 8월 20일 (수)',
    mainTime: '18:00 ~ 20:00',
  },
];

const TABS = ["전체", "진행중", "예약완료", "완료", "취소"];

// --- 컴포넌트 ---

export default function MyPageReservations() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string>("전체");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const filteredReservations = mockReservations.filter(reservation => {
    const matchesTab = activeTab === '전체' || reservation.status === activeTab;
    const matchesSearch = reservation.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
<Container>
    <MySideBar children={<></>}/>
    <Wrapper>
      <ModalHeader>
        <Title>공간예약 내역</Title>
        <CloseButton onClick={() => {
                  router.push("/mypage");
                }}>
            <CloseIcon/>
        </CloseButton>
      </ModalHeader>

      <TabsContainer>
        {TABS.map((tab) => (
          <TabItem
            key={tab}
            isActive={activeTab === tab}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </TabItem>
        ))}
      </TabsContainer>

      <SearchContainer>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" stroke="#8C8F93" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M21 21L16.65 16.65" stroke="#8C8F93" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        <SearchInput 
          type="text" 
          placeholder="예약번호로 찾기"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </SearchContainer>
      
      <ReservationList>
        {filteredReservations.map((reservation) => (
          <ReservationItem key={reservation.id}>
            <ItemContent>
              <InfoSection>
                <InfoTop>
                  <StatusBadge status={reservation.status}>{reservation.status}</StatusBadge>
                  <ReservationNumber>예약번호: {reservation.id}</ReservationNumber>
                </InfoTop>
                <Location>{reservation.location}</Location>
                <Schedule>
                  <DateTime>
                    <span>{reservation.mainDate}</span>
                    <Separator />
                    <span>{reservation.mainTime}</span>
                  </DateTime>
                  {reservation.preVisitDate && (
                    <SubDateTime>
                      <span>사전답사 {reservation.preVisitDate}</span>
                      <Separator isSubtle/>
                      <span>{reservation.preVisitTime}</span>
                    </SubDateTime>
                  )}
                </Schedule>
              </InfoSection>
              <DetailsButton>상세보기</DetailsButton>
            </ItemContent>
          </ReservationItem>
        ))}
      </ReservationList>
    </Wrapper>
    </Container>
  );
}

// --- 스타일 컴포넌트 ---
const CloseIcon = styled(closeIcon)`
`;

const Container = styled.div`
  display: flex;
  flex-direction: row;
  position: relative;
`

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
  padding-right:81px;
  font-family: 'Pretendard', sans-serif;  
  
  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #ffffff;
    padding: 20px;
    box-sizing: border-box;
    gap: 16px;
    z-index: 100;
  }
`;

const ModalHeader = styled.div`
    display: none; /* 데스크톱에서는 헤더 숨김 */

    @media (max-width: 768px) {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
    }
`;

const Title = styled.h1`
  font-weight: 600;
  font-size: 20px;
  color: #191F28;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 24px;
  }
`;

const CloseButton = styled.button`
    background: none;
    border: none;
    cursor: pointer;
`;


const TabsContainer = styled.nav`
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  
  @media (max-width: 768px) {
    overflow-x: auto;
    padding-bottom: 8px;
    gap: 8px;
  }
`;

const TabItem = styled.button<TabItemProps>`
  padding: 8px;
  background: none;
  border: none;
  border-bottom: 1px solid transparent;
  cursor: pointer;
  font-weight: 500;
  font-size: 16px;
  color: ${(props) => (props.isActive ? '#191F28' : '#8C8F93')};
  border-bottom-color: ${(props) => (props.isActive ? '#191F28' : 'transparent')};
  white-space: nowrap; /* 탭 이름이 줄바꿈되지 않도록 설정 */
  &:hover { color: #191F28; }
`;

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 8px 16px;
  gap: 8px;
  width: 100%;
  height: 48px;
  background: #F3F4F4;
  border-radius: 12px;
  box-sizing: border-box;
`;

const SearchInput = styled.input`
  width: 100%;
  height: 100%;
  border: none;
  background: transparent;
  font-size: 14px;
  font-weight: 500;
  color: #191F28;
  &:focus { outline: none; }
  &::placeholder { color: #8C8F93; }
`;

const ReservationList = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 8px;
  min-height: calc(100vh - 260px);
  
  @media (min-width: 769px) {
    height: 400px;
    overflow-y: auto;
  }

  @media (max-width: 768px) {
      flex: 1; /* 남은 공간을 모두 채우도록 설정 */
      overflow-y: auto; /* 리스트가 길어지면 스크롤 */
  }
`;

const ReservationItem = styled.div`
  box-sizing: border-box;
  width: 100%;
  border-bottom: 1px solid #E8E9E9;
  padding: 16px 0px;
`;

// 수정: 반응형 스타일 적용
const ItemContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  @media (max-width: 768px) {
    flex-direction: column; /* 작은 화면에서 세로로 쌓음 */
    align-items: flex-start; /* 왼쪽 정렬 */
    gap: 16px;
  }
`;

const InfoSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const InfoTop = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap; /* 작은 화면에서 줄바꿈 허용 */
`;

const statusStyles = {
  '진행중': { bg: '#FFF7E8', color: '#FDB01F' },
  '예약완료': { bg: '#EAF8F0', color: '#2DBB64' },
  '완료': { bg: '#F3F4F4', color: '#52555B' },
  '취소': { bg: '#FDEDED', color: '#F04438' },
};

const StatusBadge = styled.div<StatusBadgeProps>`
  padding: 4px 8px;
  border-radius: 4px;
  font-weight: 600;
  font-size: 11px;
  background-color: ${props => statusStyles[props.status]?.bg || '#F3F4F4'};
  color: ${props => statusStyles[props.status]?.color || '#52555B'};
`;

const ReservationNumber = styled.span`
  font-weight: 500;
  font-size: 12px;
  color: #8C8F93;
`;

const Location = styled.h2`
  font-weight: 600;
  font-size: 16px;
  color: #191F28;
  margin: 0;
`;

const Schedule = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

// 수정: 반응형 스타일 적용
const DateTime = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  font-size: 12px;
  color: #191F28;
  flex-wrap: wrap; /* 작은 화면에서 줄바꿈 허용 */
`;

const SubDateTime = styled(DateTime)`
  font-weight: 500;
  color: #8C8F93;
`;

const Separator = styled.div<{ isSubtle?: boolean }>`
  width: 1px;
  height: 12px;
  background-color: ${props => props.isSubtle ? '#E8E9E9' : '#191F28'};
`;

const DetailsButton = styled.button`
  padding: 8px 12px;
  background: #F2F6FF;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-weight: 500;
  font-size: 12px;
  color: #0046FF;
  height: 30px;

  @media (max-width: 768px) {
    width: 100%; /* 작은 화면에서 버튼 너비 100% */
    height: 40px; /* 높이 증가 */
  }
`;