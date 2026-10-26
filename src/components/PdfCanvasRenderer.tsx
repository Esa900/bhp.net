import React, { useEffect, useRef, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { Loader2, AlertCircle, FileText } from 'lucide-react';

// Configure pdf.js worker using unpkg or fallback
try {
  if (typeof window !== 'undefined' && pdfjsLib) {
    // Set workerSrc to public CDN matching the installed version
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version || '6.4.299'}/build/pdf.worker.min.mjs`;
  }
} catch (e) {
  console.warn('PDF.js worker initialization warning:', e);
}

interface PdfCanvasRendererProps {
  dataUrl: string;
  docName?: string;
  zoom?: number; // 100 is default
}

async function getPdfBytes(dataUrl: string): Promise<Uint8Array | null> {
  if (!dataUrl || dataUrl === '#' || dataUrl.length < 10) return null;

  // 1. Try native fetch - fastest and works natively in browser C++ for data: & blob: URIs without memory limits
  try {
    if (dataUrl.startsWith('data:') || dataUrl.startsWith('blob:') || dataUrl.startsWith('http')) {
      const res = await fetch(dataUrl);
      const buffer = await res.arrayBuffer();
      return new Uint8Array(buffer);
    }
  } catch (err) {
    console.warn('Native fetch conversion of dataUrl failed, attempting string fallback:', err);
  }

  // 2. String base64 fallback
  try {
    const base64Index = dataUrl.indexOf(';base64,');
    if (base64Index !== -1) {
      const base64 = dataUrl.substring(base64Index + 8);
      const binaryString = atob(base64.replace(/\s/g, ''));
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      return bytes;
    }
  } catch (err) {
    console.warn('Fallback base64 decode failed:', err);
  }
  return null;
}

export const PdfCanvasRenderer: React.FC<PdfCanvasRendererProps> = ({
  dataUrl,
  docName = 'Attached Document',
  zoom = 100,
}) => {
  const [numPages, setNumPages] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const pdfDocRef = useRef<pdfjsLib.PDFDocumentProxy | null>(null);

  // Render all pages to canvas
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
        const bytes = await getPdfBytes(dataUrl);
        const loadingTask = bytes
          ? pdfjsLib.getDocument({
              data: bytes,
              cMapUrl: `https://unpkg.com/pdfjs-dist@${pdfjsLib.version || '6.4.299'}/cmaps/`,
              cMapPacked: true,
            })
          : pdfjsLib.getDocument({
              url: dataUrl,
              cMapUrl: `https://unpkg.com/pdfjs-dist@${pdfjsLib.version || '6.4.299'}/cmaps/`,
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
    };
  }, [dataUrl]);

  return (
    <div
      ref={containerRef}
      className="w-full flex flex-col items-center justify-center p-2 sm:p-4 select-none"
      onContextMenu={(e) => e.preventDefault()}
    >
      {isLoading && (
        <div className="py-16 flex flex-col items-center justify-center space-y-3 text-gray-400">
          <Loader2 className="w-8 h-8 text-[#FF5500] animate-spin" />
          <span className="text-xs font-mono font-medium tracking-wide">
            Rendering Document Pages...
          </span>
        </div>
      )}

      {error && !isLoading && (
        <div className="w-full max-w-lg p-6 bg-[#181A20] rounded-xl border border-[#30343F] text-center space-y-3 my-4">
          <AlertCircle className="w-8 h-8 text-amber-500 mx-auto" />
          <h5 className="text-sm font-bold text-white">{docName}</h5>
          <p className="text-xs text-gray-400">
            Document is attached to this official verification file.
          </p>
          {/* Fallback iframe/object for browsers that do support it */}
          <div className="pt-2">
            <object
              data={`${dataUrl}#toolbar=0`}
              type="application/pdf"
              className="w-full h-[400px] rounded-lg border border-[#343844] bg-white"
            >
              <iframe src={`${dataUrl}#toolbar=0`} title={docName} className="w-full h-full border-0" />
            </object>
          </div>
        </div>
      )}

      {!isLoading && !error && pdfDocRef.current && (
        <div
          className="flex flex-col items-center gap-6 w-full max-w-full overflow-x-auto transition-transform duration-150 origin-top"
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
            />
          ))}
        </div>
      )}
    </div>
  );
};

interface PdfPageCanvasProps {
  pdfDoc: pdfjsLib.PDFDocumentProxy;
  pageNumber: number;
}

const PdfPageCanvas: React.FC<PdfPageCanvasProps> = ({ pdfDoc, pageNumber }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [rendered, setRendered] = useState<boolean>(false);

  useEffect(() => {
    let isCancelled = false;

    async function renderPage() {
      try {
        const page = await pdfDoc.getPage(pageNumber);
        if (isCancelled || !canvasRef.current) return;

        // Determine device pixel ratio for crisp text on mobile Retina screens
        const dpr = typeof window !== 'undefined' ? Math.min(window.devicePixelRatio || 1, 2.5) : 1;

        // Viewport scaled for good mobile width (around 800px base width)
        const unscaledViewport = page.getViewport({ scale: 1.0 });
        const targetWidth = Math.min(850, typeof window !== 'undefined' ? window.innerWidth - 32 : 800);
        const scale = Math.max(1.0, targetWidth / unscaledViewport.width);
        const viewport = page.getViewport({ scale: scale * dpr });

        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        if (!context) return;

        canvas.width = Math.floor(viewport.width);
        canvas.height = Math.floor(viewport.height);

        // Display width & height (CSS size)
        canvas.style.width = `${Math.floor(viewport.width / dpr)}px`;
        canvas.style.height = `${Math.floor(viewport.height / dpr)}px`;

        const renderContext = {
          canvasContext: context,
          viewport: viewport,
        };

        await page.render(renderContext).promise;
        if (!isCancelled) {
          setRendered(true);
        }
      } catch (e) {
        console.warn(`Error rendering page ${pageNumber}:`, e);
      }
    }

    renderPage();

    return () => {
      isCancelled = true;
    };
  }, [pdfDoc, pageNumber]);

  return (
    <div className="flex flex-col items-center bg-[#0D0E12] rounded-xl border border-[#2B2F38] shadow-2xl p-1 sm:p-2 overflow-hidden max-w-full">
      <div className="w-full flex items-center justify-between px-2 py-1 text-[11px] font-mono text-gray-400 border-b border-[#23262E] mb-2">
        <span className="flex items-center gap-1 font-semibold text-gray-300">
          <FileText className="w-3 h-3 text-[#FF5500]" />
          Page {pageNumber}
        </span>
        <span className="text-[10px] uppercase text-emerald-400 font-bold">Official Page Record</span>
      </div>
      <div className="flex items-center justify-center overflow-hidden max-w-full rounded bg-white">
        <canvas
          ref={canvasRef}
          className="max-w-full h-auto block select-none pointer-events-none"
          onContextMenu={(e) => e.preventDefault()}
        />
      </div>
    </div>
  );
};
