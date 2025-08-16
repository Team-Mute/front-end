"use client";

import React, { useEffect, useState } from "react";
import SearchBar from "@/components/Searchbar";
import styled from "@emotion/styled";
import IconButton from "@/components/common/button/IconButton";
import SpaceCard from "./components/SpaceCard";

const options = [
  { value: "all", label: "전체" },
  { value: "space", label: "공간명" },
  { value: "manager", label: "담당자" },
];

// 예시 데이터
const spaceList = [
  {
    id: 1,
    imageUrl: "https://picsum.photos/600/400",
    title: "서울 회의실 A",
    region: "서울 강남구",
    manager: "홍길동",
    isPrivate: true,
    isDraft: false,
  },
  {
    id: 2,
    imageUrl: "https://picsum.photos/600/400",
    title: "부산 세미나실 B",
    region: "부산 해운대구",
    manager: "김철수",
    isPrivate: false,
    isDraft: true,
  },
  {
    id: 3,
    imageUrl: "https://picsum.photos/600/400",
    title: "대전 컨퍼런스룸 C",
    region: "대전 서구",
    manager: "이영희",
    isPrivate: false,
    isDraft: false,
  },
  {
    id: 4,
    imageUrl: "https://picsum.photos/600/400",
    title: "대전 컨퍼런스룸 C",
    region: "대전 서구",
    manager: "김뮤트",
    isPrivate: false,
    isDraft: false,
  },
  {
    id: 5,
    imageUrl: "https://picsum.photos/600/400",
    title: "대전 컨퍼런스룸 C",
    region: "대전 서구",
    manager: "김뮤트",
    isPrivate: false,
    isDraft: false,
  },
  {
    id: 6,
    imageUrl: "https://picsum.photos/600/400",
    title: "대전 컨퍼런스룸 C",
    region: "대전 서구",
    manager: "김뮤트",
    isPrivate: false,
    isDraft: false,
  },
  {
    id: 7,
    imageUrl: "https://picsum.photos/600/400",
    title: "대전 컨퍼런스룸 C",
    region: "대전 서구",
    manager: "김뮤트",
    isPrivate: false,
    isDraft: false,
  },
];

export default function DashboardPage() {
  const [filter, setFilter] = React.useState("all");
  const [keyword, setKeyword] = React.useState("");

  const [remWidth, setRemWidth] = useState(0);

  useEffect(() => {
    const updateRemWidth = () => {
      const rootFontSize = parseFloat(
        getComputedStyle(document.documentElement).fontSize
      );
      setRemWidth(window.innerWidth / rootFontSize);
    };

    updateRemWidth();
    window.addEventListener("resize", updateRemWidth);

    return () => {
      window.removeEventListener("resize", updateRemWidth);
    };
  }, []);

  return (
    <Container>
      <TitleWrapper>
        <h1>공간 관리</h1>
        <IconButton label="새 공간 등록" />
      </TitleWrapper>
      <SearchBarWrapper>
        <SearchBar
          options={options}
          selectedValue={filter}
          onSelectChange={setFilter}
          placeholder="공간명, 담당자로 검색"
          searchValue={keyword}
          onSearchChange={setKeyword}
        />
      </SearchBarWrapper>

      <CardContainer>
        {spaceList.map((space) => (
          <SpaceCard
            key={space.id}
            imageUrl={space.imageUrl}
            title={space.title}
            region={space.region}
            manager={space.manager}
            isPrivate={space.isPrivate}
            isDraft={space.isDraft}
          />
        ))}
      </CardContainer>
      {/* 뷰포트 rem 표시 */}
      {/* <ViewportBadge>{remWidth.toFixed(2)} rem</ViewportBadge> */}
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
  //   background-color: beige;
`;

const TitleWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  align-self: stretch;
  margin-bottom: 1rem;

  .h1 {
    font-weight: 600;
    font-size: 1.5rem;
  }
`;

const SearchBarWrapper = styled.div`
  width: 100%;
`;
const CardContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, 22rem);
  gap: 3.5rem 1rem;
  margin-top: 1.5rem;

  justify-content: center;

  width: 100%;
  max-width: calc(3 * 22rem + 2 * 1rem); /* 카드 3개 + 간격 */
  margin-left: auto;
  margin-right: auto;

  /* 모바일 */
  @media (max-width: 767px) {
    gap: 1rem;
  }
`;

const ViewportBadge = styled.div`
  position: fixed;
  bottom: 10px;
  right: 10px;
  background: black;
  color: white;
  padding: 0.3rem 0.6rem;
  font-size: 0.9rem;
  border-radius: 4px;
  opacity: 0.8;
`;
