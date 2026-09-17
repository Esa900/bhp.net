import React from 'react';
import { ApplicantProfile } from '../../../types/portal';
import { FileText, CheckCircle2, ShieldCheck, Clock, Building2 } from 'lucide-react';

interface DocumentProps {
  profile: ApplicantProfile;
}

export const VisaReceivedDoc: React.FC<DocumentProps> = ({ profile }) => {
  return (
    <div className="bg-white text-gray-900 font-sans p-6 sm:p-10 max-w-4xl mx-auto border border-gray-300 shadow-sm relative overflow-hidden print:p-0 print:border-none">
      {/* Official Department Letterhead */}
      <div className="border-b-2 border-[#002B49] pb-6 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
            Australian Government • Department of Home Affairs
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-[#002B49] tracking-tight mt-1">
            Acknowledgement of Application Received
          </h1>
          <p className="text-xs text-gray-600">
            Official Lodgement Notification & File Tracking Schedule
          </p>
        </div>

        {/* Reference Searchable Badge */}
        <div className="bg-[#EBF5FB] border-2 border-[#002B49] p-3.5 rounded-lg text-right">
          <div className="text-[10px] font-bold uppercase tracking-wider text-blue-800">
            Searchable Reference Number
          </div>
          <div className="font-mono text-base font-black text-[#002B49]">
            {profile.referenceNumber}
          </div>
          <div className="text-[10px] text-gray-600 font-semibold mt-0.5">Lodged: {profile.applicationDate}</div>
        </div>
      </div>

      {/* Primary Status Banner */}
      <div className="mb-6 p-4 rounded-lg bg-sky-50 border border-sky-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-sky-800 block mb-0.5">
            ImmiAccount Lodgement Status
          </span>
          <h2 className="text-base font-bold text-sky-950">
            APPLICATION VALID & OFFICIALLY LODGED
          </h2>
          <p className="text-xs text-sky-800">
            Your application has met all statutory validity criteria under Section 46 of the Migration Act 1958.
          </p>
        </div>

        <div className="flex items-center gap-1 px-3 py-1.5 bg-sky-700 text-white rounded-full font-bold text-xs shrink-0">
          <CheckCircle2 className="w-4 h-4" />
          <span>Validly Lodged</span>
        </div>
      </div>

      {/* Recipient Notice Box */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs mb-6 p-4 bg-[#F8FAFC] border border-gray-200 rounded">
        <div className="space-y-1">
          <span className="text-[10px] font-bold uppercase text-gray-400 block mb-1">Applicant Details</span>
          <div>Full Legal Name: <strong className="text-gray-900">{profile.fullName}</strong></div>
          <div>Date of Birth: <strong className="text-gray-900">{profile.dateOfBirth}</strong></div>
          <div>Travel Document / Passport: <strong className="font-mono">{profile.documentNumber}</strong> ({profile.nationality})</div>
          <div>Document Issue Date: <strong className="text-gray-800">{profile.documentIssueDate}</strong></div>
        </div>

        <div className="space-y-1 sm:text-right">
          <span className="text-[10px] font-bold uppercase text-gray-400 block mb-1">Departmental Allocation</span>
          <div>Processing Office: <strong className="text-gray-900">Perth Skilled Processing Centre (WA)</strong></div>
          <div>Departmental File No: <strong className="font-mono text-gray-900">BCC2024/{profile.referenceNumber.replace('REF-', '')}</strong></div>
          <div>Employer Declaration: <strong className="font-mono text-[#C88A24] font-bold">{profile.edNumber}</strong></div>
          <div>Nominated Sponsor: <strong className="text-gray-900">{profile.sponsorName}</strong></div>
        </div>
      </div>

      {/* Lodgement Details Table */}
      <div className="border border-gray-200 rounded overflow-hidden mb-6 text-xs">
        <div className="bg-[#002B49] text-white px-3.5 py-2 font-bold uppercase text-[11px] flex justify-between">
          <span>Application Summary Schedule</span>
          <span>Details</span>
        </div>
        <table className="w-full text-left">
          <tbody className="divide-y divide-gray-200">
            <tr>
              <td className="p-3 font-semibold text-gray-600 w-1/3">Transaction Reference (TRN)</td>
              <td className="p-3 font-mono font-bold text-[#002B49]">{profile.referenceNumber}</td>
            </tr>
            <tr className="bg-gray-50/50">
              <td className="p-3 font-semibold text-gray-600">Visa Subclass & Class</td>
              <td className="p-3 font-bold text-gray-900">{profile.visaSubclass}</td>
            </tr>
            <tr>
              <td className="p-3 font-semibold text-gray-600">Nominated Skilled Stream</td>
              <td className="p-3 font-medium text-gray-800">{profile.visaStream}</td>
            </tr>
            <tr className="bg-gray-50/50">
              <td className="p-3 font-semibold text-gray-600">Nominated Occupation</td>
              <td className="p-3 font-bold text-gray-900">{profile.nominatedOccupation} (ANZSCO {profile.anzscoCode})</td>
            </tr>
            <tr>
              <td className="p-3 font-semibold text-gray-600">Associated Health Portal ID</td>
              <td className="p-3 font-mono text-sky-800 font-bold">{profile.hapId}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Statutory Advice & Next Steps */}
      <div className="text-xs text-gray-700 space-y-2 mb-6 leading-relaxed bg-gray-50 p-4 rounded border border-gray-200">
        <h4 className="font-bold text-gray-900">What happens next?</h4>
        <p>
          Your application has been assigned to a Departmental Case Officer within the Skilled Work Division. Assessment of all primary criteria, including police clearances, employer nomination verification (ED {profile.edNumber}), and health clearances, is conducted in sequence.
        </p>
        <p>
          You do not need to contact the Department while your application is within standard processing times. Any notification of decision will be delivered to your authorized contact and reflected in your ImmiAccount.
        </p>
      </div>

      {/* Departmental Signoff */}
      <div className="pt-6 border-t-2 border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 text-xs">
        <div>
          <div className="font-bold text-gray-900">Department of Home Affairs, Commonwealth of Australia</div>
          <div className="text-gray-500">Immigration Assessment Operations • GPO Box 9984 Sydney NSW 2001</div>
        </div>

        <div className="text-right font-mono text-[11px]">
          <div className="text-gray-600">Lodgement Hash: SHA-DHA-{profile.referenceNumber}</div>
          <div className="text-emerald-700 font-bold mt-0.5">Authenticated Record</div>
        </div>
      </div>
    </div>
  );
};
