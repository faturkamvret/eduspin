'use client';

import { useEffect, useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

/**
 * Lightweight tap-burst particle effect — a few emoji that fly upward from
 * a tap point, scale up slightly, then fade out. Kept short (700ms) and
 * small (4 particles) to stay light on performance.
 *
 * Usage: place `<TapBurst />` once in a layout and call `triggerTapBurst(x, y)`
 * via the exported hook.
 *
 * Designed for kid feedback: the visual cause-and-effect amplifies the sense
 * of "the screen reacts to me" without piling on more global animations.
 */

interface Particle {
  id: number;
  x: number;
  y: number;
  emoji: string;
  dx: number;
  dy: number;
}

const PARTICLE_EMOJIS = ['⭐', '✨', '💖', '🌟'];
let particleId = 0;
let listener: ((x: number, y: number, emoji?: string) => void) | null = null;

/**
 * Trigger a tap-burst at the given client coords. No-op when no provider is
 * mounted (e.g. SSR or during the very first render before mount).
 */
export function triggerTapBurst(x: number, y: number, emoji?: string): void {
  listener?.(x, y, emoji);
}

export function TapBurstProvider() {
  const [particles, setParticles] = useState<Particle[]>([]);

  const trigger = useCallback((x: number, y: number, emoji?: string) => {
    const baseId = ++particleId;
    const chosen = emoji ?? PARTICLE_EMOJIS[Math.floor(Math.random() * PARTICLE_EMOJIS.length)]!;
    const next: Particle[] = Array.from({ length: 4 }, (_, i) => ({
      id: baseId * 10 + i,
      x,
      y,
      emoji: chosen,
      dx: (Math.random() - 0.5) * 60,
      dy: -50 - Math.random() * 40,
    }));
    setParticles((cur) => [...cur, ...next]);
    // Auto-cleanup after animation finishes.
    setTimeout(() => {
      const ids = new Set(next.map((p) => p.id));
      setParticles((cur) => cur.filter((p) => !ids.has(p.id)));
    }, 800);
  }, []);

  useEffect(() => {
    listener = trigger;
    return () => {
      listener = null;
    };
  }, [trigger]);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[60]"
      style={{ contain: 'layout paint' }}
    >
      <AnimatePresence>
        {particles.map((p) => (
          <motion.span
            key={p.id}
            initial={{ x: p.x, y: p.y, scale: 0.3, opacity: 1 }}
            animate={{
              x: p.x + p.dx,
              y: p.y + p.dy,
              scale: 1.4,
              opacity: 0,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            style={{
              position: 'fixed',
              left: 0,
              top: 0,
              fontSize: 24,
              willChange: 'transform, opacity',
            }}
          >
            {p.emoji}
          </motion.span>
        ))}
      </AnimatePresence>
    </div>
  );
}
