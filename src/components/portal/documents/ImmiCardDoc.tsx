import React from 'react';
import { ApplicantProfile } from '../../../types/portal';
import { CreditCard, ShieldCheck, CheckCircle2, QrCode, User, Calendar, Award, Building2 } from 'lucide-react';

interface DocumentProps {
  profile: ApplicantProfile;
}

export const ImmiCardDoc: React.FC<DocumentProps> = ({ profile }) => {
  const cardNo = profile.immiCardNo || 'IMMI-CARD-492019';

  return (
    <div className="bg-white text-gray-900 font-sans p-6 sm:p-10 max-w-4xl mx-auto border border-gray-300 shadow-sm relative overflow-hidden print:p-0 print:border-none">
      {/* Australian Government ImmiCard Header */}
      <div className="border-b-4 border-[#002B49] pb-6 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-[#002B49] text-white flex flex-col items-center justify-center font-bold text-xs rounded-lg shadow-sm border border-[#C88A24]">
            <CreditCard className="w-8 h-8 text-[#FFCD00]" />
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-[#002B49]">
              AUSTRALIAN GOVERNMENT • DEPARTMENT OF HOME AFFAIRS
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[#002B49]">
              Commonwealth Evidence of Immigration Status (ImmiCard)
            </h1>
            <p className="text-xs text-gray-600">
              Official Secure Identification Credential • Migration Act 1958
            </p>
          </div>
        </div>

        <div className="text-right">
          <div className="text-[10px] uppercase font-bold text-gray-400">Card Number</div>
          <div className="font-mono text-sm sm:text-base font-black text-[#002B49]">
            {cardNo}
          </div>
          <div className="text-[10px] text-emerald-700 font-bold mt-0.5 flex items-center justify-end gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>IMMIGRATION STATUS ACTIVE</span>
          </div>
        </div>
      </div>

      {/* Realistic ImmiCard Simulation Card */}
      <div className="mb-6 p-6 rounded-2xl bg-gradient-to-br from-[#002B49] via-[#003C66] to-[#0A2540] text-white shadow-lg border-2 border-[#C88A24] relative overflow-hidden">
        {/* Holographic Security Background watermark */}
        <div className="absolute -right-8 -bottom-8 opacity-10 pointer-events-none">
          <ShieldCheck className="w-64 h-64 text-[#FFCD00]" />
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-white/20 pb-4 mb-4 gap-2">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#FFCD00]">
              AUSTRALIA IMMICARD
            </span>
            <div className="text-sm font-bold text-gray-200">
              Department of Home Affairs Identity Credential
            </div>
          </div>
          <div className="bg-[#FFCD00] text-[#002B49] font-black text-xs px-3 py-1 rounded font-mono">
            {cardNo}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div className="w-28 h-36 bg-slate-800/80 rounded-lg border-2 border-white/30 flex flex-col items-center justify-center p-2 text-center">
            <User className="w-16 h-16 text-gray-300 mb-1" />
            <span className="text-[9px] font-mono text-gray-300 uppercase">DIGITAL PHOTO</span>
            <span className="text-[8px] text-emerald-400 font-bold">BIOMETRIC SECURE</span>
          </div>

          <div className="md:col-span-2 space-y-2 text-xs">
            <div>
              <span className="text-[10px] uppercase text-gray-300 block">Full Name:</span>
              <span className="text-lg font-black tracking-wide text-white">{profile.fullName}</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-[10px] uppercase text-gray-300 block">Date of Birth:</span>
                <span className="font-semibold">{profile.dateOfBirth}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase text-gray-300 block">Nationality:</span>
                <span className="font-semibold">{profile.nationality}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase text-gray-300 block">Visa Subclass:</span>
                <span className="font-semibold text-[#FFCD00]">{profile.visaSubclass}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase text-gray-300 block">Work Rights:</span>
                <span className="font-semibold text-emerald-300">Unrestricted Skilled Work</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-white/20 flex flex-col sm:flex-row justify-between items-center text-[10px] font-mono text-gray-300 gap-2">
          <span>GRANT NO: {profile.visaGrantNumber}</span>
          <span>EXPIRY: {profile.visaExpiryDate}</span>
          <span className="text-[#FFCD00]">CRYPTO-CHIP VERIFIED</span>
        </div>
      </div>

      {/* Legal Identity Credential Particulars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs mb-6">
        <div className="p-4 border border-gray-300 rounded-lg bg-[#F8FAFC] space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block mb-2">
            Cardholder Credentials
          </span>
          <div className="flex justify-between py-1 border-b border-gray-200">
            <span className="text-gray-500">Legal Name:</span>
            <span className="font-bold text-gray-900">{profile.fullName}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-gray-200">
            <span className="text-gray-500">Passport Number:</span>
            <span className="font-mono font-bold text-gray-900">{profile.documentNumber}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-gray-200">
            <span className="text-gray-500">Card Reference Number:</span>
            <span className="font-mono font-bold text-[#002B49]">{cardNo}</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-gray-500">ImmiAccount DVS Status:</span>
            <span className="font-bold text-emerald-700">Authenticated Active</span>
          </div>
        </div>

        <div className="p-4 border border-gray-300 rounded-lg bg-[#F8FAFC] space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block mb-2">
            Entitlement Determination
          </span>
          <div className="flex justify-between py-1 border-b border-gray-200">
            <span className="text-gray-500">Primary Visa Stream:</span>
            <span className="font-medium text-gray-900">{profile.visaStream}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-gray-200">
            <span className="text-gray-500">Approved Sponsoring Entity:</span>
            <span className="font-medium text-gray-900">{profile.sponsorName}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-gray-200">
            <span className="text-gray-500">Medicare Access:</span>
            <span className="font-medium text-gray-900">Eligible (RHCA / Reciprocal)</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-gray-500">Australian Bank Account Opening:</span>
            <span className="font-bold text-emerald-800">Primary ID (100 Points)</span>
          </div>
        </div>
      </div>

      {/* Cryptographic Seal */}
      <div className="p-4 bg-gray-50 border border-gray-300 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-[#002B49] text-[#FFCD00] flex items-center justify-center font-bold">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="font-bold text-gray-900">Commonwealth Cryptographic ImmiCard</div>
            <div className="text-gray-500 text-[11px]">
              Recognized under the Financial Transaction Reports Act 1988 as 100-point identity document.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
