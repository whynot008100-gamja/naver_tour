'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center space-y-4">
        <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
        <h2 className="text-2xl font-bold">오류가 발생했습니다</h2>
        <p className="text-muted-foreground">
          관광지 정보를 불러오는데 실패했습니다.
        </p>
        <Button onClick={reset}>다시 시도</Button>
      </div>
    </div>
  );
}
