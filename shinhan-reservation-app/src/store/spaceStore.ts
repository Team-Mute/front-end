import { create } from "zustand";

export interface Space {
  id: number;
  imageUrl: string;
  title: string;
  region: string;
  manager: string;
  isPrivate: boolean;
  isDraft: boolean;
}

interface SpaceStore {
  spaces: Space[];
  addSpace: (space: Space) => void;
  removeSpace: (id: number) => void;
  updateSpace: (updated: Space) => void;
  filter: string;
  keyword: string;
  setFilter: (filter: string) => void;
  setKeyword: (keyword: string) => void;
}

export const useSpaceStore = create<SpaceStore>((set) => ({
  spaces: [
    // 예시 데이터

    {
      id: 1,
      imageUrl: "https://picsum.photos/600/400",
      title: "서울 회의실 A",
      region: "서울 강남구",
      manager: "홍길동",
      isPrivate: true,
      isDraft: false,
    },
    {
      id: 2,
      imageUrl: "https://picsum.photos/600/400",
      title: "서울 세미나실 B",
      region: "서울 강남구",
      manager: "김철수",
      isPrivate: false,
      isDraft: true,
    },
    {
      id: 3,
      imageUrl: "https://picsum.photos/600/400",
      title: "대전 컨퍼런스룸 C",
      region: "대전 서구",
      manager: "이영희",
      isPrivate: false,
      isDraft: false,
    },
    {
      id: 4,
      imageUrl: "https://picsum.photos/600/400",
      title: "대전 컨퍼런스룸 C",
      region: "대전 서구",
      manager: "김뮤트",
      isPrivate: false,
      isDraft: false,
    },
    {
      id: 5,
      imageUrl: "https://picsum.photos/600/400",
      title: "대전 컨퍼런스룸 C",
      region: "대전 서구",
      manager: "김뮤트",
      isPrivate: false,
      isDraft: false,
    },
    {
      id: 6,
      imageUrl: "https://picsum.photos/600/400",
      title: "대전 컨퍼런스룸 C",
      region: "대전 서구",
      manager: "김뮤트",
      isPrivate: false,
      isDraft: false,
    },
    {
      id: 7,
      imageUrl: "https://picsum.photos/600/400",
      title: "대전 컨퍼런스룸 C",
      region: "대전 서구",
      manager: "김뮤트",
      isPrivate: false,
      isDraft: false,
    },
  ],
  addSpace: (space) => set((state) => ({ spaces: [...state.spaces, space] })),
  removeSpace: (id) =>
    set((state) => ({ spaces: state.spaces.filter((s) => s.id !== id) })),
  updateSpace: (updated) =>
    set((state) => ({
      spaces: state.spaces.map((s) => (s.id === updated.id ? updated : s)),
    })),
  filter: "all",
  keyword: "",
  setFilter: (filter) => set({ filter }),
  setKeyword: (keyword) => set({ keyword }),
}));
