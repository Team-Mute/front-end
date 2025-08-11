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
  title: string;
  subtitle: string;
}

const InfoModal = ({ isOpen, onClose, title, subtitle }: ScrollModalProps) => {
  if (!isOpen) return null;

  return (
    <Overlay>
      <ModalContainer>
        <TitleWrapper>
          <Title>{title}</Title>
        </TitleWrapper>
        <SubtitleWrapper>
          <SubTitle>{subtitle}</SubTitle>
        </SubtitleWrapper>

        <ButtonWrapper>
          <Button onClick={onClose} isActive={true} width={"50%"}>
            확인
          </Button>
        </ButtonWrapper>
      </ModalContainer>
    </Overlay>
  );
};

export default InfoModal;

const maxWidth = "353px";

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
  background-color: white;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  padding: 0 50px;
`;

const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-top: 40px;
  margin-bottom: 16px;
`;

const Title = styled.h2`
  font-weight: 600;
  font-size: 18px;
`;

const SubtitleWrapper = styled.div`
  text-align: center; // 가운데 정렬
  white-space: pre-wrap; // 줄바꿈(\n) 적용
  word-break: break-word; // 긴 단어도 줄바꿈 가능
  width: 100%;
  box-sizing: border-box;
`;

const SubTitle = styled.h5`
  font-weight: 500;
  font-size: 14px;
  color: ${colors.graycolor50};
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 24px;
  margin-bottom: 40px;
  width: 100%;
`;
