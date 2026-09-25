import React, { useState } from 'react';
import { X, Quote, FileText, Share2, Check, Download } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface CeoMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CeoMessageModal: React.FC<CeoMessageModalProps> = ({ isOpen, onClose }) => {
  const { language } = useLanguage();
  const [copied, setCopied] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  if (!isOpen) return null;

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.preventDefault();
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#1C1A18] border border-[#3A3530] text-white rounded-lg shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#2C2825] bg-[#161412]">
          <div className="flex items-center gap-3">
            <span className="font-extrabold text-2xl text-[#F25C05]">BHP</span>
            <span className="text-gray-400 text-sm border-l border-gray-700 pl-3">
              Executive Leadership & Strategy
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-white hover:bg-[#2A2622] rounded transition-colors cursor-pointer"
            aria-label="Close CEO message"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-10 max-h-[80vh] overflow-y-auto space-y-8">
          
          {/* Top CEO Intro */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 pb-8 border-b border-[#2C2825]">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-2 border-[#F25C05] shrink-0 shadow-lg">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&h=400&q=80"
                alt="Brandon Craig, CEO of BHP"
                className="w-full h-full object-cover object-top"
              />
            </div>
            <div>
              <span className="text-xs uppercase font-bold tracking-widest text-[#F25C05]">
                Annual Leadership Address • September 2026
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                Brandon Craig
              </h2>
              <p className="text-sm text-gray-400">Chief Executive Officer, BHP Group Limited</p>
              <div className="flex items-center gap-3 mt-3">
                <button
                  type="button"
                  onClick={handleShare}
                  className="inline-flex items-center gap-1.5 text-xs bg-[#2A2622] hover:bg-[#38332D] text-gray-200 px-3 py-1.5 rounded transition-colors cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Share2 className="w-3.5 h-3.5 text-[#F25C05]" />}
                  <span>{copied ? 'Link Copied' : 'Share Message'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Featured Quote Block */}
          <div className="bg-[#24201C] p-6 sm:p-8 rounded-lg border-l-4 border-[#F25C05] relative">
            <Quote className="w-8 h-8 text-[#F25C05] opacity-50 mb-3" />
            <p className="text-lg sm:text-xl font-semibold text-[#FFF1EA] leading-relaxed italic">
              "BHP is in tremendous shape. We have the people and the portfolio to deliver more of what the world needs – safely, productively and responsibly. Best of all, we still have so much more opportunity ahead of us. Together, we can build the resource projects the world needs and win the next decade."
            </p>
          </div>

          {/* Letter Body */}
          <div className="text-[#D8D2CB] text-base leading-relaxed space-y-4 font-normal">
            <p>
              To our valued shareholders, partners, communities, and employees worldwide:
            </p>
            <p>
              The global energy transition is moving with undeniable momentum. Across renewable energy systems, battery storage, and modernized electrical grids, copper and iron ore stand at the heart of humanity's progress. Concurrently, global food security demands resilient, sustainable agriculture—anchored by the high-grade potash deposits we are unlocking at our Jansen project in Saskatchewan.
            </p>
            <p>
              Over the last financial year, BHP delivered exceptional production across our core assets:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-white">
              <li>
                <strong className="text-[#F25C05]">Escondida & Pampa Norte:</strong> Record mill throughput in Chile, solidifying our status as the world's primary responsible copper supplier.
              </li>
              <li>
                <strong className="text-[#F25C05]">Western Australia Iron Ore (WAIO):</strong> Continued world-class efficiency, maintaining industry-leading low cash production costs below US$18/tonne.
              </li>
              <li>
                <strong className="text-[#F25C05]">Jansen Potash Project:</strong> Stage 1 construction is tracking ahead of schedule, with Stage 2 approval unlocking 8.5 million tonnes of annual capacity.
              </li>
              <li>
                <strong className="text-[#F25C05]">Decarbonisation Commitments:</strong> 100% renewable electricity contracts secured for all Australian operational sites, reducing operational Scope 1 and 2 emissions significantly.
              </li>
            </ul>
            <p>
              Safety remains our foundational imperative. We continue to invest in automated haulage, remote operations centers, and health monitoring technologies to ensure every member of our global team returns home safely each day.
            </p>
            <p>
              Thank you for your ongoing partnership as we build what's next for the resources sector.
            </p>
            <div className="pt-4">
              <p className="font-bold text-white text-lg">Brandon Craig</p>
              <p className="text-sm text-gray-400">Chief Executive Officer, BHP</p>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-[#161412] border-t border-[#2C2825] flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-[#F25C05] hover:bg-[#d84e00] text-white text-sm font-bold rounded transition-colors cursor-pointer"
          >
            Close Message
          </button>
        </div>

      </div>
    </div>
  );
};
