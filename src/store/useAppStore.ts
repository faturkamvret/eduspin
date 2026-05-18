'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type {
  AppSettings,
  ChildProfile,
  Collection,
  Collectible,
  Gender,
  PullHistory,
  PullResult,
  QuizCategoryId,
  QuizQuestionStats,
  QuizStats,
  Rarity,
  StoryProgress,
  Wallet,
} from '@/types';
import { performPull } from '@/lib/gacha';
import { getCollectibleById, getCollectiblesForGender } from '@/data/collectibles';
import { getTodayMission } from '@/data/missions';

function todayKey(d: Date = new Date()): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

const COIN_PER_CORRECT = 1;
const COIN_BONUS_PER_SESSION = 5;
const COIN_DAILY_BONUS = 5;
const COIN_PER_PULL = 10;
const DAILY_BONUS_INTERVAL_MS = 24 * 60 * 60 * 1000;
const SHOP_ROTATION_MS = 24 * 60 * 60 * 1000;
const SHOP_COMMON_SLOTS = 4;
const SHOP_RARE_SLOTS = 4;

/**
 * Story-mode rewards.
 * - per chapter: 1 coin per correct answer (same as quiz)
 * - per chapter: small completion bonus
 * - per story (one-time): big completion bonus + collection-style book entry
 */
const COIN_PER_CHAPTER_BONUS = 3;
const COIN_PER_STORY_BONUS = 15;

/**
 * Shop pricing per rarity.
 * Only Common & Rare are sold; Epic & Legendary remain claw-machine exclusive.
 */
export const SHOP_PRICES: Partial<Record<Rarity, number>> = {
  common: 15,
  rare: 40,
};

export function getShopPrice(item: Collectible): number | null {
  return SHOP_PRICES[item.rarity] ?? null;
}

export type SyncStatus = 'disabled' | 'connecting' | 'syncing' | 'synced' | 'offline' | 'error';

/**
 * Daily mission progress tracker. We snapshot the mission id + day so a
 * mission that's already been completed today doesn't pay out twice, and
 * tomorrow's mission starts from zero.
 */
export interface MissionProgress {
  /** YYYY-MM-DD local date of the mission this row belongs to. */
  date: string;
  /** Mission id (from MISSIONS table) being tracked today. */
  missionId: string;
  /** Number of correct answers accumulated toward the target. */
  correct: number;
  /** Has the bonus already been paid? */
  rewarded: boolean;
}

/**
 * Currently-rotating shop offers.
 * Stored in persisted state so the same items show on refresh until rotation expires.
 */
export interface ShopOffers {
  /** Collectible IDs to display in shop, mixed Common + Rare in random order. */
  itemIds: string[];
  /** Timestamp (ms) when this set was generated. */
  rotatedAt: number;
  /** Gender used to generate the set; regenerate if profile gender changes. */
  gender: Gender;
}

export interface AppState {
  /** Hydration flag. UI should wait until this is true before rendering. */
  hydrated: boolean;

  /** Cloud sync status (UI indicator only). */
  syncStatus: SyncStatus;
  /** Last successful sync timestamp. */
  lastSyncedAt: number | null;
  /** Firebase anonymous auth uid (when sync is enabled). */
  cloudUid: string | null;

  profile: ChildProfile | null;
  wallet: Wallet;
  pity: PullHistory;
  collection: Collection;
  quizStats: QuizStats;
  settings: AppSettings;
  /** Currently-rotating shop offers. Null until first call to getOrRotateShopOffers. */
  shopOffers: ShopOffers | null;
  /**
   * Per-story progress, keyed by story id.
   * Tracks finished chapters + whether the one-time completion bonus has been
   * claimed (prevents repeated payouts on replay).
   */
  stories: Record<string, StoryProgress>;

