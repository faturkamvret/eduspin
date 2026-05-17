'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore, COIN_CONSTANTS } from '@/store/useAppStore';
import { HydrationGate } from '@/components/HydrationGate';
import { CoinBadge } from '@/components/CoinBadge';
import { FloatingDeco } from '@/components/FloatingDeco';
import { sfx } from '@/lib/sfx';
import { PITY_EPIC_THRESHOLD, PITY_LEGENDARY_THRESHOLD } from '@/lib/gacha';
import type { PullResult } from '@/types';
import { RARITY_LABEL } from '@/lib/utils';

type Phase = 'idle' | 'descending' | 'grabbing' | 'rising' | 'reveal';

export default function ClawMachinePage() {
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
  const pity = useAppStore((s) => s.pity);
  const performGachaPull = useAppStore((s) => s.performGachaPull);

  const [phase, setPhase] = useState<Phase>('idle');
  const [result, setResult] = useState<PullResult | null>(null);
  const [errMsg, setErrMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!profile) router.replace('/onboarding');
  }, [profile, router]);

  if (!profile) return null;

  function startPull() {
    if (phase !== 'idle') return;
    const r = performGachaPull();
    if (!r.ok) {
      sfx.wrong();
      setErrMsg('Koinmu kurang! Yuk main kuis dulu untuk kumpulkan koin 🪙');
      setTimeout(() => setErrMsg(null), 2200);
      return;
    }
    setResult(r.result);
    sfx.click();
    setPhase('descending');
    setTimeout(() => {
      sfx.click();
      setPhase('grabbing');
      setTimeout(() => {
        sfx.click();
        setPhase('rising');
        setTimeout(() => {
          if (r.result.rarity === 'legendary' || r.result.rarity === 'epic') {
            sfx.fanfare();
          } else {
            sfx.reveal();
          }
          setPhase('reveal');
        }, 900);
      }, 600);
    }, 900);
  }

  function reset() {
    setResult(null);
    setPhase('idle');
  }

  const canPull = phase === 'idle' && wallet.coins >= COIN_CONSTANTS.COIN_PER_PULL;

  return (
    <main className="relative flex flex-1 flex-col gap-4 px-4 py-4">
      <FloatingDeco count={10} />

      {/* Header — tombol "Beranda" menggantikan "Kembali" */}
      <header className="flex items-center justify-between gap-2">
        <motion.button
          type="button"
          whileTap={{ scale: 0.92 }}
          onClick={() => {
            sfx.click();
            router.push('/home');
          }}
          className="rounded-full bg-white px-4 py-2 font-display text-sm font-bold shadow-kid transition-all hover:bg-slate-50"
          aria-label="Ke Beranda"
        >
          🏠 Beranda
        </motion.button>
        <h1 className="font-display text-xl font-extrabold text-slate-800 drop-shadow">
          🎰 Claw Machine
        </h1>
        <CoinBadge coins={wallet.coins} />
      </header>

      {/* Pity status (transparent) */}
      <div className="card flex items-center justify-around gap-2 py-3 text-center text-xs">
        <div>
          <div className="text-slate-500">Tarikan</div>
          <div className="font-display text-base font-bold">{pity.totalPulls}</div>
        </div>
        <div>
          <div className="text-slate-500">Pity Epik</div>
          <div className="font-display text-base font-bold text-purple-600">
            {pity.pityCounterEpic}/{PITY_EPIC_THRESHOLD}
          </div>
        </div>
        <div>
          <div className="text-slate-500">Pity Legendaris</div>
          <div className="font-display text-base font-bold text-amber-600">
            {pity.pityCounterLegendary}/{PITY_LEGENDARY_THRESHOLD}
          </div>
        </div>
      </div>

      {/* The machine */}
      <div className="relative mx-auto w-full max-w-sm overflow-hidden rounded-3xl bg-gradient-to-b from-pink-200 to-rose-200 p-3 shadow-xl">
        {/* Top crane track */}
        <div className="relative h-2 rounded-full bg-rose-400/60" />

        {/* Glass area */}
        <div className="relative mt-2 h-72 overflow-hidden rounded-2xl bg-gradient-to-b from-sky-100 to-indigo-100 ring-4 ring-rose-300">
          {/* Claw */}
          <motion.div
            className="absolute left-1/2 top-0 -translate-x-1/2"
            initial={false}
            animate={{
              y:
                phase === 'idle'
                  ? 0
                  : phase === 'descending'
                    ? 140
                    : phase === 'grabbing'
                      ? 160
                      : phase === 'rising'
                        ? 0
                        : 0,
            }}
            transition={{ duration: 0.85, ease: 'easeInOut' }}
          >
            {/* Cable */}
            <div className="mx-auto h-2 w-1 bg-slate-700" />
            {/* Claw body */}
            <div className="relative -mt-1 flex h-12 w-16 items-end justify-center">
              <div className="absolute inset-x-0 top-0 h-3 rounded-md bg-slate-700" />
              <motion.div
                className="absolute left-1 top-2 h-9 w-3 origin-top rounded-b-lg bg-slate-600"
                animate={{ rotate: phase === 'grabbing' || phase === 'rising' ? 24 : 0 }}
              />
              <motion.div
                className="absolute right-1 top-2 h-9 w-3 origin-top rounded-b-lg bg-slate-600"
                animate={{ rotate: phase === 'grabbing' || phase === 'rising' ? -24 : 0 }}
              />
            </div>
          </motion.div>

          {/* Capsules pile (decorative) */}
          <div className="absolute bottom-3 left-0 right-0 flex flex-wrap items-end justify-center gap-1 px-3">
            {phase !== 'reveal' &&
              ['🔵', '🟢', '🟣', '🟡', '🔴', '🟠', '🔵', '🟢', '🟣'].map((c, i) => (
                <span key={i} className="text-3xl" aria-hidden>
                  {c}
                </span>
              ))}
          </div>

          {/* Captured capsule rising with claw */}
          {(phase === 'grabbing' || phase === 'rising') && result && (
            <motion.div
              className="absolute left-1/2 -translate-x-1/2 text-4xl"
              initial={{ y: 200 }}
              animate={{
                y: phase === 'rising' ? 36 : 200,
              }}
              transition={{ duration: 0.85, ease: 'easeInOut' }}
              aria-hidden
            >
              {rarityCapsule(result.rarity)}
            </motion.div>
          )}

          {/* Hint text idle */}
          {phase === 'idle' && (
            <div className="absolute inset-x-0 bottom-1 text-center text-xs font-bold text-slate-500">
              Tekan tombol untuk menarik!
            </div>
          )}
        </div>

        {/* Machine base */}
        <div className="mt-2 rounded-2xl bg-rose-400 p-3 text-center text-white shadow-inner">
          <div className="font-display text-sm font-bold">EDUSPIN CLAW</div>
        </div>
      </div>

      {/* Pull button */}
      <button
        type="button"
        onClick={startPull}
        disabled={!canPull}
        className="btn-primary mx-auto mt-1 w-full max-w-sm text-lg"
      >
        Tarik! ({COIN_CONSTANTS.COIN_PER_PULL} 🪙)
      </button>

      {errMsg && (
        <div className="mx-auto max-w-sm rounded-2xl bg-rose-100 px-4 py-2 text-center text-sm font-semibold text-rose-800">
          {errMsg}
        </div>
      )}

      {/* Reveal modal */}
      <AnimatePresence>
        {phase === 'reveal' && result && (
          <RevealModal
            result={result}
            onClose={reset}
            onAgain={() => {
              reset();
              setTimeout(startPull, 50);
            }}
          />
        )}
      </AnimatePresence>
    </main>
  );
}

