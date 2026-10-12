import React from 'react';
import { ArrowRight, Quote } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface CeoQuoteProps {
  onReadCeoMessage?: () => void;
}

export const CeoQuote: React.FC<CeoQuoteProps> = ({ onReadCeoMessage }) => {
  const { t } = useLanguage();

  return (
    <section
      id="ceo-quote-section"
      className="relative bg-[#090C12] text-white py-18 sm:py-24 lg:py-28 overflow-hidden border-t border-b border-[#1A202C]"
      style={{
        backgroundImage:
          'radial-gradient(ellipse at 85% 30%, rgba(255, 85, 0, 0.22) 0%, rgba(9, 12, 18, 0.98) 70%)',
      }}
    >
      <div className="max-w-[1100px] mx-auto px-6 sm:px-8">
        <div className="flex flex-col items-start">
          {/* Double Quote Icon */}
          <div className="text-[#FF5500] mb-5">
            <Quote className="w-10 h-10 sm:w-12 sm:h-12 fill-[#FF5500] text-[#FF5500] rotate-180 drop-shadow-[0_2px_12px_rgba(255,85,0,0.4)]" />
          </div>

          {/* Quote Text */}
          <blockquote
            id="ceo-quote-text"
            className="text-[20px] sm:text-[26px] lg:text-[28px] font-bold text-white leading-[1.38] tracking-[-0.015em] max-w-4xl"
          >
            {t('ceoQuote')}
          </blockquote>

          {/* CEO Profile Attribution */}
          <div className="mt-9 sm:mt-11 flex items-center gap-5 sm:gap-6">
            {/* Circular Portrait */}
            <div className="relative shrink-0">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-[#FF5500]/60 ring-4 ring-[#FF5500]/20 shadow-2xl bg-[#161B26]">
                <img
                  id="ceo-portrait-image"
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&h=400&q=80"
                  alt="Brandon Craig, CEO of BHP"
                  className="w-full h-full object-cover object-top"
                />
              </div>
            </div>

            {/* Name & Title */}
            <div>
              <div id="ceo-name" className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Brandon Craig
              </div>
              <div id="ceo-role" className="text-sm font-medium text-slate-400 mt-0.5">
                CEO
              </div>
              <button
                id="ceo-message-link"
                type="button"
                onClick={onReadCeoMessage}
                className="inline-flex items-center gap-1.5 text-sm font-bold text-[#FF5500] hover:text-[#FFA043] transition-colors mt-2 group cursor-pointer"
              >
                <span>{t('readCeoMessage')}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
