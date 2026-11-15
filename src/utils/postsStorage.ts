import { AdminPost, AttachedDoc, PostCategory } from '../types';
import { setLargeItem, getLargeItem } from './pdfIndexedDb';
import { isFirebaseAdminReady } from './firebaseClient';
import {
  deleteAllPostsFromFirestore,
  deletePostFromFirestore,
  fetchPostsFromFirestoreForAdmin,
  syncLocalRecordsToFirestoreIfEmpty,
  upsertPostToFirestore,
} from './firebaseCloud';
import { getStoredCanadaDocuments } from './canadaStorage';
import { uploadDataUrlDocument } from './fileUpload';

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

export const INITIAL_DEFAULT_POSTS: AdminPost[] = [
  {
    id: 'post-doc-egp56',
    title: 'Canada Visa Application - MD IBRAHIM KHALIL MOZUMDER',
    refNumber: 'EGP56RU55H',
    content: 'Application for a Work Permit (D Category). Verified and endorsed by BHP Canada & IRCC.',
    category: 'Employment Application & Verification',
    author: 'BHP Operations',
    date: '2026-03-02',
    status: 'Published',
    imageUrl: 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [],
    attachedDocuments: [
      {
        id: 'att-post-egp56-pdf',
        name: 'Canada Visa Application - MD IBRAHIM KHALIL MOZUMDER.pdf',
        size: '737 KB',
        type: 'pdf',
        dataUrl: '/uploads/Canada_Visa_Application_MD_IBRAHIM_KHALIL_MOZUMDER.pdf',
        sectionTag: 'Work Permit Documents (ওয়ার্ক পারমিট)',
        isPrimary: true,
        uploadDate: '2026-03-02',
      },
      {
        id: 'att-post-egp56-offer',
        name: 'BHP_Official_Offer_Letter_and_Employment_Contract.pdf',
        size: '450 KB',
        type: 'pdf',
        dataUrl: '/uploads/Canada_Visa_Application_MD_IBRAHIM_KHALIL_MOZUMDER.pdf',
        sectionTag: 'Job Confirmation & Offer Letter (অফার লেটার)',
        isPrimary: false,
        uploadDate: '2026-03-02',
      },
    ],
    readTime: '4 min read',
    badges: ['VERIFIED', 'WORK PERMIT', 'D CATEGORY'],
    candidateName: 'MD IBRAHIM KHALIL MOZUMDER',
    passportNumber: 'A99014322',
    nationality: 'Bangladeshi',
    dateOfBirth: '1990-06-15',
    jobTitle: 'Commercial Transport & Heavy Mobile Equipment Operator',
    employerName: 'BHP Canada Operations Ltd',
    workLocation: 'Calgary, Alberta, Canada',
    salaryPackage: '$38.50 CAD / hr',
    visaSubclass: 'Work Permit (D Category)',
    issueDate: '2026-03-02',
    expiryDate: '2029-03-01',
    verificationIdNo: 'VRF-CAN-56RU55',
  },
];

/**
 * Retrieve all Admin Posts from LocalStorage (or in-memory cache / initial defaults)
 */
let postsMutationEpoch = 0;

export const bumpPostsMutationEpoch = (): number => {
  postsMutationEpoch += 1;
  return postsMutationEpoch;
};

export const setAdminPostsCache = (posts: AdminPost[], bumpEpoch = true): void => {
  if (bumpEpoch) {
    postsMutationEpoch += 1;
  }
  const cleaned = (Array.isArray(posts) ? posts : []).filter((p: AdminPost) => p && !isDemoPost(p));
  updateLocalPostsCache(cleaned);
};

/**
 * Fetch latest admin posts from server with SMART TWO-WAY MERGE.
 * Preserves locally created posts and syncs missing posts to and from the server.
 */
