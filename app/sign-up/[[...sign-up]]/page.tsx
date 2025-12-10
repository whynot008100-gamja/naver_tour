import { SignUp } from "@clerk/nextjs";
import { koKR } from "@clerk/localizations";

/**
 * 회원가입 페이지
 *
 * Clerk 공식 문서 모범 사례:
 * - ClerkProvider에서 전역 localization 설정 (app/layout.tsx)
 * - 개별 컴포넌트에도 localization prop 전달 가능 (선택사항)
 *
 * 참고: https://clerk.com/docs/guides/customizing-clerk/localization
 */
export default function SignUpPage() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <SignUp localization={koKR} />
    </div>
  );
}