  // ─── actions ───
  setHydrated: () => void;
  setSyncStatus: (status: SyncStatus) => void;
  setCloudUid: (uid: string | null) => void;
  markSynced: () => void;
  /**
   * Replace local state with snapshot from cloud.
   * Used when cloud data is newer than local on first load.
   */
  hydrateFromCloud: (snapshot: CloudSnapshot) => void;

  setProfile: (nickname: string, age: number, gender: Gender) => void;
  updateProfile: (patch: Partial<Pick<ChildProfile, 'nickname' | 'age' | 'gender'>>) => void;
  resetProfile: () => void;

  recordAnswer: (
    categoryId: QuizCategoryId,
    correct: boolean,
    questionId?: string,
  ) => void;
  finishQuizSession: () => void;
  claimDailyBonus: () =>
    | { ok: true; coinsAdded: number }
    | { ok: false; nextEligibleAt: number };

  canAffordPull: () => boolean;
  performGachaPull: () =>
    | { ok: true; result: PullResult }
    | { ok: false; reason: 'not-enough-coins' };

  /**
   * Buy a collectible from the shop.
   * Refuses if: item not for sale (Epic/Legendary), already owned, or insufficient coins.
   */
  buyCollectible: (
    collectibleId: string,
  ) =>
    | { ok: true; price: number; item: Collectible }
    | {
        ok: false;
        reason: 'not-for-sale' | 'already-owned' | 'not-enough-coins' | 'unknown-item';
      };

  /**
   * Get the current shop offers, rotating them if expired (>24h since last rotate)
   * or if the gender has changed. Persists the result so the page is stable across reloads.
   *
   * Returns 4 random Common + 4 random Rare items mixed in random order, filtered
   * by current profile gender (boy → boy + unisex; girl → girl + unisex).
   */
  getOrRotateShopOffers: () => ShopOffers;

  /**
   * Mark a chapter complete and award coins for the answers.
   * Returns the per-chapter bonus actually credited, plus a flag indicating
   * whether THIS call also completed the entire story (so UI can fire a
   * special celebration). The one-time story bonus is awarded only on the
   * first completion (bonusClaimed=false → true).
   */
  completeStoryChapter: (
    storyId: string,
    chapterId: string,
    correctCount: number,
    /** Total chapters in this story — used to detect completion. */
    totalChapters: number,
  ) => {
    chapterBonus: number;
    storyJustCompleted: boolean;
    storyBonus: number;
  };

  setMuted: (muted: boolean) => void;
  /** Toggle the gentle BGM loop. Persisted via settings. */
  setBgmEnabled: (enabled: boolean) => void;
  /**
   * Mark that the child has played today (any quiz answer counts). Used to
   * drive the mascot mood on home: 'happy' when played today, 'sleepy' when
   * not seen for >24h.
   */
  markPlayed: () => void;
  /** Last time the child interacted with a quiz (epoch ms). Persisted. */
  lastPlayedAt: number | null;
  /** Today's daily mission progress. Persisted. */
  missionProgress: MissionProgress | null;
  /**
   * Increment today's mission counter when the answered question's category
   * matches the mission. Returns reward info if the increment caused completion.
   */
  reportMissionAnswer: (categoryId: QuizCategoryId, correct: boolean) =>
    | { completed: true; bonusCoins: number }
    | { completed: false };
}

const emptyWallet = (): Wallet => ({
  coins: 0,
  totalEarned: 0,
  lastDailyClaim: null,
  updatedAt: Date.now(),
});

const emptyPity = (): PullHistory => ({
  totalPulls: 0,
  pityCounterEpic: 0,
  pityCounterLegendary: 0,
  updatedAt: Date.now(),
});

const emptyCollection = (): Collection => ({
  items: {},
  updatedAt: Date.now(),
});

const emptyQuizStats = (): QuizStats => ({
  totalCorrect: 0,
  totalAnswered: 0,
  byCategory: {},
  updatedAt: Date.now(),
});

