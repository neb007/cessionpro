import React, { useState } from 'react';

export default function Logo({ size = 'md', showText = true }) {
  const [useFallbackIcon, setUseFallbackIcon] = useState(false);
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

  const iconSizes = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className="flex flex-col items-center">
      {/* Riviqo Icon */}
      <div className={`${sizes[size]} flex items-center justify-center bg-[#111111] rounded-2xl shadow-md`}>
        {!useFallbackIcon ? (
          <img
            src="/riviqo-logo.svg"
            alt="Riviqo"
            className={`${iconSizes[size]} object-contain`}
            onError={() => setUseFallbackIcon(true)}
          />
        ) : (
          <svg viewBox="0 0 24 24" className={`${iconSizes[size]} text-white`} fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2 9.5L6.5 5L9 7.5L6 11L2 9.5Z" fill="currentColor"/>
            <path d="M22 9.5L17.5 5L15 7.5L18 11L22 9.5Z" fill="currentColor"/>
            <path d="M7 11L10.2 9.2C11 8.8 12 8.8 12.8 9.2L17 11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M8.2 12.5L11 14.8C11.6 15.3 12.4 15.3 13 14.8L15.8 12.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M7 13.6L9.2 15.5M9 15.8L11.2 17.6M11 17.9L12.8 19.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </div>

      {/* Logo Text */}
      {showText && (
        <div className="mt-2 text-center">
          <h2 className={`font-bold ${textSizes[size]} text-gray-900 tracking-wide`}>RIVIQO</h2>
          <p className="text-xs text-gray-500 mt-1">
            Connecting Business & Opportunity
          </p>
        </div>
      )}
    </div>
  );
}
