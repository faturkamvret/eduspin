import type { QuizCategoryId, QuizQuestion, QuizQuestionStats } from '@/types';
import { SHAPE_QUESTIONS } from './shape';
import { COLOR_QUESTIONS } from './color';
import { ANIMAL_QUESTIONS } from './animal';
import { COUNTING_QUESTIONS } from './counting';
import { ALPHABET_QUESTIONS } from './alphabet';
import { BODY_QUESTIONS } from './body';
import { FRUIT_QUESTIONS } from './fruit';
import { OPPOSITE_QUESTIONS } from './opposite';

export const ALL_QUESTIONS: QuizQuestion[] = [
  ...SHAPE_QUESTIONS,
  ...COLOR_QUESTIONS,
  ...ANIMAL_QUESTIONS,
  ...COUNTING_QUESTIONS,
  ...ALPHABET_QUESTIONS,
  ...BODY_QUESTIONS,
  ...FRUIT_QUESTIONS,
  ...OPPOSITE_QUESTIONS,
];

const BY_CATEGORY: Record<QuizCategoryId, QuizQuestion[]> = {
  shape: SHAPE_QUESTIONS,
  color: COLOR_QUESTIONS,
  animal: ANIMAL_QUESTIONS,
  counting: COUNTING_QUESTIONS,
  alphabet: ALPHABET_QUESTIONS,
  body: BODY_QUESTIONS,
  fruit: FRUIT_QUESTIONS,
  opposite: OPPOSITE_QUESTIONS,
};

export function getQuestionsByCategory(category: QuizCategoryId): QuizQuestion[] {
  return BY_CATEGORY[category] ?? [];
}

/**
 * Pick adaptive questions for a given child age. Includes questions whose
 * [ageMin, ageMax] window overlaps [age - tolerance, age + tolerance].
 * Falls back to "closest age" questions if filter would return empty.
 *
 * If `byQuestion` stats are provided, questions the child gets wrong more
 * often are sampled with higher probability. Recently-seen questions are
 * slightly de-prioritized so the same question doesn't repeat back-to-back.
 */
export function pickAdaptiveQuestions(
  category: QuizCategoryId,
  age: number,
  count: number,
  tolerance = 1,
  byQuestion?: Record<string, QuizQuestionStats>,
): QuizQuestion[] {
  const all = getQuestionsByCategory(category);
  const minOk = age - tolerance;
  const maxOk = age + tolerance;

  let pool = all.filter((q) => q.ageMax >= minOk && q.ageMin <= maxOk);
  if (pool.length === 0) {
    pool = [...all].sort((a, b) => {
      const da = Math.min(Math.abs(age - a.ageMin), Math.abs(age - a.ageMax));
      const db = Math.min(Math.abs(age - b.ageMin), Math.abs(age - b.ageMax));
      return da - db;
    });
  }

  // Without stats → simple shuffle (legacy behavior).
  if (!byQuestion) {
    return shuffle(pool).slice(0, Math.min(count, pool.length));
  }

  // ── Weighted sampling without replacement, weights from stats ──
  const now = Date.now();
  const weighted = pool.map((q) => ({ q, w: weightForQuestion(q.id, byQuestion, now) }));
  return weightedSampleWithoutReplacement(weighted, Math.min(count, pool.length));
}

/**
 * Compute sampling weight for a question.
 *
 * Heuristic:
 *  - Base weight = 1 (questions never seen).
 *  - Wrong-rate boosts weight up to 4x. A question always wrong is ~4x
 *    more likely to appear than one always right.
 *  - Recently-answered questions are slightly damped (avoid repeats within
 *    the same session) but only mildly so the wrong-rate signal dominates.
 */
function weightForQuestion(
  qid: string,
  byQuestion: Record<string, QuizQuestionStats>,
  now: number,
): number {
  const s = byQuestion[qid];
  if (!s || s.answered === 0) return 1.5; // slight bias to surface unseen items

  const wrongRate = 1 - s.correct / s.answered; // 0..1
  // 1 + 3*wrongRate → range 1..4
  let weight = 1 + 3 * wrongRate;

  // Recency damping: if seen in the last 60s, halve weight; last 5min, *0.75.
  const ageMs = now - s.lastAt;
  if (ageMs < 60_000) weight *= 0.5;
  else if (ageMs < 300_000) weight *= 0.75;

  // Mastery: if answered ≥3 times and always correct, lower it further.
  if (s.answered >= 3 && s.correct === s.answered) weight *= 0.6;

  return Math.max(0.1, weight);
}

function weightedSampleWithoutReplacement<T extends { q: QuizQuestion; w: number }>(
  items: T[],
  k: number,
): QuizQuestion[] {
  const remaining = [...items];
  const picked: QuizQuestion[] = [];
  for (let n = 0; n < k && remaining.length > 0; n++) {
    const totalW = remaining.reduce((s, it) => s + it.w, 0);
    let r = Math.random() * totalW;
    let chosen = 0;
    for (let i = 0; i < remaining.length; i++) {
      r -= remaining[i]!.w;
      if (r <= 0) {
        chosen = i;
        break;
      }
    }
    picked.push(remaining[chosen]!.q);
    remaining.splice(chosen, 1);
  }
  return picked;
}

function shuffle<T>(arr: T[]): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j]!, out[i]!];
  }
  return out;
}
