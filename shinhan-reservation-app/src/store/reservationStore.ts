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
