'use client';

import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { getAreaBasedList, searchKeyword } from '@/lib/api/tour-api';
import type { TourItem } from '@/lib/types/tour';

export function NaverMap() {
  const searchParams = useSearchParams();
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const infoWindowRef = useRef<any>(null);
  const [tours, setTours] = useState<TourItem[]>([]);

  // URL 쿼리 파라미터에서 필터 값 가져오기
  const keyword = searchParams.get('keyword') || undefined;
  const areaCode = searchParams.get('areaCode') || undefined;
  const contentTypeId = searchParams.get('contentTypeId') || undefined;
  const sort = searchParams.get('sort') || 'A';
  const currentPage = parseInt(searchParams.get('page') || '1', 10);

  // 데이터 로딩
  useEffect(() => {
    const fetchTours = async () => {
      try {
        let data;
        if (keyword) {
          data = await searchKeyword({
            keyword,
            areaCode,
            contentTypeId,
            numOfRows: 12,
            pageNo: currentPage,
          });
        } else {
          data = await getAreaBasedList({
            areaCode,
            contentTypeId,
            arrange: sort as 'A' | 'C',
            numOfRows: 12,
            pageNo: currentPage,
          });
        }
        setTours(data.items);
      } catch (err) {
        console.error('관광지 목록 조회 실패:', err);
      }
    };

    fetchTours();
  }, [keyword, areaCode, contentTypeId, sort, currentPage]);

  // 지도 초기화
  useEffect(() => {
    if (!mapRef.current || !window.naver) return;

    const mapOptions = {
      center: new window.naver.maps.LatLng(37.5665, 126.978),
      zoom: 12,
      zoomControl: true,
      zoomControlOptions: {
        position: window.naver.maps.Position.TOP_RIGHT,
      },
    };

    const map = new window.naver.maps.Map(mapRef.current, mapOptions);
    mapInstanceRef.current = map;

    return () => {
      // cleanup
      if (infoWindowRef.current) {
        infoWindowRef.current.close();
      }
      markersRef.current.forEach(marker => marker.setMap(null));
      markersRef.current = [];
    };
  }, []);

  // 마커 업데이트
  useEffect(() => {
    if (!mapInstanceRef.current || !window.naver || tours.length === 0) return;

    // 기존 마커 제거
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    // 기존 인포윈도우 닫기
    if (infoWindowRef.current) {
      infoWindowRef.current.close();
    }

    // 새 마커 생성
    const validTours = tours.filter(tour => tour.mapx && tour.mapy);
    
    validTours.forEach(tour => {
      const lat = Number(tour.mapy) / 10000000;
      const lng = Number(tour.mapx) / 10000000;

      // 유효한 좌표인지 확인
      if (isNaN(lat) || isNaN(lng) || lat === 0 || lng === 0) return;

      const marker = new window.naver.maps.Marker({
        position: new window.naver.maps.LatLng(lat, lng),
        map: mapInstanceRef.current,
        title: tour.title,
      });

      // 마커 클릭 이벤트
      window.naver.maps.Event.addListener(marker, 'click', () => {
        // 기존 인포윈도우 닫기
        if (infoWindowRef.current) {
          infoWindowRef.current.close();
        }

        // 인포윈도우 생성 및 표시
        const infoWindow = new window.naver.maps.InfoWindow({
          content: `
            <div style="padding: 12px; min-width: 200px; max-width: 300px;">
              <h3 style="margin: 0 0 8px 0; font-size: 14px; font-weight: bold; color: #000;">${tour.title}</h3>
              <p style="margin: 0 0 8px 0; font-size: 12px; color: #666; line-height: 1.4;">${tour.addr1 || '주소 정보 없음'}</p>
              <a 
                href="/places/${tour.contentid}" 
                style="display: inline-block; padding: 6px 12px; background: #000; color: #fff; text-decoration: none; border-radius: 4px; font-size: 12px; font-weight: 500;"
              >
                상세보기
              </a>
            </div>
          `,
        });

        infoWindow.open(mapInstanceRef.current, marker);
        infoWindowRef.current = infoWindow;

        // 지도 중심을 마커 위치로 이동
        mapInstanceRef.current.setCenter(new window.naver.maps.LatLng(lat, lng));
      });

      markersRef.current.push(marker);
    });

    // 첫 번째 유효한 관광지로 중심 이동
    if (validTours.length > 0) {
      const firstTour = validTours[0];
      const lat = Number(firstTour.mapy) / 10000000;
      const lng = Number(firstTour.mapx) / 10000000;
      mapInstanceRef.current.setCenter(new window.naver.maps.LatLng(lat, lng));
    }
  }, [tours]);

  return (
    <div 
      ref={mapRef} 
      className="w-full h-full"
    />
  );
}
