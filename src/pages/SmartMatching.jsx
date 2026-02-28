import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BarChart3,
  Calendar,
  Heart,
  Lock,
  MapPin,
  Search,
  Send,
  ShoppingCart,
  SlidersHorizontal,
  Sparkles,
  Store,
  TrendingUp,
  Users,
  X,
  Zap,
  CheckCircle2,
  ExternalLink,
  ArrowUpDown,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Progress } from '@/components/ui/progress';
import ScoreRing from '@/components/smartmatching/ScoreRing';
import SmartMatchingFilterBar from '@/components/smartmatching/SmartMatchingFilterBar';
import SmartMatchingFilterChips from '@/components/smartmatching/SmartMatchingFilterChips';
import SmartMatchingFiltersMobile from '@/components/smartmatching/SmartMatchingFiltersMobile';
import { useLanguage } from '@/components/i18n/LanguageContext';
import { useAuth } from '@/lib/AuthContext';
import { supabase } from '@/api/supabaseClient';
import { billingService } from '@/services/billingService';
import { favoriteService } from '@/services/favoriteService';
import BusinessCard from '@/components/ui/BusinessCard';
import { toast } from '@/components/ui/use-toast';
import { createBusinessDetailsUrl, createPageUrl } from '@/utils';
import {
  SMART_MATCHING_SECTORS as SECTORS,
  SMART_MATCHING_LOCATIONS as LOCATIONS,
  DEFAULT_SMART_MATCHING_CRITERIA as DEFAULT_CRITERIA,
  SMART_MATCHING_MIN_SCORE,
  getScoreTone,
} from '@/constants/smartMatchingConfig';
import {
  scoreCriteriaVsListing,
  getListingBudget,
  normalize,
  toNumber,
  isRangeActive,
} from '@/services/smartMatchingScorer';

/* ── Preview data ──────────────────────────────────────────────── */

const SMART_MATCHING_PREVIEW_DATA = {
  buyer: [
    {
      titleFr: 'SaaS RH B2B en forte traction',
      titleEn: 'High-growth B2B HR SaaS',
      locationFr: 'Paris, France',
      locationEn: 'Paris, France',
      sectorFr: 'Technologie',
      sectorEn: 'Technology',
      matchBudget: 1850000,
      employees: 24,
      yearFounded: 2018,
      score: 92,
      confidence: 88,
      highlightsFr: ['Secteur compatible', 'Budget dans votre fourchette', 'Croissance du CA cohérente'],
      highlightsEn: ['Sector fit', 'Budget inside your range', 'Revenue growth aligned'],
    },
    {
      titleFr: 'Réseau de 3 boulangeries premium',
      titleEn: 'Premium network of 3 bakeries',
      locationFr: 'Lyon, France',
      locationEn: 'Lyon, France',
      sectorFr: 'Commerce',
      sectorEn: 'Retail',
      matchBudget: 980000,
      employees: 17,
      yearFounded: 2015,
      score: 86,
      confidence: 83,
      highlightsFr: ['Zone géographique cohérente', 'Effectifs alignés', 'Prix demandé attractif'],
      highlightsEn: ['Geographic fit', 'Team size aligned', 'Attractive asking price'],
    },
    {
      titleFr: 'Cabinet de services IT récurrents',
      titleEn: 'Recurring revenue IT services firm',
      locationFr: 'Nantes, France',
      locationEn: 'Nantes, France',
      sectorFr: 'Services',
      sectorEn: 'Services',
      matchBudget: 1320000,
      employees: 31,
      yearFounded: 2012,
      score: 81,
      confidence: 79,
      highlightsFr: ['EBITDA aligné', 'Maturité entreprise cohérente', 'Bon niveau de confiance'],
      highlightsEn: ['EBITDA aligned', 'Business maturity aligned', 'Strong confidence level'],
    },
    {
      titleFr: 'Clinique dentaire multi-praticiens',
      titleEn: 'Multi-practitioner dental clinic',
      locationFr: 'Bordeaux, France',
      locationEn: 'Bordeaux, France',
      sectorFr: 'Santé',
      sectorEn: 'Healthcare',
      matchBudget: 2150000,
      employees: 12,
      yearFounded: 2010,
      score: 77,
      confidence: 74,
      highlightsFr: ['Chiffre d\'affaires compatible', 'Zone recherchée active', 'Profil stable'],
      highlightsEn: ['Revenue compatible', 'Active target area', 'Stable profile'],
    },
  ],
  seller: [
    {
      titleFr: 'Holding familiale orientée croissance externe',
      titleEn: 'Family holding focused on external growth',
      locationFr: 'Île-de-France',
      locationEn: 'Île-de-France',
      sectorFr: 'Technologie & Services',
      sectorEn: 'Technology & Services',
      matchBudget: 3500000,
      employees: 42,
      yearFounded: 2009,
      score: 90,
      confidence: 86,
      highlightsFr: ['Capacité financière validée', 'Secteur compatible', 'Décision rapide (< 60 jours)'],
      highlightsEn: ['Validated financial capacity', 'Sector fit', 'Fast decision timeline (< 60 days)'],
    },
    {
      titleFr: 'Repreneur opérateur dans l\'industrie légère',
      titleEn: 'Operator-buyer in light industry',
      locationFr: 'Lille, France',
      locationEn: 'Lille, France',
      sectorFr: 'Industrie',
      sectorEn: 'Manufacturing',
      matchBudget: 2200000,
      employees: 18,
      yearFounded: 2016,
      score: 84,
      confidence: 80,
      highlightsFr: ['Expérience sectorielle forte', 'Budget proche de votre cible', 'Projet de reprise structuré'],
      highlightsEn: ['Strong sector expertise', 'Budget close to your target', 'Structured acquisition project'],
    },
    {
      titleFr: 'Investisseur PME à impact régional',
      titleEn: 'Regional SME impact investor',
      locationFr: 'Toulouse, France',
      locationEn: 'Toulouse, France',
      sectorFr: 'Services & Commerce',
      sectorEn: 'Services & Retail',
      matchBudget: 1500000,
      employees: 9,
      yearFounded: 2019,
      score: 79,
      confidence: 76,
      highlightsFr: ['Zone géographique cohérente', 'Intérêt pour transmissions progressives', 'Bonne qualité de données'],
      highlightsEn: ['Geographic fit', 'Interest in phased transition deals', 'Good data quality'],
    },
    {
      titleFr: 'Groupe stratégique en build-up',
      titleEn: 'Strategic group in build-up phase',
      locationFr: 'Marseille, France',
      locationEn: 'Marseille, France',
      sectorFr: 'Transport & Logistique',
      sectorEn: 'Transport & Logistics',
      matchBudget: 4800000,
      employees: 65,
      yearFounded: 2007,
      score: 75,
      confidence: 72,
      highlightsFr: ['Capacité d\'exécution élevée', 'Synergies opérationnelles probables', 'Mandat d\'acquisition actif'],
      highlightsEn: ['High execution capacity', 'Likely operating synergies', 'Active acquisition mandate'],
    },
  ],
};

