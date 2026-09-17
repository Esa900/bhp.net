import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, Check, Cookie } from 'lucide-react';

interface CookieConsentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CookieConsentModal: React.FC<CookieConsentModalProps> = ({ isOpen, onClose }) => {
  const [preferences, setPreferences] = useState({
    necessary: true,
    performance: true,
    functional: true,
    targeting: false,
  });

  const [savedMessage, setSavedMessage] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    localStorage.setItem('bhp_cookie_prefs', JSON.stringify(preferences));
    setSavedMessage(true);
    setTimeout(() => {
      setSavedMessage(false);
      onClose();
    }, 1200);
  };

  const handleAcceptAll = () => {
    const all = { necessary: true, performance: true, functional: true, targeting: true };
    setPreferences(all);
    localStorage.setItem('bhp_cookie_prefs', JSON.stringify(all));
    setSavedMessage(true);
    setTimeout(() => {
      setSavedMessage(false);
      onClose();
    }, 1000);
  };

  const handleRejectNonEssential = () => {
    const strict = { necessary: true, performance: false, functional: false, targeting: false };
    setPreferences(strict);
    localStorage.setItem('bhp_cookie_prefs', JSON.stringify(strict));
    setSavedMessage(true);
    setTimeout(() => {
      setSavedMessage(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#1B1C1F] border border-[#34373F] text-white rounded-lg shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#2C2F36] bg-[#151618]">
          <div className="flex items-center gap-2.5">
            <Cookie className="w-5 h-5 text-[#F25C05]" />
            <h3 className="font-bold text-lg text-white">Privacy & Cookie Preferences</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-white rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto text-sm text-gray-300">
          <p>
            When you visit any website, it may store or retrieve information on your browser, mostly in the form of cookies. This information might be about you, your preferences or your device and is mostly used to make the site work as you expect it to.
          </p>

          {/* Cookie categories */}
          <div className="space-y-3 pt-2">
            {/* Strictly Necessary */}
            <div className="p-4 bg-[#23252B] border border-[#32353D] rounded-lg flex items-center justify-between">
              <div>
                <div className="font-bold text-white text-sm">Strictly Necessary Cookies</div>
                <div className="text-xs text-gray-400 mt-0.5">
                  Essential for website security, accessibility, and navigation. Cannot be switched off.
                </div>
              </div>
              <span className="text-xs font-bold text-[#F25C05] uppercase bg-[#33251A] px-2.5 py-1 rounded">
                Always Active
              </span>
            </div>

            {/* Performance & Analytics */}
            <div className="p-4 bg-[#23252B] border border-[#32353D] rounded-lg flex items-center justify-between">
              <div className="pr-4">
                <div className="font-bold text-white text-sm">Performance & Analytics Cookies</div>
                <div className="text-xs text-gray-400 mt-0.5">
                  Allows us to count visits and traffic sources so we can measure and improve the performance of our site.
                </div>
              </div>
              <input
                type="checkbox"
                checked={preferences.performance}
                onChange={(e) => setPreferences({ ...preferences, performance: e.target.checked })}
                className="w-5 h-5 accent-[#F25C05] cursor-pointer"
              />
            </div>

            {/* Functional */}
            <div className="p-4 bg-[#23252B] border border-[#32353D] rounded-lg flex items-center justify-between">
              <div className="pr-4">
                <div className="font-bold text-white text-sm">Functional Cookies</div>
                <div className="text-xs text-gray-400 mt-0.5">
                  Enables enhanced functionality, such as language preferences and interactive video playback.
                </div>
              </div>
              <input
                type="checkbox"
                checked={preferences.functional}
                onChange={(e) => setPreferences({ ...preferences, functional: e.target.checked })}
                className="w-5 h-5 accent-[#F25C05] cursor-pointer"
              />
            </div>

            {/* Targeting */}
            <div className="p-4 bg-[#23252B] border border-[#32353D] rounded-lg flex items-center justify-between">
              <div className="pr-4">
                <div className="font-bold text-white text-sm">Targeting & Media Cookies</div>
                <div className="text-xs text-gray-400 mt-0.5">
                  May be set through our site by our media partners to build a profile of your interests.
                </div>
              </div>
              <input
                type="checkbox"
                checked={preferences.targeting}
                onChange={(e) => setPreferences({ ...preferences, targeting: e.target.checked })}
                className="w-5 h-5 accent-[#F25C05] cursor-pointer"
              />
            </div>
          </div>

          {savedMessage && (
            <div className="p-3 bg-green-900/40 border border-green-500 text-green-300 text-xs rounded text-center font-bold">
              Cookie preferences saved successfully!
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-[#151618] border-t border-[#2C2F36] flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={handleRejectNonEssential}
            className="px-4 py-2 border border-gray-600 hover:border-white text-xs font-bold text-gray-300 uppercase rounded transition-colors"
          >
            Reject Non-Essential
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-[#2B2F38] hover:bg-[#383D48] text-xs font-bold text-white uppercase rounded transition-colors"
            >
              Save Preferences
            </button>
            <button
              onClick={handleAcceptAll}
              className="px-5 py-2 bg-[#F25C05] hover:bg-[#d84e00] text-xs font-bold text-white uppercase rounded transition-colors"
            >
              Accept All Cookies
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
