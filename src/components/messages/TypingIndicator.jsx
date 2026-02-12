import React from 'react';
import { motion } from 'framer-motion';
import AvatarWithPresence from './AvatarWithPresence';

/**
 * TypingIndicator Component
 * Shows animated typing indicator with user avatar
 */
const TypingIndicator = ({ 
  userId, 
  userName = 'Someone',
  language = 'en'
}) => {
  const typingText = language === 'fr' ? 'est en train d\'écrire...' : 'is typing...';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex items-center gap-2 py-2 px-4 rounded-lg bg-gray-50"
    >
      <AvatarWithPresence 
        userId={userId} 
        userName={userName} 
        size="sm"
        showStatus={false}
      />
      
      <div className="flex items-center gap-1">
        <span className="text-sm text-gray-600">
          <span className="font-medium">{userName}</span> {typingText}
        </span>
        
        {/* Animated dots */}
        <div className="flex gap-1 ml-1">
          {[0, 1, 2].map((index) => (
            <motion.span
              key={index}
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: index * 0.15,
              }}
              className="w-1.5 h-1.5 bg-gray-400 rounded-full"
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default TypingIndicator;
