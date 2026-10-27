/**
 * High-capacity IndexedDB storage for large PDF documents and attachments.
 * Bypasses the 5MB browser localStorage limit so multi-megabyte PDFs
 * (such as 11-page IRCC work permit dossiers) persist reliably on mobile & desktop.
 */

const DB_NAME = 'bhp_documents_storage_v1';
const DB_VERSION = 1;
const STORE_NAME = 'documents_store';

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not supported in this environment'));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function setLargeItem<T>(key: string, value: T): Promise<boolean> {
  try {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.put(value, key);
      req.onsuccess = () => resolve(true);
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn(`IndexedDB setItem error for key "${key}":`, err);
    return false;
  }
}

export async function getLargeItem<T>(key: string, fallback: T): Promise<T> {
  try {
    const db = await openDatabase();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(key);
      req.onsuccess = () => {
        resolve(req.result !== undefined ? (req.result as T) : fallback);
      };
      req.onerror = () => resolve(fallback);
    });
  } catch (err) {
    console.warn(`IndexedDB getItem error for key "${key}":`, err);
    return fallback;
  }
}
