/** @jsxImportSource @emotion/react */
"use client";

import React from "react";
import styled from "@emotion/styled";
import { GoPlus } from "react-icons/go";
import colors from "@/styles/theme";

interface IconButtonProps {
  label: string; // 버튼에 표시할 텍스트
  onClick?: () => void;
}

export default function IconButton({ label, onClick }: IconButtonProps) {
  return (
    <ButtonWrapper onClick={onClick}>
      <GoPlus size={16} />
      <span>{label}</span>
    </ButtonWrapper>
  );
}

const ButtonWrapper = styled.button`
  display: flex;
  align-items: center;
  gap: 0.3rem; /* 아이콘과 텍스트 간격 */
  padding: 0.5rem;
  height: 100%;
  background-color: ${colors.maincolor};
  border: none;
  border-radius: 0.5rem;
  font-size: 0.75rem;
  font-weight: 500;
  color: white;
  cursor: pointer;
`;
