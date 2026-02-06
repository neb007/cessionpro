import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { MapPin, Eye, Heart, MessageCircle, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/components/i18n/LanguageContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { sendBusinessMessage } from '@/services/businessMessagingService';
import { getPrimaryImageUrl } from '@/utils/imageHelpers';

const sectorColors = {
  technology: 'bg-[#FFE5DF] text-[#FF6B4A]',
  retail: 'bg-[#FFE5DF] text-[#FF8F6D]',
  hospitality: 'bg-[#FFF3E0] text-[#FFA488]',
  manufacturing: 'bg-[#E3F2FD] text-[#5B9BD5]',
  services: 'bg-[#E8F5E9] text-[#66BB6A]',
  healthcare: 'bg-[#FFE5DF] text-[#FF6B4A]',
  construction: 'bg-[#FFE5DF] text-[#FF8F6D]',
  transport: 'bg-[#E0F2F1] text-[#4DB6AC]',
  agriculture: 'bg-[#F1F8E9] text-[#9CCC65]',
  other: 'bg-gray-100 text-[#6B7A94]',
};

export default function BusinessCard({ business, isFavorite, onToggleFavorite }) {
  const { t, language } = useLanguage();
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [messageSent, setMessageSent] = useState(false);
  const [user, setUser] = useState(null);
  
  const formatPrice = (price) => {
    if (!price) return '-';
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const isCession = business.type === 'cession';
  const imageUrl = getPrimaryImageUrl(business);
  const referenceLabel = business.reference_number || (language === 'fr' ? 'Référence à venir' : 'Reference pending');
  const announcementLabel = isCession
    ? (language === 'fr' ? 'Cession' : 'Sale')
    : (language === 'fr' ? 'Acquisition' : 'Acquisition');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className="h-full"
    >
      <Card className="group overflow-hidden border-0 shadow-sm hover:shadow-xl transition-all duration-500 bg-white h-full flex flex-col">
        {/* Image Section with Category and Views */}
        <Link to={createPageUrl(`BusinessDetails?id=${business.id}`)}>
          <div className="relative h-48 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-50">
            <img
              src={imageUrl}
              alt={business.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Views with Eye Icon (Top Right) */}
            <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-white/90 backdrop-blur-sm text-xs text-gray-700 font-medium">
              <Eye className="w-3.5 h-3.5" />
              <span className="font-mono">{business.views_count || 0}</span>
            </div>
          </div>
        </Link>
        
        <CardContent className="p-4 sm:p-5 flex flex-col flex-grow">
          {/* Title with Favorite Button */}
          <div className="flex items-start justify-between gap-2 mb-1">
            <Link to={createPageUrl(`BusinessDetails?id=${business.id}`)} className="flex-1 min-w-0">
              <h3 className="font-display font-semibold text-base sm:text-lg text-[#3B4759] group-hover:text-[#FF6B4A] transition-colors line-clamp-2">
                {business.title}
              </h3>
            </Link>
            <div className="flex flex-col items-end gap-2">
              {onToggleFavorite && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    onToggleFavorite(business.id);
                  }}
                  className={`p-2 rounded-full transition-all duration-300 flex-shrink-0 ${
                    isFavorite 
                      ? 'bg-rose-50 text-rose-500' 
                      : 'bg-gray-50 text-gray-400 hover:bg-rose-50 hover:text-rose-500'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                </button>
              )}
              <button
                onClick={async (e) => {
                  e.preventDefault();
                  try {
                    const currentUser = user || await base44.auth.me();
                    setUser(currentUser);
                    setShowMessageModal(true);
                  } catch (error) {
                    base44.auth.redirectToLogin();
                  }
                }}
                className="p-2 rounded-full border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-primary transition-colors"
                aria-label={language === 'fr' ? 'Envoyer un message' : 'Send message'}
                title={language === 'fr' ? 'Envoyer un message' : 'Send message'}
              >
                <MessageCircle className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex items-start justify-between gap-2 mb-4">
            <div className="flex items-center text-sm text-gray-500 flex-1 min-w-0">
              <MapPin className="w-4 h-4 mr-1.5 text-gray-400 flex-shrink-0" />
              <span className="truncate">{business.location}</span>
            </div>
            {/* Reference badge removed here to avoid duplicate */}
          </div>

          {business.verified && (
            <div className="mb-4">
              <Badge variant="secondary" className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 text-[11px]">
                ✓ {language === 'fr' ? 'Vérifié' : 'Verified'}
              </Badge>
            </div>
          )}
          
          {/* Financial Info */}
          <div className="pt-3 border-t border-gray-100 mt-auto">
            <p className="text-xs text-[#8A98AD] uppercase tracking-wider mb-2">
              {language === 'fr' ? 'Prix' : 'Price'}
            </p>
            <div className="flex items-center justify-between gap-2">
              <p className="font-mono text-lg font-bold text-[#FF6B4A]">
                {formatPrice(business.asking_price)}
              </p>
              
              {/* Show CA only for cessions with annual_revenue */}
              {isCession && business.annual_revenue && (
                <div className="text-right">
                  <p className="text-xs text-[#8A98AD] uppercase tracking-wider">
                    CA
                  </p>
                  <p className="font-mono text-sm font-semibold text-[#5B9BD5]">
                    {formatPrice(business.annual_revenue)}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
            <Badge variant="secondary" className="inline-flex items-center rounded-md px-2.5 py-0.5 font-semibold bg-purple-50 text-purple-700 border-0 text-[11px]">
              {announcementLabel}
            </Badge>
            <Badge variant="secondary" className="inline-flex items-center rounded-md px-2.5 py-0.5 font-semibold bg-gray-100 text-gray-600 border-0 text-[11px] font-mono">
              {referenceLabel}
            </Badge>
          </div>
        </CardContent>
      </Card>
      <Dialog open={showMessageModal} onOpenChange={(open) => {
        setShowMessageModal(open);
        if (!open) {
          setMessage('');
          setMessageSent(false);
          setSending(false);
        }
      }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display">
              {language === 'fr' ? 'Contacter le vendeur' : 'Contact seller'}
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
                {language === 'fr' ? 'Le vendeur vous répondra bientôt.' : 'The seller will reply soon.'}
              </p>
            </motion.div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-sm text-gray-500 mb-1">{language === 'fr' ? 'Annonce' : 'Listing'}</p>
                <p className="font-medium text-gray-900">{business.title}</p>
              </div>

              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={language === 'fr'
                  ? 'Présentez-vous et expliquez votre intérêt pour cette entreprise...'
                  : 'Introduce yourself and explain your interest in this business...'}
                className="min-h-32 resize-none"
              />

              <Button
                onClick={async () => {
                  if (!message.trim()) return;
                  try {
                    const currentUser = user || await base44.auth.me();
                    if (!currentUser) {
                      base44.auth.redirectToLogin();
                      return;
                    }
                    setUser(currentUser);
                    setSending(true);
                    await sendBusinessMessage({
                      business,
                      buyerEmail: currentUser.email,
                      buyerName: currentUser.full_name,
                      message,
                    });

                    setMessageSent(true);
                    setMessage('');
                    setTimeout(() => {
                      setShowMessageModal(false);
                      setMessageSent(false);
                    }, 2000);
                  } catch (error) {
                    console.error(error);
                    base44.auth.redirectToLogin();
                  } finally {
                    setSending(false);
                  }
                }}
                disabled={!message.trim() || sending}
                className="w-full bg-gradient-to-r from-primary to-blue-600"
              >
                {sending ? (
                  <span className="flex items-center gap-2">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                      className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                    />
                    {language === 'fr' ? 'Envoi...' : 'Sending...'}
                  </span>
                ) : (
                  <>
                    <MessageCircle className="w-4 h-4 mr-2" />
                    {language === 'fr' ? 'Envoyer' : 'Send'}
                  </>
                )}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
