/** reservation.ts : 예약 관련 API 명세
 *
 * 예약 단건 조회: getReservationApi
 * 예약 단건 수정: updateReservationApi
 * 예약 단건 삭제: deleteReservationApi
 *
 * 예약 리스트 조회: getReservationListApi
 * 예약 생성: createReservationApi
 * 예약 단건 취소: cancleReservationApi
 *
 * 예약 가능 일 조회: getAvailableDatesApi
 * 예약 가능 시간 조회: getAvailableTimesApi
 *
 * 반려 사유 조회: /api/reservations/rejectMassage/{reservation_id}
 *
 */

import { ReservationRequest } from "@/types/reservation";
import axiosClient from "./axiosClient";

// 예약 단건 조회
export async function getReservationApi(reservationId: number) {
  const { data } = await axiosClient.get(`/api/reservations/${reservationId}`);
  return data;
}

// 예약 단건 수정
export async function updateReservationApi(
  reservationId: number,
  { requestDto, files }: ReservationRequest
) {
  const formData = new FormData();
  formData.append("requestDto", JSON.stringify(requestDto));
  files.forEach((file) => formData.append("files", file));

  const { data } = await axiosClient.put(
    `/api/reservations/${reservationId}`,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );
  return data;
}

// 예약 단건 삭제
export async function deleteReservationApi(reservationId: number) {
  const { data } = await axiosClient.delete(
    `/api/reservations/${reservationId}`
  );
  return data;
}

////////////////

// 예약 리스트 조회
export async function getReservationListApi(
  filterOption: string,
) {
  const { data } = await axiosClient.get("/api/reservations", {
    params: { filterOption},
  });
  return data;
}

// 예약 생성
export async function createReservationApi(
  reservationId: number,
  { requestDto, files }: ReservationRequest
) {
  const formData = new FormData();

  formData.append("requestDto", JSON.stringify(requestDto));
  files.forEach((file) => formData.append("files", file));

  const { data } = await axiosClient.post("/api/reservations", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

// 예약 취소
export async function cancleReservationApi(reservationId: number) {
  const { data } = await axiosClient.post(
    `/api/reservations/cancel/${reservationId}`
  );
  return data;
}

///////////

// 예약 가능일 조회: getAvailableDatesApi
export async function getAvailableDatesApi(
  spaceId: number,
  year: number,
  month: number
) {
  const { data } = await axiosClient.post(`/api/reservations/available-dates`, {
    spaceId: spaceId,
    year: year,
    month: month,
  });
  return data;
}

// 예약 가능 시간 조회: getAvailableTimesApi
export async function getAvailableTimesApi(
  spaceId: number,
  year: number,
  month: number,
  day: number
) {
  const { data } = await axiosClient.post(`/api/reservations/available-dates`, {
    spaceId: spaceId,
    year: year,
    month: month,
    day: day,
  });
  return data;
}

// ?? 조회
export async function getReservationRejectMsgApi(reservationId: number) {
  const { data } = await axiosClient.get(
    `/api/reservations/rejectMassage/${reservationId}`
  );
  return data;
}
