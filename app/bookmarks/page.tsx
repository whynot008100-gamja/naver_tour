import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { Bookmark } from 'lucide-react';
import { BookmarkList } from '@/components/bookmarks/bookmark-list';

export default async function BookmarksPage() {
  // 인증 확인
  const { userId } = await auth();
  
  if (!userId) {
    redirect('/sign-in');
  }

  return (
    <main className="min-h-screen bg-background">
      {/* 헤더 */}
      <div className="border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <Bookmark className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">내 북마크</h1>
              <p className="text-muted-foreground">
                저장한 관광지 목록
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="container mx-auto px-4 py-8">
        <BookmarkList userId={userId} />
      </div>
    </main>
  );
}
