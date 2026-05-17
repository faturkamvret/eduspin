'use client';

import { useEffect, useMemo, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore, COIN_CONSTANTS } from '@/store/useAppStore';
import { HydrationGate } from '@/components/HydrationGate';
import { CoinBadge } from '@/components/CoinBadge';
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

  // Session counter to regenerate questions on "Lanjut Quiz"
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

  useEffect(() => {
    if (!profile) router.replace('/onboarding');
  }, [profile, router]);

  // Start a new quiz session (auto-focus: loops forever until X is pressed)
  const startNewSession = useCallback(() => {
    setSessionKey((k) => k + 1);
    setIdx(0);
    setSelected(null);
    setRevealed(false);
    setCorrectCount(0);
    setDone(false);
    setBonusGiven(false);
    sfx.click();
  }, []);

  if (!profile || !meta) return null;
  if (questions.length === 0) {
    return (
      <FocusShell onExit={() => router.push('/home')} title={meta.label} coins={wallet.coins}>
        <div className="card text-center">
          <div className="text-5xl">😅</div>
          <p className="mt-2 font-bold">Belum ada soal di kategori ini.</p>
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
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card flex flex-col items-center gap-3 text-center"
        >
          <div className="text-7xl animate-bounce-soft">🎉</div>
          <h2 className="font-display text-2xl font-bold">Kerja bagus, {profile.nickname}!</h2>
          <p className="text-slate-600">
            Kamu menjawab benar{' '}
            <span className="font-bold text-emerald-600">
              {correctCount}/{questions.length}
            </span>
          </p>
          <div className="rounded-2xl bg-amber-100 px-4 py-3 text-amber-800">
            <div className="text-sm">Koin didapat sesi ini</div>
            <div className="font-display text-2xl font-bold">+{totalEarned} 🪙</div>
            <div className="text-xs">
              ({earnedFromAnswers} dari jawaban + {COIN_CONSTANTS.COIN_BONUS_PER_SESSION} bonus)
            </div>
          </div>
          {/* Auto-focus: only "Lanjut Quiz" button, no home/claw */}
          <button className="btn-primary mt-2 w-full text-lg" onClick={startNewSession}>
            Lanjut Quiz! 📚
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
      {/* Progress */}
      <div className="flex items-center gap-2">
        <div className="h-3 flex-1 overflow-hidden rounded-full bg-white/70">
          <motion.div
            className="h-full bg-primary-500"
            initial={false}
            animate={{ width: `${progress}%` }}
            transition={{ type: 'spring', stiffness: 80, damping: 18 }}
          />
        </div>
        <span className="text-sm font-semibold text-slate-600">
          {idx + 1}/{questions.length}
        </span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={q.id}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          className="card flex flex-col items-center gap-4 text-center"
        >
          {q.visual && (
            <div className="text-5xl" aria-hidden>
              {q.visual}
            </div>
          )}
          <h2 className="font-display text-xl font-bold leading-tight">{q.prompt}</h2>

          <div className="grid w-full grid-cols-1 gap-2">
            {q.options.map((opt) => {
              const isSelected = selected === opt.id;
              const isRight = opt.id === q.correctOptionId;
              const stateClass = !revealed
                ? 'bg-white hover:bg-primary-50'
                : isRight
                  ? 'bg-emerald-100 ring-2 ring-emerald-400'
                  : isSelected
                    ? 'bg-rose-100 ring-2 ring-rose-400'
                    : 'bg-white opacity-60';
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => onPick(opt.id)}
                  disabled={revealed}
                  className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-left
                              shadow transition-all ${stateClass}`}
                >
                  {opt.visual && (
                    <span className="text-3xl" aria-hidden>
                      {opt.visual}
                    </span>
                  )}
                  <span className="flex-1 font-bold">{opt.label}</span>
                  {revealed && isRight && <span aria-hidden>✅</span>}
                  {revealed && isSelected && !isRight && <span aria-hidden>❌</span>}
                </button>
              );
            })}
          </div>

          {revealed && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex w-full flex-col items-center gap-2"
            >
              <div
                className={`text-lg font-bold ${
                  isCorrect ? 'text-emerald-600' : 'text-rose-600'
                }`}
              >
                {isCorrect ? '🌟 Benar! +1 koin' : '🤗 Yuk coba lagi soal berikutnya!'}
              </div>
              <button className="btn-primary w-full" onClick={onNext}>
                {idx + 1 >= questions.length ? 'Selesai' : 'Lanjut →'}
              </button>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </FocusShell>
  );
}

/**
 * FocusShell — replaces PageShell for quiz auto-focus mode.
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
    <main className="flex flex-1 flex-col gap-4 px-4 py-4">
      <header className="flex items-center justify-between">
        <CoinBadge coins={coins} />
        <h1 className="font-display text-xl font-bold text-slate-800">{title}</h1>
        <button
          type="button"
          onClick={() => {
            sfx.click();
            onExit();
          }}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-white/70 text-lg font-bold text-slate-600 shadow transition-all hover:bg-white hover:text-slate-800"
          aria-label="Keluar dari quiz"
        >
          ✕
        </button>
      </header>
      {children}
    </main>
  );
}
