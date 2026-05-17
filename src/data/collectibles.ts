import type { Collectible, CollectibleGender, Gender } from '@/types';

/**
 * Full collectible pool with gender tags.
 *
 * Distribution target:
 * - Common: 12 (4 boy, 4 girl, 4 unisex)
 * - Rare:   9  (3 boy, 3 girl, 3 unisex)
 * - Epic:   6  (2 boy, 2 girl, 2 unisex)
 * - Legendary: 4 (1 boy, 1 girl, 2 unisex)
 * Total: 31 items
 */
export const COLLECTIBLES: Collectible[] = [
  // ═══════════════════════════════════════════
  // ─────────── COMMON (12) ───────────────────
  // ═══════════════════════════════════════════

  // Boy — Common
  {
    id: 'dino-mini',
    name: 'Dino Mini',
    category: 'dinosaur',
    rarity: 'common',
    gender: 'boy',
    emoji: '🦕',
    gradient: 'from-emerald-300 to-teal-200',
    flavor: 'Dinosaurus kecil yang suka berlari.',
  },
  {
    id: 'soccer-ball',
    name: 'Bola Tendang',
    category: 'food', // misc
    rarity: 'common',
    gender: 'boy',
    emoji: '⚽',
    gradient: 'from-slate-200 to-white',
    flavor: 'Gol! Tendang sejauh mungkin.',
  },
  {
    id: 'race-car',
    name: 'Mobil Balap',
    category: 'robot', // vehicle
    rarity: 'common',
    gender: 'boy',
    emoji: '🏎️',
    gradient: 'from-red-300 to-orange-200',
    flavor: 'Ngebut di sirkuit mini.',
  },
  {
    id: 'paper-plane',
    name: 'Pesawat Kertas',
    category: 'fantasy',
    rarity: 'common',
    gender: 'boy',
    emoji: '✈️',
    gradient: 'from-sky-200 to-blue-100',
    flavor: 'Terbang tinggi di langit biru.',
  },

  // Girl — Common
  {
    id: 'teddy-pink',
    name: 'Beruang Pita',
    category: 'animal',
    rarity: 'common',
    gender: 'girl',
    emoji: '🧸',
    gradient: 'from-pink-300 to-rose-200',
    flavor: 'Peluk aku sebelum tidur.',
  },
  {
    id: 'butterfly',
    name: 'Kupu-kupu Cantik',
    category: 'animal',
    rarity: 'common',
    gender: 'girl',
    emoji: '🦋',
    gradient: 'from-purple-200 to-pink-200',
    flavor: 'Terbang dari bunga ke bunga.',
  },
  {
    id: 'cupcake',
    name: 'Cupcake Imut',
    category: 'food',
    rarity: 'common',
    gender: 'girl',
    emoji: '🧁',
    gradient: 'from-pink-200 to-fuchsia-200',
    flavor: 'Manis dengan taburan pelangi.',
  },
  {
    id: 'flower-rose',
    name: 'Bunga Mawar',
    category: 'fruit', // flora
    rarity: 'common',
    gender: 'girl',
    emoji: '🌹',
    gradient: 'from-rose-400 to-red-200',
    flavor: 'Wangi dan cantik.',
  },

  // Unisex — Common
  {
    id: 'cat-orange',
    name: 'Mio si Kucing',
    category: 'animal',
    rarity: 'common',
    gender: 'unisex',
    emoji: '🐱',
    gradient: 'from-orange-300 to-yellow-200',
    flavor: 'Suka tidur di sofa.',
  },
  {
    id: 'dog-brown',
    name: 'Boni si Anjing',
    category: 'animal',
    rarity: 'common',
    gender: 'unisex',
    emoji: '🐶',
    gradient: 'from-amber-300 to-orange-200',
    flavor: 'Selalu bersemangat berlari.',
  },
  {
    id: 'apple',
    name: 'Apel Merah',
    category: 'fruit',
    rarity: 'common',
    gender: 'unisex',
    emoji: '🍎',
    gradient: 'from-red-300 to-pink-200',
    flavor: 'Manis dan menyehatkan.',
  },
  {
    id: 'ice-cream',
    name: 'Es Krim Pelangi',
    category: 'food',
    rarity: 'common',
    gender: 'unisex',
    emoji: '🍦',
    gradient: 'from-pink-200 via-yellow-200 to-sky-200',
    flavor: 'Dingin segar di hari panas.',
  },

  // ═══════════════════════════════════════════
  // ─────────── RARE (9) ──────────────────────
  // ═══════════════════════════════════════════

  // Boy — Rare
  {
    id: 'robot-mini',
    name: 'Bibo Bot',
    category: 'robot',
    rarity: 'rare',
    gender: 'boy',
    emoji: '🤖',
    gradient: 'from-sky-300 to-indigo-200',
    flavor: 'Suka beep boop.',
  },
  {
    id: 'rocket',
    name: 'Roket Luar Angkasa',
    category: 'fantasy',
    rarity: 'rare',
    gender: 'boy',
    emoji: '🚀',
    gradient: 'from-indigo-300 to-violet-200',
    flavor: '3... 2... 1... meluncur!',
  },
  {
    id: 'monster-gloop',
    name: 'Gloop si Monster Slime',
    category: 'fantasy',
    rarity: 'rare',
    gender: 'boy',
    emoji: '👾',
    gradient: 'from-lime-300 to-green-200',
    flavor: 'Lengket tapi lucu.',
  },

  // Girl — Rare
  {
    id: 'rabbit',
    name: 'Lila si Kelinci',
    category: 'animal',
    rarity: 'rare',
    gender: 'girl',
    emoji: '🐰',
    gradient: 'from-pink-200 to-purple-200',
    flavor: 'Lompat-lompat sepanjang hari.',
  },
  {
    id: 'crown',
    name: 'Mahkota Putri',
    category: 'fantasy',
    rarity: 'rare',
    gender: 'girl',
    emoji: '👑',
    gradient: 'from-amber-300 to-yellow-200',
    flavor: 'Untuk si paling spesial.',
  },
  {
    id: 'pony',
    name: 'Kuda Poni Pelangi',
    category: 'animal',
    rarity: 'rare',
    gender: 'girl',
    emoji: '🐴',
    gradient: 'from-pink-300 via-purple-300 to-sky-300',
    flavor: 'Berlari dengan surai berwarna.',
  },

  // Unisex — Rare
  {
    id: 'panda',
    name: 'Pandi si Panda',
    category: 'animal',
    rarity: 'rare',
    gender: 'unisex',
    emoji: '🐼',
    gradient: 'from-slate-200 to-gray-100',
    flavor: 'Suka bambu.',
  },
  {
    id: 'fox',
    name: 'Foxi si Rubah',
    category: 'animal',
    rarity: 'rare',
    gender: 'unisex',
    emoji: '🦊',
    gradient: 'from-orange-300 to-rose-200',
    flavor: 'Cerdik dan penasaran.',
  },
  {
    id: 'star-golden',
    name: 'Bintang Emas',
    category: 'fantasy',
    rarity: 'rare',
    gender: 'unisex',
    emoji: '🌟',
    gradient: 'from-yellow-300 to-amber-200',
    flavor: 'Bersinar terang di malam hari.',
  },

  // ═══════════════════════════════════════════
  // ─────────── EPIC (6) ──────────────────────
  // ═══════════════════════════════════════════

  // Boy — Epic
  {
    id: 'dino-trex',
    name: 'Rexi T-Rex',
    category: 'dinosaur',
    rarity: 'epic',
    gender: 'boy',
    emoji: '🦖',
    gradient: 'from-emerald-400 to-lime-300',
    flavor: 'Auman menggetarkan.',
  },
  {
    id: 'mochi-monster',
    name: 'Mochi si Monster Bulu',
    category: 'fantasy',
    rarity: 'epic',
    gender: 'boy',
    emoji: '👹',
    gradient: 'from-violet-400 to-fuchsia-300',
    flavor: 'Seram tapi sebenarnya penakut.',
  },

  // Girl — Epic
  {
    id: 'unicorn',
    name: 'Uni si Unicorn',
    category: 'fantasy',
    rarity: 'epic',
    gender: 'girl',
    emoji: '🦄',
    gradient: 'from-pink-300 via-purple-300 to-blue-300',
    flavor: 'Berkilau pelangi.',
  },
  {
    id: 'mermaid',
    name: 'Mira si Putri Duyung',
    category: 'fantasy',
    rarity: 'epic',
    gender: 'girl',
    emoji: '🧜‍♀️',
    gradient: 'from-teal-300 via-cyan-300 to-blue-300',
    flavor: 'Bernyanyi di bawah laut.',
  },

  // Unisex — Epic
  {
    id: 'dragon',
    name: 'Drako si Naga Kecil',
    category: 'fantasy',
    rarity: 'epic',
    gender: 'unisex',
    emoji: '🐲',
    gradient: 'from-emerald-400 to-teal-300',
    flavor: 'Bisa terbang rendah.',
  },
  {
    id: 'astronaut-cat',
    name: 'Astro Cat',
    category: 'fantasy',
    rarity: 'epic',
    gender: 'unisex',
    emoji: '👨‍🚀',
    gradient: 'from-indigo-400 to-violet-300',
    flavor: 'Kucing yang ke luar angkasa.',
  },

  // ═══════════════════════════════════════════
  // ─────────── LEGENDARY (4) ─────────────────
  // ═══════════════════════════════════════════

  // Boy — Legendary
  {
    id: 'phoenix',
    name: 'Phoenix Emas',
    category: 'fantasy',
    rarity: 'legendary',
    gender: 'boy',
    emoji: '🔥',
    gradient: 'from-amber-400 via-orange-400 to-red-400',
    flavor: 'Burung api yang abadi.',
  },

  // Girl — Legendary
  {
    id: 'fairy-queen',
    name: 'Ratu Peri',
    category: 'fantasy',
    rarity: 'legendary',
    gender: 'girl',
    emoji: '🧚',
    gradient: 'from-pink-400 via-fuchsia-400 to-purple-400',
    flavor: 'Peri terkuat yang menyebarkan kebahagiaan.',
  },

  // Unisex — Legendary
  {
    id: 'rainbow-dragon',
    name: 'Naga Pelangi',
    category: 'fantasy',
    rarity: 'legendary',
    gender: 'unisex',
    emoji: '🌈',
    gradient: 'from-pink-400 via-yellow-300 via-green-400 to-blue-400',
    flavor: 'Naga paling langka, simbol persahabatan.',
  },
  {
    id: 'cosmic-whale',
    name: 'Paus Bintang',
    category: 'animal',
    rarity: 'legendary',
    gender: 'unisex',
    emoji: '🐋',
    gradient: 'from-indigo-400 via-purple-400 to-pink-400',
    flavor: 'Berenang di antara bintang-bintang.',
  },
];

/**
 * Get collectibles filtered by child gender (strict filter).
 * Boy → boy + unisex items only.
 * Girl → girl + unisex items only.
 */
export function getCollectiblesForGender(gender: Gender): Collectible[] {
  return COLLECTIBLES.filter((c) => c.gender === gender || c.gender === 'unisex');
}

/**
 * Get collectibles sorted by gender relevance (gender-match first, then unisex, then other).
 * Used in Shop UI where all items are visible but gender-relevant items show first.
 */
export function getCollectiblesSortedByGender(gender: Gender): Collectible[] {
  return [...COLLECTIBLES].sort((a, b) => {
    const scoreA = a.gender === gender ? 0 : a.gender === 'unisex' ? 1 : 2;
    const scoreB = b.gender === gender ? 0 : b.gender === 'unisex' ? 1 : 2;
    return scoreA - scoreB;
  });
}

export function getCollectiblesByRarity(rarity: Collectible['rarity']): Collectible[] {
  return COLLECTIBLES.filter((c) => c.rarity === rarity);
}

export function getCollectibleById(id: string): Collectible | undefined {
  return COLLECTIBLES.find((c) => c.id === id);
}
