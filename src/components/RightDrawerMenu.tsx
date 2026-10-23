import React, { useState, useEffect } from 'react';
import { X, ArrowRight, Layers, Briefcase, FileCheck, Search } from 'lucide-react';
import { CanadaMenuItemConfig } from '../types/canada';
import {
  getStoredCanadaMenuConfigs,
  CANADA_MENU_CONFIGS_UPDATED_EVENT,
} from '../utils/canadaStorage';
import {
  DocumentMenuItem,
  DOCUMENT_MENU_ITEMS,
} from '../data/menuNavigationItems';
import {
  getStoredMenuItems,
  MENU_ITEMS_UPDATED_EVENT,
} from '../utils/menuItemsStorage';
import {
  JobCategory,
} from '../types/jobCircular';
import {
  getStoredJobCategories,
  JOB_CATEGORIES_UPDATED_EVENT,
} from '../utils/jobCircularStorage';
import { BhpLogo } from './common/BhpLogo';

interface RightDrawerMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCanadaItem: (config: CanadaMenuItemConfig) => void;
  onSelectAustraliaItem?: (menuItemId: string) => void;
  onJobCategoryClick?: (category: JobCategory) => void;
}

type TabType = 'all' | 'australia' | 'canada' | 'jobs';

export const RightDrawerMenu: React.FC<RightDrawerMenuProps> = ({
  isOpen,
  onClose,
  onSelectCanadaItem,
  onSelectAustraliaItem,
  onJobCategoryClick,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [searchFilter, setSearchFilter] = useState('');
  const [canadaConfigs, setCanadaConfigs] = useState<CanadaMenuItemConfig[]>(() => getStoredCanadaMenuConfigs());
  const [australiaItems, setAustraliaItems] = useState<DocumentMenuItem[]>(() => getStoredMenuItems());
  const [jobCats, setJobCats] = useState<JobCategory[]>(() => getStoredJobCategories());

  useEffect(() => {
    const handleCanadaUpdate = () => {
      setCanadaConfigs(getStoredCanadaMenuConfigs());
    };
    const handleAustraliaUpdate = () => {
      setAustraliaItems(getStoredMenuItems());
    };
    const handleJobCatsUpdate = () => {
      setJobCats(getStoredJobCategories());
    };

    window.addEventListener(CANADA_MENU_CONFIGS_UPDATED_EVENT, handleCanadaUpdate);
    window.addEventListener(MENU_ITEMS_UPDATED_EVENT, handleAustraliaUpdate);
    window.addEventListener(JOB_CATEGORIES_UPDATED_EVENT, handleJobCatsUpdate);
    window.addEventListener('storage', () => {
      handleCanadaUpdate();
      handleAustraliaUpdate();
      handleJobCatsUpdate();
    });

    return () => {
      window.removeEventListener(CANADA_MENU_CONFIGS_UPDATED_EVENT, handleCanadaUpdate);
      window.removeEventListener(MENU_ITEMS_UPDATED_EVENT, handleAustraliaUpdate);
      window.removeEventListener(JOB_CATEGORIES_UPDATED_EVENT, handleJobCatsUpdate);
    };
  }, []);

  if (!isOpen) return null;

  const q = searchFilter.trim().toLowerCase();

  const filteredAustralia = australiaItems.filter(
    (item) => !q || item.mainTitle.toLowerCase().includes(q) || item.subMenu.toLowerCase().includes(q)
  );

  const filteredCanada = canadaConfigs.filter(
    (item) => !q || item.mainTitle.toLowerCase().includes(q) || item.subMenu.toLowerCase().includes(q)
  );

  const filteredJobs = jobCats.filter(
    (item) => !q || item.name.toLowerCase().includes(q) || item.description?.toLowerCase().includes(q)
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
          <BhpLogo size="sm" showTagline={false} />

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
        <div className="px-6 pt-4 pb-2 border-b border-[#1F2533] bg-[#0F131D]">
          <div className="relative mb-3">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Search category or document..."
              className="w-full bg-[#161B26] border border-[#273043] rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#FF5500]"
            />
          </div>

          {/* Tab Selector */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 text-xs">
            <button
              type="button"
              onClick={() => setActiveTab('all')}
              className={`px-2.5 py-1.5 rounded-md font-semibold transition-colors shrink-0 cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-[#FF5500] text-white shadow-xs'
                  : 'bg-[#181D29] text-gray-300 hover:text-white hover:bg-[#202737]'
              }`}
            >
              All ({australiaItems.length + canadaConfigs.length + jobCats.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('australia')}
              className={`px-2.5 py-1.5 rounded-md font-semibold transition-colors shrink-0 cursor-pointer flex items-center gap-1 ${
                activeTab === 'australia'
                  ? 'bg-[#FF5500] text-white shadow-xs'
                  : 'bg-[#181D29] text-gray-300 hover:text-white hover:bg-[#202737]'
              }`}
            >
              <span>🇦🇺 Australia</span>
              <span className="opacity-75">({australiaItems.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('canada')}
              className={`px-2.5 py-1.5 rounded-md font-semibold transition-colors shrink-0 cursor-pointer flex items-center gap-1 ${
                activeTab === 'canada'
                  ? 'bg-[#FF5500] text-white shadow-xs'
                  : 'bg-[#181D29] text-gray-300 hover:text-white hover:bg-[#202737]'
              }`}
            >
              <span>🇨🇦 Canada</span>
              <span className="opacity-75">({canadaConfigs.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('jobs')}
              className={`px-2.5 py-1.5 rounded-md font-semibold transition-colors shrink-0 cursor-pointer flex items-center gap-1 ${
                activeTab === 'jobs'
                  ? 'bg-[#FF5500] text-white shadow-xs'
                  : 'bg-[#181D29] text-gray-300 hover:text-white hover:bg-[#202737]'
              }`}
            >
              <span>💼 Jobs</span>
              <span className="opacity-75">({jobCats.length})</span>
            </button>
          </div>
        </div>

        {/* Drawer Content */}
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          {/* Australia Section */}
          {(activeTab === 'all' || activeTab === 'australia') && filteredAustralia.length > 0 && (
            <div>
              <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#23252B]">
                <div className="flex items-center gap-2">
                  <span className="text-base">🇦🇺</span>
                  <span className="text-xs font-bold uppercase tracking-wider text-orange-400">
                    Australia Verification Categories
                  </span>
                </div>
                <span className="text-[11px] text-gray-400 bg-[#161B26] px-2 py-0.5 rounded-full font-medium">
                  {filteredAustralia.length}
                </span>
              </div>
              <div className="space-y-2">
                {filteredAustralia.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      onClose();
                      onSelectAustraliaItem?.(item.id);
                    }}
                    className="w-full text-left p-3 rounded-lg bg-[#121622] hover:bg-[#1A2030] border border-[#1E2536] hover:border-[#FF5500]/50 transition-all group cursor-pointer block"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase text-white group-hover:text-[#FF5500] transition-colors">
                        {item.mainTitle}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#FF5500] group-hover:translate-x-0.5 transition-all" />
                    </div>
                    <div className="text-[11px] text-gray-400 mt-1 font-medium">
                      {item.subMenu}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Canada Section */}
          {(activeTab === 'all' || activeTab === 'canada') && filteredCanada.length > 0 && (
            <div>
              <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#23252B]">
                <div className="flex items-center gap-2">
                  <span className="text-base">🇨🇦</span>
                  <span className="text-xs font-bold uppercase tracking-wider text-red-400">
                    Canada Verification Categories
                  </span>
                </div>
                <span className="text-[11px] text-gray-400 bg-[#161B26] px-2 py-0.5 rounded-full font-medium">
                  {filteredCanada.length}
                </span>
              </div>
              <div className="space-y-2">
                {filteredCanada.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      onClose();
                      onSelectCanadaItem(item);
                    }}
                    className="w-full text-left p-3 rounded-lg bg-[#121622] hover:bg-[#1A2030] border border-[#1E2536] hover:border-red-500/50 transition-all group cursor-pointer block"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase text-white group-hover:text-red-400 transition-colors">
                        {item.mainTitle}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-red-400 group-hover:translate-x-0.5 transition-all" />
                    </div>
                    <div className="text-[11px] text-gray-400 mt-1 font-medium">
                      {item.subMenu}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Job Circular Section */}
          {(activeTab === 'all' || activeTab === 'jobs') && filteredJobs.length > 0 && (
            <div>
              <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#23252B]">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-3.5 h-3.5 text-blue-400" />
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                    Job Circular Categories
                  </span>
                </div>
                <span className="text-[11px] text-gray-400 bg-[#161B26] px-2 py-0.5 rounded-full font-medium">
                  {filteredJobs.length}
                </span>
              </div>
              <div className="space-y-2">
                {filteredJobs.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      onClose();
                      onJobCategoryClick?.(cat);
                    }}
                    className="w-full text-left p-3 rounded-lg bg-[#121622] hover:bg-[#1A2030] border border-[#1E2536] hover:border-blue-500/50 transition-all group cursor-pointer block"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase text-white group-hover:text-blue-400 transition-colors">
                        {cat.name}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all" />
                    </div>
                    {cat.description && (
                      <div className="text-[11px] text-gray-400 mt-1 line-clamp-2">
                        {cat.description}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Empty state when search yields no results */}
          {filteredAustralia.length === 0 && filteredCanada.length === 0 && filteredJobs.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <Search className="w-8 h-8 mx-auto text-gray-600 mb-2 opacity-50" />
              <p className="text-sm font-semibold text-gray-300">No categories found</p>
              <p className="text-xs text-gray-500 mt-1">Try another search keyword</p>
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        <div className="px-6 py-4 border-t border-[#23252B] bg-[#0E0F12] flex items-center justify-between text-xs text-gray-500">
          <span>Official Verification & Careers Hub</span>
          <span>© BHP 2026</span>
        </div>
      </div>
    </div>
  );
};
