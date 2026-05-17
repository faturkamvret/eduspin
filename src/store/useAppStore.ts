'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type {
  AppSettings,
  ChildProfile,
  Collection,
  Collectible,
  PullHistory,
  PullResult,
  QuizCategoryId,
  QuizStats,
  Rarity,
  Wallet,
} from '@/types';
import { performPull } from '@/lib/gacha';
import { getCollectibleById } from '@/data/collectibles';

const COIN_PER_CORRECT = 1;
const COIN_BONUS_PER_SESSION = 5;
const COIN_DAILY_BONUS = 5;
const COIN_PER_PULL = 10;
const DAILY_BONUS_INTERVAL_MS = 24 * 60 * 60 * 1000;

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

  setProfile: (nickname: string, age: number) => void;
  updateProfile: (patch: Partial<Pick<ChildProfile, 'nickname' | 'age'>>) => void;
  resetProfile: () => void;

  recordAnswer: (categoryId: QuizCategoryId, correct: boolean) => void;
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

  setMuted: (muted: boolean) => void;
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
      settings: { muted: false },

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
        });
      },

      setProfile: (nickname, age) => {
        const now = Date.now();
        const trimmed = nickname.trim().slice(0, 20);
        const safeAge = Math.max(1, Math.min(6, Math.round(age)));
        set({
          profile: {
            uid: get().profile?.uid ?? `local-${now}`,
            nickname: trimmed,
            age: safeAge,
            createdAt: get().profile?.createdAt ?? now,
            updatedAt: now,
          },
        });
      },

      updateProfile: (patch) => {
        const cur = get().profile;
        if (!cur) return;
        const now = Date.now();
        set({
          profile: {
            ...cur,
            ...(patch.nickname !== undefined
              ? { nickname: patch.nickname.trim().slice(0, 20) }
              : {}),
            ...(patch.age !== undefined
              ? { age: Math.max(1, Math.min(6, Math.round(patch.age))) }
              : {}),
            updatedAt: now,
          },
        });
      },

      resetProfile: () =>
        set({
          profile: null,
          wallet: emptyWallet(),
          pity: emptyPity(),
          collection: emptyCollection(),
          quizStats: emptyQuizStats(),
          settings: { muted: false },
        }),

      recordAnswer: (categoryId, correct) => {
        const now = Date.now();
        const stats = get().quizStats;
        const cat = stats.byCategory[categoryId] ?? { correct: 0, answered: 0 };
        const wallet = get().wallet;
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
            updatedAt: now,
          },
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
        const pity = get().pity;
        const { result, nextState } = performPull({
          totalPulls: pity.totalPulls,
          pityCounterEpic: pity.pityCounterEpic,
          pityCounterLegendary: pity.pityCounterLegendary,
        });

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

      setMuted: (muted) => set({ settings: { ...get().settings, muted } }),
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
  DAILY_BONUS_INTERVAL_MS,
};
