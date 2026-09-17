/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { SearchModal } from './components/SearchModal';
import { HeroHeadline } from './components/HeroHeadline';
import { HeroBanner } from './components/HeroBanner';
import { CeoQuote } from './components/CeoQuote';
import { BentoGrid } from './components/BentoGrid';
import { WhatWeProduce } from './components/WhatWeProduce';
import { LatestNews } from './components/LatestNews';
import { LatestReports } from './components/LatestReports';
import { UpcomingEvents } from './components/UpcomingEvents';
import { NewsAlertsSignup } from './components/NewsAlertsSignup';
import { Footer } from './components/Footer';

// Modals
import { CeoMessageModal } from './components/modals/CeoMessageModal';
import { ContactUsModal } from './components/modals/ContactUsModal';
import { CareersModal } from './components/modals/CareersModal';
import { InvestorCentreModal } from './components/modals/InvestorCentreModal';
import { SupplierModal } from './components/modals/SupplierModal';
import { ProductModal } from './components/modals/ProductModal';
import { ArticleModal } from './components/modals/ArticleModal';
import { LegalModal, LegalDocType } from './components/modals/LegalModal';
import { CookieConsentModal } from './components/modals/CookieConsentModal';
import { AdminPanelModal } from './components/admin/AdminPanelModal';
import { AdminDataProvider } from './context/AdminDataContext';

import { COMMODITIES } from './data';
import { CommodityItem, NewsItem } from './types';

