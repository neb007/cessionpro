import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { createBusinessDetailsUrl, createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { useLanguage } from '@/components/i18n/LanguageContext';
import { useAuth } from '@/lib/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
import { toast } from '@/components/ui/use-toast';
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
  CalendarDays,
  Search,
  ArrowUpDown,
  Lightbulb,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getPrimaryImageUrl } from '@/utils/imageHelpers';
import { sponsorshipService } from '@/services/sponsorshipService';
import { computeListingCompletionScore } from '@/utils/listingCompletionScore';
import { PRICING } from '@/constants/pricing';

const statusConfig = {
  active: { label: 'active', color: 'bg-green-100 text-green-700', icon: CheckCircle },
  draft: { label: 'draft', color: 'bg-muted text-muted-foreground', icon: Clock },
  pending: { label: 'pending', color: 'bg-yellow-100 text-yellow-700', icon: Clock },
  sold: { label: 'sold', color: 'bg-blue-100 text-blue-700', icon: CheckCircle },
  withdrawn: { label: 'withdrawn', color: 'bg-red-100 text-red-600', icon: XCircle },
};

const sortFns = {
  created_at_desc: (a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0),
  created_at_asc: (a, b) => new Date(a.created_at || 0) - new Date(b.created_at || 0),
  price_desc: (a, b) => (b.asking_price || 0) - (a.asking_price || 0),
  price_asc: (a, b) => (a.asking_price || 0) - (b.asking_price || 0),
  views_desc: (a, b) => (b.views_count || 0) - (a.views_count || 0),
};

const formatCurrency = (value, language) =>
  new Intl.NumberFormat(language === 'fr' ? 'fr-FR' : 'en-US', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
    notation: 'compact',
  }).format(value);

