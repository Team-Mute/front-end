import React from "react";
import styled from "@emotion/styled";
import colors from "@/styles/theme";
import Button from "../common/button/Button";
import { IoCloseOutline } from "react-icons/io5";
import Input from "../common/input/Input";
import { searchCompany } from "@/hooks/searchCompany";

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
  const { query, setQuery, results, search, loading } = searchCompany();

  const [manualInput, setManualInput] = React.useState("");

  if (!isOpen) return null;
  const reset = () => {
    setManualInput("");
    results.length = 0;
    setQuery("");
  };
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

        <SearchForm>
          <SearchWrapper>
            <CompanyInputWrapper>
              <Input
                placeholder="회사명"
                width="100%"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </CompanyInputWrapper>

            <Button type="button" isActive={true} width={91} onClick={search}>
              검색
            </Button>
          </SearchWrapper>
          <Result>
            {loading && <p>검색 중...</p>}
            <ul>
              {results.map((company: string) => (
                <ResultListItem
                  key={company}
                  onClick={() => handleClickItem(company)}
                >
                  {company}
                </ResultListItem>
              ))}
            </ul>
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
const maxHeight = "508px";

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
  max-width: ${maxWidth};
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
  min-height: 72px;
  padding-top: 11px;
  padding-left: 12px;

  border: 1px solid ${colors.graycolor10};
  border-radius: 8px;
  margin-bottom: 12px;

  ul {
    list-style: none;
  }
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
