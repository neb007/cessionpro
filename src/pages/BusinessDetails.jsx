import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { supabase } from '@/api/supabaseClient';
import { useAuth } from '@/lib/AuthContext';
import { sendBusinessMessage } from '@/services/businessMessagingService';
import { recordPageView, getUniqueViewCount } from '@/services/pageViewService';
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
import BentoPhotoGallery from '@/components/BentoPhotoGallery';
import { getBusinessImageList, getPrimaryImageUrl } from '@/utils/imageHelpers';
import LogoCard from '@/components/ui/LogoCard';
import { FRENCH_DEPARTMENTS } from '@/utils/frenchDepartmentsData';
import { EUROPEAN_COUNTRIES } from '@/utils/europeanCountries';

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

const getLocationLabel = (value, language) => {
  const department = FRENCH_DEPARTMENTS.find((dept) => dept.value === value);
  if (department) return department.label;
  const country = EUROPEAN_COUNTRIES.find((item) => item.value === value);
  if (country) return country.label;
  return value;
};

export default function BusinessDetails() {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const { user: authUser } = useAuth();
  
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showContactModal, setShowContactModal] = useState(false);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [messageSent, setMessageSent] = useState(false);
  const [viewCount, setViewCount] = useState(0);
  const [businessLogo, setBusinessLogo] = useState(null);
  const [sellerFallbackLogo, setSellerFallbackLogo] = useState(null);
  const shouldShowLogo = Boolean(businessLogo?.logo_url || sellerFallbackLogo);
  const displayLogoUrl = businessLogo?.logo_url || sellerFallbackLogo;

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (business?.id) {
      loadBusinessLogo();
    }
  }, [business?.id]);

  useEffect(() => {
    if (authUser) {
      setUser(authUser);
    }
  }, [authUser]);

  const loadBusinessLogo = async () => {
    try {
      console.log('Loading logo for business:', business.id);
      const { data, error } = await supabase
        .from('business_logos')
        .select('logo_url')
        .eq('business_id', business.id)
        .maybeSingle();

      if (error) {
        console.log('Logo not found or error:', error.message);
      }

      if (data) {
        console.log('Logo found:', data);
        setBusinessLogo(data);
        return;
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
      
      // Record page view and get unique count
      await recordPageView(businessData[0].id, null, businessData[0].seller_email);
      const uniqueViews = await getUniqueViewCount(businessData[0].id);
      setViewCount(uniqueViews);

      try {
        const { data: authData } = await supabase.auth.getUser();
        const userData = authUser || authData?.user;
        if (!userData) return;

        setUser(userData);

        const favs = await base44.entities.Favorite.filter({ 
          user_id: userData.id,
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
      window.location.href = '/login';
      return;
    }

    try {
      if (isFavorite) {
        const favs = await base44.entities.Favorite.filter({ 
          user_id: user.id, 
          business_id: business.id 
        });
        if (favs[0]) {
          await base44.entities.Favorite.delete(favs[0].id);
          setIsFavorite(false);
        }
      } else {
        await base44.entities.Favorite.create({ 
          user_id: user.id, 
          business_id: business.id 
        });
        setIsFavorite(true);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const handleContact = async () => {
    const currentUser = authUser || user;
    if (!currentUser) {
      window.location.href = '/login';
      return;
    }
    if (!user) {
      setUser(currentUser);
    }
    setShowContactModal(true);
  };

  const sendMessage = async () => {
    if (!message.trim()) return;
    const currentUser = authUser || user;
    if (!currentUser) {
      window.location.href = '/login';
      return;
    }
    if (!user) {
      setUser(currentUser);
    }
    setSending(true);
    try {
      await sendBusinessMessage({
        business,
        buyerEmail: currentUser.email,
        buyerName: currentUser.user_metadata?.full_name || currentUser.email,
        message,
      });

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

        {/* Image Gallery - Bento Style */}
        <div className="mb-8">
          {business.confidential && (
            <div className="absolute top-4 left-4 z-10">
              <Badge className="bg-gray-900/80 text-white border-0">
                <Lock className="w-3 h-3 mr-1" />
                {t('confidential')}
              </Badge>
            </div>
          )}
          <BentoPhotoGallery business={business} language={language} />
        </div>

        {/* Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h1 className="font-display text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                {business.title}
              </h1>
              <div className="flex items-center justify-between gap-4 mb-4">
                <div className="flex flex-wrap items-center gap-2 text-xs flex-1">
                  <span 
                    style={{ 
                      fontFamily: 'JetBrains Mono, monospace',
                      fontWeight: 500,
                      fontSize: '14px',
                      color: 'white',
                      backgroundColor: '#f47e50',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      display: 'inline-block'
                    }}
                  >
                    {business.type === 'acquisition' ? (language === 'fr' ? 'Acquisition' : 'Acquisition') : (language === 'fr' ? 'Cession' : 'Sale')}
                  </span>
                  {business.business_type && (
                    <span 
                      style={{ 
                        fontFamily: 'JetBrains Mono, monospace',
                        fontWeight: 500,
                        fontSize: '14px',
                        color: 'white',
                        backgroundColor: '#f47e50',
                        padding: '8px 12px',
                        borderRadius: '6px',
                        display: 'inline-block'
                      }}
                    >
                      {t(business.business_type)}
                    </span>
                  )}
                  {business.reference_number && (
                    <span 
                      style={{ 
                        fontFamily: 'JetBrains Mono, monospace',
                        fontWeight: 500,
                        fontSize: '14px',
                        color: 'white',
                        backgroundColor: '#f47e50',
                        padding: '8px 12px',
                        borderRadius: '6px',
                        display: 'inline-block'
                      }}
                    >
                      {business.reference_number}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-gray-50 text-sm text-gray-600 whitespace-nowrap">
                  <Eye className="w-4 h-4" />
                  <span className="font-mono font-semibold">{business.views_count || 0}</span>
                  <span className="text-xs">{t('views')}</span>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2 mb-4 text-xs hidden">
                <Badge className="bg-blue-50 text-blue-700 border-0">
                  {business.type === 'acquisition' ? (language === 'fr' ? 'Acquisition' : 'Acquisition') : (language === 'fr' ? 'Cession' : 'Sale')}
                </Badge>
                {business.business_type && (
                  <Badge variant="secondary" className="bg-gray-100 text-gray-600">
                    {t(business.business_type)}
                  </Badge>
                )}
                {business.reference_number && (
                  <Badge variant="secondary" className="bg-gray-900 text-white font-mono">
                    {business.reference_number}
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-4 text-gray-500">
                {!business.hide_location && (
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4" />
                    {business.location}, {t(business.country)}
                  </div>
                )}
                {business.year_founded && (
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    {t('founded')} {business.year_founded}
                  </div>
                )}
              </div>
            </div>

            {/* Key Metrics - CESSION */}
            {business.type === 'cession' && (
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
            )}

            {/* Key Metrics - ACQUISITION */}
            {business.type === 'acquisition' && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { label: language === 'fr' ? 'Budget Min' : 'Min Budget', value: formatPrice(business.buyer_budget_min), color: 'from-primary/10 to-blue-50' },
                  { label: language === 'fr' ? 'Budget Max' : 'Max Budget', value: formatPrice(business.buyer_budget_max), color: 'from-green-50 to-emerald-50' },
                  { label: language === 'fr' ? 'Financement' : 'Investment', value: formatPrice(business.buyer_investment_available), color: 'from-violet-50 to-purple-50' },
                  { label: language === 'fr' ? 'Secteurs' : 'Sectors', value: business.buyer_sectors_interested?.length || 0, color: 'from-orange-50 to-amber-50' },
                ].map((metric, idx) => (
                  <Card key={idx} className="border-0 shadow-sm overflow-hidden">
                    <CardContent className={`p-4 bg-gradient-to-br ${metric.color}`}>
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{metric.label}</p>
                      <p className="font-mono text-xl font-bold text-gray-900">{metric.value}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

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

            {/* Details - CESSION only */}
            {business.type === 'cession' && (business.reason_for_sale || business.assets_included?.length > 0) && (
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
                            <div key={idx} className="flex items-center gap-1 text-gray-900" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 500, fontSize: '16px' }}>
                              <CheckCircle2 className="w-3 h-3 text-green-500" />
                              <span>{asset}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

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

            {/* Market & Strategic Info - CESSION */}
            {business.type === 'cession' && (business.market_position || business.competitive_advantages || business.growth_opportunities || business.customer_base) && (
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

            {/* ACQUISITION CRITERIA - Full Display */}
            {business.type === 'acquisition' && (
              <>
                {/* Budget & Financing */}
                <Card className="border-0 shadow-sm">
                  <CardContent className="p-6">
                    <h2 className="font-display text-xl font-semibold text-gray-900 mb-4">
                      {language === 'fr' ? 'Budget & Financement' : 'Budget & Financing'}
                    </h2>
                    <div className="grid sm:grid-cols-3 gap-6">
                      {business.buyer_budget_min && (
                        <div>
                          <p className="text-sm text-gray-500 mb-1">{language === 'fr' ? 'Budget Minimum' : 'Minimum Budget'}</p>
                          <p className="font-mono text-lg font-bold text-gray-900">{formatPrice(business.buyer_budget_min)}</p>
                        </div>
                      )}
                      {business.buyer_budget_max && (
                        <div>
                          <p className="text-sm text-gray-500 mb-1">{language === 'fr' ? 'Budget Maximum' : 'Maximum Budget'}</p>
                          <p className="font-mono text-lg font-bold text-gray-900">{formatPrice(business.buyer_budget_max)}</p>
                        </div>
                      )}
                      {business.buyer_investment_available && (
                        <div>
                          <p className="text-sm text-gray-500 mb-1">{language === 'fr' ? 'Financement Disponible' : 'Available Investment'}</p>
                          <p className="font-mono text-lg font-bold text-gray-900">{formatPrice(business.buyer_investment_available)}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Search Criteria */}
                <Card className="border-0 shadow-sm">
                  <CardContent className="p-6">
                    <h2 className="font-display text-xl font-semibold text-gray-900 mb-4">
                      {language === 'fr' ? 'Critères de Recherche' : 'Search Criteria'}
                    </h2>
                    <div className="space-y-6">
                      {business.buyer_sectors_interested?.length > 0 && (
                        <div>
                          <p className="text-sm text-gray-500 mb-3">{language === 'fr' ? 'Secteurs d\'intérêt' : 'Interested Sectors'}</p>
                          <div className="flex flex-wrap gap-2">
                            {business.buyer_sectors_interested.map((sector, idx) => (
                              <Badge key={idx} className="bg-primary/10 text-primary border-0">
                                {t(sector)}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      {business.business_type_sought && (
                        <div>
                          <p className="text-sm text-gray-500 mb-1">{language === 'fr' ? 'Type de Cession Recherché' : 'Business Type Sought'}</p>
                          <p className="font-medium text-gray-900">
                            {business.business_type_sought === 'entreprise' ? (language === 'fr' ? 'Entreprise' : 'Company') :
                             business.business_type_sought === 'fond_de_commerce' ? (language === 'fr' ? 'Fond de Commerce' : 'Business Fund') :
                             (language === 'fr' ? 'Franchise' : 'Franchise')}
                          </p>
                        </div>
                      )}
                      <div className="grid sm:grid-cols-2 gap-4">
                        {business.buyer_revenue_min && (
                          <div>
                            <p className="text-sm text-gray-500 mb-1">{language === 'fr' ? 'CA Minimum (€)' : 'Minimum Revenue (€)'}</p>
                            <p className="font-mono font-medium text-gray-900">{formatPrice(business.buyer_revenue_min)}</p>
                          </div>
                        )}
                        {business.buyer_revenue_max && (
                          <div>
                            <p className="text-sm text-gray-500 mb-1">{language === 'fr' ? 'CA Maximum (€)' : 'Maximum Revenue (€)'}</p>
                            <p className="font-mono font-medium text-gray-900">{formatPrice(business.buyer_revenue_max)}</p>
                          </div>
                        )}
                        {business.buyer_employees_min && (
                          <div>
                            <p className="text-sm text-gray-500 mb-1">{language === 'fr' ? 'Employés Min' : 'Minimum Employees'}</p>
                            <p className="font-mono font-medium text-gray-900">{business.buyer_employees_min}</p>
                          </div>
                        )}
                        {business.buyer_employees_max && (
                          <div>
                            <p className="text-sm text-gray-500 mb-1">{language === 'fr' ? 'Employés Max' : 'Maximum Employees'}</p>
                            <p className="font-mono font-medium text-gray-900">{business.buyer_employees_max}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Buyer Profile */}
                <Card className="border-0 shadow-sm">
                  <CardContent className="p-6">
                    <h2 className="font-display text-xl font-semibold text-gray-900 mb-4">
                      {language === 'fr' ? 'Profil de l\'Acheteur' : 'Buyer Profile'}
                    </h2>
                    <div className="space-y-6">
                      {business.buyer_profile_type && (
                        <div>
                          <p className="text-sm text-gray-500 mb-1">{language === 'fr' ? 'Type de Profil' : 'Profile Type'}</p>
                          <p className="font-medium text-gray-900">
                            {business.buyer_profile_type === 'individual' ? (language === 'fr' ? 'Reprise personnelle' : 'Individual Buyout') :
                             business.buyer_profile_type === 'investor' ? (language === 'fr' ? 'Investisseur' : 'Investor') :
                             business.buyer_profile_type === 'pe_fund' ? (language === 'fr' ? 'Fonds de capital-investissement' : 'PE Fund') :
                             business.buyer_profile_type === 'company' ? (language === 'fr' ? 'Entreprise' : 'Company') :
                             (language === 'fr' ? 'Autre' : 'Other')}
                          </p>
                        </div>
                      )}
                      {business.buyer_locations?.length > 0 && (
                        <div>
                          <p className="text-sm text-gray-500 mb-3">{language === 'fr' ? 'Lieux d\'intérêt' : 'Interested Locations'}</p>
                          <div className="flex flex-wrap gap-2">
                            {business.buyer_locations.map((location, idx) => (
                              <Badge key={idx} className="bg-primary/10 text-primary border-0">
                                {getLocationLabel(location, language)}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      {business.buyer_document_url && (
                        <div>
                          <p className="text-sm text-gray-500 mb-3">{language === 'fr' ? 'Document joint' : 'Attached Document'}</p>
                          <a
                            href={business.buyer_document_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-primary hover:underline"
                          >
                            <FileText className="w-4 h-4" />
                            <span className="text-sm font-medium">
                              {business.buyer_document_name || (language === 'fr' ? 'Voir le document' : 'View document')}
                            </span>
                          </a>
                        </div>
                      )}
                      {business.buyer_notes && (
                        <div>
                          <p className="text-sm text-gray-500 mb-1">{language === 'fr' ? 'Notes et Critères Additionnels' : 'Additional Notes & Criteria'}</p>
                          <p className="text-gray-700 whitespace-pre-wrap">{business.buyer_notes}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </>
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
                    {business.type === 'cession' 
                      ? t('contact_seller') 
                      : (language === 'fr' ? 'Contacter l\'acheteur' : 'Contact buyer')}
                  </Button>
                  
                  <div className="flex justify-center">
                    <Button
                      variant="outline"
                      onClick={toggleFavorite}
                      className={`w-full py-6 ${isFavorite ? 'bg-rose-50 border-rose-200 text-rose-600 hover:bg-rose-100' : ''}`}
                    >
                      <Heart className={`w-5 h-5 mr-2 ${isFavorite ? 'fill-current' : ''}`} />
                      {isFavorite ? t('remove_favorite') : t('add_favorite')}
                    </Button>
                  </div>
                </div>

                {/* Vendor Info Section */}
                {shouldShowLogo && (
                  <>
                    <div className="border-t border-gray-200 my-3" />
                    <div className="flex flex-col items-center gap-2">
                      <div className="h-px w-full bg-gray-100" />
                      <LogoCard
                        logoUrl={displayLogoUrl}
                        context="detail"
                        altText="Vendor logo"
                        rounded
                        shadow
                      />
                      <div className="h-px w-full bg-gray-100" />
                    </div>
                  </>
                )}
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