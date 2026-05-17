// Transparent gacha logic. No near-miss, no manipulation.
//
// Rules (from architecture.md):
//   Common 60% / Rare 25% / Epic 10% / Legendary 5%
//   Pity: every 10 pulls without Epic+ → guaranteed Epic+
//   Pity: every 30 pulls without Legendary → guaranteed Legendary

import type { Collectible, PullResult, Rarity } from '@/types';
import { COLLECTIBLES } from '@/data/collectibles';

export const RARITY_RATES: Record<Rarity, number> = {
  common: 0.6,
  rare: 0.25,
  epic: 0.1,
  legendary: 0.05,
};

export const PITY_EPIC_THRESHOLD = 10;
export const PITY_LEGENDARY_THRESHOLD = 30;

export function rollRarity(rng: () => number = Math.random): Rarity {
  const r = rng();
  if (r < RARITY_RATES.legendary) return 'legendary';
  if (r < RARITY_RATES.legendary + RARITY_RATES.epic) return 'epic';
  if (r < RARITY_RATES.legendary + RARITY_RATES.epic + RARITY_RATES.rare) return 'rare';
  return 'common';
}

export function pickCollectibleByRarity(
  rarity: Rarity,
  rng: () => number = Math.random,
): Collectible {
  const pool = COLLECTIBLES.filter((c) => c.rarity === rarity);
  if (pool.length === 0) {
    // Fallback: should never happen if collectibles.ts always has each rarity
    const fallback = COLLECTIBLES[0];
    if (!fallback) throw new Error('No collectibles defined');
    return fallback;
  }
  const idx = Math.floor(rng() * pool.length);
  return pool[idx]!;
}

export interface PityState {
  pityCounterEpic: number;
  pityCounterLegendary: number;
  totalPulls: number;
}

/**
 * Run a single pull with pity logic.
 * Returns: rarity rolled, pity flag (which threshold triggered), and updated pity state.
 */
export function performPull(
  state: PityState,
  rng: () => number = Math.random,
): { result: PullResult; nextState: PityState } {
  const nextEpic = state.pityCounterEpic + 1;
  const nextLegendary = state.pityCounterLegendary + 1;

  let rarity = rollRarity(rng);
  let pityTriggered: 'epic' | 'legendary' | null = null;

  // Legendary pity is the strongest guarantee, evaluated first
  if (nextLegendary >= PITY_LEGENDARY_THRESHOLD) {
    rarity = 'legendary';
    pityTriggered = 'legendary';
  } else if (nextEpic >= PITY_EPIC_THRESHOLD && rarity !== 'epic' && rarity !== 'legendary') {
    rarity = 'epic';
    pityTriggered = 'epic';
  }

  const collectible = pickCollectibleByRarity(rarity, rng);
  const totalPulls = state.totalPulls + 1;

  // Reset pity counters based on what we just rolled
  const isEpicPlus = rarity === 'epic' || rarity === 'legendary';
  const isLegendary = rarity === 'legendary';

  const nextState: PityState = {
    totalPulls,
    pityCounterEpic: isEpicPlus ? 0 : nextEpic,
    pityCounterLegendary: isLegendary ? 0 : nextLegendary,
  };

  return {
    result: {
      collectible,
      rarity,
      pityTriggered,
      pullNumber: totalPulls,
    },
    nextState,
  };
}
