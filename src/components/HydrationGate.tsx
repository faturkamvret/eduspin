'use client';

import { useAppStore } from '@/store/useAppStore';
import { useEffect, type ReactNode } from 'react';
import { setMuted } from '@/lib/sfx';

/**
 * Wait until Zustand persist has hydrated state from localStorage.
 * This prevents SSR mismatch flashes and avoids using a stale empty state.
 */
export function HydrationGate({ children }: { children: ReactNode }) {
  const hydrated = useAppStore((s) => s.hydrated);
  const muted = useAppStore((s) => s.settings.muted);

  useEffect(() => {
    setMuted(muted);
  }, [muted]);

  if (!hydrated) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="font-display text-2xl text-slate-500">EduSpin</div>
      </div>
    );
  }
  return <>{children}</>;
}
