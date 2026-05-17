'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';
import { HydrationGate } from '@/components/HydrationGate';
import { PageShell } from '@/components/PageShell';
import { COLLECTIBLES } from '@/data/collectibles';
import { playCollectibleSfx, sfx } from '@/lib/sfx';
import { RARITY_LABEL } from '@/lib/utils';
import type { Collectible, Rarity } from '@/types';

const RARITY_ORDER: Rarity[] = ['common', 'rare', 'epic', 'legendary'];

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

  return (
    <PageShell title="📔 Buku Koleksi">
      <div className="card flex items-center justify-between gap-4 py-3">
        <div>
          <div className="text-xs text-slate-500">Total terkumpul</div>
          <div className="font-display text-xl font-bold">
            {ownedCount} / {COLLECTIBLES.length}
          </div>
        </div>
        <div className="text-3xl" aria-hidden>
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
          />
        ))}
      </div>

      {RARITY_ORDER.map((r) =>
        grouped[r].length > 0 ? (
          <section key={r} className="flex flex-col gap-2">
            <h2 className={`font-display text-lg font-bold ${rarityHeading(r)}`}>
              {RARITY_LABEL[r]}
            </h2>
            <div className="grid grid-cols-3 gap-2">
              {grouped[r].map((c) => {
                const owned = collection.items[c.id];
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => {
                      if (!owned) {
                        sfx.click();
                        return;
                      }
                      setActive(c);
                      playCollectibleSfx(c.id, c.category);
                    }}
                    className={`relative aspect-square overflow-hidden rounded-2xl shadow-md transition-all
                                ${owned ? `bg-gradient-to-br ${c.gradient} hover:scale-105` : 'bg-slate-200'}`}
                    aria-label={owned ? c.name : 'Belum terkumpul'}
                  >
                    <span
                      className={`flex h-full items-center justify-center text-5xl ${
                        owned ? '' : 'opacity-30 grayscale'
                      }`}
                      aria-hidden
                    >
                      {owned ? c.emoji : '❓'}
                    </span>
                    {owned && owned.count > 1 && (
                      <span className="absolute right-1 top-1 rounded-full bg-white/90 px-1.5 text-xs font-bold">
                        x{owned.count}
                      </span>
                    )}
                  </button>
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

function rarityHeading(r: Rarity): string {
  switch (r) {
    case 'legendary':
      return 'text-amber-600';
    case 'epic':
      return 'text-purple-600';
    case 'rare':
      return 'text-blue-600';
    default:
      return 'text-slate-600';
  }
}

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-3 py-1 text-sm font-bold shadow transition-all ${
        active ? 'bg-primary-500 text-white' : 'bg-white/70 text-slate-700'
      }`}
    >
      {label}
    </button>
  );
}

function DetailModal({ item, onClose }: { item: Collectible; onClose: () => void }) {
  const collection = useAppStore((s) => s.collection);
  const owned = collection.items[item.id];

  function tap() {
    playCollectibleSfx(item.id, item.category);
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center"
    >
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 40, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="card w-full max-w-sm"
      >
        <button
          type="button"
          onClick={tap}
          className={`mx-auto flex h-44 w-44 items-center justify-center rounded-3xl bg-gradient-to-br ${item.gradient} text-7xl shadow-xl ring-4 ring-white active:scale-95`}
          aria-label={`Sentuh ${item.name}`}
        >
          <motion.span
            key={String(Date.now())}
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.15, 0.95, 1], rotate: [0, -6, 6, 0] }}
            transition={{ duration: 0.6 }}
            className="block"
            aria-hidden
          >
            {item.emoji}
          </motion.span>
        </button>
        <div className="mt-4 text-center">
          <div className="font-display text-2xl font-bold">{item.name}</div>
          <div className="text-xs uppercase tracking-wider text-slate-500">
            {RARITY_LABEL[item.rarity]} · {item.category}
          </div>
          <p className="mt-2 text-sm text-slate-600">{item.flavor}</p>
          {owned && (
            <div className="mt-2 text-xs text-slate-500">
              Dimiliki: {owned.count}x · Pertama didapat:{' '}
              {new Date(owned.firstPulledAt).toLocaleDateString('id-ID')}
            </div>
          )}
          <p className="mt-3 text-xs text-slate-400">Sentuh karakter untuk berinteraksi 👆</p>
        </div>
        <button className="btn-ghost mt-4 w-full" onClick={onClose}>
          Tutup
        </button>
      </motion.div>
    </motion.div>
  );
}
