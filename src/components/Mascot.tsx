'use client';

import { motion, useAnimationControls } from 'framer-motion';
import { sfx } from '@/lib/sfx';

type MoodKey = 'happy' | 'cheer' | 'thinking' | 'celebrate' | 'sleepy';

const MOODS: Record<MoodKey, { emoji: string; bubble?: string; sound: () => void }> = {
  happy: { emoji: '🐻', bubble: 'Halo!', sound: () => sfx.bearGrowl() },
  cheer: { emoji: '🦊', bubble: 'Yuk semangat!', sound: () => sfx.bark() },
  thinking: { emoji: '🐰', bubble: 'Hmm...', sound: () => sfx.click() },
  celebrate: { emoji: '🐼', bubble: 'Hebat sekali!', sound: () => sfx.fanfare() },
  sleepy: { emoji: '🐨', bubble: 'Z z z...', sound: () => sfx.click() },
};

interface Props {
  mood?: MoodKey;
  /** Show speech bubble above mascot */
  bubble?: string;
  /** Size in tailwind classes, e.g. 'text-6xl' */
  size?: string;
  /** Allow click bounce + sfx */
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
  const controls = useAnimationControls();

  function handleClick() {
    if (!interactive) return;
    meta.sound();
    // Squish + happy bounce
    void controls.start({
      scale: [1, 0.85, 1.18, 0.95, 1.05, 1],
      rotate: [0, -10, 10, -6, 4, 0],
      transition: { duration: 0.7, ease: 'easeOut' },
    });
  }

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
        onClick={handleClick}
        whileHover={interactive ? { scale: 1.06, rotate: 4 } : undefined}
        animate={controls}
        className={`${size} drop-shadow-lg`}
        aria-label={`Mascot ${mood} — tap to interact`}
      >
        {meta.emoji}
      </motion.button>
    </div>
  );
}
