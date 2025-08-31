// JSON 데이터에 맞는 타입 정의
export interface Previsit {
    previsitId: number;
    previsitFrom: string;
    previsitTo: string;
}

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
    previsits: Previsit[];
}

export interface ReservationResponse {
    content: Reservation[];
    totalElements: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
}


export interface ReservationsParams {
    page: number;
    keyword?: string;
    statusId?: number | null;
    regionId?: number | null;
    isShinhanOnly?: boolean;
    isEmergencyOnly?: boolean;
}

