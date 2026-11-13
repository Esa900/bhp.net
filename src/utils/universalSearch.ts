import { getStoredAdminPosts, findAdminPostByQuery, syncAdminPostsFromServer, POSTS_STORAGE_KEY } from './postsStorage';
import { getStoredCanadaDocuments, syncCanadaDocumentsFromServer, CANADA_STORAGE_KEY } from './canadaStorage';
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

      baseUnified.attachedDocuments = combinedAttached.length > 0 ? combinedAttached : baseUnified.attachedDocuments;

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

/**
 * Asynchronous Universal Search with live server sync fallback.
 * Guarantees that documents newly added by admin on another phone/device
 * will be retrieved and displayed to the customer immediately.
 */
export async function searchUniversalDocumentAsync(
  rawQuery: string,
  targetSection?: string,
  preferredSource?: 'australia' | 'canada'
): Promise<UniversalSearchResult | null> {
  // 1. Prioritize querying live central server database for real-time worldwide access
  try {
    const params = new URLSearchParams({ q: rawQuery });
    if (targetSection) params.set('section', targetSection);
    if (preferredSource) params.set('source', preferredSource);

    const res = await fetch(`/api/search?${params.toString()}`, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      if (data && data.found && data.record) {
        if (data.source === 'australia') {
          try {
            const currentPosts = getStoredAdminPosts();
            const existsIdx = currentPosts.findIndex((p) => p.id === data.record.id);
            const updatedList = existsIdx !== -1
              ? currentPosts.map((p, i) => (i === existsIdx ? data.record : p))
              : [data.record, ...currentPosts];
            if (typeof window !== 'undefined') {
              (window as any).__bhp_admin_posts_cache = updatedList;
              localStorage.setItem(POSTS_STORAGE_KEY, JSON.stringify(updatedList));
            }
          } catch (_) {}
          return {
            document: postToUnifiedDoc(data.record, 'australia'),
            source: 'australia',
            rawRecord: data.record,
          };
        } else if (data.source === 'canada') {
          try {
            const currentDocs = getStoredCanadaDocuments();
            const existsIdx = currentDocs.findIndex((c) => c.id === data.record.id);
            const updatedList = existsIdx !== -1
              ? currentDocs.map((c, i) => (i === existsIdx ? data.record : c))
              : [data.record, ...currentDocs];
            if (typeof window !== 'undefined') {
              (window as any).__bhp_canada_documents_cache = updatedList;
              localStorage.setItem(CANADA_STORAGE_KEY, JSON.stringify(updatedList));
            }
          } catch (_) {}
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

  // 2. Fallback to local cache if network offline
  const localMatch = searchUniversalDocument(rawQuery);
  if (localMatch) return localMatch;

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
