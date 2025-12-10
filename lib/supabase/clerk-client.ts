"use client";

import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { useSession } from "@clerk/nextjs";
import { useMemo } from "react";

/**
 * Clerk + Supabase 네이티브 통합 클라이언트 (Client Component용)
 *
 * Supabase 공식 문서 구조 + Clerk 통합:
 * - Supabase 공식 문서: https://supabase.com/docs/guides/getting-started/quickstarts/nextjs
 * - Clerk 통합: https://clerk.com/docs/guides/development/integrations/databases/supabase
 * - @supabase/supabase-js의 createClient 사용 (Clerk 통합을 위해 accessToken 옵션 필요)
 * - useSession() 훅으로 Clerk 세션 접근
 *
 * @example
 * ```tsx
 * 'use client';
 *
 * import { useClerkSupabaseClient } from '@/lib/supabase/clerk-client';
 *
 * export default function MyComponent() {
 *   const supabase = useClerkSupabaseClient();
 *
 *   async function fetchData() {
 *     const { data } = await supabase.from('table').select('*');
 *     return data;
 *   }
 *
 *   return <div>...</div>;
 * }
 * ```
 */
export function useClerkSupabaseClient() {
  const { session } = useSession();

  const supabase = useMemo(() => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey =
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

    return createSupabaseClient(supabaseUrl, supabaseKey, {
      accessToken: async () => {
        return (await session?.getToken()) ?? null;
      },
    });
  }, [session]);

  return supabase;
}