export default function MyListings() {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isTestLikeEnv =
    import.meta.env.DEV ||
    import.meta.env.MODE === 'test' ||
    String(import.meta.env.VITE_APP_ENV || '').toLowerCase() === 'test';

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState({});
  const [myListings, setMyListings] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('created_at_desc');
  const [duplicating, setDuplicating] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [availableFeaturedSlots, setAvailableFeaturedSlots] = useState(0);
  const [sponsorshipByBusinessId, setSponsorshipByBusinessId] = useState({});
  const [featuredKpi, setFeaturedKpi] = useState({
    activeFeaturedCount: 0,
    activations: 0,
  });

  const getRemainingFeaturedDays = (sponsorship) => {
    if (!sponsorship?.ends_at) return 0;
    const remainingMs = new Date(sponsorship.ends_at).getTime() - Date.now();
    if (Number.isNaN(remainingMs) || remainingMs <= 0) return 0;
    return Math.ceil(remainingMs / (1000 * 60 * 60 * 24));
  };

  // --- Deduplicated sponsorship refresh ---
  const refreshSponsorshipData = async () => {
    const [slots, sponsorships, kpi] = await Promise.all([
      sponsorshipService.getMyAvailableSponsoredSlots(user?.id).catch(() => 0),
      sponsorshipService.getMySponsorships(user?.id).catch(() => []),
      sponsorshipService.getMyFeaturedKpi(user?.id).catch(() => ({ activeFeaturedCount: 0, activations: 0 })),
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
  };

  // --- No polling - load once on mount ---
  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const listings = await base44.entities.Business.filter({ seller_id: user.id });
      await refreshSponsorshipData();
      setMyListings(listings || []);
    } catch (e) {
      console.error('Error loading listings:', e);
      setMyListings([]);
    }
    setLoading(false);
  };

  // --- Unified filtering + search + sort via useMemo ---
  const filteredListings = useMemo(() => {
    let result = myListings;

    if (statusFilter !== 'all') {
      result = result.filter((l) => l.status === statusFilter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((l) => (l.title || '').toLowerCase().includes(q));
    }

    const fn = sortFns[sortBy] || sortFns.created_at_desc;
    return [...result].sort(fn);
  }, [myListings, statusFilter, searchQuery, sortBy]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const id = deleteTarget.id;
    setDeleteTarget(null);
    setUpdating((prev) => ({ ...prev, [id]: 'deleting' }));
    try {
      await base44.entities.Business.delete(id);
      setMyListings((prev) => prev.filter((l) => l.id !== id));
      toast({
        title: language === 'fr' ? 'Annonce supprimée' : 'Listing deleted',
      });
    } catch (e) {
      console.error('Error deleting listing:', e);
      toast({
        title: language === 'fr' ? 'Erreur lors de la suppression' : 'Error deleting listing',
        variant: 'destructive',
      });
    }
    setUpdating((prev) => ({ ...prev, [id]: null }));
  };

  const handleStatusChange = async (id, status) => {
    setUpdating((prev) => ({ ...prev, [id]: 'updating' }));
    try {
      await base44.entities.Business.update(id, { status });
      setMyListings((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
      toast({
        title: language === 'fr' ? 'Statut mis à jour' : 'Status updated',
      });
    } catch (e) {
      console.error('Error updating status:', e);
      toast({
        title: language === 'fr' ? 'Erreur lors de la mise à jour' : 'Error updating status',
        variant: 'destructive',
      });
    }
    setUpdating((prev) => ({ ...prev, [id]: null }));
  };

  const handleDuplicate = async (listing) => {
    setDuplicating(listing.id);
    try {
      const newTitle = `${listing.title} ${language === 'fr' ? '(Copie)' : '(Copy)'}`;
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
        buyer_notes: listing.buyer_notes,
      };

      const result = await base44.entities.Business.create(newData);
      setMyListings((prev) => [...prev, result]);
      toast({
        title: language === 'fr' ? 'Annonce dupliquée avec succès' : 'Listing duplicated successfully',
      });
    } catch (e) {
      console.error('Error duplicating listing:', e);
      toast({
        title: language === 'fr' ? 'Erreur lors de la duplication' : 'Error duplicating listing',
        variant: 'destructive',
      });
    }
    setDuplicating(null);
  };

  const totalViews = myListings.reduce((sum, l) => sum + (l.views_count || 0), 0);
  const activeListings = myListings.filter((l) => l.status === 'active').length;

  const showSponsorshipToast = (error, context) => {
    const msg = String(error?.message || '');
    if (msg.includes('BILLING_RUNTIME_UNAVAILABLE')) {
      if (!isTestLikeEnv) {
        toast({
          title: language === 'fr'
            ? 'La facturation sponsorisée n\'est pas encore activée.'
            : 'Sponsored billing is not enabled yet.',
          variant: 'destructive',
        });
      }
    } else if (msg.includes('NO_SPONSORED_DAYS_AVAILABLE') || msg.includes('NO_SPONSORED_SLOT_AVAILABLE')) {
      toast({
        title: language === 'fr'
          ? 'Vous n\'avez pas assez de jours sponsorisés disponibles.'
          : 'You do not have enough sponsored days available.',
        variant: 'destructive',
      });
    } else if (msg.includes('BUSINESS_ALREADY_FEATURED')) {
      toast({ title: language === 'fr' ? 'Cette annonce est déjà À la une.' : 'This listing is already featured.' });
    } else if (msg.includes('BUSINESS_NOT_ACTIVE')) {
      toast({
        title: language === 'fr' ? 'L\'annonce doit être active pour être mise À la une.' : 'Listing must be active to be featured.',
        variant: 'destructive',
      });
    } else if (msg.includes('SPONSORSHIP_NOT_ACTIVE')) {
      toast({ title: language === 'fr' ? 'Cette annonce n\'est pas actuellement À la une.' : 'This listing is not currently featured.' });
    } else {
      toast({
        title: context === 'activate'
          ? (language === 'fr' ? 'Impossible d\'activer l\'annonce.' : 'Unable to activate listing.')
          : (language === 'fr' ? 'Impossible de désactiver la mise à la une.' : 'Unable to disable featured status.'),
        variant: 'destructive',
      });
    }
  };

  const handleActivateFeatured = async (listing) => {
    try {
      setUpdating((prev) => ({ ...prev, [listing.id]: 'featuring' }));
      const requestedDays = 1;
      await sponsorshipService.activateSponsoredListingForDays(listing.id, requestedDays);
      await refreshSponsorshipData();
      toast({
        title: language === 'fr'
          ? `Annonce activée en À la une pour ${requestedDays} jour(s).`
          : `Listing activated as featured for ${requestedDays} day(s).`,
      });
    } catch (error) {
      showSponsorshipToast(error, 'activate');
    } finally {
      setUpdating((prev) => ({ ...prev, [listing.id]: null }));
    }
  };

  const handleDeactivateFeatured = async (listing) => {
    try {
      setUpdating((prev) => ({ ...prev, [listing.id]: 'unfeaturing' }));
      const result = await sponsorshipService.deactivateSponsoredListing(listing.id);
      await refreshSponsorshipData();
      const refundedDays = Math.max(0, Number(result?.refunded_days || 0));
      toast({
        title: language === 'fr'
          ? `Mise à la une désactivée. ${refundedDays} jour(s) restitué(s).`
          : `Featured status removed. ${refundedDays} day(s) refunded.`,
      });
    } catch (error) {
      showSponsorshipToast(error, 'deactivate');
    } finally {
      setUpdating((prev) => ({ ...prev, [listing.id]: null }));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="py-8 lg:py-12 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mb-1">
                {t('my_listings')}
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground">
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
            <Card className="border border-primary/10 bg-card shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    {language === 'fr' ? 'Mes annonces' : 'My listings'}
                  </p>
                  <LayoutList className="w-4 h-4 text-primary" />
                </div>
                <p className="text-2xl font-bold text-foreground leading-none">
                  {myListings.length}
                  <span className="text-sm font-normal text-muted-foreground ml-1">/ {PRICING.free.freeListings} {language === 'fr' ? 'gratuites' : 'free'}</span>
                </p>
                {myListings.length >= PRICING.free.freeListings && (
                  <p className="text-xs text-[#FF6B4A] font-medium mt-1">
                    {language === 'fr' ? 'Limite atteinte — ' : 'Limit reached — '}
                    <button onClick={() => navigate('/Settings?tab=pricing')} className="underline hover:no-underline">
                      {language === 'fr' ? 'augmenter le quota' : 'upgrade quota'}
                    </button>
                  </p>
                )}
                <p className="text-xs text-muted-foreground mt-3">
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
                {availableFeaturedSlots <= 0 && (
                  <button
                    onClick={() => navigate('/Abonnement')}
                    className="text-xs font-semibold text-[#B5472F] underline hover:no-underline mt-2"
                  >
                    {language === 'fr' ? 'Acheter des jours' : 'Buy days'}
                  </button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Filters: search + status + sort */}
        {myListings.length > 0 && (
          <div className="mb-6 flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={language === 'fr' ? 'Rechercher par titre...' : 'Search by title...'}
                className="pl-10 bg-card"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-44 bg-card">
                <SelectValue placeholder={language === 'fr' ? 'Statut' : 'Status'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{language === 'fr' ? 'Tous' : 'All'}</SelectItem>
                <SelectItem value="active">{t('active')}</SelectItem>
                <SelectItem value="draft">{t('draft')}</SelectItem>
                <SelectItem value="sold">{t('sold')}</SelectItem>
                <SelectItem value="withdrawn">{language === 'fr' ? 'Archivée' : 'Withdrawn'}</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48 bg-card">
                <ArrowUpDown className="w-3.5 h-3.5 mr-1.5 text-muted-foreground" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="created_at_desc">{language === 'fr' ? 'Plus récent' : 'Newest'}</SelectItem>
                <SelectItem value="created_at_asc">{language === 'fr' ? 'Plus ancien' : 'Oldest'}</SelectItem>
                <SelectItem value="price_desc">{language === 'fr' ? 'Prix ↓' : 'Price ↓'}</SelectItem>
                <SelectItem value="price_asc">{language === 'fr' ? 'Prix ↑' : 'Price ↑'}</SelectItem>
                <SelectItem value="views_desc">{language === 'fr' ? 'Vues ↓' : 'Views ↓'}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Empty State */}
        {myListings.length === 0 ? (
          <Card className="border-0 shadow-sm">
            <CardContent className="py-16 text-center">
              <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
                <Building2 className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="font-heading text-lg font-semibold text-foreground mb-2">
                {language === 'fr' ? 'Aucune annonce' : 'No listings yet'}
              </h3>
              <p className="text-muted-foreground mb-6">
                {language === 'fr' ? 'Publiez votre première annonce' : 'Publish your first listing'}
              </p>
              <Button
                onClick={() => navigate(createPageUrl('CreateBusiness'))}
                className="bg-primary hover:bg-primary-hover text-primary-foreground"
              >
                <Plus className="w-4 h-4 mr-2" />
                {t('create_listing')}
              </Button>
            </CardContent>
          </Card>
        ) : filteredListings.length === 0 ? (
          /* Filtered empty state */
          <Card className="border-0 shadow-sm">
            <CardContent className="py-16 text-center">
              <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="font-heading text-lg font-semibold text-foreground mb-2">
                {language === 'fr' ? 'Aucun résultat' : 'No results'}
              </h3>
              <p className="text-muted-foreground mb-4">
                {language === 'fr'
                  ? 'Aucune annonce ne correspond à votre recherche ou filtre.'
                  : 'No listings match your current search or filter.'}
              </p>
              <Button
                variant="outline"
                onClick={() => { setSearchQuery(''); setStatusFilter('all'); setSortBy('created_at_desc'); }}
              >
                {language === 'fr' ? 'Réinitialiser les filtres' : 'Reset filters'}
              </Button>
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
                const isAcquisition = listing.type === 'acquisition';
                const completion = computeListingCompletionScore(
                  listing,
                  language,
                  isAcquisition ? 'buyer' : 'sale'
                );

                return (
                  <motion.div
                    key={listing.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    layout
                  >
                    <Card className="group overflow-hidden border border-border shadow-sm hover:shadow-md transition-all duration-300 rounded-xl">
                      <div className="flex flex-col lg:flex-row">
                        {/* Image */}
                        <div className="relative h-40 sm:h-44 lg:h-auto lg:w-56 shrink-0 overflow-hidden bg-gradient-to-br from-muted to-muted/50">
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

                        {/* Content + price */}
                        <CardContent className="p-3 sm:p-4 lg:p-4 flex-1">
                          <div className="flex flex-col h-full gap-3">
                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                              <div className="min-w-0">
                                <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground mb-2">
                                  <Badge className="bg-blue-50 text-blue-700 border-0 text-[10px]">
                                    {isAcquisition
                                      ? (language === 'fr' ? 'Acquisition' : 'Acquisition')
                                      : (language === 'fr' ? 'Cession' : 'Sale')}
                                  </Badge>
                                  {listing.business_type && (
                                    <Badge variant="secondary" className="bg-muted text-muted-foreground text-[10px]">
                                      {t(listing.business_type)}
                                    </Badge>
                                  )}
                                  {listing.reference_number && (
                                    <Badge variant="secondary" className="bg-foreground text-background font-mono text-[10px]">
                                      {listing.reference_number}
                                    </Badge>
                                  )}
                                </div>

                                <h3 className="font-semibold text-foreground text-xl leading-tight line-clamp-2 mb-1.5">
                                  {listing.title}
                                </h3>

                                <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                                  <MapPin className="w-4 h-4" />
                                  <span>{listing.location || (language === 'fr' ? 'Localisation non précisée' : 'Location not specified')}</span>
                                </p>
                              </div>

                              {/* Price section - adapted for acquisition vs cession */}
                              <div className="sm:text-right shrink-0">
                                {isAcquisition ? (
                                  <>
                                    <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
                                      {language === 'fr' ? 'Budget' : 'Budget'}
                                    </p>
                                    <p className="font-mono text-2xl font-bold text-primary leading-none">
                                      {listing.buyer_budget_min || listing.buyer_budget_max
                                        ? [
                                            listing.buyer_budget_min ? formatCurrency(listing.buyer_budget_min, language) : null,
                                            listing.buyer_budget_max ? formatCurrency(listing.buyer_budget_max, language) : null,
                                          ].filter(Boolean).join(' – ')
                                        : '—'}
                                    </p>
                                  </>
                                ) : (
                                  <>
                                    <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
                                      {language === 'fr' ? 'Prix' : 'Price'}
                                    </p>
                                    <p className="font-mono text-3xl font-bold text-primary leading-none">
                                      {listing.asking_price ? formatCurrency(listing.asking_price, language) : '—'}
                                    </p>
                                  </>
                                )}
                              </div>
                            </div>

                            {/* Metadata grid - adapted for acquisition vs cession */}
                            <div className="grid grid-cols-2 xl:grid-cols-4 gap-2 pt-3 border-t border-border">
                              {isAcquisition ? (
                                <>
                                  <div>
                                    <p className="text-xs text-muted-foreground mb-1">{language === 'fr' ? 'Secteurs' : 'Sectors'}</p>
                                    <p className="text-sm font-medium text-foreground leading-none truncate">
                                      {Array.isArray(listing.buyer_sectors_interested) && listing.buyer_sectors_interested.length > 0
                                        ? listing.buyer_sectors_interested.slice(0, 2).join(', ')
                                        : '—'}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-muted-foreground mb-1">{language === 'fr' ? 'Zones' : 'Locations'}</p>
                                    <p className="text-sm font-medium text-foreground leading-none truncate">
                                      {Array.isArray(listing.buyer_locations) && listing.buyer_locations.length > 0
                                        ? listing.buyer_locations.slice(0, 2).join(', ')
                                        : '—'}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-muted-foreground mb-1">{language === 'fr' ? 'Investissement' : 'Investment'}</p>
                                    <p className="font-mono text-lg font-semibold text-foreground leading-none">
                                      {listing.buyer_investment_available
                                        ? formatCurrency(listing.buyer_investment_available, language)
                                        : '—'}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-muted-foreground mb-1">{language === 'fr' ? 'Vues' : 'Views'}</p>
                                    <p className="font-mono text-lg font-semibold text-foreground leading-none inline-flex items-center gap-1">
                                      <Eye className="w-4 h-4" />
                                      {listing.views_count || 0}
                                    </p>
                                  </div>
                                </>
                              ) : (
                                <>
                                  <div>
                                    <p className="text-xs text-muted-foreground mb-1">{language === 'fr' ? 'CA annuel' : 'Annual revenue'}</p>
                                    <p className="font-mono text-lg font-semibold text-foreground leading-none">
                                      {listing.annual_revenue ? formatCurrency(listing.annual_revenue, language) : '—'}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-muted-foreground mb-1">{language === 'fr' ? 'Employés' : 'Employees'}</p>
                                    <p className="font-mono text-lg font-semibold text-foreground leading-none">
                                      {listing.employees ?? '—'}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-muted-foreground mb-1">{language === 'fr' ? 'Certif.' : 'Certified'}</p>
                                    <p className="text-lg font-semibold leading-none text-foreground">
                                      {listing.is_certified ? '✓' : '—'}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-muted-foreground mb-1">{language === 'fr' ? 'Vues' : 'Views'}</p>
                                    <p className="font-mono text-lg font-semibold text-foreground leading-none inline-flex items-center gap-1">
                                      <Eye className="w-4 h-4" />
                                      {listing.views_count || 0}
                                    </p>
                                  </div>
                                </>
                              )}
                            </div>

                            {/* Completion score */}
                            <div className="pt-3 border-t border-border">
                              <div className="flex items-center gap-3">
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between mb-1.5">
                                    <span className="text-xs font-medium text-muted-foreground">
                                      {language === 'fr' ? 'Complétion' : 'Completion'}
                                    </span>
                                    <span className={`text-xs font-semibold ${completion.tier.color}`}>
                                      {completion.score}% — {completion.tier.label}
                                    </span>
                                  </div>
                                  <Progress value={completion.score} className="h-1.5" />
                                </div>
                                {completion.score < 85 && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-7 text-xs shrink-0"
                                    onClick={() => navigate(createPageUrl(`CreateBusiness?edit=${listing.id}`))}
                                  >
                                    {language === 'fr' ? 'Compléter' : 'Complete'}
                                  </Button>
                                )}
                              </div>
                              {completion.suggestions.length > 0 && completion.score < 85 && (
                                <div className="mt-2 flex flex-wrap gap-1.5">
                                  {completion.suggestions.slice(0, 2).map((s) => (
                                    <span
                                      key={s.key}
                                      className="inline-flex items-center gap-1 text-[11px] text-muted-foreground bg-muted px-2 py-0.5 rounded-full"
                                    >
                                      <Lightbulb className="w-3 h-3 text-amber-500" />
                                      {s.text}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </div>

                      {/* Action bar */}
                      <div className="border-t border-border bg-muted/30 px-3 sm:px-4 lg:px-4 py-2.5">
                        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                          <div className="flex flex-wrap items-center gap-2">
                            <Button
                              size="sm"
                              variant={isFeatured ? 'secondary' : 'outline'}
                              className="h-8"
                              onClick={() => {
                                if (!isFeatured && availableFeaturedSlots <= 0) {
                                  toast({
                                    title: language === 'fr' ? 'Aucun jour sponsorisé disponible' : 'No sponsored days available',
                                    description: language === 'fr'
                                      ? 'Achetez des jours sponsorisés pour mettre votre annonce à la une.'
                                      : 'Purchase sponsored days to feature your listing.',
                                    action: (
                                      <Button size="sm" variant="outline" onClick={() => navigate('/Abonnement')}>
                                        {language === 'fr' ? 'Acheter' : 'Buy'}
                                      </Button>
                                    ),
                                  });
                                  return;
                                }
                                isFeatured ? handleDeactivateFeatured(listing) : handleActivateFeatured(listing);
                              }}
                              disabled={
                                updating[listing.id] ||
                                listing.status !== 'active'
                              }
                              title={
                                isFeatured
                                  ? (language === 'fr' ? 'Désactiver À la une' : 'Disable featured')
                                  : availableFeaturedSlots <= 0
                                    ? (language === 'fr' ? 'Acheter des jours sponsorisés' : 'Buy sponsored days')
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
                              onClick={() => setDeleteTarget(listing)}
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
                            onClick={() => window.open(createBusinessDetailsUrl(listing), '_blank')}
                            title={language === 'fr' ? 'Voir l\'annonce' : 'View listing'}
                          >
                            <ExternalLink className="w-4 h-4" />
                            {language === 'fr' ? 'Voir l\'annonce' : 'View listing'}
                          </Button>
                        </div>

                        {listing.status !== 'active' && (
                          <p className="text-[11px] text-muted-foreground leading-snug mt-2">
                            {language === 'fr'
                              ? 'Mettez l\'annonce en actif pour activer la mise à la une.'
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

      {/* Delete confirmation dialog */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {language === 'fr' ? 'Supprimer cette annonce ?' : 'Delete this listing?'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {language === 'fr'
                ? 'Cette action est irréversible. L\'annonce sera définitivement supprimée.'
                : 'This action cannot be undone. The listing will be permanently deleted.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              {language === 'fr' ? 'Annuler' : 'Cancel'}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
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
