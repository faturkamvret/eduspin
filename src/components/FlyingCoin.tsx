'use client';

import { useEffect, useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

/**
 * Flying-coin animation: spawns a 🪙 emoji that floats from a source point
 * (where the kid earned it) toward the coin badge in the top-right header.
 *
 * Trigger via the exported `triggerFlyingCoin(fromX, fromY)` function. The
 * destination is computed at fire time by reading the bounding rect of any
 * element with `data-coin-target` (the CoinBadge component).
 */

interface Flyer {
  id: number;
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  count: number;
}

let flyerId = 0;
let listener: ((from: { x: number; y: number }, count?: number) => void) | null = null;

export function triggerFlyingCoin(from: { x: number; y: number }, count = 1): void {
  listener?.(from, count);
}

function getCoinTarget(): { x: number; y: number } | null {
  if (typeof document === 'undefined') return null;
  const el = document.querySelector('[data-coin-target]');
  if (!el) return null;
  const r = el.getBoundingClientRect();
  return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
}

export function FlyingCoinProvider() {
  const [flyers, setFlyers] = useState<Flyer[]>([]);

  const trigger = useCallback((from: { x: number; y: number }, count = 1) => {
    const target = getCoinTarget();
    if (!target) return; // No badge mounted — silently skip.
    const id = ++flyerId;
    setFlyers((cur) => [
      ...cur,
      { id, fromX: from.x, fromY: from.y, toX: target.x, toY: target.y, count },
    ]);
    setTimeout(() => {
      setFlyers((cur) => cur.filter((f) => f.id !== id));
    }, 900);
  }, []);

  useEffect(() => {
    listener = trigger;
    return () => {
      listener = null;
    };
  }, [trigger]);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[55]">
      <AnimatePresence>
        {flyers.map((f) => (
          <motion.span
            key={f.id}
            initial={{ x: f.fromX, y: f.fromY, scale: 0.6, opacity: 0 }}
            animate={{
              x: [f.fromX, f.fromX + (f.toX - f.fromX) * 0.5, f.toX],
              y: [f.fromY, f.fromY - 80, f.toY],
              scale: [0.6, 1.5, 0.9],
              opacity: [0, 1, 1, 0.8],
              rotate: [0, 360],
            }}
            transition={{ duration: 0.8, ease: 'easeOut', times: [0, 0.5, 1] }}
            style={{
              position: 'fixed',
              left: 0,
              top: 0,
              fontSize: 32,
              willChange: 'transform, opacity',
              filter: 'drop-shadow(0 4px 8px rgba(234,179,8,0.5))',
            }}
          >
            🪙
          </motion.span>
        ))}
      </AnimatePresence>
    </div>
  );
}
