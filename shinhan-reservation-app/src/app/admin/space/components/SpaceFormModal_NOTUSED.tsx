"use client";

import React, { useState } from "react";
import styled from "@emotion/styled";
import colors from "@/styles/theme";
import Button from "@/components/common/button/Button";
import { IoCloseOutline } from "react-icons/io5";
import UploadIcon from "@/styles/icons/upload.svg";
import Input from "@/components/common/input/Input";
import ScrollContainer from "react-indiana-drag-scroll";
import SelectBox from "@/components/common/selectbox/Selectbox";
import SelectBox2 from "@/components/common/selectbox/Selectbox2";
import IconButton from "@/components/common/button/IconButton";
import Textarea from "@/components/common/input/Textarea";
import Switch from "@/components/common/Switch";
import { ReactSortable } from "react-sortablejs";

interface SpaceFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: any;
  title: string;
  onSubmit: (data: any) => void;
}

const SpaceFormModal = ({
  isOpen,
  onClose,
  initialData,
  title,
  onSubmit,
}: SpaceFormModalProps) => {
  const [activeTab, setActiveTab] = useState<"space" | "time">("space");

  if (!isOpen) return null;

  return (
    <Overlay>
      <ModalContainer>
        {/* 1. Header */}
        <Header>
          <h2>{title}</h2>
          <CloseButton onClick={onClose}>
            <IoCloseOutline size={26} />
          </CloseButton>
        </Header>

        {/* 2. Content (탭 + 내용) */}
        <Content>
          {/* 탭바 */}
          <TabBar>
            <Tab
              active={activeTab === "space"}
              onClick={() => setActiveTab("space")}
            >
              공간 설정
            </Tab>
            <Tab
              active={activeTab === "time"}
              onClick={() => setActiveTab("time")}
            >
              운영시간 설정
            </Tab>
          </TabBar>

          {/* 탭 콘텐츠 */}
          <TabContent>
            {activeTab === "space" ? (
              <SpaceSettingsForm initialData={initialData} />
            ) : (
              <OperatingTimeForm />
            )}
          </TabContent>
        </Content>

        {/* 3. Footer */}
        <Footer>
          <Button onClick={() => onSubmit(initialData)} />
        </Footer>
      </ModalContainer>
    </Overlay>
  );
};

export default SpaceFormModal;

const paddingRight = 3.75;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContainer = styled.div`
  width: 29.375rem;
  max-width: 700px;
  height: 34.9rem;
  background: white;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  // overflow: hidden;
`;

const Header = styled.div`
  padding: 1.5rem 3.66rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  // background-color: beige;

  h2 {
    font-size: 1.5rem;
    font-weight: 600;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
`;

const Content = styled.div`
  flex: 1;
  height: 34.9rem; /* 고정 높이 */
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  padding-left: 3.56rem;
`;

const TabBar = styled.div`
  display: flex;
  border-bottom: 1px solid ${colors.graycolor20};
  gap: 1rem;

  margin-right: ${paddingRight}rem;
`;

const Tab = styled.button<{ active: boolean }>`
  // padding: 0.75rem 1rem;
  font-weight: 500;
  color: ${(p) => (p.active ? colors.graycolor100 : colors.graycolor50)};
  border-bottom: 1.5px solid
    ${(p) => (p.active ? colors.graycolor100 : "transparent")};
  cursor: pointer;
  line-height: 2.5rem;
  letter-spacing: -0.011rem;
  font-size: 1rem;
`;

const TabContent = styled.div`
  flex: 1;
  padding-top: 1.47rem;

  // background-color: beige;
`;

const Footer = styled.div`
  height: 5.875rem;
  padding: 1rem;
  border-top: 1px solid ${colors.graycolor20};
  display: flex;
  justify-content: center;
  align-items: center;
`;

