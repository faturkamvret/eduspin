'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';
import { HydrationGate } from '@/components/HydrationGate';
import { FloatingDeco } from '@/components/FloatingDeco';

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
    if (profile) {
      router.replace('/home');
    } else {
      router.replace('/onboarding');
    }
  }, [profile, router]);

  return (
    <div className="relative flex flex-1 flex-col items-center justify-center gap-4 p-6 text-center">
      <FloatingDeco count={14} />
      <motion.div
        animate={{ y: [0, -12, 0], rotate: [-6, 6, -6] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="text-8xl drop-shadow-lg"
      >
        🎡
      </motion.div>
      <h1 className="font-display text-5xl font-extrabold text-rainbow drop-shadow">
        Squizzy
      </h1>
      <p className="font-display text-base font-bold text-slate-600">
        Memuat petualanganmu... ✨
      </p>
    </div>
  );
}
