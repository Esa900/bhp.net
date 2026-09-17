import React from 'react';
import { ShieldCheck, Lock, CheckCircle, FileCode, Server, Award, AlertCircle } from 'lucide-react';

export const SecurityStandardSection: React.FC = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-[#D5D9DE] overflow-hidden mb-8">
      {/* Header */}
      <div className="bg-[#002B49] text-white p-6 border-b-4 border-[#C88A24]">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-white/10 text-xs font-semibold text-[#FFCD00] mb-2">
          <Lock className="w-3.5 h-3.5" />
          <span>Commonwealth Document Verification Service (DVS)</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
          Security & Authenticity Standards
        </h2>
        <p className="text-xs sm:text-sm text-gray-300 mt-1 max-w-3xl">
          Overview of the cryptographic and statutory verification infrastructure securing all Australian visa, employment, and identification records.
        </p>
      </div>

      <div className="p-6 space-y-6 text-xs sm:text-sm text-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1 */}
          <div className="p-4 rounded-xl border border-gray-200 bg-[#F8FAFC]">
            <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center mb-3">
              <Server className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-gray-900 mb-1.5 text-sm">Direct DVS Hub Linkage</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              All documents presented through this portal are verified against primary data sources within the Australian Commonwealth Document Verification Service (DVS), preventing document tampering or forged identity records.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-4 rounded-xl border border-gray-200 bg-[#F8FAFC]">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center mb-3">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-gray-900 mb-1.5 text-sm">Dual Reference Cryptography</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Every document is cross-referenced using both the client's <strong>Reference Number</strong> (e.g. TRN / Visa Ref) and the nominating enterprise's <strong>ED Number</strong> (Employer Declaration ID), ensuring unbroken chain of custody.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-4 rounded-xl border border-gray-200 bg-[#F8FAFC]">
            <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center mb-3">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-gray-900 mb-1.5 text-sm">Statutory Migration Act 1958</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Issued under statutory authority of the Minister for Home Affairs. Sponsorship letters and job confirmations satisfy Fair Work Act 2009 standards and TSMIT income threshold benchmarks.
            </p>
          </div>
        </div>

        {/* Verification Summary Banner */}
        <div className="p-4 rounded-lg bg-blue-50 border border-blue-200 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
          <div className="text-xs text-blue-950 leading-relaxed">
            <strong>Commonwealth Public Verification Notice:</strong> If an employer, airline, or financial institution requires independent verification of any document displayed here, they can verify using the client's Reference Number directly on this portal or via the Commonwealth VEVO service.
          </div>
        </div>
      </div>
    </div>
  );
};
