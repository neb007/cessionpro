import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { useLanguage } from '@/components/i18n/LanguageContext';
import { useAuth } from '@/lib/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  MessageSquare, 
  Send, 
  ArrowLeft,
  Building2,
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
import {
  MessageBubble,
  AvatarWithPresence,
  DealProgressBar,
  DealStageManager,
  DocumentVault,
  MeetingScheduler,
  TypingIndicator
} from '@/components/messages';
import { emailNotificationService } from '@/services/emailNotificationService';
import { antiBypassService } from '@/services/antiBypassService';

export default function Messages() {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation.id);
    }
  }, [selectedConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadData = async () => {
    try {
      const userData = await base44.auth.me();
      setUser(userData);

      const convs = await base44.entities.Conversation.list('updated_at');
      const myConvs = convs.filter(c => c.participant_emails?.includes(userData.email));
      setConversations(myConvs);

      // Check URL for specific conversation
      const urlParams = new URLSearchParams(window.location.search);
      const convId = urlParams.get('conversation');
      if (convId) {
        const conv = myConvs.find(c => c.id === convId);
        if (conv) setSelectedConversation(conv);
      } else if (myConvs.length > 0) {
        setSelectedConversation(myConvs[0]);
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const loadMessages = async (conversationId) => {
    try {
      const msgs = await base44.entities.Message.filter(
        { conversation_id: conversationId },
        'created_date'
      );
      setMessages(msgs);

      // Mark as read
      const unreadMsgs = msgs.filter(m => !m.read && m.receiver_email === user?.email);
      for (const msg of unreadMsgs) {
        await base44.entities.Message.update(msg.id, { read: true });
      }

      // Update conversation unread count
      if (selectedConversation) {
        await base44.entities.Conversation.update(conversationId, {
          unread_count: {
            ...selectedConversation.unread_count,
            [user?.email]: 0
          }
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;
    
    // Anti-bypass detection
    const bypassCheck = antiBypassService.canSendMessage(newMessage, 'warning');
    if (!bypassCheck.allowed) {
      alert(language === 'fr' 
        ? `⚠️ ${bypassCheck.reason} - Veuillez utiliser Cessionpro pour tous les contacts`
        : `⚠️ ${bypassCheck.reason} - Please use Cessionpro for all communications`
      );
      return;
    }

    setSending(true);
    try {
      const otherParticipant = selectedConversation.participant_emails?.find(e => e !== user.email);
      
      await base44.entities.Message.create({
        conversation_id: selectedConversation.id,
        sender_email: user.email,
        receiver_email: otherParticipant,
        content: newMessage,
        business_id: selectedConversation.business_id,
        read: false
      });

      await base44.entities.Conversation.update(selectedConversation.id, {
        last_message: newMessage,
        last_message_date: new Date().toISOString(),
        unread_count: {
          ...selectedConversation.unread_count,
          [otherParticipant]: (selectedConversation.unread_count?.[otherParticipant] || 0) + 1
        }
      });

      // Send email notification
      try {
        await emailNotificationService.sendMessageNotification({
          recipientEmail: otherParticipant,
          recipientName: selectedConversation.participant_names?.[otherParticipant] || otherParticipant,
          senderName: user?.full_name || user?.email,
          messagePreview: newMessage.substring(0, 100),
          conversationId: selectedConversation.id,
          businessTitle: selectedConversation.business_title,
          language
        });
      } catch (emailError) {
        console.warn('Email notification failed (non-critical):', emailError);
      }

      setNewMessage('');
      loadMessages(selectedConversation.id);
    } catch (e) {
      console.error(e);
    }
    setSending(false);
  };

  const formatMessageTime = (date) => {
    const d = new Date(date);
    const locale = language === 'fr' ? fr : enUS;
    
    if (isToday(d)) {
      return format(d, 'HH:mm');
    } else if (isYesterday(d)) {
      return (language === 'fr' ? 'Hier ' : 'Yesterday ') + format(d, 'HH:mm');
    }
    return format(d, 'd MMM HH:mm', { locale });
  };

  const getOtherParticipant = (conv) => {
    return conv.participant_emails?.find(e => e !== user?.email);
  };

  const filteredConversations = conversations.filter(conv =>
    conv.business_title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    getOtherParticipant(conv)?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-80px)] flex">
      {/* Conversations List */}
      <div className={`w-full md:w-96 bg-white border-r border-gray-100 flex flex-col ${selectedConversation ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-4 border-b border-gray-100">
          <h1 className="font-display text-xl font-bold text-gray-900 mb-4">
            {t('conversations')}
          </h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={language === 'fr' ? 'Rechercher...' : 'Search...'}
              className="pl-10"
            />
          </div>
        </div>

        <ScrollArea className="flex-1">
          {filteredConversations.length === 0 ? (
            <div className="p-8 text-center">
              <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">{t('no_conversations')}</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {filteredConversations.map((conv) => {
                const isActive = selectedConversation?.id === conv.id;
                const unread = conv.unread_count?.[user?.email] || 0;
                
                return (
                  <button
                    key={conv.id}
                    onClick={() => setSelectedConversation(conv)}
                    className={`w-full p-4 text-left transition-colors ${
                      isActive ? 'bg-primary/5' : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-400 to-primary flex items-center justify-center text-white font-medium flex-shrink-0">
                        {conv.business_title?.[0]?.toUpperCase() || 'M'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className={`font-medium truncate ${isActive ? 'text-primary' : 'text-gray-900'}`}>
                            {conv.business_title}
                          </p>
                          {unread > 0 && (
                            <Badge className="bg-primary text-white text-xs ml-2">
                              {unread}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 truncate">
                          {getOtherParticipant(conv)}
                        </p>
                        <p className="text-sm text-gray-400 truncate mt-1">
                          {conv.last_message}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </div>

      {/* Messages Area */}
      <div className={`flex-1 flex flex-col bg-[#FAF9F7] ${selectedConversation ? 'flex' : 'hidden md:flex'}`}>
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="bg-white border-b border-gray-100 p-4 flex items-center gap-4">
              <button
                onClick={() => setSelectedConversation(null)}
                className="md:hidden p-2 -ml-2 hover:bg-gray-100 rounded-lg"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-400 to-primary flex items-center justify-center text-white font-medium">
                {selectedConversation.business_title?.[0]?.toUpperCase() || 'M'}
              </div>
              <div className="flex-1 min-w-0">
                <Link
                  to={createPageUrl(`BusinessDetails?id=${selectedConversation.business_id}`)}
                  className="font-display font-semibold text-gray-900 hover:text-primary transition-colors truncate block"
                >
                  {selectedConversation.business_title}
                </Link>
                <p className="text-sm text-gray-500 truncate">
                  {getOtherParticipant(selectedConversation)}
                </p>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="max-w-3xl mx-auto space-y-4">
                <AnimatePresence initial={false}>
                  {messages.map((msg, idx) => {
                    const isOwn = msg.sender_email === user?.email;
                    
                    return (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-[80%] ${isOwn ? 'order-1' : 'order-2'}`}>
                          <div
                            className={`rounded-2xl px-4 py-3 ${
                              isOwn
                                ? 'bg-primary text-white rounded-br-md'
                                : 'bg-white text-gray-900 shadow-sm rounded-bl-md'
                            }`}
                          >
                            <p className="whitespace-pre-wrap">{msg.content}</p>
                          </div>
                          <div className={`flex items-center gap-1 mt-1 text-xs text-gray-400 ${isOwn ? 'justify-end' : 'justify-start'}`}>
                            <span>{formatMessageTime(msg.created_date)}</span>
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
                </AnimatePresence>
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Input */}
            <div className="bg-white border-t border-gray-100 p-4">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  sendMessage();
                }}
                className="max-w-3xl mx-auto flex gap-3"
              >
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder={t('type_message')}
                  className="flex-1"
                  disabled={sending}
                />
                <Button
                  type="submit"
                  disabled={!newMessage.trim() || sending}
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
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-20 h-20 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-10 h-10 text-gray-300" />
              </div>
              <h3 className="font-display text-xl font-semibold text-gray-900 mb-2">
                {language === 'fr' ? 'Sélectionnez une conversation' : 'Select a conversation'}
              </h3>
              <p className="text-gray-500">
                {language === 'fr' ? 'Choisissez une conversation pour commencer' : 'Choose a conversation to start'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}