export const syncAdminPostsFromServer = async (): Promise<AdminPost[]> => {
  if (typeof window === 'undefined') return getStoredAdminPosts();

  const startEpoch = postsMutationEpoch;
  const local = getStoredAdminPosts();

  const [expressRes, cloudPosts] = await Promise.all([
    fetch('/api/posts', { cache: 'no-store' })
      .then(async (res) => (res.ok ? await res.json().catch(() => null) : null))
      .catch(() => null),
    isFirebaseAdminReady()
      ? fetchPostsFromFirestoreForAdmin().catch(() => null)
      : Promise.resolve(null),
  ]);

  if (postsMutationEpoch !== startEpoch) {
    return getStoredAdminPosts();
  }

  const expressPosts: AdminPost[] | null =
    expressRes && Array.isArray(expressRes.posts) ? expressRes.posts : null;
  const deletedIdsSet = new Set<string>(
    expressRes && Array.isArray(expressRes.deletedIds) ? expressRes.deletedIds : []
  );

  if (!expressPosts && !cloudPosts) {
    return local;
  }

  const mergedMap = new Map<string, AdminPost>();
  const putLatest = (p: AdminPost) => {
    if (!p || !p.id || isDemoPost(p) || deletedIdsSet.has(p.id)) return;
    const prev = mergedMap.get(p.id);
    if (!prev || Number(p.updatedAt || 0) >= Number(prev.updatedAt || 0)) {
      mergedMap.set(p.id, p);
    }
  };

  (expressPosts || []).forEach(putLatest);
  (cloudPosts || []).forEach(putLatest);

  local.forEach((p) => {
    if (!p || !p.id || isDemoPost(p) || deletedIdsSet.has(p.id)) return;
    if (!mergedMap.has(p.id)) {
      mergedMap.set(p.id, p);
    }
  });

  const mergedList = Array.from(mergedMap.values());
  updateLocalPostsCache(mergedList);

  if (expressPosts) {
    const expressById = new Map(expressPosts.map((p) => [p.id, p]));
    const postsNeedingExpressPush = mergedList.filter((p) => {
      const ex = expressById.get(p.id);
      return !ex || Number(p.updatedAt || 0) > Number(ex.updatedAt || 0);
    });
    if (postsNeedingExpressPush.length > 0) {
      Promise.allSettled(
        postsNeedingExpressPush.map((post) =>
          fetch('/api/posts/upsert', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ post }),
          })
        )
      ).catch(() => {});
    }
  }

  if (isFirebaseAdminReady()) {
    syncLocalRecordsToFirestoreIfEmpty(
      mergedList,
      getStoredCanadaDocuments(),
      Array.from(deletedIdsSet)
    ).catch(() => {});
  }

  return mergedList;
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

async function sanitizeAndUploadPostFiles(post: AdminPost): Promise<AdminPost> {
  const cleanPost: AdminPost = { ...post };

  if (cleanPost.candidatePhotoUrl && cleanPost.candidatePhotoUrl.startsWith('data:')) {
    cleanPost.candidatePhotoUrl = await uploadDataUrlDocument('candidate_photo.png', cleanPost.candidatePhotoUrl, 'image');
  }

  if (cleanPost.imageUrl && cleanPost.imageUrl.startsWith('data:')) {
    cleanPost.imageUrl = await uploadDataUrlDocument('post_cover.png', cleanPost.imageUrl, 'image');
  }

  if (Array.isArray(cleanPost.galleryImages) && cleanPost.galleryImages.length > 0) {
    cleanPost.galleryImages = await Promise.all(
      cleanPost.galleryImages.map(async (img, idx) => {
        if (img && img.startsWith('data:')) {
          return await uploadDataUrlDocument(`gallery_${idx + 1}.png`, img, 'image');
        }
        return img;
      })
    );
  }

  if (cleanPost.attachedDocuments && cleanPost.attachedDocuments.length > 0) {
    const cleanAttached = await Promise.all(
      cleanPost.attachedDocuments.map(async (att) => {
        const fallbackSection = att.sectionTag || cleanPost.category || 'Australia Work Permit Documents';
        const isPdf =
          att.type === 'pdf' ||
          att.name.toLowerCase().endsWith('.pdf') ||
          Boolean(att.dataUrl && (att.dataUrl.includes('application/pdf') || att.dataUrl.includes('JVBERi')));
        const nextType: 'pdf' | 'image' | 'other' = isPdf ? 'pdf' : att.type;

        if (att.dataUrl && att.dataUrl.startsWith('data:')) {
          const uploadedUrl = await uploadDataUrlDocument(att.name || 'document.pdf', att.dataUrl, nextType);
          return {
            ...att,
            type: nextType,
            sectionTag: fallbackSection,
            dataUrl: uploadedUrl,
          };
        }
        return {
          ...att,
          type: nextType,
          sectionTag: fallbackSection,
        };
      })
    );
    cleanPost.attachedDocuments = cleanAttached;
  }

  return cleanPost;
}

function updateLocalPostsCache(posts: AdminPost[]) {
  if (typeof window !== 'undefined') {
    (window as any).__bhp_admin_posts_cache = posts;
  }
  setLargeItem(POSTS_STORAGE_KEY, posts).catch((err) => {
    console.warn('IndexedDB save warning:', err);
  });
  try {
    localStorage.setItem(POSTS_STORAGE_KEY, JSON.stringify(posts));
  } catch (err) {
    console.warn('LocalStorage quota reached; full data preserved safely in IndexedDB and memory cache.');
  }
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('bhp_posts_updated', { detail: posts }));
    window.dispatchEvent(new Event('storage'));
  }
}

/**
 * Atomic single-post create/update across devices (never overwrites posts added on another admin device)
 */
