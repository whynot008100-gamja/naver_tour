'use client';

import { useEffect, useState, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { TourCard } from './tour-card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { getAreaBasedList, searchKeyword } from '@/lib/api/tour-api';
import type { TourItem } from '@/lib/types/tour';
import { AlertCircle, SearchX } from 'lucide-react';

interface TourListProps {
  onActiveChange?: (contentId: string) => void;
}

export function TourList({ onActiveChange }: TourListProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [tours, setTours] = useState<TourItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  
  // Intersection Observer Refs
  const observerRef = useRef<IntersectionObserver | null>(null);
  const cardRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // URL 쿼리 파라미터에서 값 가져오기
  const keyword = searchParams.get('keyword') || undefined;
  const areaCode = searchParams.get('areaCode') || undefined;
  const contentTypeId = searchParams.get('contentTypeId') || undefined;
  const sort = searchParams.get('sort') || 'A';
  const currentPage = parseInt(searchParams.get('page') || '1', 10);

  const numOfRows = 100;
  const totalPages = Math.ceil(totalCount / numOfRows);

  useEffect(() => {
    fetchTours();
  }, [keyword, areaCode, contentTypeId, sort, currentPage]);

  // Intersection Observer 설정
  useEffect(() => {
    if (loading || tours.length === 0 || !onActiveChange) return;

    const options = {
      root: null, // viewport
      rootMargin: '-40% 0px -40% 0px', // 화면 중앙 20% 영역만 감지
      threshold: 0
    };

    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const contentId = entry.target.getAttribute('data-contentid');
          if (contentId) {
            onActiveChange(contentId);
          }
        }
      });
    }, options);

    // 모든 카드 관찰 시작
    Object.values(cardRefs.current).forEach((el) => {
      if (el) observerRef.current?.observe(el);
    });

    return () => {
      observerRef.current?.disconnect();
    };
  }, [tours, loading, onActiveChange]);

  const fetchTours = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let data;
      if (keyword) {
        data = await searchKeyword({
          keyword,
          areaCode,
          contentTypeId,
          numOfRows,
          pageNo: currentPage,
        });
      } else {
        data = await getAreaBasedList({
          areaCode,
          contentTypeId,
          arrange: sort as 'A' | 'C',
          numOfRows,
          pageNo: currentPage,
        });
      }
      
      console.log('API Response:', { totalCount: data.totalCount, itemsCount: data.items.length });
      
      setTours(data.items);
      setTotalCount(data.totalCount);
    } catch (err) {
      console.error('관광지 목록 조회 실패:', err);
      setError('관광지 정보를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    router.push(`?${params.toString()}`);
    
    // 페이지 변경 시 스크롤을 맨 위로
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4">
        {tours.map((tour, index) => (
          <div 
            key={tour.contentid}
            data-contentid={tour.contentid}
            ref={(el) => { cardRefs.current[tour.contentid] = el; }}
          >
            <TourCard 
              tour={tour} 
              priority={index === 0}
            />
          </div>
        ))}
      </div>
      
      {/* 페이지네이션 */}
      {totalCount > numOfRows && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage > 1) handlePageChange(currentPage - 1);
                }}
                className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
              />
            </PaginationItem>
            
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              
              return (
                <PaginationItem key={pageNum}>
                  <PaginationLink
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(pageNum);
                    }}
                    isActive={currentPage === pageNum}
                  >
                    {pageNum}
                  </PaginationLink>
                </PaginationItem>
              );
            })}
            
            {totalPages > 5 && currentPage < totalPages - 2 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}
            
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage < totalPages) handlePageChange(currentPage + 1);
                }}
                className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4">
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
  const router = useRouter();
  
  const handleReset = () => {
    router.push('/');
  };
  
  return (
    <div className="flex flex-col items-center justify-center p-12 space-y-4">
      <SearchX className="h-16 w-16 text-muted-foreground" />
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold">검색 결과가 없습니다</h3>
        <p className="text-sm text-muted-foreground">
          다른 검색어나 필터를 시도해보세요.
        </p>
      </div>
      <Button onClick={handleReset} variant="outline">
        필터 초기화
      </Button>
    </div>
  );
}
