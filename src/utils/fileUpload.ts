import { isFirebaseAdminReady } from './firebaseClient';
import { uploadBytesToFirestore, uploadDataUrlToFirestore } from './firebaseCloud';

export interface UploadedFileResult {
  fileUrl: string;
  fileName: string;
  type: 'pdf' | 'image' | 'other';
  sizeStr: string;
}

const MAX_UPLOAD_BYTES = 25 * 1024 * 1024; // 25MB safe ceiling (under Nginx 32M & Firestore chunked ceiling)
const MAX_BASE64_FALLBACK_BYTES = 20 * 1024 * 1024;

export function formatFileSize(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return '0 KB';
  if (bytes >= 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  }
  return `${Math.max(0.1, bytes / 1024).toFixed(1)} KB`;
}

export function inferDocumentType(fileName: string, mimeType = ''): 'pdf' | 'image' | 'other' {
  const lowerName = (fileName || '').toLowerCase();
  const lowerMime = (mimeType || '').toLowerCase();
  if (lowerName.endsWith('.pdf') || lowerMime.includes('pdf')) {
    return 'pdf';
  }
  if (lowerMime.startsWith('image/') || /\.(jpg|jpeg|png|webp|gif)$/.test(lowerName)) {
    return 'image';
  }
  return 'other';
}

export async function readFileAsArrayBuffer(file: File): Promise<ArrayBuffer> {
  if (typeof file.arrayBuffer === 'function') {
    return await file.arrayBuffer();
  }
  return await new Promise<ArrayBuffer>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result instanceof ArrayBuffer) {
        resolve(reader.result);
      } else {
        reject(new Error('Could not read file bytes'));
      }
    };
    reader.onerror = () => reject(reader.error || new Error('File read error'));
    reader.onabort = () => reject(new Error('File read aborted'));
    reader.readAsArrayBuffer(file);
  });
}

export async function readFileAsDataUrl(file: File): Promise<string> {
  return await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string' && reader.result.length > 0) {
        resolve(reader.result);
      } else {
        reject(new Error('Empty data URL from file'));
      }
    };
    reader.onerror = () => reject(reader.error || new Error('Failed to read file as data URL'));
    reader.onabort = () => reject(new Error('File read aborted'));
    reader.readAsDataURL(file);
  });
}

export async function uploadDataUrlDocument(
  fileName: string,
  dataUrl: string,
  explicitType?: 'pdf' | 'image' | 'other'
): Promise<string> {
  const docType = explicitType || inferDocumentType(fileName);
  if (isFirebaseAdminReady()) {
    return await uploadDataUrlToFirestore(fileName, dataUrl, docType);
  }
  const upRes = await fetch('/api/upload-file', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fileName: fileName || 'document.pdf',
      fileData: dataUrl,
      type: docType,
    }),
  });
  const ct = (upRes.headers.get('content-type') || '').toLowerCase();
  const payload = ct.includes('application/json') ? await upRes.json().catch(() => null) : null;
  if (upRes.ok && payload?.fileUrl) {
    return payload.fileUrl;
  }
  if (upRes.status === 404) {
    throw new Error('CLOUD_AUTH_REQUIRED: ক্লাউড ডাটাবেজে সেভ করতে Admin Google Account (mdesaali391@gmail.com) দিয়ে Sign-In করুন।');
  }
  throw new Error(payload?.error || `Upload failed (HTTP ${upRes.status})`);
}

