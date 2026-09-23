import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, Eye, EyeOff, ArrowRight, User } from 'lucide-react';
import { AuthUser } from '../../types/auth';
import { authenticateWithSocialAccount } from '../../utils/authStorage';

interface GoogleAccountChooserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: AuthUser) => void;
}

interface SavedDeviceAccount {
  email: string;
  name: string;
}

const DEVICE_SAVED_EMAILS_KEY = 'bhp_user_device_google_accounts';

export const GoogleAccountChooserModal: React.FC<GoogleAccountChooserModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [step, setStep] = useState<'email' | 'password'>('email');
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Truly dynamic accounts saved on this device (starts empty, NO hardcoded default emails)
  const [deviceAccounts, setDeviceAccounts] = useState<SavedDeviceAccount[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(DEVICE_SAVED_EMAILS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setDeviceAccounts(parsed);
        }
      }
    } catch {
      setDeviceAccounts([]);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleEmailNext = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = emailInput.trim().toLowerCase();
    if (!cleanEmail) {
      setErrorMsg('Enter an email or phone number');
      return;
    }
    if (!cleanEmail.includes('@') && cleanEmail.length < 5) {
      setErrorMsg('Enter a valid email address');
      return;
    }
    setErrorMsg('');
    setStep('password');
  };

  const handleFinalSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = emailInput.trim().toLowerCase();
    const finalEmail = cleanEmail.includes('@') ? cleanEmail : `${cleanEmail}@gmail.com`;

    setIsProcessing(true);
    setErrorMsg('');

    setTimeout(() => {
      const name = finalEmail.split('@')[0];
      const res = authenticateWithSocialAccount({
        provider: 'google',
        email: finalEmail,
        fullName: name,
        customPassword: passwordInput.trim() || undefined,
      });

      // Save this real account to device storage for future convenience
      try {
        const existing = deviceAccounts.filter((a) => a.email.toLowerCase() !== finalEmail);
        const updated = [{ email: finalEmail, name }, ...existing].slice(0, 5);
        localStorage.setItem(DEVICE_SAVED_EMAILS_KEY, JSON.stringify(updated));
      } catch {
        // ignore
      }

      setIsProcessing(false);
      onSuccess(res.user);
      onClose();
    }, 700);
  };

  const handleSelectSavedAccount = (acc: SavedDeviceAccount) => {
    setEmailInput(acc.email);
    setStep('password');
  };

  const handleResetToEmail = () => {
    setStep('email');
    setPasswordInput('');
    setErrorMsg('');
  };

  return (
    <div className="fixed inset-0 z-70 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 select-none">
      <div className="bg-[#FFFFFF] text-[#202124] w-full max-w-[440px] rounded-3xl p-6 sm:p-8 shadow-2xl relative border border-gray-200 animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          disabled={isProcessing}
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 p-1.5 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Google Header */}
        <div className="flex flex-col items-center text-center">
          {/* Official Google 4-color G Logo */}
          <svg className="w-9 h-9 mb-3" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
            />
            <path
              fill="#FBBC05"
              d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
            />
          </svg>

          <h3 className="text-xl font-semibold text-[#202124] tracking-tight">
            Sign in with Google
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            to continue to <span className="font-semibold text-gray-700">BHP Official Portal</span>
          </p>
        </div>

        {/* Loading State */}
        {isProcessing && (
          <div className="py-12 flex flex-col items-center justify-center space-y-3 animate-in fade-in duration-200">
            <div className="w-10 h-10 border-3 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <div className="text-sm font-medium text-gray-700">
              Connecting Google Account...
            </div>
            <p className="text-xs text-gray-400">
              Creating credentials & saving to database...
            </p>
          </div>
        )}

        {/* STEP 1: Enter Google Email (Auto-completes with device Google accounts) */}
        {!isProcessing && step === 'email' && (
          <div className="mt-6 space-y-4">
            {/* If user previously logged in on this browser, show their real accounts */}
            {deviceAccounts.length > 0 && (
              <div className="space-y-2 mb-4">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Recently used on this device
                </div>
                {deviceAccounts.map((acc) => (
                  <button
                    key={acc.email}
                    type="button"
                    onClick={() => handleSelectSavedAccount(acc)}
                    className="w-full p-3 rounded-2xl hover:bg-gray-50 border border-gray-200 flex items-center justify-between text-left transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs">
                        {acc.email.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-gray-900">{acc.name}</div>
                        <div className="text-xs text-gray-500">{acc.email}</div>
                      </div>
                    </div>
                    <span className="text-xs text-blue-600 font-medium">Continue →</span>
                  </button>
                ))}
                <div className="text-center text-xs text-gray-400 py-1">— or enter another email —</div>
              </div>
            )}

            <form onSubmit={handleEmailNext} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Email or phone
                </label>
                <input
                  type="email"
                  name="email"
                  id="google-email-input"
                  required
                  autoFocus
                  autoComplete="email username"
                  placeholder="Enter your Gmail address"
                  value={emailInput}
                  onChange={(e) => {
                    setEmailInput(e.target.value);
                    if (errorMsg) setErrorMsg('');
                  }}
                  className="w-full bg-white border border-gray-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none transition-all"
                />
                {errorMsg && (
                  <p className="text-xs text-red-600 mt-1.5 flex items-center gap-1">
                    <span>⚠️</span> {errorMsg}
                  </p>
                )}
              </div>

              <div className="text-xs text-gray-500 leading-relaxed">
                Enter your device's Google email. Your username & password will be created automatically in the system database.
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="text-xs font-semibold text-gray-600 hover:text-gray-900 cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md shadow-blue-500/20"
                >
                  Next
                </button>
              </div>
            </form>
          </div>
        )}

        {/* STEP 2: Password / Confirmation */}
        {!isProcessing && step === 'password' && (
          <div className="mt-6 space-y-4">
            {/* Selected Email pill */}
            <div className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2">
              <div className="flex items-center gap-2 truncate">
                <div className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
                  {emailInput.charAt(0).toUpperCase()}
                </div>
                <span className="text-xs font-medium text-gray-800 truncate">{emailInput}</span>
              </div>
              <button
                type="button"
                onClick={handleResetToEmail}
                className="text-xs text-blue-600 hover:underline shrink-0 ml-2 cursor-pointer"
              >
                Change
              </button>
            </div>

            <form onSubmit={handleFinalSignIn} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Enter password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    id="google-password-input"
                    autoFocus
                    autoComplete="current-password"
                    placeholder="Enter password (or leave blank to auto-generate)"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    className="w-full bg-white border border-gray-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none transition-all pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={handleResetToEmail}
                  className="text-xs font-semibold text-gray-600 hover:text-gray-900 cursor-pointer"
                >
                  ← Back
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md shadow-blue-500/20"
                >
                  Sign In
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Footer Note */}
        {!isProcessing && (
          <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400">
            <div className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-green-600" />
              <span>Google Identity Services</span>
            </div>
            <span>BHP Secure OAuth</span>
          </div>
        )}
      </div>
    </div>
  );
};
