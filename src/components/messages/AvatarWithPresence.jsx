import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

/**
 * AvatarWithPresence Component
 * Displays user avatar with online/offline status indicator using DiceBear
 */
const AvatarWithPresence = ({ 
  userId, 
  userName = 'User', 
  status = 'offline',
  size = 'md',
  showStatus = true,
  className = ''
}) => {
  const [avatarUrl, setAvatarUrl] = useState('');

  useEffect(() => {
    // Generate DiceBear avatar URL
    const style = 'avataaars'; // Other options: 'avataaars-neutral', 'big-ears', 'big-smile', etc.
    const seed = userId || userName;
    const url = `https://api.dicebear.com/7.x/${style}/svg?seed=${encodeURIComponent(seed)}&scale=80`;
    setAvatarUrl(url);
  }, [userId, userName]);

  const sizeClasses = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const statusClasses = {
    online: 'bg-green-500 ring-2 ring-white',
    away: 'bg-yellow-500 ring-2 ring-white',
    offline: 'bg-gray-400 ring-2 ring-white',
  };

  const statusDotSize = {
    xs: 'w-1.5 h-1.5',
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
    lg: 'w-3 h-3',
    xl: 'w-4 h-4',
  };

  const dotPosition = {
    xs: 'bottom-0 right-0',
    sm: 'bottom-0 right-0',
    md: 'bottom-0 right-0',
    lg: '-bottom-1 -right-1',
    xl: '-bottom-1 -right-1',
  };

  return (
    <div className={`relative ${sizeClasses[size]} ${className}`}>
      {/* Avatar Image */}
      <img
        src={avatarUrl}
        alt={userName}
        className={`${sizeClasses[size]} rounded-full object-cover shadow-sm`}
      />

      {/* Status Indicator */}
      {showStatus && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className={`absolute ${dotPosition[size]} ${statusDotSize[size]} rounded-full ${statusClasses[status]}`}
          title={status}
        />
      )}

      {/* Typing Indicator Animation */}
      {status === 'typing' && (
        <div className={`absolute ${dotPosition[size]} flex gap-0.5`}>
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ y: [0, -4, 0] }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                delay: i * 0.1,
              }}
              className="w-1 h-1 bg-primary rounded-full"
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AvatarWithPresence;
