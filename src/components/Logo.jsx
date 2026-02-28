import React from 'react';

export default function Logo({ size = 'md', showText = true }) {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12'
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-2xl'
  };

  return (
    <div className="flex items-center gap-2">
      <img src="/riviqo-favicon.svg" alt="Riviqo" className={`${iconSizes[size]} rounded-xl`} />
      {showText && <span className={`font-heading font-bold ${textSizes[size]} text-gray-900`}>Riviqo</span>}
    </div>
  );
}
