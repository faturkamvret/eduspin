'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore, COIN_CONSTANTS } from '@/store/useAppStore';
import { HydrationGate } from '@/components/HydrationGate';
import { CoinBadge } from '@/components/CoinBadge';
import { Confetti } from '@/components/Confetti';
import { Mascot } from '@/components/Mascot';
import { FloatingDeco } from '@/components/FloatingDeco';
import { getChapterById } from '@/data/stories';
import { speak, stopSpeaking } from '@/lib/tts';
import { sfx } from '@/lib/sfx';
import type { ChapterQuestion } from '@/types';

type Screen = 'narration' | 'quiz' | 'results';

export default function ChapterPlayPage() {
  return (
    <HydrationGate>
      <Inner />
    </HydrationGate>
  );
}

function Inner() {
  const router = useRouter();
  const params = useParams<{ storyId: string; chapterId: string }>();
  const profile = useAppStore((s) => s.profile);
  const wallet = useAppStore((s) => s.wallet);
  const completeStoryChapter = useAppStore((s) => s.completeStoryChapter);

  const [screen, setScreen] = useState<Screen>('narration');
  const [qIdx, setQIdx] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [confetti, setConfetti] = useState(false);
  const [result, setResult] = useState<{
    chapterBonus: number;
    storyJustCompleted: boolean;
    storyBonus: number;
  } | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const data = getChapterById(params.storyId, params.chapterId);

  useEffect(() => {
    if (!profile) router.replace('/onboarding');
  }, [profile, router]);

  // Stop TTS on unmount
  useEffect(() => {
    return () => stopSpeaking();
  }, []);

  if (!profile) return null;
  if (!data) {
    return (
      <main className="relative flex flex-1 flex-col items-center justify-center gap-4 px-4 py-4">
        <Mascot mood="thinking" bubble="Bab tidak ditemukan" />
        <button
          className="btn-primary"
          onClick={() => router.replace(`/stories/${params.storyId}`)}
        >
          Kembali ke cerita
        </button>
      </main>
    );
  }

  const { story, chapter } = data;
  const questions = chapter.questions;
  const currentQ: ChapterQuestion | undefined = questions[qIdx];

  function handleTTS() {
    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
      return;
    }
    const fullText = chapter.narration.join(' ');
    setIsSpeaking(true);
    speak(fullText, () => setIsSpeaking(false));
  }

  function handleGoToQuiz() {
    stopSpeaking();
    setIsSpeaking(false);
    setScreen('quiz');
    sfx.click();
  }

  function handlePick(optionId: string) {
    if (revealed || !currentQ) return;
    setSelected(optionId);
    setRevealed(true);
    const correct = optionId === currentQ.correctOptionId;
    if (correct) {
      setCorrectCount((c) => c + 1);
      sfx.correct();
      setConfetti(true);
      setTimeout(() => setConfetti(false), 1500);
    } else {
      sfx.wrong();
    }
  }

  function handleNext() {
    if (qIdx + 1 >= questions.length) {
      // Quiz done — complete chapter
      const finalCorrect = correctCount + (selected === currentQ?.correctOptionId ? 0 : 0);
      // correctCount already updated via handlePick
      const res = completeStoryChapter(
        story.id,
        chapter.id,
        correctCount,
        story.chapters.length,
      );
      setResult(res);
      setScreen('results');
      sfx.fanfare();
      setConfetti(true);
      setTimeout(() => setConfetti(false), 2500);
      return;
    }
    setQIdx((i) => i + 1);
    setSelected(null);
    setRevealed(false);
  }

  // ─── NARRATION SCREEN ───
  if (screen === 'narration') {
    return (
      <FocusShell
        onExit={() => router.push(`/stories/${story.id}`)}
        title={chapter.title}
        coins={wallet.coins}
      >
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="card flex flex-col items-center gap-5 text-center"
        >
          {/* Illustration */}
          <motion.div
            animate={{ y: [0, -8, 0], rotate: [-3, 3, -3] }}
            transition={{ repeat: Infinity, duration: 2.4 }}
            className="text-8xl drop-shadow-lg"
            aria-hidden
          >
            {chapter.illustration}
          </motion.div>

          {/* Narration text */}
          <div className="flex flex-col gap-3 text-left">
            {chapter.narration.map((para, i) => (
              <p
                key={i}
                className="font-display text-lg font-bold leading-relaxed text-slate-700"
              >
                {para}
              </p>
            ))}
          </div>

          {/* TTS button */}
          <motion.button
            type="button"
            onClick={handleTTS}
            whileTap={{ scale: 0.92 }}
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2 rounded-full px-5 py-3 font-display text-base font-bold text-white shadow-kid"
            style={{
              background: isSpeaking
                ? 'linear-gradient(135deg, #f87171 0%, #ef4444 100%)'
                : 'linear-gradient(135deg, #c4b5fd 0%, #a78bfa 50%, #8b5cf6 100%)',
            }}
            aria-label={isSpeaking ? 'Stop suara' : 'Dengarkan cerita'}
          >
            <span className="text-2xl">{isSpeaking ? '⏹️' : '🔊'}</span>
            {isSpeaking ? 'Berhenti' : 'Dengarkan'}
          </motion.button>

          {/* Continue to quiz */}
          <button
            className="btn-primary w-full text-xl"
            onClick={handleGoToQuiz}
          >
            Lanjut ke Pertanyaan →
          </button>
        </motion.section>
      </FocusShell>
    );
  }

  // ─── QUIZ SCREEN ───
  if (screen === 'quiz' && currentQ) {
    const progress = ((qIdx + (revealed ? 1 : 0)) / questions.length) * 100;
    const isCorrect = revealed && selected === currentQ.correctOptionId;

    return (
      <FocusShell
        onExit={() => router.push(`/stories/${story.id}`)}
        title={chapter.title}
        coins={wallet.coins}
      >
        <Confetti show={confetti} />

        {/* Progress bar */}
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
            {qIdx + 1}/{questions.length}
          </span>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentQ.id}
            initial={{ opacity: 0, x: 32, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -32, scale: 0.95 }}
            transition={{ type: 'spring', damping: 18 }}
            className="card flex flex-col items-center gap-5 text-center"
          >
            {currentQ.visual && (
              <motion.div
                animate={{ y: [0, -6, 0], rotate: [-3, 3, -3] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="text-7xl drop-shadow-lg"
                aria-hidden
              >
                {currentQ.visual}
              </motion.div>
            )}

            <h2 className="font-display text-2xl font-extrabold leading-tight text-slate-800">
              {currentQ.prompt}
            </h2>

            <div className="grid w-full grid-cols-1 gap-4 mt-2">
              {currentQ.options.map((opt) => {
                const isSelected = selected === opt.id;
                const isRight = opt.id === currentQ.correctOptionId;
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
                    onClick={() => {
                      if (revealed) return;
                      sfx.pop();
                      handlePick(opt.id);
                    }}
                    disabled={revealed}
                    whileTap={!revealed ? { scale: 0.93, rotate: -1 } : undefined}
                    whileHover={!revealed ? { scale: 1.02 } : undefined}
                    animate={
                      revealed && isRight
                        ? { scale: [1, 1.06, 1], rotate: [0, -2, 2, 0] }
                        : revealed && isSelected && !isRight
                          ? { x: [0, -8, 8, -6, 6, 0] }
                          : undefined
                    }
                    transition={{ duration: revealed && isRight ? 0.6 : 0.4 }}
                    className={cls}
                  >
                    {opt.visual && (
                      <span className="text-5xl drop-shadow" aria-hidden>
                        {opt.visual}
                      </span>
                    )}
                    <span className="flex-1 font-display text-2xl">
                      {opt.label}
                    </span>
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
                  {isCorrect ? '🌟 Benar! +1 koin 🪙' : '🤗 Yuk lanjut!'}
                </div>
                <button className="btn-primary w-full text-xl" onClick={handleNext}>
                  {qIdx + 1 >= questions.length ? '✨ Lihat Hasil!' : 'Lanjut →'}
                </button>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </FocusShell>
    );
  }

  // ─── RESULTS SCREEN ───
  if (screen === 'results' && result) {
    const answerCoins = correctCount * COIN_CONSTANTS.COIN_PER_CORRECT;
    const totalEarned = answerCoins + result.chapterBonus + result.storyBonus;

    return (
      <FocusShell
        onExit={() => router.push(`/stories/${story.id}`)}
        title="Selesai!"
        coins={wallet.coins}
      >
        <Confetti show={confetti} count={50} />
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', damping: 14 }}
          className="card flex flex-col items-center gap-4 text-center"
        >
          <Mascot
            mood="celebrate"
            bubble={result.storyJustCompleted ? 'Cerita selesai!' : 'Hebat!'}
            size="text-7xl"
          />
          <h2 className="font-display text-3xl font-extrabold text-rainbow">
            Bagus, {profile.nickname}!
          </h2>
          <p className="font-display text-lg font-bold text-slate-700">
            Kamu menjawab benar{' '}
            <span className="text-emerald-600">
              {correctCount}/{questions.length}
            </span>{' '}
            🎯
          </p>

          <div
            className="w-full rounded-3xl px-6 py-4 text-amber-900 shadow-kid-sun"
            style={{ background: 'linear-gradient(135deg, #fff3b8, #fde047)' }}
          >
            <div className="text-xs font-bold uppercase tracking-wide">
              Koin Diperoleh
            </div>
            <div className="font-display text-4xl font-extrabold">
              +{totalEarned} 🪙
            </div>
            <div className="mt-1 flex flex-col gap-0.5 text-xs font-semibold">
              <span>{answerCoins} jawaban benar</span>
              <span>+{result.chapterBonus} bonus bab</span>
              {result.storyBonus > 0 && (
                <span className="text-amber-700">
                  +{result.storyBonus} bonus cerita selesai! 🏆
                </span>
              )}
            </div>
          </div>

          {result.storyJustCompleted && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="rounded-3xl bg-gradient-to-r from-emerald-100 to-teal-200 px-5 py-3 text-center font-display text-base font-extrabold text-emerald-900 shadow-kid"
            >
              🎉 Kamu menyelesaikan seluruh cerita &quot;{story.title}&quot;!
            </motion.div>
          )}

          <button
            className="btn-primary mt-2 w-full text-xl"
            onClick={() => {
              sfx.click();
              router.push(`/stories/${story.id}`);
            }}
          >
            Kembali ke Cerita 📖
          </button>
        </motion.div>
      </FocusShell>
    );
  }

  // Fallback (shouldn't reach here)
  return null;
}

/**
 * FocusShell — same pattern as quiz play page.
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
      <FloatingDeco count={8} emojis={['⭐', '✨', '📖', '🌈']} />
      <header className="flex items-center justify-between gap-2">
        <motion.button
          type="button"
          whileTap={{ scale: 0.92 }}
          onClick={() => {
            sfx.click();
            onExit();
          }}
          className="rounded-full bg-white px-4 py-2 font-display text-sm font-bold shadow-kid transition-all hover:bg-slate-50"
          aria-label="Kembali ke cerita"
        >
          ← Kembali
        </motion.button>
        <h1 className="font-display text-lg font-extrabold text-slate-800 drop-shadow truncate max-w-[50%]">
          {title}
        </h1>
        <CoinBadge coins={coins} />
      </header>
      {children}
    </main>
  );
}
