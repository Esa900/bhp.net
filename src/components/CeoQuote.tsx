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
      className="relative bg-[#1A1412] text-white py-16 sm:py-20 lg:py-24 overflow-hidden"
      style={{
        backgroundImage:
          'radial-gradient(ellipse at 80% 30%, rgba(195, 73, 0, 0.18) 0%, rgba(26, 20, 18, 0.95) 70%)',
      }}
    >
      <div className="max-w-[1100px] mx-auto px-6 sm:px-8">
        <div className="flex flex-col items-start">
          {/* Double Quote Icon */}
          <div className="text-[#F25C05] mb-4">
            <Quote className="w-10 h-10 sm:w-12 sm:h-12 fill-[#F25C05] text-[#F25C05] rotate-180" />
          </div>

          {/* Quote Text */}
          <blockquote
            id="ceo-quote-text"
            className="text-[20px] sm:text-[25px] lg:text-[27px] font-bold text-white leading-[1.38] tracking-[-0.01em] max-w-4xl"
          >
            {t('ceoQuote')}
          </blockquote>

          {/* CEO Profile Attribution */}
          <div className="mt-8 sm:mt-10 flex items-center gap-5 sm:gap-6">
            {/* Circular Portrait */}
            <div className="relative shrink-0">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-white/20 shadow-xl bg-[#2A2420]">
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
              <div id="ceo-role" className="text-sm font-medium text-gray-400 mt-0.5">
                CEO
              </div>
              <button
                id="ceo-message-link"
                type="button"
                onClick={onReadCeoMessage}
                className="inline-flex items-center gap-1.5 text-sm font-bold text-[#F25C05] hover:text-[#FF7626] transition-colors mt-2 group cursor-pointer"
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
