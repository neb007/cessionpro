import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { supabase } from '@/api/supabaseClient';
import { useLanguage } from '@/components/i18n/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  MessageSquare, 
  Send, 
  ArrowLeft,
  Search,
  Loader2,
  Check,
  CheckCheck,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, isToday, isYesterday } from 'date-fns';
import { fr, enUS } from 'date-fns/locale';

// Import new messaging components
// (Optional) future messaging components can be re-enabled when used
import { DicebearAvatar } from '@/components/messages/DicebearAvatar';
import { messageNotificationQueue } from '@/services/messageNotificationQueue';
import { antiBypassService } from '@/services/antiBypassService';
import { conversationService } from '@/services/conversationService';
import { messageService } from '@/services/messageService';
import { getProfile } from '@/services/profileService';
import { businessService } from '@/services/businessService';

export default function Messages() {
  const { t, language } = useLanguage();
  const messagesEndRef = useRef(null);
  const MAX_MESSAGE_LENGTH = 2000;
  const MESSAGES_PAGE_SIZE = 30;
  const NOTIFICATIONS_ENABLED = true;
  
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [allMessages, setAllMessages] = useState([]);
  const [hasMoreMessages, setHasMoreMessages] = useState(false);
  const [oldestMessageAt, setOldestMessageAt] = useState(null);
  const [typingParticipants, setTypingParticipants] = useState({});
  const messageSubscriptionRef = useRef(null);
  const messageUpdateSubscriptionRef = useRef(null);
  const conversationSubscriptionRef = useRef(null);
  const userConversationsSubscriptionRef = useRef(null);
  const typingChannelRef = useRef(null);
  const readReceiptTimeoutRef = useRef(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [messageError, setMessageError] = useState('');
  const [sendError, setSendError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState(null);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
  const [participantProfiles, setParticipantProfiles] = useState({});
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [showInbox, setShowInbox] = useState(true);
  const [conversationFilter, setConversationFilter] = useState('all');

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation.id);
      setShowInbox(false);
    }
  }, [selectedConversation?.id]);

  useEffect(() => {
    if (!user?.id) return;
    if (!selectedConversation?.id) return;

    if (messageSubscriptionRef.current) {
      supabase.removeChannel(messageSubscriptionRef.current);
    }
    if (messageUpdateSubscriptionRef.current) {
      supabase.removeChannel(messageUpdateSubscriptionRef.current);
    }
    if (conversationSubscriptionRef.current) {
      supabase.removeChannel(conversationSubscriptionRef.current);
    }
    if (typingChannelRef.current) {
      supabase.removeChannel(typingChannelRef.current);
    }

    messageSubscriptionRef.current = messageService.subscribeToMessages(
      selectedConversation.id,
      (newMessage) => {
        if (!newMessage) return;
        setAllMessages((prev) => {
          if (prev.some((msg) => msg.id === newMessage.id)) return prev;
          const next = [...prev, newMessage].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
          return next;
        });
        setMessages((prev) => {
          if (prev.some((msg) => msg.id === newMessage.id)) return prev;
          const next = [...prev, newMessage].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
          return next;
        });
        setShouldAutoScroll(true);

        if (newMessage.receiver_id === user?.id) {
          messageService.updateMessage(newMessage.id, { read: true })
            .then(() => {
              const normalizedUnread = normalizeUnreadCount(selectedConversation);
              return conversationService.updateConversation(selectedConversation.id, {
                unread_count: {
                  ...normalizedUnread,
                  [user?.id]: 0
                }
              });
            })
            .catch((error) => console.warn('Failed to update read receipt:', error));
        }
      }
    );

    messageUpdateSubscriptionRef.current = messageService.subscribeToMessageUpdates(
      selectedConversation.id,
      (updatedMessage) => {
        if (!updatedMessage) return;
        setAllMessages((prev) => prev.map((msg) => msg.id === updatedMessage.id ? updatedMessage : msg));
        setMessages((prev) => prev.map((msg) => msg.id === updatedMessage.id ? updatedMessage : msg));
      }
    );

    conversationSubscriptionRef.current = conversationService.subscribeToConversation(
      selectedConversation.id,
      (payload) => {
        if (payload?.new) {
          setConversations((prev) =>
            prev.map((conv) => (conv.id === payload.new.id ? { ...conv, ...payload.new } : conv))
          );
        }
      }
    );

    typingChannelRef.current = supabase
      .channel(`typing:${selectedConversation.id}`)
      .on('broadcast', { event: 'typing' }, (payload) => {
        if (!payload?.payload) return;
        const { userId, isTyping: typing } = payload.payload;
        if (!userId || userId === user?.id) return;
        setTypingParticipants((prev) => ({
          ...prev,
          [userId]: typing
        }));
      })
      .subscribe();

    return () => {
      if (messageSubscriptionRef.current) {
        supabase.removeChannel(messageSubscriptionRef.current);
        messageSubscriptionRef.current = null;
      }
      if (messageUpdateSubscriptionRef.current) {
        supabase.removeChannel(messageUpdateSubscriptionRef.current);
        messageUpdateSubscriptionRef.current = null;
      }
      if (conversationSubscriptionRef.current) {
        supabase.removeChannel(conversationSubscriptionRef.current);
        conversationSubscriptionRef.current = null;
      }
      if (typingChannelRef.current) {
        supabase.removeChannel(typingChannelRef.current);
        typingChannelRef.current = null;
      }
    };
  }, [selectedConversation?.id, user?.id]);

  useEffect(() => {
    if (!user?.id) return;
    if (userConversationsSubscriptionRef.current) {
      supabase.removeChannel(userConversationsSubscriptionRef.current);
    }
    userConversationsSubscriptionRef.current = conversationService.subscribeToUserConversations(
      user.id,
      (payload) => {
        if (!payload?.new) return;
        setConversations((prev) => {
          const exists = prev.some((conv) => conv.id === payload.new.id);
          if (exists) {
            return prev.map((conv) => conv.id === payload.new.id ? { ...conv, ...payload.new } : conv);
          }
          return [payload.new, ...prev];
        });
      }
    );

    return () => {
      if (userConversationsSubscriptionRef.current) {
        supabase.removeChannel(userConversationsSubscriptionRef.current);
        userConversationsSubscriptionRef.current = null;
      }
    };
  }, [user?.id]);

  useEffect(() => {
    if (shouldAutoScroll) {
      scrollToBottom();
    }
  }, [messages, shouldAutoScroll]);

  const normalizeUnreadCount = (conv) => {
    const normalized = { ...(conv?.unread_count || {}) };
    const participants = [conv?.participant_1_id, conv?.participant_2_id].filter(Boolean);
    participants.forEach((participantId) => {
      if (typeof normalized[participantId] !== 'number') {
        normalized[participantId] = 0;
      }
    });
    return normalized;
  };

  const loadData = async () => {
    try {
      const { data: authData } = await supabase.auth.getUser();
      const userData = authData?.user;
      setUser(userData);

      const convs = await conversationService.listConversations();
      const myConvs = convs.map(conv => ({
        ...conv,
        unread_count: normalizeUnreadCount(conv)
      }));
      setConversations(myConvs);

      const otherParticipantIds = new Set();
      myConvs.forEach((conv) => {
        if (conv.participant_1_id && conv.participant_1_id !== userData?.id) {
          otherParticipantIds.add(conv.participant_1_id);
        }
        if (conv.participant_2_id && conv.participant_2_id !== userData?.id) {
          otherParticipantIds.add(conv.participant_2_id);
        }
      });

      if (otherParticipantIds.size) {
        const profiles = await Promise.all(
          Array.from(otherParticipantIds).map(async (id) => {
            try {
              const profile = await getProfile(id);
              return [id, profile];
            } catch (error) {
              console.warn('Failed to load profile', id, error);
              return [id, null];
            }
          })
        );
        setParticipantProfiles(Object.fromEntries(profiles));
      }

      // Check URL for specific conversation
      const urlParams = new URLSearchParams(window.location.search);
      const convId = urlParams.get('conversation');
      if (convId) {
        const conv = myConvs.find(c => c.id === convId);
        if (conv) setSelectedConversation(conv);
        setShowInbox(false);
      } else {
        setSelectedConversation(null);
        setShowInbox(true);
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const loadMessages = async (conversationId) => {
    try {
      const msgs = await messageService.listMessages(conversationId, {
        limit: MESSAGES_PAGE_SIZE
      });
      setAllMessages(msgs);
      setMessages(msgs);
      setHasMoreMessages(msgs.length === MESSAGES_PAGE_SIZE);
      setOldestMessageAt(msgs[0]?.created_at || null);
      setShouldAutoScroll(true);
      setSendError('');

      if (selectedConversation?.business_id) {
        try {
          const business = await businessService.getBusinessById(selectedConversation.business_id);
          setSelectedBusiness(business);
        } catch (error) {
          console.warn('Failed to load business for conversation', error);
        }
      } else {
        setSelectedBusiness(null);
      }

      // Mark as read
      const unreadMsgs = msgs.filter(m => !m.read && m.receiver_id === user?.id);
      if (unreadMsgs.length > 0) {
        if (readReceiptTimeoutRef.current) {
          clearTimeout(readReceiptTimeoutRef.current);
        }
        readReceiptTimeoutRef.current = setTimeout(async () => {
          for (const msg of unreadMsgs) {
            await messageService.updateMessage(msg.id, { read: true });
          }
        }, 300);
      }

      // Update conversation unread count
      if (selectedConversation) {
        const normalizedUnreadCount = normalizeUnreadCount(selectedConversation);
        await conversationService.updateConversation(conversationId, {
          unread_count: {
            ...normalizedUnreadCount,
            [user?.id]: 0
          }
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleLoadMore = async () => {
    if (isLoadingMore || !selectedConversation?.id || !hasMoreMessages) return;
    setIsLoadingMore(true);
    try {
      const olderMessages = await messageService.listMessages(selectedConversation.id, {
        limit: MESSAGES_PAGE_SIZE,
        before: oldestMessageAt
      });

      if (olderMessages.length === 0) {
        setHasMoreMessages(false);
        setIsLoadingMore(false);
        return;
      }

      setAllMessages((prev) => {
        const merged = [...olderMessages, ...prev];
        return merged;
      });
      setMessages((prev) => {
        const merged = [...olderMessages, ...prev];
        return merged;
      });
      setOldestMessageAt(olderMessages[0]?.created_at || oldestMessageAt);
      setHasMoreMessages(olderMessages.length === MESSAGES_PAGE_SIZE);
      setShouldAutoScroll(false);
    } catch (error) {
      console.error('Error loading more messages:', error);
    }
    setIsLoadingMore(false);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const acceptConversation = async () => {
    if (!selectedConversation?.id || !user?.id) return;
    try {
      const updated = await conversationService.updateConversation(selectedConversation.id, {
        contact_status: 'accepted',
        accepted_at: new Date().toISOString(),
        accepted_by: user.id
      });
      if (updated) {
        setSelectedConversation(updated);
        setConversations((prev) => prev.map((conv) => conv.id === updated.id ? { ...conv, ...updated } : conv));
      }
    } catch (error) {
      console.error('Failed to accept conversation:', error);
    }
  };

  const handleMessageChange = (e) => {
    const value = e.target.value;
    setNewMessage(value);
    if (value.length > MAX_MESSAGE_LENGTH) {
      setMessageError(
        language === 'fr'
          ? `Message trop long (max ${MAX_MESSAGE_LENGTH} caractères)`
          : `Message too long (max ${MAX_MESSAGE_LENGTH} characters)`
      );
    } else {
      setMessageError('');
    }

    // Detect typing
    if (value.trim() && !isTyping) {
      setIsTyping(true);
      if (typingChannelRef.current) {
        typingChannelRef.current.send({
          type: 'broadcast',
          event: 'typing',
          payload: { userId: user?.id, isTyping: true }
        });
      }
    }

    // Reset typing timer
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    // Set new timeout
    const timeout = setTimeout(() => {
      setIsTyping(false);
      if (typingChannelRef.current) {
        typingChannelRef.current.send({
          type: 'broadcast',
          event: 'typing',
          payload: { userId: user?.id, isTyping: false }
        });
      }
    }, 3000); // Stop typing after 3 seconds of inactivity

    setTypingTimeout(timeout);
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;
    if (newMessage.length > MAX_MESSAGE_LENGTH) {
      setMessageError(
        language === 'fr'
          ? `Message trop long (max ${MAX_MESSAGE_LENGTH} caractères)`
          : `Message too long (max ${MAX_MESSAGE_LENGTH} characters)`
      );
      return;
    }
    
    // Anti-bypass detection
    const bypassCheck = antiBypassService.canSendMessage(newMessage, 'warning');
    if (!bypassCheck.allowed) {
      console.warn('[AntiBypass] Message blocked', {
        user: user?.id,
        conversationId: selectedConversation?.id,
        reason: bypassCheck.reason
      });
      alert(language === 'fr' 
        ? `⚠️ ${bypassCheck.reason} - Veuillez utiliser Cessionpro pour tous les contacts`
        : `⚠️ ${bypassCheck.reason} - Please use Cessionpro for all communications`
      );
      return;
    }

    setSending(true);
    setSendError('');
    try {
      const otherParticipantId = selectedConversation.participant_1_id === user?.id
        ? selectedConversation.participant_2_id
        : selectedConversation.participant_1_id;

      await messageService.sendMessage({
        conversation_id: selectedConversation.id,
        receiver_id: otherParticipantId,
        content: newMessage,
        read: false
      });

      const normalizedUnreadCount = normalizeUnreadCount(selectedConversation);
      await conversationService.updateConversation(selectedConversation.id, {
        last_message: newMessage,
        last_message_date: new Date().toISOString(),
        unread_count: {
          ...normalizedUnreadCount,
          [otherParticipantId]: (normalizedUnreadCount?.[otherParticipantId] || 0) + 1
        }
      });

      // Add message to notification queue (batches every 10 min)
      try {
        // Get recipient notification preference (default true if not set)
        const recipientNotificationsEnabled = NOTIFICATIONS_ENABLED;
        const recipientProfile = participantProfiles?.[otherParticipantId];
        const recipientEmail = recipientProfile?.email;

        if (!recipientEmail) {
          throw new Error('Recipient email missing');
        }
        
        messageNotificationQueue.addNotification(
          recipientEmail,
          {
            senderEmail: user?.email,
            senderName: user?.user_metadata?.full_name || user?.email,
            messagePreview: newMessage.substring(0, 100),
            conversationId: selectedConversation.id,
            businessTitle: selectedConversation.business_title || selectedConversation.subject,
            messageContent: newMessage
          },
          recipientNotificationsEnabled // Pass notification flag
        );
      } catch (error) {
        console.warn('Queue notification failed (non-critical):', error);
      }

      // Clear typing indicator
      setIsTyping(false);
      if (typingTimeout) clearTimeout(typingTimeout);
      if (typingChannelRef.current) {
        typingChannelRef.current.send({
          type: 'broadcast',
          event: 'typing',
          payload: { userId: user?.id, isTyping: false }
        });
      }

      setNewMessage('');
      loadMessages(selectedConversation.id);
    } catch (e) {
      console.error(e);
      setSendError(
        language === 'fr'
          ? "Erreur lors de l'envoi du message. Réessayez."
          : 'Error sending message. Please retry.'
      );
    }
    setSending(false);
  };

  const formatMessageTime = (date) => {
    try {
      if (!date) return '';
      const d = new Date(date);
      
      // Validate the date
      if (isNaN(d.getTime())) {
        return '';
      }
      
      const locale = language === 'fr' ? fr : enUS;
      
      if (isToday(d)) {
        return format(d, 'HH:mm');
      } else if (isYesterday(d)) {
        return (language === 'fr' ? 'Hier ' : 'Yesterday ') + format(d, 'HH:mm');
      }
      return format(d, 'd MMM HH:mm', { locale });
    } catch (error) {
      console.warn('Error formatting message time:', error);
      return '';
    }
  };

  const formatConversationDate = (date) => {
    try {
      if (!date) return '';
      const d = new Date(date);
      if (isNaN(d.getTime())) return '';
      return format(d, 'yyyy-MM-dd');
    } catch (error) {
      console.warn('Error formatting conversation date:', error);
      return '';
    }
  };

  const formatPrice = (price) => {
    if (!price) return '-';
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getOtherParticipantId = (conv) => {
    if (!conv || !user?.id) return null;
    return conv.participant_1_id === user?.id ? conv.participant_2_id : conv.participant_1_id;
  };

  const getConversationTitle = (conv) => {
    return conv?.business_title || conv?.subject || (language === 'fr' ? 'Conversation' : 'Conversation');
  };

  const getParticipantLabel = (participantId) => {
    const profile = participantProfiles?.[participantId];
    if (!profile) return participantId || '';
    if (profile.full_name) return profile.full_name;
    const firstName = profile.first_name || '';
    const lastName = profile.last_name || '';
    const fullName = `${firstName} ${lastName}`.trim();
    return fullName || profile.email || participantId || '';
  };

  const filteredConversations = conversations.filter((conv) => {
    const title = getConversationTitle(conv).toLowerCase();
    const otherId = getOtherParticipantId(conv);
    const otherLabel = getParticipantLabel(otherId).toLowerCase();
    const query = searchQuery.toLowerCase();
    const matchesSearch = title.includes(query) || otherLabel.includes(query);
    if (!matchesSearch) return false;
    if (conversationFilter === 'unread') {
      return (conv.unread_count?.[user?.id] || 0) > 0;
    }
    if (conversationFilter === 'pending') {
      return conv.contact_status === 'pending';
    }
    if (conversationFilter === 'read') {
      return (conv.unread_count?.[user?.id] || 0) === 0;
    }
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const otherTypingIds = Object.keys(typingParticipants).filter((id) => typingParticipants[id]);
  const typingLabel = otherTypingIds.length
    ? getParticipantLabel(otherTypingIds[0])
    : '';

  const isConversationAccepted = selectedConversation?.contact_status === 'accepted';
  const shouldShowProfile = isConversationAccepted;
  const isConversationView = Boolean(selectedConversation) && !showInbox;

  if (isConversationView) {
    return (
      <div className="h-[calc(100vh-80px)] flex bg-background">
        <div className="flex-1 flex flex-col bg-background">
          {/* Chat Header */}
          <div className="bg-card border-b border-border p-4 flex items-center gap-4">
            <button
              onClick={() => {
                setShowInbox(true);
                window.location.href = createPageUrl('Messages');
              }}
              className="p-2 -ml-2 hover:bg-gray-100 rounded-lg"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/80 to-primary flex items-center justify-center text-white font-medium">
              {getConversationTitle(selectedConversation)?.[0]?.toUpperCase() || 'M'}
            </div>
            <div className="flex-1 min-w-0">
              <Link
                to={createPageUrl(`BusinessDetails?id=${selectedConversation.business_id}`)}
                className="font-heading font-semibold text-foreground hover:text-primary transition-colors truncate block"
              >
                {getConversationTitle(selectedConversation)}
              </Link>
              <p className="text-sm text-muted-foreground truncate">
                {shouldShowProfile
                  ? getParticipantLabel(getOtherParticipantId(selectedConversation))
                  : (language === 'fr' ? 'Profil en attente d’acceptation' : 'Profile awaiting acceptance')}
              </p>
            </div>
          </div>

          {!isConversationAccepted && selectedConversation?.participant_2_id === user?.id && (
            <div className="bg-warning/10 border-b border-warning/20 px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-warning">
                  {language === 'fr'
                    ? 'Un acheteur souhaite discuter de cette annonce.'
                    : 'A buyer wants to discuss this listing.'}
                </p>
                <p className="text-xs text-warning/80">
                  {language === 'fr'
                    ? 'Acceptez pour afficher ses informations complètes.'
                    : 'Accept to reveal full contact information.'}
                </p>
              </div>
              <Button size="sm" onClick={acceptConversation}>
                {language === 'fr' ? 'Accepter la discussion' : 'Accept conversation'}
              </Button>
            </div>
          )}

          {/* Messages */}
          <div className="flex-1 flex">
            <ScrollArea className="flex-1 p-4 bg-background">
              <div className="max-w-3xl mx-auto space-y-4">
              {hasMoreMessages && (
                <div className="flex justify-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLoadMore}
                    disabled={isLoadingMore}
                    className="text-xs"
                  >
                      {language === 'fr' ? 'Charger plus' : 'Load more'}
                  </Button>
                </div>
              )}
              {allMessages.length === 0 && (
                <div className="text-center text-sm text-muted-foreground py-10">
                  {language === 'fr' ? 'Aucun message pour le moment.' : 'No messages yet.'}
                </div>
              )}
              <AnimatePresence initial={false}>
                {messages.map((msg, idx) => {
                  const isOwn = msg.sender_id === user?.id;
                  const senderId = msg.sender_id;
                  const senderLabel = shouldShowProfile ? getParticipantLabel(senderId) : (language === 'fr' ? 'Utilisateur' : 'User');
                  
                  return (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 20, scale: 0.8 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ type: "spring", stiffness: 100 }}
                      className={`flex gap-3 group ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}
                    >
                      {/* Avatar */}
                      <motion.div 
                        className="flex-shrink-0 mt-1"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ duration: 0.3 }}
                      >
                        <DicebearAvatar 
                          email={senderId} 
                          name={senderLabel}
                          size="lg"
                          showBorder={false}
                          className="group-hover:shadow-lg"
                        />
                      </motion.div>

                      <div className={`max-w-[70%]`}>
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          transition={{ duration: 0.2 }}
                          className={`rounded-2xl px-4 py-3 cursor-pointer ${
                            isOwn
                              ? 'bg-primary text-white rounded-br-md'
                              : 'bg-card text-foreground shadow-sm rounded-bl-md'
                          }`}
                        >
                        <p className="whitespace-pre-wrap">{msg.content}</p>
                        </motion.div>
                        <div className={`flex items-center gap-1 mt-1 text-xs text-muted-foreground ${isOwn ? 'justify-end' : 'justify-start'}`}>
                          <span>{formatMessageTime(msg.created_at)}</span>
                          {isOwn && (
                            msg.read ? (
                              <CheckCheck className="w-4 h-4 text-primary" />
                            ) : (
                              <Check className="w-4 h-4" />
                            )
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}

                {/* Typing Indicator */}
                {(isTyping || otherTypingIds.length > 0) && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex gap-3"
                  >
                    <div className="flex-shrink-0 mt-1">
                      <DicebearAvatar 
                        email={getOtherParticipantId(selectedConversation)} 
                        name={getParticipantLabel(getOtherParticipantId(selectedConversation))}
                        size="lg"
                        showBorder={false}
                      />
                    </div>
                    <div>
                      <motion.div
                        animate={{ scale: [0.95, 1.05, 0.95] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="bg-muted text-muted-foreground rounded-2xl rounded-bl-md px-4 py-3 flex gap-2"
                      >
                        <span className="text-xs">
                          {typingLabel
                            ? (language === 'fr' ? `${typingLabel} écrit...` : `${typingLabel} is typing...`)
                            : (language === 'fr' ? 'Tape un message...' : 'typing...')}
                        </span>
                        <div className="flex gap-1">
                          <motion.div
                            animate={{ opacity: [0.3, 1, 0.3] }}
                            transition={{ duration: 0.8, repeat: Infinity, delay: 0 }}
                            className="w-2 h-2 bg-muted-foreground/60 rounded-full"
                          />
                          <motion.div
                            animate={{ opacity: [0.3, 1, 0.3] }}
                            transition={{ duration: 0.8, repeat: Infinity, delay: 0.2 }}
                            className="w-2 h-2 bg-muted-foreground/60 rounded-full"
                          />
                          <motion.div
                            animate={{ opacity: [0.3, 1, 0.3] }}
                            transition={{ duration: 0.8, repeat: Infinity, delay: 0.4 }}
                            className="w-2 h-2 bg-muted-foreground/60 rounded-full"
                          />
                        </div>
                      </motion.div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Business Panel */}
            <div className="hidden lg:block w-80 border-l border-border bg-card p-4">
              <div className="sticky top-0 space-y-4">
                <div>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">
                    {language === 'fr' ? 'Annonce' : 'Listing'}
                  </p>
                  <h3 className="font-heading text-lg font-semibold text-foreground">
                    {selectedBusiness?.title || getConversationTitle(selectedConversation)}
                  </h3>
                </div>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center justify-between">
                    <span>{language === 'fr' ? 'Type' : 'Type'}</span>
                    <span className="font-medium">
                      {selectedBusiness?.type === 'acquisition'
                        ? (language === 'fr' ? 'Acquisition' : 'Acquisition')
                        : (language === 'fr' ? 'Cession' : 'Sale')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>{language === 'fr' ? 'Prix' : 'Price'}</span>
                    <span className="font-medium">
                      {formatPrice(selectedBusiness?.asking_price)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>{language === 'fr' ? 'Localisation' : 'Location'}</span>
                    <span className="font-medium">
                      {selectedBusiness?.location || '-'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>{language === 'fr' ? 'Référence' : 'Reference'}</span>
                    <span className="font-medium">
                      {selectedBusiness?.reference_number || '-'}
                    </span>
                  </div>
                </div>

                <div className="border-t border-border pt-3">
                  <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
                    {language === 'fr' ? 'Contact' : 'Contact'}
                  </p>
                  {shouldShowProfile ? (
                    <div className="space-y-1 text-sm text-foreground">
                      <p className="font-medium">
                        {getParticipantLabel(getOtherParticipantId(selectedConversation))}
                      </p>
                      <p>{participantProfiles?.[getOtherParticipantId(selectedConversation)]?.email || '-'}</p>
                      <p>{participantProfiles?.[getOtherParticipantId(selectedConversation)]?.phone || '-'}</p>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      {language === 'fr'
                        ? 'Infos disponibles après acceptation.'
                        : 'Details available after acceptance.'}
                    </p>
                  )}
                </div>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    if (selectedConversation?.business_id) {
                      window.location.href = createPageUrl(`BusinessDetails?id=${selectedConversation.business_id}`);
                    }
                  }}
                >
                  {language === 'fr' ? 'Voir annonce complète' : 'View full listing'}
                </Button>
              </div>
            </div>
          </div>

          {/* Input */}
          <div className="bg-card border-t border-border p-4">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage();
              }}
              className="max-w-3xl mx-auto flex gap-3"
            >
              <div className="flex-1">
                <Input
                  value={newMessage}
                  onChange={handleMessageChange}
                  placeholder={t('type_message')}
                  className="flex-1"
                  disabled={sending || (!isConversationAccepted && selectedConversation?.participant_2_id === user?.id)}
                />
                <div className="flex items-center justify-between mt-1 text-xs text-muted-foreground">
                  <span>
                    {newMessage.length}/{MAX_MESSAGE_LENGTH}
                  </span>
                  {messageError && (
                    <span className="text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {messageError}
                    </span>
                  )}
                </div>
                {sendError && !messageError && (
                  <div className="text-xs text-red-500 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {sendError}
                  </div>
                )}
              </div>
              <Button
                type="submit"
                disabled={!newMessage.trim() || sending || !!messageError || (!isConversationAccepted && selectedConversation?.participant_2_id === user?.id)}
                className="bg-primary hover:bg-primary/90"
              >
                {sending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-80px)] flex bg-background">
      {/* Conversations List */}
      <div className="w-full bg-card border-r border-border flex flex-col">
        <div className="px-6 py-5 border-b border-border bg-card">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="font-heading text-2xl font-bold text-foreground">
                Messages
              </h1>
              <p className="text-sm text-muted-foreground">
                {filteredConversations.length}/{conversations.length} {language === 'fr' ? 'prises de contact' : 'contacts'}
              </p>
            </div>
            <div className="relative w-full max-w-[220px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={language === 'fr' ? 'Rechercher...' : 'Search...'}
                className="pl-10 bg-background"
              />
            </div>
          </div>
          <div className="flex items-center gap-6 mt-4 text-sm font-medium">
            {['all', 'unread', 'pending'].map((filterKey) => (
              <button
                key={filterKey}
                type="button"
                onClick={() => setConversationFilter(filterKey)}
                className={`pb-2 border-b-2 transition ${
                  conversationFilter === filterKey
                    ? 'border-primary text-foreground'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                {language === 'fr'
                  ? ({ all: 'Tous les messages', unread: 'Non lus', pending: 'Archivés' }[filterKey])
                  : ({ all: 'All messages', unread: 'Unread', pending: 'Archived' }[filterKey])}
              </button>
            ))}
          </div>
        </div>

        <ScrollArea className="flex-1 bg-background">
          {filteredConversations.length === 0 ? (
            <div className="p-8 text-center">
              <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">{t('no_conversations')}</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              <div className="hidden lg:grid grid-cols-[110px_150px_180px_1fr_110px_80px_90px] gap-4 px-6 py-3 text-[11px] uppercase tracking-widest text-muted-foreground">
                <span>{language === 'fr' ? 'Date' : 'Date'}</span>
                <span>{language === 'fr' ? 'Demandeur' : 'Requester'}</span>
                <span>{language === 'fr' ? 'Sujet' : 'Subject'}</span>
                <span>{language === 'fr' ? "Titre de l’annonce" : 'Listing'}</span>
                <span>{language === 'fr' ? 'Type' : 'Type'}</span>
                <span className="text-center">{language === 'fr' ? 'Non lus' : 'Unread'}</span>
                <span className="text-center">{language === 'fr' ? 'Répondu' : 'Replied'}</span>
              </div>
              {filteredConversations.map((conv) => {
                const isActive = selectedConversation?.id === conv.id;
                const unread = conv.unread_count?.[user?.id] || 0;
                const otherParticipantId = getOtherParticipantId(conv);
                const otherLabel = getParticipantLabel(otherParticipantId);
                const statusLabel = conv.contact_status === 'pending'
                  ? (language === 'fr' ? 'En attente' : 'Pending')
                  : (language === 'fr' ? 'Actif' : 'Active');
                const replied = unread === 0 && Boolean(conv.last_message);
                const subjectPreview = conv.last_message || (language === 'fr' ? 'Nouveau message' : 'New message');
                const businessTitle = conv.business_title || conv.subject || (language === 'fr' ? 'Annonce' : 'Listing');
                const typeLabel = conv.business_type === 'acquisition'
                  ? (language === 'fr' ? 'Acquisition' : 'Acquisition')
                  : (language === 'fr' ? 'Cession' : 'Sale');
                const statusTone = conv.contact_status === 'pending'
                  ? 'bg-warning/10 text-warning'
                  : 'bg-success/10 text-success';
                
                return (
                  <button
                    key={conv.id}
                    onClick={() => {
                      setSelectedConversation(conv);
                      setShowInbox(false);
                      window.location.href = createPageUrl(`Messages?conversation=${conv.id}`);
                    }}
                    className={`w-full text-left transition-colors group ${
                      isActive ? 'bg-primary/10' : 'hover:bg-muted/40'
                    }`}
                  >
                    <div className="lg:hidden px-6 py-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <DicebearAvatar email={otherParticipantId} name={otherLabel} size="md" />
                          <div>
                            <p className="font-semibold text-foreground">{otherLabel}</p>
                            <p className="text-xs text-muted-foreground">{subjectPreview}</p>
                          </div>
                        </div>
                        {unread > 0 && (
                          <Badge className="bg-primary text-white text-xs">{unread}</Badge>
                        )}
                      </div>
                      <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                        <span>{formatConversationDate(conv.last_message_date || conv.updated_at)}</span>
                        <span className="truncate">{businessTitle}</span>
                      </div>
                    </div>

                    <div className="hidden lg:grid grid-cols-[110px_150px_180px_1fr_110px_80px_90px] gap-4 items-center px-6 py-4">
                      <span className="text-sm text-muted-foreground">
                        {formatConversationDate(conv.last_message_date || conv.updated_at)}
                      </span>
                      <div className="flex items-center gap-2">
                        <DicebearAvatar email={otherParticipantId} name={otherLabel} size="sm" />
                        <span className="text-sm font-medium text-foreground truncate">{otherLabel}</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground truncate">{subjectPreview}</p>
                        <span className={`text-xs px-2 py-1 rounded-full ${statusTone}`}>
                          {statusLabel}
                        </span>
                      </div>
                      <span className="text-sm text-muted-foreground truncate">{businessTitle}</span>
                      <Badge variant="secondary" className="text-xs w-fit">
                        {typeLabel}
                      </Badge>
                      <div className="flex justify-center">
                        {unread > 0 ? (
                          <Badge className="bg-primary text-white text-xs">{unread}</Badge>
                        ) : (
                          <span className="text-xs text-muted-foreground">0</span>
                        )}
                      </div>
                      <div className="flex justify-center">
                        <span className={`text-xs px-2 py-1 rounded-full ${replied ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'}`}>
                          {replied ? (language === 'fr' ? 'Oui' : 'Yes') : (language === 'fr' ? 'Non' : 'No')}
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  );
}