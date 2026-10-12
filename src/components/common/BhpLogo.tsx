import React from 'react';

interface BhpLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'light' | 'dark' | 'auto';
  showTagline?: boolean;
  className?: string;
}

export const BhpLogo: React.FC<BhpLogoProps> = ({
  size = 'md',
  variant = 'auto',
  showTagline = false,
  className = '',
}) => {
  // Sizing definitions
  const dimensions = {
    sm: { icon: 26, text: 'text-xl', gap: 'gap-2', tagline: 'text-[9px]' },
    md: { icon: 34, text: 'text-2xl sm:text-[28px]', gap: 'gap-2.5', tagline: 'text-[10px]' },
    lg: { icon: 42, text: 'text-3xl sm:text-[34px]', gap: 'gap-3', tagline: 'text-[11px]' },
    xl: { icon: 52, text: 'text-4xl sm:text-[44px]', gap: 'gap-3.5', tagline: 'text-[12px]' },
  }[size];

  // Unique SVG gradient IDs to avoid collision
  const gradId1 = `bhp-prism-1-${size}`;
  const gradId2 = `bhp-prism-2-${size}`;
  const gradId3 = `bhp-prism-3-${size}`;

  return (
    <div className={`inline-flex items-center ${dimensions.gap} select-none group ${className}`}>
      {/* Redesigned Modern 3D Faceted Mineral & Energy Emblem */}
      <div className="relative shrink-0 transition-transform duration-300 group-hover:scale-105">
        <svg
          width={dimensions.icon}
          height={dimensions.icon}
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-[0_2px_8px_rgba(255,85,0,0.35)]"
        >
          <defs>
            {/* Primary Molten Copper Gradient */}
            <linearGradient id={gradId1} x1="6" y1="6" x2="38" y2="42" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FF772A" />
              <stop offset="50%" stopColor="#FF4A00" />
              <stop offset="100%" stopColor="#D93800" />
            </linearGradient>

            {/* Radiant Luminous Amber Facet */}
            <linearGradient id={gradId2} x1="24" y1="4" x2="44" y2="28" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFA63A" />
              <stop offset="60%" stopColor="#FF6417" />
              <stop offset="100%" stopColor="#E23E00" />
            </linearGradient>

            {/* Deep Grounded Earth / Tech Prism */}
            <linearGradient id={gradId3} x1="10" y1="26" x2="38" y2="44" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FF5714" />
              <stop offset="70%" stopColor="#C42E00" />
              <stop offset="100%" stopColor="#8A1E00" />
            </linearGradient>
          </defs>

          {/* Facet 1: Ascending Forward Chevron (Energy & Decarbonisation) */}
          <path
            d="M24 4L42 14.5V33.5L24 44L6 33.5V14.5L24 4Z"
            fill="none"
            stroke={`url(#${gradId1})`}
            strokeWidth="1.5"
            strokeOpacity="0.4"
          />

          {/* Facet 2: Dynamic Top Prism Wing */}
          <path
            d="M24 6L40 15.5L31 29L24 16.5L17 29L8 15.5L24 6Z"
            fill={`url(#${gradId2})`}
          />

          {/* Facet 3: Core Solid Crystal Facets */}
          <path
            d="M24 16.5L31 29L24 42L17 29L24 16.5Z"
            fill={`url(#${gradId1})`}
          />

          {/* Facet 4: Base Foundation Wedge */}
          <path
            d="M8 15.5L17 29L24 42L10 33L8 15.5Z"
            fill={`url(#${gradId3})`}
            fillOpacity="0.9"
          />

          {/* Facet 5: Right Perspective Reflection */}
          <path
            d="M40 15.5L38 33L24 42L31 29L40 15.5Z"
            fill={`url(#${gradId2})`}
            fillOpacity="0.85"
          />

          {/* Central Precision Core Gem Highlight */}
          <circle cx="24" cy="24" r="2.5" fill="#FFFFFF" fillOpacity="0.95" />
        </svg>
      </div>

      {/* Redesigned Wordmark with Sculpted Typographic Stance */}
      <div className="flex flex-col justify-center">
        <div className="flex items-baseline">
          <span
            className={`font-black tracking-[-0.03em] leading-none ${dimensions.text} transition-colors duration-200 bg-gradient-to-r from-[#FF5500] via-[#FF6D26] to-[#FFA043] bg-clip-text text-transparent`}
            style={{
              textShadow: '0 2px 14px rgba(255, 85, 0, 0.25)',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}
          >
            BHP
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#FF5500] ml-1 mb-0.5 inline-block animate-pulse" />
        </div>

        {showTagline && (
          <span
            className={`font-semibold tracking-[0.2em] uppercase text-gray-400 group-hover:text-gray-300 transition-colors mt-0.5 ${dimensions.tagline}`}
          >
            Resources for the Future
          </span>
        )}
      </div>
    </div>
  );
};
