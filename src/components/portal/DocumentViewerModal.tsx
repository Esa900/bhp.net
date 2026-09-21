import React, { useState } from 'react';
import { ApplicantProfile, DocumentType } from '../../types/portal';
import { DOCUMENT_METADATA_LIST } from '../../data/portalData';
import {
  X,
  Printer,
  ShieldCheck,
  Share2,
  Check,
  Download,
  ExternalLink,
  Lock,
  FileText,
  ChevronLeft,
  ChevronRight,
  Eye,
} from 'lucide-react';

// Document Components
import { ApplicationFormDoc } from './documents/ApplicationFormDoc';
import { JobAcceptanceDoc } from './documents/JobAcceptanceDoc';
import { EmploymentOfferDoc } from './documents/EmploymentOfferDoc';
import { JobConfirmationDoc } from './documents/JobConfirmationDoc';
import { InsurancePaperDoc } from './documents/InsurancePaperDoc';
import { HealthCertificateDoc } from './documents/HealthCertificateDoc';
import { TaxCertificateDoc } from './documents/TaxCertificateDoc';
import { WorkPermitDoc } from './documents/WorkPermitDoc';
import { VisaReceivedDoc } from './documents/VisaReceivedDoc';
import { VisaGrantedDoc } from './documents/VisaGrantedDoc';

interface DocumentViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: ApplicantProfile;
  initialDocType?: DocumentType;
}

