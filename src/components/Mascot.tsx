'use client';

import { motion, useAnimationControls } from 'framer-motion';
import { sfx } from '@/lib/sfx';

type MoodKey = 'happy' | 'cheer' | 'thinking' | 'celebrate' | 'sleepy';

const MOODS: Record<MoodKey, { emoji: string; bubble?: string }> = {
  happy: { emoji: '🐻', bubble: 'Halo!' },
  cheer: { emoji: '🦊', bubble: 'Yuk semangat!' },
  thinking: { emoji: '🐰', bubble: 'Hmm...' },
  celebrate: { emoji: '🐼', bubble: 'Hebat sekali!' },
  sleepy: { emoji: '🐨', bubble: 'Z z z...' },
};

const BEAR_EMOJIS = new Set(['🐻', '🐼', '🧸']);

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
    if (BEAR_EMOJIS.has(visual)) {
      sfx.bearGrowl();
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
          interactive && BEAR_EMOJIS.has(visual)
            ? `Maskot ${mood} — ketuk untuk mendengar suara beruang`
            : `Maskot ${mood}`
        }
        disabled={!interactive}
      >
        {visual}
      </motion.button>
    </div>
  );
}
