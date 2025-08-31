 "use client";
// export default function DashboardPage() {
//   return <h1>예약관리 페이지</h1>;
// }

/** @jsxImportSource @emotion/react */
/** @jsxImportSource @emotion/react */

import React, { useEffect, useState } from 'react';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { FaChevronDown } from 'react-icons/fa';
import { IoCheckmarkSharp } from 'react-icons/io5'; // 체크마크 아이콘 추가
import { getReservationApi, postApproveReservationsApi, postRejectReservationApi } from '@/lib/api/admin/adminReservation';
import { Previsit, Reservation, ReservationResponse, ReservationsParams } from "@/types/reservationAdmin";
import InfoModal from '@/components/modal/InfoModal';
import BulkApproveModal from '@/components/modal/reservationAdmin/BulkApproveModal';
import { formatDate, formatTimeRange, getStatusStyle } from '@/utils/reservationUtils';
import RejectModal from '@/components/modal/reservationAdmin/RejectModal';

const ReservationManagementPage: React.FC = () => {
       // 1. API 데이터 및 로딩 관련 상태
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // 2. 검색 및 필터링 관련 상태
    const [keyword, setKeyword] = useState('');
    const [selectedStatusId, setSelectedStatusId] = useState<number | null>(null);
    const [selectedRegionId, setSelectedRegionId] = useState<number | null>(null);
    const [isShinhanOnly, setIsShinhanOnly] = useState(false);
    const [isEmergencyOnly, setIsEmergencyOnly] = useState(false);

    // 3. 드롭다운 UI 상태
    const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState('예약 상태 전체');
    const [isBranchDropdownOpen, setIsBranchDropdownOpen] = useState(false);
    const [selectedBranch, setSelectedBranch] = useState('지점');

    // 4. 페이지네이션 관련 상태
    const [uiCurrentPage, setUiCurrentPage] = useState(1); 
    const [totalPages, setTotalPages] = useState(1);
    
    // 5. 체크박스 선택 관련 상태
    const [selectedItems, setSelectedItems] = useState<number[]>([]);
    
    //6. 모달
    const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
    const [infoModalTitle, setInfoModalTitle] = useState('');
    const [infoModalSubtitle, setInfoModalSubtitle] = useState('');
    const [isBulkConfirmModalOpen, setIsBulkConfirmModalOpen] = useState(false); // 일괄 승인 모달
    const [reservationsToApprove, setReservationsToApprove] = useState<Reservation[]>([]); // 일괄 승인 모달에 표시할 예약 객체
    
    // 반려
    const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
    const [selectedReservationIdToReject, setSelectedReservationIdToReject] = useState<number | null>(null);
    const [rejectionReason, setRejectionReason] = useState('');

    const statusMap = { /* ... */ };
    const branchMap = { /* ... */ };
    const statusOptions = Object.keys(statusMap);
    const branchOptions = Object.keys(branchMap);

    //API 호출 로직을 분리한 함수로 대체
     const loadReservations = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await getReservationApi({
                page: uiCurrentPage, 
                keyword,
                statusId: selectedStatusId,
                regionId: selectedRegionId,
                isShinhanOnly,
                isEmergencyOnly,
            });
            
            setReservations(data.content);
            setTotalPages(data.totalPages);
            
        } catch (err) {
            // 에러 발생 시 `showAlertModal` 호출
            showAlertModal('오류 발생', '데이터를 불러오지 못했습니다. 다시 시도해주세요.');
        } finally {
            setIsLoading(false);
        }
    };
    
   // 첫 페이지 로딩 시에만 호출
    useEffect(() => {
        loadReservations();
    }, []); // 의존성 배열을 비워 첫 렌더링 시에만 실행


    // UI 핸들러 함수들
    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
        // 승인 가능한 모든 예약의 ID만 가져옴
        const allApprovableIds = approvableReservations.map(res => res.reservationId);
        setSelectedItems(allApprovableIds);
    } else {
        setSelectedItems([]);
    }
};

    const handleSelectItem = (id: number, e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelectedItems(prev => [...prev, id]);
        } else {
            setSelectedItems(prev => prev.filter(item => item !== id));
        }
    };
    
    // 수정된 예약 상태 핸들러
    const handleStatusSelect = (status: string) => {
        // 'status'가 statusMap의 유효한 키라고 타입 단언
        setSelectedStatus(status);
        setSelectedStatusId(statusMap[status as keyof typeof statusMap]);
        setIsStatusDropdownOpen(false);
        setUiCurrentPage(1); 
        loadReservations(); 
    };

    // 수정된 지점 핸들러
    const handleBranchSelect = (branch: string) => {
        // 'branch'가 branchMap의 유효한 키라고 타입 단언
        setSelectedBranch(branch);
        setSelectedRegionId(branchMap[branch as keyof typeof branchMap]);
        setIsBranchDropdownOpen(false);
        setUiCurrentPage(1); 
        loadReservations();
    };

    // 페이지 변경 핸들러는 uiCurrentPage 상태만 변경합니다.
    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setUiCurrentPage(page);
             loadReservations();
        }
    };

     // 개별 승인 버튼 핸들러
    const handleApprove = (reservationId: number) => {
    // 단건 승인을 위해 선택된 예약 객체 하나를 찾아서 배열에 담습니다.
    const selectedReservation = reservations.find(res => res.reservationId === reservationId);

    if (selectedReservation) {
        // BulkApproveModal이 배열을 기대하므로, 객체를 배열에 담아 전달합니다.
        setReservationsToApprove([selectedReservation]);
        setIsBulkConfirmModalOpen(true); // 일괄 승인 모달을 엽니다.
    }
};

    // 2. InfoModal을 띄우는 함수 생성
    const showAlertModal = (title: string, subtitle: string) => {
        setInfoModalTitle(title);
        setInfoModalSubtitle(subtitle);
        setIsInfoModalOpen(true);
    };

    //  선택 승인 버튼 핸들러
    const handleApproveSelected = async () => {
        if (selectedItems.length === 0) {
            showAlertModal('알림', '승인할 예약을 선택해주세요.');
            return;
        }
        // 선택된 ID들에 해당하는 예약 객체들을 찾아 상태에 저장
        const selectedReservationObjects = reservations.filter(res => selectedItems.includes(res.reservationId));
        setReservationsToApprove(selectedReservationObjects);

        setIsBulkConfirmModalOpen(true);
    };

    const handleSingleSelect = (reservationId: number, isApprovable: boolean) => {
    // 승인 가능한 항목만 선택/해제 로직을 실행
    if (!isApprovable) {
        return; // 승인 불가능하면 아무것도 하지 않고 함수 종료
    }

    setSelectedItems(prevSelected =>
        prevSelected.includes(reservationId)
            ? prevSelected.filter(id => id !== reservationId)
            : [...prevSelected, reservationId]
    );
};


    // 3. 모달에서 '확인' 버튼 클릭 시 실행될 일괄 승인 함수 정의
    const confirmBulkApprove = async () => {
        setIsBulkConfirmModalOpen(false); // 모달 즉시 닫기
        try {
            // 선택된 모든 항목에 대해 API를 호출
            await postApproveReservationsApi(selectedItems); 

            // 성공 알림 모달
            showAlertModal('승인 완료', '선택하신 예약이 성공적으로 승인되었습니다.');
            
            // 데이터 다시 로드 및 선택 초기화
            await loadReservations();
            setSelectedItems([]); 
        } catch (err) {
            // 실패 알림 모달
            showAlertModal('승인 실패', '일괄 승인에 실패했습니다. 다시 시도해주세요.');
            console.error("일괄 승인 실패", err);
        }
    };

    // 반려하기 버튼을 눌렀을 때 호출되는 함수
    const handleReject = (reservationId: number) => {
        setSelectedReservationIdToReject(reservationId);
        setIsRejectModalOpen(true); // 반려 모달 열기
    };

    // 모달에서 '반려하기' 버튼을 눌러 최종 확정하는 함수
    const confirmReject = async () => {
        if (selectedReservationIdToReject === null || !rejectionReason.trim()) {
            //showAlertModal('알림', '반려 사유를 입력해주세요.');
            return;
        }

        try {
            await postRejectReservationApi(selectedReservationIdToReject, rejectionReason);
            console.log("반려API 요청 성공!");
            showAlertModal('반려 완료', '해당 예약이 반려되었습니다.');
            
            // 상태 초기화 및 데이터 다시 로드
            setIsRejectModalOpen(false);
            setRejectionReason('');
            await loadReservations();
            
        } catch (err) {
            console.error("반려 실패", err);
            setIsRejectModalOpen(false);
            showAlertModal('반려 실패', '예약 반려에 실패했습니다. 다시 시도해주세요.');
        }
    };

    const approvableReservations = reservations.filter(res => res.isApprovable);
    const isAllApprovableSelected = approvableReservations.length > 0 && selectedItems.length === approvableReservations.length;
    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i);
    return (
        <MainContainer>
            <Header>
                <PageTitle>예약 관리</PageTitle>
            </Header>
                <SectionTitle>예약 목록</SectionTitle>
                
                {/* Filter and Search Section (Responsive) */}
                <FilterSearchWrapper>
                    {/* 예약 상태 드롭다운 */}
                    <DropdownContainer>
                        <DropdownButton onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}>
                            <span>{selectedStatus === '전체' ? '예약 상태 전체' : selectedStatus}</span>
                            <FaChevronDown css={css`margin-left: 0.5rem; font-size: 0.75rem;`} />
                        </DropdownButton>
                        {isStatusDropdownOpen && (
                            <DropdownMenu>
                                {statusOptions.map(status => (
                                    <DropdownItem key={status} onClick={() => handleStatusSelect(status)}>
                                        {status}
                                    </DropdownItem>
                                ))}
                            </DropdownMenu>
                        )}
                    </DropdownContainer>

                    {/* 지점 드롭다운 */}
                    <DropdownContainer>
                        <DropdownButton onClick={() => setIsBranchDropdownOpen(!isBranchDropdownOpen)}>
                            <span>{selectedBranch === '전체' ? '지점' : selectedBranch}</span>
                            <FaChevronDown css={css`margin-left: 0.5rem; font-size: 0.75rem;`} />
                        </DropdownButton>
                        {isBranchDropdownOpen && (
                            <DropdownMenu>
                                {branchOptions.map(branch => (
                                    <DropdownItem key={branch} onClick={() => handleBranchSelect(branch)}>
                                        {branch}
                                    </DropdownItem>
                                ))}
                            </DropdownMenu>
                        )}
                    </DropdownContainer>

                    <SearchInputContainer>
                        <SearchInput type="text" placeholder="예약자명, 공간으로 검색" />
                        <span css={css`
                            position: absolute;
                            right: 0.75rem;
                            top: 50%;
                            transform: translateY(-50%);
                            color: #9ca3af;
                        `}></span>
                    </SearchInputContainer>
                    <ActionButtons>
                        <FilterButton>신한 예약 보기</FilterButton>
                        <FilterButton>긴급 예약 보기</FilterButton>
                    </ActionButtons>
                </FilterSearchWrapper>

                {/* Table Header and Actions (Responsive) */}
                <HeaderActions>
                    <SelectAllContainer htmlFor="selectAllCheckbox">
                        <HiddenCheckbox
                            type="checkbox"
                            id="selectAllCheckbox"
                            // isAllApprovableSelected 상태를 사용
                            checked={isAllApprovableSelected}
                            onChange={handleSelectAll}
                        />
                        <CustomCheckbox isChecked={isAllApprovableSelected}>
                            {isAllApprovableSelected && <IoCheckmarkSharp size={16} />}
                        </CustomCheckbox>
                        <span css={css`color: #4b5563;`}>전체 선택</span>
                    </SelectAllContainer>
                    <ApproveAllButton onClick={handleApproveSelected}>선택 승인</ApproveAllButton>
                </HeaderActions>

                {/* Reservation List (Responsive) */}
                <ReservationList>
                    {reservations.map(reservation => (
                        <ReservationItem key={reservation.reservationId}>
                            <div css={css`
                                flex-shrink: 0;
                                margin-top: 0.25rem;
                                @media (min-width: 768px) {
                                    margin-top: 0;
                                }
                            `}>
                                <SelectAllContainer htmlFor={`checkbox-${reservation.reservationId}`}>
                                    <HiddenCheckbox
                                        type="checkbox"
                                        id={`checkbox-${reservation.reservationId}`}
                                        checked={selectedItems.includes(reservation.reservationId)}
                                        onChange={() => handleSingleSelect(reservation.reservationId, reservation.isApprovable)} // 함수에 isApprovable 전달
                                        // 여기를 수정합니다.
                                        disabled={!reservation.isApprovable}
                                    />
                                    <CustomCheckbox isChecked={selectedItems.includes(reservation.reservationId)}>
                                        {selectedItems.includes(reservation.reservationId) && <IoCheckmarkSharp size={16} />}
                                    </CustomCheckbox>
                                </SelectAllContainer>
                            </div>
                            <ReservationInfo>
                                <InfoRow>
                                    <StatusBadge css={getStatusStyle(reservation.reservationStatusName)}>
                                        {reservation.reservationStatusName}
                                    </StatusBadge>
                                    <span css={css`
                                        font-weight: bold;
                                        color: #333;
                                        word-break: break-all;
                                    `}>{reservation.spaceName}</span>
                                    <span css={css`color: #6b7280; font-size: 0.75rem;`}>예약자명 : {reservation.userName}</span>
                                    {reservation.isShinhan && <ShinhanTag>신한</ShinhanTag>}
                                    {reservation.isEmergency && <EmergencyTag>긴급</EmergencyTag>}
                                </InfoRow>
                                <DetailInfo>
                                    <DetailItem>
                                        <DateText>{formatDate(reservation.reservationFrom)}</DateText>
                                    </DetailItem>
                                    <DetailItem>
                                        <DateText>{"|"}</DateText>
                                    </DetailItem>
                                    <DetailItem>
                                        <DateText>{formatTimeRange(reservation.reservationFrom, reservation.reservationTo)}</DateText>
                                    </DetailItem>
                                    {reservation.previsits && reservation.previsits.length > 0 && (
                                    <>
                                        <DetailItem>
                                            <span>사전답사   {formatDate(reservation.previsits[0]?.previsitFrom)}</span>
                                        </DetailItem>
                                        <DetailItem>
                                            <span>{"|"}</span>
                                        </DetailItem>
                                        <DetailItem>
                                            <span>{formatTimeRange(reservation.previsits[0]?.previsitFrom, reservation.previsits[0]?.previsitTo)}</span>
                                        </DetailItem>
                                    </>
                                )}
                                </DetailInfo>
                            </ReservationInfo>
                            <ItemActions>
                                <DetailButton>상세 보기</DetailButton>
                                {/* 승인하기 버튼 - isApprovable 값에 따라 비활성화 */}
                               <ApproveActionButton 
                                    disabled={!reservation.isApprovable} 
                                    onClick={() => handleApprove(reservation.reservationId)} // 수정된 handleApprove 호출
                                >
                                    승인하기
                                </ApproveActionButton>
                                {/* 반려하기 버튼 - isRejectable 값에 따라 비활성화 */}
                                <RejectActionButton 
                                    disabled={!reservation.isRejectable}
                                    onClick={() => handleReject(reservation.reservationId)}
                                >
                                    반려하기
                                </RejectActionButton>
                            </ItemActions>
                        </ReservationItem>
                    ))}
                </ReservationList>

                {/* Pagination */}
                <PaginationNav>
                    <PaginationList>
                        <PaginationItem isArrow onClick={() => handlePageChange(uiCurrentPage - 1)}>
                            {'<'}
                        </PaginationItem>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                            <PaginationItem
                                key={page}
                                isActive={page === uiCurrentPage}
                                onClick={() => handlePageChange(page)}
                            >
                                {page}
                            </PaginationItem>
                        ))}
                        <PaginationItem isArrow onClick={() => handlePageChange(uiCurrentPage + 1)}>
                            {'>'}
                        </PaginationItem>
                    </PaginationList>
                </PaginationNav>
                {/* InfoModal(알림) 컴포넌트*/}
                <InfoModal
                    isOpen={isInfoModalOpen}
                    onClose={() => setIsInfoModalOpen(false)} // '확인' 버튼 클릭 시 모달 닫기
                    title={infoModalTitle}
                    subtitle={infoModalSubtitle}
                />
                 {/* 일괄승인 모달 */}
                <BulkApproveModal
                    isOpen={isBulkConfirmModalOpen}
                    reservations={reservationsToApprove} // 선택된 예약 객체 배열 전달
                    onConfirm={confirmBulkApprove}
                    onCancel={() => {
                        setIsBulkConfirmModalOpen(false);
                        setReservationsToApprove([]); // 모달 닫을 때 상태 초기화
                    }}
                />
                {/* 반려하기 모달 */}
                <RejectModal
                    isOpen={isRejectModalOpen}
                    onClose={() => {
                        setIsRejectModalOpen(false);
                        setRejectionReason(''); // 모달 닫을 때 사유 초기화
                    }}
                    onConfirm={confirmReject}
                    rejectionReason={rejectionReason}
                    setRejectionReason={setRejectionReason}
                />
        </MainContainer>
    );
};

