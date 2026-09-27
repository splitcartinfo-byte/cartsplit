import { type ReactNode } from 'react';
import { cn } from '@/utils';

export function Card({ children, className, onClick }: { children: ReactNode; className?: string; onClick?: () => void }) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'bg-white rounded-2xl border border-ink-100 shadow-card',
        onClick && 'cursor-pointer transition-all duration-200 hover:shadow-float hover:border-ink-200',
        className
      )}
    >
      {children}
    </div>
  );
}

type BadgeVariant = 'brand' | 'neutral' | 'success' | 'warning' | 'error' | 'accent' | 'blue';

const badgeVariants: Record<BadgeVariant, string> = {
  brand: 'bg-brand-50 text-brand-700 border-brand-200',
  neutral: 'bg-ink-100 text-ink-600 border-ink-200',
  success: 'bg-success-50 text-success-700 border-success-500/20',
  warning: 'bg-warning-50 text-warning-600 border-warning-500/20',
  error: 'bg-error-50 text-error-600 border-error-500/20',
  accent: 'bg-accent-50 text-accent-700 border-accent-200',
  blue: 'bg-blue-50 text-blue-700 border-blue-200',
};

export function Badge({
  children,
  variant = 'neutral',
  className,
  icon,
}: {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
  icon?: ReactNode;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border',
        badgeVariants[variant],
        className
      )}
    >
      {icon}
      {children}
    </span>
  );
}

export function Avatar({
  initials,
  size = 'md',
  className,
  ring,
}: {
  initials: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
  ring?: boolean;
}) {
  const sizes = {
    xs: 'w-7 h-7 text-[10px]',
    sm: 'w-9 h-9 text-xs',
    md: 'w-11 h-11 text-sm',
    lg: 'w-14 h-14 text-base',
  };
  return (
    <div
      className={cn(
        'rounded-full bg-brand-100 text-brand-700 font-bold flex items-center justify-center shrink-0',
        ring && 'ring-2 ring-white shadow-sm',
        sizes[size],
        className
      )}
    >
      {initials}
    </div>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('skeleton', className)} />;
}

export function Spinner({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'inline-block w-5 h-5 border-2 border-brand-600 border-t-transparent rounded-full animate-spin',
        className
      )}
    />
  );
}
