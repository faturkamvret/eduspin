'use client';

import { useAppStore } from '@/store/useAppStore';
import { useEffect, type ReactNode } from 'react';
import { setMuted } from '@/lib/sfx';
import { setTtsMuted } from '@/lib/tts';
import { flushSync, startSync } from '@/lib/sync';
import { isFirebaseEnabled } from '@/lib/firebase';

/**
 * Wait until Zustand persist has hydrated state from localStorage.
 * Also bootstraps cloud sync (idempotent — safe to mount in every page).
 * This prevents SSR mismatch flashes and avoids using a stale empty state.
 */
export function HydrationGate({ children }: { children: ReactNode }) {
  const hydrated = useAppStore((s) => s.hydrated);
  const muted = useAppStore((s) => s.settings.muted);

  // Apply mute setting to SFX engine + story-mode TTS
  useEffect(() => {
    setMuted(muted);
    setTtsMuted(muted);
  }, [muted]);

  // Boot cloud sync once after hydration. startSync() is idempotent and a no-op
  // when Firebase is not configured.
  useEffect(() => {
    if (!hydrated) return;
    if (!isFirebaseEnabled) return;
    void startSync();

    // Best-effort flush on tab close so unsaved progress is pushed.
    const handler = () => flushSync();
    window.addEventListener('pagehide', handler);
    return () => window.removeEventListener('pagehide', handler);
  }, [hydrated]);

  if (!hydrated) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="font-display text-2xl text-slate-500">EduSpin</div>
      </div>
    );
  }
  return <>{children}</>;
}
