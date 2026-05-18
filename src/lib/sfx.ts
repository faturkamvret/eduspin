'use client';

// Lightweight SFX engine using Web Audio API.
// We synthesize short tones so the MVP needs zero audio assets.
// All voices are stylized — designed to feel cute & kid-friendly, not realistic.

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

/** Pitch-glide tone — useful for animal calls. */
function glide(
  c: AudioContext,
  startAt: number,
  fromHz: number,
  toHz: number,
  durMs: number,
  type: OscillatorType = 'triangle',
  gain = 0.15,
  filterHz?: number,
) {
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(fromHz, startAt);
  osc.frequency.exponentialRampToValueAtTime(Math.max(20, toHz), startAt + durMs / 1000);
  g.gain.setValueAtTime(0, startAt);
  g.gain.linearRampToValueAtTime(gain, startAt + 0.04);
  g.gain.linearRampToValueAtTime(0, startAt + durMs / 1000);

  if (filterHz) {
    const f = c.createBiquadFilter();
    f.type = 'lowpass';
    f.frequency.setValueAtTime(filterHz, startAt);
    osc.connect(f).connect(g).connect(c.destination);
  } else {
    osc.connect(g).connect(c.destination);
  }
  osc.start(startAt);
  osc.stop(startAt + durMs / 1000 + 0.05);
}

/** Short white-noise burst (e.g. duck, cymbal, "shh"). */
function noiseBurst(c: AudioContext, startAt: number, durMs: number, gain = 0.1, filterHz = 1500) {
  const sr = c.sampleRate;
  const len = Math.floor((sr * durMs) / 1000);
  const buf = c.createBuffer(1, len, sr);
  const data = buf.getChannelData(0);
  for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
  const src = c.createBufferSource();
  src.buffer = buf;
  const f = c.createBiquadFilter();
  f.type = 'lowpass';
  f.frequency.setValueAtTime(filterHz, startAt);
  const g = c.createGain();
  g.gain.setValueAtTime(0, startAt);
  g.gain.linearRampToValueAtTime(gain, startAt + 0.01);
  g.gain.linearRampToValueAtTime(0, startAt + durMs / 1000);
  src.connect(f).connect(g).connect(c.destination);
  src.start(startAt);
  src.stop(startAt + durMs / 1000 + 0.02);
}

let mutedRef = false;

export function setMuted(m: boolean): void {
  mutedRef = m;
}

