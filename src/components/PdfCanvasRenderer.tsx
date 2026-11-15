import React, { useEffect, useRef, useState } from 'react';
import type { PDFDocumentProxy, RenderTask } from 'pdfjs-dist/legacy/build/pdf.mjs';
import { Loader2, FileText, ShieldCheck } from 'lucide-react';
import { isFirestorePdfUrl, resolveFirestorePdfBytes } from '../utils/firebaseCloud';

// Cached dynamic loader for PDF.js Legacy build (compatible across all mobile Chrome/Safari and desktop browsers without Map.prototype.getOrInsertComputed)
let pdfjsPromise: Promise<typeof import('pdfjs-dist/legacy/build/pdf.mjs')> | null = null;
async function getPdfjs(): Promise<typeof import('pdfjs-dist/legacy/build/pdf.mjs')> {
  if (!pdfjsPromise) {
    pdfjsPromise = (async () => {
      const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
      try {
        if (typeof window !== 'undefined') {
          // @ts-expect-error Vite ?url query asset import
          const workerModule = await import('pdfjs-dist/legacy/build/pdf.worker.min.mjs?url');
          const workerUrl = workerModule.default || workerModule;
          if (pdfjs.GlobalWorkerOptions) {
            pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;
          }
        }
      } catch (err) {
        console.warn('PDF.js worker initialization warning:', err);
      }
      return pdfjs;
    })();
  }
  return pdfjsPromise;
}

interface PdfCanvasRendererProps {
  dataUrl: string;
  docName?: string;
  zoom?: number; // 100 is default
}

/**
 * Converts a Firestore URL, data URI, Base64, or binary URL to a Uint8Array safely on both mobile & desktop.
 */
async function extractPdfBytes(dataUrl: string): Promise<Uint8Array | null> {
  if (!dataUrl || dataUrl === '#' || dataUrl.length < 10) return null;

  let normalized = dataUrl.trim();
  if (normalized.startsWith('data:application/octet-stream;base64,JVBERi')) {
    normalized = normalized.replace('data:application/octet-stream', 'data:application/pdf');
  }

  // 0. Resolve Firebase Firestore chunked PDF URLs (works across Vercel, AI Studio & all phones)
  if (isFirestorePdfUrl(normalized)) {
    try {
      const cloudBytes = await resolveFirestorePdfBytes(normalized);
      if (cloudBytes && cloudBytes.length > 0) {
        return cloudBytes;
      }
    } catch (err) {
      console.warn('Firestore PDF resolve failed:', err);
    }
    return null;
  }

  // 1. Try native fetch API for blob:, http(s) URLs, and relative paths (/uploads/...)
  if (
    normalized.startsWith('blob:') ||
    normalized.startsWith('http://') ||
    normalized.startsWith('https://') ||
    normalized.startsWith('/')
  ) {
    try {
      const res = await fetch(normalized, { cache: 'no-store' });
      if (!res.ok) {
        throw new Error(`HTTP ${res.status} loading PDF`);
      }
      const ct = (res.headers.get('content-type') || '').toLowerCase();
      if (ct.includes('text/html')) {
        throw new Error('Server returned HTML instead of PDF file');
      }
      const buffer = await res.arrayBuffer();
      return new Uint8Array(buffer);
    } catch (err) {
      console.warn('Native fetch failed for URL, trying fallback:', err);
    }
  }

  // 2. Fast Base64 decode for data URIs and raw Base64
  try {
    const commaIdx = normalized.indexOf(',');
    const base64Str = commaIdx !== -1 ? normalized.substring(commaIdx + 1) : normalized;
    const cleanStr = base64Str.replace(/[\s\r\n]+/g, '');
    const binaryStr = atob(cleanStr);
    const len = binaryStr.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryStr.charCodeAt(i);
    }
    return bytes;
  } catch (err) {
    console.warn('Base64 decode failed, trying fetch fallback:', err);
  }

  // 3. Fallback fetch on data URI
  try {
    if (normalized.startsWith('data:')) {
      const res = await fetch(normalized);
      if (!res.ok) {
        throw new Error(`HTTP ${res.status} decoding data URI`);
      }
      const buffer = await res.arrayBuffer();
      return new Uint8Array(buffer);
    }
  } catch (err) {
    console.warn('Data URI fetch fallback failed:', err);
  }

  return null;
}

