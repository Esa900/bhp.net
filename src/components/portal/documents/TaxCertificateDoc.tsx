import React from 'react';
import { ApplicantProfile } from '../../../types/portal';
import { Receipt, CheckCircle2, ShieldCheck, DollarSign } from 'lucide-react';

interface DocumentProps {
  profile: ApplicantProfile;
}

export const TaxCertificateDoc: React.FC<DocumentProps> = ({ profile }) => {
  return (
    <div className="bg-white text-gray-900 font-sans p-6 sm:p-10 max-w-4xl mx-auto border border-gray-300 shadow-sm relative overflow-hidden print:p-0 print:border-none">
      {/* Official ATO Header */}
      <div className="border-b-2 border-gray-900 pb-5 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-black text-white flex items-center justify-center font-bold text-xs rounded-sm">
            ATO
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
              Australian Government • Australian Taxation Office
            </div>
            <h1 className="text-xl font-black tracking-tight text-gray-950">
              Notice of Assessment & Income Tax Certificate
            </h1>
            <p className="text-xs text-gray-600">
              PAYG Withholding & Commonwealth Tax Compliance Statement
            </p>
          </div>
        </div>

        <div className="text-right">
          <div className="text-[10px] uppercase font-bold text-gray-400">ATO Notice No.</div>
          <div className="font-mono text-sm font-bold text-gray-900">ATO-NOA-{profile.referenceNumber.replace('-', '')}</div>
          <div className="text-[10px] text-gray-500">Financial Year: 2025–2026</div>
        </div>
      </div>

      {/* ATO Status Badge */}
      <div className="mb-6 p-4 rounded-lg bg-gray-50 border border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block mb-0.5">
            Australian Tax File Number Status
          </span>
          <h2 className="text-base font-bold text-gray-900">
            Compliant & Active Tax Assessment Record
          </h2>
          <p className="text-xs text-gray-600">
            Validated for Department of Home Affairs Employer Sponsorship Verification.
          </p>
        </div>

        <div className="flex items-center gap-1 px-3 py-1.5 bg-emerald-100 text-emerald-900 rounded-full font-bold text-xs">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
          <span>ATO Registered</span>
        </div>
      </div>

      {/* Taxpayer Profile Details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs mb-6">
        <div className="p-3.5 border border-gray-200 rounded space-y-1.5">
          <span className="text-[10px] font-bold uppercase text-gray-400 block">Taxpayer Details</span>
          <div>Legal Name: <strong className="text-gray-900">{profile.fullName}</strong></div>
          <div>Tax File Number (TFN): <strong className="font-mono text-gray-900">{profile.tfnNumber}</strong></div>
          <div>Date of Birth: <strong className="text-gray-900">{profile.dateOfBirth}</strong></div>
          <div>Passport ID: <strong className="font-mono">{profile.documentNumber}</strong></div>
        </div>

        <div className="p-3.5 border border-gray-200 rounded space-y-1.5">
          <span className="text-[10px] font-bold uppercase text-gray-400 block">Sponsoring Withholding Entity</span>
          <div>Employer: <strong className="text-gray-900">{profile.sponsorName}</strong></div>
          <div>Employer ABN: <strong className="font-mono text-gray-900">{profile.sponsorAbn}</strong></div>
          <div>Employer Declaration (ED): <strong className="font-mono text-[#C88A24]">{profile.edNumber}</strong></div>
          <div>Residency for Tax Purposes: <strong className="text-emerald-700 font-semibold">Australian Resident (Foreign Worker Stream)</strong></div>
        </div>
      </div>

      {/* Financial Assessment Table */}
      <div className="border border-gray-300 rounded overflow-hidden mb-6 text-xs">
        <div className="bg-gray-900 text-white px-3.5 py-2 font-bold uppercase text-[11px] flex justify-between">
          <span>Statutory Tax Assessment Calculation</span>
          <span>Amount (AUD)</span>
        </div>
        <table className="w-full text-left">
          <tbody className="divide-y divide-gray-200">
            <tr>
              <td className="p-3 font-semibold text-gray-700">Gross Contracted Taxable Income & Allowances</td>
              <td className="p-3 font-mono font-bold text-gray-900 text-right">$165,000.00</td>
            </tr>
            <tr className="bg-gray-50/50">
              <td className="p-3 font-semibold text-gray-700">PAYG Tax Withheld by Sponsoring Employer</td>
              <td className="p-3 font-mono font-bold text-gray-900 text-right">$47,820.00</td>
            </tr>
            <tr>
              <td className="p-3 font-semibold text-gray-700">Superannuation Guarantee Contribution (11.5%) Paid into Fund</td>
              <td className="p-3 font-mono font-bold text-emerald-800 text-right">$18,975.00</td>
            </tr>
            <tr className="bg-gray-50/50">
              <td className="p-3 font-semibold text-gray-700">Medicare Levy (Exemption / Surcharge Offset Applicable)</td>
              <td className="p-3 font-mono font-bold text-gray-900 text-right">$0.00 (Covered by OVHC)</td>
            </tr>
            <tr className="border-t-2 border-gray-900 bg-gray-100 font-bold">
              <td className="p-3 text-gray-900 uppercase">Balance Payable / Outstanding Tax Liability</td>
              <td className="p-3 font-mono text-emerald-800 text-right text-sm">$0.00 (NIL BALANCE)</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* ATO Certification */}
      <div className="pt-6 border-t-2 border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 text-xs">
        <div>
          <div className="font-bold text-gray-900">Commissioner of Taxation</div>
          <div className="text-gray-500">Australian Taxation Office • Canberra ACT 2600</div>
          <div className="text-[10px] text-gray-400 mt-0.5">This notice is an official Commonwealth taxation document.</div>
        </div>

        <div className="border border-gray-300 p-2.5 rounded bg-gray-50 text-right">
          <div className="text-[10px] font-mono text-gray-600">DVS Link: {profile.referenceNumber}</div>
          <div className="text-emerald-700 font-bold text-xs mt-0.5">✓ ATO Data Reconciled</div>
        </div>
      </div>
    </div>
  );
};
