import React, { useState } from 'react';

/**
 * DicebearAvatar Component
 * Generates unique avatars from DiceBear API using avataaars style
 * Falls back to gradient avatar if image fails to load
 */
export const DicebearAvatar = ({ 
  email, 
  name, 
  size = 'md',
  className = '',
  showBorder = true
}) => {
  const [imageError, setImageError] = useState(false);

  // Generate DiceBear avatar URL
  const generateDicebearUrl = (identifier) => {
    // Use email as seed for consistent avatars per user
    const seed = identifier || 'default';
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(seed)}&scale=80&backgroundColor=transparent`;
  };

  // Get size classes
  const sizeClasses = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
    xxl: 'w-24 h-24',
    '2xl': 'w-32 h-32',
  };

  const sizeClass = sizeClasses[size] || sizeClasses.md;

  // Fallback gradient color based on email
  const getFallbackColor = (identifier) => {
    const colors = [
      'from-violet-400 to-primary',
      'from-rose-400 to-pink-500',
      'from-emerald-400 to-teal-500',
      'from-amber-400 to-orange-500',
      'from-sky-400 to-blue-500',
      'from-purple-400 to-indigo-500',
    ];
    const hash = identifier.charCodeAt(0) + identifier.charCodeAt(1);
    return colors[hash % colors.length];
  };

  const fallbackColor = getFallbackColor(email || name || 'user');
  const initials = (name || email || 'U')
    .split(/\s+/)
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  if (imageError) {
    // Fallback to gradient avatar with initials
    return (
      <div
        className={`${sizeClass} rounded-full bg-gradient-to-br ${fallbackColor} flex items-center justify-center text-white font-medium flex-shrink-0 ${
          showBorder ? 'border border-white/20 shadow-sm' : ''
        } ${className}`}
        title={email || name}
      >
        <span className={size === 'xs' ? 'text-xs' : size === 'sm' ? 'text-sm' : 'text-base'}>
          {initials}
        </span>
      </div>
    );
  }

  return (
    <div
      className={`${sizeClass} rounded-full flex-shrink-0 overflow-hidden ${
        showBorder ? 'border border-gray-200 shadow-sm' : ''
      } ${className}`}
      title={email || name}
    >
      <img
        src={generateDicebearUrl(email || name)}
        alt={email || name || 'User avatar'}
        className="w-full h-full object-cover bg-gray-100"
        onError={() => setImageError(true)}
        loading="lazy"
      />
    </div>
  );
};

export default DicebearAvatar;
