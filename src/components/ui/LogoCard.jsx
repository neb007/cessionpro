import React from 'react';
import { Building2 } from 'lucide-react';
import { getLogoDimensions } from '@/utils/logoResizer';

/**
 * @param {Object} props
 * @param {string} props.logoUrl
 * @param {string} [props.context]
 * @param {string} [props.altText]
 * @param {string} [props.className]
 * @param {boolean} [props.rounded]
 * @param {boolean} [props.shadow]
 */
export default function LogoCard({
  logoUrl,
  context = 'card',
  altText = 'Logo',
  className = '',
  rounded = true,
  shadow = true,
}) {
  const dimensions = getLogoDimensions(context);
  
  const paddingClass = context === 'detail' ? 'p-1.5' : 'p-2';
  const containerClasses = `${dimensions.className} flex items-center justify-center flex-shrink-0 bg-white border border-gray-100 ${paddingClass}`;
  const roundedClasses = rounded ? 'rounded-lg' : '';
  const shadowClasses = shadow ? 'shadow-md' : '';
  const imgClasses = `max-w-full max-h-full object-contain ${roundedClasses}`;

  if (!logoUrl) {
    return (
      <div
        className={`${containerClasses} ${roundedClasses} ${shadowClasses} ${className}`}
      >
        <Building2 className="w-5 h-5 text-gray-400" />
      </div>
    );
  }

  return (
    <div className={`${containerClasses} ${roundedClasses} ${shadowClasses} ${className}`}>
      <img
        src={logoUrl}
        alt={altText}
        className={imgClasses}
        loading="lazy"
        onError={(e) => {
          // Fallback to placeholder if image fails to load
          e.currentTarget.style.display = 'none';
          const fallback = document.createElement('div');
          fallback.className = `w-full h-full flex items-center justify-center`;
          fallback.innerHTML = '<svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>';
          e.currentTarget.parentNode.appendChild(fallback);
        }}
      />
    </div>
  );
}
