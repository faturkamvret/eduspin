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
 * Speak the given text. Cancels any in-flight utterance first so taps don't
 * pile up.
 *
 * @param text   The text to speak.
 * @param onEnd  Optional callback invoked when speaking finishes (or fails).
 */
export async function speak(text: string, onEnd?: () => void): Promise<void> {
  if (mutedRef || !isAvailable() || !text.trim()) {
    onEnd?.();
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
  // Slightly slower + slightly higher pitch — friendlier for kids.
  utter.rate = 0.9;
  utter.pitch = 1.1;
  utter.volume = 1;

  utter.onend = () => onEnd?.();
  utter.onerror = () => onEnd?.();

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
