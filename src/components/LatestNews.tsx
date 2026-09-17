import React, { useState } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { NewsItem } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useAdminData } from '../context/AdminDataContext';

interface LatestNewsProps {
  onArticleSelect?: (article: NewsItem) => void;
}

export const LatestNews: React.FC<LatestNewsProps> = ({ onArticleSelect }) => {
  const { news } = useAdminData();
  const [startIndex, setStartIndex] = useState(0);
  const itemsPerPage = 3;
  const { t } = useLanguage();

  const activeNewsList = news.length > 0 ? news : [];

  const handlePrev = () => {
    if (activeNewsList.length <= itemsPerPage) return;
    setStartIndex((prev) => (prev > 0 ? prev - 1 : activeNewsList.length - itemsPerPage));
  };

  const handleNext = () => {
    if (activeNewsList.length <= itemsPerPage) return;
    setStartIndex((prev) => (prev + itemsPerPage < activeNewsList.length ? prev + 1 : 0));
  };

  const visibleNews = activeNewsList.slice(startIndex, startIndex + itemsPerPage);
  // Ensure cards are always displayed smoothly
  const displayNews = visibleNews.length < itemsPerPage && activeNewsList.length > itemsPerPage
    ? [...visibleNews, ...activeNewsList.slice(0, itemsPerPage - visibleNews.length)]
    : visibleNews;

  return (
    <section id="latest-news-section" className="bg-[#F8F9FA] py-14 sm:py-20 border-t border-gray-200/60">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Title, More News link, and Arrow Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 sm:mb-10">
          <div className="flex items-center gap-6">
            <h2
              id="latest-news-title"
              className="text-[32px] sm:text-[40px] font-extrabold text-[#111315] tracking-tight"
            >
              {t('latestNewsTitle')}
            </h2>
            <button
              id="latest-news-more-link"
              type="button"
              onClick={() => activeNewsList[0] && onArticleSelect?.(activeNewsList[0])}
              className="inline-flex items-center gap-1.5 text-base font-bold text-[#111315] hover:text-[#F25C05] transition-colors group cursor-pointer"
            >
              <span>{t('moreNews')}</span>
              <ArrowRight className="w-4 h-4 text-[#F25C05] group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Carousel Buttons */}
          <div className="flex items-center gap-2">
            <button
              id="news-carousel-prev"
              type="button"
              onClick={handlePrev}
              className="w-10 h-10 rounded-full border border-gray-300 hover:border-[#111315] text-[#111315] hover:text-[#F25C05] flex items-center justify-center transition-colors focus:outline-none cursor-pointer"
              aria-label="Previous news item"
            >
              <ChevronLeft className="w-5 h-5 stroke-[2]" />
            </button>
            <button
              id="news-carousel-next"
              type="button"
              onClick={handleNext}
              className="w-10 h-10 rounded-full border border-gray-300 hover:border-[#111315] text-[#111315] hover:text-[#F25C05] flex items-center justify-center transition-colors focus:outline-none cursor-pointer"
              aria-label="Next news item"
            >
              <ChevronRight className="w-5 h-5 stroke-[2]" />
            </button>
          </div>
        </div>

        {/* News Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {displayNews.map((news) => (
            <article
              key={news.id}
              id={`news-card-${news.id}`}
              onClick={() => onArticleSelect?.(news)}
              className="group relative h-[440px] sm:h-[480px] rounded-xs overflow-hidden bg-[#1E2024] flex flex-col justify-end p-7 sm:p-8 cursor-pointer shadow-sm transition-transform duration-300 hover:-translate-y-1"
            >
              {/* Background Photo with Dark Gradient Overlay */}
              <img
                src={news.imageUrl}
                alt={news.title}
                className="absolute inset-0 w-full h-full object-cover object-center filter brightness-[0.65] group-hover:scale-105 group-hover:brightness-[0.75] transition-all duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20 pointer-events-none" />

              {/* Card Foreground Content */}
              <div className="relative z-10 flex flex-col items-start">
                {/* Badges */}
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  {news.badges.map((badge, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-white text-[#111315] font-extrabold text-[11px] tracking-wider uppercase rounded-full shadow-xs"
                    >
                      {badge}
                    </span>
                  ))}
                </div>

                {/* News Title */}
                <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug group-hover:text-[#FF8844] transition-colors">
                  {news.title}
                </h3>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