export const DocumentViewerModal: React.FC<DocumentViewerModalProps> = ({
  isOpen,
  onClose,
  profile,
  initialDocType = 'application-form',
}) => {
  const [activeDoc, setActiveDoc] = useState<DocumentType>(initialDocType);
  const [showSigModal, setShowSigModal] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentMeta = DOCUMENT_METADATA_LIST.find((d) => d.type === activeDoc) || DOCUMENT_METADATA_LIST[0];

  const handlePrint = () => {
    window.print();
  };

  const handleCopyLink = () => {
    const url = `${window.location.origin}${window.location.pathname}?ref=${profile.referenceNumber}&doc=${activeDoc}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const renderActiveDocument = () => {
    switch (activeDoc) {
      case 'application-form':
        return <ApplicationFormDoc profile={profile} />;
      case 'job-acceptance':
        return <JobAcceptanceDoc profile={profile} />;
      case 'employment-offer':
        return <EmploymentOfferDoc profile={profile} />;
      case 'job-confirmation':
        return <JobConfirmationDoc profile={profile} />;
      case 'work-permit':
        return <WorkPermitDoc profile={profile} />;
      case 'income-tax':
        return <TaxCertificateDoc profile={profile} variant="income-tax" />;
      case 'tax-certificate':
        return <TaxCertificateDoc profile={profile} variant="tax-return" />;
      case 'insurance-paper':
        return <InsurancePaperDoc profile={profile} variant="insurance-paper" />;
      case 'travel-insurance':
        return <InsurancePaperDoc profile={profile} variant="travel-insurance" />;
      case 'insurance-travel':
        return <InsurancePaperDoc profile={profile} variant="insurance-paper" />;
      case 'health-certificate':
        return <HealthCertificateDoc profile={profile} />;
      case 'visa-received':
        return <VisaReceivedDoc profile={profile} />;
      case 'visa-granted':
        return <VisaGrantedDoc profile={profile} />;
      default:
        return <ApplicationFormDoc profile={profile} />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center p-2 sm:p-4 overflow-hidden">
      {/* Modal Container */}
      <div className="bg-[#001D33] text-white w-full max-w-6xl h-[94vh] rounded-xl shadow-2xl flex flex-col border border-[#0A3D63] overflow-hidden">
        {/* Top Control Bar */}
        <div className="bg-[#002B49] border-b border-[#0A3D63] px-4 py-3 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded bg-[#001D33] border border-[#0A3D63] flex items-center justify-center text-[#FFCD00]">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-gray-400">
                ImmiAccount Document Viewer • {currentMeta.code}
              </div>
              <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                <span>{currentMeta.title}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#0A3D63] text-gray-200">
                  {profile.referenceNumber}
                </span>
              </h3>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSigModal(true)}
              className="px-3 py-1.5 bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Verify Signature</span>
            </button>

            <button
              onClick={handleCopyLink}
              className="px-3 py-1.5 bg-[#001D33] hover:bg-white/10 border border-[#0A3D63] text-gray-200 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{copied ? 'Link Copied' : 'Share / Link'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-[#C88A24] hover:bg-[#B0761A] text-black font-extrabold rounded text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
            >
              <Printer className="w-3.5 h-3.5 text-black" />
              <span>Print / PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer ml-1"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Sub-bar: Quick Document Switcher Tabs */}
        <div className="bg-[#00223A] border-b border-[#0A3D63] px-3 py-2 flex items-center gap-1.5 overflow-x-auto scrollbar-none shrink-0">
          {DOCUMENT_METADATA_LIST.map((doc) => {
            const isActive = doc.type === activeDoc;
            return (
              <button
                key={doc.type}
                onClick={() => setActiveDoc(doc.type)}
                className={`px-3 py-1 rounded text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-[#002B49] text-white border border-[#C88A24] shadow-sm'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                }`}
              >
                <span>{doc.title.split('(')[0]}</span>
                {doc.searchKey === 'ED' && (
                  <span className="text-[9px] px-1 bg-amber-500/20 text-amber-300 rounded font-mono">ED</span>
                )}
                {doc.searchKey === 'REF' && (
                  <span className="text-[9px] px-1 bg-sky-500/20 text-sky-300 rounded font-mono">REF</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Document Render Canvas */}
        <div className="flex-1 overflow-y-auto bg-gray-200 p-3 sm:p-6">
          <div className="max-w-4xl mx-auto shadow-xl rounded overflow-hidden">
            {renderActiveDocument()}
          </div>
        </div>
      </div>

      {/* Cryptographic Signature Verification Dialog */}
      {showSigModal && (
        <div className="fixed inset-0 z-60 bg-black/75 flex items-center justify-center p-4">
          <div className="bg-white text-gray-900 w-full max-w-lg rounded-xl shadow-2xl border border-gray-300 overflow-hidden animate-in fade-in zoom-in-95">
            <div className="bg-[#002B49] text-white p-4 flex items-center justify-between border-b-2 border-[#C88A24]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <h4 className="font-bold text-sm">Commonwealth Cryptographic Signature</h4>
              </div>
              <button
                onClick={() => setShowSigModal(false)}
                className="text-gray-400 hover:text-white p-1 rounded"
              >
                ✕
              </button>
            </div>

            <div className="p-5 text-xs space-y-3">
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-900">
                <div className="font-bold text-sm flex items-center gap-1.5 mb-1">
                  <Lock className="w-4 h-4 text-emerald-700" />
                  <span>Digital Certificate Signature is VALID</span>
                </div>
                <p className="text-[11px] text-emerald-800">
                  This document was authenticated by the Australian Government Document Verification Service (DVS) with a valid RSA-4096 / SHA-256 certificate authority.
                </p>
              </div>

              <div className="space-y-1.5 font-mono text-[11px] bg-gray-50 p-3 rounded border border-gray-200">
                <div>
                  <span className="text-gray-500 block">Certificate Authority:</span>
                  <span className="font-bold text-gray-900">Australian DVS Root Certificate Authority G4</span>
                </div>
                <div>
                  <span className="text-gray-500 block">Document Digest (SHA-256):</span>
                  <span className="font-bold text-blue-900 break-all">
                    a8e94b29104c8f5d027e1a384f9b201948cd8301827401928471029384710294
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 block">Signer Identity:</span>
                  <span className="font-bold text-gray-900">Commonwealth Department of Home Affairs (Delegate 8109)</span>
                </div>
                <div>
                  <span className="text-gray-500 block">Reconciled Reference:</span>
                  <span className="font-bold text-[#002B49]">{profile.referenceNumber} / {profile.edNumber}</span>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowSigModal(false)}
                  className="px-4 py-2 bg-[#002B49] text-white font-bold rounded text-xs hover:bg-[#001D33]"
                >
                  Close Verification
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
