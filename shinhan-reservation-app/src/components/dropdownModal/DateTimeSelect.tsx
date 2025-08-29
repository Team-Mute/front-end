"use client";

import React, { useState } from "react";
import Calendar from "@/components/Calendar";
import {
  ModalContainer,
  Header,
  CloseButton,
  GapBox,
  Footer,
} from "@/app/admin/space/components/SpaceFormModal/styles";
import { IoCloseOutline } from "react-icons/io5";
import styled from "@emotion/styled";
import colors from "@/styles/theme";
import Button from "@/components/common/button/Button";
import SelectBox2 from "../common/selectbox/Selectbox2";
import { TIME_OPTIONS } from "@/constants/space";

interface Props {
  selectedDate: Date | [Date, Date] | undefined; // ✅ 단일 또는 구간
  selectedTime: { start: string; end: string } | undefined;
  onClose: () => void;
  onDateSelect: (start: string, end?: string) => void;
  onTimeSelect: (start: string, end?: string) => void;
}

const DateTimeSelect: React.FC<Props> = ({
  selectedDate,
  selectedTime,
  onClose,
  onDateSelect: onSelect,
  onTimeSelect,
}) => {
  const [showTimePicker, setShowTimePicker] = useState(!!selectedDate);

  // helper
  const parseTime = (time: string) => {
    const [h, m] = time.split(":").map(Number);
    return h * 60 + m;
  };

  const startMinutes = selectedTime ? parseTime(selectedTime.start) : 0;
  const endMinutes = selectedTime ? parseTime(selectedTime.end) : 24 * 60;

  const startOptions = TIME_OPTIONS.map(({ label, value }) => {
    const minutes = parseTime(value);
    return { label, value, disabled: minutes >= endMinutes };
  });

  const endOptions = TIME_OPTIONS.map(({ label, value }) => {
    const minutes = parseTime(value);
    return { label, value, disabled: minutes <= startMinutes };
  });

  const handleDateSelect = (result: {
    single?: string;
    range?: [string, string];
  }) => {
    if (result.single) {
      setShowTimePicker(true);
      onSelect(result.single); // 바로 부모 상태에 전달
    } else if (result.range) {
      setShowTimePicker(true);
      onSelect(result.range[0], result.range[1]);
    }
  };

  return (
    <Container>
      <Title>예약 날짜</Title>
      <Calendar onSelectDate={handleDateSelect} selectedDate={selectedDate} />

      <InfoWrapper>
        <InfoBox>
          <Info color={colors.graycolor20}>
            <div></div>
            <p>오늘</p>
          </Info>
          <Info color={colors.maincolor}>
            <div></div>
            <p>선택</p>
          </Info>
        </InfoBox>
      </InfoWrapper>

      {showTimePicker && (
        <TimePickerWrapper>
          <SelectBox2
            options={startOptions}
            value={selectedTime?.start || ""}
            onChange={(v) => onTimeSelect(v, selectedTime?.end)}
          />
          <span>~</span>
          <SelectBox2
            options={endOptions}
            value={selectedTime?.end || ""}
            onChange={(v) => onTimeSelect(selectedTime?.start || "", v)}
          />
        </TimePickerWrapper>
      )}
    </Container>
  );
};

export default DateTimeSelect;

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const Title = styled.div`
  font-size: 1rem;
  font-style: normal;
  font-weight: 600;
  line-height: 110%;

  margin-bottom: 1.5rem;
`;

const InfoWrapper = styled.div`
  margin-top: 0.75rem;
  height: 2.625rem;

  display: flex;
  justify-content: center;
`;

const InfoBox = styled.div`
  display: flex; /* Info들을 가로 배치 */
  gap: 1rem; /* Info끼리 간격 */
  border-top: 1px solid ${colors.graycolor5};
  width: 22.9rem;
  padding-top: 1rem;
  padding-bottom: 0.5rem;
`;

const Info = styled.div<{ color: string }>`
  display: flex; /* 동그라미 + 텍스트 가로 배치 */
  align-items: center;
  gap: 0.22rem; /* 동그라미와 글자 간격 */

  div {
    width: 0.68rem;
    height: 0.68rem;
    border-radius: 50%;
    background-color: ${(props) => props.color};
    flex-shrink: 0;
  }

  p {
    font-size: 0.875rem;
    color: ${colors.graycolor100};
  }
`;

const TimePickerWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1rem;
`;
