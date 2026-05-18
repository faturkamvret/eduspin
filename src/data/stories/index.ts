import type { Story } from '@/types';
import { STORY_KANCIL_BUAYA } from './kancil-buaya';
import { STORY_KELINCI_KURAKURA } from './kelinci-kurakura';
import { STORY_TIMUN_MAS } from './timun-mas';
import { STORY_TIGA_BABI_KECIL } from './tiga-babi-kecil';
import { STORY_BEBEK_BURUK_RUPA } from './bebek-buruk-rupa';
import { STORY_SALING_MENOLONG } from './saling-menolong';
import { STORY_MEMBERI_MAKAN_KUCING } from './memberi-makan-kucing';
import { STORY_TOMI_BERKEBUN } from './tomi-berkebun';
import { STORY_SIKAT_GIGI_BERUANG } from './sikat-gigi-beruang';

/**
 * All stories available in EduSpin. Order = listing order on /stories page.
 *
 * Mix of two genres:
 * 1. Classic public-domain folktales (Kancil, Kelinci, Timun Mas, Tiga Babi,
 *    Bebek Buruk Rupa) — strong narrative arcs and moral lessons.
 * 2. Modern educational tales for early-childhood character building
 *    (Saling Menolong, Kucing, Berkebun, Sikat Gigi) — focus on real-world
 *    behaviors: empathy, compassion to animals, patience, hygiene.
 */
export const STORIES: Story[] = [
  // Folktales
  STORY_KANCIL_BUAYA,
  STORY_KELINCI_KURAKURA,
  STORY_TIMUN_MAS,
  STORY_TIGA_BABI_KECIL,
  STORY_BEBEK_BURUK_RUPA,
  // Character-building tales
  STORY_SALING_MENOLONG,
  STORY_MEMBERI_MAKAN_KUCING,
  STORY_TOMI_BERKEBUN,
  STORY_SIKAT_GIGI_BERUANG,
];

export function getStoryById(id: string): Story | undefined {
  return STORIES.find((s) => s.id === id);
}

export function getChapterById(
  storyId: string,
  chapterId: string,
): { story: Story; chapter: Story['chapters'][number] } | undefined {
  const story = getStoryById(storyId);
  if (!story) return undefined;
  const chapter = story.chapters.find((c) => c.id === chapterId);
  if (!chapter) return undefined;
  return { story, chapter };
}
