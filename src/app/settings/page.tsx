'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';
import { HydrationGate } from '@/components/HydrationGate';
import { PageShell } from '@/components/PageShell';
import { FeedbackDialog } from '@/components/FeedbackDialog';
import { sfx, setMuted as setSfxMuted } from '@/lib/sfx';
import { SyncBadge } from '@/components/SyncBadge';
import type { Gender } from '@/types';

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
  const setBgmEnabled = useAppStore((s) => s.setBgmEnabled);
  const resetProfile = useAppStore((s) => s.resetProfile);

  const [nickname, setNickname] = useState(profile?.nickname ?? '');
  const [confirmReset, setConfirmReset] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);

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

  function toggleBgm() {
    if (settings.muted) return;
    const next = !(settings.bgmEnabled ?? false);
    setBgmEnabled(next);
    sfx.click();
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

        <div>
          <div className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-500">
            Gender (mengubah ini menyesuaikan hadiah koleksi)
          </div>
          <div className="grid grid-cols-2 gap-3">
            {([['boy', '👦', 'Laki-laki'], ['girl', '👧', 'Perempuan']] as const).map(
              ([g, emoji, label]) => (
                <motion.button
                  key={g}
                  type="button"
                  whileTap={{ scale: 0.92 }}
                  onClick={() => {
                    updateProfile({ gender: g as Gender });
                    sfx.click();
                  }}
                  className={`flex items-center justify-center gap-2 rounded-3xl py-3 font-display shadow-kid transition-all ${
                    profile.gender === g
                      ? g === 'boy'
                        ? 'bg-gradient-to-r from-sky-300 to-blue-400 text-white ring-4 ring-sky-300'
                        : 'bg-gradient-to-r from-pink-300 to-rose-400 text-white ring-4 ring-pink-300'
                      : 'bg-white text-slate-700'
                  }`}
                  aria-pressed={profile.gender === g}
                >
                  <span className="text-2xl" aria-hidden>
                    {emoji}
                  </span>
                  <span className="text-base font-extrabold">{label}</span>
                </motion.button>
              ),
            )}
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
        <label className="flex items-center justify-between">
          <span className="font-display font-bold">
            Musik latar lembut
            <span className="ml-1 text-xs font-semibold text-slate-500">
              (default mati)
            </span>
          </span>
          <button
            type="button"
            onClick={toggleBgm}
            className={`relative h-8 w-16 rounded-full transition-colors shadow-inner ${
              settings.bgmEnabled && !settings.muted ? 'bg-accent-500' : 'bg-slate-300'
            }`}
            aria-pressed={settings.bgmEnabled ?? false}
            aria-label="Toggle musik latar"
            disabled={settings.muted}
          >
            <motion.span
              animate={{ x: settings.bgmEnabled && !settings.muted ? 32 : 2 }}
              transition={{ type: 'spring', stiffness: 400, damping: 22 }}
              className="absolute top-1 block h-6 w-6 rounded-full bg-white shadow-md"
            />
          </button>
        </label>
        {settings.muted && settings.bgmEnabled && (
          <p className="text-xs font-semibold text-slate-500">
            Suara dibisukan total — musik latar mengikuti.
          </p>
        )}
      </Section>

      <Section title="ℹ️ Tentang Aplikasi">
        <p className="text-sm font-semibold text-slate-700">
          Squizzy dibuat untuk membantu anak belajar lewat permainan koleksi yang
          menyenangkan dan interaktif seperti boneka squishy. Tidak ada iklan,
          tidak ada pembelian uang asli, tidak ada pengumpulan data pribadi
          anak. 💖
        </p>
        <p className="text-xs font-bold text-slate-500">Squizzy · MVP v0.3 · 🇮🇩</p>
      </Section>

      <Section title="📝 Kritik & Saran">
        <p className="text-sm font-semibold text-slate-700">
          Punya ide, saran, atau menemukan bug? Kirim langsung ke tim kami.
        </p>
        <button
          type="button"
          className="btn-primary w-full"
          onClick={() => {
            sfx.click();
            setFeedbackOpen(true);
          }}
        >
          ✏️ Tulis Kritik & Saran
        </button>
      </Section>

      <Section title="📜 Legal & Kebijakan">
        <p className="text-sm font-semibold text-slate-700">
          Bacalah ketentuan penggunaan dan kebijakan privasi kami sebelum melanjutkan.
        </p>
        <div className="grid grid-cols-1 gap-2">
          <Link
            href="/privacy"
            onClick={() => sfx.click()}
            className="flex items-center justify-between rounded-3xl bg-white px-4 py-3 font-display font-bold text-slate-700 shadow-kid transition-all hover:bg-slate-50"
          >
            <span>🔒 Kebijakan Privasi</span>
            <span aria-hidden>→</span>
          </Link>
          <Link
            href="/terms"
            onClick={() => sfx.click()}
            className="flex items-center justify-between rounded-3xl bg-white px-4 py-3 font-display font-bold text-slate-700 shadow-kid transition-all hover:bg-slate-50"
          >
            <span>📃 Perjanjian Pengguna</span>
            <span aria-hidden>→</span>
          </Link>
        </div>
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

      <FeedbackDialog open={feedbackOpen} onClose={() => setFeedbackOpen(false)} />
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
