import type { Story } from '@/types';
import { STORY_KANCIL_BUAYA } from './kancil-buaya';
import { STORY_KELINCI_KURAKURA } from './kelinci-kurakura';

/**
 * All stories available in EduSpin. Order = listing order on /stories page.
 */
export const STORIES: Story[] = [STORY_KANCIL_BUAYA, STORY_KELINCI_KURAKURA];

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
