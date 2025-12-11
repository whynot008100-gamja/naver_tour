import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { TourItem } from '@/lib/types/tour';
import { CONTENT_TYPE_NAMES } from '@/lib/types/tour';

interface TourCardProps {
  tour: TourItem;
  priority?: boolean;
}

export function TourCard({ tour, priority = false }: TourCardProps) {
  const contentTypeName = CONTENT_TYPE_NAMES[tour.contenttypeid as keyof typeof CONTENT_TYPE_NAMES] || '기타';
  
  return (
    <Link href={`/places/${tour.contentid}`} className="block">
      <Card className="overflow-hidden hover:scale-[1.02] hover:shadow-lg transition-all duration-200 cursor-pointer h-full">
        <CardContent className="p-0">
          {/* 이미지 */}
          <div className="relative w-full h-48 bg-muted">
            <Image
              src={tour.firstimage || '/images/placeholder-tour.jpg'}
              alt={tour.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority={priority}
            />
          </div>
          
          {/* 정보 */}
          <div className="p-4 space-y-2">
            <Badge variant="secondary" className="mb-2">
              {contentTypeName}
            </Badge>
            <h3 className="font-bold text-lg line-clamp-1">
              {tour.title}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {tour.addr1}
            </p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
