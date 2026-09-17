import React from 'react';
import { ApplicantProfile } from '../../types/portal';
import { ShieldCheck, CheckCircle2, AlertTriangle, Calendar, User, FileText, Lock, Globe } from 'lucide-react';

interface VevoCheckSectionProps {
  profile: ApplicantProfile;
  onOpenDocument: (type: any) => void;
}

export const VevoCheckSection: React.FC<VevoCheckSectionProps> = ({
  profile,
  onOpenDocument,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-[#D5D9DE] overflow-hidden mb-8">
      {/* Official VEVO Header */}
      <div className="bg-[#002B49] text-white p-6 border-b-4 border-emerald-500">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-white/10 text-xs font-semibold text-[#FFCD00] mb-2">
              <Globe className="w-3.5 h-3.5" />
              <span>Commonwealth VEVO Service (Direct Query)</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Visa Entitlement Verification Online (VEVO)
            </h2>
            <p className="text-xs sm:text-sm text-gray-300 mt-1">
              Real-time query of visa conditions, current stay validity, and work rights for registered employers and government bodies.
            </p>
          </div>

          <div className="bg-emerald-950/80 border border-emerald-400/40 px-4 py-2.5 rounded-lg text-right">
            <span className="text-[10px] uppercase font-bold text-emerald-300 block">VEVO Status</span>
            <span className="text-base font-extrabold text-emerald-400 flex items-center justify-end gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>IN EFFECT / VALID</span>
            </span>
          </div>
        </div>
      </div>

      {/* VEVO Details Matrix */}
      <div className="p-6">
        <div className="border border-gray-200 rounded-lg overflow-hidden mb-6 text-xs">
          <div className="bg-gray-100 text-gray-800 px-4 py-2.5 font-bold uppercase text-[11px] flex justify-between">
            <span>Visa Entitlement Status Report</span>
            <span className="font-mono text-gray-500">Query Time: Live Verified</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-200">
            <div className="p-4 space-y-2.5">
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span className="text-gray-500">Family / Given Names:</span>
                <span className="font-bold text-gray-900">{profile.fullName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span className="text-gray-500">Visa Class / Subclass:</span>
                <span className="font-bold text-[#002B49]">{profile.visaSubclass}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span className="text-gray-500">Visa Description:</span>
                <span className="font-semibold text-gray-800">{profile.visaStream}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span className="text-gray-500">Nominated Occupation:</span>
                <span className="font-bold text-gray-900">{profile.nominatedOccupation}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-gray-500">Visa Grant Date:</span>
                <span className="font-bold text-gray-900">{profile.grantDate}</span>
              </div>
            </div>

            <div className="p-4 space-y-2.5 bg-gray-50/50">
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span className="text-gray-500">Visa Grant Number:</span>
                <span className="font-mono font-bold text-emerald-800">{profile.visaGrantNumber}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span className="text-gray-500">Visa Expiry Date:</span>
                <span className="font-bold text-emerald-800">{profile.visaExpiryDate}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span className="text-gray-500">Entries Allowed:</span>
                <span className="font-bold text-gray-900">Multiple Entries</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span className="text-gray-500">Work Entitlement:</span>
                <span className="font-bold text-emerald-700">Condition 8107 – Sponsoring Employer Only</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-gray-500">Health Cover Status:</span>
                <span className="font-bold text-emerald-700">Condition 8501 Compliant (Bupa)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action button to view Visa Granted Paper */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-[#F8FAFC] border border-gray-200 rounded-lg text-xs">
          <div className="text-gray-600">
            For statutory documentation, refer to the full official <strong>Visa Grant Notice</strong> or <strong>Work Permit Authorization</strong>.
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenDocument('visa-granted')}
              className="px-4 py-2 bg-[#002B49] hover:bg-[#001D33] text-white font-bold rounded-lg transition-colors cursor-pointer"
            >
              Open Visa Grant Notice
            </button>
            <button
              onClick={() => onOpenDocument('work-permit')}
              className="px-4 py-2 bg-white hover:bg-gray-100 border border-gray-300 text-gray-800 font-bold rounded-lg transition-colors cursor-pointer"
            >
              Open Work Permit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
