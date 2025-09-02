"use client";

import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { getInvitationDetails, InvitationDetails } from '@/lib/api/invitation';
import { useParams } from 'next/navigation';
import mainIcon from '@/styles/icons/mail.svg';

// --- 유틸리티 함수 (변경 없음) ---
const formatFullDateTime = (isoString: string) => {
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const dayOfWeek = ['일', '월', '화', '수', '목', '금', '토'][date.getDay()];
    return `${year}년 ${month}월 ${day}일 ${dayOfWeek}요일`;
};

const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false });
};

const calculateDuration = (from: string, to: string) => {
    const durationMs = new Date(to).getTime() - new Date(from).getTime();
    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    return hours > 0 ? ` (${hours}시간)` : '';
};


// --- 메인 컴포넌트 (변경 없음) ---
export default function InvitationPage() {
    const params = useParams();
    const reservation_id = Number(params.reservation_id);

    const [invitation, setInvitation] = useState<InvitationDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!reservation_id) return;
        const fetchInvitation = async () => {
            try {
                setLoading(true);
                const data = await getInvitationDetails(reservation_id);
                setInvitation(data);
            } catch (err) {
                setError((err as Error).message);
            } finally {
                setLoading(false);
            }
        };
        fetchInvitation();
    }, [reservation_id]);

    const handleDownload = () => {
        if (invitation?.reservationAttachment && invitation.reservationAttachment.length > 0) {
            window.open(invitation.reservationAttachment[0], '_blank');
        }
    };

    if (loading) return <LoadingContainer>초대장을 불러오는 중입니다...</LoadingContainer>;
    if (error) return <ErrorContainer>오류: {error}</ErrorContainer>;
    if (!invitation) return <ErrorContainer>초대장 정보를 찾을 수 없습니다.</ErrorContainer>;
    
    const dateStr = formatFullDateTime(invitation.reservationFrom);
    const startTime = formatTime(invitation.reservationFrom);
    const endTime = formatTime(invitation.reservationTo);
    const duration = calculateDuration(invitation.reservationFrom, invitation.reservationTo);
    const addressParts = invitation.addressRoad.split(' - ');

    return (
        <Container>
            <Content>
                <Title>{invitation.userName}님으로부터<br />초대장이 도착했어요!</Title>
                <Subtitle>공간 사용전에 첨부파일을 다운로드해보세요</Subtitle>
                <MailIcon/>
                <InfoBox>
                    <Purpose>{invitation.reservationPurpose}</Purpose>
                    <SpaceName>{invitation.spaceName}</SpaceName>
                    <DateTime>{dateStr}<br/>{startTime} ~ {endTime}{duration}</DateTime>
                    <Address>{addressParts[0]}</Address>
                    {addressParts[1] && <Address>{addressParts[1]}</Address>}
                </InfoBox>
            </Content>
            <Footer>
                <DownloadButton onClick={handleDownload} disabled={!invitation.reservationAttachment?.length}>
                    첨부파일 다운로드
                </DownloadButton>
            </Footer>
        </Container>
    );
}

// --- Styled Components 수정 ---
const Container = styled.div`
    position: relative;
    width: 100%;
    max-width: 393px;
    /* [수정] 고정 높이 제거, 화면 전체 높이를 채우도록 변경 */
    min-height: 100vh; 
    background: #ffffff;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    font-family: 'Pretendard', sans-serif;
`;

const Content = styled.main`
    /* [수정] 남은 공간을 모두 차지하도록 설정 */
    flex-grow: 1; 
    display: flex;
    flex-direction: column;
    align-items: center;
    /* [수정] 콘텐츠가 수직 중앙에 오도록 설정 */
    justify-content: center; 
    padding: 20px;
    text-align: center;
`;

const Title = styled.h1`
    font-weight: 700;
    font-size: 24px;
    line-height: 1.3; /* 줄간격 조정 */
    color: #000000;
    margin: 0 0 16px; /* 위쪽 마진 제거 */
`;

const Subtitle = styled.p`
    font-weight: 500;
    font-size: 14px;
    color: #8C8F93;
    margin: 0;
`;

const MailIcon = styled(mainIcon)`
    width: 165px;
    height: 157px;
    margin: 32px 0;
    background-size: contain;
`;

const InfoBox = styled.div`
    width: 100%;
    background: #F3F4F4;
    border-radius: 12px;
    padding: 24px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
`;

const Purpose = styled.p`
    font-size: 14px;
    font-weight: 500;
    color: #555555;
    margin: 0 0 4px;
`;

const SpaceName = styled.p`
    font-size: 20px;
    font-weight: 700;
    color: #000000;
    margin: 0;
`;

const DateTime = styled.p`
    font-size: 16px;
    font-weight: 500;
    color: #333333;
    margin: 0;
    line-height: 1.4; /* 줄간격 조정 */
`;

const Address = styled.p`
    font-size: 14px;
    font-weight: 400;
    color: #8C8F93;
    margin: 0;
    line-height: 1.4;
`;

const Footer = styled.footer`
    padding: 24px 20px 32px;
    background: #FFFFFF;
    /* [추가] 푸터 높이가 줄어들지 않도록 설정 */
    flex-shrink: 0; 
`;

const DownloadButton = styled.button`
    width: 100%;
    height: 46px;
    background: #0046FF;
    border-radius: 8px;
    border: none;
    color: #FFFFFF;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    
    &:hover {
        opacity: 0.9;
    }
    
    &:disabled {
        background: #BABCBE;
        cursor: not-allowed;
    }
`;

const LoadingContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    font-size: 18px;
`;

const ErrorContainer = styled(LoadingContainer)`
    color: red;
`;
