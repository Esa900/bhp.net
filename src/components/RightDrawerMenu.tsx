import React, { useState, useEffect } from 'react';
import { X, ArrowRight, Search, FileCheck, ShieldCheck } from 'lucide-react';
import { CanadaMenuItemConfig } from '../types/canada';
import {
  getStoredCanadaMenuConfigs,
  CANADA_MENU_CONFIGS_UPDATED_EVENT,
} from '../utils/canadaStorage';
import { BhpLogo } from './common/BhpLogo';

interface RightDrawerMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCanadaItem: (config: CanadaMenuItemConfig) => void;
  // Kept optional for backward compatibility
  onSelectAustraliaItem?: (menuItemId: string) => void;
  onJobCategoryClick?: (category: any) => void;
}

export const RightDrawerMenu: React.FC<RightDrawerMenuProps> = ({
  isOpen,
  onClose,
  onSelectCanadaItem,
}) => {
  const [searchFilter, setSearchFilter] = useState('');
  const [canadaConfigs, setCanadaConfigs] = useState<CanadaMenuItemConfig[]>(() => getStoredCanadaMenuConfigs());

  useEffect(() => {
    const handleCanadaUpdate = () => {
      setCanadaConfigs(getStoredCanadaMenuConfigs());
    };

    window.addEventListener(CANADA_MENU_CONFIGS_UPDATED_EVENT, handleCanadaUpdate);
    window.addEventListener('storage', handleCanadaUpdate);

    return () => {
      window.removeEventListener(CANADA_MENU_CONFIGS_UPDATED_EVENT, handleCanadaUpdate);
      window.removeEventListener('storage', handleCanadaUpdate);
    };
  }, []);

  if (!isOpen) return null;

  const q = searchFilter.trim().toLowerCase();

  const filteredCanada = canadaConfigs.filter(
    (item) => !q || item.mainTitle.toLowerCase().includes(q) || item.subMenu.toLowerCase().includes(q)
  );

  return (
    <div
      id="right-drawer-backdrop"
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex justify-end animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="right-drawer-panel"
        className="w-full max-w-[460px] bg-[#0C0F16] h-full shadow-2xl border-l border-[#1F2533] flex flex-col text-white animate-in slide-in-from-right duration-200 select-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="px-6 py-5 border-b border-[#1F2533] flex items-center justify-between bg-[#0C0F16] sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <BhpLogo size="sm" showTagline={false} />
            <div className="border-l border-gray-700/80 pl-3">
              <div className="flex items-center gap-1.5">
                <span className="text-sm">🇨🇦</span>
                <span className="text-xs font-bold uppercase tracking-wider text-white">
                  Canada Menu
                </span>
                <span className="text-[10px] bg-red-950/80 text-red-300 border border-red-800/60 px-1.5 py-0.2 rounded font-bold">
                  {canadaConfigs.length}
                </span>
              </div>
              <p className="text-[11px] text-gray-400">Official Document Verification</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-[#1A202D] transition-colors cursor-pointer"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search bar inside drawer */}
        <div className="px-6 py-3.5 border-b border-[#1F2533] bg-[#0F131D]">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Search Canada verification categories..."
              className="w-full bg-[#161B26] border border-[#273043] rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#FF5500]"
            />
          </div>
        </div>

        {/* Drawer Content - ONLY Canada Options */}
        <div className="p-6 flex-1 overflow-y-auto space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#23252B]">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-red-500" />
              <span className="text-xs font-bold uppercase tracking-wider text-red-400">
                Canada Services & Verification Options
              </span>
            </div>
            <span className="text-[11px] text-gray-400 bg-[#161B26] px-2 py-0.5 rounded-full font-medium">
              {filteredCanada.length} Available
            </span>
          </div>

          <div className="space-y-2.5">
            {filteredCanada.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onClose();
                  onSelectCanadaItem(item);
                }}
                className="w-full text-left p-3.5 rounded-xl bg-[#121622] hover:bg-[#1A2030] border border-[#1E2536] hover:border-red-500/60 shadow-xs hover:shadow-md transition-all group cursor-pointer block"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase text-white group-hover:text-red-400 transition-colors flex items-center gap-1.5">
                    <span>🍁</span>
                    <span>{item.mainTitle}</span>
                  </span>
                  <div className="w-6 h-6 rounded-full bg-[#1A2030] group-hover:bg-red-500 flex items-center justify-center transition-colors">
                    <ArrowRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                  </div>
                </div>
                <div className="text-[11px] text-gray-400 mt-1 font-medium pl-6">
                  {item.subMenu}
                </div>
                {item.description && (
                  <div className="text-[10px] text-gray-500 mt-1 pl-6 line-clamp-1">
                    {item.description}
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* Empty state when search yields no results */}
          {filteredCanada.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <Search className="w-8 h-8 mx-auto text-gray-600 mb-2 opacity-50" />
              <p className="text-sm font-semibold text-gray-300">No Canada categories found</p>
              <p className="text-xs text-gray-500 mt-1">Try another search keyword</p>
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        <div className="px-6 py-4 border-t border-[#23252B] bg-[#0E0F12] flex items-center justify-between text-xs text-gray-400">
          <span className="flex items-center gap-1.5">
            <FileCheck className="w-3.5 h-3.5 text-red-500" />
            <span>Canada Immigration & Verification</span>
          </span>
          <span className="font-semibold text-gray-500">BHP Global</span>
        </div>
      </div>
    </div>
  );
};
