'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAppStore, COIN_CONSTANTS } from '@/store/useAppStore';
import { HydrationGate } from '@/components/HydrationGate';
import { CoinBadge } from '@/components/CoinBadge';
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
      setBonusMsg(`Yeay! Kamu dapat +${r.coinsAdded} koin hari ini! 🪙`);
      setTimeout(() => setBonusMsg(null), 2500);
    } else {
      sfx.click();
      const hours = Math.max(1, Math.ceil((r.nextEligibleAt - Date.now()) / 3_600_000));
      setBonusMsg(`Bonus harian sudah diambil. Datang lagi ya dalam ${hours} jam!`);
      setTimeout(() => setBonusMsg(null), 2500);
    }
  }

  return (
    <main className="flex flex-1 flex-col gap-4 px-4 py-4">
      {/* Header */}
      <header className="flex items-center justify-between">
        <button
          type="button"
          className="rounded-full bg-white/70 px-3 py-1.5 text-sm font-bold shadow"
          onClick={() => {
            sfx.click();
            router.push('/settings');
          }}
          aria-label="Pengaturan"
        >
          ⚙️
        </button>
        <h1 className="font-display text-xl font-bold text-slate-800">
          Halo, {profile.nickname}!
        </h1>
        <CoinBadge coins={wallet.coins} />
      </header>

      {/* Greeting card */}
      <motion.section
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="card text-center"
      >
        <div className="mb-2 text-5xl animate-bounce-soft" aria-hidden>
          🎡
        </div>
        <p className="font-display text-lg font-semibold">
          Yuk lanjut belajar sambil bermain!
        </p>
        <p className="mt-1 text-sm text-slate-600">
          Koleksi:{' '}
          <span className="font-bold text-accent-600">
            {ownedCount}/{totalCollectibles}
          </span>
        </p>
      </motion.section>

      {/* Daily bonus */}
      <button
        type="button"
        onClick={handleDaily}
        className={`card flex items-center gap-3 text-left transition-all ${
          canClaim ? 'ring-2 ring-amber-300 hover:scale-[1.01]' : 'opacity-70'
        }`}
        aria-label="Klaim bonus harian"
      >
        <div className="text-4xl" aria-hidden>
          {canClaim ? '🎁' : '✅'}
        </div>
        <div className="flex-1">
          <div className="font-display font-bold">
            {canClaim ? 'Bonus Harian Siap!' : 'Bonus Harian Sudah Diklaim'}
          </div>
          <div className="text-sm text-slate-600">
            {canClaim
              ? `Klaim +${COIN_CONSTANTS.COIN_DAILY_BONUS} koin gratis 🪙`
              : 'Datang lagi besok ya!'}
          </div>
        </div>
      </button>

      {bonusMsg && (
        <div className="rounded-2xl bg-amber-100 px-4 py-2 text-center text-sm font-semibold text-amber-800">
          {bonusMsg}
        </div>
      )}

      {/* Main menu */}
      <nav className="grid grid-cols-1 gap-3">
        <MenuButton
          emoji="📚"
          title="Main Kuis"
          subtitle="Jawab soal, dapat koin"
          color="from-emerald-300 to-teal-300"
          onClick={() => router.push('/quiz')}
        />
        <MenuButton
          emoji="🎰"
          title="Claw Machine"
          subtitle={`Tarik 1x = ${COIN_CONSTANTS.COIN_PER_PULL} koin`}
          color="from-pink-300 to-rose-300"
          onClick={() => router.push('/claw')}
        />
        <MenuButton
          emoji="📔"
          title="Buku Koleksi"
          subtitle={`${ownedCount} dari ${totalCollectibles} terkumpul`}
          color="from-violet-300 to-fuchsia-300"
          onClick={() => router.push('/collection')}
        />
      </nav>

      <footer className="mt-auto pt-4 text-center text-xs text-slate-500">
        EduSpin · Belajar terasa seperti bermain
      </footer>
    </main>
  );
}

function MenuButton({
  emoji,
  title,
  subtitle,
  color,
  onClick,
}: {
  emoji: string;
  title: string;
  subtitle: string;
  color: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={() => {
        sfx.click();
        onClick();
      }}
      className={`flex items-center gap-4 rounded-3xl bg-gradient-to-br ${color}
                  p-4 text-left shadow-lg transition-all active:scale-[0.98] hover:scale-[1.02]`}
    >
      <div className="text-5xl" aria-hidden>
        {emoji}
      </div>
      <div className="flex-1">
        <div className="font-display text-xl font-bold text-white drop-shadow">
          {title}
        </div>
        <div className="text-sm font-semibold text-white/90">{subtitle}</div>
      </div>
      <div className="text-2xl text-white" aria-hidden>
        →
      </div>
    </button>
  );
}
