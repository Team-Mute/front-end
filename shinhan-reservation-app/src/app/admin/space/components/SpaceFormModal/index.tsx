"use client";

import React from "react";
import { IoCloseOutline } from "react-icons/io5";
import Button from "@/components/common/button/Button";
import Switch from "@/components/common/Switch";
import {
  CloseButton,
  Content,
  Footer,
  Header,
  ModalContainer,
  Overlay,
} from "./styles";
import Tabs from "./Tabs";
import SpaceSettingsForm from "./SpaceSettingsForm";
import OperatingTimeForm from "./OperatingTimeForm";
import { CATEGORIES, DAYS, REGIONS } from "@/constants/space";
import { OperatingTime, SpaceFormData } from "@/types/space";

interface SpaceFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Partial<SpaceFormData>;
  title: string;
  onSubmit: (data: SpaceFormData) => void;
}

const makeDefaultOperatingTimes = (): OperatingTime[] =>
  DAYS.map((d) => ({
    day: d,
    start: "09:00",
    end: "18:00",
    isOpen: true,
  }));

const makeInitialFormData = (init?: Partial<SpaceFormData>): SpaceFormData => ({
  title: init?.title ?? "",
  capacity: init?.capacity ?? null,
  region: init?.region ?? "",
  address: init?.address ?? "",
  category: init?.category ?? "",
  images: init?.images ?? [],
  amenities: init?.amenities ?? [],
  description: init?.description ?? "",
  process: init?.process ?? "",
  rules: init?.rules ?? "",
  active: init?.active ?? true,
  operatingTimes: init?.operatingTimes ?? makeDefaultOperatingTimes(),
  holidays: init?.holidays ?? [],
});

const SpaceFormModal: React.FC<SpaceFormModalProps> = ({
  isOpen,
  onClose,
  initialData,
  title,
  onSubmit,
}) => {
  const [activeTab, setActiveTab] = React.useState<"space" | "time">("space");
  const [form, setForm] = React.useState<SpaceFormData>(
    makeInitialFormData(initialData)
  );

  // 모달이 열릴 때마다 초기화하고 싶다면:
  React.useEffect(() => {
    if (isOpen) setForm(makeInitialFormData(initialData));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

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
          <h2 id="sfm-title">{title}</h2>
          <CloseButton onClick={onClose} aria-label="닫기">
            <IoCloseOutline size={26} />
          </CloseButton>
        </Header>

        {/* 2. Content (탭 + 내용) */}
        <Content>
          <Tabs
            activeKey={activeTab}
            onChange={(k) => setActiveTab(k as "space" | "time")}
            items={[
              {
                key: "space",
                label: "공간 설정",
                content: <SpaceSettingsForm value={form} onChange={setForm} />,
              },
              {
                key: "time",
                label: "운영시간 설정",
                content: <OperatingTimeForm value={form} onChange={setForm} />,
              },
            ]}
          />
        </Content>

        {/* 3. Footer */}
        <Footer>
          <Button onClick={() => onSubmit(form)} isActive={true}>
            완료
          </Button>
        </Footer>
      </ModalContainer>
    </Overlay>
  );
};

export default SpaceFormModal;
