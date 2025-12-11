import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getServiceRoleClient } from "@/lib/supabase/service-role";

/**
 * Clerk 사용자를 Supabase users 테이블에 동기화하는 API
 *
 * 클라이언트에서 로그인 후 이 API를 호출하여 사용자 정보를 Supabase에 저장합니다.
 * 이미 존재하는 경우 업데이트하고, 없으면 새로 생성합니다.
 */
export async function POST() {
  try {
    console.log("[sync-user] Starting user sync...");

    // 환경변수 확인
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceRoleKey) {
      console.error("[sync-user] Missing Supabase environment variables:", {
        hasUrl: !!supabaseUrl,
        hasServiceRoleKey: !!supabaseServiceRoleKey,
      });
      return NextResponse.json(
        {
          error: "Failed to sync user",
          details: "Supabase environment variables are not configured",
        },
        { status: 500 }
      );
    }

    // Clerk 인증 확인
    console.log("[sync-user] Checking Clerk authentication...");
    const { userId } = await auth();

    if (!userId) {
      console.warn("[sync-user] No user ID found - user not authenticated");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("[sync-user] User authenticated:", userId);

    // Clerk에서 사용자 정보 가져오기
    console.log("[sync-user] Fetching user info from Clerk...");
    const client = await clerkClient();
    const clerkUser = await client.users.getUser(userId);

    if (!clerkUser) {
      console.error("[sync-user] Clerk user not found for ID:", userId);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    console.log("[sync-user] Clerk user fetched:", {
      id: clerkUser.id,
      name: clerkUser.fullName || clerkUser.username || "Unknown",
    });

    // Supabase에 사용자 정보 동기화
    console.log("[sync-user] Initializing Supabase client...");
    let supabase;
    try {
      supabase = getServiceRoleClient();
      console.log("[sync-user] Supabase client initialized");
    } catch (error: any) {
      console.error("[sync-user] Failed to initialize Supabase client:", {
        error: error?.message || String(error),
      });
      return NextResponse.json(
        {
          error: "Failed to sync user",
          details: `Supabase client initialization failed: ${error?.message || String(error)}`,
        },
        { status: 500 }
      );
    }

    // 사용자 이름 결정
    const userName =
      clerkUser.fullName ||
      clerkUser.username ||
      clerkUser.emailAddresses[0]?.emailAddress ||
      "Unknown";

    console.log("[sync-user] Upserting user to Supabase:", {
      clerk_id: clerkUser.id,
      name: userName,
    });

    const { data, error } = await supabase
      .from("users")
      .upsert(
        {
          clerk_id: clerkUser.id,
          name: userName,
        },
        {
          onConflict: "clerk_id",
        }
      )
      .select()
      .single();

    if (error) {
      console.error("[sync-user] Supabase sync error:", {
        error: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
        // 테이블이 존재하지 않을 수 있음
        possibleCause: error.code === "42P01" 
          ? "users table does not exist - run migration"
          : error.code === "23505"
          ? "Unique constraint violation"
          : "Unknown database error",
      });
      return NextResponse.json(
        {
          error: "Failed to sync user",
          details: error.message || "Database error",
          code: error.code,
          hint: error.hint,
        },
        { status: 500 }
      );
    }

    console.log("[sync-user] User synced successfully:", {
      id: data?.id,
      clerk_id: data?.clerk_id,
      name: data?.name,
    });

    return NextResponse.json({
      success: true,
      user: data,
    });
  } catch (error: any) {
    console.error("[sync-user] Unexpected error:", {
      error: error?.message || String(error),
      stack: error?.stack,
      name: error?.name,
      type: typeof error,
    });
    
    // 에러 타입에 따라 다른 메시지 반환
    const errorMessage = error?.message || "Internal server error";
    
    // 개발 환경에서만 스택 트레이스 포함
    const isDevelopment = process.env.NODE_ENV === "development";
    const errorResponse: any = {
      error: "Failed to sync user",
      details: errorMessage,
    };

    if (isDevelopment && error?.stack) {
      errorResponse.stack = error.stack;
    }

    return NextResponse.json(errorResponse, { status: 500 });
  }
}
