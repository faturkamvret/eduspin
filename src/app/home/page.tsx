'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAppStore, COIN_CONSTANTS } from '@/store/useAppStore';
import { HydrationGate } from '@/components/HydrationGate';
import { CoinBadge } from '@/components/CoinBadge';
import { SyncBadge } from '@/components/SyncBadge';
import { Confetti } from '@/components/Confetti';
import { Mascot } from '@/components/Mascot';
import { FloatingDeco } from '@/components/FloatingDeco';
import { sfx } from '@/lib/sfx';
import { speak } from '@/lib/speech';
import { triggerFlyingCoin } from '@/components/FlyingCoin';
import { triggerTapBurst } from '@/components/TapBurst';
import { COLLECTIBLES } from '@/data/collectibles';
import { getTodayMission, isSameLocalDay } from '@/data/missions';

export default function HomePage() {
  return (
    <HydrationGate>
      <Inner />
    </HydrationGate>
  );
}

/**
 * Compute the mascot mood for the home page based on recent activity.
 *
 * - Played within the last 12h → 'happy'  (engaged, recent)
 * - Played 12h–48h ago → 'cheer'  (welcome back!)
 * - Older or never → 'sleepy'  (the pet "missed you")
 *
 * This is the lightweight virtual-pet hook — no counters, no streaks per
 * the parent's request, just a quiet emotional signal.
 */
function moodForLastPlayed(lastPlayedAt: number | null): 'happy' | 'cheer' | 'sleepy' {
  if (!lastPlayedAt) return 'sleepy';
  const diff = Date.now() - lastPlayedAt;
  if (diff < 12 * 3_600_000) return 'happy';
  if (diff < 48 * 3_600_000) return 'cheer';
  return 'sleepy';
}

function bubbleForMood(mood: 'happy' | 'cheer' | 'sleepy', name: string): string {
  switch (mood) {
    case 'happy':
      return `Hai, ${name}!`;
    case 'cheer':
      return `Selamat datang lagi, ${name}!`;
    case 'sleepy':
      return `${name}, aku rindu... yuk main!`;
  }
}

