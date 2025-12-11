'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { MessageSquare, X } from 'lucide-react';

export function FeedbackButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 실제로는 API로 전송하거나 이메일로 보내기
    console.log('피드백:', feedback);
    
    setSubmitted(true);
    setTimeout(() => {
      setIsOpen(false);
      setSubmitted(false);
      setFeedback('');
    }, 2000);
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 rounded-full shadow-lg"
        size="icon"
        aria-label="피드백 보내기"
      >
        <MessageSquare className="h-5 w-5" />
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-4 right-4 w-80 shadow-lg z-50">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">피드백 보내기</CardTitle>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsOpen(false)}
          aria-label="닫기"
        >
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        {submitted ? (
          <p className="text-sm text-center py-4 text-green-600">
            피드백이 전송되었습니다. 감사합니다!
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Textarea
              placeholder="개선 사항이나 버그를 알려주세요..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="min-h-[100px]"
              required
            />
            <Button type="submit" className="w-full">
              전송
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