export const PdfCanvasRenderer: React.FC<PdfCanvasRendererProps> = ({
  dataUrl,
  docName = 'Official Attached Document',
  zoom = 100,
}) => {
  const [numPages, setNumPages] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [useIframeFallback, setUseIframeFallback] = useState<boolean>(false);
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [pdfDoc, setPdfDoc] = useState<PDFDocumentProxy | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Load PDF cleanly with StrictMode-safe lifecycle & automatic timeout fallback
  useEffect(() => {
    let isCancelled = false;
    let localBlobUrl: string | null = null;
    let activeTask: { promise: Promise<PDFDocumentProxy>; destroy?: () => Promise<void> | void } | null = null;
    let loadedDoc: PDFDocumentProxy | null = null;

    async function loadPdf() {
      if (!dataUrl || dataUrl === '#' || dataUrl.length < 10) {
        if (!isCancelled) {
          setIsLoading(false);
          setPdfDoc(null);
          setNumPages(0);
          setUseIframeFallback(false);
        }
        return;
      }

      if (!isCancelled) {
        setIsLoading(true);
        setUseIframeFallback(false);
        setPdfDoc(null);
        setNumPages(0);
      }

      try {
        const bytes = await extractPdfBytes(dataUrl);
        if (isCancelled) return;

        if (!bytes || bytes.length === 0) {
          throw new Error('Empty PDF byte stream');
        }

        // Create clean local blob URL for fallback iframe rendering
        if (typeof window !== 'undefined') {
          try {
            const blob = new Blob([bytes.slice()], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            if (isCancelled) {
              URL.revokeObjectURL(url);
              return;
            }
            localBlobUrl = url;
            setBlobUrl(url);
          } catch (e) {
            console.warn('Blob creation error:', e);
          }
        }

        const pdfjs = await getPdfjs();
        if (isCancelled) return;

        const openWithTimeout = async (stopAtErrors: boolean): Promise<PDFDocumentProxy> => {
          const task = pdfjs.getDocument({
            data: bytes.slice(), // Always pass a fresh copy so ArrayBuffer transfer never detaches caller bytes
            cMapPacked: true,
            stopAtErrors,
          });
          activeTask = task;

          let timeoutId: ReturnType<typeof setTimeout> | null = null;
          const timeoutPromise = new Promise<never>((_, reject) => {
            timeoutId = setTimeout(() => {
              reject(new Error('PDF decode timeout'));
            }, 8000);
          });

          try {
            const doc = await Promise.race([task.promise, timeoutPromise]);
            return doc;
          } finally {
            if (timeoutId) clearTimeout(timeoutId);
          }
        };

        let doc: PDFDocumentProxy;
        try {
          doc = await openWithTimeout(true);
        } catch (workerErr) {
          if (isCancelled) return;
          console.warn('PDF.js primary load warning, retrying:', workerErr);
          doc = await openWithTimeout(false);
        }

        if (isCancelled) {
          await (doc as { destroy?: () => Promise<void> }).destroy?.().catch(() => {});
          return;
        }

        loadedDoc = doc;
        setPdfDoc(doc);
        setNumPages(doc.numPages);
        setIsLoading(false);
      } catch (err: unknown) {
        if (isCancelled) return;
        console.warn('PDF.js canvas parsing fallback triggered, opening inline frame:', err);
        setUseIframeFallback(true);
        setIsLoading(false);
      }
    }

    loadPdf();

    return () => {
      isCancelled = true;
      if (activeTask && typeof activeTask.destroy === 'function') {
        try {
          Promise.resolve(activeTask.destroy()).catch(() => {});
        } catch (_) {}
      }
      const destroyDoc = loadedDoc ? (loadedDoc as { destroy?: () => Promise<void> }).destroy : undefined;
      if (typeof destroyDoc === 'function') {
        try {
          Promise.resolve(destroyDoc.call(loadedDoc)).catch(() => {});
        } catch (_) {}
      }
      if (localBlobUrl) {
        URL.revokeObjectURL(localBlobUrl);
      }
    };
  }, [dataUrl]);

  return (
    <div
      ref={containerRef}
      className="w-full flex flex-col items-center justify-center select-none"
      onContextMenu={(e) => e.preventDefault()}
    >
      {/* Document Header Bar (Clean - Corner action buttons removed) */}
      <div className="w-full max-w-[900px] flex flex-wrap items-center justify-between gap-2 px-3 py-2 bg-[#12141A] rounded-xl border border-[#272B36] mb-3 text-xs">
        <div className="flex items-center gap-2 min-w-0">
          <FileText className="w-4 h-4 text-[#FF5500] shrink-0" />
          <span className="font-bold text-white truncate max-w-[220px] sm:max-w-lg">
            {docName}
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {numPages > 0 && (
            <span className="px-2 py-0.5 rounded-md bg-[#1F232D] text-[#FF8E4D] font-mono text-[11px] font-bold border border-[#2C3240]">
              {numPages} {numPages === 1 ? 'Page' : 'Pages'}
            </span>
          )}
        </div>
      </div>

      {isLoading && (
        <div className="py-16 flex flex-col items-center justify-center space-y-3 text-gray-400">
          <Loader2 className="w-9 h-9 text-[#FF5500] animate-spin" />
          <span className="text-xs font-mono font-medium tracking-wide">
            Rendering Full Multi-Page Document...
          </span>
          <span className="text-[11px] text-gray-500">
            Please wait while all pages are decoded and verified
          </span>
        </div>
      )}

      {/* HIGH-DPI HTML5 CANVAS MULTI-PAGE DIRECT OPEN RENDERER */}
      {!isLoading && !useIframeFallback && pdfDoc && (
        <div
          className="flex flex-col items-center gap-5 w-full max-w-full overflow-x-auto transition-transform duration-150 origin-top pb-4"
          style={{
            transform: zoom !== 100 ? `scale(${zoom / 100})` : undefined,
            transformOrigin: 'top center',
          }}
        >
          {Array.from({ length: numPages }, (_, index) => (
            <PdfPageCanvas
              key={`page-${index + 1}`}
              pdfDoc={pdfDoc}
              pageNumber={index + 1}
              totalPages={numPages}
            />
          ))}
        </div>
      )}

      {/* AUTOMATIC DIRECT-OPEN INLINE EMBEDDED VIEWER FALLBACK (ONLY WHEN REAL PDF BLOB/STREAM IS LOADED) */}
      {!isLoading && useIframeFallback && blobUrl && (
        <div
          className="w-full max-w-[900px] min-h-[650px] sm:min-h-[850px] rounded-xl overflow-hidden bg-white border border-[#2B2F38] shadow-2xl transition-transform origin-top"
          style={{
            transform: zoom !== 100 ? `scale(${zoom / 100})` : undefined,
            transformOrigin: 'top center',
          }}
        >
          <object
            data={`${blobUrl}#view=FitH&toolbar=0&navpanes=0`}
            type="application/pdf"
            className="w-full h-[650px] sm:h-[850px] rounded-xl border-0 bg-white"
          >
            <iframe
              src={`${blobUrl}#view=FitH&toolbar=0&navpanes=0`}
              title={docName}
              className="w-full h-[650px] sm:h-[850px] border-0 bg-white"
            />
          </object>
        </div>
      )}

      {!isLoading && useIframeFallback && !blobUrl && (
        <div className="w-full max-w-[900px] p-8 rounded-xl bg-[#12141A] border border-red-500/30 text-center space-y-2">
          <p className="text-sm font-bold text-red-400">
            Unable to load PDF preview ({docName})
          </p>
          <p className="text-xs text-gray-400">
            এই পিডিএফ ফাইলটি লোড করা যায়নি। Admin Panel থেকে ফাইলটি পুনরায় আপলোড বা Cloud Sync করে সেভ করুন।
          </p>
        </div>
      )}
    </div>
  );
};

interface PdfPageCanvasProps {
  pdfDoc: PDFDocumentProxy;
  pageNumber: number;
  totalPages: number;
}

const PdfPageCanvas: React.FC<PdfPageCanvasProps> = ({ pdfDoc, pageNumber, totalPages }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [rendered, setRendered] = useState<boolean>(false);
  const [pageLoading, setPageLoading] = useState<boolean>(true);

  useEffect(() => {
    let isCancelled = false;
    let renderTask: RenderTask | null = null;

    async function renderPage() {
      try {
        setPageLoading(true);
        // Stagger page rendering smoothly so Page 1 renders immediately and subsequent pages stream in
        if (pageNumber > 1) {
          await new Promise((r) => setTimeout(r, Math.min((pageNumber - 1) * 60, 600)));
          if (isCancelled) return;
        }

        const page = await pdfDoc.getPage(pageNumber);
        if (isCancelled || !canvasRef.current) return;

        // Retina / High-DPI support: cap DPR at 1.75 on mobile to avoid iOS Safari canvas memory exhaustion
        const dpr = typeof window !== 'undefined' ? Math.min(window.devicePixelRatio || 1, 1.75) : 1;

        // Viewport calculations: scale to crisp readable width (~850px base width)
        const unscaledViewport = page.getViewport({ scale: 1.0 });
        const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 850;
        const targetWidth = Math.min(850, Math.max(320, screenWidth - 32));
        const baseScale = targetWidth / unscaledViewport.width;
        const viewport = page.getViewport({ scale: baseScale * dpr });

        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        if (!context) return;

        canvas.width = Math.floor(viewport.width);
        canvas.height = Math.floor(viewport.height);

        // Visual CSS size ensures full fluid responsiveness on any mobile screen
        canvas.style.width = '100%';
        canvas.style.maxWidth = `${Math.floor(viewport.width / dpr)}px`;
        canvas.style.height = 'auto';

        const renderContext = {
          canvasContext: context,
          viewport: viewport,
        };

        renderTask = page.render(renderContext);
        await renderTask.promise;

        if (!isCancelled) {
          setRendered(true);
          setPageLoading(false);
        }
      } catch (e: any) {
        if (!isCancelled && e?.name !== 'RenderingCancelledException') {
          console.warn(`Error rendering page ${pageNumber}:`, e);
          setPageLoading(false);
        }
      }
    }

    renderPage();

    return () => {
      isCancelled = true;
      if (renderTask) {
        try {
          renderTask.cancel();
        } catch (_) {}
      }
    };
  }, [pdfDoc, pageNumber]);

  return (
    <div className="flex flex-col items-center bg-[#0D0E12] rounded-xl border border-[#2B2F38] shadow-2xl p-1.5 sm:p-2.5 overflow-hidden w-full max-w-[890px]">
      {/* Page Header Bar */}
      <div className="w-full flex items-center justify-between px-3 py-1.5 text-[11px] font-mono text-gray-400 border-b border-[#23262E] mb-2">
        <span className="flex items-center gap-1.5 font-bold text-gray-200">
          <FileText className="w-3.5 h-3.5 text-[#FF5500]" />
          <span>Page {pageNumber} of {totalPages}</span>
        </span>
        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
          <ShieldCheck className="w-3 h-3 text-emerald-400" />
          <span>Official Document Record</span>
        </span>
      </div>

      {/* Canvas Paper Box */}
      <div className="flex flex-col items-center justify-center overflow-hidden w-full rounded bg-white shadow-inner relative min-h-[300px]">
        {pageLoading && !rendered && (
          <div className="absolute inset-0 bg-white/90 flex flex-col items-center justify-center space-y-2 text-gray-600 z-10">
            <Loader2 className="w-6 h-6 text-[#FF5500] animate-spin" />
            <span className="text-xs font-mono font-medium">Loading Page {pageNumber}...</span>
          </div>
        )}
        <canvas
          ref={canvasRef}
          className="w-full h-auto block select-none pointer-events-none"
          onContextMenu={(e) => e.preventDefault()}
        />
      </div>
    </div>
  );
};
