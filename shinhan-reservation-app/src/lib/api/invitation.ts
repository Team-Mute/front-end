// src/lib/api/invitation.ts

import axiosClient from "./axiosClient";

// API 응답 데이터 타입 정의
export interface InvitationDetails {
    userName: string;
    spaceName: string;
    addressRoad: string;
    reservationFrom: string;
    reservationTo: string;
    reservationPurpose: string;
    reservationAttachment: string[];
}

// API 호출 함수
export async function getInvitationDetails(reservation_id: number){
    try {
        // 실제 API 엔드포인트로 교체해야 합니다.
        const response = await axiosClient.get<InvitationDetails>(`/api/invitations/${reservation_id}`);
        return response.data;
    } catch (error) {
        console.error('Failed to fetch invitation details:', error);
        // 프로덕션 환경에서는 에러 처리 방식을 더 정교하게 다듬어야 합니다.
        throw new Error('초대장 정보를 불러오는 데 실패했습니다.');
    }
};