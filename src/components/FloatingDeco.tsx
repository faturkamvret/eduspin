'use client';

import { useMemo } from 'react';
import type { Gender } from '@/types';

const EMOJIS_BOY = ['⭐', '🚀', '⚽', '🦖', '🏎️', '✈️', '🤖', '💙', '🔵', '⚡'];
const EMOJIS_GIRL = ['⭐', '🦋', '🌸', '🌹', '💖', '👑', '🧁', '🎀', '💜', '✨'];
const DEFAULT_EMOJIS = ['⭐', '☁️', '🌈', '✨', '🎈', '💖', '🍬', '🌸'];

interface Props {
  /** Number of decorative items. Default: 12 */
  count?: number;
  /** Custom emoji set — overrides gender-based selection */
  emojis?: string[];
  /** Child gender — selects emoji set automatically when emojis not provided */
  gender?: Gender;
  /** Z-index relative to siblings. Default: behind everything (-z-10) */
  z?: 'back' | 'front';
}

/**
 * Decorative emojis sprinkled across the background.
 * Static (no animation) to keep the page light. Each item has a random
 * position, size, rotation, and opacity computed once on mount.
 *
 * Positioned `fixed` to the viewport so it covers the whole page even if
 * the parent is short.
 */
export function FloatingDeco({ count = 12, emojis, gender, z = 'back' }: Props) {
  const emojiSet =
    emojis ?? (gender === 'boy' ? EMOJIS_BOY : gender === 'girl' ? EMOJIS_GIRL : DEFAULT_EMOJIS);
  const items = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        emoji: emojiSet[Math.floor(Math.random() * emojiSet.length)]!,
        x: Math.random() * 90 + 5,
        y: Math.random() * 90 + 5,
        size: 18 + Math.random() * 26,
        rotate: Math.random() * 24 - 12,
        opacity: 0.28 + Math.random() * 0.32,
      })),
    [count, emojiSet],
  );

  return (
    <div
      aria-hidden
      className={`pointer-events-none fixed inset-0 ${z === 'back' ? '-z-10' : 'z-0'}`}
    >
      {items.map((it) => (
        <span
          key={it.id}
          style={{
            position: 'absolute',
            left: `${it.x}%`,
            top: `${it.y}%`,
            fontSize: it.size,
            opacity: it.opacity,
            transform: `rotate(${it.rotate}deg)`,
          }}
        >
          {it.emoji}
        </span>
      ))}
    </div>
  );
}
