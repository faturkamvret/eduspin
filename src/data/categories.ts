import type { QuizCategoryMeta } from '@/types';

export const QUIZ_CATEGORIES: QuizCategoryMeta[] = [
  {
    id: 'shape',
    label: 'Bentuk',
    emoji: '🔺',
    description: 'Belajar lingkaran, segitiga, persegi, dan teman-temannya',
    color: 'bg-pink-400',
  },
  {
    id: 'color',
    label: 'Warna',
    emoji: '🎨',
    description: 'Kenali merah, biru, hijau, dan warna seru lainnya',
    color: 'bg-sky-400',
  },
  {
    id: 'animal',
    label: 'Hewan',
    emoji: '🐶',
    description: 'Hewan apa ya? Dengarkan suaranya juga!',
    color: 'bg-emerald-400',
  },
  {
    id: 'counting',
    label: 'Berhitung',
    emoji: '🔢',
    description: 'Hitung benda-benda lucu dengan angka',
    color: 'bg-amber-400',
  },
  {
    id: 'alphabet',
    label: 'Huruf',
    emoji: '🔤',
    description: 'Mengenal huruf A sampai Z dan kata-katanya',
    color: 'bg-violet-400',
  },
  {
    id: 'body',
    label: 'Tubuh',
    emoji: '👶',
    description: 'Bagian tubuh: mata, hidung, mulut, telinga…',
    color: 'bg-rose-400',
  },
  {
    id: 'fruit',
    label: 'Buah',
    emoji: '🍓',
    description: 'Kenali aneka buah yang lezat dan sehat',
    color: 'bg-orange-400',
  },
  {
    id: 'opposite',
    label: 'Lawan Kata',
    emoji: '↔️',
    description: 'Besar–kecil, panas–dingin, dan teman-temannya',
    color: 'bg-teal-400',
  },
];

export function getCategoryMeta(id: string): QuizCategoryMeta | undefined {
  return QUIZ_CATEGORIES.find((c) => c.id === id);
}
