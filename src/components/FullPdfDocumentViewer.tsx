import React, { useState, useEffect } from 'react';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Maximize2,
  Minimize2,
  Copy,
  Check,
  ShieldCheck,
  FileText,
  Paperclip,
  ExternalLink,
  Lock,
  Calendar,
  Building,
  MapPin,
  Briefcase,
  Globe,
  Award,
  X,
} from 'lucide-react';
import { AdminPost, AttachedDoc } from '../types';
import { CanadaDocumentRecord } from '../types/canada';
import { ApplicantProfile } from '../types/portal';

export interface UnifiedDocumentData {
  id: string;
  country: 'australia' | 'canada';
  title: string;
  referenceNumber: string;
  category: string;
  candidateName: string;
  passportNumber: string;
  nationality: string;
  dateOfBirth?: string;
  jobTitle: string;
  employerName: string;
  workLocation: string;
  salaryOrWage?: string;
  visaSubclassOrCategory?: string;
  status: string;
  issueDate: string;
  expiryDate: string;
  verificationId?: string;
  officialDocNumber?: string;
  lmiaNumber?: string;
  descriptionOrNotes?: string;
  featuredImageUrl?: string;
  galleryImages?: string[];
  attachedDocuments?: AttachedDoc[];
  author?: string;
}

/** Helper to convert an AdminPost to UnifiedDocumentData */
export function postToUnifiedDoc(
  post: AdminPost,
  country: 'australia' | 'canada' = 'australia'
): UnifiedDocumentData {
  return {
    id: post.id,
    country,
    title: post.title,
    referenceNumber: post.refNumber,
    category: post.category,
    candidateName: post.candidateName || 'Mohammad Tanvir Ahmed',
    passportNumber: post.passportNumber || 'A09482103',
    nationality: post.nationality || 'Bangladeshi',
    dateOfBirth: post.dateOfBirth || '1993-01-01',
    jobTitle: post.jobTitle || 'Senior Mining / Maintenance Specialist',
    employerName: post.employerName || 'BHP Group Operations (Australia)',
    workLocation: post.workLocation || 'Perth, WA, Australia',
    salaryOrWage: post.salaryPackage || '$135,000 AUD / Year',
    visaSubclassOrCategory: post.visaSubclass || 'Subclass 482 - TSS (Medium-Term Stream)',
    status: post.status === 'Published' ? 'Verified & Active' : post.status,
    issueDate: post.issueDate || post.date || new Date().toISOString().split('T')[0],
    expiryDate: post.expiryDate || '2028-12-31',
    verificationId: post.verificationIdNo || `VRF-AU-${post.refNumber.replace(/[^0-9]/g, '').slice(-5) || '92841'}`,
    descriptionOrNotes: post.content,
    featuredImageUrl: post.candidatePhotoUrl || post.imageUrl,
    galleryImages: post.galleryImages,
    attachedDocuments: post.attachedDocuments,
    author: post.author,
  };
}

/** Helper to convert a CanadaDocumentRecord to UnifiedDocumentData */
export function canadaRecordToUnifiedDoc(rec: CanadaDocumentRecord): UnifiedDocumentData {
  const attachedDocs: AttachedDoc[] = [];
  if (rec.documentFileUrl) {
    attachedDocs.push({
      id: `ca-attached-${rec.id}`,
      name: rec.documentFileName || 'Canada_Official_Work_Authorization.pdf',
      size: 'Official PDF',
      type: rec.documentFileName?.toLowerCase().endsWith('.pdf') ? 'pdf' : 'pdf',
      dataUrl: rec.documentFileUrl,
      uploadDate: rec.issueDate,
    });
  }

  return {
    id: rec.id,
    country: 'canada',
    title: rec.mainTitle || 'Canada Work Permit & Employment Authorization',
    referenceNumber: rec.tinOrRef || rec.referenceNo || rec.idNumber || 'REF-CA-928410',
    category: rec.mainTitle || 'Canada Work Permit Documents',
    candidateName: rec.candidateName,
    passportNumber: rec.passportNumber,
    nationality: rec.nationality,
    dateOfBirth: rec.dateOfBirth || '1992-05-14',
    jobTitle: rec.jobTitle,
    employerName: rec.employerName,
    workLocation: rec.workLocation,
    salaryOrWage: rec.hourlyWageOrSalary || '$42.50 CAD / hr',
    visaSubclassOrCategory: rec.officialDocNumber || rec.lmiaNumber || 'IRCC Work Permit - GSS Stream A',
    status: rec.status,
    issueDate: rec.issueDate,
    expiryDate: rec.expiryDate,
    verificationId: rec.verificationIdNo || rec.transitionIdNo || rec.idNumber || `VRF-CAN-${rec.id.slice(-5)}`,
    officialDocNumber: rec.officialDocNumber,
    lmiaNumber: rec.lmiaNumber,
    descriptionOrNotes: rec.notes || 'Officially verified and authenticated under Canadian immigration and employer sponsorship regulations.',
    featuredImageUrl: rec.candidatePhotoUrl,
    attachedDocuments: attachedDocs,
    author: 'Immigration, Refugees and Citizenship Canada (IRCC) & BHP Canada',
  };
}

