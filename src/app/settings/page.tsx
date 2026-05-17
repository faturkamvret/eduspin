'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';
import { HydrationGate } from '@/components/HydrationGate';
import { PageShell } from '@/components/PageShell';
import { sfx, setMuted as setSfxMuted } from '@/lib/sfx';
import { PITY_EPIC_THRESHOLD, PITY_LEGENDARY_THRESHOLD, RARITY_RATES } from '@/lib/gacha';
import { SHOP_PRICES } from '@/store/useAppStore';
import { SyncBadge } from '@/components/SyncBadge';

const AGE_OPTIONS = [
  { value: 1, label: '1', emoji: '🍼' },
  { value: 2, label: '2', emoji: '🧸' },
  { value: 3, label: '3', emoji: '🎈' },
  { value: 4, label: '4', emoji: '🧩' },
  { value: 5, label: '5', emoji: '🎨' },
  { value: 6, label: '6+', emoji: '🚀' },
];

export default function SettingsPage() {
  return (
    <HydrationGate>
      <Inner />
    </HydrationGate>
  );
}

function Inner() {
  const router = useRouter();
  const profile = useAppStore((s) => s.profile);
  const settings = useAppStore((s) => s.settings);
  const updateProfile = useAppStore((s) => s.updateProfile);
  const setMuted = useAppStore((s) => s.setMuted);
  const resetProfile = useAppStore((s) => s.resetProfile);

  const [nickname, setNickname] = useState(profile?.nickname ?? '');
  const [confirmReset, setConfirmReset] = useState(false);

  useEffect(() => {
    if (!profile) router.replace('/onboarding');
  }, [profile, router]);

  if (!profile) return null;

  function saveNickname() {
    if (nickname.trim() && nickname !== profile?.nickname) {
      updateProfile({ nickname });
      sfx.click();
    }
  }

  function changeAge(age: number) {
    updateProfile({ age });
    sfx.click();
  }

  function toggleMute() {
    const next = !settings.muted;
    setMuted(next);
    setSfxMuted(next);
    if (!next) sfx.click();
  }

  function doReset() {
    resetProfile();
    router.replace('/onboarding');
  }

  return (
    <PageShell title="⚙️ Pengaturan">
      <Section title="☁️ Sinkronisasi Awan">
        <SyncBadge variant="full" />
      </Section>

      <Section title="👤 Profil Anak">
        <label className="flex flex-col gap-2">
          <span className="text-xs font-bold uppercase tracking-wide text-slate-500">
            Nama panggilan
          </span>
          <div className="flex gap-2">
            <input
              value={nickname}
              maxLength={20}
              onChange={(e) => setNickname(e.target.value)}
              className="flex-1 rounded-3xl border-4 border-primary-200 bg-white px-4 py-3 font-display text-lg font-bold outline-none focus:border-primary-400"
            />
            <button
              type="button"
              className="btn-primary"
              onClick={saveNickname}
              disabled={!nickname.trim() || nickname === profile.nickname}
            >
              Simpan
            </button>
          </div>
        </label>

        <div>
          <div className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-500">
            Umur (mengubah ini menyesuaikan tingkat soal)
          </div>
          <div className="grid grid-cols-3 gap-2">
            {AGE_OPTIONS.map((opt) => (
              <motion.button
                key={opt.value}
                type="button"
                whileTap={{ scale: 0.92 }}
                onClick={() => changeAge(opt.value)}
                className={`flex flex-col items-center gap-1 rounded-3xl py-3 font-display shadow-kid transition-all ${
                  profile.age === opt.value
                    ? 'bg-gradient-to-br from-primary-300 to-primary-500 text-white ring-4 ring-primary-200'
                    : 'bg-white text-slate-700'
                }`}
                aria-pressed={profile.age === opt.value}
              >
                <span className="text-2xl" aria-hidden>
                  {opt.emoji}
                </span>
                <span className="text-lg font-extrabold">{opt.label}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </Section>

      <Section title="🔊 Suara">
        <label className="flex items-center justify-between">
          <span className="font-display font-bold">Bisukan efek suara</span>
          <button
            type="button"
            onClick={toggleMute}
            className={`relative h-8 w-16 rounded-full transition-colors shadow-inner ${
              settings.muted ? 'bg-slate-300' : 'bg-primary-500'
            }`}
            aria-pressed={settings.muted}
            aria-label="Toggle mute"
          >
            <motion.span
              animate={{ x: settings.muted ? 2 : 32 }}
              transition={{ type: 'spring', stiffness: 400, damping: 22 }}
              className="absolute top-1 block h-6 w-6 rounded-full bg-white shadow-md"
            />
          </button>
        </label>
      </Section>

      <Section title="🛍️ Toko Hadiah">
        <p className="text-sm font-semibold text-slate-700">
          Harga tetap, tanpa kejutan:
        </p>
        <ul className="space-y-1 text-sm font-semibold text-slate-700">
          <li>⚪ Biasa: {SHOP_PRICES.common} 🪙</li>
          <li>🔵 Langka: {SHOP_PRICES.rare} 🪙</li>
          <li className="text-xs text-slate-500">
            ✨ Hadiah Epik & Legendaris hanya dari Claw Machine
          </li>
        </ul>
      </Section>

      <Section title="🎰 Transparansi Claw Machine">
        <p className="text-sm font-semibold text-slate-700">
          Kami percaya keterbukaan. Berikut peluang setiap rarity:
        </p>
        <ul className="space-y-1 text-sm font-semibold text-slate-700">
          <li>⚪ Biasa: {Math.round(RARITY_RATES.common * 100)}%</li>
          <li>🔵 Langka: {Math.round(RARITY_RATES.rare * 100)}%</li>
          <li>🟣 Epik: {Math.round(RARITY_RATES.epic * 100)}%</li>
          <li>🟡 Legendaris: {Math.round(RARITY_RATES.legendary * 100)}%</li>
          <li>
            🎁 Tarikan ke-{PITY_EPIC_THRESHOLD} tanpa Epik → dijamin Epik atau lebih
          </li>
          <li>
            🌟 Tarikan ke-{PITY_LEGENDARY_THRESHOLD} tanpa Legendaris → dijamin Legendaris
          </li>
        </ul>
      </Section>

      <Section title="ℹ️ Tentang Aplikasi">
        <p className="text-sm font-semibold text-slate-700">
          EduSpin dibuat untuk membantu anak belajar lewat permainan koleksi yang
          menyenangkan. Tidak ada iklan, tidak ada pembelian uang asli, tidak ada
          pengumpulan data pribadi anak. 💖
        </p>
        <p className="text-xs font-bold text-slate-500">EduSpin · MVP v0.2 · 🇮🇩</p>
      </Section>

      <Section title="⚠️ Zona Bahaya" tone="danger">
        {!confirmReset ? (
          <button
            type="button"
            className="btn-ghost w-full text-rose-600"
            onClick={() => {
              sfx.click();
              setConfirmReset(true);
            }}
          >
            Reset semua data
          </button>
        ) : (
          <div className="flex flex-col gap-2">
            <p className="text-sm font-bold text-rose-700">
              Yakin? Semua koin, koleksi, dan progres akan hilang. 😢
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                className="btn-ghost"
                onClick={() => setConfirmReset(false)}
              >
                Batal
              </button>
              <button
                type="button"
                className="btn"
                style={{
                  background: 'linear-gradient(135deg, #fb7185, #e11d48)',
                  color: 'white',
                  boxShadow: '0 6px 0 #be123c, 0 10px 24px rgba(225,29,72,0.25)',
                }}
                onClick={doReset}
              >
                Ya, reset
              </button>
            </div>
          </div>
        )}
      </Section>
    </PageShell>
  );
}

function Section({
  title,
  children,
  tone = 'default',
}: {
  title: string;
  children: React.ReactNode;
  tone?: 'default' | 'danger';
}) {
  return (
    <section
      className={`card flex flex-col gap-3 ${
        tone === 'danger' ? 'ring-2 ring-rose-200' : ''
      }`}
    >
      <h2 className="font-display text-lg font-extrabold text-slate-800">{title}</h2>
      {children}
    </section>
  );
}
