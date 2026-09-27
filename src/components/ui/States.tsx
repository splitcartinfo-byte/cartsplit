import { type ReactNode } from 'react';
import { cn } from '@/utils';

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('flex flex-col items-center justify-center text-center py-16 px-6', className)}>
      <div className="w-16 h-16 rounded-2xl bg-ink-100 flex items-center justify-center text-ink-400 mb-4">
        {icon}
      </div>
      <h3 className="text-base font-bold text-ink-900 mb-1">{title}</h3>
      <p className="text-sm text-ink-500 max-w-xs mb-4">{description}</p>
      {action}
    </div>
  );
}

export function ErrorState({
  icon,
  title,
  description,
  action,
  className,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('flex flex-col items-center justify-center text-center py-16 px-6', className)}>
      <div className="w-16 h-16 rounded-2xl bg-error-50 flex items-center justify-center text-error-500 mb-4">
        {icon}
      </div>
      <h3 className="text-base font-bold text-ink-900 mb-1">{title}</h3>
      <p className="text-sm text-ink-500 max-w-xs mb-4">{description}</p>
      {action}
    </div>
  );
}

export function LoadingSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('space-y-4', className)}>
      {[...Array(3)].map((_, i) => (
        <div key={i} className="bg-white rounded-2xl border border-ink-100 p-4 space-y-3">
          <div className="flex gap-3">
            <div className="skeleton w-16 h-16 rounded-xl" />
            <div className="flex-1 space-y-2">
              <div className="skeleton h-4 w-24 rounded" />
              <div className="skeleton h-3 w-32 rounded" />
              <div className="skeleton h-3 w-20 rounded" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
