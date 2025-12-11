'use client';

import { useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Navigation } from 'lucide-react';

interface DetailMapProps {
  title: string;
  mapx: string;
  mapy: string;
}

export function DetailMap({ title, mapx, mapy }: DetailMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);

  // 좌표 변환 (KATEC → WGS84)
  const lng = parseFloat(mapx) / 10000000;
  const lat = parseFloat(mapy) / 10000000;

  useEffect(() => {
    if (!mapRef.current || !window.naver) return;

    const mapOptions = {
      center: new window.naver.maps.LatLng(lat, lng),
      zoom: 15,
      zoomControl: true,
      zoomControlOptions: {
        position: window.naver.maps.Position.TOP_RIGHT,
      },
    };

    const map = new window.naver.maps.Map(mapRef.current, mapOptions);

    // 마커 생성
    const marker = new window.naver.maps.Marker({
      position: new window.naver.maps.LatLng(lat, lng),
      map: map,
      title: title,
    });

    // 인포윈도우 생성
    const infoWindow = new window.naver.maps.InfoWindow({
      content: `
        <div style="padding: 10px; min-width: 200px;">
          <h3 style="margin: 0 0 5px 0; font-size: 14px; font-weight: bold;">
            ${title}
          </h3>
        </div>
      `,
    });

    // 마커 클릭 시 인포윈도우 토글
    window.naver.maps.Event.addListener(marker, 'click', () => {
      if (infoWindow.getMap()) {
        infoWindow.close();
      } else {
        infoWindow.open(map, marker);
      }
    });

    // 초기에 인포윈도우 열기
    infoWindow.open(map, marker);
  }, [title, lat, lng]);

  // 길찾기 버튼 핸들러
  const handleNavigation = () => {
    // 네이버 지도 앱/웹으로 길찾기
    const naverMapUrl = `https://map.naver.com/v5/directions/-/-/-/car?c=${lng},${lat},15,0,0,0,dh`;
    window.open(naverMapUrl, '_blank');
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>위치</CardTitle>
        <Button onClick={handleNavigation} size="sm">
          <Navigation className="h-4 w-4 mr-2" />
          길찾기
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <div 
          ref={mapRef} 
          className="w-full h-96"
        />
        <div className="p-4 text-sm text-muted-foreground">
          <p>위도: {lat.toFixed(6)}, 경도: {lng.toFixed(6)}</p>
        </div>
      </CardContent>
    </Card>
  );
}