export default ReservationManagementPage;

const MainContainer = styled.main`
    flex: 1;
    padding: 1rem;
    @media (min-width: 768px) {
        padding: 2rem;
    }
`;

const Header = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 1.5rem;
    @media (min-width: 768px) {
        flex-direction: row;
        align-items: center;
    }
`;

const PageTitle = styled.h1`
    /* 피그마 CSS 기반 스타일 적용 */
    font-family: 'Pretendard';
    font-style: normal;
    font-weight: 600;
    font-size: 24px;
    line-height: 29px;
    letter-spacing: -0.011em;
    color: #000000;
    
    /* 기존 스타일 유지 및 일부 조정 */
    margin-bottom: 1rem;
    @media (min-width: 768px) {
        font-size: 2rem;
        margin-bottom: 0;
    }
`;

const NewReservationButton = styled.button`
    background-color: #2563eb;
    color: white;
    padding: 0.75rem 1.5rem;
    border-radius: 0.5rem;
    font-size: 0.875rem;
    font-weight: 600;
    width: 100%;
    transition: background-color 0.3s ease;
    &:hover {
        background-color: #1d4ed8;
    }
    @media (min-width: 768px) {
        font-size: 1rem;
        width: auto;
    }
`;

const SectionContainer = styled.div`
    background-color: white;
    padding: 1rem;
    border-radius: 0.5rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    @media (min-width: 768px) {
        padding: 1.5rem;
    }
