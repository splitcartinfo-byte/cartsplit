import { type InputHTMLAttributes, type TextareaHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, icon, className, id, ...props }, ref) => {
    const inputId = id || props.name;
    return (
      <div className="space-y-1.5">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-semibold text-ink-700">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400">
              {icon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              'w-full h-12 rounded-xl border bg-white px-4 text-sm text-ink-900 placeholder:text-ink-400',
              'transition-all duration-150 outline-none',
              'focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15',
              Boolean(icon) && 'pl-11',
              error ? 'border-error-400 focus:border-error-500 focus:ring-error-500/15' : 'border-ink-200',
              className
            )}
            {...props}
          />
        </div>
        {error && <p className="text-xs text-error-600 font-medium">{error}</p>}
        {hint && !error && <p className="text-xs text-ink-500">{hint}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className, id, ...props }, ref) => {
    const textareaId = id || props.name;
    return (
      <div className="space-y-1.5">
        {label && (
          <label htmlFor={textareaId} className="block text-sm font-semibold text-ink-700">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={cn(
            'w-full rounded-xl border bg-white px-4 py-3 text-sm text-ink-900 placeholder:text-ink-400',
            'transition-all duration-150 outline-none resize-none',
            'focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15',
            error ? 'border-error-400' : 'border-ink-200',
            className
          )}
          rows={4}
          {...props}
        />
        {error && <p className="text-xs text-error-600 font-medium">{error}</p>}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
