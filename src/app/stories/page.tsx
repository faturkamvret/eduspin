'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';
import { HydrationGate } from '@/components/HydrationGate';
import { PageShell } from '@/components/PageShell';
import { CoinBadge } from '@/components/CoinBadge';
import { Mascot } from '@/components/Mascot';
import { STORIES } from '@/data/stories';
import { sfx } from '@/lib/sfx';

export default function StoriesIndexPage() {
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
  const stories = useAppStore((s) => s.stories);

  useEffect(() => {
    if (!profile) router.replace('/onboarding');
  }, [profile, router]);

  if (!profile) return null;

  return (
    <PageShell title="📖 Buku Cerita" right={<CoinBadge coins={wallet.coins} />}>
      <div className="flex justify-center">
        <Mascot
          mood="cheer"
          bubble="Pilih cerita kesukaanmu!"
          size="text-5xl"
        />
      </div>
      <p className="text-center font-display text-sm font-bold text-slate-600">
        Setiap cerita punya 4 bab seru — dengarkan dan jawab 🎧
      </p>

      <div className="grid grid-cols-1 gap-4">
        {STORIES.map((story, i) => {
          const progress = stories[story.id];
          const completed = progress?.completedChapters.length ?? 0;
          const total = story.chapters.length;
          const isFinished = completed >= total;
          return (
            <motion.button
              key={story.id}
              type="button"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              whileTap={{ scale: 0.97 }}
              whileHover={{ scale: 1.02 }}
              onClick={() => {
                sfx.click();
                router.push(`/stories/${story.id}`);
              }}
              className="menu-card relative overflow-hidden text-left text-white"
              style={{ background: story.themeGradient }}
              aria-label={`Buka cerita ${story.title}`}
            >
              <motion.div
                animate={{ y: [0, -6, 0], rotate: [-4, 4, -4] }}
                transition={{ repeat: Infinity, duration: 2.4 }}
                className="text-6xl drop-shadow-lg"
                aria-hidden
              >
                {story.coverEmoji}
              </motion.div>
              <div className="flex-1">
                <div className="font-display text-2xl font-extrabold drop-shadow">
                  {story.title}
                </div>
                <div className="text-sm font-bold opacity-95">
                  {story.tagline}
                </div>
                <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-white/30 px-2 py-0.5 text-[11px] font-bold backdrop-blur">
                  <span>
                    {completed}/{total} bab
                  </span>
                  {isFinished && <span aria-hidden>🏆</span>}
                </div>
              </div>
              <div className="text-3xl font-extrabold opacity-90" aria-hidden>
                →
              </div>
            </motion.button>
          );
        })}
      </div>
    </PageShell>
  );
}