export const sfx = {
  // ─────── UI feedback ───────
  correct(): void {
    if (mutedRef) return;
    const c = getCtx();
    if (!c) return;
    const t = c.currentTime;
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
  /** Subtle bouncy "pop" — for option select before the right/wrong reveal. */
  pop(): void {
    if (mutedRef) return;
    const c = getCtx();
    if (!c) return;
    glide(c, c.currentTime, 600, 1100, 90, 'sine', 0.12);
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
  reveal(): void {
    if (mutedRef) return;
    const c = getCtx();
    if (!c) return;
    const t = c.currentTime;
    tone(c, t, { freq: 440, durationMs: 80, type: 'triangle' });
    tone(c, t + 0.08, { freq: 587.33, durationMs: 80, type: 'triangle' });
    tone(c, t + 0.16, { freq: 880, durationMs: 200, type: 'triangle' });
  },

  // ─────── Animal voices ───────
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
    glide(c, c.currentTime, 700, 450, 380, 'triangle', 0.16);
  },
  chirp(): void {
    if (mutedRef) return;
    const c = getCtx();
    if (!c) return;
    const t = c.currentTime;
    tone(c, t, { freq: 2000, durationMs: 60, type: 'sine', gain: 0.08 });
    tone(c, t + 0.07, { freq: 2400, durationMs: 60, type: 'sine', gain: 0.08 });
  },
  /** Bear growl — low sawtooth glide + vibrato. */
  bearGrowl(): void {
    if (mutedRef) return;
    const c = getCtx();
    if (!c) return;
    const t = c.currentTime;
    const dur = 0.7;
    const osc = c.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(140, t);
    osc.frequency.exponentialRampToValueAtTime(70, t + dur);
    const vibrato = c.createOscillator();
    vibrato.type = 'sine';
    vibrato.frequency.setValueAtTime(8, t);
    const vibratoGain = c.createGain();
    vibratoGain.gain.setValueAtTime(12, t);
    vibrato.connect(vibratoGain).connect(osc.frequency);
    const filter = c.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(900, t);
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
  /** Lion roar — beefier than bear. */
  lionRoar(): void {
    if (mutedRef) return;
    const c = getCtx();
    if (!c) return;
    const t = c.currentTime;
    glide(c, t, 220, 90, 800, 'sawtooth', 0.22, 600);
    glide(c, t + 0.05, 110, 60, 800, 'sawtooth', 0.18, 400);
  },
  /** Cow moo. */
  moo(): void {
    if (mutedRef) return;
    const c = getCtx();
    if (!c) return;
    glide(c, c.currentTime, 180, 110, 600, 'sawtooth', 0.18, 700);
  },
  /** Duck quack — noise burst + low square. */
  quack(): void {
    if (mutedRef) return;
    const c = getCtx();
    if (!c) return;
    const t = c.currentTime;
    glide(c, t, 350, 280, 120, 'square', 0.14);
    glide(c, t + 0.13, 350, 250, 120, 'square', 0.14);
  },
  /** Frog ribbit — two short low pulses. */
  ribbit(): void {
    if (mutedRef) return;
    const c = getCtx();
    if (!c) return;
    const t = c.currentTime;
    tone(c, t, { freq: 180, durationMs: 100, type: 'square', gain: 0.18 });
    tone(c, t + 0.13, { freq: 220, durationMs: 140, type: 'square', gain: 0.18 });
  },
  /** Elephant trumpet. */
  elephant(): void {
    if (mutedRef) return;
    const c = getCtx();
    if (!c) return;
    glide(c, c.currentTime, 300, 700, 500, 'sawtooth', 0.16, 1200);
  },
  /** Horse neigh — quick descending triangle. */
  neigh(): void {
    if (mutedRef) return;
    const c = getCtx();
    if (!c) return;
    const t = c.currentTime;
    glide(c, t, 900, 500, 200, 'triangle', 0.14);
    glide(c, t + 0.18, 700, 350, 250, 'triangle', 0.14);
  },
  /** Whale song — slow, deep glide. */
  whaleSong(): void {
    if (mutedRef) return;
    const c = getCtx();
    if (!c) return;
    const t = c.currentTime;
    glide(c, t, 200, 80, 1200, 'sine', 0.18, 500);
    glide(c, t + 0.4, 130, 200, 800, 'sine', 0.12, 500);
  },
  /** Bee buzz. */
  buzz(): void {
    if (mutedRef) return;
    const c = getCtx();
    if (!c) return;
    const t = c.currentTime;
    const osc = c.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(200, t);
    const lfo = c.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(30, t);
    const lfoGain = c.createGain();
    lfoGain.gain.setValueAtTime(40, t);
    lfo.connect(lfoGain).connect(osc.frequency);
    const g = c.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.1, t + 0.05);
    g.gain.linearRampToValueAtTime(0, t + 0.5);
    osc.connect(g).connect(c.destination);
    osc.start(t);
    lfo.start(t);
    osc.stop(t + 0.55);
    lfo.stop(t + 0.55);
  },

  // ─────── Fantasy creatures ───────
  /** Dinosaur roar — bigger than lion. */
  dinoRoar(): void {
    if (mutedRef) return;
    const c = getCtx();
    if (!c) return;
    const t = c.currentTime;
    glide(c, t, 180, 50, 1100, 'sawtooth', 0.25, 500);
    glide(c, t + 0.1, 90, 40, 1100, 'sawtooth', 0.18, 350);
  },
  /** Dragon roar — fierier with metallic top end. */
  dragonRoar(): void {
    if (mutedRef) return;
    const c = getCtx();
    if (!c) return;
    const t = c.currentTime;
    glide(c, t, 160, 60, 1000, 'sawtooth', 0.22, 600);
    tone(c, t, { freq: 1400, durationMs: 600, type: 'sawtooth', gain: 0.06 });
  },
  /** Phoenix cry — bright, ascending. */
  phoenixCry(): void {
    if (mutedRef) return;
    const c = getCtx();
    if (!c) return;
    const t = c.currentTime;
    glide(c, t, 800, 1800, 500, 'triangle', 0.14);
    glide(c, t + 0.4, 1400, 2400, 400, 'triangle', 0.1);
  },
  /** Unicorn neigh — magical glittery overlay. */
  unicornNeigh(): void {
    if (mutedRef) return;
    const c = getCtx();
    if (!c) return;
    const t = c.currentTime;
    glide(c, t, 900, 500, 200, 'triangle', 0.14);
    tone(c, t + 0.05, { freq: 1760, durationMs: 80, type: 'sine', gain: 0.06 });
    tone(c, t + 0.15, { freq: 2349, durationMs: 80, type: 'sine', gain: 0.06 });
    tone(c, t + 0.25, { freq: 2637, durationMs: 100, type: 'sine', gain: 0.06 });
  },
  /** Mermaid song — gentle aquatic. */
  mermaidSong(): void {
    if (mutedRef) return;
    const c = getCtx();
    if (!c) return;
    const t = c.currentTime;
    [523.25, 659.25, 783.99, 880, 783.99].forEach((f, i) =>
      tone(c, t + i * 0.14, { freq: f, durationMs: 220, type: 'sine', gain: 0.1 }),
    );
  },
  /** Fairy chime — sparkly bells. */
  fairyChime(): void {
    if (mutedRef) return;
    const c = getCtx();
    if (!c) return;
    const t = c.currentTime;
    [1568, 2093, 2637, 3136].forEach((f, i) =>
      tone(c, t + i * 0.05, { freq: f, durationMs: 250, type: 'sine', gain: 0.08, releaseMs: 200 }),
    );
  },
  /** Goofy slime monster — wet/wobbly. */
  monsterGoo(): void {
    if (mutedRef) return;
    const c = getCtx();
    if (!c) return;
    const t = c.currentTime;
    glide(c, t, 200, 80, 250, 'square', 0.14);
    glide(c, t + 0.2, 120, 300, 250, 'square', 0.14);
    glide(c, t + 0.4, 200, 90, 250, 'square', 0.14);
  },
  /** Friendly monster growl — softer, comical. */
  monsterFriendly(): void {
    if (mutedRef) return;
    const c = getCtx();
    if (!c) return;
    const t = c.currentTime;
    glide(c, t, 180, 100, 400, 'sawtooth', 0.16, 700);
  },

  // ─────── Vehicles & toys ───────
  /** Robot beep boop. */
  robotBeep(): void {
    if (mutedRef) return;
    const c = getCtx();
    if (!c) return;
    const t = c.currentTime;
    tone(c, t, { freq: 880, durationMs: 100, type: 'square', gain: 0.1 });
    tone(c, t + 0.12, { freq: 660, durationMs: 100, type: 'square', gain: 0.1 });
    tone(c, t + 0.24, { freq: 1320, durationMs: 120, type: 'square', gain: 0.1 });
  },
  /** Race-car vroom. */
  carVroom(): void {
    if (mutedRef) return;
    const c = getCtx();
    if (!c) return;
    const t = c.currentTime;
    glide(c, t, 120, 380, 800, 'sawtooth', 0.18, 800);
  },
  /** Rocket whoosh. */
  rocketWhoosh(): void {
    if (mutedRef) return;
    const c = getCtx();
    if (!c) return;
    noiseBurst(c, c.currentTime, 700, 0.16, 1200);
    glide(c, c.currentTime, 200, 1500, 700, 'sawtooth', 0.06);
  },
  /** Plane swoosh — softer than rocket. */
  planeSwoosh(): void {
    if (mutedRef) return;
    const c = getCtx();
    if (!c) return;
    noiseBurst(c, c.currentTime, 500, 0.1, 800);
  },
  /** Whistle — generic toy whistle. */
  whistle(): void {
    if (mutedRef) return;
    const c = getCtx();
    if (!c) return;
    glide(c, c.currentTime, 1500, 1900, 250, 'sine', 0.1);
  },

  // ─────── Foods & misc ───────
  /** Crunchy bite — for fruit/snack collectibles. */
  crunch(): void {
    if (mutedRef) return;
    const c = getCtx();
    if (!c) return;
    noiseBurst(c, c.currentTime, 80, 0.16, 2500);
  },
  /** Yummy "mmm" — sweet treat. */
  yummy(): void {
    if (mutedRef) return;
    const c = getCtx();
    if (!c) return;
    glide(c, c.currentTime, 500, 700, 200, 'triangle', 0.12);
    glide(c, c.currentTime + 0.18, 700, 900, 200, 'triangle', 0.12);
  },
  /** Magic sparkle — for stars/crowns. */
  sparkle(): void {
    if (mutedRef) return;
    const c = getCtx();
    if (!c) return;
    const t = c.currentTime;
    [1760, 2349, 2637].forEach((f, i) =>
      tone(c, t + i * 0.05, { freq: f, durationMs: 120, type: 'sine', gain: 0.08 }),
    );
  },
  /** Cheer — generic playful "yay". */
  yay(): void {
    if (mutedRef) return;
    const c = getCtx();
    if (!c) return;
    const t = c.currentTime;
    tone(c, t, { freq: 660, durationMs: 100, type: 'triangle' });
    tone(c, t + 0.1, { freq: 880, durationMs: 200, type: 'triangle' });
  },
};

/**
 * Map a collectible id (or category) to an appropriate SFX.
 * The id-based mapping wins; category is the fallback.
 */
export function playCollectibleSfx(collectibleId: string, category?: string): void {
  if (mutedRef) return;
  const id = collectibleId.toLowerCase();

  // ─── Specific id matches first ───
  // Bears & bear-likes
  if (id.includes('bear') || id.includes('teddy') || id === 'panda') return sfx.bearGrowl();
  // Dinosaurs
  if (id.includes('dino') || id.includes('trex')) return sfx.dinoRoar();
  // Dragons & rainbow-dragon
  if (id.includes('dragon') || id.includes('drako')) return sfx.dragonRoar();
  // Phoenix
  if (id.includes('phoenix')) return sfx.phoenixCry();
  // Unicorn / pony
  if (id.includes('unicorn') || id.includes('pony') || id.includes('horse')) {
    return sfx.unicornNeigh();
  }
  // Mermaid
  if (id.includes('mermaid')) return sfx.mermaidSong();
  // Fairy
  if (id.includes('fairy') || id.includes('peri')) return sfx.fairyChime();
  // Star / crown — sparkle
  if (id.includes('star') || id.includes('crown')) return sfx.sparkle();
  // Whale (incl. cosmic-whale)
  if (id.includes('whale')) return sfx.whaleSong();
  // Cat-likes (but not astro-cat → that's space/sparkle)
  if (id.includes('astro')) return sfx.sparkle();
  if (id.includes('cat')) return sfx.meow();
  // Dog
  if (id.includes('dog')) return sfx.bark();
  // Bird-ish, fish
  if (id.includes('fish') || id.includes('bird')) return sfx.chirp();
  // Bee
  if (id.includes('bee')) return sfx.buzz();
  // Frog
  if (id.includes('frog') || id.includes('katak')) return sfx.ribbit();
  // Cow
  if (id.includes('cow') || id.includes('sapi')) return sfx.moo();
  // Lion
  if (id.includes('lion') || id.includes('singa')) return sfx.lionRoar();
  // Elephant
  if (id.includes('elephant') || id.includes('gajah')) return sfx.elephant();
  // Duck
  if (id.includes('duck') || id.includes('bebek')) return sfx.quack();
  // Rabbit / kelinci — soft chirp
  if (id.includes('rabbit') || id.includes('kelinci')) return sfx.pop();
  // Fox / panda
  if (id.includes('fox') || id.includes('rubah')) return sfx.yay();
  // Robot
  if (id.includes('robot') || id.includes('bot')) return sfx.robotBeep();
  // Car
  if (id.includes('car') || id.includes('mobil')) return sfx.carVroom();
  // Rocket
  if (id.includes('rocket') || id.includes('roket')) return sfx.rocketWhoosh();
  // Plane / pesawat
  if (id.includes('plane') || id.includes('pesawat')) return sfx.planeSwoosh();
  // Soccer ball
  if (id.includes('ball') || id.includes('bola')) return sfx.whistle();
  // Slime / monster
  if (id.includes('gloop') || id.includes('slime')) return sfx.monsterGoo();
  if (id.includes('monster') || id.includes('mochi')) return sfx.monsterFriendly();
  // Butterfly / kupu
  if (id.includes('butterfly') || id.includes('kupu')) return sfx.fairyChime();
  // Flower / bunga / cupcake / ice-cream / apple — yummy/sparkle
  if (id.includes('flower') || id.includes('rose') || id.includes('bunga')) return sfx.sparkle();
  if (
    id.includes('cupcake') ||
    id.includes('ice') ||
    id.includes('cream') ||
    id.includes('apple') ||
    id.includes('apel')
  ) {
    return sfx.yummy();
  }

  // ─── Category fallback ───
  if (category === 'animal') return sfx.meow();
  if (category === 'dinosaur') return sfx.dinoRoar();
  if (category === 'fantasy') return sfx.fairyChime();
  if (category === 'robot') return sfx.robotBeep();
  if (category === 'fruit' || category === 'food') return sfx.yummy();

  return sfx.click();
}

/**
 * Map a quiz audio cue keyword to an SFX.
 * Used by questions that have an `audioCue` field — auto-played when the
 * question appears so the child can hear "what does a dog say?" etc.
 *
 * For animal cues we now play REAL recorded sounds (CC0 / public domain OGG
 * files stored in /public/sounds/animals/). Fantasy/synthetic cues still use
 * the Web Audio synthesizer as a fallback.
 */
export type AudioCue =
  | 'bark'
  | 'meow'
  | 'moo'
  | 'quack'
  | 'ribbit'
  | 'chirp'
  | 'lionRoar'
  | 'elephant'
  | 'neigh'
  | 'buzz'
  | 'whaleSong'
  | 'dinoRoar'
  | 'dragonRoar'
  | 'phoenixCry'
  | 'sparkle'
  | 'bearGrowl';

/**
 * Mapping from AudioCue → real audio file path (relative to /public).
 * Cues without a file entry will fallback to synthesized SFX.
 */
const REAL_AUDIO_FILES: Partial<Record<AudioCue, string>> = {
  bark: '/sounds/animals/dog-bark.ogg',
  meow: '/sounds/animals/cat-meow.ogg',
  moo: '/sounds/animals/cow-moo.ogg',
  quack: '/sounds/animals/duck-quack.ogg',
  ribbit: '/sounds/animals/frog-croak.ogg',
  chirp: '/sounds/animals/bird-chirp.ogg',
  lionRoar: '/sounds/animals/lion-roar.ogg',
  elephant: '/sounds/animals/elephant-trumpet.ogg',
  neigh: '/sounds/animals/horse-neigh.ogg',
  buzz: '/sounds/animals/bee-buzz.ogg',
  whaleSong: '/sounds/animals/whale-song.ogg',
  bearGrowl: '/sounds/animals/bear-growl.ogg',
};

/** Cache of HTMLAudioElement instances so we don't create new ones every play. */
const audioCache: Partial<Record<AudioCue, HTMLAudioElement>> = {};

/**
 * Play a real recorded audio file. Returns true if playback started
 * successfully, false otherwise (so the caller can fallback to synth).
 */
function playRealAudio(cue: AudioCue): boolean {
  if (typeof window === 'undefined') return false;
  const src = REAL_AUDIO_FILES[cue];
  if (!src) return false;

  try {
    let audio = audioCache[cue];
    if (!audio) {
      audio = new Audio(src);
      audio.preload = 'auto';
      audioCache[cue] = audio;
    }
    // Reset to beginning if already playing
    audio.currentTime = 0;
    audio.volume = 0.8;
    audio.play().catch(() => {
      // Autoplay blocked — silently ignore; user will tap the 🔊 button again
    });
    return true;
  } catch {
    return false;
  }
}

/** Synthesizer fallback map for cues without real audio files. */
const SYNTH_FALLBACK: Record<AudioCue, () => void> = {
  bark: sfx.bark,
  meow: sfx.meow,
  moo: sfx.moo,
  quack: sfx.quack,
  ribbit: sfx.ribbit,
  chirp: sfx.chirp,
  lionRoar: sfx.lionRoar,
  elephant: sfx.elephant,
  neigh: sfx.neigh,
  buzz: sfx.buzz,
  whaleSong: sfx.whaleSong,
  dinoRoar: sfx.dinoRoar,
  dragonRoar: sfx.dragonRoar,
  phoenixCry: sfx.phoenixCry,
  sparkle: sfx.sparkle,
  bearGrowl: sfx.bearGrowl,
};

/**
 * Play an audio cue — tries real recorded sound first, falls back to
 * synthesized SFX if no file is available or playback fails.
 */
export function playAudioCue(cue: AudioCue): void {
  if (mutedRef) return;
  // Try real audio first
  const played = playRealAudio(cue);
  if (played) return;
  // Fallback to synthesized version
  SYNTH_FALLBACK[cue]?.();
}
