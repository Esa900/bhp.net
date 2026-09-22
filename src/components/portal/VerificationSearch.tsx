import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  FileText,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  KeyRound,
  Sparkles,
  Building2,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
  ArrowRight,
  Fingerprint,
  CreditCard,
  Plane,
  FileCheck,
  BadgeCheck,
} from 'lucide-react';
import { ApplicantProfile, DocumentType } from '../../types/portal';
import { SAMPLE_PROFILES } from '../../data/portalData';
import { DOCUMENT_MENU_ITEMS, DocumentMenuItem } from '../../data/menuNavigationItems';
import { getStoredMenuItems, MENU_ITEMS_UPDATED_EVENT } from '../../utils/menuItemsStorage';

interface VerificationSearchProps {
  currentProfile: ApplicantProfile;
  onSelectProfile: (profile: ApplicantProfile) => void;
  onSearch: (query: string, fieldKey: string, menuItem: DocumentMenuItem) => void;
  isVerifying: boolean;
  activeMenuItemId?: string;
  onSelectMenuItem?: (menuItemId: string) => void;
  onOpenDocumentModal?: (docType: DocumentType) => void;
}

export const VerificationSearch: React.FC<VerificationSearchProps> = ({
  currentProfile,
  onSelectProfile,
  onSearch,
  isVerifying,
  activeMenuItemId = 'australia-work-permit',
  onSelectMenuItem,
  onOpenDocumentModal,
}) => {
  const [menuItems, setMenuItems] = useState<DocumentMenuItem[]>(() => getStoredMenuItems());

  useEffect(() => {
    const handleUpdate = () => {
      setMenuItems(getStoredMenuItems());
    };

    window.addEventListener(MENU_ITEMS_UPDATED_EVENT, handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener(MENU_ITEMS_UPDATED_EVENT, handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const activeItem =
    menuItems.find((item) => item.id === activeMenuItemId) || menuItems[0] || DOCUMENT_MENU_ITEMS[0];

  const inputRef = useRef<HTMLInputElement>(null);

  // Helper to extract the designated value for a profile based on the fieldKey
  const getProfileValueOfField = (profile: ApplicantProfile, fieldKey: string): string => {
    switch (fieldKey) {
      case 'tinOrRef':
        return profile.referenceNumber;
      case 'idNumber':
        return profile.edNumber;
      case 'verificationIdNo':
        return profile.verificationIdNo || 'VRF-99420-AU';
      case 'transitionIdNo':
        return profile.transitionIdNo || 'VFS-TRN-882190';
      case 'referenceNo':
      case 'visaAckRefNo':
        return profile.referenceNumber;
      case 'visaGrantedIdNo':
        return profile.visaGrantNumber || profile.documentNumber;
      case 'insuranceNo':
        return profile.insuranceNo || 'BUPA-OVHC-7741029';
      case 'passengerName':
        return profile.fullName;
      case 'cardNo':
        return profile.immiCardNo || 'IMMI-CARD-492019';
      case 'subclassVisaNo':
        return profile.visaSubclass.includes('482') ? '482' : '186';
      default:
        return profile.referenceNumber;
    }
  };

  const [designatedInput, setDesignatedInput] = useState(() =>
    getProfileValueOfField(currentProfile, activeItem.fieldKey)
  );
  const [searchFeedback, setSearchFeedback] = useState<string | null>(null);

  // When active item or current profile changes, sync designated input
  useEffect(() => {
    const val = getProfileValueOfField(currentProfile, activeItem.fieldKey);
    setDesignatedInput(val);
    setSearchFeedback(null);
    // Focus the designated input
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [activeItem.id, currentProfile.id]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!designatedInput.trim()) {
      setSearchFeedback(`Please enter a valid ${activeItem.fieldLabel}.`);
      return;
    }
    setSearchFeedback(null);
    onSearch(designatedInput.trim(), activeItem.fieldKey, activeItem);
  };

  const handleQuickSampleClick = (profile: ApplicantProfile) => {
    const val = getProfileValueOfField(profile, activeItem.fieldKey);
    setDesignatedInput(val);
    setSearchFeedback(null);
    onSelectProfile(profile);
    onSearch(val, activeItem.fieldKey, activeItem);
  };

  return (
    <section id="verification-search-section" className="bg-white rounded-xl shadow-sm border border-[#D5D9DE] overflow-hidden mb-8">
      {/* Top Banner Stripe */}
      <div className="bg-[#002B49] text-white px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#001D33]">
        <div>
          <div className="text-xs font-bold text-[#FFCD00] uppercase tracking-wider flex items-center gap-1.5">
            <KeyRound className="w-3.5 h-3.5 text-[#FFCD00]" />
            <span>Commonwealth Document Verification Service (DVS) Portal</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-white mt-0.5 flex items-center gap-2">
            <span>{activeItem.mainTitle}</span>
          </h2>
          <div className="text-xs text-gray-300 mt-0.5 flex items-center gap-1.5">
            <span>Sub-Menu:</span>
            <strong className="text-[#FFCD00] font-semibold">{activeItem.subMenu}</strong>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 rounded-full text-xs font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>DVS Database Active</span>
          </div>
        </div>
      </div>

      {/* Categories Quick Navigation Strip */}
      <div className="bg-[#F4F6F8] border-b border-[#D5D9DE] px-4 sm:px-6 py-2.5 overflow-x-auto">
        <div className="flex items-center gap-2 min-w-max">
          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">
            Verification Categories ({menuItems.length} Items):
          </span>
          <div className="flex items-center gap-1.5">
            {menuItems.map((item, index) => {
              const isSelected = item.id === activeItem.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSelectMenuItem?.(item.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                    isSelected
                      ? 'bg-[#002B49] text-white shadow-sm font-bold ring-1 ring-[#002B49]'
                      : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                  title={`${item.mainTitle} -> ${item.subMenu}`}
                >
                  <span className={`w-4 h-4 rounded-full text-[10px] flex items-center justify-center font-bold ${
                    isSelected ? 'bg-[#FFCD00] text-[#002B49]' : 'bg-gray-200 text-gray-700'
                  }`}>
                    {index + 1}
                  </span>
                  <span className="max-w-[140px] truncate">{item.mainTitle}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Designated Context Explanation Card */}
        <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-[#EBF5FB] to-[#F4F9FD] border border-[#BFDBFE] flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#002B49] text-[#FFCD00]">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Designated Verification Action</span>
            </div>
            <h3 className="text-base font-bold text-gray-900">
              {activeItem.subMenu}
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed max-w-2xl">
              {activeItem.description}
            </p>
          </div>

          <div className="bg-white p-3 rounded-lg border border-blue-200 text-center shrink-0 min-w-[200px] shadow-2xs">
            <span className="text-[10px] uppercase font-bold text-gray-500 block">Designated Search Field</span>
            <span className="text-sm font-extrabold text-[#002B49] font-mono block mt-0.5">
              {activeItem.fieldLabel}
            </span>
            <span className="inline-block mt-1 text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-semibold">
              {activeItem.badge}
            </span>
          </div>
        </div>

        {/* Quick Test Verified Profiles for THIS designated field */}
        <div className="mb-6 p-4 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
          <div className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-2.5 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#C88A24]" />
              <span>Test with Verified Records (Click to populate "{activeItem.fieldLabel}"):</span>
            </div>
            <span className="text-[11px] text-gray-500 font-normal">3 Verified Profiles Loaded</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
            {SAMPLE_PROFILES.map((sample) => {
              const sampleVal = getProfileValueOfField(sample, activeItem.fieldKey);
              const isSelected = sample.id === currentProfile.id;
              return (
                <button
                  key={sample.id}
                  type="button"
                  onClick={() => handleQuickSampleClick(sample)}
                  className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#EBF5FB] border-[#002B49] shadow-sm ring-1 ring-[#002B49]'
                      : 'bg-white border-gray-200 hover:border-gray-400 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-sm text-gray-900">{sample.fullName}</span>
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold ${
                        isSelected ? 'bg-[#002B49] text-white' : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {sample.nationality}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 line-clamp-1">{sample.nominatedOccupation}</div>
                  <div className="mt-2 pt-2 border-t border-gray-100 flex items-center justify-between text-[11px]">
                    <span className="text-gray-500">{activeItem.fieldLabel}:</span>
                    <span className="text-[#002B49] font-mono font-bold">{sampleVal}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Form with the EXACT Designated Search Field */}
        <form onSubmit={handleFormSubmit} className="space-y-5">
          <div className="bg-[#F8FAFC] p-5 rounded-xl border border-gray-200">
            <label
              htmlFor="designated-search-input"
              className="block text-xs font-bold text-gray-900 uppercase tracking-wider mb-2 flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#002B49]"></span>
                <span className="text-sm font-bold text-[#002B49]">{activeItem.fieldLabel}</span>
              </div>
              <span className="text-gray-500 text-xs font-normal normal-case">
                Target Field for: <strong className="text-gray-900">{activeItem.subMenu}</strong>
              </span>
            </label>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                <FileCheck className="w-5 h-5 text-[#002B49]" />
              </div>
              <input
                id="designated-search-input"
                ref={inputRef}
                type="text"
                value={designatedInput}
                onChange={(e) => setDesignatedInput(e.target.value)}
                placeholder={activeItem.placeholder}
                className="w-full pl-11 pr-24 py-3 bg-white border-2 border-[#002B49]/30 rounded-lg text-sm text-gray-900 font-mono font-medium focus:outline-none focus:ring-2 focus:ring-[#002B49] focus:border-[#002B49] transition-all shadow-2xs"
              />
              {designatedInput && (
                <button
                  type="button"
                  onClick={() => setDesignatedInput('')}
                  className="absolute inset-y-0 right-2 px-2.5 py-1 text-xs text-gray-400 hover:text-gray-700 cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="mt-2.5 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-gray-500 gap-2">
              <span>
                Enter the official <strong className="text-gray-800">{activeItem.fieldLabel}</strong> to fetch verified records.
              </span>
              <span className="font-mono text-[11px] text-[#002B49] bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                Sample: {activeItem.sampleValue}
              </span>
            </div>
          </div>

          {searchFeedback && (
            <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
              <span>{searchFeedback}</span>
            </div>
          )}

          {/* Action Row */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-gray-200">
            <div className="flex items-center gap-2 text-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span className="text-gray-600">Active Profile:</span>
              <strong className="text-gray-900 font-medium">{currentProfile.fullName}</strong>
              <span className="font-mono text-gray-500">({currentProfile.referenceNumber})</span>
            </div>

            <div className="flex items-center gap-3">
              {onOpenDocumentModal && (
                <button
                  type="button"
                  onClick={() => onOpenDocumentModal(activeItem.documentType)}
                  className="px-4 py-2.5 bg-white hover:bg-gray-50 text-[#002B49] border border-[#002B49] font-bold text-xs sm:text-sm rounded-lg shadow-2xs transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <ExternalLink className="w-4 h-4 text-[#002B49]" />
                  <span>View Document Preview</span>
                </button>
              )}

              <button
                type="submit"
                disabled={isVerifying}
                className="px-6 py-2.5 bg-[#002B49] hover:bg-[#001D33] text-white font-bold text-xs sm:text-sm rounded-lg shadow-sm transition-all flex items-center gap-2 cursor-pointer disabled:opacity-70"
              >
                {isVerifying ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-[#FFCD00]" />
                    <span>Verifying with DVS...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4 text-[#FFCD00]" />
                    <span>Search & Authenticate {activeItem.subMenu}</span>
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
