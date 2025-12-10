import { SignIn } from "@clerk/nextjs";

/**
 * 로그인 페이지
 *
 * Clerk 공식 문서 모범 사례:
 * - ClerkProvider에서 전역 localization 설정 (app/layout.tsx)
 * - 개별 컴포넌트는 ClerkProvider의 localization을 자동으로 상속받음
 *
 * 참고: https://clerk.com/docs/guides/customizing-clerk/localization
 */
export default function SignInPage() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <SignIn />
    </div>
  );
}