export const upsertStoredAdminPostAsync = async (post: AdminPost): Promise<AdminPost[]> => {
  postsMutationEpoch += 1;
  const sanitized = {
    ...(await sanitizeAndUploadPostFiles(post)),
    updatedAt: Date.now(),
  };
  const current = getStoredAdminPosts();
  const idx = current.findIndex((p) => p.id === sanitized.id);
  let nextList =
    idx !== -1
      ? current.map((p, i) => (i === idx ? { ...p, ...sanitized } : p))
      : [sanitized, ...current];

  updateLocalPostsCache(nextList);

  let savedRemote = false;
  if (typeof window !== 'undefined') {
    if (isFirebaseAdminReady()) {
      await upsertPostToFirestore(sanitized, nextList, getStoredCanadaDocuments());
      savedRemote = true;
    }

    try {
      const res = await fetch('/api/posts/upsert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ post: sanitized }),
      });
      if (res.ok) {
        savedRemote = true;
        const json = await res.json().catch(() => null);
        if (json && Array.isArray(json.posts)) {
          postsMutationEpoch += 1;
          const expressMap = new Map<string, AdminPost>();
          nextList.forEach((p) => expressMap.set(p.id, p));
          json.posts.forEach((p: AdminPost) => {
            if (!p?.id || isDemoPost(p)) return;
            const prev = expressMap.get(p.id);
            if (!prev || Number(p.updatedAt || 0) >= Number(prev.updatedAt || 0)) {
              expressMap.set(p.id, p);
            }
          });
          nextList = Array.from(expressMap.values());
          updateLocalPostsCache(nextList);
        }
      } else if (!savedRemote && res.status === 404) {
        throw new Error(
          'CLOUD_AUTH_REQUIRED: ক্লাউড ডাটাবেজে সেভ করতে প্রথমে Admin Google Account দিয়ে Sign-In করুন।'
        );
      } else if (!savedRemote) {
        const errJson = await res.json().catch(() => null);
        throw new Error(errJson?.error || `Save failed (HTTP ${res.status})`);
      }
    } catch (err) {
      if (!savedRemote) {
        throw err;
      }
    }
  }

  return nextList;
};

/**
 * Attach a new PDF directly to an Australia post (works across Firestore + Express + Static hosts with zero 404 failure)
 */
export const addAttachedDocToPostAsync = async (params: {
  postId: string;
  refNumber?: string;
  candidateName?: string;
  passportNumber?: string;
  fullPost?: AdminPost;
  doc: AttachedDoc;
}): Promise<AdminPost[]> => {
  postsMutationEpoch += 1;
  const { postId, refNumber, candidateName, passportNumber, fullPost, doc: rawNewDoc } = params;

  let sanitizedNewDoc: AttachedDoc = { ...rawNewDoc };
  if (sanitizedNewDoc.dataUrl && sanitizedNewDoc.dataUrl.startsWith('data:')) {
    const uploadedUrl = await uploadDataUrlDocument(
      sanitizedNewDoc.name || 'document.pdf',
      sanitizedNewDoc.dataUrl,
      sanitizedNewDoc.type === 'image' || sanitizedNewDoc.type === 'other' ? sanitizedNewDoc.type : 'pdf'
    );
    sanitizedNewDoc = { ...sanitizedNewDoc, dataUrl: uploadedUrl };
  }

  const cleanFullPost = fullPost ? await sanitizeAndUploadPostFiles(fullPost) : undefined;

  const current = getStoredAdminPosts();
  let targetIdx = current.findIndex((p) => p.id === postId);
  if (targetIdx === -1 && cleanFullPost) {
    current.unshift(cleanFullPost);
    targetIdx = 0;
  }

  let updatedPost: AdminPost | null = null;
  let nextList = [...current];
  if (targetIdx !== -1) {
    const existing = await sanitizeAndUploadPostFiles(current[targetIdx]);
    const existingAttached = Array.isArray(existing.attachedDocuments) ? [...existing.attachedDocuments] : [];
    if (sanitizedNewDoc.isPrimary) {
      existingAttached.forEach((d) => {
        d.isPrimary = false;
      });
    }
    const filtered = existingAttached.filter((d) => d.id !== sanitizedNewDoc.id);
    const orderedAttached = sanitizedNewDoc.isPrimary
      ? [sanitizedNewDoc, ...filtered]
      : [...filtered, sanitizedNewDoc];
    updatedPost = {
      ...existing,
      attachedDocuments: orderedAttached,
      updatedAt: Date.now(),
    };
    nextList = current.map((p, i) => (i === targetIdx ? updatedPost! : p));
    updateLocalPostsCache(nextList);
  }

  let savedRemote = false;
  if (isFirebaseAdminReady() && updatedPost) {
    await upsertPostToFirestore(updatedPost, nextList, getStoredCanadaDocuments());
    savedRemote = true;
  }

  try {
    const addRes = await fetch('/api/posts/add-attached-doc', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        postId,
        refNumber,
        candidateName,
        passportNumber,
        fullPost: updatedPost || cleanFullPost,
        doc: sanitizedNewDoc,
      }),
    });
    const addJson = await addRes.json().catch(() => ({}));
    if (addRes.ok && Array.isArray(addJson.posts)) {
      postsMutationEpoch += 1;
      nextList = addJson.posts;
      updateLocalPostsCache(nextList);
      savedRemote = true;
    } else if (!savedRemote && !addRes.ok) {
      if (addRes.status === 404) {
        throw new Error(
          'CLOUD_AUTH_REQUIRED: ক্লাউড ডাটাবেজে সেভ করতে প্রথমে Google দিয়ে Admin Sign-In করুন।'
        );
      }
      throw new Error(addJson?.error || `Database save failed (HTTP ${addRes.status})`);
    }
  } catch (err) {
    if (!savedRemote) {
      throw err;
    }
  }

  return nextList;
};

