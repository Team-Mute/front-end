import React, { useState } from "react";
import DatePicker from "react-datepicker";
import styled from "@emotion/styled";
import "react-datepicker/dist/react-datepicker.css";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { ko } from "date-fns/locale";
import colors from "@/styles/theme";

const Calendar = () => {
  const [range, setRange] = useState<[Date | null, Date | null]>([null, null]);
  const [startDate, endDate] = range;

  return (
    <CalendarWrapper>
      <DatePicker
        locale={ko}
        selectsRange
        startDate={startDate}
        endDate={endDate}
        onChange={(update) => setRange(update as [Date | null, Date | null])}
        dateFormat="yyyy-MM-dd"
        inline
        renderCustomHeader={({ date, decreaseMonth, increaseMonth }) => {
          const month = (date.getMonth() + 1).toString().padStart(2, "0"); // 08월 형태
          return (
            <div
              style={{
                display: "flex",
                justifyContent: "flex-start", // 왼쪽 정렬
                alignItems: "center",
                marginBottom: "1rem",
                gap: "0.5rem",
              }}
            >
              <button onClick={decreaseMonth}>
                <IoIosArrowBack size={20} />
              </button>
              <span style={{ fontSize: "1rem", fontWeight: "bold" }}>
                {date.getFullYear()}, {month}월
              </span>
              <button onClick={increaseMonth}>
                <IoIosArrowForward size={20} />
              </button>
            </div>
          );
        }}
        dayClassName={(date) => {
          const day = date.getDay();
          if (day === 0) return "sunday";
          if (day === 6) return "saturday";
          return "weekday";
        }}
      />
    </CalendarWrapper>
  );
};

export default Calendar;

const CalendarWrapper = styled.div`
  display: flex;
  justify-content: center;
  font-family: inherit;

  .react-datepicker {
    border: none;
    background: white;
  }

  .react-datepicker__header {
    background: white;
    border: none;
    padding-top: 0;
  }

  .react-datepicker__current-month {
    display: none;
  }

  /* 헤더 */
  .calendar-header {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: 1rem;
    gap: 0.5rem;
  }

  .calendar-title {
    font-size: 1.25rem;
    font-weight: 600;
    font-family: "Pretendard", sans-serif; /* 원하는 폰트 */
  }

  .nav-btn {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    display: flex;
    align-items: center;
  }

  /* 요일 */
  .react-datepicker__day-names {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 1.5rem;
    margin-bottom: 1rem;
  }

  .react-datepicker__day-name {
    font-weight: bold;
    font-size: 0.85rem;
  }

  /* 날짜 */
  .react-datepicker__week {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 1.5rem;
    margin-bottom: 0.5rem;
  }

  .react-datepicker__day {
    width: 1.875rem;
    height: 1.875rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    margin: 0;
    font-size: 0.9rem;
  }

  .react-datepicker__day--today {
  border: 1px solid #ccc; /* 회색 테두리 */
  background: transparent; /* 배경 없음 */
  color: black;
  border-radius: 50%;
}

  /* 오늘 날짜 */
  .today {
    border: 1px solid #ccc;
    border-radius: 50%;
  }

  /* 시작/종료 날짜 */
  .react-datepicker__day--selected,
  .react-datepicker__day--range-start,
  .react-datepicker__day--range-end {
    background: ${colors.maincolor};
    color: white !important;
    border-radius: 50%;
  }

  /* 범위 중간 날짜 */
.react-datepicker__day--in-selecting-range {
    background: ${colors.maincolor5}
    color: black;
    border-radius: 0; /* 원형X → 사각형 느낌 */
  }

  /* 요일 색상 */
  .sunday,
  .react-datepicker__day-name:nth-of-type(1) {
    color: red !important;
  }

  .saturday,
  .react-datepicker__day-name:nth-of-type(7) {
    color: blue !important;
  }

  .react-datepicker__day:hover:not(.react-datepicker__day--in-selecting-range) {
    background: transparent;
  }
`;
