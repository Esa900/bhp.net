import { AdminPost, AttachedDoc, PostCategory } from '../types';

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

export const INITIAL_DEFAULT_POSTS: AdminPost[] = [
  {
    id: 'post-doc-1',
    title: 'Australia Employment Application & Work Authorization Clearance',
    refNumber: 'BHP-DOC-2026-0089',
    content: `OFFICIAL CORPORATE VERIFICATION & SPONSORSHIP DIRECTIVE:
This official document confirms the verified corporate sponsorship, biometric registration, and work permit clearance under BHP Group Limited Global Operations in Western Australia.

Key Details & Authorisations:
• Primary Sponsor: BHP Group Limited (ABN 49 004 028 077)
• Operations Zone: Western Australia Iron Ore (WAIO) & Olympic Dam
• Status: Approved, Verified, and Active in Commonwealth Portal
• Verification Protocol: Biometric identification and ANZSCO qualification standard compliant.

All attached circular documentation and verified clearance certificates are certified authentic by the Executive Operations Directorate.`,
    category: 'Employment Application & Verification',
    author: 'BHP Operations Directorate',
    date: '2026-03-12',
    status: 'Published',
    imageUrl: 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=1200&q=80',
    candidateName: 'Mohammad Tanvir Ahmed',
    passportNumber: 'A09482103',
    nationality: 'Bangladeshi',
    dateOfBirth: '1993-04-18',
    jobTitle: 'Senior Mining Maintenance Specialist',
    employerName: 'BHP Group Operations (Australia)',
    workLocation: 'Perth & Pilbara, WA, Australia',
    salaryPackage: '$135,000 AUD / Year',
    visaSubclass: 'Subclass 482 - TSS (Medium-Term Stream)',
    issueDate: '2026-01-10',
    expiryDate: '2029-01-09',
    verificationIdNo: 'VRF-AU-928410',
    galleryImages: [
      'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80',
    ],
    attachedDocuments: [
      {
        id: 'doc-seed-1',
        name: 'BHP_Verified_Employment_Clearance_2026.pdf',
        size: '2.45 MB',
        type: 'pdf',
        dataUrl: '#',
        uploadDate: '2026-03-12',
      },
      {
        id: 'doc-seed-2',
        name: 'Official_Sponsorship_Permit_Scan.pdf',
        size: '1.82 MB',
        type: 'pdf',
        dataUrl: '#',
        uploadDate: '2026-03-12',
      },
    ],
    readTime: '4 min read',
    badges: ['OFFICIAL', 'VERIFIED DOCUMENT', 'BHP 2026'],
  },
  {
    id: 'post-doc-2',
    title: 'Commonwealth Skilled Regional Work Visa & Corporate Endorsement',
    refNumber: 'BHP-VISA-2026-4412',
    content: `DEPARTMENT OF HOME AFFAIRS & BHP SPONSORSHIP VERIFICATION:
Official confirmation of Subclass 482 / 186 Nominated Sponsoring Agreement.

Verified Parameters:
• Employer Sponsoring: BHP Olympic Dam Operations
• Visa Subclass: Temporary Skill Shortage (Subclass 482 - Medium Term Stream)
• Sponsoring ID: BHP-SPON-99042
• Condition: Full Work Rights Approved (Condition 8107 Compliant)

All supporting biometric documents, police clearances, and medical certifications have been catalogued and endorsed.`,
    category: 'Visa & Immigration Permits',
    author: 'BHP Global Mobility Desk',
    date: '2026-02-28',
    status: 'Published',
    imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    candidateName: 'Kazi Farhan Mahmud',
    passportNumber: 'B18492044',
    nationality: 'Bangladeshi',
    dateOfBirth: '1991-09-25',
    jobTitle: 'Heavy Mobile Equipment Mechanical Engineer',
    employerName: 'BHP Olympic Dam Operations',
    workLocation: 'Olympic Dam, South Australia',
    salaryPackage: '$142,000 AUD / Year',
    visaSubclass: 'Subclass 482 - TSS (Employer Nominated)',
    issueDate: '2026-02-01',
    expiryDate: '2030-01-31',
    verificationIdNo: 'VRF-AU-441299',
    galleryImages: [
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80',
    ],
    attachedDocuments: [
      {
        id: 'doc-seed-3',
        name: 'Commonwealth_Visa_Endorsement_Record.pdf',
        size: '3.15 MB',
        type: 'pdf',
        dataUrl: '#',
        uploadDate: '2026-02-28',
      },
    ],
    readTime: '3 min read',
    badges: ['IMMIGRATION', 'VISA GRANTED', 'OFFICIAL'],
  },
];

