import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  X,
  ShieldCheck,
  FileText,
  Copy,
  Check,
  Calendar,
  User,
  ExternalLink,
  AlertTriangle,
  Building,
  MapPin,
  Clock,
  Sparkles,
} from 'lucide-react';
import { CanadaMenuItemConfig, CanadaDocumentRecord } from '../types/canada';
import {
  CANADA_MENU_CONFIGS,
  searchCanadaDocument,
  getStoredCanadaDocuments,
  CANADA_DOCUMENTS_UPDATED_EVENT,
} from '../utils/canadaStorage';
import { findAdminPostByQuery } from '../utils/postsStorage';
import { AdminPost } from '../types';
import {
  FullPdfDocumentViewer,
  canadaRecordToUnifiedDoc,
  postToUnifiedDoc,
} from './FullPdfDocumentViewer';

interface CanadaDocumentSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeConfig: CanadaMenuItemConfig | null;
  onSelectConfig?: (config: CanadaMenuItemConfig) => void;
}

export const CanadaDocumentSearchModal: React.FC<CanadaDocumentSearchModalProps> = ({
  isOpen,
  onClose,
  activeConfig,
  onSelectConfig,
}) => {
  const [currentConfig, setCurrentConfig] = useState<CanadaMenuItemConfig>(
    activeConfig || CANADA_MENU_CONFIGS[0]
  );
  const [query, setQuery] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [matchedRecord, setMatchedRecord] = useState<CanadaDocumentRecord | null>(null);
  const [matchedAdminPost, setMatchedAdminPost] = useState<AdminPost | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [copiedText, setCopiedText] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  // Sync with activeConfig prop
  useEffect(() => {
    if (activeConfig) {
      setCurrentConfig(activeConfig);
    }
  }, [activeConfig]);

  // When modal opens or config changes, reset query & search state
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setHasSearched(false);
      setMatchedRecord(null);
      setMatchedAdminPost(null);
      setTimeout(() => inputRef.current?.focus(), 80);
    }
  }, [isOpen, currentConfig]);

  // Listen to storage update events in case admin updates records in another tab
  useEffect(() => {
    const handleUpdate = () => {
      if (hasSearched && query.trim()) {
        const found = searchCanadaDocument(query, currentConfig.id);
        setMatchedRecord(found);
      }
    };
    window.addEventListener(CANADA_DOCUMENTS_UPDATED_EVENT, handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener(CANADA_DOCUMENTS_UPDATED_EVENT, handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, [hasSearched, query, currentConfig]);

  // Esc key listener
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSearch = (searchQuery?: string) => {
    const term = (searchQuery !== undefined ? searchQuery : query).trim();
    if (!term) return;

    setIsSearching(true);
    setHasSearched(true);
    setMatchedRecord(null);
    setMatchedAdminPost(null);

    setTimeout(() => {
      // 1. Try matching in Canada documents storage
      const found = searchCanadaDocument(term, currentConfig.id);
      if (found) {
        setMatchedRecord(found);
      } else {
        // 2. Fallback: check general admin posts by reference
        const post = findAdminPostByQuery(term);
        if (post) {
          setMatchedAdminPost(post);
        }
      }
      setIsSearching(false);
    }, 280);
  };

  return (
    <div
      id="canada-search-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex flex-col items-center pt-10 sm:pt-14 px-3 sm:px-6 overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="canada-search-modal-container"
        className="w-full max-w-4xl bg-[#17181B] rounded-2xl border border-[#2D3036] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 mb-12 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* =========================================================================
            MODAL HEADER BAR (Exact 1:1 match to reference screenshot)
           ========================================================================= */}
        <div className="bg-[#1F2228] px-5 py-4 border-b border-[#2C3038] flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="p-2 rounded-xl bg-[#F25C05]/15 text-[#F25C05] border border-[#F25C05]/30 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="overflow-hidden">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#FF8E4D] uppercase tracking-wider">
                  {currentConfig.mainTitle.toUpperCase()}
                </span>
                <span className="text-[10px] uppercase px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                  Live DVS Search
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white truncate mt-0.5">
                {currentConfig.fieldLabel} Verification Search
              </h2>
            </div>
          </div>

          <button
            id="canada-search-modal-close"
            type="button"
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-[#2B2F38] transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* =========================================================================
            SEARCH BOX FORM (Exact 1:1 match to reference screenshot)
           ========================================================================= */}
        <div className="p-5 sm:p-6 space-y-6">
          <div className="space-y-2">
            <label
              htmlFor="canada-doc-search-input"
              className="block text-xs font-bold uppercase tracking-wider text-gray-300"
            >
              ENTER {currentConfig.fieldLabel.toUpperCase()} / REFERENCE NUMBER / ID:
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
                  id="canada-doc-search-input"
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Enter Reference Number or ID (যেমন: BHP-DOC-2026-0089 বা টাইটেল)..."
                  className="w-full bg-[#121316] border-2 border-[#F25C05] rounded-xl pl-11 pr-10 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#F25C05] transition-all font-mono"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => {
                      setQuery('');
                      setHasSearched(false);
                      setMatchedRecord(null);
                      setMatchedAdminPost(null);
                      inputRef.current?.focus();
                    }}
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

            {/* Quick Sample Helper Button */}
            <div className="flex items-center justify-between text-xs text-gray-400 pt-1">
              <span>Enter the official reference ID or TIN printed on your document.</span>
              <button
                type="button"
                onClick={() => {
                  setQuery(currentConfig.samplePlaceholder);
                  handleSearch(currentConfig.samplePlaceholder);
                }}
                className="text-[#FF8E4D] hover:underline font-mono text-[11px] cursor-pointer"
              >
                Try Sample: {currentConfig.samplePlaceholder}
              </button>
            </div>
          </div>

          {/* =========================================================================
              SEARCH RESULTS DISPLAY
             ========================================================================= */}
          {hasSearched && (
            <div className="pt-2 animate-in fade-in duration-200">
              {matchedRecord ? (
                /* MATCH FOUND - OFFICIAL CANADA FULL PDF CERTIFICATE & DOCUMENTS */
                <FullPdfDocumentViewer
                  document={canadaRecordToUnifiedDoc(matchedRecord)}
                  onSearchAnother={() => {
                    setQuery('');
                    setHasSearched(false);
                    setMatchedRecord(null);
                    setMatchedAdminPost(null);
                    setTimeout(() => inputRef.current?.focus(), 50);
                  }}
                  onClose={onClose}
                />
              ) : matchedAdminPost ? (
                /* MATCH FOUND IN ADMIN POSTS */
                <FullPdfDocumentViewer
                  document={postToUnifiedDoc(matchedAdminPost, 'canada')}
                  onSearchAnother={() => {
                    setQuery('');
                    setHasSearched(false);
                    setMatchedRecord(null);
                    setMatchedAdminPost(null);
                    setTimeout(() => inputRef.current?.focus(), 50);
                  }}
                  onClose={onClose}
                />
              ) : (
                /* NO RECORD FOUND */
                <div className="p-8 text-center bg-[#131518] rounded-2xl border border-dashed border-[#2D3038] space-y-3">
                  <AlertTriangle className="w-10 h-10 text-amber-500/80 mx-auto" />
                  <div className="space-y-1">
                    <h4 className="text-base font-bold text-white">
                      No Verified Record Found
                    </h4>
                    <p className="text-xs text-gray-400 max-w-md mx-auto">
                      No official document was found matching "{query}". Please verify that your ID, TIN, or Reference Number is typed correctly.
                    </p>
                  </div>
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setQuery(currentConfig.samplePlaceholder);
                        handleSearch(currentConfig.samplePlaceholder);
                      }}
                      className="px-4 py-2 bg-[#252830] hover:bg-[#30333C] text-xs font-semibold text-gray-200 rounded-lg transition-colors cursor-pointer"
                    >
                      Search with Demo ID: {currentConfig.samplePlaceholder}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
