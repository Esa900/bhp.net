import React, { useState, useEffect } from 'react';
import {
  X,
  Briefcase,
  Users,
  Settings,
  ShieldCheck,
  Check,
  Eye,
  EyeOff,
  LogOut,
  Key,
  Lock,
  Globe,
  Search,
  ExternalLink,
  AlertCircle,
  FileText,
} from 'lucide-react';
import { useAdminData, AdminRole } from '../../context/AdminDataContext';
import { AdminJobCircularManager } from './AdminJobCircularManager';
import { AdminUserManager } from './AdminUserManager';
import { AdminAustraliaManager } from './AdminAustraliaManager';
import { AdminCanadaManager } from './AdminCanadaManager';
import { getRegisteredUsers, BHP_USERS_UPDATED_EVENT } from '../../utils/authStorage';
import { getStoredJobCategories, JOB_CATEGORIES_UPDATED_EVENT } from '../../utils/jobCircularStorage';

interface AdminPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type AdminTab = 'user-list' | 'job-circular' | 'australia' | 'canada' | 'settings';

export const AdminPanelModal: React.FC<AdminPanelModalProps> = ({ isOpen, onClose }) => {
  const {
    isAuthenticated,
    loginAdmin,
    logoutAdmin,
    adminRole,
    setAdminRole,
    changeAdminPassword,
    siteSettings,
    updateSiteSettings,
    seoSettings,
    updateSeoSettings,
  } = useAdminData();

  const [activeTab, setActiveTab] = useState<AdminTab>('user-list');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [registeredUsersCount, setRegisteredUsersCount] = useState<number>(() => getRegisteredUsers().length);
  const [jobCategoriesCount, setJobCategoriesCount] = useState<number>(() => getStoredJobCategories().length);

  // Security Auth Gate States
  const [enteredPassword, setEnteredPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);

  // Settings form states
  const [siteForm, setSiteForm] = useState(siteSettings);
  const [seoForm, setSeoForm] = useState(seoSettings);
  const [pwdForm, setPwdForm] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });

  // Sync user and job circular counters
  useEffect(() => {
    const handleUsersChange = () => {
      setRegisteredUsersCount(getRegisteredUsers().length);
    };
    const handleJobsChange = () => {
      setJobCategoriesCount(getStoredJobCategories().length);
    };
    const handleStorageChange = () => {
      setRegisteredUsersCount(getRegisteredUsers().length);
      setJobCategoriesCount(getStoredJobCategories().length);
    };

    window.addEventListener(BHP_USERS_UPDATED_EVENT, handleUsersChange);
    window.addEventListener(JOB_CATEGORIES_UPDATED_EVENT, handleJobsChange);
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener(BHP_USERS_UPDATED_EVENT, handleUsersChange);
      window.removeEventListener(JOB_CATEGORIES_UPDATED_EVENT, handleJobsChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Sync settings when context changes
  useEffect(() => {
    setSiteForm(siteSettings);
  }, [siteSettings]);

  useEffect(() => {
    setSeoForm(seoSettings);
  }, [seoSettings]);

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginAdmin(enteredPassword)) {
      setEnteredPassword('');
      setAuthError('');
      showToast('Admin access unlocked successfully.');
    } else {
      setAuthError('Incorrect admin password. Default is admin123.');
    }
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (pwdForm.newPassword !== pwdForm.confirmPassword) {
      showToast('Error: New password and confirmation do not match.');
      return;
    }
    if (pwdForm.newPassword.length < 6) {
      showToast('Error: Password must be at least 6 characters.');
      return;
    }

    const res = changeAdminPassword(pwdForm.oldPassword, pwdForm.newPassword);
    if (res.success) {
      showToast(res.message);
      setPwdForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
      setShowChangePasswordModal(false);
    } else {
      showToast(`Failed: ${res.message}`);
    }
  };

  // -------------------------------------------------------------
  // AUTHENTICATION GATE SCREEN
  // -------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
        <div className="bg-[#18191C] border border-[#2F333D] text-white w-full max-w-md rounded-2xl p-8 shadow-2xl animate-in zoom-in-95 duration-200">
          <div className="flex flex-col items-center text-center">
            <div className="w-14 h-14 bg-[#F25C05]/15 border border-[#F25C05]/40 rounded-2xl flex items-center justify-center mb-4 text-[#F25C05] shadow-lg shadow-[#F25C05]/10">
              <Lock className="w-7 h-7" />
            </div>
            <span className="text-[11px] font-bold tracking-widest text-[#F25C05] uppercase">
              BHP Global Administration
            </span>
            <h3 className="text-xl font-extrabold text-white mt-1">Admin Panel Access</h3>
            <p className="text-xs text-gray-400 mt-2 max-w-xs leading-relaxed">
              Please enter the administrative password to manage Users, Job Circulars, and Site Settings.
            </p>
          </div>

          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                Admin Password (পাসওয়ার্ড)
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  autoFocus
                  required
                  value={enteredPassword}
                  onChange={(e) => {
                    setEnteredPassword(e.target.value);
                    if (authError) setAuthError('');
                  }}
                  placeholder="Enter AP password..."
                  className="w-full bg-[#101114] border border-[#2F333D] rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#F25C05] focus:ring-1 focus:ring-[#F25C05] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white p-1 cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {authError && (
              <div className="p-3 bg-red-950/60 border border-red-500/50 rounded-lg text-xs text-red-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-[#F25C05] hover:bg-[#d84e00] text-white rounded-xl text-sm font-bold shadow-md shadow-[#F25C05]/20 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" />
              <span>Unlock AP (প্রবেশ করুন)</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-full py-2 text-xs text-gray-400 hover:text-white transition-colors cursor-pointer text-center flex items-center justify-center gap-1.5 pt-1"
            >
              <span>← Back to BHP Homepage (হোমপেজে ফিরে যান)</span>
            </button>
          </form>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // MAIN ADMIN INTERFACE
  // -------------------------------------------------------------
  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-7xl h-[92vh] bg-[#141517] border border-[#2F3238] text-white rounded-xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top Navigation Bar */}
        <div className="px-6 py-4 bg-[#191B1E] border-b border-[#2C2F36] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-[#F25C05] text-white px-2.5 py-1 rounded font-black text-sm tracking-wide">
              <span>BHP</span>
              <span className="text-[10px] font-mono bg-black/30 px-1 rounded uppercase tracking-wider">AP</span>
            </div>
            <div className="hidden sm:block border-l border-gray-700 pl-3">
              <h2 className="text-base font-bold text-white">Management & Governance Portal</h2>
              <p className="text-xs text-gray-400">User accounts, career circulars, and system configurations</p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Active Role Selector Badge */}
            <div className="flex items-center gap-1.5 bg-[#23262D] px-2.5 py-1.5 rounded-md border border-[#373B45] text-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-[#F25C05]" />
              <span className="text-gray-400 hidden sm:inline">Role:</span>
              <select
                value={adminRole}
                onChange={(e) => {
                  setAdminRole(e.target.value as AdminRole);
                  showToast(`Switched active role view to: ${e.target.value}`);
                }}
                className="bg-transparent text-white font-semibold focus:outline-none cursor-pointer"
              >
                <option value="Super Admin" className="bg-[#23262D]">Super Admin (Full)</option>
                <option value="Editor" className="bg-[#23262D]">Editor (Content)</option>
                <option value="HR Manager" className="bg-[#23262D]">HR Manager (Jobs)</option>
              </select>
            </div>

            {/* Change Password Action Button */}
            <button
              type="button"
              onClick={() => setShowChangePasswordModal(true)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-[#23262D] hover:bg-[#2F333D] text-gray-200 hover:text-white border border-[#373B45] text-xs font-semibold cursor-pointer transition-colors"
              title="Change Password (পাসওয়ার্ড পরিবর্তন)"
            >
              <Key className="w-3.5 h-3.5 text-[#F25C05]" />
              <span className="hidden md:inline">Password</span>
            </button>

            {/* Lock AP Button */}
            <button
              type="button"
              onClick={() => {
                logoutAdmin();
                showToast('AP locked. Please enter password to re-enter.');
              }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-[#23262D] hover:bg-red-950/80 hover:border-red-600/50 text-gray-200 hover:text-red-300 border border-[#373B45] text-xs font-semibold cursor-pointer transition-colors"
              title="Lock AP (লগআউট)"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Lock</span>
            </button>

            {/* Back to Website Button */}
            <button
              type="button"
              onClick={onClose}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#23262D] hover:bg-[#323640] text-gray-200 hover:text-white border border-[#373B45] text-xs font-semibold cursor-pointer transition-colors"
              title="Return to public BHP website"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#F25C05]" />
              <span className="hidden sm:inline">Back to Website</span>
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-white hover:bg-[#2A2D35] rounded-lg transition-colors cursor-pointer"
              aria-label="Close admin panel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Toast Alert */}
        {toastMessage && (
          <div className="bg-[#1E3A2B] border-b border-green-500/50 px-6 py-2 flex items-center justify-between text-xs text-green-200 font-semibold animate-in slide-in-from-top duration-200">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-400" />
              <span>{toastMessage}</span>
            </div>
            <button onClick={() => setToastMessage(null)} className="text-gray-400 hover:text-white">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Body Container with Sidebar and Content */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* Left Navigation Sidebar - ONLY 3 REQUIRED MODULES */}
          <aside className="w-60 sm:w-68 bg-[#181A1D] border-r border-[#282A2F] flex flex-col justify-between shrink-0 p-3 overflow-y-auto">
            <nav className="space-y-2">
              <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                Admin Modules
              </div>

              {/* 1. USER LIST */}
              <button
                type="button"
                onClick={() => setActiveTab('user-list')}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  activeTab === 'user-list'
                    ? 'bg-gradient-to-r from-purple-700 to-indigo-600 text-white shadow-lg shadow-purple-900/40 ring-1 ring-purple-400/30'
                    : 'text-gray-300 hover:bg-[#23262D] hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-1.5 rounded-lg ${activeTab === 'user-list' ? 'bg-white/20' : 'bg-purple-950/60 border border-purple-500/30'}`}>
                    <Users className="w-4 h-4 text-purple-300" />
                  </div>
                  <span className="font-bold">User List</span>
                </div>
                <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-black/40 text-purple-200 border border-purple-400/20">
                  {registeredUsersCount}
                </span>
              </button>

              {/* 2. JOB CIRCULAR */}
              <button
                type="button"
                onClick={() => setActiveTab('job-circular')}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  activeTab === 'job-circular'
                    ? 'bg-[#F25C05] text-white shadow-lg shadow-[#F25C05]/30 ring-1 ring-orange-400/30'
                    : 'text-gray-300 hover:bg-[#23262D] hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-1.5 rounded-lg ${activeTab === 'job-circular' ? 'bg-white/20' : 'bg-orange-950/60 border border-orange-500/30'}`}>
                    <Briefcase className="w-4 h-4 text-orange-300" />
                  </div>
                  <span className="font-bold">Job Circular</span>
                </div>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-black/40 text-amber-300 border border-amber-400/20">
                  {jobCategoriesCount} cat
                </span>
              </button>

              {/* 3. AUSTRALIA */}
              <button
                type="button"
                onClick={() => setActiveTab('australia')}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  activeTab === 'australia'
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-900/40 ring-1 ring-blue-400/30'
                    : 'text-gray-300 hover:bg-[#23262D] hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-1.5 rounded-lg ${activeTab === 'australia' ? 'bg-white/20' : 'bg-blue-950/60 border border-blue-500/30'}`}>
                    <Globe className="w-4 h-4 text-blue-400" />
                  </div>
                  <span className="font-bold">Australia</span>
                </div>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-black/40 text-blue-300 border border-blue-400/20">
                  AU
                </span>
              </button>

              {/* 4. CANADA */}
              <button
                type="button"
                onClick={() => setActiveTab('canada')}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  activeTab === 'canada'
                    ? 'bg-gradient-to-r from-red-600 to-rose-700 text-white shadow-lg shadow-red-900/40 ring-1 ring-red-400/30'
                    : 'text-gray-300 hover:bg-[#23262D] hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-1.5 rounded-lg ${activeTab === 'canada' ? 'bg-white/20' : 'bg-red-950/60 border border-red-500/30'}`}>
                    <FileText className="w-4 h-4 text-red-400" />
                  </div>
                  <span className="font-bold">Canada</span>
                </div>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-black/40 text-red-300 border border-red-400/20">
                  CA
                </span>
              </button>

              {/* 5. SETTINGS & SEO */}
              <button
                type="button"
                onClick={() => setActiveTab('settings')}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  activeTab === 'settings'
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-lg shadow-emerald-900/40 ring-1 ring-emerald-400/30'
                    : 'text-gray-300 hover:bg-[#23262D] hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-1.5 rounded-lg ${activeTab === 'settings' ? 'bg-white/20' : 'bg-emerald-950/60 border border-emerald-500/30'}`}>
                    <Settings className="w-4 h-4 text-emerald-300" />
                  </div>
                  <span className="font-bold">Settings & SEO</span>
                </div>
              </button>
            </nav>

            <div className="p-3.5 bg-[#131416] rounded-xl border border-[#26282E] text-[11px] text-gray-400 space-y-1 mt-4">
              <div className="font-bold text-gray-200 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse inline-block" />
                Live Client Sync
              </div>
              <p className="text-[10px] leading-relaxed text-gray-400">
                Any modifications made to users, circulars, or SEO settings reflect in real-time across the client application.
              </p>
            </div>
          </aside>

          {/* Main Work Area */}
          <main className="flex-1 bg-[#141517] overflow-y-auto p-4 sm:p-8">
            
            {/* 1. USER LIST MODULE */}
            {activeTab === 'user-list' && (
              <AdminUserManager showToast={showToast} />
            )}

            {/* 2. JOB CIRCULAR MODULE */}
            {activeTab === 'job-circular' && (
              <AdminJobCircularManager showToast={showToast} />
            )}

            {/* 3. AUSTRALIA MODULE */}
            {activeTab === 'australia' && (
              <AdminAustraliaManager showToast={showToast} />
            )}

            {/* 4. CANADA MODULE */}
            {activeTab === 'canada' && (
              <AdminCanadaManager showToast={showToast} />
            )}

            {/* 5. SETTINGS & SEO MODULE */}
            {activeTab === 'settings' && (
              <div className="space-y-8 max-w-6xl animate-in fade-in duration-200">
                <div>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-white">
                    Settings & SEO Management (সেটিংস ও সার্চ ইঞ্জিন অপটিমাইজেশন)
                  </h3>
                  <p className="text-sm text-gray-400 mt-1">
                    Manage corporate branding, contact channels, administrator credentials, and search engine meta optimization.
                  </p>
                </div>

                {/* Section A: Site Settings */}
                <div className="p-6 bg-[#1C1E23] rounded-xl border border-[#2D313A] space-y-4">
                  <h4 className="text-base font-bold text-white flex items-center gap-2">
                    <Globe className="w-4 h-4 text-[#F25C05]" />
                    <span>Site Identity & Corporate Information</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-400 mb-1">Company Brand Name</label>
                      <input
                        type="text"
                        value={siteForm.brandName}
                        onChange={(e) => setSiteForm({ ...siteForm, brandName: e.target.value })}
                        className="w-full bg-[#15171A] border border-[#2D313A] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#F25C05]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-400 mb-1">Logo Wordmark</label>
                      <input
                        type="text"
                        value={siteForm.logoText}
                        onChange={(e) => setSiteForm({ ...siteForm, logoText: e.target.value })}
                        className="w-full bg-[#15171A] border border-[#2D313A] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#F25C05]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-400 mb-1">Primary Official Email</label>
                      <input
                        type="text"
                        value={siteForm.primaryEmail}
                        onChange={(e) => setSiteForm({ ...siteForm, primaryEmail: e.target.value })}
                        className="w-full bg-[#15171A] border border-[#2D313A] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#F25C05]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-400 mb-1">Global Phone Contact</label>
                      <input
                        type="text"
                        value={siteForm.supportPhone}
                        onChange={(e) => setSiteForm({ ...siteForm, supportPhone: e.target.value })}
                        className="w-full bg-[#15171A] border border-[#2D313A] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#F25C05]"
                      />
                    </div>
                  </div>

                  {/* Social Media Links */}
                  <div className="pt-2">
                    <span className="text-xs font-bold text-gray-300 block mb-2">Social Media Links (Facebook, LinkedIn, X, YouTube)</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] text-gray-400 mb-0.5">LinkedIn Profile URL</label>
                        <input
                          type="text"
                          value={siteForm.linkedinUrl}
                          onChange={(e) => setSiteForm({ ...siteForm, linkedinUrl: e.target.value })}
                          className="w-full bg-[#15171A] border border-[#2D313A] rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#F25C05]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-gray-400 mb-0.5">Facebook Page URL</label>
                        <input
                          type="text"
                          value={siteForm.facebookUrl}
                          onChange={(e) => setSiteForm({ ...siteForm, facebookUrl: e.target.value })}
                          className="w-full bg-[#15171A] border border-[#2D313A] rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#F25C05]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-gray-400 mb-0.5">X (Twitter) URL</label>
                        <input
                          type="text"
                          value={siteForm.twitterUrl}
                          onChange={(e) => setSiteForm({ ...siteForm, twitterUrl: e.target.value })}
                          className="w-full bg-[#15171A] border border-[#2D313A] rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#F25C05]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-gray-400 mb-0.5">YouTube Channel URL</label>
                        <input
                          type="text"
                          value={siteForm.youtubeUrl}
                          onChange={(e) => setSiteForm({ ...siteForm, youtubeUrl: e.target.value })}
                          className="w-full bg-[#15171A] border border-[#2D313A] rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#F25C05]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Live Announcement Banner Setting */}
                  <div className="p-4 bg-[#15171A] rounded-lg border border-[#282B33] space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-xs font-bold text-white block">
                          Top Live Announcement Banner (শীর্ষ লাইভ নোটিশ বার)
                        </label>
                        <p className="text-[11px] text-gray-400">
                          Enable/disable top marquee or announcement notice on the website header.
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        id="announcementToggle"
                        checked={siteForm.announcementEnabled || false}
                        onChange={(e) => setSiteForm({ ...siteForm, announcementEnabled: e.target.checked })}
                        className="w-4 h-4 accent-[#F25C05] cursor-pointer"
                      />
                    </div>
                    {siteForm.announcementEnabled && (
                      <div>
                        <label className="block text-[11px] text-gray-300 font-semibold mb-1">
                          Announcement Notice Text (বার্তা লিখুন)
                        </label>
                        <input
                          type="text"
                          value={siteForm.announcementText || ''}
                          onChange={(e) => setSiteForm({ ...siteForm, announcementText: e.target.value })}
                          placeholder="e.g. BHP Global Careers & Skilled Work Migration circular active"
                          className="w-full bg-[#1C1E24] border border-[#353945] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#F25C05]"
                        />
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-1">Footer Copyright Notice</label>
                    <input
                      type="text"
                      value={siteForm.footerCopyright}
                      onChange={(e) => setSiteForm({ ...siteForm, footerCopyright: e.target.value })}
                      className="w-full bg-[#15171A] border border-[#2D313A] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#F25C05]"
                    />
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        updateSiteSettings(siteForm);
                        showToast('Site settings updated successfully.');
                      }}
                      className="px-5 py-2 bg-[#F25C05] hover:bg-[#d84e00] text-xs font-bold text-white rounded-lg transition-colors cursor-pointer"
                    >
                      Save Site Settings
                    </button>
                  </div>
                </div>

                {/* Section B: Admin Password & Access Control */}
                <div className="p-6 bg-[#1C1E23] rounded-xl border border-[#2D313A] space-y-4">
                  <h4 className="text-base font-bold text-white flex items-center gap-2">
                    <Key className="w-4 h-4 text-[#F25C05]" />
                    <span>Admin Security & Password Change (পাসওয়ার্ড পরিবর্তন)</span>
                  </h4>

                  <form onSubmit={handlePasswordChange} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-400 mb-1">Current Password</label>
                      <input
                        type="password"
                        placeholder="Enter current password"
                        value={pwdForm.oldPassword}
                        onChange={(e) => setPwdForm({ ...pwdForm, oldPassword: e.target.value })}
                        className="w-full bg-[#15171A] border border-[#2D313A] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#F25C05]"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-400 mb-1">New Password</label>
                      <input
                        type="password"
                        placeholder="At least 6 characters"
                        value={pwdForm.newPassword}
                        onChange={(e) => setPwdForm({ ...pwdForm, newPassword: e.target.value })}
                        className="w-full bg-[#15171A] border border-[#2D313A] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#F25C05]"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-400 mb-1">Confirm New Password</label>
                      <input
                        type="password"
                        placeholder="Confirm password"
                        value={pwdForm.confirmPassword}
                        onChange={(e) => setPwdForm({ ...pwdForm, confirmPassword: e.target.value })}
                        className="w-full bg-[#15171A] border border-[#2D313A] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#F25C05]"
                        required
                      />
                    </div>
                    <div className="sm:col-span-3 flex justify-end">
                      <button
                        type="submit"
                        className="px-5 py-2 bg-[#282B33] hover:bg-[#353944] text-xs font-bold text-white rounded-lg transition-colors cursor-pointer"
                      >
                        Update Password
                      </button>
                    </div>
                  </form>
                </div>

                {/* Section C: SEO Management */}
                <div className="p-6 bg-[#1C1E23] rounded-xl border border-[#2D313A] space-y-4">
                  <h4 className="text-base font-bold text-white flex items-center gap-2">
                    <Search className="w-4 h-4 text-[#F25C05]" />
                    <span>SEO Management & Social Graph (মেটা ও এসইও সেটিংস)</span>
                  </h4>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-400 mb-1">Meta Title (পৃষ্ঠার শিরোনাম)</label>
                      <input
                        type="text"
                        value={seoForm.metaTitle}
                        onChange={(e) => setSeoForm({ ...seoForm, metaTitle: e.target.value })}
                        className="w-full bg-[#15171A] border border-[#2D313A] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#F25C05]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-400 mb-1">Meta Description (সার্চ বিবরণ)</label>
                      <textarea
                        rows={3}
                        value={seoForm.metaDescription}
                        onChange={(e) => setSeoForm({ ...seoForm, metaDescription: e.target.value })}
                        className="w-full bg-[#15171A] border border-[#2D313A] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#F25C05]"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-gray-400 mb-1">Keywords (কী-ওয়ার্ডস)</label>
                        <input
                          type="text"
                          value={seoForm.keywords}
                          onChange={(e) => setSeoForm({ ...seoForm, keywords: e.target.value })}
                          className="w-full bg-[#15171A] border border-[#2D313A] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#F25C05]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-400 mb-1">OG Share Image URL</label>
                        <input
                          type="text"
                          value={seoForm.ogImageUrl}
                          onChange={(e) => setSeoForm({ ...seoForm, ogImageUrl: e.target.value })}
                          className="w-full bg-[#15171A] border border-[#2D313A] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#F25C05]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Google Search Snippet Preview */}
                  <div className="mt-4 p-4 bg-[#15171A] rounded-lg border border-[#252830]">
                    <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                      Google Search Result Snippet Preview:
                    </div>
                    <div className="space-y-1">
                      <div className="text-xs text-gray-400 truncate">https://www.bhp.com</div>
                      <div className="text-base text-[#8AB4F8] hover:underline font-medium cursor-pointer">
                        {seoForm.metaTitle}
                      </div>
                      <div className="text-xs text-gray-300 line-clamp-2">
                        {seoForm.metaDescription}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        updateSeoSettings(seoForm);
                        showToast('SEO settings saved successfully.');
                      }}
                      className="px-5 py-2 bg-[#F25C05] hover:bg-[#d84e00] text-xs font-bold text-white rounded-lg transition-colors cursor-pointer"
                    >
                      Save SEO Settings
                    </button>
                  </div>
                </div>
              </div>
            )}

          </main>
        </div>

        {/* Change Password Dialog Modal */}
        {showChangePasswordModal && (
          <div className="fixed inset-0 z-60 bg-black/80 flex items-center justify-center p-4">
            <div className="bg-[#1C1E23] border border-[#3A3F4C] text-white w-full max-w-md rounded-xl p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between border-b border-[#2C303B] pb-3">
                <div className="flex items-center gap-2">
                  <Key className="w-5 h-5 text-[#F25C05]" />
                  <h4 className="font-bold text-base text-white">Change Admin Password</h4>
                </div>
                <button
                  type="button"
                  onClick={() => setShowChangePasswordModal(false)}
                  className="text-gray-400 hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handlePasswordChange} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Current Password</label>
                  <input
                    type="password"
                    required
                    placeholder="Enter current password"
                    value={pwdForm.oldPassword}
                    onChange={(e) => setPwdForm({ ...pwdForm, oldPassword: e.target.value })}
                    className="w-full bg-[#15171A] border border-[#2D313A] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#F25C05]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">New Password</label>
                  <input
                    type="password"
                    required
                    placeholder="Minimum 6 characters"
                    value={pwdForm.newPassword}
                    onChange={(e) => setPwdForm({ ...pwdForm, newPassword: e.target.value })}
                    className="w-full bg-[#15171A] border border-[#2D313A] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#F25C05]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    required
                    placeholder="Confirm new password"
                    value={pwdForm.confirmPassword}
                    onChange={(e) => setPwdForm({ ...pwdForm, confirmPassword: e.target.value })}
                    className="w-full bg-[#15171A] border border-[#2D313A] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#F25C05]"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#2C303B]">
                  <button
                    type="button"
                    onClick={() => setShowChangePasswordModal(false)}
                    className="px-4 py-2 bg-[#252830] text-gray-300 rounded-lg text-xs font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#F25C05] hover:bg-[#d84e00] text-white rounded-lg text-xs font-bold cursor-pointer transition-colors shadow-sm"
                  >
                    Save New Password
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
