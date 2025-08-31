import adminAxiosClient from "./adminAxiosClient";

// API 호출 함수를 분리하고, 인수를 받도록 수정
export const getReservationApi = async ({
    currentPage,
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
        
        params.append('page', String(currentPage));
        params.append('size', '5');

        const url = `/api/reservations-admin/search?${params.toString()}`;
        
        const response = await adminAxiosClient.get<ReservationResponse>(url);
        return response.data;
        
    } catch (error) {
        console.error("데이터를 가져오는 중 오류 발생:", error);
        throw new Error('데이터를 불러오지 못했습니다. 다시 시도해주세요.');
    }
};

// API 응답 데이터 타입을 정의합니다.
// 이 타입은 컴포넌트 파일에도 동일하게 정의되어 있어야 합니다.
export interface Reservation {
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
    previsits: {
        previsitId: number;
        previsitFrom: string;
        previsitTo: string;
    }[];
    regionId: number;
    statusId: number;
    rejectable: boolean;
    approvable: boolean;
}

export interface ReservationResponse {
    content: Reservation[];
    totalElements: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
}

interface ReservationsParams {
    currentPage: number;
    keyword?: string;
    statusId?: number | null;
    regionId?: number | null;
    isShinhanOnly?: boolean;
    isEmergencyOnly?: boolean;
}

