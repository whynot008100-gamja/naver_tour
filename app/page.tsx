'use client';

import { useState, Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { TourList } from '@/components/tour-list';
import { TourFilters } from '@/components/tour-filters';
import { TourSearch } from '@/components/tour-search';
import { NaverMap } from '@/components/naver-map';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<'list' | 'map'>('list');

  return (
    <main className="h-[calc(100vh-64px)]">
      {/* 모바일 탭 버튼 (1024px 미만에서만 표시) */}
      <div className="lg:hidden border-b bg-background">
        <div className="flex gap-2 p-2">
          <Button
            variant={activeTab === 'list' ? 'default' : 'outline'}
            onClick={() => setActiveTab('list')}
            className="flex-1"
            aria-label="관광지 목록 보기"
            aria-pressed={activeTab === 'list'}
          >
            목록
          </Button>
          <Button
            variant={activeTab === 'map' ? 'default' : 'outline'}
            onClick={() => setActiveTab('map')}
            className="flex-1"
            aria-label="지도 보기"
            aria-pressed={activeTab === 'map'}
          >
            지도
          </Button>
        </div>
      </div>

      {/* 메인 컨테이너 */}
      <div className="h-full lg:grid lg:grid-cols-2">
        {/* 왼쪽 영역: 필터 + 관광지 목록 */}
        <div
          className={`h-full overflow-y-auto bg-background ${
            activeTab === 'list' ? 'block' : 'hidden'
          } lg:block`}
        >
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">관광지 목록</h1>
            <div className="space-y-4">
              {/* 검색 */}
              <Suspense fallback={<div>로딩 중...</div>}>
                <TourSearch />
              </Suspense>
              
              {/* 필터 */}
              <Suspense fallback={<div>로딩 중...</div>}>
                <TourFilters />
              </Suspense>
              
              {/* 관광지 목록 */}
              <Suspense fallback={<div>로딩 중...</div>}>
                <TourList />
              </Suspense>
            </div>
          </div>
        </div>

        {/* 오른쪽 영역: 네이버 지도 */}
        <div
          className={`h-full bg-muted/30 ${
            activeTab === 'map' ? 'block' : 'hidden'
          } lg:block`}
        >
          <Suspense fallback={<div className="flex items-center justify-center h-full">지도 로딩 중...</div>}>
            <NaverMap />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
