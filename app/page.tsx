'use client';

import { useState, Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { TourList } from '@/components/tour-list';
import { TourFilters } from '@/components/tour-filters';
import { TourSearch } from '@/components/tour-search';
import { NaverMap } from '@/components/naver-map';
import { Sidebar } from '@/components/sidebar';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<'list' | 'map'>('list');

  return (
    <main className="min-h-[calc(100vh-64px)] bg-background">
      {/* 모바일 탭 버튼 (lg 미만에서만 표시) */}
      <div className="lg:hidden border-b bg-background sticky top-[64px] z-40">
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
      <div className="lg:grid lg:grid-cols-[280px_1fr_400px] xl:grid-cols-[320px_1fr_500px] h-full">
        
        {/* 1. 사이드바 (검색/필터) - 데스크톱 전용 */}
        <div className="hidden lg:block border-r bg-background h-[calc(100vh-64px)] sticky top-[64px] overflow-hidden">
          <Sidebar />
        </div>

        {/* 2. 중앙 영역 (관광지 목록) */}
        <div
          className={`
            bg-muted/10
            ${activeTab === 'list' ? 'block' : 'hidden'} lg:block
          `}
        >
          <div className="p-4 lg:p-6 space-y-4 pt-6">
            {/* 제목 제거됨 */}
            
            {/* 모바일용 검색/필터 (lg 미만에서만 표시) */}
            <div className="lg:hidden space-y-4 mb-6">
              <Suspense fallback={<div>로딩 중...</div>}>
                <TourSearch />
              </Suspense>
              <Suspense fallback={<div>로딩 중...</div>}>
                <TourFilters />
              </Suspense>
            </div>

            <Suspense fallback={<div>로딩 중...</div>}>
              <TourList />
            </Suspense>
          </div>
        </div>

        {/* 3. 오른쪽 영역 (지도) */}
        <div
          className={`
            bg-muted/30
            ${activeTab === 'map' ? 'block h-[calc(100vh-110px)]' : 'hidden'} 
            lg:block lg:h-[calc(100vh-64px)] lg:sticky lg:top-[64px] lg:border-l lg:p-6
          `}
        >
          <div className="w-full h-full">
            <Suspense fallback={<div className="flex items-center justify-center h-full">지도 로딩 중...</div>}>
              <NaverMap />
            </Suspense>
          </div>
        </div>
      </div>
    </main>
  );
}
