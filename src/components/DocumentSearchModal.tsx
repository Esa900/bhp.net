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
      // 1. Search in Admin Posts first (User's primary requirement)
      const foundPost = findAdminPostByQuery(searchTerm, adminPosts);
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
                    className="w-full bg-[#121316] border border-[#34373D] focus:border-[#F25C05] rounded-xl pl-11 pr-10 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#F25C05] transition-all font-mono"
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
                RESULT VIEW A: MATCHED ADMIN POST (Exact documents, pictures & description)
               ========================================================================= */}
            {hasSearched && matchedAdminPost && (
              <div className="bg-[#1C1E22] border border-[#2D3036] rounded-xl overflow-hidden animate-in fade-in duration-200 shadow-xl space-y-0 relative">
                {/* Official Verification Banner */}
                <div className="bg-gradient-to-r from-[#17252A] via-[#142328] to-[#1C1E22] p-4 sm:p-5 border-b border-[#2C3B38] flex flex-wrap items-center justify-between gap-3 relative z-20">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shrink-0">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-extrabold text-emerald-400 uppercase tracking-wider">
                          Official Record Verified & Authenticated
                        </span>
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                      </div>
                      <p className="text-[11px] text-gray-300 mt-0.5">
                        BHP Global Verification System & Corporate Documentation Registry
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 rounded-full text-xs font-bold tracking-wide">
                      Status: {matchedAdminPost.status || 'Active & Valid'}
                    </span>
                  </div>
                </div>

                <div className="p-5 sm:p-6 space-y-6 relative z-20">
                  {/* Reference Number & Category Bar */}
                  <div className="bg-[#151618] p-4 rounded-xl border border-[#27292E] flex flex-wrap items-center justify-between gap-3">
                    <div className="space-y-1">
                      <span className="text-[11px] text-gray-400 uppercase tracking-wider font-semibold block">
                        Official Reference / Document ID
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-lg sm:text-xl font-mono font-extrabold text-[#FF8E4D] tracking-wide select-all">
                          {matchedAdminPost.refNumber}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopyRef(matchedAdminPost.refNumber)}
                          className="p-1.5 rounded-lg bg-[#222428] hover:bg-[#2F3238] text-gray-300 hover:text-white transition-colors cursor-pointer"
                          title="Copy Reference"
                        >
                          {copiedRef ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-1 rounded-lg bg-[#25282E] text-gray-300 border border-[#34373D] text-xs font-semibold flex items-center gap-1.5">
                        <Tag className="w-3 h-3 text-[#FF8E4D]" />
                        <span>{matchedAdminPost.category}</span>
                      </span>
                      <span className="px-2.5 py-1 rounded-lg bg-[#25282E] text-gray-300 border border-[#34373D] text-xs font-mono flex items-center gap-1.5">
                        <Calendar className="w-3 h-3 text-gray-400" />
                        <span>{matchedAdminPost.date}</span>
                      </span>
                      <span className="px-2.5 py-1 rounded-lg bg-[#25282E] text-gray-300 border border-[#34373D] text-xs flex items-center gap-1.5">
                        <User className="w-3 h-3 text-gray-400" />
                        <span>{matchedAdminPost.author}</span>
                      </span>
                    </div>
                  </div>

                  {/* Title */}
                  <div className="space-y-1.5">
                    <span className="text-[11px] text-gray-400 uppercase tracking-wider font-bold">
                      Document Title (টাইটেল)
                    </span>
                    <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug select-text">
                      {matchedAdminPost.title}
                    </h3>
                    {matchedAdminPost.badges && matchedAdminPost.badges.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {matchedAdminPost.badges.map((b, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wide bg-[#F25C05]/15 text-[#FF8E4D] border border-[#F25C05]/30"
                          >
                            {b}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Description / Content Body */}
                  <div className="space-y-2 bg-[#141517] p-4 sm:p-5 rounded-xl border border-[#26282B]">
                    <div className="flex items-center justify-between pb-2 border-b border-[#25272B]">
                      <span className="text-xs font-bold text-gray-300 uppercase tracking-wide flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-[#38bdf8]" />
                        <span>Official Description & Content (বিস্তারিত বিবরণ)</span>
                      </span>
                      <span className="text-[11px] text-gray-400 font-mono">
                        {matchedAdminPost.readTime || 'Official Circular'}
                      </span>
                    </div>
                    <div className="text-sm text-gray-200 leading-relaxed whitespace-pre-line pt-2 font-sans select-text">
                      {matchedAdminPost.content}
                    </div>
                  </div>

                  {/* ===============================================================
                      PICTURE GALLERY (CLICK TO VIEW & ZOOM)
                     =============================================================== */}
                  {matchedAdminPost.galleryImages && matchedAdminPost.galleryImages.length > 0 && (
                    <div className="space-y-3 bg-[#141517] p-4 sm:p-5 rounded-xl border border-[#26282B]">
                      <div className="flex items-center justify-between pb-2 border-b border-[#25272B]">
                        <span className="text-xs font-bold text-gray-200 uppercase tracking-wide flex items-center gap-1.5">
                          <ImageIcon className="w-4 h-4 text-[#38bdf8]" />
                          <span>
                            Document Photos & Gallery (ছবি গ্যালারি - {matchedAdminPost.galleryImages.length} Pictures)
                          </span>
                        </span>
                        <span className="text-[11px] text-gray-400 font-medium">
                          Click to view & zoom
                        </span>
                      </div>

                      {/* Interactive Gallery Grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pt-1">
                        {matchedAdminPost.galleryImages.map((img, idx) => (
                          <div
                            key={idx}
                            onClick={() => handleOpenImagePreview(img, idx)}
                            className="relative h-32 sm:h-36 rounded-lg overflow-hidden border border-[#31353E] hover:border-[#F25C05] bg-[#0c0d0e] cursor-pointer group transition-all"
                            title="Click to view & zoom picture"
                          >
                            <img
                              src={img}
                              alt={`${matchedAdminPost.title} - Photo ${idx + 1}`}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src =
                                  'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=400&q=80';
                              }}
                            />
                            <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                              <span className="px-2 py-1 rounded bg-black/80 text-white text-xs font-medium flex items-center gap-1">
                                <Eye className="w-3.5 h-3.5" />
                                <span>Zoom</span>
                              </span>
                            </div>
                            <span className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 rounded text-[10px] font-bold bg-black/80 text-white pointer-events-none">
                              #{idx + 1}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* ===============================================================
                      ATTACHED PDF & OFFICIAL DOCUMENTS (WITH ZOOMABLE PREVIEW)
                     =============================================================== */}
                  {matchedAdminPost.attachedDocuments &&
                    matchedAdminPost.attachedDocuments.length > 0 && (
                      <div className="space-y-3 bg-[#141517] p-4 sm:p-5 rounded-xl border border-[#26282B]">
                        <div className="flex items-center justify-between pb-2 border-b border-[#25272B]">
                          <span className="text-xs font-bold text-gray-200 uppercase tracking-wide flex items-center gap-1.5">
                            <Paperclip className="w-4 h-4 text-red-400" />
                            <span>
                              Attached PDF & Official Documents (পিডিএফ ও ডকুমেন্ট ফাইল -{' '}
                              {matchedAdminPost.attachedDocuments.length} Documents)
                            </span>
                          </span>
                          <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            <span>Verified Attachment</span>
                          </span>
                        </div>

                        <div className="space-y-2.5 pt-1">
                          {matchedAdminPost.attachedDocuments.map((doc) => (
                            <div
                              key={doc.id}
                              className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl bg-[#1A1C1F] border border-[#2B2E35] hover:border-[#3D424D] transition-colors gap-3"
                            >
                              <div className="flex items-center gap-3 overflow-hidden">
                                <div
                                  className={`p-2.5 rounded-xl shrink-0 ${
                                    doc.type === 'pdf'
                                      ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                                      : 'bg-[#0284c7]/20 text-[#38bdf8] border border-[#0284c7]/30'
                                  }`}
                                >
                                  <FileText className="w-5 h-5" />
                                </div>
                                <div className="overflow-hidden">
                                  <div className="text-xs sm:text-sm font-bold text-white truncate">
                                    {doc.name}
                                  </div>
                                  <div className="flex items-center gap-2 text-[11px] text-gray-400 mt-0.5">
                                    <span className="uppercase font-mono text-[10px] font-bold text-red-400">
                                      {doc.type}
                                    </span>
                                    <span>•</span>
                                    <span>{doc.size}</span>
                                    <span>•</span>
                                    <span>Uploaded: {doc.uploadDate}</span>
                                  </div>
                                </div>
                              </div>

                              {/* View & Zoom Document Button */}
                              <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                                <button
                                  type="button"
                                  onClick={() => handleOpenDocPreview(doc)}
                                  className="px-4 py-2 bg-[#25282F] hover:bg-[#313640] text-gray-100 hover:text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer border border-[#373C47] shadow-sm"
                                >
                                  <Eye className="w-4 h-4 text-[#38bdf8]" />
                                  <span>View & Zoom (প্রিভিউ ও জুম)</span>
                                </button>
                                {doc.dataUrl && (
                                  <a
                                    href={doc.dataUrl}
                                    download={doc.name || 'document.pdf'}
                                    className="p-2 bg-[#25282F] hover:bg-[#313640] text-gray-300 hover:text-white rounded-xl transition-colors cursor-pointer border border-[#373C47]"
                                    title="Download Document"
                                  >
                                    <Download className="w-4 h-4" />
                                  </a>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  {/* Actions Bottom Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#26282B]">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleCopyRef(matchedAdminPost.refNumber)}
                        className="px-4 py-2 rounded-xl bg-[#25282D] hover:bg-[#2F3238] text-gray-200 hover:text-white text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer border border-[#34373E]"
                      >
                        {copiedRef ? (
                          <>
                            <Check className="w-4 h-4 text-emerald-400" />
                            <span>Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4 text-gray-400" />
                            <span>Copy Ref No</span>
                          </>
                        )}
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={handleReset}
                      className="px-4 py-2 rounded-xl text-gray-400 hover:text-white text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Search Another Document</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* =========================================================================
                RESULT VIEW B: MATCHED APPLICANT PROFILE (Sample Database)
               ========================================================================= */}
            {hasSearched && !matchedAdminPost && matchedProfile && (
              <div
                className="bg-[#1C1E22] border border-[#2D3036] rounded-xl p-5 space-y-4 animate-in fade-in duration-200 shadow-lg relative"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#2A2C31]">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                    <div>
                      <span className="text-xs font-bold text-emerald-400 uppercase tracking-wide block">
                        Official Record Verified
                      </span>
                      <span className="text-xs text-gray-400">
                        Commonwealth Department of Home Affairs & BHP Database
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 rounded-full text-xs font-semibold">
                      Status: Active & Valid
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                  <div className="bg-[#151618] p-3 rounded-lg border border-[#26282B]">
                    <span className="text-gray-400 block text-[11px] mb-0.5">Holder Full Name</span>
                    <strong className="text-white text-sm font-semibold">
                      {matchedProfile.fullName}
                    </strong>
                  </div>

                  <div className="bg-[#151618] p-3 rounded-lg border border-[#26282B]">
                    <span className="text-gray-400 block text-[11px] mb-0.5">Reference Number</span>
                    <strong className="text-[#FF8E4D] font-mono text-sm font-semibold">
                      {matchedProfile.referenceNumber}
                    </strong>
                  </div>

                  <div className="bg-[#151618] p-3 rounded-lg border border-[#26282B]">
                    <span className="text-gray-400 block text-[11px] mb-0.5">
                      Nationality & Passport
                    </span>
                    <span className="text-gray-200">
                      {matchedProfile.nationality} ({matchedProfile.documentNumber})
                    </span>
                  </div>

                  <div className="bg-[#151618] p-3 rounded-lg border border-[#26282B]">
                    <span className="text-gray-400 block text-[11px] mb-0.5">Visa Subclass</span>
                    <span className="text-gray-200">{matchedProfile.visaSubclass}</span>
                  </div>

                  <div className="bg-[#151618] p-3 rounded-lg border border-[#26282B]">
                    <span className="text-gray-400 block text-[11px] mb-0.5">
                      Nominated Occupation
                    </span>
                    <span className="text-gray-200">
                      {matchedProfile.nominatedOccupation} (ANZSCO {matchedProfile.anzscoCode})
                    </span>
                  </div>

                  <div className="bg-[#151618] p-3 rounded-lg border border-[#26282B]">
                    <span className="text-gray-400 block text-[11px] mb-0.5">Sponsoring Employer</span>
                    <span className="text-gray-200">{matchedProfile.sponsorName}</span>
                  </div>

                  <div className="bg-[#151618] p-3 rounded-lg border border-[#26282B]">
                    <span className="text-gray-400 block text-[11px] mb-0.5">Work Location</span>
                    <span className="text-gray-200">{matchedProfile.workLocation}</span>
                  </div>

                  <div className="bg-[#151618] p-3 rounded-lg border border-[#26282B]">
                    <span className="text-gray-400 block text-[11px] mb-0.5">
                      Validity / Expiry Date
                    </span>
                    <span className="text-gray-200">{matchedProfile.visaExpiryDate}</span>
                  </div>
                </div>

                <div className="flex items-center justify-end pt-2 border-t border-[#26282B]">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="px-3.5 py-1.5 rounded-lg text-gray-400 hover:text-white text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Search Another</span>
                  </button>
                </div>
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
