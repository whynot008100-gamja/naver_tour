import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { auth } from "@clerk/nextjs/server";

/**
 * Clerk + Supabase 네이티브 통합 클라이언트 (Server Component용)
 *
 * Supabase 공식 문서 구조 + Clerk 통합:
 * - Supabase 공식 문서: https://supabase.com/docs/guides/getting-started/quickstarts/nextjs
 * - Clerk 통합: https://clerk.com/docs/guides/development/integrations/databases/supabase
 * - @supabase/supabase-js의 createClient 사용 (Clerk 통합을 위해 accessToken 옵션 필요)
 * - auth().getToken()으로 서버 사이드 Clerk 토큰 접근
 *
 * @example
 * ```tsx
 * // Server Component
 * import { createClient } from '@/lib/supabase/server';
 *
 * export default async function MyPage() {
 *   const supabase = createClient();
 *   const { data } = await supabase.from('table').select('*');
 *   return <div>...</div>;
 * }
 * ```
 */
export function createClerkSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  return createSupabaseClient(supabaseUrl, supabaseKey, {
    accessToken: async () => {
      return (await auth()).getToken() ?? null;
    },
  });
}
