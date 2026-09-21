import React from 'react';
import { ApplicantProfile } from '../../../types/portal';
import { ShieldCheck, HeartPulse, Plane, CheckCircle2, AlertCircle } from 'lucide-react';

interface DocumentProps {
  profile: ApplicantProfile;
  variant?: 'insurance-paper' | 'travel-insurance';
}

export const InsurancePaperDoc: React.FC<DocumentProps> = ({ profile, variant = 'insurance-paper' }) => {
  const isTravel = variant === 'travel-insurance';
  return (
    <div className="bg-white text-gray-900 font-sans p-6 sm:p-10 max-w-4xl mx-auto border border-gray-300 shadow-sm relative overflow-hidden print:p-0 print:border-none">
      {/* Insurer Header (Bupa Global / Medibank Australian Health & Travel Cover) */}
      <div className="border-b-2 border-emerald-700 pb-5 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-emerald-700 text-white flex items-center justify-center font-bold text-base rounded-md">
            {isTravel ? <Plane className="w-7 h-7" /> : <HeartPulse className="w-7 h-7" />}
          </div>
          <div>
            <div className="text-xl font-black tracking-tight text-emerald-900">
              Bupa Global <span className="text-gray-400 font-light">|</span> Australia
            </div>
            <p className="text-xs text-gray-500">
              {isTravel ? 'Official International Travel Insurance & Repatriation Underwriter' : 'Approved Overseas Visitor Health Cover (OVHC) & Comprehensive Medical Insurer'}
            </p>
          </div>
        </div>

        <div className="text-right">
          <div className="text-[10px] uppercase font-bold text-gray-400">{isTravel ? 'Travel Policy Ref' : 'Policy Certificate No.'}</div>
          <div className="font-mono text-sm font-extrabold text-emerald-800">
            {isTravel ? `TRV-INS-${profile.referenceNumber.replace('-', '')}` : `BUPA-AU-${profile.referenceNumber.replace('-', '')}`}
          </div>
          <div className="text-[10px] text-gray-500">Effective: {profile.grantDate}</div>
        </div>
      </div>

      {/* Compliance Ribbon for Condition 8501 */}
      <div className="mb-6 p-4 rounded-lg bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-800 block mb-0.5">
            Department of Home Affairs Regulatory Standard
          </span>
          <h2 className="text-lg font-black text-emerald-950">
            {isTravel ? 'Official Travel Insurance Letter & Transit Guarantee (Condition 8501 Compliant)' : 'Certificate of Health & Insurance Paper (Condition 8501 Compliant)'}
          </h2>
          <p className="text-xs text-emerald-800">
            {isTravel ? 'Including emergency air-ambulance medical evacuation, international repatriation, and 24/7 travel assistance.' : 'Fully satisfying mandatory health insurance requirements for Visa Subclasses 482, 186, and 491.'}
          </p>
        </div>

        <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-700 text-white shrink-0">
          <ShieldCheck className="w-4 h-4" />
          <span>{isTravel ? 'Travel Cover Verified' : 'Active & In Force'}</span>
        </span>
      </div>

      {/* Policyholder & Coverage Details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs mb-6">
        <div className="p-4 bg-gray-50 rounded border border-gray-200 space-y-2">
          <span className="text-[10px] uppercase font-bold text-gray-500 block">Insured Primary Member</span>
          <div className="text-sm font-bold text-gray-900">{profile.fullName}</div>
          <div className="text-gray-600">Date of Birth: <span className="font-semibold">{profile.dateOfBirth}</span></div>
          <div className="text-gray-600">Passport / Travel ID: <span className="font-mono font-bold">{profile.documentNumber}</span></div>
          <div className="text-gray-600">Nationality: <span className="font-semibold">{profile.nationality}</span></div>
        </div>

        <div className="p-4 bg-gray-50 rounded border border-gray-200 space-y-2">
          <span className="text-[10px] uppercase font-bold text-gray-500 block">Policy Schedule Parameters</span>
          <div className="text-gray-600">Plan Tier: <span className="font-bold text-gray-900">Corporate Platinum OVHC + Travel Expatriate</span></div>
          <div className="text-gray-600">Policy Validity: <span className="font-semibold text-emerald-800">{profile.grantDate} – {profile.visaExpiryDate}</span></div>
          <div className="text-gray-600">Sponsoring Corporation: <span className="font-semibold">{profile.sponsorName}</span></div>
          <div className="text-gray-600">ED Number: <span className="font-mono text-[#C88A24] font-bold">{profile.edNumber}</span></div>
        </div>
      </div>

      {/* Schedule of Benefits Table */}
      <div className="border border-gray-200 rounded overflow-hidden mb-6 text-xs">
        <div className="bg-emerald-800 text-white px-3.5 py-2 font-bold uppercase text-[11px] flex justify-between">
          <span>Schedule of Included Medical & Travel Coverages</span>
          <span>Coverage Limit</span>
        </div>
        <table className="w-full text-left">
          <tbody className="divide-y divide-gray-200">
            <tr>
              <td className="p-3 font-semibold text-gray-800">
                100% Inpatient Hospital Accommodation & Treatment (Public & Private Hospitals)
              </td>
              <td className="p-3 font-mono font-bold text-emerald-800 text-right">UNLIMITED (100% MBS)</td>
            </tr>
            <tr className="bg-gray-50/50">
              <td className="p-3 font-semibold text-gray-800">
                Emergency Medical Evacuation & Royal Flying Doctor Service (RFDS) Remote Extraction
              </td>
              <td className="p-3 font-mono font-bold text-emerald-800 text-right">COVERED IN FULL</td>
            </tr>
            <tr>
              <td className="p-3 font-semibold text-gray-800">
                International Travel Insurance, Flight Interruption & Repatriation of Remains
              </td>
              <td className="p-3 font-mono font-bold text-emerald-800 text-right">AUD $2,000,000</td>
            </tr>
            <tr className="bg-gray-50/50">
              <td className="p-3 font-semibold text-gray-800">
                Outpatient Medical Consultations, Pathology & Diagnostic Imaging
              </td>
              <td className="p-3 font-mono font-bold text-emerald-800 text-right">100% Medicare Benefits Rate</td>
            </tr>
            <tr>
              <td className="p-3 font-semibold text-gray-800">
                Prescription Pharmaceutical Benefits Scheme (PBS) Medicines
              </td>
              <td className="p-3 font-mono font-bold text-emerald-800 text-right">Up to $10,000 / annum</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Footer Validation */}
      <div className="pt-4 border-t-2 border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-gray-500">
        <div>
          <div className="font-bold text-gray-900">Bupa HI Pty Ltd (ABN 81 000 057 590)</div>
          <div>Australian Prudential Regulation Authority (APRA) Registered Health Benefit Fund</div>
        </div>
        <div className="font-mono text-[11px] text-right">
          <span className="text-emerald-700 font-bold">✓ Condition 8501 Compliant</span>
          <div>DVS Digital Gateway: BUPA-AU-VERIFIED</div>
        </div>
      </div>
    </div>
  );
};
