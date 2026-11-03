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

// Modals & Sub-Portals (Lazy loaded to ensure lightning fast initial page load)
import type { LegalDocType } from './components/modals/LegalModal';

const ProductModal = React.lazy(() => import('./components/modals/ProductModal').then((m) => ({ default: m.ProductModal })));
const ArticleModal = React.lazy(() => import('./components/modals/ArticleModal').then((m) => ({ default: m.ArticleModal })));
const CareersModal = React.lazy(() => import('./components/modals/CareersModal').then((m) => ({ default: m.CareersModal })));
const ContactUsModal = React.lazy(() => import('./components/modals/ContactUsModal').then((m) => ({ default: m.ContactUsModal })));
const InvestorCentreModal = React.lazy(() => import('./components/modals/InvestorCentreModal').then((m) => ({ default: m.InvestorCentreModal })));
const SupplierModal = React.lazy(() => import('./components/modals/SupplierModal').then((m) => ({ default: m.SupplierModal })));
const LegalModal = React.lazy(() => import('./components/modals/LegalModal').then((m) => ({ default: m.LegalModal })));
const CeoMessageModal = React.lazy(() => import('./components/modals/CeoMessageModal').then((m) => ({ default: m.CeoMessageModal })));
const SearchModal = React.lazy(() => import('./components/SearchModal').then((m) => ({ default: m.SearchModal })));
const CookieConsentModal = React.lazy(() => import('./components/modals/CookieConsentModal').then((m) => ({ default: m.CookieConsentModal })));
const AdminPanelModal = React.lazy(() => import('./components/admin/AdminPanelModal').then((m) => ({ default: m.AdminPanelModal })));
const DocumentVerificationPortal = React.lazy(() => import('./components/portal/DocumentVerificationPortal').then((m) => ({ default: m.DocumentVerificationPortal })));
const DocumentSearchModal = React.lazy(() => import('./components/DocumentSearchModal').then((m) => ({ default: m.DocumentSearchModal })));
const CanadaDocumentSearchModal = React.lazy(() => import('./components/CanadaDocumentSearchModal').then((m) => ({ default: m.CanadaDocumentSearchModal })));
const JobCircularModal = React.lazy(() => import('./components/JobCircularModal').then((m) => ({ default: m.JobCircularModal })));
const RightDrawerMenu = React.lazy(() => import('./components/RightDrawerMenu').then((m) => ({ default: m.RightDrawerMenu })));

import { DOCUMENT_MENU_ITEMS, DocumentMenuItem } from './data/menuNavigationItems';
import { getStoredMenuItems, MENU_ITEMS_UPDATED_EVENT, syncMenuItemsFromServer } from './utils/menuItemsStorage';
import { JobCategory } from './types/jobCircular';
import { CanadaMenuItemConfig } from './types/canada';
import { CANADA_MENU_CONFIGS, syncCanadaDocumentsFromServer } from './utils/canadaStorage';
import { AuthUser } from './types/auth';
import { getCurrentAuthUser, BHP_AUTH_STATE_EVENT } from './utils/authStorage';
import { AuthSecurityGate } from './components/auth/AuthSecurityGate';
import { setupSecurityProtection } from './utils/securityProtection';
import { syncAdminPostsFromServer } from './utils/postsStorage';

