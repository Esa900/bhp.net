import React, { useState } from 'react';
import { Menu, X, Search, ChevronDown, ArrowRight, Globe, ExternalLink, Mail } from 'lucide-react';
import { useLanguage, Language } from '../context/LanguageContext';
import { useAdminData } from '../context/AdminDataContext';

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
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const { siteSettings } = useAdminData();

  const languages: { id: Language; label: string; flag: string }[] = [
    { id: 'en', label: 'English', flag: 'EN' },
    { id: 'es', label: 'ES | Español', flag: 'ES' },
    { id: 'zh', label: '中文 | Chinese', flag: 'ZH' },
  ];

  const currentLangLabel = languages.find((l) => l.id === language)?.label || 'English';

  const megaMenu = [
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
      title: 'What we do',
      links: [
        { label: 'Copper (তামা)', action: () => onProductClick('copper') },
        { label: 'Iron ore (আকরিক লোহা)', action: () => onProductClick('iron-ore') },
        { label: 'Steelmaking coal (কয়লা)', action: () => onProductClick('steelmaking-coal') },
        { label: 'Potash (পটাশ)', action: () => onProductClick('potash') },
        { label: 'BHP Ventures & BHP Xplor', action: () => onProductClick('copper') },
      ],
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
        <div id="site-announcement-bar" className="bg-[#F25C05] text-white text-xs font-semibold py-2 px-4 text-center flex items-center justify-center gap-2 tracking-wide">
          <span>{siteSettings.announcementText}</span>
        </div>
      )}

      <header id="bhp-header" className="sticky top-0 z-40 bg-[#161718] text-white border-b border-[#2B2C2E] select-none">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-[70px] flex items-center justify-between">
          
          {/* Left: Hamburger Menu */}
          <div className="flex items-center">
            <button
              id="header-menu-button"
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 -ml-2 text-white hover:text-[#F25C05] transition-colors focus:outline-none focus:ring-1 focus:ring-[#F25C05] rounded cursor-pointer"
              aria-label="Open navigation menu"
            >
              <Menu className="w-6 h-6 stroke-[2]" />
            </button>
          </div>

          {/* Center: BHP Wordmark Logo (Home link) */}
          <div className="flex items-center justify-center">
            <button
              id="bhp-home-logo-link"
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex items-center gap-1 group focus:outline-none cursor-pointer"
              aria-label="BHP Home"
            >
              <span className="font-extrabold text-[28px] sm:text-[34px] tracking-tight text-[#F25C05] leading-none transition-transform group-hover:scale-105">
                BHP
              </span>
            </button>
          </div>

          {/* Right: Search, Contact us, Language */}
          <div className="flex items-center gap-3 sm:gap-6 text-sm font-medium">
            <button
              id="header-search-button"
              type="button"
              onClick={onSearchClick}
              className="p-1.5 text-white hover:text-[#F25C05] transition-colors flex items-center gap-1.5 cursor-pointer"
              aria-label="Search BHP"
            >
              <Search className="w-5 h-5 stroke-[2]" />
            </button>


            <button
              id="header-contact-link"
              type="button"
              onClick={onContactClick}
              className="hidden sm:inline-block text-white hover:text-[#F25C05] transition-colors cursor-pointer"
            >
              {t('contactUs')}
            </button>

            {/* Language Selector */}
            <div className="relative">
              <button
                id="header-language-toggle"
                type="button"
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center gap-1 text-white hover:text-[#F25C05] transition-colors py-1 focus:outline-none cursor-pointer text-xs sm:text-sm font-semibold"
              >
                <span>{currentLangLabel}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isLangOpen ? 'rotate-180' : ''}`} />
              </button>

              {isLangOpen && (
                <div
                  id="language-dropdown-menu"
                  className="absolute right-0 mt-2 w-44 bg-[#222428] border border-[#3A3C40] rounded shadow-xl py-1 z-50 animate-in fade-in zoom-in-95 duration-100"
                >
                  {languages.map((lang) => (
                    <button
                      key={lang.id}
                      type="button"
                      onClick={() => {
                        setLanguage(lang.id);
                        setIsLangOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-2 text-xs font-semibold transition-colors flex items-center justify-between cursor-pointer ${
                        language === lang.id
                          ? 'bg-[#F25C05] text-white'
                          : 'text-gray-200 hover:bg-[#2C2E33] hover:text-white'
                      }`}
                    >
                      <span>{lang.label}</span>
                      <span className="text-[10px] uppercase opacity-75 font-mono">{lang.flag}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Slide-out Mega Menu Drawer */}
      {isMenuOpen && (
        <div id="navigation-drawer-backdrop" className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex">
          <div
            id="navigation-drawer-panel"
            className="w-full max-w-[500px] bg-[#161718] text-white h-full flex flex-col shadow-2xl border-r border-[#2C2E33] overflow-y-auto animate-in slide-in-from-left duration-250"
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#2C2E33] sticky top-0 bg-[#161718] z-10">
              <span className="font-extrabold text-2xl tracking-tight text-[#F25C05]">BHP</span>
              <button
                id="close-navigation-drawer"
                type="button"
                onClick={() => setIsMenuOpen(false)}
                className="p-1.5 text-gray-400 hover:text-white transition-colors cursor-pointer"
                aria-label="Close menu"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Drawer Content */}
            <div className="p-6 space-y-6 flex-1">
              <div className="space-y-5">
                {megaMenu.map((sec) => (
                  <div key={sec.title} className="border-b border-[#26282B] pb-3">
                    <h3 className="text-base font-extrabold text-white mb-2 tracking-wide uppercase text-xs text-[#FF8E4D]">
                      {sec.title}
                    </h3>
                    <ul className="space-y-1.5 pl-1">
                      {sec.links.map((item, idx) => (
                        <li key={idx}>
                          <button
                            type="button"
                            onClick={() => {
                              setIsMenuOpen(false);
                              item.action();
                            }}
                            className="text-left w-full text-sm text-gray-300 hover:text-[#F25C05] transition-colors py-1 flex items-center justify-between group cursor-pointer"
                          >
                            <span>{item.label}</span>
                            <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 text-[#F25C05] transition-all" />
                          </button>
                        </li>
                      ))}
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
            <div className="p-6 border-t border-[#26282B] text-xs text-gray-500 bg-[#131415]">
              © BHP 2026. Resources that make the future possible.
            </div>
          </div>

          <div className="flex-1" onClick={() => setIsMenuOpen(false)} />
        </div>
      )}
    </>
  );
};
