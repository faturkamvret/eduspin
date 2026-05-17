'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore, SHOP_PRICES } from '@/store/useAppStore';
import { HydrationGate } from '@/components/HydrationGate';
import { CoinBadge } from '@/components/CoinBadge';
import { Confetti } from '@/components/Confetti';
import { FloatingDeco } from '@/components/FloatingDeco';
import { Mascot } from '@/components/Mascot';
import { getCollectibleById } from '@/data/collectibles';
import { sfx, playCollectibleSfx } from '@/lib/sfx';
import type { Collectible } from '@/types';

const ROTATION_INTERVAL_MS = 24 * 60 * 60 * 1000;

export default function ShopPage() {
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
  const buyCollectible = useAppStore((s) => s.buyCollectible);
  const getOrRotateShopOffers = useAppStore((s) => s.getOrRotateShopOffers);
  const shopOffers = useAppStore((s) => s.shopOffers);

  const [confetti, setConfetti] = useState(false);
  const [purchased, setPurchased] = useState<Collectible | null>(null);
  const [errMsg, setErrMsg] = useState<string | null>(null);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!profile) router.replace('/onboarding');
  }, [profile, router]);

  // Trigger initial rotation on mount
  useEffect(() => {
    if (profile) getOrRotateShopOffers();
  }, [profile, getOrRotateShopOffers]);

  // Tick every minute for countdown display + auto-rotate when expired
  useEffect(() => {
    const id = setInterval(() => {
      setNow(Date.now());
      // Auto-refresh offers if stale
      getOrRotateShopOffers();
    }, 60_000);
    return () => clearInterval(id);
  }, [getOrRotateShopOffers]);

  // Resolve offers → Collectible objects, randomized display order each render of state
  const items = useMemo<Collectible[]>(() => {
    if (!shopOffers) return [];
    const resolved = shopOffers.itemIds
      .map((id) => getCollectibleById(id))
      .filter((c): c is Collectible => Boolean(c));
    // Shuffle for random display (Common & Rare mixed together — no grouping)
    const shuffled = [...resolved];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j]!, shuffled[i]!];
    }
    return shuffled;
    // Re-shuffle whenever the offers change (new rotation), not on every render
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shopOffers?.rotatedAt]);

  if (!profile) return null;

  const nextRotateAt = (shopOffers?.rotatedAt ?? now) + ROTATION_INTERVAL_MS;
  const remainingMs = Math.max(0, nextRotateAt - now);
  const remainingHours = Math.floor(remainingMs / 3_600_000);
  const remainingMinutes = Math.floor((remainingMs % 3_600_000) / 60_000);

  function handleBuy(item: Collectible) {
    const r = buyCollectible(item.id);
    if (!r.ok) {
      sfx.wrong();
      const msg =
        r.reason === 'not-enough-coins'
          ? 'Koin belum cukup. Yuk main kuis dulu! 🪙'
          : r.reason === 'already-owned'
            ? 'Sudah punya nih! Coba pilih yang lain ya 😊'
            : 'Hmm, hadiah ini tidak dijual di toko.';
      setErrMsg(msg);
      setTimeout(() => setErrMsg(null), 2200);
      return;
    }
    sfx.fanfare();
    playCollectibleSfx(item.id, item.category);
    setPurchased(item);
    setConfetti(true);
    setTimeout(() => setConfetti(false), 1800);
  }

  return (
    <main className="relative flex flex-1 flex-col gap-4 px-4 py-4">
      <FloatingDeco count={10} emojis={['🛍️', '🎁', '✨', '💖', '🍬', '🌟']} />
      <Confetti show={confetti} />

      {/* Header */}
      <header className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => {
            sfx.click();
            router.push('/home');
          }}
          className="rounded-full bg-white px-4 py-2 font-display text-sm font-bold shadow-kid"
          aria-label="Kembali ke beranda"
        >
          🏠 Beranda
        </button>
        <h1 className="font-display text-2xl font-extrabold text-rainbow drop-shadow">
          🛍️ Toko Hadiah
        </h1>
        <CoinBadge coins={wallet.coins} />
      </header>

      {/* Mascot greeting */}
      <div className="flex items-center justify-center gap-3">
        <Mascot mood="cheer" bubble={`Hai ${profile.nickname}!`} size="text-5xl" />
      </div>

      {/* Claw Machine entry — big call-out card */}
      <button
        type="button"
        onClick={() => {
          sfx.click();
          router.push('/claw');
        }}
        className="menu-card relative overflow-hidden text-white"
        style={{
          background:
            'linear-gradient(135deg, #ff8fa3 0%, #c4b5fd 50%, #7dd3fc 100%)',
        }}
        aria-label="Masuk ke Claw Machine"
      >
        <div className="text-6xl drop-shadow" aria-hidden>
          🎰
        </div>
        <div className="relative z-10 flex-1">
          <div className="font-display text-2xl font-extrabold drop-shadow">
            Claw Machine!
          </div>
          <div className="text-sm font-bold opacity-95">
            Tarik kejutan untuk hadiah Epik & Legendaris ✨
          </div>
        </div>
        <div className="relative z-10 text-3xl font-bold">→</div>
      </button>

      {/* Refresh countdown banner */}
      <div className="card-color flex items-center justify-between gap-3 bg-gradient-to-r from-amber-100 to-yellow-100 px-5 py-3 text-amber-800">
        <div className="text-2xl" aria-hidden>
          ⏰
        </div>
        <div className="flex-1 text-center">
          <div className="text-xs font-bold uppercase tracking-wide">Hadiah baru dalam</div>
          <div className="font-display text-lg font-extrabold">
            {remainingHours}j {remainingMinutes}m
          </div>
        </div>
        <div className="text-2xl" aria-hidden>
          🎁
        </div>
      </div>

      {/* Error toast */}
      <AnimatePresence>
        {errMsg && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="rounded-3xl bg-rose-100 px-5 py-3 text-center font-display text-base font-bold text-rose-700 shadow-kid"
          >
            {errMsg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Item grid — all items mixed together, no rarity grouping */}
      <div className="grid grid-cols-2 gap-4">
        {items.map((item) => {
          const owned = !!collection.items[item.id];
          const price = SHOP_PRICES[item.rarity] ?? 0;
          const canAfford = wallet.coins >= price;

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              whileTap={{ scale: 0.97 }}
              className="card-color relative flex flex-col items-center gap-2 overflow-hidden p-4"
            >
              <div
                className={`absolute inset-0 -z-10 bg-gradient-to-br ${item.gradient} opacity-80`}
              />
              {owned && (
                <div className="absolute right-2 top-2 rounded-full bg-emerald-500 px-2 py-0.5 text-xs font-bold text-white shadow">
                  ✓ Punya
                </div>
              )}
              <div className="text-6xl drop-shadow-lg" aria-hidden>
                {item.emoji}
              </div>
              <div className="text-center font-display text-base font-extrabold leading-tight text-slate-800 drop-shadow">
                {item.name}
              </div>
              <div className="text-center text-xs font-semibold text-slate-700">
                {item.flavor}
              </div>
              <button
                type="button"
                onClick={() => handleBuy(item)}
                disabled={owned || !canAfford}
                className={`mt-1 w-full rounded-full px-3 py-2 font-display text-sm font-extrabold shadow-kid transition-all active:scale-95 ${
                  owned
                    ? 'bg-emerald-200 text-emerald-700 cursor-not-allowed'
                    : canAfford
                      ? 'bg-gradient-to-r from-amber-300 to-orange-400 text-white'
                      : 'bg-slate-200 text-slate-500 cursor-not-allowed'
                }`}
                aria-label={owned ? 'Sudah dimiliki' : `Beli ${item.name} ${price} koin`}
              >
                {owned ? '🔒 Sudah Punya' : `Beli · ${price} 🪙`}
              </button>
            </motion.div>
          );
        })}
      </div>

      {/* Info box */}
      <div className="card-color bg-gradient-to-br from-amber-100 to-orange-100 px-5 py-3 text-center text-xs font-semibold text-amber-800">
        ✨ Hadiah <span className="font-extrabold">Epik & Legendaris</span> hanya
        bisa didapat dari Claw Machine 🎰
      </div>

      <div className="h-4" />

      {/* Purchase reveal modal */}
      <AnimatePresence>
        {purchased && (
          <PurchaseModal item={purchased} onClose={() => setPurchased(null)} />
        )}
      </AnimatePresence>
    </main>
  );
}

function PurchaseModal({
  item,
  onClose,
}: {
  item: Collectible;
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.4, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.7, opacity: 0 }}
        transition={{ type: 'spring', damping: 14, stiffness: 220 }}
        onClick={(e) => e.stopPropagation()}
        className="card flex w-full max-w-sm flex-col items-center gap-3 text-center"
      >
        <div className="font-display text-base font-extrabold text-emerald-600">
          🎉 Yeay! Berhasil Beli! 🎉
        </div>
        <motion.div
          animate={{ rotate: [0, -8, 8, 0], scale: [1, 1.08, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className={`mx-auto flex h-40 w-40 items-center justify-center rounded-full bg-gradient-to-br ${item.gradient} text-7xl shadow-xl ring-4 ring-white`}
        >
          {item.emoji}
        </motion.div>
        <div className="font-display text-2xl font-extrabold text-slate-800">
          {item.name}
        </div>
        <div className="text-sm text-slate-600">{item.flavor}</div>
        <button
          type="button"
          onClick={() => {
            sfx.click();
            onClose();
          }}
          className="btn-primary mt-2 w-full text-lg"
        >
          Asik! ✨
        </button>
      </motion.div>
    </motion.div>
  );
}
