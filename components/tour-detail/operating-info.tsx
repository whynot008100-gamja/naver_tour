'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { InfoRow } from './info-row';
import { getDetailIntro } from '@/lib/api/tour-api';
import { Clock, Calendar, Car, DollarSign, Phone } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

// contentTypeId별 필드 매핑
const INTRO_FIELD_MAP: Record<string, {
  usetime: string;
  restdate: string;
  parking: string;
  usefee?: string;
  infocenter?: string;
}> = {
  '12': { // 관광지
    usetime: 'usetime',
    restdate: 'restdate',
    parking: 'parking',
    infocenter: 'infocenter',
  },
  '14': { // 문화시설
    usetime: 'usetimeculture',
    restdate: 'restdateculture',
    parking: 'parkingculture',
    usefee: 'usefee',
    infocenter: 'infocenterculture',
  },
  '28': { // 레포츠
    usetime: 'usetimeleports',
    restdate: 'restdateleports',
    parking: 'parkingleports',
    usefee: 'usefeeleports',
  },
  '39': { // 음식점
    usetime: 'opentimefood',
    restdate: 'restdatefood',
    parking: 'parkingfood',
  },
  '32': { // 숙박
    usetime: 'checkintime',
    restdate: 'checkouttime',
    parking: 'parkinglodging',
  },
};

interface OperatingInfoProps {
  contentId: string;
  contentTypeId: string;
}

export function OperatingInfo({ contentId, contentTypeId }: OperatingInfoProps) {
  const [intro, setIntro] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIntro = async () => {
      try {
        setLoading(true);
        const data = await getDetailIntro(contentId, contentTypeId);
        if (data && data.length > 0) {
          setIntro(data[0]);
        }
      } catch (err) {
        console.error('운영 정보 조회 실패:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchIntro();
  }, [contentId, contentTypeId]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>운영 정보</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!intro) return null;

  const fieldMap = INTRO_FIELD_MAP[contentTypeId] || INTRO_FIELD_MAP['12'];
  
  const usetime = intro[fieldMap.usetime];
  const restdate = intro[fieldMap.restdate];
  const parking = intro[fieldMap.parking];
  const usefee = fieldMap.usefee ? intro[fieldMap.usefee] : null;
  const infocenter = fieldMap.infocenter ? intro[fieldMap.infocenter] : null;

  // 정보가 하나도 없으면 표시 안 함
  if (!usetime && !restdate && !parking && !usefee && !infocenter) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>운영 정보</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {usetime && (
          <InfoRow icon={Clock} label="운영시간">
            <p className="whitespace-pre-wrap">{usetime}</p>
          </InfoRow>
        )}
        
        {restdate && (
          <InfoRow icon={Calendar} label="휴무일">
            <p className="whitespace-pre-wrap">{restdate}</p>
          </InfoRow>
        )}
        
        {usefee && (
          <InfoRow icon={DollarSign} label="이용요금">
            <p className="whitespace-pre-wrap">{usefee}</p>
          </InfoRow>
        )}
        
        {parking && (
          <InfoRow icon={Car} label="주차">
            <p className="whitespace-pre-wrap">{parking}</p>
          </InfoRow>
        )}
        
        {infocenter && (
          <InfoRow icon={Phone} label="문의">
            <p className="whitespace-pre-wrap">{infocenter}</p>
          </InfoRow>
        )}
      </CardContent>
    </Card>
  );
}
