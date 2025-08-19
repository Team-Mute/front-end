"use client";

import React, { useEffect, useState } from "react";
import { useSpaceStore } from "@/store/spaceStore";
import SearchBar from "@/components/Searchbar";
import styled from "@emotion/styled";
import IconButton from "@/components/common/button/IconButton";
import SpaceCard from "./components/SpaceCard";
import SpaceFormModal from "./components/SpaceFormModal/index";

const options = [
  { value: "all", label: "전체" },
  { value: "space", label: "공간명" },
  { value: "manager", label: "담당자" },
];

export default function DashboardPage() {
  const { spaces, removeSpace, filter, setFilter, keyword, setKeyword } =
    useSpaceStore();
  const filteredSpaces = spaces.filter((space) => {
    if (filter === "all") return true;
    if (filter === "space") return space.title.includes(keyword);
    if (filter === "manager") return space.manager.includes(keyword);
    return true;
  });

  const [editingSpace, setEditingSpace] = useState<(typeof spaces)[0] | null>(
    null
  );
  const [isCreateOpen, setIsCreateOpen] = useState(false);

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
        <div style={{ width: "6.6rem" }}>
          <IconButton
            label="새 공간 등록"
            onClick={() => setIsCreateOpen(true)}
          />
        </div>
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
        {filteredSpaces.map((space) => (
          <SpaceCard
            key={space.id}
            imageUrl={space.imageUrl}
            title={space.title}
            region={space.region}
            manager={space.manager}
            isPrivate={space.isPrivate}
            isDraft={space.isDraft}
            onEdit={() => setEditingSpace(space)}
          />
        ))}
      </CardContainer>
      {/* 뷰포트 rem 표시 */}
      {/* <ViewportBadge>{remWidth.toFixed(2)} rem</ViewportBadge> */}

      {/* 등록 모달 */}
      {isCreateOpen && (
        <SpaceFormModal
          isOpen
          onClose={() => setIsCreateOpen(false)}
          title="새 공간 등록"
          initialData={undefined} // 등록은 초기값 없음
          onSubmit={(data) => {
            console.log("새 공간 등록", data);
            setIsCreateOpen(false);
          }}
        />
      )}

      {editingSpace && (
        <SpaceFormModal
          isOpen={!!editingSpace}
          onClose={() => setEditingSpace(null)}
          initialData={editingSpace ?? undefined} // 여기서 해당 공간 데이터(id 포함)를 넘김
          title="공간 수정"
          onSubmit={(updatedData) => {
            console.log("수정된 데이터:", updatedData);
            setEditingSpace(null);
          }}
        />
      )}
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
