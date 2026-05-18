import type { QuizCategoryId } from '@/types';

/**
 * Daily Mission — narrative wrapper around the existing quiz engine.
 *
 * Each mission has a story-style intro told by the mascot, a category to
 * pull questions from, and a target count. When the child answers `target`
 * questions correctly within that category in the session, the mission is
 * complete and they earn a bonus.
 *
 * Designed for ages 1–6: very short prompts, clear emoji, every mission
 * ends with a hug/cheer narrative beat.
 */
export interface Mission {
  id: string;
  title: string;
  /** Short story prompt the mascot will read aloud (TTS). */
  intro: string;
  /** Cue the mascot says when the mission is complete. */
  outro: string;
  /** Mascot emoji for the intro card. */
  emoji: string;
  category: QuizCategoryId;
  /** Number of CORRECT answers required to complete the mission. */
  target: number;
  /** Bonus coins on top of normal per-answer + session rewards. */
  bonusCoins: number;
}

export const MISSIONS: Mission[] = [
  {
    id: 'bear-fruits',
    title: 'Beruang Lapar 🐻',
    intro: 'Beruang lapar sekali! Yuk bantu Beruang temukan 5 warna buah!',
    outro: 'Yummy! Beruang kenyang sekarang. Terima kasih ya!',
    emoji: '🐻',
    category: 'color',
    target: 5,
    bonusCoins: 5,
  },
  {
    id: 'forest-animals',
    title: 'Petualangan di Hutan 🌳',
    intro: 'Ada banyak hewan di hutan. Yuk kita kenali 5 hewan dengan benar!',
    outro: 'Wah, kamu sudah jadi penjelajah hutan hebat!',
    emoji: '🦁',
    category: 'animal',
    target: 5,
    bonusCoins: 5,
  },
  {
    id: 'shape-builder',
    title: 'Tukang Bangun Cilik 🧱',
    intro: 'Yuk bantu kami membangun rumah! Kita perlu kenali 5 bentuk dulu.',
    outro: 'Rumahnya jadi! Kerja bagus, tukang bangun!',
    emoji: '🧱',
    category: 'shape',
    target: 5,
    bonusCoins: 5,
  },
  {
    id: 'count-stars',
    title: 'Hitung Bintang ⭐',
    intro: 'Langit malam indah! Yuk hitung 5 kelompok bintang bersama Bulan.',
    outro: 'Wow, kamu menghitung dengan sangat hebat!',
    emoji: '🌙',
    category: 'counting',
    target: 5,
    bonusCoins: 5,
  },
  {
    id: 'rainbow-friends',
    title: 'Pelangi Teman-teman 🌈',
    intro: 'Pelangi muncul! Yuk kenali warna-warninya bersama Kupu-kupu.',
    outro: 'Pelanginya jadi makin cerah berkat kamu!',
    emoji: '🌈',
    category: 'color',
    target: 5,
    bonusCoins: 5,
  },
  {
    id: 'farm-friends',
    title: 'Peternakan Ceria 🚜',
    intro: 'Sapi, bebek, dan kuda menunggu kamu. Kenali 5 hewan ternak ya!',
    outro: 'Hewan-hewan senang sekali! Mereka berkata terima kasih.',
    emoji: '🐮',
    category: 'animal',
    target: 5,
    bonusCoins: 5,
  },
  {
    id: 'cookie-baker',
    title: 'Tukang Kue Kecil 🧁',
    intro: 'Kita akan membuat 5 loyang kue. Yuk hitung dengan benar!',
    outro: 'Kue siap! Wanginya enak sekali.',
    emoji: '🧁',
    category: 'counting',
    target: 5,
    bonusCoins: 5,
  },
];

/**
 * Pick today's mission deterministically — same calendar day = same mission.
 * Uses the local-date YYYY-MM-DD as a hash so it doesn't shift around
 * timezones the way epoch-based math would.
 */
export function getTodayMission(now: Date = new Date()): Mission {
  const y = now.getFullYear();
  const m = now.getMonth() + 1;
  const d = now.getDate();
  const seed = y * 10000 + m * 100 + d;
  const idx = Math.abs(seed) % MISSIONS.length;
  return MISSIONS[idx]!;
}

/** Returns true when two epoch-ms timestamps fall on the same local calendar day. */
export function isSameLocalDay(a: number, b: number): boolean {
  const da = new Date(a);
  const db = new Date(b);
  return (
    da.getFullYear() === db.getFullYear() &&
    da.getMonth() === db.getMonth() &&
    da.getDate() === db.getDate()
  );
}
