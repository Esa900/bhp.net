import React from 'react';
import { ApplicantProfile } from '../../../types/portal';
import { Building2, CheckCircle2, ShieldCheck, Briefcase } from 'lucide-react';

interface DocumentProps {
  profile: ApplicantProfile;
}

export const JobAcceptanceDoc: React.FC<DocumentProps> = ({ profile }) => {
  return (
    <div className="bg-white text-gray-900 font-sans p-6 sm:p-10 max-w-4xl mx-auto border border-gray-300 shadow-sm relative overflow-hidden print:p-0 print:border-none">
      {/* Corporate Letterhead Banner */}
      <div className="border-b-2 border-[#C88A24] pb-6 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="text-2xl font-black tracking-tight text-[#111315] flex items-center gap-2">
            <span className="text-[#C88A24]">BHP</span>
            <span className="text-gray-400 font-normal text-lg">|</span>
            <span className="text-sm uppercase tracking-widest text-gray-700 font-bold">Group Limited</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Global Operations Center • 171 Collins Street, Melbourne VIC 3000 Australia
          </p>
        </div>

        {/* ED Searchable Badge */}
        <div className="bg-[#FFF9F2] border border-[#FAD7A0] p-3 rounded-lg text-right">
          <div className="text-[10px] font-bold uppercase tracking-wider text-[#C88A24]">
            ED Searchable Reference
          </div>
          <div className="font-mono text-base font-extrabold text-[#002B49]">
            {profile.edNumber}
          </div>
          <div className="text-[10px] text-gray-500 mt-0.5">ANZSCO: {profile.anzscoCode}</div>
        </div>
      </div>

      {/* Acceptance Certificate Title */}
      <div className="mb-6 text-center">
        <div className="inline-block px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
          Official Employment Acceptance Confirmation
        </div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 font-serif">
          Formal Job Acceptance & Sponsorship Endorsement
        </h2>
        <p className="text-xs text-gray-500 mt-1">
          Registered Under Enterprise Sponsoring Agreement ID: <span className="font-mono font-bold text-gray-800">ESA-AU-BHP-{profile.edNumber}</span>
        </p>
      </div>

      {/* Recipient Notice */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs mb-6 p-4 bg-[#F8FAFC] border border-gray-200 rounded-lg">
        <div>
          <span className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Addressed Candidate</span>
          <div className="font-bold text-sm text-gray-900">{profile.fullName}</div>
          <div className="text-gray-600">Passport: <span className="font-mono font-semibold">{profile.documentNumber}</span> ({profile.nationality})</div>
          <div className="text-gray-600">Reference: <span className="font-mono">{profile.referenceNumber}</span></div>
        </div>

        <div className="sm:text-right">
          <span className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Corporate Sponsor</span>
          <div className="font-bold text-sm text-gray-900">{profile.sponsorName}</div>
          <div className="text-gray-600">ABN: <span className="font-mono">{profile.sponsorAbn}</span></div>
          <div className="text-gray-600">Confirmation Date: <span className="font-semibold">{profile.grantDate}</span></div>
        </div>
      </div>

      {/* Formal Acceptance Content Body */}
      <div className="text-xs text-gray-700 leading-relaxed space-y-4 mb-6">
        <p>
          Dear <strong>{profile.fullName}</strong>,
        </p>
        <p>
          BHP Group Limited is pleased to confirm that your formal written acceptance of the nominated skilled employment position of <strong>{profile.nominatedOccupation}</strong> has been duly received, registered, and processed under Employer Declaration Directive <strong>{profile.edNumber}</strong>.
        </p>
        <p>
          This Job Acceptance Letter constitutes an official corporate milestone confirming that you have accepted all terms and conditions of employment, and that BHP has completed your primary nomination sponsorship under the Commonwealth Migration Act 1958 and Migration Regulations 1994.
        </p>

        {/* Accepted Terms Summary Table */}
        <div className="border border-gray-300 rounded overflow-hidden my-4">
          <table className="w-full text-left text-xs">
            <tbody className="divide-y divide-gray-200">
              <tr className="bg-gray-50">
                <td className="p-2.5 font-bold text-gray-600 w-1/3">Nominated Position</td>
                <td className="p-2.5 font-extrabold text-[#002B49]">{profile.nominatedOccupation} (ANZSCO {profile.anzscoCode})</td>
              </tr>
              <tr>
                <td className="p-2.5 font-bold text-gray-600">Operational Hub</td>
                <td className="p-2.5 font-medium text-gray-800">{profile.workLocation}</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="p-2.5 font-bold text-gray-600">Approved Remuneration</td>
                <td className="p-2.5 font-bold text-emerald-800 font-mono">{profile.salaryPackage}</td>
              </tr>
              <tr>
                <td className="p-2.5 font-bold text-gray-600">Employer Declaration ID</td>
                <td className="p-2.5 font-mono font-bold text-[#C88A24]">{profile.edNumber}</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="p-2.5 font-bold text-gray-600">Immigration Visa Class</td>
                <td className="p-2.5 font-semibold text-gray-900">{profile.visaSubclass}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          A copy of this acceptance certificate has been lodged directly into the Department of Home Affairs ImmiAccount document repository for automatic reconciliation with Reference Number <strong>{profile.referenceNumber}</strong>.
        </p>
      </div>

      {/* Signature & Corporate Seal */}
      <div className="pt-6 border-t-2 border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 text-xs">
        <div>
          <div className="font-serif italic text-base text-[#002B49] font-bold">
            Alastair Crawford
          </div>
          <div className="font-bold text-gray-900">Head of Operational Resourcing & Global Mobility</div>
          <div className="text-gray-500">BHP Group Limited — Western Australia & Queensland Operations</div>
        </div>

        <div className="flex items-center gap-3">
          <div className="border-2 border-[#C88A24] text-[#C88A24] px-3 py-2 rounded text-center">
            <div className="text-[10px] font-extrabold tracking-widest uppercase">BHP CORPORATE SEAL</div>
            <div className="text-[9px] font-mono mt-0.5">ED-{profile.edNumber}</div>
          </div>
          <div className="text-right">
            <div className="text-emerald-700 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Signed & Registered</span>
            </div>
            <div className="text-[10px] text-gray-400 font-mono">Timestamp: {profile.grantDate}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
