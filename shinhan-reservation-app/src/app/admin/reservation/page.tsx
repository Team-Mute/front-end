 "use client";
// export default function DashboardPage() {
//   return <h1>예약관리 페이지</h1>;
// }

/** @jsxImportSource @emotion/react */
/** @jsxImportSource @emotion/react */

import React, { useState } from 'react';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { FaCalendarAlt, FaClock, FaUser, FaBuilding, FaChevronDown } from 'react-icons/fa';
import { IoCheckmarkSharp } from 'react-icons/io5'; // 체크마크 아이콘 추가

const ReservationManagementPage: React.FC = () => {
    const [reservations, setReservations] = useState<Reservation[]>(fetchReservations().content);
    const [selectedItems, setSelectedItems] = useState<number[]>([]);
    
    // 예약 상태 드롭다운 상태
    const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState('예약 상태 전체');
    const statusOptions = ['전체', '1차 승인 대기', '2차 승인 대기', '최종 승인 완료', '이용 완료', '예약 취소', '반려'];

    // 지점 드롭다운 상태
    const [isBranchDropdownOpen, setIsBranchDropdownOpen] = useState(false);
    const [selectedBranch, setSelectedBranch] = useState('지점');
    const branchOptions = ['전체', '서울', '인천', '대구', '대전'];

    // 현재 페이지 및 총 페이지 수 (더미 데이터 기반)
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = fetchReservations().totalPages; // 더미 데이터에서 totalPages 가져오기
    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            const allIds = reservations.map(res => res.reservationId);
            setSelectedItems(allIds);
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
    
    const handleStatusSelect = (status: string) => {
        setSelectedStatus(status);
        setIsStatusDropdownOpen(false);
    };

    const handleBranchSelect = (branch: string) => {
        setSelectedBranch(branch);
        setIsBranchDropdownOpen(false);
    };

    const handlePageChange = (page: number) => {
        if (page > 0 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const isAllSelected = selectedItems.length === reservations.length;

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
                            checked={isAllSelected}
                            onChange={handleSelectAll}
                        />
                        <CustomCheckbox isChecked={isAllSelected}>
                            {isAllSelected && <IoCheckmarkSharp size={16} />}
                        </CustomCheckbox>
                        <span css={css`color: #4b5563;`}>전체 선택</span>
                    </SelectAllContainer>
                    <ApproveAllButton>선택 승인</ApproveAllButton>
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
                                        onChange={(e) => handleSelectItem(reservation.reservationId, e)}
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
                                <ApproveActionButton disabled={!reservation.isApprovable}>
                                    승인하기
                                </ApproveActionButton>
                                {/* 반려하기 버튼 - isRejectable 값에 따라 비활성화 */}
                                <RejectActionButton disabled={!reservation.isRejectable}>
                                    반려하기
                                </RejectActionButton>
                            </ItemActions>
                        </ReservationItem>
                    ))}
                </ReservationList>

                {/* Pagination */}
                <PaginationNav>
                    <PaginationList>
                        <PaginationItem onClick={() => handlePageChange(currentPage - 1)}>
                            {'<'}
                        </PaginationItem>
                        {pageNumbers.map(page => (
                            <PaginationItem
                                key={page}
                                isActive={page === currentPage}
                                onClick={() => handlePageChange(page)}
                            >
                                {page}
                            </PaginationItem>
                        ))}
                        <PaginationItem onClick={() => handlePageChange(currentPage + 1)}>
                            {'>'}
                        </PaginationItem>
                    </PaginationList>
                </PaginationNav>
        </MainContainer>
    );
};

export default ReservationManagementPage;

// JSON 데이터에 맞는 타입 정의
interface Previsit {
    previsitId: number;
    previsitFrom: string;
    previsitTo: string;
}

interface Reservation {
    reservationId: number;
    reservationStatusName: string;
    spaceName: string;
    userName: string;
    reservationHeadcount: number;
    reservationFrom: string;
    reservationTo: string;
    regDate: string;
    isShinhan: boolean;
    isEmergency: boolean;
    isApprovable: boolean;
    isRejectable: boolean;
    previsits: Previsit[];
}

interface ReservationResponse {
    content: Reservation[];
    totalElements: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
}

