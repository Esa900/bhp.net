import React from 'react';
import { ShieldCheck, User, Calendar, Flag, FileCheck2, Building2, Briefcase, MapPin, Hash, CheckCircle } from 'lucide-react';
import { ApplicantProfile } from '../../types/portal';

interface ApplicantOverviewCardProps {
  profile: ApplicantProfile;
  onOpenDocument: (type: any) => void;
}

export const ApplicantOverviewCard: React.FC<ApplicantOverviewCardProps> = ({
  profile,
  onOpenDocument,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-[#D5D9DE] overflow-hidden mb-8">
      {/* Top Banner: Australian Immi Verification Strip */}
      <div className="bg-gradient-to-r from-[#002B49] to-[#0A3D63] text-white p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-white/10 border-2 border-[#C88A24] flex items-center justify-center text-white text-xl font-black shadow-md">
              <User className="w-8 h-8 text-[#FFCD00]" />
            </div>
            <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-[#002B49] flex items-center justify-center">
              <CheckCircle className="w-3.5 h-3.5 text-white" />
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {profile.fullName}
              </h2>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-400/40">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{profile.status === 'GRANTED' ? 'VISA GRANTED' : 'VERIFIED & COMPLIANT'}</span>
              </span>
            </div>

            <p className="text-sm text-gray-200 mt-1 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-[#FBBF24]" />
              <span className="font-semibold">{profile.nominatedOccupation}</span>
              <span className="text-gray-400 font-mono text-xs">(ANZSCO {profile.anzscoCode})</span>
            </p>
          </div>
        </div>

        {/* Reference & ED Identifiers Display */}
        <div className="flex sm:flex-col items-start sm:items-end justify-between border-t sm:border-t-0 border-white/10 pt-3 sm:pt-0">
          <div className="text-left sm:text-right">
            <div className="text-[10px] uppercase font-bold text-gray-400">Reference Number</div>
            <div className="font-mono text-sm sm:text-base font-extrabold text-[#FFCD00]">
              {profile.referenceNumber}
            </div>
          </div>
          <div className="text-right mt-1">
            <div className="text-[10px] uppercase font-bold text-gray-400">ED Number</div>
            <div className="font-mono text-sm sm:text-base font-extrabold text-white">
              {profile.edNumber}
            </div>
          </div>
        </div>
      </div>

      {/* Core Identity & Biometric Data Table (Requested: Name, Nationality, Document Number, Date of Birth, Document Issue Date) */}
      <div className="p-6">
        <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center justify-between">
          <span>Primary Travel Document & Biometrics</span>
          <span className="text-[11px] font-normal text-gray-400">Australian DVS Verified</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 p-4 bg-[#F8FAFC] rounded-lg border border-gray-200">
          {/* 1. Full Legal Name */}
          <div>
            <div className="text-[11px] font-semibold text-gray-500 flex items-center gap-1 mb-1">
              <User className="w-3.5 h-3.5 text-blue-600" />
              <span>Full Name</span>
            </div>
            <div className="text-sm font-bold text-gray-900">{profile.fullName}</div>
          </div>

          {/* 2. Nationality */}
          <div>
            <div className="text-[11px] font-semibold text-gray-500 flex items-center gap-1 mb-1">
              <Flag className="w-3.5 h-3.5 text-blue-600" />
              <span>Nationality</span>
            </div>
            <div className="text-sm font-bold text-gray-900">{profile.nationality}</div>
          </div>

          {/* 3. Document Number */}
          <div>
            <div className="text-[11px] font-semibold text-gray-500 flex items-center gap-1 mb-1">
              <Hash className="w-3.5 h-3.5 text-blue-600" />
              <span>Document / Passport No.</span>
            </div>
            <div className="text-sm font-mono font-extrabold text-[#002B49]">{profile.documentNumber}</div>
          </div>

          {/* 4. Date of Birth */}
          <div>
            <div className="text-[11px] font-semibold text-gray-500 flex items-center gap-1 mb-1">
              <Calendar className="w-3.5 h-3.5 text-blue-600" />
              <span>Date of Birth</span>
            </div>
            <div className="text-sm font-bold text-gray-900">{profile.dateOfBirth}</div>
          </div>

          {/* 5. Document Issue Date */}
          <div>
            <div className="text-[11px] font-semibold text-gray-500 flex items-center gap-1 mb-1">
              <FileCheck2 className="w-3.5 h-3.5 text-blue-600" />
              <span>Document Issue Date</span>
            </div>
            <div className="text-sm font-bold text-gray-900">{profile.documentIssueDate}</div>
          </div>
        </div>

        {/* Secondary Details: Sponsor, Location, Visa Class */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-100 text-xs">
          <div className="flex items-start gap-2.5">
            <Building2 className="w-4 h-4 text-[#C88A24] shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-gray-500 block">Sponsoring Employer:</span>
              <span className="font-bold text-gray-900">{profile.sponsorName}</span>
              <span className="text-[11px] text-gray-400 block font-mono">ABN: {profile.sponsorAbn}</span>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-gray-500 block">Work Location & Roster:</span>
              <span className="font-bold text-gray-900">{profile.workLocation}</span>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-gray-500 block">Visa Subclass & Grant:</span>
              <span className="font-bold text-gray-900">{profile.visaSubclass}</span>
              <span className="text-[11px] text-emerald-600 block font-mono font-semibold">Grant No: {profile.visaGrantNumber}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
