import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
      <Card className="overflow-hidden hover:bg-accent/50 transition-all duration-200 cursor-pointer h-full border-none shadow-sm bg-card/50">
        <div className="flex flex-row h-32 md:h-40">
          {/* 이미지 (왼쪽) */}
          <div className="relative w-32 md:w-48 shrink-0 bg-muted">
            <Image
              src={tour.firstimage || '/images/placeholder-tour.jpg'}
              alt={tour.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 128px, 192px"
              priority={priority}
            />
          </div>
          
          {/* 정보 (오른쪽) */}
          <div className="flex-1 p-4 flex flex-col justify-between min-w-0">
            <div className="space-y-1">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-bold text-lg line-clamp-1">
                  {tour.title}
                </h3>
                <Badge variant="secondary" className="shrink-0 text-xs">
                  {contentTypeName}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {tour.addr1}
              </p>
            </div>
            
            <div className="flex justify-end">
              <Button size="sm" variant="secondary" className="h-7 text-xs">
                View Details
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
