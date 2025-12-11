import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { InfoRow } from './info-row';
import { PawPrint, AlertCircle } from 'lucide-react';
import { getDetailPetTour } from '@/lib/api/tour-api';

interface PetTourInfoProps {
  contentId: string;
}

export async function PetTourInfo({ contentId }: PetTourInfoProps) {
  try {
    const petInfo = await getDetailPetTour(contentId);
    
    if (!petInfo || petInfo.length === 0) {
      return null; // 반려동물 정보 없으면 숨김
    }

    const info = petInfo[0];

    // 정보가 모두 비어있으면 숨김
    const hasInfo = info.pettursminfo || info.relarentatr || 
                    info.acmpnyetcinfo || info.relafacltinfo;
    
    if (!hasInfo) {
      return null;
    }

    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <PawPrint className="h-5 w-5 text-primary" />
            <CardTitle>반려동물 동반 정보</CardTitle>
            <Badge variant="secondary">🐾 Pet Friendly</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* 반려동물 동반 가능 여부 */}
          {info.pettursminfo && (
            <InfoRow icon={PawPrint} label="동반 가능 정보">
              <p className="whitespace-pre-wrap">{info.pettursminfo}</p>
            </InfoRow>
          )}

          {/* 반려동물 관련 부대시설 */}
          {info.relafacltinfo && (
            <InfoRow icon={PawPrint} label="반려동물 시설">
              <p className="whitespace-pre-wrap">{info.relafacltinfo}</p>
            </InfoRow>
          )}

          {/* 반려동물 동반 추가 요금 */}
          {info.relarentatr && (
            <InfoRow icon={PawPrint} label="추가 요금">
              <p className="whitespace-pre-wrap">{info.relarentatr}</p>
            </InfoRow>
          )}

          {/* 반려동물 동반 시 주의사항 */}
          {info.acmpnyetcinfo && (
            <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-950 rounded-lg border border-amber-200 dark:border-amber-800">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-amber-900 dark:text-amber-100 mb-2">
                    주의사항
                  </h4>
                  <p className="text-sm text-amber-800 dark:text-amber-200 whitespace-pre-wrap">
                    {info.acmpnyetcinfo}
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  } catch (error) {
    console.error('반려동물 정보 조회 실패:', error);
    return null;
  }
}
