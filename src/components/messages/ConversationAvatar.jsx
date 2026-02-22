import React, { useMemo, useState } from 'react';
import { UserRound } from 'lucide-react';

const sizeClasses = {
  xs: 'w-6 h-6',
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-12 h-12',
  xl: 'w-16 h-16',
  xxl: 'w-24 h-24',
  '2xl': 'w-32 h-32'
};

const buildInitials = ({ firstName = '', lastName = '', name = '', email = '' }) => {
  const first = (firstName || '').trim();
  const last = (lastName || '').trim();

  if (first || last) {
    return `${first[0] || ''}${last[0] || ''}`.toUpperCase() || 'U';
  }

  const fallback = (name || email || 'U').trim();
  return fallback
    .split(/\s+/)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'U';
};

const getFallbackColor = (seed = 'user') => {
  const colors = [
    'from-violet-400 to-primary',
    'from-rose-400 to-pink-500',
    'from-emerald-400 to-teal-500',
    'from-amber-400 to-orange-500',
    'from-sky-400 to-blue-500',
    'from-purple-400 to-indigo-500'
  ];
  const safeSeed = String(seed || 'user');
  const a = safeSeed.charCodeAt(0) || 0;
  const b = safeSeed.charCodeAt(1) || 0;
  return colors[(a + b) % colors.length];
};

export default function ConversationAvatar({
  logoUrl = '',
  isAnonymous = false,
  firstName = '',
  lastName = '',
  name = '',
  email = '',
  size = 'md',
  className = '',
  showBorder = true,
  language = 'fr'
}) {
  const [imageError, setImageError] = useState(false);
  const sizeClass = sizeClasses[size] || sizeClasses.md;
  const initials = useMemo(
    () => buildInitials({ firstName, lastName, name, email }),
    [firstName, lastName, name, email]
  );
  const fallbackColor = useMemo(
    () => getFallbackColor(`${firstName}${lastName}${name}${email}`),
    [firstName, lastName, name, email]
  );

  if (isAnonymous) {
    return (
      <div
        className={`${sizeClass} rounded-full bg-slate-200 text-slate-600 flex items-center justify-center flex-shrink-0 ${
          showBorder ? 'border border-slate-300 shadow-sm' : ''
        } ${className}`}
        title={language === 'fr' ? 'Utilisateur anonyme' : 'Anonymous user'}
      >
        <UserRound className={size === 'xs' ? 'w-3 h-3' : size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'} />
      </div>
    );
  }

  if (logoUrl && !imageError) {
    return (
      <div
        className={`${sizeClass} rounded-full flex-shrink-0 overflow-hidden bg-white ${
          showBorder ? 'border border-gray-200 shadow-sm' : ''
        } ${className}`}
        title={name || email || 'Logo'}
      >
        <img
          src={logoUrl}
          alt={name || email || 'Company logo'}
          className="w-full h-full object-cover"
          onError={() => setImageError(true)}
          loading="lazy"
        />
      </div>
    );
  }

  return (
    <div
      className={`${sizeClass} rounded-full bg-gradient-to-br ${fallbackColor} flex items-center justify-center text-white font-medium flex-shrink-0 ${
        showBorder ? 'border border-white/20 shadow-sm' : ''
      } ${className}`}
      title={name || email}
    >
      <span className={size === 'xs' ? 'text-xs' : size === 'sm' ? 'text-sm' : 'text-base'}>{initials}</span>
    </div>
  );
}