export async function uploadBinaryDocument(
  file: File,
  explicitType?: 'pdf' | 'image' | 'other'
): Promise<UploadedFileResult> {
  if (!file) {
    throw new Error('No file provided.');
  }
  if (file.size === 0) {
    throw new Error(`File "${file.name}" is empty (0 bytes).`);
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    throw new Error(
      `File "${file.name}" (${formatFileSize(file.size)}) exceeds the 25 MB upload limit.`
    );
  }

  const docType = explicitType || inferDocumentType(file.name, file.type);
  const sizeStr = formatFileSize(file.size);

  // Read binary bytes eagerly so mobile file handles cannot expire mid-request
  const buffer = await readFileAsArrayBuffer(file);
  if (!buffer || buffer.byteLength === 0) {
    throw new Error(`Unable to read bytes from "${file.name}".`);
  }
  const bytes = new Uint8Array(buffer);

  // 1. Primary Worldwide Cloud Path: Firebase Firestore (works on Vercel, AI Studio, Shared App & any mobile device)
  if (isFirebaseAdminReady()) {
    const firestoreUrl = await uploadBytesToFirestore(
      bytes,
      file.name,
      file.type || (docType === 'pdf' ? 'application/pdf' : 'application/octet-stream'),
      docType
    );

    // Optional best-effort mirror to Express disk if running locally (ignore 404 on static hosts)
    fetch(
      `/api/upload-raw?fileName=${encodeURIComponent(file.name)}&type=${encodeURIComponent(docType)}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': file.type || 'application/octet-stream',
          'X-File-Name': encodeURIComponent(file.name),
        },
        body: buffer,
      }
    ).catch(() => {});

    return {
      fileUrl: firestoreUrl,
      fileName: file.name,
      type: docType,
      sizeStr,
    };
  }

  // 2. Express Backend Path (when running with server.ts without Firebase Google Sign-In)
  let rawStatus = 0;
  let rawErrorMsg = '';
  try {
    const upRes = await fetch(
      `/api/upload-raw?fileName=${encodeURIComponent(file.name)}&type=${encodeURIComponent(docType)}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': file.type || 'application/octet-stream',
          'X-File-Name': encodeURIComponent(file.name),
        },
        body: buffer,
      }
    );
    rawStatus = upRes.status;

    const ct = (upRes.headers.get('content-type') || '').toLowerCase();
    const payload = ct.includes('application/json') ? await upRes.json().catch(() => null) : null;

    if (upRes.ok && payload?.fileUrl) {
      return {
        fileUrl: payload.fileUrl,
        fileName: payload.fileName || file.name,
        type: payload.type || docType,
        sizeStr,
      };
    }

    rawErrorMsg = payload?.error || `Raw upload failed (HTTP ${upRes.status})`;
  } catch (err: any) {
    rawErrorMsg = err?.message || 'Network error during raw upload';
  }

  // 3. Fallback base64 JSON upload if raw route failed with non-404 (or retry on Express)
  if (rawStatus !== 404 && file.size <= MAX_BASE64_FALLBACK_BYTES) {
    try {
      const dataUrl = await readFileAsDataUrl(file);
      const fallbackRes = await fetch('/api/upload-file', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName: file.name,
          fileData: dataUrl,
          type: docType,
        }),
      });
      const fallbackCt = (fallbackRes.headers.get('content-type') || '').toLowerCase();
      const fallbackJson = fallbackCt.includes('application/json')
        ? await fallbackRes.json().catch(() => null)
        : null;
      if (fallbackRes.ok && fallbackJson?.fileUrl) {
        return {
          fileUrl: fallbackJson.fileUrl,
          fileName: fallbackJson.fileName || file.name,
          type: fallbackJson.type || docType,
          sizeStr,
        };
      }
      if (fallbackRes.status === 404) {
        rawStatus = 404;
      } else {
        throw new Error(fallbackJson?.error || `Fallback upload failed (HTTP ${fallbackRes.status})`);
      }
    } catch (fallbackErr: any) {
      if (rawStatus !== 404) {
        throw new Error(
          `Failed to upload "${file.name}": ${fallbackErr?.message || rawErrorMsg}`
        );
      }
    }
  }

  if (rawStatus === 404) {
    throw new Error(
      `CLOUD_AUTH_REQUIRED: ক্লাউড ডাটাবেজে পিডিএফ সেভ করতে প্রথমে "Connect Google Cloud Sync" বাটনে ক্লিক করে Google দিয়ে Sign-In করুন।`
    );
  }

  throw new Error(`Failed to upload "${file.name}": ${rawErrorMsg}`);
}
