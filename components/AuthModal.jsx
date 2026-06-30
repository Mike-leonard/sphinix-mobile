'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef } from 'react';
import { X } from 'lucide-react';

export default function AuthModal({ children }) {
  const overlay = useRef(null);
  const wrapper = useRef(null);
  const router = useRouter();

  const onDismiss = useCallback(() => {
    router.back();
  }, [router]);

  const onClick = useCallback(
    (e) => {
      if (e.target === overlay.current || e.target === wrapper.current) {
        if (onDismiss) onDismiss();
      }
    },
    [onDismiss, overlay, wrapper]
  );

  const onKeyDown = useCallback(
    (e) => {
      if (e.key === 'Escape') onDismiss();
    },
    [onDismiss]
  );

  useEffect(() => {
    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [onKeyDown]);

  return (
    <div
      ref={overlay}
      className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm"
      onClick={onClick}
    >
      <div
        ref={wrapper}
        className="fixed inset-0 flex items-center justify-center p-4 sm:p-6"
      >
        <div className="relative w-full max-w-md animate-in fade-in zoom-in-95 duration-200">
          <button
            onClick={onDismiss}
            className="absolute -top-3 -right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 shadow-sm border border-slate-200 dark:border-slate-700 transition-colors"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>
          {children}
        </div>
      </div>
    </div>
  );
}