/* ── Helpers ────────────────────────────────────────────────────── */

const formatMoneyCompact = (value, language) => {
  const amount = toNumber(value);
  if (!amount) return language === 'fr' ? 'Non renseigné' : 'Not provided';
  return new Intl.NumberFormat(language === 'fr' ? 'fr-FR' : 'en-GB', {
    style: 'currency',
    currency: 'EUR',
    notation: amount >= 1000000 ? 'compact' : 'standard',
    maximumFractionDigits: 0,
  }).format(amount);
};

/* ── Advanced filter inputs (shared between desktop Sheet & mobile) */

function AdvancedFilterFields({ language, criteria, onChangeCriteria }) {
  const field = (label, fieldMin, fieldMax, placeholderMin, placeholderMax, Icon) => (
    <div>
      <label className="block text-xs font-semibold text-foreground mb-1.5">{label}</label>
      <div className="grid grid-cols-2 gap-2">
        <div className="relative">
          {Icon && <Icon className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-muted-foreground" />}
          <input
            type="number"
            value={criteria[fieldMin]}
            onChange={(e) => onChangeCriteria(fieldMin, e.target.value)}
            placeholder={placeholderMin}
            className={`w-full h-9 px-3 bg-white border border-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary ${Icon ? 'pl-8' : ''}`}
          />
        </div>
        <div className="relative">
          {Icon && <Icon className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-muted-foreground" />}
          <input
            type="number"
            value={criteria[fieldMax]}
            onChange={(e) => onChangeCriteria(fieldMax, e.target.value)}
            placeholder={placeholderMax}
            className={`w-full h-9 px-3 bg-white border border-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary ${Icon ? 'pl-8' : ''}`}
          />
        </div>
      </div>
    </div>
  );

  return (
    <>
      {field(language === 'fr' ? 'Effectifs' : 'Employees', 'minEmployees', 'maxEmployees', '5', '500', Users)}
      {field(language === 'fr' ? 'Année de création' : 'Founded year', 'minYear', 'maxYear', '1990', new Date().getFullYear().toString(), Calendar)}
      {field(language === 'fr' ? "Chiffre d'affaires (€)" : 'Revenue (€)', 'minCA', 'maxCA', '100000', '5000000', BarChart3)}
      {field('EBITDA (€)', 'minEBITDA', 'maxEBITDA', '0', '1000000', TrendingUp)}
    </>
  );
}

/* ── Main Component ─────────────────────────────────────────────── */

export default function SmartMatching() {
  const { language } = useLanguage();
  const { user } = useAuth();

  const [allListings, setAllListings] = useState([]);
  const [matchedListings, setMatchedListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [accessStatus, setAccessStatus] = useState('loading');
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [sortBy, setSortBy] = useState('score');

  const [smartMatchingMode, setSmartMatchingMode] = useState(
    user?.user_metadata?.role === 'seller' ? 'seller' : 'buyer'
  );
  const userRole = user?.user_metadata?.role || 'buyer';
  const canSwitchMode = userRole === 'both';

  const [criteria, setCriteria] = useState(DEFAULT_CRITERIA);

  /* ── Labels ── */
  const labels = useMemo(
    () => ({
      title: language === 'fr' ? 'Smart Matching' : 'Smart Matching',
      subtitle:
        smartMatchingMode === 'buyer'
          ? language === 'fr'
            ? "Trouvez les meilleures entreprises à acquérir selon vos critères"
            : 'Find the best businesses to acquire based on your criteria'
          : language === 'fr'
            ? 'Trouvez les profils acquéreurs les plus alignés avec votre entreprise'
            : 'Find buyer profiles aligned with your business',
      searchButton: language === 'fr' ? 'Lancer la recherche' : 'Search',
      resetButton: language === 'fr' ? 'Réinitialiser' : 'Reset',
      noResults:
        language === 'fr'
          ? 'Aucun résultat ne correspond à vos critères actuels'
          : 'No match found for the current criteria',
      inactiveAccessTitle:
        language === 'fr' ? 'Smart Matching en mode découverte' : 'Smart Matching in discovery mode',
      inactiveAccessDescription:
        language === 'fr'
          ? 'Découvrez ci-dessous des exemples de matchs premium. Activez le service pour débloquer vos résultats personnalisés.'
          : 'See premium match examples below. Enable the service to unlock your personalized results.',
      activateCta: language === 'fr' ? 'Activer Smart Matching' : 'Enable Smart Matching',
      previewResultsTitle: language === 'fr' ? 'Exemples de résultats premium' : 'Premium result examples',
      previewResultsDescription:
        language === 'fr'
          ? 'Aperçu non contractuel pour illustrer la qualité des matchs.'
          : 'Non-contractual preview to showcase match quality.',
      previewCardBadge: language === 'fr' ? 'Aperçu' : 'Preview',
    }),
    [language, smartMatchingMode]
  );

  const isDiscoveryAccess = accessStatus === 'inactive' || accessStatus === 'unknown';

  /* ── Computed ── */
  const activeCriteriaCount = useMemo(() => {
    let count = 0;
    if (criteria.sectors.length > 0) count += 1;
    if (criteria.locations.length > 0) count += 1;
    if (criteria.buyerSectorsInterested?.length > 0) count += 1;
    if (criteria.buyerLocations?.length > 0) count += 1;
    if (criteria.buyerProfileType) count += 1;
    if (criteria.businessTypeSought) count += 1;
    if (criteria.sellerBusinessType) count += 1;
    if (isRangeActive(criteria.minPrice, criteria.maxPrice)) count += 1;
    if (isRangeActive(criteria.minEmployees, criteria.maxEmployees)) count += 1;
    if (isRangeActive(criteria.minYear, criteria.maxYear)) count += 1;
    if (isRangeActive(criteria.minCA, criteria.maxCA)) count += 1;
    if (isRangeActive(criteria.minEBITDA, criteria.maxEBITDA)) count += 1;
    return count;
  }, [criteria]);

  const advancedCriteriaCount = useMemo(() => {
    let count = 0;
    if (isRangeActive(criteria.minEmployees, criteria.maxEmployees)) count += 1;
    if (isRangeActive(criteria.minYear, criteria.maxYear)) count += 1;
    if (isRangeActive(criteria.minCA, criteria.maxCA)) count += 1;
    if (isRangeActive(criteria.minEBITDA, criteria.maxEBITDA)) count += 1;
    return count;
  }, [criteria]);

  const previewMockListings = useMemo(
    () =>
      (SMART_MATCHING_PREVIEW_DATA[smartMatchingMode] || []).map((item, index) => ({
        id: `preview-${smartMatchingMode}-${index + 1}`,
        type: smartMatchingMode === 'buyer' ? 'cession' : 'acquisition',
        title: language === 'fr' ? item.titleFr : item.titleEn,
        description: (language === 'fr' ? item.highlightsFr : item.highlightsEn).join(' • '),
        location: language === 'fr' ? item.locationFr : item.locationEn,
        sector: language === 'fr' ? item.sectorFr : item.sectorEn,
        matchBudget: item.matchBudget,
        asking_price: smartMatchingMode === 'buyer' ? item.matchBudget : null,
        annual_revenue: smartMatchingMode === 'buyer' ? Math.round(item.matchBudget * 0.75) : null,
        buyer_budget_min: smartMatchingMode === 'seller' ? Math.round(item.matchBudget * 0.8) : null,
        buyer_budget_max: smartMatchingMode === 'seller' ? item.matchBudget : null,
        buyer_investment_available: smartMatchingMode === 'seller' ? item.matchBudget : null,
        buyer_sectors_interested: smartMatchingMode === 'seller' ? [normalize(item.sectorEn)] : [],
        financial_years: [],
        views_count: 120 + index * 17,
        reference_number: `SM-${smartMatchingMode.toUpperCase()}-${index + 1}`,
        hide_location: false,
        is_certified: true,
        images: [],
        employees: item.employees,
        year_founded: item.yearFounded,
        smartMatchScore: item.score,
        smartMatchMeta: {
          confidence: item.confidence,
          highlights: language === 'fr' ? item.highlightsFr : item.highlightsEn,
        },
        isMock: true,
      })),
    [language, smartMatchingMode]
  );

  const displayedListings = isDiscoveryAccess ? previewMockListings : matchedListings;

  const sortedListings = useMemo(() => {
    const list = [...displayedListings];
    if (sortBy === 'score') list.sort((a, b) => (b.smartMatchScore || 0) - (a.smartMatchScore || 0));
    else if (sortBy === 'budget') list.sort((a, b) => (b.matchBudget || 0) - (a.matchBudget || 0));
    else if (sortBy === 'date') list.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
    return list;
  }, [displayedListings, sortBy]);

  const averageScore = useMemo(() => {
    if (displayedListings.length === 0) return 0;
    return Math.round(
      displayedListings.reduce((sum, item) => sum + (item.smartMatchScore || 0), 0) / displayedListings.length
    );
  }, [displayedListings]);

  const highestScore = useMemo(
    () => (displayedListings.length ? Math.max(...displayedListings.map((x) => x.smartMatchScore || 0)) : 0),
    [displayedListings]
  );

  /* ── Storage key ── */
  const getStorageKey = useCallback(
    (mode) => `smartMatchingCriteria:${user?.id || 'guest'}:${mode}`,
    [user?.id]
  );

  /* ── Effects ── */
  useEffect(() => {
    if (canSwitchMode) return;
    setSmartMatchingMode(userRole === 'seller' ? 'seller' : 'buyer');
  }, [userRole, canSwitchMode]);

  useEffect(() => {
    const loadListings = async () => {
      try {
        setLoading(true);
        setError(null);

        const [
          { data: listings, error: dbError },
          accessPayload,
        ] = await Promise.all([
          supabase
            .from('businesses')
            .select('id, type, title, sector, location, region, country, asking_price, annual_revenue, ebitda, employees, year_founded, buyer_budget_min, buyer_budget_max, buyer_investment_available, buyer_sectors_interested, buyer_locations, buyer_profile_type, business_type_sought, seller_business_type, business_type, seller_id, created_at, reference_number, views_count, hide_location, images')
            .eq('status', 'active'),
          billingService
            .getMyActiveServices(10)
            .then((data) => ({ data, error: null }))
            .catch((serviceError) => ({ data: null, error: serviceError })),
        ]);

        if (dbError) throw dbError;
        setAllListings(listings || []);

        if (accessPayload.error) {
          setAccessStatus('unknown');
        } else {
          const billingRuntimeUnavailable =
            typeof window !== 'undefined' &&
            window.localStorage?.getItem('riviqo_billing_runtime_unavailable') === '1';

          if (billingRuntimeUnavailable) {
            setAccessStatus('unknown');
          } else {
            const activeFeatureCodes = new Set(
              (accessPayload.data?.entitlements || [])
                .filter((item) => item?.entitlement_type === 'feature' && item?.status === 'active')
                .map((item) => item.product_code)
            );
            setAccessStatus(activeFeatureCodes.has('smart_matching') ? 'active' : 'inactive');
          }
        }

        if (user?.user_metadata?.role && user?.user_metadata?.role !== 'both') {
          setSmartMatchingMode(user.user_metadata.role === 'seller' ? 'seller' : 'buyer');
        }

        setCriteria((prev) => {
          const next = { ...prev };
          if (!next.sectors.length && user?.user_metadata?.sector) {
            next.sectors = [normalize(user.user_metadata.sector)];
          }
          if (!next.locations.length && user?.user_metadata?.location) {
            next.locations = [normalize(user.user_metadata.location)];
          }
          return next;
        });
      } catch (err) {
        console.error('Error loading listings:', err);
        setError(err?.message);
        setAccessStatus('unknown');
      } finally {
        setLoading(false);
      }
    };

    if (user) loadListings();
  }, [user]);

  useEffect(() => {
    const loadFavorites = async () => {
      if (!user?.id) { setFavoriteIds([]); return; }
      try {
        const favorites = await favoriteService.listFavorites();
        setFavoriteIds((favorites || []).map((fav) => fav.business_id).filter(Boolean));
      } catch { setFavoriteIds([]); }
    };
    loadFavorites();
  }, [user?.id]);

  useEffect(() => {
    const saved = localStorage.getItem(getStorageKey(smartMatchingMode));
    if (!saved) return;
    try {
      const parsed = JSON.parse(saved);
      setCriteria({ ...DEFAULT_CRITERIA, ...parsed });
    } catch { setCriteria(DEFAULT_CRITERIA); }
    setMatchedListings([]);
    setHasSearched(false);
  }, [smartMatchingMode, getStorageKey]);

  /* ── Actions ── */
  const getMatchAnalysis = useCallback(
    (listing) => scoreCriteriaVsListing({ criteria, listing, mode: smartMatchingMode, language, activeCriteriaCount }),
    [activeCriteriaCount, criteria, language, smartMatchingMode]
  );

  const searchMatches = useCallback(
    ({ notifyIfLimited = false } = {}) => {
      setSearching(true);
      const targetType = smartMatchingMode === 'buyer' ? 'cession' : 'acquisition';

      let results = (allListings || [])
        .filter((listing) => listing.type === targetType)
        .filter((listing) => listing.seller_id !== user?.id)
        .map((listing) => {
          const analysis = getMatchAnalysis(listing);
          return {
            ...listing,
            smartMatchScore: analysis.score,
            smartMatchMeta: analysis,
            matchBudget: getListingBudget(listing, smartMatchingMode),
          };
        })
        .filter((listing) => listing.smartMatchScore >= SMART_MATCHING_MIN_SCORE);

      results.sort((a, b) => {
        const byScore = (b.smartMatchScore || 0) - (a.smartMatchScore || 0);
        if (byScore !== 0) return byScore;
        const byBudget = (b.matchBudget || 0) - (a.matchBudget || 0);
        if (byBudget !== 0) return byBudget;
        return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
      });

      if (accessStatus === 'inactive') {
        results = results.slice(0, 5);
        if (notifyIfLimited) {
          toast({
            title: language === 'fr' ? 'Mode découverte actif' : 'Preview mode enabled',
            description: language === 'fr'
              ? 'Seuls les 5 meilleurs résultats sont visibles. Activez Smart Matching pour tout débloquer.'
              : 'Only top 5 results are visible. Enable Smart Matching to unlock all matches.',
          });
        }
      }

      setMatchedListings(results);
      setHasSearched(true);
      setSearching(false);
    },
    [accessStatus, allListings, getMatchAnalysis, language, smartMatchingMode, user?.id]
  );

  const saveCriteria = () => {
    localStorage.setItem(getStorageKey(smartMatchingMode), JSON.stringify(criteria));
    toast({
      title: language === 'fr' ? 'Critères sauvegardés' : 'Criteria saved',
      description: language === 'fr'
        ? 'Vos préférences Smart Matching ont été enregistrées.'
        : 'Your Smart Matching preferences have been saved.',
    });
    searchMatches({ notifyIfLimited: true });
  };

  const handleChange = (field, value) => setCriteria((prev) => ({ ...prev, [field]: value }));

  const resetCriteria = () => {
    setCriteria(DEFAULT_CRITERIA);
    setMatchedListings([]);
    setHasSearched(false);
  };

  const toggleSector = (sectorValue) => {
    setCriteria((prev) => ({
      ...prev,
      sectors: prev.sectors.includes(sectorValue)
        ? prev.sectors.filter((s) => s !== sectorValue)
        : [...prev.sectors, sectorValue],
    }));
  };

  const toggleLocation = (locationValue) => {
    setCriteria((prev) => ({
      ...prev,
      locations: prev.locations.includes(locationValue)
        ? prev.locations.filter((l) => l !== locationValue)
        : [...prev.locations, locationValue],
    }));
  };

  const handleModeSwitch = (mode) => {
    setSmartMatchingMode(mode);
    setMatchedListings([]);
    setHasSearched(false);
  };

  const handleToggleFavorite = async (listingId) => {
    if (!user?.id) { window.location.href = '/login'; return; }
    try {
      await favoriteService.toggleFavorite(listingId);
      setFavoriteIds((prev) =>
        prev.includes(listingId) ? prev.filter((id) => id !== listingId) : [...prev, listingId]
      );
      toast({
        title: language === 'fr' ? 'Favoris mis à jour' : 'Favorites updated',
        description: language === 'fr'
          ? 'Votre sélection a été enregistrée.'
          : 'Your selection has been saved.',
      });
    } catch {
      toast({
        title: language === 'fr' ? 'Action impossible' : 'Action unavailable',
        description: language === 'fr'
          ? 'Impossible de mettre à jour les favoris.'
          : 'Unable to update favorites.',
      });
    }
  };

  const isPreviewMode = isDiscoveryAccess;

  /* ── RENDER ───────────────────────────────────────────────────── */
  return (
    <div className="bg-background">
      {/* ═══════ HEADER ═══════ */}
      <div className="bg-white/95 border-b border-border sticky top-0 z-30 backdrop-blur">
        <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between gap-3">
            {/* Left: logo + title */}
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm ring-2 ring-primary/10" style={{ background: 'var(--gradient-coral)' }}>
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="min-w-0">
                <h1 className="text-lg md:text-xl font-heading font-bold text-foreground truncate">{labels.title}</h1>
                <p className="hidden md:block text-xs text-muted-foreground truncate">{labels.subtitle}</p>
              </div>
            </div>

            {/* Center/Right: mode switcher */}
            {canSwitchMode && (
              <div className="flex items-center bg-muted rounded-xl border border-border p-1 gap-1">
                <button
                  type="button"
                  onClick={() => handleModeSwitch('buyer')}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                    smartMatchingMode === 'buyer'
                      ? 'bg-white text-primary shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <ShoppingCart className="w-4 h-4" />
                  {language === 'fr' ? 'Acquérir' : 'Acquire'}
                </button>
                <button
                  type="button"
                  onClick={() => handleModeSwitch('seller')}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                    smartMatchingMode === 'seller'
                      ? 'bg-white text-primary shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Store className="w-4 h-4" />
                  {language === 'fr' ? 'Céder' : 'Sell'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ═══════ FILTER BAR (desktop) ═══════ */}
      <SmartMatchingFilterBar
        language={language}
        criteria={criteria}
        onChangeCriteria={handleChange}
        onToggleSector={toggleSector}
        onToggleLocation={toggleLocation}
        onSave={saveCriteria}
        onReset={resetCriteria}
        saving={searching}
        smartMatchingMode={smartMatchingMode}
        advancedCount={advancedCriteriaCount}
      >
        <AdvancedFilterFields language={language} criteria={criteria} onChangeCriteria={handleChange} />
      </SmartMatchingFilterBar>

      {/* ═══════ FILTER CHIPS ═══════ */}
      <SmartMatchingFilterChips
        language={language}
        criteria={criteria}
        onToggleSector={toggleSector}
        onToggleLocation={toggleLocation}
        onChangeCriteria={handleChange}
      />

      {/* ═══════ MAIN CONTENT ═══════ */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8 py-4 space-y-4">
        {/* Access banner */}
        {(accessStatus === 'inactive' || accessStatus === 'unknown') && (
          <div className="rounded-xl border border-primary/30 bg-primary-light p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-primary inline-flex items-center gap-2">
                <Lock className="w-4 h-4" />
                {accessStatus === 'inactive'
                  ? labels.inactiveAccessTitle
                  : language === 'fr' ? 'Accès Smart Matching non vérifié' : 'Smart Matching access not verified'}
              </p>
              <p className="text-sm text-foreground mt-0.5">
                {accessStatus === 'inactive'
                  ? labels.inactiveAccessDescription
                  : language === 'fr'
                    ? 'Vous pouvez continuer à utiliser la recherche, mais l\'activation vous garantit toutes les fonctionnalités premium.'
                    : 'You can keep using search, but activation guarantees full premium features.'}
              </p>
            </div>
            <Link
              to={createPageUrl('Abonnement')}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary hover:bg-primary-hover text-white px-4 py-2 font-semibold text-sm whitespace-nowrap"
            >
              {labels.activateCta}
            </Link>
          </div>
        )}

        {/* ═══════ INLINE STATS + SORT ═══════ */}
        {displayedListings.length > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
            <div className="flex items-center gap-3 text-muted-foreground">
              <span>
                <span className="font-mono font-bold text-foreground">{displayedListings.length}</span>
                {' '}{language === 'fr' ? 'résultat(s)' : 'result(s)'}
              </span>
              <span className="hidden sm:inline text-border">|</span>
              <span className="hidden sm:inline">
                {language === 'fr' ? 'Score moyen' : 'Avg score'}{' '}
                <span className="font-mono font-bold text-foreground">{averageScore}%</span>
              </span>
              <span className="hidden sm:inline text-border">|</span>
              <span className="hidden sm:inline">
                {language === 'fr' ? 'Meilleur' : 'Top'}{' '}
                <span className="font-mono font-bold text-foreground">{highestScore}%</span>
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <ArrowUpDown className="w-3.5 h-3.5 text-muted-foreground" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-sm bg-transparent border-none text-foreground font-medium cursor-pointer focus:outline-none"
              >
                <option value="score">{language === 'fr' ? 'Score' : 'Score'}</option>
                <option value="budget">{language === 'fr' ? 'Budget' : 'Budget'}</option>
                <option value="date">{language === 'fr' ? 'Date' : 'Date'}</option>
              </select>
            </div>
          </div>
        )}

        {/* Preview banner */}
        {isPreviewMode && displayedListings.length > 0 && (
          <div className="rounded-xl border border-primary/30 bg-primary-light px-3 py-2.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <p className="text-xs font-semibold text-primary">{labels.previewResultsTitle}</p>
              <p className="text-xs text-primary-hover">{labels.previewResultsDescription}</p>
            </div>
            <Link
              to={createPageUrl('Abonnement')}
              className="inline-flex items-center justify-center px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-semibold hover:bg-primary-hover"
            >
              {labels.activateCta}
            </Link>
          </div>
        )}

        {/* ═══════ LOADING ═══════ */}
        {(loading || searching) && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div key={item} className="h-48 rounded-xl border border-border bg-white animate-pulse" />
            ))}
          </div>
        )}

        {/* ═══════ ERROR ═══════ */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">{error}</div>
        )}

        {/* ═══════ EMPTY: no results after search ═══════ */}
        {!loading && !searching && !error && hasSearched && matchedListings.length === 0 && !isDiscoveryAccess && (
          <div className="text-center py-16 bg-white border border-border rounded-xl">
            <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <Search className="w-7 h-7 text-muted-foreground" />
            </div>
            <p className="text-foreground font-semibold">{labels.noResults}</p>
            <p className="text-muted-foreground text-sm mt-1.5 max-w-md mx-auto">
              {language === 'fr'
                ? 'Essayez d\'élargir votre budget, vos zones géographiques ou vos secteurs d\'activité.'
                : 'Try widening your budget, locations, or sectors.'}
            </p>
            <button
              type="button"
              onClick={resetCriteria}
              className="mt-4 px-4 py-2 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-muted transition-colors"
            >
              {labels.resetButton}
            </button>
          </div>
        )}

        {/* ═══════ EMPTY: before first search ═══════ */}
        {!loading && !searching && !error && !hasSearched && !isDiscoveryAccess && (
          <div className="text-center py-16 bg-white border border-border rounded-xl">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Zap className="w-7 h-7 text-primary" />
            </div>
            <p className="text-foreground font-semibold text-lg">
              {language === 'fr' ? 'Trouvez votre match idéal' : 'Find your ideal match'}
            </p>
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center">1</span>
                {language === 'fr' ? 'Sélectionnez vos critères' : 'Select your criteria'}
              </div>
              <div className="hidden sm:block w-8 h-px bg-border" />
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center">2</span>
                {language === 'fr' ? 'Lancez la recherche' : 'Start the search'}
              </div>
              <div className="hidden sm:block w-8 h-px bg-border" />
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center">3</span>
                {language === 'fr' ? 'Découvrez vos matchs' : 'Discover your matches'}
              </div>
            </div>
            <button
              type="button"
              onClick={() => setMobileFiltersOpen(true)}
              className="mt-6 md:hidden inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-semibold text-sm"
              style={{ background: 'var(--gradient-coral)' }}
            >
              <SlidersHorizontal className="w-4 h-4" />
              {language === 'fr' ? 'Configurer les filtres' : 'Set up filters'}
            </button>
          </div>
        )}

        {/* ═══════ RESULTS: preview mode ═══════ */}
        {!loading && !searching && isPreviewMode && displayedListings.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {displayedListings.map((listing) => (
              <BusinessCard
                key={listing.id}
                business={listing}
                isFavorite={false}
                onToggleFavorite={() => {}}
                fetchSellerLogo={false}
                detailsUrl={createPageUrl('Abonnement')}
                hideMessageButton
                hideFavoriteButton
              />
            ))}
          </div>
        )}

        {/* ═══════ RESULTS: real matches ═══════ */}
        {!loading && !searching && !isPreviewMode && sortedListings.length > 0 && (
          <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence mode="popLayout">
              {sortedListings.map((listing, index) => {
                const tone = getScoreTone(listing.smartMatchScore || 0);
                const detailsUrl = listing.isMock
                  ? createPageUrl('Abonnement')
                  : createBusinessDetailsUrl(listing);
                const highlights = listing.smartMatchMeta?.highlights?.slice(0, 3) || [];
                const isFavorite = favoriteIds.includes(listing.id);
                const confidence = listing.smartMatchMeta?.confidence || 0;

                return (
                  <motion.article
                    key={listing.id}
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.25, delay: index * 0.04 }}
                    whileHover={{ y: -3 }}
                    className={`rounded-xl border p-4 shadow-sm transition-shadow hover:shadow-hover ${tone.card}`}
                  >
                    {/* Header: title + score ring */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        {listing.isMock && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-primary/10 border border-primary/30 text-[10px] font-bold uppercase tracking-wide text-primary mb-1">
                            {labels.previewCardBadge}
                          </span>
                        )}
                        <h3 className="text-sm md:text-base font-heading font-bold text-foreground line-clamp-2">
                          {listing.title || listing.company || (language === 'fr' ? 'Annonce sans titre' : 'Untitled listing')}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-0.5 inline-flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {listing.location || listing.region || listing.country || (language === 'fr' ? 'Non précisé' : 'N/A')}
                        </p>
                      </div>
                      <ScoreRing score={listing.smartMatchScore || 0} size={48} />
                    </div>

                    {/* Tags */}
                    <div className="mt-2.5 flex flex-wrap gap-1">
                      {listing.sector && (
                        <span className="px-2 py-0.5 rounded-full bg-muted border border-border text-xs text-foreground">
                          {listing.sector}
                        </span>
                      )}
                      {listing.matchBudget && (
                        <span className="px-2 py-0.5 rounded-full bg-muted border border-border text-xs font-numbers font-semibold text-primary">
                          {formatMoneyCompact(listing.matchBudget, language)}
                        </span>
                      )}
                      {listing.employees ? (
                        <span className="px-2 py-0.5 rounded-full bg-muted border border-border text-xs text-foreground inline-flex items-center gap-0.5">
                          <Users className="w-3 h-3" /> {listing.employees}
                        </span>
                      ) : null}
                    </div>

                    {/* Highlights */}
                    <div className="mt-2.5 space-y-1">
                      {highlights.length > 0 ? (
                        highlights.map((highlight, idx) => (
                          <div key={`${listing.id}-${idx}`} className="flex items-start gap-1.5">
                            <CheckCircle2 className={`w-3.5 h-3.5 mt-0.5 flex-shrink-0 ${tone.accent}`} />
                            <p className={`text-xs font-medium ${tone.accent}`}>{highlight}</p>
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-muted-foreground">
                          {language === 'fr'
                            ? 'Ajoutez plus de critères pour des explications détaillées.'
                            : 'Add more criteria for detailed explanations.'}
                        </p>
                      )}
                    </div>

                    {/* Confidence bar */}
                    <div className="mt-2.5 space-y-0.5">
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{language === 'fr' ? 'Confiance' : 'Confidence'}</span>
                        <span className="font-mono">{confidence}%</span>
                      </div>
                      <Progress value={confidence} className="h-1" />
                    </div>

                    {/* CTA */}
                    <div className="mt-3 flex items-center gap-2">
                      <Link
                        to={detailsUrl}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 h-9 rounded-lg text-white font-semibold text-sm hover:shadow-hover transition-all"
                        style={{ background: 'var(--gradient-coral)' }}
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        {language === 'fr' ? 'Voir' : 'View'}
                      </Link>
                      {!listing.isMock && (
                        <button
                          type="button"
                          onClick={() => handleToggleFavorite(listing.id)}
                          className={`h-9 w-9 flex items-center justify-center rounded-lg border transition-all ${
                            isFavorite
                              ? 'bg-rose-500 text-white border-rose-500'
                              : 'bg-white text-muted-foreground border-border hover:border-rose-400 hover:text-rose-500'
                          }`}
                          aria-label={language === 'fr' ? 'Favoris' : 'Favorite'}
                        >
                          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
                        </button>
                      )}
                    </div>
                  </motion.article>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* ═══════ MOBILE: floating filter button ═══════ */}
      <button
        type="button"
        onClick={() => setMobileFiltersOpen(true)}
        className="md:hidden fixed bottom-6 left-4 right-4 z-40 h-12 text-white font-semibold rounded-xl shadow-lg flex items-center justify-center gap-2 text-sm"
        style={{ background: 'var(--gradient-coral)' }}
      >
        <SlidersHorizontal className="w-4 h-4" />
        {language === 'fr' ? 'Filtres' : 'Filters'}
        {activeCriteriaCount > 0 && (
          <span className="ml-1 px-1.5 py-0.5 bg-white/20 rounded-full text-xs">{activeCriteriaCount}</span>
        )}
      </button>

      {/* ═══════ MOBILE: filter sheet ═══════ */}
      <SmartMatchingFiltersMobile
        open={mobileFiltersOpen}
        onOpenChange={setMobileFiltersOpen}
        language={language}
        criteria={criteria}
        onChangeCriteria={handleChange}
        onToggleSector={toggleSector}
        onToggleLocation={toggleLocation}
        onSave={saveCriteria}
        onReset={resetCriteria}
        saving={searching}
        smartMatchingMode={smartMatchingMode}
      />
    </div>
  );
}
