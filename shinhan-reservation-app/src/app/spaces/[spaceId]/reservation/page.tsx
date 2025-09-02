"use client";

import React, { useState, useEffect, useMemo } from "react";
import styled from "@emotion/styled";
import Image from "next/image";
import colors from "@/styles/theme";
import { useReservationStore } from "@/store/reservationStore";
import { getUserInfoApi } from "@/lib/api/userInfo";
import { ReservationPayload, ReservationRequest } from "@/types/reservation";
import {
  createReservationApi,
  getAvailableDatesApi,
  getAvailableTimesApi,
} from "@/lib/api/reservation"; // ⭐ 추가
import { format, addMinutes, isBefore, parse } from "date-fns"; // ⭐ 날짜 포맷팅을 위한 라이브러리 추가
import { ko } from "date-fns/locale"; // ⭐ 한국어 로케일 추가
import Checkbox from "@/components/common/Checkbox";
import UploadIcon from "@/styles/icons/upload.svg";
import CloseIcon from "@/styles/icons/close.svg";
import { useImgUpload } from "@/hooks/useImgUpload";
import { combineDateAndTime } from "@/lib/utils/combineDateTime";
import Input from "@/components/common/input/Input";
import Textarea from "@/components/common/input/Textarea";
import Calendar from "@/components/Calendar";
import Button from "@/components/common/button/Button";
import ChipGroup from "@/app/admin/space/components/SpaceFormModal/ChipGroup";
import { GapBox } from "@/app/admin/space/components/SpaceFormModal/styles";
import PrevisitTimeChipGroup from "./PrevisitTimeChipGroup";
import { createPrevisitApi } from "@/lib/api/previsit";
import { combine } from "zustand/middleware";
import Loading from "@/components/common/Loading";
import InfoModal from "@/components/modal/InfoModal";
import ReservationSuccessModal from "./ReservationSuccessModal";
import { useRouter } from "next/navigation";

// ⭐ 사용자 정보 타입 정의
interface UserInfo {
  userName: string;
  userEmail: string;
  userPhone: string;
}

// ⭐ 30분 단위로 시간을 생성하는 유틸리티 함수
const getTimeSlots = (start: string, end: string): string[] => {
  const slots: string[] = [];
  const startDateTime = parse(start, "HH:mm:ss", new Date());
  const endDateTime = parse(end, "HH:mm:ss", new Date());

  let currentTime = startDateTime;
  while (
    isBefore(currentTime, endDateTime) ||
    currentTime.getTime() === endDateTime.getTime()
  ) {
    slots.push(format(currentTime, "HH:mm"));
    currentTime = addMinutes(currentTime, 30);
  }
  return slots;
};

