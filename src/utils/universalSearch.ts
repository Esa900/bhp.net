import { getStoredAdminPosts, findAdminPostByQuery, syncAdminPostsFromServer } from './postsStorage';
import { getStoredCanadaDocuments, syncCanadaDocumentsFromServer } from './canadaStorage';
import { SAMPLE_PROFILES } from '../data/portalData';
import {
  UnifiedDocumentData,
  postToUnifiedDoc,
  canadaRecordToUnifiedDoc,
  profileToUnifiedDoc,
} from '../components/FullPdfDocumentViewer';

export interface UniversalSearchResult {
  document: UnifiedDocumentData;
  source: 'australia' | 'canada' | 'portal';
  rawRecord: any;
}

/**
 * Universal search engine for BHP document verification.
 * Searches across:
 * 1. Australia Admin Posts (Add New Post in Australia)
 * 2. Canada Admin Documents (Add New Post in Canada)
 * 3. Commonwealth Australia Sample Profiles
 */
export function searchUniversalDocument(rawQuery: string): UniversalSearchResult | null {
  if (!rawQuery || !rawQuery.trim()) return null;

  const queryTrimmed = rawQuery.trim().toLowerCase();
  const cleanQuery = queryTrimmed.replace(/[-\s_./#:]/g, '');
  if (!cleanQuery) return null;

  // 1. SEARCH AUSTRALIA ADMIN POSTS
  try {
    const adminPosts = getStoredAdminPosts();
    // 1a. Exact ID, Ref, Verification, Passport match
    const exactPost = adminPosts.find((p) => {
      const pRef = (p.refNumber || '').toLowerCase().replace(/[-\s_./#:]/g, '');
      const pId = (p.id || '').toLowerCase().replace(/[-\s_./#:]/g, '');
      const pVrf = (p.verificationIdNo || '').toLowerCase().replace(/[-\s_./#:]/g, '');
      const pPass = (p.passportNumber || '').toLowerCase().replace(/[-\s_./#:]/g, '');
      return (
        pRef === cleanQuery ||
        pId === cleanQuery ||
        pVrf === cleanQuery ||
        pPass === cleanQuery
      );
    });
    if (exactPost) {
      return {
        document: postToUnifiedDoc(exactPost, 'australia'),
        source: 'australia',
        rawRecord: exactPost,
      };
    }

    // 1b. Partial Ref, ID, Passport, or pure digits match
    const digitsQuery = cleanQuery.replace(/\D/g, '');
    const partialPost = adminPosts.find((p) => {
      const pRef = (p.refNumber || '').toLowerCase().replace(/[-\s_./#:]/g, '');
      const pId = (p.id || '').toLowerCase().replace(/[-\s_./#:]/g, '');
      const pVrf = (p.verificationIdNo || '').toLowerCase().replace(/[-\s_./#:]/g, '');
      const pPass = (p.passportNumber || '').toLowerCase().replace(/[-\s_./#:]/g, '');

      if (
        (pRef && (pRef.includes(cleanQuery) || cleanQuery.includes(pRef))) ||
        (pId && (pId.includes(cleanQuery) || cleanQuery.includes(pId))) ||
        (pVrf && (pVrf.includes(cleanQuery) || cleanQuery.includes(pVrf))) ||
        (pPass && (pPass.includes(cleanQuery) || cleanQuery.includes(pPass)))
      ) {
        return true;
      }

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
    if (partialPost) {
      return {
        document: postToUnifiedDoc(partialPost, 'australia'),
        source: 'australia',
        rawRecord: partialPost,
      };
    }

    // 1c. Candidate Name match
    const candPost = adminPosts.find((p) => {
      if (!p.candidateName) return false;
      const cleanCand = p.candidateName.toLowerCase().replace(/[-\s_./#:]/g, '');
      return (
        p.candidateName.toLowerCase().includes(queryTrimmed) ||
        cleanCand.includes(cleanQuery)
      );
    });
    if (candPost) {
      return {
        document: postToUnifiedDoc(candPost, 'australia'),
        source: 'australia',
        rawRecord: candPost,
      };
    }

    // 1d. Title or Attached Document name match
    const titlePost = adminPosts.find((p) => {
      const cleanTitle = (p.title || '').toLowerCase().replace(/[-\s_./#:]/g, '');
      const hasDoc = p.attachedDocuments?.some((doc) =>
        (doc.name || '').toLowerCase().replace(/[-\s_./#:]/g, '').includes(cleanQuery)
      );
      return cleanTitle.includes(cleanQuery) || hasDoc;
    });
    if (titlePost) {
      return {
        document: postToUnifiedDoc(titlePost, 'australia'),
        source: 'australia',
        rawRecord: titlePost,
      };
    }
  } catch (err) {
    console.warn('Error querying Australia posts:', err);
  }

  // 2. SEARCH CANADA ADMIN DOCUMENTS
  try {
    const canadaDocs = getStoredCanadaDocuments();
    // 2a. Exact match
    const exactCa = canadaDocs.find((c) => {
      const match = (val?: string) => {
        if (!val) return false;
        return val.toLowerCase().replace(/[-\s_./#:]/g, '') === cleanQuery;
      };
      return (
        match(c.tinOrRef) ||
        match(c.idNumber) ||
        match(c.verificationIdNo) ||
        match(c.transitionIdNo) ||
        match(c.referenceNo) ||
        match(c.officialDocNumber) ||
        match(c.lmiaNumber) ||
        match(c.passportNumber) ||
        match(c.id)
      );
    });
    if (exactCa) {
      return {
        document: canadaRecordToUnifiedDoc(exactCa),
        source: 'canada',
        rawRecord: exactCa,
      };
    }

    // 2b. Partial match
    const partialCa = canadaDocs.find((c) => {
      const match = (val?: string) => {
        if (!val) return false;
        const cleanVal = val.toLowerCase().replace(/[-\s_./#:]/g, '');
        return cleanVal.includes(cleanQuery) || cleanQuery.includes(cleanVal);
      };
      return (
        match(c.tinOrRef) ||
        match(c.idNumber) ||
        match(c.verificationIdNo) ||
        match(c.transitionIdNo) ||
        match(c.referenceNo) ||
        match(c.officialDocNumber) ||
        match(c.lmiaNumber) ||
        match(c.passportNumber) ||
        match(c.id) ||
        match(c.mainTitle)
      );
    });
    if (partialCa) {
      return {
        document: canadaRecordToUnifiedDoc(partialCa),
        source: 'canada',
        rawRecord: partialCa,
      };
    }

    // 2c. Candidate Name match
    const candCa = canadaDocs.find((c) => {
      if (!c.candidateName) return false;
      const cleanCand = c.candidateName.toLowerCase().replace(/[-\s_./#:]/g, '');
      return (
        c.candidateName.toLowerCase().includes(queryTrimmed) ||
        cleanCand.includes(cleanQuery)
      );
    });
    if (candCa) {
      return {
        document: canadaRecordToUnifiedDoc(candCa),
        source: 'canada',
        rawRecord: candCa,
      };
    }
  } catch (err) {
    console.warn('Error querying Canada docs:', err);
  }

  // 3. SEARCH SAMPLE PROFILES
  try {
    const matchedProfile = SAMPLE_PROFILES.find((p) => {
      const matchField = (val?: string) => {
        if (!val) return false;
        const cleanVal = val.toLowerCase().replace(/[-\s_./]/g, '');
        return cleanVal.includes(cleanQuery) || cleanQuery.includes(cleanVal);
      };

      return (
        matchField(p.referenceNumber) ||
        matchField(p.edNumber) ||
        matchField(p.documentNumber) ||
        matchField(p.verificationIdNo) ||
        matchField(p.transitionIdNo) ||
        matchField(p.visaGrantNumber) ||
        matchField(p.insuranceNo) ||
        matchField(p.immiCardNo) ||
        matchField(p.tfnNumber) ||
        p.fullName.toLowerCase().includes(queryTrimmed) ||
        p.fullName.toLowerCase().replace(/[-\s_./]/g, '').includes(cleanQuery)
      );
    });

    if (matchedProfile) {
      return {
        document: profileToUnifiedDoc(matchedProfile),
        source: 'portal',
        rawRecord: matchedProfile,
      };
    }
  } catch (err) {
    console.warn('Error querying sample profiles:', err);
  }

  return null;
}

/**
 * Asynchronous Universal Search with live server sync fallback.
 * Guarantees that documents newly added by admin on another phone/device
 * will be retrieved and displayed to the customer immediately.
 */
export async function searchUniversalDocumentAsync(rawQuery: string): Promise<UniversalSearchResult | null> {
  // 1. First try immediate local cache
  const localMatch = searchUniversalDocument(rawQuery);
  if (localMatch) return localMatch;

  // 2. Query direct server search endpoint
  try {
    const res = await fetch(`/api/search?q=${encodeURIComponent(rawQuery)}`, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      if (data && data.found && data.record) {
        if (data.source === 'australia') {
          return {
            document: postToUnifiedDoc(data.record, 'australia'),
            source: 'australia',
            rawRecord: data.record,
          };
        } else if (data.source === 'canada') {
          return {
            document: canadaRecordToUnifiedDoc(data.record),
            source: 'canada',
            rawRecord: data.record,
          };
        } else if (data.source === 'portal') {
          return {
            document: profileToUnifiedDoc(data.record),
            source: 'portal',
            rawRecord: data.record,
          };
        }
      }
    }
  } catch (err) {
    console.warn('Server search endpoint error:', err);
  }

  // 3. Fallback: full server sync of posts and canada docs, then retry search
  try {
    await Promise.allSettled([
      syncAdminPostsFromServer(),
      syncCanadaDocumentsFromServer(),
    ]);
    return searchUniversalDocument(rawQuery);
  } catch (syncErr) {
    console.warn('Sync fallback error:', syncErr);
  }

  return null;
}
