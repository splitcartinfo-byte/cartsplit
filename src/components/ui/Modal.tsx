import { type ReactNode, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

export function Modal({ open, onClose, title, children, footer, size = 'md' }: ModalProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-ink-950/40 backdrop-blur-sm z-50"
          />
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.98 }}
              transition={{ type: 'spring', damping: 28, stiffness: 320 }}
              className={`w-full ${sizes[size]} bg-white rounded-t-3xl sm:rounded-2xl shadow-float pointer-events-auto max-h-[90vh] flex flex-col`}
            >
              {title && (
                <div className="flex items-center justify-between px-5 py-4 border-b border-ink-100 shrink-0">
                  <h2 className="text-base font-bold text-ink-900">{title}</h2>
                  <button
                    onClick={onClose}
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-ink-400 hover:bg-ink-100 hover:text-ink-700 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              )}
              {!title && (
                <button
                  onClick={onClose}
                  className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-lg text-ink-400 hover:bg-ink-100 transition-colors sm:hidden"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
              <div className="overflow-y-auto flex-1 px-5 py-4">{children}</div>
              {footer && (
                <div className="px-5 py-4 border-t border-ink-100 shrink-0 safe-bottom">
                  {footer}
                </div>
              )}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
