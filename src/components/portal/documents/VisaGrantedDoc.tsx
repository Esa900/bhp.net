import React from 'react';
import { ApplicantProfile } from '../../../types/portal';
import { ShieldCheck, CheckCircle2, Award, Calendar, AlertCircle, Lock } from 'lucide-react';

interface DocumentProps {
  profile: ApplicantProfile;
}

export const VisaGrantedDoc: React.FC<DocumentProps> = ({ profile }) => {
  return (
    <div className="bg-white text-gray-900 font-sans p-6 sm:p-10 max-w-4xl mx-auto border border-gray-300 shadow-sm relative overflow-hidden print:p-0 print:border-none">
      {/* Official Department Letterhead */}
      <div className="border-b-4 border-emerald-700 pb-6 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="text-[10px] font-bold uppercase tracking-widest text-[#002B49]">
            Australian Government • Department of Home Affairs
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#002B49] tracking-tight mt-1">
            Visa Grant Notice
          </h1>
          <p className="text-xs text-gray-600">
            Official Commonwealth Notice of Visa Grant under Section 65 of the Migration Act 1958
          </p>
        </div>

        {/* Reference & Grant Number Block */}
        <div className="bg-emerald-50 border-2 border-emerald-600 p-3.5 rounded-lg text-right">
          <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
            Searchable Reference Number
          </div>
          <div className="font-mono text-base font-black text-[#002B49]">
            {profile.referenceNumber}
          </div>
          <div className="text-[10px] text-emerald-800 font-bold mt-0.5">
            Grant No: {profile.visaGrantNumber}
          </div>
        </div>
      </div>

      {/* Grant Congratulation Banner */}
      <div className="mb-6 p-4 rounded-lg bg-gradient-to-r from-emerald-800 to-teal-900 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#FFCD00] block mb-1">
            Immigration Status: DECISION GRANTED
          </span>
          <h2 className="text-lg font-black text-white">
            YOUR AUSTRALIAN VISA HAS BEEN GRANTED
          </h2>
          <p className="text-xs text-emerald-100">
            You have been granted permission to enter and remain in Australia under the conditions listed below.
          </p>
        </div>

        <div className="bg-white text-emerald-900 px-4 py-2 rounded-full font-black text-xs flex items-center gap-1.5 shadow-sm shrink-0">
          <CheckCircle2 className="w-4 h-4 text-emerald-700" />
          <span>VISA ACTIVE</span>
        </div>
      </div>

      {/* Primary Visa Details Table */}
      <div className="border border-gray-300 rounded-lg overflow-hidden mb-6 text-xs">
        <div className="bg-[#002B49] text-white px-4 py-2.5 font-bold uppercase text-[11px] flex justify-between">
          <span>Visa Grant Specification & Client Details</span>
          <span className="text-[#FFCD00] font-mono">DVS Certified</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-200">
          <div className="p-4 space-y-2.5">
            <div>
              <span className="text-[10px] uppercase font-bold text-gray-400 block">Visa Holder Name:</span>
              <span className="text-sm font-extrabold text-gray-900 font-serif">{profile.fullName}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-gray-400 block">Date of Birth:</span>
              <span className="font-bold text-gray-900">{profile.dateOfBirth}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-gray-400 block">Travel Document / Passport No:</span>
              <span className="font-mono font-black text-[#002B49] text-sm">{profile.documentNumber}</span>
              <span className="text-gray-500 ml-1 font-semibold">({profile.nationality})</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-gray-400 block">Document Issue Date:</span>
              <span className="font-semibold text-gray-900">{profile.documentIssueDate}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-gray-400 block">Nominated Occupation:</span>
              <span className="font-bold text-gray-900">{profile.nominatedOccupation}</span>
              <span className="text-gray-500 font-mono text-[11px] block">ANZSCO: {profile.anzscoCode}</span>
            </div>
          </div>

          <div className="p-4 space-y-2.5 bg-gray-50/50">
            <div>
              <span className="text-[10px] uppercase font-bold text-gray-400 block">13-Digit Visa Grant Number:</span>
              <span className="font-mono text-sm font-black text-emerald-800 tracking-wider">{profile.visaGrantNumber}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-gray-400 block">Visa Subclass & Stream:</span>
              <span className="font-bold text-[#002B49]">{profile.visaSubclass}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-gray-400 block">Visa Grant Date:</span>
              <span className="font-bold text-gray-900">{profile.grantDate}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-gray-400 block">Stay Period / Must Not Arrive After:</span>
              <span className="font-bold text-emerald-800">{profile.visaExpiryDate}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-gray-400 block">Travel Facility:</span>
              <span className="font-bold text-gray-900">Multiple Entries</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sponsoring Employer Details */}
      <div className="mb-6 p-4 rounded-lg bg-[#FFF9F2] border border-[#FAD7A0] text-xs">
        <div className="flex items-center justify-between mb-2">
          <span className="font-bold text-gray-800 uppercase text-[11px]">Approved Sponsoring Business</span>
          <span className="font-mono font-bold text-[#C88A24]">ED: {profile.edNumber}</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-gray-700">
          <div>Employer Name: <strong className="text-gray-900">{profile.sponsorName}</strong></div>
          <div>Australian Business Number (ABN): <strong className="font-mono">{profile.sponsorAbn}</strong></div>
          <div>Work Location: <strong className="text-gray-900">{profile.workLocation}</strong></div>
          <div>Sponsorship Status: <strong className="text-emerald-700">Approved Standard Sponsor</strong></div>
        </div>
      </div>

      {/* Mandatory Visa Conditions (8107, 8501, 8547) */}
      <div className="border border-gray-300 rounded overflow-hidden mb-6 text-xs">
        <div className="bg-gray-100 text-gray-800 px-3.5 py-2 font-bold uppercase text-[11px]">
          Statutory Conditions Attached to Visa Grant
        </div>
        <div className="p-4 space-y-3">
          <div className="flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <strong className="text-gray-900 font-bold">Condition 8107 – Work Limitations:</strong>
              <p className="text-gray-600 mt-0.5">
                The visa holder must only work in the nominated occupation ({profile.nominatedOccupation}) for the approved business sponsor ({profile.sponsorName}).
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <strong className="text-gray-900 font-bold">Condition 8501 – Maintain Health Insurance:</strong>
              <p className="text-gray-600 mt-0.5">
                The visa holder must maintain adequate health insurance arrangements for the duration of stay in Australia. Validated via Bupa Global.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Official Signoff */}
      <div className="pt-6 border-t-2 border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 text-xs">
        <div>
          <div className="font-bold text-gray-900">Authorised Officer of the Commonwealth</div>
          <div className="text-gray-500">Department of Home Affairs, Australia • Position Number: 60049102</div>
        </div>

        <div className="text-right font-mono text-[11px]">
          <div className="text-gray-600">Verification Hash: SHA256-VGN-{profile.visaGrantNumber}</div>
          <div className="text-emerald-700 font-bold mt-0.5">DVS Cryptographically Signed</div>
        </div>
      </div>
    </div>
  );
};
