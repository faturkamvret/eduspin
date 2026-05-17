'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { formatNumber } from '@/lib/utils';

interface Props {
  coins: number;
  /** Show a +N pop animation when coins increases */
  animate?: boolean;
}

export function CoinBadge({ coins, animate = true }: Props) {
  const prev = useRef(coins);
  const [delta, setDelta] = useState<number | null>(null);

  useEffect(() => {
    if (!animate) {
      prev.current = coins;
      return;
    }
    const diff = coins - prev.current;
    if (diff > 0) {
      setDelta(diff);
      const t = setTimeout(() => setDelta(null), 1100);
      prev.current = coins;
      return () => clearTimeout(t);
    }
    prev.current = coins;
  }, [coins, animate]);

  return (
    <div className="relative inline-flex items-center gap-2 rounded-full bg-amber-100 px-4 py-1.5 shadow">
      <span aria-hidden className="text-xl">
        🪙
      </span>
      <span className="font-display text-lg font-bold text-amber-700">
        {formatNumber(coins)}
      </span>
      <AnimatePresence>
        {delta !== null && (
          <motion.span
            initial={{ y: 0, opacity: 0, scale: 0.8 }}
            animate={{ y: -28, opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="pointer-events-none absolute right-0 top-0 font-display text-base font-bold text-amber-600"
          >
            +{delta}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}
