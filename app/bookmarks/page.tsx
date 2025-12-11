import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bookmark } from 'lucide-react';

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
        <Card>
          <CardHeader>
            <CardTitle>북마크 목록</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              북마크한 관광지가 여기에 표시됩니다. (Phase 5B에서 구현)
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
