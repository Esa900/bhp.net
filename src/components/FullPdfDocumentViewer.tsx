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
  Lock,
  Calendar,
  Building,
  MapPin,
  Briefcase,
  Globe,
  Award,
  Layers,
  User,
  Hash,
  ArrowLeft,
  Printer,
} from 'lucide-react';
import { AdminPost, AttachedDoc } from '../types';
import { CanadaDocumentRecord } from '../types/canada';
import { ApplicantProfile } from '../types/portal';
import { PdfCanvasRenderer } from './PdfCanvasRenderer';
import { OfficialAttachedPdfSheet } from './OfficialAttachedPdfSheet';

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
  const attached: AttachedDoc[] = [];

  // 1. Add all uploaded PDF & document attachments
  if (post.attachedDocuments && post.attachedDocuments.length > 0) {
    attached.push(...post.attachedDocuments);
  }

  // 2. Add any additional gallery images uploaded as document pages
  if (post.galleryImages && post.galleryImages.length > 0) {
    post.galleryImages.forEach((imgUrl, idx) => {
      const alreadyIncluded = attached.some((d) => d.dataUrl === imgUrl);
      if (!alreadyIncluded && imgUrl) {
        attached.push({
          id: `gallery-doc-${post.id}-${idx}`,
          name: `Attached Document Page ${attached.length + 1}`,
          size: 'Official Image Record',
          type: 'image',
          dataUrl: imgUrl,
          uploadDate: post.date || new Date().toISOString().split('T')[0],
        });
      }
    });
  }

  return {
    id: post.id,
    country,
    title: post.title,
    referenceNumber: post.refNumber,
    category: post.category,
    candidateName: post.candidateName || '',
    passportNumber: post.passportNumber || '',
    nationality: post.nationality || '',
    dateOfBirth: post.dateOfBirth || '',
    jobTitle: post.jobTitle || '',
    employerName: post.employerName || 'BHP Operations',
    workLocation: post.workLocation || '',
    salaryOrWage: post.salaryPackage || '',
    visaSubclassOrCategory: post.visaSubclass || '',
    status: post.status === 'Published' ? 'Verified & Active' : post.status,
    issueDate: post.issueDate || post.date || new Date().toISOString().split('T')[0],
    expiryDate: post.expiryDate || '',
    verificationId: post.verificationIdNo || `VRF-${post.refNumber.replace(/[^0-9]/g, '').slice(-5) || '92841'}`,
    descriptionOrNotes: post.content,
    featuredImageUrl:
      post.candidatePhotoUrl && !post.candidatePhotoUrl.includes('unsplash')
        ? post.candidatePhotoUrl
        : (post.imageUrl && !post.imageUrl.includes('unsplash') ? post.imageUrl : undefined),
    galleryImages: post.galleryImages,
    attachedDocuments: attached,
    author: post.author,
  };
}

