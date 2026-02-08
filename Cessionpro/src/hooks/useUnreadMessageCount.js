import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/AuthContext';

/**
 * Hook to track unread message count across all conversations
 * Returns the total number of unread messages
 */
export const useUnreadMessageCount = () => {
  const { user } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!user?.email) return;

    const calculateUnreadCount = async () => {
      try {
        // Get all conversations for the user
        const conversations = await getConversations(user.email);
        
        // Sum up unread counts
        const total = conversations.reduce((sum, conv) => {
          const unread = conv.unread_count?.[user.email] || 0;
          return sum + unread;
        }, 0);
        
        setUnreadCount(total);
      } catch (error) {
        console.error('Error calculating unread count:', error);
      }
    };

    calculateUnreadCount();

    // Optional: Set up interval to refresh every 30 seconds
    const interval = setInterval(calculateUnreadCount, 30000);

    return () => clearInterval(interval);
  }, [user?.email]);

  return unreadCount;
};

// Helper function to get conversations
async function getConversations(userEmail) {
  try {
    // This is a mock function - you'll need to use your actual API
    // For now, returning empty array - will be populated by Messages.jsx
    return [];
  } catch (error) {
    console.error('Error fetching conversations:', error);
    return [];
  }
}

export default useUnreadMessageCount;
