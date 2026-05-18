'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';
import { HydrationGate } from '@/components/HydrationGate';
import { PageShell } from '@/components/PageShell';
import { CoinBadge } from '@/components/CoinBadge';
import { Mascot } from '@/components/Mascot';
import { QUIZ_CATEGORIES } from '@/data/categories';
import { pickAdaptiveQuestions } from '@/data/questions';
import { sfx } from '@/lib/sfx';

const CATEGORY_GRADIENTS: Record<string, string> = {
  shape: 'linear-gradient(135deg, #ffc6d4 0%, #ff8fa3 50%, #ff5d7a 100%)',
  color: 'linear-gradient(135deg, #bae3ff 0%, #7dd3fc 50%, #38bdf8 100%)',
  animal: 'linear-gradient(135deg, #bdf5d8 0%, #86efac 50%, #4ade80 100%)',
  counting: 'linear-gradient(135deg, #fff3b8 0%, #fde047 50%, #facc15 100%)',
  alphabet: 'linear-gradient(135deg, #ddd6fe 0%, #c4b5fd 50%, #8b5cf6 100%)',
  body: 'linear-gradient(135deg, #fecdd3 0%, #fda4af 50%, #f43f5e 100%)',
  fruit: 'linear-gradient(135deg, #fed7aa 0%, #fdba74 50%, #f97316 100%)',
  opposite: 'linear-gradient(135deg, #99f6e4 0%, #5eead4 50%, #14b8a6 100%)',
};

export default function QuizCategoryPicker() {
  return (
    <HydrationGate>
      <Inner />
    </HydrationGate>
  );
}

function Inner() {
  const router = useRouter();
  const profile = useAppStore((s) => s.profile);
  const wallet = useAppStore((s) => s.wallet);

  useEffect(() => {
    if (!profile) router.replace('/onboarding');
  }, [profile, router]);

  if (!profile) return null;

  return (
    <PageShell title="🎯 Pilih Kategori" right={<CoinBadge coins={wallet.coins} />}>
      <div className="flex justify-center">
        <Mascot mood="cheer" bubble="Pilih topikmu!" size="text-5xl" />
      </div>
      <p className="text-center font-display text-sm font-bold text-slate-600">
        Soal disesuaikan untuk umur {profile.age === 6 ? '6+' : profile.age} tahun ✨
      </p>

      <div className="grid grid-cols-2 gap-4">
        {QUIZ_CATEGORIES.map((cat, i) => {
          const count = pickAdaptiveQuestions(cat.id, profile.age, 999).length;
          const gradient =
            CATEGORY_GRADIENTS[cat.id] ?? 'linear-gradient(135deg, #c4b5fd, #a78bfa)';
          return (
            <motion.button
              key={cat.id}
              type="button"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              whileTap={{ scale: 0.94 }}
              whileHover={{ scale: 1.04 }}
              onClick={() => {
                sfx.click();
                router.push(`/quiz/${cat.id}`);
              }}
              className="relative flex aspect-square flex-col items-center justify-center gap-2 overflow-hidden rounded-4xl p-4 text-white shadow-kid"
              style={{ background: gradient, border: '3px solid white' }}
              disabled={count === 0}
              aria-label={`Mulai kuis ${cat.label}`}
            >
              <motion.div
                animate={{ y: [0, -6, 0], rotate: [-5, 5, -5] }}
                transition={{ repeat: Infinity, duration: 2.4 }}
                className="text-6xl drop-shadow-lg"
                aria-hidden
              >
                {cat.emoji}
              </motion.div>
              <div className="font-display text-2xl font-extrabold drop-shadow">
                {cat.label}
              </div>
              <div className="rounded-full bg-white/30 px-2 py-0.5 text-[10px] font-bold backdrop-blur">
                {count} soal seru
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Drag & Drop matching mini-game card */}
      <motion.button
        type="button"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        whileTap={{ scale: 0.96 }}
        whileHover={{ scale: 1.02 }}
        onClick={() => {
          sfx.click();
          router.push('/quiz/match');
        }}
        className="menu-card overflow-hidden text-white"
        style={{
          background:
            'linear-gradient(135deg, #c4b5fd 0%, #f0abfc 50%, #fda4af 100%)',
        }}
        aria-label="Main game cocokkan hewan dan suara"
      >
        <div className="text-6xl drop-shadow" aria-hidden>
          🎮
        </div>
        <div className="flex-1 text-left">
          <div className="font-display text-xl font-extrabold drop-shadow">
            Game Cocokkan Hewan
          </div>
          <div className="text-xs font-bold opacity-95">
            Tarik hewan ke kotak suaranya — seru!
          </div>
        </div>
        <div className="text-2xl font-extrabold opacity-90">→</div>
      </motion.button>
    </PageShell>
  );
}
