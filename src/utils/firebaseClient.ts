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

let isAdminStatusCached = false;

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
  const result = await signInWithPopup(auth, googleProvider);
  const user = result.user;
  const isAdmin = await verifyAndSyncAdminStatus(user);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(BHP_FIREBASE_AUTH_EVENT, { detail: { user, isAdmin } }));
  }
  return { user, isAdmin };
}

export async function signOutFirebase(): Promise<void> {
  isAdminStatusCached = false;
  await signOut(auth);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(BHP_FIREBASE_AUTH_EVENT, { detail: { user: null, isAdmin: false } }));
  }
}

let authInitResolve: (() => void) | null = null;
const authReadyPromise = new Promise<void>((resolve) => {
  authInitResolve = resolve;
});

export function waitForFirebaseAuthInit(): Promise<void> {
  return authReadyPromise;
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
