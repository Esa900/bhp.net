import { AdminPost, AttachedDoc, PostCategory } from '../types';
import { setLargeItem, getLargeItem } from './pdfIndexedDb';

export const POSTS_STORAGE_KEY = 'bhp_admin_posts_v2';
export const CATEGORIES_STORAGE_KEY = 'bhp_admin_post_categories_v2';

export const DEFAULT_CATEGORIES: PostCategory[] = [
  {
    id: 'cat-1',
    name: 'Employment Application & Verification',
    slug: 'employment-verification',
    description: 'Work permit verification, employment contracts, and employee onboarding records.',
  },
  {
    id: 'cat-2',
    name: 'Mining & Resources',
    slug: 'mining-resources',
    description: 'Operational updates, extraction technology, and global commodity extraction.',
  },
  {
    id: 'cat-3',
    name: 'Sustainability & ESG',
    slug: 'sustainability-esg',
    description: 'Decarbonisation targets, environmental biodiversity, and ethical governance.',
  },
  {
    id: 'cat-4',
    name: 'Visa & Immigration Permits',
    slug: 'visa-immigration',
    description: 'Commonwealth visa sponsorship approvals, grant circulars, and immi verification.',
  },
  {
    id: 'cat-5',
    name: 'Corporate Circulars & Notices',
    slug: 'corporate-circulars',
    description: 'Official executive releases, shareholder circulars, and verified audit filings.',
  },
];

export const isDemoPost = (p: Partial<AdminPost>): boolean => {
  if (!p || !p.id) return false;
  return (
    p.id === 'post-doc-1' ||
    p.id === 'post-doc-2' ||
    p.id === 'post-user-test' ||
    p.id === 'post-test-device1' ||
    p.refNumber === 'BHP-DOC-2026-0089' ||
    p.refNumber === 'BHP-VISA-2026-4412' ||
    p.candidateName === 'Mohammad Tanvir Ahmed' ||
    p.candidateName === 'Kazi Farhan Mahmud'
  );
};

export const INITIAL_DEFAULT_POSTS: AdminPost[] = [];

/**
 * Retrieve all Admin Posts from LocalStorage (or in-memory cache / initial defaults)
 */
/**
 * Fetch latest admin posts from server with SMART TWO-WAY MERGE.
 * Preserves locally created posts and syncs missing posts to and from the server.
 */
export const syncAdminPostsFromServer = async (): Promise<AdminPost[]> => {
  if (typeof window === 'undefined') return getStoredAdminPosts();

  try {
    const res = await fetch('/api/posts', { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      if (data && Array.isArray(data.posts)) {
        const local = getStoredAdminPosts();
        const mergedMap = new Map<string, AdminPost>();

        // 1. Add server posts (exclude demo posts)
        data.posts.forEach((p: AdminPost) => {
          if (p && p.id && !isDemoPost(p)) {
            mergedMap.set(p.id, p);
          }
        });

        // 2. Add local posts (exclude demo posts)
        let hasNewLocalPosts = false;
        local.forEach((p: AdminPost) => {
          if (p && p.id && !isDemoPost(p) && !mergedMap.has(p.id)) {
            mergedMap.set(p.id, p);
            hasNewLocalPosts = true;
          }
        });

        const mergedList = Array.from(mergedMap.values());
        (window as any).__bhp_admin_posts_cache = mergedList;

        try {
          localStorage.setItem(POSTS_STORAGE_KEY, JSON.stringify(mergedList));
        } catch (e) {
          console.warn('Local storage cache update error:', e);
        }

        // If local had posts that server was missing, push complete merged set to server
        if (hasNewLocalPosts) {
          fetch('/api/posts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(mergedList),
          }).catch(console.error);
        }

        window.dispatchEvent(new CustomEvent('bhp_posts_updated', { detail: mergedList }));
        return mergedList;
      }
    }
  } catch (err) {
    console.warn('Network sync for admin posts skipped (offline or initial boot):', err);
  }

  return getStoredAdminPosts();
};

// Auto-trigger sync on module load in browser
if (typeof window !== 'undefined') {
  setTimeout(() => {
    syncAdminPostsFromServer().catch(() => {});
  }, 100);
}