function Inner() {
  const router = useRouter();
  const profile = useAppStore((s) => s.profile);
  const wallet = useAppStore((s) => s.wallet);
  const collection = useAppStore((s) => s.collection);
  const claimDailyBonus = useAppStore((s) => s.claimDailyBonus);
  const lastPlayedAt = useAppStore((s) => s.lastPlayedAt);
  const missionProgress = useAppStore((s) => s.missionProgress);

  const [bonusMsg, setBonusMsg] = useState<string | null>(null);
  const [confetti, setConfetti] = useState(false);

  useEffect(() => {
    if (!profile) router.replace('/onboarding');
  }, [profile, router]);

  // Today's mission card — narrative driver for the day.
  const todayMission = useMemo(() => getTodayMission(new Date()), []);
  const missionTodayProgress =
    missionProgress &&
    missionProgress.missionId === todayMission.id &&
    isSameLocalDay(Date.parse(missionProgress.date + 'T00:00:00'), Date.now())
      ? missionProgress
      : null;
  const missionDoneToday = missionTodayProgress?.rewarded ?? false;

  if (!profile) return null;

  const totalCollectibles = COLLECTIBLES.length;
  const ownedCount = Object.keys(collection.items).length;

  const last = wallet.lastDailyClaim ?? 0;
  const eligibleAt = last + COIN_CONSTANTS.DAILY_BONUS_INTERVAL_MS;
  const canClaim = Date.now() >= eligibleAt;

  const mood = moodForLastPlayed(lastPlayedAt);

  function handleDaily(evt: React.MouseEvent) {
    const r = claimDailyBonus();
    if (r.ok) {
      sfx.coin();
      setConfetti(true);
      setTimeout(() => setConfetti(false), 1500);
      // Fly the coin from the daily card into the badge.
      triggerFlyingCoin({ x: evt.clientX, y: evt.clientY }, r.coinsAdded);
      setBonusMsg(`Yeay! Kamu dapat +${r.coinsAdded} koin hari ini! 🪙✨`);
      setTimeout(() => setBonusMsg(null), 2500);
    } else {
      sfx.click();
      const hours = Math.max(1, Math.ceil((r.nextEligibleAt - Date.now()) / 3_600_000));
      setBonusMsg(`Bonus harian sudah diambil. Datang lagi dalam ${hours} jam ya! 😊`);
      setTimeout(() => setBonusMsg(null), 2500);
    }
  }

  function tellMissionStory() {
    speak(todayMission.intro, { rate: 0.9, pitch: 1.2 });
    sfx.click();
  }

  const missionTarget = todayMission.target;
  const missionDone = missionTodayProgress?.correct ?? 0;
  const missionPct = Math.min(100, (missionDone / missionTarget) * 100);

  return (
    <main className="relative flex flex-1 flex-col gap-4 px-4 py-4">
      <FloatingDeco count={14} gender={profile.gender} />
      <Confetti show={confetti} count={40} />

      {/* Header */}
      <header className="flex items-center justify-between">
        <button
          type="button"
          className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-2xl shadow-kid transition-all active:scale-90 hover:bg-slate-50"
          onClick={() => {
            sfx.click();
            router.push('/settings');
          }}
          aria-label="Pengaturan"
        >
          ⚙️
        </button>
        <CoinBadge coins={wallet.coins} />
      </header>

      {/* Greeting + mascot — mood reflects recent activity */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="card flex flex-col items-center gap-3 text-center"
      >
        <Mascot mood={mood} bubble={bubbleForMood(mood, profile.nickname)} size="text-7xl" />
        <h1 className="font-display text-3xl font-extrabold text-rainbow drop-shadow">
          Selamat Datang!
        </h1>
        <p className="font-display text-sm font-bold text-slate-600">
          Koleksi:{' '}
          <span className="text-accent-600">
            {ownedCount}/{totalCollectibles}
          </span>{' '}
          🏆
        </p>
        <SyncBadge />
      </motion.section>

      {/* Today's Mission card */}
      <motion.button
        type="button"
        onClick={tellMissionStory}
        whileTap={{ scale: 0.98 }}
        whileHover={{ scale: 1.02 }}
        className="menu-card text-left"
        style={{
          background: missionDoneToday
            ? 'linear-gradient(135deg, #bbf7d0 0%, #86efac 100%)'
            : 'linear-gradient(135deg, #c4b5fd 0%, #f0abfc 50%, #fda4af 100%)',
          color: 'white',
        }}
        aria-label={`Misi hari ini: ${todayMission.title}`}
      >
        <div className="text-6xl drop-shadow" aria-hidden>
          {missionDoneToday ? '✨' : todayMission.emoji}
        </div>
        <div className="flex-1">
          <div className="text-xs font-extrabold uppercase tracking-wide opacity-90">
            {missionDoneToday ? 'Misi Selesai!' : 'Misi Hari Ini'}
          </div>
          <div className="font-display text-lg font-extrabold drop-shadow">
            {todayMission.title}
          </div>
          {!missionDoneToday && (
            <>
              <div className="mt-1 text-xs font-bold opacity-95 line-clamp-2">
                {todayMission.intro}
              </div>
              <div className="mt-2 flex items-center gap-2">
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/40">
                  <motion.div
                    className="h-full rounded-full bg-white"
                    initial={false}
                    animate={{ width: `${missionPct}%` }}
                  />
                </div>
                <span className="text-xs font-extrabold">
                  {missionDone}/{missionTarget}
                </span>
              </div>
            </>
          )}
          {missionDoneToday && (
            <div className="text-xs font-bold opacity-95">{todayMission.outro}</div>
          )}
        </div>
        <div className="text-xl drop-shadow opacity-90" aria-hidden>
          🔊
        </div>
      </motion.button>

      {/* Daily bonus */}
      <motion.button
        type="button"
        onClick={handleDaily}
        whileTap={{ scale: 0.97 }}
        whileHover={canClaim ? { scale: 1.02 } : undefined}
        className={`menu-card overflow-hidden text-left ${canClaim ? '' : 'opacity-75'}`}
        style={{
          background: canClaim
            ? 'linear-gradient(135deg, #fde047 0%, #facc15 50%, #eab308 100%)'
            : 'linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%)',
        }}
        aria-label="Klaim bonus harian"
      >
        <motion.div
          animate={canClaim ? { rotate: [-10, 10, -10], scale: [1, 1.08, 1] } : {}}
          transition={{ repeat: Infinity, duration: 1.6 }}
          className="text-6xl drop-shadow"
          aria-hidden
        >
          {canClaim ? '🎁' : '✅'}
        </motion.div>
        <div className="flex-1">
          <div className="font-display text-xl font-extrabold text-amber-900 drop-shadow">
            {canClaim ? 'Bonus Harian Siap!' : 'Sudah Diklaim Hari Ini'}
          </div>
          <div className="text-sm font-bold text-amber-800">
            {canClaim
              ? `Klaim +${COIN_CONSTANTS.COIN_DAILY_BONUS} koin gratis 🪙`
              : 'Datang lagi besok ya! ☀️'}
          </div>
        </div>
      </motion.button>

      {bonusMsg && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-3xl bg-gradient-to-r from-amber-100 to-yellow-100 px-5 py-3 text-center font-display text-sm font-bold text-amber-800 shadow-kid"
        >
          {bonusMsg}
        </motion.div>
      )}

      {/* Main menu */}
      <nav className="grid grid-cols-1 gap-4">
        <MenuButton
          emoji="📚"
          title="Main Kuis"
          subtitle="Jawab soal seru, dapat koin!"
          gradient="linear-gradient(135deg, #86efac 0%, #4ade80 50%, #22c55e 100%)"
          onClick={() => router.push('/quiz')}
        />
        <MenuButton
          emoji="📖"
          title="Buku Cerita"
          subtitle="Baca cerita & jawab pertanyaan!"
          gradient="linear-gradient(135deg, #93c5fd 0%, #60a5fa 50%, #3b82f6 100%)"
          onClick={() => router.push('/stories')}
        />
        <MenuButton
          emoji="🛍️"
          title="Toko Hadiah"
          subtitle="Beli koleksi & mainkan claw machine!"
          gradient="linear-gradient(135deg, #ff8fa3 0%, #ff5d7a 50%, #f472b6 100%)"
          onClick={() => router.push('/shop')}
        />
        <MenuButton
          emoji="📔"
          title="Buku Koleksi"
          subtitle={`${ownedCount} dari ${totalCollectibles} terkumpul ✨`}
          gradient="linear-gradient(135deg, #c4b5fd 0%, #a78bfa 50%, #8b5cf6 100%)"
          onClick={() => router.push('/collection')}
        />
      </nav>

      <footer className="mt-auto pt-4 text-center text-xs font-bold text-slate-500">
        EduSpin · Belajar terasa seperti bermain 🎡
      </footer>
    </main>
  );
}

function MenuButton({
  emoji,
  title,
  subtitle,
  gradient,
  onClick,
}: {
  emoji: string;
  title: string;
  subtitle: string;
  gradient: string;
  onClick: () => void;
}) {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.96 }}
      whileHover={{ scale: 1.03 }}
      onClick={(e: React.MouseEvent) => {
        sfx.click();
        triggerTapBurst(e.clientX, e.clientY);
        onClick();
      }}
      className="menu-card relative overflow-hidden text-white"
      style={{ background: gradient }}
    >
      <motion.div
        animate={{ y: [0, -6, 0], rotate: [-4, 4, -4] }}
        transition={{ repeat: Infinity, duration: 2.2 }}
        className="text-6xl drop-shadow-lg"
        aria-hidden
      >
        {emoji}
      </motion.div>
      <div className="flex-1">
        <div className="font-display text-2xl font-extrabold drop-shadow">
          {title}
        </div>
        <div className="text-sm font-bold opacity-95">{subtitle}</div>
      </div>
      <div className="text-3xl font-extrabold opacity-90" aria-hidden>
        →
      </div>
    </motion.button>
  );
}
