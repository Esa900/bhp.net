import React, { useState } from 'react';
import {
  Menu,
  X,
  Search,
  ChevronDown,
  ChevronRight,
  ArrowRight,
  Globe,
  ExternalLink,
  Mail,
  ShieldCheck,
  FileCheck,
  Briefcase,
  FileText,
  Scale,
  Award,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { useLanguage, Language } from '../context/LanguageContext';
import { useAdminData } from '../context/AdminDataContext';
import { DocumentType } from '../types/portal';

interface HeaderProps {
  onSearchClick: () => void;
  onContactClick: () => void;
  onCareersClick: () => void;
  onInvestorClick: () => void;
  onSupplierClick: () => void;
  onProductClick: (commodityId: string) => void;
  onLegalClick?: (type: 'code-of-conduct' | 'bhp-foundation') => void;
  onAdminClick?: () => void;
  onPortalClick?: (target?: DocumentType | 'positive-list') => void;
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
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [openCategory, setOpenCategory] = useState<'app-job' | 'legal-tax' | 'insurance-visa' | null>('app-job');
  const { language, setLanguage, t } = useLanguage();
  const { siteSettings } = useAdminData();

  const toggleCategory = (cat: 'app-job' | 'legal-tax' | 'insurance-visa') => {
    setOpenCategory((prev) => (prev === cat ? null : cat));
  };

  const handleDocumentClick = (docType: DocumentType) => {
    setIsMenuOpen(false);
    if (onPortalClick) {
      onPortalClick(docType);
    }
  };

  const handlePositiveListClick = () => {
    setIsMenuOpen(false);
    if (onPortalClick) {
      onPortalClick('positive-list');
    }
  };

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
            <div className="p-5 space-y-6 flex-1">
              {/* Australian ImmiAccount & BHP Verification Sections */}
              <div className="space-y-3 pb-4 border-b border-[#2C2E33]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#FFCD00]" />
                    <span className="text-xs font-black uppercase tracking-wider text-[#FFCD00]">
                      Document Verification
                    </span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#002B49] text-[#90CDF4] border border-[#0A4A7A]">
                    DVS Services
                  </span>
                </div>

                {/* Category 1: Application & Job Verification */}
                <div className="rounded-lg border border-[#2A3B4C] bg-[#1A222B] overflow-hidden transition-all">
                  <button
                    type="button"
                    onClick={() => toggleCategory('app-job')}
                    className="w-full px-3.5 py-3 text-left flex items-center justify-between gap-2 hover:bg-[#202B37] transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded bg-[#002B49] border border-[#194D74] flex items-center justify-center text-[#FFCD00] shrink-0">
                        <Briefcase className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white flex items-center gap-1.5">
                          <span>Application & Job Verification</span>
                          <span className="text-[10px] bg-[#002B49] text-[#90CDF4] px-1.5 py-0.2 rounded font-mono">4</span>
                        </div>
                        <div className="text-[10px] text-gray-400">দরখাস্ত ও নিয়োগ অনুমোদন যাচাইকরণ</div>
                      </div>
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                        openCategory === 'app-job' ? 'rotate-180 text-[#FFCD00]' : ''
                      }`}
                    />
                  </button>

                  {openCategory === 'app-job' && (
                    <div className="px-3 pb-3 pt-1 space-y-1.5 bg-[#141A21] border-t border-[#2A3B4C]/60 animate-in fade-in duration-150">
                      {/* 1. View Application Form */}
                      <button
                        type="button"
                        onClick={() => handleDocumentClick('application-form')}
                        className="w-full text-left p-2.5 rounded hover:bg-[#1E2833] border border-transparent hover:border-[#2C3E50] transition-colors group cursor-pointer"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-start gap-2">
                            <FileText className="w-3.5 h-3.5 text-[#FF8E4D] shrink-0 mt-0.5" />
                            <div>
                              <div className="text-xs font-semibold text-gray-200 group-hover:text-white flex items-center gap-1.5 flex-wrap">
                                <span>View Application Form</span>
                                <span className="text-[9px] bg-amber-950/80 text-amber-300 border border-amber-700/60 px-1 rounded font-medium">
                                  রেফারেন্স নম্বর লাগবে
                                </span>
                              </div>
                              <p className="text-[11px] text-gray-400 mt-0.5 leading-snug">
                                Form 1419 বায়োমেট্রিক ও পাসপোর্ট যাচাইকরণ
                              </p>
                            </div>
                          </div>
                          <ArrowRight className="w-3 h-3 text-gray-500 group-hover:text-[#FF8E4D] group-hover:translate-x-0.5 transition-all shrink-0 mt-1" />
                        </div>
                      </button>

                      {/* 2. View Job Acceptance Letter */}
                      <button
                        type="button"
                        onClick={() => handleDocumentClick('job-acceptance')}
                        className="w-full text-left p-2.5 rounded hover:bg-[#1E2833] border border-transparent hover:border-[#2C3E50] transition-colors group cursor-pointer"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-start gap-2">
                            <FileCheck className="w-3.5 h-3.5 text-[#63B3ED] shrink-0 mt-0.5" />
                            <div>
                              <div className="text-xs font-semibold text-gray-200 group-hover:text-white flex items-center gap-1.5 flex-wrap">
                                <span>View Job Acceptance Letter</span>
                                <span className="text-[9px] bg-blue-950/80 text-blue-300 border border-blue-700/60 px-1 rounded font-medium">
                                  ED নম্বর লাগবে
                                </span>
                              </div>
                              <p className="text-[11px] text-gray-400 mt-0.5 leading-snug">
                                মনোনীত পদে নিয়োগপত্র গ্রহণের অফিসিয়াল চিঠি
                              </p>
                            </div>
                          </div>
                          <ArrowRight className="w-3 h-3 text-gray-500 group-hover:text-[#63B3ED] group-hover:translate-x-0.5 transition-all shrink-0 mt-1" />
                        </div>
                      </button>

                      {/* 3. Employment Offer Letter */}
                      <button
                        type="button"
                        onClick={() => handleDocumentClick('employment-offer')}
                        className="w-full text-left p-2.5 rounded hover:bg-[#1E2833] border border-transparent hover:border-[#2C3E50] transition-colors group cursor-pointer"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-start gap-2">
                            <Briefcase className="w-3.5 h-3.5 text-[#68D391] shrink-0 mt-0.5" />
                            <div>
                              <div className="text-xs font-semibold text-gray-200 group-hover:text-white">
                                Employment Offer Letter
                              </div>
                              <p className="text-[11px] text-gray-400 mt-0.5 leading-snug">
                                চুক্তি, বেতন কাঠামো ও সুপারঅ্যানুয়েশন বিবরণ
                              </p>
                            </div>
                          </div>
                          <ArrowRight className="w-3 h-3 text-gray-500 group-hover:text-[#68D391] group-hover:translate-x-0.5 transition-all shrink-0 mt-1" />
                        </div>
                      </button>

                      {/* 4. Job Confirmation Letter */}
                      <button
                        type="button"
                        onClick={() => handleDocumentClick('job-confirmation')}
                        className="w-full text-left p-2.5 rounded hover:bg-[#1E2833] border border-transparent hover:border-[#2C3E50] transition-colors group cursor-pointer"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-start gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#F6AD55] shrink-0 mt-0.5" />
                            <div>
                              <div className="text-xs font-semibold text-gray-200 group-hover:text-white">
                                Job Confirmation Letter
                              </div>
                              <p className="text-[11px] text-gray-400 mt-0.5 leading-snug">
                                স্পনসরশিপ ও নিয়োগ অনুমোদনের আনুষ্ঠানিক দলিল
                              </p>
                            </div>
                          </div>
                          <ArrowRight className="w-3 h-3 text-gray-500 group-hover:text-[#F6AD55] group-hover:translate-x-0.5 transition-all shrink-0 mt-1" />
                        </div>
                      </button>
                    </div>
                  )}
                </div>

                {/* Category 2: Row 2: Legal, Tax & Work Permits */}
                <div className="rounded-lg border border-[#2A3B4C] bg-[#1A222B] overflow-hidden transition-all">
                  <button
                    type="button"
                    onClick={() => toggleCategory('legal-tax')}
                    className="w-full px-3.5 py-3 text-left flex items-center justify-between gap-2 hover:bg-[#202B37] transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded bg-[#2D2305] border border-[#8C6D1F] flex items-center justify-center text-[#FFCD00] shrink-0">
                        <Scale className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white flex items-center gap-1.5">
                          <span>Row 2: Legal, Tax & Work Permits</span>
                          <span className="text-[10px] bg-[#3B2D05] text-[#FFD700] px-1.5 py-0.2 rounded font-mono">4</span>
                        </div>
                        <div className="text-[10px] text-gray-400">আইনগত, ট্যাক্স ও ওয়ার্ক পারমিট</div>
                      </div>
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                        openCategory === 'legal-tax' ? 'rotate-180 text-[#FFCD00]' : ''
                      }`}
                    />
                  </button>

                  {openCategory === 'legal-tax' && (
                    <div className="px-3 pb-3 pt-1 space-y-1.5 bg-[#141A21] border-t border-[#2A3B4C]/60 animate-in fade-in duration-150">
                      {/* 1. View Work Permit */}
                      <button
                        type="button"
                        onClick={() => handleDocumentClick('work-permit')}
                        className="w-full text-left p-2.5 rounded hover:bg-[#1E2833] border border-transparent hover:border-[#2C3E50] transition-colors group cursor-pointer"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-start gap-2">
                            <ShieldCheck className="w-3.5 h-3.5 text-[#38B2AC] shrink-0 mt-0.5" />
                            <div>
                              <div className="text-xs font-semibold text-gray-200 group-hover:text-white">
                                View Work Permit
                              </div>
                              <p className="text-[11px] text-gray-400 mt-0.5 leading-snug">
                                অস্ট্রেলিয়া সরকারের অফিসিয়াল কাজের অনুমতিপত্র (Condition 8107)
                              </p>
                            </div>
                          </div>
                          <ArrowRight className="w-3 h-3 text-gray-500 group-hover:text-[#38B2AC] group-hover:translate-x-0.5 transition-all shrink-0 mt-1" />
                        </div>
                      </button>

                      {/* 2. View Income Tax Returned Certificate */}
                      <button
                        type="button"
                        onClick={() => handleDocumentClick('income-tax')}
                        className="w-full text-left p-2.5 rounded hover:bg-[#1E2833] border border-transparent hover:border-[#2C3E50] transition-colors group cursor-pointer"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-start gap-2">
                            <FileText className="w-3.5 h-3.5 text-[#4FD1C5] shrink-0 mt-0.5" />
                            <div>
                              <div className="text-xs font-semibold text-gray-200 group-hover:text-white">
                                View Income Tax Returned Certificate
                              </div>
                              <p className="text-[11px] text-gray-400 mt-0.5 leading-snug">
                                ATO অ্যাসেসমেন্ট ও PAYG উইথহোল্ডিং সনদ
                              </p>
                            </div>
                          </div>
                          <ArrowRight className="w-3 h-3 text-gray-500 group-hover:text-[#4FD1C5] group-hover:translate-x-0.5 transition-all shrink-0 mt-1" />
                        </div>
                      </button>

                      {/* 3. View Tax Returned Certificate */}
                      <button
                        type="button"
                        onClick={() => handleDocumentClick('tax-certificate')}
                        className="w-full text-left p-2.5 rounded hover:bg-[#1E2833] border border-transparent hover:border-[#2C3E50] transition-colors group cursor-pointer"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-start gap-2">
                            <FileCheck className="w-3.5 h-3.5 text-[#81E6D9] shrink-0 mt-0.5" />
                            <div>
                              <div className="text-xs font-semibold text-gray-200 group-hover:text-white">
                                View Tax Returned Certificate
                              </div>
                              <p className="text-[11px] text-gray-400 mt-0.5 leading-snug">
                                ট্যাক্স রিটার্ন কমপ্লায়েন্স স্টেটমেন্ট
                              </p>
                            </div>
                          </div>
                          <ArrowRight className="w-3 h-3 text-gray-500 group-hover:text-[#81E6D9] group-hover:translate-x-0.5 transition-all shrink-0 mt-1" />
                        </div>
                      </button>

                      {/* 4. Positive List for Skilled Work (গোল্ড ব্যাজযুক্ত) */}
                      <button
                        type="button"
                        onClick={handlePositiveListClick}
                        className="w-full text-left p-2.5 rounded bg-linear-to-r from-[#241F0A] to-[#1E1A0A] hover:from-[#352D0F] hover:to-[#2B230B] border border-[#B7791F]/60 transition-all group cursor-pointer shadow-xs"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-start gap-2">
                            <Award className="w-3.5 h-3.5 text-[#ECC94B] shrink-0 mt-0.5" />
                            <div>
                              <div className="text-xs font-bold text-[#F6E05E] flex items-center gap-1.5 flex-wrap">
                                <span>Positive List for Skilled Work</span>
                                <span className="inline-flex items-center gap-1 text-[9px] bg-[#744210] text-[#FEFCBF] border border-[#D69E2E] px-1.5 py-0.2 rounded font-bold shadow-xs">
                                  <Sparkles className="w-2.5 h-2.5 text-[#ECC94B]" />
                                  গোল্ড ব্যাজযুক্ত
                                </span>
                              </div>
                              <p className="text-[11px] text-amber-200/80 mt-0.5 leading-snug">
                                সরাসরি ক্লিক করে সম্পূর্ণ PMSOL ও MLTSSL স্কিলড তালিকা দেখার সুবিধা
                              </p>
                            </div>
                          </div>
                          <ArrowRight className="w-3 h-3 text-[#ECC94B] group-hover:translate-x-0.5 transition-all shrink-0 mt-1" />
                        </div>
                      </button>
                    </div>
                  )}
                </div>

                {/* Category 3: Row 3: Insurance & Visa Status Verification */}
                <div className="rounded-lg border border-[#2A3B4C] bg-[#1A222B] overflow-hidden transition-all">
                  <button
                    type="button"
                    onClick={() => toggleCategory('insurance-visa')}
                    className="w-full px-3.5 py-3 text-left flex items-center justify-between gap-2 hover:bg-[#202B37] transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded bg-[#102B1D] border border-[#22543D] flex items-center justify-center text-[#48BB78] shrink-0">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white flex items-center gap-1.5">
                          <span>Row 3: Insurance & Visa Status Verification</span>
                          <span className="text-[10px] bg-[#1C4532] text-[#9AE6B4] px-1.5 py-0.2 rounded font-mono">5</span>
                        </div>
                        <div className="text-[10px] text-gray-400">বীমা ও ভিসা স্ট্যাটাস যাচাইকরণ</div>
                      </div>
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                        openCategory === 'insurance-visa' ? 'rotate-180 text-[#FFCD00]' : ''
                      }`}
                    />
                  </button>

                  {openCategory === 'insurance-visa' && (
                    <div className="px-3 pb-3 pt-1 space-y-1.5 bg-[#141A21] border-t border-[#2A3B4C]/60 animate-in fade-in duration-150">
                      {/* 1. View Insurance Paper */}
                      <button
                        type="button"
                        onClick={() => handleDocumentClick('insurance-paper')}
                        className="w-full text-left p-2.5 rounded hover:bg-[#1E2833] border border-transparent hover:border-[#2C3E50] transition-colors group cursor-pointer"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-start gap-2">
                            <ShieldCheck className="w-3.5 h-3.5 text-[#48BB78] shrink-0 mt-0.5" />
                            <div>
                              <div className="text-xs font-semibold text-gray-200 group-hover:text-white">
                                View Insurance Paper
                              </div>
                              <p className="text-[11px] text-gray-400 mt-0.5 leading-snug">
                                ওভারসিজ ভিজিটর হেলথ কভার (OVHC) পলিসি
                              </p>
                            </div>
                          </div>
                          <ArrowRight className="w-3 h-3 text-gray-500 group-hover:text-[#48BB78] group-hover:translate-x-0.5 transition-all shrink-0 mt-1" />
                        </div>
                      </button>

                      {/* 2. View Travel Insurance Letter */}
                      <button
                        type="button"
                        onClick={() => handleDocumentClick('travel-insurance')}
                        className="w-full text-left p-2.5 rounded hover:bg-[#1E2833] border border-transparent hover:border-[#2C3E50] transition-colors group cursor-pointer"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-start gap-2">
                            <FileText className="w-3.5 h-3.5 text-[#68D391] shrink-0 mt-0.5" />
                            <div>
                              <div className="text-xs font-semibold text-gray-200 group-hover:text-white">
                                View Travel Insurance Letter
                              </div>
                              <p className="text-[11px] text-gray-400 mt-0.5 leading-snug">
                                আন্তর্জাতিক ট্রাভেল ও এয়ার-অ্যাম্বুলেন্স গ্যারান্টি
                              </p>
                            </div>
                          </div>
                          <ArrowRight className="w-3 h-3 text-gray-500 group-hover:text-[#68D391] group-hover:translate-x-0.5 transition-all shrink-0 mt-1" />
                        </div>
                      </button>

                      {/* 3. View Health Certificate Letter */}
                      <button
                        type="button"
                        onClick={() => handleDocumentClick('health-certificate')}
                        className="w-full text-left p-2.5 rounded hover:bg-[#1E2833] border border-transparent hover:border-[#2C3E50] transition-colors group cursor-pointer"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-start gap-2">
                            <FileCheck className="w-3.5 h-3.5 text-[#9AE6B4] shrink-0 mt-0.5" />
                            <div>
                              <div className="text-xs font-semibold text-gray-200 group-hover:text-white">
                                View Health Certificate Letter
                              </div>
                              <p className="text-[11px] text-gray-400 mt-0.5 leading-snug">
                                DHA eMedical ক্লিয়ারেন্স ও চেস্ট এক্স-রে রিপোর্ট
                              </p>
                            </div>
                          </div>
                          <ArrowRight className="w-3 h-3 text-gray-500 group-hover:text-[#9AE6B4] group-hover:translate-x-0.5 transition-all shrink-0 mt-1" />
                        </div>
                      </button>

                      {/* 4. View Visa Application Received Paper */}
                      <button
                        type="button"
                        onClick={() => handleDocumentClick('visa-received')}
                        className="w-full text-left p-2.5 rounded hover:bg-[#1E2833] border border-transparent hover:border-[#2C3E50] transition-colors group cursor-pointer"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-start gap-2">
                            <FileText className="w-3.5 h-3.5 text-[#63B3ED] shrink-0 mt-0.5" />
                            <div>
                              <div className="text-xs font-semibold text-gray-200 group-hover:text-white">
                                View Visa Application Received Paper
                              </div>
                              <p className="text-[11px] text-gray-400 mt-0.5 leading-snug">
                                DHA ফাইল নম্বর ও অ্যাকনলেজমেন্ট লেটার
                              </p>
                            </div>
                          </div>
                          <ArrowRight className="w-3 h-3 text-gray-500 group-hover:text-[#63B3ED] group-hover:translate-x-0.5 transition-all shrink-0 mt-1" />
                        </div>
                      </button>

                      {/* 5. View Visa Granted Paper */}
                      <button
                        type="button"
                        onClick={() => handleDocumentClick('visa-granted')}
                        className="w-full text-left p-2.5 rounded hover:bg-[#1E2833] border border-transparent hover:border-[#2C3E50] transition-colors group cursor-pointer"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-start gap-2">
                            <Award className="w-3.5 h-3.5 text-[#F6AD55] shrink-0 mt-0.5" />
                            <div>
                              <div className="text-xs font-semibold text-[#FBD38D] group-hover:text-white">
                                View Visa Granted Paper
                              </div>
                              <p className="text-[11px] text-gray-400 mt-0.5 leading-snug">
                                ১৩ ডিজিটের ভিসা গ্রান্ট নম্বর ও ওয়ার্ক রাইটস সমৃদ্ধ অফিসিয়াল গ্রান্ট নোটিশ
                              </p>
                            </div>
                          </div>
                          <ArrowRight className="w-3 h-3 text-gray-500 group-hover:text-[#F6AD55] group-hover:translate-x-0.5 transition-all shrink-0 mt-1" />
                        </div>
                      </button>
                    </div>
                  )}
                </div>
              </div>

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
                  {onPortalClick && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsMenuOpen(false);
                        onPortalClick();
                      }}
                      className="col-span-2 p-2.5 bg-[#002B49] rounded hover:bg-[#003B64] text-white border border-[#C88A24] transition-colors flex items-center justify-between text-left cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-[#FFCD00]" />
                        <span className="font-bold">ImmiAccount Document Verification</span>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-[#FFCD00]" />
                    </button>
                  )}
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