export default function ReservationConfirmPage() {
  const router = useRouter();
  // 안내 모달
  const [infoTitle, setInfoTitle] = useState("");
  const [infoContents, setInfoContents] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  // ⭐ 예약 완료 모달 관련 상태 추가
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const reservationStore = useReservationStore();
  const [user, setUser] = useState<UserInfo | null>(null);
  const [purpose, setPurpose] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [isPrevisitChecked, setIsPrevisitChecked] = useState(false);

  // ⭐ useImgUpload 훅 적용
  const {
    files,
    isDragging,
    inputRef,
    openPicker,
    onChange,
    onDrop,
    onDragOver,
    onDragEnter,
    onDragLeave,
    removeAt,
  } = useImgUpload(5);

  // ✅ 페이지 진입 시 사용자 정보 API 호출
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const userInfo = await getUserInfoApi(); // ⭐ API 호출
        setUser({
          userName: userInfo.userName,
          userEmail: userInfo.userEmail,
          userPhone: userInfo.userPhone,
        });
      } catch (err) {
        console.error("사용자 정보 로딩 실패:", err);
        // 오류 처리: 로컬 스토리지 등에서 정보 가져오기 또는 입력 필드 비활성화
      }

      console.log(reservationStore);
    };
    fetchUserInfo();
  }, []);

  // ✅ 예약 가능 날짜 조회
  useEffect(() => {
    if (!reservationStore.spaceId) return;
    const baseDate = new Date();
    const year = baseDate.getFullYear();
    const month = baseDate.getMonth() + 1;

    getAvailableDatesApi(Number(reservationStore.spaceId), year, month)
      .then((res) => setAvailableDates(res.availableDays))
      .catch((err) => console.error(err));

    console.log("이용 가능일", availableDates);
  }, [reservationStore.startDate]);

  const [availableDates, setAvailableDates] = useState<number[]>([]);

  const handleSubmit = async () => {
    // ⭐ 회의 목적을 입력하지 않았을 때 모달 띄우기
    if (purpose.trim() === "") {
      setInfoTitle("입력 오류");
      setInfoContents("사용 목적을 입력해 주세요.");
      setIsModalOpen(true);
      return;
    }
    // e.preventDefault();
    setIsLoading(true);

    try {
      const reservationPayload: ReservationPayload = {
        spaceId: reservationStore.spaceId || 0,
        reservationHeadcount: reservationStore.capacity || 0,
        reservationFrom:
          combineDateAndTime(
            reservationStore.startDate,
            reservationStore.time?.start,
            "start"
          ) ?? "",
        reservationTo:
          combineDateAndTime(
            reservationStore.startDate,
            reservationStore.time?.end,
            "end"
          ) ?? "",
        reservationPurpose: purpose,
      };

      const request: ReservationRequest = {
        requestDto: reservationPayload,
        files: files,
      };

      // 2. 예약 API 호출 및 reservationId 받기
      const reservationResponse = await createReservationApi(request);
      // 서버 응답이 reservationId를 포함한다고 가정
      const reservationId = reservationResponse.reservationId;

      let previsitSuccess = false;

      // 3. 사전답사가 체크되어 있다면 사전답사 API 호출
      if (isPrevisitChecked && selectedPrevisitDate && selectedPrevisitTime) {
        // 사전답사 시작 시간
        const previsitFromTime = selectedPrevisitTime;
        const [hour, minute] = previsitFromTime.split(":").map(Number);
        const previsitDate = new Date(selectedPrevisitDate);
        previsitDate.setHours(hour, minute, 0, 0);

        // 사전답사 종료 시간 (30분 후)
        const previsitToDate = addMinutes(previsitDate, 30);

        // API 호출을 위한 ISO 8601 형식으로 변환
        const previsitFrom = format(previsitDate, "yyyy-MM-dd'T'HH:mm:ss");
        const previsitTo = format(previsitToDate, "yyyy-MM-dd'T'HH:mm:ss");

        await createPrevisitApi(reservationId, previsitFrom, previsitTo);
        previsitSuccess = true;
      }

      let successMessage = "예약이 완료되었습니다.";
      if (previsitSuccess) {
        successMessage += " 사전답사 예약도 완료되었습니다.";
      }

      // ⭐ 성공 모달 띄우기
      setIsSuccessModalOpen(true);

      //   // 4. 예약 완료 메시지
      //   let alertMessage = "예약이 완료되었습니다.";
      //   if (previsitSuccess) {
      //     alertMessage += " 사전답사 예약도 완료되었습니다.";
      //   }
      //   alert(alertMessage);
    } catch (err) {
      console.error("예약 생성 실패:", err);
      // ⭐ 실패 모달 띄우기
      setInfoTitle("예약 실패");
      setInfoContents("예약에 실패했습니다. 다시 시도해 주세요.");
      setIsModalOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ 날짜와 시간 포맷팅
  const formattedDate = reservationStore.startDate
    ? format(reservationStore.startDate, "yyyy년 MM월 dd일 EEEE", {
        locale: ko,
      })
    : "";

  const timeDuration = (startTime: string, endTime: string) => {
    if (!startTime || !endTime) return "";
    const [startHour, startMin] = startTime.split(":").map(Number);
    const [endHour, endMin] = endTime.split(":").map(Number);
    const diffInMinutes = endHour * 60 + endMin - (startHour * 60 + startMin);
    const hours = Math.floor(diffInMinutes / 60);
    const minutes = diffInMinutes % 60;
    return `${hours}시간 ${minutes > 0 ? `${minutes}분` : ""}`.trim();
  };

  // ⭐ 사전 답사 관련 상태 추가
  const [selectedPrevisitDate, setSelectedPrevisitDate] = useState<Date | null>(
    null
  );
  const [availablePrevisitTimes, setAvailablePrevisitTimes] = useState<
    {
      startTime: string;
      endTime: string;
    }[]
  >([]);
  const [selectedPrevisitTime, setSelectedPrevisitTime] = useState("");

  const handleSelectDate = async (result: {
    single?: string;
    range?: [string, string];
  }) => {
    if (!reservationStore.spaceId) return;
    if (!result.single) return;

    const [year, month, day] = result.single.split(":").map(Number);
    const dateObject = new Date(year, month - 1, day);
    setSelectedPrevisitDate(dateObject);
    // 선택된 날짜에 대한 사전답사 가능 시간 API 호출
    const res = await getAvailableTimesApi(
      reservationStore.spaceId,
      year,
      month,
      day
    );
    setAvailablePrevisitTimes(res.availableTimes);
    // 날짜 선택 시 기존 시간 초기화
    setSelectedPrevisitTime("");
  };

  // ⭐ 오전/오후 시간 분리 및 ChipGroup에 맞게 포맷팅
  const { amOptions, pmOptions } = useMemo(() => {
    const allSlots: string[] = [];
    availablePrevisitTimes.forEach((slot) => {
      allSlots.push(...getTimeSlots(slot.startTime, slot.endTime));
    });

    const amSlots = allSlots.filter((slot) => {
      const hour = parseInt(slot.split(":")[0]);
      return hour < 12;
    });

    const pmSlots = allSlots.filter((slot) => {
      const hour = parseInt(slot.split(":")[0]);
      return hour >= 12;
    });

    return { amOptions: amSlots, pmOptions: pmSlots };
  }, [availablePrevisitTimes]);

  return (
    <Wrapper>
      <Loading isLoading={isLoading} />
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
              value={user?.userName || ""}
              disabled
              placeholder="이름"
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="email">이메일</Label>
            <Input
              id="email"
              type="email"
              value={user?.userEmail || ""}
              disabled
              placeholder="이메일"
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="phone">전화번호</Label>
            <PhoneInputWrapper>
              <Input
                width="7rem"
                type="text"
                maxLength={3}
                placeholder="010"
                value={user?.userPhone.slice(0, 3) || ""}
                disabled
              />
              <Input
                width="7rem"
                type="text"
                maxLength={4}
                placeholder="1234"
                value={user?.userPhone.slice(4, 8) || ""}
                disabled
              />
              <Input
                width="7rem"
                type="text"
                maxLength={4}
                placeholder="4567"
                value={user?.userPhone.slice(9, 13) || ""}
                disabled
              />
            </PhoneInputWrapper>
          </FormGroup>
          <FormGroup>
            <Label htmlFor="purpose">사용목적</Label>
            <Input
              id="purpose"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              placeholder="회의나 행사 등 공간의 사용 목적을 입력해주세요 "
            />
          </FormGroup>
          <PreReservationGroup>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <PreReservationLabel>
                사전답사 예약 (최대 30분)
              </PreReservationLabel>
              <Checkbox
                checked={isPrevisitChecked}
                onChange={() => setIsPrevisitChecked(!isPrevisitChecked)}
              />
            </div>
            {isPrevisitChecked && (
              <HiddenComponent>
                <Calendar
                  selectedDate={reservationStore.startDate}
                  availableDates={availableDates}
                  onSelectDate={handleSelectDate}
                  onMonthChange={(year, month) => {
                    getAvailableDatesApi(
                      Number(reservationStore.spaceId),
                      year,
                      month
                    )
                      .then((res) => setAvailableDates(res.availableDays))
                      .catch((err) => console.error(err));
                  }}
                />
                <InfoWrapper>
                  <InfoBox>
                    <Info color={colors.graycolor20}>
                      <div></div>
                      <p>오늘</p>
                    </Info>
                    <Info color={colors.maincolor}>
                      <div></div>
                      <p>선택</p>
                    </Info>
                  </InfoBox>
                </InfoWrapper>

                {/* ⭐ 오전/오후 ChipGroup 렌더링 */}
                <TimeBox>
                  <AM>
                    <span>오전</span>
                    <GapBox h="1rem" />
                    <PrevisitTimeChipGroup
                      options={amOptions}
                      selected={selectedPrevisitTime}
                      onToggle={setSelectedPrevisitTime}
                    />
                  </AM>
                  <GapBox h="1rem" />

                  <PM>
                    <span>오후</span>
                    <GapBox h="1rem" />

                    <PrevisitTimeChipGroup
                      options={pmOptions}
                      selected={selectedPrevisitTime}
                      onToggle={setSelectedPrevisitTime}
                    />
                  </PM>
                </TimeBox>
              </HiddenComponent>
            )}
          </PreReservationGroup>
          <FormGroup>
            <Label htmlFor="file-upload">첨부파일</Label>
            <SmallText>
              회의나 행사내용 및 일정에 참고가 될 파일을 업로드해 주세요
            </SmallText>
            <FileUploadContainer>
              <ImageUpload
                onClick={openPicker}
                onDragOver={onDragOver}
                onDragEnter={onDragEnter}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
                isDragging={isDragging}
              >
                <input
                  type="file"
                  ref={inputRef}
                  onChange={onChange}
                  multiple
                  hidden
                />
                <IconWrapper>
                  <UploadIcon />
                </IconWrapper>
              </ImageUpload>
              <FilePreviewList>
                {files.map((file, idx) => (
                  <FileItem key={idx}>
                    <FileName>{file.name}</FileName>
                    <CloseButton onClick={() => removeAt(idx)}>
                      <CloseIcon />
                    </CloseButton>
                  </FileItem>
                ))}
              </FilePreviewList>
            </FileUploadContainer>
          </FormGroup>
        </ReservationForm>

        {/* ⭐ 오른쪽: 예약 정보 요약 */}
        <ReservationInfoSection>
          <SubTitle>예약 정보</SubTitle>
          <DetailSection>
            <InfoItem>
              <InfoLabel>이용공간</InfoLabel>
              <InfoValue>
                <SpaceImageWrapper>
                  {reservationStore.spaceImageUrl && (
                    <SpaceImage
                      src={reservationStore.spaceImageUrl}
                      alt="space image"
                    />
                  )}
                </SpaceImageWrapper>
                <SpaceInfoText>{reservationStore.spaceName}</SpaceInfoText>
              </InfoValue>
            </InfoItem>

            <InfoItem>
              <InfoLabel>이용날짜</InfoLabel>
              <InfoValue>{formattedDate}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>이용시간</InfoLabel>
              <InfoValue>
                {reservationStore.time?.start}~{reservationStore.time?.end},{" "}
                {timeDuration(
                  reservationStore.time?.start || "",
                  reservationStore.time?.end || ""
                )}
              </InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>이용인원</InfoLabel>
              <InfoValue>{reservationStore.capacity || 0}명</InfoValue>
            </InfoItem>
            <Button
              type="button"
              isActive={true}
              width="100%"
              onClick={handleSubmit}
            >
              예약하기
            </Button>
          </DetailSection>
        </ReservationInfoSection>
      </ContentWrapper>
      <InfoModal
        isOpen={isModalOpen}
        title={infoTitle}
        subtitle={infoContents}
        onClose={async () => {
          setIsModalOpen(false);
        }}
      />
      {/* ⭐ 예약 성공 모달 렌더링 */}
      <ReservationSuccessModal
        isOpen={isSuccessModalOpen}
        title="예약 요청이 완료되었습니다"
        subtitle="예약은 평균 10분 이내에 확정돼요.
        나의 예약 현황은 마이페이지에서 확인할 수 있습니다."
        onConfirm={() => {
          setIsSuccessModalOpen(false);
          router.push("/mypage/reservations");
        }}
        onCancel={() => {
          setIsSuccessModalOpen(false);
          router.push("/");
        }}
      />
    </Wrapper>
  );
}

// 👇 아래부터 스타일 코드입니다. (변경 없음)
const Wrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 10rem;
  //   background-color: yellow;
  display: flex;
  flex-direction: column;

  @media (max-width: 1092px) {
    padding: 0 5rem;
  }

  @media (max-width: 838px) {
    padding: 0 2rem;
  }

  @media (max-width: 771px) {
    padding: 0 1rem;
  }

  @media (max-width: 768px) {
    // justify-content: center;
    align-items: center;
  }
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 2rem;
`;

const ContentWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const ReservationForm = styled.div`
  width: 22rem;
`;

const SubTitle = styled.h3`
  font-size: 1.25rem;
  font-style: normal;
  font-weight: 600;
  line-height: 2rem;

  padding-bottom: 1rem;
  margin-bottom: 1rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  font-size: 1rem;
  font-style: normal;
  font-weight: 500;
  line-height: normal;

  color: ${colors.graycolor50};
  margin-bottom: 0.5rem;
`;

const SmallText = styled.span`
  display: block;
  font-size: 0.875rem;
  color: ${colors.graycolor50};
  margin-top: 0.25rem;
`;

const PhoneInputWrapper = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ReservationInfoSection = styled.div`
  width: 24rem;
  border: 1px solid ${colors.graycolor10};
  border-radius: 0.75rem;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
`;

const SpaceImageWrapper = styled.div`
  width: 100%;
  //   position: relative;
  overflow: hidden;
  border-radius: 0.5rem;
  margin-bottom: 0.75rem;
`;

const SpaceImage = styled.img`
  width: 100%;
`;

const SpaceInfoText = styled.div`
  font-size: 1rem;
  color: ${colors.graycolor100};
  font-size: 1rem;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.5rem;
  padding: 0.5rem 0;
`;

const InfoLabel = styled.span`
  font-weight: 400;
  color: ${colors.graycolor50};
  font-size: 1rem;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
`;

const InfoValue = styled.span`
  font-weight: 500;
  color: ${colors.graycolor100};
  font-size: 1rem;
  font-style: normal;
  line-height: normal;
`;

const FileUploadContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1.5rem;
`;

const ImageUpload = styled.div<{ isDragging: boolean }>`
  position: relative;
  width: 6.25rem; // 100px
  height: 5.75rem; // 92px
  border-radius: 0.625rem;
  background-color: ${({ isDragging }) =>
    isDragging ? colors.maincolor5 : colors.graycolor5};
  color: ${colors.graycolor50};
  font-size: 0.75rem;
  font-weight: 500;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;
`;

const IconWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
`;

const FilePreviewList = styled.div`
  margin-top: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const FileItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  border-top: 1px solid ${colors.graycolor10};
  border-bottom: 1px solid ${colors.graycolor10};
  background-color: white;
  min-height: 3.5rem;
`;

const FileName = styled.span`
  flex: 1;
  margin-left: 0.5rem;
  font-size: 1rem;
  font-weight: 500;
  color: ${colors.graycolor50};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const PreReservationGroup = styled.div`
  display: flex;
  flex-direction: column;

  align-items: center;
  width: 100%;
  padding: 0.5rem 0;
  margin-bottom: 2rem;
`;

const PreReservationLabel = styled.label`
  font-size: 1rem;
  font-style: normal;
  font-weight: 500;
  line-height: 110%;
`;

const HiddenComponent = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  //   background-color: gray;
  padding-top: 1.5rem;
`;

const InfoWrapper = styled.div`
  margin-top: 0.75rem;
  height: 2.625rem;

  display: flex;
  justify-content: center;
`;

const InfoBox = styled.div`
  display: flex; /* Info들을 가로 배치 */
  gap: 1rem; /* Info끼리 간격 */
  border-top: 1px solid ${colors.graycolor5};
  width: 22.9rem;
  padding-top: 1rem;
  padding-bottom: 0.5rem;
`;

const Info = styled.div<{ color: string }>`
  display: flex; /* 동그라미 + 텍스트 가로 배치 */
  align-items: center;
  gap: 0.22rem; /* 동그라미와 글자 간격 */

  div {
    width: 0.68rem;
    height: 0.68rem;
    border-radius: 50%;
    background-color: ${(props) => props.color};
    flex-shrink: 0;
  }

  p {
    font-size: 0.875rem;
    color: ${colors.graycolor100};
  }
`;

const TimeBox = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 1rem;

  span {
    font-size: 1rem;
    font-style: normal;
    font-weight: 500;
    line-height: 110%; /* 1.1rem */
  }
`;

const AM = styled.div`
  display: flex;
  flex-direction: column;
`;
const PM = styled.div`
  display: flex;
  flex-direction: column;
`;

const DetailSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;
