import React from 'react';
import { ApplicantProfile } from '../../../types/portal';
import { Briefcase, DollarSign, CheckCircle2, MapPin, Clock, Award } from 'lucide-react';

interface DocumentProps {
  profile: ApplicantProfile;
}

export const EmploymentOfferDoc: React.FC<DocumentProps> = ({ profile }) => {
  return (
    <div className="bg-white text-gray-900 font-sans p-6 sm:p-10 max-w-4xl mx-auto border border-gray-300 shadow-sm relative overflow-hidden print:p-0 print:border-none">
      {/* Header */}
      <div className="border-b-2 border-gray-900 pb-5 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="text-2xl font-black tracking-tight text-gray-950">
            BHP <span className="text-[#C88A24]">GLOBAL</span>
          </div>
          <div className="text-xs uppercase tracking-wider text-gray-500 font-semibold mt-0.5">
            People & Culture Division • Talent Acquisition Australia
          </div>
        </div>

        <div className="text-right">
          <span className="text-[10px] uppercase font-bold text-gray-400 block">Offer Code</span>
          <span className="font-mono text-xs font-bold text-gray-900">BHP-OFFER-{profile.edNumber}</span>
          <span className="text-[10px] text-gray-500 block mt-0.5">Date: {profile.applicationDate}</span>
        </div>
      </div>

      {/* Offer Banner */}
      <div className="bg-[#002B49] text-white p-4 rounded-sm mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-base sm:text-lg font-black tracking-tight">Formal Employment Offer & Contractual Schedule</h2>
          <p className="text-xs text-gray-300">Nominated Skilled Worker Sponsorship Agreement</p>
        </div>
        <div className="text-right font-mono text-xs text-[#FFCD00] font-bold">
          Ref: {profile.referenceNumber}
        </div>
      </div>

      {/* Personal Address */}
      <div className="text-xs text-gray-800 space-y-4 mb-6 leading-relaxed">
        <p>
          <strong>STRICTLY PRIVATE & CONFIDENTIAL</strong><br />
          To: <strong>{profile.fullName}</strong><br />
          Passport No: <span className="font-mono">{profile.documentNumber}</span> ({profile.nationality})<br />
          Employer Declaration ID: <span className="font-mono text-[#C88A24] font-bold">{profile.edNumber}</span>
        </p>

        <p>
          We are pleased to extend this formal offer of permanent/fixed-term sponsored employment with <strong>{profile.sponsorName}</strong> for the nominated position of <strong>{profile.nominatedOccupation}</strong>.
        </p>

        {/* Remuneration & Benefits Breakdown */}
        <div className="bg-[#F8FAFC] border border-gray-300 rounded p-4">
          <div className="text-xs font-bold uppercase tracking-wider text-[#002B49] mb-3 flex items-center gap-1.5">
            <DollarSign className="w-4 h-4 text-emerald-600" />
            <span>Remuneration Package & Employment Terms</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3 bg-white border border-gray-200 rounded">
              <span className="text-[10px] uppercase text-gray-500 font-bold block mb-1">Total Guaranteed Remuneration</span>
              <div className="text-base font-black text-emerald-700 font-mono">{profile.salaryPackage}</div>
              <div className="text-[11px] text-gray-500 mt-1">Inclusive of statutory 11.5% Australian Superannuation guarantee.</div>
            </div>

            <div className="p-3 bg-white border border-gray-200 rounded">
              <span className="text-[10px] uppercase text-gray-500 font-bold block mb-1">Deployment Location & Roster</span>
              <div className="text-sm font-bold text-gray-900">{profile.workLocation}</div>
              <div className="text-[11px] text-gray-500 mt-1">Fly-In Fly-Out (FIFO) or Relocation Package with full camp accommodation.</div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-gray-200 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <span className="text-gray-500 font-semibold block">Hours of Work:</span>
              <span className="font-bold text-gray-900">Standard 38-hour week + scheduled site rotation</span>
            </div>
            <div>
              <span className="text-gray-500 font-semibold block">Relocation Assistance:</span>
              <span className="font-bold text-gray-900">Covered up to AUD $15,000</span>
            </div>
            <div>
              <span className="text-gray-500 font-semibold block">Annual & Sick Leave:</span>
              <span className="font-bold text-gray-900">5 weeks paid leave per annum</span>
            </div>
          </div>
        </div>

        {/* Corporate Sponsorship Commitment */}
        <p>
          BHP affirms its full commitment as an Approved Standard Business Sponsor. Under this offer, BHP assumes all sponsorship obligations under Division 3A of Part 2 of the Migration Act 1958, including all nomination and visa processing fees, ensuring zero financial deduction from your salary for immigration sponsorship costs.
        </p>
      </div>

      {/* Signature Section */}
      <div className="pt-6 border-t-2 border-gray-300 grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
        <div>
          <span className="text-[10px] uppercase font-bold text-gray-500 block mb-2">On Behalf of BHP Group Limited:</span>
          <div className="font-serif italic text-base font-bold text-gray-900">Geraldine Henderson</div>
          <div className="font-bold text-gray-900">Chief Human Resources Officer</div>
          <div className="text-gray-500 text-[11px]">BHP People & Organization Committee</div>
        </div>

        <div className="sm:text-right">
          <span className="text-[10px] uppercase font-bold text-gray-500 block mb-2">Electronic Offer Signature:</span>
          <div className="inline-block px-3 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded font-mono font-bold text-[11px]">
            DIGITALLY RATIFIED & EXECUTED
          </div>
          <div className="text-[10px] text-gray-400 font-mono mt-1">Security Token: {profile.visaGrantNumber}</div>
        </div>
      </div>
    </div>
  );
};
