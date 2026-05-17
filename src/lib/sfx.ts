'use client';

// Lightweight SFX engine using Web Audio API.
// We synthesize short tones so the MVP needs zero audio assets.
// Future: replace with real CC0 SFX files for animal sounds, etc.

let ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (ctx && ctx.state !== 'closed') return ctx;
  const AC =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AC) return null;
  ctx = new AC();
  return ctx;
}

interface ToneOpts {
  freq: number;
  durationMs: number;
  type?: OscillatorType;
  gain?: number;
  attackMs?: number;
  releaseMs?: number;
}

function tone(
  c: AudioContext,
  startAt: number,
  { freq, durationMs, type = 'sine', gain = 0.15, attackMs = 8, releaseMs = 80 }: ToneOpts,
) {
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, startAt);

  const dur = durationMs / 1000;
  const attack = attackMs / 1000;
  const release = releaseMs / 1000;

  g.gain.setValueAtTime(0, startAt);
  g.gain.linearRampToValueAtTime(gain, startAt + attack);
  g.gain.setValueAtTime(gain, startAt + Math.max(0, dur - release));
  g.gain.linearRampToValueAtTime(0, startAt + dur);

  osc.connect(g).connect(c.destination);
  osc.start(startAt);
  osc.stop(startAt + dur + 0.05);
}

let mutedRef = false;

export function setMuted(m: boolean): void {
  mutedRef = m;
}

export const sfx = {
  correct(): void {
    if (mutedRef) return;
    const c = getCtx();
    if (!c) return;
    const t = c.currentTime;
    // Two ascending notes (C5 → E5)
    tone(c, t, { freq: 523.25, durationMs: 120, type: 'triangle' });
    tone(c, t + 0.12, { freq: 659.25, durationMs: 180, type: 'triangle' });
  },
  wrong(): void {
    if (mutedRef) return;
    const c = getCtx();
    if (!c) return;
    const t = c.currentTime;
    tone(c, t, { freq: 220, durationMs: 200, type: 'sawtooth', gain: 0.08 });
  },
  coin(): void {
    if (mutedRef) return;
    const c = getCtx();
    if (!c) return;
    const t = c.currentTime;
    tone(c, t, { freq: 988, durationMs: 80, type: 'square', gain: 0.06 });
    tone(c, t + 0.08, { freq: 1318.5, durationMs: 100, type: 'square', gain: 0.06 });
  },
  click(): void {
    if (mutedRef) return;
    const c = getCtx();
    if (!c) return;
    tone(c, c.currentTime, { freq: 800, durationMs: 50, type: 'sine', gain: 0.05 });
  },
  fanfare(): void {
    if (mutedRef) return;
    const c = getCtx();
    if (!c) return;
    const t = c.currentTime;
    [523.25, 659.25, 783.99, 1046.5].forEach((f, i) =>
      tone(c, t + i * 0.1, { freq: f, durationMs: 180, type: 'triangle', gain: 0.12 }),
    );
  },
  // Simple stylized animal vocalizations
  bark(): void {
    if (mutedRef) return;
    const c = getCtx();
    if (!c) return;
    const t = c.currentTime;
    tone(c, t, { freq: 240, durationMs: 90, type: 'sawtooth', gain: 0.18 });
    tone(c, t + 0.12, { freq: 200, durationMs: 90, type: 'sawtooth', gain: 0.18 });
  },
  meow(): void {
    if (mutedRef) return;
    const c = getCtx();
    if (!c) return;
    const t = c.currentTime;
    const osc = c.createOscillator();
    const g = c.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(700, t);
    osc.frequency.exponentialRampToValueAtTime(450, t + 0.35);
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.16, t + 0.05);
    g.gain.linearRampToValueAtTime(0, t + 0.45);
    osc.connect(g).connect(c.destination);
    osc.start(t);
    osc.stop(t + 0.5);
  },
  chirp(): void {
    if (mutedRef) return;
    const c = getCtx();
    if (!c) return;
    const t = c.currentTime;
    tone(c, t, { freq: 2000, durationMs: 60, type: 'sine', gain: 0.08 });
    tone(c, t + 0.07, { freq: 2400, durationMs: 60, type: 'sine', gain: 0.08 });
  },
  reveal(): void {
    if (mutedRef) return;
    const c = getCtx();
    if (!c) return;
    const t = c.currentTime;
    tone(c, t, { freq: 440, durationMs: 80, type: 'triangle' });
    tone(c, t + 0.08, { freq: 587.33, durationMs: 80, type: 'triangle' });
    tone(c, t + 0.16, { freq: 880, durationMs: 200, type: 'triangle' });
  },
  /**
   * Stylized bear growl — low sawtooth with downward pitch sweep + slow vibrato.
   * Synthesized from oscillators only, no audio assets required.
   */
  bearGrowl(): void {
    if (mutedRef) return;
    const c = getCtx();
    if (!c) return;
    const t = c.currentTime;
    const dur = 0.7;

    // Main growl oscillator (low, raspy).
    const osc = c.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(140, t);
    osc.frequency.exponentialRampToValueAtTime(70, t + dur);

    // Slow vibrato to give it a natural rumble.
    const vibrato = c.createOscillator();
    vibrato.type = 'sine';
    vibrato.frequency.setValueAtTime(8, t);
    const vibratoGain = c.createGain();
    vibratoGain.gain.setValueAtTime(12, t);
    vibrato.connect(vibratoGain).connect(osc.frequency);

    // Lowpass to soften the harshness.
    const filter = c.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(900, t);

    // Amp envelope.
    const g = c.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.22, t + 0.05);
    g.gain.linearRampToValueAtTime(0.18, t + dur - 0.15);
    g.gain.linearRampToValueAtTime(0, t + dur);

    osc.connect(filter).connect(g).connect(c.destination);
    osc.start(t);
    vibrato.start(t);
    osc.stop(t + dur + 0.05);
    vibrato.stop(t + dur + 0.05);
  },
};

/** Map a collectible id (or category) to an appropriate SFX. */
export function playCollectibleSfx(collectibleId: string, category?: string): void {
  if (mutedRef) return;
  if (collectibleId.includes('cat') && !collectibleId.includes('astro')) return sfx.meow();
  if (collectibleId.includes('dog')) return sfx.bark();
  if (collectibleId.includes('fish')) return sfx.chirp();
  if (collectibleId.includes('bird') || collectibleId.includes('phoenix')) return sfx.chirp();
  if (category === 'animal') return sfx.meow();
  return sfx.click();
}
