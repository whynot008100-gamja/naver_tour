'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { getAreaCode } from '@/lib/api/tour-api';
import { CONTENT_TYPE_NAMES } from '@/lib/types/tour';
import { RotateCcw } from 'lucide-react';

interface AreaCode {
  code: string;
  name: string;
}

export function TourFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [areaCodes, setAreaCodes] = useState<AreaCode[]>([]);
  const [loading, setLoading] = useState(true);
  
  // 현재 필터 값 (빈 문자열이면 'all'로 표시)
  const areaCode = searchParams.get('areaCode') || 'all';
  const contentTypeId = searchParams.get('contentTypeId') || 'all';
  const sort = searchParams.get('sort') || 'A';
  
  useEffect(() => {
    loadAreaCodes();
  }, []);
  
  const loadAreaCodes = async () => {
    try {
      setLoading(true);
      const codes = await getAreaCode({ numOfRows: 20 });
      // 빈 값 필터링
      const validCodes = codes.filter(
        (area: any) => area.code && area.code.trim() !== '' && area.name && area.name.trim() !== ''
      );
      setAreaCodes(validCodes);
    } catch (error) {
      console.error('지역 코드 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    // 'all'이면 파라미터 제거, 아니면 설정
    if (value && value !== 'all') {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/?${params.toString()}`);
  };
  
  const resetFilters = () => {
    router.push('/');
  };
  
  return (
    <div className="space-y-4 p-4 border rounded-lg bg-card">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">필터</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={resetFilters}
          className="h-8"
        >
          <RotateCcw className="h-4 w-4 mr-1" />
          초기화
        </Button>
      </div>
      
      <div className="space-y-3">
        {/* 지역 필터 */}
        <div className="space-y-2">
          <label className="text-sm font-medium">지역</label>
          <Select
            value={areaCode}
            onValueChange={(value) => updateFilter('areaCode', value)}
            disabled={loading}
          >
            <SelectTrigger>
              <SelectValue placeholder="전체 지역" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체</SelectItem>
              {areaCodes.map((area) => (
                <SelectItem key={area.code} value={area.code}>
                  {area.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* 관광 타입 필터 */}
        <div className="space-y-2">
          <label className="text-sm font-medium">관광 타입</label>
          <Select
            value={contentTypeId}
            onValueChange={(value) => updateFilter('contentTypeId', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="전체 타입" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체</SelectItem>
              {Object.entries(CONTENT_TYPE_NAMES).map(([id, name]) => (
                <SelectItem key={id} value={id}>
                  {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* 정렬 옵션 */}
        <div className="space-y-2">
          <label className="text-sm font-medium">정렬</label>
          <Select
            value={sort}
            onValueChange={(value) => updateFilter('sort', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="A">이름순 (가나다)</SelectItem>
              <SelectItem value="C">최신순 (수정일)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}

