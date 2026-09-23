import React, { useState } from 'react';
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  UserPlus,
  Moon,
  Sun,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { authenticateUser, registerUser, setCurrentAuthUser } from '../../utils/authStorage';
import { AuthUser } from '../../types/auth';
import { GoogleAccountChooserModal } from './GoogleAccountChooserModal';
import { FacebookLoginModal } from './FacebookLoginModal';

interface AuthSecurityGateProps {
  onAuthenticated: (user: AuthUser) => void;
}

export const AuthSecurityGate: React.FC<AuthSecurityGateProps> = ({ onAuthenticated }) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  // Social Modals
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [showFacebookModal, setShowFacebookModal] = useState(false);

  // Form states - Login
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Form states - Register
  const [regUsername, setRegUsername] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);

  // Status & Feedback
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Handle Login Submit
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setIsLoading(true);

    setTimeout(() => {
      const res = authenticateUser(loginUsername, loginPassword);
      setIsLoading(false);

      if (res.success && res.user) {
        setSuccessMsg('Login successful! Accessing BHP website...');
        setCurrentAuthUser(res.user, rememberMe);
        setTimeout(() => {
          onAuthenticated(res.user!);
        }, 350);
      } else {
        setErrorMsg(res.message || 'Invalid credentials. Please try again.');
      }
    }, 300);
  };

  // Handle Register Submit
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setIsLoading(true);

    setTimeout(() => {
      const res = registerUser(regUsername, regEmail, regPassword);
      setIsLoading(false);

      if (res.success && res.user) {
        setSuccessMsg('Account created successfully! Logging you in...');
        setCurrentAuthUser(res.user, true);
        setTimeout(() => {
          onAuthenticated(res.user!);
        }, 400);
      } else {
        setErrorMsg(res.message || 'Registration failed. Please try again.');
      }
    }, 300);
  };

  // Quick Demo Autofill
  const handleAutofillDemo = () => {
    setLoginUsername('saymon67');
    setLoginPassword('saymon6750');
    setActiveTab('login');
    setErrorMsg('');
  };

  return (
    <div
      id="security-gate-wrapper"
      className="min-h-screen w-full relative flex items-center justify-center p-4 sm:p-6 overflow-hidden bg-[#0c0d1b] select-none"
      style={{
        background: isDarkMode
          ? 'radial-gradient(circle at 50% 20%, #1e1338 0%, #110f24 50%, #0a0914 100%)'
          : 'radial-gradient(circle at 50% 20%, #31215b 0%, #181533 50%, #0f0d1e 100%)',
      }}
    >
      {/* Background ambient lighting orbs */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-purple-600/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-indigo-600/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-violet-700/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Glassmorphism Card */}
      <div
        id="auth-card"
        className="w-full max-w-[420px] relative z-10 rounded-[28px] p-6 sm:p-8 bg-[#181530]/75 backdrop-blur-2xl border border-purple-500/20 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8),0_0_40px_rgba(112,82,255,0.15)] flex flex-col transition-all duration-300 animate-in fade-in zoom-in-95"
      >
        {/* Top bar with Toggle Pills and Moon Icon */}
        <div className="flex items-center justify-between gap-3 mb-6 relative">
          {/* Pill Switcher */}
          <div className="flex-1 bg-[#231d42]/70 p-1 rounded-2xl border border-purple-500/20 flex items-center shadow-inner">
            <button
              id="tab-login-btn"
              type="button"
              onClick={() => {
                setActiveTab('login');
                setErrorMsg('');
                setSuccessMsg('');
              }}
              className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all duration-200 cursor-pointer ${
                activeTab === 'login'
                  ? 'bg-gradient-to-r from-[#6b47ff] to-[#9962ff] text-white shadow-md shadow-purple-700/30'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Login
            </button>
            <button
              id="tab-register-btn"
              type="button"
              onClick={() => {
                setActiveTab('register');
                setErrorMsg('');
                setSuccessMsg('');
              }}
              className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all duration-200 cursor-pointer ${
                activeTab === 'register'
                  ? 'bg-gradient-to-r from-[#6b47ff] to-[#9962ff] text-white shadow-md shadow-purple-700/30'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Register
            </button>
          </div>

          {/* Moon / Theme Toggle Button */}
          <button
            type="button"
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="w-10 h-10 rounded-2xl bg-[#231d42]/70 border border-purple-500/20 text-purple-200 hover:text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
            title="Toggle theme appearance"
            aria-label="Toggle theme"
          >
            {isDarkMode ? <Moon className="w-4 h-4 fill-purple-300 text-purple-300" /> : <Sun className="w-4 h-4" />}
          </button>
        </div>

        {/* Feedback Messages */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-200 text-xs flex items-center gap-2.5 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span className="leading-snug">{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-200 text-xs flex items-center gap-2.5 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="leading-snug">{successMsg}</span>
          </div>
        )}

        {/* =========================================================================
            TAB 1: LOGIN (Image 1)
           ========================================================================= */}
        {activeTab === 'login' && (
          <div className="animate-in fade-in duration-200">
            {/* Header Text */}
            <div className="text-center mb-6">
              <h2 className="text-2xl sm:text-[26px] font-bold text-white tracking-tight">
                Welcome Back!
              </h2>
              <p className="text-xs sm:text-sm text-purple-200/60 mt-1">
                Please enter your details to sign in.
              </p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {/* Username Input (Replaces Email Address per user request) */}
              <div className="space-y-1">
                <div className="w-full bg-[#1b1735]/90 border border-purple-500/25 focus-within:border-[#8b5cf6] focus-within:ring-1 focus-within:ring-[#8b5cf6]/50 rounded-2xl px-4 py-3.5 flex items-center gap-3 transition-all">
                  <User className="w-4 h-4 text-purple-300/60 shrink-0" />
                  <input
                    id="login-username"
                    type="text"
                    value={loginUsername}
                    onChange={(e) => setLoginUsername(e.target.value)}
                    placeholder="Username"
                    required
                    autoComplete="username"
                    className="w-full bg-transparent text-sm text-white placeholder-purple-300/40 focus:outline-none"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1">
                <div className="w-full bg-[#1b1735]/90 border border-purple-500/25 focus-within:border-[#8b5cf6] focus-within:ring-1 focus-within:ring-[#8b5cf6]/50 rounded-2xl px-4 py-3.5 flex items-center gap-3 transition-all">
                  <Lock className="w-4 h-4 text-purple-300/60 shrink-0" />
                  <input
                    id="login-password"
                    type={showLoginPassword ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Password"
                    required
                    autoComplete="current-password"
                    className="w-full bg-transparent text-sm text-white placeholder-purple-300/40 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="text-purple-300/50 hover:text-white transition-colors cursor-pointer p-0.5"
                    aria-label="Toggle password view"
                  >
                    {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between text-xs pt-0.5 text-purple-200/70">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-3.5 h-3.5 rounded border-purple-500/30 bg-[#1b1735] text-[#7052ff] focus:ring-0 focus:ring-offset-0 cursor-pointer accent-[#7052ff]"
                  />
                  <span>Remember me</span>
                </label>

                <button
                  type="button"
                  onClick={() => alert('Please contact administrator or re-register with a new username/password.')}
                  className="text-purple-400 hover:text-purple-300 hover:underline cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>

              {/* Sign In Button */}
              <button
                id="sign-in-submit-btn"
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#5f45ff] via-[#7d52ff] to-[#a855f7] hover:brightness-110 active:scale-[0.99] text-white font-bold text-sm shadow-[0_10px_25px_-5px_rgba(112,82,255,0.5)] flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 mt-2"
              >
                {isLoading ? (
                  <span>Authenticating...</span>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Social Logins Section */}
            <div className="mt-7 text-center">
              <span className="text-xs text-purple-200/50 block mb-3">Or continue with</span>
              <div className="flex items-center justify-center gap-3.5">
                {/* Continue with Google */}
                <button
                  type="button"
                  onClick={() => setShowGoogleModal(true)}
                  title="Continue with Google (ডিভাইসের গুগল অ্যাকাউন্ট নির্বাচন করুন)"
                  className="w-12 h-11 rounded-2xl bg-[#231d42]/80 hover:bg-[#2e2656] border border-purple-500/25 flex items-center justify-center transition-all cursor-pointer hover:border-purple-400 hover:scale-105 active:scale-95 shadow-sm"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
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
                </button>

                {/* Continue with Facebook */}
                <button
                  type="button"
                  onClick={() => setShowFacebookModal(true)}
                  title="Continue with Facebook (ফেসবুক লগইন)"
                  className="w-12 h-11 rounded-2xl bg-[#231d42]/80 hover:bg-[#2e2656] border border-purple-500/25 flex items-center justify-center text-[#1877F2] font-black text-xl transition-all cursor-pointer hover:border-purple-400 hover:scale-105 active:scale-95 shadow-sm"
                >
                  f
                </button>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 2: REGISTER (Image 2)
           ========================================================================= */}
        {activeTab === 'register' && (
          <div className="animate-in fade-in duration-200">
            {/* Header Text */}
            <div className="text-center mb-6">
              <h2 className="text-2xl sm:text-[26px] font-bold text-white tracking-tight">
                Create Account
              </h2>
              <p className="text-xs sm:text-sm text-purple-200/60 mt-1">
                Start your journey with us today.
              </p>
            </div>

            {/* Register Form */}
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              {/* Username Input */}
              <div className="space-y-1">
                <div className="w-full bg-[#1b1735]/90 border border-purple-500/25 focus-within:border-[#8b5cf6] focus-within:ring-1 focus-within:ring-[#8b5cf6]/50 rounded-2xl px-4 py-3.5 flex items-center gap-3 transition-all">
                  <User className="w-4 h-4 text-purple-300/60 shrink-0" />
                  <input
                    id="reg-username"
                    type="text"
                    value={regUsername}
                    onChange={(e) => setRegUsername(e.target.value)}
                    placeholder="Username"
                    required
                    autoComplete="username"
                    className="w-full bg-transparent text-sm text-white placeholder-purple-300/40 focus:outline-none"
                  />
                </div>
              </div>

              {/* Email Address Input */}
              <div className="space-y-1">
                <div className="w-full bg-[#1b1735]/90 border border-purple-500/25 focus-within:border-[#8b5cf6] focus-within:ring-1 focus-within:ring-[#8b5cf6]/50 rounded-2xl px-4 py-3.5 flex items-center gap-3 transition-all">
                  <Mail className="w-4 h-4 text-purple-300/60 shrink-0" />
                  <input
                    id="reg-email"
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="Email Address"
                    required
                    autoComplete="email"
                    className="w-full bg-transparent text-sm text-white placeholder-purple-300/40 focus:outline-none"
                  />
                </div>
              </div>

              {/* Create Password Input */}
              <div className="space-y-1">
                <div className="w-full bg-[#1b1735]/90 border border-purple-500/25 focus-within:border-[#8b5cf6] focus-within:ring-1 focus-within:ring-[#8b5cf6]/50 rounded-2xl px-4 py-3.5 flex items-center gap-3 transition-all">
                  <Lock className="w-4 h-4 text-purple-300/60 shrink-0" />
                  <input
                    id="reg-password"
                    type={showRegPassword ? 'text' : 'password'}
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Create Password"
                    required
                    autoComplete="new-password"
                    className="w-full bg-transparent text-sm text-white placeholder-purple-300/40 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegPassword(!showRegPassword)}
                    className="text-purple-300/50 hover:text-white transition-colors cursor-pointer p-0.5"
                    aria-label="Toggle password view"
                  >
                    {showRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Get Started Button */}
              <button
                id="get-started-submit-btn"
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#5f45ff] via-[#7d52ff] to-[#a855f7] hover:brightness-110 active:scale-[0.99] text-white font-bold text-sm shadow-[0_10px_25px_-5px_rgba(112,82,255,0.5)] flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 mt-3"
              >
                {isLoading ? (
                  <span>Registering...</span>
                ) : (
                  <>
                    <span>Get Started</span>
                    <UserPlus className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Social Logins Section */}
            <div className="mt-7 text-center">
              <span className="text-xs text-purple-200/50 block mb-3">Or register with</span>
              <div className="flex items-center justify-center gap-3.5">
                {/* Register with Google */}
                <button
                  type="button"
                  onClick={() => setShowGoogleModal(true)}
                  title="Register with Google (গুগল অ্যাকাউন্ট দিয়ে সরাসরি রেজিস্টার)"
                  className="w-12 h-11 rounded-2xl bg-[#231d42]/80 hover:bg-[#2e2656] border border-purple-500/25 flex items-center justify-center transition-all cursor-pointer hover:border-purple-400 hover:scale-105 active:scale-95 shadow-sm"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
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
                </button>

                {/* Register with Facebook */}
                <button
                  type="button"
                  onClick={() => setShowFacebookModal(true)}
                  title="Register with Facebook (ফেসবুক দিয়ে সরাসরি রেজিস্টার)"
                  className="w-12 h-11 rounded-2xl bg-[#231d42]/80 hover:bg-[#2e2656] border border-purple-500/25 flex items-center justify-center text-[#1877F2] font-black text-xl transition-all cursor-pointer hover:border-purple-400 hover:scale-105 active:scale-95 shadow-sm"
                >
                  f
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Security watermark footer */}
        <div className="mt-6 pt-4 border-t border-purple-500/15 flex items-center justify-between text-[11px] text-purple-300/40">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-purple-400/60" />
            <span>BHP Protected Security Gateway</span>
          </div>
          <span>v2026.1</span>
        </div>
      </div>

      {/* Google Account Chooser Modal */}
      <GoogleAccountChooserModal
        isOpen={showGoogleModal}
        onClose={() => setShowGoogleModal(false)}
        onSuccess={(user) => {
          setSuccessMsg(`Welcome, ${user.fullName || user.username}! Accessing BHP portal...`);
          setTimeout(() => onAuthenticated(user), 300);
        }}
      />

      {/* Facebook Login Modal */}
      <FacebookLoginModal
        isOpen={showFacebookModal}
        onClose={() => setShowFacebookModal(false)}
        onSuccess={(user) => {
          setSuccessMsg(`Welcome, ${user.fullName || user.username}! Accessing BHP portal...`);
          setTimeout(() => onAuthenticated(user), 300);
        }}
      />
    </div>
  );
};
