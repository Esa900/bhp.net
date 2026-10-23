import { getStoredAdminPosts, findAdminPostByQuery } from './postsStorage';
import { getStoredCanadaDocuments } from './canadaStorage';
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
  const cleanQuery = queryTrimmed.replace(/[-\s_./]/g, '');
  if (!cleanQuery) return null;

  // 1. SEARCH AUSTRALIA ADMIN POSTS
  try {
    const adminPosts = getStoredAdminPosts();
    // 1a. Exact ID, Ref, Verification, Passport match
    const exactPost = adminPosts.find((p) => {
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
    if (exactPost) {
      return {
        document: postToUnifiedDoc(exactPost, 'australia'),
        source: 'australia',
        rawRecord: exactPost,
      };
    }

    // 1b. Partial Ref, ID, Passport match
    const partialPost = adminPosts.find((p) => {
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
      const cleanCand = p.candidateName.toLowerCase().replace(/[-\s_./]/g, '');
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
        return val.toLowerCase().replace(/[-\s_./]/g, '') === cleanQuery;
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
        const cleanVal = val.toLowerCase().replace(/[-\s_./]/g, '');
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
        match(c.id)
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
      const cleanCand = c.candidateName.toLowerCase().replace(/[-\s_./]/g, '');
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
