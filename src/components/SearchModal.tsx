import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowRight, FileText, TrendingUp, Globe2, Briefcase } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
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

  const filteredLinks = query.trim()
    ? quickLinks.filter(l => l.title.toLowerCase().includes(query.toLowerCase()) || l.section.toLowerCase().includes(query.toLowerCase()))
    : quickLinks;

  return (
    <div id="search-modal-backdrop" className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex flex-col items-center pt-16 sm:pt-24 px-4">
      <div className="w-full max-w-3xl bg-[#1D1F22] rounded-xl border border-[#34373C] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Search Input Bar */}
        <div className="flex items-center px-6 py-5 border-b border-[#2C2E33] gap-3">
          <Search className="w-6 h-6 text-[#F25C05] shrink-0" />
          <input
            ref={inputRef}
            id="search-main-input"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search reports, commodities, share price, news..."
            className="w-full bg-transparent text-white placeholder-gray-400 text-lg sm:text-xl font-normal focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-gray-400 hover:text-white p-1"
              aria-label="Clear query"
            >
              <X className="w-5 h-5" />
            </button>
          )}
          <button
            id="search-modal-close-btn"
            onClick={onClose}
            className="text-gray-400 hover:text-white px-2 py-1 rounded bg-[#2A2D33] text-xs font-semibold uppercase tracking-wider"
          >
            ESC
          </button>
        </div>

        {/* Results / Quick Topics */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          <div className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
            {query ? 'Results' : 'Popular Searches'}
          </div>

          <div className="space-y-2">
            {filteredLinks.length > 0 ? (
              filteredLinks.map((item, idx) => {
                const IconComponent = item.icon;
                return (
                  <button
                    key={idx}
                    onClick={onClose}
                    className="w-full flex items-center justify-between p-3.5 rounded-lg bg-[#25282E] hover:bg-[#2F323A] transition-colors text-left group"
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
            ) : (
              <div className="py-8 text-center text-gray-400 text-sm">
                No matching results found for "{query}". Try searching for <span className="text-[#F25C05]">Copper</span>, <span className="text-[#F25C05]">Stock</span>, or <span className="text-[#F25C05]">Report</span>.
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-[#17181A] border-t border-[#26282B] text-xs text-gray-400 flex items-center justify-between">
          <span>Search across BHP worldwide data</span>
          <span className="text-[#F25C05] font-medium">bhp.com</span>
        </div>
      </div>

      <div className="flex-1 w-full" onClick={onClose} />
    </div>
  );
};
