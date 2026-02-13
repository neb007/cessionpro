import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { MapPin, Heart, MessageCircle, CheckCircle2, Eye, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/components/i18n/LanguageContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { supabase } from '@/api/supabaseClient';
import { useAuth } from '@/lib/AuthContext';
import { sendBusinessMessage } from '@/services/businessMessagingService';
import { getPrimaryImageUrl } from '@/utils/imageHelpers';
import { calculateGrowthPercentage } from '@/utils/growthCalculator';
import { getProfile } from '@/services/profileService';
import LogoCard from '@/components/ui/LogoCard';

const sectorColors = {
  technology: 'bg-primary-light text-primary',
  retail: 'bg-primary-light text-primary',
  hospitality: 'bg-primary-light text-primary',
  manufacturing: 'bg-blue-100 text-blue-700',
  services: 'bg-success/10 text-success',
  healthcare: 'bg-primary-light text-primary',
  construction: 'bg-primary-light text-primary',
  transport: 'bg-cyan-100 text-cyan-700',
  agriculture: 'bg-lime-100 text-lime-700',
  other: 'bg-gray-100 text-muted-foreground',
};

export default function BusinessCard({ business, isFavorite, onToggleFavorite }) {
  const { t, language } = useLanguage();
  const { user: authUser } = useAuth();
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [messageSent, setMessageSent] = useState(false);
  const [user, setUser] = useState(null);
  const [sellerProfile, setSellerProfile] = useState(null);
  const [sellerFallbackLogo, setSellerFallbackLogo] = useState(null);

  useEffect(() => {
    loadBusinessLogo();
  }, [business?.id]);

  useEffect(() => {
    if (authUser) {
      setUser(authUser);
    }
  }, [authUser]);

  const loadBusinessLogo = async () => {
    try {
      if (business?.id) {
        const { data, error } = await supabase
          .from('business_logos')
          .select('logo_url')
          .eq('business_id', business.id)
          .maybeSingle();

        if (data && !error) {
          setSellerProfile(data);
          return;
        }
      }
      if (business?.seller_id) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('logo_url, avatar_url')
          .eq('id', business.seller_id)
          .maybeSingle();

        if (profileData) {
          setSellerFallbackLogo(profileData.logo_url || profileData.avatar_url || null);
        }
      }
    } catch (error) {
      console.error('Error loading business logo:', error);
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

  const isCession = business.type === 'cession';
  const imageUrl = getPrimaryImageUrl(business);
  const referenceLabel = business.reference_number || (language === 'fr' ? 'Référence à venir' : 'Reference pending');
  const announcementLabel = isCession
    ? (language === 'fr' ? 'Cession' : 'Sale')
    : (language === 'fr' ? 'Acquisition' : 'Acquisition');
  const growthPercentage = calculateGrowthPercentage(business.financial_years);
  const shouldShowLogo = Boolean(sellerProfile?.logo_url || sellerFallbackLogo);
  const displayLogoUrl = sellerProfile?.logo_url || sellerFallbackLogo;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.3 }}
      className="h-full"
    >
      <Card className="group overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 bg-white h-full flex flex-col rounded-2xl">
        {/* Image Section with Category and Views */}
        <div className="relative h-40 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-50">
          <Link to={createPageUrl(`BusinessDetails?id=${business.id}`)}>
            <img
              src={imageUrl}
              alt={business.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
          </Link>
          
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Views badge on image */}
          <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-white/90 backdrop-blur-sm text-xs text-gray-700 font-medium">
            <Eye className="w-4 h-4" />
            <span className="font-mono">{business.views_count || 0}</span>
          </div>

          {/* Message Button - Bottom Left */}
          <button
            onClick={async (e) => {
              e.preventDefault();
              try {
                const { data: authData } = await supabase.auth.getUser();
                const currentUser = authUser || user || authData?.user;
                if (!currentUser) {
                  window.location.href = '/login';
                  return;
                }
                setUser(currentUser);
                setShowMessageModal(true);
              } catch (error) {
                console.error('Failed to open message modal:', error);
              }
            }}
            className="absolute bottom-3 left-3 p-2 rounded-full bg-black/50 text-white hover:bg-primary transition-colors z-50"
            aria-label={language === 'fr' ? 'Envoyer un message' : 'Send message'}
            title={language === 'fr' ? 'Envoyer un message' : 'Send message'}
          >
            <MessageCircle className="w-5 h-5" />
          </button>

          {/* Favorite Button - Bottom Right */}
          {onToggleFavorite && (
            <button
              onClick={(e) => {
                e.preventDefault();
                onToggleFavorite(business.id);
              }}
              className={`absolute bottom-3 right-3 p-2 rounded-full transition-all duration-300 z-50 ${
                isFavorite 
                  ? 'bg-rose-500 text-white' 
                  : 'bg-black/50 text-white hover:bg-rose-500'
              }`}
            >
              <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
          )}
        </div>
        
        <CardContent className="p-4 flex flex-col flex-grow">
          {/* Titre */}
          <div className="mb-2">
            <Link to={createPageUrl(`BusinessDetails?id=${business.id}`)} className="flex-1 min-w-0">
              <h3 style={{ fontFamily: 'Sora', fontWeight: 700, fontSize: '16px' }} className="text-[#3B4759] group-hover:text-[#FF6B4A] transition-colors line-clamp-2 leading-tight">
                {business.title}
              </h3>
            </Link>
          </div>

          {/* Localisation */}
          {!business.hide_location && (
            <div className="flex items-center justify-between gap-2 mb-3">
              <div style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 500 }} className="flex items-center text-sm text-gray-500 flex-1 min-w-0">
                <MapPin className="w-4 h-4 mr-1.5 text-gray-400 flex-shrink-0" />
                <span className="truncate">{business.location}</span>
              </div>
            </div>
          )}

          {/* Détails financiers - CESSION */}
          {business.type === 'cession' && (
            <div className="pt-3 border-t border-gray-100 mt-auto space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 600, fontSize: '12px' }} className="text-[#8A98AD] uppercase tracking-wider">CA</p>
                  <p style={{ fontFamily: 'JetBrains Mono', fontWeight: 700, fontSize: '14px' }} className="text-[#3B4759]">
                    {formatPrice(business.annual_revenue)}
                  </p>
                </div>
                <div>
                  <p style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 600, fontSize: '12px' }} className="text-[#8A98AD] uppercase tracking-wider">
                    CROISSANCE
                  </p>
                  <div className="flex items-center justify-start gap-1">
                    <TrendingUp className="w-3 h-3 text-green-600 flex-shrink-0" />
                    <p style={{ fontFamily: 'JetBrains Mono', fontWeight: 700, fontSize: '14px' }} className="text-green-600">
                      {growthPercentage > 0 ? '+' : ''}{growthPercentage || 0}%
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-gray-100">
                <div className="flex items-end justify-between gap-3">
                  <div className="flex-1">
                    <p style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 600, fontSize: '12px' }} className="text-[#8A98AD] uppercase tracking-wider mb-1">
                      {language === 'fr' ? 'Prix Demandé' : 'Asking Price'}
                    </p>
                    <p style={{ fontFamily: 'JetBrains Mono', fontWeight: 700, fontSize: '22px' }} className="text-[#FF6B4A] leading-none">
                      {formatPrice(business.asking_price)}
                    </p>
                  </div>
                  {business.verified && (
                    <Badge variant="secondary" className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 text-[11px] whitespace-nowrap">
                      ✓ {language === 'fr' ? 'Vérifié' : 'Verified'}
                    </Badge>
                  )}
                </div>
                {shouldShowLogo && (
                  <div className="flex flex-col items-center gap-2 pt-2">
                    <div className="h-px w-full bg-gray-100" />
                    <LogoCard
                      logoUrl={displayLogoUrl}
                      context="card"
                      altText="Seller logo"
                      rounded
                      shadow
                    />
                    <div className="h-px w-full bg-gray-100" />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Critères Acheteur - ACQUISITION */}
          {business.type === 'acquisition' && (
            <div className="pt-3 border-t border-gray-100 mt-auto space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 600, fontSize: '12px' }} className="text-[#8A98AD] uppercase tracking-wider">
                    {language === 'fr' ? 'Budget' : 'Budget'}
                  </p>
                  <p style={{ fontFamily: 'JetBrains Mono', fontWeight: 700, fontSize: '14px' }} className="text-[#3B4759]">
                    {formatPrice(business.buyer_budget_min)} - {formatPrice(business.buyer_budget_max)}
                  </p>
                </div>
                <div>
                  <p style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 600, fontSize: '12px' }} className="text-[#8A98AD] uppercase tracking-wider">
                    {language === 'fr' ? 'Secteurs' : 'Sectors'}
                  </p>
                  <p style={{ fontFamily: 'JetBrains Mono', fontWeight: 700, fontSize: '14px' }} className="text-[#3B4759]">
                    {business.buyer_sectors_interested?.length || 0}
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-gray-100">
                <div className="flex-1">
                  <p style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 600, fontSize: '12px' }} className="text-[#8A98AD] uppercase tracking-wider mb-1">
                    {language === 'fr' ? 'Financement Disponible' : 'Available Investment'}
                  </p>
                  <p style={{ fontFamily: 'JetBrains Mono', fontWeight: 700, fontSize: '22px' }} className="text-[#FF6B4A] leading-none">
                    {formatPrice(business.buyer_investment_available)}
                  </p>
                </div>
                {shouldShowLogo && (
                  <div className="flex flex-col items-center gap-2 pt-2">
                    <div className="h-px w-full bg-gray-100" />
                    <LogoCard
                      logoUrl={displayLogoUrl}
                      context="card"
                      altText="Seller logo"
                      rounded
                      shadow
                    />
                    <div className="h-px w-full bg-gray-100" />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Badge Cession/Acquisition + Référence */}
          <div className="mt-3 flex items-center justify-between gap-2">
            <Badge variant="secondary" style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 600 }} className="inline-flex items-center rounded-md px-2.5 py-0.5 bg-purple-50 text-purple-700 border-0 text-[11px]">
              {announcementLabel}
            </Badge>
            <Badge variant="secondary" style={{ fontFamily: 'JetBrains Mono', fontWeight: 700 }} className="inline-flex items-center rounded-md px-2.5 py-0.5 bg-gray-100 text-gray-600 border-0 text-[11px]">
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
              {business.type === 'cession'
                ? (language === 'fr' ? 'Contacter le vendeur' : 'Contact seller')
                : (language === 'fr' ? 'Contacter l\'acheteur' : 'Contact buyer')}
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
                    const { data: authData } = await supabase.auth.getUser();
                    const currentUser = authUser || user || authData?.user;
                    if (!currentUser) {
                      window.location.href = '/login';
                      return;
                    }
                    setUser(currentUser);
                    setSending(true);
                    await sendBusinessMessage({
                      business,
                      buyerEmail: currentUser.email,
                      buyerName: currentUser.user_metadata?.full_name || currentUser.email,
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
                    alert(language === 'fr'
                      ? 'Impossible d\'envoyer le message pour le moment.'
                      : 'Unable to send the message right now.');
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
