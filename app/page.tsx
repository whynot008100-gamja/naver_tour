export default function HomePage() {
  return (
    <main className="flex-1">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center space-y-4 py-12">
          <h1 className="text-4xl font-bold tracking-tight">
            한국 관광지 정보 서비스
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            한국관광공사 API를 활용하여 전국의 관광지 정보를 검색하고 확인하세요.
          </p>
        </div>

        {/* TODO: Phase 2에서 구현 예정 */}
        {/* - 관광지 목록 (TourList) */}
        {/* - 필터 기능 (TourFilters) */}
        {/* - 네이버 지도 연동 (NaverMap) */}
        
        <div className="mt-12 text-center text-sm text-muted-foreground">
          <p>관광지 목록 및 지도는 Phase 2에서 구현 예정입니다.</p>
        </div>
      </div>
    </main>
  );
}
