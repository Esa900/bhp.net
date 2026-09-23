import React, { useState, useEffect, useCallback } from 'react';
import { CommodityItem, NewsItem } from './types';
import { COMMODITIES } from './data';
import { LanguageProvider } from './context/LanguageContext';
import { AdminDataProvider, useAdminData } from './context/AdminDataContext';

// Main BHP Layout Components
import { Header } from './components/Header';
import { HeroHeadline } from './components/HeroHeadline';
import { HeroBanner } from './components/HeroBanner';
import { WhatWeProduce } from './components/WhatWeProduce';
import { BentoGrid } from './components/BentoGrid';
import { LatestNews } from './components/LatestNews';
import { UpcomingEvents } from './components/UpcomingEvents';
import { LatestReports } from './components/LatestReports';
import { CeoQuote } from './components/CeoQuote';
import { NewsAlertsSignup } from './components/NewsAlertsSignup';
import { Footer } from './components/Footer';

// Modals
import { ProductModal } from './components/modals/ProductModal';
import { ArticleModal } from './components/modals/ArticleModal';
import { CareersModal } from './components/modals/CareersModal';
import { ContactUsModal } from './components/modals/ContactUsModal';
import { InvestorCentreModal } from './components/modals/InvestorCentreModal';
import { SupplierModal } from './components/modals/SupplierModal';
import { LegalModal, LegalDocType } from './components/modals/LegalModal';
import { CeoMessageModal } from './components/modals/CeoMessageModal';
import { SearchModal } from './components/SearchModal';
import { CookieConsentModal } from './components/modals/CookieConsentModal';
import { AdminPanelModal } from './components/admin/AdminPanelModal';
import { DocumentVerificationPortal } from './components/portal/DocumentVerificationPortal';
import { DocumentSearchModal } from './components/DocumentSearchModal';
import { DOCUMENT_MENU_ITEMS, DocumentMenuItem } from './data/menuNavigationItems';
import { getStoredMenuItems, MENU_ITEMS_UPDATED_EVENT } from './utils/menuItemsStorage';
import { JobCategory } from './types/jobCircular';
import { JobCircularModal } from './components/JobCircularModal';

