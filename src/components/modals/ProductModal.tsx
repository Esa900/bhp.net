import React from 'react';
import { X, CheckCircle, ArrowRight, ExternalLink, Zap, Factory, ShieldCheck, Sprout } from 'lucide-react';
import { CommodityItem } from '../../types';

interface ProductModalProps {
  commodity: CommodityItem | null;
  onClose: () => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({ commodity, onClose }) => {
  if (!commodity) return null;

  const productDetails: Record<string, {
    applications: string[];
    operations: string[];
    sustainabilityHighlights: string[];
    icon: typeof Zap;
  }> = {
    copper: {
      applications: [
        'Electric Vehicle (EV) motors and battery connections',
        'Wind turbine generators (requires up to 4.7 tonnes of copper per MW)',
        'Solar photovoltaic wiring and high-voltage transmission lines',
        'Antimicrobial copper surfaces in healthcare facilities',
      ],
      operations: [
        'Escondida, Chile – World’s largest copper mine by output',
        'Pampa Norte, Chile – Spence open-cut copper and molybdenum processing',
        'Olympic Dam, South Australia – Multi-mineral underground mine',
      ],
      sustainabilityHighlights: [
        '100% desalinated water usage at Escondida processing plant',
        'Renewable Power Purchase Agreements (PPAs) supplying operations',
      ],
      icon: Zap,
    },
    'iron-ore': {
      applications: [
        'Primary raw material for worldwide blast furnace steelmaking',
        'Structural steel for high-rise buildings and transit bridges',
        'Low-carbon Electric Arc Furnace (EAF) feedstocks with DRI pellets',
        'Automotive, marine shipping, and rail transit construction',
      ],
      operations: [
        'Western Australia Iron Ore (WAIO) integrated hub',
        'Pilbara rail infrastructure network over 1,000 km',
        'Port Hedland deep-water export terminal at Nelson Point',
      ],
      sustainabilityHighlights: [
        'Battery-electric locomotive trials across Pilbara heavy rail',
        'Autonomous haulage trucks delivering 20%+ fuel efficiency',
      ],
      icon: Factory,
    },
    'steelmaking-coal': {
      applications: [
        'Essential reductant for smelting iron ore into high-strength steel',
        'Critical manufacturing of wind turbine towers and electric motors',
        'Civil infrastructure and seismic-resistant reinforced concrete',
      ],
      operations: [
        'Bowen Basin, Queensland, Australia (BHP Mitsubishi Alliance - BMA)',
        'Goonyella Riverside, Peak Downs, and Saraji mines',
      ],
      sustainabilityHighlights: [
        'Methane capture and energy abatement research programs',
        'Land rehabilitation and progressive site revegetation',
      ],
      icon: ShieldCheck,
    },
    potash: {
      applications: [
        'High-nutrient potassium fertilizer for crop agriculture',
        'Improves crop water retention and drought tolerance',
        'Enriches soil fertility to meet global food security demands',
      ],
      operations: [
        'Jansen Potash Project, Saskatchewan, Canada',
        'Stage 1 & Stage 2 under construction to produce 8.5 Mtpa',
      ],
      sustainabilityHighlights: [
        'Designed as the lowest-emission potash mine globally (50% less emissions vs peer average)',
        'Innovative automated rotary continuous miners',
      ],
      icon: Sprout,
    },
  };

  const extra = productDetails[commodity.id] || productDetails.copper;
  const ProductIcon = extra.icon;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#1C1D20] border border-[#363A42] text-white rounded-lg shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#2C2F36] bg-[#161719]">
          <div className="flex items-center gap-3">
            <span className="font-extrabold text-2xl text-[#F25C05]">BHP</span>
            <span className="text-gray-300 text-sm font-semibold border-l border-gray-700 pl-3">
              Commodity Focus & Global Supply
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-white hover:bg-[#2A2D33] rounded transition-colors"
            aria-label="Close product details"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-10 max-h-[80vh] overflow-y-auto space-y-8">
          
          {/* Top Banner */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-7">
              <div className="flex items-center gap-2 text-[#F25C05] text-xs font-bold uppercase tracking-widest mb-1">
                <ProductIcon className="w-4 h-4" />
                <span>Primary Strategic Resource</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                {commodity.name}
              </h2>
              <p className="mt-3 text-base text-gray-300 leading-relaxed">
                {commodity.description}
              </p>
              <p className="mt-2 text-sm text-[#FF9E66] font-medium">
                {commodity.secondaryText}
              </p>
            </div>

            <div className="md:col-span-5 h-48 sm:h-56 rounded-lg overflow-hidden bg-gray-900 border border-gray-700">
              <img
                src={commodity.imageUrl}
                alt={commodity.name}
                className="w-full h-full object-cover object-center"
              />
            </div>
          </div>

          {/* Key Applications & Operations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-[#2C2F36]">
            
            {/* Essential Applications */}
            <div className="bg-[#24272E] p-6 rounded-lg border border-[#323640]">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-[#F25C05]" />
                <span>Critical Applications</span>
              </h3>
              <ul className="space-y-2.5 text-sm text-gray-300">
                {extra.applications.map((app, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#F25C05] mt-1.5 shrink-0" />
                    <span>{app}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Key Global Assets */}
            <div className="bg-[#24272E] p-6 rounded-lg border border-[#323640]">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Factory className="w-5 h-5 text-[#F25C05]" />
                <span>Key Operational Assets</span>
              </h3>
              <ul className="space-y-2.5 text-sm text-gray-300">
                {extra.operations.map((op, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#F25C05] mt-1.5 shrink-0" />
                    <span>{op}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>

          {/* Innovation Link: BHP Ventures & Xplor */}
          <div className="p-6 bg-[#2B231D] border border-[#5E3C22] rounded-lg">
            <h4 className="text-base font-bold text-[#FF9E66] mb-1">
              BHP Ventures & BHP Xplor
            </h4>
            <p className="text-xs sm:text-sm text-gray-300">
              Through our venture innovation arm, BHP invests in early-stage breakthrough technologies across deep geothermal, carbon mineralization, critical mineral discovery, and low-emissions processing.
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-[#161719] border-t border-[#2C2F36] flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-[#F25C05] hover:bg-[#d84e00] text-white text-sm font-bold rounded transition-colors"
          >
            Close Overview
          </button>
        </div>

      </div>
    </div>
  );
};
