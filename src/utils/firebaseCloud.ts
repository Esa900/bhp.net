import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  setDoc,
  Timestamp,
} from 'firebase/firestore';
import { AdminPost, AttachedDoc } from '../types';
import { CanadaDocumentRecord, CanadaMenuItemConfig } from '../types/canada';
import { DocumentMenuItem } from '../data/menuNavigationItems';
import {
  auth,
  db,
  handleFirestoreError,
  isFirebaseAdminReady,
  OperationType,
} from './firebaseClient';

const CHUNK_CHAR_SIZE = 400000; // ~400 KB per Firestore doc (safely under 1 MiB limit)
const FIRESTORE_PDF_PREFIX = 'firestore://pdf/';

const pdfBytesMemoryCache = new Map<string, Uint8Array>();
const pdfMetaCache = new Map<string, { fileName: string; mimeType: string }>();
const pdfBlobUrlCache = new Map<string, string>();

export function isFirestorePdfUrl(url?: string): boolean {
  return Boolean(url && url.startsWith(FIRESTORE_PDF_PREFIX));
}

export function extractFirestorePdfId(url: string): string | null {
  if (!isFirestorePdfUrl(url)) return null;
  const id = url.slice(FIRESTORE_PDF_PREFIX.length).trim();
  if (!/^[a-zA-Z0-9_\-]+$/.test(id) || id.length > 128) return null;
  return id;
}

function uint8ArrayToBase64(bytes: Uint8Array): string {
  const step = 0x8000;
  let binary = '';
  for (let i = 0; i < bytes.length; i += step) {
    const slice = bytes.subarray(i, Math.min(i + step, bytes.length));
    binary += String.fromCharCode.apply(null, Array.from(slice));
  }
  return btoa(binary);
}

function base64ToUint8Array(base64: string): Uint8Array {
  const clean = base64.replace(/[\s\r\n]+/g, '');
  const binary = atob(clean);
  const len = binary.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

function sanitizeDocId(id: string): string {
  const clean = String(id || '').replace(/[^a-zA-Z0-9_\-]/g, '_').slice(0, 120);
  return clean || `id_${Date.now()}`;
}

function stripUndefinedDeep<T>(obj: T): T {
  if (Array.isArray(obj)) {
    return obj.map((item) => stripUndefinedDeep(item)) as unknown as T;
  }
  if (obj !== null && typeof obj === 'object' && !(obj instanceof Timestamp)) {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(obj as Record<string, unknown>)) {
      if (v !== undefined) {
        out[k] = stripUndefinedDeep(v);
      }
    }
    return out as T;
  }
  return obj;
}

function clampString(val: unknown, maxLen: number): string {
  if (typeof val !== 'string') return '';
  return val.slice(0, maxLen);
}

function sanitizeAttachedDocsList(docs?: AttachedDoc[]): AttachedDoc[] {
  if (!Array.isArray(docs)) return [];
  return docs
    .filter((d) => d && typeof d.name === 'string' && typeof d.dataUrl === 'string' && d.dataUrl.length > 0)
    .slice(0, 50)
    .map((d, idx) => ({
      id: clampString(d.id || `att_${Date.now()}_${idx}`, 128),
      name: clampString(d.name || `Document_${idx + 1}.pdf`, 300),
      size: clampString(d.size || 'Official PDF', 64),
      type: d.type === 'pdf' || d.type === 'image' || d.type === 'other' ? d.type : 'pdf',
      dataUrl: clampString(d.dataUrl, 200000),
      sectionTag: d.sectionTag ? clampString(d.sectionTag, 300) : undefined,
      isPrimary: Boolean(d.isPrimary),
      uploadDate: clampString(d.uploadDate || new Date().toISOString().split('T')[0], 64),
    }));
}

