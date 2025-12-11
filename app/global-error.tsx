'use client';

import { Button } from '@/components/ui/button';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="max-w-md w-full text-center space-y-4">
            <h2 className="text-2xl font-bold">문제가 발생했습니다</h2>
            <p className="text-muted-foreground">
              예상치 못한 오류가 발생했습니다.
            </p>
            <div className="flex gap-2 justify-center">
              <Button onClick={reset}>다시 시도</Button>
              <Button variant="outline" onClick={() => window.location.href = '/'}>
                홈으로
              </Button>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
