'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/store/useAppStore';
import { HydrationGate } from '@/components/HydrationGate';
import { ensureAnonymousUser, isFirebaseEnabled } from '@/lib/firebase';

export default function HomeRedirect() {
  return (
    <HydrationGate>
      <Inner />
    </HydrationGate>
  );
}

function Inner() {
  const router = useRouter();
  const profile = useAppStore((s) => s.profile);

  useEffect(() => {
    // Best-effort: kick off anonymous auth in background if Firebase is configured.
    if (isFirebaseEnabled) {
      ensureAnonymousUser().catch(() => {
        /* ignore — app still works fully offline */
      });
    }
    if (profile) {
      router.replace('/home');
    } else {
      router.replace('/onboarding');
    }
  }, [profile, router]);

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 p-6 text-center">
      <div className="text-6xl animate-bounce-soft">🎡</div>
      <h1 className="font-display text-3xl font-bold text-primary-600">EduSpin</h1>
      <p className="text-slate-600">Memuat petualanganmu...</p>
    </div>
  );
}
