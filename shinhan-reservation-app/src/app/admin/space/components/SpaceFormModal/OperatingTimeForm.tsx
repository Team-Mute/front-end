"use client";

import React, { useState } from "react";
import { DAYS } from "@/constants/space";
import Switch from "@/components/common/Switch";
import Input from "@/components/common/input/Input";
import {
  GapBox,
  TimeBox,
  Operation,
  Row,
  SectionHeader,
  SwitchWrapper,
  AutomaticHoliday,
  AddHolidayBtn,
} from "./styles";
import {
  Operation as OperationType,
  ClosedDay,
  SpaceRequest,
} from "@/types/space";
import SelectBox2 from "@/components/common/selectbox/Selectbox2";
import colors from "@/styles/theme";
import { TIME_OPTIONS } from "@/constants/space";
import CalendarModal from "../CalendarModal";
import IconButton from "@/components/common/button/IconButton";

interface Props {
  value: SpaceRequest;
  onChange: (next: SpaceRequest) => void;
}

const OperatingTimeForm: React.FC<Props> = ({ value, onChange }) => {
  const [isCalendarOpen, setCalendarOpen] = useState(false);

  const updateDay = (idx: number, patch: Partial<OperationType>) => {
    const next = [...value.space.operations];
    next[idx] = { ...next[idx], ...patch };

    // 시작/종료 시간 검증
    const [startH, startM] = next[idx].from.split(":").map(Number);
    const [endH, endM] = next[idx].to.split(":").map(Number);
    const startMinutes = startH * 60 + startM;
    const endMinutes = endH * 60 + endM;

    // 시작 시간이 종료 시간보다 크면 종료 시간을 자동으로 시작+30분으로 조정
    if (endMinutes <= startMinutes) {
      const newEndH = Math.floor((startMinutes + 30) / 60);
      const newEndM = (startMinutes + 30) % 60;
      next[idx].to = `${String(newEndH).padStart(2, "0")}:${String(
        newEndM
      ).padStart(2, "0")}`;
    }

    onChange({ ...value, space: { ...value.space, operations: next } });
  };

  const addHoliday = (from: string, to: string) =>
    onChange({
      ...value,
      space: {
        ...value.space,
        closedDays: [...value.space.closedDays, { from, to }],
      },
    });

  const removeHoliday = (idx: number) =>
    onChange({
      ...value,
      space: {
        ...value.space,
        closedDays: value.space.closedDays.filter((_, i) => i !== idx),
      },
    });

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <SectionHeader>운영시간 설정</SectionHeader>

      {value.space.operations.map((op, i) => {
        const [startH, startM] = op.from.split(":").map(Number);
        const startMinutes = startH * 60 + startM;

        const [endH, endM] = op.to.split(":").map(Number);
        const endMinutes = endH * 60 + endM;

        // 시작 시간 옵션: 종료 시간보다 같거나 이후는 disabled
        const startOptions = TIME_OPTIONS.map((t) => {
          const [h, m] = t.value.split(":").map(Number);
          const minutes = h * 60 + m;
          return {
            ...t,
            disabled: minutes >= endMinutes,
          };
        });

        // 종료 시간 옵션: 시작 시간보다 같거나 이전은 disabled
        const endOptions = TIME_OPTIONS.map((t) => {
          const [h, m] = t.value.split(":").map(Number);
          return { ...t, disabled: h * 60 + m <= startMinutes };
        });

        return (
          <Operation key={DAYS[i]}>
            <h5>{DAYS[i]}</h5>

            {op.isOpen ? (
              <TimeBox>
                <SelectBox2
                  options={startOptions}
                  value={op.from}
                  onChange={(v: string) => updateDay(i, { from: v })}
                  width="6.75rem"
                />
                <h4>~</h4>
                <SelectBox2
                  options={endOptions}
                  value={op.to}
                  onChange={(v: string) => updateDay(i, { to: v })}
                  width="6.75rem"
                />
              </TimeBox>
            ) : (
              <TimeBox>
                <span style={{ color: colors.negativecolor, fontWeight: 500 }}>
                  휴무일
                </span>
              </TimeBox>
            )}

            <SwitchWrapper>
              <Switch
                initial={op.isOpen}
                onToggle={(checked: boolean) =>
                  updateDay(i, { isOpen: checked })
                }
              />
            </SwitchWrapper>
            <span>{op.isOpen ? "운영" : "휴무"}</span>
          </Operation>
        );
      })}

      <GapBox h="1.75rem" />

      <SectionHeader>
        <span>휴무일 설정</span>
        <AutomaticHoliday onClick={() => {}}>공휴일 휴일 적용</AutomaticHoliday>
      </SectionHeader>

      <AddHolidayBtn onClick={() => setCalendarOpen(true)}>
        + 추가하기
      </AddHolidayBtn>
      <GapBox h="2rem" />

      <CalendarModal
        isOpen={isCalendarOpen}
        onClose={() => setCalendarOpen(false)}
        onSelect={(start, end) => {
          // addHoliday(start, end);
        }}
      />
    </div>
  );
};

export default OperatingTimeForm;
