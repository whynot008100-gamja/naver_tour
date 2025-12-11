'use client';

import { useEffect, useState } from 'react';
import { useClerkSupabaseClient } from '@/lib/supabase/clerk-client';
import { getUserBookmarks } from '@/lib/api/supabase-api';
import { getDetailCommon } from '@/lib/api/tour-api';
import { Card, CardContent } from '@/components/ui/card';
import { TourCard } from '@/components/tour-card';
import { Loader2 } from 'lucide-react';

interface BookmarkListProps {
  userId: string;
}

interface BookmarkWithDetail {
  id: string;
  content_id: string;
  created_at: string;
  detail?: any;
}

export function BookmarkList({ userId }: BookmarkListProps) {
  const supabase = useClerkSupabaseClient();
  const [bookmarks, setBookmarks] = useState<BookmarkWithDetail[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBookmarks() {
      try {
        // Supabase user_id 조회
        const { data: userData } = await supabase
          .from('users')
          .select('id')
          .eq('clerk_id', userId)
          .single();

        if (!userData) {
          setLoading(false);
          return;
        }

        // 북마크 목록 조회
        const bookmarkData = await getUserBookmarks(userData.id, supabase);
        
        // 각 북마크의 관광지 정보 조회
        const bookmarksWithDetails = await Promise.all(
          bookmarkData.map(async (bookmark) => {
            try {
              const detail = await getDetailCommon(bookmark.content_id);
              return {
                ...bookmark,
                detail: detail[0],
              };
            } catch (error) {
              console.error(`관광지 ${bookmark.content_id} 조회 실패:`, error);
              return bookmark;
            }
          })
        );

        setBookmarks(bookmarksWithDetails);
      } catch (error) {
        console.error('북마크 조회 실패:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchBookmarks();
  }, [userId, supabase]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (bookmarks.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">
            아직 북마크한 관광지가 없습니다.
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            관광지 상세 페이지에서 별 아이콘을 클릭하여 북마크를 추가하세요.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {bookmarks.map((bookmark) => {
        if (!bookmark.detail) return null;
        
        return (
          <TourCard
            key={bookmark.id}
            item={bookmark.detail}
          />
        );
      })}
    </div>
  );
}