/**
 * Retrieve all Admin Posts from LocalStorage (or in-memory cache / initial defaults)
 */
/**
 * Fetch latest admin posts from server for cross-device synchronization
 */
export const syncAdminPostsFromServer = async (): Promise<AdminPost[]> => {
  if (typeof window === 'undefined') return getStoredAdminPosts();

  try {
    const res = await fetch('/api/posts', { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      if (data && Array.isArray(data.posts) && data.posts.length > 0) {
        (window as any).__bhp_admin_posts_cache = data.posts;
        try {
          localStorage.setItem(POSTS_STORAGE_KEY, JSON.stringify(data.posts));
        } catch (e) {
          console.warn('Local storage cache update error:', e);
        }
        window.dispatchEvent(new CustomEvent('bhp_posts_updated', { detail: data.posts }));
        return data.posts;
      } else if (data && Array.isArray(data.posts) && data.posts.length === 0) {
        // If server has no posts yet but local has posts, push local posts to server
        const local = getStoredAdminPosts();
        if (local && local.length > 0) {
          fetch('/api/posts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(local),
          }).catch(console.error);
        }
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
    return (window as any).__bhp_admin_posts_cache;
  }

  try {
    const raw = localStorage.getItem(POSTS_STORAGE_KEY);
    if (raw !== null) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        if (typeof window !== 'undefined') {
          (window as any).__bhp_admin_posts_cache = parsed;
        }
        return parsed;
      }
    }
  } catch (err) {
    console.error('Failed to read admin posts from localStorage:', err);
  }

  // Store and return initial defaults only if no key has ever been set
  try {
    localStorage.setItem(POSTS_STORAGE_KEY, JSON.stringify(INITIAL_DEFAULT_POSTS));
    if (typeof window !== 'undefined') {
      (window as any).__bhp_admin_posts_cache = INITIAL_DEFAULT_POSTS;
    }
  } catch (e) {
    console.error(e);
  }
  return INITIAL_DEFAULT_POSTS;
};

/**
 * Save Admin Posts to LocalStorage and push to Server for all other devices
 */
export const saveStoredAdminPosts = (posts: AdminPost[]): void => {
  if (typeof window !== 'undefined') {
    (window as any).__bhp_admin_posts_cache = posts;
  }

  // 1. Instant local storage save
  try {
    localStorage.setItem(POSTS_STORAGE_KEY, JSON.stringify(posts));
  } catch (err) {
    console.warn('LocalStorage save quota exceeded, preserving newest post and pruning old payloads:', err);
    try {
      const streamlined = posts.map((p, idx) => {
        if (idx < 5) return p;
        return {
          ...p,
          attachedDocuments: p.attachedDocuments?.map((d) => ({
            ...d,
            dataUrl: (d.dataUrl && d.dataUrl.length > 50000) ? '#' : d.dataUrl,
          })),
        };
      });
      localStorage.setItem(POSTS_STORAGE_KEY, JSON.stringify(streamlined));
    } catch (e2) {
      console.error('Secondary storage error:', e2);
    }
  }

  // 2. Broadcast local update event
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('bhp_posts_updated', { detail: posts }));
    window.dispatchEvent(new Event('storage'));
  }

  // 3. PERSIST TO SERVER (CRITICAL: Allows other devices and customer phones to access immediately)
  if (typeof window !== 'undefined') {
    fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(posts),
    }).catch((err) => {
      console.warn('Failed to push admin posts to server persistence API:', err);
    });
  }
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

  // 2. Partial Reference Number, Passport, or ID match
  const partialRefMatch = allPosts.find((p) => {
    const pRef = (p.refNumber || '').toLowerCase().replace(/[-\s_./]/g, '');
    const pId = (p.id || '').toLowerCase().replace(/[-\s_./]/g, '');
    const pVrf = (p.verificationIdNo || '').toLowerCase().replace(/[-\s_./]/g, '');
    const pPass = (p.passportNumber || '').toLowerCase().replace(/[-\s_./]/g, '');
    return (
      (pRef && (pRef.includes(cleanQuery) || cleanQuery.includes(pRef))) ||
      (pId && (pId.includes(cleanQuery) || cleanQuery.includes(pId))) ||
      (pVrf && (pVrf.includes(cleanQuery) || cleanQuery.includes(pVrf))) ||
      (pPass && (pPass.includes(cleanQuery) || cleanQuery.includes(pPass)))
    );
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

