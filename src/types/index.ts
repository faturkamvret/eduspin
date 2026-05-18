// Shared domain types for EduSpin

export type Rarity = 'common' | 'rare' | 'epic' | 'legendary';

/**
 * Child gender — affects collectible filtering (strict).
 * - 'boy'  → can only get items tagged 'boy' or 'unisex'
 * - 'girl' → can only get items tagged 'girl' or 'unisex'
 * Backwards-compat: profiles without gender default to 'unisex' behaviour
 * (no filtering) until parent picks one.
 */
export type Gender = 'boy' | 'girl';

/** Gender tag on each collectible for filtering. */
export type CollectibleGender = 'boy' | 'girl' | 'unisex';

export type QuizCategoryId = 'shape' | 'color' | 'animal' | 'counting';

export interface QuizCategoryMeta {
  id: QuizCategoryId;
  label: string;
  emoji: string;
  description: string;
  color: string; // tailwind bg class
}

export interface QuizQuestion {
  id: string;
  category: QuizCategoryId;
  ageMin: number;
  ageMax: number;
  difficulty: 1 | 2 | 3;
  prompt: string;
  /** Optional emoji/visual rendered with prompt */
  visual?: string;
  /**
   * Optional sound cue auto-played when the question appears (and replayable
   * via a 🔊 button). Useful for "what does X say?" style prompts.
   */
  audioCue?:
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
  options: QuizOption[];
  correctOptionId: string;
}

export interface QuizOption {
  id: string;
  label: string;
  /** Optional emoji / single character visual */
  visual?: string;
}

export type CollectibleCategory =
  | 'animal'
  | 'fruit'
  | 'robot'
  | 'dinosaur'
  | 'fantasy'
  | 'food';

export interface Collectible {
  id: string;
  name: string;
  category: CollectibleCategory;
  rarity: Rarity;
  /** Gender targeting: 'boy' | 'girl' | 'unisex'. Strict filter by child gender. */
  gender: CollectibleGender;
  /** Emoji used as visual placeholder in MVP */
  emoji: string;
  /** Tailwind gradient classes for capsule background */
  gradient: string;
  /** SFX file path under /public, optional */
  sfx?: string;
  /** Short flavor text */
  flavor: string;
}

export interface ChildProfile {
  uid: string;
  nickname: string;
  age: number;
  /** Child gender — affects collectible pool filtering */
  gender: Gender;
  createdAt: number;
  updatedAt: number;
}

export interface Wallet {
  coins: number;
  totalEarned: number;
  lastDailyClaim: number | null;
  updatedAt: number;
}

export interface PullHistory {
  totalPulls: number;
  pityCounterEpic: number;
  pityCounterLegendary: number;
  updatedAt: number;
}

export interface CollectionEntry {
  count: number;
  firstPulledAt: number;
}

export interface Collection {
  items: Record<string, CollectionEntry>;
  updatedAt: number;
}

export interface QuizCategoryStats {
  correct: number;
  answered: number;
}

/**
 * Per-question performance tracker — used by the adaptive picker to
 * surface questions the child gets wrong more often.
 */
export interface QuizQuestionStats {
  /** Times answered correctly. */
  correct: number;
  /** Times answered (any). */
  answered: number;
  /** Last attempt epoch ms — used for recency tie-breaking. */
  lastAt: number;
}

export interface QuizStats {
  totalCorrect: number;
  totalAnswered: number;
  byCategory: Partial<Record<QuizCategoryId, QuizCategoryStats>>;
  /** Per-question stats, keyed by question id. Optional for backwards compat. */
  byQuestion?: Record<string, QuizQuestionStats>;
  updatedAt: number;
}

export interface AppSettings {
  muted: boolean;
}

export interface PullResult {
  collectible: Collectible;
  rarity: Rarity;
  /** Was this pull boosted by pity? */
  pityTriggered: 'epic' | 'legendary' | null;
  pullNumber: number;
}

// ─────── Story-quiz domain ───────

/**
 * A single question inside a chapter. Mirrors QuizQuestion but without
 * category/age fields — soal cerita selalu fixed dan terkait konteks bab,
 * jadi tidak perlu adaptive picking.
 */
export interface ChapterQuestion {
  id: string;
  prompt: string;
  /** Optional emoji/visual rendered with prompt */
  visual?: string;
  /** Optional auto-played sound (re-uses the AudioCue list from QuizQuestion). */
  audioCue?: QuizQuestion['audioCue'];
  options: QuizOption[];
  correctOptionId: string;
}

/**
 * One chapter of a story. Has narration text + 2-3 fixed questions.
 */
export interface StoryChapter {
  id: string;
  title: string;
  /** Big emoji used as illustration on the narration screen. */
  illustration: string;
  /**
   * Narration paragraphs (Indonesian). Each entry is one paragraph; UI joins
   * them with spacing. Kept as array so TTS can read them sequentially.
   */
  narration: string[];
  questions: ChapterQuestion[];
}

/**
 * A full story with multiple chapters.
 */
export interface Story {
  id: string;
  title: string;
  /** Short tagline shown on listing card. */
  tagline: string;
  /** Big emoji shown as cover. */
  coverEmoji: string;
  /** Recommended age range. */
  ageMin: number;
  ageMax: number;
  /** CSS gradient string for cover card background. */
  themeGradient: string;
  chapters: StoryChapter[];
}

/**
 * Per-story progress kept in the store. Tracks which chapters the child has
 * finished + whether the story-completion bonus has been awarded.
 */
export interface StoryProgress {
  /** Chapter ids the child has completed at least once. */
  completedChapters: string[];
  /**
   * Whether the one-time story-completion bonus has been claimed.
   * Prevents repeated payouts on replay.
   */
  bonusClaimed: boolean;
  updatedAt: number;
}
