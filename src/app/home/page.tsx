'use client';

import { useEffect, useState } from 'react';
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
import { COLLECTIBLES } from '@/data/collectibles';

export default function HomePage() {
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
  const collection = useAppStore((s) => s.collection);
  const claimDailyBonus = useAppStore((s) => s.claimDailyBonus);

  const [bonusMsg, setBonusMsg] = useState<string | null>(null);
  const [confetti, setConfetti] = useState(false);

  useEffect(() => {
    if (!profile) router.replace('/onboarding');
  }, [profile, router]);

  if (!profile) return null;

  const totalCollectibles = COLLECTIBLES.length;
  const ownedCount = Object.keys(collection.items).length;

  const last = wallet.lastDailyClaim ?? 0;
  const eligibleAt = last + COIN_CONSTANTS.DAILY_BONUS_INTERVAL_MS;
  const canClaim = Date.now() >= eligibleAt;

  function handleDaily() {
    const r = claimDailyBonus();
    if (r.ok) {
      sfx.coin();
      setConfetti(true);
      setTimeout(() => setConfetti(false), 1500);
      setBonusMsg(`Yeay! Kamu dapat +${r.coinsAdded} koin hari ini! 🪙✨`);
      setTimeout(() => setBonusMsg(null), 2500);
    } else {
      sfx.click();
      const hours = Math.max(1, Math.ceil((r.nextEligibleAt - Date.now()) / 3_600_000));
      setBonusMsg(`Bonus harian sudah diambil. Datang lagi dalam ${hours} jam ya! 😊`);
      setTimeout(() => setBonusMsg(null), 2500);
    }
  }

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

      {/* Greeting + mascot */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="card flex flex-col items-center gap-3 text-center"
      >
        <Mascot mood="happy" bubble={`Hai, ${profile.nickname}!`} size="text-7xl" />
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

      {/* Daily bonus */}
      <motion.button
        type="button"
        onClick={handleDaily}
        whileTap={{ scale: 0.97 }}
        whileHover={canClaim ? { scale: 1.02 } : undefined}
        className={`menu-card overflow-hidden text-left ${
          canClaim ? '' : 'opacity-75'
        }`}
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

      {/* Main menu — 3 big tappy cards */}
      <nav className="grid grid-cols-1 gap-4">
        <MenuButton
          emoji="📚"
          title="Main Kuis"
          subtitle="Jawab soal seru, dapat koin!"
          gradient="linear-gradient(135deg, #86efac 0%, #4ade80 50%, #22c55e 100%)"
          onClick={() => router.push('/quiz')}
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
      onClick={() => {
        sfx.click();
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
