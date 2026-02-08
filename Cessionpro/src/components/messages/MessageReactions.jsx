import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * MessageReactions Component
 * Displays and manages message reactions with a clean, modern UI
 */
export const MessageReactions = ({ 
  messageId, 
  reactions = {},
  onAddReaction,
  onRemoveReaction,
  currentUserEmail
}) => {
  const [showReactionPicker, setShowReactionPicker] = useState(false);
  const pickerRef = useRef(null);

  // Reaction emojis
  const reactionOptions = [
    { emoji: '👍', label: 'Like', value: 'like' },
    { emoji: '❤️', label: 'Love', value: 'love' },
    { emoji: '🔥', label: 'Fire', value: 'fire' },
    { emoji: '💼', label: 'Business', value: 'business' },
    { emoji: '⏰', label: 'Later', value: 'later' },
    { emoji: '❌', label: 'Not interested', value: 'not_interested' }
  ];

  // Close picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setShowReactionPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleReactionClick = (reactionValue) => {
    const reactionData = reactions[reactionValue] || { count: 0, users: [] };
    const userHasReacted = reactionData.users?.includes(currentUserEmail);

    if (userHasReacted) {
      onRemoveReaction?.(messageId, reactionValue);
    } else {
      onAddReaction?.(messageId, reactionValue);
    }
    setShowReactionPicker(false);
  };

  // Get displayed reactions
  const displayedReactions = Object.entries(reactions)
    .filter(([_, data]) => data.count > 0)
    .map(([key, data]) => ({
      value: key,
      emoji: reactionOptions.find(r => r.value === key)?.emoji || '👍',
      count: data.count,
      users: data.users || [],
      userHasReacted: data.users?.includes(currentUserEmail)
    }));

  return (
    <div className="relative" ref={pickerRef}>
      <div className="flex items-center gap-1 mt-2 flex-wrap">
        {/* Display existing reactions */}
        <AnimatePresence>
          {displayedReactions.map((reaction) => (
            <motion.button
              key={reaction.value}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleReactionClick(reaction.value)}
              className={`flex items-center gap-1 px-2 py-1 rounded-full text-sm transition-all ${
                reaction.userHasReacted
                  ? 'bg-primary/20 border border-primary text-primary'
                  : 'bg-gray-100 border border-gray-200 text-gray-700 hover:bg-gray-200'
              }`}
              title={reaction.users.join(', ')}
            >
              <span className="text-base">{reaction.emoji}</span>
              <span className="font-medium">{reaction.count}</span>
            </motion.button>
          ))}
        </AnimatePresence>

        {/* Add reaction button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowReactionPicker(!showReactionPicker)}
          className="p-1 rounded-full hover:bg-gray-100 border border-transparent hover:border-gray-200 transition-all text-gray-500 hover:text-gray-700"
          title="Add reaction"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
        </motion.button>
      </div>

      {/* Reaction picker */}
      <AnimatePresence>
        {showReactionPicker && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -10 }}
            transition={{ type: 'spring', damping: 15, stiffness: 300 }}
            className="absolute bottom-full left-0 mb-2 bg-white border border-gray-200 rounded-lg shadow-lg p-2 flex gap-1 z-50"
          >
            {reactionOptions.map((option) => (
              <motion.button
                key={option.value}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleReactionClick(option.value)}
                className="text-xl p-1 hover:bg-gray-100 rounded transition-colors"
                title={option.label}
              >
                {option.emoji}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MessageReactions;
