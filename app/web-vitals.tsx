'use client';

import { useReportWebVitals } from 'next/web-vitals';

export function WebVitals() {
  useReportWebVitals((metric) => {
    // 프로덕션에서는 analytics로 전송
    console.log(metric);
  });
  
  return null;
}
