"use client";

import React, { useState } from "react";
import styled from "@emotion/styled";
import Image from "next/image";
import colors from "@/styles/theme";

// ✨ 실제 데이터에 맞게 타입을 정의하거나 수정하세요.
interface ReservationData {
  spaceName: string;
  spaceAddress: string;
  spaceImageUrl: string;
  date: string;
  timeRange: string;
  duration: string;
  capacity: string;
}

// ✨ ReservationConfirmPage 컴포넌트
export default function ReservationConfirmPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [purpose, setPurpose] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [agree, setAgree] = useState(false);

  // ⭐ 예시 데이터 (실제 데이터는 prop 등으로 전달받아야 함)
  const reservationData: ReservationData = {
    spaceName: "명동 신한스퀘어브릿지 지하1층 메인홀",
    spaceAddress: "서울특별시 중구 명동10길 52",
    spaceImageUrl: "/images/reservation-space-placeholder.png", // 실제 이미지 URL로 변경
    date: "2025년 08월 06일 수요일",
    timeRange: "14:00~16:00",
    duration: "2시간",
    capacity: "5명",
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // ✅ 예약 로직 구현
    console.log("예약 정보:", { name, email, phone, purpose, file, agree });
  };

  return (
    <Wrapper>
      <Title>예약확인</Title>
      <ContentWrapper>
        {/* ⭐ 왼쪽: 예약자 정보 입력 폼 */}
        <ReservationForm>
          <SubTitle>예약자 정보</SubTitle>
          <FormGroup>
            <Label htmlFor="name">예약자 이름</Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="윤소연"
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="email">이메일</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="yololife@naver.com"
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="phone">전화번호</Label>
            <PhoneInputWrapper>
              <PhoneInput
                type="text"
                maxLength={3}
                placeholder="010"
                value={phone.slice(0, 3)}
                onChange={(e) => setPhone(e.target.value)}
              />
              <PhoneInput
                type="text"
                maxLength={4}
                placeholder="1234"
                value={phone.slice(3, 7)}
                onChange={(e) => setPhone(e.target.value)}
              />
              <PhoneInput
                type="text"
                maxLength={4}
                placeholder="4567"
                value={phone.slice(7, 11)}
                onChange={(e) => setPhone(e.target.value)}
              />
            </PhoneInputWrapper>
          </FormGroup>
          <FormGroup>
            <Label htmlFor="purpose">사용목적</Label>
            <Textarea
              id="purpose"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              placeholder="회의나 행사 공간의 사용 목적을 입력해주세요"
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="pre-reservation">
              사전답사 예약 <SmallText>(최대 30분)</SmallText>
            </Label>
            <CheckboxWrapper onClick={() => setAgree(!agree)}>
              {agree && <CheckboxIcon src="/icons/check.svg" alt="checked" />}
            </CheckboxWrapper>
          </FormGroup>
          <FormGroup>
            <Label htmlFor="file-upload">첨부파일</Label>
            <SmallText>
              회의나 행사내용 및 일정에 참고가 될 파일을 업로드해 주세요
            </SmallText>
            <FileUploadWrapper>
              <input
                id="file-upload"
                type="file"
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
              <label htmlFor="file-upload">
                <UploadIcon src="/icons/upload.svg" alt="upload" />
              </label>
            </FileUploadWrapper>
          </FormGroup>
        </ReservationForm>

        {/* ⭐ 오른쪽: 예약 정보 요약 */}
        <ReservationInfoSection>
          <SubTitle>예약 정보</SubTitle>
          <SpaceImageWrapper>
            <Image
              src={reservationData.spaceImageUrl}
              alt="space image"
              width={250}
              height={150}
              layout="responsive"
            />
          </SpaceImageWrapper>
          <SpaceInfoText>{reservationData.spaceName}</SpaceInfoText>
          <InfoItem>
            <InfoLabel>이용날짜</InfoLabel>
            <InfoValue>{reservationData.date}</InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>이용시간</InfoLabel>
            <InfoValue>
              {reservationData.timeRange}, {reservationData.duration}
            </InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>이용인원</InfoLabel>
            <InfoValue>{reservationData.capacity}</InfoValue>
          </InfoItem>
          <ReserveButton onClick={handleSubmit}>예약하기</ReserveButton>
        </ReservationInfoSection>
      </ContentWrapper>
    </Wrapper>
  );
}

// 👇 아래부터 스타일 코드입니다.
const Wrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 2rem;
`;

const ContentWrapper = styled.div`
  display: flex;
  gap: 2rem;
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const ReservationForm = styled.form`
  flex: 1;
`;

const SubTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  border-bottom: 1px solid ${colors.graycolor10};
  padding-bottom: 1rem;
  margin-bottom: 1.5rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  font-size: 1rem;
  font-weight: 500;
  color: ${colors.graycolor50};
  margin-bottom: 0.5rem;
`;

const SmallText = styled.span`
  display: block;
  font-size: 0.875rem;
  color: ${colors.graycolor50};
  margin-top: 0.25rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid ${colors.graycolor30};
  border-radius: 0.5rem;
  font-size: 1rem;
  &::placeholder {
    color: ${colors.graycolor50};
  }
`;

const PhoneInputWrapper = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const PhoneInput = styled(Input)`
  flex: 1;
`;

const Textarea = styled.textarea`
  width: 100%;
  min-height: 5rem;
  padding: 0.75rem 1rem;
  border: 1px solid ${colors.graycolor30};
  border-radius: 0.5rem;
  font-size: 1rem;
  resize: vertical;
  &::placeholder {
    color: ${colors.graycolor50};
  }
`;

const CheckboxWrapper = styled.div`
  width: 1.25rem;
  height: 1.25rem;
  border: 1px solid ${colors.graycolor30};
  border-radius: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin-top: 0.5rem;
`;

const CheckboxIcon = styled.img`
  width: 1rem;
  height: 1rem;
`;

const FileUploadWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 4rem;
  height: 4rem;
  border: 1px solid ${colors.graycolor30};
  border-radius: 0.5rem;
  cursor: pointer;
  margin-top: 0.5rem;
`;

const UploadIcon = styled.img`
  width: 2rem;
  height: 2rem;
`;

const ReservationInfoSection = styled.div`
  flex: 1;
  border: 1px solid ${colors.graycolor10};
  border-radius: 0.75rem;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const SpaceImageWrapper = styled.div`
  width: 100%;
  height: 200px;
  position: relative;
  overflow: hidden;
  border-radius: 0.5rem;
`;

const SpaceInfoText = styled.div`
  font-size: 1rem;
  font-weight: 500;
  color: ${colors.graycolor50};
`;

const InfoItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid ${colors.graycolor10};
`;

const InfoLabel = styled.span`
  font-size: 0.875rem;
  font-weight: 400;
  color: ${colors.graycolor50};
`;

const InfoValue = styled.span`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${colors.graycolor50};
`;

const ReserveButton = styled.button`
  width: 100%;
  padding: 1rem;
  border: none;
  border-radius: 0.5rem;
  background-color: ${colors.graycolor100};
  color: white;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 1rem;
  &:disabled {
    background-color: ${colors.graycolor30};
    cursor: not-allowed;
  }
`;
