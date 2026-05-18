'use client';

import { motion, useAnimationControls } from 'framer-motion';
import { sfx, playAudioCue, type AudioCue } from '@/lib/sfx';

type MoodKey = 'happy' | 'cheer' | 'thinking' | 'celebrate' | 'sleepy';

const MOODS: Record<MoodKey, { emoji: string; bubble?: string }> = {
  happy: { emoji: '🐻', bubble: 'Halo!' },
  cheer: { emoji: '🦊', bubble: 'Yuk semangat!' },
  thinking: { emoji: '🐰', bubble: 'Hmm...' },
  celebrate: { emoji: '🐼', bubble: 'Hebat sekali!' },
  sleepy: { emoji: '🐨', bubble: 'Z z z...' },
};

/**
 * Map an emoji to the audio cue that best matches its real animal voice.
 * Fantasy/non-animal emojis are not in this map — they fall back to a soft click.
 *
 * Note: bear-likes (🐻🐼🧸🐨) intentionally do NOT have a growl mapping —
 * a real bear growl can sound scary to small children. They fall through
 * to a friendly soft "pop" via the default click in handleClick.
 */
const EMOJI_TO_CUE: Record<string, AudioCue> = {
  // Foxes don't have a recording; we cheat with a dog bark (canid).
  '🦊': 'bark',
  '🐶': 'bark',
  '🐕': 'bark',
  // Cats
  '🐱': 'meow',
  '🐈': 'meow',
  // Rabbits don't have a real recording, fall back to a soft chirp via pop.
  '🐰': 'chirp',
  // Other animals
  '🐮': 'moo',
  '🐦': 'chirp',
  '🦆': 'quack',
  '🐸': 'ribbit',
  '🦁': 'lionRoar',
  '🐘': 'elephant',
  '🐝': 'buzz',
  '🐴': 'neigh',
};

interface Props {
  mood?: MoodKey;
  /** Show speech bubble above mascot */
  bubble?: string;
  /** Size in tailwind classes, e.g. 'text-6xl' */
  size?: string;
  /** Allow click bounce */
  interactive?: boolean;
  /** Optional override emoji (otherwise picked from mood) */
  emoji?: string;
}

export function Mascot({
  mood = 'happy',
  bubble,
  size = 'text-6xl',
  interactive = true,
  emoji,
}: Props) {
  const meta = MOODS[mood];
  const text = bubble ?? meta.bubble;
  const visual = emoji ?? meta.emoji;
  const controls = useAnimationControls();

  const handleClick = async () => {
    if (!interactive) return;
    // Play the character-appropriate sound (real recording when available).
    const cue = EMOJI_TO_CUE[visual];
    if (cue) {
      playAudioCue(cue);
    } else {
      sfx.click();
    }
    // Squish + small wiggle on tap.
    try {
      await controls.start({
        scale: [1, 1.18, 0.9, 1.05, 1],
        rotate: [0, -10, 10, -4, 0],
        transition: { duration: 0.55, ease: 'easeOut' },
      });
    } catch {
      // animation interrupted — fine
    }
  };

  return (
    <div className="relative inline-flex flex-col items-center">
      {text && (
        <motion.div
          initial={{ opacity: 0, y: 8, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
          className="relative mb-1 rounded-2xl bg-white px-3 py-1 text-sm font-bold text-slate-700 shadow-md"
        >
          {text}
          <span
            className="absolute -bottom-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 bg-white"
            aria-hidden
          />
        </motion.div>
      )}
      <motion.button
        type="button"
        onClick={interactive ? handleClick : undefined}
        animate={controls}
        whileTap={interactive ? { scale: 0.92 } : undefined}
        className={`${size} drop-shadow-lg ${interactive ? 'cursor-pointer' : 'cursor-default'}`}
        aria-label={
          interactive
            ? `Maskot ${mood} — ketuk untuk mendengar suaranya`
            : `Maskot ${mood}`
        }
        disabled={!interactive}
      >
        {visual}
      </motion.button>
    </div>
  );
}
