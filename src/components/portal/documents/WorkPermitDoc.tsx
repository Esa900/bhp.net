import React from 'react';
import { ApplicantProfile } from '../../../types/portal';
import { ShieldCheck, Briefcase, CheckCircle2, User, Building2, Calendar, FileText } from 'lucide-react';

interface DocumentProps {
  profile: ApplicantProfile;
}

export const WorkPermitDoc: React.FC<DocumentProps> = ({ profile }) => {
  return (
    <div className="bg-white text-gray-900 font-sans p-6 sm:p-10 max-w-4xl mx-auto border border-gray-300 shadow-sm relative overflow-hidden print:p-0 print:border-none">
      {/* Official Commonwealth Crest & Header */}
      <div className="border-b-4 border-[#002B49] pb-6 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-[#002B49] text-white flex flex-col items-center justify-center font-bold text-xs rounded-lg shadow-sm border border-[#C88A24]">
            <ShieldCheck className="w-7 h-7 text-[#FFCD00]" />
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-[#002B49]">
              Australian Government • Department of Home Affairs
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[#002B49]">
              Commonwealth Work Authorization Certificate
            </h1>
            <p className="text-xs text-gray-600">
              Statutory Work Entitlement Record under Migration Regulations 1994
            </p>
          </div>
        </div>

        <div className="text-right">
          <div className="text-[10px] uppercase font-bold text-gray-400">Work Permit Card ID</div>
          <div className="font-mono text-sm sm:text-base font-black text-[#002B49]">
            WP-AU-{profile.referenceNumber.replace('REF-', '')}
          </div>
          <div className="text-[10px] text-emerald-700 font-bold mt-0.5">Status: FULL WORK RIGHTS</div>
        </div>
      </div>

      {/* Official Certificate Box */}
      <div className="mb-6 p-4 rounded-lg bg-gradient-to-r from-[#002B49] to-[#0A3D63] text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#FFCD00] block mb-1">
            Official Work Entitlement Determination
          </span>
          <h2 className="text-lg font-black text-white">
            UNRESTRICTED FULL-TIME WORK AUTHORIZATION
          </h2>
          <p className="text-xs text-gray-300">
            Authorized to perform skilled labour for the approved nominating business sponsor.
          </p>
        </div>

        <div className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 px-3.5 py-1.5 rounded-full text-xs font-bold shrink-0">
          Condition 8107 Verified
        </div>
      </div>

      {/* Worker Details Card Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs mb-6">
        <div className="p-4 border border-gray-300 rounded-lg bg-[#F8FAFC] space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block mb-2">
            Permit Holder Credentials
          </span>
          <div className="flex justify-between py-1 border-b border-gray-200">
            <span className="text-gray-500">Legal Name:</span>
            <span className="font-bold text-gray-900">{profile.fullName}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-gray-200">
            <span className="text-gray-500">Date of Birth:</span>
            <span className="font-bold text-gray-900">{profile.dateOfBirth}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-gray-200">
            <span className="text-gray-500">Country of Passport:</span>
            <span className="font-bold text-gray-900">{profile.nationality}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-gray-200">
            <span className="text-gray-500">Document / Passport No:</span>
            <span className="font-mono font-black text-[#002B49]">{profile.documentNumber}</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-gray-500">Document Issue Date:</span>
            <span className="font-semibold text-gray-900">{profile.documentIssueDate}</span>
          </div>
        </div>

        <div className="p-4 border border-gray-300 rounded-lg bg-[#F8FAFC] space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block mb-2">
            Permitted Employment Authorization
          </span>
          <div className="flex justify-between py-1 border-b border-gray-200">
            <span className="text-gray-500">Approved Sponsoring Employer:</span>
            <span className="font-bold text-gray-900 text-right">{profile.sponsorName}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-gray-200">
            <span className="text-gray-500">Employer Declaration (ED):</span>
            <span className="font-mono font-bold text-[#C88A24]">{profile.edNumber}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-gray-200">
            <span className="text-gray-500">Nominated Occupation:</span>
            <span className="font-bold text-[#002B49]">{profile.nominatedOccupation}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-gray-200">
            <span className="text-gray-500">ANZSCO Code:</span>
            <span className="font-mono font-bold text-gray-900">{profile.anzscoCode}</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-gray-500">Permit Validity Period:</span>
            <span className="font-bold text-emerald-700">{profile.grantDate} – {profile.visaExpiryDate}</span>
          </div>
        </div>
      </div>

      {/* Conditions Checklist */}
      <div className="border border-gray-300 rounded overflow-hidden mb-6 text-xs">
        <div className="bg-gray-100 text-gray-800 px-3.5 py-2 font-bold uppercase text-[11px]">
          Statutory Work Rights & Visa Conditions
        </div>
        <div className="p-4 space-y-3">
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-gray-900 font-bold">Condition 8107 – Work Limitation:</strong>
              <p className="text-gray-600 mt-0.5">
                The permit holder is authorized to work full-time exclusively in the nominated occupation for the approved sponsoring employer (BHP Group Limited).
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-gray-900 font-bold">Condition 8501 – Maintain Adequate Health Insurance:</strong>
              <p className="text-gray-600 mt-0.5">
                Must maintain compliant health cover (OVHC) for the entirety of stay in Australia. Validated via Bupa Global.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Commonwealth Seal */}
      <div className="pt-6 border-t-2 border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 text-xs">
        <div>
          <div className="font-bold text-gray-900">National Visa & Work Verification Officer</div>
          <div className="text-gray-500">Department of Home Affairs • Canberra Centre</div>
        </div>

        <div className="text-right font-mono text-[11px]">
          <div className="text-gray-600">DVS Checksum: DVS-WP-{profile.visaGrantNumber}</div>
          <div className="text-emerald-700 font-bold mt-0.5">Electronic Work Rights Active</div>
        </div>
      </div>
    </div>
  );
};
