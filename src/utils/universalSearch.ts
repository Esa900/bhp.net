import { getStoredAdminPosts, syncAdminPostsFromServer, POSTS_STORAGE_KEY } from './postsStorage';
import { getStoredCanadaDocuments, syncCanadaDocumentsFromServer, CANADA_STORAGE_KEY } from './canadaStorage';
import { lookupVerificationIndexInFirestore } from './firebaseCloud';
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

  const digitsQuery = cleanQuery.replace(/\D/g, '');
  const matchesVal = (val?: string) => {
    if (!val) return false;
    const clean = val.toLowerCase().replace(/[-\s_./#:]/g, '');
    if (clean === cleanQuery || clean.includes(cleanQuery)) return true;
    if (clean.length >= 6 && cleanQuery.includes(clean)) return true;
    if (digitsQuery && digitsQuery.length >= 4) {
      const valDigits = clean.replace(/\D/g, '');
      if (valDigits && (valDigits === digitsQuery || valDigits.includes(digitsQuery))) {
        return true;
      }
    }
    return false;
  };

  try {
    const adminPosts = getStoredAdminPosts();
    const canadaDocs = getStoredCanadaDocuments();

    const matchedPostsDirect = adminPosts.filter((p) => {
      const cand = (p.candidateName || '').toLowerCase();
      const title = (p.title || '').toLowerCase();
      return (
        matchesVal(p.refNumber) ||
        matchesVal(p.verificationIdNo) ||
        matchesVal(p.passportNumber) ||
        matchesVal(p.id) ||
        cand.includes(queryTrimmed) ||
        matchesVal(cand) ||
        title.includes(queryTrimmed) ||
        matchesVal(title) ||
        Boolean(p.attachedDocuments?.some((d) => matchesVal(d.name)))
      );
    });

    const matchedCanadaDirect = canadaDocs.filter((c) => {
      const cand = (c.candidateName || '').toLowerCase();
      return (
        matchesVal(c.tinOrRef) ||
        matchesVal(c.idNumber) ||
        matchesVal(c.verificationIdNo) ||
        matchesVal(c.transitionIdNo) ||
        matchesVal(c.referenceNo) ||
        matchesVal(c.officialDocNumber) ||
        matchesVal(c.lmiaNumber) ||
        matchesVal(c.passportNumber) ||
        matchesVal(c.id) ||
        cand.includes(queryTrimmed) ||
        matchesVal(cand) ||
        matchesVal(c.mainTitle)
      );
    });

    if (matchedPostsDirect.length > 0 || matchedCanadaDirect.length > 0) {
      const passports = new Set<string>();
      const names = new Set<string>();
      const refs = new Set<string>();

      const collectKeys = (r: any) => {
        const pass = (r.passportNumber || '').toLowerCase().replace(/[-\s_./#:]/g, '');
        if (pass.length >= 5) passports.add(pass);
        const name = (r.candidateName || '').toLowerCase().replace(/[-\s_./#:]/g, '');
        if (name.length >= 5) names.add(name);
        [r.refNumber, r.tinOrRef, r.referenceNo, r.idNumber].forEach((v) => {
          const cv = (v || '').toLowerCase().replace(/[-\s_./#:]/g, '');
          if (cv.length >= 4) refs.add(cv);
        });
      };

      matchedPostsDirect.forEach(collectKeys);
      matchedCanadaDirect.forEach(collectKeys);

      const belongsToSameClient = (r: any) => {
        const rPass = (r.passportNumber || '').toLowerCase().replace(/[-\s_./#:]/g, '');
        const rName = (r.candidateName || '').toLowerCase().replace(/[-\s_./#:]/g, '');
        const rRefs = [r.refNumber, r.tinOrRef, r.referenceNo, r.idNumber]
          .map((v) => (v || '').toLowerCase().replace(/[-\s_./#:]/g, ''))
          .filter((v) => v.length >= 4);
        if (rRefs.some((k) => refs.has(k))) return true;
        if (rPass && passports.has(rPass) && (!rName || names.size === 0 || names.has(rName))) return true;
        if (rName && names.has(rName)) return true;
        return false;
      };

      const allPosts = [...matchedPostsDirect];
      adminPosts.forEach((p) => {
        if (!allPosts.some((m) => m.id === p.id) && belongsToSameClient(p)) allPosts.push(p);
      });

      const allCanada = [...matchedCanadaDirect];
      canadaDocs.forEach((c) => {
        if (!allCanada.some((m) => m.id === c.id) && belongsToSameClient(c)) allCanada.push(c);
      });

      const baseUnified =
        matchedCanadaDirect.length > 0
          ? canadaRecordToUnifiedDoc(matchedCanadaDirect[0])
          : matchedPostsDirect.length > 0
          ? postToUnifiedDoc(matchedPostsDirect[0], 'australia')
          : allCanada.length > 0
          ? canadaRecordToUnifiedDoc(allCanada[0])
          : postToUnifiedDoc(allPosts[0], 'australia');

      const seenIds = new Set<string>();
      const seenKeys = new Set<string>();
      const combinedAttached: any[] = [];

      const pushDoc = (att: any) => {
        if (!att || !att.dataUrl || att.dataUrl === '#') return;
        const key = `${att.sectionTag || 'default'}_${att.name || ''}_${att.dataUrl || ''}`.toLowerCase();
        if (att.id && seenIds.has(att.id)) return;
        if (seenKeys.has(key)) return;
        if (att.id) seenIds.add(att.id);
        seenKeys.add(key);
        combinedAttached.push(att);
      };

      allCanada.forEach((c) => {
        const u = canadaRecordToUnifiedDoc(c);
        (u.attachedDocuments || []).forEach(pushDoc);
      });
      allPosts.forEach((p) => {
        const u = postToUnifiedDoc(p, 'australia');
        (u.attachedDocuments || []).forEach(pushDoc);
      });

      const primaryCombined = combinedAttached.filter((d) => d.isPrimary);
      const nonPrimaryCombined = combinedAttached.filter((d) => !d.isPrimary);
      const sortedCombined = [...primaryCombined, ...nonPrimaryCombined];
      baseUnified.attachedDocuments = sortedCombined.length > 0 ? sortedCombined : baseUnified.attachedDocuments;

      return {
        document: baseUnified,
        source: matchedCanadaDirect.length > 0 || (matchedPostsDirect.length === 0 && allCanada.length > 0) ? 'canada' : 'australia',
        rawRecord: matchedCanadaDirect[0] || matchedPostsDirect[0] || allCanada[0] || allPosts[0],
      };
    }
  } catch (err) {
    console.warn('Error querying local posts/docs:', err);
  }

  // 3. SEARCH SAMPLE PROFILES
  try {
    const matchedProfile = SAMPLE_PROFILES.find((p) => {
      const matchExact = (val?: string) => {
        if (!val) return false;
        return val.toLowerCase().replace(/[-\s_./]/g, '') === cleanQuery;
      };

      return (
        matchExact(p.referenceNumber) ||
        matchExact(p.documentNumber) ||
        matchExact(p.verificationIdNo) ||
        matchExact(p.transitionIdNo) ||
        matchExact(p.edNumber) ||
        matchExact(p.visaGrantNumber)
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

function cacheRemoteSearchRecord(source: 'australia' | 'canada' | 'portal', record: any) {
  try {
    if (typeof window === 'undefined' || !record) return;
    if (source === 'australia') {
      const currentPosts = getStoredAdminPosts();
      const existsIdx = currentPosts.findIndex((p) => p.id === record.id);
      const updatedList =
        existsIdx !== -1
          ? currentPosts.map((p, i) => (i === existsIdx ? record : p))
          : [record, ...currentPosts];
      (window as any).__bhp_admin_posts_cache = updatedList;
      localStorage.setItem(POSTS_STORAGE_KEY, JSON.stringify(updatedList));
    } else if (source === 'canada') {
      const currentDocs = getStoredCanadaDocuments();
      const existsIdx = currentDocs.findIndex((c) => c.id === record.id);
      const updatedList =
        existsIdx !== -1
          ? currentDocs.map((c, i) => (i === existsIdx ? record : c))
          : [record, ...currentDocs];
      (window as any).__bhp_canada_documents_cache = updatedList;
      localStorage.setItem(CANADA_STORAGE_KEY, JSON.stringify(updatedList));
    }
  } catch (_) {}
}

function buildSearchResultFromRecord(
  source: 'australia' | 'canada' | 'portal',
  record: any
): UniversalSearchResult {
  if (source === 'australia') {
    const docData = postToUnifiedDoc(record, 'australia');
    if (Array.isArray(docData.attachedDocuments)) {
      docData.attachedDocuments = [
        ...docData.attachedDocuments.filter((d) => d.isPrimary),
        ...docData.attachedDocuments.filter((d) => !d.isPrimary),
      ];
    }
    return { document: docData, source: 'australia', rawRecord: record };
  }
  if (source === 'canada') {
    const docData = canadaRecordToUnifiedDoc(record);
    if (Array.isArray(docData.attachedDocuments)) {
      docData.attachedDocuments = [
        ...docData.attachedDocuments.filter((d) => d.isPrimary),
        ...docData.attachedDocuments.filter((d) => !d.isPrimary),
      ];
    }
    return { document: docData, source: 'canada', rawRecord: record };
  }
  return {
    document: profileToUnifiedDoc(record),
    source: 'portal',
    rawRecord: record,
  };
}

/**
 * Asynchronous Universal Search with live Cloud (Firestore) + Express server lookup.
 * Guarantees documents & PDFs added by admin on any phone/device are retrieved immediately on all devices.
 */
export async function searchUniversalDocumentAsync(
  rawQuery: string,
  targetSection?: string,
  preferredSource?: 'australia' | 'canada'
): Promise<UniversalSearchResult | null> {
  const fetchExpressSearch = async (): Promise<{ source: 'australia' | 'canada' | 'portal'; record: any } | null> => {
    try {
      const params = new URLSearchParams({ q: rawQuery });
      if (targetSection) params.set('section', targetSection);
      if (preferredSource) params.set('source', preferredSource);

      const res = await fetch(`/api/search?${params.toString()}`, { cache: 'no-store' });
      if (!res.ok) return null;
      const data = await res.json().catch(() => null);
      if (data && data.found && data.record) {
        return { source: data.source || 'canada', record: data.record };
      }
    } catch (err) {
      console.warn('Express server search skipped:', err);
    }
    return null;
  };

  // 1. Query both live Firestore Cloud Index & Express Server in parallel
  const [cloudResult, expressResult] = await Promise.all([
    lookupVerificationIndexInFirestore(rawQuery).catch(() => null),
    fetchExpressSearch(),
  ]);

  let chosen: { source: 'australia' | 'canada' | 'portal'; record: any } | null = null;
  if (cloudResult && expressResult) {
    const cloudTs = Number((cloudResult.record as any)?.updatedAt || 0);
    const expressTs = Number((expressResult.record as any)?.updatedAt || 0);
    const primary = expressTs > cloudTs ? expressResult : cloudResult;
    const secondary = primary === expressResult ? cloudResult : expressResult;

    const mergedDocs: any[] = [];
    const seenIds = new Set<string>();
    const seenSigs = new Set<string>();
    const pushAttachment = (att: any) => {
      if (!att || !att.dataUrl || att.dataUrl === '#') return;
      if (att.id && seenIds.has(att.id)) return;
      const sig = `${(att.sectionTag || 'default').toLowerCase()}::${(att.name || '').toLowerCase()}::${att.dataUrl}`;
      if (seenSigs.has(sig)) return;
      if (att.id) seenIds.add(att.id);
      seenSigs.add(sig);
      mergedDocs.push(att);
    };

    (Array.isArray(primary.record?.attachedDocuments) ? primary.record.attachedDocuments : []).forEach(pushAttachment);
    (Array.isArray(secondary.record?.attachedDocuments) ? secondary.record.attachedDocuments : []).forEach(pushAttachment);

    if (mergedDocs.length === 0 && primary.record?.documentFileUrl) {
      pushAttachment({
        id: `att-fallback-${primary.record.id || 'doc'}`,
        name: primary.record.documentFileName || 'Official Document.pdf',
        size: 'Official PDF',
        type: 'pdf',
        dataUrl: primary.record.documentFileUrl,
        isPrimary: true,
      });
    }

    chosen = {
      source: primary.source,
      record: {
        ...secondary.record,
        ...primary.record,
        attachedDocuments: mergedDocs.length > 0 ? mergedDocs : primary.record?.attachedDocuments || [],
      },
    };
  } else {
    chosen = cloudResult || expressResult;
  }

  if (chosen && chosen.record) {
    cacheRemoteSearchRecord(chosen.source, chosen.record);
    return buildSearchResultFromRecord(chosen.source, chosen.record);
  }

  // 2. Fallback to local cache if network offline
  const localMatch = searchUniversalDocument(rawQuery);
  if (localMatch) return localMatch;

  // 3. Fallback: full sync of posts and canada docs, then retry search
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
