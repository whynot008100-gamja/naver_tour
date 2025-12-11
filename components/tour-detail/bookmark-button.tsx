'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';
import { getBookmark, addBookmark, removeBookmark } from '@/lib/api/supabase-api';
import { useRouter } from 'next/navigation';
import { useClerkSupabaseClient } from '@/lib/supabase/clerk-client';

interface BookmarkButtonProps {
  contentId: string;
}

export function BookmarkButton({ contentId }: BookmarkButtonProps) {
  const { user, isSignedIn } = useUser();
  const router = useRouter();
  const supabase = useClerkSupabaseClient();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [loading, setLoading] = useState(false);

  // 북마크 상태 확인
  useEffect(() => {
    if (!isSignedIn || !user) return;

    const checkBookmark = async () => {
      try {
        // Supabase users 테이블에서 user_id 조회
        const { data: userData } = await supabase
          .from('users')
          .select('id')
          .eq('clerk_id', user.id)
          .single();

        if (!userData) return;

        const bookmark = await getBookmark(userData.id, contentId, supabase);
        setIsBookmarked(!!bookmark);
      } catch (err) {
        console.error('북마크 상태 확인 실패:', err);
      }
    };

    checkBookmark();
  }, [isSignedIn, user, contentId, supabase]);

  const handleToggle = async () => {
    if (!isSignedIn) {
      // 로그인 페이지로 이동
      router.push('/sign-in');
      return;
    }

    setLoading(true);
    try {
      // Supabase users 테이블에서 user_id 조회
      const { data: userData } = await supabase
        .from('users')
        .select('id')
        .eq('clerk_id', user!.id)
        .single();

      if (!userData) {
        console.error('사용자 정보 없음');
        return;
      }

      if (isBookmarked) {
        await removeBookmark(userData.id, contentId, supabase);
        setIsBookmarked(false);
      } else {
        await addBookmark(userData.id, contentId, supabase);
        setIsBookmarked(true);
      }
    } catch (err) {
      console.error('북마크 토글 실패:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleToggle}
      variant={isBookmarked ? "default" : "outline"}
      size="sm"
      disabled={loading}
      className="gap-2"
    >
      <Star 
        className={`h-4 w-4 ${isBookmarked ? 'fill-current' : ''}`}
      />
      {isBookmarked ? '북마크됨' : '북마크'}
    </Button>
  );
}
