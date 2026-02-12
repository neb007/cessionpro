import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { useLanguage } from '@/components/i18n/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { 
  Search, 
  Users, 
  MapPin, 
  Briefcase,
  MessageCircle,
  BadgeCheck,
  Loader2,
  CheckCircle2
} from 'lucide-react';
import { motion } from 'framer-motion';

const SECTORS = ['technology', 'retail', 'hospitality', 'manufacturing', 'services', 'healthcare', 'construction', 'transport', 'agriculture', 'other'];
const BUDGET_RANGES = [
  { value: '0-100000', label: '< 100K €', min: 0, max: 100000 },
  { value: '100000-500000', label: '100K - 500K €', min: 100000, max: 500000 },
  { value: '500000-1000000', label: '500K - 1M €', min: 500000, max: 1000000 },
  { value: '1000000-5000000', label: '1M - 5M €', min: 1000000, max: 5000000 },
  { value: '5000000-', label: '> 5M €', min: 5000000, max: Infinity },
];

export default function BuyersDirectory() {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [buyers, setBuyers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSector, setSelectedSector] = useState('');
  const [selectedBudget, setSelectedBudget] = useState('');
  
  const [showContactModal, setShowContactModal] = useState(false);
  const [selectedBuyer, setSelectedBuyer] = useState(null);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [messageSent, setMessageSent] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Check if user is logged in
      try {
        const userData = await base44.auth.me();
        setCurrentUser(userData);
      } catch (e) {
        // Not logged in
      }

      // Load all users who are buyers and visible
      const users = await base44.entities.User.list();
      const visibleBuyers = users.filter(u => 
        (u.user_type === 'buyer' || u.user_type === 'both') && 
        u.visible_in_directory !== false
      );
      setBuyers(visibleBuyers);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const handleContact = (buyer) => {
    if (!currentUser) {
      base44.auth.redirectToLogin();
      return;
    }
    setSelectedBuyer(buyer);
    setShowContactModal(true);
    setMessage('');
    setMessageSent(false);
  };

  const sendMessage = async () => {
    if (!message.trim() || !selectedBuyer) return;
    
    setSending(true);
    try {
      const conversationId = `direct_${currentUser.email}_${selectedBuyer.email}`;
      
      // Check if conversation exists
      const convs = await base44.entities.Conversation.list();
      let conversation = convs.find(c => 
        c.participant_emails?.includes(currentUser.email) &&
        c.participant_emails?.includes(selectedBuyer.email) &&
        !c.business_id
      );

      if (!conversation) {
        conversation = await base44.entities.Conversation.create({
          participant_emails: [currentUser.email, selectedBuyer.email],
          business_title: language === 'fr' ? 'Contact direct' : 'Direct contact',
          last_message: message,
          last_message_date: new Date().toISOString(),
          unread_count: { [selectedBuyer.email]: 1 }
        });
      } else {
        await base44.entities.Conversation.update(conversation.id, {
          last_message: message,
          last_message_date: new Date().toISOString(),
          unread_count: {
            ...conversation.unread_count,
            [selectedBuyer.email]: (conversation.unread_count?.[selectedBuyer.email] || 0) + 1
          }
        });
      }

      await base44.entities.Message.create({
        conversation_id: conversation.id,
        sender_email: currentUser.email,
        receiver_email: selectedBuyer.email,
        content: message,
        read: false
      });

      setMessageSent(true);
      setTimeout(() => {
        setShowContactModal(false);
      }, 2000);
    } catch (e) {
      console.error(e);
    }
    setSending(false);
  };

  const formatBudget = (min, max) => {
    const formatNum = (n) => {
      if (n >= 1000000) return `${n / 1000000}M €`;
      if (n >= 1000) return `${n / 1000}K €`;
      return `${n} €`;
    };
    
    if (!min && !max) return '-';
    if (!max || max === Infinity) return `> ${formatNum(min)}`;
    if (!min) return `< ${formatNum(max)}`;
    return `${formatNum(min)} - ${formatNum(max)}`;
  };

  // Filter buyers
  const filteredBuyers = buyers.filter(buyer => {
    // Search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (
        !buyer.full_name?.toLowerCase().includes(query) &&
        !buyer.company_name?.toLowerCase().includes(query) &&
        !buyer.location?.toLowerCase().includes(query) &&
        !buyer.bio?.toLowerCase().includes(query)
      ) {
        return false;
      }
    }

    // Sector
    if (selectedSector && !buyer.sectors_interest?.includes(selectedSector)) {
      return false;
    }

    // Budget
    if (selectedBudget) {
      const range = BUDGET_RANGES.find(r => r.value === selectedBudget);
      if (range) {
        const buyerMin = buyer.budget_min || 0;
        const buyerMax = buyer.budget_max || Infinity;
        if (buyerMax < range.min || buyerMin > range.max) {
          return false;
        }
      }
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

  return (
    <div className="min-h-screen py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            {t('buyers_directory')}
          </h1>
          <p className="text-gray-500">
            {filteredBuyers.length} {t('potential_buyers').toLowerCase()}
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={language === 'fr' ? 'Rechercher un repreneur...' : 'Search for a buyer...'}
                className="pl-12 h-12"
              />
            </div>

            <Select value={selectedSector} onValueChange={setSelectedSector}>
              <SelectTrigger className="w-full sm:w-44 h-12">
                <SelectValue placeholder={t('sectors_interest')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={null}>
                  {language === 'fr' ? 'Tous les secteurs' : 'All sectors'}
                </SelectItem>
                {SECTORS.map(sector => (
                  <SelectItem key={sector} value={sector}>
                    {t(sector)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedBudget} onValueChange={setSelectedBudget}>
              <SelectTrigger className="w-full sm:w-40 h-12">
                <SelectValue placeholder={t('budget_range')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={null}>
                  {language === 'fr' ? 'Tous les budgets' : 'All budgets'}
                </SelectItem>
                {BUDGET_RANGES.map(range => (
                  <SelectItem key={range.value} value={range.value}>
                    {range.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Buyers Grid */}
        {filteredBuyers.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-6">
              <Users className="w-10 h-10 text-gray-300" />
            </div>
            <h3 className="font-display text-xl font-semibold text-gray-900 mb-2">
              {t('no_results')}
            </h3>
            <p className="text-gray-500">
              {language === 'fr' ? 'Aucun repreneur ne correspond à vos critères' : 'No buyers match your criteria'}
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBuyers.map((buyer, idx) => (
              <motion.div
                key={buyer.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Card className="border-0 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden h-full">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-violet-400 to-primary flex items-center justify-center text-white text-xl font-medium flex-shrink-0">
                        {buyer.full_name?.[0]?.toUpperCase() || 'U'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-display font-semibold text-gray-900 truncate">
                            {buyer.full_name || (language === 'fr' ? 'Anonyme' : 'Anonymous')}
                          </h3>
                          {buyer.verified && (
                            <BadgeCheck className="w-5 h-5 text-primary flex-shrink-0" />
                          )}
                        </div>
                        {buyer.company_name && (
                          <p className="text-sm text-gray-500 truncate">{buyer.company_name}</p>
                        )}
                        {buyer.location && (
                          <p className="text-sm text-gray-400 flex items-center gap-1 mt-1">
                            <MapPin className="w-3 h-3" />
                            {buyer.location}
                          </p>
                        )}
                      </div>
                    </div>

                    {buyer.bio && (
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {buyer.bio}
                      </p>
                    )}

                    <div className="space-y-3 mb-4">
                      {(buyer.budget_min || buyer.budget_max) && (
                        <div className="flex items-center gap-2 text-sm">
                          <Briefcase className="w-4 h-4 text-gray-400" />
                          <span className="font-mono font-medium text-gray-900">
                            {formatBudget(buyer.budget_min, buyer.budget_max)}
                          </span>
                        </div>
                      )}
                      
                      {buyer.sectors_interest?.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {buyer.sectors_interest.slice(0, 3).map(sector => (
                            <Badge key={sector} variant="secondary" className="text-xs">
                              {t(sector)}
                            </Badge>
                          ))}
                          {buyer.sectors_interest.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{buyer.sectors_interest.length - 3}
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>

                    <Button
                      onClick={() => handleContact(buyer)}
                      className="w-full bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      {t('contact')}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Contact Modal */}
      <Dialog open={showContactModal} onOpenChange={setShowContactModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display">
              {t('contact')} {selectedBuyer?.full_name}
            </DialogTitle>
          </DialogHeader>
          
          {messageSent ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8"
            >
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-display text-xl font-semibold text-gray-900 mb-2">
                {language === 'fr' ? 'Message envoyé !' : 'Message sent!'}
              </h3>
              <p className="text-gray-500">
                {language === 'fr' ? 'Vous recevrez une réponse bientôt.' : 'You will receive a reply soon.'}
              </p>
            </motion.div>
          ) : (
            <div className="space-y-4">
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={language === 'fr' 
                  ? 'Présentez-vous et expliquez votre démarche...' 
                  : 'Introduce yourself and explain your approach...'}
                className="min-h-32 resize-none"
              />
              
              <Button
                onClick={sendMessage}
                disabled={!message.trim() || sending}
                className="w-full bg-gradient-to-r from-primary to-blue-600"
              >
                {sending ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <MessageCircle className="w-4 h-4 mr-2" />
                )}
                {t('send')}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}