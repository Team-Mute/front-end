// src/components/modal/reservationAdmin/DetailModal.tsx

import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { IoCloseOutline } from 'react-icons/io5';
import Button from '@/components/common/button/Button';
import { Reservation, ReservationDetail } from '@/types/reservationAdmin';
import { formatDate, formatTimeRange, getStatusStyle } from '@/utils/reservationUtils';
import { getReservationDetailApi } from '@/lib/api/admin/adminReservation';

interface DetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  reservationId: number | null;
  onApproveClick: (id: number) => void;
  onRejectClick: (id: number) => void;
}

const DetailModal: React.FC<DetailModalProps> = ({ 
  isOpen, 
  onClose, 
  reservationId, 
  onApproveClick,
  onRejectClick,
}) => {
  const [reservation, setReservation] = useState<ReservationDetail | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReservationDetails = async () => {
      if (!reservationId) {
        setReservation(null);
        return;
      }

      setIsLoading(true);
      setError(null);
      try {
        // API 호출: reservationId와 regionId를 파라미터로 전달
        const data = await getReservationDetailApi(reservationId);
        setReservation(data);
      } catch (err) {
        console.error("Failed to fetch reservation details", err);
        setError("예약 상세 정보를 불러오지 못했습니다.");
        setReservation(null);
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen) {
      fetchReservationDetails();
    }
  }, [isOpen, reservationId]);

  if (!isOpen) return null;

  if (isLoading) {
    return (
      <Overlay>
        <ModalContainer>
          <div>로딩 중...</div>
        </ModalContainer>
      </Overlay>
    );
  }

  if (error) {
    return (
      <Overlay>
        <ModalContainer>
          <div>{error}</div>
          <button onClick={onClose}>닫기</button>
        </ModalContainer>
      </Overlay>
    );
  }
  
  if (!reservation) {
    return (
      <Overlay>
        <ModalContainer>
          <div>예약 정보를 찾을 수 없습니다.</div>
          <button onClick={onClose}>닫기</button>
        </ModalContainer>
      </Overlay>
    );
  }
  
  const isPending = reservation.reservationStatusName === '승인 대기';

  return (
    <Overlay>
      <ModalContainer>
        <ModalHeader>
          <ModalTitle>상세 보기</ModalTitle>
          <CloseButton onClick={onClose}>
            <IoCloseOutline size={24} color="#6b7280" />
          </CloseButton>
        </ModalHeader>

        <ModalBody>
          <DetailSection>
            <SectionTitle>예약 정보</SectionTitle>
            <InfoRow>
              <InfoLabel>예약 상태</InfoLabel>
              <StatusBadge css={getStatusStyle(reservation.reservationStatusName)}>
                {reservation.reservationStatusName}
              </StatusBadge>
            </InfoRow>
            <InfoRow>
              <InfoLabel>예약 번호</InfoLabel>
              <InfoValue>{reservation.orderId}</InfoValue>
            </InfoRow>
            <InfoRow>
              <InfoLabel>공간명</InfoLabel>
              <InfoValue>{reservation.spaceName}</InfoValue>
            </InfoRow>
            <InfoRow>
              <InfoLabel>사용 목적</InfoLabel>
              <InfoValue>{reservation.reservationPurpose}</InfoValue>
            </InfoRow>
            <InfoRow>
              <InfoLabel>인원</InfoLabel>
              <InfoValue>{reservation.reservationHeadcount}명</InfoValue>
            </InfoRow>
          </DetailSection>

          <DetailSection>
            <SectionTitle>예약자 정보</SectionTitle>
            <InfoRow>
              <InfoLabel>예약자명</InfoLabel>
              <InfoValue>{reservation.user.name}</InfoValue>
            </InfoRow>
            <InfoRow>
              <InfoLabel>회사명</InfoLabel>
              <InfoValue>{reservation.user.company}</InfoValue>
            </InfoRow>
            <InfoRow>
              <InfoLabel>전화번호</InfoLabel>
              <InfoValue>{reservation.user.phone}</InfoValue>
            </InfoRow>
            <InfoRow>
              <InfoLabel>이메일</InfoLabel>
              <InfoValue>{reservation.user.email}</InfoValue>
            </InfoRow>
          </DetailSection>

          <DetailSection>
            <SectionTitle>예약 시간</SectionTitle>
            <InfoRow>
              <InfoLabel>날짜</InfoLabel>
              <InfoValue>{formatDate(reservation.reservationFrom)}</InfoValue>
            </InfoRow>
            <InfoRow>
              <InfoLabel>시간</InfoLabel>
              <InfoValue>{formatTimeRange(reservation.reservationFrom, reservation.reservationTo)}</InfoValue>
            </InfoRow>
          </DetailSection>
        </ModalBody>
        <ModalFooter>
          {isPending && (
            <TwoButtonWrapper>
              <Button onClick={() => onApproveClick(reservation.reservationId)} isActive={true} width="48%">
                승인하기
              </Button>
              <Button onClick={() => onRejectClick(reservation.reservationId)} isActive={false} width="48%">
                반려하기
              </Button>
            </TwoButtonWrapper>
          )}
        </ModalFooter>
      </ModalContainer>
    </Overlay>
  );
};

export default DetailModal;

// styled components (생략, 기존과 동일)
const Overlay = styled.div` ... `;
const ModalContainer = styled.div` ... `;
const ModalHeader = styled.div` ... `;
const ModalTitle = styled.h2` ... `;
const CloseButton = styled.button` ... `;
const ModalBody = styled.div` ... `;
const ModalFooter = styled.div` ... `;
const DetailSection = styled.div` ... `;
const SectionTitle = styled.h3` ... `;
const InfoRow = styled.div` ... `;
const InfoLabel = styled.span` ... `;
const InfoValue = styled.span` ... `;
const StatusBadge = styled.span` ... `;
const TwoButtonWrapper = styled.div`
  display: flex;
  gap: 1rem;
  width: 100%;
  justify-content: center;
`;