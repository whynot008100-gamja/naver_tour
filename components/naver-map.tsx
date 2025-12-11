'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { getAreaBasedList, searchKeyword } from '@/lib/api/tour-api';
import type { TourItem } from '@/lib/types/tour';
import { Loader2 } from 'lucide-react';

// 경복궁 좌표 (기본 위치)
const GYEONGBOKGUNG = { lat: 37.5796, lng: 126.9770 };

interface NaverMapProps {
  activeContentId?: string | null;
}

export function NaverMap({ activeContentId }: NaverMapProps) {
  const searchParams = useSearchParams();
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const infoWindowRef = useRef<any>(null);
  const [tours, setTours] = useState<TourItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
        setIsLoading(true);
        let data;
        if (keyword) {
          data = await searchKeyword({
            keyword,
            areaCode,
            contentTypeId,
            numOfRows: 100,
            pageNo: currentPage,
          });
        } else {
          data = await getAreaBasedList({
            areaCode,
            contentTypeId,
            arrange: sort as 'A' | 'C',
            numOfRows: 100,
            pageNo: currentPage,
          });
        }
        setTours(data.items);
      } catch (err) {
        console.error('관광지 목록 조회 실패:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTours();
  }, [keyword, areaCode, contentTypeId, sort, currentPage]);

  // 지도 초기화 (경복궁을 기본 위치로)
  useEffect(() => {
    if (!mapRef.current || !window.naver) return;

    const mapOptions = {
      center: new window.naver.maps.LatLng(GYEONGBOKGUNG.lat, GYEONGBOKGUNG.lng),
      zoom: 12,
      zoomControl: true,
      zoomControlOptions: {
        position: window.naver.maps.Position.TOP_RIGHT,
      },
    };

    const map = new window.naver.maps.Map(mapRef.current, mapOptions);
    mapInstanceRef.current = map;

    return () => {
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
      const lat = Number(tour.mapy);
      const lng = Number(tour.mapx);

      // 유효한 좌표인지 확인
      if (isNaN(lat) || isNaN(lng) || lat === 0 || lng === 0) return;

      const isActive = tour.contentid === activeContentId;

      const marker = new window.naver.maps.Marker({
        position: new window.naver.maps.LatLng(lat, lng),
        map: mapInstanceRef.current,
        title: tour.title,
        icon: {
          content: `
            <div style="
              padding: ${isActive ? '8px 16px' : '5px 10px'};
              background: ${isActive ? '#2563eb' : 'white'};
              color: ${isActive ? 'white' : 'black'};
              border: ${isActive ? '2px solid white' : '1px solid #ccc'};
              border-radius: 20px;
              font-size: ${isActive ? '14px' : '12px'};
              font-weight: bold;
              box-shadow: 0 2px 5px rgba(0,0,0,0.2);
              white-space: nowrap;
              transition: all 0.2s;
            ">
              ${tour.title}
            </div>
          `,
          anchor: new window.naver.maps.Point(isActive ? 20 : 15, isActive ? 20 : 15),
        },
        zIndex: isActive ? 100 : 1,
      });

      // 마커 클릭 이벤트
      window.naver.maps.Event.addListener(marker, 'click', () => {
        if (infoWindowRef.current) {
          infoWindowRef.current.close();
        }

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

        mapInstanceRef.current.setCenter(new window.naver.maps.LatLng(lat, lng));
      });

      markersRef.current.push(marker);
    });

    // 첫 번째 유효한 관광지로 중심 이동하지 않음 (경복궁 유지)
    // 대신 지도 범위를 조정하려면 아래 주석 해제:
    // if (validTours.length > 0 && bounds.hasArea && mapInstanceRef.current) {
    //   mapInstanceRef.current.fitBounds(bounds);
    // }
  }, [tours, activeContentId]);

  return (
    <div className="relative w-full h-full rounded-xl overflow-hidden shadow-sm border">
      <div 
        ref={mapRef} 
        className="w-full h-full"
      />
      
      {/* 로딩 오버레이 */}
      {isLoading && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-10">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">지도 로딩 중...</p>
          </div>
        </div>
      )}
    </div>
  );
}
