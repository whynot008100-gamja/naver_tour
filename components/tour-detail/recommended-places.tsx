import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getAreaBasedList } from '@/lib/api/tour-api';
import { CONTENT_TYPE_NAMES } from '@/lib/types/tour';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin } from 'lucide-react';

interface RecommendedPlacesProps {
  currentContentId: string;
  areaCode?: string;
  contentTypeId?: string;
}

export async function RecommendedPlaces({ 
  currentContentId, 
  areaCode, 
  contentTypeId 
}: RecommendedPlacesProps) {
  try {
    // 같은 지역의 관광지 조회 (최대 4개)
    const result = await getAreaBasedList({
      areaCode,
      contentTypeId,
      numOfRows: 5, // 현재 관광지 제외하고 4개 표시
      pageNo: 1,
      arrange: 'B', // 조회순
    });

    // items 배열 추출
    const places = result.items || [];

    // 현재 관광지 제외
    const filteredPlaces = places.filter(
      place => place.contentid !== currentContentId
    ).slice(0, 4);

    if (filteredPlaces.length === 0) {
      return null;
    }

    return (
      <Card>
        <CardHeader>
          <CardTitle>이런 곳은 어때요?</CardTitle>
          <p className="text-sm text-muted-foreground">
            {areaCode && contentTypeId 
              ? '같은 지역의 비슷한 관광지'
              : areaCode 
                ? '같은 지역의 다른 관광지'
                : '추천 관광지'}
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredPlaces.map((place) => (
              <Link
                key={place.contentid}
                href={`/places/${place.contentid}`}
                className="group block"
              >
                <div className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                  {/* 이미지 */}
                  <div className="relative aspect-video bg-muted">
                    {place.firstimage ? (
                      <Image
                        src={place.firstimage}
                        alt={place.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform"
                        sizes="(max-width: 640px) 100vw, 50vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        이미지 없음
                      </div>
                    )}
                  </div>

                  {/* 정보 */}
                  <div className="p-4 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold line-clamp-1 group-hover:text-primary transition-colors">
                        {place.title}
                      </h3>
                      {place.contenttypeid && (
                        <Badge variant="secondary" className="flex-shrink-0">
                          {CONTENT_TYPE_NAMES[place.contenttypeid] || '기타'}
                        </Badge>
                      )}
                    </div>
                    
                    {place.addr1 && (
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        <span className="line-clamp-1">{place.addr1}</span>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  } catch (error) {
    console.error('추천 관광지 조회 실패:', error);
    return null;
  }
}