export interface CloudSnapshot {
  profile: ChildProfile | null;
  wallet: Wallet;
  pity: PullHistory;
  collection: Collection;
  quizStats: QuizStats;
  settings: AppSettings;
  /** Story progress is part of the cloud snapshot too. Optional for backwards compat. */
  stories?: Record<string, StoryProgress>;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      hydrated: false,
      syncStatus: 'disabled',
      lastSyncedAt: null,
      cloudUid: null,
      profile: null,
      wallet: emptyWallet(),
      pity: emptyPity(),
      collection: emptyCollection(),
      quizStats: emptyQuizStats(),
      settings: { muted: false, bgmEnabled: false },
      shopOffers: null,
      stories: {},

      setHydrated: () => set({ hydrated: true }),
      setSyncStatus: (syncStatus) => set({ syncStatus }),
      setCloudUid: (cloudUid) => set({ cloudUid }),
      markSynced: () => set({ syncStatus: 'synced', lastSyncedAt: Date.now() }),

      hydrateFromCloud: (snap) => {
        set({
          profile: snap.profile,
          wallet: snap.wallet,
          pity: snap.pity,
          collection: snap.collection,
          quizStats: snap.quizStats,
          settings: snap.settings,
          stories: snap.stories ?? {},
        });
      },

      setProfile: (nickname, age, gender) => {
        const now = Date.now();
        const trimmed = nickname.trim().slice(0, 20);
        const safeAge = Math.max(1, Math.min(6, Math.round(age)));
        set({
          profile: {
            uid: get().profile?.uid ?? `local-${now}`,
            nickname: trimmed,
            age: safeAge,
            gender,
            createdAt: get().profile?.createdAt ?? now,
            updatedAt: now,
          },
        });
      },

      updateProfile: (patch) => {
        const cur = get().profile;
        if (!cur) return;
        const now = Date.now();
        const genderChanged = patch.gender !== undefined && patch.gender !== cur.gender;
        set({
          profile: {
            ...cur,
            ...(patch.nickname !== undefined
              ? { nickname: patch.nickname.trim().slice(0, 20) }
              : {}),
            ...(patch.age !== undefined
              ? { age: Math.max(1, Math.min(6, Math.round(patch.age))) }
              : {}),
            ...(patch.gender !== undefined ? { gender: patch.gender } : {}),
            updatedAt: now,
          },
          // Invalidate shop offers when gender changes so the new pool is generated.
          ...(genderChanged ? { shopOffers: null } : {}),
        });
      },

      resetProfile: () =>
        set({
          profile: null,
          wallet: emptyWallet(),
          pity: emptyPity(),
          collection: emptyCollection(),
          quizStats: emptyQuizStats(),
          settings: { muted: false, bgmEnabled: false },
          shopOffers: null,
          stories: {},
        }),

      recordAnswer: (categoryId, correct, questionId) => {
        const now = Date.now();
        const stats = get().quizStats;
        const cat = stats.byCategory[categoryId] ?? { correct: 0, answered: 0 };
        const wallet = get().wallet;

        // Per-question tracking (preserves previous attempts).
        const byQuestion = stats.byQuestion ?? {};
        const nextByQuestion: Record<string, QuizQuestionStats> = questionId
          ? {
              ...byQuestion,
              [questionId]: {
                correct: (byQuestion[questionId]?.correct ?? 0) + (correct ? 1 : 0),
                answered: (byQuestion[questionId]?.answered ?? 0) + 1,
                lastAt: now,
              },
            }
          : byQuestion;

        set({
          quizStats: {
            ...stats,
            totalAnswered: stats.totalAnswered + 1,
            totalCorrect: stats.totalCorrect + (correct ? 1 : 0),
            byCategory: {
              ...stats.byCategory,
              [categoryId]: {
                answered: cat.answered + 1,
                correct: cat.correct + (correct ? 1 : 0),
              },
            },
            byQuestion: nextByQuestion,
            updatedAt: now,
          },
          // Touch the "played today" marker so the home mascot reflects activity.
          lastPlayedAt: now,
          wallet: correct
            ? {
                ...wallet,
                coins: wallet.coins + COIN_PER_CORRECT,
                totalEarned: wallet.totalEarned + COIN_PER_CORRECT,
                updatedAt: now,
              }
            : wallet,
        });
      },

