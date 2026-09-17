import React, { useState } from 'react';
import { ArrowRight, ChevronUp } from 'lucide-react';
import { STOCK_DATA } from '../data';
import { useLanguage } from '../context/LanguageContext';

interface BentoGridProps {
  onOpenInvestorHub?: () => void;
  onOpenCareers?: () => void;
}

export const BentoGrid: React.FC<BentoGridProps> = ({ onOpenInvestorHub, onOpenCareers }) => {
  const [selectedExchange, setSelectedExchange] = useState<'ASX' | 'LSE' | 'NYSE' | 'JSE'>('ASX');
  const currentStock = STOCK_DATA[selectedExchange] || STOCK_DATA.ASX;
  const { t } = useLanguage();

  return (
    <section id="bento-overview-section" className="bg-[#F8F9FA] py-12 sm:py-16">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* 3-Column Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          
          {/* COLUMN 1 */}
          <div className="flex flex-col gap-6">
            {/* Card 1: Making a positive difference (Light Blue) */}
            <div
              id="card-positive-difference"
              className="bg-[#E7EDF2] p-8 sm:p-9 rounded-xs flex flex-col justify-between min-h-[280px] group transition-all duration-200 hover:shadow-md"
            >
              <div>
                {/* Custom Geometric Sustainability/Leaf Icon */}
                <div className="w-10 h-10 mb-5 text-[#F25C05]">
                  <svg viewBox="0 0 40 40" fill="none" className="w-full h-full stroke-current stroke-[2.2]">
                    <circle cx="20" cy="20" r="14" strokeDasharray="3 3" />
                    <path d="M12 20C12 15 16 12 20 12C24 12 28 15 28 20C28 25 24 28 20 28C16 28 12 25 12 20Z" />
                    <path d="M20 12V28" />
                    <path d="M15 17L25 23" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-[#111315] tracking-tight leading-snug">
                  {t('positiveDifferenceTitle')}
                </h3>
                <p className="mt-3 text-sm text-[#44474D] leading-relaxed">
                  {t('positiveDifferenceDesc')}
                </p>
              </div>
              <div className="mt-6 pt-2">
                <a
                  href="#sustainability"
                  className="inline-flex items-center text-[#F25C05] hover:text-[#d44e00] transition-colors"
                  aria-label="Learn more about making a positive difference"
                >
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>

            {/* Photo Card: Workers in Solar Array */}
            <div
              id="card-solar-workers-photo"
              className="relative w-full h-[240px] rounded-xs overflow-hidden bg-gray-200 shadow-sm"
            >
              <img
                src="https://images.unsplash.com/photo-1508873696983-2df5293cb32f?auto=format&fit=crop&w=800&q=80"
                alt="Two BHP renewable energy workers in hard hats and hi-vis walking past solar panels"
                className="w-full h-full object-cover object-center filter brightness-95 group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>

          {/* COLUMN 2 */}
          <div className="flex flex-col gap-6">
            {/* Card 2: Delivering for shareholders (BHP Burnt Rust Orange) */}
            <div
              id="card-delivering-shareholders"
              className="bg-[#B84704] text-white p-8 sm:p-9 rounded-xs flex flex-col justify-between min-h-[280px] group transition-all duration-200 hover:shadow-md cursor-pointer"
              onClick={onOpenInvestorHub}
            >
              <div>
                {/* White Checklist/Clipboard Icon */}
                <div className="w-10 h-10 mb-5 text-white">
                  <svg viewBox="0 0 40 40" fill="none" className="w-full h-full stroke-current stroke-[2.2]">
                    <rect x="10" y="8" width="20" height="26" rx="2" />
                    <path d="M16 8V6C16 4.89543 16.8954 4 18 4H22C23.1046 4 24 4.89543 24 6V8" />
                    <path d="M15 15H25" />
                    <path d="M15 20H25" />
                    <path d="M15 25H21" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white tracking-tight leading-snug">
                  {t('shareholdersTitle')}
                </h3>
                <p className="mt-3 text-sm text-[#FFE8DC] leading-relaxed">
                  {t('shareholdersDesc')}
                </p>
              </div>
              <div className="mt-6 pt-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenInvestorHub?.();
                  }}
                  className="inline-flex items-center text-white hover:text-[#FFE8DC] transition-colors"
                  aria-label="Learn more about delivering for shareholders"
                >
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            {/* Card 2-Bottom: Investor Hub (Light Cream) */}
            <div
              id="card-investor-hub"
              className="bg-[#F8F4EE] p-8 sm:p-9 rounded-xs flex flex-col justify-between min-h-[240px] group transition-all duration-200 hover:shadow-md cursor-pointer"
              onClick={onOpenInvestorHub}
            >
              <div>
                {/* Orange Geometric Hub Icon */}
                <div className="w-10 h-10 mb-4 text-[#F25C05]">
                  <svg viewBox="0 0 40 40" fill="none" className="w-full h-full stroke-current stroke-[2.2]">
                    <circle cx="20" cy="20" r="4" />
                    <circle cx="20" cy="8" r="3" />
                    <circle cx="31" cy="28" r="3" />
                    <circle cx="9" cy="28" r="3" />
                    <path d="M20 11V16" />
                    <path d="M22 22L29 26" />
                    <path d="M18 22L11 26" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-[#111315] tracking-tight leading-snug">
                  {t('investorHubTitle')}
                </h3>
                <p className="mt-3 text-sm text-[#4A4D53] leading-relaxed">
                  Everything you need to know as an investor including financial reports, Operational reviews, upcoming events, dividend information, and frequently asked questions.
                </p>
              </div>
              <div className="mt-5 pt-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenInvestorHub?.();
                  }}
                  className="inline-flex items-center text-[#F25C05] hover:text-[#d44e00] transition-colors"
                  aria-label="Visit Investor Hub"
                >
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>

          {/* COLUMN 3 */}
          <div className="flex flex-col gap-6 md:col-span-2 lg:col-span-1">
            {/* Card 3: A career with BHP (Light Cream) */}
            <div
              id="card-career-bhp"
              className="bg-[#FAF7F2] p-8 sm:p-9 rounded-xs flex flex-col justify-between min-h-[280px] group transition-all duration-200 hover:shadow-md cursor-pointer"
              onClick={onOpenCareers}
            >
              <div>
                {/* Orange Handshake/Career Icon */}
                <div className="w-10 h-10 mb-5 text-[#F25C05]">
                  <svg viewBox="0 0 40 40" fill="none" className="w-full h-full stroke-current stroke-[2.2]">
                    <path d="M12 22L17 17C18 16 20 16 21 17L24 20" />
                    <path d="M28 22L23 17C22 16 20 16 19 17L16 20" />
                    <path d="M8 20L15 27L22 20L28 26L32 22" />
                    <path d="M6 14L12 8H18" />
                    <path d="M34 14L28 8H22" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-[#111315] tracking-tight leading-snug">
                  {t('careerTitle')}
                </h3>
                <p className="mt-3 text-sm text-[#4A4D53] leading-relaxed">
                  If you're looking for a rewarding career that's part of something bigger, BHP could be the place for you. Discover why BHP is a great place to grow your career and find your why with us.
                </p>
              </div>
              <div className="mt-6 pt-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenCareers?.();
                  }}
                  className="inline-flex items-center text-[#F25C05] hover:text-[#d44e00] transition-colors cursor-pointer"
                  aria-label="Explore careers with BHP"
                >
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            {/* Card 3-Bottom: Stock Market Widget Card (Dark Charcoal) */}
            <div
              id="stock-hub"
              className="bg-[#282A2E] text-white rounded-xs overflow-hidden flex flex-col justify-between min-h-[240px] shadow-sm border border-[#373A40] cursor-pointer"
              onClick={onOpenInvestorHub}
            >
              {/* Market Exchange Tabs */}
              <div className="grid grid-cols-4 text-xs font-semibold tracking-wider text-center border-b border-[#373A40]">
                <button
                  id="tab-asx"
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedExchange('ASX');
                  }}
                  className={`py-3 px-1 transition-colors cursor-pointer ${
                    selectedExchange === 'ASX'
                      ? 'bg-[#C34900] text-white font-bold'
                      : 'bg-[#222428] text-gray-300 hover:text-white hover:bg-[#2C2E33]'
                  }`}
                >
                  ASX
                </button>
                <button
                  id="tab-lse"
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedExchange('LSE');
                  }}
                  className={`py-3 px-1 transition-colors cursor-pointer ${
                    selectedExchange === 'LSE'
                      ? 'bg-[#C34900] text-white font-bold'
                      : 'bg-[#222428] text-gray-300 hover:text-white hover:bg-[#2C2E33]'
                  }`}
                >
                  LSE
                </button>
                <button
                  id="tab-nyse"
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedExchange('NYSE');
                  }}
                  className={`py-3 px-1 transition-colors cursor-pointer ${
                    selectedExchange === 'NYSE'
                      ? 'bg-[#C34900] text-white font-bold'
                      : 'bg-[#222428] text-gray-300 hover:text-white hover:bg-[#2C2E33]'
                  }`}
                >
                  NYSE (Ltd ADR)
                </button>
                <button
                  id="tab-jse"
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedExchange('JSE');
                  }}
                  className={`py-3 px-1 transition-colors cursor-pointer ${
                    selectedExchange === 'JSE'
                      ? 'bg-[#C34900] text-white font-bold'
                      : 'bg-[#222428] text-gray-300 hover:text-white hover:bg-[#2C2E33]'
                  }`}
                >
                  JSE
                </button>
              </div>

              {/* Stock Price Display */}
              <div className="p-6 text-center flex flex-col items-center justify-center flex-1">
                <div id="stock-price-value" className="text-[44px] sm:text-[50px] font-extrabold text-white tracking-tight leading-none">
                  {currentStock.price}
                </div>

                <div className="text-xs font-medium text-gray-300 mt-2">
                  {currentStock.name}, {currentStock.currencyDisplay}
                </div>

                {/* Percentage Change with Green Arrow */}
                <div className="flex items-center gap-1 text-[#22C55E] text-base font-bold mt-2">
                  <ChevronUp className="w-5 h-5 stroke-[3] fill-current" />
                  <span>{currentStock.changePercent}</span>
                </div>

                <div className="text-[11px] text-gray-400 mt-3 font-mono">
                  {currentStock.timestamp}
                </div>

                <div className="text-[11px] text-gray-400 mt-0.5">
                  Price displayed in {currentStock.currency} • Click for details
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FULL-WIDTH BOTTOM CARD: Where we operate */}
        <div
          id="card-where-we-operate"
          className="mt-6 bg-[#ECEFF2] rounded-xs overflow-hidden relative flex flex-col md:flex-row items-center justify-between p-8 sm:p-10 lg:p-12 transition-all duration-200 hover:shadow-md group"
        >
          {/* Left Text */}
          <div className="max-w-xl z-10">
            {/* Orange Polygonal Globe/World Icon */}
            <div className="w-10 h-10 mb-4 text-[#F25C05]">
              <svg viewBox="0 0 40 40" fill="none" className="w-full h-full stroke-current stroke-[2.2]">
                <polygon points="20,4 34,12 34,28 20,36 6,28 6,12" />
                <path d="M20 4V36" />
                <path d="M6 12L34 28" />
                <path d="M6 28L34 12" />
              </svg>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-[#111315] tracking-tight leading-tight">
              {t('whereWeOperateTitle')}
            </h3>
            <p className="mt-3 text-sm sm:text-base text-[#44474D] leading-relaxed">
              Did you know we work in more than 90 locations including Australia, South America, the United States and Canada?
            </p>
            <div className="mt-6">
              <a
                href="#locations"
                className="inline-flex items-center text-[#F25C05] hover:text-[#d44e00] transition-colors"
                aria-label="See where BHP operates"
              >
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
              </a>
            </div>
          </div>

          {/* Right: Dot-Matrix 3D Globe Visual Graphic */}
          <div className="w-full md:w-1/2 flex justify-end mt-6 md:mt-0 relative overflow-hidden pointer-events-none">
            <div className="relative w-full max-w-[420px] aspect-[4/3] flex items-center justify-center">
              <svg viewBox="0 0 400 300" className="w-full h-full text-[#7B8B9B]/60 drop-shadow-sm">
                <defs>
                  <radialGradient id="globe-gradient" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#8C9CAE" stopOpacity="0.4" />
                    <stop offset="70%" stopColor="#A4B3C2" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="#C2CCD6" stopOpacity="0" />
                  </radialGradient>
                  <pattern id="dot-pattern" width="10" height="10" patternUnits="userSpaceOnUse">
                    <circle cx="2" cy="2" r="1.5" fill="#5A6D80" />
                  </pattern>
                </defs>
                {/* Globe hemisphere wireframe dots */}
                <ellipse cx="280" cy="150" rx="140" ry="130" fill="url(#globe-gradient)" />
                <ellipse cx="280" cy="150" rx="140" ry="130" stroke="#8C9CAE" strokeWidth="1" strokeDasharray="3 3" fill="none" opacity="0.6" />
                
                {/* Latitude and Longitude Grid Lines */}
                <ellipse cx="280" cy="150" rx="140" ry="40" stroke="#6F8091" strokeWidth="0.8" strokeDasharray="4 4" fill="none" opacity="0.5" />
                <ellipse cx="280" cy="150" rx="140" ry="90" stroke="#6F8091" strokeWidth="0.8" strokeDasharray="4 4" fill="none" opacity="0.4" />
                <line x1="280" y1="20" x2="280" y2="280" stroke="#6F8091" strokeWidth="0.8" strokeDasharray="4 4" opacity="0.5" />
                <line x1="140" y1="150" x2="420" y2="150" stroke="#6F8091" strokeWidth="0.8" strokeDasharray="4 4" opacity="0.5" />

                {/* Halftone dot matrix representing continents / regions */}
                {/* Australia */}
                <g fill="#405163">
                  {[
                    [250, 160], [255, 155], [265, 155], [275, 160], [285, 165], [295, 170],
                    [245, 168], [255, 168], [265, 168], [275, 175], [285, 178], [290, 185],
                    [250, 178], [260, 180], [270, 185], [278, 192],
                    [255, 190], [262, 195], [235, 162], [240, 172],
                  ].map(([cx, cy], i) => (
                    <circle key={`au-${i}`} cx={cx} cy={cy} r={i % 3 === 0 ? 3.5 : 2.5} fill="#354556" />
                  ))}
                  {/* Australian Key BHP Operation Hub Highlight Pin */}
                  <circle cx="265" cy="168" r="5" fill="#F25C05" />
                  <circle cx="265" cy="168" r="9" stroke="#F25C05" strokeWidth="1.5" opacity="0.7" className="animate-ping" />
                </g>

                {/* South America & North America dots */}
                <g fill="#536476">
                  {[
                    [330, 90], [335, 98], [345, 105], [350, 115], [355, 125],
                    [340, 135], [345, 145], [350, 155], [355, 170], [350, 185],
                    [315, 75], [325, 80], [330, 70], [320, 60], [310, 50],
                  ].map(([cx, cy], i) => (
                    <circle key={`am-${i}`} cx={cx} cy={cy} r={2.8} fill="#47586A" />
                  ))}
                  {/* Escondida Copper Chile Pin */}
                  <circle cx="348" cy="165" r="4.5" fill="#F25C05" />
                </g>

                {/* Global Halftone Grid Pattern Points */}
                {Array.from({ length: 14 }).map((_, r) => (
                  <g key={`row-${r}`}>
                    {Array.from({ length: 18 }).map((_, c) => {
                      const x = 160 + c * 14;
                      const y = 40 + r * 16;
                      const dist = Math.hypot(x - 280, y - 150);
                      if (dist < 130 && Math.random() > 0.4) {
                        return <circle key={`dot-${r}-${c}`} cx={x} cy={y} r="1.4" fill="#6A7C8E" opacity="0.5" />;
                      }
                      return null;
                    })}
                  </g>
                ))}
              </svg>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
