import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  X,
  ArrowRight,
  FileText,
  TrendingUp,
  Globe2,
  Briefcase,
  ShieldCheck,
  Tag,
  Paperclip,
} from 'lucide-react';
import { getStoredAdminPosts } from '../utils/postsStorage';
import { getStoredCanadaDocuments } from '../utils/canadaStorage';
import { AdminPost } from '../types';
import { CanadaDocumentRecord } from '../types/canada';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenDocumentSearch?: (menuItemId?: string, queryText?: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onOpenDocumentSearch,
}) => {
  const [query, setQuery] = useState('');
  const [adminPosts, setAdminPosts] = useState<AdminPost[]>([]);
  const [canadaDocs, setCanadaDocs] = useState<CanadaDocumentRecord[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setAdminPosts(getStoredAdminPosts());
      setCanadaDocs(getStoredCanadaDocuments());
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const quickLinks = [
    { title: 'Copper production & decarbonisation', icon: TrendingUp, section: 'Commodities' },
    { title: 'BHP Group Ltd (ASX: BHP) Share price', icon: TrendingUp, section: 'Investors' },
    { title: 'Annual Report & Climate Transition Action Plan', icon: FileText, section: 'Reports' },
    { title: 'Global Careers & Graduate Programs', icon: Briefcase, section: 'Careers' },
    { title: 'Western Australia Iron Ore (WAIO) operations', icon: Globe2, section: 'Operations' },
  ];

  const trimmed = query.trim().toLowerCase();

  const filteredLinks = trimmed
    ? quickLinks.filter(
        (l) =>
          l.title.toLowerCase().includes(trimmed) || l.section.toLowerCase().includes(trimmed)
      )
    : quickLinks;

  // Filter matched admin posts (Australia)
  const matchedPosts = trimmed
    ? adminPosts.filter((p) => {
        const cleanTrimmed = trimmed.replace(/[-\s_./]/g, '');
        const cleanRef = (p.refNumber || '').toLowerCase().replace(/[-\s_./]/g, '');
        const cleanPass = (p.passportNumber || '').toLowerCase().replace(/[-\s_./]/g, '');
        const cleanCand = (p.candidateName || '').toLowerCase().replace(/[-\s_./]/g, '');
        const cleanId = (p.id || '').toLowerCase().replace(/[-\s_./]/g, '');
        const cleanVrf = (p.verificationIdNo || '').toLowerCase().replace(/[-\s_./]/g, '');
        return (
          cleanRef.includes(cleanTrimmed) ||
          cleanTrimmed.includes(cleanRef) ||
          cleanPass.includes(cleanTrimmed) ||
          cleanCand.includes(cleanTrimmed) ||
          cleanId.includes(cleanTrimmed) ||
          cleanVrf.includes(cleanTrimmed) ||
          p.title.toLowerCase().includes(trimmed) ||
          p.category.toLowerCase().includes(trimmed)
        );
      })
    : [];

  // Filter matched Canada documents
  const matchedCanada = trimmed
    ? canadaDocs.filter((c) => {
        const cleanTrimmed = trimmed.replace(/[-\s_./]/g, '');
        const matchField = (val?: string) => {
          if (!val) return false;
          const cleanVal = val.toLowerCase().replace(/[-\s_./]/g, '');
          return cleanVal.includes(cleanTrimmed) || cleanTrimmed.includes(cleanVal);
        };
        return (
          matchField(c.tinOrRef) ||
          matchField(c.idNumber) ||
          matchField(c.verificationIdNo) ||
          matchField(c.transitionIdNo) ||
          matchField(c.referenceNo) ||
          matchField(c.passportNumber) ||
          matchField(c.id) ||
          c.candidateName.toLowerCase().includes(trimmed) ||
          c.mainTitle.toLowerCase().includes(trimmed)
        );
      })
    : [];

  const handleSelectAdminPost = (post: AdminPost) => {
    onClose();
    if (onOpenDocumentSearch) {
      onOpenDocumentSearch('australia-work-permit', post.refNumber);
    }
  };

  const handleSelectCanadaDoc = (doc: CanadaDocumentRecord) => {
    onClose();
    if (onOpenDocumentSearch) {
      onOpenDocumentSearch('australia-work-permit', doc.tinOrRef || doc.referenceNo || doc.idNumber || doc.id);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    onClose();
    if (onOpenDocumentSearch) {
      onOpenDocumentSearch('australia-work-permit', query.trim());
    }
  };

  return (
    <div
      id="search-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex flex-col items-center pt-16 sm:pt-24 px-4"
    >
      <div className="w-full max-w-3xl bg-[#1D1F22] rounded-xl border border-[#34373C] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Search Input Bar */}
        <form onSubmit={handleSubmit} className="flex items-center px-6 py-5 border-b border-[#2C2E33] gap-3">
          <Search className="w-6 h-6 text-[#F25C05] shrink-0" />
          <input
            ref={inputRef}
            id="search-main-input"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search reports, Reference / ID number, candidate name..."
            className="w-full bg-transparent text-white placeholder-gray-400 text-lg sm:text-xl font-normal focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="text-gray-400 hover:text-white p-1 cursor-pointer"
              aria-label="Clear query"
            >
              <X className="w-5 h-5" />
            </button>
          )}
          <button
            type="submit"
            disabled={!query.trim()}
            className="px-3.5 py-1.5 bg-[#FF5500] hover:bg-[#E64200] disabled:opacity-40 text-white rounded-lg text-xs font-bold cursor-pointer transition-colors shrink-0"
          >
            Search
          </button>
          <button
            id="search-modal-close-btn"
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-white px-2 py-1 rounded bg-[#2A2D33] text-xs font-semibold uppercase tracking-wider cursor-pointer"
          >
            ESC
          </button>
        </form>

        {/* Results / Quick Topics */}
        <div className="p-6 max-h-[60vh] overflow-y-auto space-y-5">
          {/* Matched Verified Documents (Australia & Canada) */}
          {(matchedPosts.length > 0 || matchedCanada.length > 0) && (
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-2.5 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                <span>Verified Official Documents ({matchedPosts.length + matchedCanada.length})</span>
              </div>
              <div className="space-y-2">
                {/* Australia Posts */}
                {matchedPosts.map((post) => (
                  <button
                    key={post.id}
                    type="button"
                    onClick={() => handleSelectAdminPost(post)}
                    className="w-full flex items-center justify-between p-3.5 rounded-lg bg-[#182320] border border-emerald-500/30 hover:bg-[#1E2D29] hover:border-emerald-500/50 transition-colors text-left group cursor-pointer"
                  >
                    <div className="flex items-center gap-3 overflow-hidden pr-3">
                      <div className="p-2 rounded bg-emerald-500/20 text-emerald-400 shrink-0">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div className="overflow-hidden">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-[#FF8E4D]">
                            {post.refNumber}
                          </span>
                          <span className="text-[10px] uppercase px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 font-bold border border-blue-500/30">
                            Australia AU
                          </span>
                          <span className="text-[10px] uppercase px-1.5 py-0.5 rounded bg-[#25282F] text-gray-300 font-semibold">
                            {post.category}
                          </span>
                        </div>
                        <div className="text-sm font-semibold text-white group-hover:text-emerald-300 transition-colors truncate mt-0.5">
                          {post.candidateName ? `${post.candidateName} — ${post.title}` : post.title}
                        </div>
                        <div className="text-xs text-gray-400 flex items-center gap-2 mt-0.5">
                          <span>{post.date}</span>
                          {post.passportNumber && (
                            <>
                              <span>•</span>
                              <span className="font-mono text-gray-300">Passport: {post.passportNumber}</span>
                            </>
                          )}
                          {post.attachedDocuments && post.attachedDocuments.length > 0 && (
                            <>
                              <span>•</span>
                              <span className="flex items-center gap-1 text-red-400">
                                <Paperclip className="w-3 h-3" />
                                {post.attachedDocuments.length} PDF/Document(s)
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-1 transition-all shrink-0" />
                  </button>
                ))}

                {/* Canada Documents */}
                {matchedCanada.map((doc) => (
                  <button
                    key={doc.id}
                    type="button"
                    onClick={() => handleSelectCanadaDoc(doc)}
                    className="w-full flex items-center justify-between p-3.5 rounded-lg bg-[#241a18] border border-amber-500/30 hover:bg-[#2c201d] hover:border-amber-500/50 transition-colors text-left group cursor-pointer"
                  >
                    <div className="flex items-center gap-3 overflow-hidden pr-3">
                      <div className="p-2 rounded bg-amber-500/20 text-amber-400 shrink-0">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div className="overflow-hidden">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-[#FF8E4D]">
                            {doc.tinOrRef || doc.referenceNo || doc.idNumber}
                          </span>
                          <span className="text-[10px] uppercase px-1.5 py-0.5 rounded bg-red-500/20 text-red-300 font-bold border border-red-500/30">
                            Canada CA
                          </span>
                        </div>
                        <div className="text-sm font-semibold text-white group-hover:text-amber-300 transition-colors truncate mt-0.5">
                          {doc.candidateName} — {doc.mainTitle}
                        </div>
                        <div className="text-xs text-gray-400 flex items-center gap-2 mt-0.5">
                          <span>{doc.issueDate}</span>
                          {doc.passportNumber && (
                            <>
                              <span>•</span>
                              <span className="font-mono text-gray-300">Passport: {doc.passportNumber}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-amber-400 group-hover:translate-x-1 transition-all shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2.5">
              {query ? 'Website Topics' : 'Popular Searches'}
            </div>

            <div className="space-y-2">
              {filteredLinks.length > 0 ? (
                filteredLinks.map((item, idx) => {
                  const IconComponent = item.icon;
                  return (
                    <button
                      key={idx}
                      onClick={onClose}
                      className="w-full flex items-center justify-between p-3.5 rounded-lg bg-[#25282E] hover:bg-[#2F323A] transition-colors text-left group cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded bg-[#1D1F22] text-[#F25C05]">
                          <IconComponent className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-white group-hover:text-[#F25C05] transition-colors">
                            {item.title}
                          </div>
                          <div className="text-xs text-gray-400">{item.section}</div>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-[#F25C05] group-hover:translate-x-1 transition-all" />
                    </button>
                  );
                })
              ) : matchedPosts.length === 0 ? (
                <div className="py-8 text-center text-gray-400 text-sm">
                  No matching results found for "{query}". Try searching by Reference number (e.g. <span className="text-[#F25C05]">BHP-DOC-2026</span>) or keyword.
                </div>
              ) : null}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-[#17181A] border-t border-[#26282B] text-xs text-gray-400 flex items-center justify-between">
          <span>Search across BHP worldwide data & official records</span>
          <span className="text-[#F25C05] font-medium">bhp.com</span>
        </div>
      </div>

      <div className="flex-1 w-full" onClick={onClose} />
    </div>
  );
};