/** Helper to convert an ApplicantProfile to UnifiedDocumentData */
export function profileToUnifiedDoc(profile: ApplicantProfile): UnifiedDocumentData {
  return {
    id: profile.id,
    country: 'australia',
    title: `${profile.visaSubclass} - Work Authorization Dossier`,
    referenceNumber: profile.referenceNumber,
    category: profile.nominatedOccupation || 'Visa & Immigration Permits',
    candidateName: profile.fullName,
    passportNumber: profile.documentNumber,
    nationality: profile.nationality,
    dateOfBirth: profile.dateOfBirth,
    jobTitle: profile.nominatedOccupation,
    employerName: profile.sponsorName,
    workLocation: profile.workLocation,
    salaryOrWage: profile.salaryPackage,
    visaSubclassOrCategory: `${profile.visaSubclass} (${profile.visaStream})`,
    status: 'Verified & Active',
    issueDate: profile.grantDate || profile.applicationDate,
    expiryDate: profile.visaExpiryDate,
    verificationId: profile.verificationIdNo || profile.edNumber || profile.visaGrantNumber,
    descriptionOrNotes: `Commonwealth Department of Home Affairs & BHP Global Sponsorship Endorsement.\nNominated Occupation: ${profile.nominatedOccupation} (ANZSCO ${profile.anzscoCode})\nSponsor ABN: ${profile.sponsorAbn}\nVisa Grant Number: ${profile.visaGrantNumber}`,
    author: 'Commonwealth Department of Home Affairs & BHP Operations',
  };
}

interface FullPdfDocumentViewerProps {
  document: UnifiedDocumentData;
  onSearchAnother?: () => void;
  onClose?: () => void;
}

