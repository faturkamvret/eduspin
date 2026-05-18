'use client';

/**
 * Text-to-speech helper using the browser's built-in SpeechSynthesis API.
 *
 * Why browser TTS?
 * - Free, no asset download, works offline.
 * - Quality varies per device, but 99% of OS-es ship with an Indonesian voice.
 * - For ages 2-6, having ANY voice read the narration is far better than text-only.
 *
 * Lifecycle:
 * - speak(text) cancels any ongoing utterance, then speaks the new one.
 * - stop() cancels everything.
 * - Voices may load asynchronously (Chrome quirk) — we wait until ready.
 *
 * Reading-along highlight:
 * - speakWithBoundary(text, opts) emits per-word callbacks via the
 *   SpeechSynthesisUtterance.onboundary event so the caller can highlight
 *   the currently-spoken word in the UI.
 */

let mutedRef = false;
let voicesReady = false;
let voicesPromise: Promise<SpeechSynthesisVoice[]> | null = null;

export function setTtsMuted(m: boolean): void {
  mutedRef = m;
  if (m) stopSpeaking();
}

function isAvailable(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

/**
 * Resolve once SpeechSynthesis voices are loaded.
 * Chrome populates voices asynchronously after page load.
 */
function ensureVoices(): Promise<SpeechSynthesisVoice[]> {
  if (!isAvailable()) return Promise.resolve([]);
  if (voicesReady) return Promise.resolve(window.speechSynthesis.getVoices());
  if (voicesPromise) return voicesPromise;

  voicesPromise = new Promise<SpeechSynthesisVoice[]>((resolve) => {
    const synth = window.speechSynthesis;
    const initial = synth.getVoices();
    if (initial.length > 0) {
      voicesReady = true;
      resolve(initial);
      return;
    }
    const onChange = () => {
      const v = synth.getVoices();
      if (v.length > 0) {
        voicesReady = true;
        synth.removeEventListener?.('voiceschanged', onChange);
        resolve(v);
      }
    };
    synth.addEventListener?.('voiceschanged', onChange);
    // Fallback: resolve after 1s anyway so we don't hang
    setTimeout(() => {
      voicesReady = true;
      resolve(synth.getVoices());
    }, 1000);
  });
  return voicesPromise;
}

/**
 * Pick the best Indonesian voice available, falling back to any voice
 * with locale starting with 'id'. Returns null to use the engine default.
 */
function pickIndonesianVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
  // Exact id-ID match first
  const exact = voices.find((v) => v.lang === 'id-ID');
  if (exact) return exact;
  // Any "id-*" or "id"
  const idAny = voices.find((v) => v.lang?.toLowerCase().startsWith('id'));
  if (idAny) return idAny;
  // Sometimes voice name contains "Indonesia"
  const byName = voices.find((v) => /indonesia/i.test(v.name));
  if (byName) return byName;
  return null;
}

/**
 * Map child age to a TTS rate that helps with reading-along.
 *
 * Younger kids (1-5) get progressively slower speech so they can recognize
 * each word as it's spoken — important for early reading and spelling.
 * Age 6+ get near-natural speed since they read more fluently.
 */
export function rateForAge(age: number | undefined | null): number {
  if (age == null) return 0.85;
  if (age <= 2) return 0.7; // very slow — toddlers learning words
  if (age <= 4) return 0.8; // slow — preschoolers learning to spell
  if (age === 5) return 0.85; // moderately slow
  return 0.95; // 6+ near-natural
}

export interface SpeakOptions {
  /** Override the speech rate (0.1–10). Defaults to 0.9. */
  rate?: number;
  /** Override the pitch (0–2). Defaults to 1.1 (slightly higher = friendly). */
  pitch?: number;
  /**
   * Called when speech finishes (or fails). Always invoked exactly once
   * after a speak() call resolves.
   */
  onEnd?: () => void;
  /**
   * Called for each word boundary the SpeechSynthesis engine reports.
   * `charIndex` is the offset into the spoken text. Caller can derive the
   * current word for highlighting.
   *
   * Note: not all engines report boundaries (Safari support is patchy).
   * Callers MUST tolerate getting zero boundary events.
   */
  onBoundary?: (charIndex: number) => void;
}

/**
 * Speak the given text. Cancels any in-flight utterance first so taps don't
 * pile up.
 */
export async function speak(text: string, opts: SpeakOptions = {}): Promise<void> {
  if (mutedRef || !isAvailable() || !text.trim()) {
    opts.onEnd?.();
    return;
  }
  const synth = window.speechSynthesis;
  // Cancel anything in flight
  synth.cancel();

  const voices = await ensureVoices();
  const voice = pickIndonesianVoice(voices);

  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = voice?.lang ?? 'id-ID';
  if (voice) utter.voice = voice;
  utter.rate = opts.rate ?? 0.9;
  utter.pitch = opts.pitch ?? 1.1;
  utter.volume = 1;

  utter.onend = () => opts.onEnd?.();
  utter.onerror = () => opts.onEnd?.();
  if (opts.onBoundary) {
    utter.onboundary = (e: SpeechSynthesisEvent) => {
      // Only react to word boundaries (some engines also emit 'sentence').
      if (e.name === 'word' || e.name === undefined) {
        opts.onBoundary?.(e.charIndex);
      }
    };
  }

  synth.speak(utter);
}

/** Stop any ongoing speech immediately. */
export function stopSpeaking(): void {
  if (!isAvailable()) return;
  window.speechSynthesis.cancel();
}

/** True if the browser is currently speaking. */
export function isSpeaking(): boolean {
  if (!isAvailable()) return false;
  return window.speechSynthesis.speaking;
}
