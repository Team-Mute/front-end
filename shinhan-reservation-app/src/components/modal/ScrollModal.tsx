import React from "react";
import styled from "@emotion/styled";
import colors from "@/styles/theme";
import Button from "../common/button/Button";

interface ScrollModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: string;
}

const ScrollModal = ({ isOpen, onClose, children }: ScrollModalProps) => {
  if (!isOpen) return null;

  return (
    <Overlay>
      <ModalContainer>
        <Content dangerouslySetInnerHTML={{ __html: children }} />
        <ButtonWrapper>
          <Button onClick={onClose} isActive={true}>
            확인
          </Button>
        </ButtonWrapper>
      </ModalContainer>
    </Overlay>
  );
};

export default ScrollModal;

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
  width: 90%;
  max-width: 500px;
  height: 80vh;
  background: white;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const Content = styled.div`
  flex: 1;
  padding: 24px;
  overflow-y: auto;
  font-size: 14px;
  color: ${colors.graycolor100};
  line-height: 1.6;
`;

const ButtonWrapper = styled.div`
  padding: 12px 16px;
  border-top: 1px solid ${colors.graycolor20};
  display: flex;
  justify-content: center;
`;

const ConfirmButton = styled.button`
  background-color: ${colors.maincolor};
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }
`;