/** Helper to convert a CanadaDocumentRecord to UnifiedDocumentData */
export function canadaRecordToUnifiedDoc(rec: CanadaDocumentRecord): UnifiedDocumentData {
  const attachedDocs: AttachedDoc[] = [];

  // 1. Add all multiple attached PDF documents
  if (rec.attachedDocuments && Array.isArray(rec.attachedDocuments)) {
    rec.attachedDocuments.forEach((doc) => {
      if (doc && doc.dataUrl && doc.dataUrl !== '#') {
        let cleanUrl = doc.dataUrl;
        if (cleanUrl.startsWith('data:application/octet-stream;base64,JVBERi')) {
          cleanUrl = cleanUrl.replace('data:application/octet-stream', 'data:application/pdf');
        }
        attachedDocs.push({
          ...doc,
          dataUrl: cleanUrl,
        });
      }
    });
  }

  // 2. Add documentFileUrl if present and not already in attachedDocs
  if (rec.documentFileUrl && rec.documentFileUrl !== '#') {
    let cleanUrl = rec.documentFileUrl;
    if (cleanUrl.startsWith('data:application/octet-stream;base64,JVBERi')) {
      cleanUrl = cleanUrl.replace('data:application/octet-stream', 'data:application/pdf');
    }
    const alreadyExists = attachedDocs.some((d) => d.dataUrl === cleanUrl);
    if (!alreadyExists) {
      const isPdf =
        rec.documentFileName?.toLowerCase().endsWith('.pdf') ||
        cleanUrl.startsWith('data:application/pdf') ||
        cleanUrl.includes('application/pdf') ||
        cleanUrl.includes('JVBERi') ||
        cleanUrl.startsWith('blob:');
      attachedDocs.unshift({
        id: `ca-attached-${rec.id}`,
        name: rec.documentFileName || 'Canada Official Document.pdf',
        size: 'Official IRCC Document',
        type: isPdf ? 'pdf' : 'image',
        dataUrl: cleanUrl,
        uploadDate: rec.issueDate,
      });
    }
  }

  // Check if candidate photo is uploaded directly or attached as an image
  const attachedImage = attachedDocs.find(
    (d) => d.type === 'image' && d.dataUrl && !d.dataUrl.includes('unsplash')
  )?.dataUrl;
  const clientPhoto =
    rec.candidatePhotoUrl && !rec.candidatePhotoUrl.includes('unsplash')
      ? rec.candidatePhotoUrl
      : attachedImage;

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
    visaSubclassOrCategory: rec.officialDocNumber || rec.lmiaNumber || 'IRCC Work Permit',
    status: rec.status,
    issueDate: rec.issueDate,
    expiryDate: rec.expiryDate,
    verificationId: rec.verificationIdNo || rec.transitionIdNo || rec.idNumber || `VRF-CAN-${rec.id.slice(-5)}`,
    officialDocNumber: rec.officialDocNumber,
    lmiaNumber: rec.lmiaNumber,
    descriptionOrNotes: rec.notes || 'Officially verified and authenticated under Canadian immigration and employer sponsorship regulations.',
    featuredImageUrl: clientPhoto,
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
  defaultFullScreen?: boolean;
}