`;

const SectionTitle = styled.h2`
    /* 피그마 CSS 기반 스타일 적용 */
    font-family: 'Pretendard';
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    line-height: 19px;
    letter-spacing: -0.011em;
    color: #000000;
    
    /* 기존 스타일 유지 및 일부 조정 */
    margin-bottom: 1rem;
    @media (min-width: 768px) {
        font-size: 1.25rem;
    }
`;

const FilterSearchWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1.5rem;
    @media (min-width: 768px) {
        flex-direction: row;
    }
`;

const DropdownContainer = styled.div`
    position: relative;
    width: 100%;
    @media (min-width: 768px) {
        width: auto;
    }
`;

const DropdownButton = styled.button`
    /* 피그마 CSS 기반 스타일 적용 */
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 12px;
    gap: 12px;

    height: 41px;

    background: #F3F4F4;
    border: none;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 500;
    color: #4B5563;
    width: 100%;
    cursor: pointer;
    &:hover {
        background-color: #e0e0e0;
    }
    @media (min-width: 768px) {
        width: auto;
    }
`;
const DropdownMenu = styled.ul`
    position: absolute;
    top: 100%;
    left: 0;
    z-index: 10;
    background-color: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    margin-top: 0.5rem;
    list-style: none;
    padding: 0.5rem 0;
    width: 100%;
    @media (min-width: 768px) {
        width: auto;
    }
`;

