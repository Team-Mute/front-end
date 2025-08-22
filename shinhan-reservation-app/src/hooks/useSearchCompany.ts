import { searchCompanyApi } from "@/lib/api/company";
import { useCallback, useState, useRef } from "react";

export function useSearchCompany() {
  const [query, setQuery] = useState("");
  const [pageNo, setPageNo] = useState(1);
  const [results, setResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const abortControllerRef = useRef<AbortController | null>(null);

  // 검색 버튼 클릭 → 새 검색
  const search = useCallback(async () => {
    if (!query) return;
    setLoading(true);

    // 이전 요청 취소
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const response = await searchCompanyApi({ corpNm: query, pageNo: 1 });
      console.log("기업 검색", response);
      setResults(response.data.item);
      setPageNo(response.data.pageNo + 1); // 다음 요청용
      setHasMore(response.data.item.length > 0);
    } finally {
      setLoading(false);
    }
  }, [query]);

  // 스크롤 끝 → 추가 로드
  const loadMore = useCallback(async () => {
    if (!query || !hasMore) return;
    setLoading(true);
    try {
      const response = await searchCompanyApi({ corpNm: query, pageNo });
      console.log("스크롤 추가 로드", response);

      setResults((prev) => [...prev, ...response.data.item]);
      setPageNo(response.data.pageNo + 1); // 응답 pageNo 기반 증가
      setHasMore(response.data.item.length > 0);
    } finally {
      setLoading(false);
    }
  }, [query, pageNo, hasMore]);

  // async () => {
  //   setLoading(true);
  //   // 여기에 API 호출 로직 (예: fetch or axios)
  //   // 예시: const res = await fetch(`/api/company?name=${query}`);
  //   // const data = await res.json();

  //   // 임시로 하드코딩
  //   const data = ["신한은행", "신한카드", "신한투자증권"];

  //   setResults(data);
  //   setLoading(false);
  // };

  return {
    query,
    setQuery,
    results,
    search,
    loadMore,
    loading,
    hasMore,
    setResults,
    setHasMore,
    setPageNo,
  };
}
