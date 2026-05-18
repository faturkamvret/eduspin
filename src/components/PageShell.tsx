'use client';

import { useRouter } from 'next/navigation';
import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { sfx } from '@/lib/sfx';
import { FloatingDeco } from '@/components/FloatingDeco';

interface Props {
  title: string;
  children: ReactNode;
  showBack?: boolean;
  right?: ReactNode;
  /** Show floating deco bg. Default true. */
  deco?: boolean;
  /**
   * Optional explicit back destination. When provided, the back button
   * navigates to this path instead of `router.back()`. Use this to break
   * navigation loops (e.g., when a child page redirects to itself).
   */
  backHref?: string;
}

export function PageShell({
  title,
  children,
  showBack = true,
  right,
  deco = true,
  backHref,
}: Props) {
  const router = useRouter();
  return (
    <main className="relative flex flex-1 flex-col gap-4 px-4 py-4">
      {deco && <FloatingDeco count={10} />}
      <header className="flex items-center justify-between gap-2">
        {showBack ? (
          <motion.button
            type="button"
            whileTap={{ scale: 0.92 }}
            onClick={() => {
              sfx.click();
              if (backHref) {
                router.push(backHref);
              } else {
                router.back();
              }
            }}
            className="rounded-full bg-white px-4 py-2 font-display text-sm font-bold shadow-kid transition-all hover:bg-slate-50"
            aria-label="Kembali"
          >
            ← Kembali
          </motion.button>
        ) : (
          <span />
        )}
        <h1 className="font-display text-xl font-extrabold text-slate-800 drop-shadow">
          {title}
        </h1>
        <div>{right ?? <span className="block w-12" />}</div>
      </header>
      {children}
    </main>
  );
}
