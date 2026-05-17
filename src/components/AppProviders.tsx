'use client';

import { useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { TapBurstProvider } from './TapBurst';
import { FlyingCoinProvider } from './FlyingCoin';
import { setBgmEnabled } from '@/lib/bgm';
import { setSpeechMuted } from '@/lib/speech';
import { setMuted as setSfxMuted } from '@/lib/sfx';

/**
 * Top-level client providers mounted once for the whole app:
 *  - Global tap-burst particle layer
 *  - Flying-coin animation layer
 *  - BGM controller that follows the persisted setting
 *  - Mute synchronization across SFX and TTS engines
 *
 * Browsers require a user gesture before audio can play, so when the page
 * first loads with BGM enabled we attach a one-shot pointerdown listener
 * that starts BGM on the first interaction.
 */
export function AppProviders({ children }: { children: React.ReactNode }) {
  const hydrated = useAppStore((s) => s.hydrated);
  const muted = useAppStore((s) => s.settings.muted);
  const bgmEnabled = useAppStore((s) => s.settings.bgmEnabled ?? false);

  // Apply mute to SFX + TTS engines whenever the toggle changes.
  useEffect(() => {
    setSfxMuted(muted);
    setSpeechMuted(muted);
  }, [muted]);

  // Start/stop BGM when the user setting changes (post-hydration only).
  useEffect(() => {
    if (!hydrated) return;
    if (bgmEnabled && !muted) {
      // Defer until first user gesture — browsers block audio otherwise.
      const start = () => {
        setBgmEnabled(true);
        window.removeEventListener('pointerdown', start);
        window.removeEventListener('keydown', start);
      };
      window.addEventListener('pointerdown', start, { once: true });
      window.addEventListener('keydown', start, { once: true });
      return () => {
        window.removeEventListener('pointerdown', start);
        window.removeEventListener('keydown', start);
      };
    } else {
      setBgmEnabled(false);
    }
  }, [hydrated, bgmEnabled, muted]);

  return (
    <>
      {children}
      <TapBurstProvider />
      <FlyingCoinProvider />
    </>
  );
}
