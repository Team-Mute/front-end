// useReservationTimes.ts 파일

import { useState, useEffect, useMemo } from "react";
import { getAvailableTimesApi } from "@/lib/api/reservation";
import { useReservationStore } from "@/store/reservationStore";

interface TimeSlot {
  startTime: string;
  endTime: string;
}

interface UseReservationTimesProps {
  spaceId: number;
  year: number;
  month: number;
  day: number;
  startDate?: string | null;
}

export function useReservationTimes({
  spaceId,
  year,
  month,
  day,
  startDate,
}: UseReservationTimesProps) {
  const [availableTimes, setAvailableTimes] = useState<TimeSlot[]>([]);
  const { time, setReservation } = useReservationStore();

  // ✅ API 호출 (변경 없음)
  useEffect(() => {
    if (!startDate) {
      setAvailableTimes([]);
      return;
    }

    const fetchTimes = async () => {
      try {
        const data = await getAvailableTimesApi(spaceId, year, month, day);
        setAvailableTimes(data.availableTimes || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchTimes();
  }, [spaceId, year, month, day, startDate]);

  // ✅ 30분 단위로 시간 쪼개는 함수 (변경 없음)
  const getTimeSlots = (startTime: string, endTime: string, interval = 30) => {
    const slots: string[] = [];
    let [startHour, startMin] = startTime.split(":").map(Number);
    const [endHour, endMin] = endTime.split(":").map(Number);

    const current = new Date();
    current.setHours(startHour, startMin, 0, 0);

    const end = new Date();
    end.setHours(endHour, endMin, 0, 0);

    while (current <= end) {
      const h = current.getHours().toString().padStart(2, "0");
      const m = current.getMinutes().toString().padStart(2, "0");
      slots.push(`${h}:${m}`);
      current.setMinutes(current.getMinutes() + interval);
    }

    return slots;
  };

  // ✅ 시작 시간 옵션 (변경 없음)
  const startTimeOptions = useMemo(() => {
    return availableTimes
      .flatMap((t) => {
        const slots = getTimeSlots(t.startTime, t.endTime);
        return slots.slice(0, -1);
      })
      .map((time) => ({ label: time, value: time }));
  }, [availableTimes]);

  // ✅ 종료 시간 옵션
  const endTimeOptions = useMemo(() => {
    if (!time?.start) {
      console.log("종료 구간 없음");
      return [];
    }

    const targetSlot = availableTimes.find(
      (t) => t.startTime <= time.start && time.start <= t.endTime
    );

    if (!targetSlot) {
      console.log("종료 구간 없음2");
      return [];
    }

    const slots = getTimeSlots(targetSlot.startTime, targetSlot.endTime);

    // 시작 시간 이후 최소 30분부터
    const startIndex = slots.findIndex((s) => s >= time.start); // 🔹 여기서 >= 로 수정
    if (startIndex === -1) {
      console.log("종료 구간 없음3");
      return [];
    }

    console.log(
      "종료 구간",
      slots.slice(startIndex + 1).map((t) => ({ label: t, value: t }))
    );

    // 첫 번째는 시작 시간이므로 제외하고, 실제 종료 시간부터 보여줌
    return slots.slice(startIndex + 1).map((t) => ({ label: t, value: t }));
  }, [availableTimes, time?.start]);

  // ✅ 시간 선택 핸들러 (변경 없음)
  const handleSelectTime = (start: string, end: string) => {
    setReservation({
      time: { start, end },
    });
  };

  return {
    reservationTime: time,
    startTimeOptions,
    endTimeOptions,
    handleSelectTime,
  };
}