const DropdownItem = styled.li`
    padding: 0.5rem 1rem;
    cursor: pointer;
    font-size: 0.875rem;
    color: #4b5563;
    &:hover {
        background-color: #f3f4f6;
    }
`;

const FilterButton = styled.button`
    flex-shrink: 0;
    display: flex;
    align-items: center;
    padding: 8px 12px;
    background: #F3F4F4;
    border-radius: 8px;
    font-size: 12px;
    font-weight: 500;
    color: #4B5563;
    transition: background-color 0.2s ease;
    border: none;
    &:hover {
        background-color: #e0e0e0;
    }
`;

const SearchInputContainer = styled.div`
    /* 피그마 CSS 기반 스타일 적용 */
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 8px 12px;
    gap: 10px;

    height: 41px;
    background: #F3F4F4;
    border-radius: 12px;
    
    /* 기존 스타일 유지 및 일부 조정 */
    position: relative;
    flex: 1;
    width: 100%;
`;

const SearchInput = styled.input`
    /* 피그마 CSS 기반 스타일 적용 */
    width: 100%;
    height: 100%;
    padding: 0; /* 부모 컨테이너에 패딩을 적용했으므로 0으로 설정 */
    border: none; /* 부모 컨테이너에 배경을 적용했으므로 테두리 제거 */
    background: transparent; /* 부모 컨테이너의 배경색이 보이도록 설정 */
    
    &:focus {
        outline: none;
        box-shadow: none; /* 포커스 시 박스 섀도우 제거 */
    }
`;

