'use client';

import { useEffect, useState, useMemo } from 'react';
import { useClerkSupabaseClient } from '@/lib/supabase/clerk-client';
import { getUserBookmarks } from '@/lib/api/supabase-api';
import { getDetailCommon } from '@/lib/api/tour-api';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TourCard } from '@/components/tour-card';
import { Loader2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
  const [sortBy, setSortBy] = useState('latest');

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

  const handleRemove = async (bookmarkId: string) => {
    try {
      const { error } = await supabase
        .from('bookmarks')
        .delete()
        .eq('id', bookmarkId);

      if (error) throw error;

      // 로컬 상태 업데이트
      setBookmarks(bookmarks.filter(b => b.id !== bookmarkId));
    } catch (error) {
      console.error('북마크 삭제 실패:', error);
      alert('북마크 삭제에 실패했습니다.');
    }
  };

  const sortedBookmarks = useMemo(() => {
    const sorted = [...bookmarks];
    
    switch (sortBy) {
      case 'latest':
        return sorted.sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      case 'oldest':
        return sorted.sort((a, b) => 
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
      case 'name':
        return sorted.sort((a, b) => 
          (a.detail?.title || '').localeCompare(b.detail?.title || '')
        );
      default:
        return sorted;
    }
  }, [bookmarks, sortBy]);

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
    <>
      {/* 정렬 드롭다운 */}
      <div className="flex justify-between items-center mb-6">
        <p className="text-sm text-muted-foreground">
          총 {bookmarks.length}개의 북마크
        </p>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="latest">최신순</SelectItem>
            <SelectItem value="oldest">오래된순</SelectItem>
            <SelectItem value="name">이름순</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* 북마크 목록 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedBookmarks.map((bookmark) => {
          if (!bookmark.detail) return null;
          
          return (
            <div key={bookmark.id} className="relative group">
              <TourCard item={bookmark.detail} />
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => handleRemove(bookmark.id)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          );
        })}
      </div>
    </>
  );
}
