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
import { SpaceRequest, Operation } from "@/types/space";

interface SpaceFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Partial<SpaceRequest>;
  title: string;
  spaceId?: number; // 수정 시만 필요
  onSubmit: (data: SpaceRequest, spaceId?: number) => void;
}

const makeDefaultOperations = (): Operation[] => [
  { day: 1, from: "09:00", to: "18:00", isOpen: true },
  { day: 2, from: "09:00", to: "18:00", isOpen: true },
  { day: 3, from: "09:00", to: "18:00", isOpen: true },
  { day: 4, from: "09:00", to: "18:00", isOpen: true },
  { day: 5, from: "09:00", to: "18:00", isOpen: true },
  { day: 6, from: "10:00", to: "14:00", isOpen: true },
  { day: 7, from: "00:00", to: "00:00", isOpen: false },
];

const makeInitialFormData = (init?: Partial<SpaceRequest>): SpaceRequest => ({
  space: {
    spaceName: init?.space?.spaceName ?? "",
    spaceDescription: init?.space?.spaceDescription ?? "",
    spaceCapacity: init?.space?.spaceCapacity ?? 0,
    spaceIsAvailable: init?.space?.spaceIsAvailable ?? true,
    regionId: init?.space?.regionId ?? 0,
    categoryId: init?.space?.categoryId ?? 0,
    locationId: init?.space?.locationId ?? 0,
    tagNames: init?.space?.tagNames ?? [],
    userName: init?.space?.userName ?? "",
    reservationWay: init?.space?.reservationWay ?? "",
    spaceRules: init?.space?.spaceRules ?? "",
    operations: init?.space?.operations ?? makeDefaultOperations(),
    closedDays: init?.space?.closedDays ?? [],
  },
  images: init?.images ?? [],
});

const SpaceFormModal: React.FC<SpaceFormModalProps> = ({
  isOpen,
  onClose,
  initialData,
  title,
  spaceId,
  onSubmit,
}) => {
  const [activeTab, setActiveTab] = React.useState<"space" | "time">("space");
  const [form, setForm] = React.useState<SpaceRequest>(
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
          <Button onClick={() => onSubmit(form, spaceId)} isActive={true}>
            완료
          </Button>
        </Footer>
      </ModalContainer>
    </Overlay>
  );
};

export default SpaceFormModal;
