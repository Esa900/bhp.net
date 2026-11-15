import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDocFromServer,
  getDoc,
  setDoc,
  serverTimestamp,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

export const BOOTSTRAPPED_ADMIN_EMAIL = 'mdesaali391@gmail.com';
export const BHP_FIREBASE_AUTH_EVENT = 'bhp_firebase_auth_changed';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export interface FirebaseDomainAuthGuide {
  hostname: string;
  projectId: string;
  authSettingsUrl: string;
  unauthorizedDomain: string | null;
}

let isAdminStatusCached = false;
let lastUnauthorizedDomain: string | null = null;
let expressAvailableCached: boolean | null = null;

export function getFirebaseDomainAuthGuide(): FirebaseDomainAuthGuide {
  const hostname = typeof window !== 'undefined' ? window.location.hostname : '';
  const projectId = firebaseConfig.projectId;
  return {
    hostname,
    projectId,
    authSettingsUrl: `https://console.firebase.google.com/project/${projectId}/authentication/settings`,
    unauthorizedDomain: lastUnauthorizedDomain,
  };
}

export async function checkExpressBackendAvailable(forceRefresh = false): Promise<boolean> {
  if (typeof window === 'undefined') return false;
  if (!forceRefresh && expressAvailableCached === true) {
    return true;
  }
  try {
    const res = await fetch('/api/posts', { method: 'GET', cache: 'no-store' });
    const ct = (res.headers.get('content-type') || '').toLowerCase();
    expressAvailableCached = res.ok && ct.includes('application/json');
  } catch {
    expressAvailableCached = false;
  }
  return expressAvailableCached;
}

export function isFirebaseAdminReady(): boolean {
  const user = auth.currentUser;
  if (!user || !user.emailVerified) return false;
  if (user.email?.toLowerCase() === BOOTSTRAPPED_ADMIN_EMAIL.toLowerCase()) return true;
  return isAdminStatusCached;
}

export async function verifyAndSyncAdminStatus(user: User | null): Promise<boolean> {
  if (!user || !user.emailVerified) {
    isAdminStatusCached = false;
    return false;
  }

  const emailLower = (user.email || '').toLowerCase();
  const isBootstrapped = emailLower === BOOTSTRAPPED_ADMIN_EMAIL.toLowerCase();

  try {
    const adminRef = doc(db, 'admins', user.uid);
    const snap = await getDoc(adminRef);
    if (snap.exists()) {
      isAdminStatusCached = true;
      return true;
    }

    if (isBootstrapped) {
      await setDoc(adminRef, {
        uid: user.uid,
        email: user.email || BOOTSTRAPPED_ADMIN_EMAIL,
        createdAt: serverTimestamp(),
      });
      isAdminStatusCached = true;
      return true;
    }
  } catch (err) {
    if (isBootstrapped) {
      isAdminStatusCached = true;
      return true;
    }
    console.warn('Admin verification check note:', err);
  }

  isAdminStatusCached = isBootstrapped;
  return isBootstrapped;
}

export async function signInWithFirebaseGoogle(): Promise<{
  user: User;
  isAdmin: boolean;
}> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    lastUnauthorizedDomain = null;
    const user = result.user;
    const isAdmin = await verifyAndSyncAdminStatus(user);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent(BHP_FIREBASE_AUTH_EVENT, {
          detail: { user, isAdmin, unauthorizedDomain: null },
        })
      );
    }
    return { user, isAdmin };
  } catch (err: any) {
    const code = err?.code || '';
    const msg = err?.message || '';
    const hostname = typeof window !== 'undefined' ? window.location.hostname : '';

    if (code === 'auth/unauthorized-domain' || msg.includes('unauthorized-domain')) {
      lastUnauthorizedDomain = hostname;
      if (typeof window !== 'undefined') {
        window.dispatchEvent(
          new CustomEvent(BHP_FIREBASE_AUTH_EVENT, {
            detail: { user: auth.currentUser, isAdmin: isFirebaseAdminReady(), unauthorizedDomain: hostname },
          })
        );
      }
      const friendly = new Error(
        `Domain "${hostname}" Firebase Auth-এ যুক্ত নেই (auth/unauthorized-domain)। Firebase Console > Authentication > Settings > Authorized domains-এ "${hostname}" যোগ করুন।`
      ) as Error & { code?: string };
      friendly.code = 'auth/unauthorized-domain';
      throw friendly;
    }

    if (code === 'auth/popup-blocked') {
      const friendly = new Error(
        'ব্রাউজারে Google Sign-In পপআপ ব্লক হয়েছে। দয়া করে Popups Allow করে আবার ক্লিক করুন।'
      ) as Error & { code?: string };
      friendly.code = 'auth/popup-blocked';
      throw friendly;
    }

    throw err;
  }
}

export async function signOutFirebase(): Promise<void> {
  isAdminStatusCached = false;
  await signOut(auth);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent(BHP_FIREBASE_AUTH_EVENT, {
        detail: { user: null, isAdmin: false, unauthorizedDomain: lastUnauthorizedDomain },
      })
    );
  }
}

let authInitResolve: (() => void) | null = null;
const authReadyPromise = new Promise<void>((resolve) => {
  authInitResolve = resolve;
});

export function waitForFirebaseAuthInit(): Promise<void> {
  return authReadyPromise;
}

export async function ensureFirebaseCloudAdmin(): Promise<boolean> {
  await Promise.race([
    authReadyPromise,
    new Promise<void>((resolve) => setTimeout(resolve, 600)),
  ]);
  if (isFirebaseAdminReady()) {
    return true;
  }

  // If the Express backend is reachable on this host, save directly to Express without
  // popping up a surprise Google OAuth dialog that can be blocked by mobile/iframe browsers.
  // Admin can still connect Google Cloud manually anytime via the "Google Cloud" button.
  const expressOnline = await checkExpressBackendAvailable(true);
  if (expressOnline) {
    return false;
  }

  try {
    const res = await signInWithFirebaseGoogle();
    if (!res.isAdmin) {
      throw new Error(
        `Signed in as ${res.user.email || 'user'}. Please select the Admin Google Account (${BOOTSTRAPPED_ADMIN_EMAIL}) to save to Cloud.`
      );
    }
    return true;
  } catch (err) {
    throw err;
  }
}

if (typeof window !== 'undefined') {
  onAuthStateChanged(auth, async (user) => {
    await verifyAndSyncAdminStatus(user);
    if (authInitResolve) {
      authInitResolve();
      authInitResolve = null;
    }
    window.dispatchEvent(
      new CustomEvent(BHP_FIREBASE_AUTH_EVENT, {
        detail: { user, isAdmin: isFirebaseAdminReady() },
      })
    );
  });

  // Mandatory connection test on boot
  async function testConnection() {
    try {
      await getDocFromServer(doc(db, 'test', 'connection'));
    } catch (error) {
      if (error instanceof Error && error.message.includes('the client is offline')) {
        console.error('Please check your Firebase configuration.');
      }
    }
  }
  testConnection();
}