export async function uploadBytesToFirestore(
  bytes: Uint8Array,
  fileName: string,
  mimeType: string,
  docType: 'pdf' | 'image' | 'other'
): Promise<string> {
  const user = auth.currentUser;
  if (!user || !isFirebaseAdminReady()) {
    throw new Error('CLOUD_AUTH_REQUIRED: Sign in with your Admin Google Account to upload PDFs to cloud database.');
  }

  const fileId = `pdf_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const base64 = uint8ArrayToBase64(bytes);
  const chunks: string[] = [];
  for (let i = 0; i < base64.length; i += CHUNK_CHAR_SIZE) {
    chunks.push(base64.slice(i, i + CHUNK_CHAR_SIZE));
  }
  if (chunks.length === 0) {
    throw new Error(`File "${fileName}" is empty.`);
  }
  if (chunks.length > 120) {
    throw new Error(`File "${fileName}" exceeds maximum cloud upload size.`);
  }

  const metaPath = `pdf_files/${fileId}`;
  try {
    await setDoc(doc(db, 'pdf_files', fileId), {
      fileId,
      fileName: clampString(fileName || 'document.pdf', 300),
      mimeType: clampString(mimeType || (docType === 'pdf' ? 'application/pdf' : 'application/octet-stream'), 120),
      docType,
      totalBytes: Math.floor(bytes.byteLength),
      chunkCount: Math.floor(chunks.length),
      isPublicAccessible: true,
      authorUid: user.uid,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, metaPath);
  }

  // Write chunks in parallel batches of 5 for fast mobile/desktop uploads
  for (let i = 0; i < chunks.length; i += 5) {
    const batch = chunks.slice(i, i + 5);
    await Promise.all(
      batch.map(async (chunkData, offset) => {
        const chunkIndex = i + offset;
        const chunkId = `chunk_${chunkIndex}`;
        const chunkPath = `pdf_files/${fileId}/chunks/${chunkId}`;
        try {
          await setDoc(doc(db, 'pdf_files', fileId, 'chunks', chunkId), {
            fileId,
            chunkIndex,
            chunkData,
            authorUid: user.uid,
            createdAt: serverTimestamp(),
          });
        } catch (err) {
          handleFirestoreError(err, OperationType.WRITE, chunkPath);
        }
      })
    );
  }

  const firestoreUrl = `${FIRESTORE_PDF_PREFIX}${fileId}`;
  pdfBytesMemoryCache.set(firestoreUrl, bytes);
  pdfMetaCache.set(firestoreUrl, {
    fileName,
    mimeType: mimeType || (docType === 'pdf' ? 'application/pdf' : 'application/octet-stream'),
  });
  return firestoreUrl;
}

export async function uploadDataUrlToFirestore(
  fileName: string,
  dataUrl: string,
  docType: 'pdf' | 'image' | 'other'
): Promise<string> {
  const commaIdx = dataUrl.indexOf(',');
  const header = commaIdx !== -1 ? dataUrl.slice(0, commaIdx) : '';
  const mimeMatch = header.match(/^data:([^;]+)/i);
  const mimeType = mimeMatch?.[1] || (docType === 'pdf' ? 'application/pdf' : 'image/png');
  const b64 = commaIdx !== -1 ? dataUrl.slice(commaIdx + 1) : dataUrl;
  const bytes = base64ToUint8Array(b64);
  return await uploadBytesToFirestore(bytes, fileName, mimeType, docType);
}

export async function resolveFirestorePdfBytes(url: string): Promise<Uint8Array | null> {
  if (pdfBytesMemoryCache.has(url)) {
    return pdfBytesMemoryCache.get(url)!;
  }
  const fileId = extractFirestorePdfId(url);
  if (!fileId) return null;

  const metaPath = `pdf_files/${fileId}`;
  let metaSnap;
  try {
    metaSnap = await getDoc(doc(db, 'pdf_files', fileId));
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, metaPath);
  }
  if (!metaSnap || !metaSnap.exists()) return null;

  const meta = metaSnap.data() as {
    chunkCount?: number;
    fileName?: string;
    mimeType?: string;
  };
  const chunkCount = Number(meta.chunkCount || 0);
  if (chunkCount <= 0) return null;

  pdfMetaCache.set(url, {
    fileName: meta.fileName || 'document.pdf',
    mimeType: meta.mimeType || 'application/pdf',
  });

  const chunkStrings = await Promise.all(
    Array.from({ length: chunkCount }, async (_, idx) => {
      const chunkId = `chunk_${idx}`;
      const chunkPath = `pdf_files/${fileId}/chunks/${chunkId}`;
      try {
        const snap = await getDoc(doc(db, 'pdf_files', fileId, 'chunks', chunkId));
        return snap.exists() ? String((snap.data() as { chunkData?: string }).chunkData || '') : '';
      } catch (err) {
        handleFirestoreError(err, OperationType.GET, chunkPath);
      }
    })
  );

  const combinedBase64 = chunkStrings.join('');
  if (!combinedBase64) return null;

  const bytes = base64ToUint8Array(combinedBase64);
  pdfBytesMemoryCache.set(url, bytes);
  return bytes;
}

export async function resolveFirestorePdfBlobUrl(url: string): Promise<string | null> {
  if (!isFirestorePdfUrl(url)) return url;
  if (pdfBlobUrlCache.has(url)) {
    return pdfBlobUrlCache.get(url)!;
  }
  const bytes = await resolveFirestorePdfBytes(url);
  if (!bytes) return null;
  const meta = pdfMetaCache.get(url);
  const blob = new Blob([bytes.slice()], { type: meta?.mimeType || 'application/pdf' });
  const blobUrl = URL.createObjectURL(blob);
  pdfBlobUrlCache.set(url, blobUrl);
  return blobUrl;
}

// =========================================================================
// Lookup Key Normalization & Cross-Linked Client Verification Index
// =========================================================================

export function normalizeLookupKey(raw?: string): string | null {
  if (!raw) return null;
  const clean = String(raw)
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
    .slice(0, 100);
  if (clean.length < 2) return null;
  return `KEY_${clean}`;
}

interface RecordLookupFields {
  id?: string;
  refNumber?: string;
  tinOrRef?: string;
  referenceNo?: string;
  idNumber?: string;
  verificationIdNo?: string;
  transitionIdNo?: string;
  passportNumber?: string;
  officialDocNumber?: string;
  lmiaNumber?: string;
  candidateName?: string;
}

export function extractLookupKeysForRecord(rec: RecordLookupFields): string[] {
  const keys = new Set<string>();
  const fields = [
    rec.id,
    rec.refNumber,
    rec.tinOrRef,
    rec.referenceNo,
    rec.idNumber,
    rec.verificationIdNo,
    rec.transitionIdNo,
    rec.passportNumber,
    rec.officialDocNumber,
    rec.lmiaNumber,
    rec.candidateName,
  ];
  fields.forEach((f) => {
    const k = normalizeLookupKey(f);
    if (k) keys.add(k);
    if (f) {
      const digits = String(f).replace(/\D/g, '');
      if (digits.length >= 4 && digits.length <= 20) {
        keys.add(`KEY_${digits}`);
      }
    }
  });
  return Array.from(keys);
}

function orderAttachmentsPrimaryFirst(docs: AttachedDoc[]): AttachedDoc[] {
  const primary: AttachedDoc[] = [];
  const rest: AttachedDoc[] = [];
  const seenKeys = new Set<string>();
  for (const d of docs) {
    if (!d || !d.dataUrl || d.dataUrl === '#') continue;
    const sig = `${(d.sectionTag || 'default').toLowerCase()}::${(d.name || '').toLowerCase()}::${d.dataUrl}`;
    if (seenKeys.has(sig)) continue;
    seenKeys.add(sig);
    if (d.isPrimary) {
      primary.push(d);
    } else {
      rest.push(d);
    }
  }
  return [...primary, ...rest];
}

function clampMediaForIndex(val: unknown): string {
  if (typeof val !== 'string') return '';
  // Never store giant inline base64 blobs inside verification_index documents (1 MiB Firestore cap)
  if (val.startsWith('data:') && val.length > 100000) return '';
  return val.slice(0, 200000);
}

function buildCombinedClientPayload(
  source: 'australia' | 'canada',
  baseRecord: AdminPost | CanadaDocumentRecord,
  allPosts: AdminPost[],
  allCanadaDocs: CanadaDocumentRecord[]
): AdminPost | CanadaDocumentRecord {
  const norm = (v?: string) => (v || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  const targetRefs = new Set<string>();
  [
    (baseRecord as AdminPost).refNumber,
    (baseRecord as CanadaDocumentRecord).tinOrRef,
    (baseRecord as CanadaDocumentRecord).referenceNo,
    (baseRecord as CanadaDocumentRecord).idNumber,
    baseRecord.verificationIdNo,
  ].forEach((v) => {
    const n = norm(v);
    if (n.length >= 4) targetRefs.add(n);
  });
  const targetPassport = norm(baseRecord.passportNumber);
  const targetName = norm(baseRecord.candidateName);

  const belongs = (r: RecordLookupFields) => {
    const rRefs = [r.refNumber, r.tinOrRef, r.referenceNo, r.idNumber, r.verificationIdNo].map(norm);
    if (rRefs.some((k) => k.length >= 4 && targetRefs.has(k))) return true;
    const rPass = norm(r.passportNumber);
    if (targetPassport.length >= 5 && rPass === targetPassport) return true;
    const rName = norm(r.candidateName);
    if (targetName.length >= 5 && rName === targetName) return true;
    return false;
  };

  const combinedAttachments: AttachedDoc[] = [];
  // Always prioritize baseRecord attachments first so newly added primary PDFs lead
  combinedAttachments.push(...(baseRecord.attachedDocuments || []));

  allCanadaDocs.filter(belongs).forEach((c) => {
    if (Array.isArray(c.attachedDocuments)) combinedAttachments.push(...c.attachedDocuments);
  });
  allPosts.filter(belongs).forEach((p) => {
    if (Array.isArray(p.attachedDocuments)) combinedAttachments.push(...p.attachedDocuments);
  });

  const ordered = sanitizeAttachedDocsList(orderAttachmentsPrimaryFirst(combinedAttachments)).map((att) => ({
    ...att,
    dataUrl: att.dataUrl.startsWith('data:') && att.dataUrl.length > 100000 ? '' : att.dataUrl,
  })).filter((att) => Boolean(att.dataUrl));

  const nowTs = Date.now();
  const baseSanitized: Record<string, unknown> = {
    ...baseRecord,
    candidatePhotoUrl: clampMediaForIndex((baseRecord as AdminPost).candidatePhotoUrl),
    updatedAt: typeof (baseRecord as { updatedAt?: number }).updatedAt === 'number'
      ? (baseRecord as { updatedAt?: number }).updatedAt
      : nowTs,
    attachedDocuments: ordered,
  };

  if ('imageUrl' in baseRecord) {
    baseSanitized.imageUrl = clampMediaForIndex((baseRecord as AdminPost).imageUrl);
  }
  if ('galleryImages' in baseRecord && Array.isArray((baseRecord as AdminPost).galleryImages)) {
    baseSanitized.galleryImages = (baseRecord as AdminPost).galleryImages
      .map(clampMediaForIndex)
      .filter(Boolean)
      .slice(0, 20);
  }
  if (source === 'canada' && ordered[0]) {
    baseSanitized.documentFileName = ordered[0].name;
    baseSanitized.documentFileUrl = ordered[0].dataUrl;
  } else if ('documentFileUrl' in baseRecord) {
    baseSanitized.documentFileUrl = clampMediaForIndex((baseRecord as CanadaDocumentRecord).documentFileUrl);
  }

  return baseSanitized as unknown as AdminPost | CanadaDocumentRecord;
}

async function upsertVerificationKeysForRecord(
  source: 'australia' | 'canada',
  record: AdminPost | CanadaDocumentRecord,
  allPosts: AdminPost[],
  allCanadaDocs: CanadaDocumentRecord[]
): Promise<void> {
  const user = auth.currentUser;
  if (!user || !isFirebaseAdminReady()) return;

  const combinedRecord = buildCombinedClientPayload(source, record, allPosts, allCanadaDocs);
  const keySet = new Set<string>(extractLookupKeysForRecord(combinedRecord as RecordLookupFields));

  const norm = (v?: string) => (v || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  const targetRefs = new Set<string>();
  [
    (record as AdminPost).refNumber,
    (record as CanadaDocumentRecord).tinOrRef,
    (record as CanadaDocumentRecord).referenceNo,
    (record as CanadaDocumentRecord).idNumber,
    record.verificationIdNo,
  ].forEach((v) => {
    const n = norm(v);
    if (n.length >= 4) targetRefs.add(n);
  });
  const targetPassport = norm(record.passportNumber);
  const targetName = norm(record.candidateName);
  const belongs = (r: RecordLookupFields) => {
    const rRefs = [r.refNumber, r.tinOrRef, r.referenceNo, r.idNumber, r.verificationIdNo].map(norm);
    if (rRefs.some((k) => k.length >= 4 && targetRefs.has(k))) return true;
    const rPass = norm(r.passportNumber);
    if (targetPassport.length >= 5 && rPass === targetPassport) return true;
    const rName = norm(r.candidateName);
    if (targetName.length >= 5 && rName === targetName) return true;
    return false;
  };

  allPosts.filter(belongs).forEach((p) => {
    extractLookupKeysForRecord(p).forEach((k) => keySet.add(k));
  });
  allCanadaDocs.filter(belongs).forEach((c) => {
    extractLookupKeysForRecord(c).forEach((k) => keySet.add(k));
  });

  const keys = Array.from(keySet);
  const recordId = sanitizeDocId(record.id);
  const isPublished =
    source === 'australia' ? (record as AdminPost).status !== 'Draft' : true;
  const referenceNumber = clampString(
    (record as CanadaDocumentRecord).tinOrRef ||
      (record as CanadaDocumentRecord).referenceNo ||
      (record as AdminPost).refNumber ||
      record.id,
    128
  );

  await Promise.all(
    keys.map(async (lookupKey) => {
      const path = `verification_index/${lookupKey}`;
      try {
        const ref = doc(db, 'verification_index', lookupKey);
        const existingSnap = await getDoc(ref);
        const existingData = existingSnap.exists() ? existingSnap.data() : null;
        await setDoc(
          ref,
          stripUndefinedDeep({
            lookupKey,
            source,
            recordId,
            referenceNumber,
            candidateName: clampString(record.candidateName || '', 300),
            passportNumber: clampString(record.passportNumber || '', 100),
            recordData: combinedRecord,
            isPublished,
            authorUid: existingData?.authorUid || user.uid,
            createdAt: existingData?.createdAt || serverTimestamp(),
            updatedAt: serverTimestamp(),
          })
        );
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, path);
      }
    })
  );
}

export async function lookupVerificationIndexInFirestore(
  rawQuery: string
): Promise<{ source: 'australia' | 'canada'; record: AdminPost | CanadaDocumentRecord } | null> {
  const candidates = new Set<string>();
  const primaryKey = normalizeLookupKey(rawQuery);
  if (primaryKey) candidates.add(primaryKey);
  const digitsOnly = String(rawQuery || '').replace(/\D/g, '');
  if (digitsOnly.length >= 4 && digitsOnly.length <= 20) {
    candidates.add(`KEY_${digitsOnly}`);
  }

  for (const key of candidates) {
    const path = `verification_index/${key}`;
    try {
      const snap = await getDoc(doc(db, 'verification_index', key));
      if (snap.exists()) {
        const data = snap.data() as {
          source?: 'australia' | 'canada';
          recordData?: (AdminPost | CanadaDocumentRecord) & { updatedAt?: unknown };
          isPublished?: boolean;
          updatedAt?: unknown;
        };
        if (data && data.recordData && (data.isPublished !== false || isFirebaseAdminReady())) {
          const resolveMillis = (val: unknown): number => {
            if (typeof val === 'number' && Number.isFinite(val)) return val;
            if (val instanceof Timestamp) return val.toMillis();
            if (val && typeof val === 'object' && typeof (val as { seconds?: number }).seconds === 'number') {
              return (val as { seconds: number }).seconds * 1000;
            }
            return 0;
          };
          const normalizedUpdatedAt =
            resolveMillis(data.recordData.updatedAt) || resolveMillis(data.updatedAt) || Date.now();
          return {
            source: data.source || 'canada',
            record: {
              ...data.recordData,
              updatedAt: normalizedUpdatedAt,
            },
          };
        }
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.toLowerCase().includes('offline') || msg.toLowerCase().includes('network')) {
        return null;
      }
      // If rules rejected an invalid/unpublished key, treat as not found cleanly
      console.warn(`Verification lookup skipped for ${path}:`, msg);
    }
  }
  return null;
}

// =========================================================================
// Admin Firestore CRUD for Posts, Canada Docs & Menu Configs
// =========================================================================

function formatPostForFirestore(post: AdminPost, authorUid: string, existingCreatedAt: unknown) {
  return stripUndefinedDeep({
    id: sanitizeDocId(post.id),
    title: clampString(post.title || 'Untitled Document', 400),
    refNumber: clampString(post.refNumber || post.id, 128),
    content: clampString(post.content || '', 20000),
    category: clampString(post.category || 'Employment Application & Verification', 300),
    author: clampString(post.author || 'BHP Operations', 200),
    date: clampString(post.date || new Date().toISOString().split('T')[0], 64),
    status: post.status === 'Draft' ? 'Draft' : 'Published',
    imageUrl: clampString(post.imageUrl || '', 200000),
    candidatePhotoUrl: clampString(post.candidatePhotoUrl || '', 200000),
    galleryImages: Array.isArray(post.galleryImages)
      ? post.galleryImages.filter((u) => typeof u === 'string').slice(0, 30).map((u) => clampString(u, 200000))
      : [],
    attachedDocuments: sanitizeAttachedDocsList(post.attachedDocuments),
    readTime: clampString(post.readTime || '3 min read', 64),
    badges: Array.isArray(post.badges) ? post.badges.filter((b) => typeof b === 'string').slice(0, 20) : [],
    candidateName: clampString(post.candidateName || '', 300),
    passportNumber: clampString(post.passportNumber || '', 100),
    nationality: clampString(post.nationality || '', 120),
    dateOfBirth: clampString(post.dateOfBirth || '', 64),
    jobTitle: clampString(post.jobTitle || '', 300),
    employerName: clampString(post.employerName || '', 300),
    workLocation: clampString(post.workLocation || '', 300),
    salaryPackage: clampString(post.salaryPackage || '', 150),
    visaSubclass: clampString(post.visaSubclass || '', 200),
    issueDate: clampString(post.issueDate || '', 64),
    expiryDate: clampString(post.expiryDate || '', 64),
    verificationIdNo: clampString(post.verificationIdNo || '', 128),
    authorUid,
    createdAt: existingCreatedAt || serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

function formatCanadaDocForFirestore(docRec: CanadaDocumentRecord, authorUid: string, existingCreatedAt: unknown) {
  const validStatus = ['Verified', 'Pending', 'Approved', 'Active'].includes(docRec.status)
    ? docRec.status
    : docRec.status === 'Under Review'
    ? 'Pending'
    : 'Verified';
  return stripUndefinedDeep({
    id: sanitizeDocId(docRec.id),
    categoryType: clampString(docRec.categoryType || 'work-permit-pending', 128),
    mainTitle: clampString(docRec.mainTitle || 'Canada Work Permit Document', 400),
    subMenu: clampString(docRec.subMenu || '', 400),
    tinOrRef: clampString(docRec.tinOrRef || '', 128),
    idNumber: clampString(docRec.idNumber || '', 128),
    verificationIdNo: clampString(docRec.verificationIdNo || '', 128),
    transitionIdNo: clampString(docRec.transitionIdNo || '', 128),
    referenceNo: clampString(docRec.referenceNo || '', 128),
    candidateName: clampString(docRec.candidateName || '', 300),
    candidatePhotoUrl: clampString(docRec.candidatePhotoUrl || '', 200000),
    passportNumber: clampString(docRec.passportNumber || '', 100),
    nationality: clampString(docRec.nationality || '', 120),
    dateOfBirth: clampString(docRec.dateOfBirth || '', 64),
    jobTitle: clampString(docRec.jobTitle || '', 300),
    employerName: clampString(docRec.employerName || '', 300),
    workLocation: clampString(docRec.workLocation || '', 300),
    hourlyWageOrSalary: clampString(docRec.hourlyWageOrSalary || '', 150),
    workingHours: clampString(docRec.workingHours || '', 100),
    status: validStatus,
    issueDate: clampString(docRec.issueDate || '', 64),
    expiryDate: clampString(docRec.expiryDate || '', 64),
    officialDocNumber: clampString(docRec.officialDocNumber || '', 150),
    lmiaNumber: clampString(docRec.lmiaNumber || '', 150),
    documentFileName: clampString(docRec.documentFileName || '', 300),
    documentFileUrl: clampString(docRec.documentFileUrl || '', 200000),
    notes: clampString(docRec.notes || '', 20000),
    attachedDocuments: sanitizeAttachedDocsList(docRec.attachedDocuments),
    recordCreatedAt: clampString(docRec.createdAt || new Date().toISOString(), 64),
    authorUid,
    createdAt: existingCreatedAt || serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

function firestoreDocToAdminPost(raw: Record<string, unknown>): AdminPost {
  const updatedTs = raw.updatedAt instanceof Timestamp ? raw.updatedAt.toMillis() : Date.now();
  return {
    ...(raw as unknown as AdminPost),
    updatedAt: updatedTs,
  };
}

function firestoreDocToCanadaRecord(raw: Record<string, unknown>): CanadaDocumentRecord {
  const updatedTs = raw.updatedAt instanceof Timestamp ? raw.updatedAt.toMillis() : Date.now();
  return {
    ...(raw as unknown as CanadaDocumentRecord),
    createdAt: typeof raw.recordCreatedAt === 'string' ? raw.recordCreatedAt : new Date().toISOString(),
    updatedAt: updatedTs,
  };
}

export async function upsertPostToFirestore(
  post: AdminPost,
  allPosts: AdminPost[],
  allCanadaDocs: CanadaDocumentRecord[]
): Promise<void> {
  const user = auth.currentUser;
  if (!user || !isFirebaseAdminReady()) return;

  const postId = sanitizeDocId(post.id);
  const path = `posts/${postId}`;
  try {
    const ref = doc(db, 'posts', postId);
    const snap = await getDoc(ref);
    const existing = snap.exists() ? snap.data() : null;
    const payload = formatPostForFirestore(
      { ...post, id: postId },
      existing?.authorUid || user.uid,
      existing?.createdAt
    );
    await setDoc(ref, payload);
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }

  await upsertVerificationKeysForRecord('australia', { ...post, id: postId }, allPosts, allCanadaDocs);
}

export async function upsertCanadaDocToFirestore(
  docRec: CanadaDocumentRecord,
  allPosts: AdminPost[],
  allCanadaDocs: CanadaDocumentRecord[]
): Promise<void> {
  const user = auth.currentUser;
  if (!user || !isFirebaseAdminReady()) return;

  const docId = sanitizeDocId(docRec.id);
  const path = `canada_documents/${docId}`;
  try {
    const ref = doc(db, 'canada_documents', docId);
    const snap = await getDoc(ref);
    const existing = snap.exists() ? snap.data() : null;
    const payload = formatCanadaDocForFirestore(
      { ...docRec, id: docId },
      existing?.authorUid || user.uid,
      existing?.createdAt
    );
    await setDoc(ref, payload);
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }

  await upsertVerificationKeysForRecord('canada', { ...docRec, id: docId }, allPosts, allCanadaDocs);
}

export async function deletePostFromFirestore(
  postId: string,
  deletedPost: AdminPost | undefined,
  remainingPosts: AdminPost[],
  allCanadaDocs: CanadaDocumentRecord[]
): Promise<void> {
  if (!isFirebaseAdminReady()) return;
  const cleanId = sanitizeDocId(postId);
  const path = `posts/${cleanId}`;
  try {
    await deleteDoc(doc(db, 'posts', cleanId));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, path);
  }

  if (deletedPost) {
    const keys = extractLookupKeysForRecord(deletedPost);
    await Promise.all(
      keys.map(async (key) => {
        try {
          await deleteDoc(doc(db, 'verification_index', key));
        } catch (err) {
          handleFirestoreError(err, OperationType.DELETE, `verification_index/${key}`);
        }
      })
    );
  }

  // Re-index any remaining records that share candidate/ref info
  const relatedCanada = deletedPost
    ? allCanadaDocs.find(
        (c) =>
          (deletedPost.refNumber && c.tinOrRef === deletedPost.refNumber) ||
          (deletedPost.passportNumber && c.passportNumber === deletedPost.passportNumber)
      )
    : undefined;
  if (relatedCanada) {
    await upsertVerificationKeysForRecord('canada', relatedCanada, remainingPosts, allCanadaDocs);
  }
}

export async function deleteCanadaDocFromFirestore(
  docId: string,
  deletedDoc: CanadaDocumentRecord | undefined,
  allPosts: AdminPost[],
  remainingCanadaDocs: CanadaDocumentRecord[]
): Promise<void> {
  if (!isFirebaseAdminReady()) return;
  const cleanId = sanitizeDocId(docId);
  const path = `canada_documents/${cleanId}`;
  try {
    await deleteDoc(doc(db, 'canada_documents', cleanId));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, path);
  }

  if (deletedDoc) {
    const keys = extractLookupKeysForRecord(deletedDoc);
    await Promise.all(
      keys.map(async (key) => {
        try {
          await deleteDoc(doc(db, 'verification_index', key));
        } catch (err) {
          handleFirestoreError(err, OperationType.DELETE, `verification_index/${key}`);
        }
      })
    );
  }

  const relatedPost = deletedDoc
    ? allPosts.find(
        (p) =>
          (deletedDoc.tinOrRef && p.refNumber === deletedDoc.tinOrRef) ||
          (deletedDoc.passportNumber && p.passportNumber === deletedDoc.passportNumber)
      )
    : undefined;
  if (relatedPost) {
    await upsertVerificationKeysForRecord('australia', relatedPost, allPosts, remainingCanadaDocs);
  }
}

export async function fetchPostsFromFirestoreForAdmin(): Promise<AdminPost[] | null> {
  if (!isFirebaseAdminReady()) return null;
  try {
    const snap = await getDocs(collection(db, 'posts'));
    return snap.docs.map((d) => firestoreDocToAdminPost(d.data() as Record<string, unknown>));
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, 'posts');
  }
}

export async function fetchCanadaDocsFromFirestoreForAdmin(): Promise<CanadaDocumentRecord[] | null> {
  if (!isFirebaseAdminReady()) return null;
  try {
    const snap = await getDocs(collection(db, 'canada_documents'));
    return snap.docs.map((d) => firestoreDocToCanadaRecord(d.data() as Record<string, unknown>));
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, 'canada_documents');
  }
}

export async function saveMenuConfigToFirestore(
  configId: 'australia_menu' | 'canada_menu',
  items: (DocumentMenuItem | CanadaMenuItemConfig)[]
): Promise<void> {
  const user = auth.currentUser;
  if (!user || !isFirebaseAdminReady()) return;
  const path = `menu_configs/${configId}`;
  try {
    const ref = doc(db, 'menu_configs', configId);
    const snap = await getDoc(ref);
    const existing = snap.exists() ? snap.data() : null;
    await setDoc(
      ref,
      stripUndefinedDeep({
        configId,
        items: items.slice(0, 50),
        isPublicMenu: true,
        authorUid: existing?.authorUid || user.uid,
        createdAt: existing?.createdAt || serverTimestamp(),
        updatedAt: serverTimestamp(),
      })
    );
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

export async function fetchMenuConfigFromFirestore<T>(
  configId: 'australia_menu' | 'canada_menu'
): Promise<T[] | null> {
  const path = `menu_configs/${configId}`;
  try {
    const snap = await getDoc(doc(db, 'menu_configs', configId));
    if (snap.exists()) {
      const data = snap.data() as { items?: T[] };
      if (Array.isArray(data.items) && data.items.length > 0) {
        return data.items;
      }
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    if (!msg.toLowerCase().includes('offline') && !msg.toLowerCase().includes('network')) {
      console.warn(`Menu config fetch note (${path}):`, msg);
    }
  }
  return null;
}

export async function deleteAllPostsFromFirestore(allCanadaDocs: CanadaDocumentRecord[] = []): Promise<void> {
  if (!isFirebaseAdminReady()) return;
  try {
    const snap = await getDocs(collection(db, 'posts'));
    for (const d of snap.docs) {
      const data = firestoreDocToAdminPost(d.data() as Record<string, unknown>);
      await deletePostFromFirestore(d.id, data, [], allCanadaDocs);
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, 'posts');
  }
}

export async function deleteAllCanadaDocsFromFirestore(allPosts: AdminPost[] = []): Promise<void> {
  if (!isFirebaseAdminReady()) return;
  try {
    const snap = await getDocs(collection(db, 'canada_documents'));
    for (const d of snap.docs) {
      const data = firestoreDocToCanadaRecord(d.data() as Record<string, unknown>);
      await deleteCanadaDocFromFirestore(d.id, data, allPosts, []);
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, 'canada_documents');
  }
}

export async function syncLocalRecordsToFirestoreIfEmpty(
  localPosts: AdminPost[],
  localCanadaDocs: CanadaDocumentRecord[],
  deletedIds: string[] = []
): Promise<void> {
  if (!isFirebaseAdminReady()) return;
  try {
    const deletedSet = new Set(deletedIds);
    const [remotePostsSnap, remoteCanadaSnap] = await Promise.all([
      getDocs(collection(db, 'posts')),
      getDocs(collection(db, 'canada_documents')),
    ]);

    const remotePostsById = new Map(
      remotePostsSnap.docs.map((d) => [d.id, firestoreDocToAdminPost(d.data() as Record<string, unknown>)])
    );
    const remoteCanadaById = new Map(
      remoteCanadaSnap.docs.map((d) => [d.id, firestoreDocToCanadaRecord(d.data() as Record<string, unknown>)])
    );

    for (const p of localPosts) {
      if (!p?.id || deletedSet.has(p.id)) continue;
      const remote = remotePostsById.get(sanitizeDocId(p.id));
      const localCount = Array.isArray(p.attachedDocuments) ? p.attachedDocuments.length : 0;
      const remoteCount = Array.isArray(remote?.attachedDocuments) ? remote!.attachedDocuments.length : 0;
      const shouldPush =
        !remote ||
        Number(p.updatedAt || 0) > Number(remote.updatedAt || 0) ||
        localCount > remoteCount;
      if (shouldPush) {
        await upsertPostToFirestore(p, localPosts, localCanadaDocs);
      }
    }
    for (const c of localCanadaDocs) {
      if (!c?.id || deletedSet.has(c.id)) continue;
      const remote = remoteCanadaById.get(sanitizeDocId(c.id));
      const localCount = Array.isArray(c.attachedDocuments) ? c.attachedDocuments.length : 0;
      const remoteCount = Array.isArray(remote?.attachedDocuments) ? remote!.attachedDocuments.length : 0;
      const shouldPush =
        !remote ||
        Number(c.updatedAt || 0) > Number(remote.updatedAt || 0) ||
        localCount > remoteCount;
      if (shouldPush) {
        await upsertCanadaDocToFirestore(c, localPosts, localCanadaDocs);
      }
    }
  } catch (err) {
    console.warn('Cloud sync missing records note:', err);
  }
}
