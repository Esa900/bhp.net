import React, { useState, useEffect, useRef } from 'react';
import { Search, X, AlertCircle, ShieldCheck, FileText, Printer, RotateCcw } from 'lucide-react';
import { DocumentMenuItem } from '../data/menuNavigationItems';
import { SAMPLE_PROFILES } from '../data/portalData';
import { ApplicantProfile } from '../types/portal';

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
  const [matchedProfile, setMatchedProfile] = useState<ApplicantProfile | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // When activeItem changes or modal opens, reset search and focus input
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setHasSearched(false);
      setMatchedProfile(null);
      setTimeout(() => inputRef.current?.focus(), 80);
    }
  }, [isOpen, activeItem]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !activeItem) return null;

  const handleSearch = (overrideQuery?: string) => {
    const searchTerm = (overrideQuery !== undefined ? overrideQuery : query).trim().toLowerCase();
    if (!searchTerm) return;

    setIsSearching(true);
    setHasSearched(true);

    // Simulate instant search with quick feedback
    setTimeout(() => {
      const cleanTerm = searchTerm.replace(/[-\s]/g, '');

      const found = SAMPLE_PROFILES.find((p) => {
        const refMatch = p.referenceNumber.toLowerCase().replace(/[-\s]/g, '').includes(cleanTerm);
        const edMatch = p.edNumber?.toLowerCase().replace(/[-\s]/g, '').includes(cleanTerm);
        const docMatch = p.documentNumber?.toLowerCase().replace(/[-\s]/g, '').includes(cleanTerm);
        const vrfMatch = p.verificationIdNo?.toLowerCase().replace(/[-\s]/g, '').includes(cleanTerm);
        const trnMatch = p.transitionIdNo?.toLowerCase().replace(/[-\s]/g, '').includes(cleanTerm);
        const grantMatch = p.visaGrantNumber?.toLowerCase().replace(/[-\s]/g, '').includes(cleanTerm);
        const insMatch = p.insuranceNo?.toLowerCase().replace(/[-\s]/g, '').includes(cleanTerm);
        const immiMatch = p.immiCardNo?.toLowerCase().replace(/[-\s]/g, '').includes(cleanTerm);
        const tfnMatch = p.tfnNumber?.toLowerCase().replace(/[-\s]/g, '').includes(cleanTerm);
        const nameMatch = p.fullName.toLowerCase().includes(searchTerm);
        const visaSubMatch = p.visaSubclass.toLowerCase().includes(searchTerm);

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

      setMatchedProfile(found || null);
      setIsSearching(false);
    }, 200);
  };

  const handleApplySample = () => {
    setQuery(activeItem.sampleValue);
    handleSearch(activeItem.sampleValue);
  };

  const handleReset = () => {
    setQuery('');
    setHasSearched(false);
    setMatchedProfile(null);
    inputRef.current?.focus();
  };

  return (
    <div
      id="document-search-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="document-search-modal-panel"
        className="w-full max-w-2xl bg-[#161718] border border-[#2F3136] rounded-2xl shadow-2xl overflow-hidden flex flex-col my-auto animate-in zoom-in-95 duration-200"
      >
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-[#26282B] flex items-start justify-between bg-[#1A1C1E]">
          <div className="pr-4">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#FF8E4D] block mb-1">
              {activeItem.mainTitle}
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#F25C05] shrink-0" />
              <span>{activeItem.subMenu}</span>
            </h2>
          </div>
          <button
            id="close-document-search-modal"
            type="button"
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-white hover:bg-[#25282D] rounded-lg transition-colors cursor-pointer"
            aria-label="Close search"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* Search Box Card */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label htmlFor="doc-search-input" className="text-xs font-semibold text-gray-300 uppercase tracking-wide">
                Search by <span className="text-[#FF8E4D]">{activeItem.fieldLabel}</span>
              </label>
              <button
                type="button"
                onClick={handleApplySample}
                className="text-[11px] text-gray-400 hover:text-[#F25C05] underline transition-colors cursor-pointer"
              >
                Sample: <strong className="font-mono text-gray-200">{activeItem.sampleValue}</strong>
              </button>
            </div>

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
                  placeholder={activeItem.placeholder}
                  className="w-full bg-[#202226] border border-[#34373D] focus:border-[#F25C05] rounded-xl pl-11 pr-10 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#F25C05] transition-all"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white p-1"
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
                    <span>Search</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Search Result Display */}
          {hasSearched && (
            <div className="pt-2">
              {matchedProfile ? (
                /* Found Result Card */
                <div className="bg-[#1C1E22] border border-[#2D3036] rounded-xl p-5 space-y-4 animate-in fade-in duration-200 shadow-lg">
                  {/* Result Header Badge */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#2A2C31]">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-emerald-400" />
                      <div>
                        <span className="text-xs font-bold text-emerald-400 uppercase tracking-wide block">
                          Official Record Verified
                        </span>
                        <span className="text-xs text-gray-400">Commonwealth Department of Home Affairs & BHP Database</span>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 rounded-full text-xs font-semibold">
                      Status: Active & Valid
                    </span>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                    <div className="bg-[#151618] p-3 rounded-lg border border-[#26282B]">
                      <span className="text-gray-400 block text-[11px] mb-0.5">Holder Full Name</span>
                      <strong className="text-white text-sm font-semibold">{matchedProfile.fullName}</strong>
                    </div>

                    <div className="bg-[#151618] p-3 rounded-lg border border-[#26282B]">
                      <span className="text-gray-400 block text-[11px] mb-0.5">Reference Number</span>
                      <strong className="text-[#FF8E4D] font-mono text-sm font-semibold">{matchedProfile.referenceNumber}</strong>
                    </div>

                    <div className="bg-[#151618] p-3 rounded-lg border border-[#26282B]">
                      <span className="text-gray-400 block text-[11px] mb-0.5">Nationality & Passport</span>
                      <span className="text-gray-200">{matchedProfile.nationality} ({matchedProfile.documentNumber})</span>
                    </div>

                    <div className="bg-[#151618] p-3 rounded-lg border border-[#26282B]">
                      <span className="text-gray-400 block text-[11px] mb-0.5">Visa Subclass</span>
                      <span className="text-gray-200">{matchedProfile.visaSubclass}</span>
                    </div>

                    <div className="bg-[#151618] p-3 rounded-lg border border-[#26282B]">
                      <span className="text-gray-400 block text-[11px] mb-0.5">Nominated Occupation</span>
                      <span className="text-gray-200">{matchedProfile.nominatedOccupation} (ANZSCO {matchedProfile.anzscoCode})</span>
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
                      <span className="text-gray-400 block text-[11px] mb-0.5">Validity / Expiry Date</span>
                      <span className="text-gray-200">{matchedProfile.visaExpiryDate}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-2 border-t border-[#26282B]">
                    <button
                      type="button"
                      onClick={() => window.print()}
                      className="px-3.5 py-1.5 rounded-lg bg-[#25282D] hover:bg-[#2F3238] text-gray-200 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Print Summary</span>
                    </button>

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
              ) : (
                /* Not Found Card */
                <div className="bg-[#1F1915] border border-[#4A2B18] rounded-xl p-5 text-center space-y-3">
                  <AlertCircle className="w-8 h-8 text-[#FF8E4D] mx-auto" />
                  <div>
                    <h3 className="text-sm font-bold text-white mb-1">
                      No Record Found for "{query}"
                    </h3>
                    <p className="text-xs text-gray-300 max-w-md mx-auto">
                      No document was found matching the entered {activeItem.fieldLabel}. Please verify your input and try again.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleApplySample}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#2B231D] hover:bg-[#382C22] border border-[#593922] text-[#FF8E4D] rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                  >
                    <span>Try with sample number:</span>
                    <strong className="font-mono text-white">{activeItem.sampleValue}</strong>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
