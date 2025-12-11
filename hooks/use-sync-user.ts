"use client";

import { useAuth } from "@clerk/nextjs";
import { useEffect, useRef } from "react";

/**
 * Clerk 사용자를 Supabase DB에 자동으로 동기화하는 훅
 *
 * 사용자가 로그인한 상태에서 이 훅을 사용하면
 * 자동으로 /api/sync-user를 호출하여 Supabase users 테이블에 사용자 정보를 저장합니다.
 *
 * @example
 * ```tsx
 * 'use client';
 *
 * import { useSyncUser } from '@/hooks/use-sync-user';
 *
 * export default function Layout({ children }) {
 *   useSyncUser();
 *   return <>{children}</>;
 * }
 * ```
 */
export function useSyncUser() {
  const { isLoaded, userId } = useAuth();
  const syncedRef = useRef(false);

  useEffect(() => {
    // 이미 동기화했거나, 로딩 중이거나, 로그인하지 않은 경우 무시
    if (syncedRef.current || !isLoaded || !userId) {
      return;
    }

    // 동기화 실행
    const syncUser = async () => {
      try {
        const response = await fetch("/api/sync-user", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          // 응답 본문 읽기 (한 번만 읽을 수 있음)
          let errorMessage = `HTTP ${response.status} ${response.statusText}`;
          try {
            const errorData = await response.json();
            errorMessage = errorData.error || errorData.details || errorMessage;
          } catch {
            // JSON 파싱 실패 시 텍스트로 읽기 시도
            try {
              const errorText = await response.text();
              errorMessage = errorText || errorMessage;
            } catch {
              // 응답 본문 읽기 실패 시 기본 메시지 사용
            }
          }
          
          console.error("Failed to sync user:", {
            status: response.status,
            statusText: response.statusText,
            message: errorMessage,
          });
          return;
        }

        syncedRef.current = true;
        console.log("User synced successfully");
      } catch (error: any) {
        // 네트워크 에러 또는 기타 에러
        const errorMessage = error?.message || String(error);
        console.error("Error syncing user:", {
          error: errorMessage,
          type: error?.name || "Unknown",
          hint: errorMessage.includes("fetch failed")
            ? "API 라우트에 접근할 수 없습니다. 개발 서버가 실행 중인지 확인하세요."
            : "알 수 없는 에러가 발생했습니다.",
        });
      }
    };

    syncUser();
  }, [isLoaded, userId]);
}
