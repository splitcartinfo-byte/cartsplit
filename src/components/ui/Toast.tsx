import { type ReactNode } from 'react';
import { cn } from '@/utils';

type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
}

const toastStyles: Record<ToastType, { bg: string; icon: ReactNode }> = {
  success: { bg: 'bg-brand-600', icon: null },
  error: { bg: 'bg-error-600', icon: null },
  info: { bg: 'bg-ink-800', icon: null },
};

export function Toast({ message, type, onClose }: ToastProps) {
  const style = toastStyles[type];
  return (
    <div
      onClick={onClose}
      className={cn(
        'px-4 py-3 rounded-xl text-white text-sm font-medium shadow-float max-w-sm',
        style.bg
      )}
    >
      {message}
    </div>
  );
}

export function ToastContainer({ toasts, onDismiss }: { toasts: { id: string; message: string; type: ToastType }[]; onDismiss: (id: string) => void }) {
  return (
    <div className="fixed bottom-20 sm:bottom-6 left-1/2 -translate-x-1/2 z-[60] flex flex-col gap-2 items-center px-4 w-full max-w-sm pointer-events-none">
      {toasts.map((t) => (
        <div key={t.id} className="pointer-events-auto animate-slide-up w-full">
          <Toast message={t.message} type={t.type} onClose={() => onDismiss(t.id)} />
        </div>
      ))}
    </div>
  );
}
