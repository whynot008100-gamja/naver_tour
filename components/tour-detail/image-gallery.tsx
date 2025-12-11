'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { getDetailImage } from '@/lib/api/tour-api';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ImageGalleryProps {
  contentId: string;
}

export function ImageGallery({ contentId }: ImageGalleryProps) {
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        setLoading(true);
        const data = await getDetailImage(contentId);
        setImages(data);
      } catch (err) {
        console.error('이미지 조회 실패:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [contentId]);

  // 키보드 네비게이션
  useEffect(() => {
    if (selectedIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' && selectedIndex > 0) {
        setSelectedIndex(selectedIndex - 1);
      } else if (e.key === 'ArrowRight' && selectedIndex < images.length - 1) {
        setSelectedIndex(selectedIndex + 1);
      } else if (e.key === 'Escape') {
        setSelectedIndex(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, images.length]);

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4">갤러리</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="aspect-video w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!images || images.length === 0) return null;

  return (
    <>
      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4">
            갤러리 ({images.length})
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image, index) => (
              <button
                key={image.serialnum || index}
                onClick={() => setSelectedIndex(index)}
                className="relative aspect-video overflow-hidden rounded-lg hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <Image
                  src={image.smallimageurl || image.originimgurl}
                  alt={`갤러리 이미지 ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 전체화면 모달 */}
      <Dialog 
        open={selectedIndex !== null} 
        onOpenChange={(open) => !open && setSelectedIndex(null)}
      >
        <DialogContent className="max-w-7xl w-full p-0 bg-black">
          {selectedIndex !== null && (
            <div className="relative">
              {/* 이미지 */}
              <div className="relative w-full h-[80vh]">
                <Image
                  src={images[selectedIndex].originimgurl}
                  alt={`갤러리 이미지 ${selectedIndex + 1}`}
                  fill
                  className="object-contain"
                  sizes="100vw"
                  priority
                />
              </div>

              {/* 이전 버튼 */}
              {selectedIndex > 0 && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
                  onClick={() => setSelectedIndex(selectedIndex - 1)}
                >
                  <ChevronLeft className="h-8 w-8" />
                </Button>
              )}

              {/* 다음 버튼 */}
              {selectedIndex < images.length - 1 && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
                  onClick={() => setSelectedIndex(selectedIndex + 1)}
                >
                  <ChevronRight className="h-8 w-8" />
                </Button>
              )}

              {/* 닫기 버튼 */}
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white"
                onClick={() => setSelectedIndex(null)}
              >
                <X className="h-6 w-6" />
              </Button>

              {/* 이미지 카운터 */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full text-sm">
                {selectedIndex + 1} / {images.length}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
