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
export async function getReservationListApi(filterOption: string) {
  const { data } = await axiosClient.get("/api/reservations", {
    params: { filterOption },
  });
  return data;
}

// 예약 생성
export async function createReservationApi({
  requestDto,
  files,
}: ReservationRequest) {
  const formData = new FormData();

  const jsonBlob = new Blob([JSON.stringify(requestDto)], {
    type: "application/json",
  });

  // 서버가 기대하는 "requestDto"라는 이름으로 Blob 객체를 추가합니다.
  formData.append("requestDto", jsonBlob);
  console.log(jsonBlob);
  // *************************************// 파일이 있을 경우에만 'files' 파트를 추가합니다.
  if (files && files.length > 0) {
    files.forEach((file) => {
      formData.append("files", file);
    });
  }

  // axios로 요청을 보냅니다.
  const { data } = await axiosClient.post("/api/reservations", formData, {});
  return data;
}

// 예약 생성
// export async function createReservationApi({
//   requestDto,
//   files,
// }: ReservationRequest) {
//   const formData = new FormData();

//   // 1. JSON 데이터는 Blob으로 변환하여 Content-Type을 명시 (기존과 동일, 올바른 방식)
//   formData.append(
//     "requestDto",
//     new Blob([JSON.stringify(requestDto)], {
//       type: "application/json",
//     })
//   );

//   // 2. files 배열이 존재하고, 내용이 있을 때만 FormData에 추가
//   if (files && files.length > 0) {
//     files.forEach((file) => {
//       formData.append("files", file);
//     });
//   }
//   // 파일이 없으면 'files' 파트를 아예 추가하지 않음 (else 블록 제거)

//   const { data } = await axiosClient.post("/api/reservations", formData, {
//     // Content-Type 헤더는 axios가 FormData를 보고 자동으로 설정하므로 비워둡니다.
//   });

//   return data;
// }

// // 예약 생성
// export async function createReservationApi({
//   requestDto,
//   files,
// }: ReservationRequest) {
//   const formData = new FormData();

//   // formData.append("requestDto", JSON.stringify(requestDto));
//   formData.append(
//     "requestDto",
//     new Blob([JSON.stringify(requestDto)], {
//       type: "application/json",
//     })
//   );
//   // files.forEach((file) => formData.append("files", file));
//   // files가 존재하면 (비어있는 배열일 수 있음)
//   if (files) {
//     // 배열을 순회하며 FormData에 각 파일 추가
//     files.forEach((file) => formData.append("files", file));
//   } else {
//     // files가 null 또는 undefined인 경우, 빈 Blob을 보내 키 값만 전송
//     formData.append("files", new Blob([]));
//   }

//   const { data } = await axiosClient.post("/api/reservations", formData, {});
//   return data;
// }

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

/**
 * 응답
 * {
  "availableDays": [
    1,
    2,
    3,
    4,
    5,
    6,
    8,
    9,
    10,
    11,
    12,
    13,
    16,
    17,
    18,
    19,
    20,
    22,
    23,
    24,
    25,
    26,
    27,
    29,
    30
  ]
}
 * 
 */

// 예약 가능 시간 조회: getAvailableTimesApi
export async function getAvailableTimesApi(
  spaceId: number,
  year: number,
  month: number,
  day: number
) {
  const { data } = await axiosClient.post(`/api/reservations/available-times`, {
    spaceId: spaceId,
    year: year,
    month: month,
    day: day,
  });
  return data;
}
// 응답
/*
{
  "availableTimes": [
    {
      "startTime": "09:00:00",
      "endTime": "18:00:00"
    }
  ]
}
*/

// ?? 조회
export async function getReservationRejectMsgApi(reservationId: number) {
  const { data } = await axiosClient.get(
    `/api/reservations/rejectMassage/${reservationId}`
  );
  return data;
}