      finishQuizSession: () => {
        const now = Date.now();
        const wallet = get().wallet;
        set({
          wallet: {
            ...wallet,
            coins: wallet.coins + COIN_BONUS_PER_SESSION,
            totalEarned: wallet.totalEarned + COIN_BONUS_PER_SESSION,
            updatedAt: now,
          },
        });
      },

      claimDailyBonus: () => {
        const now = Date.now();
        const wallet = get().wallet;
        const last = wallet.lastDailyClaim ?? 0;
        const elapsed = now - last;
        if (elapsed < DAILY_BONUS_INTERVAL_MS) {
          return { ok: false, nextEligibleAt: last + DAILY_BONUS_INTERVAL_MS };
        }
        set({
          wallet: {
            ...wallet,
            coins: wallet.coins + COIN_DAILY_BONUS,
            totalEarned: wallet.totalEarned + COIN_DAILY_BONUS,
            lastDailyClaim: now,
            updatedAt: now,
          },
        });
        return { ok: true, coinsAdded: COIN_DAILY_BONUS };
      },

      canAffordPull: () => get().wallet.coins >= COIN_PER_PULL,

      performGachaPull: () => {
        const wallet = get().wallet;
        if (wallet.coins < COIN_PER_PULL) {
          return { ok: false, reason: 'not-enough-coins' };
        }
        const profile = get().profile;
        const gender = profile?.gender ?? 'boy';
        const pity = get().pity;
        const { result, nextState } = performPull(
          {
            totalPulls: pity.totalPulls,
            pityCounterEpic: pity.pityCounterEpic,
            pityCounterLegendary: pity.pityCounterLegendary,
          },
          gender,
        );

        const now = Date.now();
        const collection = get().collection;
        const existing = collection.items[result.collectible.id];

        set({
          wallet: {
            ...wallet,
            coins: wallet.coins - COIN_PER_PULL,
            updatedAt: now,
          },
          pity: { ...nextState, updatedAt: now },
          collection: {
            items: {
              ...collection.items,
              [result.collectible.id]: {
                count: (existing?.count ?? 0) + 1,
                firstPulledAt: existing?.firstPulledAt ?? now,
              },
            },
            updatedAt: now,
          },
        });

        return { ok: true, result };
      },

      buyCollectible: (collectibleId) => {
        const item = getCollectibleById(collectibleId);
        if (!item) return { ok: false, reason: 'unknown-item' };

        const price = SHOP_PRICES[item.rarity];
        if (price === undefined) return { ok: false, reason: 'not-for-sale' };

        const collection = get().collection;
        if (collection.items[collectibleId]) {
          return { ok: false, reason: 'already-owned' };
        }

        const wallet = get().wallet;
        if (wallet.coins < price) {
          return { ok: false, reason: 'not-enough-coins' };
        }

        const now = Date.now();
        set({
          wallet: {
            ...wallet,
            coins: wallet.coins - price,
            updatedAt: now,
          },
          collection: {
            items: {
              ...collection.items,
              [collectibleId]: { count: 1, firstPulledAt: now },
            },
            updatedAt: now,
          },
        });
        return { ok: true, price, item };
      },