function BHPAppContent() {
  // Modal State Management
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCeoModalOpen, setIsCeoModalOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isCareersOpen, setIsCareersOpen] = useState(false);
  const [isInvestorOpen, setIsInvestorOpen] = useState(false);
  const [investorTab, setInvestorTab] = useState<'overview' | 'dividends' | 'calendar' | 'reports'>('overview');
  const [isSupplierOpen, setIsSupplierOpen] = useState(false);
  const [selectedCommodity, setSelectedCommodity] = useState<CommodityItem | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<NewsItem | null>(null);
  const [legalModalType, setLegalModalType] = useState<LegalDocType | null>(null);
  const [isCookieModalOpen, setIsCookieModalOpen] = useState(false);
  
  // URL-based Admin Routing (bhpnet.online/admin)
  const checkIsAdminRoute = () => {
    if (typeof window === 'undefined') return false;
    const path = window.location.pathname.toLowerCase();
    const hash = window.location.hash.toLowerCase();
    const search = window.location.search.toLowerCase();
    return (
      path === '/admin' ||
      path === '/admin/' ||
      path.startsWith('/admin') ||
      hash === '#admin' ||
      search.includes('admin')
    );
  };

  const [isAdminOpen, setIsAdminOpen] = useState(() => checkIsAdminRoute());

  useEffect(() => {
    const handleLocationChange = () => {
      setIsAdminOpen(checkIsAdminRoute());
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);

    // Secret shortcut Ctrl+Shift+A or Cmd+Shift+A for site administrator
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        openAdminRoute();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const openAdminRoute = () => {
    try {
      window.history.pushState(null, '', '/admin');
    } catch {
      window.location.hash = 'admin';
    }
    setIsAdminOpen(true);
  };

  const closeAdminRoute = () => {
    try {
      window.history.pushState(null, '', '/');
    } catch {
      window.location.hash = '';
    }
    setIsAdminOpen(false);
  };

  const handleOpenProduct = (commodityId: string) => {
    const matched = COMMODITIES.find((c) => c.id === commodityId) || COMMODITIES[0];
    setSelectedCommodity(matched);
  };

  const handleOpenInvestorCentre = (tab: 'overview' | 'dividends' | 'calendar' | 'reports' = 'overview') => {
    setInvestorTab(tab);
    setIsInvestorOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FA] text-[#111315] selection:bg-[#F25C05] selection:text-white font-sans antialiased">
      {/* 1. Header Navigation & Mega Menu */}
      <Header
        onSearchClick={() => setIsSearchOpen(true)}
        onContactClick={() => setIsContactOpen(true)}
        onCareersClick={() => setIsCareersOpen(true)}
        onInvestorClick={() => handleOpenInvestorCentre('overview')}
        onSupplierClick={() => setIsSupplierOpen(true)}
        onProductClick={handleOpenProduct}
        onLegalClick={(type) => setLegalModalType(type)}
      />

      {/* Main Page Layout matching BHP.com */}
      <main className="flex-1">
        {/* Hero Display Headline */}
        <HeroHeadline />

        {/* Hero Visual Media Banner */}
        <HeroBanner />

        {/* CEO Brandon Craig Leadership Quote Banner */}
        <CeoQuote onReadCeoMessage={() => setIsCeoModalOpen(true)} />

        {/* Bento Grid: Making a Difference, Shareholder Hub, Careers, Live Stock Ticker, Where We Operate */}
        <BentoGrid
          onOpenInvestorHub={() => handleOpenInvestorCentre('overview')}
          onOpenCareers={() => setIsCareersOpen(true)}
        />

        {/* What We Produce (Copper, Iron Ore, Steelmaking Coal, Potash) */}
        <WhatWeProduce
          onCommoditySelect={(commodity) => setSelectedCommodity(commodity)}
        />

        {/* Latest News & Press Releases */}
        <LatestNews
          onArticleSelect={(article) => setSelectedArticle(article)}
        />

        {/* Latest Reports & Financial Presentations */}
        <LatestReports
          onOpenReports={() => handleOpenInvestorCentre('reports')}
        />

        {/* Upcoming Events & Calendar */}
        <UpcomingEvents
          onOpenCalendar={() => handleOpenInvestorCentre('calendar')}
        />

        {/* Media Alerts & Email Subscriptions */}
        <NewsAlertsSignup />
      </main>

      {/* Footer with Legal, Navigation & Cookie Links */}
      <Footer
        onOpenPrivacy={() => setLegalModalType('privacy')}
        onOpenModernSlavery={() => setLegalModalType('modern-slavery')}
        onOpenTerms={() => setLegalModalType('terms')}
        onOpenCookies={() => setIsCookieModalOpen(true)}
        onOpenAbout={() => setIsCeoModalOpen(true)}
        onOpenInvestors={() => handleOpenInvestorCentre('overview')}
        onOpenCareers={() => setIsCareersOpen(true)}
        onOpenSuppliers={() => setIsSupplierOpen(true)}
        onOpenContact={() => setIsContactOpen(true)}
      />

      {/* Interactive Global Modals */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

      <CeoMessageModal
        isOpen={isCeoModalOpen}
        onClose={() => setIsCeoModalOpen(false)}
      />

      <ContactUsModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />

      <CareersModal
        isOpen={isCareersOpen}
        onClose={() => setIsCareersOpen(false)}
      />

      <InvestorCentreModal
        isOpen={isInvestorOpen}
        initialTab={investorTab}
        onClose={() => setIsInvestorOpen(false)}
      />

      <SupplierModal
        isOpen={isSupplierOpen}
        onClose={() => setIsSupplierOpen(false)}
      />

      <ProductModal
        commodity={selectedCommodity}
        onClose={() => setSelectedCommodity(null)}
      />

      <ArticleModal
        article={selectedArticle}
        onClose={() => setSelectedArticle(null)}
      />

      <LegalModal
        type={legalModalType}
        onClose={() => setLegalModalType(null)}
      />

      <CookieConsentModal
        isOpen={isCookieModalOpen}
        onClose={() => setIsCookieModalOpen(false)}
      />

      {/* BHP Admin Panel (Accessible via /admin route or Ctrl+Shift+A) */}
      <AdminPanelModal
        isOpen={isAdminOpen}
        onClose={closeAdminRoute}
      />
    </div>
  );
}

export default function App() {
  return (
    <AdminDataProvider>
      <BHPAppContent />
    </AdminDataProvider>
  );
}
