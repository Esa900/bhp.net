import React, { useState, useRef } from 'react';
import {
  ShieldCheck,
  Check,
  Copy,
  ExternalLink,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  FileText,
  File,
  CheckCircle2,
  Calendar,
  User,
  Building,
  MapPin,
  Award,
  Hash,
  Eye,
  Maximize2,
  Minimize2,
  Lock,
  Sparkles,
} from 'lucide-react';

export interface UnifiedDocumentData {
  country: 'australia' | 'canada';
  title: string;
  category: string;
  refNumber: string;
  candidateName: string;
  passportNumber: string;
  nationality: string;
  dateOfBirth?: string;
  jobTitle: string;
  employerName: string;
  workLocation: string;
  salaryOrWage: string;
  workingHours?: string;
  status: string;
  issueDate: string;
  expiryDate: string;
  officialDocNumber?: string;
  lmiaNumber?: string;
  visaSubclass?: string;
  verificationIdNo?: string;
  transitionIdNo?: string;
  notes?: string;
  // Attached files uploaded by admin
  attachedDocuments?: {
    id: string;
    name: string;
    size?: string;
    type?: 'pdf' | 'image' | 'other';
    dataUrl: string;
  }[];
}

interface FullDocumentPdfSheetProps {
  data: UnifiedDocumentData;
  onResetSearch: () => void;
}

