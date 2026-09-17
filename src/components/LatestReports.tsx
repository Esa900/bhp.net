import React, { useState } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { REPORTS } from '../data';
import { useLanguage } from '../context/LanguageContext';

interface LatestReportsProps {
  onOpenReports?: () => void;
}

export const LatestReports: React.FC<LatestReportsProps> = ({ onOpenReports }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentReport = REPORTS[currentIndex];
  const { t } = useLanguage();

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : REPORTS.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < REPORTS.length - 1 ? prev + 1 : 0));
  };

  return (
    <section id="latest-reports-section" className="bg-[#F8F9FA] py-14 sm:py-20">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Split Card */}
        <div className="bg-[#ECE7DF] rounded-xs overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[460px] shadow-sm">
          
          {/* Left Side: Content */}
          <div className="lg:col-span-5 p-8 sm:p-12 lg:p-14 flex flex-col justify-between relative z-10">
            <div>
              <div
                id="report-tag"
                className="text-2xl sm:text-3xl font-extrabold text-[#111315] tracking-tight"
              >
                {t('latestReportsTitle')}
              </div>

              <h3
                id="report-title"
                className="mt-2 text-2xl sm:text-3xl font-medium text-[#444850] tracking-tight leading-tight"
              >
                {currentReport.title}
              </h3>

              <p
                id="report-description"
                className="mt-4 text-sm sm:text-base text-[#52565E] leading-relaxed"
              >
                {currentReport.description}
              </p>
            </div>

            {/* Bottom Row with Divider */}
            <div className="mt-8 pt-6 border-t border-[#D5CEC4] flex items-center justify-between">
              <button
                id="report-read-more-link"
                type="button"
                onClick={onOpenReports}
                className="inline-flex items-center gap-2 text-base font-bold text-[#111315] hover:text-[#F25C05] transition-colors group cursor-pointer"
              >
                <span>Read more</span>
                <ArrowRight className="w-4 h-4 text-[#F25C05] group-hover:translate-x-1 transition-transform" />
              </button>

              {/* Pagination Controls */}
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-[#444850]">
                  {currentIndex + 1} / {REPORTS.length}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    id="report-prev-button"
                    type="button"
                    onClick={handlePrev}
                    className="p-1 text-[#444850] hover:text-[#111315] transition-colors focus:outline-none cursor-pointer"
                    aria-label="Previous report"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    id="report-next-button"
                    type="button"
                    onClick={handleNext}
                    className="p-1 text-[#444850] hover:text-[#111315] transition-colors focus:outline-none cursor-pointer"
                    aria-label="Next report"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: High-res Mining Overlook Photo */}
          <div
            className="lg:col-span-7 relative min-h-[340px] lg:min-h-full overflow-hidden bg-gray-900 cursor-pointer"
            onClick={onOpenReports}
          >
            {/* BHP Signature Angled Notch on Large Screens */}
            <div
              className="hidden lg:block absolute top-0 bottom-0 left-0 w-8 z-10 pointer-events-none"
              style={{
                background:
                  'linear-gradient(to right, #ECE7DF 0%, #ECE7DF 50%, transparent 100%)',
                clipPath: 'polygon(0 0, 100% 0, 0 100%)',
              }}
            />

            <img
              id="report-image"
              src={currentReport.imageUrl}
              alt="BHP mining personnel in hi-vis safety gear observing expansive open pit site"
              className="w-full h-full object-cover object-center filter brightness-95 transition-all duration-700 hover:scale-105"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
