import type { Rarity } from '@/types';

export function cn(...classes: Array<string | undefined | false | null>): string {
  return classes.filter(Boolean).join(' ');
}

export const RARITY_LABEL: Record<Rarity, string> = {
  common: 'Biasa',
  rare: 'Langka',
  epic: 'Epik',
  legendary: 'Legendaris',
};

export const RARITY_COLOR: Record<Rarity, string> = {
  common: 'text-rarity-common border-rarity-common',
  rare: 'text-rarity-rare border-rarity-rare',
  epic: 'text-rarity-epic border-rarity-epic',
  legendary: 'text-rarity-legendary border-rarity-legendary',
};

export const RARITY_BG: Record<Rarity, string> = {
  common: 'bg-gray-100',
  rare: 'bg-blue-100',
  epic: 'bg-purple-100',
  legendary: 'bg-amber-100',
};

export function formatNumber(n: number): string {
  return new Intl.NumberFormat('id-ID').format(n);
}

export function timeUntil(targetMs: number): string {
  const diff = targetMs - Date.now();
  if (diff <= 0) return 'sekarang';
  const h = Math.floor(diff / 3_600_000);
  const m = Math.floor((diff % 3_600_000) / 60_000);
  if (h > 0) return `${h} jam ${m} menit`;
  return `${m} menit`;
}
