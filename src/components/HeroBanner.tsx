import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export const HeroBanner: React.FC = () => {
  const [activeSlide, setActiveSlide] = useState(0);

  const slides = [
    {
      title: 'Sustainable Agriculture & Potash',
      // Lush vertical greenhouse nursery with foliage & specialists
      imageUrl: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=2000&q=85',
      alt: 'Sustainable high-tech agriculture and greenhouse nursery',
    },
    {
      title: 'Decarbonised Modern Mining',
      imageUrl: 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=2000&q=85',
      alt: 'Clean copper extraction and renewable electrification',
    },
  ];

  const handleScrollDown = () => {
    const el = document.getElementById('positioning-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="hero-banner-section" className="bg-[#F8FAFC] pb-14 sm:pb-20">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Image Frame */}
        <div className="relative w-full h-[380px] sm:h-[480px] lg:h-[540px] overflow-hidden rounded-2xl bg-[#1A1E26] shadow-xl border border-slate-200/60">
          <img
            id="hero-banner-main-image"
            src={slides[activeSlide].imageUrl}
            alt={slides[activeSlide].alt}
            className="w-full h-full object-cover object-center transition-all duration-700 filter brightness-95"
            loading="eager"
          />

          {/* Bottom Down Arrow Action */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-20">
            <button
              id="hero-scroll-indicator-button"
              type="button"
              onClick={handleScrollDown}
              className="w-10 h-10 rounded-full bg-white/95 hover:bg-white text-[#0A0D14] hover:text-[#FF5500] flex items-center justify-center shadow-xl transition-all transform hover:scale-110 focus:outline-none cursor-pointer"
              aria-label="Scroll down to positioning section"
            >
              <ChevronDown className="w-5 h-5 stroke-[2.5]" />
            </button>

            {/* Slider bar indicator */}
            <div className="flex items-center gap-2 bg-black/30 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
              <button
                type="button"
                onClick={() => setActiveSlide(0)}
                aria-label="Slide 1"
                className={`h-1.5 transition-all rounded-full cursor-pointer ${
                  activeSlide === 0 ? 'w-8 bg-[#FF5500]' : 'w-3 bg-white/60 hover:bg-white'
                }`}
              />
              <button
                type="button"
                onClick={() => setActiveSlide(1)}
                aria-label="Slide 2"
                className={`h-1.5 transition-all rounded-full cursor-pointer ${
                  activeSlide === 1 ? 'w-8 bg-[#FF5500]' : 'w-3 bg-white/60 hover:bg-white'
                }`}
              />
            </div>
          </div>
        </div>

        {/* Positioning for the future */}
        <div
          id="positioning-section"
          className="mt-14 sm:mt-18 text-center max-w-3xl mx-auto px-4"
        >
          <h2
            id="positioning-heading"
            className="text-[32px] sm:text-[40px] font-extrabold text-[#0A0D14] tracking-tight"
          >
            Positioning for the future
          </h2>
          <p
            id="positioning-description"
            className="mt-3 text-[16px] sm:text-[18px] text-[#475569] leading-relaxed"
          >
            Learn more about our focus on the commodities the world needs to decarbonise and sustainably grow.
          </p>

          <div className="mt-7 flex justify-center">
            <a
              id="positioning-cta-button"
              href="#what-we-produce"
              className="inline-block px-8 py-3 bg-gradient-to-r from-[#FF5500] to-[#E64200] hover:from-[#E64200] hover:to-[#CC3B00] text-white shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 text-sm font-bold tracking-wide transition-all transform hover:-translate-y-0.5 rounded-xl focus:outline-none"
            >
              Find out more
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