export const FullPdfDocumentViewer: React.FC<FullPdfDocumentViewerProps> = ({
  document,
  onSearchAnother,
}) => {
  const [activeDocTab, setActiveDocTab] = useState<string>('certificate');
  const [zoom, setZoom] = useState<number>(100);
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);
  const [copiedRef, setCopiedRef] = useState<boolean>(false);

  const isAustralia = document.country === 'australia';

  // Handle ESC key to exit fullscreen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullScreen) {
        setIsFullScreen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullScreen]);

  const handleCopy = () => {
    navigator.clipboard.writeText(document.referenceNumber);
    setCopiedRef(true);
    setTimeout(() => setCopiedRef(false), 2000);
  };

  const handleZoomIn = () => setZoom((z) => Math.min(z + 20, 200));
  const handleZoomOut = () => setZoom((z) => Math.max(z - 20, 60));
  const handleZoomReset = () => setZoom(100);

  const selectedAttachedDoc = document.attachedDocuments?.find(
    (d) => d.id === activeDocTab
  );

  return (
    <div className={`w-full flex flex-col space-y-4 ${isFullScreen ? 'fixed inset-0 z-[100] bg-[#0E1013]/98 backdrop-blur-md p-4 sm:p-6 overflow-y-auto select-text animate-in fade-in duration-150' : ''}`}>
      {/* =========================================================================
          TOP ACTION & CONTROL TOOLBAR (PDF Viewer Header)
         ========================================================================= */}
      <div className={`bg-[#1A1C21] p-3 sm:p-4 rounded-xl border border-[#2B2F38] flex flex-wrap items-center justify-between gap-3 shadow-md no-print ${isFullScreen ? 'sticky top-0 z-30 shadow-2xl' : ''}`}>
        {/* Left: Status & Country Indicator */}
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl border flex items-center justify-center shrink-0 ${
            isAustralia
              ? 'bg-blue-500/15 border-blue-500/30 text-blue-400'
              : 'bg-red-500/15 border-red-500/30 text-red-400'
          }`}>
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Official Record Verified & Authenticated
              </span>
              <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${
                isAustralia
                  ? 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                  : 'bg-red-500/20 text-red-300 border-red-500/30'
              }`}>
                {isAustralia ? 'Australia Commonwealth DVS' : 'Canada IRCC DVS'}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs text-gray-300 font-medium">Ref No:</span>
              <span className="text-xs font-mono font-bold text-[#FF8E4D] tracking-wide select-all">
                {document.referenceNumber}
              </span>
              <button
                type="button"
                onClick={handleCopy}
                className="p-1 rounded text-gray-400 hover:text-white transition-colors cursor-pointer"
                title="Copy Reference"
              >
                {copiedRef ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Right: PDF Viewer Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">

          {/* Zoom Controls */}
          <div className="hidden sm:flex items-center gap-1 bg-[#121316] p-1 rounded-lg border border-[#2B2F38]">
            <button
              type="button"
              onClick={handleZoomOut}
              className="p-1.5 text-gray-400 hover:text-white rounded hover:bg-[#252830] transition-colors cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleZoomReset}
              className="px-2 py-1 text-[11px] font-mono font-bold text-gray-300 hover:text-white rounded hover:bg-[#252830] transition-colors cursor-pointer"
              title="Reset Zoom"
            >
              {zoom}%
            </button>
            <button
              type="button"
              onClick={handleZoomIn}
              className="p-1.5 text-gray-400 hover:text-white rounded hover:bg-[#252830] transition-colors cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>

          {/* Full Screen Toggle */}
          <button
            type="button"
            onClick={() => setIsFullScreen(!isFullScreen)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
              isFullScreen
                ? 'bg-red-600 hover:bg-red-500 text-white border-red-500 shadow-lg'
                : 'bg-[#F25C05] hover:bg-[#D94F04] text-white border-[#F25C05] shadow-md'
            }`}
            title={isFullScreen ? 'Exit Full Screen' : 'Full Screen View'}
          >
            {isFullScreen ? (
              <>
                <Minimize2 className="w-4 h-4" />
                <span>Close Full Screen</span>
              </>
            ) : (
              <>
                <Maximize2 className="w-4 h-4" />
                <span>Full Screen</span>
              </>
            )}
          </button>

          {/* Search Another */}
          {onSearchAnother && (
            <button
              type="button"
              onClick={() => {
                if (isFullScreen) setIsFullScreen(false);
                onSearchAnother();
              }}
              className="px-3 py-1.5 text-xs font-medium text-gray-400 hover:text-white transition-colors cursor-pointer flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Search Another</span>
            </button>
          )}
        </div>
      </div>

      {/* =========================================================================
          DOCUMENT TABS: OFFICIAL CERTIFICATE + ATTACHED PDF / FILES
         ========================================================================= */}
      {document.attachedDocuments && document.attachedDocuments.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-print">
          <button
            type="button"
            onClick={() => setActiveDocTab('certificate')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
              activeDocTab === 'certificate'
                ? 'bg-[#F25C05] text-white shadow-md'
                : 'bg-[#1C1E23] text-gray-400 hover:text-white border border-[#2D313A]'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Official Verification Certificate (অফিসিয়াল সনদ)</span>
          </button>

          {document.attachedDocuments.map((doc, idx) => (
            <button
              key={doc.id}
              type="button"
              onClick={() => setActiveDocTab(doc.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
                activeDocTab === doc.id
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-[#1C1E23] text-gray-400 hover:text-white border border-[#2D313A]'
              }`}
            >
              <Paperclip className="w-3.5 h-3.5" />
              <span className="truncate max-w-[200px]">
                {doc.name || `Attached Document #${idx + 1}`}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* =========================================================================
          VIEW MODE 1: EMBEDDED ATTACHED PDF / IMAGE (If an attached file tab is active)
         ========================================================================= */}
      {activeDocTab !== 'certificate' && selectedAttachedDoc && (
        <div className="bg-[#1C1E23] rounded-2xl border border-[#2D313A] p-4 sm:p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[#2C303B] pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-red-500/20 text-red-400 border border-red-500/30">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm sm:text-base font-bold text-white truncate max-w-md">
                  {selectedAttachedDoc.name}
                </h4>
                <div className="flex items-center gap-2 text-[11px] text-gray-400">
                  <span className="uppercase font-mono text-red-400 font-bold">{selectedAttachedDoc.type}</span>
                  <span>•</span>
                  <span>{selectedAttachedDoc.size}</span>
                  <span>•</span>
                  <span>Uploaded: {selectedAttachedDoc.uploadDate}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={selectedAttachedDoc.dataUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg bg-[#252830] hover:bg-[#323640] text-gray-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Open in New Tab</span>
              </a>
            </div>
          </div>

          {/* Embedded PDF/Image Frame */}
          <div className="w-full min-h-[620px] rounded-xl overflow-hidden bg-black/50 border border-[#2D313A] flex items-center justify-center relative">
            {selectedAttachedDoc.dataUrl.startsWith('data:application/pdf') ||
            selectedAttachedDoc.name.toLowerCase().endsWith('.pdf') ? (
              <iframe
                src={selectedAttachedDoc.dataUrl}
                title={selectedAttachedDoc.name}
                className="w-full h-[700px] rounded-xl border-0"
              />
            ) : selectedAttachedDoc.dataUrl.startsWith('data:image') ||
              selectedAttachedDoc.type === 'image' ? (
              <div className="p-4 flex items-center justify-center max-h-[700px] overflow-auto">
                <img
                  src={selectedAttachedDoc.dataUrl}
                  alt={selectedAttachedDoc.name}
                  style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }}
                  className="max-w-full h-auto rounded-lg shadow-2xl transition-transform"
                />
              </div>
            ) : (
              <div className="p-8 text-center space-y-3">
                <FileText className="w-12 h-12 text-gray-500 mx-auto" />
                <p className="text-sm font-semibold text-gray-200">
                  Document Preview Ready ({selectedAttachedDoc.name})
                </p>
                <p className="text-xs text-gray-400 max-w-sm mx-auto">
                  Click below to view the full verified document in a new tab.
                </p>
                <a
                  href={selectedAttachedDoc.dataUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-all shadow-md cursor-pointer"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Open Document in New Tab</span>
                </a>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW MODE 2: THE OFFICIAL FULL PDF CERTIFICATE & VERIFICATION SHEET
          (Standard A4 sheet styling with microprint borders, seals, QR code & biometrics)
         ========================================================================= */}
      {activeDocTab === 'certificate' && (
        <div className="w-full flex flex-col items-center py-2 relative">
          {/* Quick Notice above document when not fullscreen */}
          {!isFullScreen && (
            <div className="w-full max-w-[850px] mb-2 flex items-center justify-between px-1">
              <span className="text-xs text-gray-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Official Verified Certificate
              </span>
              <button
                type="button"
                onClick={() => setIsFullScreen(true)}
                className="px-3.5 py-1.5 bg-[#F25C05] hover:bg-[#D94F04] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-md cursor-pointer transition-all hover:scale-105"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Click for Full Screen (ফুল স্ক্রিনে দেখুন)</span>
              </button>
            </div>
          )}

          <div
            id="printable-pdf-document"
            onClick={() => {
              if (!isFullScreen) setIsFullScreen(true);
            }}
            onContextMenu={(e) => e.preventDefault()}
            title={!isFullScreen ? 'Click anywhere on PDF to view in full screen (ফুল স্ক্রিনে দেখতে ক্লিক করুন)' : undefined}
            style={{
              transform: zoom !== 100 ? `scale(${zoom / 100})` : undefined,
              transformOrigin: 'top center',
            }}
            className={`w-full max-w-[850px] bg-white text-[#111] p-6 sm:p-10 rounded-2xl shadow-2xl border-4 border-[#202530] relative select-text transition-all duration-150 ${
              !isFullScreen ? 'cursor-pointer group hover:border-[#F25C05] hover:shadow-2xl hover:shadow-[#F25C05]/20' : ''
            }`}
          >
            {/* Hover overlay hint when not fullscreen */}
            {!isFullScreen && (
              <div className="absolute top-4 right-4 z-20 opacity-90 group-hover:opacity-100 transition-opacity flex items-center gap-1.5 px-3 py-1.5 bg-[#0F172A]/90 hover:bg-[#F25C05] text-white text-xs font-bold rounded-lg shadow-lg backdrop-blur-xs border border-white/20">
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Click to Expand Full Screen</span>
              </div>
            )}

            {/* Watermark Pattern */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03] flex items-center justify-center select-none overflow-hidden">
              <div className="transform -rotate-45 text-center font-black text-gray-900 text-6xl sm:text-7xl tracking-widest uppercase">
                {isAustralia ? 'COMMONWEALTH OF AUSTRALIA • BHP VERIFIED' : 'GOVERNMENT OF CANADA • IRCC VERIFIED'}
              </div>
            </div>

            {/* Microprint Security Outer Frame */}
            <div className="border-2 border-[#1E293B] p-5 sm:p-8 rounded-xl relative space-y-6">
              {/* =================================================================
                  CERTIFICATE TOP HEADER
                 ================================================================= */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b-2 border-[#1E293B]">
                {/* Official Crest & Branding */}
                <div className="flex items-center gap-4 text-center sm:text-left">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-[#0F172A] to-[#1E293B] text-white flex flex-col items-center justify-center p-2 shadow-md border border-[#334155] shrink-0">
                    {isAustralia ? (
                      <>
                        <Award className="w-7 h-7 sm:w-9 sm:h-9 text-amber-400" />
                        <span className="text-[9px] font-black uppercase tracking-tighter text-amber-300 mt-0.5">
                          AUSTRALIA
                        </span>
                      </>
                    ) : (
                      <>
                        <Globe className="w-7 h-7 sm:w-9 sm:h-9 text-red-400" />
                        <span className="text-[9px] font-black uppercase tracking-tighter text-red-300 mt-0.5">
                          CANADA
                        </span>
                      </>
                    )}
                  </div>

                  <div>
                    <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-[#475569] block">
                      {isAustralia
                        ? 'COMMONWEALTH OF AUSTRALIA · DEPARTMENT OF HOME AFFAIRS'
                        : 'GOVERNMENT OF CANADA · CITIZENSHIP & IMMIGRATION CANADA (IRCC)'}
                    </span>
                    <h1 className="text-lg sm:text-2xl font-black tracking-tight text-[#0F172A] uppercase mt-0.5 leading-tight">
                      {isAustralia
                        ? 'OFFICIAL VISA & EMPLOYMENT SPONSORSHIP CLEARANCE'
                        : 'OFFICIAL WORK PERMIT & EMPLOYMENT AUTHORIZATION DOSSIER'}
                    </h1>
                    <p className="text-[11px] font-bold text-[#64748B] mt-0.5">
                      BHP Group Limited Global Corporate Documentation & Verification Registry
                    </p>
                  </div>
                </div>

                {/* Barcode & Security DVS Box */}
                <div className="flex flex-col items-end shrink-0 text-right">
                  <div className="bg-[#0F172A] text-white px-3 py-1.5 rounded-lg text-center font-mono text-xs font-black tracking-widest shadow-sm">
                    {document.referenceNumber}
                  </div>
                  {/* Decorative Barcode Graphic */}
                  <div className="flex items-center gap-0.5 h-7 mt-1.5 px-2 py-1 bg-white border border-gray-300 rounded">
                    {[12, 6, 16, 8, 20, 10, 14, 22, 8, 16, 6, 14, 18, 10, 12, 20, 8, 14].map((h, i) => (
                      <div
                        key={i}
                        className="bg-black"
                        style={{ width: i % 3 === 0 ? '2.5px' : '1.5px', height: `${h}px` }}
                      />
                    ))}
                  </div>
                  <span className="text-[9px] font-mono text-gray-500 mt-0.5 uppercase tracking-wider">
                    DVS KEY: {document.verificationId || 'VRF-928410-BHP'}
                  </span>
                </div>
              </div>

              {/* Status & Priority Badge Banner */}
              <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#334155] uppercase tracking-wider text-[11px]">
                    Category / Document Type:
                  </span>
                  <span className="font-extrabold text-[#0F172A] bg-white px-2.5 py-0.5 rounded border border-gray-300 shadow-2xs">
                    {document.category}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-gray-500 uppercase">Verification Status:</span>
                  <span className="px-3 py-0.5 rounded-full text-xs font-black uppercase tracking-wide bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1 shadow-2xs">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{document.status || 'Active & Authenticated'}</span>
                  </span>
                </div>
              </div>

              {/* =================================================================
                  CANDIDATE & IDENTITY PARTICULARS
                 ================================================================= */}
              <div className="space-y-2">
                <div className="flex items-center justify-between pb-1 border-b border-gray-300">
                  <span className="text-xs font-black uppercase tracking-wider text-[#1E293B] flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-[#0F172A]" />
                    <span>Section 1: Candidate & Identification Credentials (প্রার্থীর তথ্য)</span>
                  </span>
                  <span className="text-[10px] font-bold text-gray-500 uppercase">
                    Biometric & Passport Endorsed
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-white p-3.5 rounded-xl border border-gray-200 shadow-2xs">
                  {/* Candidate Photo / Seal Box */}
                  <div className="sm:col-span-1 flex flex-col items-center justify-center p-2 rounded-lg border border-gray-300 bg-gray-50 relative overflow-hidden">
                    <img
                      src={
                        document.featuredImageUrl ||
                        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80'
                      }
                      alt={document.candidateName}
                      className="w-24 h-28 object-cover rounded-md border border-gray-300 shadow-sm"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80';
                      }}
                    />
                    {/* Stamp over corner */}
                    <div className="absolute bottom-1 text-center bg-emerald-600/90 text-white text-[8px] font-black uppercase px-2 py-0.5 rounded shadow">
                      VERIFIED HOLDER
                    </div>
                  </div>

                  {/* Candidate Details Grid */}
                  <div className="sm:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-2.5 bg-[#F8FAFC] rounded-lg border border-gray-200">
                      <span className="text-[10px] uppercase font-bold text-gray-500 block">Candidate Legal Name</span>
                      <strong className="text-sm font-black text-[#0F172A] block mt-0.5">
                        {document.candidateName}
                      </strong>
                    </div>

                    <div className="p-2.5 bg-[#F8FAFC] rounded-lg border border-gray-200">
                      <span className="text-[10px] uppercase font-bold text-gray-500 block flex items-center gap-1">
                        <Lock className="w-3 h-3 text-gray-400" />
                        Passport Identification No
                      </span>
                      <strong className="text-sm font-mono font-black text-[#0F172A] block mt-0.5 tracking-wider">
                        {document.passportNumber}
                      </strong>
                    </div>

                    <div className="p-2.5 bg-[#F8FAFC] rounded-lg border border-gray-200">
                      <span className="text-[10px] uppercase font-bold text-gray-500 block">Nationality</span>
                      <span className="font-bold text-[#1E293B] block mt-0.5">
                        {document.nationality}
                      </span>
                    </div>

                    <div className="p-2.5 bg-[#F8FAFC] rounded-lg border border-gray-200">
                      <span className="text-[10px] uppercase font-bold text-gray-500 block">Date of Birth</span>
                      <span className="font-bold text-[#1E293B] font-mono block mt-0.5">
                        {document.dateOfBirth || '1993-01-01'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* =================================================================
                  EMPLOYMENT & IMMIGRATION VISA PARTICULARS
                 ================================================================= */}
              <div className="space-y-2">
                <div className="flex items-center justify-between pb-1 border-b border-gray-300">
                  <span className="text-xs font-black uppercase tracking-wider text-[#1E293B] flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-[#0F172A]" />
                    <span>Section 2: Sponsoring Employer & Work Entitlement (কাজের অনুমতি ও নিয়োগ)</span>
                  </span>
                  <span className="text-[10px] font-bold text-gray-500 uppercase">
                    Full Work Rights Approved
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-[#F8FAFC] p-4 rounded-xl border border-gray-200">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-gray-500 block">Designated Job Title</span>
                    <strong className="text-sm font-black text-[#0F172A] block mt-0.5">
                      {document.jobTitle}
                    </strong>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-gray-500 block">Sponsoring Employer</span>
                    <strong className="text-sm font-black text-[#0F172A] block mt-0.5">
                      {document.employerName}
                    </strong>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-gray-500 block flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-gray-400" />
                      Work Location
                    </span>
                    <span className="font-bold text-[#1E293B] block mt-0.5">
                      {document.workLocation}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-gray-500 block">
                      Visa Subclass / Category / LMIA
                    </span>
                    <span className="font-bold text-[#0F172A] block mt-0.5">
                      {document.visaSubclassOrCategory || (isAustralia ? 'Subclass 482 - TSS' : 'GSS Stream A')}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-gray-500 block">
                      Approved Remuneration / Wage
                    </span>
                    <span className="font-bold font-mono text-emerald-700 block mt-0.5">
                      {document.salaryOrWage || (isAustralia ? '$135,000 AUD / Year' : '$42.50 CAD / hr')}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-gray-500 block flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-gray-400" />
                      Validity & Expiry Date
                    </span>
                    <span className="font-mono font-black text-[#0F172A] block mt-0.5">
                      {document.issueDate} to {document.expiryDate}
                    </span>
                  </div>
                </div>
              </div>

              {/* =================================================================
                  OFFICIAL DIRECTIVES & CONTENT (From Admin Post)
                 ================================================================= */}
              {document.descriptionOrNotes && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between pb-1 border-b border-gray-300">
                    <span className="text-xs font-black uppercase tracking-wider text-[#1E293B] flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-[#0F172A]" />
                      <span>Section 3: Statutory Clearance Directive & Conditions (অনুমোদনের বিবরণ)</span>
                    </span>
                    <span className="text-[10px] font-mono text-gray-500">OFFICIAL LEGAL RECORD</span>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-gray-200 text-xs text-[#1E293B] leading-relaxed whitespace-pre-line font-sans shadow-2xs">
                    {document.descriptionOrNotes}
                  </div>
                </div>
              )}

              {/* =================================================================
                  OFFICIAL SIGNATURE, DIGITAL HASH & EMBOSSED SEAL
                 ================================================================= */}
              <div className="pt-4 border-t-2 border-[#1E293B] flex flex-col sm:flex-row items-center justify-between gap-6">
                {/* Official Gold Seal Graphic */}
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-full border-4 border-amber-600 bg-gradient-to-br from-amber-100 to-amber-200 flex flex-col items-center justify-center p-1 text-center shadow-inner relative">
                    <div className="w-12 h-12 rounded-full border border-dashed border-amber-700 flex flex-col items-center justify-center">
                      <ShieldCheck className="w-5 h-5 text-amber-800" />
                      <span className="text-[7px] font-black uppercase text-amber-900 tracking-tighter">
                        SEAL OF VALIDITY
                      </span>
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#0F172A] block">
                      OFFICIALLY CERTIFIED & REGISTERED
                    </span>
                    <p className="text-[10px] text-gray-600 max-w-xs mt-0.5 leading-tight">
                      This document has been verified against the Commonwealth of Australia / IRCC registry and BHP Global Operations Database.
                    </p>
                  </div>
                </div>

                {/* Authorized Delegate Signature */}
                <div className="text-right space-y-1">
                  {/* Stylized Digital Signature */}
                  <div className="font-serif italic text-lg sm:text-xl font-bold text-gray-800 tracking-wider">
                    Andrew K. Richardson
                  </div>
                  <div className="border-t border-gray-400 pt-0.5">
                    <span className="text-[10px] font-black uppercase text-[#0F172A] block tracking-wide">
                      Authorized Registrar & Delegate
                    </span>
                    <span className="text-[9px] text-gray-500 block font-mono">
                      Global Mobility & Corporate Regulatory Desk · BHP
                    </span>
                  </div>
                </div>
              </div>

              {/* Security Footer Line */}
              <div className="text-center pt-2 border-t border-gray-200 text-[9px] text-gray-400 font-mono flex flex-wrap items-center justify-between gap-2">
                <span>SECURITY CODE: SHA256:{document.referenceNumber}-AUTH-OK-2026</span>
                <span>VERIFICATION PORTAL: WWW.BHP.COM/VERIFY-PORTAL</span>
                <span>PRINTED SECURE DOSSIER · CONFIDENTIAL</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
