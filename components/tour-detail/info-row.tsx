import { ReactNode } from 'react';

interface InfoRowProps {
  icon: React.ElementType;
  label?: string;
  children: ReactNode;
}

export function InfoRow({ icon: Icon, label, children }: InfoRowProps) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        {label && (
          <p className="text-xs text-muted-foreground mb-1">{label}</p>
        )}
        <div className="text-sm">{children}</div>
      </div>
    </div>
  );
}
