import React, { useState } from 'react';
import { Search, FileText, CheckCircle2, AlertCircle, RefreshCw, KeyRound, Sparkles, Building2 } from 'lucide-react';
import { ApplicantProfile } from '../../types/portal';
import { SAMPLE_PROFILES } from '../../data/portalData';

interface VerificationSearchProps {
  currentProfile: ApplicantProfile;
  onSelectProfile: (profile: ApplicantProfile) => void;
  onSearch: (refNumber: string, edNumber: string) => void;
  isVerifying: boolean;
}

export const VerificationSearch: React.FC<VerificationSearchProps> = ({
  currentProfile,
  onSelectProfile,
  onSearch,
  isVerifying,
}) => {
  const [refInput, setRefInput] = useState(currentProfile.referenceNumber);
  const [edInput, setEdInput] = useState(currentProfile.edNumber);
  const [searchFeedback, setSearchFeedback] = useState<string | null>(null);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!refInput.trim() && !edInput.trim()) {
      setSearchFeedback('Please enter either a Reference Number or ED Number.');
      return;
    }
    setSearchFeedback(null);
    onSearch(refInput.trim(), edInput.trim());
  };

  const handleSampleClick = (profile: ApplicantProfile) => {
    setRefInput(profile.referenceNumber);
    setEdInput(profile.edNumber);
    setSearchFeedback(null);
    onSelectProfile(profile);
  };

  return (
    <section className="bg-white rounded-xl shadow-sm border border-[#D5D9DE] overflow-hidden mb-8">
      {/* Australian Gov Top Banner Stripe */}
      <div className="bg-[#F4F6F8] border-b border-[#D5D9DE] px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="text-xs font-bold text-[#002B49] uppercase tracking-wider flex items-center gap-1.5">
            <KeyRound className="w-3.5 h-3.5 text-[#C88A24]" />
            <span>Document Verification & Retrieval System</span>
          </div>
          <h2 className="text-lg font-bold text-gray-900 mt-0.5">
            Client Verification & Document Access
          </h2>
        </div>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full text-xs font-semibold">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>DVS Database Online</span>
        </div>
      </div>

      <div className="p-6">
        <p className="text-sm text-gray-600 mb-5 leading-relaxed">
          Clients and sponsoring organizations can enter their <strong className="text-gray-900">Reference Number</strong> (e.g. Visa TRN / Ref) or <strong className="text-gray-900">ED Number</strong> (Employer-Declaration ID) to securely fetch and authenticate all official visa, employment, tax, and medical documents.
        </p>

        {/* Quick Sample Selector Chips */}
        <div className="mb-6 p-4 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
          <div className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#C88A24]" />
            <span>Quick Test Verified Profiles (Click to Load):</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
            {SAMPLE_PROFILES.map((sample) => {
              const isSelected = sample.id === currentProfile.id;
              return (
                <button
                  key={sample.id}
                  type="button"
                  onClick={() => handleSampleClick(sample)}
                  className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#EBF5FB] border-[#002B49] shadow-sm ring-1 ring-[#002B49]'
                      : 'bg-white border-gray-200 hover:border-gray-400 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-sm text-gray-900">{sample.fullName}</span>
                    <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold ${
                      isSelected ? 'bg-[#002B49] text-white' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {sample.nationality}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 line-clamp-1">{sample.nominatedOccupation}</div>
                  <div className="mt-2 pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] font-mono">
                    <span className="text-blue-800 font-semibold">{sample.referenceNumber}</span>
                    <span className="text-[#C88A24] font-semibold">{sample.edNumber}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Form Inputs for Reference Number & ED Number */}
        <form onSubmit={handleFormSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
            {/* 1. Reference Number Input */}
            <div>
              <label htmlFor="ref-input" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                <span>Reference Number (TRN / Visa Ref)</span>
                <span className="text-gray-600 text-[11px] lowercase font-normal">e.g. REF-928410</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-600">
                  <FileText className="w-4 h-4" />
                </div>
                <input
                  id="ref-input"
                  type="text"
                  value={refInput}
                  onChange={(e) => setRefInput(e.target.value)}
                  placeholder="Enter Reference Number (e.g. REF-928410)..."
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 font-mono focus:outline-none focus:ring-2 focus:ring-[#002B49] focus:border-transparent transition-all"
                />
              </div>
              <p className="mt-1 text-[11px] text-gray-600">
                Found on your Visa Application Received Notice or Visa Grant Letter.
              </p>
            </div>

            {/* 2. ED Number Input */}
            <div>
              <label htmlFor="ed-input" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                <span>ED Number (Employer-Declaration ID)</span>
                <span className="text-gray-600 text-[11px] lowercase font-normal">e.g. ED-78412-WA</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-600">
                  <Building2 className="w-4 h-4" />
                </div>
                <input
                  id="ed-input"
                  type="text"
                  value={edInput}
                  onChange={(e) => setEdInput(e.target.value)}
                  placeholder="Enter ED Number (e.g. ED-78412-WA)..."
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 font-mono focus:outline-none focus:ring-2 focus:ring-[#002B49] focus:border-transparent transition-all"
                />
              </div>
              <p className="mt-1 text-[11px] text-gray-600">
                Issued for nominated employment, acceptance, and sponsorship verification.
              </p>
            </div>
          </div>

          {searchFeedback && (
            <div className="mb-4 p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
              <span>{searchFeedback}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-gray-200">
            <div className="text-xs text-gray-600 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>Active Verified Session for:</span>
              <strong className="text-gray-900 font-mono">{currentProfile.fullName}</strong>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setRefInput(currentProfile.referenceNumber);
                  setEdInput(currentProfile.edNumber);
                  setSearchFeedback(null);
                }}
                className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
              >
                Reset Fields
              </button>
              <button
                type="submit"
                disabled={isVerifying}
                className="px-6 py-2.5 bg-[#002B49] hover:bg-[#001D33] text-white font-bold text-sm rounded-lg shadow-sm transition-all flex items-center gap-2 cursor-pointer disabled:opacity-70"
              >
                {isVerifying ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-[#C88A24]" />
                    <span>Verifying with DVS...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4 text-[#FBBF24]" />
                    <span>Fetch & Authenticate Documents</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
};