// 더미 데이터 생성 함수 (실제 API 호출 대체)
const fetchReservations = (): ReservationResponse => {
    const reservations: Reservation[] = [
        {
            reservationId: 1,
            reservationStatusName: '1차 승인 대기',
            spaceName: '명동 신한스퀘어브릿지 지하1층 메인홀',
            userName: '김철수',
            reservationHeadcount: 5,
            reservationFrom: '2025-08-15T14:00:00Z',
            reservationTo: '2025-08-15T16:00:00Z',
            regDate: '2025-08-14T14:30:00Z',
            isShinhan: true,
            isEmergency: false,
            isApprovable: true,
            isRejectable: true,
            previsits: [
                {
                    previsitId: 15,
                    previsitFrom: "2025-08-25T13:00:00.45698",
                    previsitTo: "2025-08-25T13:30:00.45698"
                },
            ],
        },
        {
            reservationId: 2,
            reservationStatusName: '2차 승인 대기',
            spaceName: '명동 신한스퀘어브릿지 지하1층 메인홀',
            userName: '박미수',
            reservationHeadcount: 3,
            reservationFrom: '2025-08-15T14:00:00Z',
            reservationTo: '2025-08-15T16:00:00Z',
            regDate: '2025-08-14T14:30:00Z',
            isShinhan: false,
            isEmergency: true,
            isApprovable: true,
            isRejectable: true,
            previsits: [],
        },
        {
            reservationId: 3,
            reservationStatusName: '최종 승인 완료',
            spaceName: '명동 신한스퀘어브릿지 지하1층 메인홀',
            userName: '김영희',
            reservationHeadcount: 4,
            reservationFrom: '2025-08-15T14:00:00Z',
            reservationTo: '2025-08-15T16:00:00Z',
            regDate: '2025-08-14T14:30:00Z',
            isShinhan: false,
            isEmergency: false,
            isApprovable: false, // 이 값에 따라 비활성화
            isRejectable: false, // 이 값에 따라 비활성화
            previsits: [],
        },
        {
            reservationId: 4,
            reservationStatusName: '반려',
            spaceName: '명동 신한스퀘어브릿지 지하1층 메인홀',
            userName: '송민호',
            reservationHeadcount: 6,
            reservationFrom: '2025-08-15T14:00:00Z',
            reservationTo: '2025-08-15T16:00:00Z',
            regDate: '2025-08-14T14:30:00Z',
            isShinhan: false,
            isEmergency: false,
            isApprovable: false, // 이 값에 따라 비활성화
            isRejectable: false, // 이 값에 따라 비활성화
            previsits: [],
        },
        {
            reservationId: 5,
            reservationStatusName: '예약 취소',
            spaceName: '명동 신한스퀘어브릿지 지하1층 메인홀',
            userName: '강민정',
            reservationHeadcount: 2,
            reservationFrom: '2025-08-15T14:00:00Z',
            reservationTo: '2025-08-15T16:00:00Z',
            regDate: '2025-08-14T14:30:00Z',
            isShinhan: false,
            isEmergency: false,
            isApprovable: false, // 이 값에 따라 비활성화
            isRejectable: false, // 이 값에 따라 비활성화
            previsits: [],
        },
        //  {
        //     reservationId: 6,
        //     reservationStatusName: '이용 완료',
        //     spaceName: '명동 신한스퀘어브릿지 지하1층 메인홀',
        //     userName: '강민정',
        //     reservationHeadcount: 2,
        //     reservationFrom: '2025-08-15T14:00:00Z',
        //     reservationTo: '2025-08-15T16:00:00Z',
        //     regDate: '2025-08-14T14:30:00Z',
        //     isShinhan: false,
        //     isEmergency: false,
        //     isApprovable: false, // 이 값에 따라 비활성화
        //     isRejectable: false, // 이 값에 따라 비활성화
        //     previsits: [],
        // }
    ];

    return {
        content: reservations,
        totalElements: reservations.length,
        totalPages: 5,
        currentPage: 1,
        pageSize: 5
    };
};

const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const weekday = ['일', '월', '화', '수', '목', '금', '토'][date.getDay()];
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${year}년 ${month}월 ${day}일 (${weekday})`;
};

const formatTimeRange = (fromStr: string, toStr: string): string => {
    const fromDate = new Date(fromStr);
    const toDate = new Date(toStr);
    const fromHours = fromDate.getHours().toString().padStart(2, '0');
    const fromMinutes = fromDate.getMinutes().toString().padStart(2, '0');
    const toHours = toDate.getHours().toString().padStart(2, '0');
    const toMinutes = toDate.getMinutes().toString().padStart(2, '0');
    return `${fromHours}:${fromMinutes}~${toHours}:${toMinutes}`;
};

const getStatusStyle = (status: string) => {
    switch (status) {
        case '1차 승인 대기':
            return css`background-color: #FFFCF2; color: #FFBB00;`;
        case '2차 승인 대기':
            return css`background-color: #FFF8F2; color: #FF7300;`;
        case '최종 승인 완료':
            return css`background-color: #F2FBF8; color: #34C759;`;
        case '반려':
            return css`background-color: #FCF2FF; color: #C800FF;`;
        case '예약 취소':
            return css`background-color: #F3F4F4; color: #8E8E93;`;
        case '이용 완료':
            return css`background-color: #F0F1F5; color: #8496C5;`;
        default:
            return css`background-color: #f5f5f5; color: #757575;`;
    }
};

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