const SpaceSettingsForm = ({ initialData }: { initialData?: any }) => {
  const regions = [
    { label: "지점 선택", value: "" },
    { label: "서울", value: "서울" },
    { label: "인천", value: "인천" },
    { label: "대구", value: "대구" },
    { label: "대전", value: "대전" },
  ];

  const [region, setRegion] = useState("");

  const categories = [
    { label: "카테고리 선택", value: "" },
    { label: "미팅룸", value: "미팅룸" },
    { label: "행사장", value: "행사장" },
    { label: "다목적", value: "다목적" },
  ];

  const [category, setCategory] = useState("");

  // 이미지 업로드 상태
  const [images, setImages] = useState<File[]>([]);

  // 파일 선택 핸들러
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const newFiles = Array.from(e.target.files);
    setImages((prev) => [...prev, ...newFiles].slice(0, 5)); // 최대 5개 제한
  };

  // 드래그 앤 드롭 파일 핸들러
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files);
      setImages((prev) => [...prev, ...newFiles].slice(0, 5)); // 최대 5개 제한
      e.dataTransfer.clearData();
    }

    setIsDragging(false);
  };

  // 드래그 오버 방지
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const [isDragging, setIsDragging] = useState(false);

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  // 이미지 업로드 클릭 시 input 클릭
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const handleUploadClick = () => fileInputRef.current?.click();

  // Chip 상태 관리
  const [chips, setChips] = useState<string[]>([
    "Wi-Fi",
    "화이트보드",
    "마이크",
    "TV",
    "빔프로젝터",
    "에어컨",
    "콘센트",
    "개인락커",
    "난방기",
    "인쇄기",
    "의자",
    "PC/노트북",
    "테이블",
    "라운지",
  ]);

  const [selectedChips, setSelectedChips] = useState<string[]>([]);
  const [newChip, setNewChip] = useState("");

  const toggleChip = (chip: string) => {
    setSelectedChips((prev) =>
      prev.includes(chip) ? prev.filter((c) => c !== chip) : [...prev, chip]
    );
  };

  const addChip = () => {
    if (newChip.trim() && !chips.includes(newChip.trim())) {
      setChips((prev) => [...prev, newChip.trim()]);
      setNewChip("");
    }
  };

  return (
    <FormContainer>
      {/* 1. 이미지 업로드 */}
      <SectionHeader>
        <span>공간 이미지 ({images.length}/5)</span>
        <DeleteAllImg onClick={() => setImages([])}>
          이미지 전체 삭제
        </DeleteAllImg>
      </SectionHeader>

      <StyledScrollContainer horizontal>
        {[...Array(5)].map((_, i) => (
          <ImageUpload key={i} onClick={handleUploadClick}>
            {images[i] ? (
              <>
                <img
                  src={URL.createObjectURL(images[i])}
                  alt={`업로드 이미지 ${i + 1}`}
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: "0.625rem",
                  }}
                />
                {i === 0 && <MainBadge>메인 사진</MainBadge>}
              </>
            ) : (
              <IconWrapper>
                <UploadIcon />
                <p>이미지 업로드</p>
              </IconWrapper>
            )}
          </ImageUpload>
        ))}
      </StyledScrollContainer>

      <ImageDropZone
        onClick={handleUploadClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        isDragging={isDragging}
      >
        <UploadIcon />
        <p>추가 이미지 업로드 ({5 - images.length}장 더 가능)</p>
        <small>드래그 하거나 클릭해서 업로드 JPG • PNG</small>
      </ImageDropZone>

      {/* 실제 파일 input */}
      <input
        type="file"
        multiple
        accept="image/*"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />

      {/* 2. 입력 필드들 */}
      <FieldWrapper>
        <Label>공간 이름</Label>

        <Input
          placeholder="공간명을 입력하세요"
          defaultValue={initialData?.title}
        />
      </FieldWrapper>

      <FieldWrapper>
        <Label>수용 인원</Label>
        <Input placeholder="수용 인원수를 입력하세요" />
      </FieldWrapper>

      <FieldWrapper>
        <Label>지점</Label>
        <SelectBox2 options={regions} value={region} onChange={setRegion} />

        <Input />
      </FieldWrapper>

      <FieldWrapper>
        <Label>공간 카테고리</Label>
        <SelectBox2
          options={categories}
          value={category}
          onChange={setCategory}
        />
      </FieldWrapper>

      <FieldWrapper>
        <Label>담당자</Label>
        <Input placeholder="담당자 이름을 적어주세요" />
      </FieldWrapper>

      <ChipsWrapper>
        <Label>
          편의시설 <span>(선택 {selectedChips.length}개)</span>
        </Label>
        <Chips>
          {chips.map((chip) => (
            <Chip
              key={chip}
              isSelected={selectedChips.includes(chip)}
              onClick={() => toggleChip(chip)}
            >
              {chip}
            </Chip>
          ))}
        </Chips>

        <Row>
          <Input
            placeholder="추가할 편의시설을 입력해주세요"
            width="16rem"
            value={newChip}
            onChange={(e) => setNewChip(e.target.value)}
          />
          <IconButton
            label="추가하기"
            color={colors.graycolor50}
            bgcolor={colors.graycolor5}
            onClick={addChip}
          />
        </Row>
      </ChipsWrapper>

      <FieldWrapper>
        <Label>공간 설명</Label>
        <Textarea />
      </FieldWrapper>

      <FieldWrapper>
        <Label>예약 과정</Label>
        <Textarea />
      </FieldWrapper>

      <FieldWrapper>
        <Label>이용 수칙</Label>
        <Textarea />
      </FieldWrapper>

      <FieldWrapper>
        <Label>공간 활성화</Label>
        <Switch />
      </FieldWrapper>
      <GapBox height="1.25rem" />
    </FormContainer>
  );
};

