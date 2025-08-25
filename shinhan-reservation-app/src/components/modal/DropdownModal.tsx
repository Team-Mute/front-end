import React from "react";
import styled from "@emotion/styled";
import colors from "@/styles/theme";
import Button from "../common/button/Button";
import { IoCloseOutline } from "react-icons/io5";

interface DropdownModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode; // 모달 내부 내용
  onApply?: () => void; // 적용 버튼 클릭 시
  applyLabel?: string; // 적용 버튼 라벨
}

const DropdownModal = ({
  isOpen,
  onClose,
  title,
  children,
  onApply,
  applyLabel = "적용",
}: DropdownModalProps) => {
  if (!isOpen) return null;

  return (
    <Overlay>
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
            <Button onClick={onApply} isActive={true} width="100%">
              {applyLabel}
            </Button>
          </ButtonWrapper>
        )}
      </ModalContainer>
    </Overlay>
  );
};

export default DropdownModal;

// --- styled ---
const maxWidth = "22rem";

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
  width: ${maxWidth};
  background-color: white;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding: 2.25rem 3.25rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
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
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 1.5rem;
  width: 100%;
`;
