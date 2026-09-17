import React from 'react';
import { ApplicantProfile } from '../../../types/portal';
import { Award, CheckCircle2, ShieldCheck, FileCheck } from 'lucide-react';

interface DocumentProps {
  profile: ApplicantProfile;
}

export const JobConfirmationDoc: React.FC<DocumentProps> = ({ profile }) => {
  return (
    <div className="bg-white text-gray-900 font-sans p-6 sm:p-10 max-w-4xl mx-auto border border-gray-300 shadow-sm relative overflow-hidden print:p-0 print:border-none">
      {/* Official Header */}
      <div className="border-b-2 border-[#002B49] pb-6 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="text-xl font-black text-[#002B49] tracking-tight flex items-center gap-2">
            <span>BHP Operations</span>
            <span className="text-[#C88A24]">•</span>
            <span className="text-sm font-semibold text-gray-600">Executive Appointment Directorate</span>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            Registered Standard Business Sponsor • ABN: {profile.sponsorAbn}
          </p>
        </div>

        <div className="text-right">
          <div className="text-[10px] uppercase font-bold text-gray-400">Confirmation Reference</div>
          <div className="font-mono text-sm font-black text-[#002B49]">CNF-{profile.edNumber}</div>
          <div className="text-[10px] text-gray-500">Issued: {profile.grantDate}</div>
        </div>
      </div>

      {/* Confirmation Seal */}
      <div className="mb-6 p-4 rounded-lg bg-[#F4F6F8] border border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#C88A24] block mb-1">
            Certificate of Final Appointment
          </span>
          <h2 className="text-lg font-black text-gray-900">
            Official Job Confirmation & Role Ratification
          </h2>
          <p className="text-xs text-gray-600">
            Certified for Department of Home Affairs Visa Lodgement & Compliance
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-100 text-emerald-900 rounded-full font-bold text-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-700" />
          <span>Appointment Confirmed</span>
        </div>
      </div>

      {/* Content */}
      <div className="text-xs text-gray-800 space-y-4 mb-6 leading-relaxed">
        <p>
          This document certifies that <strong>{profile.fullName}</strong> (Passport Number: <span className="font-mono font-bold">{profile.documentNumber}</span>, Date of Birth: <strong>{profile.dateOfBirth}</strong>) has successfully fulfilled all pre-employment background, qualification, and medical verifications.
        </p>
        <p>
          We formally confirm your unconditional appointment to the corporate role of <strong>{profile.nominatedOccupation}</strong> with commencement scheduled immediately upon confirmation of your Australian work authorization.
        </p>

        {/* Confirmation Data Matrix */}
        <div className="border border-gray-200 rounded overflow-hidden my-4">
          <div className="bg-[#002B49] text-white px-3 py-2 text-xs font-bold uppercase flex justify-between">
            <span>Verified Appointment Parameters</span>
            <span className="text-gray-300 font-mono">ANZSCO: {profile.anzscoCode}</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-gray-200 text-xs">
            <div className="p-3 space-y-2">
              <div>
                <span className="text-gray-500 block text-[10px] uppercase font-bold">Appointed Employee:</span>
                <span className="font-bold text-gray-900">{profile.fullName}</span>
              </div>
              <div>
                <span className="text-gray-500 block text-[10px] uppercase font-bold">Designation / Role:</span>
                <span className="font-bold text-[#002B49]">{profile.nominatedOccupation}</span>
              </div>
              <div>
                <span className="text-gray-500 block text-[10px] uppercase font-bold">Deployment Site:</span>
                <span className="font-semibold text-gray-800">{profile.workLocation}</span>
              </div>
            </div>

            <div className="p-3 space-y-2">
              <div>
                <span className="text-gray-500 block text-[10px] uppercase font-bold">Employer Declaration ID:</span>
                <span className="font-mono font-bold text-[#C88A24]">{profile.edNumber}</span>
              </div>
              <div>
                <span className="text-gray-500 block text-[10px] uppercase font-bold">Annual Remuneration:</span>
                <span className="font-mono font-bold text-emerald-800">{profile.salaryPackage}</span>
              </div>
              <div>
                <span className="text-gray-500 block text-[10px] uppercase font-bold">Visa Subclass Alignment:</span>
                <span className="font-semibold text-gray-800">{profile.visaSubclass}</span>
              </div>
            </div>
          </div>
        </div>

        <p>
          BHP hereby confirms that this appointment is genuine and full-time, and complies fully with Australian Fair Work Act 2009 legislation and National Employment Standards (NES).
        </p>
      </div>

      {/* Signature & Seal */}
      <div className="pt-6 border-t-2 border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 text-xs">
        <div>
          <div className="font-serif italic text-base font-bold text-gray-900">Dr. Hamish MacIntyre</div>
          <div className="font-bold text-gray-900">General Manager, Operations & Asset Governance</div>
          <div className="text-gray-500">BHP Minerals Australia</div>
        </div>

        <div className="border-2 border-dashed border-[#002B49] p-3 rounded text-center">
          <div className="text-[10px] font-black text-[#002B49] uppercase tracking-wider">OFFICIALLY RATIFIED</div>
          <div className="text-[9px] font-mono text-gray-500 mt-0.5">DVS Authentication: VALID</div>
        </div>
      </div>
    </div>
  );
};
