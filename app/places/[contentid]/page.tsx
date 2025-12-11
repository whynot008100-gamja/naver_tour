import { notFound } from 'next/navigation';
import { DetailHeader } from '@/components/detail-header';
import { getDetailCommon } from '@/lib/api/tour-api';

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

    return (
      <main className="min-h-screen bg-background">
        <DetailHeader />
        
        <div className="container mx-auto px-4 py-6 max-w-4xl">
          {/* 임시 콘텐츠 */}
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">{detail.title}</h1>
            <p className="text-muted-foreground">{detail.addr1}</p>
            
            {detail.firstimage && (
              <img 
                src={detail.firstimage} 
                alt={detail.title}
                className="w-full h-64 object-cover rounded-lg"
              />
            )}
            
            {detail.overview && (
              <div className="prose max-w-none">
                <p>{detail.overview}</p>
              </div>
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
