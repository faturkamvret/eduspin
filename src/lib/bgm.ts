'use client';

/**
 * Background music engine — synthesized lullaby loop using Web Audio.
 *
 * No audio assets needed; we generate a soft 4-chord pad with a gentle melody
 * on top. Designed to be unobtrusive (default OFF) so parents are in control.
 *
 * Toggle via `setBgmEnabled()`. The engine is idempotent: calling start()
 * while already running is a no-op.
 */

let ctx: AudioContext | null = null;
let masterGain: GainNode | null = null;
let scheduler: number | null = null;
let nextNoteTime = 0;
let noteIndex = 0;
let running = false;

// Soft kid-friendly C-major progression: I - vi - IV - V (C - Am - F - G)
// Each chord lasts 2 beats; 60 BPM → 2 seconds per chord.
const CHORDS: number[][] = [
  [261.63, 329.63, 392.0], // C major
  [220.0, 261.63, 329.63], // A minor
  [174.61, 220.0, 261.63], // F major
  [196.0, 246.94, 293.66], // G major
];

// Simple lullaby melody (relative to chord), in semitone offsets from chord root.
const MELODY_PATTERNS = [
  [0, 4, 7, 4, 0, 7, 4, 0],
  [0, 7, 4, 0, -3, 0, 4, 7],
  [4, 0, 7, 4, 0, -3, 0, 4],
  [7, 4, 0, 4, 7, 4, 0, -5],
];

const BEAT = 0.25; // 8 notes per chord
const CHORD_DURATION = BEAT * 8;

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

function ensureMaster(c: AudioContext): GainNode {
  if (masterGain) return masterGain;
  masterGain = c.createGain();
  masterGain.gain.setValueAtTime(0.04, c.currentTime); // very quiet
  masterGain.connect(c.destination);
  return masterGain;
}

function playPad(c: AudioContext, freqs: number[], startAt: number, durationSec: number) {
  const master = ensureMaster(c);
  freqs.forEach((freq) => {
    const osc = c.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, startAt);
    const g = c.createGain();
    g.gain.setValueAtTime(0, startAt);
    g.gain.linearRampToValueAtTime(0.6, startAt + 0.4);
    g.gain.linearRampToValueAtTime(0, startAt + durationSec);
    osc.connect(g).connect(master);
    osc.start(startAt);
    osc.stop(startAt + durationSec + 0.05);
  });
}

function playMelodyNote(c: AudioContext, freq: number, startAt: number, durationSec: number) {
  const master = ensureMaster(c);
  const osc = c.createOscillator();
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(freq, startAt);
  const g = c.createGain();
  g.gain.setValueAtTime(0, startAt);
  g.gain.linearRampToValueAtTime(0.5, startAt + 0.02);
  g.gain.linearRampToValueAtTime(0, startAt + durationSec);
  osc.connect(g).connect(master);
  osc.start(startAt);
  osc.stop(startAt + durationSec + 0.05);
}

function semitoneToFreq(rootHz: number, semitones: number): number {
  return rootHz * Math.pow(2, semitones / 12);
}

function scheduleAhead() {
  const c = getCtx();
  if (!c || !running) return;
  // Schedule notes up to 0.5s ahead of the audio clock.
  while (nextNoteTime < c.currentTime + 0.5) {
    const chordIdx = noteIndex % CHORDS.length;
    const chord = CHORDS[chordIdx]!;
    const melody = MELODY_PATTERNS[chordIdx]!;

    // Pad chord across the full chord duration.
    playPad(c, chord, nextNoteTime, CHORD_DURATION);

    // Play 8 melody notes one octave up from chord root.
    const root = chord[0]! * 2;
    for (let i = 0; i < melody.length; i++) {
      const noteFreq = semitoneToFreq(root, melody[i]!);
      playMelodyNote(c, noteFreq, nextNoteTime + i * BEAT, BEAT * 0.85);
    }

    nextNoteTime += CHORD_DURATION;
    noteIndex++;
  }
}

export function startBgm(): void {
  if (running) return;
  const c = getCtx();
  if (!c) return;
  // Some browsers start ctx as 'suspended' until user gesture.
  if (c.state === 'suspended') {
    void c.resume();
  }
  running = true;
  nextNoteTime = c.currentTime + 0.1;
  noteIndex = 0;
  // Fade in the master.
  const master = ensureMaster(c);
  master.gain.cancelScheduledValues(c.currentTime);
  master.gain.setValueAtTime(master.gain.value, c.currentTime);
  master.gain.linearRampToValueAtTime(0.04, c.currentTime + 1.5);
  scheduler = window.setInterval(scheduleAhead, 100);
}

export function stopBgm(): void {
  running = false;
  if (scheduler !== null) {
    clearInterval(scheduler);
    scheduler = null;
  }
  const c = getCtx();
  if (!c || !masterGain) return;
  // Fade out so it doesn't click off abruptly.
  masterGain.gain.cancelScheduledValues(c.currentTime);
  masterGain.gain.setValueAtTime(masterGain.gain.value, c.currentTime);
  masterGain.gain.linearRampToValueAtTime(0, c.currentTime + 0.6);
}

export function setBgmEnabled(enabled: boolean): void {
  if (enabled) startBgm();
  else stopBgm();
}

export function isBgmRunning(): boolean {
  return running;
}
