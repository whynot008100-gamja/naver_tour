import { useClerkSupabaseClient } from '@/lib/supabase/clerk-client';

// 주의: 이 파일의 함수들은 Client Component에서만 사용 가능합니다.
// useClerkSupabaseClient 훅을 사용하므로 React 컴포넌트 내에서 호출해야 합니다.

/**
 * 북마크 조회 - 특정 사용자의 특정 관광지 북마크 확인
 */
export async function getBookmark(userId: string, contentId: string, supabase: ReturnType<typeof useClerkSupabaseClient>) {
  const { data, error } = await supabase
    .from('bookmarks')
    .select('*')
    .eq('user_id', userId)
    .eq('content_id', contentId)
    .single();

  if (error && error.code !== 'PGRST116') {
    // PGRST116 = 결과 없음 (정상)
    console.error('북마크 조회 실패:', error);
    return null;
  }

  return data;
}

/**
 * 북마크 추가
 */
export async function addBookmark(userId: string, contentId: string, supabase: ReturnType<typeof useClerkSupabaseClient>) {
  const { data, error } = await supabase
    .from('bookmarks')
    .insert({
      user_id: userId,
      content_id: contentId,
    })
    .select()
    .single();

  if (error) {
    console.error('북마크 추가 실패:', error);
    throw error;
  }

  return data;
}

/**
 * 북마크 제거
 */
export async function removeBookmark(userId: string, contentId: string, supabase: ReturnType<typeof useClerkSupabaseClient>) {
  const { error } = await supabase
    .from('bookmarks')
    .delete()
    .eq('user_id', userId)
    .eq('content_id', contentId);

  if (error) {
    console.error('북마크 제거 실패:', error);
    throw error;
  }
}

/**
 * 사용자 북마크 목록 조회
 */
export async function getUserBookmarks(userId: string, supabase: ReturnType<typeof useClerkSupabaseClient>) {
  const { data, error } = await supabase
    .from('bookmarks')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('북마크 목록 조회 실패:', error);
    return [];
  }

  return data;
}