function rarityCapsule(rarity: PullResult['rarity']): string {
  switch (rarity) {
    case 'legendary':
      return '🌟';
    case 'epic':
      return '🟣';
    case 'rare':
      return '🔵';
    default:
      return '⚪';
  }
}

function RevealModal({
  result,
  onClose,
  onAgain,
}: {
  result: PullResult;
  onClose: () => void;
  onAgain: () => void;
}) {
  const wallet = useAppStore((s) => s.wallet);
  const canAgain = wallet.coins >= COIN_CONSTANTS.COIN_PER_PULL;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
    >
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: 'spring', damping: 16, stiffness: 220 }}
        className="card w-full max-w-sm text-center"
      >
        <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
          {result.pityTriggered ? '🎁 Pity Bonus!' : 'Selamat!'}
        </div>
        <div
          className={`mt-1 font-display text-lg font-bold ${
            result.rarity === 'legendary'
              ? 'text-amber-600'
              : result.rarity === 'epic'
                ? 'text-purple-600'
                : result.rarity === 'rare'
                  ? 'text-blue-600'
                  : 'text-slate-600'
          }`}
        >
          {RARITY_LABEL[result.rarity]}
        </div>

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1, rotate: [0, -8, 8, 0] }}
          transition={{ delay: 0.1, duration: 0.7 }}
          className={`mx-auto my-4 flex h-40 w-40 items-center justify-center rounded-full bg-gradient-to-br ${result.collectible.gradient} text-7xl shadow-xl ring-4 ring-white`}
        >
          <span aria-hidden>{result.collectible.emoji}</span>
        </motion.div>

        <div className="font-display text-xl font-bold">{result.collectible.name}</div>
        <p className="mt-1 text-sm text-slate-600">{result.collectible.flavor}</p>

        <div className="mt-5 grid grid-cols-2 gap-2">
          <button className="btn-ghost" onClick={onClose}>
            Tutup
          </button>
          <button className="btn-primary" disabled={!canAgain} onClick={onAgain}>
            Tarik Lagi 🎰
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
