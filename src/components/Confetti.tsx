'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useMemo } from 'react';

interface Props {
  show: boolean;
  /** Number of particles. Default: 30 */
  count?: number;
  /** Emojis to use. Random pick per particle. */
  emojis?: string[];
}

const DEFAULT_EMOJIS = ['🎉', '⭐', '✨', '💖', '🌟', '🎊', '🎈', '🍭'];

/**
 * Lightweight emoji confetti burst.
 * No external library — just framer-motion + emojis falling/spinning.
 */
export function Confetti({ show, count = 30, emojis = DEFAULT_EMOJIS }: Props) {
  // Stable random positions per render of the burst
  const particles = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        emoji: emojis[Math.floor(Math.random() * emojis.length)]!,
        x: Math.random() * 100, // vw %
        delay: Math.random() * 0.3,
        duration: 1.4 + Math.random() * 1.2,
        rotate: Math.random() * 720 - 360,
        size: 18 + Math.random() * 18,
      })),
    // Regenerate when show flips on
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [show, count],
  );

  return (
    <AnimatePresence>
      {show && (
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 z-[100] overflow-hidden"
        >
          {particles.map((p) => (
            <motion.span
              key={p.id}
              initial={{ y: -60, x: `${p.x}vw`, rotate: 0, opacity: 1 }}
              animate={{
                y: '110vh',
                rotate: p.rotate,
                opacity: [1, 1, 0],
              }}
              exit={{ opacity: 0 }}
              transition={{
                duration: p.duration,
                delay: p.delay,
                ease: 'easeIn',
              }}
              style={{ fontSize: p.size, position: 'absolute', top: 0 }}
            >
              {p.emoji}
            </motion.span>
          ))}
        </div>
      )}
    </AnimatePresence>
  );
}
