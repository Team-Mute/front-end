// 예약 등록/수정 Request body 타입
export interface UserInfoPayload {
    userId: number,
    roleId: number,
    companyId: number,
    userEmail: string,
    userName: string,
    userPhone: string,
    regDate: string,
    updDate: string | null,
    agreeEmail: boolean,
    agreeSms: boolean,
    agreeLocation: boolean,
    companyName: string,
    roleName: string
}