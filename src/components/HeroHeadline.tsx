import React, { useState, useEffect } from 'react';
import { ArrowRight, FileCheck, Briefcase, ChevronRight, Sparkles, Search } from 'lucide-react';
import { DocumentMenuItem } from '../data/menuNavigationItems';
import { getStoredMenuItems, MENU_ITEMS_UPDATED_EVENT } from '../utils/menuItemsStorage';
import { CanadaMenuItemConfig } from '../types/canada';
import { getStoredCanadaMenuConfigs, CANADA_MENU_CONFIGS_UPDATED_EVENT } from '../utils/canadaStorage';
import { JobCategory } from '../types/jobCircular';
import { getStoredJobCategories, JOB_CATEGORIES_UPDATED_EVENT } from '../utils/jobCircularStorage';

interface HeroHeadlineProps {
  onOpenRightMenu?: () => void;
  onSelectAustraliaItem?: (menuItemId: string) => void;
  onSelectCanadaItem?: (config: CanadaMenuItemConfig) => void;
  onJobCategoryClick?: (category: JobCategory) => void;
}

export const HeroHeadline: React.FC<HeroHeadlineProps> = ({
  onOpenRightMenu,
  onSelectAustraliaItem,
  onSelectCanadaItem,
  onJobCategoryClick,
}) => {
  const [activeCategoryTab, setActiveCategoryTab] = useState<'all' | 'jobs' | 'australia' | 'canada'>('all');
  const [docMenuItems, setDocMenuItems] = useState<DocumentMenuItem[]>(() => getStoredMenuItems());
  const [canadaMenuItems, setCanadaMenuItems] = useState<CanadaMenuItemConfig[]>(() => getStoredCanadaMenuConfigs());
  const [jobCategories, setJobCategories] = useState<JobCategory[]>(() => getStoredJobCategories());

  useEffect(() => {
    const handleUpdate = () => {
      setDocMenuItems(getStoredMenuItems());
    };
    const handleCanadaUpdate = () => {
      setCanadaMenuItems(getStoredCanadaMenuConfigs());
    };
    const handleJobCatsUpdate = () => {
      setJobCategories(getStoredJobCategories());
    };

    window.addEventListener(MENU_ITEMS_UPDATED_EVENT, handleUpdate);
    window.addEventListener(CANADA_MENU_CONFIGS_UPDATED_EVENT, handleCanadaUpdate);
    window.addEventListener(JOB_CATEGORIES_UPDATED_EVENT, handleJobCatsUpdate);
    window.addEventListener('storage', () => {
      handleUpdate();
      handleCanadaUpdate();
      handleJobCatsUpdate();
    });

    return () => {
      window.removeEventListener(MENU_ITEMS_UPDATED_EVENT, handleUpdate);
      window.removeEventListener(CANADA_MENU_CONFIGS_UPDATED_EVENT, handleCanadaUpdate);
      window.removeEventListener(JOB_CATEGORIES_UPDATED_EVENT, handleJobCatsUpdate);
    };
  }, []);

  const totalCategories = docMenuItems.length + canadaMenuItems.length + jobCategories.length;

  return (
    <section id="hero-headline-section" className="bg-[#F8FAFC] pt-4 sm:pt-6 pb-10 border-b border-slate-200/80">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top-right 3-line option directly below the language dropdown in the header */}
        <div className="flex justify-end mb-3 sm:mb-4">
          <button
            id="hero-right-three-line-button"
            type="button"
            onClick={onOpenRightMenu}
            className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-white border border-slate-200 hover:border-[#FF5500] shadow-xs hover:shadow-lg hover:shadow-orange-500/10 transition-all cursor-pointer group"
            aria-label="Open 3-line options menu"
            title="Options Menu"
          >
            <div className="flex flex-col justify-center gap-[3.5px] w-5 h-4">
              <span className="w-5 h-[2.5px] bg-[#0A0D14] group-hover:bg-[#FF5500] rounded-full transition-colors"></span>
              <span className="w-5 h-[2.5px] bg-[#0A0D14] group-hover:bg-[#FF5500] rounded-full transition-colors"></span>
              <span className="w-5 h-[2.5px] bg-[#0A0D14] group-hover:bg-[#FF5500] rounded-full transition-colors"></span>
            </div>
            <span className="text-xs font-bold text-[#0A0D14] group-hover:text-[#FF5500] transition-colors tracking-wide">
              Menu ({totalCategories})
            </span>
          </button>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          {/* Main Titles */}
          <div className="max-w-4xl">
            <h1
              id="hero-main-title"
              className="text-[34px] sm:text-[46px] lg:text-[54px] font-extrabold text-[#0A0D14] tracking-[-0.035em] leading-[1.06]"
            >
              Building what’s next is what BHP does best.
            </h1>
            <p
              id="hero-main-subtitle"
              className="mt-3 text-lg sm:text-xl text-[#475569] font-normal leading-relaxed"
            >
              Resources that make the future possible.
            </p>
          </div>

          {/* Right Action Link */}
          <div className="shrink-0 pb-1">
            <a
              id="hero-find-out-more-link"
              href="#positioning"
              className="inline-flex items-center gap-2 text-base font-bold text-[#0A0D14] hover:text-[#FF5500] transition-colors group"
            >
              <span>Find out more</span>
              <div className="w-8 h-8 rounded-full bg-orange-50 group-hover:bg-[#FF5500] flex items-center justify-center transition-colors">
                <ArrowRight className="w-4 h-4 text-[#FF5500] group-hover:text-white group-hover:translate-x-0.5 transition-all" />
              </div>
            </a>
          </div>
        </div>

        {/* Live Admin Categories Showcase Bar */}
        <div className="mt-8 bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FF5500] animate-pulse"></span>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Official Verification & Circular Categories
              </span>
              <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                {totalCategories} Active
              </span>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto text-xs pb-1 sm:pb-0">
              <button
                type="button"
                onClick={() => setActiveCategoryTab('all')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  activeCategoryTab === 'all'
                    ? 'bg-[#0B0E14] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                All ({totalCategories})
              </button>
              <button
                type="button"
                onClick={() => setActiveCategoryTab('jobs')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  activeCategoryTab === 'jobs'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                }`}
              >
                <Briefcase className="w-3 h-3" />
                <span>Job Circular ({jobCategories.length})</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveCategoryTab('australia')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  activeCategoryTab === 'australia'
                    ? 'bg-orange-600 text-white shadow-xs'
                    : 'bg-orange-50 text-orange-700 hover:bg-orange-100'
                }`}
              >
                <span>🇦🇺 Australia ({docMenuItems.length})</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveCategoryTab('canada')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  activeCategoryTab === 'canada'
                    ? 'bg-red-600 text-white shadow-xs'
                    : 'bg-red-50 text-red-700 hover:bg-red-100'
                }`}
              >
                <span>🇨🇦 Canada ({canadaMenuItems.length})</span>
              </button>
            </div>
          </div>

          {/* Category Cards Carousel / Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 mt-4">
            {/* Job Circular Categories */}
            {(activeCategoryTab === 'all' || activeCategoryTab === 'jobs') &&
              jobCategories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => onJobCategoryClick?.(cat)}
                  className="p-3.5 rounded-xl border border-blue-100 bg-gradient-to-br from-blue-50/60 to-white hover:border-blue-400 hover:shadow-md transition-all text-left flex flex-col justify-between group cursor-pointer"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-100 px-2 py-0.5 rounded-md">
                        💼 Job Circular
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-blue-500 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-700 transition-colors uppercase mt-1">
                      {cat.name}
                    </h4>
                    {cat.description && (
                      <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                        {cat.description}
                      </p>
                    )}
                  </div>
                  <div className="text-[11px] font-semibold text-blue-600 mt-2 flex items-center gap-1">
                    <span>View Circulars</span>
                    <ChevronRight className="w-3 h-3" />
                  </div>
                </button>
              ))}

            {/* Australia Categories */}
            {(activeCategoryTab === 'all' || activeCategoryTab === 'australia') &&
              docMenuItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSelectAustraliaItem?.(item.id)}
                  className="p-3.5 rounded-xl border border-orange-100 bg-gradient-to-br from-orange-50/60 to-white hover:border-orange-400 hover:shadow-md transition-all text-left flex flex-col justify-between group cursor-pointer"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#E63B00] bg-orange-100 px-2 py-0.5 rounded-md">
                        🇦🇺 Australia
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#E63B00] opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 group-hover:text-[#E63B00] transition-colors uppercase mt-1">
                      {item.mainTitle}
                    </h4>
                    <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                      {item.subMenu}
                    </p>
                  </div>
                  <div className="text-[11px] font-semibold text-[#E63B00] mt-2 flex items-center gap-1">
                    <span>Verify & Search</span>
                    <ChevronRight className="w-3 h-3" />
                  </div>
                </button>
              ))}

            {/* Canada Categories */}
            {(activeCategoryTab === 'all' || activeCategoryTab === 'canada') &&
              canadaMenuItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSelectCanadaItem?.(item)}
                  className="p-3.5 rounded-xl border border-red-100 bg-gradient-to-br from-red-50/60 to-white hover:border-red-400 hover:shadow-md transition-all text-left flex flex-col justify-between group cursor-pointer"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-red-700 bg-red-100 px-2 py-0.5 rounded-md">
                        🇨🇦 Canada
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-red-600 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 group-hover:text-red-700 transition-colors uppercase mt-1">
                      {item.mainTitle}
                    </h4>
                    <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                      {item.subMenu}
                    </p>
                  </div>
                  <div className="text-[11px] font-semibold text-red-600 mt-2 flex items-center gap-1">
                    <span>Verify & Search</span>
                    <ChevronRight className="w-3 h-3" />
                  </div>
                </button>
              ))}
          </div>
        </div>
      </div>
    </section>
  );
};
