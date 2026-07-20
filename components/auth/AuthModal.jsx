'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { Button } from "@/components/ui/button";

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
        <Button variant="none" size="none" style={{fontSize: "var(--font-size-button-secondary, var(--font-size-button-default))"}} 
          onClick={onDismiss}
          className="fixed top-4 right-4 sm:top-6 sm:right-6 z-[60] flex h-10 w-10 items-center justify-center rounded-full bg-slate-200/50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 hover:bg-slate-300/50 dark:hover:bg-slate-700/50 backdrop-blur-md transition-colors"
        >
          <X className="h-5 w-5" />
          <span className="sr-only">Close</span>
        </Button>

        <div className="relative w-full max-w-md animate-in fade-in zoom-in-95 duration-200">
          <div className="relative w-full max-w-md animate-in fade-in zoom-in-95 duration-300">
            {/* The modal card content is injected here */}
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
