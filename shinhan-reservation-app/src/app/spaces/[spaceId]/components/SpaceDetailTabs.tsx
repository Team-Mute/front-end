"use client";

import React, { useRef, useState, useEffect } from "react";
import styled from "@emotion/styled";
import colors from "@/styles/theme";
import { SpaceDetailPayload } from "@/types/space";
import Map from "./Map";

interface Props {
  spaceDetail: SpaceDetailPayload | null;
}

export default function SpaceDetailTabs({ spaceDetail }: Props) {
  const [activeTab, setActiveTab] = useState<"info" | "reservation" | "rules">(
    "info"
  );

  const infoRef = useRef<HTMLDivElement | null>(null);
  const reservationRef = useRef<HTMLDivElement | null>(null);
  const rulesRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<HTMLDivElement | null>(null); // ⭐ 추가: 지도를 위한 ref

  // 스크롤 이벤트로 activeTab 변경
  const handleScroll = () => {
    const scrollPos = window.scrollY + 200; // 탭 오프셋 조정
    const infoTop = infoRef.current?.offsetTop ?? 0;
    const reservationTop = reservationRef.current?.offsetTop ?? 0;
    const rulesTop = rulesRef.current?.offsetTop ?? 0;

    if (scrollPos >= rulesTop) {
      setActiveTab("rules");
    } else if (scrollPos >= reservationTop) {
      setActiveTab("reservation");
    } else {
      setActiveTab("info");
    }
  };
  const scrollTo = (ref: React.RefObject<HTMLDivElement | null>) => {
    ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <TapWrapper>
      <TabHeader>
        <TabItem
          active={activeTab === "info"}
          onClick={() => scrollTo(infoRef)}
        >
          공간안내
        </TabItem>
        <TabItem
          active={activeTab === "reservation"}
          onClick={() => scrollTo(reservationRef)}
        >
          예약과정
        </TabItem>
        <TabItem
          active={activeTab === "rules"}
          onClick={() => scrollTo(rulesRef)}
        >
          이용수칙
        </TabItem>
      </TabHeader>

      <TabContent ref={infoRef}>
        <SectionTitle>공간 안내</SectionTitle>
        <p> {spaceDetail?.spaceDescription}</p>
      </TabContent>

      <TabContent ref={mapRef}>
        <SectionTitle>위치</SectionTitle>
        <Map
          addressRoad={
            spaceDetail?.location.addressRoad ??
            "서울특별시 중구 명동10길 52 신한익스페이스"
          }
        />
        <p>{spaceDetail?.location.addressRoad.split(" - ")[0]?.trim()}</p>
      </TabContent>

      <TabContent ref={reservationRef}>
        <SectionTitle>예약과정</SectionTitle>
        <p>{spaceDetail?.reservationWay}</p>
      </TabContent>

      <TabContent ref={rulesRef}>
        <SectionTitle>이용수칙</SectionTitle>
        <p>{spaceDetail?.spaceRules}</p>
      </TabContent>
    </TapWrapper>
  );
}

const TapWrapper = styled.div`
  display: flex;
  flex-direction: column;
  background-color: beige;
  gap: 0.5rem;
`;
const TabHeader = styled.div`
  display: flex;
  width: 100%;
  position: sticky;
  top: 0;
  background-color: white;
  z-index: 10;
  border-bottom: 1px solid ${colors.graycolor5};
`;

const TabItem = styled.div<{ active: boolean }>`
  flex: 1;
  text-align: center;
  padding: 1rem 0;
  font-weight: 600;
  cursor: pointer;
  color: ${({ active }) => (active ? colors.graycolor100 : colors.graycolor50)};
  border-bottom: ${({ active }) =>
    active ? `3px solid ${colors.graycolor100}` : "none"};
  transition: color 0.2s, border-bottom 0.2s;
`;

const TabContent = styled.div`
  padding: 3rem 0;
  scroll-margin-top: 60px; /* sticky 탭 높이 만큼 오프셋 */
  background-color: gray;
`;

const SectionTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 1rem;
`;