const ActionButtons = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    width: 100%;
    @media (min-width: 768px) {
        flex-direction: row;
        width: auto;
    }
`;

const HeaderActions = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-start;
    border-bottom: 1px solid #e5e7eb;
    padding-bottom: 1rem;
    margin-bottom: 1rem;
    gap: 0.5rem;
    @media (min-width: 768px) {
        flex-direction: row;
        align-items: center;
    }
`;

const SelectAllContainer = styled.label` /* label로 변경하여 input과 연결 */
    display: flex;
    align-items: center;
    cursor: pointer;
`;

// 커스텀 체크박스 스타일
const CustomCheckbox = styled.span<{ isChecked: boolean }>`
    /* 피그마 CSS 기반 스타일 적용 */
    display: flex;
    align-items: center;
    justify-content: center;
    width: 18px;
    height: 18px;
    border: none; /* 테두리 제거 */
    border-radius: 9px; /* 원형에 가까운 모양으로 변경 */
    margin-right: 0.5rem;
    transition: all 0.2s ease;
    
    background-color: ${props => (props.isChecked ? '#E8E9E9' : '#E8E9E9')};
    color: #191F28; /* 체크마크 색상 */

    ${props => props.isChecked && css`
        background-color: #E8E9E9;
    `}
`;

const HiddenCheckbox = styled.input`
    /* 실제 체크박스는 숨김 */
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
    margin: 0;
    padding: 0;
    cursor: pointer;
`;