function MainWebsiteContent() {
  const { commodities, siteSettings } = useAdminData();

  // Modals state
  const [selectedCommodity, setSelectedCommodity] = useState<CommodityItem | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<NewsItem | null>(null);
  const [isCareersOpen, setIsCareersOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isInvestorOpen, setIsInvestorOpen] = useState(false);
  const [isSupplierOpen, setIsSupplierOpen] = useState(false);
  const [legalDoc, setLegalDoc] = useState<LegalDocType | null>(null);
  const [isCeoOpen, setIsCeoOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCookieOpen, setIsCookieOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isPortalOpen, setIsPortalOpen] = useState(false);
  const [selectedMenuItemId, setSelectedMenuItemId] = useState<string>('australia-work-permit');
  const [isDocSearchOpen, setIsDocSearchOpen] = useState(false);
  const [selectedDocItem, setSelectedDocItem] = useState<DocumentMenuItem>(() => {
    const items = getStoredMenuItems();
    return items[0] || DOCUMENT_MENU_ITEMS[0];
  });
  const [selectedJobCategory, setSelectedJobCategory] = useState<JobCategory | null>(null);
  const [isJobCircularOpen, setIsJobCircularOpen] = useState(false);

  // Check URL route for /admin or #/admin
  const checkIsAdminRoute = useCallback(() => {
    const pathname = window.location.pathname.toLowerCase();
    const hash = window.location.hash.toLowerCase();
    const search = window.location.search.toLowerCase();

    return (
      pathname === '/admin' ||
      pathname === '/admin/' ||
      pathname.startsWith('/admin') ||
      hash === '#/admin' ||
      hash === '#admin' ||
      search.includes('admin=true')
    );
  }, []);

  // Check URL route for /portal or #/portal
  const checkIsPortalRoute = useCallback(() => {
    const pathname = window.location.pathname.toLowerCase();
    const hash = window.location.hash.toLowerCase();
    const search = window.location.search.toLowerCase();

    return (
      pathname === '/portal' ||
      pathname === '/portal/' ||
      pathname.startsWith('/portal') ||
      pathname.startsWith('/verify') ||
      pathname.startsWith('/dvs') ||
      hash === '#/portal' ||
      hash === '#portal' ||
      search.includes('portal=true') ||
      search.includes('verify=true')
    );
  }, []);

  useEffect(() => {
    if (checkIsAdminRoute()) {
      setIsAdminOpen(true);
    }
    if (checkIsPortalRoute()) {
      setIsPortalOpen(true);
    }

    const params = new URLSearchParams(window.location.search);
    const itemParam = params.get('item');
    if (itemParam) {
      setSelectedMenuItemId(itemParam);
    }

    const handleRouteChange = () => {
      setIsAdminOpen(checkIsAdminRoute());
      const portalActive = checkIsPortalRoute();
      setIsPortalOpen(portalActive);
      const curParams = new URLSearchParams(window.location.search);
      const curItem = curParams.get('item');
      if (curItem) {
        setSelectedMenuItemId(curItem);
      }
    };

    window.addEventListener('popstate', handleRouteChange);
    window.addEventListener('hashchange', handleRouteChange);

    return () => {
      window.removeEventListener('popstate', handleRouteChange);
      window.removeEventListener('hashchange', handleRouteChange);
    };
  }, [checkIsAdminRoute, checkIsPortalRoute]);

  const handleOpenAdmin = () => {
    setIsAdminOpen(true);
    if (!window.location.pathname.includes('/admin')) {
      window.history.pushState({}, '', '/admin');
    }
  };

  const handleCloseAdmin = () => {
    setIsAdminOpen(false);
    if (window.location.pathname.includes('/admin') || window.location.hash.includes('admin')) {
      window.history.pushState({}, '', isPortalOpen ? '/portal' : '/');
    }
  };

  const handleOpenPortal = (menuItemId?: string) => {
    if (menuItemId) {
      setSelectedMenuItemId(menuItemId);
    }
    setIsPortalOpen(true);
    const targetUrl = menuItemId ? `/portal?item=${menuItemId}` : '/portal';
    if (!window.location.pathname.includes('/portal')) {
      window.history.pushState({}, '', targetUrl);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handleMenuUpdated = () => {
      const allItems = getStoredMenuItems();
      setSelectedDocItem((prev) => {
        const found = allItems.find((d) => d.id === prev.id);
        return found || allItems[0] || prev;
      });
    };

    window.addEventListener(MENU_ITEMS_UPDATED_EVENT, handleMenuUpdated);
    window.addEventListener('storage', handleMenuUpdated);

    return () => {
      window.removeEventListener(MENU_ITEMS_UPDATED_EVENT, handleMenuUpdated);
      window.removeEventListener('storage', handleMenuUpdated);
    };
  }, []);

  const handleSelectMenuItem = (menuItemId: string, initialQuery?: string) => {
    // Directly open the designated document search option modal in BHP's theme
    const allItems = getStoredMenuItems();
    const item = allItems.find((d) => d.id === menuItemId) || allItems[0] || DOCUMENT_MENU_ITEMS[0];
    if (initialQuery) {
      setSelectedDocItem({ ...item, sampleValue: initialQuery });
    } else {
      setSelectedDocItem(item);
    }
    setIsDocSearchOpen(true);
  };

  const handleClosePortal = () => {
    setIsPortalOpen(false);
    if (window.location.pathname.includes('/portal') || window.location.hash.includes('portal')) {
      window.history.pushState({}, '', '/');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProductSelectById = (commodityId: string) => {
    const pool = commodities.length > 0 ? commodities : COMMODITIES;
    const found = pool.find((c) => c.id.toLowerCase() === commodityId.toLowerCase()) || pool[0];
    if (found) {
      setSelectedCommodity(found);
    }
  };

  // If user navigated to or toggled the Document Verification Portal view
  if (isPortalOpen) {
    return (
      <div className="min-h-screen bg-[#F0F2F5]">
        <DocumentVerificationPortal
          onBackToWebsite={handleClosePortal}
          onOpenAdmin={handleOpenAdmin}
          initialMenuItemId={selectedMenuItemId}
        />
        {/* Admin Panel (accessible directly from within the portal) */}
        <AdminPanelModal
          isOpen={isAdminOpen}
          onClose={handleCloseAdmin}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#111315] flex flex-col font-sans selection:bg-[#F25C05] selection:text-white">
      {/* Optional Top Announcement Bar */}
      {siteSettings.announcementEnabled && siteSettings.announcementText && (
        <div className="bg-[#F25C05] text-white text-xs font-semibold py-2 px-4 text-center tracking-wide">
          {siteSettings.announcementText}
        </div>
      )}

      {/* Global Navigation Header */}
      <Header
        onSearchClick={() => setIsSearchOpen(true)}
        onContactClick={() => setIsContactOpen(true)}
        onCareersClick={() => setIsCareersOpen(true)}
        onInvestorClick={() => setIsInvestorOpen(true)}
        onSupplierClick={() => setIsSupplierOpen(true)}
        onProductClick={handleProductSelectById}
        onLegalClick={(type) => setLegalDoc(type)}
        onAdminClick={handleOpenAdmin}
        onPortalClick={() => handleOpenPortal()}
        onSelectMenuItem={handleSelectMenuItem}
        onJobCategoryClick={(category) => {
          setSelectedJobCategory(category);
          setIsJobCircularOpen(true);
        }}
      />

      {/* Main Page Sections */}
      <main className="flex-1">
        <HeroHeadline />
        <HeroBanner />
        <WhatWeProduce onCommoditySelect={(item) => setSelectedCommodity(item)} />
        <BentoGrid
          onOpenInvestorHub={() => setIsInvestorOpen(true)}
          onOpenCareers={() => setIsCareersOpen(true)}
        />
        <LatestNews onArticleSelect={(article) => setSelectedArticle(article)} />
        <UpcomingEvents onOpenCalendar={() => setIsInvestorOpen(true)} />
        <LatestReports onOpenReports={() => setIsInvestorOpen(true)} />
        <CeoQuote onReadCeoMessage={() => setIsCeoOpen(true)} />
        <NewsAlertsSignup />
      </main>

      {/* Global Footer */}
      <Footer
        onOpenPrivacy={() => setLegalDoc('privacy')}
        onOpenModernSlavery={() => setLegalDoc('modern-slavery')}
        onOpenTerms={() => setLegalDoc('terms')}
        onOpenCookies={() => setIsCookieOpen(true)}
        onOpenAbout={() => {
          const el = document.getElementById('bento-grid-section');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
        onOpenInvestors={() => setIsInvestorOpen(true)}
        onOpenCareers={() => setIsCareersOpen(true)}
        onOpenSuppliers={() => setIsSupplierOpen(true)}
        onOpenContact={() => setIsContactOpen(true)}
        onOpenAdmin={handleOpenAdmin}
        onOpenPortal={handleOpenPortal}
      />

      {/* Interactive Modals */}
      <ProductModal
        commodity={selectedCommodity}
        onClose={() => setSelectedCommodity(null)}
      />

      <ArticleModal
        article={selectedArticle}
        onClose={() => setSelectedArticle(null)}
      />

      <CareersModal
        isOpen={isCareersOpen}
        onClose={() => setIsCareersOpen(false)}
      />

      <ContactUsModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />

      <InvestorCentreModal
        isOpen={isInvestorOpen}
        onClose={() => setIsInvestorOpen(false)}
      />

      <SupplierModal
        isOpen={isSupplierOpen}
        onClose={() => setIsSupplierOpen(false)}
      />

      <LegalModal
        type={legalDoc}
        onClose={() => setLegalDoc(null)}
      />

      <CeoMessageModal
        isOpen={isCeoOpen}
        onClose={() => setIsCeoOpen(false)}
      />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onOpenDocumentSearch={(menuItemId, queryText) => {
          handleSelectMenuItem(menuItemId || 'australia-work-permit', queryText);
        }}
      />

      <CookieConsentModal
        isOpen={isCookieOpen}
        onClose={() => setIsCookieOpen(false)}
      />

      {/* 11 Document Search Option Modal in BHP theme */}
      <DocumentSearchModal
        isOpen={isDocSearchOpen}
        onClose={() => setIsDocSearchOpen(false)}
        activeItem={selectedDocItem}
      />

      {/* Job Circular & Requirements Modal with Online Application Form */}
      <JobCircularModal
        isOpen={isJobCircularOpen}
        onClose={() => setIsJobCircularOpen(false)}
        category={selectedJobCategory}
      />

      {/* Admin Panel (accessible via /admin URL or direct link) */}
      <AdminPanelModal
        isOpen={isAdminOpen}
        onClose={handleCloseAdmin}
      />
    </div>
  );
}

export function App() {
  return (
    <LanguageProvider>
      <AdminDataProvider>
        <MainWebsiteContent />
      </AdminDataProvider>
    </LanguageProvider>
  );
}

export default App;
