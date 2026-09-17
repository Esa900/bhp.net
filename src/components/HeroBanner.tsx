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
    <section id="hero-banner-section" className="bg-[#F8F9FA] pb-12 sm:pb-16">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Image Frame */}
        <div className="relative w-full h-[380px] sm:h-[480px] lg:h-[540px] overflow-hidden rounded-xs bg-[#242628] shadow-sm">
          <img
            id="hero-banner-main-image"
            src={slides[activeSlide].imageUrl}
            alt={slides[activeSlide].alt}
            className="w-full h-full object-cover object-center transition-all duration-700 filter brightness-95"
            loading="eager"
          />

          {/* Bottom Down Arrow Action */}
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-20">
            <button
              id="hero-scroll-indicator-button"
              type="button"
              onClick={handleScrollDown}
              className="w-9 h-9 rounded-full bg-white/90 hover:bg-white text-[#111315] hover:text-[#F25C05] flex items-center justify-center shadow-lg transition-all transform hover:scale-110 focus:outline-none"
              aria-label="Scroll down to positioning section"
            >
              <ChevronDown className="w-5 h-5 stroke-[2.5]" />
            </button>

            {/* Slider bar indicator */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setActiveSlide(0)}
                aria-label="Slide 1"
                className={`h-1 transition-all rounded-full ${
                  activeSlide === 0 ? 'w-10 bg-white' : 'w-4 bg-white/50 hover:bg-white/70'
                }`}
              />
              <button
                type="button"
                onClick={() => setActiveSlide(1)}
                aria-label="Slide 2"
                className={`h-1 transition-all rounded-full ${
                  activeSlide === 1 ? 'w-10 bg-white' : 'w-4 bg-white/50 hover:bg-white/70'
                }`}
              />
            </div>
          </div>
        </div>

        {/* Positioning for the future */}
        <div
          id="positioning-section"
          className="mt-12 sm:mt-16 text-center max-w-3xl mx-auto px-4"
        >
          <h2
            id="positioning-heading"
            className="text-[30px] sm:text-[36px] font-extrabold text-[#111315] tracking-tight"
          >
            Positioning for the future
          </h2>
          <p
            id="positioning-description"
            className="mt-3 text-[16px] sm:text-[17px] text-[#55585E] leading-relaxed"
          >
            Learn more about our focus on the commodities the world needs to decarbonise and sustainably grow.
          </p>

          <div className="mt-6 flex justify-center">
            <a
              id="positioning-cta-button"
              href="#what-we-produce"
              className="inline-block px-7 py-2.5 border border-[#B84E1A] text-[#B84E1A] hover:bg-[#B84E1A] hover:text-white text-sm font-semibold tracking-wide transition-colors rounded-xs focus:outline-none"
            >
              Find out more
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
