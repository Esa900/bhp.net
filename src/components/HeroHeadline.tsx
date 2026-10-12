import React from 'react';
import { ArrowRight, Menu } from 'lucide-react';

interface HeroHeadlineProps {
  onOpenRightMenu?: () => void;
}

export const HeroHeadline: React.FC<HeroHeadlineProps> = ({ onOpenRightMenu }) => {
  return (
    <section id="hero-headline-section" className="bg-[#F8FAFC] pt-4 sm:pt-6 pb-8 border-b border-slate-200/80">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top-right 3-line option directly below the language dropdown in the header */}
        <div className="flex justify-end mb-3 sm:mb-4">
          <button
            id="hero-right-three-line-button"
            type="button"
            onClick={onOpenRightMenu}
            className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-white border border-slate-200 hover:border-[#FF5500] shadow-xs hover:shadow-lg hover:shadow-orange-500/10 transition-all cursor-pointer group"
            aria-label="Open 3-line options menu"
            title="Options Menu"
          >
            <div className="flex flex-col justify-center gap-[3.5px] w-5 h-4">
              <span className="w-5 h-[2.5px] bg-[#0A0D14] group-hover:bg-[#FF5500] rounded-full transition-colors"></span>
              <span className="w-5 h-[2.5px] bg-[#0A0D14] group-hover:bg-[#FF5500] rounded-full transition-colors"></span>
              <span className="w-5 h-[2.5px] bg-[#0A0D14] group-hover:bg-[#FF5500] rounded-full transition-colors"></span>
            </div>
            <span className="text-xs font-bold text-[#0A0D14] group-hover:text-[#FF5500] transition-colors tracking-wide">
              Menu
            </span>
          </button>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          {/* Main Titles */}
          <div className="max-w-4xl">
            <h1
              id="hero-main-title"
              className="text-[34px] sm:text-[46px] lg:text-[54px] font-extrabold text-[#0A0D14] tracking-[-0.035em] leading-[1.06]"
            >
              Building what’s next is what BHP does best.
            </h1>
            <p
              id="hero-main-subtitle"
              className="mt-3 text-lg sm:text-xl text-[#475569] font-normal leading-relaxed"
            >
              Resources that make the future possible.
            </p>
          </div>

          {/* Right Action Link */}
          <div className="shrink-0 pb-1">
            <a
              id="hero-find-out-more-link"
              href="#positioning"
              className="inline-flex items-center gap-2 text-base font-bold text-[#0A0D14] hover:text-[#FF5500] transition-colors group"
            >
              <span>Find out more</span>
              <div className="w-8 h-8 rounded-full bg-orange-50 group-hover:bg-[#FF5500] flex items-center justify-center transition-colors">
                <ArrowRight className="w-4 h-4 text-[#FF5500] group-hover:text-white group-hover:translate-x-0.5 transition-all" />
              </div>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

