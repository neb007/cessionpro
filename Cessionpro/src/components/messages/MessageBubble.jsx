import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, isToday, isYesterday } from 'date-fns';
import { fr, enUS } from 'date-fns/locale';
import { Check, CheckCheck, Smile, Pin, Copy } from 'lucide-react';
import AvatarWithPresence from './AvatarWithPresence';

/**
 * MessageBubble Component
 * Enhanced message display with reactions, read status, and actions
 */
const MessageBubble = ({
  message,
  isOwn = false,
  userAvatar,
  userName = 'User',
  onReaction = () => {},
  onPin = () => {},
  language = 'en',
  showAvatar = false
}) => {
  const [showReactions, setShowReactions] = useState(false);
  const [showActions, setShowActions] = useState(false);

  const commonReactions = ['👍', '❤️', '😂', '🎉', '😮', '👏'];

  const formatTime = (date) => {
    const d = new Date(date);
    const locale = language === 'fr' ? fr : enUS;
    
    if (isToday(d)) {
      return format(d, 'HH:mm', { locale });
    } else if (isYesterday(d)) {
      return (language === 'fr' ? 'Hier ' : 'Yesterday ') + format(d, 'HH:mm', { locale });
    }
    return format(d, 'd MMM HH:mm', { locale });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
  };

  const bubbleVariants = {
    initial: { opacity: 0, y: 10, scale: 0.95 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -10, scale: 0.95 }
  };

  return (
    <motion.div
      layout
      initial="initial"
      animate="animate"
      exit="exit"
      variants={bubbleVariants}
      className={`flex gap-2 mb-3 group ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Avatar */}
      {showAvatar && !isOwn && (
        <AvatarWithPresence 
          userId={message.sender_id}
          userName={userName}
          size="sm"
          showStatus={false}
        />
      )}

      {/* Message Content */}
      <div className={`flex flex-col max-w-xs ${isOwn ? 'items-end' : 'items-start'}`}>
        {/* Main Bubble */}
        <div
          className={`relative px-4 py-3 rounded-2xl backdrop-blur-xl transition-all transform
            ${isOwn
              ? 'bg-primary/90 text-white rounded-br-none shadow-lg hover:shadow-xl hover:bg-primary'
              : 'bg-white/80 text-gray-900 rounded-bl-none shadow-sm hover:shadow-md hover:bg-white border border-white/50'
            }
          `}
        >
          {/* Message Text */}
          <p className="text-sm whitespace-pre-wrap break-words">
            {message.content}
          </p>

          {/* Timestamp & Read Status */}
          <div className={`flex items-center gap-1 mt-1 text-xs transition-colors
            ${isOwn 
              ? 'text-white/70 group-hover:text-white/100' 
              : 'text-gray-500 group-hover:text-gray-700'
            }
          `}>
            <span>{formatTime(message.created_at)}</span>
            {isOwn && (
              message.read ? (
                <CheckCheck className="w-3.5 h-3.5" />
              ) : (
                <Check className="w-3.5 h-3.5" />
              )
            )}
          </div>
        </div>

        {/* Reactions */}
        {message.reactions && message.reactions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex gap-1 mt-2 flex-wrap"
          >
            {message.reactions.map((reaction, idx) => (
              <motion.button
                key={idx}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => onReaction(message.id, reaction)}
                className="px-2 py-1 rounded-full bg-white/50 hover:bg-white/80 border border-gray-200 text-xs transition-colors"
                title={reaction}
              >
                {reaction}
              </motion.button>
            ))}
          </motion.div>
        )}

        {/* Action Buttons */}
        <AnimatePresence>
          {showActions && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className={`flex gap-2 mt-2 ${isOwn ? 'flex-row-reverse' : ''}`}
            >
              {/* Add Reaction */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowReactions(!showReactions)}
                className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
                title={language === 'fr' ? 'Réagir' : 'React'}
              >
                <Smile className="w-4 h-4" />
              </motion.button>

              {/* Copy */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleCopy}
                className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
                title={language === 'fr' ? 'Copier' : 'Copy'}
              >
                <Copy className="w-4 h-4" />
              </motion.button>

              {/* Pin (Optional) */}
              {isOwn && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => onPin(message.id)}
                  className={`p-1.5 rounded-full transition-colors
                    ${message.is_pinned
                      ? 'bg-yellow-100 text-yellow-600'
                      : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
                    }
                  `}
                  title={language === 'fr' ? 'Épingler' : 'Pin'}
                >
                  <Pin className="w-4 h-4" />
                </motion.button>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Reaction Picker */}
        <AnimatePresence>
          {showReactions && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -10 }}
              className={`flex gap-1 mt-2 p-2 bg-white rounded-lg shadow-lg border border-gray-200 ${
                isOwn ? 'flex-row-reverse' : ''
              }`}
            >
              {commonReactions.map((emoji) => (
                <motion.button
                  key={emoji}
                  whileHover={{ scale: 1.3 }}
                  whileTap={{ scale: 0.8 }}
                  onClick={() => {
                    onReaction(message.id, emoji);
                    setShowReactions(false);
                  }}
                  className="text-xl p-1 hover:bg-gray-100 rounded transition-colors"
                >
                  {emoji}
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default MessageBubble;
