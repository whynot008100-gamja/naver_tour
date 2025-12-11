'use client';

import { Button } from '@/components/ui/button';
import { Copy } from 'lucide-react';

interface CopyButtonProps {
  text: string;
}

export function CopyButton({ text }: CopyButtonProps) {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      alert('주소가 복사되었습니다.');
    } catch (err) {
      console.error('복사 실패:', err);
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleCopy}
      className="flex-shrink-0"
    >
      <Copy className="h-4 w-4" />
    </Button>
  );
}
