'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
      <Card className="max-w-md w-full">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertCircle className="h-6 w-6 text-destructive" />
            <CardTitle>오류가 발생했습니다</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            일시적인 문제가 발생했습니다. 잠시 후 다시 시도해주세요.
          </p>
          <div className="flex gap-2">
            <Button onClick={reset}>다시 시도</Button>
            <Button variant="outline" onClick={() => window.location.href = '/'}>
              홈으로
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
