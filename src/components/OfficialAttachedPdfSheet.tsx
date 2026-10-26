import React from 'react';
import { ShieldCheck, CheckCircle2, FileText, Check, Award, Lock, ExternalLink } from 'lucide-react';
import { UnifiedDocumentData } from './FullPdfDocumentViewer';

interface OfficialAttachedPdfSheetProps {
  document: UnifiedDocumentData;
  zoom?: number;
}

export const OfficialAttachedPdfSheet: React.FC<OfficialAttachedPdfSheetProps> = ({
  document,
  zoom = 100,
}) => {
  const isCanada = document.country === 'canada';
  const isOutside = isCanada ? 'Is the applicant currently outside Canada?' : 'Is the applicant currently outside Australia?';

  // Candidate photo fallback
  const photoUrl =
    document.featuredImageUrl ||
    (document.galleryImages && document.galleryImages[0]) ||
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80';

  return (
    <div
      className="w-full bg-white text-gray-900 rounded-xl shadow-2xl p-4 sm:p-8 font-sans max-w-[850px] mx-auto select-none transition-transform duration-150 origin-top border border-gray-200"
      style={{
        transform: zoom !== 100 ? `scale(${zoom / 100})` : undefined,
        transformOrigin: 'top center',
      }}
      onContextMenu={(e) => e.preventDefault()}
    >
      {/* =========================================================================
          TOP HEADER: BHP LOGO (LEFT) & CANDIDATE PASSPORT PHOTO (RIGHT)
         ========================================================================= */}
      <div className="flex items-start justify-between border-b-2 border-gray-100 pb-5 gap-4">
        {/* Left: BHP Corporate Sign */}
        <div className="flex items-center gap-3">
          <div className="h-16 w-28 sm:h-20 sm:w-36 rounded-lg overflow-hidden bg-gray-100 shadow-sm border border-gray-200 shrink-0">
            <img
              src="https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=500&q=80"
              alt="BHP Corporate"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <span className="text-xl sm:text-2xl font-black text-[#F25C05] tracking-tight uppercase block leading-none">
              BHP
            </span>
            <span className="text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider block mt-1">
              Global Operations & Mobility Desk
            </span>
            <span className="text-[9px] font-mono text-emerald-600 font-bold block mt-0.5">
              AUTHENTICATED ELECTRONIC RECORD
            </span>
          </div>
        </div>

        {/* Right: Candidate Passport Photo */}
        <div className="flex flex-col items-end shrink-0">
          <div className="w-20 h-24 sm:w-24 sm:h-28 rounded-md overflow-hidden border-2 border-gray-300 shadow-md bg-gray-50">
            <img
              src={photoUrl}
              alt={document.candidateName || 'Candidate'}
              className="w-full h-full object-cover"
            />
          </div>
          <span className="text-[9px] font-mono text-gray-400 mt-1 uppercase">
            ID PHOTO VERIFIED
          </span>
        </div>
      </div>

      {/* =========================================================================
          APPLICATION TITLE & REFERENCE NUMBER (MATCHES 1:1 TO LAPTOP SCREENSHOT)
         ========================================================================= */}
      <div className="pt-5 pb-4 flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-gray-100">
        <div>
          <h2 className="text-lg sm:text-2xl font-extrabold text-[#0D244D] tracking-tight">
            Application for a Work Permit (D Category)
          </h2>
          <p className="text-xs text-gray-500 mt-0.5 font-medium">
            Immigration & Corporate Sponsorship Authorization File
          </p>
        </div>

        <div className="text-left sm:text-right shrink-0 bg-gray-50 sm:bg-transparent p-2 sm:p-0 rounded-lg">
          <span className="text-[11px] text-gray-500 font-semibold block uppercase">
            Reference Number:
          </span>
          <span className="text-base sm:text-lg font-mono font-black text-[#0D244D] tracking-wider block">
            {document.referenceNumber}
          </span>
        </div>
      </div>

      {/* Blue Informational Action Links */}
      <div className="py-2.5 flex items-center gap-4 text-xs font-semibold text-[#185ADB]">
        <span className="hover:underline cursor-pointer flex items-center gap-1">
          <span>View Terms and Conditions</span>
        </span>
        <span>•</span>
        <span className="hover:underline cursor-pointer flex items-center gap-1">
          <span>View Privacy statement</span>
        </span>
      </div>

      {/* =========================================================================
          SECTION 1: TERMS AND CONDITIONS (LIGHT BLUE BAR WITH ACCENT STRIP)
         ========================================================================= */}
      <div className="mt-4 space-y-2">
        <div className="bg-[#EBF3FC] border-l-4 border-[#185ADB] px-3.5 py-1.5 rounded-r">
          <h3 className="text-xs sm:text-sm font-bold text-[#0D244D]">
            Terms and Conditions
          </h3>
        </div>

        <div className="px-3.5 py-1.5 space-y-1 text-xs text-gray-700">
          <p className="font-medium text-gray-600">
            I have read and agree to the terms and conditions
          </p>
          <p className="font-extrabold text-[#0D244D] text-sm">
            Yes
          </p>
        </div>
      </div>

      {/* =========================================================================
          SECTION 2: CURRENT LOCATION (LIGHT BLUE BAR WITH ACCENT STRIP)
         ========================================================================= */}
      <div className="mt-4 space-y-2">
        <div className="bg-[#EBF3FC] border-l-4 border-[#185ADB] px-3.5 py-1.5 rounded-r">
          <h3 className="text-xs sm:text-sm font-bold text-[#0D244D]">
            Current location
          </h3>
        </div>

        <div className="px-3.5 py-1.5 space-y-1 text-xs text-gray-700">
          <p className="font-medium text-gray-600">
            {isOutside}
          </p>
          <p className="font-extrabold text-[#0D244D] text-sm">
            Yes
          </p>
        </div>
      </div>

      {/* =========================================================================
          SECTION 3: CANDIDATE & APPLICANT PARTICULARS
         ========================================================================= */}
      <div className="mt-4 space-y-2">
        <div className="bg-[#EBF3FC] border-l-4 border-[#185ADB] px-3.5 py-1.5 rounded-r">
          <h3 className="text-xs sm:text-sm font-bold text-[#0D244D]">
            Applicant Particulars & Work Authorisation
          </h3>
        </div>

        <div className="px-3.5 py-2 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div>
            <span className="text-[10px] uppercase font-bold text-gray-500 block">
              Applicant Name
            </span>
            <span className="text-sm font-bold text-gray-900 block mt-0.5">
              {document.candidateName || 'Authorized Applicant'}
            </span>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-gray-500 block">
              Passport Number
            </span>
            <span className="text-sm font-mono font-bold text-[#F25C05] block mt-0.5">
              {document.passportNumber || 'A99014322'}
            </span>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-gray-500 block">
              Designation / Nominated Category
            </span>
            <span className="text-xs font-semibold text-gray-800 block mt-0.5">
              {document.jobTitle || 'Commercial Transport Driver (D Category)'}
            </span>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-gray-500 block">
              Sponsoring Employer & Station
            </span>
            <span className="text-xs font-semibold text-gray-800 block mt-0.5">
              {document.employerName || 'BHP Global Operations'} ({document.workLocation || 'Calgary, Canada'})
            </span>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-gray-500 block">
              Authorisation Status
            </span>
            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 mt-0.5">
              <Check className="w-3 h-3 text-emerald-600" />
              <span>{document.status || 'Verified & Approved'}</span>
            </span>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-gray-500 block">
              DVS Registry Key
            </span>
            <span className="text-xs font-mono text-gray-600 block mt-0.5">
              {document.verificationId || `VRF-${document.referenceNumber}`}
            </span>
          </div>
        </div>
      </div>

      {/* =========================================================================
          SECTION 4: REGULATORY SEAL & VERIFICATION SIGN-OFF
         ========================================================================= */}
      <div className="mt-6 pt-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-full bg-emerald-100 text-emerald-700 shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <p className="font-bold text-gray-800 text-[11px]">
              Officially Authenticated & Endorsed
            </p>
            <p className="text-[10px] text-gray-500 font-mono">
              Certified electronic document issued under corporate immigration protocol.
            </p>
          </div>
        </div>

        <div className="text-center sm:text-right">
          <span className="font-serif italic font-bold text-gray-800 text-sm block">
            Andrew K. Richardson
          </span>
          <span className="text-[9px] text-gray-400 font-mono uppercase block">
            Authorized Registrar & Delegate • BHP Global
          </span>
        </div>
      </div>
    </div>
  );
};
