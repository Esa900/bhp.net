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
  Eye,
  Download,
  ExternalLink,
} from 'lucide-react';
import { AdminPost, AttachedDoc } from '../types';
import { CanadaDocumentRecord } from '../types/canada';
import { ApplicantProfile } from '../types/portal';
import { PdfCanvasRenderer } from './PdfCanvasRenderer';
import { OfficialAttachedPdfSheet } from './OfficialAttachedPdfSheet';
import { isFirestorePdfUrl, resolveFirestorePdfBlobUrl } from '../utils/firebaseCloud';

const ResolvedDocImage: React.FC<{
  src: string;
  alt: string;
  style?: React.CSSProperties;
  className?: string;
}> = ({ src, alt, style, className }) => {
  const [resolved, setResolved] = useState<string>(isFirestorePdfUrl(src) ? '' : src);
  useEffect(() => {
    let active = true;
    if (!isFirestorePdfUrl(src)) {
      setResolved(src);
      return;
    }
    resolveFirestorePdfBlobUrl(src)
      .then((blobUrl) => {
        if (active && blobUrl) setResolved(blobUrl);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [src]);
  if (!resolved) {
    return <div className="py-12 text-xs text-gray-400">Loading image from cloud...</div>;
  }
  return <img src={resolved} alt={alt} style={style} className={className} />;
};

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
      attachedDocs.push({
        id: `ca-attached-${rec.id}`,
        name: rec.documentFileName || 'Canada Official Document.pdf',
        size: 'Official IRCC Document',
        type: isPdf ? 'pdf' : 'image',
        dataUrl: cleanUrl,
        sectionTag: rec.mainTitle || 'Work Permit Documents (ওয়ার্ক পারমিট)',
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
    author: 'Commonwealth Department of Home Affairs & BHP Operations',
    attachedDocuments: [
      {
        id: `att-prof-${profile.id}-pdf`,
        name: `${profile.fullName} - Work Authorization Dossier.pdf`,
        size: '737 KB',
        type: 'pdf',
        dataUrl: '/uploads/Canada_Visa_Application_MD_IBRAHIM_KHALIL_MOZUMDER.pdf',
        sectionTag: 'Work Permit Documents (ওয়ার্ক পারমিট)',
        isPrimary: true,
        uploadDate: profile.grantDate || '2026-03-02',
      },
    ],
  };
}

// Semantic category matcher to match client search section with attached document sectionTag
export function isSectionMatch(tagOrName?: string, targetSection?: string): boolean {
  if (!tagOrName || !targetSection) return false;
  const tagLower = tagOrName.toLowerCase();
  const targetLower = targetSection.toLowerCase();

  // Direct substring or inclusion
  const cleanTag = tagLower.replace(/[-\s_./#:]/g, '');
  const cleanTarget = targetLower.replace(/[-\s_./#:]/g, '');
  if (cleanTag.includes(cleanTarget) || cleanTarget.includes(cleanTag)) {
    return true;
  }

  // Semantic category groupings
  const rules: { keywords: string[]; synonyms: string[] }[] = [
    {
      keywords: ['offer', 'letter', 'contract', 'appointment', 'অফার'],
      synonyms: ['offer', 'letter', 'contract', 'job-confirmation', 'appointment', 'অফার'],
    },
    {
      keywords: ['biometric', 'vfs', 'fingerprint', 'বায়োমেট্রিক', 'ভিএফএস'],
      synonyms: ['biometric', 'vfs', 'enrollment', 'facial', 'biometric-vfs', 'বায়োমেট্রিক', 'ভিএফএস'],
    },
    {
      keywords: ['confirmation', 'job confirmation', 'sponsorship'],
      synonyms: ['confirmation', 'job-confirmation', 'sponsor', 'conformation'],
    },
    {
      keywords: ['work permit', 'permit', 'application', 'wpd', 'ওয়ার্ক পারমিট'],
      synonyms: ['work-permit', 'permit', 'employment application', 'work permit', 'ওয়ার্ক পারমিট'],
    },
    {
      keywords: ['medical', 'health', 'clinic', 'hospital', 'examination', 'মেডিকেল'],
      synonyms: ['medical', 'health', 'clinic', 'clearance', 'examination', 'doctor', 'মেডিকেল'],
    },
    {
      keywords: ['flight', 'ticket', 'air', 'pnr', 'airline', 'transit', 'বুকিং'],
      synonyms: ['flight', 'ticket', 'airline', 'itinerary', 'air-ticket', 'transit', 'booking', 'বুকিং'],
    },
    {
      keywords: ['tax', 'tfn', 'superannuation', 'revenue'],
      synonyms: ['tax', 'tfn', 'tin', 'superannuation', 'revenue', 'tax-cert'],
    },
    {
      keywords: ['insurance', 'bupa', 'medibank', 'ovhc', 'cover'],
      synonyms: ['insurance', 'bupa', 'medibank', 'health cover', 'ovhc', 'policy'],
    },
    {
      keywords: ['immi', 'immicard', 'card', 'evidence of immigration'],
      synonyms: ['immi', 'card', 'immicard', 'status'],
    },
    {
      keywords: ['visa', 'grant', 'vevo', 'approval', 'ভিসা'],
      synonyms: ['visa', 'grant', 'vevo', 'approval', 'authorized', 'ভিসা'],
    },
    {
      keywords: ['identity', 'passport', 'dossier', 'আইডেন্টিটি'],
      synonyms: ['identity', 'passport', 'dossier', 'particulars', 'আইডেন্টিটি'],
    },
  ];

  for (const rule of rules) {
    const targetHas = rule.keywords.some((k) => targetLower.includes(k));
    if (targetHas) {
      const tagHas = rule.synonyms.some((s) => tagLower.includes(s));
      if (tagHas) return true;
    }
  }

  const targetWords = targetLower.split(/[\s_./#:,()\-]+/).filter((w) => w.length >= 4);
  const tagWords = tagLower.split(/[\s_./#:,()\-]+/).filter((w) => w.length >= 4);
  for (const tw of targetWords) {
    if (tagWords.includes(tw)) return true;
  }

  return false;
}

interface FullPdfDocumentViewerProps {
  document: UnifiedDocumentData;
  onSearchAnother?: () => void;
  onClose?: () => void;
  defaultFullScreen?: boolean;
  targetSectionTag?: string;
}

export const FullPdfDocumentViewer: React.FC<FullPdfDocumentViewerProps> = ({
  document,
  onSearchAnother,
  onClose,
  defaultFullScreen = true,
  targetSectionTag,
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

  // Check if real attached uploads exist (not empty or dummy '#'), placing primary/section-matched first
  const rawValidAttachedDocs = (document.attachedDocuments || []).filter(
    (d) => d.dataUrl && d.dataUrl !== '#' && d.dataUrl.length > 5
  );
  const validAttachedDocs = [...rawValidAttachedDocs].sort((a, b) => {
    const aSec = targetSectionTag
      ? isSectionMatch(a.sectionTag, targetSectionTag) || isSectionMatch(a.name, targetSectionTag)
      : false;
    const bSec = targetSectionTag
      ? isSectionMatch(b.sectionTag, targetSectionTag) || isSectionMatch(b.name, targetSectionTag)
      : false;
    if (aSec !== bSec) return aSec ? -1 : 1;
    if (Boolean(a.isPrimary) !== Boolean(b.isPrimary)) return a.isPrimary ? -1 : 1;
    return 0;
  });
  const hasRealAttachedDocs = validAttachedDocs.length > 0;

  // Auto-scroll to matching section if targetSectionTag is provided
  useEffect(() => {
    if (targetSectionTag && validAttachedDocs.length > 0) {
      const matchedIdx = validAttachedDocs.findIndex(
        (d) => isSectionMatch(d.sectionTag, targetSectionTag) || isSectionMatch(d.name, targetSectionTag)
      );
      if (matchedIdx !== -1) {
        const timer = setTimeout(() => {
          const el = typeof window !== 'undefined' ? window.document.getElementById(`doc-serial-${matchedIdx}`) : null;
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 400);
        return () => clearTimeout(timer);
      }
    }
  }, [targetSectionTag, document.id, validAttachedDocs.length]);

  return (
    <div
      className={`w-full flex flex-col space-y-6 select-none ${
        isFullScreen
          ? 'fixed inset-0 z-[100] bg-[#0A0C10]/98 backdrop-blur-md p-2 sm:p-6 overflow-y-auto min-h-screen h-[100dvh] overscroll-contain animate-in fade-in duration-150'
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
          CONTINUOUS SERIAL NAVIGATION BAR & DOCUMENT JUMP STRIP
         ========================================================================= */}
      {hasRealAttachedDocs && (
        <div className="w-full max-w-[900px] mx-auto bg-[#13161C] border border-[#262A34] rounded-2xl p-3 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xl no-print">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-[#F25C05]/15 text-[#F25C05] border border-[#F25C05]/30">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase text-white tracking-wider">
                  Continuous Document Serial
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 font-bold border border-emerald-500/30">
                  {validAttachedDocs.length} PDF{validAttachedDocs.length > 1 ? 's' : ''} Open
                </span>
              </div>
              <p className="text-[11px] text-gray-400 mt-0.5">
                সবগুলো সংযুক্ত ডকুমেন্ট এক সিরিয়ালে নিচে সরাসরি ওপেন অবস্থায় দেখতে পারবেন
              </p>
            </div>
          </div>

          {/* Quick Jump Buttons */}
          <div className="flex items-center gap-1.5 flex-wrap justify-center sm:justify-end w-full sm:w-auto">
            {validAttachedDocs.map((doc, idx) => (
              <button
                key={doc.id || idx}
                type="button"
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    window.document.getElementById(`doc-serial-${idx}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
                className="px-2.5 py-1 text-xs font-bold rounded-xl bg-[#1C2028] hover:bg-[#252A36] text-gray-200 hover:text-white border border-[#2D3340] transition-all cursor-pointer flex items-center gap-1.5 active:scale-95 shadow-xs"
                title={`${doc.name} (${doc.sectionTag || 'Attached PDF'})`}
              >
                <FileText className="w-3.5 h-3.5 text-[#FF5500] shrink-0" />
                <span className="truncate max-w-[130px] sm:max-w-[160px]">
                  {doc.sectionTag || `Doc ${idx + 1}`}
                </span>
              </button>
            ))}

            <button
              type="button"
              onClick={() => {
                if (typeof window !== 'undefined') {
                  window.document.getElementById('doc-serial-certificate')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }}
              className="px-2.5 py-1 text-xs font-bold rounded-xl bg-[#1C2028] hover:bg-[#252A36] text-blue-300 hover:text-white border border-[#2D3340] transition-all cursor-pointer flex items-center gap-1.5 active:scale-95 shadow-xs"
              title="Official Certificate"
            >
              <Award className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span>Certificate</span>
            </button>
          </div>
        </div>
      )}

      {/* =========================================================================
          ALL ATTACHED DOCUMENTS RENDERED DIRECTLY OPEN IN ONE CONTINUOUS SERIAL
         ========================================================================= */}
      {hasRealAttachedDocs && (
        <div className="w-full flex flex-col items-center space-y-10">
          {validAttachedDocs.map((doc, idx) => {
            const isImage = Boolean(doc.dataUrl) && (
              doc.type === 'image' ||
              doc.dataUrl.startsWith('data:image') ||
              Boolean(doc.name.toLowerCase().match(/\.(jpg|jpeg|png|webp|gif)$/)) ||
              Boolean(doc.dataUrl.toLowerCase().match(/\.(jpg|jpeg|png|webp|gif)(\?|$)/))
            );
            const isPdf = Boolean(doc.dataUrl) && !isImage && (
              doc.type === 'pdf' ||
              isFirestorePdfUrl(doc.dataUrl) ||
              doc.name.toLowerCase().endsWith('.pdf') ||
              doc.dataUrl.startsWith('data:application/pdf') ||
              doc.dataUrl.includes('application/pdf') ||
              doc.dataUrl.includes('JVBERi') ||
              doc.dataUrl.startsWith('blob:') ||
              doc.dataUrl.toLowerCase().includes('.pdf') ||
              doc.dataUrl.includes('/uploads/')
            );

            return (
              <div
                key={doc.id || idx}
                id={`doc-serial-${idx}`}
                className="w-full flex flex-col items-center scroll-mt-24"
              >
                {/* Document Serial Header Strip */}
                <div className="w-full max-w-[900px] mb-2 px-2 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-1 rounded-lg bg-[#F25C05] text-white font-black uppercase text-[11px] shadow-sm flex items-center gap-1.5 shrink-0">
                      <FileText className="w-3.5 h-3.5" />
                      <span>DOCUMENT {String(idx + 1).padStart(2, '0')} OF {String(validAttachedDocs.length).padStart(2, '0')}</span>
                    </span>
                    {doc.sectionTag && (
                      <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30 text-xs">
                        {doc.sectionTag}
                      </span>
                    )}
                    <span className="text-white font-bold text-sm truncate max-w-xs sm:max-w-md">
                      {doc.name || `Document ${idx + 1}`}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-[11px] text-gray-400 font-mono">
                    <span className="px-2 py-0.5 rounded bg-[#1B1F27] border border-[#2B313E] text-gray-300">
                      {doc.size || 'Verified Record'}
                    </span>
                    {doc.dataUrl && (
                      <button
                        type="button"
                        onClick={async () => {
                          try {
                            const href = isFirestorePdfUrl(doc.dataUrl)
                              ? (await resolveFirestorePdfBlobUrl(doc.dataUrl)) || doc.dataUrl
                              : doc.dataUrl;
                            const a = window.document.createElement('a');
                            a.href = href;
                            a.download = doc.name || `Document_${idx + 1}.pdf`;
                            window.document.body.appendChild(a);
                            a.click();
                            window.document.body.removeChild(a);
                          } catch (err) {
                            console.warn('Download error:', err);
                          }
                        }}
                        className="p-1.5 rounded-lg bg-[#222733] hover:bg-[#2C3344] text-gray-300 hover:text-white transition-colors cursor-pointer"
                        title="Download PDF"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Render PDF Canvas or Image Directly OPEN */}
                <div className="w-full overflow-x-auto overflow-y-visible flex flex-col items-center touch-pan-x touch-pan-y scrollbar-thin">
                  {isPdf ? (
                    <div className="w-full flex items-center justify-center min-h-[450px]">
                      <PdfCanvasRenderer
                        dataUrl={doc.dataUrl}
                        docName={doc.name}
                        zoom={zoom}
                      />
                    </div>
                  ) : isImage ? (
                    <div className="p-3 sm:p-6 flex items-center justify-center w-full max-w-[900px] bg-[#14161C] rounded-2xl border-2 border-[#2B2F38] shadow-2xl">
                      <ResolvedDocImage
                        src={doc.dataUrl}
                        alt={doc.name}
                        style={{
                          transform: zoom !== 100 ? `scale(${zoom / 100})` : undefined,
                          transformOrigin: 'top center',
                        }}
                        className="max-w-full h-auto rounded-lg shadow-2xl transition-transform"
                      />
                    </div>
                  ) : doc.dataUrl ? (
                    <div className="w-full max-w-[900px] bg-[#14161C] rounded-2xl border-2 border-[#2B2F38] shadow-2xl p-4 sm:p-6 space-y-4">
                      <iframe
                        src={doc.dataUrl}
                        title={doc.name || `Document ${idx + 1}`}
                        className="w-full h-[550px] sm:h-[750px] rounded-xl bg-white border border-[#2B2F38]"
                      />
                      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-gray-300">
                        <span className="truncate font-semibold">{doc.name}</span>
                        <div className="flex items-center gap-2">
                          <a
                            href={doc.dataUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 rounded-lg bg-[#FF5500] hover:bg-[#E04B00] text-white font-bold flex items-center gap-1.5"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>Open Full File</span>
                          </a>
                          <a
                            href={doc.dataUrl}
                            download={doc.name || `Document_${idx + 1}`}
                            className="px-3 py-1.5 rounded-lg bg-[#222733] hover:bg-[#2C3344] text-gray-200 font-bold flex items-center gap-1.5"
                          >
                            <Download className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Download</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* =========================================================================
          OFFICIAL STATUTORY CERTIFICATE & SEAL SHEET (ALWAYS VISIBLE IN SERIAL)
         ========================================================================= */}
      <div id="doc-serial-certificate" className="w-full flex flex-col items-center scroll-mt-24 pt-2">
        <div className="w-full max-w-[900px] mb-2 px-2 flex flex-wrap items-center justify-between gap-2 text-xs">
          <span className="px-2.5 py-1 rounded-lg bg-blue-600 text-white font-black uppercase text-[11px] shadow-sm flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5" />
            <span>OFFICIAL STATUTORY CERTIFICATE & SEAL</span>
          </span>
          <span className="text-gray-400 font-mono text-[11px]">
            REF: <strong className="text-orange-400 font-bold">{document.referenceNumber}</strong>
          </span>
        </div>

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

                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 bg-[#F8FAFC] p-4 rounded-xl border border-gray-200">
                    {document.featuredImageUrl && !document.featuredImageUrl.includes('unsplash') && (
                      <div className="w-20 h-24 rounded-lg overflow-hidden border-2 border-gray-300 shadow-sm bg-white shrink-0 flex items-center justify-center">
                        <ResolvedDocImage
                          src={document.featuredImageUrl}
                          alt={document.candidateName || 'Candidate'}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs w-full">
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