const ApproveAllButton = styled.button`
    /* 피그마 CSS 기반 스타일 적용 */
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 8px 12px; /* padding 값을 조정하여 텍스트가 잘리지 않도록 함 */
    gap: 8px;

    height: 30px;
    
    background-color: #F2F6FF; /* 기존 색상 유지 */
    color: #0046FF; /* 기존 색상 유지 */
    border-radius: 8px; /* 피그마와 동일한 값 적용 */
    font-size: 12px; /* 피그마와 동일한 값 적용 */
    font-weight: 500;
    line-height: 14px;
    border: none;

    /* 기존 반응형 스타일은 유지 */
    width: 100%;
    &:hover {
        background-color: #2563eb;
    }
    @media (min-width: 768px) {
        width: auto;
    }
`;

const ReservationList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
`;

const ReservationItem = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 1rem;
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    transition: box-shadow 0.3s ease;
    &:hover {
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    @media (min-width: 768px) {
        flex-direction: row;
        align-items: center;
    }
`;

const ReservationInfo = styled.div`
    flex-grow: 1;
    margin-top: 0.5rem;
    @media (min-width: 768px) {
        margin-left: 1rem;
        margin-top: 0;
    }
`;

const StatusBadge = styled.span`
    padding: 0.25rem 0.5rem;
    font-size: 0.75rem;
    font-weight: 600;
    border-radius: 9999px;
`;

const InfoRow = styled.div`
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    margin-bottom: 0.5rem;
    gap: 0.5rem;
    @media (min-width: 768px) {
        gap: 1rem;
    }
`;

const DetailInfo = styled.div`
    /* 피그마 CSS 기반 스타일 적용 */
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 0px;
    gap: 4px;
    
    /* 기존 스타일 유지 및 일부 조정 */
    color: #6b7280;
    font-size: 0.875rem;
    
    /* 반응형 스타일 */
    @media (min-width: 768px) {
        flex-direction: row;
        gap: 1rem;
    }
`;

