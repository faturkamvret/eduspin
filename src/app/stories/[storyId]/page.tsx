'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';
import { HydrationGate } from '@/components/HydrationGate';
import { PageShell } from '@/components/PageShell';
import { CoinBadge } from '@/components/CoinBadge';
import { Mascot } from '@/components/Mascot';
import { getStoryById } from '@/data/stories';
import { sfx } from '@/lib/sfx';

export default function StoryDetailPage() {
  return (
    <HydrationGate>
      <Inner />
    </HydrationGate>
  );
}

function Inner() {
  const router = useRouter();
  const params = useParams<{ storyId: string }>();
  const profile = useAppStore((s) => s.profile);
  const wallet = useAppStore((s) => s.wallet);
  const stories = useAppStore((s) => s.stories);

  const story = getStoryById(params.storyId);

  useEffect(() => {
    if (!profile) router.replace('/onboarding');
  }, [profile, router]);

  if (!profile) return null;
  if (!story) {
    return (
      <PageShell title="📖 Cerita">
        <div className="card flex flex-col items-center gap-3 text-center">
          <Mascot mood="thinking" bubble="Cerita tidak ditemukan" />
          <button
            className="btn-primary"
            onClick={() => router.replace('/stories')}
          >
            Kembali ke daftar
          </button>
        </div>
      </PageShell>
    );
  }

  const progress = stories[story.id];
  const completedSet = new Set(progress?.completedChapters ?? []);
  const totalChapters = story.chapters.length;
  const completedCount = completedSet.size;
  const isFinished = completedCount >= totalChapters;

  return (
    <PageShell
      title={`${story.coverEmoji} ${story.title}`}
      right={<CoinBadge coins={wallet.coins} />}
      backHref="/stories"
    >
      {/* Hero */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="card relative flex flex-col items-center gap-3 overflow-hidden text-center text-white"
        style={{ background: story.themeGradient }}
      >
        <motion.div
          animate={{ y: [0, -6, 0], rotate: [-3, 3, -3] }}
          transition={{ repeat: Infinity, duration: 2.4 }}
          className="text-7xl drop-shadow-lg"
          aria-hidden
        >
          {story.coverEmoji}
        </motion.div>
        <h2 className="font-display text-2xl font-extrabold drop-shadow">
          {story.title}
        </h2>
        <p className="font-display text-sm font-bold opacity-95">
          {story.tagline}
        </p>
        <div className="inline-flex items-center gap-2 rounded-full bg-white/25 px-3 py-1 text-xs font-bold backdrop-blur">
          <span>
            Selesai: {completedCount}/{totalChapters} bab
          </span>
          {isFinished && <span aria-hidden>🏆</span>}
        </div>
      </motion.section>

      <p className="text-center font-display text-sm font-bold text-slate-600">
        Pilih bab apa saja — boleh urut atau lompat ✨
      </p>

      {/* Chapter list */}
      <div className="grid grid-cols-1 gap-3">
        {story.chapters.map((chap, i) => {
          const done = completedSet.has(chap.id);
          return (
            <motion.button
              key={chap.id}
              type="button"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              whileTap={{ scale: 0.97 }}
              whileHover={{ scale: 1.02 }}
              onClick={() => {
                sfx.click();
                router.push(`/stories/${story.id}/${chap.id}`);
              }}
              className={`flex items-center gap-3 rounded-3xl bg-white p-4 text-left shadow-kid transition-all hover:bg-slate-50 ${
                done ? 'ring-2 ring-emerald-300' : ''
              }`}
              aria-label={`Buka ${chap.title}${done ? ' (sudah selesai)' : ''}`}
            >
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary-200 to-primary-400 text-3xl shadow-inner">
                {chap.illustration}
              </div>
              <div className="flex-1">
                <div className="font-display text-base font-extrabold text-slate-800">
                  {chap.title}
                </div>
                <div className="text-xs font-bold text-slate-500">
                  {chap.questions.length} pertanyaan
                </div>
              </div>
              <div className="text-2xl" aria-hidden>
                {done ? '✅' : '▶️'}
              </div>
            </motion.button>
          );
        })}
      </div>

      {isFinished && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-3xl bg-gradient-to-r from-amber-100 to-yellow-200 px-5 py-4 text-center font-display text-base font-extrabold text-amber-900 shadow-kid"
        >
          🎉 Kamu sudah menyelesaikan seluruh cerita! Kerja bagus!
        </motion.div>
      )}
    </PageShell>
  );
}
