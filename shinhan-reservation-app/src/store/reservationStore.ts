import { create } from "zustand";

type ReservationStore = {
  regionId: number | undefined;
  categoryId: number | undefined;
  capacity: number | undefined;
  startDate: Date | undefined;
  endDate: Date | undefined;
  time: { start: string; end: string } | undefined;
  facilities: string[];
  hasGptSearch: boolean; // GPT 검색 여부 플래그

  // 예약 확인 페이지에서 사용할 데이터
  spaceImageUrl: string | undefined;
  spaceName: string | undefined;
  spaceId: number | undefined;

  setReservation: (reservation: Partial<ReservationStore>) => void;
  clearReservation: () => void;
};

export const useReservationStore = create<ReservationStore>((set) => ({
  regionId: undefined,
  categoryId: undefined,
  capacity: undefined,
  startDate: undefined,
  endDate: undefined,
  time: undefined,
  facilities: [],
  hasGptSearch: false,

  // 예약 확인 페이지에서 사용할 데이터
  spaceImageUrl: undefined,
  spaceName: undefined,
  spaceId: undefined,

  setReservation: (reservation) =>
    set((state) => ({ ...state, ...reservation })),
  clearReservation: () =>
    set({
      regionId: undefined,
      categoryId: undefined,
      capacity: undefined,
      startDate: undefined,
      endDate: undefined,
      time: undefined,
      facilities: [],
      hasGptSearch: false,
    }),
}));
