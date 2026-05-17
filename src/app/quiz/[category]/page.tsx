'use client';

import { useEffect, useMemo, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore, COIN_CONSTANTS } from '@/store/useAppStore';
import { HydrationGate } from '@/components/HydrationGate';
import { CoinBadge } from '@/components/CoinBadge';
import { Confetti } from '@/components/Confetti';
import { Mascot } from '@/components/Mascot';
import { FloatingDeco } from '@/components/FloatingDeco';
import { getCategoryMeta } from '@/data/categories';
import { pickAdaptiveQuestions } from '@/data/questions';
import type { QuizCategoryId, QuizQuestion } from '@/types';
import { sfx } from '@/lib/sfx';

const SESSION_LENGTH = 10;

export default function QuizSessionPage() {
  return (
    <HydrationGate>
      <Inner />
    </HydrationGate>
  );
}

function Inner() {
  const router = useRouter();
  const params = useParams<{ category: string }>();
  const profile = useAppStore((s) => s.profile);
  const wallet = useAppStore((s) => s.wallet);
  const recordAnswer = useAppStore((s) => s.recordAnswer);
  const finishQuizSession = useAppStore((s) => s.finishQuizSession);

  const meta = getCategoryMeta(params.category);
  const [sessionKey, setSessionKey] = useState(0);

  const questions = useMemo<QuizQuestion[]>(() => {
    if (!profile || !meta) return [];
    return pickAdaptiveQuestions(meta.id as QuizCategoryId, profile.age, SESSION_LENGTH);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile, meta, sessionKey]);

  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [done, setDone] = useState(false);
  const [bonusGiven, setBonusGiven] = useState(false);
  const [confetti, setConfetti] = useState(false);

  useEffect(() => {
    if (!profile) router.replace('/onboarding');
  }, [profile, router]);

  const startNewSession = useCallback(() => {
    setSessionKey((k) => k + 1);
    setIdx(0);
    setSelected(null);
    setRevealed(false);
    setCorrectCount(0);
    setDone(false);
    setBonusGiven(false);
    setConfetti(false);
    sfx.click();
  }, []);

  if (!profile || !meta) return null;
  if (questions.length === 0) {
    return (
      <FocusShell onExit={() => router.push('/home')} title={meta.label} coins={wallet.coins}>
        <div className="card flex flex-col items-center gap-4 text-center">
          <Mascot mood="thinking" bubble="Wah belum ada soal..." />
          <p className="font-display text-lg font-bold">
            Kategori ini sedang disiapkan ya.
          </p>
        </div>
      </FocusShell>
    );
  }

  const q = questions[idx]!;

  function onPick(optionId: string) {
    if (revealed) return;
    setSelected(optionId);
    setRevealed(true);
    const correct = optionId === q.correctOptionId;
    if (correct) {
      setCorrectCount((c) => c + 1);
      sfx.correct();
      setConfetti(true);
      setTimeout(() => setConfetti(false), 1500);
    } else {
      sfx.wrong();
    }
    recordAnswer(meta!.id as QuizCategoryId, correct);
  }

  function onNext() {
    if (idx + 1 >= questions.length) {
      if (!bonusGiven) {
        finishQuizSession();
        sfx.fanfare();
        setBonusGiven(true);
        setConfetti(true);
        setTimeout(() => setConfetti(false), 2200);
      }
      setDone(true);
      return;
    }
    setIdx((i) => i + 1);
    setSelected(null);
    setRevealed(false);
  }

  if (done) {
    const earnedFromAnswers = correctCount * COIN_CONSTANTS.COIN_PER_CORRECT;
    const totalEarned = earnedFromAnswers + COIN_CONSTANTS.COIN_BONUS_PER_SESSION;
    return (
      <FocusShell onExit={() => router.push('/home')} title="Selesai!" coins={wallet.coins}>
        <Confetti show={confetti} count={50} />
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', damping: 14 }}
          className="card flex flex-col items-center gap-4 text-center"
        >
          <Mascot mood="celebrate" bubble="Pintar banget!" size="text-7xl" />
          <h2 className="font-display text-3xl font-extrabold text-rainbow">
            Hebat, {profile.nickname}!
          </h2>
          <p className="font-display text-lg font-bold text-slate-700">
            Kamu menjawab benar{' '}
            <span className="text-emerald-600">
              {correctCount}/{questions.length}
            </span>{' '}
            🎯
          </p>
          <div
            className="rounded-3xl px-6 py-4 text-amber-900 shadow-kid-sun"
            style={{ background: 'linear-gradient(135deg, #fff3b8, #fde047)' }}
          >
            <div className="text-xs font-bold uppercase tracking-wide">Koin Sesi Ini</div>
            <div className="font-display text-4xl font-extrabold">+{totalEarned} 🪙</div>
            <div className="text-xs font-semibold">
              ({earnedFromAnswers} jawaban + {COIN_CONSTANTS.COIN_BONUS_PER_SESSION} bonus)
            </div>
          </div>
          <button className="btn-primary mt-2 w-full text-xl" onClick={startNewSession}>
            Lanjut Quiz! 📚✨
          </button>
        </motion.div>
      </FocusShell>
    );
  }

  const progress = ((idx + (revealed ? 1 : 0)) / questions.length) * 100;
  const isCorrect = revealed && selected === q.correctOptionId;

  return (
    <FocusShell
      onExit={() => router.push('/home')}
      title={`${meta.emoji} ${meta.label}`}
      coins={wallet.coins}
    >
      <Confetti show={confetti} />

      {/* Progress */}
      <div className="flex items-center gap-3">
        <div className="h-4 flex-1 overflow-hidden rounded-full bg-white/80 shadow-inner">
          <motion.div
            className="h-full rounded-full"
            style={{
              background: 'linear-gradient(90deg, #ff8fa3, #facc15, #4ade80)',
            }}
            initial={false}
            animate={{ width: `${progress}%` }}
            transition={{ type: 'spring', stiffness: 80, damping: 18 }}
          />
        </div>
        <span className="font-display text-base font-extrabold text-slate-700">
          {idx + 1}/{questions.length}
        </span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={q.id}
          initial={{ opacity: 0, x: 32, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: -32, scale: 0.95 }}
          transition={{ type: 'spring', damping: 18 }}
          className="card flex flex-col items-center gap-5 text-center"
        >
          {q.visual && (
            <motion.div
              animate={{ y: [0, -6, 0], rotate: [-3, 3, -3] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="text-7xl drop-shadow-lg"
              aria-hidden
            >
              {q.visual}
            </motion.div>
          )}
          <h2 className="font-display text-2xl font-extrabold leading-tight text-slate-800">
            {q.prompt}
          </h2>

          <div className="grid w-full grid-cols-1 gap-4 mt-2">
            {q.options.map((opt) => {
              const isSelected = selected === opt.id;
              const isRight = opt.id === q.correctOptionId;
              const cls = !revealed
                ? 'answer-btn'
                : isRight
                  ? 'answer-btn answer-btn-correct'
                  : isSelected
                    ? 'answer-btn answer-btn-wrong'
                    : 'answer-btn answer-btn-faded';
              return (
                <motion.button
                  key={opt.id}
                  type="button"
                  onClick={() => onPick(opt.id)}
                  disabled={revealed}
                  whileTap={!revealed ? { scale: 0.96 } : undefined}
                  whileHover={!revealed ? { scale: 1.02 } : undefined}
                  className={cls}
                >
                  {opt.visual && (
                    <span className="text-5xl drop-shadow" aria-hidden>
                      {opt.visual}
                    </span>
                  )}
                  <span className="flex-1 font-display text-2xl">{opt.label}</span>
                  {revealed && isRight && (
                    <span className="text-3xl" aria-hidden>
                      ✅
                    </span>
                  )}
                  {revealed && isSelected && !isRight && (
                    <span className="text-3xl" aria-hidden>
                      ❌
                    </span>
                  )}
                </motion.button>
              );
            })}
          </div>

          {revealed && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex w-full flex-col items-center gap-3"
            >
              <div
                className={`font-display text-2xl font-extrabold ${
                  isCorrect ? 'text-emerald-600' : 'text-rose-500'
                }`}
              >
                {isCorrect ? '🌟 Benar! +1 koin 🪙' : '🤗 Yuk lanjut soal berikutnya!'}
              </div>
              <button className="btn-primary w-full text-xl" onClick={onNext}>
                {idx + 1 >= questions.length ? '✨ Selesai!' : 'Lanjut →'}
              </button>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </FocusShell>
  );
}

/**
 * FocusShell — quiz auto-focus mode container.
 * No back button. Only an X button in top-right for parent to exit.
 */
function FocusShell({
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
        <CoinBadge coins={coins} />
        <h1 className="font-display text-lg font-extrabold text-slate-800 drop-shadow">
          {title}
        </h1>
        <button
          type="button"
          onClick={() => {
            sfx.click();
            onExit();
          }}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-xl font-extrabold text-rose-500 shadow-kid transition-all active:scale-90 hover:bg-rose-50"
          aria-label="Keluar dari quiz (orang tua)"
        >
          ✕
        </button>
      </header>
      {children}
    </main>
  );
}
