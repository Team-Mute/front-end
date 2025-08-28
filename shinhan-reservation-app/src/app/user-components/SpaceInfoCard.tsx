/** @jsxImportSource @emotion/react */
"use client";

import React from "react";
import styled from "@emotion/styled";
import colors from "@/styles/theme";

interface SpaceInfoCardProps {
  spaceId: number;
  spaceName: string; // 타이틀
  spaceDescription: string; // 서브 타이틀
  spaceCapacity: number; // 인원수
  categoryName: string; // 카테고리 (ex: 미팅룸, 행사장)
  tagNames: string[]; // 편의시설 태그들
  location: string; // 위치
  spaceImageUrl: string; // 대표 이미지
}

export default function SpaceInfoCard({
  spaceId,
  spaceName,
  spaceDescription,
  spaceCapacity,
  categoryName,
  tagNames,
  location,
  spaceImageUrl,
}: SpaceInfoCardProps) {
  return (
    <CardWrapper>
      {/* 1. 사진 */}
      <ImageWrapper>
        <Image src={spaceImageUrl} alt={spaceName} />
      </ImageWrapper>

      {/* 2. 타이틀 */}
      <Title>{spaceName}</Title>

      {/* 3. 서브 타이틀 */}
      <Subtitle>{spaceDescription}</Subtitle>

      {/* 4. 인원수 */}
      <Capacity>최대 {spaceCapacity}명 수용</Capacity>

      {/* 5. 편의시설 태그들 */}
      <TagsWrapper>
        {tagNames.map((tag) => (
          <Tag key={tag}>{tag}</Tag>
        ))}
      </TagsWrapper>
    </CardWrapper>
  );
}

// --- styled ---
const CardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 22rem;

  border-radius: 0.625rem;
  background-color: ${colors.graycolor5};
`;

const ImageWrapper = styled.div`
  width: 100%;
  height: 12rem;
  border-radius: 0.625rem;
  overflow: hidden;
  background-color: ${colors.graycolor30};
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const Title = styled.h3`
  margin-top: 1rem;
  font-size: 1.125rem;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
`;

const Subtitle = styled.p`
  margin-top: 0.34rem;
  font-size: 0.875rem;
  color: ${colors.graycolor50};

  font-size: 0.875rem;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
`;

const Capacity = styled.span`
  margin-top: 0.75rem;
  margin-bottom: 0.62rem;
  font-size: 0.875rem;
  font-style: normal;
  font-weight: 600;
  line-height: normal;

  color: ${colors.graycolor100};
`;

const TagsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const Tag = styled.span`
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  background-color: ${colors.maincolor5};
  font-size: 0.75rem;
  font-weight: 500;
  color: ${colors.maincolor};
`;
