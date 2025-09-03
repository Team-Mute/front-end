import { create } from "zustand";

type FilterStore = {
  regionId: number | undefined;
  categoryId: number | undefined;
  capacity: number | undefined;
  startDate: Date | undefined;
  endDate: Date | undefined;
  time: { start: string; end: string } | undefined;
  facilities: string[];
  hasGptSearch: boolean; // ✅ GPT 검색 여부 플래그

  setFilters: (filters: Partial<FilterStore>) => void;
  clearFilters: () => void;
};

export const useFilterStore = create<FilterStore>((set) => ({
  regionId: 1,
  categoryId: undefined,
  capacity: undefined,
  startDate: undefined,
  endDate: undefined,
  time: undefined,
  facilities: [],
  hasGptSearch: false,

  setFilters: (filters) => set((state) => ({ ...state, ...filters })),
  clearFilters: () =>
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
