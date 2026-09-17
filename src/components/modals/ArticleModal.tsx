import React, { useState } from 'react';
import { X, Calendar, Clock, Share2, ArrowLeft, Check } from 'lucide-react';
import { NewsItem } from '../../types';

interface ArticleModalProps {
  article: NewsItem | null;
  onClose: () => void;
}

export const ArticleModal: React.FC<ArticleModalProps> = ({ article, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!article) return null;

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#1C1D20] border border-[#33363D] text-white rounded-lg shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#2C2F36] bg-[#161719]">
          <div className="flex items-center gap-3">
            <span className="font-extrabold text-2xl text-[#F25C05]">BHP</span>
            <span className="text-gray-400 text-sm border-l border-gray-700 pl-3">
              Media & Newsroom
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-white hover:bg-[#2A2D33] rounded transition-colors cursor-pointer"
            aria-label="Close article"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Article Body */}
        <div className="p-6 sm:p-10 max-h-[82vh] overflow-y-auto space-y-6">
          
          {/* Badges & Meta */}
          <div className="flex flex-wrap items-center gap-2">
            {article.badges.map((b, i) => (
              <span
                key={i}
                className="px-3 py-1 bg-white text-[#111315] font-extrabold text-[11px] tracking-wider uppercase rounded-full"
              >
                {b}
              </span>
            ))}
            <span className="text-xs text-gray-400 flex items-center gap-1 ml-2">
              <Calendar className="w-3.5 h-3.5" />
              {article.date}
            </span>
            <span className="text-xs text-gray-400 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {article.readTime}
            </span>
          </div>

          {/* Article Title */}
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
            {article.title}
          </h1>

          {/* Featured Image */}
          <div className="w-full h-[300px] sm:h-[400px] rounded-lg overflow-hidden bg-gray-900 shadow-md">
            <img
              src={article.imageUrl}
              alt={article.title}
              className="w-full h-full object-cover object-center"
            />
          </div>

          {/* Narrative Content */}
          <div className="text-[#D8DCE3] text-base sm:text-lg leading-relaxed space-y-4 pt-4 font-normal">
            <p className="font-semibold text-white text-lg sm:text-xl">
              MELBOURNE / GLOBAL — BHP today provided an update on our ongoing community collaboration and sustainability initiatives, emphasizing transparent engagement with key stakeholders, educational institutions, and regional communities.
            </p>
            <p>
              As part of our commitment to sustainable development, this initiative supports long-term capability building, youth engagement, and knowledge transfer across rural and remote communities where resource operations take place.
            </p>
            <blockquote className="p-5 my-6 bg-[#252830] border-l-4 border-[#F25C05] text-white italic rounded-r">
              "Creating shared social value is not separate from our business – it is how we do business. When our host communities thrive, our operations remain resilient and purposeful."
            </blockquote>
            <p>
              Working alongside local academic and municipal partners, the programs combine mobile innovation studios, interactive STEAM (Science, Technology, Engineering, Arts and Mathematics) workshops, and vocational mentorship for aspiring young practitioners.
            </p>
            <p>
              Further updates, detailed verification metrics, and community reports will be made accessible through the BHP Sustainability Reporting Portal and upcoming operational reviews.
            </p>
          </div>

          {/* Actions */}
          <div className="pt-6 border-t border-[#2C2F36] flex flex-wrap items-center justify-between gap-4">
            <button
              onClick={onClose}
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#F25C05] hover:underline cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to all news</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleShare}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#252830] hover:bg-[#323640] rounded text-xs font-bold text-gray-200 transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Share2 className="w-3.5 h-3.5 text-[#F25C05]" />}
                <span>{copied ? 'Link Copied!' : 'Share Article'}</span>
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
