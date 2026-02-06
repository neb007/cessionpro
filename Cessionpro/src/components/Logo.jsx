import React from 'react';

export default function Logo({ size = 'md', showText = true }) {
  const sizes = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-24 h-24'
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-4xl'
  };

  return (
    <div className="flex flex-col items-center">
      {/* Logo SVG */}
      <div className={`${sizes[size]} flex items-center justify-center bg-white rounded-full shadow-md`}>
        <svg viewBox="0 0 200 200" className="w-full h-full p-2" xmlns="http://www.w3.org/2000/svg">
          {/* Circular arrows - Blue arrow up-right */}
          <path
            d="M 100 50 Q 140 80 140 120"
            fill="none"
            stroke="#0F3460"
            strokeWidth="16"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Arrow head - Blue */}
          <polygon points="140,60 165,75 150,100" fill="#0F3460" />

          {/* Circular arrows - Orange arrow down-right */}
          <path
            d="M 140 120 Q 140 160 100 150"
            fill="none"
            stroke="#E67E22"
            strokeWidth="16"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Arrow head - Orange */}
          <polygon points="100,160 80,150 95,125" fill="#E67E22" />

          {/* Circular arrows - Orange arrow down-left */}
          <path
            d="M 100 150 Q 60 160 60 120"
            fill="none"
            stroke="#E67E22"
            strokeWidth="16"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Arrow head - Orange */}
          <polygon points="60,150 35,135 50,110" fill="#E67E22" />

          {/* Circular arrows - Blue arrow up-left */}
          <path
            d="M 60 120 Q 60 80 100 50"
            fill="none"
            stroke="#0F3460"
            strokeWidth="16"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Arrow head - Blue */}
          <polygon points="100,40 120,65 105,90" fill="#0F3460" />

          {/* Handshake in center */}
          <path
            d="M 80 100 L 95 95 Q 100 93 105 95 L 120 100"
            fill="none"
            stroke="#0F3460"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Right hand part */}
          <path d="M 105 95 L 115 85 M 115 85 L 125 90" stroke="#E67E22" strokeWidth="3" fill="none" strokeLinecap="round" />
          {/* Left hand part */}
          <path d="M 95 95 L 85 85 M 85 85 L 75 90" stroke="#0F3460" strokeWidth="3" fill="none" strokeLinecap="round" />
        </svg>
      </div>

      {/* Logo Text */}
      {showText && (
        <div className="mt-2 text-center">
          <h2 className={`font-bold ${textSizes[size]} text-gray-900`}>
            <span className="text-[#0F3460]">Cession</span>
            <span className="text-[#E67E22]">Pro</span>
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Connecting Business & Opportunity
          </p>
        </div>
      )}
    </div>
  );
}
