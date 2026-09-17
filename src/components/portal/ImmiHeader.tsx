import React from 'react';
import { ShieldCheck, FileCheck, Award, Lock, ExternalLink, HelpCircle } from 'lucide-react';

interface ImmiHeaderProps {
  activeTab: 'verification' | 'positive-list' | 'vevo' | 'security';
  onTabChange: (tab: 'verification' | 'positive-list' | 'vevo' | 'security') => void;
  onOpenHelp?: () => void;
}

export const ImmiHeader: React.FC<ImmiHeaderProps> = ({
  activeTab,
  onTabChange,
  onOpenHelp,
}) => {
  return (
    <header className="bg-[#002B49] text-white border-b-4 border-[#C88A24] shadow-md sticky top-0 z-40">
      {/* Top micro-bar: Commonwealth Notice */}
      <div className="bg-[#001D33] text-gray-300 text-[11px] py-1 px-4 sm:px-8 flex flex-wrap items-center justify-between border-b border-[#0A3D63]">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-medium text-gray-200">Australian Government Document Verification Service (DVS) Connected</span>
          <span className="text-gray-500 hidden sm:inline">|</span>
          <span className="hidden md:inline text-gray-400">Official Department of Home Affairs ImmiAccount Portal</span>
        </div>
        <div className="flex items-center gap-4 text-gray-300">
          <span className="flex items-center gap-1">
            <Lock className="w-3 h-3 text-[#C88A24]" />
            <span className="font-mono text-[10px] text-gray-400">256-Bit SSL Secure</span>
          </span>
          <button
            onClick={onOpenHelp}
            className="hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
          >
            <HelpCircle className="w-3 h-3" />
            <span className="hidden sm:inline">Help & Guidelines</span>
          </button>
        </div>
      </div>

      {/* Main Commonwealth Header Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* Left: Australian Coat of Arms & Department Branding */}
        <div className="flex items-center gap-4">
          {/* Australian Coat of Arms Vector Emblem */}
          <div className="flex items-center justify-center w-14 h-14 bg-white/10 rounded-lg p-1.5 border border-white/20 shadow-inner">
            <svg viewBox="0 0 100 100" className="w-full h-full text-[#FFCD00]" fill="currentColor">
              {/* Stylized Australian Kangaroo & Emu Shield Crest */}
              <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="2.5" strokeDasharray="3 2" />
              <path d="M50 14 L55 24 L65 24 L57 30 L60 40 L50 34 L40 40 L43 30 L35 24 L45 24 Z" fill="#C88A24" />
              {/* Shield */}
              <path d="M36 36 L64 36 C64 56 50 68 50 68 C50 68 36 56 36 36 Z" fill="#0A3D63" stroke="#C88A24" strokeWidth="2.5" />
              {/* Kangaroo left silhouette */}
              <path d="M22 62 C22 46 30 38 34 38 C34 44 32 54 36 62 C34 66 26 66 22 62 Z" fill="#C88A24" />
              {/* Emu right silhouette */}
              <path d="M78 62 C78 46 70 38 66 38 C66 44 68 54 64 62 C66 66 74 66 78 62 Z" fill="#C88A24" />
              {/* Star of Federation */}
              <circle cx="50" cy="49" r="6" fill="#FFCD00" />
              <rect x="30" y="74" width="40" height="4" rx="2" fill="#C88A24" />
              <text x="50" y="85" textAnchor="middle" fontSize="6.5" fill="#E0E3E6" fontWeight="bold" letterSpacing="0.8">AUSTRALIA</text>
            </svg>
          </div>

          <div>
            <div className="text-[11px] tracking-wider uppercase text-gray-300 font-semibold flex items-center gap-1.5">
              <span>Australian Government</span>
              <span className="text-gray-500">•</span>
              <span className="text-[#FBBF24]">Department of Home Affairs</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-tight flex items-center gap-2">
              <span>ImmiAccount</span>
              <span className="text-xs px-2 py-0.5 rounded bg-[#0A3D63] text-gray-200 border border-[#16568A] font-medium tracking-normal">
                Verification Portal
              </span>
            </h1>
            <p className="text-xs text-gray-300">
              Document Verification Service (DVS) & Skilled Work Entitlements
            </p>
          </div>
        </div>

        {/* Right: Security & Quick VEVO Badge */}
        <div className="hidden lg:flex items-center gap-3">
          <div className="bg-[#001D33] border border-[#0A3D63] px-3.5 py-2 rounded-lg flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-gray-400">VEVO Live Status</div>
              <div className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                <span>Direct Verification Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Bar */}
      <nav className="bg-[#00223A] border-t border-[#0A3D63] px-4 sm:px-8 overflow-x-auto scrollbar-none">
        <div className="max-w-7xl mx-auto flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-semibold">
          <button
            onClick={() => onTabChange('verification')}
            className={`flex items-center gap-2 px-3.5 py-3 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'verification'
                ? 'border-[#C88A24] text-white bg-[#001D33]'
                : 'border-transparent text-gray-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <FileCheck className="w-4 h-4 text-[#FBBF24]" />
            <span>Document Verification & Viewer</span>
          </button>

          <button
            onClick={() => onTabChange('positive-list')}
            className={`flex items-center gap-2 px-3.5 py-3 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'positive-list'
                ? 'border-[#C88A24] text-white bg-[#001D33]'
                : 'border-transparent text-gray-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Award className="w-4 h-4 text-[#FBBF24]" />
            <span>Positive List for Skilled Work</span>
            <span className="ml-1 text-[10px] px-1.5 py-0.2 rounded-full bg-[#C88A24] text-black font-extrabold">
              ANZSCO
            </span>
          </button>

          <button
            onClick={() => onTabChange('vevo')}
            className={`flex items-center gap-2 px-3.5 py-3 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'vevo'
                ? 'border-[#C88A24] text-white bg-[#001D33]'
                : 'border-transparent text-gray-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>VEVO Entitlements & Work Rights</span>
          </button>

          <button
            onClick={() => onTabChange('security')}
            className={`flex items-center gap-2 px-3.5 py-3 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'security'
                ? 'border-[#C88A24] text-white bg-[#001D33]'
                : 'border-transparent text-gray-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Lock className="w-4 h-4 text-sky-400" />
            <span>Security & Authenticity Standard</span>
          </button>
        </div>
      </nav>
    </header>
  );
};
