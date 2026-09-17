import React from 'react';
import { ApplicantProfile } from '../../../types/portal';
import { ShieldCheck, User, Calendar, Flag, FileText, CheckCircle } from 'lucide-react';

interface DocumentProps {
  profile: ApplicantProfile;
}

export const ApplicationFormDoc: React.FC<DocumentProps> = ({ profile }) => {
  return (
    <div className="bg-white text-gray-900 font-sans p-6 sm:p-10 max-w-4xl mx-auto border border-gray-300 shadow-sm relative overflow-hidden print:p-0 print:border-none">
      {/* Official Watermark Background */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] select-none">
        <span className="text-9xl font-black rotate-[-30deg] tracking-widest text-[#002B49]">
          DVS VERIFIED
        </span>
      </div>

      {/* Official Header */}
      <div className="border-b-2 border-[#002B49] pb-5 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-[#002B49] text-white flex items-center justify-center font-bold text-xs rounded-sm">
            DHA
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
              Australian Government • Department of Home Affairs
            </div>
            <h1 className="text-xl font-black tracking-tight text-[#002B49]">
              Form 1419 / 482 - Primary Visa Application
            </h1>
            <p className="text-xs text-gray-600">
              Departmental Lodgement Schedule & Client Identification Record
            </p>
          </div>
        </div>

        <div className="text-right">
          <div className="text-[10px] uppercase font-bold text-gray-400">Application Reference</div>
          <div className="font-mono text-sm font-black text-[#002B49]">{profile.referenceNumber}</div>
          <div className="text-[10px] text-gray-500 mt-0.5">Lodgement: {profile.applicationDate}</div>
        </div>
      </div>

      {/* Section 1: Required Core Client Identifiers (Name, Nationality, Document Number, Date of Birth, Document Issue Date) */}
      <div className="mb-6">
        <div className="bg-[#002B49] text-white text-xs font-bold uppercase px-3 py-1.5 flex items-center justify-between mb-3">
          <span>Part A: Verified Personal & Travel Document Identifiers</span>
          <span className="text-[#FFCD00] text-[10px]">DVS Biometric Match: PASSED</span>
        </div>

        <div className="border border-gray-300 rounded-sm overflow-hidden text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-gray-200 bg-gray-50/50">
            <div className="p-3">
              <span className="text-[10px] uppercase font-bold text-gray-500 block mb-1">1. Full Legal Name (as in Travel Document)</span>
              <span className="text-sm font-extrabold text-gray-900 font-serif">{profile.fullName}</span>
            </div>
            <div className="p-3">
              <span className="text-[10px] uppercase font-bold text-gray-500 block mb-1">2. Nationality / Country of Citizenship</span>
              <span className="text-sm font-bold text-gray-900">{profile.nationality}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-gray-200 border-t border-gray-200">
            <div className="p-3">
              <span className="text-[10px] uppercase font-bold text-gray-500 block mb-1">3. Travel Document / Passport No.</span>
              <span className="text-sm font-mono font-black text-[#002B49]">{profile.documentNumber}</span>
            </div>
            <div className="p-3">
              <span className="text-[10px] uppercase font-bold text-gray-500 block mb-1">4. Date of Birth</span>
              <span className="text-sm font-bold text-gray-900">{profile.dateOfBirth}</span>
            </div>
            <div className="p-3">
              <span className="text-[10px] uppercase font-bold text-gray-500 block mb-1">5. Document Issue Date</span>
              <span className="text-sm font-bold text-gray-900">{profile.documentIssueDate}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-gray-200 border-t border-gray-200 bg-gray-50/30">
            <div className="p-3">
              <span className="text-[10px] uppercase font-bold text-gray-500 block mb-0.5">Document Expiry Date</span>
              <span className="font-semibold text-gray-800">{profile.documentExpiryDate}</span>
            </div>
            <div className="p-3">
              <span className="text-[10px] uppercase font-bold text-gray-500 block mb-0.5">Primary Employer / ED Reference</span>
              <span className="font-mono font-bold text-[#C88A24]">{profile.edNumber}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: Visa Stream & Occupational Nomination */}
      <div className="mb-6">
        <div className="bg-[#002B49] text-white text-xs font-bold uppercase px-3 py-1.5 flex items-center justify-between mb-3">
          <span>Part B: Nominated Occupation & Sponsoring Entity</span>
          <span className="text-[10px] text-gray-300">Schedule 2 Criteria</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3 border border-gray-200 rounded-sm">
            <span className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Nominated Occupation</span>
            <div className="font-bold text-gray-900 text-sm">{profile.nominatedOccupation}</div>
            <div className="text-gray-500 font-mono mt-0.5">ANZSCO Code: {profile.anzscoCode}</div>
          </div>

          <div className="p-3 border border-gray-200 rounded-sm">
            <span className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Visa Subclass & Stream</span>
            <div className="font-bold text-gray-900 text-sm">{profile.visaSubclass}</div>
            <div className="text-gray-500 mt-0.5">{profile.visaStream}</div>
          </div>
        </div>

        <div className="mt-3 p-3 border border-gray-200 rounded-sm bg-[#F9FAFB] text-xs">
          <span className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Approved Business Sponsor (Nomination ID)</span>
          <div className="font-bold text-gray-900">{profile.sponsorName}</div>
          <div className="text-gray-500 font-mono mt-0.5">Australian Business Number (ABN): {profile.sponsorAbn}</div>
        </div>
      </div>

      {/* Section 3: Statutory Declaration & Departmental Seal */}
      <div className="pt-4 border-t-2 border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-gray-600">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full border-2 border-dashed border-[#002B49] flex items-center justify-center p-1 text-center text-[9px] font-bold text-[#002B49]">
            DVS SEAL
          </div>
          <div>
            <div className="font-bold text-gray-900">Commonwealth Department of Home Affairs</div>
            <div className="text-[11px] text-gray-500">Electronically validated via ImmiAccount DVS gateway</div>
          </div>
        </div>

        <div className="text-right font-mono text-[11px]">
          <div>Hash: SHA256-DHA-{profile.referenceNumber.replace('-', '')}</div>
          <div className="text-emerald-700 font-bold flex items-center justify-end gap-1 mt-0.5">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Digital Authentication Valid</span>
          </div>
        </div>
      </div>
    </div>
  );
};
