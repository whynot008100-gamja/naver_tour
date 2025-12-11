import Image from 'next/image';
import { notFound } from 'next/navigation';
import { DetailHeader } from '@/components/detail-header';
import { getDetailCommon } from '@/lib/api/tour-api';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { InfoRow } from '@/components/tour-detail/info-row';
import { CopyButton } from '@/components/tour-detail/copy-button';
import { CONTENT_TYPE_NAMES } from '@/lib/types/tour';
import {
  MapPin,
  Phone,
  Globe,
  ExternalLink,
} from 'lucide-react';

// 타입별 색상
const CONTENT_TYPE_COLORS: Record<string, string> = {
  '12': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  '14': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  '15': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  '28': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  '38': 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
  '39': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  '32': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
};

// HTML에서 URL 추출
function extractUrl(html: string): string {
  const match = html.match(/href="([^"]+)"/);
  return match ? match[1] : html;
}

export default async function PlaceDetailPage({
  params,
}: {
  params: Promise<{ contentid: string }>;
}) {
  const { contentid } = await params;
  
  try {
    const details = await getDetailCommon(contentid);
    
    if (!details || details.length === 0) {
      notFound();
    }

    const detail = details[0];
    const contentTypeName = CONTENT_TYPE_NAMES[detail.contenttypeid as keyof typeof CONTENT_TYPE_NAMES] || '기타';
    const badgeColor = CONTENT_TYPE_COLORS[detail.contenttypeid] || 'bg-gray-100 text-gray-800';

    return (
      <main className="min-h-screen bg-background">
        <DetailHeader />
        
        <div className="container mx-auto px-4 py-6 max-w-4xl">
          <div className="space-y-6">
            {/* 이미지 */}
            {detail.firstimage && (
              <div className="relative w-full h-96 rounded-lg overflow-hidden">
                <Image
                  src={detail.firstimage}
                  alt={detail.title}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
                />
              </div>
            )}
            
            {/* 제목 + 뱃지 */}
            <div className="space-y-3">
              <Badge className={badgeColor}>
                {contentTypeName}
              </Badge>
              <h1 className="text-3xl font-bold">{detail.title}</h1>
            </div>
            
            {/* 기본 정보 */}
            <Card>
              <CardContent className="p-6 space-y-4">
                {/* 주소 */}
                {detail.addr1 && (
                  <InfoRow icon={MapPin}>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <p>{detail.addr1}</p>
                        {detail.addr2 && (
                          <p className="text-muted-foreground mt-1">{detail.addr2}</p>
                        )}
                      </div>
                      <CopyButton text={detail.addr1} />
                    </div>
                  </InfoRow>
                )}
                
                {/* 전화번호 */}
                {detail.tel && (
                  <InfoRow icon={Phone}>
                    <a 
                      href={`tel:${detail.tel}`}
                      className="hover:underline"
                    >
                      {detail.tel}
                    </a>
                  </InfoRow>
                )}
                
                {/* 홈페이지 */}
                {detail.homepage && (
                  <InfoRow icon={Globe}>
                    <a
                      href={extractUrl(detail.homepage)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline flex items-center gap-1"
                    >
                      홈페이지 방문
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </InfoRow>
                )}
              </CardContent>
            </Card>
            
            {/* 개요 */}
            {detail.overview && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">소개</h2>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap text-muted-foreground">
                    {detail.overview}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    );
  } catch (error) {
    console.error('상세 정보 조회 실패:', error);
    throw error;
  }
}
