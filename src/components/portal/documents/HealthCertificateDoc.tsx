import React from 'react';
import { ApplicantProfile } from '../../../types/portal';
import { Stethoscope, CheckCircle2, ShieldCheck, Activity, FileCheck } from 'lucide-react';

interface DocumentProps {
  profile: ApplicantProfile;
}

export const HealthCertificateDoc: React.FC<DocumentProps> = ({ profile }) => {
  return (
    <div className="bg-white text-gray-900 font-sans p-6 sm:p-10 max-w-4xl mx-auto border border-gray-300 shadow-sm relative overflow-hidden print:p-0 print:border-none">
      {/* Official Commonwealth eMedical Header */}
      <div className="border-b-2 border-[#002B49] pb-5 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-sky-800 text-white flex items-center justify-center font-bold text-sm rounded-md shadow-sm">
            <Stethoscope className="w-7 h-7" />
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-sky-800">
              Department of Home Affairs • eMedical System
            </div>
            <h1 className="text-xl font-black tracking-tight text-[#002B49]">
              Immigration Health Clearance Certificate
            </h1>
            <p className="text-xs text-gray-500">
              Bupa Medical Visa Services & Panel Physician Assessment Report
            </p>
          </div>
        </div>

        <div className="text-right">
          <div className="text-[10px] uppercase font-bold text-gray-400">Health Assessment (HAP) ID</div>
          <div className="font-mono text-base font-black text-sky-900">{profile.hapId}</div>
          <div className="text-[10px] text-gray-500">Reference: {profile.referenceNumber}</div>
        </div>
      </div>

      {/* Primary Assessment Outcome */}
      <div className="mb-6 p-4 rounded-lg bg-emerald-50 border border-emerald-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800 block mb-1">
            Official Migration Medical Officer Determination
          </span>
          <h2 className="text-base sm:text-lg font-black text-emerald-950">
            MEETS THE AUSTRALIAN HEALTH REQUIREMENT
          </h2>
          <p className="text-xs text-emerald-800">
            Certified under Section 65 of the Migration Act 1958 and Public Interest Criteria (PIC) 4005 / 4007.
          </p>
        </div>

        <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-700 text-white shrink-0">
          <CheckCircle2 className="w-4 h-4" />
          <span>Cleared for Visa Grant</span>
        </span>
      </div>

      {/* Patient Biometrics & Exam Scope */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs mb-6">
        <div className="p-3.5 bg-gray-50 rounded border border-gray-200 space-y-1.5">
          <span className="text-[10px] uppercase font-bold text-gray-500 block mb-1">Client Identification</span>
          <div>Full Legal Name: <strong className="text-gray-900">{profile.fullName}</strong></div>
          <div>Date of Birth: <strong className="text-gray-900">{profile.dateOfBirth}</strong></div>
          <div>Nationality: <strong className="text-gray-900">{profile.nationality}</strong></div>
          <div>Passport No: <strong className="font-mono">{profile.documentNumber}</strong></div>
        </div>

        <div className="p-3.5 bg-gray-50 rounded border border-gray-200 space-y-1.5">
          <span className="text-[10px] uppercase font-bold text-gray-500 block mb-1">Examination Parameters</span>
          <div>Visa Subclass: <strong className="text-gray-900">{profile.visaSubclass}</strong></div>
          <div>Employer Declaration: <strong className="font-mono text-[#C88A24]">{profile.edNumber}</strong></div>
          <div>Panel Clinic: <strong className="text-gray-900">Bupa Medical Visa Services Hub</strong></div>
          <div>Health Undertaking Required: <strong className="text-emerald-700">NO (Unconditional)</strong></div>
        </div>
      </div>

      {/* Clinical Examinations Table */}
      <div className="border border-gray-200 rounded overflow-hidden mb-6 text-xs">
        <div className="bg-[#002B49] text-white px-3.5 py-2 font-bold uppercase text-[11px] flex justify-between">
          <span>Prescribed Statutory Examination Items</span>
          <span>Result</span>
        </div>
        <table className="w-full text-left">
          <tbody className="divide-y divide-gray-200">
            <tr>
              <td className="p-3 font-semibold text-gray-800">
                501 Medical Examination (Comprehensive Physical & Systemic Check)
              </td>
              <td className="p-3 font-bold text-emerald-800 text-right">PASSED / NORMAL</td>
            </tr>
            <tr className="bg-gray-50/50">
              <td className="p-3 font-semibold text-gray-800">
                502 Chest X-Ray Examination (Radiological Pulmonary Tuberculosis Screening)
              </td>
              <td className="p-3 font-bold text-emerald-800 text-right">CLEARED / NO PATHOLOGY</td>
            </tr>
            <tr>
              <td className="p-3 font-semibold text-gray-800">
                705 Serum Creatinine / eGFR & Kidney Function Test
              </td>
              <td className="p-3 font-bold text-emerald-800 text-right">NORMAL RANGE</td>
            </tr>
            <tr className="bg-gray-50/50">
              <td className="p-3 font-semibold text-gray-800">
                707 HIV / Blood Serology & Hepatitis Surface Antigen Screening
              </td>
              <td className="p-3 font-bold text-emerald-800 text-right">NEGATIVE / NON-REACTIVE</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Medical Officer Signoff */}
      <div className="pt-6 border-t-2 border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 text-xs">
        <div>
          <div className="font-serif italic text-base font-bold text-gray-900">Dr. Catherine V. Sterling, MBBS, FRACGP</div>
          <div className="font-bold text-gray-900">Commonwealth Medical Officer of the Commonwealth (MOC) Delegate</div>
          <div className="text-gray-500">Australian Migration Health Operations Centre</div>
        </div>

        <div className="border-2 border-sky-800 p-2.5 rounded text-center">
          <div className="text-[10px] font-black text-sky-900 uppercase">eMEDICAL CLEARED</div>
          <div className="text-[9px] font-mono text-gray-500 mt-0.5">DVS Digital Match: 100%</div>
        </div>
      </div>
    </div>
  );
};
