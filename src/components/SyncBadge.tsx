'use client';

import { useAppStore, type SyncStatus } from '@/store/useAppStore';
import { isFirebaseEnabled } from '@/lib/firebase';

interface Props {
  variant?: 'compact' | 'full';
}

const META: Record<SyncStatus, { icon: string; label: string; tone: string }> = {
  disabled:    { icon: '💾', label: 'Lokal',       tone: 'text-slate-500' },
  connecting:  { icon: '🔄', label: 'Menghubungkan…', tone: 'text-slate-500' },
  syncing:     { icon: '🔄', label: 'Menyimpan…',  tone: 'text-blue-600' },
  synced:      { icon: '☁️', label: 'Tersimpan',   tone: 'text-emerald-600' },
  offline:     { icon: '📡', label: 'Offline',     tone: 'text-amber-600' },
  error:       { icon: '⚠️', label: 'Gagal sync',  tone: 'text-rose-600' },
};

export function SyncBadge({ variant = 'compact' }: Props) {
  const status = useAppStore((s) => s.syncStatus);
  const lastSyncedAt = useAppStore((s) => s.lastSyncedAt);

  if (!isFirebaseEnabled && variant === 'compact') return null;

  const meta = META[status];

  if (variant === 'compact') {
    return (
      <span
        className={`inline-flex items-center gap-1 rounded-full bg-white/70 px-2 py-0.5 text-xs font-semibold ${meta.tone}`}
        aria-label={`Status sync: ${meta.label}`}
      >
        <span aria-hidden>{meta.icon}</span>
        <span className="hidden sm:inline">{meta.label}</span>
      </span>
    );
  }

  return (
    <div className={`flex items-center gap-2 ${meta.tone}`}>
      <span className="text-xl" aria-hidden>
        {meta.icon}
      </span>
      <div className="flex-1">
        <div className="font-semibold">{meta.label}</div>
        {lastSyncedAt && (
          <div className="text-xs text-slate-500">
            Terakhir disinkronkan: {new Date(lastSyncedAt).toLocaleTimeString('id-ID')}
          </div>
        )}
        {!isFirebaseEnabled && (
          <div className="text-xs text-slate-500">
            Cloud sync belum dikonfigurasi. Data hanya tersimpan di perangkat ini.
          </div>
        )}
      </div>
    </div>
  );
}
