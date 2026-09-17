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
    <section id="alerts-signup-section" className="bg-[#EFF3F6] py-14 sm:py-18 border-t border-gray-200/70">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          
          {/* Left Text */}
          <div className="lg:col-span-7">
            <h2
              id="alerts-signup-title"
              className="text-[28px] sm:text-[34px] font-extrabold text-[#111315] tracking-tight leading-tight"
            >
              Get the latest BHP news alerts, straight to your inbox
            </h2>
            <p className="mt-2.5 text-sm sm:text-base text-[#50545C] leading-relaxed">
              Get BHP news first. Stay in touch with our latest updates, investor news and media releases.
            </p>
          </div>

          {/* Right Form */}
          <div className="lg:col-span-5">
            {isSubscribed ? (
              <div
                id="newsletter-success-message"
                className="bg-white p-6 rounded-xs border border-green-200 flex items-center gap-3 shadow-xs animate-in fade-in duration-300"
              >
                <div className="w-8 h-8 rounded-full bg-green-100 text-green-700 flex items-center justify-center shrink-0">
                  <Check className="w-4 h-4 stroke-[3]" />
                </div>
                <div>
                  <div className="text-sm font-bold text-[#111315]">Thank you for subscribing!</div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    We've sent a verification email to <span className="font-semibold text-gray-700">{email}</span>.
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="relative">
                  <label htmlFor="email-subscription-input" className="block text-xs font-semibold text-gray-600 mb-1">
                    Your email address <span className="text-[#F25C05]">*</span>
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
                      className="w-full bg-transparent border-b border-gray-400 focus:border-[#F25C05] py-2 text-base text-[#111315] placeholder-gray-400 focus:outline-none transition-colors"
                      required
                    />
                  </div>
                  {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
                </div>

                <div>
                  <button
                    id="email-subscribe-button"
                    type="submit"
                    className="px-8 py-2.5 border border-[#B84E1A] text-[#B84E1A] hover:bg-[#B84E1A] hover:text-white text-sm font-semibold tracking-wide transition-colors rounded-xs focus:outline-none"
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
