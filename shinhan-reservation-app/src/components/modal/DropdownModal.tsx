import React from "react";
import styled from "@emotion/styled";
import colors from "@/styles/theme";
import Button from "../common/button/Button";
import { IoCloseOutline } from "react-icons/io5";

interface DropdownModalProps {
  onClose: () => void;
  title: string;
  children: React.ReactNode; // 모달 내부 내용
  onApply?: () => void; // 적용 버튼 클릭 시
  applyLabel?: string; // 적용 버튼 라벨
  isApplyActive?: boolean;
}

const DropdownModal = ({
  onClose,
  title,
  children,
  onApply,
  applyLabel = "적용하기",
  isApplyActive = false,
}: DropdownModalProps) => {
  return (
    <ModalContainer>
      <Header>
        <Title>{title}</Title>
        <CloseButton onClick={onClose}>
          <IoCloseOutline size={24} />
        </CloseButton>
      </Header>

      <Content>{children}</Content>

      {onApply && (
        <ButtonWrapper>
          <Button
            onClick={onApply}
            isActive={isApplyActive}
            width="100%"
            disabled={!isApplyActive}
          >
            {applyLabel}
          </Button>
        </ButtonWrapper>
      )}
    </ModalContainer>
  );
};

export default DropdownModal;

// --- styled ---
// const maxWidth = "22rem";

const ModalContainer = styled.div`
  position: relative;
  min-width: 22rem;

  margin-top: 0.5rem;

  z-index: 1000;
  background-color: white;

  width: 100%;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  border: 1px solid ${colors.graycolor10};
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  padding: 1.25rem;

  margin-bottom: 1rem;
`;

const Title = styled.h2`
  font-weight: 600;
  font-size: 1.125rem;
  line-height: 145%;
`;

const CloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Content = styled.div`
  width: 100%;

  padding: 1rem 1.25rem;
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;

  padding: 1.5rem 1.25rem;
`;
