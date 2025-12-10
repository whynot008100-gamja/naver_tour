/**
 * @deprecated 이 파일은 레거시입니다.
 * 
 * 대신 다음을 사용하세요:
 * - Server Component: `createClerkSupabaseClient` from '@/lib/supabase/server'
 * - Client Component: `useClerkSupabaseClient` from '@/lib/supabase/clerk-client'
 * - Route Handler: `createClerkSupabaseRouteHandlerClient` from '@/lib/supabase/route-handler'
 * - Service Role: `getServiceRoleClient` from '@/lib/supabase/service-role'
 */

import { createClerkSupabaseClient } from "./supabase/server";

/**
 * @deprecated createClerkSupabaseClient를 직접 사용하세요.
 */
export const createSupabaseClient = createClerkSupabaseClient;
