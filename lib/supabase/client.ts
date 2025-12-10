import { createBrowserClient } from "@supabase/ssr";

/**
 * 공개 데이터용 Supabase 클라이언트 (Client Component용)
 *
 * 인증이 필요 없는 공개 데이터 조회용
 * Supabase 공식 문서 모범 사례: https://supabase.com/docs/guides/getting-started/quickstarts/nextjs
 * - @supabase/ssr의 createBrowserClient 사용
 *
 * @example
 * ```tsx
 * 'use client';
 *
 * import { supabase } from '@/lib/supabase/client';
 *
 * export default function PublicData() {
 *   const { data } = await supabase.from('public_table').select('*');
 *   return <div>...</div>;
 * }
 * ```
 */
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createBrowserClient(supabaseUrl, supabaseKey);
