'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';
import { sfx } from '@/lib/sfx';
import {
  FEEDBACK_BODY_MAX,
  FEEDBACK_TITLE_MAX,
  submitFeedback,
} from '@/lib/feedback';

/**
 * Kritik & Saran modal — collects a title + description and submits to the
 * `feedback` Firestore collection. Closes on success after a short toast.
 *
 * Keyboard: Escape closes (when not submitting). Tab navigates within the
 * modal.
 */
export function FeedbackDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const profile = useAppStore((s) => s.profile);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const titleRef = useRef<HTMLInputElement | null>(null);

  // Reset form whenever the dialog opens.
  useEffect(() => {
    if (open) {
      setTitle('');
      setDescription('');
      setError(null);
      setSuccess(false);
      setSubmitting(false);
      // Focus the title field for fast typing.
      const t = setTimeout(() => titleRef.current?.focus(), 80);
      return () => clearTimeout(t);
    }
  }, [open]);

  // Escape to close.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !submitting) {
        onClose();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, submitting, onClose]);

  const titleTrim = title.trim();
  const descTrim = description.trim();
  const canSubmit =
    !submitting &&
    titleTrim.length > 0 &&
    titleTrim.length <= FEEDBACK_TITLE_MAX &&
    descTrim.length > 0 &&
    descTrim.length <= FEEDBACK_BODY_MAX;

  async function handleSubmit() {
    if (!canSubmit) return;
    setSubmitting(true);
    setError(null);
    sfx.click();

    const r = await submitFeedback({
      title: titleTrim,
      description: descTrim,
      nickname: profile?.nickname ?? null,
      age: profile?.age ?? null,
    });

    if (r.ok) {
      sfx.coin();
      setSuccess(true);
      setSubmitting(false);
      // Auto-close shortly after success message.
      setTimeout(() => {
        onClose();
      }, 1500);
    } else {
      setSubmitting(false);
      setError(r.message);
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-3 sm:items-center"
          aria-modal="true"
          role="dialog"
          aria-labelledby="feedback-dialog-title"
          onClick={() => {
            if (!submitting) onClose();
          }}
        >
          <motion.div
            key="card"
            initial={{ scale: 0.85, y: 40, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 30, opacity: 0 }}
            transition={{ type: 'spring', damping: 18, stiffness: 240 }}
            className="card w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-xs font-bold uppercase tracking-wide text-slate-500">
                  Bantu kami menjadi lebih baik
                </div>
                <h2
                  id="feedback-dialog-title"
                  className="font-display text-xl font-extrabold text-slate-800"
                >
                  📝 Kritik &amp; Saran
                </h2>
              </div>
              <button
                type="button"
                aria-label="Tutup"
                disabled={submitting}
                onClick={() => {
                  sfx.click();
                  onClose();
                }}
                className="rounded-full bg-slate-100 px-3 py-1 font-display text-sm font-bold text-slate-600 shadow-inner transition-colors hover:bg-slate-200 disabled:opacity-50"
              >
                ✕
              </button>
            </div>

            {success ? (
              <div className="mt-4 flex flex-col items-center gap-2 py-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1, rotate: [0, -10, 10, 0] }}
                  transition={{ type: 'spring', damping: 12 }}
                  className="text-6xl"
                  aria-hidden
                >
                  💌
                </motion.div>
                <div className="font-display text-lg font-extrabold text-emerald-600">
                  Terima kasih!
                </div>
                <p className="text-center text-sm font-semibold text-slate-600">
                  Masukanmu sudah kami terima ✨
                </p>
              </div>
            ) : (
              <div className="mt-4 flex flex-col gap-3">
                <label className="flex flex-col gap-1.5">
                  <span className="text-xs font-bold uppercase tracking-wide text-slate-500">
                    Judul
                  </span>
                  <input
                    ref={titleRef}
                    type="text"
                    value={title}
                    maxLength={FEEDBACK_TITLE_MAX}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Mis: Tambahkan kategori sains"
                    disabled={submitting}
                    className="w-full rounded-2xl border-4 border-primary-200 bg-white px-4 py-2.5 font-display text-base font-bold outline-none transition-colors focus:border-primary-400 disabled:opacity-50"
                  />
                  <span className="self-end text-[10px] font-semibold text-slate-400">
                    {title.length}/{FEEDBACK_TITLE_MAX}
                  </span>
                </label>

                <label className="flex flex-col gap-1.5">
                  <span className="text-xs font-bold uppercase tracking-wide text-slate-500">
                    Isi / Deskripsi
                  </span>
                  <textarea
                    value={description}
                    maxLength={FEEDBACK_BODY_MAX}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Ceritakan saranmu, atau bug yang ditemukan..."
                    rows={5}
                    disabled={submitting}
                    className="w-full resize-none rounded-2xl border-4 border-primary-200 bg-white px-4 py-2.5 font-medium leading-relaxed outline-none transition-colors focus:border-primary-400 disabled:opacity-50"
                  />
                  <span className="self-end text-[10px] font-semibold text-slate-400">
                    {description.length}/{FEEDBACK_BODY_MAX}
                  </span>
                </label>

                {error && (
                  <div
                    className="rounded-2xl bg-rose-100 px-4 py-2 text-sm font-semibold text-rose-700"
                    role="alert"
                  >
                    {error}
                  </div>
                )}

                <div className="mt-1 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    className="btn-ghost"
                    onClick={() => {
                      sfx.click();
                      onClose();
                    }}
                    disabled={submitting}
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={handleSubmit}
                    disabled={!canSubmit}
                  >
                    {submitting ? 'Mengirim…' : 'Kirim 📨'}
                  </button>
                </div>
                <p className="text-center text-[11px] font-semibold text-slate-500">
                  Tidak ada data pribadi anak yang dikirim selain pesan ini.
                </p>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