/**
 * Save Admin Posts to Memory, IndexedDB, LocalStorage and merge-sync to Server
 */
export const saveStoredAdminPostsAsync = async (posts: AdminPost[]): Promise<boolean> => {
  postsMutationEpoch += 1;
  const sanitizedPosts = await Promise.all(posts.map(sanitizeAndUploadPostFiles));
  updateLocalPostsCache(sanitizedPosts);

  if (typeof window !== 'undefined') {
    if (isFirebaseAdminReady()) {
      const canadaDocs = getStoredCanadaDocuments();
      Promise.allSettled(
        sanitizedPosts.map((p) => upsertPostToFirestore(p, sanitizedPosts, canadaDocs))
      ).catch(() => {});
    }

    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sanitizedPosts),
      });
      if (res.ok) {
        const json = await res.json();
        if (Array.isArray(json.posts)) {
          postsMutationEpoch += 1;
          updateLocalPostsCache(json.posts);
        }
      }
      return res.ok || isFirebaseAdminReady();
    } catch (err) {
      console.warn('Failed to push admin posts to server persistence API:', err);
      return isFirebaseAdminReady();
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
 * Delete a single Admin Post on both local device, Firestore, and server safely
 */
export const deleteStoredAdminPostAsync = async (id: string): Promise<AdminPost[]> => {
  postsMutationEpoch += 1;
  const current = getStoredAdminPosts();
  const targetPost = current.find((p) => p.id === id);
  const filtered = current.filter((p) => p.id !== id);
  updateLocalPostsCache(filtered);

  if (typeof window !== 'undefined') {
    if (isFirebaseAdminReady()) {
      await deletePostFromFirestore(id, targetPost, filtered, getStoredCanadaDocuments()).catch((err) =>
        console.warn('Firestore delete post note:', err)
      );
    }

    try {
      const res = await fetch(`/api/posts/${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        const json = await res.json();
        if (Array.isArray(json.posts)) {
          postsMutationEpoch += 1;
          updateLocalPostsCache(json.posts);
          return json.posts;
        }
      }
    } catch (err) {
      console.warn('Server delete post error:', err);
    }
  }
  return filtered;
};

/**
 * Delete all stored Admin Posts completely (both locally and on server)
 */
export const deleteAllStoredAdminPostsAsync = async (): Promise<void> => {
  postsMutationEpoch += 1;
  updateLocalPostsCache([]);
  if (typeof window !== 'undefined') {
    if (isFirebaseAdminReady()) {
      await deleteAllPostsFromFirestore(getStoredCanadaDocuments()).catch((err) =>
        console.warn('Firestore delete all posts note:', err)
      );
    }
    try {
      await fetch('/api/posts/delete-all', { method: 'POST' });
    } catch (err) {
      console.warn('Server delete all posts error:', err);
    }
  }
};

export const deleteAllStoredAdminPosts = (): void => {
  deleteAllStoredAdminPostsAsync().catch((err) => {
    console.warn('Background delete all posts error:', err);
  });
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
  upsertStoredAdminPostAsync(post).catch(console.error);
};

/**
 * Update an existing Admin Post
 */
export const updateStoredAdminPost = (id: string, updates: Partial<AdminPost>): boolean => {
  const current = getStoredAdminPosts();
  const index = current.findIndex((p) => p.id === id);
  if (index === -1) return false;

  const updated = { ...current[index], ...updates };
  upsertStoredAdminPostAsync(updated).catch(console.error);
  return true;
};

/**
 * Delete an Admin Post
 */
export const deleteStoredAdminPost = (id: string): boolean => {
  const current = getStoredAdminPosts();
  const exists = current.some((p) => p.id === id);
  deleteStoredAdminPostAsync(id).catch(console.error);
  return exists;
};

