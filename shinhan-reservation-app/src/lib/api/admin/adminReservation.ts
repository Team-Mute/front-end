import adminAxiosClient from "./adminAxiosClient";
import { Previsit, Reservation, ReservationResponse, ReservationsParams } from "@/types/reservationAdmin";

// 예약 관리 리스트 호출 API
export const getReservationApi = async ({
    page,
    keyword,
    statusId,
    regionId,
    isShinhanOnly,
    isEmergencyOnly,
}: ReservationsParams): Promise<ReservationResponse> => {
    try {
        const params = new URLSearchParams();
        if (keyword) params.append('keyword', keyword);
        if (statusId !== null) params.append('statusId', String(statusId));
        if (regionId !== null) params.append('regionId', String(regionId));
        if (isShinhanOnly) params.append('isShinhan', 'true');
        if (isEmergencyOnly) params.append('isEmergency', 'true');
        
        params.append('page', String(page));
        params.append('size', '5');

        const url = `/api/reservations-admin/search?${params.toString()}`;
        
        const response = await adminAxiosClient.get<ReservationResponse>(url);
        return response.data;
        
    } catch (error) {
        console.error("데이터를 가져오는 중 오류 발생:", error);
        throw new Error('데이터를 불러오지 못했습니다. 다시 시도해주세요.');
    }
};

/** 승인하기 API
 * 하나 또는 여러 개의 예약 ID를 배열로 받아 승인 요청 진행
 * @param reservationIds 승인할 예약 ID 배열
 */
export const postApproveReservationsApi = async (reservationIds: number[]) => {
    try {
        const response = await adminAxiosClient.post(`/api/reservations-admin/approve`, {
            reservationIds // API 명세에 맞춰 배열을 body에 담아 전송
        });
        
        return response.status === 200;
    } catch (error) {
        console.error("예약 승인 중 오류 발생:", error);
        throw new Error('예약 승인에 실패했습니다.');
    }
};

/**
 * 예약 반려 API 
 * @param reservationId 반려할 예약 ID
 * @param rejectionReason 반려 사유
 */
export const postRejectReservationApi = async (reservationId: number, rejectionReason: string) => {
    // API 요청 형식에 맞춰 rejectionReason을 Body에 담아 보냅니다.
    const response = await adminAxiosClient.post(`/api/reservations-admin/reject/${reservationId}`, {
        rejectionReason: rejectionReason,
    });
    return response.data;
};