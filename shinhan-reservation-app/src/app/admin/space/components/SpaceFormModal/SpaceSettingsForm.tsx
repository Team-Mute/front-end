"use client";

import React, { useMemo, useRef, useState } from "react";
import {
  DeleteAllImg,
  Field,
  GapBox,
  IconWrapper,
  ImageDropZone,
  ImageUpload,
  Label,
  MainBadge,
  Row,
  SectionHeader,
  StyledScrollContainer,
} from "./styles";
import colors from "@/styles/theme";
import Input from "@/components/common/input/Input";
import Textarea from "@/components/common/input/Textarea";
import IconButton from "@/components/common/button/IconButton";
import UploadIcon from "@/styles/icons/upload.svg";
import SelectBox2 from "@/components/common/selectbox/Selectbox2";
import ChipGroup from "./ChipGroup";
import { useImgUpload } from "@/hooks/useImgUpload";
import { CATEGORIES, DEFAULT_AMENITIES, REGIONS } from "@/constants/space";
import { SpaceFormData } from "@/types/space";
import Switch from "@/components/common/Switch";
import RemovableChipGroup from "./RemovableChipGroup";

interface Props {
  value: SpaceFormData;
  onChange: (next: SpaceFormData) => void;
}

const SpaceSettingsForm: React.FC<Props> = ({ value, onChange }) => {
  const {
    files,
    isDragging,
    inputRef,
    openPicker,
    onChange: onFileChange,
    onDrop,
    onDragEnter,
    onDragLeave,
    onDragOver,
    clear,
    removeAt,
    move,
  } = useImgUpload(5);

  // 외부 value.images와 동기화
  React.useEffect(() => {
    if (value.images !== files) {
      onChange({ ...value, images: files });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [files]);

  // preview URL 캐시 (메모리 누수 방지)
  const urlsRef = useRef<string[]>([]);
  const previews = useMemo(() => {
    // revoke 이전 URL
    urlsRef.current.forEach((u) => URL.revokeObjectURL(u));
    const next = files.map((f) => URL.createObjectURL(f));
    urlsRef.current = next;
    return next;
  }, [files]);

  // amenities
  const [options, setOptions] = useState<string[]>(
    Array.from(new Set([...DEFAULT_AMENITIES, ...value.amenities]))
  );

  const [customAmenities, setCustomAmenities] = useState<string[]>([]);

  const [newChip, setNewChip] = useState("");

  const toggleAmenity = (chip: string) => {
    const exists = value.amenities.includes(chip);
    const next = exists
      ? value.amenities.filter((c) => c !== chip)
      : [...value.amenities, chip];
    onChange({ ...value, amenities: next });
  };

  const addChip = () => {
    const v = newChip.trim();
    if (!v) return;
    // 새 칩만 customAmenities에 추가
    if (!customAmenities.includes(v)) {
      setCustomAmenities((prev) => [...prev, v]);
    }
    setNewChip("");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {/* 1. 이미지 업로드 */}
      <SectionHeader>
        <span>공간 이미지 ({files.length}/5)</span>
        <DeleteAllImg onClick={clear}>이미지 전체 삭제</DeleteAllImg>
      </SectionHeader>

      <StyledScrollContainer horizontal>
        {[...Array(5)].map((_, i) => (
          <ImageUpload key={i} onClick={openPicker}>
            {files[i] ? (
              <>
                <img
                  src={previews[i]}
                  alt={`업로드 이미지 ${i + 1}`}
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: "0.625rem",
                    objectFit: "cover",
                  }}
                />
                {i === 0 && <MainBadge>메인 사진</MainBadge>}
                {/* 삭제 버튼 (옵션) */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeAt(i);
                  }}
                  style={{
                    position: "absolute",
                    top: 6,
                    right: 6,
                    background: "#0008",
                    color: "#fff",
                    borderRadius: 6,
                    padding: "2px 6px",
                    fontSize: 10,
                  }}
                >
                  삭제
                </button>
                {/* 간단 이동(왼/오) */}
                <div style={{ position: "absolute", bottom: 6, right: 6 }}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (i > 0) move(i, i - 1);
                    }}
                  >
                    ◀
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (i < files.length - 1) move(i, i + 1);
                    }}
                  >
                    ▶
                  </button>
                </div>
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
        onClick={openPicker}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        isDragging={isDragging}
      >
        <UploadIcon />
        <p>추가 이미지 업로드 ({5 - files.length}장 더 가능)</p>
        <small>드래그 하거나 클릭해서 업로드 JPG • PNG</small>
      </ImageDropZone>

      <input
        type="file"
        multiple
        accept="image/*"
        ref={inputRef}
        style={{ display: "none" }}
        onChange={onFileChange}
      />

      {/* 2. 필드 */}
      <Field>
        <Label>공간 이름</Label>
        <Input
          placeholder="공간명을 입력하세요"
          value={value.title}
          onChange={(e) => onChange({ ...value, title: e.target.value })}
        />
      </Field>

      <Field>
        <Label>수용 인원</Label>
        <Input
          placeholder="수용 인원수를 입력하세요"
          value={value.capacity ?? ""}
          onChange={(e) =>
            onChange({
              ...value,
              capacity: e.target.value ? Number(e.target.value) : null,
            })
          }
        />
      </Field>

      <Field>
        <Label>지점</Label>
        <SelectBox2
          options={REGIONS}
          value={value.region}
          onChange={(v: string) => onChange({ ...value, region: v })}
        />
        <Input
          placeholder="상세 주소"
          value={value.address}
          onChange={(e) => onChange({ ...value, address: e.target.value })}
        />
      </Field>

      <Field>
        <Label>공간 카테고리</Label>
        <SelectBox2
          options={CATEGORIES}
          value={value.category}
          onChange={(v: string) => onChange({ ...value, category: v })}
        />
      </Field>

      <Field>
        <Label>
          편의시설 <span>(선택 {value.amenities.length}개)</span>
        </Label>
        <ChipGroup
          options={DEFAULT_AMENITIES}
          selected={value.amenities}
          onToggle={toggleAmenity}
        />
        <Row>
          <Input
            placeholder="추가할 편의시설을 입력해주세요"
            width="16rem"
            value={newChip}
            onChange={(e) => setNewChip(e.target.value)}
          />
          <IconButton
            label="추가하기"
            color={newChip.trim() ? "white" : colors.graycolor50}
            bgcolor={newChip.trim() ? colors.maincolor : colors.graycolor5}
            onClick={addChip}
            disabled={!newChip.trim()}
          />
        </Row>
        {/* ✅ 새 칩 (삭제 가능) */}
        <RemovableChipGroup
          chips={customAmenities}
          onRemove={(chip) => {
            setCustomAmenities((prev) => prev.filter((c) => c !== chip));
            onChange({
              ...value,
              amenities: value.amenities.filter((c) => c !== chip),
            });
          }}
        />
      </Field>

      <Field>
        <Label>공간 설명</Label>
        <Textarea
          value={value.description}
          onChange={(e) => onChange({ ...value, description: e.target.value })}
        />
      </Field>

      <Field>
        <Label>예약 과정</Label>
        <Textarea
          value={value.process}
          onChange={(e) => onChange({ ...value, process: e.target.value })}
        />
      </Field>

      <Field>
        <Label>이용 수칙</Label>
        <Textarea
          value={value.rules}
          onChange={(e) => onChange({ ...value, rules: e.target.value })}
        />
      </Field>
      <Field>
        <Label>공간 활성화</Label>
        <Switch />
      </Field>

      <GapBox h="1.25rem" />
    </div>
  );
};

export default SpaceSettingsForm;
