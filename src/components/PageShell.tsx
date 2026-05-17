'use client';

import { useRouter } from 'next/navigation';
import type { ReactNode } from 'react';

interface Props {
  title: string;
  children: ReactNode;
  showBack?: boolean;
  right?: ReactNode;
}

export function PageShell({ title, children, showBack = true, right }: Props) {
  const router = useRouter();
  return (
    <main className="flex flex-1 flex-col gap-4 px-4 py-4">
      <header className="flex items-center justify-between">
        {showBack ? (
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-full bg-white/70 px-3 py-1.5 text-sm font-semibold shadow"
            aria-label="Kembali"
          >
            ← Kembali
          </button>
        ) : (
          <span />
        )}
        <h1 className="font-display text-xl font-bold text-slate-800">{title}</h1>
        <div>{right}</div>
      </header>
      {children}
    </main>
  );
}
