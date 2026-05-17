import type { Collectible } from '@/types';

/**
 * MVP collectible pool. All 4 rarities × multiple categories.
 * Each item uses an emoji as visual placeholder; will be replaced with Lottie/illustration later.
 */
export const COLLECTIBLES: Collectible[] = [
  // ───── COMMON (8 items) ─────
  {
    id: 'cat-orange',
    name: 'Mio si Kucing',
    category: 'animal',
    rarity: 'common',
    emoji: '🐱',
    gradient: 'from-orange-300 to-yellow-200',
    flavor: 'Suka tidur di sofa.',
  },
  {
    id: 'dog-brown',
    name: 'Boni si Anjing',
    category: 'animal',
    rarity: 'common',
    emoji: '🐶',
    gradient: 'from-amber-300 to-orange-200',
    flavor: 'Selalu bersemangat berlari.',
  },
  {
    id: 'apple',
    name: 'Apel Merah',
    category: 'fruit',
    rarity: 'common',
    emoji: '🍎',
    gradient: 'from-red-300 to-pink-200',
    flavor: 'Manis dan menyehatkan.',
  },
  {
    id: 'banana',
    name: 'Pisang Lucu',
    category: 'fruit',
    rarity: 'common',
    emoji: '🍌',
    gradient: 'from-yellow-300 to-amber-200',
    flavor: 'Energi pagi yang ceria.',
  },
  {
    id: 'mouse',
    name: 'Kiki si Tikus',
    category: 'animal',
    rarity: 'common',
    emoji: '🐭',
    gradient: 'from-gray-300 to-slate-200',
    flavor: 'Suka keju.',
  },
  {
    id: 'fish',
    name: 'Bubu si Ikan',
    category: 'animal',
    rarity: 'common',
    emoji: '🐠',
    gradient: 'from-cyan-300 to-blue-200',
    flavor: 'Berenang lincah.',
  },
  {
    id: 'strawberry',
    name: 'Stroberi Imut',
    category: 'fruit',
    rarity: 'common',
    emoji: '🍓',
    gradient: 'from-rose-300 to-pink-200',
    flavor: 'Asam manis menyegarkan.',
  },
  {
    id: 'donut',
    name: 'Donat Lapar',
    category: 'food',
    rarity: 'common',
    emoji: '🍩',
    gradient: 'from-pink-300 to-rose-200',
    flavor: 'Selalu bahagia.',
  },

  // ───── RARE (6 items) ─────
  {
    id: 'rabbit',
    name: 'Lila si Kelinci',
    category: 'animal',
    rarity: 'rare',
    emoji: '🐰',
    gradient: 'from-pink-200 to-purple-200',
    flavor: 'Lompat-lompat sepanjang hari.',
  },
  {
    id: 'panda',
    name: 'Pandi si Panda',
    category: 'animal',
    rarity: 'rare',
    emoji: '🐼',
    gradient: 'from-slate-200 to-gray-100',
    flavor: 'Suka bambu.',
  },
  {
    id: 'fox',
    name: 'Foxi si Rubah',
    category: 'animal',
    rarity: 'rare',
    emoji: '🦊',
    gradient: 'from-orange-300 to-rose-200',
    flavor: 'Cerdik dan penasaran.',
  },
  {
    id: 'pizza',
    name: 'Pizi si Pizza',
    category: 'food',
    rarity: 'rare',
    emoji: '🍕',
    gradient: 'from-amber-300 to-red-200',
    flavor: 'Hangat dan keju meleleh.',
  },
  {
    id: 'robot-mini',
    name: 'Bibo Bot',
    category: 'robot',
    rarity: 'rare',
    emoji: '🤖',
    gradient: 'from-sky-300 to-indigo-200',
    flavor: 'Suka beep boop.',
  },
  {
    id: 'koala',
    name: 'Kola si Koala',
    category: 'animal',
    rarity: 'rare',
    emoji: '🐨',
    gradient: 'from-slate-200 to-zinc-100',
    flavor: 'Tidur 18 jam sehari.',
  },

  // ───── EPIC (4 items) ─────
  {
    id: 'unicorn',
    name: 'Uni si Unicorn',
    category: 'fantasy',
    rarity: 'epic',
    emoji: '🦄',
    gradient: 'from-pink-300 via-purple-300 to-blue-300',
    flavor: 'Berkilau pelangi.',
  },
  {
    id: 'dino-trex',
    name: 'Rexi T-Rex',
    category: 'dinosaur',
    rarity: 'epic',
    emoji: '🦖',
    gradient: 'from-emerald-400 to-lime-300',
    flavor: 'Auman menggetarkan.',
  },
  {
    id: 'dragon',
    name: 'Drako si Naga Kecil',
    category: 'fantasy',
    rarity: 'epic',
    emoji: '🐲',
    gradient: 'from-emerald-400 to-teal-300',
    flavor: 'Bisa terbang rendah.',
  },
  {
    id: 'astronaut-cat',
    name: 'Astro Cat',
    category: 'fantasy',
    rarity: 'epic',
    emoji: '👨‍🚀',
    gradient: 'from-indigo-400 to-violet-300',
    flavor: 'Kucing yang ke luar angkasa.',
  },

  // ───── LEGENDARY (2 items) ─────
  {
    id: 'phoenix',
    name: 'Phoenix Emas',
    category: 'fantasy',
    rarity: 'legendary',
    emoji: '🔥',
    gradient: 'from-amber-400 via-orange-400 to-red-400',
    flavor: 'Burung api yang abadi.',
  },
  {
    id: 'rainbow-dragon',
    name: 'Naga Pelangi',
    category: 'fantasy',
    rarity: 'legendary',
    emoji: '🌈',
    gradient: 'from-pink-400 via-yellow-300 via-green-400 to-blue-400',
    flavor: 'Naga paling langka, simbol persahabatan.',
  },
];

export function getCollectiblesByRarity(rarity: Collectible['rarity']): Collectible[] {
  return COLLECTIBLES.filter((c) => c.rarity === rarity);
}

export function getCollectibleById(id: string): Collectible | undefined {
  return COLLECTIBLES.find((c) => c.id === id);
}
