// Firebase client setup. Optional: app works fully offline if env vars are missing.
//
// MVP strategy:
// - Anonymous Auth assigns a stable uid stored locally.
// - Firestore offline persistence is enabled when available so the app works without internet.
// - All gameplay state is sourced from Zustand (localStorage). Firestore is "best-effort sync"
//   and never blocks gameplay. This keeps the app safe when cloud is not configured.

import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import {
  getAuth,
  signInAnonymously,
  onAuthStateChanged,
  type Auth,
  type User,
} from 'firebase/auth';
import {
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
  type Firestore,
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export const isFirebaseEnabled =
  process.env.NEXT_PUBLIC_FIREBASE_ENABLED === 'true' &&
  Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);

let cachedApp: FirebaseApp | null = null;
let cachedAuth: Auth | null = null;
let cachedDb: Firestore | null = null;

export function getFirebaseApp(): FirebaseApp | null {
  if (!isFirebaseEnabled) return null;
  if (cachedApp) return cachedApp;
  cachedApp = getApps()[0] ?? initializeApp(firebaseConfig);
  return cachedApp;
}

export function getFirebaseAuth(): Auth | null {
  const app = getFirebaseApp();
  if (!app) return null;
  if (cachedAuth) return cachedAuth;
  cachedAuth = getAuth(app);
  return cachedAuth;
}

export function getFirebaseDb(): Firestore | null {
  const app = getFirebaseApp();
  if (!app) return null;
  if (cachedDb) return cachedDb;
  cachedDb = initializeFirestore(app, {
    localCache: persistentLocalCache({
      tabManager: persistentMultipleTabManager(),
    }),
  });
  return cachedDb;
}

/** Ensure user is anonymously signed in. Resolves to the Firebase user, or null when disabled. */
export async function ensureAnonymousUser(): Promise<User | null> {
  const auth = getFirebaseAuth();
  if (!auth) return null;

  if (auth.currentUser) return auth.currentUser;

  // Wait for any in-flight auth state, then sign in anonymously.
  const existing = await new Promise<User | null>((resolve) => {
    const unsub = onAuthStateChanged(auth, (u) => {
      unsub();
      resolve(u);
    });
  });
  if (existing) return existing;

  const cred = await signInAnonymously(auth);
  return cred.user;
}
