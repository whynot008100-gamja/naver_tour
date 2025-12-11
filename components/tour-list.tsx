'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { TourCard } from './tour-card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { getAreaBasedList } from '@/lib/api/tour-api';
import type { TourItem } from '@/lib/types/tour';
import { AlertCircle } from 'lucide-react';

export function TourList() {
  const searchParams = useSearchParams();
  const [tours, setTours] = useState<TourItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // URL 쿼리 파라미터에서 필터 값 가져오기
  const areaCode = searchParams.get('areaCode') || undefined;
  const contentTypeId = searchParams.get('contentTypeId') || undefined;
  const sort = searchParams.get('sort') || 'A';

  useEffect(() => {
    fetchTours();
  }, [areaCode, contentTypeId, sort]); // 필터 변경 시 재호출

  const fetchTours = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAreaBasedList({
        areaCode,
        contentTypeId,
        arrange: sort as 'A' | 'C',
        numOfRows: 12,
        pageNo: 1,
      });
      setTours(data.items);
    } catch (err) {
      console.error('관광지 목록 조회 실패:', err);
      setError('관광지 정보를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return <ErrorMessage error={error} onRetry={fetchTours} />;
  }

  if (tours.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 p-4">
      {tours.map((tour) => (
        <TourCard key={tour.contentid} tour={tour} />
      ))}
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 p-4">
      {Array.from({ length: 12 }).map((_, index) => (
        <div key={index} className="space-y-3">
          <Skeleton className="h-48 w-full rounded-lg" />
          <div className="space-y-2 p-4">
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      ))}
    </div>
  );
}

function ErrorMessage({ error, onRetry }: { error: string; onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
      <AlertCircle className="h-12 w-12 text-destructive" />
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold">오류가 발생했습니다</h3>
        <p className="text-sm text-muted-foreground">{error}</p>
      </div>
      <Button onClick={onRetry} variant="outline">
        다시 시도
      </Button>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold">관광지가 없습니다</h3>
        <p className="text-sm text-muted-foreground">
          검색 조건을 변경해보세요.
        </p>
      </div>
    </div>
  );
}
