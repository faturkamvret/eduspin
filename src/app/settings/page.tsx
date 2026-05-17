'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/store/useAppStore';
import { HydrationGate } from '@/components/HydrationGate';
import { PageShell } from '@/components/PageShell';
import { sfx, setMuted as setSfxMuted } from '@/lib/sfx';
import { PITY_EPIC_THRESHOLD, PITY_LEGENDARY_THRESHOLD, RARITY_RATES } from '@/lib/gacha';
import { SyncBadge } from '@/components/SyncBadge';

const AGES = [3, 4, 5, 6, 7, 8, 9, 10];

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
      <Section title="Sinkronisasi Awan">
        <SyncBadge variant="full" />
      </Section>

      <Section title="Profil Anak">
        <label className="flex flex-col gap-1">
          <span className="text-xs font-semibold text-slate-500">Nama panggilan</span>
          <div className="flex gap-2">
            <input
              value={nickname}
              maxLength={20}
              onChange={(e) => setNickname(e.target.value)}
              className="flex-1 rounded-2xl border-2 border-primary-200 bg-white px-4 py-2"
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
          <div className="mb-2 text-xs font-semibold text-slate-500">
            Umur (mengubah ini akan menyesuaikan tingkat kesulitan soal)
          </div>
          <div className="grid grid-cols-4 gap-2">
            {AGES.map((a) => (
              <button
                key={a}
                type="button"
                onClick={() => changeAge(a)}
                className={`rounded-2xl py-2 font-display text-lg font-bold shadow ${
                  profile.age === a
                    ? 'bg-primary-500 text-white'
                    : 'bg-white text-slate-700'
                }`}
                aria-pressed={profile.age === a}
              >
                {a}
              </button>
            ))}
          </div>
        </div>
      </Section>

      <Section title="Suara">
        <label className="flex items-center justify-between">
          <span className="font-semibold">Bisukan efek suara</span>
          <button
            type="button"
            onClick={toggleMute}
            className={`h-7 w-14 rounded-full transition-colors ${
              settings.muted ? 'bg-slate-300' : 'bg-primary-500'
            }`}
            aria-pressed={settings.muted}
            aria-label="Toggle mute"
          >
            <span
              className={`block h-6 w-6 rounded-full bg-white shadow transition-transform ${
                settings.muted ? 'translate-x-0.5' : 'translate-x-7'
              }`}
            />
          </button>
        </label>
      </Section>

      <Section title="Transparansi Claw Machine">
        <p className="text-sm text-slate-600">
          Kami percaya keterbukaan. Berikut peluang setiap rarity dan jaminan pity:
        </p>
        <ul className="list-disc space-y-0.5 pl-5 text-sm text-slate-700">
          <li>Biasa: {Math.round(RARITY_RATES.common * 100)}%</li>
          <li>Langka: {Math.round(RARITY_RATES.rare * 100)}%</li>
          <li>Epik: {Math.round(RARITY_RATES.epic * 100)}%</li>
          <li>Legendaris: {Math.round(RARITY_RATES.legendary * 100)}%</li>
          <li>
            Tarikan ke-{PITY_EPIC_THRESHOLD} berturut-turut tanpa Epik → dijamin Epik atau lebih
          </li>
          <li>
            Tarikan ke-{PITY_LEGENDARY_THRESHOLD} berturut-turut tanpa Legendaris → dijamin
            Legendaris
          </li>
        </ul>
      </Section>

      <Section title="Tentang Aplikasi">
        <p className="text-sm text-slate-600">
          EduSpin dibuat untuk membantu anak belajar lewat permainan koleksi yang
          menyenangkan. Tidak ada iklan, tidak ada pembelian uang asli, tidak ada
          pengumpulan data pribadi anak.
        </p>
        <p className="text-xs text-slate-500">EduSpin · MVP v0.1</p>
      </Section>

      <Section title="Zona Bahaya" tone="danger">
        {!confirmReset ? (
          <button
            type="button"
            className="btn-ghost w-full text-rose-600"
            onClick={() => setConfirmReset(true)}
          >
            Reset semua data
          </button>
        ) : (
          <div className="flex flex-col gap-2">
            <p className="text-sm text-rose-700">
              Yakin? Semua koin, koleksi, dan progres akan hilang.
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
                className="btn bg-rose-500 text-white hover:bg-rose-600"
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
        tone === 'danger' ? 'ring-1 ring-rose-200' : ''
      }`}
    >
      <h2 className="font-display text-lg font-bold">{title}</h2>
      {children}
    </section>
  );
}
