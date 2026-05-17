'use client';

// Cloud sync engine: bridges Zustand store ↔ Firestore.
//
// Strategy (deliberately simple for MVP, single-device):
// - On boot: anonymous sign-in → fetch /profiles/{uid} doc.
//   - If cloud has data and is newer than local → hydrate store from cloud.
//   - If local has data and is newer or cloud is empty → push local up.
// - During session: subscribe to Zustand changes. Push to cloud (debounced 1.5s).
// - Conflict resolution: last-writer-wins by `updatedAt` (same-device usage = no conflict).
//
// Firestore offline persistence is enabled (in firebase.ts). When offline, writes queue
// and replay automatically. We surface this as 'offline' status in UI.
//
// Future (v1.1+): multi-device merge, separate sub-collections for collection items.

import { doc, getDoc, onSnapshot, setDoc, type Unsubscribe } from 'firebase/firestore';
import {
  ensureAnonymousUser,
  getFirebaseDb,
  isFirebaseEnabled,
} from '@/lib/firebase';
import { useAppStore, type CloudSnapshot } from '@/store/useAppStore';

const PUSH_DEBOUNCE_MS = 1500;

let started = false;
let unsubStore: (() => void) | null = null;
let unsubFirestore: Unsubscribe | null = null;
let pushTimer: ReturnType<typeof setTimeout> | null = null;
let onlineListenersAttached = false;
let lastPushedJson: string | null = null;
let suppressNextPush = false;

function snapshotFromStore(): CloudSnapshot {
  const s = useAppStore.getState();
  return {
    profile: s.profile,
    wallet: s.wallet,
    pity: s.pity,
    collection: s.collection,
    quizStats: s.quizStats,
    settings: s.settings,
  };
}

/** Heuristic "newest update" from any field's updatedAt. */
function snapshotUpdatedAt(snap: CloudSnapshot): number {
  return Math.max(
    snap.profile?.updatedAt ?? 0,
    snap.wallet.updatedAt,
    snap.pity.updatedAt,
    snap.collection.updatedAt,
    snap.quizStats.updatedAt,
  );
}

function isEmptySnapshot(snap: CloudSnapshot): boolean {
  return (
    snap.profile === null &&
    snap.wallet.totalEarned === 0 &&
    snap.pity.totalPulls === 0 &&
    Object.keys(snap.collection.items).length === 0 &&
    snap.quizStats.totalAnswered === 0
  );
}

async function pushToCloud(): Promise<void> {
  const db = getFirebaseDb();
  const uid = useAppStore.getState().cloudUid;
  if (!db || !uid) return;

  const snap = snapshotFromStore();
  const json = JSON.stringify(snap);
  if (json === lastPushedJson) return; // no-op if unchanged
  lastPushedJson = json;

  useAppStore.getState().setSyncStatus('syncing');
  try {
    await setDoc(doc(db, 'profiles', uid), {
      ...snap,
      _meta: {
        updatedAt: Date.now(),
        schemaVersion: 1,
      },
    });
    useAppStore.getState().markSynced();
  } catch (err) {
    console.warn('[sync] push failed', err);
    // Network errors → Firestore will retry automatically thanks to offline persistence.
    useAppStore.getState().setSyncStatus(navigator.onLine ? 'error' : 'offline');
  }
}

function schedulePush(): void {
  if (suppressNextPush) {
    suppressNextPush = false;
    return;
  }
  if (pushTimer) clearTimeout(pushTimer);
  pushTimer = setTimeout(() => {
    pushTimer = null;
    void pushToCloud();
  }, PUSH_DEBOUNCE_MS);
}

function attachOnlineListeners(): void {
  if (onlineListenersAttached) return;
  if (typeof window === 'undefined') return;
  onlineListenersAttached = true;

  const onOnline = () => {
    useAppStore.getState().setSyncStatus('synced');
    void pushToCloud();
  };
  const onOffline = () => {
    useAppStore.getState().setSyncStatus('offline');
  };
  window.addEventListener('online', onOnline);
  window.addEventListener('offline', onOffline);
}

/**
 * Start cloud sync. Idempotent; safe to call multiple times.
 * Resolves once the initial pull (or sign-in failure) is done.
 */
