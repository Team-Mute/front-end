/**
 * 인원 선택 컴포넌트 (사용자 메인 페이지, 예약 페이지에서 사용)
 *
 */

import React from "react";
import styled from "@emotion/styled";
import colors from "@/styles/theme";
import PlusIcon from "@/styles/icons/plus.svg";
import SubtractIcon from "@/styles/icons/subtract.svg";

interface CapacitySelectProps {
  value: number;
  onChange: (newValue: number) => void;
}

export default function CapacitySelect({
  value,
  onChange,
}: CapacitySelectProps) {
  const handleDecrease = () => {
    if (value > 0) onChange(value - 1);
  };

  const handleIncrease = () => {
    onChange(value + 1);
  };

  return (
    <Wrapper>
      <Label>인원</Label>
      <Controls>
        <CircleButton onClick={handleDecrease} disabled={value === 0}>
          <SubtractIcon />
        </CircleButton>
        <Count>{value}</Count>
        <CircleButton onClick={handleIncrease}>
          <PlusIcon />
        </CircleButton>
      </Controls>
    </Wrapper>
  );
}

// --- styled ---
const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const Label = styled.span`
  font-size: 1rem;
  font-weight: 500;
`;

const Controls = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const CircleButton = styled.button<{ disabled?: boolean }>`
  width: 1.43rem;
  height: 1.43rem;
  border-radius: 50%;
  color: ${colors.maincolor};
  font-size: 1.25rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${colors.maincolor5};
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  opacity: ${({ disabled }) => (disabled ? 0.4 : 1)};
`;

const Count = styled.span`
  font-size: 1rem;
  font-weight: 600;
  min-width: 1.5rem;
  text-align: center;
`;
