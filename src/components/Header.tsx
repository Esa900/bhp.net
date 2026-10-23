import React, { useState, useRef, useEffect } from 'react';
import { Menu, X, Search, ChevronDown, ArrowRight, Globe, ExternalLink, Mail, FileCheck, ShieldCheck, ChevronRight, LogOut, User as UserIcon } from 'lucide-react';
import { useLanguage, Language } from '../context/LanguageContext';
import { useAdminData } from '../context/AdminDataContext';
import { BhpLogo } from './common/BhpLogo';
import { DocumentMenuItem, DOCUMENT_MENU_ITEMS } from '../data/menuNavigationItems';
import { getStoredMenuItems, MENU_ITEMS_UPDATED_EVENT } from '../utils/menuItemsStorage';
import { JobCategory } from '../types/jobCircular';
import { getStoredJobCategories, JOB_CATEGORIES_UPDATED_EVENT } from '../utils/jobCircularStorage';
import { CanadaMenuItemConfig } from '../types/canada';
import { getStoredCanadaMenuConfigs, CANADA_MENU_CONFIGS_UPDATED_EVENT } from '../utils/canadaStorage';
import { AuthUser } from '../types/auth';
import { logoutAuthUser } from '../utils/authStorage';

interface HeaderProps {
  onSearchClick: () => void;
  onContactClick: () => void;
  onCareersClick: () => void;
  onInvestorClick: () => void;
  onSupplierClick: () => void;
  onProductClick: (commodityId: string) => void;
  onLegalClick?: (type: 'code-of-conduct' | 'bhp-foundation') => void;
  onAdminClick?: () => void;
  onPortalClick?: () => void;
  onSelectMenuItem?: (menuItemId: string) => void;
  onSelectCanadaItem?: (config: CanadaMenuItemConfig) => void;
  onJobCategoryClick?: (category: JobCategory) => void;
  currentUser?: AuthUser | null;
}

