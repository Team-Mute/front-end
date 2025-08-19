"use client";

import React from "react";
import Calendar from "@/components/Calendar";
import {
  ModalContainer,
  Overlay,
  Header,
  CloseButton,
} from "./SpaceFormModal/styles";
import { IoCloseOutline } from "react-icons/io5";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (start: string, end?: string) => void;
}

const CalendarModal: React.FC<Props> = ({ isOpen, onClose, onSelect }) => {
  if (!isOpen) return null;

  return (
    <Overlay>
      <ModalContainer
        role="dialog"
        aria-modal="true"
        aria-labelledby="sfm-title"
      >
        {/* 1. Header */}
        <Header>
          <h2 id="sfm-title">하루 또는 기간 선택</h2>
          <CloseButton onClick={onClose} aria-label="닫기">
            <IoCloseOutline size={26} />
          </CloseButton>
        </Header>
        <Calendar />
      </ModalContainer>
    </Overlay>
  );
};

export default CalendarModal;
