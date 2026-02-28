import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createBusinessDetailsUrl, createPageUrl } from '@/utils';
import { supabase } from '@/api/supabaseClient';
import { useLanguage } from '@/components/i18n/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  MessageSquare,
  Send,
  ArrowLeft,
  Search,
  Loader2,
  Check,
  CheckCheck,
  AlertCircle,
  BellRing,
  Trash2,
  Pin,
  PinOff,
  WifiOff,
  Wifi
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, isToday, isYesterday } from 'date-fns';
import { fr, enUS } from 'date-fns/locale';

// Import new messaging components
// (Optional) future messaging components can be re-enabled when used
import { DealStageManager, DocumentVault } from '@/components/messages';
import ConversationAvatar from '@/components/messages/ConversationAvatar';
import { emailNotificationService } from '@/services/emailNotificationService';
import { featureAlertService } from '@/services/featureAlertService';
import { antiBypassService } from '@/services/antiBypassService';
import { conversationService } from '@/services/conversationService';
import { messageService } from '@/services/messageService';
import { getProfile } from '@/services/profileService';
import { businessService } from '@/services/businessService';

export default function Messages() {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  const defaultDocumentTitleRef = useRef(typeof document !== 'undefined' ? document.title : 'RIVIQO');
  const activeBrowserNotificationsRef = useRef([]);
  const HIDDEN_CONTACT_ID = '8c14c80a-75d2-41b1-ab33-7fbabffec252';
  const MAX_MESSAGE_LENGTH = 2000;
  const MESSAGES_PAGE_SIZE = 30;
  const NOTIFICATIONS_ENABLED = true;
  const DEAL_ROOM_FEATURES_ENABLED = false;
  
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
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
  const [messageSearchQuery, setMessageSearchQuery] = useState('');
  const [showMessageSearch, setShowMessageSearch] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState(null);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
  const [participantProfiles, setParticipantProfiles] = useState({});
  const [conversationBusinessLogos, setConversationBusinessLogos] = useState({});
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [conversationDocuments, setConversationDocuments] = useState([]);
  const [showInbox, setShowInbox] = useState(true);
  const [conversationFilter, setConversationFilter] = useState('all');
  const [archivingConversationId, setArchivingConversationId] = useState(null);
  const [blockingConversationId, setBlockingConversationId] = useState(null);
  const [dealActionLoading, setDealActionLoading] = useState(false);
  const [featureAlertLoading, setFeatureAlertLoading] = useState(false);
  const [featureAlertStatus, setFeatureAlertStatus] = useState('idle');
  const [featureAlertMessage, setFeatureAlertMessage] = useState('');
  const [messageToDelete, setMessageToDelete] = useState(null);
  const [pinnedConversationIds, setPinnedConversationIds] = useState(() => {
    try { return JSON.parse(localStorage.getItem('pinnedConversations') || '[]'); }
    catch { return []; }
  });
  const [isOnline, setIsOnline] = useState(() => typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [showReconnected, setShowReconnected] = useState(false);
  const [isTabVisible, setIsTabVisible] = useState(() => (typeof document === 'undefined' ? true : !document.hidden));
  const [backgroundNotificationCount, setBackgroundNotificationCount] = useState(0);
  const lastDealActionRef = useRef(0);

  const closeActiveBrowserNotifications = () => {
    activeBrowserNotificationsRef.current.forEach((notification) => {
      try {
        notification?.close?.();
      } catch (_error) {
        // no-op
      }
    });
    activeBrowserNotificationsRef.current = [];
  };

  const notifyIncomingMessageInBackground = async (incomingMessage) => {
    if (!incomingMessage || incomingMessage.receiver_id !== user?.id) return;
    if (typeof document === 'undefined' || !document.hidden) return;

    setBackgroundNotificationCount((prev) => prev + 1);

    if (typeof window === 'undefined' || !('Notification' in window)) return;

    try {
      let permission = Notification.permission;
      if (permission === 'default') {
        permission = await Notification.requestPermission();
      }
      if (permission !== 'granted') return;

      const senderLabel = getParticipantLabel(incomingMessage.sender_id);
      const fallbackTitle = language === 'fr' ? 'Nouveau message' : 'New message';
      const title = senderLabel || fallbackTitle;
      const body = incomingMessage.content?.trim() || (language === 'fr'
        ? 'Vous avez reçu un nouveau message.'
        : 'You received a new message.');

      const notification = new Notification(title, {
        body,
        tag: `message-${incomingMessage.conversation_id || 'default'}`
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
      };

      activeBrowserNotificationsRef.current.push(notification);
    } catch (error) {
      console.warn('Browser notification failed:', error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Online/offline detection and auto-reconnect
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowReconnected(true);
      // Reload data on reconnect
      loadData();
      if (selectedConversation?.id) {
        loadMessages(selectedConversation.id);
      }
      setTimeout(() => setShowReconnected(false), 3000);
    };
    const handleOffline = () => {
      setIsOnline(false);
      setShowReconnected(false);
    };
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [selectedConversation?.id]);

  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation.id);
      loadConversationEvents(selectedConversation.id);
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
        setMessages((prev) => mergeMessagesById(prev, [newMessage], false));
        setShouldAutoScroll(true);

        if (newMessage.receiver_id === user?.id) {
          notifyIncomingMessageInBackground(newMessage);
          messageService.updateMessage(newMessage.id, { read: true })
            .then(() => persistUnreadResetForConversation(selectedConversation, selectedConversation.id))
            .catch((error) => console.warn('Failed to update read receipt:', error));
        }
      }
    );

    messageUpdateSubscriptionRef.current = messageService.subscribeToMessageUpdates(
      selectedConversation.id,
      (updatedMessage) => {
        if (!updatedMessage) return;
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

  useEffect(() => {
    if (typeof document === 'undefined') return undefined;

    const handleVisibilityOrFocus = () => {
      const visible = !document.hidden;
      setIsTabVisible(visible);
      if (visible) {
        setBackgroundNotificationCount(0);
        closeActiveBrowserNotifications();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityOrFocus);
    window.addEventListener('focus', handleVisibilityOrFocus);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityOrFocus);
      window.removeEventListener('focus', handleVisibilityOrFocus);
      closeActiveBrowserNotifications();
      document.title = defaultDocumentTitleRef.current;
    };
  }, []);

  const totalUnreadAcrossConversations = useMemo(() => {
    return conversations.reduce((sum, conv) => {
      const unread = Number(conv?.unread_count?.[user?.id] || 0);
      return sum + (Number.isFinite(unread) ? unread : 0);
    }, 0);
  }, [conversations, user?.id]);

  useEffect(() => {
    if (typeof document === 'undefined') return;

    const unreadForTitle = Math.max(backgroundNotificationCount, totalUnreadAcrossConversations);
    if (isTabVisible || unreadForTitle <= 0) {
      document.title = defaultDocumentTitleRef.current;
      return;
    }

    const unreadLabel = language === 'fr'
      ? `(${unreadForTitle}) Nouveau${unreadForTitle > 1 ? 'x' : ''} message${unreadForTitle > 1 ? 's' : ''}`
      : `(${unreadForTitle}) New message${unreadForTitle > 1 ? 's' : ''}`;
    document.title = `${unreadLabel} • ${defaultDocumentTitleRef.current}`;
  }, [isTabVisible, backgroundNotificationCount, totalUnreadAcrossConversations, language]);

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

  const persistUnreadResetForConversation = async (conv, conversationId) => {
    if (!conversationId || !user?.id) return null;

    const normalizedUnreadCount = normalizeUnreadCount(conv);
    const nextUnreadCount = {
      ...normalizedUnreadCount,
      [user.id]: 0
    };

    const updated = await conversationService.updateConversation(conversationId, {
      unread_count: nextUnreadCount
    });

    const mergedUpdated = updated
      ? {
          ...updated,
          unread_count: {
            ...(updated.unread_count || {}),
            [user.id]: 0
          }
        }
      : {
          id: conversationId,
          unread_count: nextUnreadCount
        };

    updateConversationState(mergedUpdated);
    return mergedUpdated;
  };

  const mergeMessagesById = (baseMessages = [], incomingMessages = [], prepend = false) => {
    const map = new Map();
    const ordered = prepend
      ? [...incomingMessages, ...baseMessages]
      : [...baseMessages, ...incomingMessages];

    ordered.forEach((msg) => {
      if (!msg?.id) return;
      map.set(msg.id, msg);
    });

    return Array.from(map.values()).sort(
      (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );
  };

  const openConversation = (conv) => {
    if (!conv?.id) return;
    setSelectedConversation(conv);
    setShowInbox(false);
    setMessageSearchQuery('');
    setShowMessageSearch(false);
    // Restore draft for this conversation
    const draft = localStorage.getItem(`draft_${conv.id}`) || '';
    setNewMessage(draft);
    navigate(createPageUrl(`Messages?conversation=${conv.id}`));
  };

  const closeConversation = () => {
    setShowInbox(true);
    navigate(createPageUrl('Messages'));
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

      const profileIds = new Set(otherParticipantIds);
      if (userData?.id) {
        profileIds.add(userData.id);
      }

      if (profileIds.size) {
        const profiles = await Promise.all(
          Array.from(profileIds).map(async (id) => {
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

      const businessIds = Array.from(new Set(myConvs.map((conv) => conv.business_id).filter(Boolean)));
      if (businessIds.length > 0) {
        const { data: logosData, error: logosError } = await supabase
          .from('business_logos')
          .select('business_id, logo_url')
          .in('business_id', businessIds);

        if (logosError) {
          console.warn('Failed to load business logos for messaging:', logosError);
        } else {
          const logosMap = (logosData || []).reduce((acc, item) => {
            if (item?.business_id && item?.logo_url && !acc[item.business_id]) {
              acc[item.business_id] = item.logo_url;
            }
            return acc;
          }, {});
          setConversationBusinessLogos(logosMap);
        }
      } else {
        setConversationBusinessLogos({});
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
      if (selectedConversation && user?.id) {
        await persistUnreadResetForConversation(selectedConversation, conversationId);
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

      setMessages((prev) => mergeMessagesById(prev, olderMessages, true));
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
      if (error?.code === 'PGRST204') {
        try {
          const updated = await conversationService.updateConversation(selectedConversation.id, {
            contact_status: 'accepted'
          });
          if (updated) {
            setSelectedConversation(updated);
            setConversations((prev) => prev.map((conv) => conv.id === updated.id ? { ...conv, ...updated } : conv));
          }
          return;
        } catch (fallbackError) {
          console.error('Failed to accept conversation (fallback):', fallbackError);
          return;
        }
      }
      console.error('Failed to accept conversation:', error);
    }
  };

  const isConversationArchived = (conv) => {
    if (!conv || !user?.id) return false;
    const archivedBy = Array.isArray(conv.archived_by) ? conv.archived_by : [];
    return archivedBy.includes(user.id);
  };

  const getConversationBlockedBy = (conv) => {
    if (!conv) return [];
    return Array.isArray(conv.blocked_by) ? conv.blocked_by : [];
  };

  const isConversationBlockedByCurrentUser = (conv) => {
    if (!conv || !user?.id) return false;
    return getConversationBlockedBy(conv).includes(user.id);
  };

  const isConversationReadOnly = (conv) => {
    return getConversationBlockedBy(conv).length > 0;
  };

  const handleArchiveConversation = async (conv) => {
    if (!conv?.id || !user?.id) return;
    setArchivingConversationId(conv.id);
    try {
      const archivedBy = Array.isArray(conv.archived_by) ? conv.archived_by : [];
      if (!archivedBy.includes(user.id)) {
        const updated = await conversationService.updateConversation(conv.id, {
          archived_by: [...archivedBy, user.id]
        });
        if (updated) {
          setConversations((prev) => prev.map((item) => item.id === updated.id ? {
            ...item,
            ...updated,
            archived_by: Array.isArray(updated.archived_by) ? updated.archived_by : archivedBy.concat(user.id)
          } : item));
          if (selectedConversation?.id === updated.id) {
            setSelectedConversation({
              ...selectedConversation,
              ...updated,
              archived_by: Array.isArray(updated.archived_by) ? updated.archived_by : archivedBy.concat(user.id)
            });
          }
        }
      }
    } catch (error) {
      console.error('Failed to archive conversation:', error);
    }
    setArchivingConversationId(null);
  };

  const handleUnarchiveConversation = async (conv) => {
    if (!conv?.id || !user?.id) return;
    setArchivingConversationId(conv.id);
    try {
      const archivedBy = Array.isArray(conv.archived_by) ? conv.archived_by : [];
      if (!archivedBy.includes(user.id)) return;

      const nextArchivedBy = archivedBy.filter((id) => id !== user.id);
      const updated = await conversationService.updateConversation(conv.id, {
        archived_by: nextArchivedBy
      });

      const normalizedArchivedBy = Array.isArray(updated?.archived_by) ? updated.archived_by : nextArchivedBy;

      setConversations((prev) => prev.map((item) => item.id === conv.id ? {
        ...item,
        ...(updated || {}),
        archived_by: normalizedArchivedBy
      } : item));

      if (selectedConversation?.id === conv.id) {
        setSelectedConversation((prev) => prev ? {
          ...prev,
          ...(updated || {}),
          archived_by: normalizedArchivedBy
        } : prev);
      }
    } catch (error) {
      console.error('Failed to unarchive conversation:', error);
    }
    setArchivingConversationId(null);
  };

  const handleBlockConversation = async (conv) => {
    if (!conv?.id || !user?.id) return;
    setBlockingConversationId(conv.id);
    try {
      const blockedBy = getConversationBlockedBy(conv);
      if (!blockedBy.includes(user.id)) {
        const updated = await conversationService.updateConversation(conv.id, {
          blocked_by: [...blockedBy, user.id]
        });
        if (updated) {
          setConversations((prev) => prev.map((item) => item.id === updated.id ? {
            ...item,
            ...updated,
            blocked_by: Array.isArray(updated.blocked_by) ? updated.blocked_by : blockedBy.concat(user.id)
          } : item));
          if (selectedConversation?.id === updated.id) {
            setSelectedConversation({
              ...selectedConversation,
              ...updated,
              blocked_by: Array.isArray(updated.blocked_by) ? updated.blocked_by : blockedBy.concat(user.id)
            });
          }
        }
      }
    } catch (error) {
      console.error('Failed to block conversation:', error);
    }
    setBlockingConversationId(null);
  };

  const handleUnblockConversation = async (conv) => {
    if (!conv?.id || !user?.id) return;
    setBlockingConversationId(conv.id);
    try {
      const blockedBy = getConversationBlockedBy(conv);
      if (!blockedBy.includes(user.id)) return;

      const nextBlockedBy = blockedBy.filter((id) => id !== user.id);
      const updated = await conversationService.updateConversation(conv.id, {
        blocked_by: nextBlockedBy
      });

      const normalizedBlockedBy = Array.isArray(updated?.blocked_by) ? updated.blocked_by : nextBlockedBy;

      setConversations((prev) => prev.map((item) => item.id === conv.id ? {
        ...item,
        ...(updated || {}),
        blocked_by: normalizedBlockedBy
      } : item));

      if (selectedConversation?.id === conv.id) {
        setSelectedConversation((prev) => prev ? {
          ...prev,
          ...(updated || {}),
          blocked_by: normalizedBlockedBy
        } : prev);
      }
    } catch (error) {
      console.error('Failed to unblock conversation:', error);
    }
    setBlockingConversationId(null);
  };

  const handleMessageChange = (e) => {
    const value = e.target.value;
    setNewMessage(value);
    // Save draft to localStorage
    if (selectedConversation?.id) {
      if (value.trim()) {
        localStorage.setItem(`draft_${selectedConversation.id}`, value);
      } else {
        localStorage.removeItem(`draft_${selectedConversation.id}`);
      }
    }
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

  const togglePinConversation = (convId) => {
    setPinnedConversationIds((prev) => {
      const next = prev.includes(convId) ? prev.filter((id) => id !== convId) : [...prev, convId];
      localStorage.setItem('pinnedConversations', JSON.stringify(next));
      return next;
    });
  };

  const handleDeleteMessage = async () => {
    if (!messageToDelete) return;
    try {
      await messageService.deleteMessage(messageToDelete.id);
      setMessages((prev) => prev.filter((m) => m.id !== messageToDelete.id));
    } catch (err) {
      console.error('Error deleting message:', err);
    } finally {
      setMessageToDelete(null);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;
    if (isSelectedConversationReadOnly) return;
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

      const sentMessage = await messageService.sendMessage({
        conversation_id: selectedConversation.id,
        receiver_id: otherParticipantId,
        content: newMessage,
        read: false
      });

      if (sentMessage?.id) {
        setMessages((prev) => mergeMessagesById(prev, [sentMessage], false));
        setShouldAutoScroll(true);
      }

      const normalizedUnreadCount = normalizeUnreadCount(selectedConversation);
      const updatedConversation = await conversationService.updateConversation(selectedConversation.id, {
        last_message: newMessage,
        last_message_date: new Date().toISOString(),
        unread_count: {
          ...normalizedUnreadCount,
          [otherParticipantId]: (normalizedUnreadCount?.[otherParticipantId] || 0) + 1
        }
      });

      if (updatedConversation?.id) {
        updateConversationState(updatedConversation);
      }

      // Send immediate email notification (non-critical)
      try {
        const recipientNotificationsEnabled = NOTIFICATIONS_ENABLED;
        if (recipientNotificationsEnabled) {
          await emailNotificationService.sendMessageNotification({
            recipientId: otherParticipantId,
            senderName: user?.user_metadata?.full_name || user?.email,
            messagePreview: newMessage.substring(0, 100),
            conversationId: selectedConversation.id,
            sourceId: selectedConversation.id,
            idempotencyKey: `conv:${selectedConversation.id}:message:${Date.now()}`,
            language
          });
        }
      } catch (error) {
        console.warn('Email notification failed (non-critical):', error);
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
      if (selectedConversation?.id) {
        localStorage.removeItem(`draft_${selectedConversation.id}`);
      }
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

  const getStageLabel = (stageValue) => {
    if (!DEAL_ROOM_FEATURES_ENABLED && ['nda', 'data_room'].includes(stageValue)) {
      return language === 'fr' ? 'Bientôt disponible' : 'Coming soon';
    }

    const labels = {
      contact: language === 'fr' ? 'Contact' : 'Contact',
      nda: 'NDA',
      data_room: language === 'fr' ? 'Data Room' : 'Data Room',
      loi: 'LOI',
      closing: language === 'fr' ? 'Closing' : 'Closing'
    };
    return labels[stageValue] || stageValue || 'contact';
  };

  const loadConversationEvents = async (conversationId) => {
    if (!conversationId) return;
    try {
      const { data, error } = await supabase
        .from('conversation_events')
        .select('id, event_type, payload, actor_id, created_at')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      const docs = (data || [])
        .filter((evt) => evt.event_type === 'document_shared')
        .map((evt) => ({
          id: evt.id,
          file_name: evt.payload?.document_name || 'Document',
          file_type: 'shared',
          file_size: evt.payload?.file_size || 0,
          uploaded_by: evt.payload?.sender_name || 'Utilisateur',
          requires_nda_signed: true,
          is_signed: Boolean(selectedConversation?.nda_signed),
          signed_at: selectedConversation?.nda_signed_at || null,
          created_at: evt.created_at
        }));

      if (docs.length > 0) {
        setConversationDocuments(docs);
      } else if (selectedConversation?.last_shared_document_name) {
        setConversationDocuments([
          {
            id: `fallback-${conversationId}`,
            file_name: selectedConversation.last_shared_document_name,
            file_type: 'shared',
            file_size: 0,
            uploaded_by: 'Utilisateur',
            requires_nda_signed: true,
            is_signed: Boolean(selectedConversation?.nda_signed),
            signed_at: selectedConversation?.nda_signed_at || null
          }
        ]);
      } else {
        setConversationDocuments([]);
      }
    } catch (error) {
      console.warn('Conversation events unavailable:', error?.message || error);
      if (selectedConversation?.last_shared_document_name) {
        setConversationDocuments([
          {
            id: `fallback-${conversationId}`,
            file_name: selectedConversation.last_shared_document_name,
            file_type: 'shared',
            file_size: 0,
            uploaded_by: 'Utilisateur',
            requires_nda_signed: true,
            is_signed: Boolean(selectedConversation?.nda_signed),
            signed_at: selectedConversation?.nda_signed_at || null
          }
        ]);
      } else {
        setConversationDocuments([]);
      }
    }
  };

  const appendConversationEvent = async (conversationId, eventType, payload = {}) => {
    if (!conversationId || !user?.id) return;
    try {
      await supabase.from('conversation_events').insert({
        conversation_id: conversationId,
        event_type: eventType,
        actor_id: user.id,
        payload
      });
    } catch (error) {
      console.warn('Failed to append conversation event:', error?.message || error);
    }
  };

  const updateConversationState = (updated) => {
    if (!updated?.id) return;
    setSelectedConversation((prev) => (prev?.id === updated.id ? { ...prev, ...updated } : prev));
    setConversations((prev) => prev.map((conv) => (conv.id === updated.id ? { ...conv, ...updated } : conv)));
  };

  const handleDealStageChange = async (nextStage) => {
    if (!DEAL_ROOM_FEATURES_ENABLED) return;
    if (!selectedConversation?.id || !user?.id || dealActionLoading) return;
    const now = Date.now();
    if (now - lastDealActionRef.current < 800) return;
    lastDealActionRef.current = now;
    const previousStage = selectedConversation?.deal_stage || 'contact';
    if (previousStage === nextStage) return;

    setDealActionLoading(true);
    try {
      const updated = await conversationService.updateConversation(selectedConversation.id, {
        deal_stage: nextStage
      });
      const merged = updated || { ...selectedConversation, deal_stage: nextStage };
      updateConversationState(merged);
      await appendConversationEvent(selectedConversation.id, 'deal_stage_changed', {
        previous_stage: previousStage,
        next_stage: nextStage
      });

      const recipientId = getOtherParticipantId(merged);
      if (recipientId && recipientId !== user.id) {
        await emailNotificationService.sendDealStageNotification({
          recipientId,
          dealStage: getStageLabel(nextStage),
          sourceId: selectedConversation.id,
          idempotencyKey: `conv:${selectedConversation.id}:stage:${nextStage}`,
          language
        });
      }
    } catch (error) {
      console.error('Failed to change deal stage:', error);
    }
    setDealActionLoading(false);
  };

  const handleShareDocument = async (presetName = '') => {
    if (!DEAL_ROOM_FEATURES_ENABLED) return;
    if (!selectedConversation?.id || !user?.id || dealActionLoading) return;
    const defaultName = presetName || (language === 'fr' ? 'Document partage' : 'Shared document');
    const enteredName = window.prompt(
      language === 'fr' ? 'Nom du document a partager' : 'Document name to share',
      defaultName
    );
    const documentName = enteredName?.trim();
    if (!documentName) return;

    setDealActionLoading(true);
    try {
      const updated = await conversationService.updateConversation(selectedConversation.id, {
        last_shared_document_name: documentName
      });
      const merged = updated || {
        ...selectedConversation,
        last_shared_document_name: documentName
      };
      updateConversationState(merged);
      const senderName = user?.user_metadata?.full_name || user?.email || 'Utilisateur';
      await appendConversationEvent(selectedConversation.id, 'document_shared', {
        document_name: documentName,
        sender_name: senderName
      });
      setConversationDocuments((prev) => [
        {
          id: `local-${Date.now()}`,
          file_name: documentName,
          file_type: 'shared',
          file_size: 0,
          uploaded_by: senderName,
          requires_nda_signed: true,
          is_signed: Boolean(merged.nda_signed),
          signed_at: merged.nda_signed_at || null
        },
        ...prev
      ]);

      const recipientId = getOtherParticipantId(merged);
      if (recipientId && recipientId !== user.id) {
        await emailNotificationService.sendDocumentSharedNotification({
          recipientId,
          senderName,
          documentName,
          sourceId: selectedConversation.id,
          idempotencyKey: `conv:${selectedConversation.id}:doc:${Date.now()}`,
          language
        });
      }
    } catch (error) {
      console.error('Failed to share document:', error);
    }
    setDealActionLoading(false);
  };

  const handleSignNDA = async () => {
    if (!DEAL_ROOM_FEATURES_ENABLED) return;
    if (!selectedConversation?.id || !user?.id || dealActionLoading) return;
    setDealActionLoading(true);
    try {
      const signedAt = new Date().toISOString();
      const updated = await conversationService.updateConversation(selectedConversation.id, {
        nda_signed: true,
        nda_signed_at: signedAt
      });
      const merged = updated || {
        ...selectedConversation,
        nda_signed: true,
        nda_signed_at: signedAt
      };
      updateConversationState(merged);

      const signerName = user?.user_metadata?.full_name || user?.email || 'Utilisateur';
      await appendConversationEvent(selectedConversation.id, 'nda_signed', {
        signer_name: signerName,
        signed_at: signedAt
      });

      const recipientId = getOtherParticipantId(merged);
      if (recipientId && recipientId !== user.id) {
        await emailNotificationService.sendNDASignedNotification({
          recipientId,
          signerName,
          sourceId: selectedConversation.id,
          idempotencyKey: `conv:${selectedConversation.id}:nda:signed`,
          language
        });
      }
    } catch (error) {
      console.error('Failed to sign NDA:', error);
    }
    setDealActionLoading(false);
  };

  const handleDealActionClick = async (actionId) => {
    if (!DEAL_ROOM_FEATURES_ENABLED) return;
    if (actionId === 'sign_nda') {
      await handleSignNDA();
      return;
    }
    if (actionId === 'share_documents') {
      await handleShareDocument();
    }
  };

  const handleSubscribeFeatureAlert = async () => {
    if (featureAlertLoading) return;
    setFeatureAlertLoading(true);
    setFeatureAlertMessage('');
    try {
      const response = await featureAlertService.subscribeToNdaDataroomAlert({ language });
      const status = response?.status === 'already_subscribed' ? 'already' : 'success';
      setFeatureAlertStatus(status);
      setFeatureAlertMessage(
        response?.message ||
          (status === 'already'
            ? (language === 'fr' ? 'Vous êtes déjà inscrit à cette alerte.' : 'You are already subscribed to this alert.')
            : (language === 'fr'
              ? 'Vous recevrez une alerte dès activation de NDA & Data Room.'
              : 'You will be notified as soon as NDA & Data Room are available.'))
      );
    } catch (error) {
      console.error('Feature alert subscription failed:', error);
      setFeatureAlertStatus('error');
      setFeatureAlertMessage('');
    }
    setFeatureAlertLoading(false);
  };

  const handleDocumentDownload = (documentId) => {
    const doc = conversationDocuments.find((item) => item.id === documentId);
    if (!doc) return;
    alert(
      language === 'fr'
        ? `Aucun fichier physique lie a \"${doc.file_name}\" (mode MVP).`
        : `No physical file is attached to \"${doc.file_name}\" (MVP mode).`
    );
  };

  const handleDocumentDelete = (documentId) => {
    setConversationDocuments((prev) => prev.filter((doc) => doc.id !== documentId));
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

  const getParticipantProfile = (participantId) => {
    if (!participantId) return null;
    return participantProfiles?.[participantId] || null;
  };

  const isParticipantAnonymous = (participantId) => {
    const profile = getParticipantProfile(participantId);
    return profile?.show_real_identity === false;
  };

  const getConversationLogoUrl = (conv) => {
    if (!conv?.business_id) return null;
    return conversationBusinessLogos?.[conv.business_id] || null;
  };

  const getNextStepLabel = (conv) => {
    if (!conv) return '-';
    if (conv.contact_status === 'pending') {
      return language === 'fr' ? 'Accepter la discussion' : 'Accept conversation';
    }

    const stage = conv.deal_stage || 'contact';
    if (!DEAL_ROOM_FEATURES_ENABLED && ['contact', 'nda', 'data_room'].includes(stage)) {
      return language === 'fr' ? 'Bientôt disponible' : 'Coming soon';
    }

    const stageToNext = {
      contact: language === 'fr' ? 'Passer NDA' : 'Move to NDA',
      nda: language === 'fr' ? 'Signer NDA' : 'Sign NDA',
      data_room: language === 'fr' ? 'Partager documents' : 'Share documents',
      loi: language === 'fr' ? 'Finaliser LOI' : 'Finalize LOI',
      closing: language === 'fr' ? 'Clôture en cours' : 'Closing in progress'
    };

    return stageToNext[stage] || '-';
  };

  const getParticipantLabel = (participantId) => {
    const profile = getParticipantProfile(participantId);
    if (!profile) return language === 'fr' ? 'Contact inconnu' : 'Unknown contact';
    if (profile.show_real_identity === false) {
      return language === 'fr' ? 'Utilisateur anonyme' : 'Anonymous user';
    }
    if (profile.full_name) return profile.full_name;
    const firstName = profile.first_name || '';
    const lastName = profile.last_name || '';
    const fullName = `${firstName} ${lastName}`.trim();
    return fullName || profile.email || (language === 'fr' ? 'Contact inconnu' : 'Unknown contact');
  };

  const getParticipantFullName = (participantId) => {
    const profile = getParticipantProfile(participantId);
    if (!profile) return '';
    if (profile.show_real_identity === false) return '';
    const firstName = profile.first_name || '';
    const lastName = profile.last_name || '';
    return `${firstName} ${lastName}`.trim();
  };

  const getParticipantCompany = (participantId) => {
    const profile = getParticipantProfile(participantId);
    if (profile?.show_real_identity === false) return '';
    return profile?.company_name || '';
  };

  const getAvatarProps = (participantId, conv = null) => {
    const profile = getParticipantProfile(participantId);
    const isAnonymous = isParticipantAnonymous(participantId);
    const logoUrl = isAnonymous
      ? ''
      : (profile?.logo_url || getConversationLogoUrl(conv) || '');

    return {
      isAnonymous,
      logoUrl,
      firstName: profile?.first_name || '',
      lastName: profile?.last_name || '',
      name: getParticipantLabel(participantId),
      email: profile?.email || (participantId === user?.id ? user?.email : '')
    };
  };

  const filteredConversations = useMemo(() => {
    const filtered = conversations.filter((conv) => {
      const otherId = getOtherParticipantId(conv);
      if (otherId === HIDDEN_CONTACT_ID) return false;
      const title = getConversationTitle(conv).toLowerCase();
      const otherLabel = getParticipantLabel(otherId).toLowerCase();
      const query = searchQuery.toLowerCase();
      const matchesSearch = title.includes(query) || otherLabel.includes(query);
      if (!matchesSearch) return false;
      if (conversationFilter === 'archived') {
        return isConversationArchived(conv);
      }
      if (isConversationArchived(conv)) return false;
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
    // Sort pinned conversations to the top
    return filtered.sort((a, b) => {
      const aPinned = pinnedConversationIds.includes(a.id);
      const bPinned = pinnedConversationIds.includes(b.id);
      if (aPinned && !bPinned) return -1;
      if (!aPinned && bPinned) return 1;
      return 0;
    });
  }, [conversations, searchQuery, conversationFilter, user?.id, participantProfiles, language, pinnedConversationIds]);

  const filteredMessages = useMemo(() => {
    if (!messageSearchQuery.trim()) return messages;
    const q = messageSearchQuery.toLowerCase();
    return messages.filter((msg) => (msg.content || '').toLowerCase().includes(q));
  }, [messages, messageSearchQuery]);

  const inboxStats = useMemo(() => {
    return conversations.reduce(
      (acc, conv) => {
        const unread = conv.unread_count?.[user?.id] || 0;
        const archivedBy = Array.isArray(conv.archived_by) ? conv.archived_by : [];
        if (unread > 0) acc.unread += unread;
        if (conv.contact_status === 'pending') acc.pending += 1;
        if (archivedBy.includes(user?.id)) acc.archived += 1;
        return acc;
      },
      { unread: 0, pending: 0, archived: 0 }
    );
  }, [conversations, user?.id]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.localStorage.getItem('debugMessagingUx') !== '1') return;

    const pendingForSeller =
      selectedConversation?.contact_status !== 'accepted' &&
      selectedConversation?.participant_2_id === user?.id;

    console.debug('[MessagingUX:state]', {
      screen: showInbox ? 'inbox' : 'conversation',
      selectedConversationId: selectedConversation?.id || null,
      messagesCount: messages.length,
      conversationsCount: conversations.length,
      filter: conversationFilter,
      pendingForSeller,
      dealStage: selectedConversation?.deal_stage || 'contact',
      inboxStats
    });
  }, [
    showInbox,
    selectedConversation?.id,
    selectedConversation?.contact_status,
    selectedConversation?.deal_stage,
    selectedConversation?.participant_2_id,
    user?.id,
    messages.length,
    conversations.length,
    conversationFilter,
    inboxStats
  ]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.localStorage.getItem('debugMessagingUx') !== '1') return;

    const inputBar = document.querySelector('[data-messages-input]');
    const footer = document.querySelector('footer');
    const main = document.querySelector('main');

    if (!inputBar || !footer || !main) return;

    const inputRect = inputBar.getBoundingClientRect();
    const footerRect = footer.getBoundingClientRect();
    const mainRect = main.getBoundingClientRect();
    const computedGap = Math.max(0, Math.round(footerRect.top - inputRect.bottom));

    console.debug('[MessagingUX:layout-gap]', {
      gapPx: computedGap,
      inputBottom: Math.round(inputRect.bottom),
      footerTop: Math.round(footerRect.top),
      mainHeight: Math.round(mainRect.height),
      viewportHeight: window.innerHeight,
      showInbox,
      isConversationView: Boolean(selectedConversation) && !showInbox
    });
  }, [showInbox, selectedConversation?.id, messages.length, sending]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.localStorage.getItem('debugMessagingUx') !== '1') return;
    const conversationView = Boolean(selectedConversation) && !showInbox;
    if (!conversationView) return;

    const conversationRow = document.querySelector('[data-messages-conversation-row]');
    const inputBar = document.querySelector('[data-messages-input]');
    const sidePanel = document.querySelector('[data-messages-sidepanel]');

    if (!conversationRow || !inputBar) return;

    const rowRect = conversationRow.getBoundingClientRect();
    const inputRect = inputBar.getBoundingClientRect();
    const sideRect = sidePanel?.getBoundingClientRect();

    const overlapsSidePanel = Boolean(
      sideRect &&
      inputRect.left < sideRect.right &&
      inputRect.right > sideRect.left &&
      inputRect.top < sideRect.bottom &&
      inputRect.bottom > sideRect.top
    );

    console.debug('[MessagingUX:conversation-layout]', {
      dealRoomEnabled: DEAL_ROOM_FEATURES_ENABLED,
      selectedConversationId: selectedConversation?.id || null,
      dealStage: selectedConversation?.deal_stage || 'contact',
      ndaSigned: Boolean(selectedConversation?.nda_signed),
      rowBottom: Math.round(rowRect.bottom),
      inputTop: Math.round(inputRect.top),
      inputBottom: Math.round(inputRect.bottom),
      sidePanelTop: sideRect ? Math.round(sideRect.top) : null,
      sidePanelBottom: sideRect ? Math.round(sideRect.bottom) : null,
      overlapsSidePanel,
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight
    });
  }, [
    showInbox,
    selectedConversation?.id,
    selectedConversation?.deal_stage,
    selectedConversation?.nda_signed,
    messages.length,
    sending
  ]);

  if (loading) {
    return (
      <div className="flex items-center justify-center">
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
  const isSelectedConversationReadOnly = isConversationReadOnly(selectedConversation);
  const isSelectedConversationBlockedByCurrentUser = isConversationBlockedByCurrentUser(selectedConversation);
  const selectedOtherParticipantId = getOtherParticipantId(selectedConversation);

  if (isConversationView && getOtherParticipantId(selectedConversation) === HIDDEN_CONTACT_ID) {
    return (
      <div className="flex items-center justify-center">
        <div className="text-center text-muted-foreground">
          {language === 'fr' ? 'Conversation indisponible.' : 'Conversation unavailable.'}
        </div>
      </div>
    );
  }

  const connectionBanner = (!isOnline || showReconnected) ? (
    <AnimatePresence>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 'auto', opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        className={`flex items-center justify-center gap-2 py-2 text-xs font-medium ${
          !isOnline
            ? 'bg-red-50 text-red-600 border-b border-red-200'
            : 'bg-green-50 text-green-600 border-b border-green-200'
        }`}
      >
        {!isOnline ? (
          <>
            <WifiOff className="w-3.5 h-3.5" />
            {language === 'fr' ? 'Connexion perdue...' : 'Connection lost...'}
          </>
        ) : (
          <>
            <Wifi className="w-3.5 h-3.5" />
            {language === 'fr' ? 'Reconnecté' : 'Reconnected'}
          </>
        )}
      </motion.div>
    </AnimatePresence>
  ) : null;

  if (isConversationView) {
    return (
      <div className="h-full min-h-0 w-full min-w-0 flex bg-background overflow-hidden">
        <div className="flex-1 min-h-0 flex flex-col bg-background">
          {connectionBanner}
          {/* Chat Header */}
          <div className="bg-card border-b border-border px-4 py-3 sm:p-4 flex items-center gap-3 sm:gap-4 sticky top-0 z-10">
            <button
              onClick={() => {
                closeConversation();
              }}
              className="p-2 -ml-2 hover:bg-gray-100 rounded-lg"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <ConversationAvatar
              {...getAvatarProps(selectedOtherParticipantId, selectedConversation)}
              size="md"
              showBorder={false}
              language={language === 'fr' ? 'fr' : 'en'}
            />
            <div className="flex-1 min-w-0">
              <Link
                to={createBusinessDetailsUrl(selectedBusiness || { id: selectedConversation.business_id, title: getConversationTitle(selectedConversation) })}
                className="font-heading font-semibold text-foreground hover:text-primary transition-colors truncate block"
              >
                {getConversationTitle(selectedConversation)}
              </Link>
              <p className="text-sm text-muted-foreground truncate">
                {shouldShowProfile
                  ? [
                    getParticipantLabel(getOtherParticipantId(selectedConversation)),
                    getParticipantCompany(getOtherParticipantId(selectedConversation))
                  ].filter(Boolean).join(' • ')
                  : (language === 'fr' ? 'Profil en attente d’acceptation' : 'Profile awaiting acceptance')}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {showMessageSearch ? (
                <div className="flex items-center gap-1.5">
                  <Input
                    value={messageSearchQuery}
                    onChange={(e) => setMessageSearchQuery(e.target.value)}
                    placeholder={language === 'fr' ? 'Rechercher...' : 'Search...'}
                    className="h-8 w-40 sm:w-52 text-sm"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => { setShowMessageSearch(false); setMessageSearchQuery(''); }}
                    className="p-1.5 hover:bg-muted rounded-md"
                  >
                    <span className="sr-only">Close</span>
                    <svg className="w-4 h-4 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowMessageSearch(true)}
                  className="p-2 hover:bg-muted rounded-lg transition-colors"
                  title={language === 'fr' ? 'Rechercher dans les messages' : 'Search messages'}
                >
                  <Search className="w-4 h-4 text-muted-foreground" />
                </button>
              )}
              {isSelectedConversationReadOnly ? (
                isSelectedConversationBlockedByCurrentUser ? (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={blockingConversationId === selectedConversation?.id}
                    onClick={() => handleUnblockConversation(selectedConversation)}
                    className="text-green-700 border-green-200 hover:bg-green-50"
                  >
                    {language === 'fr' ? 'Débloquer' : 'Unblock'}
                  </Button>
                ) : (
                  <Badge variant="secondary" className="text-xs">
                    {language === 'fr' ? 'Conversation bloquée' : 'Conversation blocked'}
                  </Badge>
                )
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={blockingConversationId === selectedConversation?.id}
                  onClick={() => handleBlockConversation(selectedConversation)}
                  className="text-red-600 border-red-200 hover:bg-red-50"
                >
                  {language === 'fr' ? 'Bloquer' : 'Block'}
                </Button>
              )}
            </div>
          </div>

          {isSelectedConversationReadOnly && (
            <div className="bg-red-50 border-b border-red-100 px-4 py-3">
              <p className="text-sm text-red-600">
                {isSelectedConversationBlockedByCurrentUser
                  ? (language === 'fr'
                    ? 'Vous avez bloqué cet expéditeur. Vous pouvez lire les messages et le débloquer à tout moment pour reprendre la discussion.'
                    : 'You blocked this contact. Conversation is read-only. Unblock to re-enable messaging.')
                  : (language === 'fr'
                    ? 'Ce contact vous a bloqué. Conversation en lecture seule jusqu’au déblocage.'
                    : 'This contact blocked you. Conversation is read-only until unblocked.')}
              </p>
            </div>
          )}

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
          <div data-messages-conversation-row className="flex-1 min-h-0 flex overflow-hidden">
            <div className="flex-1 min-h-0 min-w-0 flex flex-col bg-background">
            <ScrollArea className="flex-1 min-h-0 px-4 py-4 sm:p-4 bg-background">
              <div className="max-w-5xl w-full mx-auto space-y-4 sm:space-y-5">
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
              {filteredMessages.length === 0 && (
                <div className="text-center text-sm text-muted-foreground py-10">
                  {messageSearchQuery.trim()
                    ? (language === 'fr' ? 'Aucun message trouvé.' : 'No messages found.')
                    : (language === 'fr' ? 'Aucun message pour le moment.' : 'No messages yet.')}
                </div>
              )}
              {messageSearchQuery.trim() && filteredMessages.length > 0 && (
                <div className="text-center text-xs text-muted-foreground py-1.5">
                  {filteredMessages.length} {language === 'fr' ? 'résultat(s)' : 'result(s)'}
                </div>
              )}
              <AnimatePresence initial={false}>
                {filteredMessages.map((msg) => {
                  const isOwn = msg.sender_id === user?.id;
                  const senderId = msg.sender_id;
                  const senderLabel = shouldShowProfile ? getParticipantLabel(senderId) : (language === 'fr' ? 'Utilisateur' : 'User');
                  
                  return (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 20, scale: 0.8 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ type: "spring", stiffness: 100 }}
                      className={`flex gap-2 sm:gap-3 group ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}
                    >
                      {/* Avatar */}
                      <motion.div 
                        className="flex-shrink-0 mt-1"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ConversationAvatar
                          {...getAvatarProps(senderId, selectedConversation)}
                          size="md"
                          showBorder={false}
                          language={language === 'fr' ? 'fr' : 'en'}
                          className="group-hover:shadow-lg"
                        />
                      </motion.div>

                      <div className={`max-w-[78%] sm:max-w-[70%]`}>
                        <div className="relative">
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            transition={{ duration: 0.2 }}
                            className={`rounded-2xl px-3 py-2 sm:px-4 sm:py-3 cursor-pointer text-sm sm:text-base ${
                              isOwn
                                ? 'bg-primary text-white rounded-br-md'
                                : 'bg-card text-foreground shadow-sm rounded-bl-md'
                            }`}
                          >
                            <p className="whitespace-pre-wrap">{msg.content}</p>
                          </motion.div>
                          {isOwn && (
                            <button
                              type="button"
                              onClick={() => setMessageToDelete(msg)}
                              className={`absolute top-1 ${isOwn ? '-left-8' : '-right-8'} opacity-0 group-hover:opacity-100 p-1 rounded-md hover:bg-red-50 text-muted-foreground hover:text-red-500 transition-all`}
                              title={language === 'fr' ? 'Supprimer' : 'Delete'}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                        <div className={`flex items-center gap-1 mt-1 text-[11px] sm:text-xs text-muted-foreground ${isOwn ? 'justify-end' : 'justify-start'}`}>
                          <span>{formatMessageTime(msg.created_at)}</span>
                          {isOwn && (
                            msg.read ? (
                              <>
                                <CheckCheck className="w-4 h-4 text-primary" />
                                {msg.updated_at && msg.updated_at !== msg.created_at && (
                                  <span className="text-primary/70">
                                    {language === 'fr' ? 'Vu' : 'Seen'} {format(new Date(msg.updated_at), 'HH:mm')}
                                  </span>
                                )}
                              </>
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
                      <ConversationAvatar
                        {...getAvatarProps(selectedOtherParticipantId, selectedConversation)}
                        size="md"
                        showBorder={false}
                        language={language === 'fr' ? 'fr' : 'en'}
                      />
                    </div>
                    <div>
                      <motion.div
                        animate={{ scale: [0.95, 1.05, 0.95] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="bg-muted text-muted-foreground rounded-2xl rounded-bl-md px-3 py-2 sm:px-4 sm:py-3 flex gap-2 text-xs sm:text-sm"
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

            <div data-messages-input className="bg-card border-t border-border px-4 py-3 sm:p-4">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  sendMessage();
                }}
                className="max-w-5xl mx-auto flex gap-3"
              >
                <div className="flex-1">
                  <Input
                    value={newMessage}
                    onChange={handleMessageChange}
                    placeholder={t('type_message')}
                    className="flex-1"
                    disabled={sending || isSelectedConversationReadOnly || (!isConversationAccepted && selectedConversation?.participant_2_id === user?.id)}
                  />
                  <div className="flex items-center justify-between mt-1 text-[11px] sm:text-xs text-muted-foreground">
                    <span className={newMessage.length > 1900 ? 'text-red-500 font-medium' : ''}>
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
                    <div className="text-[11px] sm:text-xs text-red-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {sendError}
                    </div>
                  )}
                </div>
                <Button
                  type="submit"
                  disabled={!newMessage.trim() || sending || !!messageError || isSelectedConversationReadOnly || (!isConversationAccepted && selectedConversation?.participant_2_id === user?.id)}
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

            {/* Business Panel */}
            <div data-messages-sidepanel className="hidden lg:block w-80 min-h-0 overflow-y-auto border-l border-border bg-card p-4">
              <div className="space-y-4 pb-6">
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
                      {getParticipantCompany(getOtherParticipantId(selectedConversation)) && (
                        <p>{getParticipantCompany(getOtherParticipantId(selectedConversation))}</p>
                      )}
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

                <div className="border-t border-border pt-3 space-y-3">
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">
                    {language === 'fr' ? 'Avancement du dossier' : 'Deal progress'}
                  </p>
                  {!DEAL_ROOM_FEATURES_ENABLED ? (
                    <div className="rounded-xl border border-primary/20 bg-primary-light p-4 space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 text-primary">
                          <BellRing className="w-4 h-4" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-semibold text-foreground">
                            {language === 'fr' ? 'NDA & Data Room bientôt disponibles' : 'NDA & Data Room coming soon'}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {language === 'fr'
                              ? 'Ces options ne sont pas encore actives. Activez une alerte pour être prévenu dès leur disponibilité.'
                              : 'These options are not active yet. Enable an alert to be notified as soon as they are available.'}
                          </p>
                        </div>
                      </div>

                      <Button
                        type="button"
                        variant="outline"
                        className="w-full h-auto min-h-10 whitespace-normal break-words text-center leading-snug px-3 py-2 border-primary/30 text-primary hover:bg-primary-light hover:text-black"
                        disabled={featureAlertLoading || featureAlertStatus === 'success' || featureAlertStatus === 'already'}
                        onClick={handleSubscribeFeatureAlert}
                      >
                        {featureAlertLoading
                          ? (language === 'fr' ? 'Inscription...' : 'Subscribing...')
                          : featureAlertStatus === 'success'
                            ? (language === 'fr' ? 'Alerte activée' : 'Alert enabled')
                            : featureAlertStatus === 'already'
                              ? (language === 'fr' ? 'Déjà inscrit' : 'Already subscribed')
                              : (language === 'fr'
                                ? 'Recevoir une alerte quand NDA & Data Room seront disponibles'
                                : 'Get an alert when both features are available')}
                      </Button>

                      {featureAlertMessage && (
                        <p className={`text-xs ${featureAlertStatus === 'error' ? 'text-destructive' : 'text-foreground'}`}>
                          {featureAlertMessage}
                        </p>
                      )}
                    </div>
                  ) : (
                    <>
                      <DealStageManager
                        currentStage={selectedConversation?.deal_stage || 'contact'}
                        onStageChange={handleDealStageChange}
                        onActionClick={handleDealActionClick}
                        language={language === 'fr' ? 'fr' : 'en'}
                        isBuyer={selectedConversation?.participant_1_id === user?.id}
                        isFeatureEnabled
                      />
                      {dealActionLoading && (
                        <p className="text-xs text-muted-foreground">
                          {language === 'fr' ? 'Mise a jour en cours...' : 'Updating...'}
                        </p>
                      )}

                      <div className="border-t border-border pt-3 space-y-3">
                        <p className="text-xs uppercase tracking-widest text-muted-foreground">
                          {language === 'fr' ? 'Documents (MVP)' : 'Documents (MVP)'}
                        </p>
                        <DocumentVault
                          documents={conversationDocuments}
                          currentStage={selectedConversation?.deal_stage || 'contact'}
                          onDownload={handleDocumentDownload}
                          onDelete={handleDocumentDelete}
                          onShare={() => handleShareDocument()}
                          language={language === 'fr' ? 'fr' : 'en'}
                          isSeller={selectedConversation?.participant_2_id === user?.id}
                          isNDASigned={Boolean(selectedConversation?.nda_signed)}
                          isFeatureEnabled
                        />
                      </div>
                    </>
                  )}
                </div>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    if (selectedConversation?.business_id) {
                      navigate(createBusinessDetailsUrl(selectedBusiness || { id: selectedConversation.business_id, title: getConversationTitle(selectedConversation) }));
                    }
                  }}
                >
                  {language === 'fr' ? 'Voir annonce complète' : 'View full listing'}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Delete message confirmation */}
        <AlertDialog open={!!messageToDelete} onOpenChange={(open) => { if (!open) setMessageToDelete(null); }}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {language === 'fr' ? 'Supprimer ce message ?' : 'Delete this message?'}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {language === 'fr'
                  ? 'Cette action est irréversible. Le message sera définitivement supprimé.'
                  : 'This action cannot be undone. The message will be permanently deleted.'}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>
                {language === 'fr' ? 'Annuler' : 'Cancel'}
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteMessage}
                className="bg-red-500 hover:bg-red-600 text-white"
              >
                {language === 'fr' ? 'Supprimer' : 'Delete'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    );
  }

  return (
    <div className="h-full min-h-0 w-full min-w-0 flex flex-col bg-background overflow-hidden">
      {connectionBanner}
      {/* Conversations List */}
      <div className="w-full min-w-0 bg-card border-r border-border flex flex-col min-h-0 flex-1">
        <div className="px-4 sm:px-6 py-5 border-b border-border bg-card">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="font-heading text-2xl font-bold text-foreground">
                Messages
              </h1>
              <p className="text-sm text-muted-foreground">
                {filteredConversations.length}/{conversations.length} {language === 'fr' ? 'prises de contact' : 'contacts'}
              </p>
            </div>
            <div className="relative w-full sm:max-w-[260px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={language === 'fr' ? 'Rechercher...' : 'Search...'}
                className="pl-10 bg-background"
              />
            </div>
          </div>
          <div className="flex items-center gap-3 sm:gap-6 mt-4 text-sm font-medium overflow-x-auto pb-1">
            {['all', 'unread', 'pending', 'archived'].map((filterKey) => (
              <button
                key={filterKey}
                type="button"
                onClick={() => setConversationFilter(filterKey)}
                className={`pb-2 border-b-2 transition whitespace-nowrap ${
                  conversationFilter === filterKey
                    ? 'border-primary text-foreground'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                {language === 'fr'
                  ? ({ all: 'Tous les messages', unread: 'Non lus', pending: 'En attente', archived: 'Archivés' }[filterKey])
                  : ({ all: 'All messages', unread: 'Unread', pending: 'Pending', archived: 'Archived' }[filterKey])}
              </button>
            ))}
          </div>
        </div>

        <ScrollArea className="flex-1 bg-background min-w-0 min-h-0 pb-96">
          {filteredConversations.length === 0 ? (
            <div className="p-10 text-center max-w-md mx-auto">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-8 h-8 text-primary" />
              </div>
              {conversations.length === 0 ? (
                <>
                  <h3 className="font-heading text-lg font-semibold text-foreground mb-2">
                    {language === 'fr' ? 'Aucune conversation' : 'No conversations yet'}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    {language === 'fr'
                      ? 'Parcourez les annonces et contactez un vendeur ou un acquéreur pour démarrer une conversation.'
                      : 'Browse listings and contact a seller or buyer to start a conversation.'}
                  </p>
                  <Button
                    onClick={() => navigate(createPageUrl('Annonces'))}
                    className="text-white font-semibold"
                    style={{ background: 'var(--gradient-coral)' }}
                  >
                    {language === 'fr' ? 'Voir les annonces' : 'Browse listings'}
                  </Button>
                </>
              ) : (
                <>
                  <h3 className="font-heading text-lg font-semibold text-foreground mb-2">
                    {language === 'fr' ? 'Aucun résultat' : 'No results'}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {language === 'fr'
                      ? 'Aucune conversation ne correspond à votre recherche ou filtre actuel.'
                      : 'No conversations match your current search or filter.'}
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => { setSearchQuery(''); setConversationFilter('all'); }}
                  >
                    {language === 'fr' ? 'Réinitialiser les filtres' : 'Reset filters'}
                  </Button>
                </>
              )}
            </div>
          ) : (
            <div className="divide-y divide-border">
              <div className="hidden lg:block overflow-x-auto">
                <div className="min-w-[1200px] grid grid-cols-[110px_170px_190px_1fr_100px_140px_80px_90px_120px] gap-3 px-4 xl:px-6 py-3 text-[11px] uppercase tracking-widest text-muted-foreground">
                  <span>{language === 'fr' ? 'Date' : 'Date'}</span>
                  <span>{language === 'fr' ? 'Demandeur' : 'Requester'}</span>
                  <span>{language === 'fr' ? 'Sujet' : 'Subject'}</span>
                  <span>{language === 'fr' ? "Titre de l’annonce" : 'Listing'}</span>
                  <span>{language === 'fr' ? 'Type' : 'Type'}</span>
                  <span>{language === 'fr' ? 'Étape' : 'Stage'}</span>
                  <span className="text-center">{language === 'fr' ? 'Non lus' : 'Unread'}</span>
                  <span className="text-center">{language === 'fr' ? 'Répondu' : 'Replied'}</span>
                  <span className="text-center">{language === 'fr' ? 'Actions' : 'Actions'}</span>
                </div>
              </div>
              {filteredConversations.map((conv) => {
                const isActive = selectedConversation?.id === conv.id;
                const unread = conv.unread_count?.[user?.id] || 0;
                const otherParticipantId = getOtherParticipantId(conv);
                const otherLabel = getParticipantLabel(otherParticipantId);
                const requesterName = getParticipantFullName(otherParticipantId) || otherLabel;
                const requesterCompany = getParticipantCompany(otherParticipantId);
                const statusLabel = conv.contact_status === 'pending'
                  ? (language === 'fr' ? 'En attente' : 'Pending')
                  : '';
                const replied = unread === 0 && Boolean(conv.last_message);
                const hasDraft = !!localStorage.getItem(`draft_${conv.id}`);
                const subjectPreview = conv.last_message || (language === 'fr' ? 'Nouveau message' : 'New message');
                const businessTitle = conv.business_title || conv.subject || (language === 'fr' ? 'Annonce' : 'Listing');
                const typeLabel = conv.business_type === 'acquisition'
                  ? (language === 'fr' ? 'Acquisition' : 'Acquisition')
                  : (language === 'fr' ? 'Cession' : 'Sale');
                const statusTone = 'bg-warning/10 text-warning';
                const stageLabel = getStageLabel(conv.deal_stage || 'contact');
                const nextStepLabel = getNextStepLabel(conv);
                
                return (
                  <button
                    key={conv.id}
                    onClick={() => openConversation(conv)}
                    className={`w-full text-left transition-colors group ${
                      isActive ? 'bg-primary/10' : 'hover:bg-muted/40'
                    }`}
                  >
                    <div className="lg:hidden px-4 sm:px-6 py-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <ConversationAvatar
                            {...getAvatarProps(otherParticipantId, conv)}
                            size="md"
                            language={language === 'fr' ? 'fr' : 'en'}
                          />
                          <div className="min-w-0">
                            <p className="font-semibold text-foreground truncate">{requesterName}</p>
                            {requesterCompany && (
                              <p className="text-xs text-muted-foreground truncate">{requesterCompany}</p>
                            )}
                            <p className="text-xs text-muted-foreground truncate">
                              {hasDraft && <span className="text-primary font-medium">{language === 'fr' ? 'Brouillon : ' : 'Draft: '}</span>}
                              {subjectPreview}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <span className="text-xs text-muted-foreground">
                            {formatConversationDate(conv.last_message_date || conv.updated_at)}
                          </span>
                          {unread > 0 && (
                            <Badge className="bg-primary text-white text-xs">{unread}</Badge>
                          )}
                        </div>
                      </div>
                      <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground gap-2">
                        <span className="truncate max-w-[55%]">{businessTitle}</span>
                        <div className="flex items-center gap-2">
                          {pinnedConversationIds.includes(conv.id) && (
                            <Pin className="w-3 h-3 text-primary" />
                          )}
                          {statusLabel && (
                            <span className={`px-2 py-1 rounded-full text-[10px] ${statusTone}`}>
                              {statusLabel}
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); togglePinConversation(conv.id); }}
                            className="p-1 rounded hover:bg-muted transition-colors"
                            title={pinnedConversationIds.includes(conv.id) ? (language === 'fr' ? 'Désépingler' : 'Unpin') : (language === 'fr' ? 'Épingler' : 'Pin')}
                          >
                            {pinnedConversationIds.includes(conv.id)
                              ? <PinOff className="w-3.5 h-3.5 text-primary" />
                              : <Pin className="w-3.5 h-3.5 text-muted-foreground" />}
                          </button>
                          {conversationFilter === 'archived' && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              disabled={archivingConversationId === conv.id}
                              onClick={(event) => {
                                event.stopPropagation();
                                handleUnarchiveConversation(conv);
                              }}
                              className="h-7 px-2 text-[11px]"
                            >
                              {language === 'fr' ? 'Désarchiver' : 'Unarchive'}
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="hidden lg:block overflow-x-auto">
                      <div className="min-w-[1200px] grid grid-cols-[110px_170px_190px_1fr_100px_140px_80px_90px_120px] gap-3 items-center px-4 xl:px-6 py-4">
                        <span className="text-sm text-muted-foreground">
                          {formatConversationDate(conv.last_message_date || conv.updated_at)}
                        </span>
                        <div className="flex items-center gap-2">
                          <ConversationAvatar
                            {...getAvatarProps(otherParticipantId, conv)}
                            size="sm"
                            language={language === 'fr' ? 'fr' : 'en'}
                          />
                          <div className="min-w-0">
                            <span className="text-sm font-medium text-foreground truncate block">{requesterName}</span>
                            {requesterCompany && (
                              <span className="text-xs text-muted-foreground truncate block">{requesterCompany}</span>
                            )}
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground truncate">{subjectPreview}</p>
                          {statusLabel && (
                            <span className={`text-xs px-2 py-1 rounded-full ${statusTone}`}>
                              {statusLabel}
                            </span>
                          )}
                        </div>
                        <span className="text-sm text-muted-foreground truncate">{businessTitle}</span>
                        <Badge variant="secondary" className="text-xs w-fit">
                          {typeLabel}
                        </Badge>
                        <div>
                          <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-medium inline-block">
                            {stageLabel}
                          </span>
                          <p className="text-[11px] text-muted-foreground mt-1 truncate">{nextStepLabel}</p>
                        </div>
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
                        <div className="flex justify-center gap-1">
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); togglePinConversation(conv.id); }}
                            className={`p-1.5 rounded-md transition-colors ${pinnedConversationIds.includes(conv.id) ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:bg-muted'}`}
                            title={pinnedConversationIds.includes(conv.id) ? (language === 'fr' ? 'Désépingler' : 'Unpin') : (language === 'fr' ? 'Épingler' : 'Pin')}
                          >
                            {pinnedConversationIds.includes(conv.id)
                              ? <PinOff className="w-3.5 h-3.5" />
                              : <Pin className="w-3.5 h-3.5" />}
                          </button>
                          {conversationFilter === 'archived' ? (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              disabled={archivingConversationId === conv.id}
                              onClick={(event) => {
                                event.stopPropagation();
                                handleUnarchiveConversation(conv);
                              }}
                            >
                              {language === 'fr' ? 'Désarchiver' : 'Unarchive'}
                            </Button>
                          ) : (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              disabled={archivingConversationId === conv.id}
                              onClick={(event) => {
                                event.stopPropagation();
                                handleArchiveConversation(conv);
                              }}
                            >
                              {language === 'fr' ? 'Archiver' : 'Archive'}
                            </Button>
                          )}
                        </div>
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
