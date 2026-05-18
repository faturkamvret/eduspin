'use client';

/**
 * Drag & Drop matching mini-game.
 *
 * 5 animal–sound pairs. The animal emojis are draggable; the sound buttons
 * (target zones) play the sound when tapped, and accept a drop. When a
 * correct match is dropped the pair locks in (✓), the SFX plays, the child
 * earns a coin, and a TTS cheer plays. When all 5 are matched, the session
 * completes and the standard quiz session bonus is awarded.
 *
 * Implemented with HTML5 drag & drop on desktop and touch fallback for
 * mobile (most kids will use touch).
 */

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore, COIN_CONSTANTS } from '@/store/useAppStore';
import { HydrationGate } from '@/components/HydrationGate';
import { CoinBadge } from '@/components/CoinBadge';
import { Confetti } from '@/components/Confetti';
import { FloatingDeco } from '@/components/FloatingDeco';
import { Mascot } from '@/components/Mascot';
import { sfx, playAudioCue, type AudioCue } from '@/lib/sfx';
import { speak, speakCheer, speakEncouragement, stopSpeaking } from '@/lib/speech';
import { triggerFlyingCoin } from '@/components/FlyingCoin';

interface Pair {
  id: string;
  animal: string;
  emoji: string;
  cue: AudioCue;
}

const POOL: Pair[] = [
  { id: 'dog', animal: 'Anjing', emoji: '🐶', cue: 'bark' },
  { id: 'cat', animal: 'Kucing', emoji: '🐱', cue: 'meow' },
  { id: 'cow', animal: 'Sapi', emoji: '🐮', cue: 'moo' },
  { id: 'duck', animal: 'Bebek', emoji: '🦆', cue: 'quack' },
  { id: 'frog', animal: 'Katak', emoji: '🐸', cue: 'ribbit' },
  { id: 'lion', animal: 'Singa', emoji: '🦁', cue: 'lionRoar' },
  { id: 'elephant', animal: 'Gajah', emoji: '🐘', cue: 'elephant' },
  { id: 'bee', animal: 'Lebah', emoji: '🐝', cue: 'buzz' },
];

const ROUND_SIZE = 5;

function shuffle<T>(arr: T[]): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j]!, out[i]!];
  }
  return out;
}

