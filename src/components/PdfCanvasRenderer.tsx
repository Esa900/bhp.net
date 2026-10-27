import React, { useEffect, useRef, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
// Vite local worker asset import (serves from same origin, avoiding mobile browser CORS/Worker SecurityError)
// @ts-expect-error Vite ?url query asset import
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import { Loader2, FileText, Check, Smartphone, Monitor, Download, ExternalLink, ShieldCheck, ChevronDown } from 'lucide-react';

// Configure PDF.js worker to local bundled script
try {
  if (typeof window !== 'undefined' && pdfjsLib) {
    pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;
  }
} catch (e) {
  console.warn('PDF.js worker initialization warning:', e);
}

interface PdfCanvasRendererProps {
  dataUrl: string;
  docName?: string;
  zoom?: number; // 100 is default
}

/**
 * Converts a data URI, Base64, or binary string to a Uint8Array safely on both mobile & desktop.
 */
async function extractPdfBytes(dataUrl: string): Promise<Uint8Array | null> {
  if (!dataUrl || dataUrl === '#' || dataUrl.length < 10) return null;

  let normalized = dataUrl.trim();
  if (normalized.startsWith('data:application/octet-stream;base64,JVBERi')) {
    normalized = normalized.replace('data:application/octet-stream', 'data:application/pdf');
  }

  // 1. Try native fetch API for blob: and http(s) URLs
  if (normalized.startsWith('blob:') || normalized.startsWith('http://') || normalized.startsWith('https://')) {
    try {
      const res = await fetch(normalized);
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
  const [error, setError] = useState<string | null>(null);
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'canvas' | 'iframe'>('canvas');
  const containerRef = useRef<HTMLDivElement>(null);
  const pdfDocRef = useRef<pdfjsLib.PDFDocumentProxy | null>(null);

  // Load PDF and create local blob URL
  useEffect(() => {
    let isCancelled = false;

    async function loadPdf() {
      if (!dataUrl || dataUrl === '#' || dataUrl.length < 10) {
        setIsLoading(false);
        setError('No document data available.');
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const bytes = await extractPdfBytes(dataUrl);
        if (!bytes || bytes.length === 0) {
          throw new Error('Empty PDF byte stream');
        }

        // Create clean blob URL for mobile native viewer / download / iframe
        if (typeof window !== 'undefined') {
          try {
            const blob = new Blob([bytes], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            setBlobUrl(url);
          } catch (e) {
            console.warn('Blob creation error:', e);
          }
        }

        // Load into PDF.js
        const loadingTask = pdfjsLib.getDocument({
          data: bytes,
          cMapPacked: true,
        });

        const pdf = await loadingTask.promise;
        if (isCancelled) return;

        pdfDocRef.current = pdf;
        setNumPages(pdf.numPages);
        setIsLoading(false);
      } catch (err: unknown) {
        if (isCancelled) return;
        console.warn('PDF.js loading error:', err);
        setError('Unable to parse PDF pages directly.');
        setIsLoading(false);
      }
    }

    loadPdf();

    return () => {
      isCancelled = true;
      if (blobUrl) {
        URL.revokeObjectURL(blobUrl);
      }
    };
  }, [dataUrl]);

  const activeDocUrl = blobUrl || dataUrl;

  const handleOpenNative = () => {
    if (activeDocUrl) {
      window.open(activeDocUrl, '_blank');
    }
  };

  const handleDownload = () => {
    if (!activeDocUrl) return;
    const a = document.createElement('a');
    a.href = activeDocUrl;
    a.download = docName.endsWith('.pdf') ? docName : `${docName}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div
      ref={containerRef}
      className="w-full flex flex-col items-center justify-center select-none"
      onContextMenu={(e) => e.preventDefault()}
    >
      {/* Document Header & Responsive Control Toolbar */}
      <div className="w-full max-w-[900px] flex flex-wrap items-center justify-between gap-2 px-3 py-2 bg-[#12141A] rounded-xl border border-[#272B36] mb-3 text-xs">
        <div className="flex items-center gap-2 min-w-0">
          <FileText className="w-4 h-4 text-[#FF5500] shrink-0" />
          <span className="font-bold text-white truncate max-w-[180px] sm:max-w-md">
            {docName}
          </span>
          {numPages > 0 && (
            <span className="px-2 py-0.5 rounded-md bg-[#1F232D] text-[#FF8E4D] font-mono text-[11px] font-bold border border-[#2C3240] shrink-0">
              {numPages} {numPages === 1 ? 'Page' : 'Pages'}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          {/* View mode toggle (Canvas vs Frame) */}
          <button
            type="button"
            onClick={() => setViewMode('canvas')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer border ${
              viewMode === 'canvas'
                ? 'bg-[#FF5500] text-white border-[#FF5500] shadow-xs'
                : 'bg-[#181A20] text-gray-400 hover:text-white border-[#272B35]'
            }`}
            title="High-Resolution Multi-Page Continuous View (Works on all mobile phones and PCs)"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">All Pages</span>
            <span className="sm:hidden">Pages</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('iframe')}
            className={`hidden sm:flex px-2.5 py-1 rounded-lg text-xs font-semibold items-center gap-1 transition-all cursor-pointer border ${
              viewMode === 'iframe'
                ? 'bg-[#FF5500] text-white border-[#FF5500] shadow-xs'
                : 'bg-[#181A20] text-gray-400 hover:text-white border-[#272B35]'
            }`}
            title="Desktop Embedded PDF Frame"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Desktop Frame</span>
          </button>

          {/* Quick Download / Native View Buttons */}
          {activeDocUrl && (
            <>
              <button
                type="button"
                onClick={handleDownload}
                className="px-2 py-1 rounded-lg bg-[#181A20] text-gray-300 hover:text-white border border-[#272B35] text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                title="Download PDF"
              >
                <Download className="w-3 h-3 text-emerald-400" />
                <span className="hidden sm:inline">Download</span>
              </button>
              <button
                type="button"
                onClick={handleOpenNative}
                className="px-2 py-1 rounded-lg bg-[#181A20] text-gray-300 hover:text-white border border-[#272B35] text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                title="Open in Native Viewer"
              >
                <ExternalLink className="w-3 h-3 text-[#FF5500]" />
                <span className="hidden sm:inline">Open</span>
              </button>
            </>
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

      {/* VIEW MODE 1: NATIVE EMBEDDED IFRAME (OPTIONAL DESKTOP MODE) */}
      {!isLoading && viewMode === 'iframe' && activeDocUrl && (
        <div
          className="w-full max-w-[950px] min-h-[600px] sm:min-h-[850px] rounded-xl overflow-hidden bg-white border border-[#2B2F38] shadow-2xl transition-transform origin-top"
          style={{
            transform: zoom !== 100 ? `scale(${zoom / 100})` : undefined,
            transformOrigin: 'top center',
          }}
        >
          <object
            data={`${activeDocUrl}#toolbar=0&navpanes=0`}
            type="application/pdf"
            className="w-full h-[600px] sm:h-[850px] rounded-xl border-0 bg-white"
          >
            <iframe
              src={`${activeDocUrl}#toolbar=0&navpanes=0`}
              title={docName}
              className="w-full h-full border-0 bg-white"
            />
          </object>
        </div>
      )}

      {/* VIEW MODE 2: HIGH-DPI HTML5 CANVAS MULTI-PAGE RENDERER (100% RELIABLE ON MOBILE & DESKTOP) */}
      {!isLoading && viewMode === 'canvas' && !error && pdfDocRef.current && (
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
              pdfDoc={pdfDocRef.current!}
              pageNumber={index + 1}
              totalPages={numPages}
            />
          ))}
        </div>
      )}

      {/* FALLBACK IF CANVAS RENDERING ENCOUNTERS AN UNREADABLE ENCODING */}
      {!isLoading && error && (
        <div className="w-full max-w-[950px] flex flex-col items-center p-6 bg-[#16181F] rounded-2xl border border-[#2B2F38] space-y-4">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
            <FileText className="w-5 h-5" />
            <span>Document File Ready ({docName})</span>
          </div>
          <p className="text-xs text-gray-300 text-center max-w-md">
            This document is securely attached to the client record. You can open or download the complete original PDF file below:
          </p>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleOpenNative}
              className="px-4 py-2 bg-[#FF5500] hover:bg-[#E04B00] text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-md"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Open Full Document (সম্পূর্ণ ফাইল দেখুন)</span>
            </button>
            <button
              type="button"
              onClick={handleDownload}
              className="px-4 py-2 bg-[#252830] hover:bg-[#323640] text-gray-200 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer border border-[#3A3F4C]"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span>Download PDF</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

interface PdfPageCanvasProps {
  pdfDoc: pdfjsLib.PDFDocumentProxy;
  pageNumber: number;
  totalPages: number;
}

const PdfPageCanvas: React.FC<PdfPageCanvasProps> = ({ pdfDoc, pageNumber, totalPages }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [rendered, setRendered] = useState<boolean>(false);
  const [pageLoading, setPageLoading] = useState<boolean>(true);

  useEffect(() => {
    let isCancelled = false;
    let renderTask: pdfjsLib.RenderTask | null = null;

    async function renderPage() {
      try {
        setPageLoading(true);
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
