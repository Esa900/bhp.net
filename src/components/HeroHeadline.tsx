import React from 'react';
import { ArrowRight } from 'lucide-react';

export const HeroHeadline: React.FC = () => {
  return (
    <section id="hero-headline-section" className="bg-[#F8F9FA] pt-8 sm:pt-12 pb-6 border-b border-transparent">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
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
