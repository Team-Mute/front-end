
import styled from "@emotion/styled";
import { IoCloseOutline } from "react-icons/io5";
import Button from "@/components/common/button/Button";
import { formatDate, formatTimeRange, getStatusStyle } from '@/utils/reservationUtils';
import { Reservation } from "@/types/reservationAdmin";

// 모달 컴포넌트 props의 타입을 `Reservation`에 맞게 수정
interface BulkApproveModalProps {
    isOpen: boolean;
    reservations: Reservation[];
    onConfirm: () => void;
    onCancel: () => void;
}

const BulkApproveModal = ({ isOpen, reservations, onConfirm, onCancel }: BulkApproveModalProps) => {
    if (!isOpen) return null;

    return (
        <Overlay>
            <ModalContainer>
                <ModalHeader>
                     <ModalTitle>
                        {reservations.length > 1 ? '선택 승인' : '예약 승인'}
                    </ModalTitle>
                    <CloseButton onClick={onCancel}>
                        <IoCloseOutline size={24} color="#6b7280" />
                    </CloseButton>
                </ModalHeader>

                <ReservationListContainer>
                    {reservations.length > 0 ? (
                        reservations.map(res => (
                            <ReservationItem key={res.reservationId}>
                                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', alignItems: 'center' }}>
                                    <StatusTag css={getStatusStyle(res.statusId)} isApprovable={false}>
                                        {res.reservationStatusName}
                                    </StatusTag>
                                    <span style={{ fontWeight: 'bold', color: '#333', wordBreak: 'break-all' }}>
                                        {res.spaceName}
                                    </span>
                                    <span style={{ color: '#6b7280', fontSize: '0.75rem' }}>예약자명: {res.userName}</span>
                                    {res.isShinhan && <ShinhanTag>신한</ShinhanTag>}
                                    {res.isEmergency && <EmergencyTag>긴급</EmergencyTag>}
                                </div>

                                <div style={{ display: 'flex', gap: '0.25rem', fontSize: '0.875rem', color: '#4b5563', marginTop: '0.5rem' }}>
                                    <span>{formatDate(res.reservationFrom)}</span>
                                    <span>|</span>
                                    <span>{formatTimeRange(res.reservationFrom, res.reservationTo)}</span>
                                </div>

                                {res.previsits && res.previsits.length > 0 && (
                                    <>
                                    <div style={{ display: 'flex', gap: '0.25rem', fontSize: '0.875rem', color: '#4b5563', marginTop: '0.5rem' }}>
                                        <span>사전답사 {formatDate(res.previsits[0]?.previsitFrom)}</span>
                                        <span>|</span>
                                        <span>{formatTimeRange(res.previsits[0]?.previsitFrom, res.previsits[0]?.previsitTo)}</span>
                                    </div>
                                    </>
                                )}
                                </ReservationItem>
                        ))
                    ) : (
                        <p>선택된 예약이 없습니다.</p>
                    )}
                </ReservationListContainer>
                
                <ButtonWrapper>
                    <Button onClick={onConfirm} isActive={true} width={"98%"}>
                        {reservations.length > 1 ? '전체 승인하기' : '승인하기'}
                    </Button>
                </ButtonWrapper>
            </ModalContainer>
        </Overlay>
    );
};

export default BulkApproveModal;

// Modal 내부에서 사용되는 스타일 컴포넌트
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
  width: 32rem;
  background-color: white;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding: 1.5rem;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 1rem;
  margin-bottom: 1rem;
`;

const ModalTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
`;

const ReservationListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  overflow-y: auto;
  max-height: 25rem;
`;

const ReservationItem = styled.div`
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1rem;
  background-color: #f9fafb;
`;

const StatusTag = styled.span<{ isApprovable: boolean }>`
  background-color: ${(props) => (props.isApprovable ? "#d1fae5" : "#e5e7eb")};
  color: ${(props) => (props.isApprovable ? "#065f46" : "#4b5563")};
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
`;

const ShinhanTag = styled.span`
    /* 피그마 CSS 기반 스타일 적용 */
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 4px 8px;
    gap: 8px;

    background: #F2F6FF;
    border-radius: 4px;
    
    /* 텍스트 스타일 */
    font-size: 0.75rem; /* 피그마에 명시되지 않았지만, 다른 태그와 유사하게 적용 */
    font-weight: 700;
    color: #0046FF;
`;

const EmergencyTag = styled.span`
    /* 피그마 CSS 기반 스타일 적용 */
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 4px 8px;
    gap: 8px;

    background: #FFF2F2;
    border-radius: 4px;
    
    /* 텍스트 스타일 */
    font-size: 0.75rem; /* 피그마에 명시되지 않았지만, 다른 태그와 유사하게 적용 */
    font-weight: 700;
    color: #FF0000;
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 1.5rem;
  width: 100%;
`;