const OperatingTimeForm = () => {
  const days = ["월", "화", "수", "목", "금", "토", "일"];

  return (
    <FormContainer>
      <SectionHeader>운영시간 설정</SectionHeader>

      {days.map((day) => (
        <Operation key={day}>
          <h5>{day}</h5>
          <Input placeholder="시작 시간" width="6.75rem" />
          <h4>~</h4>
          <Input placeholder="종료 시간" width="6.75rem" />
          <SwitchWrapper>
            <Switch />
          </SwitchWrapper>

          <span>운영</span>
        </Operation>
      ))}

      <GapBox height="1.75rem" />
      <SectionHeader>
        <span>휴무일 설정</span>
        <button>공휴일 휴일 적용</button>
      </SectionHeader>

      <Row>
        <Input placeholder="YYYY-MM-DD" />
        <Input placeholder="YYYY-MM-DD" />
        <button>삭제</button>
      </Row>

      <button>추가하기</button>
    </FormContainer>
  );
};

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: auto;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  font-size: 0.875rem;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  letter-spacing: -0.00963rem;

  margin-bottom: 0.84rem;
  margin-right: ${paddingRight}rem;
`;

const DeleteAllImg = styled.div`
  border-radius: 0.25rem;
  border: 1px solid ${colors.graycolor10};
  padding: 0.38rem 0.5rem;

  color: ${colors.graycolor30};
  font-size: 0.625rem;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
  letter-spacing: -0.00688rem;

  cursor: pointer;
`;

const StyledScrollContainer = styled(ScrollContainer)`
  width: 100%;
  display: flex;
  gap: 0.5rem;

  margin-bottom: 0.75rem;

  // background-color: yellow;
`;

const IconWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
`;
const ImageUpload = styled.div`
  position: relative;

  min-width: 7.9375rem;
  height: 7.3125rem;
  padding: 1.875rem;

  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 0;

  border-radius: 0.625rem;
  background-color: ${colors.graycolor5};

  font-size: 0.75rem;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  letter-spacing: -0.00825rem;
  color: ${colors.graycolor50};
`;

const MainBadge = styled.div`
  position: absolute;
  top: 0.5rem;
  left: 0.5rem;

  background: ${colors.sementicFillStrong}66;
  color: white;
  font-size: 0.75rem;
  font-weight: bold;
  padding: 0.25rem 0.5rem;
  border-radius: 0.625rem;

  font-size: 0.625rem;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  letter-spacing: -0.00688rem;
`;
const ImageDropZone = styled.div<{ isDragging: boolean }>`
  border: 1px dashed ${colors.graycolor10};
  border-radius: 0.63rem;
  text-align: center;

  padding: 0.75rem 5.6875rem;
  margin-bottom: 1rem;
  margin-right: ${paddingRight}rem;

  color: ${colors.graycolor50};
  background-color: ${(props) =>
    props.isDragging ? colors.graycolor10 : "wthie"};

  p {
    font-size: 0.75rem;
    font-weight: 500;
    line-height: normal;
    letter-spacing: -0.00825rem;
  }

  small {
    font-size: 0.625rem;
    font-weight: 500;
    line-height: normal;
    letter-spacing: -0.00688rem;
    background-color: yellow;
  }
`;

const FieldWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
  margin-right: ${paddingRight}rem;
  // width: 100%;
`;

const Label = styled.label`
  color: var(--graycolor-100, #191f28);
  font-family: Pretendard;
  font-size: 0.875rem;
  font-style: normal;
  font-weight: 500;
  line-height: 1.5rem; /* 171.429% */
  letter-spacing: -0.00963rem;

  span {
    color: ${colors.graycolor50};
  }
`;

const ChipsWrapper = styled.div`
  margin-right: ${paddingRight}rem;
  margin-bottom: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  // background-color: green;
`;
const Chips = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.5rem;
`;

const Chip = styled.div<{ isSelected?: boolean }>`
  width: 5.14rem;
  border: 1px solid
    ${({ isSelected }) => (isSelected ? colors.maincolor : colors.graycolor10)};
  background-color: ${({ isSelected }) =>
    isSelected ? colors.maincolor5 : "transparent"};
  color: ${({ isSelected }) =>
    isSelected ? colors.maincolor : colors.graycolor50};
  border-radius: 0.5rem;
  text-align: center;
  cursor: pointer;

  display: flex;
  justify-content: center;
  align-items: center;

  font-size: 0.875rem;
  font-style: normal;
  font-weight: 500;
  line-height: 2.875rem; /* 328.571% */
  letter-spacing: -0.00963rem;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;

  height: 2.8rem;

  // background-color: yellow;
`;

const GapBox = styled.div<{ height: string }>`
  height: ${(props) => props.height};
`;

const Operation = styled.div`
  display: flex;
  align-items: center;
  height: 2.875rem;

  width: 100%;

  background-color: yellow;

  margin-bottom: 0.5rem;

  h4 {
    padding: 0 0.59rem;
  }
  h5 {
    font-size: 0.875rem;
    font-style: normal;
    font-weight: 500;
    line-height: 2.875rem; /* 328.571% */
    letter-spacing: -0.00963rem;

    margin-right: 1rem;
  }

  span {
    padding: 0 0.59rem;
    font-size: 0.75rem;
    font-style: normal;
    font-weight: 500;
    line-height: 2.875rem; /* 383.333% */
    letter-spacing: -0.00825rem;
  }
`;

const SwitchWrapper = styled.div`
  margin-left: 0.5rem;
`;
