import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, MapPin, Users, TrendingUp } from 'lucide-react';
import { getStatsSummary } from '@/lib/api/stats-api';

export const revalidate = 3600; // 1시간마다 재검증

export default async function StatsPage() {
  // 통계 데이터 조회
  const summary = await getStatsSummary();

  return (
    <main className="min-h-screen bg-background">
      {/* 헤더 */}
      <div className="border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <BarChart3 className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">통계 대시보드</h1>
              <p className="text-muted-foreground">
                전국 관광지 데이터 분석
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* 요약 카드 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  전체 관광지
                </CardTitle>
                <MapPin className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {summary.totalCount.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  전국 관광지 수
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  지역 수
                </CardTitle>
                <MapPin className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{summary.regionCount}</div>
                <p className="text-xs text-muted-foreground">
                  시도 단위
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  콘텐츠 타입
                </CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{summary.typeCount}</div>
                <p className="text-xs text-muted-foreground">
                  관광지, 음식점 등
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  북마크
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">-</div>
                <p className="text-xs text-muted-foreground">
                  총 북마크 수
                </p>
              </CardContent>
            </Card>
          </div>

          {/* 차트 영역 (Phase 4C-4D에서 구현) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>지역별 관광지</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80 flex items-center justify-center text-muted-foreground">
                  차트 영역 (Phase 4C)
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>타입별 분포</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80 flex items-center justify-center text-muted-foreground">
                  차트 영역 (Phase 4C)
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
