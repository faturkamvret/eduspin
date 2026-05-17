'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { HydrationGate } from '@/components/HydrationGate';
import { PageShell } from '@/components/PageShell';
import { CoinBadge } from '@/components/CoinBadge';
import { QUIZ_CATEGORIES } from '@/data/categories';
import { pickAdaptiveQuestions } from '@/data/questions';
import { sfx } from '@/lib/sfx';

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
    <PageShell title="Pilih Kategori" right={<CoinBadge coins={wallet.coins} />}>
      <p className="text-center text-sm text-slate-600">
        Pilih topik yang kamu suka. Soal akan menyesuaikan umur {profile.age} tahun.
      </p>

      <div className="grid grid-cols-2 gap-3">
        {QUIZ_CATEGORIES.map((cat) => {
          const count = pickAdaptiveQuestions(cat.id, profile.age, 999).length;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => {
                sfx.click();
                router.push(`/quiz/${cat.id}`);
              }}
              className={`flex aspect-square flex-col items-center justify-center gap-2 rounded-3xl
                          ${cat.color} p-4 text-white shadow-lg transition-all
                          hover:scale-[1.03] active:scale-95`}
              disabled={count === 0}
              aria-label={`Mulai kuis ${cat.label}`}
            >
              <div className="text-5xl" aria-hidden>
                {cat.emoji}
              </div>
              <div className="font-display text-xl font-bold drop-shadow">
                {cat.label}
              </div>
              <div className="text-xs opacity-90">{count} soal tersedia</div>
            </button>
          );
        })}
      </div>
    </PageShell>
  );
}