const DetailItem = styled.div`
    display: flex;
    align-items: center;
    font-size: 0.75rem;
    
    @media (min-width: 768px) {
        font-size: 0.875rem;
    }
`;

// 날짜 텍스트를 위한 새로운 styled component
const DateText = styled.span`
    /* 피그마 CSS 기반 스타일 적용 */
    font-family: 'Pretendard';
    font-style: normal;
    font-weight: 600;
    font-size: 12px;
    line-height: 14px;
    letter-spacing: -0.011em;
    color: #191F28;
`;

const DetailItemPrevisit = styled.div`
    /* 피그마 CSS 기반 스타일 적용 */
    display: flex;
    align-items: center;
    font-size: 0.75rem;
    
    /* 기존 스타일 유지 및 일부 조정 */
    @media (min-width: 768px) {
        font-size: 0.875rem;
    }
`;

const ItemActions = styled.div`
    display: flex;
    flex-direction: column;
    margin-top: 1rem;
    gap: 0.5rem;
    width: 100%;
    @media (min-width: 768px) {
        flex-direction: row;
        margin-top: 0;
        width: auto;
    }
`;

const ActionButton = styled.button`
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    transition: background-color 0.3s ease, opacity 0.3s ease;
    width: 100%;
    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
    @media (min-width: 768px) {
        width: auto;
    }
`;

const DetailButton = styled(ActionButton)`
    /* 피그마 CSS 기반 스타일 적용 */
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 8px 12px; /* 텍스트가 잘리지 않도록 padding 조정 */
    gap: 8px;
    height: 30px;
    background: #F3F4F4; /* 피그마와 동일한 배경색 적용 */
    color: #4B5563; /* 피그마와 동일한 텍스트 색상 적용 */
    border-radius: 8px; /* 피그마와 동일한 값 적용 */
    border: none; /* 기존 테두리 제거 */
    font-size: 12px;
    font-weight: 500;
    line-height: 14px;
    
    width: auto;
    &:hover:not(:disabled) {
        background-color: #e0e0e0;
    }
`;

const ApproveActionButton = styled(ActionButton)`
    padding: 8px 12px;
    background-color: #F2F6FF;
    color: #3B82F6;
    border-radius: 8px;
    font-weight: 500;
    font-size: 12px;
    line-height: 14px;
    border: none;
    width: auto;
    &:hover:not(:disabled) {
        background-color: #d1e1ff;
    }
`;

const RejectActionButton = styled(ActionButton)`
    padding: 8px 12px;
    background-color: #FFF2F2;
    color: #FF0000;
    border-radius: 8px;
    font-weight: 500;
    font-size: 12px;
    line-height: 14px;
    border: none;
    width: auto;
    &:hover:not(:disabled) {
        background-color: #ffd1d1;
    }
`;

// 페이지네이션 Wrapper
const PaginationNav = styled.nav`
    /* 피그마 CSS 기반 스타일 적용 */
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 0;
    gap: 8px;

    /* 기존 스타일 유지 및 일부 조정 */
    justify-content: center;
    margin-top: 2rem;
`;

// 페이지네이션 UL
const PaginationList = styled.ul`
    display: flex;
    list-style: none;
    padding: 0;
    gap: 0.25rem; /* 항목 간 간격 줄이기 */
`;

// 페이지네이션 각 항목
const PaginationItem = styled.li<{ isActive?: boolean; isArrow?: boolean }>`
    /* 기본 스타일 */
    display: flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;

    background-color: transparent;
    border-radius: 15px;
    cursor: pointer;
    font-size: 0.875rem;
    font-weight: 500;
    color: #4b5563;
    transition: all 0.2s ease;
    
    /* 활성 상태 스타일 */
    ${props => props.isActive && css`
        background-color: #E8E9E9;
        color: #000000;
    `}
    
    /* 비활성 상태 스타일 (눌리지 않은 숫자) */
    ${props => !props.isActive && !props.isArrow && css`
        background-color: transparent;
        &:hover {
            background-color: #f3f4f6;
        }
        color: #8C8F93;
    `}

    /* 화살표 버튼 스타일 */
    ${props => props.isArrow && css`
        background-color: transparent;
        border: none;
        
        &:hover {
            background-color: transparent;
        }
    `}
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