function MainWebsiteContent({ currentUser }: { currentUser?: AuthUser | null }) {
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
  const [isRightDrawerOpen, setIsRightDrawerOpen] = useState(false);
  const [selectedCanadaConfig, setSelectedCanadaConfig] = useState<CanadaMenuItemConfig>(() => CANADA_MENU_CONFIGS[0]);
  const [isCanadaSearchOpen, setIsCanadaSearchOpen] = useState(false);

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
      // If admin is currently open, dispatch back press event first to let subviews intercept
      if (isAdminOpen && !checkIsAdminRoute()) {
        const backEvent = new CustomEvent('bhp_admin_back_press', { cancelable: true });
        const handled = !window.dispatchEvent(backEvent);
        if (handled) {
          // Subview (modal / add-edit form) handled the back action!
          // Maintain /admin route and keep admin open
          window.history.pushState({ isBhpAdmin: true }, '', '/admin');
          return;
        }
      }

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
  }, [checkIsAdminRoute, checkIsPortalRoute, isAdminOpen]);

  const handleOpenAdmin = () => {
    setIsAdminOpen(true);
    if (!window.location.pathname.includes('/admin')) {
      window.history.pushState({ isBhpAdmin: true }, '', '/admin');
    }
  };

  const handleCloseAdmin = () => {
    setIsAdminOpen(false);
    if (window.location.pathname.includes('/admin') || window.location.hash.includes('admin') || window.location.search.includes('admin')) {
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
        <React.Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#0D0F14] text-white">Loading Verification Portal...</div>}>
          <DocumentVerificationPortal
            onBackToWebsite={handleClosePortal}
            onOpenAdmin={handleOpenAdmin}
            initialMenuItemId={selectedMenuItemId}
          />
          {isAdminOpen && (
            <AdminPanelModal
              isOpen={isAdminOpen}
              onClose={handleCloseAdmin}
            />
          )}
        </React.Suspense>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0A0D14] flex flex-col font-sans selection:bg-[#FF5500] selection:text-white">
      {/* Optional Top Announcement Bar */}
      {siteSettings.announcementEnabled && siteSettings.announcementText && (
        <div className="bg-gradient-to-r from-[#E63B00] via-[#FF5500] to-[#FF771C] text-white text-xs font-semibold py-2 px-4 text-center tracking-wide shadow-xs">
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
        onSelectCanadaItem={(cfg) => {
          setSelectedCanadaConfig(cfg);
          setIsCanadaSearchOpen(true);
        }}
        currentUser={currentUser}
        onJobCategoryClick={(category) => {
          setSelectedJobCategory(category);
          setIsJobCircularOpen(true);
        }}
      />

      {/* Main Page Sections */}
      <main className="flex-1">
        <HeroHeadline
          onOpenRightMenu={() => setIsRightDrawerOpen(true)}
          onSelectAustraliaItem={handleSelectMenuItem}
          onSelectCanadaItem={(cfg) => {
            setSelectedCanadaConfig(cfg);
            setIsCanadaSearchOpen(true);
          }}
          onJobCategoryClick={(category) => {
            setSelectedJobCategory(category);
            setIsJobCircularOpen(true);
          }}
        />
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

      {/* Interactive Modals (Loaded on-demand only when opened) */}
      <React.Suspense fallback={null}>
        {selectedCommodity && (
          <ProductModal
            commodity={selectedCommodity}
            onClose={() => setSelectedCommodity(null)}
          />
        )}

        {selectedArticle && (
          <ArticleModal
            article={selectedArticle}
            onClose={() => setSelectedArticle(null)}
          />
        )}

        {isCareersOpen && (
          <CareersModal
            isOpen={isCareersOpen}
            onClose={() => setIsCareersOpen(false)}
          />
        )}

        {isContactOpen && (
          <ContactUsModal
            isOpen={isContactOpen}
            onClose={() => setIsContactOpen(false)}
          />
        )}

        {isInvestorOpen && (
          <InvestorCentreModal
            isOpen={isInvestorOpen}
            onClose={() => setIsInvestorOpen(false)}
          />
        )}

        {isSupplierOpen && (
          <SupplierModal
            isOpen={isSupplierOpen}
            onClose={() => setIsSupplierOpen(false)}
          />
        )}

        {legalDoc && (
          <LegalModal
            type={legalDoc}
            onClose={() => setLegalDoc(null)}
          />
        )}

        {isCeoOpen && (
          <CeoMessageModal
            isOpen={isCeoOpen}
            onClose={() => setIsCeoOpen(false)}
          />
        )}

        {isSearchOpen && (
          <SearchModal
            isOpen={isSearchOpen}
            onClose={() => setIsSearchOpen(false)}
            onOpenDocumentSearch={(menuItemId, queryText) => {
              handleSelectMenuItem(menuItemId || 'australia-work-permit', queryText);
            }}
          />
        )}

        {isCookieOpen && (
          <CookieConsentModal
            isOpen={isCookieOpen}
            onClose={() => setIsCookieOpen(false)}
          />
        )}

        {/* 11 Document Search Option Modal in BHP theme */}
        {isDocSearchOpen && (
          <DocumentSearchModal
            isOpen={isDocSearchOpen}
            onClose={() => setIsDocSearchOpen(false)}
            activeItem={selectedDocItem}
          />
        )}

        {/* Job Circular & Requirements Modal with Online Application Form */}
        {isJobCircularOpen && (
          <JobCircularModal
            isOpen={isJobCircularOpen}
            onClose={() => setIsJobCircularOpen(false)}
            category={selectedJobCategory}
          />
        )}

        {/* Right Drawer Menu (Triggered from 3-line option below English) */}
        {isRightDrawerOpen && (
          <RightDrawerMenu
            isOpen={isRightDrawerOpen}
            onClose={() => setIsRightDrawerOpen(false)}
            onSelectCanadaItem={(cfg) => {
              setSelectedCanadaConfig(cfg);
              setIsCanadaSearchOpen(true);
            }}
            onSelectAustraliaItem={(menuItemId) => {
              handleSelectMenuItem(menuItemId);
            }}
            onJobCategoryClick={(category) => {
              setSelectedJobCategory(category);
              setIsJobCircularOpen(true);
            }}
          />
        )}

        {/* Canada Document Search Modal (Triggered from 3-line Right Drawer items) */}
        {isCanadaSearchOpen && (
          <CanadaDocumentSearchModal
            isOpen={isCanadaSearchOpen}
            onClose={() => setIsCanadaSearchOpen(false)}
            activeConfig={selectedCanadaConfig}
          />
        )}

        {/* Admin Panel (accessible via /admin URL or direct link) */}
        {isAdminOpen && (
          <AdminPanelModal
            isOpen={isAdminOpen}
            onClose={handleCloseAdmin}
          />
        )}
      </React.Suspense>
    </div>
  );
}

function checkIsAdminUrl(): boolean {
  if (typeof window === 'undefined') return false;
  const pathname = window.location.pathname.toLowerCase();
  const hash = window.location.hash.toLowerCase();
  const search = window.location.search.toLowerCase();

  return (
    pathname === '/admin' ||
    pathname === '/admin/' ||
    pathname.startsWith('/admin') ||
    hash === '#/admin' ||
    hash === '#admin' ||
    hash.startsWith('#admin') ||
    hash.startsWith('#/admin') ||
    search.includes('admin=true')
  );
}

export function App() {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => getCurrentAuthUser());
  const [isAdminRoute, setIsAdminRoute] = useState<boolean>(() => checkIsAdminUrl());

  useEffect(() => {
    const cleanupSecurity = setupSecurityProtection();

    const triggerFullSync = () => {
      syncAdminPostsFromServer().catch(() => {});
      syncCanadaDocumentsFromServer().catch(() => {});
      syncMenuItemsFromServer().catch(() => {});
    };

    // Initial cross-device sync
    triggerFullSync();

    // Fast background sync every 5 seconds so updates made by admin on other devices reflect automatically
    const syncInterval = setInterval(triggerFullSync, 5000);

    // Immediate sync whenever user switches to this window/tab or browser regains focus
    const handleFocus = () => triggerFullSync();
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        triggerFullSync();
      }
    };

    const handleAuthChange = () => {
      setCurrentUser(getCurrentAuthUser());
    };
    const handleRouteChange = () => {
      setIsAdminRoute(checkIsAdminUrl());
    };

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener(BHP_AUTH_STATE_EVENT, handleAuthChange);
    window.addEventListener('storage', handleAuthChange);
    window.addEventListener('popstate', handleRouteChange);
    window.addEventListener('hashchange', handleRouteChange);

    return () => {
      cleanupSecurity();
      clearInterval(syncInterval);
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener(BHP_AUTH_STATE_EVENT, handleAuthChange);
      window.removeEventListener('storage', handleAuthChange);
      window.removeEventListener('popstate', handleRouteChange);
      window.removeEventListener('hashchange', handleRouteChange);
    };
  }, []);

  // When visiting /admin directly, direct admin login screen appears immediately without requiring website customer login
  if (isAdminRoute) {
    return (
      <LanguageProvider>
        <AdminDataProvider>
          <MainWebsiteContent currentUser={currentUser} />
        </AdminDataProvider>
      </LanguageProvider>
    );
  }

  // Protect website: anyone searching/opening website must login or register first
  if (!currentUser) {
    return <AuthSecurityGate onAuthenticated={(user) => setCurrentUser(user)} />;
  }

  return (
    <LanguageProvider>
      <AdminDataProvider>
        <MainWebsiteContent currentUser={currentUser} />
      </AdminDataProvider>
    </LanguageProvider>
  );
}

export default App;
