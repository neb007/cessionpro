import React from 'react';
import { Building2 } from 'lucide-react';
import { getLogoDimensions } from '@/utils/logoResizer';

/**
 * LogoCard Component
 * Displays a business logo with consistent styling across the application
 * 
 * @param {string} logoUrl - URL of the logo image
 * @param {string} context - Context for sizing: 'card' | 'listing' | 'profile' | 'detail'
 * @param {string} altText - Alt text for the image (default: 'Logo')
 * @param {string} className - Additional CSS classes
 * @param {boolean} rounded - Whether to apply rounded corners (default: true)
 * @param {boolean} shadow - Whether to apply shadow (default: true)
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
  
  const baseClasses = `${dimensions.className} object-cover flex-shrink-0 bg-gray-100`;
  const roundedClasses = rounded ? 'rounded-lg' : '';
  const shadowClasses = shadow ? 'shadow-md' : '';
  const imgClasses = `${baseClasses} ${roundedClasses} ${shadowClasses} ${className}`;

  if (!logoUrl) {
    return (
      <div
        className={`${dimensions.className} rounded-lg bg-gray-200 flex items-center justify-center flex-shrink-0 ${shadowClasses} ${className}`}
      >
        <Building2 className="w-5 h-5 text-gray-400" />
      </div>
    );
  }

  return (
    <img
      src={logoUrl}
      alt={altText}
      className={imgClasses}
      loading="lazy"
      onError={(e) => {
        // Fallback to placeholder if image fails to load
        e.currentTarget.style.display = 'none';
        const fallback = document.createElement('div');
        fallback.className = `${dimensions.className} rounded-lg bg-gray-200 flex items-center justify-center flex-shrink-0 ${shadowClasses}`;
        fallback.innerHTML = '<svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>';
        e.currentTarget.parentNode.replaceChild(fallback, e.currentTarget);
      }}
    />
  );
}
