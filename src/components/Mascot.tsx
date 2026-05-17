'use client';

import { motion } from 'framer-motion';

type MoodKey = 'happy' | 'cheer' | 'thinking' | 'celebrate' | 'sleepy';

const MOODS: Record<MoodKey, { emoji: string; bubble?: string }> = {
  happy: { emoji: '🐻', bubble: 'Halo!' },
  cheer: { emoji: '🦊', bubble: 'Yuk semangat!' },
  thinking: { emoji: '🐰', bubble: 'Hmm...' },
  celebrate: { emoji: '🐼', bubble: 'Hebat sekali!' },
  sleepy: { emoji: '🐨', bubble: 'Z z z...' },
};

interface Props {
  mood?: MoodKey;
  /** Show speech bubble above mascot */
  bubble?: string;
  /** Size in tailwind classes, e.g. 'text-6xl' */
  size?: string;
  /** Allow click bounce */
  interactive?: boolean;
}

export function Mascot({
  mood = 'happy',
  bubble,
  size = 'text-6xl',
  interactive = true,
}: Props) {
  const meta = MOODS[mood];
  const text = bubble ?? meta.bubble;

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
        whileTap={interactive ? { scale: 0.85, rotate: -8 } : undefined}
        whileHover={interactive ? { scale: 1.06, rotate: 4 } : undefined}
        animate={{
          y: [0, -6, 0],
          rotate: [-2, 2, -2],
        }}
        transition={{
          repeat: Infinity,
          duration: 2.2,
          ease: 'easeInOut',
        }}
        className={`${size} drop-shadow-lg`}
        aria-label={`Mascot ${mood}`}
      >
        {meta.emoji}
      </motion.button>
    </div>
  );
}