export async function startSync(): Promise<void> {
  if (!isFirebaseEnabled) {
    useAppStore.getState().setSyncStatus('disabled');
    return;
  }
  if (started) return;
  started = true;

  const store = useAppStore.getState();
  store.setSyncStatus('connecting');

  let user;
  try {
    user = await ensureAnonymousUser();
  } catch (err) {
    console.warn('[sync] anonymous sign-in failed', err);
    useAppStore.getState().setSyncStatus('error');
    started = false;
    return;
  }
  if (!user) {
    useAppStore.getState().setSyncStatus('disabled');
    started = false;
    return;
  }
  useAppStore.getState().setCloudUid(user.uid);

  const db = getFirebaseDb();
  if (!db) {
    useAppStore.getState().setSyncStatus('disabled');
    started = false;
    return;
  }

  // Initial reconcile: compare local vs cloud, choose newer.
  try {
    const ref = doc(db, 'profiles', user.uid);
    const cloudDoc = await getDoc(ref);
    const local = snapshotFromStore();
    const localUpdatedAt = snapshotUpdatedAt(local);

    if (cloudDoc.exists()) {
      const cloudData = cloudDoc.data() as Partial<CloudSnapshot> & {
        _meta?: { updatedAt?: number };
      };
      const cloudSnap: CloudSnapshot = {
        profile: cloudData.profile ?? null,
        wallet: cloudData.wallet ?? local.wallet,
        pity: cloudData.pity ?? local.pity,
        collection: cloudData.collection ?? local.collection,
        quizStats: cloudData.quizStats ?? local.quizStats,
        settings: cloudData.settings ?? local.settings,
      };
      const cloudUpdatedAt =
        cloudData._meta?.updatedAt ?? snapshotUpdatedAt(cloudSnap);

      if (isEmptySnapshot(local) && !isEmptySnapshot(cloudSnap)) {
        // Local empty (fresh device/cleared cache) → adopt cloud.
        suppressNextPush = true;
        useAppStore.getState().hydrateFromCloud(cloudSnap);
        lastPushedJson = JSON.stringify(cloudSnap);
      } else if (cloudUpdatedAt > localUpdatedAt && !isEmptySnapshot(cloudSnap)) {
        // Cloud strictly newer → adopt cloud.
        suppressNextPush = true;
        useAppStore.getState().hydrateFromCloud(cloudSnap);
        lastPushedJson = JSON.stringify(cloudSnap);
      } else {
        // Local is source of truth → push up.
        await pushToCloud();
      }
    } else if (!isEmptySnapshot(local)) {
      // No cloud doc yet but we have local progress → push.
      await pushToCloud();
    }
  } catch (err) {
    console.warn('[sync] initial reconcile failed', err);
    useAppStore.getState().setSyncStatus('error');
  }

  // Subscribe local store → debounced push.
  unsubStore = useAppStore.subscribe((state, prev) => {
    // Only react to actual data fields, ignore status fields.
    const dataChanged =
      state.profile !== prev.profile ||
      state.wallet !== prev.wallet ||
      state.pity !== prev.pity ||
      state.collection !== prev.collection ||
      state.quizStats !== prev.quizStats ||
      state.settings !== prev.settings;
    if (dataChanged) schedulePush();
  });

  // Subscribe cloud → reconcile if remote changes (e.g., another tab updated).
  unsubFirestore = onSnapshot(
    doc(db, 'profiles', user.uid),
    (snap) => {
      if (!snap.exists()) return;
      const data = snap.data() as Partial<CloudSnapshot> & {
        _meta?: { updatedAt?: number };
      };
      const local = snapshotFromStore();
      const remoteSnap: CloudSnapshot = {
        profile: data.profile ?? null,
        wallet: data.wallet ?? local.wallet,
        pity: data.pity ?? local.pity,
        collection: data.collection ?? local.collection,
        quizStats: data.quizStats ?? local.quizStats,
        settings: data.settings ?? local.settings,
      };
      const remoteJson = JSON.stringify(remoteSnap);
      // Skip our own writes — Firestore SDK still fires snapshot for them.
      if (remoteJson === lastPushedJson) {
        useAppStore.getState().markSynced();
        return;
      }
      // Otherwise this is a remote change. Last-writer-wins by updatedAt.
      const remoteUpdatedAt =
        data._meta?.updatedAt ?? snapshotUpdatedAt(remoteSnap);
      const localUpdatedAt = snapshotUpdatedAt(local);
      if (remoteUpdatedAt > localUpdatedAt) {
        suppressNextPush = true;
        useAppStore.getState().hydrateFromCloud(remoteSnap);
        lastPushedJson = remoteJson;
      }
    },
    (err) => {
      console.warn('[sync] snapshot error', err);
      useAppStore.getState().setSyncStatus(navigator.onLine ? 'error' : 'offline');
    },
  );

  attachOnlineListeners();
  useAppStore.getState().markSynced();
}

/** Stop sync (e.g., on logout or test teardown). */
export function stopSync(): void {
  if (pushTimer) clearTimeout(pushTimer);
  pushTimer = null;
  if (unsubStore) unsubStore();
  unsubStore = null;
  if (unsubFirestore) unsubFirestore();
  unsubFirestore = null;
  started = false;
  lastPushedJson = null;
  useAppStore.getState().setSyncStatus('disabled');
}

/** Force an immediate push (e.g., on tab close). Best-effort. */
export function flushSync(): void {
  if (pushTimer) {
    clearTimeout(pushTimer);
    pushTimer = null;
  }
  void pushToCloud();
}
