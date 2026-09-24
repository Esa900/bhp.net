import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  X,
  AlertCircle,
  ShieldCheck,
  FileText,
  RotateCcw,
  Copy,
  Check,
  Eye,
  Calendar,
  User,
  Tag,
  Paperclip,
  Image as ImageIcon,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  ExternalLink,
  Download,
  AlertTriangle,
} from 'lucide-react';
import { DocumentMenuItem } from '../data/menuNavigationItems';
import { SAMPLE_PROFILES } from '../data/portalData';
import { ApplicantProfile } from '../types/portal';
import { AdminPost, AttachedDoc } from '../types';
import { getStoredAdminPosts, findAdminPostByQuery } from '../utils/postsStorage';
import {
  FullPdfDocumentViewer,
  postToUnifiedDoc,
  profileToUnifiedDoc,
} from './FullPdfDocumentViewer';

interface DocumentSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeItem: DocumentMenuItem | null;
}

export const DocumentSearchModal: React.FC<DocumentSearchModalProps> = ({
  isOpen,
  onClose,
  activeItem,
}) => {
  const [query, setQuery] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [matchedAdminPost, setMatchedAdminPost] = useState<AdminPost | null>(null);
  const [matchedProfile, setMatchedProfile] = useState<ApplicantProfile | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [copiedRef, setCopiedRef] = useState(false);

  // Available admin posts from localStorage
  const [adminPosts, setAdminPosts] = useState<AdminPost[]>([]);

  // PDF & Document Preview Modal State with Zoom
  const [previewingDoc, setPreviewingDoc] = useState<AttachedDoc | null>(null);
  const [previewZoom, setPreviewZoom] = useState<number>(100);
  const [previewMaximized, setPreviewMaximized] = useState<boolean>(false);

  const inputRef = useRef<HTMLInputElement>(null);

  // Load and subscribe to admin posts updates
  useEffect(() => {
    const loadPosts = () => {
      const posts = getStoredAdminPosts();
      setAdminPosts(posts);
    };

    loadPosts();

    const handlePostsUpdated = () => {
      loadPosts();
    };

    window.addEventListener('bhp_posts_updated', handlePostsUpdated);
    window.addEventListener('storage', handlePostsUpdated);

    return () => {
      window.removeEventListener('bhp_posts_updated', handlePostsUpdated);
      window.removeEventListener('storage', handlePostsUpdated);
    };
  }, []);

  // When activeItem changes or modal opens, reset search and focus input
  useEffect(() => {
    if (isOpen) {
      setAdminPosts(getStoredAdminPosts());
      setQuery('');
      setHasSearched(false);
      setMatchedAdminPost(null);
      setMatchedProfile(null);
      setPreviewingDoc(null);
      setPreviewZoom(100);
      setPreviewMaximized(false);
      setTimeout(() => inputRef.current?.focus(), 80);
    }
  }, [isOpen, activeItem]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (previewingDoc !== null) {
          setPreviewingDoc(null);
        } else {
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose, previewingDoc]);

  const handleZoomIn = () => {
    setPreviewZoom((prev) => Math.min(prev + 25, 300));
  };

  const handleZoomOut = () => {
    setPreviewZoom((prev) => Math.max(prev - 25, 50));
  };

  const handleZoomReset = () => {
    setPreviewZoom(100);
  };

  const handleOpenDocPreview = (doc: AttachedDoc) => {
    setPreviewingDoc(doc);
    setPreviewZoom(100);
    setPreviewMaximized(false);
  };

  const handleOpenImagePreview = (imgUrl: string, idx: number) => {
    setPreviewingDoc({
      id: `gallery-img-${idx}`,
      name: `${matchedAdminPost?.title || 'Document'} - Photo #${idx + 1}`,
      size: 'High Resolution',
      type: 'image',
      dataUrl: imgUrl,
      uploadDate: matchedAdminPost?.date || 'Current',
    });
    setPreviewZoom(100);
    setPreviewMaximized(false);
  };

  if (!isOpen || !activeItem) return null;

  const handleSearch = (overrideQuery?: string) => {
    const searchTerm = (overrideQuery !== undefined ? overrideQuery : query).trim();
    if (!searchTerm) return;

    setIsSearching(true);
    setHasSearched(true);
    setMatchedAdminPost(null);
    setMatchedProfile(null);

    setTimeout(() => {
      // 1. Refresh latest admin posts from storage to guarantee 100% real-time state
      const freshPosts = getStoredAdminPosts();
      setAdminPosts(freshPosts);

      // 2. Search in Admin Posts first (User's primary requirement)
      const foundPost = findAdminPostByQuery(searchTerm, freshPosts, activeItem.mainTitle);
      if (foundPost) {
        setMatchedAdminPost(foundPost);
        setIsSearching(false);
        return;
      }

      // 2. Fallback search in SAMPLE_PROFILES (for existing sample verifications)
      const cleanTerm = searchTerm.toLowerCase().replace(/[-\s]/g, '');
      const foundProfile = SAMPLE_PROFILES.find((p) => {
        const refMatch = p.referenceNumber.toLowerCase().replace(/[-\s]/g, '').includes(cleanTerm);
        const edMatch = p.edNumber?.toLowerCase().replace(/[-\s]/g, '').includes(cleanTerm);
        const docMatch = p.documentNumber?.toLowerCase().replace(/[-\s]/g, '').includes(cleanTerm);
        const vrfMatch = p.verificationIdNo?.toLowerCase().replace(/[-\s]/g, '').includes(cleanTerm);
        const trnMatch = p.transitionIdNo?.toLowerCase().replace(/[-\s]/g, '').includes(cleanTerm);
        const grantMatch = p.visaGrantNumber?.toLowerCase().replace(/[-\s]/g, '').includes(cleanTerm);
        const insMatch = p.insuranceNo?.toLowerCase().replace(/[-\s]/g, '').includes(cleanTerm);
        const immiMatch = p.immiCardNo?.toLowerCase().replace(/[-\s]/g, '').includes(cleanTerm);
        const tfnMatch = p.tfnNumber?.toLowerCase().replace(/[-\s]/g, '').includes(cleanTerm);
        const nameMatch = p.fullName.toLowerCase().includes(searchTerm.toLowerCase());
        const visaSubMatch = p.visaSubclass.toLowerCase().includes(searchTerm.toLowerCase());

        return (
          refMatch ||
          edMatch ||
          docMatch ||
          vrfMatch ||
          trnMatch ||
          grantMatch ||
          insMatch ||
          immiMatch ||
          tfnMatch ||
          nameMatch ||
          visaSubMatch
        );
      });

      if (foundProfile) {
        setMatchedProfile(foundProfile);
      }

      setIsSearching(false);
    }, 350);
  };

  const handleCopyRef = (refNum: string) => {
    navigator.clipboard.writeText(refNum);
    setCopiedRef(true);
    setTimeout(() => setCopiedRef(false), 2000);
  };

  const handleApplySample = (sampleVal?: string) => {
    const val = sampleVal || activeItem.sampleValue;
    setQuery(val);
    handleSearch(val);
  };

  const handleReset = () => {
    setQuery('');
    setHasSearched(false);
    setMatchedAdminPost(null);
    setMatchedProfile(null);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  return (
    <>
      <div
        id="doc-search-modal-backdrop"
        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex flex-col items-center pt-10 sm:pt-14 px-3 sm:px-6 overflow-y-auto"
        onClick={onClose}
      >
        <div
          id="doc-search-modal-container"
          className="w-full max-w-4xl bg-[#17181B] rounded-2xl border border-[#2D3036] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 mb-12 relative"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Header Bar */}
          <div className="bg-[#1F2228] px-5 py-4 border-b border-[#2C3038] flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="p-2 rounded-xl bg-[#F25C05]/15 text-[#F25C05] border border-[#F25C05]/30 shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="overflow-hidden">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#FF8E4D] uppercase tracking-wider">
                    {activeItem.mainTitle}
                  </span>
                  <span className="text-[10px] uppercase px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                    Live DVS Search
                  </span>
                </div>
                <h2 className="text-base sm:text-lg font-bold text-white truncate mt-0.5">
                  {activeItem.fieldLabel} Verification Search
                </h2>
              </div>
            </div>

            <button
              id="doc-search-modal-close"
              type="button"
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-[#2B2F38] transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search Box Form */}
          <div className="p-5 sm:p-6 space-y-6">
            <div className="space-y-2">
              <label
                htmlFor="doc-search-input"
                className="block text-xs font-bold uppercase tracking-wider text-gray-300"
              >
                Enter {activeItem.fieldLabel} / Reference Number / ID:
              </label>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSearch();
                }}
                className="flex flex-col sm:flex-row gap-2"
              >
                <div className="relative flex-1">
                  <Search className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    ref={inputRef}
                    id="doc-search-input"
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Enter Reference Number or ID (যেমন: BHP-DOC-2026-0089 বা টাইটেল)..."
                    className="w-full bg-[#121316] border-2 border-[#F25C05] rounded-xl pl-11 pr-10 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#F25C05] transition-all font-mono"
                  />
                  {query && (
                    <button
                      type="button"
                      onClick={() => setQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white p-1 cursor-pointer"
                      aria-label="Clear"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={!query.trim() || isSearching}
                  className="px-6 py-3 bg-[#F25C05] hover:bg-[#D94F04] disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0 shadow-md"
                >
                  {isSearching ? (
                    <span>Searching...</span>
                  ) : (
                    <>
                      <Search className="w-4 h-4" />
                      <span>Search Document</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* =========================================================================
                RESULT VIEW A: MATCHED POST OR PROFILE AS FULL PDF DOCUMENT
               ========================================================================= */}
            {hasSearched && matchedAdminPost && (
              <div className="pt-2 animate-in fade-in duration-200">
                <FullPdfDocumentViewer
                  document={postToUnifiedDoc(matchedAdminPost, 'australia')}
                  onSearchAnother={handleReset}
                  onClose={onClose}
                />
              </div>
            )}

            {hasSearched && !matchedAdminPost && matchedProfile && (
              <div className="pt-2 animate-in fade-in duration-200">
                <FullPdfDocumentViewer
                  document={profileToUnifiedDoc(matchedProfile)}
                  onSearchAnother={handleReset}
                  onClose={onClose}
                />
              </div>
            )}

            {/* =========================================================================
                RESULT VIEW C: NOT FOUND
               ========================================================================= */}
            {hasSearched && !matchedAdminPost && !matchedProfile && (
              <div className="bg-[#1F1915] border border-[#4A2B18] rounded-xl p-5 text-center space-y-3">
                <AlertCircle className="w-8 h-8 text-[#FF8E4D] mx-auto" />
                <div>
                  <h3 className="text-sm font-bold text-white mb-1">
                    No Record Found for "{query}"
                  </h3>
                  <p className="text-xs text-gray-300 max-w-md mx-auto">
                    No post or document was found matching the entered reference or ID number.
                    Please check the reference number posted from the Admin Panel or try with a sample.
                  </p>
                </div>
                {adminPosts.length > 0 ? (
                  <div className="pt-2 flex flex-col items-center gap-2">
                    <span className="text-[11px] text-gray-400 font-semibold">
                      Or click an active reference from Admin Panel:
                    </span>
                    <div className="flex flex-wrap justify-center gap-2">
                      {adminPosts.slice(0, 3).map((p) => (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => handleApplySample(p.refNumber)}
                          className="px-3 py-1.5 bg-[#2B231D] hover:bg-[#382C22] border border-[#593922] text-[#FF8E4D] rounded-lg text-xs font-mono font-semibold transition-colors cursor-pointer"
                        >
                          {p.refNumber}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleApplySample()}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#2B231D] hover:bg-[#382C22] border border-[#593922] text-[#FF8E4D] rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                  >
                    <span>Try with sample number:</span>
                    <strong className="font-mono text-white">{activeItem.sampleValue}</strong>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* =========================================================================
          PDF & DOCUMENT PREVIEW MODAL WITH INTERACTIVE ZOOM CONTROLS
         ========================================================================= */}
      {previewingDoc && (
        <div
          id="pdf-preview-modal"
          className="fixed inset-0 z-60 bg-black/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-150"
          onClick={() => setPreviewingDoc(null)}
        >
          <div
            className={`w-full ${
              previewMaximized ? 'max-w-[97vw] h-[94vh]' : 'max-w-4xl max-h-[90vh]'
            } bg-[#181A1D] border border-[#31353E] rounded-2xl shadow-2xl overflow-hidden flex flex-col transition-all duration-200 relative`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header with Zoom Controls */}
            <div className="px-4 py-3 bg-[#202328] border-b border-[#2C3038] flex flex-wrap items-center justify-between gap-3 relative z-20">
              <div className="flex items-center gap-2.5 overflow-hidden">
                <div className="p-2 rounded-lg bg-red-500/20 text-red-400 shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="overflow-hidden">
                  <h4 className="text-sm font-bold text-white truncate">{previewingDoc.name}</h4>
                  <div className="flex items-center gap-2 text-[11px] text-gray-400 font-mono">
                    <span className="uppercase text-red-400 font-bold">{previewingDoc.type}</span>
                    <span>•</span>
                    <span>{previewingDoc.size}</span>
                  </div>
                </div>
              </div>

              {/* PDF & Image Zoom Toolbar */}
              <div className="flex items-center gap-1.5 sm:gap-2">
                {/* Zoom Out Button */}
                <button
                  type="button"
                  onClick={handleZoomOut}
                  disabled={previewZoom <= 50}
                  className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg bg-[#272B33] hover:bg-[#343A45] disabled:opacity-40 disabled:cursor-not-allowed text-gray-200 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer border border-[#383E4B]"
                  title="Zoom Out (-25%)"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>

                {/* Current Zoom Badge */}
                <span className="px-2.5 py-1 text-xs font-mono font-bold text-white bg-[#101215] rounded-md border border-[#2D333E] min-w-[52px] text-center">
                  {previewZoom}%
                </span>

                {/* Zoom In Button */}
                <button
                  type="button"
                  onClick={handleZoomIn}
                  disabled={previewZoom >= 300}
                  className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg bg-[#272B33] hover:bg-[#343A45] disabled:opacity-40 disabled:cursor-not-allowed text-gray-200 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer border border-[#383E4B]"
                  title="Zoom In (+25%)"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>

                {/* Reset Zoom */}
                <button
                  type="button"
                  onClick={handleZoomReset}
                  className="px-2 py-1.5 rounded-lg bg-[#272B33] hover:bg-[#343A45] text-gray-300 hover:text-white text-xs font-medium hidden sm:flex items-center gap-1 transition-colors cursor-pointer border border-[#383E4B]"
                  title="Reset to 100%"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>100%</span>
                </button>

                <div className="h-5 w-[1px] bg-[#343A45] mx-0.5 hidden sm:block" />

                {/* Maximize / Fullscreen Toggle */}
                <button
                  type="button"
                  onClick={() => setPreviewMaximized(!previewMaximized)}
                  className="p-1.5 rounded-lg bg-[#272B33] hover:bg-[#343A45] text-gray-300 hover:text-white transition-colors cursor-pointer border border-[#383E4B]"
                  title={previewMaximized ? 'Restore Normal View' : 'Maximize View'}
                >
                  {previewMaximized ? (
                    <Minimize2 className="w-4 h-4" />
                  ) : (
                    <Maximize2 className="w-4 h-4" />
                  )}
                </button>

                {/* Open in New Window/Tab */}
                {previewingDoc.dataUrl && (
                  <a
                    href={previewingDoc.dataUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-lg bg-[#272B33] hover:bg-[#343A45] text-gray-300 hover:text-white transition-colors cursor-pointer border border-[#383E4B]"
                    title="Open Document in Fullscreen / New Tab"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}

                {/* Download Button */}
                {previewingDoc.dataUrl && (
                  <a
                    href={previewingDoc.dataUrl}
                    download={previewingDoc.name || 'document.pdf'}
                    className="p-1.5 rounded-lg bg-[#272B33] hover:bg-[#343A45] text-gray-300 hover:text-white transition-colors cursor-pointer border border-[#383E4B]"
                    title="Download Document"
                  >
                    <Download className="w-4 h-4" />
                  </a>
                )}

                {/* Close Button */}
                <button
                  type="button"
                  onClick={() => setPreviewingDoc(null)}
                  className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-[#2C3038] cursor-pointer ml-1"
                  aria-label="Close Preview"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Document Content View with Zoom Capability */}
            <div className="p-3 sm:p-4 flex-1 overflow-auto flex flex-col space-y-3 relative z-20">
              {previewingDoc.dataUrl &&
              (previewingDoc.dataUrl.startsWith('data:image') || previewingDoc.type === 'image') ? (
                /* Image View with smooth zoom scaling */
                <div className="flex-1 w-full overflow-auto bg-[#0a0b0d] rounded-xl flex items-center justify-center p-4 min-h-[50vh] border border-[#252830]">
                  <div
                    style={{
                      transform: `scale(${previewZoom / 100})`,
                      transformOrigin: 'center center',
                      transition: 'transform 0.15s ease-out',
                    }}
                    className="max-w-full flex justify-center cursor-zoom-in"
                    onClick={handleZoomIn}
                    title="Click picture to zoom in"
                  >
                    <img
                      src={previewingDoc.dataUrl}
                      alt={previewingDoc.name}
                      className={previewMaximized ? 'max-h-[78vh] object-contain rounded-lg shadow-2xl' : 'max-h-[62vh] object-contain rounded-lg shadow-2xl'}
                    />
                  </div>
                </div>
              ) : previewingDoc.dataUrl &&
                (previewingDoc.dataUrl.startsWith('data:application/pdf') ||
                  previewingDoc.dataUrl.includes('.pdf') ||
                  previewingDoc.type === 'pdf') ? (
                /* PDF View with toolbar enabled and responsive zoom container */
                <div className="flex-1 w-full overflow-auto bg-[#0a0b0d] rounded-xl flex items-start justify-center p-2 min-h-[50vh] border border-[#252830]">
                  <div
                    style={{
                      width: `${previewZoom}%`,
                      minWidth: '100%',
                      transition: 'width 0.2s ease-out',
                    }}
                    className={previewMaximized ? 'h-[78vh]' : 'h-[64vh]'}
                  >
                    <iframe
                      src={`${previewingDoc.dataUrl}#toolbar=1&navpanes=1&zoom=${previewZoom}`}
                      title={previewingDoc.name}
                      className="w-full h-full border-none rounded-lg bg-white shadow-2xl"
                    />
                  </div>
                </div>
              ) : (
                /* Fallback preview view */
                <div className="p-8 text-center bg-[#121316] rounded-xl border border-[#272A30] space-y-4 my-auto">
                  <div className="w-16 h-16 rounded-2xl bg-red-500/20 text-red-400 mx-auto flex items-center justify-center border border-red-500/30">
                    <FileText className="w-8 h-8" />
                  </div>
                  <div>
                    <h5 className="text-base font-bold text-white mb-1">{previewingDoc.name}</h5>
                    <p className="text-xs text-gray-400 max-w-md mx-auto">
                      Official document uploaded via BHP Admin Registry. Use the controls above to zoom, open in a new tab, or download.
                    </p>
                  </div>
                  {previewingDoc.dataUrl && (
                    <div className="pt-2">
                      <a
                        href={previewingDoc.dataUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-[#F25C05] hover:bg-[#D94F04] text-white text-xs font-bold rounded-lg transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>Open Document Directly</span>
                      </a>
                    </div>
                  )}
                </div>
              )}

              {/* Zoom & Navigation Footer */}
              <div className="px-3 py-2 rounded-xl bg-[#121316] border border-[#26282E] flex flex-wrap items-center justify-between text-xs text-gray-400 gap-2">
                <span className="flex items-center gap-1.5 text-gray-300">
                  <span>Zoom Level:</span>
                  <strong className="text-white font-mono">{previewZoom}%</strong>
                  <span className="text-gray-500 hidden sm:inline">(Use +/- buttons to adjust zoom)</span>
                </span>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleZoomReset}
                    className="hover:text-white transition-colors cursor-pointer text-[11px]"
                  >
                    Reset (100%)
                  </button>
                  {previewingDoc.dataUrl && (
                    <a
                      href={previewingDoc.dataUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-[#38bdf8] transition-colors cursor-pointer text-[11px] flex items-center gap-1"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>Full Window</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
