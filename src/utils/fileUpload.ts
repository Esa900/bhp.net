export interface UploadedFileResult {
  fileUrl: string;
  fileName: string;
  type: 'pdf' | 'image' | 'other';
  sizeStr: string;
}

const MAX_UPLOAD_BYTES = 35 * 1024 * 1024; // 35MB safe ceiling (server allows 60MB)
const MAX_BASE64_FALLBACK_BYTES = 25 * 1024 * 1024;

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
      `File "${file.name}" (${formatFileSize(file.size)}) exceeds the 35 MB upload limit.`
    );
  }

  const docType = explicitType || inferDocumentType(file.name, file.type);
  const sizeStr = formatFileSize(file.size);

  // Read binary bytes eagerly so mobile file handles cannot expire mid-request
  const buffer = await readFileAsArrayBuffer(file);
  if (!buffer || buffer.byteLength === 0) {
    throw new Error(`Unable to read bytes from "${file.name}".`);
  }

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

  // Fallback to base64 JSON upload if /api/upload-raw failed and size is safe for JSON
  if (file.size <= MAX_BASE64_FALLBACK_BYTES) {
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
      const fallbackJson = await fallbackRes.json().catch(() => null);
      if (fallbackRes.ok && fallbackJson?.fileUrl) {
        return {
          fileUrl: fallbackJson.fileUrl,
          fileName: fallbackJson.fileName || file.name,
          type: fallbackJson.type || docType,
          sizeStr,
        };
      }
      throw new Error(fallbackJson?.error || `Fallback upload failed (HTTP ${fallbackRes.status})`);
    } catch (fallbackErr: any) {
      throw new Error(
        `Failed to upload "${file.name}": ${fallbackErr?.message || rawErrorMsg}`
      );
    }
  }

  throw new Error(`Failed to upload "${file.name}": ${rawErrorMsg}`);
}
