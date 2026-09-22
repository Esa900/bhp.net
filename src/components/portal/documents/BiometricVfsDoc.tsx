import React from 'react';
import { ApplicantProfile } from '../../../types/portal';
import { Fingerprint, ShieldCheck, CheckCircle2, QrCode, Calendar, MapPin, User, Building2, FileCheck } from 'lucide-react';

interface DocumentProps {
  profile: ApplicantProfile;
}

export const BiometricVfsDoc: React.FC<DocumentProps> = ({ profile }) => {
  const transitionId = profile.transitionIdNo || 'VFS-TRN-882190';

  return (
    <div className="bg-white text-gray-900 font-sans p-6 sm:p-10 max-w-4xl mx-auto border border-gray-300 shadow-sm relative overflow-hidden print:p-0 print:border-none">
      {/* VFS Global & Australian Government Header */}
      <div className="border-b-4 border-[#002B49] pb-6 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-[#002B49] text-white flex flex-col items-center justify-center font-bold text-xs rounded-lg shadow-sm border border-[#C88A24]">
            <Fingerprint className="w-8 h-8 text-[#FFCD00]" />
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-[#002B49]">
              VFS.GLOBAL • PARTNERING HOME AFFAIRS AUSTRALIA
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[#002B49]">
              Biometric Collection Confirmation Receipt
            </h1>
            <p className="text-xs text-gray-600">
              Department of Home Affairs Biometrics Program • Section 40 of Migration Act 1958
            </p>
          </div>
        </div>

        <div className="text-right">
          <div className="text-[10px] uppercase font-bold text-gray-400">Transition ID No</div>
          <div className="font-mono text-sm sm:text-base font-black text-[#002B49]">
            {transitionId}
          </div>
          <div className="text-[10px] text-emerald-700 font-bold mt-0.5 flex items-center justify-end gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>COLLECTION COMPLETE</span>
          </div>
        </div>
      </div>

      {/* Confirmation Status Banner */}
      <div className="mb-6 p-4 rounded-lg bg-gradient-to-r from-[#002B49] to-[#0A3D63] text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#FFCD00] block mb-1">
            Commonwealth Verification Status
          </span>
          <h2 className="text-lg font-black text-white">
            BIOMETRICS SUCCESSFULLY RECORDED & TRANSMITTED
          </h2>
          <p className="text-xs text-gray-300">
            Facial photographic image and 10 digital fingerprints captured and authenticated with Home Affairs DVS gateway.
          </p>
        </div>

        <div className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 px-3.5 py-1.5 rounded-full text-xs font-bold shrink-0">
          Transmitted to Canberra
        </div>
      </div>

      {/* Data Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs mb-6">
        <div className="p-4 border border-gray-300 rounded-lg bg-[#F8FAFC] space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block mb-2">
            Applicant Identification
          </span>
          <div className="flex justify-between py-1 border-b border-gray-200">
            <span className="text-gray-500">Applicant Full Name:</span>
            <span className="font-bold text-gray-900">{profile.fullName}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-gray-200">
            <span className="text-gray-500">Passport Number:</span>
            <span className="font-mono font-bold text-gray-900">{profile.documentNumber}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-gray-200">
            <span className="text-gray-500">Nationality:</span>
            <span className="font-medium text-gray-900">{profile.nationality}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-gray-200">
            <span className="text-gray-500">Date of Birth:</span>
            <span className="font-medium text-gray-900">{profile.dateOfBirth}</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-gray-500">Visa Application Reference:</span>
            <span className="font-mono font-bold text-blue-900">{profile.referenceNumber}</span>
          </div>
        </div>

        <div className="p-4 border border-gray-300 rounded-lg bg-[#F8FAFC] space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block mb-2">
            Biometric Capture Technical Parameters
          </span>
          <div className="flex justify-between py-1 border-b border-gray-200">
            <span className="text-gray-500">Transition ID No:</span>
            <span className="font-mono font-bold text-[#002B49]">{transitionId}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-gray-200">
            <span className="text-gray-500">Facial Image Standard:</span>
            <span className="font-medium text-gray-900">ICAO Doc 9303 Compliant</span>
          </div>
          <div className="flex justify-between py-1 border-b border-gray-200">
            <span className="text-gray-500">Fingerprint Capture:</span>
            <span className="font-medium text-gray-900">10 Slaps / Flat Impressions (NIST 500ppi)</span>
          </div>
          <div className="flex justify-between py-1 border-b border-gray-200">
            <span className="text-gray-500">Collection Date & Time:</span>
            <span className="font-medium text-gray-900">{profile.applicationDate} • 11:20 AEST</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-gray-500">Nominated Occupation:</span>
            <span className="font-bold text-gray-900">{profile.nominatedOccupation}</span>
          </div>
        </div>
      </div>

      {/* Security Seal & Notice */}
      <div className="p-4 bg-gray-50 border border-gray-300 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded bg-[#002B49] text-[#FFCD00] flex items-center justify-center font-bold">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="font-bold text-gray-900">Encrypted Biometric Dispatch Receipt</div>
            <div className="text-gray-500 text-[11px]">
              SHA-256 Digital Verification Signature • Authorized VFS Global Officer 88102
            </div>
          </div>
        </div>

        <div className="font-mono text-center sm:text-right text-[11px] text-gray-600 bg-white px-3 py-2 border rounded">
          <div className="font-bold text-[#002B49]">BARCODE VERIFICATION</div>
          <div>*{transitionId}*</div>
        </div>
      </div>
    </div>
  );
};