export const getStoredAdminPosts = (): AdminPost[] => {
  if (typeof window !== 'undefined' && Array.isArray((window as any).__bhp_admin_posts_cache)) {
    const cached = (window as any).__bhp_admin_posts_cache.filter((p: AdminPost) => !isDemoPost(p));
    (window as any).__bhp_admin_posts_cache = cached;
    return cached;
  }

  try {
    const raw = typeof localStorage !== 'undefined' ? localStorage.getItem(POSTS_STORAGE_KEY) : null;
    if (raw !== null) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        const cleaned = parsed.filter((p: AdminPost) => !isDemoPost(p));
        if (typeof window !== 'undefined') {
          (window as any).__bhp_admin_posts_cache = cleaned;
        }
        return cleaned;
      }
    }
  } catch (err) {
    console.error('Failed to read admin posts from localStorage:', err);
  }

  // Store and return initial defaults only if no key has ever been set
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(POSTS_STORAGE_KEY, JSON.stringify(INITIAL_DEFAULT_POSTS));
    }
    if (typeof window !== 'undefined') {
      (window as any).__bhp_admin_posts_cache = INITIAL_DEFAULT_POSTS;
    }
  } catch (e) {
    console.error(e);
  }
  return INITIAL_DEFAULT_POSTS;
};

/**
 * Save Admin Posts to Memory, IndexedDB, LocalStorage and push to Server with async confirmation
 */
export const saveStoredAdminPostsAsync = async (posts: AdminPost[]): Promise<boolean> => {
  if (typeof window !== 'undefined') {
    (window as any).__bhp_admin_posts_cache = posts;
  }

  // 1. Save full documents to high-capacity IndexedDB (No 5MB limit!)
  setLargeItem(POSTS_STORAGE_KEY, posts).catch((err) => {
    console.warn('IndexedDB save warning:', err);
  });

  // 2. Safe local storage save without ever destroying dataUrl
  try {
    localStorage.setItem(POSTS_STORAGE_KEY, JSON.stringify(posts));
  } catch (err) {
    console.warn('LocalStorage quota reached; full data preserved safely in IndexedDB and memory cache.');
  }

  // 3. Broadcast local update event
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('bhp_posts_updated', { detail: posts }));
    window.dispatchEvent(new Event('storage'));
  }

  // 3. PERSIST TO SERVER
  if (typeof window !== 'undefined') {
    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(posts),
      });
      return res.ok;
    } catch (err) {
      console.warn('Failed to push admin posts to server persistence API:', err);
      return false;
    }
  }
  return true;
};

/**
 * Synchronous wrapper for backwards compatibility
 */
export const saveStoredAdminPosts = (posts: AdminPost[]): void => {
  saveStoredAdminPostsAsync(posts).catch((err) => {
    console.warn('Background server push error:', err);
  });
};

/**
 * Delete all stored Admin Posts completely (both locally and on server)
 */
export const deleteAllStoredAdminPosts = (): void => {
  saveStoredAdminPosts([]);
};

/**
 * Find an Admin Post matching user's query (by Reference Number, ID, Passport, Candidate Name, or Title)
 */
