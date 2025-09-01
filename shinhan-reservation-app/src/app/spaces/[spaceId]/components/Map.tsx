"use client";
import React, { useRef, useEffect } from "react";

interface MapProps {
  addressRoad: string;
}

export default function Map({ addressRoad }: MapProps) {
  const mapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // kakao 객체가 없으면 아무것도 하지 않음
    if (!window.kakao?.maps || !mapRef.current) return;

    const cleanAddress = addressRoad.split(" - ")[0].trim();

    // 지도 로드
    window.kakao.maps.load(() => {
      const mapOption = {
        center: new window.kakao.maps.LatLng(33.450701, 126.570667),
        level: 3,
      };
      const map = new window.kakao.maps.Map(mapRef.current, mapOption);

      const geocoder = new window.kakao.maps.services.Geocoder();
      geocoder.addressSearch(cleanAddress, (result: any, status: any) => {
        if (status === window.kakao.maps.services.Status.OK) {
          const coords = new window.kakao.maps.LatLng(result[0].y, result[0].x);

          // ✅ 기본 마커만 표시
          const marker = new window.kakao.maps.Marker({
            map,
            position: coords,
          });

          map.setCenter(coords);
        }
      });
    });
  }, [addressRoad]);

  return <div ref={mapRef} style={{ width: "100%", height: "300px" }} />;
}