      getOrRotateShopOffers: () => {
        const now = Date.now();
        const profile = get().profile;
        const gender: Gender = profile?.gender ?? 'boy';
        const current = get().shopOffers;

        if (
          current &&
          current.gender === gender &&
          now - current.rotatedAt < SHOP_ROTATION_MS
        ) {
          return current;
        }

        // Build a new rotation: pick N random Common + N random Rare from the
        // gender-filtered pool, then shuffle them together.
        const pool = getCollectiblesForGender(gender);
        const commons = pool.filter((c) => c.rarity === 'common');
        const rares = pool.filter((c) => c.rarity === 'rare');

        const pickN = (arr: Collectible[], n: number): Collectible[] => {
          const copy = [...arr];
          // Fisher-Yates partial shuffle
          for (let i = 0; i < Math.min(n, copy.length); i++) {
            const j = i + Math.floor(Math.random() * (copy.length - i));
            [copy[i], copy[j]] = [copy[j]!, copy[i]!];
          }
          return copy.slice(0, Math.min(n, copy.length));
        };

        const chosen = [
          ...pickN(commons, SHOP_COMMON_SLOTS),
          ...pickN(rares, SHOP_RARE_SLOTS),
        ];
        // Shuffle the combined set so common/rare appear mixed (no grouping).
        for (let i = chosen.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [chosen[i], chosen[j]] = [chosen[j]!, chosen[i]!];
        }

        const next: ShopOffers = {
          itemIds: chosen.map((c) => c.id),
          rotatedAt: now,
          gender,
        };
        set({ shopOffers: next });
        return next;
      },

      setMuted: (muted) => set({ settings: { ...get().settings, muted } }),

      completeStoryChapter: (storyId, chapterId, correctCount, totalChapters) => {
        const now = Date.now();
        const stories = get().stories;
        const prior = stories[storyId] ?? {
          completedChapters: [],
          bonusClaimed: false,
          updatedAt: now,
        };

        // Idempotent chapter add.
        const completedChapters = prior.completedChapters.includes(chapterId)
          ? prior.completedChapters
          : [...prior.completedChapters, chapterId];

        // Per-chapter rewards: 1 coin per correct answer + flat chapter bonus.
        // We award these on EVERY play (kid can re-do a chapter and still get
        // the per-answer coins) — only the big story-completion bonus is gated.
        const answerCoins = Math.max(0, correctCount) * COIN_PER_CORRECT;
        const chapterBonus = COIN_PER_CHAPTER_BONUS;

        const isStoryComplete = completedChapters.length >= totalChapters;
        const storyJustCompleted = isStoryComplete && !prior.bonusClaimed;
        const storyBonus = storyJustCompleted ? COIN_PER_STORY_BONUS : 0;

        const totalCoins = answerCoins + chapterBonus + storyBonus;
        const wallet = get().wallet;

        set({
          stories: {
            ...stories,
            [storyId]: {
              completedChapters,
              bonusClaimed: prior.bonusClaimed || storyJustCompleted,
              updatedAt: now,
            },
          },
          wallet:
            totalCoins > 0
              ? {
                  ...wallet,
                  coins: wallet.coins + totalCoins,
                  totalEarned: wallet.totalEarned + totalCoins,
                  updatedAt: now,
                }
              : wallet,
        });

        return { chapterBonus, storyJustCompleted, storyBonus };
      },
    }),
    {
      name: 'eduspin-store-v1',
      storage: createJSONStorage(() =>
        typeof window !== 'undefined' ? localStorage : (undefined as unknown as Storage),
      ),
      partialize: (state) => ({
        profile: state.profile,
        wallet: state.wallet,
        pity: state.pity,
        collection: state.collection,
        quizStats: state.quizStats,
        settings: state.settings,
        shopOffers: state.shopOffers,
        stories: state.stories,
      }),
      onRehydrateStorage: () => (state) => {
        // Mark hydrated after persist middleware finishes loading
        state?.setHydrated();
      },
    },
  ),
);

export const COIN_CONSTANTS = {
  COIN_PER_CORRECT,
  COIN_BONUS_PER_SESSION,
  COIN_DAILY_BONUS,
  COIN_PER_PULL,
  COIN_PER_CHAPTER_BONUS,
  COIN_PER_STORY_BONUS,
  DAILY_BONUS_INTERVAL_MS,
};
