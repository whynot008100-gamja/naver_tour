import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart3, MapPin, Users, TrendingUp } from 'lucide-react';
import { getStatsSummary, getRegionStats, getTypeStats } from '@/lib/api/stats-api';
import { RegionChart } from '@/components/stats/region-chart';
import { TypeChart } from '@/components/stats/type-chart';

export const revalidate = 3600; // 1시간마다 재검증

export default async function StatsPage() {
  // 통계 데이터 병렬 조회
  const [summary, regionStats, typeStats] = await Promise.all([
    getStatsSummary(),
    getRegionStats(),
    getTypeStats(),
  ]);

  // Top 3 추출
  const top3Regions = regionStats.slice(0, 3);
  const top3Types = typeStats.slice(0, 3);

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

          {/* Top 3 섹션 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top 3 지역 */}
            <Card>
              <CardHeader>
                <CardTitle>Top 3 지역</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {top3Regions.map((region, index) => (
                    <div key={region.code} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <div className="font-medium">{region.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {region.count.toLocaleString()}개
                          </div>
                        </div>
                      </div>
                      <Badge variant="secondary">{region.code}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Top 3 타입 */}
            <Card>
              <CardHeader>
                <CardTitle>Top 3 콘텐츠 타입</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {top3Types.map((type, index) => (
                    <div key={type.code} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <div className="font-medium">{type.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {type.count.toLocaleString()}개
                          </div>
                        </div>
                      </div>
                      <Badge variant="secondary">{type.code}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 차트 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RegionChart data={regionStats} />
            <TypeChart data={typeStats} />
          </div>
        </div>
      </div>
    </main>
  );
}
