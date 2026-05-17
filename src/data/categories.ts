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
];

export function getCategoryMeta(id: string): QuizCategoryMeta | undefined {
  return QUIZ_CATEGORIES.find((c) => c.id === id);
}
