import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { CommodityItem } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useAdminData } from '../context/AdminDataContext';

interface WhatWeProduceProps {
  onCommoditySelect?: (commodity: CommodityItem) => void;
}

export const WhatWeProduce: React.FC<WhatWeProduceProps> = ({ onCommoditySelect }) => {
  const { commodities } = useAdminData();
  const [activeTabId, setActiveTabId] = useState<string>('copper');
  const { t } = useLanguage();

  const activeCommodity = commodities.find((c) => c.id === activeTabId) || commodities[0] || {
    id: 'copper',
    name: 'Copper',
    description: 'Copper for renewable energy and electrical infrastructure.',
    secondaryText: 'Critical resource for the decarbonisation transition.',
    ctaText: 'Find out more',
    imageUrl: '',
    stats: [],
  };

  return (
    <section id="what-we-produce" className="bg-[#F8F9FA] py-14 sm:py-20 border-t border-gray-200/60">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl">
          {/* Orange Ingot / Mineral Icon */}
          <div className="w-10 h-10 mb-4 text-[#F25C05]">
            <svg viewBox="0 0 40 40" fill="none" className="w-full h-full stroke-current stroke-[2.2]">
              <path d="M8 26L14 14H26L32 26H8Z" />
              <path d="M14 14L20 8L26 14" />
              <path d="M8 26L14 32H26L32 26" />
              <line x1="20" y1="8" x2="20" y2="32" strokeDasharray="3 3" />
            </svg>
          </div>

          <h2
            id="what-we-produce-title"
            className="text-[32px] sm:text-[40px] font-extrabold text-[#111315] tracking-tight"
          >
            {t('whatWeProduceTitle')}
          </h2>

          <p className="mt-3 text-base sm:text-lg text-[#52555C] leading-relaxed">
            Copper for renewable energy, iron ore and steelmaking coal for steel for new infrastructure. And potash to support more sustainable farming.
          </p>

          <div className="mt-4">
            <button
              id="what-we-produce-products-link"
              type="button"
              onClick={() => onCommoditySelect?.(activeCommodity)}
              className="inline-flex items-center gap-1.5 text-base font-bold text-[#111315] hover:text-[#F25C05] transition-colors group cursor-pointer"
            >
              <span>Products</span>
              <ArrowRight className="w-4 h-4 text-[#F25C05] group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Commodity Tabs */}
        <div className="mt-10 sm:mt-12">
          <div
            role="tablist"
            className="flex items-center gap-6 sm:gap-10 border-b border-gray-300 pb-2 overflow-x-auto no-scrollbar"
          >
            {commodities.map((commodity) => {
              const isActive = commodity.id === activeCommodity.id;
              return (
                <button
                  key={commodity.id}
                  id={`tab-${commodity.id}`}
                  role="tab"
                  aria-selected={isActive}
                  type="button"
                  onClick={() => setActiveTabId(commodity.id)}
                  className={`relative text-base sm:text-lg font-bold pb-2 transition-colors whitespace-nowrap focus:outline-none cursor-pointer ${
                    isActive ? 'text-[#B84704]' : 'text-[#3E4249] hover:text-[#111315]'
                  }`}
                >
                  {commodity.name}
                  {isActive && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#B84704]" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Active Tab Panel */}
          <div
            id={`tabpanel-${activeCommodity.id}`}
            role="tabpanel"
            className="mt-6 bg-[#F4F6F8] rounded-xs overflow-hidden grid grid-cols-1 lg:grid-cols-2 items-center min-h-[380px] shadow-xs"
          >
            {/* Left Content */}
            <div className="p-8 sm:p-12 lg:p-14 flex flex-col justify-between h-full">
              <div>
                <p className="text-base sm:text-lg text-[#33363B] leading-relaxed font-normal">
                  {activeCommodity.description}
                </p>
                <p className="mt-4 text-sm text-[#666A73] leading-relaxed">
                  {activeCommodity.secondaryText}
                </p>

                {/* Key Statistics */}
                <div className="mt-8 grid grid-cols-2 gap-4 pt-6 border-t border-gray-200/80">
                  {activeCommodity.stats.map((stat, idx) => (
                    <div key={idx}>
                      <div className="text-xs uppercase tracking-wider text-gray-500 font-medium">
                        {stat.label}
                      </div>
                      <div className="text-base sm:text-lg font-bold text-[#111315] mt-0.5">
                        {stat.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-2">
                <button
                  type="button"
                  onClick={() => onCommoditySelect?.(activeCommodity)}
                  className="inline-flex items-center gap-2 text-sm sm:text-base font-bold text-[#111315] hover:text-[#F25C05] transition-colors group cursor-pointer"
                >
                  <span>{t('findOutMore')}</span>
                  <ArrowRight className="w-4 h-4 text-[#F25C05] group-hover:translate-x-1.5 transition-transform" />
                </button>
              </div>
            </div>

            {/* Right Photo */}
            <div
              className="h-[300px] lg:h-full min-h-[380px] relative overflow-hidden bg-gray-900 cursor-pointer"
              onClick={() => onCommoditySelect?.(activeCommodity)}
            >
              <img
                id={`commodity-image-${activeCommodity.id}`}
                src={activeCommodity.imageUrl}
                alt={`${activeCommodity.name} operations and processing at BHP`}
                className="w-full h-full object-cover object-center filter brightness-90 transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
