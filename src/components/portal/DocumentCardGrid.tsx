import React, { useState } from 'react';
import { ApplicantProfile, DocumentType } from '../../types/portal';
import {
  FileText,
  Eye,
  Search,
  CheckCircle2,
  ShieldCheck,
  Building2,
  Calendar,
  DollarSign,
  HeartPulse,
  Receipt,
  Award,
  ArrowRight,
  Plane,
  Sparkles,
  ExternalLink,
  Lock,
} from 'lucide-react';

interface DocumentCardGridProps {
  profile: ApplicantProfile;
  onOpenDocument: (type: DocumentType) => void;
  onOpenPositiveList?: () => void;
}

interface VerificationItem {
  id: string;
  title: string;
  actionText: string;
  subtitle: string;
  code: string;
  badge: string;
  badgeColor: 'blue' | 'amber' | 'emerald' | 'purple' | 'teal' | 'gold';
  icon: React.ReactNode;
  requirementHint?: string;
  isPositiveList?: boolean;
  docType?: DocumentType;
}

export const DocumentCardGrid: React.FC<DocumentCardGridProps> = ({
  profile,
  onOpenDocument,
  onOpenPositiveList,
}) => {
  const [searchDocQuery, setSearchDocQuery] = useState('');

  // Row 1: Application & Job Verification
  const row1Items: VerificationItem[] = [
    {
      id: 'row1-app-form',
      title: 'View Application Form (রেফারেন্স নম্বর লাগবে)',
      actionText: 'View Application Form',
      subtitle: 'Official Form 1419 / Immi-482 verified bio-identity, passport & biometric record.',
      code: 'IMM-APP-01',
      badge: 'রেফারেন্স নম্বর লাগবে',
      badgeColor: 'blue',
      requirementHint: `Ref: ${profile.referenceNumber}`,
      docType: 'application-form',
      icon: <FileText className="w-5 h-5 text-blue-600" />,
    },
    {
      id: 'row1-job-acc',
      title: 'View Job Acceptance Letter (ED নম্বর লাগবে)',
      actionText: 'View Job Acceptance Letter',
      subtitle: 'Corporate acceptance confirmation certifying nominated role acceptance.',
      code: 'EMP-ACC-02',
      badge: 'ED নম্বর লাগবে',
      badgeColor: 'amber',
      requirementHint: `ED: ${profile.edNumber}`,
      docType: 'job-acceptance',
      icon: <Building2 className="w-5 h-5 text-amber-600" />,
    },
    {
      id: 'row1-emp-offer',
      title: 'Employment Offer Letter',
      actionText: 'View Employment Offer Letter',
      subtitle: 'Detailed commercial employment agreement, base salary, 11.5% super & FIFO roster.',
      code: 'EMP-OFF-03',
      badge: 'Remuneration & Contract',
      badgeColor: 'emerald',
      requirementHint: `ED: ${profile.edNumber}`,
      docType: 'employment-offer',
      icon: <DollarSign className="w-5 h-5 text-emerald-600" />,
    },
    {
      id: 'row1-job-confirm',
      title: 'Job Confirmation Letter',
      actionText: 'View Job Confirmation Letter',
      subtitle: 'Departmental appointment confirmation certifying standard business sponsorship obligations.',
      code: 'EMP-CNF-04',
      badge: 'Sponsorship Direct',
      badgeColor: 'purple',
      requirementHint: 'Migration Act 1958 Compliant',
      docType: 'job-confirmation',
      icon: <Award className="w-5 h-5 text-indigo-600" />,
    },
  ];

  // Row 2: Legal, Tax & Work Permits
  const row2Items: VerificationItem[] = [
    {
      id: 'row2-work-permit',
      title: 'View Work Permit',
      actionText: 'View Work Permit',
      subtitle: 'Commonwealth of Australia Department of Home Affairs official Work Authorization Certificate.',
      code: 'DVS-WRK-08',
      badge: 'Condition 8107 Verified',
      badgeColor: 'teal',
      requirementHint: 'DVS Online Verified',
      docType: 'work-permit',
      icon: <ShieldCheck className="w-5 h-5 text-teal-600" />,
    },
    {
      id: 'row2-income-tax',
      title: 'View Income Tax Returned Certificate',
      actionText: 'View Income Tax Returned Certificate',
      subtitle: 'Australian Taxation Office (ATO) Notice of Assessment & PAYG Withholding lodgement certificate.',
      code: 'ATO-ITR-07A',
      badge: 'ATO PAYG Assessment',
      badgeColor: 'emerald',
      requirementHint: `TFN: ${profile.tfnNumber}`,
      docType: 'income-tax',
      icon: <Receipt className="w-5 h-5 text-emerald-700" />,
    },
    {
      id: 'row2-tax-cert',
      title: 'View Tax Returned Certificate',
      actionText: 'View Tax Returned Certificate',
      subtitle: 'Verified ATO certified individual tax return compliance statement & lodgement receipt.',
      code: 'ATO-TRC-07B',
      badge: 'ATO Certified Statement',
      badgeColor: 'blue',
      requirementHint: `TFN: ${profile.tfnNumber}`,
      docType: 'tax-certificate',
      icon: <Receipt className="w-5 h-5 text-blue-700" />,
    },
    {
      id: 'row2-positive-list',
      title: 'Positive List for Skilled Work',
      actionText: 'Explore Positive List Section',
      subtitle: 'Australian National Skills Commission official Priority Migration Skilled Occupation List (PMSOL & MLTSSL).',
      code: 'DHA-PLS-00',
      badge: 'Positive List Section',
      badgeColor: 'gold',
      requirementHint: 'ANZSCO Framework 2026/2027',
      isPositiveList: true,
      icon: <Award className="w-5 h-5 text-[#C88A24]" />,
    },
  ];

  // Row 3: Insurance & Visa Status Verification
  const row3Items: VerificationItem[] = [
    {
      id: 'row3-ins-paper',
      title: 'View Insurance Paper',
      actionText: 'View Insurance Paper',
      subtitle: 'Comprehensive Overseas Visitor Health Cover (OVHC) policy certificate satisfying Condition 8501.',
      code: 'INS-PAP-05A',
      badge: 'Condition 8501 Compliant',
      badgeColor: 'emerald',
      requirementHint: 'Bupa / Medibank OVHC Active',
      docType: 'insurance-paper',
      icon: <HeartPulse className="w-5 h-5 text-rose-600" />,
    },
    {
      id: 'row3-travel-ins',
      title: 'View Travel Insurance Letter',
      actionText: 'View Travel Insurance Letter',
      subtitle: 'International travel insurance guarantee covering emergency medical transit & repatriation.',
      code: 'INS-TRV-05B',
      badge: 'Emergency Transit Guarantee',
      badgeColor: 'teal',
      requirementHint: 'Air-Ambulance Evacuation Covered',
      docType: 'travel-insurance',
      icon: <Plane className="w-5 h-5 text-sky-600" />,
    },
    {
      id: 'row3-health-cert',
      title: 'View Health Certificate Letter',
      actionText: 'View Health Certificate Letter',
      subtitle: 'Department of Home Affairs eMedical Clearance report verifying chest X-ray and medical examination.',
      code: 'MED-HAP-06',
      badge: 'eMedical Cleared',
      badgeColor: 'blue',
      requirementHint: `HAP ID: ${profile.hapId}`,
      docType: 'health-certificate',
      icon: <HeartPulse className="w-5 h-5 text-blue-600" />,
    },
    {
      id: 'row3-visa-received',
      title: 'View Visa Application Received Paper',
      actionText: 'View Visa Received Paper',
      subtitle: 'Official DHA Acknowledgement of Application Received, File Number, and Bridging Visa schedule.',
      code: 'DHA-ACK-09',
      badge: 'DHA Acknowledged',
      badgeColor: 'purple',
      requirementHint: `Lodged: ${profile.applicationDate}`,
      docType: 'visa-received',
      icon: <Calendar className="w-5 h-5 text-cyan-600" />,
    },
    {
      id: 'row3-visa-granted',
      title: 'View Visa Granted Paper',
      actionText: 'View Visa Granted Paper',
      subtitle: 'Official Visa Grant Notice with 13-digit Visa Grant Number, stay period, and work rights.',
      code: 'DHA-GRN-10',
      badge: 'Official Grant Notice',
      badgeColor: 'emerald',
      requirementHint: `Grant No: ${profile.visaGrantNumber}`,
      docType: 'visa-granted',
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-600" />,
    },
  ];

  const filterMatches = (item: VerificationItem) => {
    if (!searchDocQuery.trim()) return true;
    const q = searchDocQuery.toLowerCase();
    return (
      item.title.toLowerCase().includes(q) ||
      item.subtitle.toLowerCase().includes(q) ||
      item.code.toLowerCase().includes(q) ||
      item.badge.toLowerCase().includes(q)
    );
  };

  const getBadgeClasses = (color: VerificationItem['badgeColor']) => {
    switch (color) {
      case 'amber':
        return 'bg-amber-100 text-amber-900 border-amber-300';
      case 'blue':
        return 'bg-blue-100 text-blue-900 border-blue-300';
      case 'emerald':
        return 'bg-emerald-100 text-emerald-900 border-emerald-300';
      case 'purple':
        return 'bg-purple-100 text-purple-900 border-purple-300';
      case 'teal':
        return 'bg-teal-100 text-teal-900 border-teal-300';
      case 'gold':
        return 'bg-[#FFF8E6] text-[#8C5D08] border-[#E6B85C] font-extrabold shadow-sm';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const handleCardClick = (item: VerificationItem) => {
    if (item.isPositiveList) {
      if (onOpenPositiveList) {
        onOpenPositiveList();
      } else {
        const el = document.getElementById('positive-list-section');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }
    } else if (item.docType) {
      onOpenDocument(item.docType);
    }
  };

  const renderCard = (item: VerificationItem) => {
    const isSpecialGold = item.isPositiveList;

    return (
      <div
        key={item.id}
        id={`card-${item.id}`}
        className={`rounded-xl border p-4 sm:p-5 flex flex-col justify-between transition-all group ${
          isSpecialGold
            ? 'bg-gradient-to-b from-[#FFFDF5] to-[#FFF8EB] border-[#C88A24] shadow-sm hover:shadow-md hover:border-[#966311] ring-1 ring-[#C88A24]/30'
            : 'bg-white border-gray-200 hover:border-[#002B49] hover:shadow-md'
        }`}
      >
        <div>
          {/* Card Top: Code & Badge */}
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="font-mono text-[11px] font-bold text-gray-600 bg-gray-100 px-2 py-0.5 rounded border border-gray-200">
              {item.code}
            </span>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full border truncate ${getBadgeClasses(
                item.badgeColor
              )}`}
            >
              {item.badge}
            </span>
          </div>

          {/* Icon & Title */}
          <div className="flex items-start gap-3 mb-2.5">
            <div
              className={`p-2 rounded-lg border shrink-0 transition-transform group-hover:scale-105 ${
                isSpecialGold
                  ? 'bg-amber-100/70 border-[#C88A24]/40'
                  : 'bg-gray-50 border-gray-200'
              }`}
            >
              {item.icon}
            </div>
            <div className="min-w-0">
              <h4
                className={`font-bold text-sm leading-snug transition-colors ${
                  isSpecialGold
                    ? 'text-[#694200] group-hover:text-black font-extrabold'
                    : 'text-gray-950 group-hover:text-[#002B49]'
                }`}
              >
                {item.title}
              </h4>
              {item.requirementHint && (
                <div className="text-[11px] font-mono text-gray-500 mt-0.5 flex items-center gap-1">
                  <span>{item.requirementHint}</span>
                </div>
              )}
            </div>
          </div>

          <p className="text-xs text-gray-600 leading-relaxed mb-4 line-clamp-3">
            {item.subtitle}
          </p>
        </div>

        {/* Card Footer: Action Button */}
        <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
          <div className="text-[10px] font-mono font-medium text-gray-400">
            {isSpecialGold ? 'DHA Skilled List' : 'Instant Viewer'}
          </div>

          <button
            type="button"
            onClick={() => handleCardClick(item)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm ${
              isSpecialGold
                ? 'bg-[#C88A24] hover:bg-[#A97017] text-black font-extrabold'
                : 'bg-[#002B49] hover:bg-[#001D33] text-white'
            }`}
          >
            {isSpecialGold ? (
              <>
                <Sparkles className="w-3.5 h-3.5 text-black" />
                <span>Positive List Section</span>
                <ArrowRight className="w-3 h-3 text-black group-hover:translate-x-0.5 transition-transform" />
              </>
            ) : (
              <>
                <Eye className="w-3.5 h-3.5 text-[#FFCD00]" />
                <span>Open File</span>
                <ArrowRight className="w-3 h-3 text-gray-300 group-hover:translate-x-0.5 transition-transform" />
              </>
            )}
          </button>
        </div>
      </div>
    );
  };

  const filteredRow1 = row1Items.filter(filterMatches);
  const filteredRow2 = row2Items.filter(filterMatches);
  const filteredRow3 = row3Items.filter(filterMatches);

  return (
    <section id="verification-document-grid" className="bg-white rounded-xl shadow-sm border border-[#D5D9DE] overflow-hidden mb-8">
      {/* Section Top Header */}
      <div className="bg-[#002B49] text-white p-6 border-b-4 border-[#C88A24]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="text-xs uppercase font-bold text-[#FFCD00] tracking-wider mb-1.5 flex items-center gap-2">
              <Lock className="w-3.5 h-3.5 text-[#FFCD00]" />
              <span>Australian ImmiAccount Document Verification Service (DVS)</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Client Document Verification Records
            </h2>
            <p className="text-xs sm:text-sm text-gray-300 mt-1">
              Reconciled with Reference <strong className="text-white font-mono bg-white/10 px-1.5 py-0.5 rounded">{profile.referenceNumber}</strong> and Employer Directive <strong className="text-[#FFCD00] font-mono bg-white/10 px-1.5 py-0.5 rounded">{profile.edNumber}</strong>.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-[#001D33] px-3.5 py-2 rounded-lg border border-[#0A3D63] text-right">
              <div className="text-[10px] uppercase font-bold text-gray-400">Total Verification Files</div>
              <div className="text-base sm:text-lg font-black text-[#FFCD00]">
                13 Official Verification Items
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter / Quick Search */}
      <div className="p-4 bg-[#F8FAFC] border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchDocQuery}
            onChange={(e) => setSearchDocQuery(e.target.value)}
            placeholder="Search within verification options (e.g. Application Form, Work Permit, Tax, Insurance)..."
            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg text-xs sm:text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#002B49]"
          />
        </div>
        <div className="text-xs text-gray-500 font-medium">
          Showing 3 structured verification lines • Total 13 verification items
        </div>
      </div>

      <div className="p-5 sm:p-7 space-y-8">
        {/* ========================================================================= */}
        {/* ROW 1: Application & Job Verification */}
        {/* ========================================================================= */}
        <div id="row-1-application-job" className="space-y-3.5">
          <div className="flex items-center justify-between border-b-2 border-blue-600 pb-2.5">
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-lg bg-blue-600 text-white font-black text-xs flex items-center justify-center shadow-sm">
                1
              </span>
              <div>
                <h3 className="font-black text-base sm:text-lg text-gray-950 flex items-center gap-2">
                  <span>Row 1: Application & Job Verification</span>
                </h3>
                <p className="text-xs text-gray-500">
                  Form 1419 / Immi-482, employer acceptance directives, remuneration agreements, and sponsorship confirmation.
                </p>
              </div>
            </div>
            <span className="hidden sm:inline-block px-2.5 py-1 rounded bg-blue-50 text-blue-900 border border-blue-200 font-bold text-xs">
              4 Documents
            </span>
          </div>

          {filteredRow1.length === 0 ? (
            <div className="py-6 text-center text-xs text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-300">
              No matching documents in Row 1.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {filteredRow1.map(renderCard)}
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* ROW 2: Legal, Tax & Work Permits */}
        {/* ========================================================================= */}
        <div id="row-2-legal-tax-permits" className="space-y-3.5">
          <div className="flex items-center justify-between border-b-2 border-emerald-600 pb-2.5">
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-lg bg-emerald-700 text-white font-black text-xs flex items-center justify-center shadow-sm">
                2
              </span>
              <div>
                <h3 className="font-black text-base sm:text-lg text-gray-950 flex items-center gap-2">
                  <span>Row 2: Legal, Tax & Work Permits</span>
                </h3>
                <p className="text-xs text-gray-500">
                  Statutory work entitlement authorizations, ATO taxation return lodgements, and Commonwealth Positive List occupations.
                </p>
              </div>
            </div>
            <span className="hidden sm:inline-block px-2.5 py-1 rounded bg-emerald-50 text-emerald-900 border border-emerald-200 font-bold text-xs">
              4 Items (Including Positive List)
            </span>
          </div>

          {filteredRow2.length === 0 ? (
            <div className="py-6 text-center text-xs text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-300">
              No matching documents in Row 2.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {filteredRow2.map(renderCard)}
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* ROW 3: Insurance & Visa Status Verification */}
        {/* ========================================================================= */}
        <div id="row-3-insurance-visa-status" className="space-y-3.5">
          <div className="flex items-center justify-between border-b-2 border-purple-600 pb-2.5">
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-lg bg-purple-700 text-white font-black text-xs flex items-center justify-center shadow-sm">
                3
              </span>
              <div>
                <h3 className="font-black text-base sm:text-lg text-gray-950 flex items-center gap-2">
                  <span>Row 3: Insurance & Visa Status Verification</span>
                </h3>
                <p className="text-xs text-gray-500">
                  Condition 8501 health cover, international emergency travel insurance letters, eMedical clearance, and visa grant files.
                </p>
              </div>
            </div>
            <span className="hidden sm:inline-block px-2.5 py-1 rounded bg-purple-50 text-purple-900 border border-purple-200 font-bold text-xs">
              5 Verification Documents
            </span>
          </div>

          {filteredRow3.length === 0 ? (
            <div className="py-6 text-center text-xs text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-300">
              No matching documents in Row 3.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {filteredRow3.map(renderCard)}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
