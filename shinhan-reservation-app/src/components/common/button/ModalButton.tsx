/** @jsxImportSource @emotion/react */
"use client";

import React, { useState, useRef, useEffect } from "react";
import styled from "@emotion/styled";
import colors from "@/styles/theme";
import ArrowDown from "@/styles/icons/arrow-down.svg";
import ArrowUp from "@/styles/icons/arrow-up.svg";

interface ModalButtonProps {
  label: string;
  modal?: React.ReactNode; // 클릭 시 보여줄 모달
  onClick?: () => void; // 부모에서 열기 상태 제어
}

export default function ModalButton({
  label,
  modal,
  onClick,
}: ModalButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLDivElement>(null);
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });

  const toggleModal = () => setIsOpen((prev) => !prev);

  // 외부 클릭 시 모달 닫기
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (buttonRef.current && !buttonRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 버튼 위치 계산 (모달 위치 조정)
  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setModalPosition({
        top: rect.bottom + 16, // 버튼 아래 1rem (16px)
        left: rect.left,
      });
    }
  }, [isOpen]);

  return (
    <Wrapper ref={buttonRef}>
      <Button
        onClick={() => {
          setIsOpen((prev) => !prev); // 내부 화살표 회전용
          onClick?.(); // 부모에서 모달 열림 상태 제어
        }}
      >
        <span>{label}</span>
        {isOpen ? <ArrowUp /> : <ArrowDown />}
      </Button>
      {isOpen && modal && (
        <ModalWrapper
          style={{ top: modalPosition.top, left: modalPosition.left }}
        >
          {modal}
        </ModalWrapper>
      )}
    </Wrapper>
  );
}

// --- styled ---
const Wrapper = styled.div`
  position: relative; /* 모달 위치 계산용 */
  display: inline-block;
  min-width: 5.18rem;
`;

const Button = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.62rem 1rem;
  border-radius: 1.875rem;
  background-color: ${colors.graycolor5};

  font-size: 0.875rem;
  font-style: normal;
  font-weight: 600;
  line-height: 110%; /* 0.9625rem */

  cursor: pointer;
  user-select: none;

  white-space: nowrap; /* 텍스트 줄바꿈 방지 */
`;

const ModalWrapper = styled.div`
  position: absolute;
  z-index: 1000;
`;
