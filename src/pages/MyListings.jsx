import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { useLanguage } from '@/components/i18n/LanguageContext';
import { useAuth } from '@/lib/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';




import { 
  Plus, 
  Eye, 
  Building2,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  XCircle,
  Loader2,
  Copy,
  ExternalLink,
  Star,
  LayoutList,
  MapPin,
  CalendarDays
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getPrimaryImageUrl } from '@/utils/imageHelpers';
import { sponsorshipService } from '@/services/sponsorshipService';

const statusConfig = {
  active: { label: 'active', color: 'bg-green-100 text-green-700', icon: CheckCircle },
  draft: { label: 'draft', color: 'bg-gray-100 text-gray-600', icon: Clock },
  pending: { label: 'pending', color: 'bg-yellow-100 text-yellow-700', icon: Clock },
  sold: { label: 'sold', color: 'bg-blue-100 text-blue-700', icon: CheckCircle },
  withdrawn: { label: 'withdrawn', color: 'bg-red-100 text-red-600', icon: XCircle },
};

export default function MyListings() {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState({});
  const [myListings, setMyListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [duplicating, setDuplicating] = useState(null);
  const [availableFeaturedSlots, setAvailableFeaturedSlots] = useState(0);
  const [sponsorshipByBusinessId, setSponsorshipByBusinessId] = useState({});
  const [featuredKpi, setFeaturedKpi] = useState({
    activeFeaturedCount: 0,
    activations: 0
  });

  const getRemainingFeaturedDays = (sponsorship) => {
    if (!sponsorship?.ends_at) return 0;
    const remainingMs = new Date(sponsorship.ends_at).getTime() - Date.now();
    if (Number.isNaN(remainingMs) || remainingMs <= 0) return 0;
    return Math.ceil(remainingMs / (1000 * 60 * 60 * 24));
  };

  useEffect(() => {
    loadData();
    
    // Set up interval to refresh data periodically
    const interval = setInterval(() => {
      if (user) {
        loadData();
      }
    }, 5000);
    
    return () => clearInterval(interval);
  }, [user]);

  useEffect(() => {
    filterListings();
  }, [myListings, statusFilter]);

  const loadData = async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    
    try {
      console.log('Loading listings for user:', user.id);
      const listings = await base44.entities.Business.filter(
        { seller_id: user.id }
      );
      console.log('Loaded listings:', listings);

      const [slots, sponsorships, kpi] = await Promise.all([
        sponsorshipService.getMyAvailableSponsoredSlots(user.id).catch(() => 0),
        sponsorshipService.getMySponsorships(user.id).catch(() => []),
        sponsorshipService.getMyFeaturedKpi(user.id).catch(() => ({ activeFeaturedCount: 0, activations: 0 }))
      ]);

      const sponsorshipMap = (sponsorships || []).reduce((acc, item) => {
        if (item?.business_id && item.status === 'active' && new Date(item.ends_at).getTime() > Date.now()) {
          acc[item.business_id] = item;
        }
        return acc;
      }, {});

      console.log('[MyListings][Sponsorship][loadData]', {
        userId: user.id,
        totalListings: Number((listings || []).length),
        availableFeaturedSlots: Number(slots || 0),
        activeSponsorships: Number(Object.keys(sponsorshipMap).length),
        sponsorshipsRawCount: Number((sponsorships || []).length)
      });

      setAvailableFeaturedSlots(Number(slots || 0));
      setFeaturedKpi(kpi || { activeFeaturedCount: 0, activations: 0 });
      setSponsorshipByBusinessId(sponsorshipMap);
      
      // Just load listings - don't try to update missing references since that column may not exist
      setMyListings(listings || []);
    } catch (e) {
      console.error('Error loading listings:', e);
      setMyListings([]);
    }
    setLoading(false);
  };

  const filterListings = () => {
    if (statusFilter === 'all') {
      setFilteredListings(myListings);
    } else {
      setFilteredListings(myListings.filter(l => l.status === statusFilter));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(language === 'fr' ? 'Êtes-vous sûr de vouloir supprimer cette annonce ?' : 'Are you sure you want to delete this listing?')) {
      return;
    }
    
    setUpdating(prev => ({ ...prev, [id]: 'deleting' }));
    try {
      await base44.entities.Business.delete(id);
      setMyListings(myListings.filter(l => l.id !== id));
    } catch (e) {
      console.error('Error deleting listing:', e);
      alert(language === 'fr' ? 'Erreur lors de la suppression' : 'Error deleting listing');
    }
    setUpdating(prev => ({ ...prev, [id]: null }));
  };

  const handleStatusChange = async (id, status) => {
    setUpdating(prev => ({ ...prev, [id]: 'updating' }));
    try {
      await base44.entities.Business.update(id, { status });
      setMyListings(myListings.map(l => l.id === id ? { ...l, status } : l));
    } catch (e) {
      console.error('Error updating status:', e);
      alert(language === 'fr' ? 'Erreur lors de la mise à jour' : 'Error updating status');
    }
    setUpdating(prev => ({ ...prev, [id]: null }));
  };

  const handleDuplicate = async (listing) => {
    setDuplicating(listing.id);
    try {
      const newTitle = `${listing.title} ${language === 'fr' ? '(Copie)' : '(Copy)'}`;
      
      // Only include fields that exist in the schema
      const newData = {
        title: newTitle,
        description: listing.description,
        sector: listing.sector,
        asking_price: listing.asking_price,
        annual_revenue: listing.annual_revenue,
        ebitda: listing.ebitda,
        employees: listing.employees,
        location: listing.location,
        country: listing.country,
        region: listing.region,
        year_founded: listing.year_founded,
        reason_for_sale: listing.reason_for_sale,
        confidential: listing.confidential,
        assets_included: Array.isArray(listing.assets_included) ? listing.assets_included : [],
        images: Array.isArray(listing.images) ? listing.images : [],
        legal_structure: listing.legal_structure,
        registration_number: listing.registration_number,
        lease_info: listing.lease_info,
        licenses: listing.licenses,
        financial_years: Array.isArray(listing.financial_years) ? listing.financial_years : [],
        market_position: listing.market_position,
        competitive_advantages: listing.competitive_advantages,
        growth_opportunities: listing.growth_opportunities,
        customer_base: listing.customer_base,
        status: 'draft',
        views_count: 0,
        seller_id: user?.id,
        type: listing.type,
        buyer_budget_min: listing.buyer_budget_min,
        buyer_budget_max: listing.buyer_budget_max,
        buyer_sectors_interested: Array.isArray(listing.buyer_sectors_interested) ? listing.buyer_sectors_interested : [],
        buyer_locations: Array.isArray(listing.buyer_locations) ? listing.buyer_locations : [],
        buyer_employees_min: listing.buyer_employees_min,
        buyer_employees_max: listing.buyer_employees_max,
        buyer_revenue_min: listing.buyer_revenue_min,
        buyer_revenue_max: listing.buyer_revenue_max,
        buyer_investment_available: listing.buyer_investment_available,
        buyer_profile_type: listing.buyer_profile_type,
        buyer_notes: listing.buyer_notes
      };
      
      const result = await base44.entities.Business.create(newData);
      setMyListings(prev => [...prev, result]);
      
      const message = language === 'fr' 
        ? `Annonce dupliquée avec succès` 
        : `Listing duplicated successfully`;
      alert(message);
    } catch (e) {
      console.error('Error duplicating listing:', e);
      alert(language === 'fr' ? 'Erreur lors de la duplication' : 'Error duplicating listing');
    }
    setDuplicating(null);
  };

  const totalViews = myListings.reduce((sum, l) => sum + (l.views_count || 0), 0);
  const activeListings = myListings.filter(l => l.status === 'active').length;

  const handleActivateFeatured = async (listing) => {
    try {
      setUpdating(prev => ({ ...prev, [listing.id]: 'featuring' }));
      const requestedDays = 1;
      console.log('[MyListings][Sponsorship][activate][before]', {
        listingId: listing.id,
        requestedDays,
        listingStatus: listing.status,
        availableFeaturedSlots
      });
      await sponsorshipService.activateSponsoredListingForDays(listing.id, requestedDays);

      const [slots, sponsorships, kpi] = await Promise.all([
        sponsorshipService.getMyAvailableSponsoredSlots(user?.id).catch(() => 0),
        sponsorshipService.getMySponsorships(user?.id).catch(() => []),
        sponsorshipService.getMyFeaturedKpi(user?.id).catch(() => ({ activeFeaturedCount: 0, activations: 0 }))
      ]);

      const sponsorshipMap = (sponsorships || []).reduce((acc, item) => {
        if (item?.business_id && item.status === 'active' && new Date(item.ends_at).getTime() > Date.now()) {
          acc[item.business_id] = item;
        }
        return acc;
      }, {});

      console.log('[MyListings][Sponsorship][activate][after]', {
        listingId: listing.id,
        availableFeaturedSlots: Number(slots || 0),
        activeSponsorships: Number(Object.keys(sponsorshipMap).length),
        activeSponsorshipEndsAt: sponsorshipMap[listing.id]?.ends_at || null
      });

      setAvailableFeaturedSlots(Number(slots || 0));
      setFeaturedKpi(kpi || { activeFeaturedCount: 0, activations: 0 });
      setSponsorshipByBusinessId(sponsorshipMap);

      alert(
        language === 'fr'
          ? `Annonce activée en À la une pour ${requestedDays} jour(s).`
          : `Listing activated as featured for ${requestedDays} day(s).`
      );
    } catch (error) {
      const msg = String(error?.message || '');
      if (msg.includes('BILLING_RUNTIME_UNAVAILABLE')) {
        alert(
          language === 'fr'
            ? 'La facturation sponsorisée n’est pas encore activée sur cet environnement.'
            : 'Sponsored billing is not enabled on this environment yet.'
        );
      } else
      if (msg.includes('NO_SPONSORED_DAYS_AVAILABLE') || msg.includes('NO_SPONSORED_SLOT_AVAILABLE')) {
        alert(
          language === 'fr'
            ? 'Vous n’avez pas assez de jours sponsorisés disponibles.'
            : 'You do not have enough sponsored days available.'
        );
      } else if (msg.includes('BUSINESS_ALREADY_FEATURED')) {
        alert(language === 'fr' ? 'Cette annonce est déjà À la une.' : 'This listing is already featured.');
      } else if (msg.includes('BUSINESS_NOT_ACTIVE')) {
        alert(language === 'fr' ? 'L’annonce doit être active pour être mise À la une.' : 'Listing must be active to be featured.');
      } else {
        alert(language === 'fr' ? 'Impossible d’activer l’annonce.' : 'Unable to activate listing.');
      }
    } finally {
      setUpdating(prev => ({ ...prev, [listing.id]: null }));
    }
  };

  const handleDeactivateFeatured = async (listing) => {
    try {
      setUpdating(prev => ({ ...prev, [listing.id]: 'unfeaturing' }));
      const result = await sponsorshipService.deactivateSponsoredListing(listing.id);

      const [slots, sponsorships, kpi] = await Promise.all([
        sponsorshipService.getMyAvailableSponsoredSlots(user?.id).catch(() => 0),
        sponsorshipService.getMySponsorships(user?.id).catch(() => []),
        sponsorshipService.getMyFeaturedKpi(user?.id).catch(() => ({ activeFeaturedCount: 0, activations: 0 }))
      ]);

      const sponsorshipMap = (sponsorships || []).reduce((acc, item) => {
        if (item?.business_id && item.status === 'active' && new Date(item.ends_at).getTime() > Date.now()) {
          acc[item.business_id] = item;
        }
        return acc;
      }, {});

      setAvailableFeaturedSlots(Number(slots || 0));
      setFeaturedKpi(kpi || { activeFeaturedCount: 0, activations: 0 });
      setSponsorshipByBusinessId(sponsorshipMap);

      const refundedDays = Math.max(0, Number(result?.refunded_days || 0));
      alert(
        language === 'fr'
          ? `Mise à la une désactivée. ${refundedDays} jour(s) restitué(s).`
          : `Featured status removed. ${refundedDays} day(s) refunded.`
      );
    } catch (error) {
      const msg = String(error?.message || '');
      if (msg.includes('BILLING_RUNTIME_UNAVAILABLE')) {
        alert(
          language === 'fr'
            ? 'La facturation sponsorisée n’est pas encore activée sur cet environnement.'
            : 'Sponsored billing is not enabled on this environment yet.'
        );
      } else if (msg.includes('SPONSORSHIP_NOT_ACTIVE')) {
        alert(language === 'fr' ? 'Cette annonce n’est pas actuellement À la une.' : 'This listing is not currently featured.');
      } else {
        alert(language === 'fr' ? 'Impossible de désactiver la mise à la une.' : 'Unable to disable featured status.');
      }
    } finally {
      setUpdating(prev => ({ ...prev, [listing.id]: null }));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 lg:py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="font-display text-3xl sm:text-4xl font-bold text-gray-900 mb-1">
                {t('my_listings')}
              </h1>
              <p className="text-sm sm:text-base text-gray-500">
                {language === 'fr'
                  ? 'Pilotez vos annonces, leurs performances et vos mises à la une.'
                  : 'Manage your listings, performance, and featured activations.'}
              </p>
            </div>
            <Button
              onClick={() => navigate(createPageUrl('CreateBusiness'))}
              className="bg-primary hover:bg-primary-hover text-primary-foreground shadow-sm"
            >
              <Plus className="w-4 h-4 mr-2" />
              {t('create_listing')}
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Card className="border border-primary/10 bg-white shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                    {language === 'fr' ? 'Mes annonces' : 'My listings'}
                  </p>
                  <LayoutList className="w-4 h-4 text-primary" />
                </div>
                <p className="text-2xl font-bold text-gray-900 leading-none">{myListings.length}</p>
                <p className="text-xs text-gray-500 mt-3">
                  {activeListings} {language === 'fr' ? 'actif(s)' : 'active'} • {totalViews} {language === 'fr' ? 'vues' : 'views'}
                </p>
              </CardContent>
            </Card>

            <Card className="border border-[#FFD8CC] bg-[#FFF9F7] shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <p className="text-xs font-medium uppercase tracking-wide text-[#B5472F]">
                    {language === 'fr' ? 'À la une' : 'Featured days'}
                  </p>
                  <CalendarDays className="w-4 h-4 text-[#B5472F]" />
                </div>
                <p className="text-2xl font-bold text-[#B5472F] leading-none">{availableFeaturedSlots}</p>
                <p className="text-xs text-[#B5472F]/80 mt-3">
                  {language === 'fr' ? 'Jours disponibles' : 'Available days'}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Status Filter */}
        {myListings.length > 0 && (
          <div className="mb-6 flex gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder={language === 'fr' ? 'Filtrer par statut' : 'Filter by status'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{language === 'fr' ? 'Tous' : 'All'}</SelectItem>
                <SelectItem value="active">{t('active')}</SelectItem>
                <SelectItem value="draft">{t('draft')}</SelectItem>
                <SelectItem value="sold">{t('sold')}</SelectItem>
                <SelectItem value="withdrawn">{language === 'fr' ? 'Archivée' : 'Withdrawn'}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Empty State */}
        {myListings.length === 0 ? (
          <Card className="border-0 shadow-sm">
            <CardContent className="py-16 text-center">
              <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <Building2 className="w-8 h-8 text-gray-300" />
              </div>
              <h3 className="font-display text-lg font-semibold text-gray-900 mb-2">
                {language === 'fr' ? 'Aucune annonce' : 'No listings yet'}
              </h3>
              <p className="text-gray-500 mb-6">
                {language === 'fr' ? 'Publiez votre première annonce' : 'Publish your first listing'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {filteredListings.map((listing) => {
                const status = statusConfig[listing.status] || statusConfig.active;
                const StatusIcon = status.icon;
                const activeSponsorship = sponsorshipByBusinessId[listing.id];
                const isFeatured = Boolean(activeSponsorship);
                const remainingFeaturedDays = isFeatured ? getRemainingFeaturedDays(activeSponsorship) : 0;

                if (isFeatured) {
                  console.log('[MyListings][Sponsorship][render][featured]', {
                    listingId: listing.id,
                    endsAt: activeSponsorship?.ends_at || null,
                    remainingFeaturedDays
                  });
                }
                
                return (
                  <motion.div
                    key={listing.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    layout
                  >
                    <Card className="group overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 rounded-xl">
                      <div className="flex flex-col lg:flex-row">
                        {/* Zone média gauche */}
                        <div className="relative h-40 sm:h-44 lg:h-auto lg:w-56 shrink-0 overflow-hidden bg-gradient-to-br from-gray-200 to-gray-100">
                          <img
                            src={getPrimaryImageUrl(listing)}
                            alt={listing.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />

                          <div className="absolute top-3 left-3 flex flex-col gap-2">
                            <Badge className={`${status.color} border-0 text-xs`}>
                              <StatusIcon className="w-3 h-3 mr-1" />
                              {t(status.label)}
                            </Badge>
                            {isFeatured && (
                              <Badge className="bg-[#FFF4EF] text-[#B5472F] border border-[#FFD8CC] text-[10px]">
                                <Star className="w-3 h-3 mr-1" />
                                {activeSponsorship.display_label || (language === 'fr' ? 'À la une' : 'Featured')}
                              </Badge>
                            )}
                            {isFeatured && (
                              <Badge className="bg-[#FFF4EF] text-[#B5472F] border border-[#FFD8CC] text-[10px]">
                                {language === 'fr'
                                  ? `${remainingFeaturedDays} jour(s) restant(s)`
                                  : `${remainingFeaturedDays} day(s) remaining`}
                              </Badge>
                            )}
                          </div>
                        </div>

                        {/* Zone contenu + prix */}
                        <CardContent className="p-3 sm:p-4 lg:p-4 flex-1">
                          <div className="flex flex-col h-full gap-3">
                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                              <div className="min-w-0">
                                <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 mb-2">
                                  <Badge className="bg-blue-50 text-blue-700 border-0 text-[10px]">
                                    {listing.type === 'acquisition'
                                      ? (language === 'fr' ? 'Acquisition' : 'Acquisition')
                                      : (language === 'fr' ? 'Cession' : 'Sale')}
                                  </Badge>
                                  {listing.business_type && (
                                    <Badge variant="secondary" className="bg-gray-100 text-gray-600 text-[10px]">
                                      {t(listing.business_type)}
                                    </Badge>
                                  )}
                                  {listing.reference_number && (
                                    <Badge variant="secondary" className="bg-gray-900 text-white font-mono text-[10px]">
                                      {listing.reference_number}
                                    </Badge>
                                  )}
                                </div>

                                <h3 className="font-semibold text-gray-900 text-xl leading-tight line-clamp-2 mb-1.5">
                                  {listing.title}
                                </h3>

                                <p className="text-sm text-gray-500 flex items-center gap-1.5">
                                  <MapPin className="w-4 h-4" />
                                  <span>{listing.location || (language === 'fr' ? 'Localisation non précisée' : 'Location not specified')}</span>
                                </p>
                              </div>

                              <div className="sm:text-right shrink-0">
                                <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">
                                  {language === 'fr' ? 'Prix' : 'Price'}
                                </p>
                                <p className="font-mono text-3xl font-bold text-primary leading-none">
                                  {new Intl.NumberFormat('fr-FR', {
                                    style: 'currency',
                                    currency: 'EUR',
                                    maximumFractionDigits: 0,
                                    notation: 'compact'
                                  }).format(listing.asking_price)}
                                </p>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 xl:grid-cols-4 gap-2 pt-3 border-t border-gray-100">
                              <div>
                                <p className="text-xs text-gray-400 mb-1">{language === 'fr' ? 'CA annuel' : 'Annual revenue'}</p>
                                <p className="font-mono text-lg font-semibold text-gray-700 leading-none">
                                  {listing.annual_revenue
                                    ? new Intl.NumberFormat('fr-FR', {
                                        style: 'currency',
                                        currency: 'EUR',
                                        maximumFractionDigits: 0,
                                        notation: 'compact'
                                      }).format(listing.annual_revenue)
                                    : '—'}
                                </p>
                              </div>

                              <div>
                                <p className="text-xs text-gray-400 mb-1">{language === 'fr' ? 'Employés' : 'Employees'}</p>
                                <p className="font-mono text-lg font-semibold text-gray-700 leading-none">
                                  {listing.employees ?? '—'}
                                </p>
                              </div>

                              <div>
                                <p className="text-xs text-gray-400 mb-1">{language === 'fr' ? 'Certif.' : 'Certified'}</p>
                                <p className="text-lg font-semibold leading-none text-gray-700">
                                  {listing.is_certified ? '✓' : '—'}
                                </p>
                              </div>

                              <div>
                                <p className="text-xs text-gray-400 mb-1">{language === 'fr' ? 'Vues' : 'Views'}</p>
                                <p className="font-mono text-lg font-semibold text-gray-700 leading-none inline-flex items-center gap-1">
                                  <Eye className="w-4 h-4" />
                                  {listing.views_count || 0}
                                </p>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </div>

                      {/* Barre actions basse */}
                      <div className="border-t border-gray-100 bg-gray-50/70 px-3 sm:px-4 lg:px-4 py-2.5">
                        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                          <div className="flex flex-wrap items-center gap-2">
                            <Button
                              size="sm"
                              variant={isFeatured ? 'secondary' : 'outline'}
                              className="h-8"
                              onClick={() => (isFeatured ? handleDeactivateFeatured(listing) : handleActivateFeatured(listing))}
                              disabled={
                                updating[listing.id] ||
                                listing.status !== 'active' ||
                                (!isFeatured && availableFeaturedSlots <= 0)
                              }
                              title={
                                isFeatured
                                  ? (language === 'fr' ? 'Désactiver À la une' : 'Disable featured')
                                  : availableFeaturedSlots <= 0
                                  ? (language === 'fr' ? 'Aucun jour sponsorisé disponible' : 'No sponsored days available')
                                  : (language === 'fr' ? 'Activer À la une' : 'Activate featured')
                              }
                            >
                              {updating[listing.id] === 'featuring' || updating[listing.id] === 'unfeaturing'
                                ? <Loader2 className="w-4 h-4 animate-spin" />
                                : <Star className="w-4 h-4" />}
                              {isFeatured ? (language === 'fr' ? 'Retirer' : 'Remove') : (language === 'fr' ? 'À la une' : 'Featured')}
                            </Button>

                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8"
                              onClick={() => navigate(createPageUrl(`CreateBusiness?edit=${listing.id}`))}
                              disabled={updating[listing.id]}
                              title={language === 'fr' ? 'Modifier' : 'Edit'}
                            >
                              <Edit className="w-4 h-4" />
                              {language === 'fr' ? 'Modifier' : 'Edit'}
                            </Button>

                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8"
                              onClick={() => handleDuplicate(listing)}
                              disabled={duplicating === listing.id}
                              title={language === 'fr' ? 'Dupliquer' : 'Duplicate'}
                            >
                              {duplicating === listing.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Copy className="w-4 h-4" />}
                              {language === 'fr' ? 'Dupliquer' : 'Duplicate'}
                            </Button>

                            <Button
                              size="sm"
                              className="h-8 bg-success hover:bg-success/90 text-white"
                              onClick={() => handleStatusChange(listing.id, 'sold')}
                              disabled={updating[listing.id] || listing.status === 'sold'}
                              title={language === 'fr' ? 'Marquer comme vendu' : 'Mark as sold'}
                            >
                              <CheckCircle className="w-4 h-4" />
                              {language === 'fr' ? 'Vendue' : 'Sold'}
                            </Button>

                            <Button
                              size="sm"
                              variant="destructive"
                              className="h-8"
                              onClick={() => handleDelete(listing.id)}
                              disabled={updating[listing.id]}
                              title={language === 'fr' ? 'Supprimer' : 'Delete'}
                            >
                              <Trash2 className="w-4 h-4" />
                              {language === 'fr' ? 'Supprimer' : 'Delete'}
                            </Button>
                          </div>

                          <Button
                            size="sm"
                            className="h-9 bg-primary hover:bg-primary-hover text-primary-foreground px-4 self-start lg:self-auto"
                            onClick={() => window.open(createPageUrl(`BusinessDetails?id=${listing.id}`), '_blank')}
                            title={language === 'fr' ? 'Voir l’annonce' : 'View listing'}
                          >
                            <ExternalLink className="w-4 h-4" />
                            {language === 'fr' ? 'Voir l’annonce' : 'View listing'}
                          </Button>
                        </div>

                        {listing.status !== 'active' && (
                          <p className="text-[11px] text-gray-500 leading-snug mt-2">
                            {language === 'fr'
                              ? 'Mettez l’annonce en actif pour activer la mise à la une.'
                              : 'Set listing to active before enabling featured mode.'}
                          </p>
                        )}
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
