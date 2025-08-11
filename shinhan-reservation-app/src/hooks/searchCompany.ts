import { useState } from "react";

export function searchCompany() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const search = async () => {
    setLoading(true);
    // 여기에 API 호출 로직 (예: fetch or axios)
    // 예시: const res = await fetch(`/api/company?name=${query}`);
    // const data = await res.json();

    // 임시로 하드코딩
    const data = ["신한은행", "신한카드", "신한투자증권"];

    setResults(data);
    setLoading(false);
  };

  return { query, setQuery, results, search, loading };
}
