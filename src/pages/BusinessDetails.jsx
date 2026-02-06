import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { useLanguage } from '@/components/i18n/LanguageContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { 
  MapPin, 
  Users, 
  Calendar, 
  TrendingUp,
  Heart,
  MessageCircle,
  Share2,
  ChevronLeft,
  ChevronRight,
  Lock,
  Building2,
  Eye,
  CheckCircle2,
  ArrowLeft,
  FileText,
  Briefcase
} from 'lucide-react';
import { motion } from 'framer-motion';
import FinancialChart from '@/components/Financial/FinancialChart';

const sectorColors = {
  technology: 'bg-violet-100 text-violet-700',
  retail: 'bg-orange-100 text-orange-700',
  hospitality: 'bg-amber-100 text-amber-700',
  manufacturing: 'bg-blue-100 text-blue-700',
  services: 'bg-green-100 text-green-700',
  healthcare: 'bg-rose-100 text-rose-700',
  construction: 'bg-orange-100 text-orange-700',
  transport: 'bg-cyan-100 text-cyan-700',
  agriculture: 'bg-lime-100 text-lime-700',
  other: 'bg-gray-100 text-gray-700',
};

export default function BusinessDetails() {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showContactModal, setShowContactModal] = useState(false);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [messageSent, setMessageSent] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    
    if (!id) {
      navigate(createPageUrl('Annonces'));
      return;
    }

    try {
      const businessData = await base44.entities.Business.filter({ id });
      if (!businessData[0]) {
        navigate(createPageUrl('Annonces'));
        return;
      }
      
      setBusiness(businessData[0]);
      
      // Increment views
      await base44.entities.Business.update(businessData[0].id, {
        views_count: (businessData[0].views_count || 0) + 1
      });

      try {
        const userData = await base44.auth.me();
        setUser(userData);
        
        const favs = await base44.entities.Favorite.filter({ 
          user_email: userData.email,
          business_id: id 
        });
        setIsFavorite(favs.length > 0);
      } catch (e) {
        // Not logged in
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const toggleFavorite = async () => {
    if (!user) {
      base44.auth.redirectToLogin();
      return;
    }

    if (isFavorite) {
      const favs = await base44.entities.Favorite.filter({ 
        user_email: user.email, 
        business_id: business.id 
      });
      if (favs[0]) {
        await base44.entities.Favorite.delete(favs[0].id);
        setIsFavorite(false);
      }
    } else {
      await base44.entities.Favorite.create({ 
        user_email: user.email, 
        business_id: business.id 
      });
      setIsFavorite(true);
    }
  };

  const handleContact = async () => {
    if (!user) {
      base44.auth.redirectToLogin();
      return;
    }
    setShowContactModal(true);
  };

  const sendMessage = async () => {
    if (!message.trim()) return;
    
    setSending(true);
    try {
      // Check if conversation exists
      const conversations = await base44.entities.Conversation.list();
      let conversation = conversations.find(c => 
        c.business_id === business.id &&
        c.participant_emails?.includes(user.email) &&
        c.participant_emails?.includes(business.seller_email)
      );

      const conversationId = conversation?.id || `${business.id}_${user.email}_${business.seller_email}`;

      if (!conversation) {
        conversation = await base44.entities.Conversation.create({
          participant_emails: [user.email, business.seller_email],
          business_id: business.id,
          business_title: business.title,
          last_message: message,
          last_message_date: new Date().toISOString(),
          unread_count: { [business.seller_email]: 1 }
        });
      } else {
        await base44.entities.Conversation.update(conversation.id, {
          last_message: message,
          last_message_date: new Date().toISOString(),
          unread_count: {
            ...conversation.unread_count,
            [business.seller_email]: (conversation.unread_count?.[business.seller_email] || 0) + 1
          }
        });
      }

      await base44.entities.Message.create({
        conversation_id: conversation.id,
        sender_email: user.email,
        receiver_email: business.seller_email,
        content: message,
        business_id: business.id,
        read: false
      });

      // Create or update lead
      const existingLeads = await base44.entities.Lead.filter({
        business_id: business.id,
        buyer_email: user.email
      });

      if (existingLeads.length === 0) {
        await base44.entities.Lead.create({
          business_id: business.id,
          buyer_email: user.email,
          buyer_name: user.full_name || user.email,
          status: 'new',
          source: 'message',
          last_contact_date: new Date().toISOString()
        });
      } else {
        await base44.entities.Lead.update(existingLeads[0].id, {
          last_contact_date: new Date().toISOString(),
          status: 'contacted'
        });
      }

      setMessageSent(true);
      setMessage('');
      setTimeout(() => {
        setShowContactModal(false);
        setMessageSent(false);
      }, 2000);
    } catch (e) {
      console.error(e);
    }
    setSending(false);
  };

  const formatPrice = (price) => {
    if (!price) return '-';
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getImagesList = () => {
    let imagesArray = business.images;
    
    // Handle if images is a JSON string from database
    if (typeof imagesArray === 'string') {
      try {
        imagesArray = JSON.parse(imagesArray);
      } catch (e) {
        imagesArray = [];
      }
    }
    
    // Ensure it's an array
    if (!Array.isArray(imagesArray)) {
      imagesArray = imagesArray && typeof imagesArray === 'object' ? [imagesArray] : [];
    }
    
    // Extract URLs from objects
    return imagesArray.map(img => {
      if (typeof img === 'object' && img.url) {
        return img.url;
      }
      if (typeof img === 'string') {
        return img;
      }
      return null;
    }).filter(url => url !== null);
  };

  if (loading) {
    return (
      <div className="min-h-screen py-8 lg:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-8">
            <div className="h-96 bg-gray-200 rounded-3xl" />
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                <div className="h-8 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
                <div className="h-32 bg-gray-200 rounded" />
              </div>
              <div className="h-64 bg-gray-200 rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!business) return null;

  const images = getImagesList();

  return (
    <div className="min-h-screen py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(createPageUrl('Annonces'))}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {t('businesses')}
        </button>

        {/* Image Gallery */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-50 mb-8">
          <div className="aspect-[21/9] relative">
            {images && images.length > 0 ? (
              <>
                <motion.img
                  key={currentImageIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  src={images[currentImageIndex]}
                  alt={business.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop';
                  }}
                />
                
                {images.length > 1 && (
                  <>
                    <button
                      onClick={() => setCurrentImageIndex((currentImageIndex - 1 + images.length) % images.length)}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg hover:bg-white transition-colors"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      onClick={() => setCurrentImageIndex((currentImageIndex + 1) % images.length)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg hover:bg-white transition-colors"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                    
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                      {images.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentImageIndex(idx)}
                          className={`w-2 h-2 rounded-full transition-all ${
                            idx === currentImageIndex ? 'bg-white w-6' : 'bg-white/50'
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-primary/20 to-violet-500/20 flex items-center justify-center">
                  <Building2 className="w-16 h-16 text-primary/40" />
                </div>
              </div>
            )}
          </div>

          {/* Badges Overlay */}
          <div className="absolute top-4 left-4 flex gap-2">
            <Badge className={`${sectorColors[business.sector]} border-0 font-medium`}>
              {t(business.sector)}
            </Badge>
            {business.confidential && (
              <Badge className="bg-gray-900/80 text-white border-0">
                <Lock className="w-3 h-3 mr-1" />
                {t('confidential')}
              </Badge>
            )}
          </div>

          {/* Stats Overlay */}
          <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-2 rounded-full bg-white/90 backdrop-blur-sm text-sm text-gray-600">
            <Eye className="w-4 h-4" />
            <span className="font-mono">{business.views_count || 0}</span>
            <span>{t('views')}</span>
          </div>
        </div>

        {/* Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h1 className="font-display text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                {business.title}
              </h1>
              <div className="flex items-center gap-4 text-gray-500">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" />
                  {business.location}, {t(business.country)}
                </div>
                {business.year_founded && (
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    {t('founded')} {business.year_founded}
                  </div>
                )}
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: t('asking_price'), value: formatPrice(business.asking_price), color: 'from-primary/10 to-blue-50' },
                { label: t('annual_revenue'), value: formatPrice(business.annual_revenue), color: 'from-green-50 to-emerald-50' },
                { label: t('ebitda'), value: formatPrice(business.ebitda), color: 'from-violet-50 to-purple-50' },
                { label: t('employees'), value: business.employees || '-', color: 'from-orange-50 to-amber-50' },
              ].map((metric, idx) => (
                <Card key={idx} className="border-0 shadow-sm overflow-hidden">
                  <CardContent className={`p-4 bg-gradient-to-br ${metric.color}`}>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{metric.label}</p>
                    <p className="font-mono text-xl font-bold text-gray-900">{metric.value}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Description */}
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <h2 className="font-display text-xl font-semibold text-gray-900 mb-4">
                  {t('description')}
                </h2>
                <p className="text-gray-600 whitespace-pre-wrap leading-relaxed">
                  {business.description || (language === 'fr' ? 'Aucune description disponible.' : 'No description available.')}
                </p>
              </CardContent>
            </Card>

            {/* Details */}
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <h2 className="font-display text-xl font-semibold text-gray-900 mb-4">
                  {language === 'fr' ? 'Détails' : 'Details'}
                </h2>
                <div className="grid sm:grid-cols-2 gap-6">
                  {business.reason_for_sale && (
                    <div>
                      <p className="text-sm text-gray-500 mb-1">{t('reason_sale')}</p>
                      <p className="font-medium text-gray-900">{t(business.reason_for_sale)}</p>
                    </div>
                  )}
                  {business.assets_included?.length > 0 && (
                    <div>
                      <p className="text-sm text-gray-500 mb-2">{t('assets_included')}</p>
                      <div className="flex flex-wrap gap-2">
                        {business.assets_included.map((asset, idx) => (
                          <Badge key={idx} variant="secondary" className="bg-gray-100">
                            <CheckCircle2 className="w-3 h-3 mr-1 text-green-500" />
                            {asset}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Financial History */}
            {business.financial_years?.length > 0 && (
              <FinancialChart financialYears={business.financial_years} language={language} />
            )}

            {/* Legal & Administrative Info */}
            {(business.legal_structure || business.registration_number || business.lease_info || business.licenses) && (
              <Card className="border-0 shadow-sm">
                <CardContent className="p-6">
                  <h2 className="font-display text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-primary" />
                    {language === 'fr' ? 'Informations légales' : 'Legal Information'}
                  </h2>
                  <div className="space-y-4">
                    {business.legal_structure && (
                      <div>
                        <p className="text-sm text-gray-500 mb-1">{language === 'fr' ? 'Structure juridique' : 'Legal Structure'}</p>
                        <p className="font-medium text-gray-900">{business.legal_structure.toUpperCase()}</p>
                      </div>
                    )}
                    {business.registration_number && (
                      <div>
                        <p className="text-sm text-gray-500 mb-1">{language === 'fr' ? 'Numéro d\'enregistrement' : 'Registration Number'}</p>
                        <p className="font-mono font-medium text-gray-900">{business.registration_number}</p>
                      </div>
                    )}
                    {business.lease_info && (
                      <div>
                        <p className="text-sm text-gray-500 mb-1">{language === 'fr' ? 'Baux commerciaux' : 'Commercial Leases'}</p>
                        <p className="text-gray-700 whitespace-pre-wrap">{business.lease_info}</p>
                      </div>
                    )}
                    {business.licenses && (
                      <div>
                        <p className="text-sm text-gray-500 mb-1">{language === 'fr' ? 'Licences et autorisations' : 'Licenses & Permits'}</p>
                        <p className="text-gray-700 whitespace-pre-wrap">{business.licenses}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Market & Strategic Info */}
            {(business.market_position || business.competitive_advantages || business.growth_opportunities || business.customer_base) && (
              <Card className="border-0 shadow-sm">
                <CardContent className="p-6">
                  <h2 className="font-display text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-primary" />
                    {language === 'fr' ? 'Analyse stratégique' : 'Strategic Analysis'}
                  </h2>
                  <div className="space-y-4">
                    {business.market_position && (
                      <div>
                        <p className="text-sm text-gray-500 mb-1">{language === 'fr' ? 'Positionnement marché' : 'Market Position'}</p>
                        <p className="text-gray-700 whitespace-pre-wrap">{business.market_position}</p>
                      </div>
                    )}
                    {business.competitive_advantages && (
                      <div>
                        <p className="text-sm text-gray-500 mb-1">{language === 'fr' ? 'Avantages concurrentiels' : 'Competitive Advantages'}</p>
                        <p className="text-gray-700 whitespace-pre-wrap">{business.competitive_advantages}</p>
                      </div>
                    )}
                    {business.growth_opportunities && (
                      <div>
                        <p className="text-sm text-gray-500 mb-1">{language === 'fr' ? 'Opportunités de développement' : 'Growth Opportunities'}</p>
                        <p className="text-gray-700 whitespace-pre-wrap">{business.growth_opportunities}</p>
                      </div>
                    )}
                    {business.customer_base && (
                      <div>
                        <p className="text-sm text-gray-500 mb-1">{language === 'fr' ? 'Base clientèle' : 'Customer Base'}</p>
                        <p className="text-gray-700 whitespace-pre-wrap">{business.customer_base}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Price Card */}
            <Card className="border-0 shadow-lg sticky top-24">
              <CardContent className="p-6">
                <div className="mb-6">
                  <p className="text-sm text-gray-500 uppercase tracking-wider mb-1">{t('asking_price')}</p>
                  <p className="font-mono text-4xl font-bold text-primary">
                    {formatPrice(business.asking_price)}
                  </p>
                </div>

                <div className="space-y-3">
                  <Button
                    onClick={handleContact}
                    className="w-full bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 text-white py-6 text-lg shadow-lg shadow-primary/25"
                  >
                    <MessageCircle className="w-5 h-5 mr-2" />
                    {t('contact_seller')}
                  </Button>
                  
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={toggleFavorite}
                      className={`flex-1 py-6 ${isFavorite ? 'bg-rose-50 border-rose-200 text-rose-600 hover:bg-rose-100' : ''}`}
                    >
                      <Heart className={`w-5 h-5 mr-2 ${isFavorite ? 'fill-current' : ''}`} />
                      {isFavorite ? t('remove_favorite') : t('add_favorite')}
                    </Button>
                    <Button variant="outline" className="py-6">
                      <Share2 className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Contact Modal */}
      <Dialog open={showContactModal} onOpenChange={setShowContactModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display">{t('contact_seller')}</DialogTitle>
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
                <p className="text-sm text-gray-500 mb-1">{t('businesses')}</p>
                <p className="font-medium text-gray-900">{business.title}</p>
              </div>
              
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={language === 'fr' ? 'Présentez-vous et expliquez votre intérêt pour cette entreprise...' : 'Introduce yourself and explain your interest in this business...'}
                className="min-h-32 resize-none"
              />
              
              <Button
                onClick={sendMessage}
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
                    {t('send')}
                  </>
                )}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
