'use client';

// Feedback submission helper — writes to the `feedback` collection in Firestore.
//
// Storage shape (one doc per submission):
//   /feedback/{auto-id}
//     - title:       string  (1..100 chars)
//     - description: string  (1..2000 chars)
//     - uid:         string  (anonymous Firebase user uid; helps deduplicate)
//     - nickname:    string | null   (from profile, optional)
//     - age:         number | null   (from profile, optional, helps prioritize)
//     - createdAt:   server Timestamp
//     - userAgent:   string  (best-effort, helps debug device-specific issues)
//
// Security: see firestore.rules — auth users may CREATE only (no read/update/delete
// from the client). Admins read via Firebase Console.

import {
  addDoc,
  collection,
  serverTimestamp,
  type FirestoreError,
} from 'firebase/firestore';
import { ensureAnonymousUser, getFirebaseDb, isFirebaseEnabled } from '@/lib/firebase';

export const FEEDBACK_TITLE_MAX = 100;
export const FEEDBACK_BODY_MAX = 2000;

export interface FeedbackInput {
  title: string;
  description: string;
  /** Optional context attached at submission time. */
  nickname?: string | null;
  age?: number | null;
}

export type FeedbackResult =
  | { ok: true; id: string }
  | { ok: false; reason: 'disabled' | 'auth' | 'invalid' | 'network' | 'unknown'; message: string };

export async function submitFeedback(input: FeedbackInput): Promise<FeedbackResult> {
  const title = input.title.trim();
  const description = input.description.trim();

  if (!title || !description) {
    return { ok: false, reason: 'invalid', message: 'Judul dan deskripsi tidak boleh kosong.' };
  }
  if (title.length > FEEDBACK_TITLE_MAX) {
    return {
      ok: false,
      reason: 'invalid',
      message: `Judul terlalu panjang (maks ${FEEDBACK_TITLE_MAX} karakter).`,
    };
  }
  if (description.length > FEEDBACK_BODY_MAX) {
    return {
      ok: false,
      reason: 'invalid',
      message: `Deskripsi terlalu panjang (maks ${FEEDBACK_BODY_MAX} karakter).`,
    };
  }

  if (!isFirebaseEnabled) {
    return {
      ok: false,
      reason: 'disabled',
      message:
        'Fitur kirim umpan balik belum aktif di build ini. Coba lagi di versi terbaru ya.',
    };
  }

  const db = getFirebaseDb();
  if (!db) {
    return {
      ok: false,
      reason: 'disabled',
      message: 'Database belum siap. Coba beberapa saat lagi.',
    };
  }

  let user;
  try {
    user = await ensureAnonymousUser();
  } catch (err) {
    console.warn('[feedback] auth failed', err);
    return {
      ok: false,
      reason: 'auth',
      message: 'Gagal masuk anonim. Periksa koneksi internet ya.',
    };
  }
  if (!user) {
    return {
      ok: false,
      reason: 'auth',
      message: 'Belum ada sesi pengguna. Coba muat ulang halaman.',
    };
  }

  try {
    const ref = await addDoc(collection(db, 'feedback'), {
      title,
      description,
      uid: user.uid,
      nickname: input.nickname ?? null,
      age: input.age ?? null,
      createdAt: serverTimestamp(),
      userAgent:
        typeof navigator !== 'undefined' ? navigator.userAgent.slice(0, 300) : null,
    });
    return { ok: true, id: ref.id };
  } catch (err) {
    const fe = err as FirestoreError;
    console.warn('[feedback] write failed', fe);
    const isOffline =
      typeof navigator !== 'undefined' && navigator.onLine === false;
    return {
      ok: false,
      reason: isOffline ? 'network' : 'unknown',
      message: isOffline
        ? 'Sepertinya kamu sedang offline. Coba kirim lagi nanti ya.'
        : 'Gagal mengirim. Coba lagi sebentar.',
    };
  }
}