export default function MatchGamePage() {
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
  const recordAnswer = useAppStore((s) => s.recordAnswer);
  const finishQuizSession = useAppStore((s) => s.finishQuizSession);

  const [round, setRound] = useState(0);
  const [matched, setMatched] = useState<Set<string>>(new Set());
  const [confetti, setConfetti] = useState(false);
  const [done, setDone] = useState(false);
  const [bonusGiven, setBonusGiven] = useState(false);

  // Drag state for HTML5 + touch.
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [hoverTarget, setHoverTarget] = useState<string | null>(null);
  const dragGhostRef = useRef<HTMLDivElement | null>(null);
  const touchStateRef = useRef<{ id: string; startX: number; startY: number } | null>(null);

  const pairs = useMemo<Pair[]>(() => shuffle(POOL).slice(0, ROUND_SIZE), [round]);
  // Shuffle target order independently so the layout doesn't give away pairings.
  const targetOrder = useMemo<Pair[]>(() => shuffle(pairs), [pairs]);

  useEffect(() => {
    if (!profile) router.replace('/onboarding');
  }, [profile, router]);

  useEffect(() => {
    return () => stopSpeaking();
  }, []);

  // Read intro once when the page mounts.
  useEffect(() => {
    const t = setTimeout(() => {
      speak('Yuk! Tarik gambar hewan ke kotak suaranya yang cocok!', {
        rate: 0.95,
        pitch: 1.15,
      });
    }, 300);
    return () => clearTimeout(t);
  }, []);

  if (!profile) return null;

  function handleMatch(animalId: string, targetId: string, evt?: { x: number; y: number }) {
    if (matched.has(animalId)) return;
    if (animalId === targetId) {
      sfx.correct();
      setTimeout(() => {
        // Play the actual animal sound after the success ding.
        const cue = pairs.find((p) => p.id === animalId)?.cue;
        if (cue) playAudioCue(cue);
      }, 250);
      setTimeout(() => speakCheer(), 900);
      const next = new Set(matched);
      next.add(animalId);
      setMatched(next);
      recordAnswer('animal', true, `match-${animalId}`);
      if (evt) triggerFlyingCoin({ x: evt.x, y: evt.y }, COIN_CONSTANTS.COIN_PER_CORRECT);
      setConfetti(true);
      setTimeout(() => setConfetti(false), 1100);

      if (next.size >= ROUND_SIZE && !bonusGiven) {
        finishQuizSession();
        sfx.fanfare();
        setBonusGiven(true);
        setTimeout(() => setDone(true), 700);
      }
    } else {
      sfx.wrong();
      setTimeout(() => speakEncouragement(), 350);
      recordAnswer('animal', false, `match-${animalId}`);
    }
  }

  // ── HTML5 drag handlers ──
  function onDragStart(id: string, e: React.DragEvent) {
    setDraggingId(id);
    e.dataTransfer.setData('text/plain', id);
    e.dataTransfer.effectAllowed = 'move';
  }
  function onDragEnd() {
    setDraggingId(null);
    setHoverTarget(null);
  }
  function onDragOverTarget(id: string, e: React.DragEvent) {
    e.preventDefault();
    setHoverTarget(id);
  }
  function onDropTarget(id: string, e: React.DragEvent) {
    e.preventDefault();
    const animalId = e.dataTransfer.getData('text/plain');
    if (animalId) handleMatch(animalId, id, { x: e.clientX, y: e.clientY });
    setDraggingId(null);
    setHoverTarget(null);
  }

  // ── Touch fallback (most kid devices are touch-only) ──
  function onTouchStart(id: string, e: React.TouchEvent) {
    if (matched.has(id)) return;
    const t = e.touches[0];
    if (!t) return;
    touchStateRef.current = { id, startX: t.clientX, startY: t.clientY };
    setDraggingId(id);
  }
  function onTouchMove(e: React.TouchEvent) {
    const state = touchStateRef.current;
    if (!state) return;
    const t = e.touches[0];
    if (!t) return;
    if (dragGhostRef.current) {
      dragGhostRef.current.style.left = `${t.clientX}px`;
      dragGhostRef.current.style.top = `${t.clientY}px`;
    }
    // Detect target underneath the finger.
    const el = document.elementFromPoint(t.clientX, t.clientY) as HTMLElement | null;
    const tgt = el?.closest('[data-target-id]') as HTMLElement | null;
    setHoverTarget(tgt?.dataset['targetId'] ?? null);
  }
  function onTouchEnd(e: React.TouchEvent) {
    const state = touchStateRef.current;
    touchStateRef.current = null;
    setDraggingId(null);
    if (!state) return;
    const t = e.changedTouches[0];
    if (!t) {
      setHoverTarget(null);
      return;
    }
    const el = document.elementFromPoint(t.clientX, t.clientY) as HTMLElement | null;
    const tgt = el?.closest('[data-target-id]') as HTMLElement | null;
    const targetId = tgt?.dataset['targetId'];
    if (targetId) handleMatch(state.id, targetId, { x: t.clientX, y: t.clientY });
    setHoverTarget(null);
  }

  function startNewRound() {
    setRound((r) => r + 1);
    setMatched(new Set());
    setDone(false);
    setBonusGiven(false);
    setConfetti(false);
    sfx.click();
  }

  if (done) {
    const totalEarned =
      ROUND_SIZE * COIN_CONSTANTS.COIN_PER_CORRECT + COIN_CONSTANTS.COIN_BONUS_PER_SESSION;
    return (
      <Shell title="🎉 Hebat!" coins={wallet.coins} onExit={() => router.push('/home')}>
        <Confetti show={confetti} count={60} />
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', damping: 14 }}
          className="card flex flex-col items-center gap-4 text-center"
        >
          <Mascot mood="celebrate" bubble="Pintar banget!" size="text-7xl" />
          <h2 className="font-display text-3xl font-extrabold text-rainbow">
            Semua cocok!
          </h2>
          <div
            className="rounded-3xl px-6 py-4 text-amber-900 shadow-kid-sun"
            style={{ background: 'linear-gradient(135deg, #fff3b8, #fde047)' }}
          >
            <div className="text-xs font-bold uppercase tracking-wide">Koin Sesi Ini</div>
            <div className="font-display text-4xl font-extrabold">+{totalEarned} 🪙</div>
          </div>
          <button className="btn-primary mt-2 w-full text-xl" onClick={startNewRound}>
            Main Lagi! 🎮
          </button>
        </motion.div>
      </Shell>
    );
  }

  return (
    <Shell title="🎮 Cocokkan!" coins={wallet.coins} onExit={() => router.push('/home')}>
      <Confetti show={confetti} />
      <p className="text-center font-display text-base font-bold text-slate-700">
        Tarik hewan ke kotak suara yang cocok 🎵
      </p>

      <div
        className="grid grid-cols-2 gap-4 mt-1"
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* Left column — draggable animals */}
        <div className="flex flex-col gap-3">
          {pairs.map((p) => {
            const isMatched = matched.has(p.id);
            const isDragging = draggingId === p.id;
            return (
              <motion.div
                key={p.id}
                layout
                draggable={!isMatched}
                onDragStart={(e) => onDragStart(p.id, e as unknown as React.DragEvent)}
                onDragEnd={onDragEnd}
                onTouchStart={(e) => onTouchStart(p.id, e)}
                whileTap={!isMatched ? { scale: 0.95 } : undefined}
                animate={{
                  opacity: isMatched ? 0.4 : 1,
                  scale: isDragging ? 1.1 : 1,
                  rotate: isDragging ? -4 : 0,
                }}
                className={`relative flex aspect-square items-center justify-center rounded-3xl shadow-kid ${
                  isMatched
                    ? 'bg-emerald-100'
                    : 'bg-gradient-to-br from-pink-100 to-amber-100 cursor-grab active:cursor-grabbing'
                }`}
                style={{
                  border: '3px solid white',
                  touchAction: isMatched ? 'auto' : 'none',
                  userSelect: 'none',
                }}
              >
                <span className="text-6xl drop-shadow-lg" aria-hidden>
                  {p.emoji}
                </span>
                <span className="absolute bottom-1 font-display text-xs font-bold text-slate-700">
                  {p.animal}
                </span>
                {isMatched && (
                  <span className="absolute right-2 top-2 text-2xl" aria-hidden>
                    ✅
                  </span>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Right column — sound targets */}
        <div className="flex flex-col gap-3">
          {targetOrder.map((p) => {
            const isMatched = matched.has(p.id);
            const isHover = hoverTarget === p.id;
            return (
              <motion.button
                key={p.id}
                type="button"
                data-target-id={p.id}
                onClick={() => playAudioCue(p.cue)}
                onDragOver={(e) => onDragOverTarget(p.id, e)}
                onDragLeave={() => setHoverTarget(null)}
                onDrop={(e) => onDropTarget(p.id, e)}
                whileTap={{ scale: 0.95 }}
                animate={{
                  scale: isHover ? 1.06 : 1,
                  rotate: isHover ? 3 : 0,
                }}
                className={`relative flex aspect-square flex-col items-center justify-center gap-1 rounded-3xl text-white shadow-kid-violet ${
                  isMatched ? 'bg-emerald-500' : ''
                }`}
                style={{
                  background: isMatched
                    ? '#10b981'
                    : isHover
                      ? 'linear-gradient(135deg, #f0abfc 0%, #c4b5fd 100%)'
                      : 'linear-gradient(135deg, #c4b5fd 0%, #a78bfa 50%, #8b5cf6 100%)',
                  border: '3px solid white',
                }}
                aria-label={isMatched ? `Cocok dengan ${p.animal}` : 'Putar suara'}
              >
                <span className="text-5xl drop-shadow" aria-hidden>
                  {isMatched ? '✅' : '🔊'}
                </span>
                <span className="font-display text-xs font-extrabold opacity-90">
                  {isMatched ? p.animal : 'Tekan untuk dengar'}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Touch drag ghost (follows the finger) */}
      <AnimatePresence>
        {draggingId && touchStateRef.current && (
          <motion.div
            ref={dragGhostRef}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="pointer-events-none fixed z-50 -translate-x-1/2 -translate-y-1/2 text-7xl drop-shadow-lg"
            style={{
              left: touchStateRef.current.startX,
              top: touchStateRef.current.startY,
            }}
            aria-hidden
          >
            {pairs.find((p) => p.id === draggingId)?.emoji}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-2 text-center text-sm font-bold text-slate-600">
        {matched.size} / {ROUND_SIZE} cocok 🎯
      </div>
    </Shell>
  );
}

function Shell({
  children,
  onExit,
  title,
  coins,
}: {
  children: React.ReactNode;
  onExit: () => void;
  title: string;
  coins: number;
}) {
  return (
    <main className="relative flex flex-1 flex-col gap-5 px-4 py-4">
      <FloatingDeco count={8} emojis={['⭐', '✨', '💖', '🌈']} />
      <header className="flex items-center justify-between gap-2">
        <motion.button
          type="button"
          whileTap={{ scale: 0.92 }}
          onClick={() => {
            sfx.click();
            stopSpeaking();
            onExit();
          }}
          className="rounded-full bg-white px-4 py-2 font-display text-sm font-bold shadow-kid transition-all hover:bg-slate-50"
          aria-label="Ke Beranda"
        >
          🏠 Beranda
        </motion.button>
        <h1 className="font-display text-lg font-extrabold text-slate-800 drop-shadow">
          {title}
        </h1>
        <CoinBadge coins={coins} />
      </header>
      {children}
    </main>
  );
}