export const findAdminPostByQuery = (
  rawQuery: string,
  postsPool?: AdminPost[],
  _categoryTarget?: string
): AdminPost | null => {
  if (!rawQuery || !rawQuery.trim()) return null;
  const allPosts = postsPool || getStoredAdminPosts();

  const queryTrimmed = rawQuery.trim().toLowerCase();
  const cleanQuery = queryTrimmed.replace(/[-\s_./#:]/g, '');

  if (!cleanQuery) return null;

  // 1. Direct Reference Number, Verification ID, or Passport match across ALL posts (Highest Priority)
  const exactRefMatch = allPosts.find((p) => {
    const pRef = (p.refNumber || '').toLowerCase().replace(/[-\s_./]/g, '');
    const pId = (p.id || '').toLowerCase().replace(/[-\s_./]/g, '');
    const pVrf = (p.verificationIdNo || '').toLowerCase().replace(/[-\s_./]/g, '');
    const pPass = (p.passportNumber || '').toLowerCase().replace(/[-\s_./]/g, '');
    return (
      pRef === cleanQuery ||
      pId === cleanQuery ||
      pVrf === cleanQuery ||
      pPass === cleanQuery
    );
  });
  if (exactRefMatch) return exactRefMatch;

  // 2. Partial Reference Number, Passport, ID or Digits match
  const digitsQuery = cleanQuery.replace(/\D/g, '');
  const partialRefMatch = allPosts.find((p) => {
    const pRef = (p.refNumber || '').toLowerCase().replace(/[-\s_./#:]/g, '');
    const pId = (p.id || '').toLowerCase().replace(/[-\s_./#:]/g, '');
    const pVrf = (p.verificationIdNo || '').toLowerCase().replace(/[-\s_./#:]/g, '');
    const pPass = (p.passportNumber || '').toLowerCase().replace(/[-\s_./#:]/g, '');
    
    // Check direct substring
    if (
      (pRef && (pRef.includes(cleanQuery) || cleanQuery.includes(pRef))) ||
      (pId && (pId.includes(cleanQuery) || cleanQuery.includes(pId))) ||
      (pVrf && (pVrf.includes(cleanQuery) || cleanQuery.includes(pVrf))) ||
      (pPass && (pPass.includes(cleanQuery) || cleanQuery.includes(pPass)))
    ) {
      return true;
    }

    // Check pure numeric match (e.g. user enters "928410" for "REF-AU-928410")
    if (digitsQuery && digitsQuery.length >= 3) {
      const refDigits = pRef.replace(/\D/g, '');
      const vrfDigits = pVrf.replace(/\D/g, '');
      const passDigits = pPass.replace(/\D/g, '');
      const idDigits = pId.replace(/\D/g, '');
      if (
        (refDigits && (refDigits === digitsQuery || refDigits.includes(digitsQuery) || digitsQuery.includes(refDigits))) ||
        (vrfDigits && (vrfDigits === digitsQuery || vrfDigits.includes(digitsQuery) || digitsQuery.includes(vrfDigits))) ||
        (passDigits && (passDigits === digitsQuery || passDigits.includes(digitsQuery))) ||
        (idDigits && (idDigits === digitsQuery || idDigits.includes(digitsQuery)))
      ) {
        return true;
      }
    }

    return false;
  });
  if (partialRefMatch) return partialRefMatch;

  // 3. Candidate Name match
  const candidateMatch = allPosts.find((p) => {
    if (!p.candidateName) return false;
    const cleanCandName = p.candidateName.toLowerCase().replace(/[-\s_./]/g, '');
    return (
      p.candidateName.toLowerCase().includes(queryTrimmed) ||
      cleanCandName.includes(cleanQuery)
    );
  });
  if (candidateMatch) return candidateMatch;

  // 4. Match within attached document names or title
  const docOrTitleMatch = allPosts.find((p) => {
    const titleLower = p.title.toLowerCase();
    const hasDocNameMatch = p.attachedDocuments?.some((doc) =>
      doc.name.toLowerCase().replace(/[-\s_./]/g, '').includes(cleanQuery)
    );
    return titleLower.includes(queryTrimmed) || hasDocNameMatch;
  });

  return docOrTitleMatch || null;
};

/**
 * Add a new Admin Post
 */
export const addStoredAdminPost = (post: AdminPost): void => {
  const current = getStoredAdminPosts();
  saveStoredAdminPosts([post, ...current]);
};

/**
 * Update an existing Admin Post
 */
export const updateStoredAdminPost = (id: string, updates: Partial<AdminPost>): boolean => {
  const current = getStoredAdminPosts();
  const index = current.findIndex((p) => p.id === id);
  if (index === -1) return false;

  current[index] = { ...current[index], ...updates };
  saveStoredAdminPosts(current);
  return true;
};

/**
 * Delete an Admin Post
 */
export const deleteStoredAdminPost = (id: string): boolean => {
  const current = getStoredAdminPosts();
  const filtered = current.filter((p) => p.id !== id);
  if (filtered.length === current.length) return false;

  saveStoredAdminPosts(filtered);
  return true;
};

