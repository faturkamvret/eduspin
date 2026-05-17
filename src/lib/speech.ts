'use client';

/**
 * Text-to-Speech wrapper using Web Speech API.
 *
 * Designed for kids who can't read yet — auto-reads quiz prompts and
 * encouragement phrases in Bahasa Indonesia.
 *
 * Falls back silently when:
 *  - Running on the server (no `window`)
 *  - Browser doesn't support speechSynthesis (older Android WebViews)
 *  - User is muted via app settings
 */

let muted = false;
/** Voice cache keyed by language. Filled lazily on first speak call. */
let cachedVoiceId: string | null | undefined = undefined;

export function setSpeechMuted(m: boolean): void {
  muted = m;
  if (m && typeof window !== 'undefined') {
    window.speechSynthesis?.cancel();
  }
}

function pickIndonesianVoice(): SpeechSynthesisVoice | null {
  if (typeof window === 'undefined') return null;
  const synth = window.speechSynthesis;
  if (!synth) return null;
  const voices = synth.getVoices();
  if (voices.length === 0) return null;

  // Prefer Indonesian voices; fall back to default. Many devices ship at least
  // one id-ID voice (Google/Samsung). If not, use any non-English-sounding one
  // — we'd rather mispronounce than not speak at all.
  const id =
    voices.find((v) => v.lang === 'id-ID') ??
    voices.find((v) => v.lang.toLowerCase().startsWith('id')) ??
    voices.find((v) => v.default) ??
    voices[0]!;
  return id;
}

interface SpeakOptions {
  /** 0.5 = slow, 1 = normal, 2 = fast. Default 0.95 for kid-friendly pacing. */
  rate?: number;
  /** 0 = low, 1 = normal, 2 = high. Default 1.1 for cheerful tone. */
  pitch?: number;
  /** 0..1 — relative loudness. Default 1. */
  volume?: number;
  /** Cancel any utterance currently speaking before starting. Default true. */
  interrupt?: boolean;
}

/**
 * Speak the given text in Bahasa Indonesia. Cancels prior utterance by default
 * so calling this rapidly (e.g. on page transition) doesn't stack a queue.
 */
export function speak(text: string, opts: SpeakOptions = {}): void {
  if (muted) return;
  if (typeof window === 'undefined') return;
  const synth = window.speechSynthesis;
  if (!synth) return;
  if (!text.trim()) return;

  const { rate = 0.95, pitch = 1.1, volume = 1, interrupt = true } = opts;
  if (interrupt) synth.cancel();

  // Voice list is populated asynchronously on some browsers.
  const speakNow = () => {
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'id-ID';
    u.rate = rate;
    u.pitch = pitch;
    u.volume = volume;
    const voice = pickIndonesianVoice();
    if (voice) {
      u.voice = voice;
      cachedVoiceId = voice.voiceURI;
    } else {
      cachedVoiceId = null;
    }
    synth.speak(u);
  };

  // If voices not loaded yet, wait for them once.
  if (synth.getVoices().length === 0 && cachedVoiceId === undefined) {
    const handler = () => {
      synth.removeEventListener('voiceschanged', handler);
      speakNow();
    };
    synth.addEventListener('voiceschanged', handler);
    // Failsafe: try anyway after 400ms even if voices never loaded.
    setTimeout(speakNow, 400);
    return;
  }
  speakNow();
}

/** Stop whatever is currently being spoken. */
export function stopSpeaking(): void {
  if (typeof window === 'undefined') return;
  window.speechSynthesis?.cancel();
}

/**
 * True when the device has any speechSynthesis API available. Use this to
 * hide UI affordances on unsupported devices.
 */
export function isSpeechSupported(): boolean {
  if (typeof window === 'undefined') return false;
  return typeof window.speechSynthesis !== 'undefined';
}

// ─── Pre-canned encouragement phrases ───
// Kept short and varied so the same kid doesn't hear the same line back-to-back.

const CHEERS = [
  'Hebat!',
  'Pintar sekali!',
  'Wow, keren!',
  'Yeay! Benar!',
  'Bagus banget!',
  'Mantap!',
  'Hore, betul!',
];

const ENCOURAGE = [
  'Tidak apa-apa, coba lagi ya.',
  'Hampir benar! Coba sekali lagi.',
  'Yuk, kita coba lagi.',
  'Tetap semangat ya!',
];

export function speakCheer(): void {
  if (muted) return;
  speak(CHEERS[Math.floor(Math.random() * CHEERS.length)]!, {
    pitch: 1.3,
    rate: 1.05,
  });
}

export function speakEncouragement(): void {
  if (muted) return;
  speak(ENCOURAGE[Math.floor(Math.random() * ENCOURAGE.length)]!, {
    pitch: 1.0,
    rate: 0.95,
  });
}
