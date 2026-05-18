'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';
import { HydrationGate } from '@/components/HydrationGate';
import { Mascot } from '@/components/Mascot';
import { Confetti } from '@/components/Confetti';
import { FloatingDeco } from '@/components/FloatingDeco';
import { sfx } from '@/lib/sfx';
import type { Gender } from '@/types';

const AGE_OPTIONS = [
  { value: 1, label: '1', emoji: '🍼' },
  { value: 2, label: '2', emoji: '🧸' },
  { value: 3, label: '3', emoji: '🎈' },
  { value: 4, label: '4', emoji: '🧩' },
  { value: 5, label: '5', emoji: '🎨' },
  { value: 6, label: '6+', emoji: '🚀' },
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

  const [step, setStep] = useState<'welcome' | 'name' | 'gender' | 'age'>(
    existing ? 'name' : 'welcome',
  );
  const [nickname, setNickname] = useState(existing?.nickname ?? '');
  const [gender, setGender] = useState<Gender | null>(existing?.gender ?? null);
  const [age, setAge] = useState<number | null>(existing?.age ?? null);
  const [confetti, setConfetti] = useState(false);

  const trimmed = nickname.trim();
  const canContinueName = trimmed.length >= 1 && trimmed.length <= 20;

  function handleSubmit() {
    if (!canContinueName || gender === null || age === null) return;
    setProfile(trimmed, age, gender);
    sfx.fanfare();
    setConfetti(true);
    setTimeout(() => router.replace('/home'), 800);
  }

  return (
    <main className="relative flex flex-1 flex-col items-center justify-center gap-6 px-6 py-8">
      <FloatingDeco count={16} />
      <Confetti show={confetti} count={60} />

      <AnimatePresence mode="wait">
        {step === 'welcome' && (
          <motion.div
            key="welcome"
            initial={{ opacity: 0, scale: 0.85, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: -20 }}
            transition={{ type: 'spring', damping: 14 }}
            className="card flex flex-col items-center gap-4 text-center"
          >
            <Mascot mood="happy" size="text-8xl" bubble="Halo!" />
            <h1 className="font-display text-4xl font-extrabold text-rainbow drop-shadow">
              Selamat Datang!
            </h1>
            <p className="font-display text-lg font-bold text-slate-700">
              di <span className="text-primary-500">Squizzy</span> 🎡
            </p>
            <p className="text-sm font-semibold text-slate-600">
              Jawab kuis seru, kumpulkan koin, lalu dapatkan{' '}
              <span className="font-extrabold text-accent-600">
                koleksi karakter lucu
              </span>
              ! 🐶🐱🦄
            </p>
            <button
              type="button"
              className="btn-primary mt-2 w-full text-xl"
              onClick={() => {
                sfx.click();
                setStep('name');
              }}
            >
              Mulai Petualangan! ✨
            </button>
            <p className="mt-1 text-xs text-slate-500">
              💖 Gratis · Tanpa iklan · Aman untuk anak
            </p>
          </motion.div>
        )}

        {step === 'name' && (
          <motion.div
            key="name"
            initial={{ opacity: 0, x: 32 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -32 }}
            transition={{ type: 'spring', damping: 16 }}
            className="card flex w-full max-w-sm flex-col gap-4"
          >
            <div className="flex flex-col items-center gap-2">
              <Mascot mood="cheer" bubble="Siapa namamu?" />
            </div>
            <h2 className="text-center font-display text-2xl font-extrabold text-slate-800">
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
              className="rounded-3xl border-4 border-primary-200 bg-white px-5 py-4 text-center font-display text-2xl font-bold text-slate-800
                         outline-none transition-all focus:border-primary-400 focus:scale-[1.02]"
            />
            <p className="text-center text-xs font-semibold text-slate-500">
              Cukup nama panggilan saja, ya 💖
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                className="btn-ghost flex-1"
                onClick={() => {
                  sfx.click();
                  setStep('welcome');
                }}
              >
                ← Kembali
              </button>
              <button
                type="button"
                className="btn-primary flex-1"
                disabled={!canContinueName}
                onClick={() => {
                  sfx.click();
                  setStep('gender');
                }}
              >
                Lanjut →
              </button>
            </div>
          </motion.div>
        )}

        {step === 'gender' && (
          <motion.div
            key="gender"
            initial={{ opacity: 0, x: 32 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -32 }}
            transition={{ type: 'spring', damping: 16 }}
            className="card flex w-full max-w-sm flex-col gap-4"
          >
            <div className="flex flex-col items-center gap-2">
              <Mascot mood="happy" bubble={`Halo ${trimmed}!`} />
            </div>
            <h2 className="text-center font-display text-2xl font-extrabold text-slate-800">
              Kamu anak...? 🌟
            </h2>
            <p className="text-center text-sm font-semibold text-slate-600">
              Hadiah akan disesuaikan untukmu!
            </p>
            <div className="grid grid-cols-2 gap-4">
              <motion.button
                type="button"
                whileTap={{ scale: 0.92 }}
                whileHover={{ scale: 1.05 }}
                onClick={() => {
                  sfx.click();
                  setGender('boy');
                }}
                className={`flex flex-col items-center gap-2 rounded-4xl py-6 font-display shadow-kid transition-all ${
                  gender === 'boy'
                    ? 'scale-105 ring-4 ring-sky-400'
                    : 'bg-white hover:bg-sky-50'
                }`}
                style={
                  gender === 'boy'
                    ? { background: 'linear-gradient(135deg, #bae3ff 0%, #7dd3fc 50%, #38bdf8 100%)' }
                    : undefined
                }
                aria-pressed={gender === 'boy'}
                aria-label="Laki-laki"
              >
                <span className="text-6xl drop-shadow" aria-hidden>
                  👦
                </span>
                <span className={`text-xl font-extrabold ${gender === 'boy' ? 'text-white' : 'text-slate-700'}`}>
                  Laki-laki
                </span>
              </motion.button>

              <motion.button
                type="button"
                whileTap={{ scale: 0.92 }}
                whileHover={{ scale: 1.05 }}
                onClick={() => {
                  sfx.click();
                  setGender('girl');
                }}
                className={`flex flex-col items-center gap-2 rounded-4xl py-6 font-display shadow-kid transition-all ${
                  gender === 'girl'
                    ? 'scale-105 ring-4 ring-pink-400'
                    : 'bg-white hover:bg-pink-50'
                }`}
                style={
                  gender === 'girl'
                    ? { background: 'linear-gradient(135deg, #ffc6d4 0%, #ff8fa3 50%, #ff5d7a 100%)' }
                    : undefined
                }
                aria-pressed={gender === 'girl'}
                aria-label="Perempuan"
              >
                <span className="text-6xl drop-shadow" aria-hidden>
                  👧
                </span>
                <span className={`text-xl font-extrabold ${gender === 'girl' ? 'text-white' : 'text-slate-700'}`}>
                  Perempuan
                </span>
              </motion.button>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                className="btn-ghost flex-1"
                onClick={() => {
                  sfx.click();
                  setStep('name');
                }}
              >
                ← Kembali
              </button>
              <button
                type="button"
                className="btn-primary flex-1"
                disabled={gender === null}
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
            key="age"
            initial={{ opacity: 0, x: 32 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -32 }}
            transition={{ type: 'spring', damping: 16 }}
            className="card flex w-full max-w-sm flex-col gap-4"
          >
            <div className="flex flex-col items-center gap-2">
              <Mascot mood="celebrate" bubble="Satu lagi!" />
            </div>
            <h2 className="text-center font-display text-2xl font-extrabold text-slate-800">
              Berapa umurmu? 🎂
            </h2>
            <p className="text-center text-sm font-semibold text-slate-600">
              Soal akan disesuaikan dengan umurmu ✨
            </p>
            <div className="grid grid-cols-3 gap-3">
              {AGE_OPTIONS.map((opt) => (
                <motion.button
                  key={opt.value}
                  type="button"
                  whileTap={{ scale: 0.92 }}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => {
                    sfx.click();
                    setAge(opt.value);
                  }}
                  className={`flex flex-col items-center gap-1 rounded-3xl py-4 font-display shadow-kid transition-all ${
                    age === opt.value
                      ? 'scale-105 bg-gradient-to-br from-primary-300 to-primary-500 text-white ring-4 ring-primary-200'
                      : 'bg-white text-slate-700 hover:bg-primary-50'
                  }`}
                  aria-pressed={age === opt.value}
                  aria-label={`Umur ${opt.label} tahun`}
                >
                  <span className="text-3xl drop-shadow" aria-hidden>
                    {opt.emoji}
                  </span>
                  <span className="text-2xl font-extrabold">{opt.label}</span>
                </motion.button>
              ))}
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                className="btn-ghost flex-1"
                onClick={() => {
                  sfx.click();
                  setStep('gender');
                }}
              >
                ← Kembali
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
      </AnimatePresence>
    </main>
  );
}