export const Header: React.FC<HeaderProps> = ({
  onSearchClick,
  onContactClick,
  onCareersClick,
  onInvestorClick,
  onSupplierClick,
  onProductClick,
  onLegalClick,
  onAdminClick,
  onPortalClick,
  onSelectMenuItem,
  onSelectCanadaItem,
  onJobCategoryClick,
  currentUser,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [docMenuItems, setDocMenuItems] = useState<DocumentMenuItem[]>(() => getStoredMenuItems());
  const [canadaMenuItems, setCanadaMenuItems] = useState<CanadaMenuItemConfig[]>(() => getStoredCanadaMenuConfigs());
  const [jobCategories, setJobCategories] = useState<JobCategory[]>(() => getStoredJobCategories());
  const { language, setLanguage, t } = useLanguage();
  const { siteSettings } = useAdminData();

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
      window.removeEventListener('storage', () => {
        handleUpdate();
        handleCanadaUpdate();
        handleJobCatsUpdate();
      });
    };
  }, []);

  const languages: { id: Language; label: string; flag: string }[] = [
    { id: 'en', label: 'English', flag: 'EN' },
    { id: 'bn', label: 'বাংলা | Bengali', flag: 'BN' },
    { id: 'es', label: 'ES | Español', flag: 'ES' },
    { id: 'zh', label: '中文 | Chinese', flag: 'ZH' },
  ];

  const currentLangLabel = languages.find((l) => l.id === language)?.label || 'English';

  const megaMenu = [
    // Dynamic Australia Document Navigation Items (managed via Admin Panel Australia tab)
    ...docMenuItems.map((item) => ({
      title: item.mainTitle,
      links: [
        {
          label: item.subMenu,
          action: () => onSelectMenuItem?.(item.id),
        },
      ],
    })),
    // Dynamic Canada Document Navigation Items (managed via Admin Panel Canada tab)
    ...canadaMenuItems.map((item) => ({
      title: item.mainTitle,
      links: [
        {
          label: item.subMenu,
          action: () => onSelectCanadaItem?.(item),
        },
      ],
    })),
    // Dynamic Job Circular Categories (managed via Admin Panel Job Circular tab)
    {
      title: 'JOB CIRCULAR',
      links: jobCategories.map((cat) => ({
        label: cat.name,
        action: () => onJobCategoryClick?.(cat),
      })),
    },
    {
      title: 'Investor Centre',
      links: [
        { label: 'Reports & presentations', action: onInvestorClick },
        { label: 'Shareholder info / Dividends / Share Price', action: onInvestorClick },
        { label: 'Financial Calendar', action: onInvestorClick },
        { label: 'Market announcements & Debt investors', action: onInvestorClick },
      ],
    },
    {
      title: 'Sustainability',
      links: [
        { label: 'Climate change & Net zero transition', action: () => { const el = document.getElementById('bento-grid-section'); el?.scrollIntoView({ behavior: 'smooth' }); } },
        { label: 'Nature & environmental performance', action: () => { const el = document.getElementById('bento-grid-section'); el?.scrollIntoView({ behavior: 'smooth' }); } },
        { label: 'People, Safety and health', action: () => { const el = document.getElementById('ceo-quote-section'); el?.scrollIntoView({ behavior: 'smooth' }); } },
        { label: 'BHP Foundation', action: () => onLegalClick?.('bhp-foundation') },
      ],
    },
    {
      title: 'Careers',
      links: [
        { label: 'Global careers / Find opportunities', action: onCareersClick },
        { label: 'Graduate and student programs', action: onCareersClick },
        { label: 'Life at BHP / Inclusion & diversity', action: onCareersClick },
      ],
    },
    {
      title: 'News & Publications',
      links: [
        { label: 'News & publication library', action: () => { const el = document.getElementById('latest-news-section'); el?.scrollIntoView({ behavior: 'smooth' }); } },
        { label: 'Image gallery & multimedia', action: () => { const el = document.getElementById('latest-news-section'); el?.scrollIntoView({ behavior: 'smooth' }); } },
        { label: 'BHP Insights', action: () => { const el = document.getElementById('latest-reports-section'); el?.scrollIntoView({ behavior: 'smooth' }); } },
      ],
    },
    {
      title: 'Suppliers',
      links: [
        { label: 'Become a supplier / Find opportunities', action: onSupplierClick },
        { label: 'Local Buying Program (LBP)', action: onSupplierClick },
      ],
    },
    {
      title: 'About Us',
      links: [
        { label: 'Why our work matters', action: () => { const el = document.getElementById('bento-grid-section'); el?.scrollIntoView({ behavior: 'smooth' }); } },
        { label: 'Our future & strategy', action: () => { const el = document.getElementById('hero-banner-section'); el?.scrollIntoView({ behavior: 'smooth' }); } },
        { label: 'Our history', action: () => { const el = document.getElementById('bento-grid-section'); el?.scrollIntoView({ behavior: 'smooth' }); } },
        { label: 'Operating ethically / Our code', action: () => onLegalClick?.('code-of-conduct') },
        { label: 'Board & management / Governance', action: onInvestorClick },
        { label: 'Global locations / Where we operate', action: () => { const el = document.getElementById('where-we-operate-card'); el?.scrollIntoView({ behavior: 'smooth' }); } },
      ],
    },
    {
      title: 'Governance & Administration',
      links: [
        { label: 'Board & management / Governance', action: onInvestorClick },
        { label: 'Operating ethically / Our code', action: () => onLegalClick?.('code-of-conduct') },
      ],
    },
  ];

  return (
    <>
      {/* Real-time Dynamic Announcement Bar (if enabled in Admin Panel) */}
      {siteSettings?.announcementEnabled && siteSettings?.announcementText && (
        <div id="site-announcement-bar" className="bg-gradient-to-r from-[#E63B00] via-[#FF5500] to-[#FF771C] text-white text-xs font-semibold py-2 px-4 text-center flex items-center justify-center gap-2 tracking-wide shadow-xs">
          <span>{siteSettings.announcementText}</span>
        </div>
      )}

      <header id="bhp-header" className="sticky top-0 z-40 bg-[#0B0E14] text-white border-b border-[#1E232E] shadow-lg shadow-black/20 select-none backdrop-blur-md">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-[72px] flex items-center justify-between">
          
          {/* Left: Hamburger Menu and Desktop Document Navigation Dropdown */}
          <div className="flex items-center gap-3">
            <button
              id="header-menu-button"
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 -ml-2 text-gray-200 hover:text-[#FF5500] hover:bg-[#161B26] transition-colors focus:outline-none focus:ring-1 focus:ring-[#FF5500] rounded-lg cursor-pointer"
              aria-label="Open navigation menu"
            >
              <Menu className="w-6 h-6 stroke-[2]" />
            </button>
          </div>

          {/* Center: BHP Redesigned Modern Logo (Home link) */}
          <div className="flex items-center justify-center">
            <button
              id="bhp-home-logo-link"
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex items-center gap-1 group focus:outline-none cursor-pointer py-1"
              aria-label="BHP Home"
            >
              <BhpLogo size="md" showTagline={false} />
            </button>
          </div>

          {/* Right: Search, Contact us, Language */}
          <div className="flex items-center gap-3 sm:gap-6 text-sm font-medium">
            <button
              id="header-search-button"
              type="button"
              onClick={onSearchClick}
              className="p-1.5 text-gray-200 hover:text-[#FF5500] hover:bg-[#161B26] rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
              aria-label="Search BHP"
            >
              <Search className="w-5 h-5 stroke-[2]" />
            </button>


            <button
              id="header-contact-link"
              type="button"
              onClick={onContactClick}
              className="hidden sm:inline-block text-gray-200 hover:text-[#FF5500] transition-colors cursor-pointer font-semibold"
            >
              {t('contactUs')}
            </button>

            {/* Language Selector */}
            <div className="relative">
              <button
                id="header-language-toggle"
                type="button"
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center gap-1 text-gray-200 hover:text-[#FF5500] transition-colors py-1 focus:outline-none cursor-pointer text-xs sm:text-sm font-semibold"
              >
                <span>{currentLangLabel}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isLangOpen ? 'rotate-180' : ''}`} />
              </button>

              {isLangOpen && (
                <div
                  id="language-dropdown-menu"
                  className="absolute right-0 mt-2 w-48 bg-[#141822] border border-[#232938] rounded-xl shadow-2xl py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100"
                >
                  {languages.map((lang) => (
                    <button
                      key={lang.id}
                      type="button"
                      onClick={() => {
                        setLanguage(lang.id);
                        setIsLangOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-xs font-semibold transition-colors flex items-center justify-between cursor-pointer ${
                        language === lang.id
                          ? 'bg-gradient-to-r from-[#FF5500] to-[#E64200] text-white shadow-xs'
                          : 'text-gray-300 hover:bg-[#1E2332] hover:text-white'
                      }`}
                    >
                      <span>{lang.label}</span>
                      <span className="text-[10px] uppercase opacity-75 font-mono">{lang.flag}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Authenticated User Session Profile & Logout */}
            {currentUser && (
              <div className="flex items-center gap-2 pl-2 border-l border-white/20">
                <div className="flex items-center gap-1.5 bg-[#222428] px-2.5 py-1 rounded-full border border-[#3A3C40] text-xs">
                  <div className="w-5 h-5 rounded-full bg-gradient-to-r from-[#6b47ff] to-[#9962ff] flex items-center justify-center text-white font-bold text-[10px]">
                    {currentUser.username.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-white font-semibold max-w-[85px] truncate">
                    {currentUser.username}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => logoutAuthUser()}
                  className="p-1.5 text-gray-400 hover:text-red-400 transition-colors cursor-pointer rounded-lg hover:bg-red-500/10"
                  title="Logout from website"
                  aria-label="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Slide-out Mega Menu Drawer */}
      {isMenuOpen && (
        <div id="navigation-drawer-backdrop" className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex">
          <div
            id="navigation-drawer-panel"
            className="w-full max-w-[500px] bg-[#0B0E14] text-white h-full flex flex-col shadow-2xl border-r border-[#1E232E] overflow-y-auto animate-in slide-in-from-left duration-250"
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#1E232E] sticky top-0 bg-[#0B0E14] z-10">
              <BhpLogo size="sm" showTagline={false} />
              <button
                id="close-navigation-drawer"
                type="button"
                onClick={() => setIsMenuOpen(false)}
                className="p-1.5 text-gray-400 hover:text-white hover:bg-[#161B26] rounded-lg transition-colors cursor-pointer"
                aria-label="Close menu"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Drawer Content */}
            <div className="p-6 space-y-6 flex-1">
              <div className="space-y-5">
                {megaMenu.map((sec, secIdx) => (
                  <div key={sec.title} className="border-b border-[#23252B] pb-3.5 group">
                    {sec.title === 'JOB CIRCULAR' ? (
                      <button
                        type="button"
                        onClick={() => {
                          setIsMenuOpen(false);
                          if (jobCategories.length > 0) {
                            onJobCategoryClick?.(jobCategories[0]);
                          }
                        }}
                        className="text-[13px] sm:text-[14px] font-black tracking-wide uppercase text-white hover:text-[#F25C05] transition-colors mb-1.5 flex items-center justify-between w-full cursor-pointer text-left"
                      >
                        <span>{sec.title}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-[#F25C05]" />
                      </button>
                    ) : (
                      <h3 className="text-[13px] sm:text-[14px] font-black tracking-wide uppercase text-white mb-1.5">
                        {sec.title}
                      </h3>
                    )}
                    <ul className="space-y-1.5">
                      {sec.links.map((item, idx) => {
                        const isFirst = secIdx === 0 && idx === 0;
                        return (
                          <li key={idx}>
                            <button
                              type="button"
                              onClick={() => {
                                setIsMenuOpen(false);
                                item.action();
                              }}
                              className={`text-left w-full text-[13px] sm:text-[14px] font-medium transition-colors py-1 flex items-center justify-between cursor-pointer ${
                                isFirst
                                  ? 'text-[#F25C05] hover:text-[#ff7426]'
                                  : 'text-[#9ca3af] hover:text-[#F25C05]'
                              }`}
                            >
                              <span>{item.label}</span>
                              <ArrowRight
                                className={`w-3.5 h-3.5 transition-all duration-150 ${
                                  isFirst
                                    ? 'text-[#F25C05] opacity-100'
                                    : 'opacity-0 group-hover:opacity-100 group-hover:translate-x-1 text-[#F25C05]'
                                }`}
                              />
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Direct Quick Shortcuts */}
              <div className="pt-2 text-xs text-gray-400 space-y-2">
                <div className="font-semibold uppercase tracking-wider text-gray-300">Fast Access</div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsMenuOpen(false);
                      onInvestorClick();
                    }}
                    className="p-2.5 bg-[#222428] rounded hover:bg-[#2A2D33] text-gray-200 transition-colors flex items-center justify-between text-left cursor-pointer"
                  >
                    <span>ASX Stock Hub</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#F25C05]" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsMenuOpen(false);
                      onContactClick();
                    }}
                    className="p-2.5 bg-[#222428] rounded hover:bg-[#2A2D33] text-gray-200 transition-colors flex items-center justify-between text-left cursor-pointer"
                  >
                    <span>Contact Inquiry</span>
                    <Mail className="w-3.5 h-3.5 text-[#F25C05]" />
                  </button>
                </div>
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="p-6 border-t border-[#26282B] text-xs text-gray-400 bg-[#131415] flex items-center justify-between">
              <div>© BHP 2026. Official Portal.</div>
              {currentUser && (
                <button
                  type="button"
                  onClick={() => {
                    setIsMenuOpen(false);
                    logoutAuthUser();
                  }}
                  className="flex items-center gap-1.5 text-red-400 hover:text-red-300 font-semibold transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Log Out ({currentUser.username})</span>
                </button>
              )}
            </div>
          </div>

          <div className="flex-1" onClick={() => setIsMenuOpen(false)} />
        </div>
      )}
    </>
  );
};
