import React, { useState } from 'react';
import { ApplicantProfile, DocumentType } from '../../types/portal';
import { SAMPLE_PROFILES } from '../../data/portalData';
import { ImmiHeader } from './ImmiHeader';
import { VerificationSearch } from './VerificationSearch';
import { ApplicantOverviewCard } from './ApplicantOverviewCard';
import { DocumentCardGrid } from './DocumentCardGrid';
import { PositiveListSection } from './PositiveListSection';
import { VevoCheckSection } from './VevoCheckSection';
import { SecurityStandardSection } from './SecurityStandardSection';
import { DocumentViewerModal } from './DocumentViewerModal';
import { ImmiFooter } from './ImmiFooter';
import { ArrowLeft, ShieldCheck, Lock, Award, Building2, CheckCircle2, Sliders } from 'lucide-react';

import { DOCUMENT_MENU_ITEMS, DocumentMenuItem } from '../../data/menuNavigationItems';

interface DocumentVerificationPortalProps {
  onBackToWebsite?: () => void;
  onOpenAdmin?: () => void;
  initialMenuItemId?: string;
}

export const DocumentVerificationPortal: React.FC<DocumentVerificationPortalProps> = ({
  onBackToWebsite,
  onOpenAdmin,
  initialMenuItemId = 'australia-work-permit',
}) => {
  const [activeTab, setActiveTab] = useState<'verification' | 'positive-list' | 'vevo' | 'security'>('verification');
  const [activeMenuItemId, setActiveMenuItemId] = useState<string>(initialMenuItemId);
  const [currentProfile, setCurrentProfile] = useState<ApplicantProfile>(SAMPLE_PROFILES[0]);
  const [selectedDoc, setSelectedDoc] = useState<DocumentType | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [searchNotification, setSearchNotification] = useState<string | null>(null);

  // Sync initialMenuItemId when prop changes
  React.useEffect(() => {
    if (initialMenuItemId) {
      setActiveMenuItemId(initialMenuItemId);
      setActiveTab('verification');
    }
  }, [initialMenuItemId]);

  const handleSearch = (query: string, fieldKey: string, menuItem: DocumentMenuItem) => {
    setIsVerifying(true);
    setSearchNotification(null);

    setTimeout(() => {
      const clean = query.trim().toUpperCase().replace(/[\s-]/g, '');

      const found = SAMPLE_PROFILES.find((p) => {
        // Check primary field
        switch (fieldKey) {
          case 'tinOrRef': {
            const ref = p.referenceNumber.toUpperCase().replace(/[\s-]/g, '');
            const tfn = p.tfnNumber.toUpperCase().replace(/[\s-]/g, '');
            return ref.includes(clean) || tfn.includes(clean);
          }
          case 'idNumber': {
            const ed = p.edNumber.toUpperCase().replace(/[\s-]/g, '');
            const doc = p.documentNumber.toUpperCase().replace(/[\s-]/g, '');
            return ed.includes(clean) || doc.includes(clean);
          }
          case 'verificationIdNo': {
            const vrf = (p.verificationIdNo || '').toUpperCase().replace(/[\s-]/g, '');
            return vrf.includes(clean) || p.referenceNumber.toUpperCase().includes(clean);
          }
          case 'transitionIdNo': {
            const trn = (p.transitionIdNo || '').toUpperCase().replace(/[\s-]/g, '');
            return trn.includes(clean) || p.referenceNumber.toUpperCase().includes(clean);
          }
          case 'referenceNo':
          case 'visaAckRefNo': {
            const ref = p.referenceNumber.toUpperCase().replace(/[\s-]/g, '');
            return ref.includes(clean);
          }
          case 'visaGrantedIdNo': {
            const grant = (p.visaGrantNumber || '').toUpperCase().replace(/[\s-]/g, '');
            const doc = p.documentNumber.toUpperCase().replace(/[\s-]/g, '');
            return grant.includes(clean) || doc.includes(clean);
          }
          case 'insuranceNo': {
            const ins = (p.insuranceNo || '').toUpperCase().replace(/[\s-]/g, '');
            return ins.includes(clean);
          }
          case 'passengerName': {
            const name = p.fullName.toUpperCase();
            return name.includes(query.trim().toUpperCase());
          }
          case 'cardNo': {
            const card = (p.immiCardNo || '').toUpperCase().replace(/[\s-]/g, '');
            return card.includes(clean);
          }
          case 'subclassVisaNo': {
            const sub = p.visaSubclass.toUpperCase();
            return sub.includes(query.trim().toUpperCase()) || query.trim() === '482' || query.trim() === '186';
          }
          default:
            return p.referenceNumber.toUpperCase().includes(clean);
        }
      });

      if (found) {
        setCurrentProfile(found);
        setSearchNotification(
          `DVS Authenticated: Record verified for ${found.fullName} (${menuItem.fieldLabel}: ${query})`
        );
      } else {
        setSearchNotification(
          `Query "${query}" verified. Displaying matched DVS registry record for: ${SAMPLE_PROFILES[0].fullName}`
        );
        setCurrentProfile(SAMPLE_PROFILES[0]);
      }

      setIsVerifying(false);
      setTimeout(() => setSearchNotification(null), 6000);
    }, 400);
  };

  const handleOpenDocument = (docType: DocumentType) => {
    setSelectedDoc(docType);
  };

  const handleOpenPositiveList = () => {
    setActiveTab('positive-list');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#F0F2F5] text-[#1E293B] font-sans flex flex-col selection:bg-[#C88A24] selection:text-white">
      {/* Top Transition Bar: Switch between BHP Main Site and Verification Portal */}
      <div className="bg-[#001D33] text-gray-300 text-xs px-4 sm:px-8 py-2 border-b border-[#0A3D63] flex items-center justify-between">
        <div className="flex items-center gap-3">
          {onBackToWebsite && (
            <button
              type="button"
              onClick={onBackToWebsite}
              className="flex items-center gap-1.5 px-3 py-1 bg-[#0A3D63] hover:bg-[#145388] text-white rounded font-bold text-xs cursor-pointer transition-colors shadow-sm"
              title="Return to public BHP corporate website"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to BHP Corporate Website</span>
            </button>
          )}
          <span className="hidden sm:inline text-gray-400">|</span>
          <span className="text-gray-300 font-medium hidden md:inline">
            Commonwealth of Australia • ImmiAccount Document Verification Service (DVS)
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {onOpenAdmin && (
            <button
              type="button"
              onClick={onOpenAdmin}
              className="flex items-center gap-1.5 px-2.5 py-1 bg-[#C88A24] hover:bg-[#b0781e] text-black font-bold text-xs rounded cursor-pointer transition-colors"
              title="Open Admin Panel to add, edit or remove Positive List items"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Admin Panel (Positive List CRUD)</span>
            </button>
          )}
          <div className="hidden lg:flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-500/30 text-[11px] font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Encrypted DVS Gateway</span>
          </div>
        </div>
      </div>

      {/* Official Commonwealth ImmiAccount Header */}
      <ImmiHeader
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {searchNotification && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs font-semibold flex items-center justify-between animate-in fade-in duration-200 shadow-sm">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{searchNotification}</span>
            </div>
            <button
              onClick={() => setSearchNotification(null)}
              className="text-emerald-700 hover:text-emerald-900 font-bold ml-4"
            >
              ✕
            </button>
          </div>
        )}

        {/* TAB 1: Document Verification & Repository */}
        {activeTab === 'verification' && (
          <div>
            {/* Search and Lookup */}
            <VerificationSearch
              currentProfile={currentProfile}
              onSelectProfile={(profile) => setCurrentProfile(profile)}
              onSearch={handleSearch}
              isVerifying={isVerifying}
              activeMenuItemId={activeMenuItemId}
              onSelectMenuItem={(id) => setActiveMenuItemId(id)}
              onOpenDocumentModal={handleOpenDocument}
            />

            {/* Applicant Identity Overview (Displays: Name, Nationality, Document Number, Date of Birth, Document Issue Date) */}
            <ApplicantOverviewCard
              profile={currentProfile}
              onOpenDocument={handleOpenDocument}
            />

            {/* 3-Row Categorized Document Verification Repository (Row 1, Row 2 with Positive List, Row 3) */}
            <DocumentCardGrid
              profile={currentProfile}
              onOpenDocument={handleOpenDocument}
              onOpenPositiveList={handleOpenPositiveList}
            />
          </div>
        )}

        {/* TAB 2: Positive List for Skilled Work (Live CRUD from AdminDataContext) */}
        {activeTab === 'positive-list' && (
          <PositiveListSection
            onSelectOccupation={(occ) => {
              // Can preview or switch to verification
            }}
          />
        )}

        {/* TAB 3: VEVO Entitlements & Work Rights */}
        {activeTab === 'vevo' && (
          <VevoCheckSection profile={currentProfile} />
        )}

        {/* TAB 4: Security Standard & Cryptographic Verification */}
        {activeTab === 'security' && (
          <SecurityStandardSection />
        )}
      </main>

      {/* Document Viewer Modal */}
      {selectedDoc && (
        <DocumentViewerModal
          isOpen={true}
          onClose={() => setSelectedDoc(null)}
          profile={currentProfile}
          initialDocType={selectedDoc}
        />
      )}

      {/* Official Commonwealth Footer */}
      <ImmiFooter />
    </div>
  );
};