export const FullDocumentPdfSheet: React.FC<FullDocumentPdfSheetProps> = ({
  data,
  onResetSearch,
}) => {
  const [zoom, setZoom] = useState<number>(100);
  const [copied, setCopied] = useState(false);
  const [activeViewTab, setActiveViewTab] = useState<'certificate' | 'attached-file'>('certificate');
  const [selectedAttachedDocIndex, setSelectedAttachedDocIndex] = useState<number>(0);
  const sheetRef = useRef<HTMLDivElement>(null);

  const hasAttachedDocs = data.attachedDocuments && data.attachedDocuments.length > 0;
  const currentAttachedDoc = hasAttachedDocs ? data.attachedDocuments![selectedAttachedDocIndex] : null;

  const handleCopyRef = () => {
    navigator.clipboard.writeText(data.refNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isAustralia = data.country === 'australia';

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* =========================================================================
          TOP ACTION & CONTROL TOOLBAR (Print, Download, Zoom, Copy, Tabs)
         ========================================================================= */}
      <div className="bg-[#181A1E] border border-[#2D313A] rounded-2xl p-3 sm:p-4 flex flex-wrap items-center justify-between gap-3 text-xs shadow-lg print:hidden">
        {/* Left: View Tabs if attachments exist */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveViewTab('certificate')}
            className={`px-3.5 py-2 rounded-xl font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeViewTab === 'certificate'
                ? isAustralia
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'bg-red-600 text-white shadow-md shadow-red-600/30'
                : 'bg-[#22252C] text-gray-300 hover:text-white hover:bg-[#2A2E37]'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Official Full PDF Certificate (পূর্ণাঙ্গ ডকুমেন্ট)</span>
          </button>

          {hasAttachedDocs && (
            <button
              type="button"
              onClick={() => setActiveViewTab('attached-file')}
              className={`px-3.5 py-2 rounded-xl font-bold flex items-center gap-2 transition-all cursor-pointer ${
                activeViewTab === 'attached-file'
                  ? isAustralia
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'bg-red-600 text-white shadow-md shadow-red-600/30'
                  : 'bg-[#22252C] text-gray-300 hover:text-white hover:bg-[#2A2E37]'
              }`}
            >
              <File className="w-4 h-4" />
              <span>Attached Original File ({data.attachedDocuments!.length})</span>
            </button>
          )}
        </div>

        {/* Right: Zoom & Export Controls */}
        <div className="flex items-center gap-2">
          {/* Zoom Controls */}
          <div className="hidden sm:flex items-center gap-1 bg-[#121316] p-1 rounded-xl border border-[#2B2F38]">
            <button
              type="button"
              onClick={() => setZoom((prev) => Math.max(prev - 15, 60))}
              disabled={zoom <= 60}
              className="p-1.5 rounded-lg text-gray-300 hover:text-white hover:bg-[#22252C] disabled:opacity-30 cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="px-2 font-mono text-[11px] font-bold text-gray-300 min-w-[44px] text-center">
              {zoom}%
            </span>
            <button
              type="button"
              onClick={() => setZoom((prev) => Math.min(prev + 15, 150))}
              disabled={zoom >= 150}
              className="p-1.5 rounded-lg text-gray-300 hover:text-white hover:bg-[#22252C] disabled:opacity-30 cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setZoom(100)}
              className="px-2 py-1 text-[10px] text-gray-400 hover:text-white cursor-pointer"
              title="Reset Zoom"
            >
              100%
            </button>
          </div>

          {/* Copy Ref Button */}
          <button
            type="button"
            onClick={handleCopyRef}
            className="px-3 py-2 bg-[#22252C] hover:bg-[#2C313B] text-gray-200 hover:text-white rounded-xl font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-[#343844]"
            title="Copy Reference Number"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-bold">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-gray-400" />
                <span>Copy Ref</span>
              </>
            )}
          </button>

          {/* Search Another button */}
          <button
            type="button"
            onClick={onResetSearch}
            className="px-3 py-2 text-gray-400 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden md:inline">New Search</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          VIEW TAB A: OFFICIAL FULL A4 PDF CERTIFICATE SHEET
         ========================================================================= */}
      {activeViewTab === 'certificate' && (
        <div className="flex justify-center overflow-x-auto pb-6">
          <div
            ref={sheetRef}
            style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }}
            className={`w-full max-w-[850px] min-h-[1100px] bg-white text-[#111827] shadow-2xl rounded-sm p-8 sm:p-14 relative font-sans border-2 ${
              isAustralia ? 'border-[#002B49]' : 'border-[#C52028]'
            } transition-transform duration-150 print:m-0 print:p-8 print:shadow-none print:transform-none print:border-none`}
          >
            {/* Background Security Watermark */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.035] select-none overflow-hidden">
              <div className="text-center transform -rotate-45 text-8xl sm:text-9xl font-black uppercase tracking-widest font-serif">
                {isAustralia ? 'COMMONWEALTH OF AUSTRALIA' : 'GOVERNMENT OF CANADA'}
                <div className="text-4xl sm:text-6xl mt-6">OFFICIAL VERIFIED</div>
              </div>
            </div>

            {/* Top Ornamental Gold/Navy Ribbon */}
            <div
              className={`h-2.5 w-full rounded-sm mb-6 ${
                isAustralia
                  ? 'bg-gradient-to-r from-[#002B49] via-[#FFCD00] to-[#002B49]'
                  : 'bg-gradient-to-r from-[#C52028] via-[#FFD700] to-[#C52028]'
              }`}
            />

            {/* Official Header with Coat of Arms & Seal */}
            <div className="border-b-2 border-gray-300 pb-6 mb-6 flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4 text-center sm:text-left">
              <div className="flex items-center gap-4">
                <div
                  className={`w-16 h-16 rounded-xl flex items-center justify-center text-white font-bold shadow-md shrink-0 ${
                    isAustralia
                      ? 'bg-[#002B49] border-2 border-[#FFCD00]'
                      : 'bg-[#C52028] border-2 border-[#FFD700]'
                  }`}
                >
                  <ShieldCheck className="w-9 h-9 text-[#FFCD00]" />
                </div>
                <div>
                  <div className="text-[11px] font-black uppercase tracking-widest text-gray-600">
                    {isAustralia
                      ? 'Commonwealth of Australia • Department of Home Affairs & Immigration'
                      : 'Government of Canada • Immigration, Refugees and Citizenship Canada (IRCC)'}
                  </div>
                  <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[#0F172A] mt-0.5">
                    {data.title || (isAustralia ? 'Australia Official Work Permit & Visa Certificate' : 'Canada Employment & Work Authorization Certificate')}
                  </h1>
                  <p className="text-xs text-gray-500 font-medium">
                    {isAustralia
                      ? 'Statutory Visa Entitlement & Skilled Occupation Clearance Record'
                      : 'Labour Market Impact & Global Skills Strategy Clearance Record'}
                  </p>
                </div>
              </div>

              {/* Barcode & Reference Stamp */}
              <div className="text-center sm:text-right shrink-0">
                <div className="font-mono text-[10px] text-gray-400 uppercase tracking-wider">
                  Reference / Verification ID
                </div>
                <div
                  className={`font-mono text-base sm:text-lg font-black tracking-wider ${
                    isAustralia ? 'text-[#002B49]' : 'text-[#C52028]'
                  }`}
                >
                  {data.refNumber}
                </div>
                <div className="inline-flex items-center gap-1 px-2.5 py-0.5 mt-1 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>STATUS: {data.status?.toUpperCase() || 'VERIFIED & ACTIVE'}</span>
                </div>
              </div>
            </div>

            {/* Official Accreditation Banner */}
            <div
              className={`p-4 rounded-xl text-white mb-6 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md ${
                isAustralia
                  ? 'bg-gradient-to-r from-[#002B49] via-[#0A3D63] to-[#001D33]'
                  : 'bg-gradient-to-r from-[#8B0000] via-[#C52028] to-[#600000]'
              }`}
            >
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#FFCD00] block mb-0.5">
                  Official Verification Determination
                </span>
                <h2 className="text-base sm:text-lg font-black text-white">
                  UNRESTRICTED OFFICIAL SKILLED WORK AUTHORIZATION
                </h2>
                <p className="text-xs text-gray-200">
                  Authorized under statutory bilateral agreements for {data.employerName || 'BHP Global Operations'}.
                </p>
              </div>

              <div className="px-3 py-1.5 bg-black/30 border border-white/20 rounded-lg text-center shrink-0">
                <span className="text-[10px] block text-gray-300">Authentication</span>
                <span className="font-mono text-xs font-bold text-amber-300">SECURITY CLEARED</span>
              </div>
            </div>

            {/* Candidate & Identification Details Grid */}
            <div className="mb-6 space-y-3">
              <div className="text-xs font-black uppercase tracking-wider text-gray-700 flex items-center gap-2 border-b border-gray-200 pb-1.5">
                <User className="w-4 h-4 text-gray-600" />
                <span>Candidate / Worker Identification Credentials</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <span className="text-[10px] text-gray-500 uppercase block font-semibold">Candidate Full Name</span>
                  <strong className="text-gray-900 font-bold text-sm block truncate">
                    {data.candidateName || 'N/A'}
                  </strong>
                </div>

                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <span className="text-[10px] text-gray-500 uppercase block font-semibold">Passport Number</span>
                  <strong className="font-mono text-gray-900 font-bold text-sm block truncate">
                    {data.passportNumber || 'N/A'}
                  </strong>
                </div>

                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <span className="text-[10px] text-gray-500 uppercase block font-semibold">Nationality</span>
                  <span className="text-gray-900 font-bold text-sm block truncate">
                    {data.nationality || 'Bangladeshi'}
                  </span>
                </div>

                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <span className="text-[10px] text-gray-500 uppercase block font-semibold">Date of Birth</span>
                  <span className="font-mono text-gray-900 font-bold text-sm block truncate">
                    {data.dateOfBirth || '1993-01-01'}
                  </span>
                </div>
              </div>
            </div>

            {/* Employment, Sponsor & Position Table */}
            <div className="mb-6 space-y-3">
              <div className="text-xs font-black uppercase tracking-wider text-gray-700 flex items-center gap-2 border-b border-gray-200 pb-1.5">
                <Building className="w-4 h-4 text-gray-600" />
                <span>Employment, Sponsor & Location Authorizations</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <span className="text-[10px] text-gray-500 uppercase block font-semibold">Designated Job Title</span>
                  <strong className="text-gray-900 font-bold text-sm block">{data.jobTitle || 'N/A'}</strong>
                </div>

                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <span className="text-[10px] text-gray-500 uppercase block font-semibold">Sponsoring Entity</span>
                  <strong className="text-gray-900 font-bold text-sm block">{data.employerName || 'BHP Operations'}</strong>
                </div>

                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <span className="text-[10px] text-gray-500 uppercase block font-semibold">Work Location / Region</span>
                  <span className="text-gray-900 font-bold text-sm block">{data.workLocation || 'Perth, WA / Saskatoon, SK'}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <span className="text-[10px] text-gray-500 uppercase block font-semibold">Remuneration / Wage</span>
                  <strong className="font-mono text-emerald-700 font-bold text-sm block">
                    {data.salaryOrWage || '$135,000 AUD / $38.50 CAD/hr'}
                  </strong>
                </div>

                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <span className="text-[10px] text-gray-500 uppercase block font-semibold">Category / Subclass</span>
                  <span className="font-mono text-gray-900 font-bold text-sm block truncate">
                    {data.visaSubclass || data.category || 'Work Permit'}
                  </span>
                </div>

                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <span className="text-[10px] text-gray-500 uppercase block font-semibold">Issue Date</span>
                  <span className="font-mono text-gray-900 font-semibold text-sm block">
                    {data.issueDate || '2026-01-15'}
                  </span>
                </div>

                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <span className="text-[10px] text-gray-500 uppercase block font-semibold">Expiry / Validity</span>
                  <span className="font-mono text-emerald-700 font-bold text-sm block">
                    {data.expiryDate || '2028-12-31'}
                  </span>
                </div>
              </div>
            </div>

            {/* Official Notes / Statutory Terms */}
            {data.notes && (
              <div className="mb-6 p-4 rounded-xl bg-gray-50 border border-gray-200 text-xs">
                <span className="font-bold text-gray-800 block mb-1">Official Directives & Conditions:</span>
                <p className="text-gray-700 leading-relaxed font-serif whitespace-pre-line">{data.notes}</p>
              </div>
            )}

            {/* Barcode, Hologram Stamp & Signatures */}
            <div className="pt-6 border-t-2 border-gray-300 grid grid-cols-1 sm:grid-cols-3 gap-6 items-end mt-8">
              {/* Official Barcode */}
              <div className="space-y-1">
                <div className="text-[10px] font-mono text-gray-500 tracking-wider">ELECTRONIC BARCODE</div>
                <div className="font-mono text-xs tracking-widest bg-gray-100 p-2 rounded border border-gray-300 text-center font-bold">
                  ||||| | |||| ||| ||||| |||| || |||||
                  <div className="text-[9px] mt-0.5 text-gray-600">*{data.refNumber}*</div>
                </div>
              </div>

              {/* Official Embossed Stamp */}
              <div className="flex flex-col items-center text-center">
                <div
                  className={`w-24 h-24 rounded-full border-4 flex flex-col items-center justify-center p-1 shadow-inner select-none ${
                    isAustralia
                      ? 'border-[#002B49] text-[#002B49] bg-blue-50/50'
                      : 'border-[#C52028] text-[#C52028] bg-red-50/50'
                  }`}
                >
                  <Award className="w-6 h-6 mb-0.5" />
                  <span className="text-[8px] font-black uppercase tracking-tighter leading-tight">
                    {isAustralia ? 'AUSTRALIA IMMIGRATION' : 'IRCC CANADA'}
                  </span>
                  <span className="text-[7px] font-bold">OFFICIAL VERIFIED</span>
                  <span className="text-[8px] font-mono font-black">2026-2028</span>
                </div>
              </div>

              {/* Authorized Signatures */}
              <div className="text-right space-y-1">
                <div className="font-serif italic text-sm text-gray-800 font-bold border-b border-gray-400 pb-1 inline-block min-w-[140px]">
                  J. R. Harrison, Delegate
                </div>
                <div className="text-[10px] font-bold text-gray-600 uppercase">
                  {isAustralia ? 'Chief Migration Officer' : 'IRCC Senior Accreditation Officer'}
                </div>
                <div className="text-[9px] text-gray-500">
                  Digital Verification Hash: SHA256-{(data.refNumber + data.candidateName).slice(0, 16)}
                </div>
              </div>
            </div>

            {/* Bottom Official Disclaimer */}
            <div className="mt-8 pt-4 border-t border-gray-200 text-[10px] text-gray-400 text-center leading-relaxed">
              This document is issued under authority of the statutory immigration & workforce frameworks. Any unauthorized alteration or reproduction is strictly prohibited and subject to legal prosecution.
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW TAB B: ATTACHED ORIGINAL UPLOADED DOCUMENT FILE
         ========================================================================= */}
      {activeViewTab === 'attached-file' && hasAttachedDocs && (
        <div className="bg-[#1C1E23] border border-[#2D313A] rounded-2xl p-4 sm:p-6 space-y-4">
          {/* File selector tabs if multiple attached docs */}
          {data.attachedDocuments!.length > 1 && (
            <div className="flex flex-wrap gap-2 pb-2 border-b border-[#2C3038]">
              {data.attachedDocuments!.map((doc, idx) => (
                <button
                  key={doc.id}
                  type="button"
                  onClick={() => setSelectedAttachedDocIndex(idx)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
                    selectedAttachedDocIndex === idx
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-[#15171B] text-gray-300 hover:text-white'
                  }`}
                >
                  <File className="w-3.5 h-3.5" />
                  <span>{doc.name}</span>
                </button>
              ))}
            </div>
          )}

          {/* Current Attached Doc Preview */}
          {currentAttachedDoc && (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-[#15171B] p-3 rounded-xl border border-[#272B33]">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{currentAttachedDoc.name}</h4>
                    <div className="text-[11px] text-gray-400 font-mono">
                      <span>{currentAttachedDoc.size || 'Verified Attachment'}</span> · 
                      <span className="uppercase text-blue-400 ml-1">{currentAttachedDoc.type || 'Document'}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={currentAttachedDoc.dataUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-1.5 bg-[#252830] hover:bg-[#323640] text-gray-200 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors"
                    title="Open in new window"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Open in New Tab</span>
                  </a>
                </div>
              </div>

              {/* Embedded Document View */}
              <div className="w-full min-h-[600px] bg-[#121316] rounded-xl border border-[#26282E] overflow-hidden flex items-center justify-center">
                {currentAttachedDoc.dataUrl.startsWith('data:image/') || currentAttachedDoc.type === 'image' ? (
                  <img
                    src={currentAttachedDoc.dataUrl}
                    alt={currentAttachedDoc.name}
                    className="max-w-full max-h-[85vh] object-contain mx-auto rounded"
                  />
                ) : currentAttachedDoc.dataUrl.startsWith('data:application/pdf') || currentAttachedDoc.type === 'pdf' ? (
                  <iframe
                    src={currentAttachedDoc.dataUrl}
                    title={currentAttachedDoc.name}
                    className="w-full h-[750px] border-none rounded-xl"
                  />
                ) : (
                  <div className="text-center p-12 space-y-3">
                    <FileText className="w-12 h-12 text-blue-400 mx-auto" />
                    <p className="text-sm text-gray-300 font-medium">
                      This file can be viewed or opened directly in a new tab.
                    </p>
                    <a
                      href={currentAttachedDoc.dataUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>Open {currentAttachedDoc.name} in New Tab</span>
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