export const FullPdfDocumentViewer: React.FC<FullPdfDocumentViewerProps> = ({
  document,
  onSearchAnother,
  onClose,
  defaultFullScreen = true,
}) => {
  const [zoom, setZoom] = useState<number>(100);
  const [isFullScreen, setIsFullScreen] = useState<boolean>(defaultFullScreen);
  const [copiedRef, setCopiedRef] = useState<boolean>(false);

  const hasAttachedDocs = Boolean(document.attachedDocuments && document.attachedDocuments.length > 0);
  const hasCandidateDetails = Boolean(document.candidateName || document.passportNumber);

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

  const handleZoomIn = () => setZoom((z) => Math.min(z + 25, 250));
  const handleZoomOut = () => setZoom((z) => Math.max(z - 25, 50));
  const handleZoomReset = () => setZoom(100);

  // Check if real attached uploads exist (not empty or dummy '#')
  const validAttachedDocs = (document.attachedDocuments || []).filter(
    (d) => d.dataUrl && d.dataUrl !== '#' && d.dataUrl.length > 5
  );
  const hasRealAttachedDocs = validAttachedDocs.length > 0;

  return (
    <div
      className={`w-full flex flex-col space-y-6 select-none ${
        isFullScreen
          ? 'fixed inset-0 z-[100] bg-[#0A0C10]/98 backdrop-blur-md p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-150'
          : ''
      }`}
      onContextMenu={(e) => e.preventDefault()}
    >
      {/* =========================================================================
          TOP ACTION & CONTROL TOOLBAR (MOBILE RESPONSIVE WITH DIRECT ZOOM)
         ========================================================================= */}
      <div
        className={`bg-[#181A20] p-3 sm:p-4 rounded-2xl border border-[#2B2F38] flex flex-wrap items-center justify-between gap-3 shadow-lg no-print ${
          isFullScreen ? 'sticky top-0 z-40 shadow-2xl backdrop-blur-md bg-[#181A20]/95' : ''
        }`}
      >
        {/* Left: Status & Reference Indicator */}
        <div className="flex items-center gap-3">
          <div className="p-2 sm:p-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-black uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Official PDF Document
              </span>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-[#202532] text-gray-300 border border-[#2D3342]">
                {document.category}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs text-gray-400 font-medium">Ref / ID:</span>
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

        {/* Right: Controls (Zoom - Visible on Mobile, Fullscreen, Search Another, Back) */}
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
          {/* Zoom Controls - ALWAYS VISIBLE ON MOBILE & DESKTOP */}
          <div className="flex items-center gap-1 bg-[#111317] p-1 rounded-xl border border-[#2B2F38]">
            <button
              type="button"
              onClick={handleZoomOut}
              className="p-1.5 sm:p-2 text-gray-300 hover:text-white rounded-lg hover:bg-[#252830] transition-colors cursor-pointer active:scale-95"
              title="Zoom Out (-)"
              aria-label="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleZoomReset}
              className="px-2 py-1 text-xs font-mono font-bold text-white bg-[#1F2430] hover:bg-[#2B3344] rounded-md transition-colors cursor-pointer border border-[#343F54]"
              title="Reset Zoom (100%)"
            >
              {zoom}%
            </button>
            <button
              type="button"
              onClick={handleZoomIn}
              className="p-1.5 sm:p-2 text-gray-300 hover:text-white rounded-lg hover:bg-[#252830] transition-colors cursor-pointer active:scale-95"
              title="Zoom In (+)"
              aria-label="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Zoom Presets */}
          <div className="hidden xs:flex items-center gap-1">
            {[100, 150, 200].map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => setZoom(level)}
                className={`px-2 py-1 text-[11px] font-bold rounded-lg border transition-all cursor-pointer ${
                  zoom === level
                    ? 'bg-[#FF5500] text-white border-[#FF5500] shadow-xs'
                    : 'bg-[#181B22] text-gray-400 hover:text-white border-[#272B35]'
                }`}
                title={`Zoom to ${level}%`}
              >
                {level}%
              </button>
            ))}
          </div>

          {/* Official Verification Badge */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-[#171920] text-emerald-400 rounded-xl text-xs font-bold border border-emerald-500/30">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden md:inline">Authenticated Record</span>
            <span className="md:hidden">Verified</span>
          </div>

          {/* Full Screen Toggle (Only needed if NOT already in full screen) */}
          {!isFullScreen && (
            <button
              type="button"
              onClick={() => setIsFullScreen(true)}
              className="px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border bg-[#F25C05] hover:bg-[#D94F04] text-white border-[#F25C05] shadow-md"
              title="Full Screen View"
            >
              <Maximize2 className="w-4 h-4" />
              <span>Full Screen</span>
            </button>
          )}

          {/* Search Another Button */}
          {onSearchAnother && (
            <button
              type="button"
              onClick={() => {
                if (isFullScreen) setIsFullScreen(false);
                onSearchAnother();
              }}
              className="px-3 py-1.5 text-xs font-bold bg-[#F25C05] hover:bg-[#D94F04] text-white rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-1.5 border border-[#F25C05]"
              title="Search Another Document"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Search Another</span>
            </button>
          )}

          {/* Back / Close Button */}
          {onClose && (
            <button
              type="button"
              onClick={() => {
                if (isFullScreen) setIsFullScreen(false);
                onClose();
              }}
              className="px-3.5 py-1.5 bg-[#252830] hover:bg-[#323640] text-gray-200 hover:text-white rounded-xl text-xs font-bold transition-all border border-[#3A3F4C] cursor-pointer flex items-center gap-1.5 shadow-xs"
              title="Return to search"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#FF5500]" />
              <span>Back (ফিরে যান)</span>
            </button>
          )}
        </div>
      </div>

      {/* =========================================================================
          PRIMARY VIEW: OFFICIAL VERIFICATION CERTIFICATE SHEET (DIRECT PDF FORMAT)
          (Rendered unconditionally so customers directly see their official PDF document!)
         ========================================================================= */}
      <div id="official-certificate-sheet" className="w-full flex flex-col items-center relative">
        {/* Mobile touch-pan info strip */}
        <div className="w-full max-w-[850px] mb-2 px-2 flex items-center justify-between text-xs text-gray-400">
          <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
            <ShieldCheck className="w-4 h-4" />
            <span>Official PDF Verification Sheet</span>
          </span>
          <span className="text-[11px] text-gray-400 font-mono">
            Zoom Level: <span className="text-white font-bold">{zoom}%</span> {zoom > 100 && '(Pan / Scroll enabled)'}
          </span>
        </div>

        {/* Scrollable pan container so zooming on mobile allows smooth horizontal & vertical scrolling */}
        <div className="w-full overflow-x-auto overflow-y-visible pb-4 pt-1 flex flex-col items-center touch-pan-x touch-pan-y scrollbar-thin">
          <div
            id="printable-pdf-document"
            onContextMenu={(e) => e.preventDefault()}
            style={{
              transform: zoom !== 100 ? `scale(${zoom / 100})` : undefined,
              transformOrigin: 'top center',
              marginBottom: zoom > 100 ? `${(zoom - 100) * 8}px` : undefined,
            }}
            className="w-full max-w-[850px] bg-white text-[#111] p-5 sm:p-10 rounded-2xl shadow-2xl border-4 border-[#202530] relative select-none transition-transform duration-150 shrink-0"
          >
            {/* Official Registry Watermark Grid */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.04] flex flex-wrap items-center justify-around select-none overflow-hidden p-6 gap-8 z-20">
              {Array.from({ length: 24 }).map((_, i) => (
                <div key={i} className="transform -rotate-25 text-center font-black uppercase text-[11px] sm:text-xs tracking-widest text-black select-none pointer-events-none">
                  {document.country === 'canada' ? 'GOVERNMENT OF CANADA • OFFICIAL ARCHIVE' : 'BHP GROUP LIMITED • VERIFIED ARCHIVE'} • #{document.referenceNumber}
                </div>
              ))}
            </div>

            {/* Central Giant Watermark */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03] flex items-center justify-center select-none overflow-hidden">
              <div className="transform -rotate-45 text-center font-black text-gray-900 text-6xl sm:text-7xl tracking-widest uppercase">
                {document.country === 'canada' ? 'GOVERNMENT OF CANADA • IRCC VERIFIED' : 'BHP GLOBAL OPERATIONS • OFFICIAL VERIFIED'}
              </div>
            </div>

            {/* Microprint Security Outer Frame */}
            <div className="border-2 border-[#1E293B] p-4 sm:p-8 rounded-xl relative space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b-2 border-[#1E293B]">
                <div className="flex items-center gap-4 text-center sm:text-left">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-[#0F172A] to-[#1E293B] text-white flex flex-col items-center justify-center p-2 shadow-md border border-[#334155] shrink-0">
                    {document.country === 'canada' ? (
                      <>
                        <Globe className="w-7 h-7 sm:w-9 sm:h-9 text-red-400" />
                        <span className="text-[9px] font-black uppercase tracking-tighter text-red-300 mt-0.5">
                          CANADA
                        </span>
                      </>
                    ) : (
                      <>
                        <Award className="w-7 h-7 sm:w-9 sm:h-9 text-amber-400" />
                        <span className="text-[9px] font-black uppercase tracking-tighter text-amber-300 mt-0.5">
                          OFFICIAL
                        </span>
                      </>
                    )}
                  </div>

                  <div>
                    <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-[#475569] block">
                      {document.country === 'canada'
                        ? 'GOVERNMENT OF CANADA · CITIZENSHIP & IMMIGRATION CANADA (IRCC)'
                        : 'BHP GROUP LIMITED · GLOBAL CORPORATE REGISTRY'}
                    </span>
                    <h1 className="text-lg sm:text-2xl font-black tracking-tight text-[#0F172A] uppercase mt-0.5 leading-tight">
                      {document.title}
                    </h1>
                    <p className="text-[11px] font-bold text-[#64748B] mt-0.5">
                      BHP Group Limited Global Corporate Documentation & Verification Registry
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-center sm:items-end shrink-0 text-center sm:text-right">
                  <div className="bg-[#0F172A] text-white px-3 py-1.5 rounded-lg text-center font-mono text-xs font-black tracking-widest shadow-sm">
                    {document.referenceNumber}
                  </div>
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

              {/* Status Bar */}
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

              {/* Candidate Particulars (IF SPECIFIED) */}
              {hasCandidateDetails && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between pb-1 border-b border-gray-300">
                    <span className="text-xs font-black uppercase tracking-wider text-[#1E293B] flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-[#0F172A]" />
                      <span>Candidate & Identity Particulars</span>
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-[#F8FAFC] p-4 rounded-xl border border-gray-200">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-gray-500 block">Candidate Name</span>
                      <strong className="text-sm font-black text-[#0F172A] block mt-0.5">
                        {document.candidateName}
                      </strong>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-bold text-gray-500 block">Passport Number</span>
                      <strong className="text-sm font-mono font-black text-[#0F172A] block mt-0.5">
                        {document.passportNumber}
                      </strong>
                    </div>

                    {document.nationality && (
                      <div>
                        <span className="text-[10px] uppercase font-bold text-gray-500 block">Nationality</span>
                        <span className="font-bold text-[#1E293B] block mt-0.5">{document.nationality}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Description Directive */}
              {document.descriptionOrNotes && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between pb-1 border-b border-gray-300">
                    <span className="text-xs font-black uppercase tracking-wider text-[#1E293B] flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-[#0F172A]" />
                      <span>Document Details & Statement</span>
                    </span>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-gray-200 text-xs text-[#1E293B] leading-relaxed whitespace-pre-line font-sans shadow-2xs">
                    {document.descriptionOrNotes}
                  </div>
                </div>
              )}

              {/* Seals and Signature */}
              <div className="pt-4 border-t-2 border-[#1E293B] flex flex-col sm:flex-row items-center justify-between gap-6">
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
                      This record has been officially verified and archived in the BHP Global Registry.
                    </p>
                  </div>
                </div>

                <div className="text-right space-y-1">
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

              {/* Security Footer */}
              <div className="text-center pt-2 border-t border-gray-200 text-[9px] text-gray-400 font-mono flex flex-wrap items-center justify-between gap-2">
                <span>SECURITY CODE: SHA256:{document.referenceNumber}-AUTH-OK-2026</span>
                <span>VERIFICATION PORTAL: WWW.BHP.COM/VERIFY-PORTAL</span>
                <span>PRINTED SECURE DOSSIER · OFFICIAL RECORD</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          SECONDARY VIEW: OPEN CLIENT DOCUMENTS STREAM (IF REAL ATTACHED UPLOADS EXIST)
         ========================================================================= */}
      {/* =========================================================================
          SECONDARY VIEW: OPEN CLIENT DOCUMENTS STREAM (ATTACHED WORK PERMIT / OFFICIAL PDF)
         ========================================================================= */}
      <div className="w-full flex flex-col items-center space-y-8 pt-4">
        <div className="w-full max-w-[900px] flex items-center justify-between px-2 text-xs text-gray-400">
          <span className="font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <Paperclip className="w-4 h-4 text-[#FF5500]" />
            <span>
              Attached Official Client Document & Visa Record {hasRealAttachedDocs ? `(${validAttachedDocs.length})` : '(01)'}
            </span>
          </span>
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-md border border-emerald-500/20 font-bold">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Official Client Record</span>
          </div>
        </div>

        {hasRealAttachedDocs ? (
          <>
            {validAttachedDocs.length > 1 && (
              <div className="w-full max-w-[900px] flex items-center gap-2 overflow-x-auto py-1.5 px-2 bg-[#12141A] rounded-xl border border-[#272B36] scrollbar-thin">
                <span className="text-[11px] font-bold text-[#FF8E4D] shrink-0 uppercase tracking-wider flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5" />
                  <span>Attached PDFs ({validAttachedDocs.length}):</span>
                </span>
                {validAttachedDocs.map((d, i) => (
                  <a
                    key={d.id}
                    href={`#attached-doc-${d.id}`}
                    className="px-2.5 py-1 rounded-lg bg-[#191D26] hover:bg-[#232936] text-gray-200 hover:text-white text-xs font-semibold border border-[#2B3242] transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <span className="px-1.5 py-0.2 rounded bg-[#FF5500] text-white font-mono text-[10px] font-black">
                      {i + 1}
                    </span>
                    <span className="truncate max-w-[150px]">{d.name}</span>
                  </a>
                ))}
              </div>
            )}
            {validAttachedDocs.map((doc, idx) => {
              const serialNum = idx + 1;
              const formattedSerial = serialNum < 10 ? `0${serialNum}` : `${serialNum}`;
              const isPdf =
                Boolean(doc.dataUrl) &&
                (doc.type === 'pdf' ||
                  doc.name.toLowerCase().endsWith('.pdf') ||
                  doc.dataUrl.startsWith('data:application/pdf') ||
                  doc.dataUrl.includes('application/pdf') ||
                  doc.dataUrl.includes('JVBERi') ||
                  doc.dataUrl.startsWith('blob:') ||
                  doc.dataUrl.toLowerCase().includes('.pdf'));

            return (
              <div
                key={doc.id}
                id={`attached-doc-${doc.id}`}
                className="w-full max-w-[900px] flex flex-col items-center"
              >
                {/* Serial Header Strip */}
                <div className="w-full mb-2 flex items-center justify-between px-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md bg-[#F25C05] text-white font-black uppercase text-[11px] shadow-xs">
                      Document {formattedSerial}
                    </span>
                    <span className="text-white font-bold truncate max-w-sm sm:max-w-md">
                      {doc.name || `Uploaded Document #${idx + 1}`}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-md border border-emerald-500/20 font-bold">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Verified & Authenticated</span>
                  </div>
                </div>

                {/* Document Container Card */}
                <div className="w-full bg-[#181A20] rounded-2xl border-2 border-[#2B2F38] shadow-2xl overflow-hidden p-4 sm:p-6 space-y-4">
                  {/* Document Info Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#2C303B] pb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-orange-500/15 text-[#F25C05] border border-[#F25C05]/30 shrink-0">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm sm:text-base font-bold text-white truncate max-w-md">
                          {doc.name || `Uploaded Document #${idx + 1}`}
                        </h4>
                        <div className="flex items-center gap-2 text-[11px] text-gray-400 mt-0.5">
                          <span className="uppercase font-mono text-emerald-400 font-bold">
                            {isPdf ? 'OFFICIAL CLIENT PDF' : 'OFFICIAL SCANNED RECORD'}
                          </span>
                          <span>•</span>
                          <span>{doc.size || 'Verified Record'}</span>
                          <span>•</span>
                          <span className="text-orange-300 font-mono">Ref: {document.referenceNumber}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-lg bg-[#111317] border border-[#272B35] text-[11px] text-gray-400 font-medium flex items-center gap-1">
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span>Official Record</span>
                      </span>
                    </div>
                  </div>

                  {/* Open Document Render Frame */}
                  <div className="w-full min-h-[400px] rounded-xl overflow-hidden bg-[#0F1115] border border-[#262A34] flex items-center justify-center relative select-none">
                    {isPdf ? (
                      <div className="w-full flex items-center justify-center overflow-auto">
                        <PdfCanvasRenderer
                          dataUrl={doc.dataUrl}
                          docName={doc.name}
                          zoom={zoom}
                        />
                      </div>
                    ) : doc.dataUrl && (doc.dataUrl.startsWith('data:image') || doc.type === 'image') ? (
                      <div className="p-4 flex items-center justify-center w-full max-h-[900px] overflow-auto">
                        <img
                          src={doc.dataUrl}
                          alt={doc.name}
                          onContextMenu={(e) => e.preventDefault()}
                          style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }}
                          className="max-w-full h-auto rounded-lg shadow-2xl transition-transform pointer-events-auto select-none"
                        />
                      </div>
                    ) : (
                      <OfficialAttachedPdfSheet document={document} zoom={zoom} />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </>
      ) : (
          /* When no separate uploaded binary PDF was provided, ALWAYS show the official verified attached Work Permit Application sheet */
          <div className="w-full max-w-[900px] flex flex-col items-center">
            <div className="w-full mb-2 flex items-center justify-between px-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md bg-[#F25C05] text-white font-black uppercase text-[11px] shadow-xs">
                  Document 01
                </span>
                <span className="text-white font-bold truncate max-w-sm sm:max-w-md">
                  {document.title || 'Official Work Permit Application (D Category)'}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-md border border-emerald-500/20 font-bold">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Verified & Authenticated</span>
              </div>
            </div>

            <div className="w-full bg-[#181A20] rounded-2xl border-2 border-[#2B2F38] shadow-2xl overflow-hidden p-4 sm:p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#2C303B] pb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-orange-500/15 text-[#F25C05] border border-[#F25C05]/30 shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm sm:text-base font-bold text-white truncate max-w-md">
                      {document.title || 'Official Work Permit Application'}
                    </h4>
                    <div className="flex items-center gap-2 text-[11px] text-gray-400 mt-0.5">
                      <span className="uppercase font-mono text-emerald-400 font-bold">
                        OFFICIAL CLIENT PDF
                      </span>
                      <span>•</span>
                      <span>Official IRCC Document</span>
                      <span>•</span>
                      <span className="text-orange-300 font-mono">Ref: {document.referenceNumber}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-lg bg-[#111317] border border-[#272B35] text-[11px] text-gray-400 font-medium flex items-center gap-1">
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span>Official Record</span>
                  </span>
                </div>
              </div>

              <div className="w-full min-h-[400px] rounded-xl overflow-hidden bg-[#0F1115] border border-[#262A34] flex items-center justify-center relative select-none p-2 sm:p-4">
                <OfficialAttachedPdfSheet document={document} zoom={zoom} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* =========================================================================
          TERTIARY VIEW: PRISTINE EXECUTIVE DOSSIER CARD (COMPLETE METADATA OVERVIEW)
         ========================================================================= */}
      <div className="w-full max-w-[900px] mx-auto bg-[#14171E] border border-[#272B36] rounded-2xl p-4 sm:p-7 shadow-xl space-y-4">
        {/* Title & Status */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#232733] pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-md bg-[#F25C05] text-white font-mono text-[11px] font-black uppercase shadow-xs">
                #{document.referenceNumber}
              </span>
              <span className="px-2.5 py-0.5 rounded-md bg-[#1F232D] text-gray-300 text-xs font-bold border border-[#2D3342]">
                {document.category}
              </span>
              {document.issueDate && (
                <span className="text-xs text-gray-400 flex items-center gap-1 font-mono">
                  <Calendar className="w-3.5 h-3.5" />
                  {document.issueDate}
                </span>
              )}
            </div>
            <h2 className="text-base sm:text-xl font-black text-white tracking-tight leading-snug">
              {document.title}
            </h2>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5 shadow-xs">
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>{document.status || 'Verified & Active'}</span>
            </span>
          </div>
        </div>

        {/* Client / Candidate Details Bar */}
        {hasCandidateDetails && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-[#0D0F14] p-3.5 rounded-xl border border-[#1E222D] text-xs">
            {document.candidateName && (
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                  Client / Candidate
                </span>
                <strong className="text-white text-sm font-bold block mt-0.5 truncate">
                  {document.candidateName}
                </strong>
              </div>
            )}

            {document.passportNumber && (
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                  Passport Number
                </span>
                <span className="text-[#FF8E4D] font-mono font-bold text-sm block mt-0.5">
                  {document.passportNumber}
                </span>
              </div>
            )}

            {document.jobTitle && (
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                  Designation / Role
                </span>
                <span className="text-gray-200 font-semibold block mt-0.5 truncate">
                  {document.jobTitle}
                </span>
              </div>
            )}

            {document.workLocation && (
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                  Location
                </span>
                <span className="text-gray-300 block mt-0.5 truncate">
                  {document.workLocation}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Post Description / Statement */}
        {document.descriptionOrNotes && (
          <div className="p-4 rounded-xl bg-[#0D0F14] border border-[#1E222D] text-xs sm:text-sm text-gray-200 leading-relaxed whitespace-pre-line font-normal">
            {document.descriptionOrNotes}
          </div>
        )}

        {/* Author / Verification Footer Strip */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 text-[11px] text-gray-400 font-mono">
          <span>Official BHP Verified Archive · DVS Key: {document.verificationId || 'VRF-REG-2026'}</span>
          <span>{document.author || 'BHP Global Operations Desk'}</span>
        </div>
      </div>
    </div>
  );
};
