'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';
import { HydrationGate } from '@/components/HydrationGate';
import { sfx } from '@/lib/sfx';

const AGE_OPTIONS = [
  { value: 1, label: '1' },
  { value: 2, label: '2' },
  { value: 3, label: '3' },
  { value: 4, label: '4' },
  { value: 5, label: '5' },
  { value: 6, label: '6+' },
];

export default function OnboardingPage() {
  return (
    <HydrationGate>
      <Inner />
    </HydrationGate>
  );
}

function Inner() {
  const router = useRouter();
  const setProfile = useAppStore((s) => s.setProfile);
  const existing = useAppStore((s) => s.profile);

  const [step, setStep] = useState<'welcome' | 'name' | 'age'>(
    existing ? 'name' : 'welcome',
  );
  const [nickname, setNickname] = useState(existing?.nickname ?? '');
  const [age, setAge] = useState<number | null>(existing?.age ?? null);

  const trimmed = nickname.trim();
  const canContinueName = trimmed.length >= 1 && trimmed.length <= 20;

  function handleSubmit() {
    if (!canContinueName || age === null) return;
    setProfile(trimmed, age);
    sfx.fanfare();
    router.replace('/home');
  }

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 px-6 py-8">
      {step === 'welcome' && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="card flex flex-col items-center gap-4 text-center"
        >
          <div className="text-7xl animate-bounce-soft" aria-hidden>
            🎡
          </div>
          <h1 className="font-display text-3xl font-bold text-primary-600">
            Selamat Datang di EduSpin!
          </h1>
          <p className="text-slate-600">
            Jawab kuis seru, kumpulkan koin, lalu mainkan{' '}
            <span className="font-bold text-accent-600">Claw Machine</span> untuk
            mengoleksi teman-teman lucu! 🐶🐱🦄
          </p>
          <button
            type="button"
            className="btn-primary mt-2 text-lg"
            onClick={() => {
              sfx.click();
              setStep('name');
            }}
          >
            Mulai Petualangan! ✨
          </button>
          <p className="mt-2 text-xs text-slate-500">
            Aplikasi ini gratis, tanpa iklan, dan dirancang aman untuk anak.
          </p>
        </motion.div>
      )}

      {step === 'name' && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="card flex w-full flex-col gap-4"
        >
          <h2 className="font-display text-2xl font-bold text-slate-800">
            Halo! Siapa nama panggilanmu? 😊
          </h2>
          <input
            type="text"
            inputMode="text"
            autoComplete="off"
            spellCheck={false}
            maxLength={20}
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="Contoh: Alya"
            aria-label="Nama panggilan"
            className="rounded-2xl border-2 border-primary-200 bg-white px-4 py-3 text-lg
                       outline-none focus:border-primary-400"
          />
          <p className="text-xs text-slate-500">
            Cukup nama panggilan saja, ya. Kami tidak menyimpan informasi pribadi.
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              className="btn-ghost flex-1"
              onClick={() => setStep('welcome')}
            >
              Kembali
            </button>
            <button
              type="button"
              className="btn-primary flex-1"
              disabled={!canContinueName}
              onClick={() => {
                sfx.click();
                setStep('age');
              }}
            >
              Lanjut →
            </button>
          </div>
        </motion.div>
      )}

      {step === 'age' && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="card flex w-full flex-col gap-4"
        >
          <h2 className="font-display text-2xl font-bold text-slate-800">
            Halo {trimmed}! Berapa umurmu? 🎂
          </h2>
          <p className="text-sm text-slate-600">
            Soal akan disesuaikan dengan umurmu supaya pas dan seru!
          </p>
          <div className="grid grid-cols-3 gap-3">
            {AGE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  sfx.click();
                  setAge(opt.value);
                }}
                className={`rounded-2xl py-3 font-display text-2xl font-bold shadow transition-all
                  ${
                    age === opt.value
                      ? 'bg-primary-500 text-white scale-105'
                      : 'bg-white text-slate-700 hover:bg-primary-50'
                  }`}
                aria-pressed={age === opt.value}
                aria-label={`Umur ${opt.label} tahun`}
              >
                {opt.label}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              className="btn-ghost flex-1"
              onClick={() => setStep('name')}
            >
              Kembali
            </button>
            <button
              type="button"
              className="btn-primary flex-1"
              disabled={age === null}
              onClick={handleSubmit}
            >
              Yuk Mulai! 🎉
            </button>
          </div>
        </motion.div>
      )}
    </main>
  );
}
