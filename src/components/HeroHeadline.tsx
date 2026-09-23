import React from 'react';
import { ArrowRight, Menu } from 'lucide-react';

interface HeroHeadlineProps {
  onOpenRightMenu?: () => void;
}

export const HeroHeadline: React.FC<HeroHeadlineProps> = ({ onOpenRightMenu }) => {
  return (
    <section id="hero-headline-section" className="bg-[#F8F9FA] pt-3 sm:pt-4 pb-8 border-b border-[#EAECEF]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top-right 3-line option directly below the English dropdown in the header */}
        <div className="flex justify-end mb-3 sm:mb-4">
          <button
            id="hero-right-three-line-button"
            type="button"
            onClick={onOpenRightMenu}
            className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-white border border-[#D5D9E0] hover:border-[#F25C05] shadow-xs hover:shadow-md transition-all cursor-pointer group"
            aria-label="Open 3-line options menu"
            title="Options Menu"
          >
            <div className="flex flex-col justify-center gap-[3.5px] w-5 h-4">
              <span className="w-5 h-[2.5px] bg-[#1E2024] group-hover:bg-[#F25C05] rounded-full transition-colors"></span>
              <span className="w-5 h-[2.5px] bg-[#1E2024] group-hover:bg-[#F25C05] rounded-full transition-colors"></span>
              <span className="w-5 h-[2.5px] bg-[#1E2024] group-hover:bg-[#F25C05] rounded-full transition-colors"></span>
            </div>
            <span className="text-xs font-bold text-[#1E2024] group-hover:text-[#F25C05] transition-colors">
              Menu
            </span>
          </button>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          {/* Main Titles */}
          <div className="max-w-4xl">
            <h1
              id="hero-main-title"
              className="text-[34px] sm:text-[46px] lg:text-[52px] font-extrabold text-[#111315] tracking-[-0.03em] leading-[1.08]"
            >
              Building what’s next is what BHP does best.
            </h1>
            <p
              id="hero-main-subtitle"
              className="mt-3 text-lg sm:text-xl text-[#4A4C50] font-normal"
            >
              Resources that make the future possible.
            </p>
          </div>

          {/* Right Action Link */}
          <div className="shrink-0 pb-1">
            <a
              id="hero-find-out-more-link"
              href="#positioning"
              className="inline-flex items-center gap-2 text-base font-bold text-[#111315] hover:text-[#F25C05] transition-colors group"
            >
              <span>Find out more</span>
              <ArrowRight className="w-5 h-5 text-[#F25C05] group-hover:translate-x-1.5 transition-transform" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

