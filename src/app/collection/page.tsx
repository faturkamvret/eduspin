'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';
import { HydrationGate } from '@/components/HydrationGate';
import { PageShell } from '@/components/PageShell';
import { Mascot } from '@/components/Mascot';
import { COLLECTIBLES } from '@/data/collectibles';
import { playCollectibleSfx, sfx } from '@/lib/sfx';
import { RARITY_LABEL } from '@/lib/utils';
import type { Collectible, Rarity } from '@/types';

const RARITY_ORDER: Rarity[] = ['common', 'rare', 'epic', 'legendary'];

const RARITY_HEADING_GRADIENTS: Record<Rarity, string> = {
  common: 'from-slate-300 to-slate-400',
  rare: 'from-sky-300 to-blue-500',
  epic: 'from-violet-300 to-purple-500',
  legendary: 'from-amber-300 to-orange-500',
};

export default function CollectionPage() {
  return (
    <HydrationGate>
      <Inner />
    </HydrationGate>
  );
}

function Inner() {
  const router = useRouter();
  const profile = useAppStore((s) => s.profile);
  const collection = useAppStore((s) => s.collection);
  const [active, setActive] = useState<Collectible | null>(null);
  const [filter, setFilter] = useState<Rarity | 'all'>('all');

  const grouped = useMemo(() => {
    const items = COLLECTIBLES.filter((c) => filter === 'all' || c.rarity === filter);
    const map: Record<Rarity, Collectible[]> = {
      common: [],
      rare: [],
      epic: [],
      legendary: [],
    };
    for (const c of items) map[c.rarity].push(c);
    return map;
  }, [filter]);

  useEffect(() => {
    if (!profile) router.replace('/onboarding');
  }, [profile, router]);

  if (!profile) return null;

  const ownedCount = Object.keys(collection.items).length;
  const progressPct = (ownedCount / COLLECTIBLES.length) * 100;

  return (
    <PageShell title="📔 Buku Koleksi">
      <div className="card flex items-center gap-4">
        <Mascot mood="celebrate" size="text-5xl" bubble="Wow!" />
        <div className="flex-1">
          <div className="text-xs font-bold uppercase text-slate-500">
            Total terkumpul
          </div>
          <div className="font-display text-2xl font-extrabold text-slate-800">
            {ownedCount} / {COLLECTIBLES.length}
          </div>
          <div className="mt-1 h-3 overflow-hidden rounded-full bg-slate-200">
            <motion.div
              className="h-full rounded-full"
              style={{
                background: 'linear-gradient(90deg, #ff8fa3, #facc15, #4ade80)',
              }}
              initial={false}
              animate={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
        <div className="text-4xl drop-shadow" aria-hidden>
          🏆
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <FilterChip label="Semua" active={filter === 'all'} onClick={() => setFilter('all')} />
        {RARITY_ORDER.map((r) => (
          <FilterChip
            key={r}
            label={RARITY_LABEL[r]}
            active={filter === r}
            onClick={() => setFilter(r)}
            tone={r}
          />
        ))}
      </div>

      {RARITY_ORDER.map((r) =>
        grouped[r].length > 0 ? (
          <section key={r} className="flex flex-col gap-2">
            <h2
              className={`inline-block w-fit rounded-full bg-gradient-to-r ${RARITY_HEADING_GRADIENTS[r]} px-4 py-1 font-display text-sm font-extrabold text-white shadow-kid`}
            >
              {RARITY_LABEL[r]}
            </h2>
            <div className="grid grid-cols-3 gap-3">
              {grouped[r].map((c) => {
                const owned = collection.items[c.id];
                return (
                  <motion.button
                    key={c.id}
                    type="button"
                    whileTap={{ scale: 0.92 }}
                    whileHover={owned ? { scale: 1.06, rotate: -3 } : undefined}
                    onClick={() => {
                      if (!owned) {
                        sfx.click();
                        return;
                      }
                      setActive(c);
                      playCollectibleSfx(c.id, c.category);
                    }}
                    className={`relative aspect-square overflow-hidden rounded-3xl shadow-kid transition-all ${
                      owned
                        ? `bg-gradient-to-br ${c.gradient}`
                        : 'bg-slate-200'
                    }`}
                    style={owned ? { border: '3px solid white' } : undefined}
                    aria-label={owned ? c.name : 'Belum terkumpul'}
                  >
                    <span
                      className={`flex h-full items-center justify-center text-5xl ${
                        owned ? 'drop-shadow-lg' : 'opacity-30 grayscale'
                      }`}
                      aria-hidden
                    >
                      {owned ? c.emoji : '❓'}
                    </span>
                    {owned && owned.count > 1 && (
                      <span className="absolute right-1 top-1 rounded-full bg-white/95 px-2 py-0.5 text-xs font-extrabold shadow">
                        ×{owned.count}
                      </span>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </section>
        ) : null,
      )}

      <AnimatePresence>
        {active && <DetailModal item={active} onClose={() => setActive(null)} />}
      </AnimatePresence>
    </PageShell>
  );
}

function FilterChip({
  label,
  active,
  onClick,
  tone,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  tone?: Rarity;
}) {
  const activeGradient = tone
    ? `bg-gradient-to-r ${RARITY_HEADING_GRADIENTS[tone]} text-white`
    : 'bg-gradient-to-r from-pink-400 to-rose-500 text-white';
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.92 }}
      onClick={() => {
        sfx.click();
        onClick();
      }}
      className={`rounded-full px-4 py-2 font-display text-sm font-extrabold shadow-kid transition-all ${
        active ? activeGradient : 'bg-white text-slate-700'
      }`}
    >
      {label}
    </motion.button>
  );
}

function DetailModal({ item, onClose }: { item: Collectible; onClose: () => void }) {
  function tap() {
    playCollectibleSfx(item.id, item.category);
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-4 sm:items-center"
    >
      <motion.div
        initial={{ y: 60, opacity: 0, scale: 0.85 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 60, opacity: 0 }}
        transition={{ type: 'spring', damping: 16 }}
        onClick={(e) => e.stopPropagation()}
        className="card w-full max-w-sm"
      >
        <button
          type="button"
          onClick={tap}
          className={`mx-auto flex h-44 w-44 items-center justify-center rounded-[2rem] bg-gradient-to-br ${item.gradient} text-7xl shadow-xl ring-4 ring-white active:scale-95 transition-all`}
          aria-label={`Sentuh ${item.name}`}
        >
          <motion.span
            key={String(Date.now())}
            initial={{ scale: 1 }}
            animate={{
              scale: [1, 1.15, 0.95, 1.05, 1],
              rotate: [0, -8, 8, -4, 0],
            }}
            transition={{ duration: 0.7 }}
            className="block drop-shadow-lg"
            aria-hidden
          >
            {item.emoji}
          </motion.span>
        </button>
        <div className="mt-4 text-center">
          <div className="font-display text-2xl font-extrabold text-slate-800">
            {item.name}
          </div>
          <div className="text-xs uppercase tracking-wider font-bold text-slate-500">
            {RARITY_LABEL[item.rarity]} · {item.category}
          </div>
          <p className="mt-2 text-sm font-semibold text-slate-600">{item.flavor}</p>
          <p className="mt-3 text-xs font-bold text-primary-500">
            Sentuh karakter untuk berinteraksi 👆
          </p>
        </div>
        <button className="btn-ghost mt-4 w-full" onClick={onClose}>
          Tutup
        </button>
      </motion.div>
    </motion.div>
  );
}
