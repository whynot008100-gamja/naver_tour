'use client';

import { useState } from "react";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<'list' | 'map'>('list');

  return (
    <main className="flex-1">
      <div className="container mx-auto px-4 py-6">
        {/* 페이지 헤더 */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">관광지 목록</h1>
          <p className="text-muted-foreground mt-2">
            전국의 관광지 정보를 검색하고 확인하세요
          </p>
        </div>

        {/* 모바일 탭 (모바일만 표시) */}
        <div className="lg:hidden mb-4 flex gap-2 border-b">
          <button
            onClick={() => setActiveTab('list')}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              activeTab === 'list'
                ? 'border-b-2 border-primary text-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            목록
          </button>
          <button
            onClick={() => setActiveTab('map')}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              activeTab === 'map'
                ? 'border-b-2 border-primary text-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            지도
          </button>
        </div>

        {/* 메인 콘텐츠 영역 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 왼쪽: 필터 + 관광지 목록 */}
          <div className={`space-y-4 ${activeTab === 'map' ? 'hidden lg:block' : ''}`}>
            {/* 필터 영역 (Phase 2-C에서 구현) */}
            <div className="rounded-lg border bg-card p-4">
              <h2 className="text-lg font-semibold mb-3">필터</h2>
              <p className="text-sm text-muted-foreground">
                Phase 2-C에서 구현 예정
              </p>
            </div>

            {/* 관광지 목록 (Phase 2-B에서 구현) */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">관광지 목록</h2>
              <p className="text-sm text-muted-foreground">
                Phase 2-B에서 구현 예정
              </p>
            </div>
          </div>

          {/* 오른쪽: 네이버 지도 */}
          <div className={`${activeTab === 'list' ? 'hidden lg:block' : ''}`}>
            <div className="sticky top-20">
              <div className="rounded-lg border bg-card p-4 h-[600px] flex items-center justify-center">
                <div className="text-center">
                  <h2 className="text-lg font-semibold mb-2">네이버 지도</h2>
                  <p className="text-sm text-muted-foreground">
                    Phase 2-E에서 구현 예정
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
