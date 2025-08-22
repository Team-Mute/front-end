"use client";

import React, { useRef, useCallback, useEffect } from "react";
import styled from "@emotion/styled";
import colors from "@/styles/theme";
import Button from "../../components/common/button/Button";
import { IoCloseOutline } from "react-icons/io5";
import Input from "../../components/common/input/Input";
import { useSearchCompany } from "@/hooks/useSearchCompany";
import { FadeLoader } from "react-spinners";

interface ScrollModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCompany: (name: string) => void;
}

const SearchModal = ({
  isOpen,
  onClose,
  onSelectCompany,
}: ScrollModalProps) => {
  const {
    query,
    setQuery,
    results,
    search,
    loading,
    hasMore,
    loadMore,
    setResults,
    setPageNo,
    setHasMore,
  } = useSearchCompany();

  // const observer = React.useRef<IntersectionObserver | null>(null);
  // const lastElementRef = React.useCallback(
  //   (node: HTMLLIElement | null) => {
  //     if (loading) return;
  //     if (observer.current) observer.current.disconnect();

  //     observer.current = new IntersectionObserver((entries) => {
  //       if (entries[0].isIntersecting && hasMore) {
  //         loadMore();
  //       }
  //     });

  //     if (node) observer.current.observe(node);
  //   },
  //   [loading, hasMore, loadMore]
  // );

  const resultRef = useRef<HTMLDivElement | null>(null);
  const isFetchingRef = useRef(false);

  const handleScroll = useCallback(() => {
    if (!resultRef.current || loading || !hasMore || isFetchingRef.current)
      return;

    const { scrollTop, scrollHeight, clientHeight } = resultRef.current;
    const scrollRatio = (scrollTop + clientHeight) / scrollHeight;

    if (scrollRatio >= 0.7) {
      isFetchingRef.current = true;
      loadMore().finally(() => {
        isFetchingRef.current = false;
      });
    }
  }, [loading, hasMore, loadMore]);

  useEffect(() => {
    const el = resultRef.current;
    if (!el) return;

    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const [manualInput, setManualInput] = React.useState("");

  const reset = useCallback(() => {
    setManualInput("");
    setQuery("");
    setResults([]);
    setPageNo(1);
    setHasMore(true);
  }, []);

  const handleConfirm = () => {
    onSelectCompany(manualInput);
    reset();
    onClose();
  };

  const handleClickItem = (company: string) => {
    onSelectCompany(company);
    reset();
    onClose();
  };

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();

    setResults([]);
    search(); // 검색 수행
  };

  if (!isOpen) return null;

  return (
    <Overlay>
      <ModalContainer>
        <TitleWrapper>
          <Title>회사명 조회</Title>
          <IoCloseOutline
            size={30}
            onClick={() => {
              onClose();
              reset();
            }}
          />
        </TitleWrapper>

        <SearchForm onSubmit={handleSearch}>
          <SearchWrapper>
            <CompanyInputWrapper>
              <Input
                placeholder="회사명"
                width="100%"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </CompanyInputWrapper>

            <Button
              type="submit"
              isActive={true}
              width={91}
              onClick={handleSearch}
            >
              검색
            </Button>
          </SearchWrapper>
          <Result ref={resultRef}>
            <ul>
              {loading && results.length === 0 && (
                <LoaderOverlay>
                  <FadeLoader
                    color={colors.maincolor}
                    loading={loading}
                    height={15}
                    width={5}
                    radius={2}
                    margin={2}
                  />
                </LoaderOverlay>
              )}
              {results.map((company: string, idx: number) => {
                const isLast = idx === results.length - 1;
                return (
                  <ResultListItem
                    key={`${company}-${idx}`} // 문자열 + 인덱스 조합
                    // ref={isLast ? lastElementRef : null} // 마지막 아이템만 관찰
                    onClick={() => handleClickItem(company)}
                  >
                    {company}
                  </ResultListItem>
                );
              })}
            </ul>

            {/* 스크롤 페이징 로더 */}
            {loading && results.length > 0 && (
              <ScrollLoaderWrapper>
                <FadeLoader
                  color={colors.maincolor}
                  loading={loading}
                  height={15}
                  width={5}
                  radius={2}
                  margin={2}
                />
              </ScrollLoaderWrapper>
            )}
          </Result>
          <InputWrapper>
            <Input
              placeholder="직접 입력"
              width="100%"
              value={manualInput}
              onChange={(e) => setManualInput(e.target.value)}
            />
          </InputWrapper>
        </SearchForm>

        <ButtonWrapper>
          <Button onClick={handleConfirm} isActive={true}>
            확인
          </Button>
        </ButtonWrapper>
      </ModalContainer>
    </Overlay>
  );
};

export default SearchModal;

const maxWidth = "466px";
const maxHeight = "30rem";

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContainer = styled.div`
  position: relative; /* 기준 */

  max-width: ${maxWidth};
  max-height: ${maxHeight};
  //   height: ${maxHeight};
  background-color: white;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding: 0 72px;
`;

const TitleWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 40px;
  margin-bottom: 40px;
`;

const Title = styled.h2`
  font-weight: 600;
  font-size: 24px;
`;

const SearchForm = styled.form`
  display: flex;
  flex-direction: column;
`;

const SearchWrapper = styled.div`
  display: flex;
  margin-bottom: 12px;
`;

const CompanyInputWrapper = styled.div`
  width: 70.14%;
  margin-right: 12px;
`;

const Result = styled.div`
  position: relative; /* 로더를 이 박스 기준으로 배치 */

  min-height: 72px;
  max-height: 7.5rem;
  padding-top: 11px;
  padding-left: 12px;

  border: 1px solid ${colors.graycolor10};
  border-radius: 8px;
  margin-bottom: 12px;

  ul {
    list-style: none;
  }

  overflow-y: auto;
`;

const LoaderOverlay = styled.div`
  position: absolute;
  top: 0;
  inset: 0; /* top:0, left:0, right:0, bottom:0 단축 */

  transform: scale(0.7);

  // width: 100%;
  // height: 100%;
  background: rgba(255, 255, 255, 0.7); /* 약간 투명한 흰색 */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
`;

const ResultListItem = styled.li`
  font-size: 14px;
  font-weight: 500;
  color: ${colors.graycolor50};
  cursor: pointer;
  text-decoration: none;
  margin-bottom: 10px;

  &:hover {
    text-decoration: underline;
    color: ${colors.graycolor100};
  }
`;

const InputWrapper = styled.div`
  margin-bottom: 32px;
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 40px;
`;

const ScrollLoaderWrapper = styled.div`
  display: flex;
  justify-content: center;
  transform: scale(0.7);
  align-items: center;
  padding: 12px 0;
`;
