import React, { useState } from 'react';
import { Check, Mail } from 'lucide-react';
import { useAdminData } from '../context/AdminDataContext';

export const NewsAlertsSignup: React.FC = () => {
  const { addSubscriber } = useAdminData();
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }
    setError('');
    addSubscriber(email);
    setIsSubscribed(true);
  };

  return (
    <section id="alerts-signup-section" className="bg-[#F1F5F9] py-16 sm:py-20 border-t border-slate-200/80">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          
          {/* Left Text */}
          <div className="lg:col-span-7">
            <h2
              id="alerts-signup-title"
              className="text-[28px] sm:text-[36px] font-extrabold text-[#0A0D14] tracking-tight leading-tight"
            >
              Get the latest BHP news alerts, straight to your inbox
            </h2>
            <p className="mt-2.5 text-sm sm:text-base text-[#475569] leading-relaxed">
              Get BHP news first. Stay in touch with our latest updates, investor news and media releases.
            </p>
          </div>

          {/* Right Form */}
          <div className="lg:col-span-5">
            {isSubscribed ? (
              <div
                id="newsletter-success-message"
                className="bg-white p-6 rounded-2xl border border-emerald-200 flex items-center gap-3 shadow-md animate-in fade-in duration-300"
              >
                <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <Check className="w-5 h-5 stroke-[2.5]" />
                </div>
                <div>
                  <div className="text-sm font-bold text-[#0A0D14]">Thank you for subscribing!</div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    We've sent a verification email to <span className="font-semibold text-slate-700">{email}</span>.
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="relative">
                  <label htmlFor="email-subscription-input" className="block text-xs font-semibold text-slate-600 mb-1">
                    Your email address <span className="text-[#FF5500]">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="email-subscription-input"
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (error) setError('');
                      }}
                      placeholder="e.g. name@example.com"
                      className="w-full bg-transparent border-b-2 border-slate-300 focus:border-[#FF5500] py-2.5 text-base text-[#0A0D14] placeholder-slate-400 focus:outline-none transition-colors"
                      required
                    />
                  </div>
                  {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
                </div>

                <div>
                  <button
                    id="email-subscribe-button"
                    type="submit"
                    className="px-8 py-3 bg-gradient-to-r from-[#FF5500] to-[#E64200] hover:from-[#E64200] hover:to-[#CC3B00] text-white shadow-md shadow-orange-500/20 text-sm font-bold tracking-wide transition-all rounded-xl focus:outline-none cursor-pointer"
                  >
                    Subscribe
                  </button>
                </div>
              </form>
            )}
          </div>

        </div>
      </div>
    </section>
  );
};
