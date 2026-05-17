import type { QuizCategoryId, QuizQuestion } from '@/types';
import { SHAPE_QUESTIONS } from './shape';
import { COLOR_QUESTIONS } from './color';
import { ANIMAL_QUESTIONS } from './animal';
import { COUNTING_QUESTIONS } from './counting';

export const ALL_QUESTIONS: QuizQuestion[] = [
  ...SHAPE_QUESTIONS,
  ...COLOR_QUESTIONS,
  ...ANIMAL_QUESTIONS,
  ...COUNTING_QUESTIONS,
];

const BY_CATEGORY: Record<QuizCategoryId, QuizQuestion[]> = {
  shape: SHAPE_QUESTIONS,
  color: COLOR_QUESTIONS,
  animal: ANIMAL_QUESTIONS,
  counting: COUNTING_QUESTIONS,
};

export function getQuestionsByCategory(category: QuizCategoryId): QuizQuestion[] {
  return BY_CATEGORY[category] ?? [];
}

/**
 * Pick adaptive questions for a given child age. Includes questions whose
 * [ageMin, ageMax] window overlaps [age - tolerance, age + tolerance].
 * Falls back to "closest age" questions if filter would return empty.
 */
export function pickAdaptiveQuestions(
  category: QuizCategoryId,
  age: number,
  count: number,
  tolerance = 1,
): QuizQuestion[] {
  const all = getQuestionsByCategory(category);
  const minOk = age - tolerance;
  const maxOk = age + tolerance;

  let pool = all.filter((q) => q.ageMax >= minOk && q.ageMin <= maxOk);
  if (pool.length === 0) {
    // fallback: sort by distance from age and take some
    pool = [...all].sort((a, b) => {
      const da = Math.min(Math.abs(age - a.ageMin), Math.abs(age - a.ageMax));
      const db = Math.min(Math.abs(age - b.ageMin), Math.abs(age - b.ageMax));
      return da - db;
    });
  }

  return shuffle(pool).slice(0, Math.min(count, pool.length));
}

function shuffle<T>(arr: T[]): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j]!, out[i]!];
  }
  return out;
}
