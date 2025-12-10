import { cn } from "@/lib/utils";
import { AlertCircle, AlertTriangle, Info, XCircle } from "lucide-react";
import { Button } from "./button";

interface ErrorMessageProps {
  /** 에러 메시지 */
  message: string;
  /** 에러 타입 */
  type?: "error" | "warning" | "info";
  /** 재시도 버튼 표시 */
  showRetry?: boolean;
  /** 재시도 버튼 클릭 핸들러 */
  onRetry?: () => void;
  /** 추가 className */
  className?: string;
}

const typeConfig = {
  error: {
    icon: XCircle,
    className: "bg-destructive/10 text-destructive border-destructive/20",
  },
  warning: {
    icon: AlertTriangle,
    className: "bg-yellow-50 text-yellow-800 border-yellow-200 dark:bg-yellow-900/10 dark:text-yellow-500 dark:border-yellow-900/20",
  },
  info: {
    icon: Info,
    className: "bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-900/10 dark:text-blue-500 dark:border-blue-900/20",
  },
};

/**
 * 에러 메시지 컴포넌트
 * 
 * @example
 * ```tsx
 * <ErrorMessage 
 *   message="데이터를 불러오는데 실패했습니다." 
 *   type="error"
 *   showRetry
 *   onRetry={() => refetch()}
 * />
 * ```
 */
export function ErrorMessage({
  message,
  type = "error",
  showRetry = false,
  onRetry,
  className,
}: ErrorMessageProps) {
  const config = typeConfig[type];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-lg border p-4",
        config.className,
        className
      )}
    >
      <Icon className="h-5 w-5 flex-shrink-0 mt-0.5" />
      <div className="flex-1 space-y-2">
        <p className="text-sm font-medium">{message}</p>
        {showRetry && onRetry && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRetry}
            className="mt-2"
          >
            다시 시도
          </Button>
        )}
      </div>
    </div>
  );
}

/**
 * 전체 페이지 에러 컴포넌트
 * 
 * @example
 * ```tsx
 * <ErrorPage 
 *   title="페이지를 찾을 수 없습니다"
 *   message="요청하신 페이지가 존재하지 않습니다."
 * />
 * ```
 */
export function ErrorPage({
  title = "오류가 발생했습니다",
  message = "페이지를 불러오는 중 문제가 발생했습니다.",
  showRetry = true,
  onRetry,
}: {
  title?: string;
  message?: string;
  showRetry?: boolean;
  onRetry?: () => void;
}) {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center gap-4 p-8 text-center">
      <AlertCircle className="h-12 w-12 text-destructive" />
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">{title}</h2>
        <p className="text-muted-foreground max-w-md">{message}</p>
      </div>
      {showRetry && onRetry && (
        <Button onClick={onRetry} className="mt-4">
          다시 시도
        </Button>
      )}
    </div>
  );
}
